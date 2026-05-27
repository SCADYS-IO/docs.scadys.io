---
title: Tasks
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — bench testing"
---

import BringupTaskList from '@site/src/components/BringupTaskList';
import tasks from './tasks.json';

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype, bench-test phase. Live task list for the MDD400 V2.9 hardware revision and the next-version (V2.10) backlog. Underlying data: [`tasks.json`](https://github.com/SCADYS-IO/docs.scadys.io/blob/main/mdd400-v2.9/tasks.json) — hand-maintained, edited as work progresses.

:::

Every actionable task for MDD400 V2.9 — verification work against the current hardware + the next-version (V2.10) backlog — across all four product domains (hardware, firmware, housing, compliance). Click a row to expand details; click a column header to sort; hover any badge for help. See [Legend](#legend) below for full field meanings, or [Editing workflow](#editing-workflow) for how to update entries.

<BringupTaskList tasks={tasks} />

---

## Legend

### Kind

- **Verification** — bring-up test against the current hardware revision. Pulled from each circuit-design page's `## Testing & Verification` admonition under **Hardware bring-up** / **Conditional**.
- **Next version** — design / rework item targeted at a future hardware revision. The badge includes the target version (e.g. `v2.10`). Pulled from each circuit-design page's `## Testing & Verification` admonition under **For V2.10...** / **Before next production run...**.

### Category

- **Hardware** — work against the assembled PCB (most of the current list).
- **Firmware** — integration / regression test that needs the hardware running. (None yet in this list.)
- **Housing** — IP-rating, mechanical fit, drop, vibration, environmental test. (None yet.)
- **Compliance** — CISPR 32 conducted, FCC Part 15 radiated, RED 2014/53/EU harmonised standards, NMEA 2000 conformance, etc.

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
- Fill in `date_completed` (ISO format, e.g. `"2026-06-15"`) and `result` (free-text — e.g. `"3.302 V — within spec"` or `"Failed at 250 mA — see notes"`).
- Add `notes` for unexpected behaviour, observations, lessons learned.
- Add `assignee` if it's a delegated task (free-text — operator or team name).
- Add `dependencies` (array of upstream task IDs) if the task can't start until other items complete.
- Add `evidence` URLs for scope captures, photos, or log files (relative paths to `/assets/bringup/mdd400-v2.9/<task-id>.png` work; external URLs also work).

<p style={{textAlign: 'right', fontSize: '0.9em'}}><a href="#">↑ Back to top</a></p>

---

## How this list is maintained

The list is hand-maintained. It was seeded once from each circuit-design page's `## Testing & Verification` `:::caution` admonition — the **Hardware bring-up** / **Conditional** bullets became `kind: "verification"` tasks; the **For V2.10...** / **Before next production run...** bullets became `kind: "next-version"` tasks.

When a circuit page gains a new bullet, add a matching entry to `tasks.json`. When a circuit page bullet is reworded, update the matching entry's `description` to stay in sync. The hardware-repo backlog file `v2.10-improvements.md` in `MDD400/hardware/MDD400_V2.9/` remains the canonical narrative for next-version *rationale*; this page is the live state tracker.

<p style={{textAlign: 'right', fontSize: '0.9em'}}><a href="#">↑ Back to top</a></p>
