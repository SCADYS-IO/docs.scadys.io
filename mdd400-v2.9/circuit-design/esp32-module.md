---
title: ESP32 Module
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/esp32_module_5c6d30e0.svg" alt="ESP32 Module schematic" />

:::note Hardware version
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

## Components

| Ref | Value | Description | Datasheet |
|---|---|---|---|
| U3 | ESP32-S3-WROOM-1-N16R8 | Dual-core Wi-Fi/BT5 MCU module, 16 MB flash, 8 MB PSRAM | [Espressif ESP32-S3-WROOM-1](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf) |
| U4 | HT7833 | 3.3 V 450 mA LDO regulator, SOT-89 | [Holtek HT78xx](https://www.holtek.com/page/detail/dev_tool/HT78xx) |
| J1 | 2×3 2.54 mm IDC | ESP-PROG 6-pin programming header | [LCSC C492441](https://www.lcsc.com/product-detail/C492441.html) |
| Q1 | BC807-25 | PNP 45 V 500 mA SOT-323 — auto-reset control | [Nexperia BC807](https://assets.nexperia.com/documents/data-sheet/BC807_SER.pdf) |
| D2 | AMBER | 0603 amber LED — status indicator | [XINGLIGHT XL-1608UOC](https://www.lcsc.com/product-detail/C965800.html) |
| D3–D5 | 1N5819WS | 40 V 350 mA SOD-323 Schottky — GPIO protection | [Nexperia 1N5819WS](https://assets.nexperia.com/documents/data-sheet/1N5817DS_TO1N5819DS.pdf) |
| R4 | 10 kΩ | 0603 — ESP_EN pull-up | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R15 | 10 kΩ | 0603 — ESP_BOOT (GPIO0) pull-up | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R24 | 10 kΩ | 0603 — I²C/GPIO pull-up | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R8 | 6.8 kΩ | 0603 — status LED current limiter | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R14 | 390 Ω | 0603 — programming circuit series resistor | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_51_RoHS_P_6.pdf) |
| C1, C16, C26 | 10 µF/25 V | 0805 X7R MLCC — VCC bulk decoupling | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C2, C17, C22, C29 | 100 nF/50 V | 0603 X7R — high-frequency bypass | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| C3 | 1 µF/25 V | 0603 X7R — ESP_EN reset timing capacitor | — |
| C4 | 100 pF/50 V | 0603 C0G — ESP_BOOT debounce capacitor | — |

## How It Works

The ESP32-S3-WROOM-1-N16R8 (U3) is the central processing unit of the MDD400. It is a fully certified wireless microcontroller module containing a dual-core Xtensa LX7 CPU running at up to 240 MHz, 512 KB internal SRAM, 8 MB QSPI PSRAM, and 16 MB QSPI flash. The integrated antenna handles 2.4 GHz Wi-Fi (802.11 b/g/n) and Bluetooth 5 LE. The module operates from 3.3 V (VCC), with a local HT7833 LDO (U4) providing an additional 3.3 V supply for the module's regulated output pins.

The EN pin is pulled high through a 10 kΩ resistor (R4) and has a 1 µF timing capacitor (C3) to GNDREF, which shapes the power-on reset pulse and ensures the module has adequate time to initialise before the CPU starts executing. GPIO0 (ESP_BOOT, R15 + C4) is pulled high during normal operation; holding it low during reset places the chip in serial download mode.

The 6-pin IDC programming header (J1) is pin-compatible with the Espressif ESP-Prog, providing access to UART0 (GPIO43/44 for TX/RX), ESP_EN, and ESP_BOOT. A BC807 PNP transistor (Q1) implements auto-reset: when the ESP-Prog asserts DTR, it drives Q1 into conduction, pulling ESP_EN low and triggering a controlled reset without requiring a physical button.

The I²C bus on GPIO8 (SCL) and GPIO18 (SDA) serves three peripherals — INA219, TMP112, and OPT3004 — with a single set of 4.7 kΩ pull-ups on the DIGITAL domain side. TWAI (GPIO12 RX, GPIO13 TX) connects to the SN65HVD234 transceiver. TWAI_EN on GPIO14 is pulled to GNDREF so the transceiver is in standby at boot and requires explicit firmware action to enable. UART2 (GPIO47 RX, GPIO48 TX) connects to the DWIN display. UART1 (GPIO39 RX, GPIO41 TX) and GPIO1 (ST_EN) connect to the legacy serial opto-isolator stages.

An amber status LED (D2) is driven by GPIO9 (LED_EN, active low) through a 6.8 kΩ current-limiting resistor (R8), giving approximately 0.5 mA drive current — visible through the enclosure without measurable thermal loading.

## Design Rationale

The N16R8 variant (16 MB flash, 8 MB PSRAM) was chosen over smaller variants because the DWIN DGUS II display protocol requires uploading UI asset files to flash, OTA updates require a dual-partition layout with two full firmware slots, and SPIFFS occupies a substantial portion of the remaining flash. The 8 MB PSRAM headroom supports future feature expansion. The pre-certified module eliminates the need for in-house FCC/CE RF testing.

The TWAI_EN pull-down is a critical safety feature: without it, a floating or high GPIO14 at power-up would enable the CAN transceiver before the TWAI peripheral is initialised, potentially transmitting undefined data onto the NMEA 2000 network.

## References

- Espressif, [*ESP32-S3-WROOM-1 & WROOM-1U Module Datasheet*](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf)
- Espressif, [*API Reference | GPIO & RTC GPIO*](https://docs.espressif.com/projects/esp-idf/en/v5.5/esp32s3/api-reference/peripherals/gpio.html)
- Espressif, [*ESP-PROG Hardware Guide*](https://docs.espressif.com/projects/esp-iot-solution/en/latest/hw-reference/ESP-Prog_guide.html)
- Espressif, [*ESP-IDF JTAG Debugging Guide*](https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-guides/jtag-debugging/index.html)
