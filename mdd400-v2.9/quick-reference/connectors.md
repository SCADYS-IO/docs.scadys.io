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

## ESP-PROG programming header pinout

The programming socket (J1) is a 2×3 IDC header following the Espressif ESP-Prog "Program" convention. Full circuit detail is on the [Programming Socket](../circuit-design/programming-socket.md) page.

![ESP-PROG 2×3 programming header — pin 1 ESP_EN, 2 V_PROG (5 V), 3 ESP_TX, 4 GND, 5 ESP_RX, 6 ESP_BOOT (IO0)](/img/mdd400-v2.9/esp_prog_pinout.svg)

## Legacy serial connector pinout

The legacy serial connector (J3) is a 3-pin Raymarine-compatible connector. See the [Legacy Serial Interface](../circuit-design/legacy-serial.md) page for the isolation and signalling detail.

![Legacy serial 3-pin connector — pin 1 12 V (red), pin 2 GND (black), pin 3 SIG (yellow)](/img/mdd400-v2.9/legacy_serial_pinout.svg)

## Rear connector panel

The connectors accessible from the rear face of the MDD400 housing: NMEA 2000 (J2), the ESP-PROG programming header (J1), and the legacy serial connector (J3).

![MDD400 rear connector panel — 1 J2 NMEA 2000 (M12 A-coded), 2 J1 ESP-PROG programming header, 3 J3 legacy serial](/img/mdd400-v2.9/rear_connector_panel.svg)
