---
title: User Manual
hw_version: v1.1
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
---

:::note[Hardware version]
CANBench TrueZ **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-truez/v1.1/)
:::

Operator manual for the CANBench TrueZ — the common-mode / differential-mode separation stage that sits between a [CANBench Duo](/canbench-duo/v1.1/) LISN and a spectrum analyser. Pick the page you need.

| Page | What's on it |
|---|---|
| [Quick Start](./quick-start.md) | Cable the TrueZ between the Duo's two LISN outputs and the analyser, then sweep |
| [Spectrum-Analyser Setup](./spectrum-analyser-setup.md) | Analyser configuration; the mandatory 50 Ω-input requirement |
| [Measurement Procedure](./measurement-procedure.md) | Noise-floor check, baseline, CM sweep, DM sweep, low-end correction |
| [Common Pitfalls](./common-pitfalls.md) | Mistakes that produce wrong CM/DM readings and how to avoid them |
| [Interpreting Results](./interpreting-results.md) | Reading the CM vs DM split and choosing the right mitigation |

For engineering rationale (topology, component values, design intent) see [Circuit Design](../circuit-design/index.md). For the BOM and connector roster, see [Quick Reference](../quick-reference/index.md).
