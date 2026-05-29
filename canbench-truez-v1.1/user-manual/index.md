---
title: User Manual
hw_version: v1.1
hw_status: prototype
hw_status_label: "Fabricated prototype — sole built unit (pre-InvenTree)"
---

:::note[Hardware version]
CANBench TrueZ **v1.1** — Fabricated prototype, sole built unit. V1.1 is electrically identical to the V1.2 schematic refresh but predates the InvenTree symbol-library migration; the schematic component metadata reflects legacy SCADYS naming. Testing and bench validation reference this V1.1 hardware.

**Other versions:** [v1.2 — schematic refresh (next version)](/canbench-truez/v1.2/)
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
