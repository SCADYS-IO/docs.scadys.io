---
title: Quick Start
hw_version: v1.2
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
---

:::note[Hardware version]
CANBench Duo **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-duo/v1.1/)
:::

Six-step bench setup for the CANBench Duo. Assumes the unit is sitting flat on the test bench with the top extrusion (SMAs + M12 + LED) facing up.

1. **Connect bench supply** to the front-faceplate banana pair (RED to SRC+, BLACK to SRC−). The Red banana lights GREEN if polarity is correct, RED if reversed, BLUE if F1 has blown (a brief Blue flash at supply turn-on is benign — Q2 settling — and resolves to GREEN within a few ms). See [Status LED](./status-led.md) for the full state encoding.
2. **Connect DUT** to the back-faceplate banana pair (RED to DUT+, BLACK to DUT−), OR via the M12 N2K connector (J10) for combined supply + CAN bus.
3. **Terminate unused SMA ports** with 50 Ω. This is mandatory — unterminated ports produce false readings.
4. **Connect the spectrum analyser** to the SMA port of interest via short, good-quality coaxial cable. See [Spectrum-Analyser Setup](./spectrum-analyser-setup.md) for recommended configuration.
5. **Power on the bench supply.** Verify the Green LED. Confirm the DUT operates normally with supply current within the 4 A continuous envelope.
6. **Sweep** per the [Measurement Procedure](./measurement-procedure.md).

For deeper context on what each step protects against, see [Common Pitfalls](./common-pitfalls.md). For the LISN+/LISN− symmetry comparison and the CM/DM separation workflow, see [Interpreting Results](./interpreting-results.md).
