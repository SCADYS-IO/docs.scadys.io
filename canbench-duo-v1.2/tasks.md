---
title: Tasks
hw_version: v1.2
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import BringupTaskList from '@site/src/components/BringupTaskList';
import tasks from './tasks.json';

:::note[Hardware version]

CANBench Duo **v1.2** — Fabricated prototype, testing phase. Live task list for the CANBench Duo V1.2 hardware revision and the next-version (V1.3) backlog. Underlying data: [`tasks.json`](https://github.com/SCADYS-IO/docs.scadys.io/blob/main/canbench-duo-v1.2/tasks.json) — hand-maintained, edited as work progresses.

:::

Every actionable task for CANBench Duo V1.2 — validation work against the V1.1 fabricated hardware + the next-version (V1.3) backlog — across the relevant product domains (hardware, housing, compliance; no firmware since the instrument is fully passive). Click a row to expand details; click a column header to sort; hover any badge for help. See [Legend](#legend) below for full field meanings, or [Editing workflow](#editing-workflow) for how to update entries.

<BringupTaskList tasks={tasks} />

---

## Legend

### Kind

- **Verification** — measurement / simulation against the V1.1 fabricated hardware (or numerical work against V1.2 datasheet specs). Closes evidence gaps flagged in the schema-review / pcb-review / performance-review pipeline.
- **Next version** — design / rework item targeted at V1.3 (the next fabrication). The badge includes the target version (`v1.3`).

### Category

- **Hardware** — work against the assembled PCB (most of the current list).
- **Firmware** — none. The CANBench Duo is a fully passive instrument; there is no firmware.
- **Housing** — enclosure layer / orientation / chassis-bond items.
- **Compliance** — EMC lab testing, Declaration of Conformity, RoHS verification, regulatory-mark sizing.

### Status

- **To do** — not yet attempted.
- **In progress** — being worked on now.
- **Done** — completed with a recorded result.
- **Blocked** — can't proceed (waiting on parts, equipment, or upstream dependency).
- **Deferred** — intentionally postponed to a later campaign or version.
- **N/A** — no longer relevant (e.g. superseded by a design change).

### Dependency chain (⛓ badge)

The ⛓ badge next to a status indicates the task has upstream dependencies. **Green** = all dependencies are done. **Red** = some dependencies are still open (the task may need to wait). Expand the row to see the dependency list with each upstream task's status inline.

<p style={{textAlign: 'right', fontSize: '0.9em'}}><a href="#">↑ Back to top</a></p>

---

## Editing workflow

Update the JSON file alongside the task execution:

- Change `status` to `"in_progress"` while working, then `"done"` when complete.
- Fill in `date_completed` (ISO format, e.g. `"2026-06-15"`) and `result` (free-text — e.g. `"4.7 Ω at 150 kHz, rising to 47 Ω at 1 MHz"` or `"Failed at 6.2 A — see notes"`).
- Add `notes` for unexpected behaviour, observations, lessons learned.
- Add `assignee` if it's a delegated task (free-text — operator or team name).
- Add `dependencies` (array of upstream task IDs) if the task can't start until other items complete.
- Add `evidence` URLs for VNA traces, SPICE outputs, photos, or test reports (relative paths under `/assets/bringup/canbench-duo-v1.2/<task-id>.png` work; external URLs also work).

<p style={{textAlign: 'right', fontSize: '0.9em'}}><a href="#">↑ Back to top</a></p>

---

## How this list is maintained

The list is hand-maintained. It was seeded from the **V1.3 hardware fixes** and **validation work** sections of the earlier narrative `tasks.md` draft, themselves derived from the per-circuit `## Gaps` / `## Remaining Gaps` blocks in the `schema_review/`, `pcb_review/`, and `performance_review/` evidence files in `D:\GitHub\scadys.io\CANBench-Duo\PCB\CANBench_Duo_V1.2\`.

When a per-circuit evidence file gains a new gap, add a matching entry to `tasks.json`. When an evidence-file gap is reworded, update the matching entry's `description` to stay in sync. The hardware-repo's evidence pipeline remains the canonical narrative for the *why* behind each task; this page is the live state tracker.

<p style={{textAlign: 'right', fontSize: '0.9em'}}><a href="#">↑ Back to top</a></p>
