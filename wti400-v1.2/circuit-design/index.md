---
title: Circuit Design
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel"
sidebar_label: Overview
---

:::note[Hardware version]

WTI400 **v1.2** — In service — installed on test vessel

:::

## System Architecture

The WTI400 is a marine wind transducer interface that bridges analog wind sensors to NMEA 2000 networks. It accepts a standard sine-wave wind transducer (e.g. Raymarine E22078/E22079 or B&G 213) and outputs calibrated Apparent Wind Speed and Apparent Wind Angle as PGN 130306 messages on the vessel CAN bus. Vessel motion data from an onboard 6DoF IMU is used to apply heel, pitch, and dynamic correction to the raw transducer signals.

Power enters on the NMEA 2000 backbone (9–16 V DC) via the M12 5-pin connector. An overvoltage protection cell clamps the input and feeds a switching regulator (VCC, 3.3 V) and a precision linear regulator (VAS, 8 V or 6.5 V selectable) for the wind transducer supply. The ESP32-S3 module acts as the system controller: 
* samples the two wind sine channels through unity-gain buffers and ADCs, 
* counts speed pulses from the anemometer, 
* polls the IMU over I²C and 
* transmits CAN frames via the SN65HVD234 transceiver. 
An optional legacy serial interface transmits wind data (e.g. SeaTalk™ or NMEA0183) for backwards compatibility with older systems.

All signal processing runs on the ESP32-S3-WROOM-1-N16R8 (16 MB flash, 8 MB PSRAM). Firmware communicates with the IMU at 52 Hz over I²C, reads the two wind ADC channels at the ESP32's native sample rate, counts speed pulses from the anemometer and publishes CAN frames at 1 Hz (True Wind). A single RGB LED and tactile button provide status indication and mode selection without requiring a display.

---

## Subsystems

| Subsystem | Sub-sheet | Role |
|-----------|-----------|------|
| Power Supplies | `power_supplies` | Input OVP clamp, LP2951 VAS linear regulator (8.4 V / 6.8 V selectable via JP1), HT7833 VCC 3.3 V LDO, reverse-polarity and ESD protection |
| CAN Bus Power | `can_bus_power` | NMEA 2000 backbone power conditioning — fuse (F1), TVS surge protection (D11), PI filter (L2/L3, C33–C39), OVP MOSFET (M1/M3) with threshold set by Zener (D10) |
| CAN Transceiver | `can_transceiver` | SN65HVD234 CAN transceiver, two-stage common-mode filter, split-termination (R5/R6 + C15), TVS protection (U9) on NET-H/NET-L |
| Wind Interface | `wind_interface` | Transducer supply routing (WIND_8V via J5), dual-channel unity-gain buffer amplifier (U12 OPA2356) on WIND_X/WIND_Y, speed pulse input (WIND_SPD) via 74LVC1G17 Schmitt trigger |
| ESP32 Module | `esp32_module` | ESP32-S3-WROOM-1-N16R8 controller, HT7833 VCC supply, programming header (J1), I²C pull-ups (R3/R4 = 10 kΩ), enable/boot configuration |
| Motion Sensor | `motion_sensor` | LSM6DSLTR 6DoF IMU (accelerometer + gyroscope, LGA-14), I²C at address 0x6A, decoupled by C5/C6/C12 |
| Button & LED | `button_led` | RGB LED (D1) backlighting the Scadys logo, tactile switch (SW1), current limiting resistors (R10–R12) |
| Legacy Serial RX | `legacy_serial_rx` | Galvanically isolated receive path for the legacy serial bus (e.g. SeaTalk™) — ZXTR2012FF 12 V LDO (U14), TLP2309 opto-isolator (U6), LC filter, D-type protection |
| Legacy Serial TX | `legacy_serial_tx` | Galvanically isolated transmit path — TLP2309 opto-isolators (U7 TX, U8 EN), 2N7002 open-drain output driver (Q6), MMBTA56LT1G rise-time assist (Q8), BZT52C15S zener clamp (D8) |

---

## PCB Layout & Stack-up

### Stack-up

The WTI400 V1.2 PCB is a four-layer design manufactured to IPC-6012 Class 2, with ENIG surface finish and dark blue solder mask.

| Layer | Number | Type | Thickness | Role |
|-------|--------|------|-----------|------|
| F.Cu | 0 | Signal | 17.5 µm (0.5 oz) | Component layer; VCC and GNDREF fills; routed signals |
| In1.Cu | 4 | Power | 35 µm (1 oz) | GNDREF solid ground plane (primary reference) |
| In2.Cu | 6 | Power | 35 µm (1 oz) | Additional power/ground fill (domain-dependent) |
| B.Cu | 2 | Signal | 17.5 µm (0.5 oz) | GNDREF fills; VCC fill; signal routing |

**Board outline:** 95.2 × 95.2 mm (Edge.Cuts x: 66.4–161.6 mm, y: 42.4–137.6 mm).

### Layer Allocation

The In1.Cu GNDREF plane is the primary signal return and EMC reference layer. In the switching power supply region (x: 72.2–85.8 mm), In1.Cu provides an uninterrupted solid pour. Across the digital domain (ESP32, CAN transceiver, IMU), both F.Cu and B.Cu carry GNDREF fills stitched to In1.Cu by regular via arrays.

In2.Cu is unused in most domains. Where a second power rail is required (such as the NMEA 2000 NET-S path in the CAN bus power section), In2.Cu carries the isolated supply. The use of In1.Cu as a dedicated ground layer — rather than as a general power plane — ensures a continuous low-impedance return path under all signal traces on F.Cu and B.Cu.

VCC (3.3 V) is distributed via wide copper fills on F.Cu and B.Cu. The VCC zone spans the digital domain (x: 83.5–157.5 mm) and connects the HT7833 LDO output to the ESP32 module, CAN transceiver, IMU, and pull-up resistors. Ninety-five VCC vias (0.3 mm drill, F.Cu–B.Cu) ensure low-resistance distribution across the domain.

### Isolation Zones

Two galvanic isolation boundaries are maintained on the PCB:

1. **CAN bus isolation (CAN transceiver domain):** The NET-H/NET-L differential pair and NET-S power are separated from the ESP32 digital domain by a minimum 1.4 mm creepage gap. The common-mode filter and TVS protection stage (U9) sit on the NMEA 2000 side of this boundary; the SN65HVD234 (U5) straddles it.

2. **Legacy serial isolation (legacy_serial_rx / legacy_serial_tx):** A 1.4 mm isolation gap separates the ST_SIG bus-side traces from the ESP32-side RX/TX signals. The TLP2309 opto-isolators (U6, U7, U8) bridge the two domains. The GND_WIND fill and GNDREF fill are copper-free across this boundary on F.Cu.

### EMC Layout Philosophy

Switching nodes (LMR51610 in the power_supplies section) are confined to the west of the board (x < 88 mm). The ESP32 module, IMU, and analog wind buffers occupy the eastern half. I²C traces (I2C_SCL, I2C_SDA) run northward from the IMU to the ESP32 module without crossing any switching power domain. CAN differential traces (NET-H, NET-L) are routed as a matched pair with the common-mode filter immediately at the M12 connector. The WIND_X and WIND_Y analog traces are separated by 5 mm with a GNDREF copper fill between them; no deliberate shielding is required at the operating signal frequencies (< 5 Hz wind sine wave).
