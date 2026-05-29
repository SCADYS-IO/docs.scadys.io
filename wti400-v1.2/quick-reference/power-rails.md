---
title: Power Rails
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel"
---

:::note[Hardware version]

WTI400 **v1.2** — In service — installed on test vessel

:::

| Rail | Voltage | Source | Loads |
|---|---|---|---|
| NET-S | 9–16 V (nom. 12 V) | NMEA 2000 backbone via J2 M12 | Input power — feeds CAN bus power sub-sheet |
| VSC | 9–14.8 V (protected) | Q2 PMV240SPR OVP switch, EMI filter L2/L3, fuse F1 | LMR51610 (→ VCC), LP2951 (→ VAS) |
| VCC | 3.3 V ±2 % | LMR51610XDBVR buck (U2), 1 A, 400 kHz | ESP32-S3 (U3), SN65HVD234 (U5), LSM6DSLTR (U1), signal logic |
| VAS | 8.65 V (8v4) or 6.89 V (6v8) | LP2951 LDO (U13), 100 mA rated | Wind transducer via J5 and D17 Schottky; WIND_8V = VAS − 0.35 V |
| VST | ~12 V (tracks NET-S above 12.9 V, dropout below) | ZXTR2012FF regulator (U14), 30 mA | Legacy serial opto-isolator bias (U6, U7, U8) |
| V_PROG | 3.3 V from 5 V programmer | HT7833 LDO (U4) — **developer variant only** | VCC during programming; DNP in production (R24 0 Ω bridges VCC) |

## JP1 voltage-select setpoints

| JP1 position | VAS setpoint | WIND_8V (transducer supply) | Use with |
|---|---|---|---|
| 8v4 | 8.65 V | ≈ 8.30 V | Raymarine E22078 |
| 6v8 | 6.89 V | ≈ 6.54 V | B&G 213 |

WIND_8V = VAS − 0.35 V (Schottky drop through D17). JP1 is field-configurable. For the design rationale see [Power Supplies](../circuit-design/power-supplies.md), [CAN Bus Power](../circuit-design/can-bus-power.md), and [Wind Interface](../circuit-design/wind-interface.md).
