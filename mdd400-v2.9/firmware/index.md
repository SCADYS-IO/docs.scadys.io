---
title: Firmware
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — bench-test phase"
sidebar_label: Firmware
---

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype, bench-test phase. **No production firmware has been written for V2.9 yet.** The board currently runs only ad-hoc hardware test routines (per-peripheral bring-up code). A production-ready firmware in ESP-IDF is the next major project task — see [Planned production firmware (ESP-IDF)](#planned-production-firmware-esp-idf) below.

:::

## Current state (V2.9)

The MDD400 V2.9 prototype runs only **hardware test routines** at the moment — small, dedicated programs used to exercise each peripheral during bring-up:

| Peripheral | Bench-test status |
|---|---|
| CAN / NMEA 2000 (TWAI) | Functional — can transmit and receive on the bus |
| HMI display (UART2 ↔ DGUS II protocol) | Functional — register writes, screen switches, touch-event reads round-trip |
| I²C bus (INA219, OPT3004, TMP112) | Functional — all three devices respond at their addresses and return sensible readings |
| Buzzer (LEDC PWM on GPIO10) | Functional — tone generation confirmed |
| Status LED (GPIO9) | Functional — power-good default-on + firmware-override pattern confirmed |
| ESP-PROG programming socket (J1) | Functional — flash + monitor over the IDC header |

**Wi-Fi has never been enabled** on any MDD400 board (V2.9 or earlier revisions). **BLE** has only been exercised during early BLE-library development on test hardware; no MDD400 board has run a production BLE configuration service. Both radios are in scope for the planned production firmware.

There is no integrated application loop on V2.9 today — no UI state machine, no PGN handler, no thermal-protection controller, no audio alert taxonomy. Each test routine drives one peripheral in isolation to confirm the hardware design.

## Predecessor firmware (MDD400 V1.0)

The **MDD400 V1.0** hardware ran a mature **PlatformIO / Arduino** firmware across earlier MDD400 hardware revisions, including extended open-ocean passages on the test vessel. The V1.0 codebase contains the operational logic the V2.9 production firmware will migrate from:

- HMI UI loop driving the DGUS II protocol
- ALS-driven automatic brightness control (lookup table tuned in service against the V1.0 housing geometry)
- Three-tier thermal protection from the TMP112: **alert → derate → graceful shutdown**
- Buzzer alert taxonomy (per-event tone patterns)
- NMEA 2000 PGN handling (read + transmit)

This code is **tied to PlatformIO / Arduino abstractions** and is not directly portable into a production-grade architecture. The plan is to migrate the *behaviour* — algorithms, lookup tables, state machines, alert taxonomy — into a fresh ESP-IDF implementation while retiring the Arduino-style structure.

The V1.0 brightness lookup table was tuned for the **V1.0 housing**. The V2.9 housing introduces a new ALS aperture / lens placement, so the same outside illuminance now produces a different OPT3004 raw reading — the lookup table's input axis must be **re-mapped on V2.9 hardware** before the migrated brightness loop can be deployed. See the [Ambient Light Sensor](../circuit-design/ambient-light-sensor.md) page for the re-calibration plan.

## Planned production firmware (ESP-IDF)

Writing the **production firmware in ESP-IDF** is the next major project task across both products. The ESP-IDF target is chosen for:

- First-class FreeRTOS access, deterministic task scheduling, and proper component isolation
- Native TWAI driver and Wi-Fi / BLE stacks supported directly by Espressif
- Production-grade OTA, secure-boot, flash-encryption, and partition management
- Long-term Espressif support and stability across ESP32-S3 revisions
- Clear separation of HAL, drivers, services, and application layers

### Planned task architecture

The production firmware is planned around a set of concurrent FreeRTOS tasks, each owning a single peripheral or service. *None of the below exists yet on V2.9 — this is the target architecture for the planned ESP-IDF implementation.*

| Task | Description |
|---|---|
| CAN / NMEA 2000 | TWAI peripheral (GPIO4 TX, GPIO5 RX); transmits and parses NMEA 2000 PGNs |
| Legacy Serial RX | UART1 receive (GPIO39); decodes Legacy Serial I bus datagrams at 4800 bps |
| Legacy Serial TX | UART1 transmit (GPIO41, GPIO1 enable); encodes Legacy Serial I bus commands |
| Display (DGUS II) | UART2 (GPIO48 TX, GPIO47 RX); issues DGUS II register commands to the HMI display |
| I²C Sensors | I²C bus (GPIO8 SCL, GPIO18 SDA); polls INA219, TMP112, OPT3004 on a 1 Hz cycle |
| Audio | LEDC PWM on GPIO10; generates tones via the MLT-8530 passive buzzer |
| Wi-Fi | Station mode + provisioning + OTA. **No prior Wi-Fi work has shipped on any MDD400 board** — this is a fresh integration task |
| BLE Config | Bluetooth LE configuration service for mobile pairing / settings. **Only exercised at library-development level on test hardware** — fresh task at production level |
| Watchdog | Hardware RWDT supervised by all real-time tasks |

### Migration from MDD400 V1.0

The migration plan, in priority order:

1. **Lift the algorithms first.** Brightness lookup function, thermal-protection tier transitions, alert taxonomy, PGN parsers — extract as pure C functions that can be unit-tested against captured inputs.
2. **Re-implement the I/O drivers natively in ESP-IDF.** TWAI peripheral driver, UART drivers for DGUS II and Legacy Serial, I²C bus master, LEDC PWM for the buzzer. The V1.0 Arduino-style drivers are not portable.
3. **Rebuild the application loop as FreeRTOS tasks.** One task per peripheral; inter-task communication via queues and event groups; no busy-waiting.
4. **Add fresh-scope work** — Wi-Fi station + provisioning + OTA, production BLE configuration service, secure-boot, OTA dual-image flash partition layout, NVS-backed configuration storage. None of these existed on the V1.0 firmware.
5. **Re-calibrate the V2.9-specific values** — the brightness lookup against the new ALS aperture / lens placement; the INA219 measurement shunt and PGA settings against the V2.9 board layout.

The migration is intended to be **behaviour-preserving** for the operational code paths (the user-visible UI, alarm and thermal behaviour should match V1.0 in-service performance) while adding the wireless and OTA capabilities V1.0 lacked.

## Non-volatile storage (planned)

Configuration and calibration data will be stored in the NVS (Non-Volatile Storage) partition in flash. The planned flash partition layout includes a 1 MB NVS partition, a coredump partition, and OTA update partitions. See [Flash Partitions](../quick-reference/flash-partitions.md) for the full partition table.

## Display protocol (planned)

All UI rendering is handled by the HMI display's internal microcontroller. The ESP32 firmware will act as a **DGUS II serial host**: it writes variable register values to update data fields and reads touch event registers to respond to user input. No framebuffer management or graphics compositing will occur in the ESP32 firmware.

## Power and fault management (planned)

At startup, the firmware will assert DISP_EN (GPIO21) to enable the display power switch after initialisation. The TWAI_EN signal (GPIO2) will be driven high to enable the CAN transceiver after bus enumeration. The Legacy Serial TX enable (ST_EN, GPIO1) defaults to high (transmitter disabled) and will be asserted only during active transmit windows.

The INA219 current monitor will provide the firmware with continuous supply current and voltage readings. If supply voltage falls outside the 9–16 V operating window or current exceeds the 250 mA design maximum, the firmware will log the event to NVS and optionally trigger an audio alert.

## References

- Espressif, [*ESP-IDF Programming Guide*](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/)
- DWIN, [*T5L DGUS II Application Development Guide V2.9*](/assets/pdf/mdd400-v2.9/T5L_DGUSII-Application-Development-Guide-V2.9-0207.pdf)
- NMEA, [*NMEA 2000 Standard*](https://www.nmea.org/nmea-2000.html)
