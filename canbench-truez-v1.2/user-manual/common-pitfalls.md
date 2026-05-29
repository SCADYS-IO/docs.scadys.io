---
title: Common Pitfalls
hw_version: v1.1
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
---

:::note[Hardware version]
CANBench TrueZ **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-truez/v1.1/)
:::

A handful of mistakes produce *valid-looking but wrong* CM/DM readings. Check this list before drawing conclusions.

| Pitfall | Effect | Avoid by |
|---|---|---|
| Mismatched input cables (different length/type on LISN+ vs LISN−) | Skew converts DM↔CM — the separation is corrupted, both traces wrong | Use two identical SMA cables for the two inputs |
| Non-50 Ω analyser input (high-Z scope, 1 MΩ setting) | Breaks the CM-25Ω / DM-100Ω loading; amplitudes invalid | Confirm the analyser input is 50 Ω before measuring |
| Unused output left open (not terminated) | Reflections and cross-coupling distort the measured mode | Put a 50 Ω terminator on whichever output (CM or DM) you are not currently reading |
| No low-end correction applied | Low-band (150 kHz – ~0.5 MHz) reads low due to transformer droop | Apply the TrueZ correction curve in post-processing; above ~1 MHz no correction is needed |
| Using TrueZ without a LISN front end | No RF coupling/attenuation/protection — TrueZ is only the separator | Always feed TrueZ from a CANBench Duo (or equivalent LISN) measurement port |
| Inconsistent geometry between comparative sweeps | Low-level CM signatures shift | Keep cable routing and bench layout fixed across sweeps you intend to compare |
| Reading absolute levels as a compliance verdict | Over-interpretation | TrueZ is a pre-compliance / diagnostic tool — relative CM-vs-DM comparison, not certified amplitudes (see [Interpreting Results](./interpreting-results.md)) |

See [Quick Start](./quick-start.md) for the correct setup and [Measurement Procedure](./measurement-procedure.md) for the sweep order.
