---
title: User Manual
hw_version: v1.1
hw_status: prototype
hw_status_label: "Fabricated prototype — sole built unit (pre-InvenTree)"
---

:::note[Hardware version]
CANBench Duo **v1.1** — Fabricated prototype, sole built unit. V1.1 is electrically identical to the V1.2 schematic refresh but predates the InvenTree symbol-library migration; the schematic component metadata reflects legacy SCADYS naming. Testing and bench validation reference this V1.1 hardware.

**Other versions:** [v1.2 — schematic refresh (next version)](/canbench-duo/v1.2/)
:::

Operator-facing manual for the CANBench Duo: bench setup, spectrum-analyser configuration, measurement workflow, status-LED interpretation, common pitfalls, and how to read the results. Pick the page you need.

| Page | What's on it |
|---|---|
| [Quick Start](./quick-start.md) | Six-step bench setup — connect supply, connect DUT, terminate unused ports, power on, sweep |
| [Spectrum-Analyser Setup](./spectrum-analyser-setup.md) | Configuration parameters that work with any analyser; recommended settings for tinySA ULTRA |
| [Measurement Procedure](./measurement-procedure.md) | Sweep workflow — analyser noise-floor check, baseline (LISN powered, DUT off), DUT measurement, optional CAN common-mode tap |
| [Status LED](./status-led.md) | What each colour means, what to do, and the troubleshooting flow |
| [Common Pitfalls](./common-pitfalls.md) | Mistakes that produce wrong readings and how to avoid them |
| [Interpreting Results](./interpreting-results.md) | LISN+ / LISN− symmetry comparison; CM / DM separation via CANBench TrueZ |

For engineering rationale (circuit topology, component values, design intent), see the [Circuit Design](../circuit-design/index.md) section. For fast lookup of the BOM, the connector roster, or the LED state table, see [Quick Reference](../quick-reference/index.md).
