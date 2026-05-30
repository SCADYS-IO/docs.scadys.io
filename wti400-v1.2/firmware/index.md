---
title: Firmware
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel"
sidebar_label: Firmware
---

:::note[Hardware version]

WTI400 **v1.2** — In service on the test vessel (~1,000 sea miles). The board runs a **simple PlatformIO/Arduino firmware** that emits NMEA 2000 wind sentences. **Wi-Fi has never been enabled** on any WTI400 V1.2 board; **BLE** has only been exercised during early BLE-library development on test hardware. A production-ready firmware in ESP-IDF is the next major project task — see [Planned production firmware (ESP-IDF)](#planned-production-firmware-esp-idf) below.

:::

## Overview

This page covers the firmware state of the WTI400 V1.2 board and the plan for its production firmware. **V1.2 runs a simple in-service PlatformIO/Arduino NMEA 2000 firmware** that has accumulated approximately 1,000 sea miles emitting apparent-wind sentences on the test vessel. Writing a production-ready firmware in **ESP-IDF** — migrating the operational behaviour from the MLI400 V1.0 predecessor — is the next major project task; it will add the IMU-corrected output, wireless, OTA, and storage capabilities the current firmware lacks. **Wi-Fi has never been enabled** on any WTI400 V1.2 board. The sections below describe the current in-service state, the predecessor MLI400 V1.0 firmware, the planned ESP-IDF task architecture and migration plan, and the planned non-volatile storage behaviour.

## Current state (V1.2)

The WTI400 V1.2 on the test vessel runs a **simple PlatformIO/Arduino firmware** that has accumulated approximately 1,000 sea miles in service. Its behaviour is intentionally narrow:

| Function | Behaviour |
|---|---|
| Wind X / Y sampling | Reads the conditioned WIND_X / WIND_Y signals on the ESP32 ADC |
| Wind angle reconstruction | atan2(Y_norm, X_norm) referenced against a midpoint with hard-coded initial X / Y ADC limits |
| Self-calibration | Limits and midpoint are self-adjusted at run-time as new extremes are observed |
| Wind speed | Schmitt-trigger pulse stream converted to speed using a hard-coded pulses-per-revolution / wind-speed constant |
| Heel / pitch correction | Not enabled in the current firmware (the IMU is bench-tested but not yet integrated into the wind-output math) |
| NMEA 2000 output | Transmits PGN 130306 (apparent wind) on the TWAI bus at ~1 Hz |
| Wi-Fi | **Never enabled** — radio remains off at run-time |
| BLE | **Not enabled** — only library-development exercises on test hardware, never on this in-service board |
| Local UI | RGB LED + tactile button — minimal hard-coded patterns |

**Subjective in-service performance is satisfactory** — the wind output has been usable for navigation through ~1,000 sea miles of cruising — but **no quantitative bench measurements have been performed** on angle accuracy, ADC clipping, atan2 reconstruction quality, speed-pulse PPR calibration, VAS rail behaviour under load, or LP2951 thermal soak. Those measurements are listed in the [Tasks](../tasks.md) page under `verification` kind.

There is no Wi-Fi / BLE / OTA capability, no configurable run-time parameters, no fleet-management surface — those features are in scope for the planned production firmware.

## Predecessor firmware (MLI400 V1.0)

The **MLI400 V1.0** (Marine Legacy Interface) is the WTI400's predecessor — a single-purpose wind interface that served the test vessel through a **global circumnavigation**. The MLI400 V1.0 ran a bespoke **PlatformIO/Arduino** wind-interface firmware. The V1.2 in-service firmware is a direct descendant of that code path — same Arduino-style structure, evolved to fit the V1.2 ESP32-S3 hardware (the MLI400 V1.0 had a different MCU family).

That heritage is the source of the operational behaviour above: the X / Y limit-tracking strategy, the atan2 reconstruction tuning, the speed-pulse PPR convention, the NMEA 2000 wind-output cadence. It is **mature for what it does** — the algorithms have been hardened against a global voyage of weather conditions — but the codebase is **tied to PlatformIO / Arduino abstractions** and is not directly portable into a production-grade architecture.

## Planned production firmware (ESP-IDF)

Writing the **production firmware in ESP-IDF** is the next major project task across both products. The ESP-IDF target is chosen for:

- First-class FreeRTOS access, deterministic task scheduling, and proper component isolation
- Native TWAI driver and Wi-Fi / BLE stacks supported directly by Espressif
- Production-grade OTA, secure-boot, flash-encryption, and partition management
- Long-term Espressif support and stability across ESP32-S3 revisions
- Clear separation of HAL, drivers, services, and application layers

### Planned task architecture

The production firmware is planned around a set of concurrent FreeRTOS tasks, each owning a single peripheral or service. *None of the below is implemented in the current V1.2 firmware — this is the target architecture for the planned ESP-IDF implementation.*

| Task | Description |
|---|---|
| Wind sampling | ESP32 ADC channels for WIND_X / WIND_Y at a configurable rate; PCNT peripheral for the wind-speed pulse stream |
| Wind processing | atan2 reconstruction, IMU-corrected horizon-reference rotation, self-calibrating limits / midpoint, output filtering |
| IMU | LSM6DSLTR polling at 52 Hz over I²C (0x6A); orientation feed for the heel / pitch / dynamic correction in the wind-processing path |
| CAN / NMEA 2000 | TWAI peripheral (GPIO4 TX, GPIO5 RX); emits PGN 130306 at ~1 Hz; receives heading-reference and motion PGNs |
| Legacy Serial RX | UART receive; decodes Legacy Serial I bus datagrams (developer-tier hardware variant) |
| Legacy Serial TX | UART transmit (developer-tier hardware variant) |
| Local UI | RGB LED patterns + tactile-button input |
| Wi-Fi | Station mode + provisioning + OTA. **No prior Wi-Fi work has shipped on any WTI400 board** — this is a fresh integration task |
| BLE Config | Bluetooth LE configuration service for mobile pairing / settings. **Only exercised at library-development level on test hardware** — fresh task at production level |
| Watchdog | Hardware RWDT supervised by all real-time tasks |

### Migration from MLI400 V1.0 / WTI400 V1.2 firmware

The migration plan, in priority order:

1. **Lift the wind-processing algorithms first.** atan2 reconstruction, X / Y limit-tracking and midpoint adjustment, PPR-to-speed conversion, hard-coded start-up constants — extract as pure C functions that can be unit-tested against captured X / Y / pulse traces from the in-service deployment.
2. **Re-implement the I/O drivers natively in ESP-IDF.** TWAI peripheral driver, ADC sampling, PCNT for the wind-speed pulse stream, I²C master for the IMU, UART for Legacy Serial. The current PlatformIO/Arduino drivers are not portable.
3. **Rebuild the application loop as FreeRTOS tasks.** One task per peripheral; inter-task communication via queues and event groups; no busy-waiting.
4. **Integrate the IMU into the wind-output math.** Heel / pitch correction has been a design goal since V1.2 hardware but was not enabled in the current firmware. Rotate the wind vector from the masthead frame into the vessel-horizon frame before emitting PGN 130306.
5. **Add fresh-scope work** — Wi-Fi station + provisioning + OTA, production BLE configuration service, secure-boot, OTA dual-image flash partition layout, NVS-backed configuration storage. None of these existed on the V1.2 firmware.

The migration is intended to be **behaviour-preserving** for the wind-output code path (the in-service performance through 1,000 sea miles should be reproduced or improved on the same hardware) while adding the IMU-corrected output, the wireless / OTA capabilities, and a structured fleet-management surface.

## Non-volatile storage (planned)

Configuration and calibration data will be stored in the NVS (Non-Volatile Storage) partition in flash. The current V1.2 firmware does not use NVS — the start-up constants and initial ADC limits are compiled into the firmware image. The production firmware will read them from NVS so they can be changed without re-flashing.

## Related pages

- [Tasks](../tasks.md) — open work items, including the production ESP-IDF firmware build and the in-service verification measurements
- [Circuit Design → ESP32-S3 module](../circuit-design/esp32-module.md) — the controller the firmware runs on
- [WTI400 V1.2 overview](../index.md) — product home and version history

## References

- Espressif, [*ESP-IDF Programming Guide*](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/)
- NMEA, [*NMEA 2000 Standard*](https://www.nmea.org/nmea-2000.html)
