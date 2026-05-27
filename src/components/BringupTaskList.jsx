import React, { useState, useMemo } from 'react';

/**
 * BringupTaskList — sortable / filterable task table for a product / version.
 *
 * Despite the historical name, this renders verification AND next-version
 * tasks across all four product domains. Expects a `tasks` prop matching:
 *   docs.scadys.io/<product>-<version>/tasks.json
 *
 * Per-task schema:
 *   id              — unique slug (string)
 *   category        — "hardware" | "firmware" | "housing" | "compliance"
 *   kind            — "verification" | "next-version"
 *   target_version  — version this task is targeting (e.g. "v1.2" / "v2.10")
 *   circuit         — slug of the originating sub-circuit / module (string)
 *   circuit_label   — display label for the sub-circuit / module (string)
 *   title           — short task name (string)
 *   description     — full description / pass-fail criteria / rework rationale (string)
 *   status          — "todo" | "in_progress" | "done" | "blocked" | "deferred" | "not_applicable"
 *   date_completed  — ISO date string when done, null otherwise
 *   result          — free-text result line, null otherwise
 *   notes           — free-text observations, null otherwise
 *   evidence        — array of URL/path strings (may be empty)
 *   dependencies    — array of task IDs that must complete first
 *   assignee        — free-text operator / team name, null otherwise
 */

const STATUS_META = {
  todo:           { label: 'To do',          bg: '#94a3b8', fg: '#fff', help: 'To do — task not yet attempted.' },
  in_progress:    { label: 'In progress',    bg: '#f59e0b', fg: '#000', help: 'In progress — task is being worked on now.' },
  done:           { label: 'Done',           bg: '#16a34a', fg: '#fff', help: 'Done — task is complete; result and (typically) date are recorded.' },
  blocked:        { label: 'Blocked',        bg: '#dc2626', fg: '#fff', help: "Blocked — task can't proceed (waiting on parts, equipment, or upstream dependency)." },
  deferred:       { label: 'Deferred',       bg: '#6b7280', fg: '#fff', help: 'Deferred — task is intentionally postponed to a later campaign or version.' },
  not_applicable: { label: 'N/A',            bg: '#cbd5e1', fg: '#000', help: 'Not applicable — task is no longer relevant (e.g. superseded by a design change).' },
};

const STATUS_ORDER = ['todo', 'in_progress', 'blocked', 'done', 'deferred', 'not_applicable'];

const CATEGORY_META = {
  hardware:   { label: 'Hardware',   bg: '#0ea5e9', help: 'Hardware — task against the assembled PCB (most of the current list).' },
  firmware:   { label: 'Firmware',   bg: '#8b5cf6', help: 'Firmware — integration / regression test that needs the hardware running.' },
  housing:    { label: 'Housing',    bg: '#f97316', help: 'Housing — IP-rating, mechanical fit, drop, vibration, or environmental test.' },
  compliance: { label: 'Compliance', bg: '#14b8a6', help: 'Compliance — CISPR 32, FCC Part 15, RED 2014/53/EU, NMEA 2000 conformance, etc.' },
};

const CATEGORY_ORDER = ['hardware', 'firmware', 'housing', 'compliance'];

const KIND_META = {
  verification:    { label: 'Verification', short: 'verify', bg: '#0284c7', help: 'Verification — bring-up test against the current hardware revision.' },
  'next-version':  { label: 'Next version', short: 'next',   bg: '#7c3aed', help: 'Next version — design / rework item targeted at a future hardware revision.' },
};

const KIND_ORDER = ['verification', 'next-version'];

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.todo;
  return (
    <span
      title={meta.help}
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '12px',
        background: meta.bg,
        color: meta.fg,
        fontSize: '0.80em',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        cursor: 'help',
      }}
    >
      {meta.label}
    </span>
  );
}

function CategoryBadge({ category }) {
  const meta = CATEGORY_META[category] || { label: category, bg: '#64748b', help: category };
  return (
    <span
      title={meta.help}
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '4px',
        background: meta.bg,
        color: '#fff',
        fontSize: '0.75em',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
        cursor: 'help',
      }}
    >
      {meta.label}
    </span>
  );
}

