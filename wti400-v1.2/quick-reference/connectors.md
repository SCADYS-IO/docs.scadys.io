---
title: External Connectors
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel"
---

:::note[Hardware version]

WTI400 **v1.2** — In service — installed on test vessel

:::

| Connector | Style | Domain | Notes |
|---|---|---|---|
| J1 — Programming | 2×3 IDC 2.54 mm (XFCN BH254V-6P) | DIGITAL | ESP-PROG-compatible: Pin 1 = ESP_EN, Pin 2 = V_PROG, Pin 3 = ESP_TX, Pin 4 = GND, Pin 5 = ESP_RX, Pin 6 = ESP_BOOT. **Developer/kit variant only** |
| J2 — NMEA 2000 | M12 5-pin A-code panel socket (IEC 61076-2-101) | CAN | Pin 1 = Shield, 2 = NET-S (+12 V), 3 = NET-C (GND), 4 = NET-H, 5 = NET-L |
| J3 — Legacy Serial | 3-pin THT (CON-THT-SEATALK-0292) | LEGACY IO | Pin 1 = 12 V (red), 2 = GND (black), 3 = SIG (yellow); half-duplex, 4800 / 9600 bps |
| J4 — WIND_SHLD | Keystone 1211 solder tab | WIND | Wind transducer cable shield return |
| J5 — WIND_8V | Keystone 1211 solder tab | WIND | Transducer supply (WIND_8V, JP1-selectable) |
| J6 — WIND_X | Keystone 1211 solder tab | WIND | X-axis Hall sensor analogue output |
| J7 — WIND_Y | Keystone 1211 solder tab | WIND | Y-axis Hall sensor analogue output |
| J8 — WIND_SPD | Keystone 1211 solder tab | WIND | Anemometer speed pulse (P-line, reed-switch) |
| J9 — GND_WIND | Keystone 1211 solder tab | WIND | Transducer ground return (isolated from GNDREF via FL2 CMF) |
| JP1 — Voltage Select | 3-pin THT header 2.54 mm (PZ254V-11-03P) | WIND POWER | Positions: 8v4 = Raymarine (8.65 V), 6v8 = B&G (6.89 V); field-configurable |

For per-connector design rationale see [Programming Socket](../circuit-design/programming-socket.md), [CAN Transceiver](../circuit-design/can-transceiver.md), [Wind Interface](../circuit-design/wind-interface.md), and [Legacy Serial Interface](../circuit-design/legacy-serial.md).

## NMEA 2000 connector pinout

The NMEA 2000 network connection (J2) is a 5-pin M12 A-coded (Micro-C) **male** panel-mount connector. The diagram shows the pin assignments viewed from the front (mating face) of the device connector.

![NMEA 2000 M12 A-coded male connector — front view: pin 1 Shield, pin 2 NET-S (+V), pin 3 NET-C (−V), pin 4 NET-H (CAN-H), pin 5 NET-L (CAN-L)](/img/wti400-v1.2/nmea2000_connector_pinout.svg)

| Pin | Signal | Description |
|---|---|---|
| 1 | Shield | Cable shield / drain — left floating inside the device (NMEA 2000 practice) |
| 2 | NET-S | Power supply positive (+V) |
| 3 | NET-C | Power supply common (−V) |
| 4 | NET-H | CAN-H |
| 5 | NET-L | CAN-L |

## ESP-PROG programming header pinout

The programming socket (J1) is a 2×3 IDC header following the Espressif ESP-Prog "Program" convention. Full circuit detail is on the [Programming Socket](../circuit-design/programming-socket.md) page.

![ESP-PROG 2×3 programming header — pin 1 ESP_EN, 2 V_PROG (5 V), 3 ESP_TX, 4 GND, 5 ESP_RX, 6 ESP_BOOT (IO0)](/img/wti400-v1.2/esp_prog_pinout.svg)

## Legacy serial connector pinout

The legacy serial connector (J3) is a 3-pin Raymarine-compatible connector. See the [Legacy Serial Interface](../circuit-design/legacy-serial.md) page for the isolation and signalling detail.

![Legacy serial 3-pin connector — pin 1 12 V (red), pin 2 GND (black), pin 3 SIG (yellow)](/img/wti400-v1.2/legacy_serial_pinout.svg)
