---
title: External Connectors
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype — testing phase

:::

| Connector | Style | Domain | X (mm) | Y (mm) |
|---|---|---|---|---|
| NMEA 2000 | DeviceNet Micro-C 5-pin Code A | CAN | −16.0 | 0.0 |
| ESP-PROG Programmer | IDC 6-pin Male 2.54 mm pitch | DIGITAL | 12.0 | −17.5 |
| HMI Display FFC | 50-pin 0.5 mm FPC top/bottom clamshell | DIGITAL | 10.0 | −10.0 |
| Legacy Serial / NMEA 0183 | 3-pin Autohelm-style connector | LEGACY IO | 29.0 | 10.5 |

X and Y are PCB-frame coordinates of the connector's reference point. For pinouts and electrical detail see [CAN Transceiver](../circuit-design/can-transceiver.md), [Programming Socket](../circuit-design/programming-socket.md), [Display Interface](../circuit-design/display-interface.md), and [Legacy Serial Interface](../circuit-design/legacy-serial.md).
