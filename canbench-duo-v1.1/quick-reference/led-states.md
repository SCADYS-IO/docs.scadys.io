---
title: LED States
hw_version: v1.1
hw_status: prototype
hw_status_label: "Fabricated prototype — sole built unit (pre-InvenTree)"
---

:::note[Hardware version]
CANBench Duo **v1.1** — Fabricated prototype, sole built unit. V1.1 is electrically identical to the V1.2 schematic refresh but predates the InvenTree symbol-library migration; the schematic component metadata reflects legacy SCADYS naming. Testing and bench validation reference this V1.1 hardware.

**Other versions:** [v1.2 — schematic refresh (next version)](/canbench-duo/v1.2/)
:::

Four-state lookup table for the CANBench Duo indicator LED (D1, top extrusion).

| State | Meaning |
|---|---|
| **Off** | No bench-supply voltage |
| **Green** | Correct polarity, normal operation |
| **Blue** | Q2 protection FET not fully conducting — typically F1 has blown |
| **Red** | Reverse polarity at SRC pair (V_BLACK > V_RED) |

A brief Blue flash for a few ms at supply turn-on is benign (Q2 settling) and resolves to Green.

For operator-level troubleshooting flow and what to do in each state, see [User Manual → Status LED](../user-manual/status-led.md). For circuit topology and the engineering rationale of the four-state encoding, see [Power Indicator LED](../circuit-design/power-indicator-led.md).
