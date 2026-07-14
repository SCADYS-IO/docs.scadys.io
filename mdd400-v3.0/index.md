---
title: "MDD400 Overview"
hw_version: v3.0
hw_status: schematic
hw_status_label: "In design — V3.0 schematic capture in progress"
---

:::note[Hardware version]

MDD400 **v3.0** — ESP32-P4 / MIPI-DSI / LVGL platform re-base. This board is at **schematic-capture** stage; no V3.0 hardware exists yet.

**Other versions:** [v2.9 — fabricated prototype (current)](/mdd400/v2.9/)

:::

:::info[Under construction — V3.0 capture in progress]

MDD400 **V3.0** is a platform re-base of the flagship marine display node. The host moves from an **ESP32-S3-WROOM-1 module driving a DWIN parallel-RGB display** (V2.9) to a **chip-down ESP32-P4 SoC plus an ESP32-C6-MINI-1 companion radio, driving a MIPI-DSI display over two FFC cables**, with LVGL firmware. The NMEA 2000 / CAN front end, the I²C sensors, the legacy SeaTalk interface, the buzzer, and the bus-power protection largely carry over from V2.9.

This documentation set is being built as the V3.0 schematic is captured. Pages are populated per sheet:

- **Reworked (being redrawn):** ESP32-P4 module, display interface, power supplies, and all Quick Reference pages.
- **New:** the ESP32-C6 Wi-Fi / BLE radio.
- **Carried over (pin re-pointing pending):** CAN bus power, CAN transceiver, the I²C sensors, legacy serial, the LED indicator, and PCB markings — these retain their V2.9 content until re-pointed to the P4.

See the [Tasks](/mdd400/v3.0/tasks) page for capture status.

:::

## Schematic capture status

As of 14 July 2026. Counts are taken from the KiCad netlist, not from a checklist.

| Sheet | Components | State |
|---|---|---|
| 3.3 V DC-DC converter | 20 | Drawn and verified against its design brief |
| CAN bus power and protection | 20 | Drawn |
| CAN transceiver and NMEA 2000 interface | 15 | Drawn |
| Legacy serial (SeaTalk) transmit | 34 | Drawn |
| Legacy serial (SeaTalk) receive | 20 | Drawn |
| I²C sensors | 11 | Drawn, pending the current-monitor change |
| 1.2 V DC-DC converter | 9 | Drawn |
| ESP-PROG programming socket | 9 | Drawn |
| Bypass and bias | 7 | Drawn |
| Status LED | 5 | Drawn |
| Display interface | 2 | In progress |
| Buzzer driver | 1 | In progress |
| ESP32-P4 host | 0 | Not started |
| 1.8 V LDO | 0 | Not started |
| Backlight driver | 0 | Not started |
| MIPI interface | 0 | Not started |
| Touch interface | 0 | Not started |
| System clock | 0 | Not started |
| Non-volatile storage | 0 | Not started |

159 components placed across 13 sheets.

### The 3.3 V rail

The 3.3 V converter is the first sheet to complete the full design cycle: a written design brief, a part-by-part
bill of materials with substitution criteria, and a capture verified back against that brief. It is the rail every
other supply on the board derives from, so it carries the whole load, owns the brown-out behaviour, and has to keep
regulating through a bus surge.

Its design is documented in [Circuit Design](/mdd400/v3.0/circuit-design/).

### What gates the rest

The host sheet is the substantial remaining work. Every part on a SCADYS board must clear a footprint audit against
its manufacturer's land pattern before the board is released to fabrication, and that audit is a hard gate rather
than a checklist item. See [Part selection and design for reliability](/mdd400/v3.0/circuit-design/) and the
[Engineering Notes](/engineering/).
