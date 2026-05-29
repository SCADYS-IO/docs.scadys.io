---
title: User Manual
hw_version: v1.2
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
---

:::note[Hardware version]
CANBench Duo **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-duo/v1.1/)
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
