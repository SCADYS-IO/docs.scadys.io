---
title: ESP32 Module
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/esp32_module_6662fb7b.svg" alt="ESP32 Module schematic" />

:::note Hardware version
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

## Components

| Ref | Value | Description | Datasheet |
|---|---|---|---|
| U3 | ESP32-S3-WROOM-1-N16R8 | Espressif dual-core Xtensa LX7 MCU module, 240 MHz, 16 MB flash, 8 MB PSRAM, 2.4 GHz Wi-Fi + BT5 LE, integrated antenna, pre-certified | [Espressif ESP32-S3-WROOM-1 Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf) |
| U4 | HT7833 | UMW HT7833-A 3.3 V 450 mA LDO, SOT-89-3; tab = VIN (pin 2). **Developer/kit variant only — DNP in production** | [/assets/datasheets/mdd400-v2.9/HT7833.pdf](/assets/datasheets/mdd400-v2.9/HT7833.pdf) |
| Q1 | BC807-25 | Nexperia PNP BJT, 45 V / 500 mA, SOT-23; status LED switch driver | [Nexperia BC807 Series](https://assets.nexperia.com/documents/data-sheet/BC807_SER.pdf) |
| D2 | XL-1608UOC-06 | XINGLIGHT 0603 amber SMD LED; status indicator | [/assets/datasheets/mdd400-v2.9/XL-1608UOC-06.pdf](/assets/datasheets/mdd400-v2.9/XL-1608UOC-06.pdf) |
| D3, D4, D5 | 1N5819WS | JSMSEMI Schottky diode, 40 V / 350 mA, SOD-323; V_PROG supply OR'ing and isolation network. **Developer/kit variant only — DNP in production** | [/assets/datasheets/mdd400-v2.9/1N5819WS.pdf](/assets/datasheets/mdd400-v2.9/1N5819WS.pdf) |
| J1 | BH254V-6P | XFCN 2×3-pin 2.54 mm IDC through-hole header; ESP-PROG 6-pin PROG connector. **Maker/kit builds only — DNP in production** | [/assets/datasheets/mdd400-v2.9/BH254V-6P.pdf](/assets/datasheets/mdd400-v2.9/BH254V-6P.pdf) |
| R4 | 10 kΩ | 0603; ESP_EN pull-up to VCC | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R8 | 6k8 | 0603; Q1 base-bias resistor (LED_EN → base) | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R14 | 390 Ω | 0603; LED current-limiting series resistor (Q1 collector → D2 anode) | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_51_RoHS_P_6.pdf) |
| R15 | 10 kΩ | 0603; pull-down on LED_EN/Q1 base net to GNDREF | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R22 | 0 Ω (DNP) | 0603; production/developer variant select link. Populated in production (connects regulated VCC directly, bypasses U4). DNP in developer/kit builds where U4 is used instead | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R24 | 10 kΩ | 0603; ESP_BOOT (IO0) pull-up to VCC — selects SPI flash boot mode | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C1, C16, C26 | 10 µF / 25 V | 0805 X7R; VCC bulk bypass (3 × 10 µF = 30 µF total) | [Murata GRM21BZ71E106KE15L](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |
| C2, C17, C22, C29 | 100 nF / 50 V | 0603 X7R; VCC mid-frequency bypass (4 × 100 nF = 400 nF total) | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C3 | 1 µF / 25 V | 0603 X7R; VCC bulk bypass; also sets ESP_EN RC reset delay with R4 | [Murata GCM188R71E105KA64D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71E105KA64D) |
| C4 | 100 pF / 50 V | 0603 C0G; VCC RF-band bypass, placed < 1 mm from U3 pin 2 (3V3) | [Murata GRM1885C1H101JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D) |

## How It Works

The ESP32-S3-WROOM-1-N16R8 (U3) is the central processor of the MDD400. It integrates a dual-core Xtensa LX7 CPU running at up to 240 MHz, 512 KB SRAM, 8 MB PSRAM, 16 MB flash, and a 2.4 GHz RF front-end with integrated antenna covering Wi-Fi 802.11 b/g/n and Bluetooth 5 LE. The module operates from a 3.3 V supply (VCC).

The schematic supports two build variants for the VCC supply. In **production builds**, R22 (0 Ω) is populated and U4 is DNP: VCC is fed directly from the board's regulated 3.3 V supply (power-supplies sub-sheet), and firmware is loaded via a custom pogo-pin programmer that contacts the J1 THT pad footprint on the rear of the PCB. In **developer/kit builds**, R22 is DNP and U4 (HT7833 LDO) is populated: U4 takes VDD (5 V) and regulates it to VCC (3.3 V), protecting U3 against the ESP-PROG board's programmer-supply jumper being set to 5 V instead of 3.3 V. In kit builds, J1 (2×3 IDC) is soldered to the board; the housing provides a rear port opening for an ESP-PROG cable, sealed by a rubber cover when not in use.

U3's EN pin is pulled high through R4 (10 kΩ) with C3 (1 µF) to GNDREF forming an RC reset circuit, ensuring a clean power-on delay before the CPU starts. IO0 (ESP_BOOT) is pulled high through R24 (10 kΩ), selecting normal SPI flash boot; a programmer can pull IO0 low before toggling EN to enter download mode. Three 1N5819WS Schottky diodes (D3, D4, D5) form a supply OR'ing and isolation network on the V_PROG rail, preventing back-feed between the programmer 5 V supply, the board VDD bus, and the VCC rail. D3–D5 and J1 are DNP in production.

A status LED sub-circuit uses PNP transistor Q1 (BC807-25) to switch D2 (amber 0603 LED). Q1's emitter is at VCC; its base is driven by the LED_EN global signal through R8 (6.8 kΩ) with R15 (10 kΩ) pulling the base toward GNDREF. When LED_EN is undriven or low, Q1 turns on and passes ~3.1 mA through R14 (390 Ω) and D2, illuminating the LED as a power-good indicator. Driving LED_EN high (via the MCU) turns Q1 off and extinguishes the LED.

U3 connects to the rest of the board via global labels: TWAI_TX/RX/EN (CAN transceiver), I2C_SDA/SCL (sensor sub-sheets), AUDIO_PWM (buzzer driver), ST_TX/RX/EN (Legacy Serial Protocol sub-sheets), DISP_TX/RX/EN (display sub-sheet), and ESP_TX/RX/EN/BOOT (programming interface).

## Design Rationale

The N16R8 variant (16 MB flash, 8 MB PSRAM) was selected because the DWIN DGUS II display protocol requires uploading UI asset files to flash, OTA updates require a dual-partition layout with two full firmware images, and SPIFFS occupies additional flash. The 8 MB PSRAM headroom supports future data buffering and feature expansion without a board revision.

Using a pre-certified module eliminates in-house FCC/CE RF testing. Module certification covers the integrated RF subsystem and antenna, provided the 3 mm copper-free antenna keep-out is respected on all PCB layers — confirmed at ≥ 6.3 mm clearance in the PCB review.

The developer/kit LDO (U4) exists solely to protect U3 from an ESP-PROG board jumper error (5 V instead of 3.3 V on the programmer supply rail). In production this protection is unnecessary because the programmer is a custom fixed-voltage pogo-pin tool; removing U4 eliminates the two-diode V_PROG voltage drop and any thermal concern.

The status LED is on by default (Q1 biased on when LED_EN floats) to provide immediate power-good feedback during boot before firmware runs. The MCU can then take control of LED_EN to implement application-level status patterns.

## PCB Layout

The VCC supply decoupling uses a three-stage inline cluster directly at U3's 3V3 castellated pad: C4 (100 pF C0G) within 1 mm, C2 (100 nF) adjacent, and C1 (10 µF) adjacent — all anodes in-line at minimum package spacing. This positions the lowest-inductance stages physically closest to the module supply pin per the Espressif layout guideline. C3, C16, C17, C22, C26, and C29 provide additional bulk and mid-frequency decoupling on the VCC pour.

| Requirement | Status | Evidence |
|---|---|---|
| U3 antenna keep-out ≥ 3 mm, all layers | Met | F.Cu clearance 6.3 mm; B.Cu clearance 10.9 mm beyond antenna end |
| C4/C2/C1 within 2 mm / 5 mm of U3 3V3 pad | Met | C4 pad 2 < 1 mm from U3 pin 2; C2, C1 in-line at minimum spacing |
| C4 (100 pF C0G) closest to U3 supply pad | Met | C4 innermost in the decoupling cluster |
| Status LED cluster (Q1, R8, R14, R15, D2) compact | Met | All five components within a 12 mm × 7 mm bounding box |
| J1 accessible for programming | Met | Interior placement aligns with housing rear port (production: pogo-pin rear access) |
| U4 tab (VIN, pin 2) on VIN supply net | Met | U4 tab pad on Net-(D3-K); electrically correct for developer/kit build |
| VCC routed as low-impedance pour | Met | VCC implemented as F.Cu copper pour across full circuit area |
| U3 GND stitching vias ≤ 1.5 mm spacing | Met | 41 GNDREF stitching vias; column at x = 154.5 mm at ≈ 1.0 mm spacing |
| U4 thermal: ≥ 300 mm² copper + vias | Met | 64 mm² F.Cu + 16 vias + 64 mm² B.Cu + full-board internal GNDREF planes (≥ 5,000 mm² each) |
| ESP_TX/RX trace length < 50 mm | Unverifiable | Straight-line U3 → J1 ≈ 29.5 mm; actual routed length not extracted |

## Design Calculations

### U4 LDO Thermal (developer/kit variant only)

With V_IN(U4) ≈ 4.30 V (5 V rail minus two 1N5819WS diode drops of 0.35 V each through D4 and D3):

| Condition | I_out | P_d | T_j at 70 °C amb | Margin to 125 °C |
|---|---|---|---|---|
| Maximum continuous | 450 mA | 0.765 W | 115.9 °C | 7.3 % |
| Typical Wi-Fi TX peak | 300 mA | 0.510 W | 100.6 °C | 19.5 % |
| Typical Wi-Fi average | 200 mA | 0.340 W | 90.4 °C | 27.7 % |

Effective R_θJA estimated at 60 °C/W (bare SOT-89 = 160 °C/W; derating from 64 mm² F.Cu pour, 16 thermal vias, 64 mm² B.Cu pour, and full-board internal copper planes). A bare SOT-89 with no copper spreading would reach T_j = 151.6 °C at 300 mA — confirming the thermal via stack is load-bearing.

### Status LED Operating Point

With LED_EN = low (Q1 on):

- V_C = VCC − V_CE(sat) = 3.3 − 0.1 = 3.2 V
- I_LED = (V_C − V_F) / R14 = (3.2 − 2.0) / 390 = **3.08 mA**
- I_B = 642 µA; I_B required for saturation = 19.3 µA → overdrive **33×** (Q1 fully saturated)

### EN Reset Timing

- RC = R4 × C3 = 10 kΩ × 1 µF = **10 ms** (Espressif minimum: 1 ms; margin 10×)
- IO0 (ESP_BOOT) rises in < 1 µs on R24 alone — valid HIGH well before EN releases. No RC cap on IO0 is intentional.

### RF Compliance

ESP32-S3-WROOM-1-N16R8 carries FCC ID 2AC7Z-ESP32S3WROOM1 and CE (RED 2014/53/EU) pre-certification. PCB antenna keep-out clearance (≥ 6.3 mm, all layers) exceeds the required 3 mm minimum.

:::caution Verification required — Fabricated prototype — testing phase

**Verify during bring-up:**
- **U4 junction temperature (developer/kit builds):** Measure T_j under sustained Wi-Fi TX load (~300 mA). Estimated T_j = 100.6 °C at 70 °C ambient with R_θJA_eff ≈ 60 °C/W. If measured T_j exceeds 110 °C, expand the F.Cu pour or increase via count in V2.10. *(performance_review Gap 1)*

**For next version:**
- **UART series damping resistors:** Add 22–33 Ω at the transmitter output for all UART TX lines with routed trace lengths ≥ 50 mm (ESP_TX, DISP_TX, and corresponding RX lines). Measure trace lengths in KiCAD PCB editor first; add resistors only where length ≥ 50 mm. *(schema_review Gap 6)*
- **ESP_TX/RX trace lengths:** Confirm routed trace lengths from U3 to J1 THT pads (straight-line ≈ 29.5 mm). If routed length exceeds 50 mm, include in the UART damping action above. *(pcb_review Gap 3)*
:::

## References

- Espressif Systems, [*ESP32-S3-WROOM-1 & WROOM-1U Module Datasheet*](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf)
- Espressif Systems, [*ESP32-S3 Datasheet*](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- Espressif Systems, [*ESP-PROG Hardware Guide*](https://docs.espressif.com/projects/esp-iot-solution/en/latest/hw-reference/ESP-Prog_guide.html)
- Espressif Systems, [*ESP-IDF API Reference | GPIO & RTC GPIO*](https://docs.espressif.com/projects/esp-idf/en/v5.5/esp32s3/api-reference/peripherals/gpio.html)
- Espressif Systems, [*ESP-IDF JTAG Debugging Guide*](https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-guides/jtag-debugging/index.html)
- UMW, *HT7833-A SOT-89 LDO Regulator Datasheet* — [/assets/datasheets/mdd400-v2.9/HT7833.pdf](/assets/datasheets/mdd400-v2.9/HT7833.pdf)
- Nexperia, [*BC807 Series PNP Transistor Datasheet*](https://assets.nexperia.com/documents/data-sheet/BC807_SER.pdf)
- JSMSEMI, *1N5819WS SOD-323 Schottky Diode Datasheet* — [/assets/datasheets/mdd400-v2.9/1N5819WS.pdf](/assets/datasheets/mdd400-v2.9/1N5819WS.pdf)
- XINGLIGHT, *XL-1608UOC-06 0603 Amber LED Datasheet* — [/assets/datasheets/mdd400-v2.9/XL-1608UOC-06.pdf](/assets/datasheets/mdd400-v2.9/XL-1608UOC-06.pdf)
- YAGEO, [*RC Group Chip Resistor Datasheet*](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf)
- Murata, *GRM21BZ71E106KE15L 10 µF 25 V X7R 0805*, https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L
- Murata, *GCM188R71H104KA57D 100 nF 50 V X7R 0603*, https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D
- Murata, *GCM188R71E105KA64D 1 µF 25 V X7R 0603*, https://www.murata.com/en-us/products/productdetail?partno=GCM188R71E105KA64D
- Murata, *GRM1885C1H101JA01D 100 pF 50 V C0G 0603*, https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D
