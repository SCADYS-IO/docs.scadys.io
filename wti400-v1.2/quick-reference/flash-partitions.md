---
title: Flash Partitions
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel"
---

:::note[Hardware version]

WTI400 **v1.2** — In service on the test vessel. The partition layout below is the planned scheme for the ESP-IDF production firmware that will run on V1.2 boards (and on subsequent SCADYS products using the ESP32-S3-WROOM-1-N16R8 module). The current V1.2 firmware is a simple PlatformIO/Arduino sketch emitting NMEA 2000 PGN 130306 and uses the default partition table — see [Firmware](../firmware/index.md).

:::

The ESP32-S3-WROOM-1-N16R8 module carries 16 MB of external flash. The partition layout below is the SCADYS standard for products using this module, providing dual OTA app slots, SPIFFS for configuration and calibration data, and a coredump partition for post-fault diagnostics.

| Name | Type | SubType | Offset | Size |
|---|---|---|---|---|
| nvs | data | nvs | 0x9000 | 0x5000 |
| otadata | data | ota | 0xE000 | 0x2000 |
| app0 | app | ota_0 | 0x10000 | 0x500000 |
| app1 | app | ota_1 | 0x510000 | 0x500000 |
| spiffs | data | spiffs | 0xA10000 | 0x5E0000 |
| coredump | data | coredump | 0xFF0000 | 0x10000 |

Total mapped: 16 MB exactly (0x1000000). The two app partitions (5 MB each) carry the active and OTA-staged firmware images; the SPIFFS partition (~6 MB) holds runtime configuration, ADC calibration data (wind X/Y limits and midpoint), and any non-volatile assets the firmware needs to ship with.
