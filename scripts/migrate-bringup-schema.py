#!/usr/bin/env python3
"""Idempotently add new schema fields to bringup-tasks.json / tasks.json.

Each task is checked for every known field. Missing fields are filled with
defaults; existing fields are left untouched. Designed to be safely re-run
after any schema evolution.

Usage: python3 migrate-bringup-schema.py <path-to-json> <target-version>

Example:
  python3 migrate-bringup-schema.py docs.scadys.io/mdd400-v2.9/tasks.json v2.9
  python3 migrate-bringup-schema.py docs.scadys.io/wti400-v1.2/tasks.json v1.2
"""
import json
import sys
import pathlib

if len(sys.argv) != 3:
    print(f"Usage: python3 {sys.argv[0]} <path-to-json> <current-version>")
    sys.exit(1)

path = pathlib.Path(sys.argv[1])
current_version = sys.argv[2]

data = json.loads(path.read_text(encoding="utf-8"))

DEFAULTS = {
    "category":       "hardware",       # hardware | firmware | housing | compliance
    "kind":           "verification",   # verification | next-version
    "target_version": current_version,  # version this task is targeting
    "dependencies":   [],
    "assignee":       None,
    "status":         "todo",
    "date_completed": None,
    "result":         None,
    "notes":          None,
    "evidence":       [],
}

added_field_counts = {k: 0 for k in DEFAULTS}
for task in data:
    for field, default in DEFAULTS.items():
        if field not in task:
            task[field] = default if not isinstance(default, list) else list(default)
            added_field_counts[field] += 1

path.write_text(
    json.dumps(data, indent=2, ensure_ascii=False) + "\n",
    encoding="utf-8",
)
nonzero = {k: v for k, v in added_field_counts.items() if v}
if nonzero:
    print(f"  filled defaults in {path}: {nonzero}")
else:
    print(f"  {path}: no defaults needed (already up to date)")
