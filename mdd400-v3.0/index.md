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
