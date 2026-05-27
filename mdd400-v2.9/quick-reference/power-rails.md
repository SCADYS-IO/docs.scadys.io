---
title: Power Rails
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype — testing phase

:::

| Rail | Voltage | Source | Loads |
|---|---|---|---|
| NET-S | 12 V nominal (8–14.8 V) | NMEA 2000 backbone | Input power |
| VCC | 3.3 V regulated | LMR51610 buck converter (U1) | ESP32-S3, OPT3004, TMP112, SN65HVD234 logic side |
| VDD | 5.0 V regulated | LMR51610 buck converter (U6) | HMI display, MLT-8530 buzzer |
| VST | 12 V (legacy domain) | Legacy serial connector pin 1 | Legacy serial RX/TX opto-isolators (input side) |

For supply-design rationale and bring-up notes, see [Power Supplies](../circuit-design/power-supplies.md) and [CAN Bus Power Protection](../circuit-design/can-bus-power.md).
