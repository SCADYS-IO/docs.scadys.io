---
title: Flash Partitions
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype — testing phase. The partition layout below is the planned scheme for the ESP-IDF production firmware that will run on V2.9 boards (and on subsequent SCADYS products using the ESP32-S3-WROOM-1-N16R8 module). The current V2.9 firmware comprises hardware test routines only and uses the default ESP-IDF partition table — see [Firmware](../firmware/index.md).

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

Total mapped: 16 MB exactly (0x1000000). The two app partitions (5 MB each) carry the active and OTA-staged firmware images; the SPIFFS partition (~6 MB) holds runtime configuration, ADC calibration data, and any non-volatile assets the firmware needs to ship with.
