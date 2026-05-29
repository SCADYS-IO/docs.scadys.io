---
title: Quick Start
hw_version: v1.2
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
---

:::note[Hardware version]
CANBench TrueZ **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-truez/v1.1/)
:::

Five-step setup. The TrueZ is passive — there is nothing to power on. It sits between a CANBench Duo LISN and your analyser.

1. **Set up the CANBench Duo** per its own [Quick Start](/canbench-duo/v1.1/user-manual/quick-start) — bench supply in, DUT connected, status LED green.
2. **Cable the two LISN outputs into the TrueZ inputs** using **two identical SMA cables** (same type, same length): Duo `LISN+` → TrueZ `LISN+` (J2), Duo `LISN−` → TrueZ `LISN−` (J3). Cable matching is not optional — skew between the two feeds converts differential-mode into common-mode and vice-versa, corrupting the separation.
3. **Connect the analyser to one TrueZ output** — `CM-25Ω` (J4) *or* `DM-100Ω` (J5) — and **terminate the other output with 50 Ω**.
4. **Confirm the analyser input is 50 Ω.** The CM-25Ω / DM-100Ω measurement conditions are only valid into a 50 Ω input; a high-impedance scope input invalidates them.
5. **Sweep** per the [Measurement Procedure](./measurement-procedure.md), swapping the analyser between the CM and DM outputs to capture each mode.

For the analyser configuration see [Spectrum-Analyser Setup](./spectrum-analyser-setup.md); for what the traces mean see [Interpreting Results](./interpreting-results.md).