function KindBadge({ kind, targetVersion }) {
  const meta = KIND_META[kind] || { label: kind || 'verification', bg: '#64748b', help: kind };
  const tooltip = targetVersion ? `${meta.help} Target version: ${targetVersion}.` : meta.help;
  return (
    <span
      title={tooltip}
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '4px',
        background: meta.bg,
        color: '#fff',
        fontSize: '0.75em',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        cursor: 'help',
      }}
    >
      {meta.label}
      {targetVersion ? ` ${targetVersion}` : ''}
    </span>
  );
}

function DepBadge({ count, allDone }) {
  if (!count) return null;
  return (
    <span
      title={allDone ? `${count} dependency / dependencies, all done` : `${count} dependency / dependencies, not all done — task may be blocked`}
      style={{
        display: 'inline-block',
        marginLeft: '6px',
        padding: '1px 6px',
        borderRadius: '8px',
        background: allDone ? '#16a34a' : '#dc2626',
        color: '#fff',
        fontSize: '0.70em',
        fontWeight: 700,
      }}
    >
      ⛓ {count}
    </span>
  );
}

function SummaryStats({ tasks }) {
  const counts = useMemo(() => {
    const c = { total: tasks.length };
    for (const t of tasks) c[t.status] = (c[t.status] || 0) + 1;
    return c;
  }, [tasks]);

  const categoryCounts = useMemo(() => {
    const c = {};
    for (const t of tasks) c[t.category || 'hardware'] = (c[t.category || 'hardware'] || 0) + 1;
    return c;
  }, [tasks]);

  const kindCounts = useMemo(() => {
    const c = {};
    for (const t of tasks) c[t.kind || 'verification'] = (c[t.kind || 'verification'] || 0) + 1;
    return c;
  }, [tasks]);

  const cell = (label, value, bg, fg = '#fff') => (
    <div
      style={{
        flex: '1 1 110px',
        background: bg,
        color: fg,
        padding: '8px 12px',
        borderRadius: '6px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '1.4em', fontWeight: 700, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.85em', opacity: 0.9 }}>{label}</div>
    </div>
  );

  return (
    <div style={{ margin: '16px 0' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
        {cell('Total',       counts.total || 0, '#1e293b')}
        {cell('Done',        counts.done || 0, STATUS_META.done.bg)}
        {cell('In progress', counts.in_progress || 0, STATUS_META.in_progress.bg, '#000')}
        {cell('To do',       counts.todo || 0, STATUS_META.todo.bg)}
        {cell('Blocked',     counts.blocked || 0, STATUS_META.blocked.bg)}
        {cell('Deferred',    counts.deferred || 0, STATUS_META.deferred.bg)}
      </div>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', fontSize: '0.85em' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ opacity: 0.7 }}>By kind:</span>
          {KIND_ORDER.map(k =>
            kindCounts[k] ? (
              <span key={k}>
                <KindBadge kind={k} /> <strong>{kindCounts[k]}</strong>
              </span>
            ) : null
          )}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ opacity: 0.7 }}>By category:</span>
          {CATEGORY_ORDER.map(cat =>
            categoryCounts[cat] ? (
              <span key={cat}>
                <CategoryBadge category={cat} /> <strong>{categoryCounts[cat]}</strong>
              </span>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

function FilterBar({ statusFilter, setStatusFilter, kindFilter, setKindFilter, categoryFilter, setCategoryFilter, circuitFilter, setCircuitFilter, circuits, availableCategories, availableKinds }) {
  const statusFilters = [
    { value: 'all', label: 'All' },
    { value: 'todo', label: 'To do' },
    { value: 'in_progress', label: 'In progress' },
    { value: 'done', label: 'Done' },
    { value: 'blocked', label: 'Blocked' },
    { value: 'open', label: 'Open (not done)' },
  ];

  const dropdownStyle = {
    padding: '4px 8px',
    border: '1px solid var(--ifm-color-emphasis-300)',
    borderRadius: '4px',
    background: 'transparent',
    color: 'inherit',
    fontSize: '0.85em',
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '12px 0', alignItems: 'center' }}>
      <span style={{ fontSize: '0.9em', opacity: 0.8 }}>Status:</span>
      {statusFilters.map(f => (
        <button
          key={f.value}
          onClick={() => setStatusFilter(f.value)}
          style={{
            padding: '4px 10px',
            border: '1px solid var(--ifm-color-emphasis-300)',
            borderRadius: '4px',
            background: statusFilter === f.value ? 'var(--ifm-color-primary)' : 'transparent',
            color: statusFilter === f.value ? '#fff' : 'inherit',
            cursor: 'pointer',
            fontSize: '0.85em',
          }}
        >
          {f.label}
        </button>
      ))}
      <span style={{ fontSize: '0.9em', opacity: 0.8, marginLeft: '12px' }}>Kind:</span>
      <select value={kindFilter} onChange={e => setKindFilter(e.target.value)} style={dropdownStyle}>
        <option value="all">All kinds</option>
        {KIND_ORDER.filter(k => availableKinds.has(k)).map(k => (
          <option key={k} value={k}>{KIND_META[k].label}</option>
        ))}
      </select>
      <span style={{ fontSize: '0.9em', opacity: 0.8, marginLeft: '12px' }}>Category:</span>
      <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={dropdownStyle}>
        <option value="all">All categories</option>
        {CATEGORY_ORDER.filter(c => availableCategories.has(c)).map(c => (
          <option key={c} value={c}>{CATEGORY_META[c].label}</option>
        ))}
      </select>
      <span style={{ fontSize: '0.9em', opacity: 0.8, marginLeft: '12px' }}>Sub-circuit / module:</span>
      <select value={circuitFilter} onChange={e => setCircuitFilter(e.target.value)} style={dropdownStyle}>
        <option value="all">All</option>
        {circuits.map(c => (
          <option key={c.slug} value={c.slug}>{c.label}</option>
        ))}
      </select>
    </div>
  );
}

function DependencyList({ ids, tasksById }) {
  return (
    <ul style={{ margin: '4px 0 0 0', padding: '0 0 0 18px' }}>
      {ids.map(id => {
        const dep = tasksById[id];
        if (!dep) {
          return (
            <li key={id} style={{ fontSize: '0.85em' }}>
              <code>{id}</code> <em style={{ opacity: 0.6 }}>(unknown — id not found)</em>
            </li>
          );
        }
        return (
          <li key={id} style={{ fontSize: '0.85em', marginBottom: '2px' }}>
            <code style={{ marginRight: '6px' }}>{id}</code>
            <StatusBadge status={dep.status} />{' '}
            <span style={{ opacity: 0.75 }}>— {dep.title}</span>
          </li>
        );
      })}
    </ul>
  );
}

function TaskRow({ task, expanded, onToggle, productBaseSlug, tasksById }) {
  const depsAllDone = (task.dependencies || []).every(id => tasksById[id]?.status === 'done');
  const hasDetails =
    task.notes ||
    (task.evidence && task.evidence.length > 0) ||
    (task.dependencies && task.dependencies.length > 0) ||
    task.assignee;

  return (
    <>
      <tr
        onClick={onToggle}
        style={{
          cursor: 'pointer',
          background: expanded ? 'var(--ifm-color-emphasis-100)' : 'transparent',
        }}
      >
        <td style={{ padding: '8px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
          <KindBadge kind={task.kind || 'verification'} targetVersion={task.target_version} />
        </td>
        <td style={{ padding: '8px', verticalAlign: 'top' }}>
          <CategoryBadge category={task.category || 'hardware'} />
        </td>
        <td style={{ padding: '8px', verticalAlign: 'top' }}>
          {task.category === 'hardware' ? (
            <a href={`${productBaseSlug}circuit-design/${task.circuit}`} onClick={e => e.stopPropagation()}>
              {task.circuit_label}
            </a>
          ) : (
            task.circuit_label || <span style={{ opacity: 0.5 }}>—</span>
          )}
        </td>
        <td style={{ padding: '8px', verticalAlign: 'top' }}>
          <div style={{ fontWeight: 600 }}>{task.title}</div>
          <div style={{ fontSize: '0.85em', opacity: 0.75, marginTop: '4px' }}>
            {task.description}
          </div>
        </td>
        <td style={{ padding: '8px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
          <StatusBadge status={task.status} />
          {task.dependencies && task.dependencies.length > 0 && (
            <DepBadge count={task.dependencies.length} allDone={depsAllDone} />
          )}
        </td>
        <td style={{ padding: '8px', verticalAlign: 'top', whiteSpace: 'nowrap', fontSize: '0.9em' }}>
          {task.date_completed || '—'}
        </td>
        <td style={{ padding: '8px', verticalAlign: 'top', fontSize: '0.9em' }}>
          {task.result || '—'}
        </td>
        <td style={{ padding: '8px', verticalAlign: 'top', textAlign: 'center', fontSize: '0.85em', opacity: 0.6 }}>
          {hasDetails ? (expanded ? '▼' : '▶') : ''}
        </td>
      </tr>
      {expanded && hasDetails && (
        <tr style={{ background: 'var(--ifm-color-emphasis-100)' }}>
          <td colSpan={8} style={{ padding: '12px 24px', borderTop: '1px dashed var(--ifm-color-emphasis-300)' }}>
            {task.assignee && (
              <div style={{ marginBottom: '8px' }}>
                <strong>Assignee:</strong>{' '}
                {task.assignee}
              </div>
            )}
            {task.dependencies && task.dependencies.length > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <strong>Dependencies (must complete first):</strong>
                <DependencyList ids={task.dependencies} tasksById={tasksById} />
              </div>
            )}
            {task.notes && (
              <div style={{ marginBottom: task.evidence?.length ? '8px' : '0' }}>
                <strong>Notes:</strong>{' '}
                <span style={{ whiteSpace: 'pre-wrap' }}>{task.notes}</span>
              </div>
            )}
            {task.evidence && task.evidence.length > 0 && (
              <div>
                <strong>Evidence:</strong>{' '}
                {task.evidence.map((e, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && ' • '}
                    <a href={e} target="_blank" rel="noreferrer">{e}</a>
                  </React.Fragment>
                ))}
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

export default function BringupTaskList({ tasks, productBaseSlug = './' }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [kindFilter, setKindFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [circuitFilter, setCircuitFilter] = useState('all');
  const [sortKey, setSortKey] = useState('kind');
  const [sortDir, setSortDir] = useState('asc');
  const [expandedId, setExpandedId] = useState(null);

  const tasksById = useMemo(() => Object.fromEntries(tasks.map(t => [t.id, t])), [tasks]);

  const availableKinds = useMemo(() => {
    const s = new Set();
    for (const t of tasks) s.add(t.kind || 'verification');
    return s;
  }, [tasks]);

  const availableCategories = useMemo(() => {
    const s = new Set();
    for (const t of tasks) s.add(t.category || 'hardware');
    return s;
  }, [tasks]);

  const circuits = useMemo(() => {
    const seen = new Map();
    for (const t of tasks) {
      if (kindFilter !== 'all' && (t.kind || 'verification') !== kindFilter) continue;
      if (categoryFilter !== 'all' && (t.category || 'hardware') !== categoryFilter) continue;
      if (!seen.has(t.circuit)) seen.set(t.circuit, t.circuit_label);
    }
    return [...seen.entries()]
      .map(([slug, label]) => ({ slug, label }))
      .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
  }, [tasks, kindFilter, categoryFilter]);

  const filtered = useMemo(() => {
    let f = tasks;
    if (statusFilter !== 'all') {
      if (statusFilter === 'open') f = f.filter(t => t.status !== 'done' && t.status !== 'not_applicable');
      else f = f.filter(t => t.status === statusFilter);
    }
    if (kindFilter !== 'all') {
      f = f.filter(t => (t.kind || 'verification') === kindFilter);
    }
    if (categoryFilter !== 'all') {
      f = f.filter(t => (t.category || 'hardware') === categoryFilter);
    }
    if (circuitFilter !== 'all') {
      f = f.filter(t => t.circuit === circuitFilter);
    }
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...f].sort((a, b) => {
      let av, bv;
      if (sortKey === 'kind') {
        av = KIND_ORDER.indexOf(a.kind || 'verification');
        bv = KIND_ORDER.indexOf(b.kind || 'verification');
      } else if (sortKey === 'category') {
        av = CATEGORY_ORDER.indexOf(a.category || 'hardware');
        bv = CATEGORY_ORDER.indexOf(b.category || 'hardware');
      } else if (sortKey === 'circuit') {
        av = a.circuit_label || '';
        bv = b.circuit_label || '';
      } else if (sortKey === 'status') {
        av = STATUS_ORDER.indexOf(a.status);
        bv = STATUS_ORDER.indexOf(b.status);
      } else if (sortKey === 'date_completed') {
        av = a.date_completed || '';
        bv = b.date_completed || '';
      } else if (sortKey === 'target_version') {
        av = a.target_version || '';
        bv = b.target_version || '';
      } else {
        av = a[sortKey] || '';
        bv = b[sortKey] || '';
      }
      if (av < bv) return -1 * dir;
      if (av > bv) return  1 * dir;
      // Secondary sort: by circuit then by title (for stable ordering)
      if ((a.circuit_label || '') !== (b.circuit_label || '')) {
        return (a.circuit_label || '').localeCompare(b.circuit_label || '') * dir;
      }
      return (a.title || '').localeCompare(b.title || '');
    });
  }, [tasks, statusFilter, kindFilter, categoryFilter, circuitFilter, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const headerStyle = (key) => ({
    padding: '10px 8px',
    textAlign: 'left',
    borderBottom: '2px solid var(--ifm-color-emphasis-300)',
    cursor: 'pointer',
    userSelect: 'none',
    background: 'var(--ifm-color-emphasis-100)',
    whiteSpace: 'nowrap',
  });

  const arrow = (key) => (sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '');

  return (
    <div>
      <SummaryStats tasks={tasks} />
      <FilterBar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        kindFilter={kindFilter}
        setKindFilter={setKindFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        circuitFilter={circuitFilter}
        setCircuitFilter={setCircuitFilter}
        circuits={circuits}
        availableCategories={availableCategories}
        availableKinds={availableKinds}
      />
      <div style={{ overflowX: 'auto', marginTop: '12px' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.95em' }}>
          <thead>
            <tr>
              <th style={headerStyle('kind')}       onClick={() => handleSort('kind')}>Kind{arrow('kind')}</th>
              <th style={headerStyle('category')}   onClick={() => handleSort('category')}>Category{arrow('category')}</th>
              <th style={headerStyle('circuit')}    onClick={() => handleSort('circuit')}>Sub-circuit / module{arrow('circuit')}</th>
              <th style={headerStyle('title')}      onClick={() => handleSort('title')}>Task / description{arrow('title')}</th>
              <th style={headerStyle('status')}     onClick={() => handleSort('status')}>Status{arrow('status')}</th>
              <th style={headerStyle('date_completed')} onClick={() => handleSort('date_completed')}>Date{arrow('date_completed')}</th>
              <th style={headerStyle('result')}     onClick={() => handleSort('result')}>Result{arrow('result')}</th>
              <th style={{ ...headerStyle('expand'), width: '40px', cursor: 'default' }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '24px', textAlign: 'center', opacity: 0.6 }}>
                  No tasks match the current filter.
                </td>
              </tr>
            ) : (
              filtered.map(task => (
                <TaskRow
                  key={task.id}
                  task={task}
                  expanded={expandedId === task.id}
                  onToggle={() => setExpandedId(expandedId === task.id ? null : task.id)}
                  productBaseSlug={productBaseSlug}
                  tasksById={tasksById}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: '0.85em', opacity: 0.65, marginTop: '12px' }}>
        Click any row to expand assignee, dependencies, notes and evidence links. Click any column header to sort.
        A ⛓ badge next to status indicates the task has dependencies — green = all done, red = some still open.
      </div>
    </div>
  );
}
