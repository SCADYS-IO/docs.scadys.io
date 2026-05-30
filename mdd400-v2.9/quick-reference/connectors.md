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
| NMEA 2000 | M12 A-coded 5-pin (Micro-C) | CAN | −16.0 | 0.0 |
| ESP-PROG Programmer | IDC 6-pin Male 2.54 mm pitch | DIGITAL | 12.0 | −17.5 |
| HMI Display FFC | 50-pin 0.5 mm FPC top/bottom clamshell | DIGITAL | 10.0 | −10.0 |
| Legacy Serial / NMEA 0183 | 3-pin Autohelm-style connector | LEGACY IO | 29.0 | 10.5 |

X and Y are PCB-frame coordinates of the connector's reference point. For pinouts and electrical detail see [CAN Transceiver](../circuit-design/can-transceiver.md), [Programming Socket](../circuit-design/programming-socket.md), [Display Interface](../circuit-design/display-interface.md), and [Legacy Serial Interface](../circuit-design/legacy-serial.md).

## NMEA 2000 connector pinout

The NMEA 2000 network connection (J2) is a 5-pin M12 A-coded (Micro-C) **male** panel-mount connector. The diagram shows the pin assignments viewed from the front (mating face) of the device connector.

![NMEA 2000 M12 A-coded male connector — front view: pin 1 Shield, pin 2 NET-S (+V), pin 3 NET-C (−V), pin 4 NET-H (CAN-H), pin 5 NET-L (CAN-L)](/img/mdd400-v2.9/nmea2000_connector_pinout.svg)

| Pin | Signal | Description |
|---|---|---|
| 1 | Shield | Cable shield / drain — left floating inside the device (NMEA 2000 practice) |
| 2 | NET-S | Power supply positive (+V) |
| 3 | NET-C | Power supply common (−V) |
| 4 | NET-H | CAN-H |
| 5 | NET-L | CAN-L |
