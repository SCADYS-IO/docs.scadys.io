---
title: Firmware
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
sidebar_label: Firmware
---

:::note

Hardware version

MDD400 **v2.9** — Fabricated prototype — testing phase

:::

The MDD400 firmware runs on the ESP32-S3-WROOM-1-N16R8 module (dual-core Xtensa LX7, 16 MB flash, 8 MB PSRAM). It is developed using the ESP-IDF framework and handles all real-time communication, sensor management, display control, and network connectivity.

## Architecture

The firmware is structured around a set of concurrent FreeRTOS tasks, each responsible for a single protocol or subsystem:

| Task | Description |
|---|---|
| CAN / NMEA 2000 | Drives the TWAI peripheral (GPIO4 TX, GPIO5 RX); parses and transmits NMEA 2000 PGNs |
| Legacy Serial RX | UART1 receive (GPIO39); decodes Legacy Serial I bus datagrams at 4800 bps |
| Legacy Serial TX | UART1 transmit (GPIO41, GPIO1 enable); encodes and transmits Legacy Serial I bus commands |
| Display (DGUS II) | UART2 (GPIO48 TX, GPIO47 RX); issues DGUS II register commands to the DWIN display |
| I²C Sensors | I²C bus (GPIO8 SCL, GPIO18 SDA); polls INA219, TMP112, and OPT3004 on a 1 Hz cycle |
| Audio | LEDC PWM on GPIO10; generates tones via the MLT-8530 passive buzzer |
| BLE Config | Bluetooth Low Energy; exposes a configuration service for mobile pairing and settings |
| Watchdog | Hardware watchdog via ESP32-S3 built-in RWDT; supervised by all real-time tasks |

## Non-Volatile Storage

Configuration and calibration data are stored in the NVS (Non-Volatile Storage) partition in flash. The flash partition layout includes a 1 MB NVS partition, a coredump partition, and OTA update partitions. See the [Quick Reference](../quick-reference.md) for the full partition table.

## Display Protocol

All UI rendering is handled by the DWIN display's internal T5L microcontroller. The ESP32 firmware acts as a DGUS II serial host: it writes variable register values to update data fields and reads touch event registers to respond to user input. No framebuffer management or graphics compositing occurs in the ESP32 firmware.

## Power and Fault Management

At startup, the firmware asserts DISP_EN (GPIO21) to enable the display power switch after initialisation. The TWAI_EN signal (GPIO2) is driven high to enable the CAN transceiver after bus enumeration. The Legacy Serial TX enable (ST_EN, GPIO1) defaults to high (transmitter disabled) and is only asserted during active transmit windows.

The INA219 current monitor provides the firmware with continuous supply current and voltage readings. If supply voltage falls outside the 9–16 V operating window or current exceeds the 250 mA design maximum, the firmware logs the event to NVS and optionally triggers an audio alert.

## References

- Espressif, [*ESP-IDF Programming Guide*](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/)
- DWIN, [*T5L DGUS II Application Development Guide V2.9*](/assets/pdf/mdd400-v2.9/T5L_DGUSII-Application-Development-Guide-V2.9-0207.pdf)
- NMEA, [*NMEA 2000 Standard*](https://www.nmea.org/nmea-2000.html)
