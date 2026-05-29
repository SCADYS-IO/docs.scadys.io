---
title: Common Pitfalls
hw_version: v1.2
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
---

:::note[Hardware version]
CANBench Duo **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-duo/v1.1/)
:::

The CANBench Duo's protection chain catches most user errors, but a handful of mistakes produce *valid-looking but wrong* readings on the spectrum analyser. Read this list before drawing conclusions from a measurement set.

| Pitfall | Effect | Avoid by |
|---|---|---|
| Missing 50 Ω terminator on unused SMA ports | False CM signatures, resonances, unstable traces, incorrect amplitudes | Always terminate. Three 50 Ω SMA terminators is the minimum required kit. |
| Inconsistent cable routing between comparative sweeps | Low-level CM signatures shift | Fix the geometry: same cable lengths, same routing, same proximity to nearby equipment between sweeps you intend to compare |
| Nearby desktop computer or monitor | Increased CM signature near switching frequencies | Move the bench away from PCs during sensitive measurements |
| Bench supply with switching ripple | Bench-supply hash appears as broadband floor rise | Use a linear bench PSU or add upstream filtering. The CANBench Duo's LISN ladder is designed to STABILISE the supply impedance, not CLEAN the supply spectrum — what comes from the bench above the LF cut-off mostly passes through. |
| Source / DUT bananas wired backward | Bypasses LISN protection chain; Red LED lights | Always check the [Status LED](./status-led.md) on power-up before opening the bench-supply output |
| CAN-bus tap (J6) used on an unterminated bus | DUT bus errors; measurement is invalid | Always have proper 120 Ω termination at both ends of the CAN bus before connecting J6 |
| Free-air measurement interpreted as "compliance test" | Over-interpretation of relative-level traces as absolute compliance | Free-air measurements are useful for architecture comparison and relative-level work, not formal CISPR 25 compliance — see [Interpreting Results](./interpreting-results.md) for the distinction |
| Bench-supply current exceeds 4 A continuous | LISN ladder inductors approach thermal limit; supply path heats up | The CANBench Duo's design intent is 4 A continuous at 25 °C ambient (derated to 3 A at 40 °C). DUTs that need more supply current must use a different LISN. |
| Forgetting to remove the analyser's LNA | Analyser overload near strong peaks; spurious harmonics in the trace | LNA OFF is the default for CANBench Duo signal levels (typically −60 dBm to −90 dBm). Only enable LNA to characterise the analyser's own noise floor with the LISN unpowered. |

See also: [Quick Start](./quick-start.md) for the correct setup sequence; [Status LED](./status-led.md) for what each colour means; [Interpreting Results](./interpreting-results.md) for what the trace is telling you once everything is set up right.
