---
title: LED States
hw_version: v1.2
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
---

:::note[Hardware version]
CANBench Duo **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-duo/v1.1/)
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
