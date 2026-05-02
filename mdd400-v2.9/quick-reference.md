---
title: Quick Reference
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note Hardware version
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

## Pin Assignments

| Label | GPIO | Bias | Function | Description |
|---|---|---|---|---|
| AUDIO_PWM | GPIO10 | GNDREF | PWM | Audio buzzer driver |
| DISP_EN | GPIO21 | GNDREF | OUTPUT | TFT display enable (ENABLE = HIGH) |
| DISP_RX | GPIO47 | float | UART2 | From display TX pin |
| DISP_TX | GPIO48 | float | UART2 | To display RX pin |
| ESP_BOOT | GPIO0 | VCC | BOOT | ESP-PROG pin 6 |
| ESP_EN | EN | VCC | BOOT | ESP-PROG pin 1 |
| ESP_RX | GPIO44 | float | UART0 | ESP-PROG pin 5 |
| ESP_TX | GPIO43 | float | UART0 | ESP-PROG pin 3 |
| I2C_SCL | GPIO8 | VCC | I²C | I²C clock line |
| I2C_SDA | GPIO18 | VCC | I²C | I²C data line |
| LED_EN | GPIO9 | GNDREF | OUTPUT | LED enable (ENABLE = LOW) |
| ST_EN | GPIO1 | VCC | OUTPUT | Legacy serial TX enable (ENABLE = LOW) |
| ST_RX | GPIO39 | float | UART1 | From legacy serial RX |
| ST_TX | GPIO41 | float | UART1 | To legacy serial TX |
| TWAI_RX | GPIO12 | float | TWAI | From CAN transceiver RXD pin |
| TWAI_TX | GPIO13 | float | TWAI | To CAN transceiver TXD pin |
| TWAI_EN | GPIO14 | GNDREF | TWAI | Pull up to enable CAN transceiver |

## I²C Addresses

| Device | I²C Address | Ref | Notes |
|---|---|---|---|
| TMP112 Temperature Sensor | 0x48 | U13 | ADD0 tied to GND |
| OPT3004 Ambient Light Sensor | 0x44 | U12 | ADDR pin tied to GND |
| INA219 Power Monitor | 0x40 | U2 | A1, A0 both tied to GND |

## Power Rails

| Rail | Voltage | Source | Loads |
|---|---|---|---|
| NET-S | 12 V nominal (8–14.8 V) | NMEA 2000 backbone | Input power |
| VSD | ~12 V isolated | VPS8701B + VPT87DDF01B transformer (removed in v2.9) | SMPS converters |
| VCC | 3.3 V regulated | LMR51610 buck converter (U1) | ESP32-S3, OPT3004, TMP112, SN65HVD234 logic side |
| VDD | 5.0 V regulated | LMR51610 buck converter (U6) | DWIN display, MLT-8530 buzzer |
| VST | 12 V (legacy domain) | Legacy serial connector pin 1 | Legacy serial RX/TX opto-isolators (input side) |

## Flash Partition Table

| Name | Type | SubType | Offset | Size |
|---|---|---|---|---|
| nvs | data | nvs | 0x9000 | 0x5000 |
| otadata | data | ota | 0xe000 | 0x2000 |
| app0 | app | ota_0 | 0x10000 | 0x500000 |
| app1 | app | ota_1 | — | 0x500000 |
| spiffs | data | spiffs | — | 0x5E0000 |
| coredump | data | coredump | — | 0x10000 |

## External Connectors

| Connector | Style | Domain | X (mm) | Y (mm) |
|---|---|---|---|---|
| NMEA 2000 | DeviceNet Micro-C 5-pin Code A | CAN | −16.0 | 0.0 |
| ESP-PROG Programmer | IDC 6-pin Male 2.54 mm pitch | DIGITAL | 12.0 | −17.5 |
| DWIN Display FFC | 50-pin 0.5 mm FPC top/bottom clamshell | DIGITAL | 10.0 | −10.0 |
| Legacy Serial / NMEA 0183 | 3-pin Autohelm-style connector | LEGACY IO | 29.0 | 10.5 |

## Component List

| Refs | Value | Qty | Description | Datasheet |
|---|---|---|---|---|
| BZ0 | MLT-8530 | 1 | 80 dB passive electromagnetic buzzer, SMD 8.5×8.5 mm | [Jiangsu Huaneng](https://www.lcsc.com/product-detail/Buzzers_Jiangsu-Huaneng-Elec-MLT-8530_C94599.html) |
| C1, C16, C18, C26, C37, C54 | 10 µF/25 V | 6 | 0805 X7R MLCC | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C2, C6, C10, C11, C17, C19, C21, C22, C25, C29, C30, C38–C41, C53, C56 | 100 nF/50 V | 17 | 0603 X7R MLCC | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| C3, C8 | 1 µF/25 V | 2 | 0603 X7R MLCC | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C4, C13, C31, C49, C50, C57 | 100 pF/50 V | 6 | 0603 C0G MLCC | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C5, C14, C15, C20, C32, C33 | 10 µF/50 V | 6 | 1210 X7R MLCC | [Murata GRM32ER71H106KA12L](https://www.murata.com/en-us/products/productdetail?partno=GRM32ER71H106KA12L%40D) |
| C7, C23 | 1 pF/100 V | 2 | 0603 C0G MLCC | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C12 | 4.7 µF/16 V | 1 | 0603 X7R MLCC | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C27, C28, C34, C35 | 15 pF/100 V | 4 | 0603 C0G MLCC | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C42, C44 | 100 nF/100 V | 2 | 0603 X7R MLCC | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C43, C51, C52 | 22 µF/100 V | 3 | 2220 X7R MLCC | [PSA FS55X225K251EGG Product Page](https://www.lcsc.com/product-detail/C153032.html) |
| C45, C46 | 4.7 µF/100 V | 2 | 1206 X7R MLCC | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C47, C55 | 1 µF/100 V | 2 | 1206 X7R MLCC | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C48 | 2.2 nF/50 V | 1 | 0603 C0G MLCC | [Murata GRM1881X0J243JA01](https://search.murata.co.jp/Ceramy/image/img/A01X/G101/ENG/GRM1881X0J243JA01-01A.pdf) |
| D1, D6 | BAT54 | 2 | 30 V SOD-323F Schottky diode | [Nexperia BAT54J](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf) |
| D2 | AMBER | 1 | 0603 amber LED | [XINGLIGHT XL-1608UOC Product Page](https://www.lcsc.com/product-detail/C965800.html) |
| D3–D5 | 1N5819WS | 3 | 40 V SOD-323 Schottky diode | [Nexperia 1N5819WS](https://assets.nexperia.com/documents/data-sheet/1N5817DS_TO1N5819DS.pdf) |
| D7, D14 | PESD15VL1BA | 2 | 15 V bidirectional ESD/TVS, SOD-323 | [Nexperia PESD15VL1BA](https://assets.nexperia.com/documents/data-sheet/PESD15VL1BA.pdf) |
| D8 | BZT52C7V5S | 1 | 7.5 V SOD-323 zener | [Diodes Inc BZT52C7V5S](https://www.diodes.com/assets/Datasheets/BZT52C.pdf) |
| D9 | BZT52C15S | 1 | 15 V SOD-323 zener | [Diodes Inc BZT52C15S](https://www.diodes.com/assets/Datasheets/BZT52C.pdf) |
| D10 | SM8S36CA | 1 | 36 V bidirectional TVS, DO-218AB, 6.6 kW | [SMC Diodes SM8S36CA](https://www.smc-diodes.com/propdf/SM8S20CA%20THRU%20SM8S43CA%20N2149%20REV.-.pdf) |
| D11 | BAT54S | 1 | 30 V SOT-23 dual series Schottky | [Nexperia BAT54S](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf) |
| D12, D13 | SS34 | 2 | 40 V 3 A SMA Schottky | [MSKSEMI SS34](https://www.lcsc.com/product-detail/C2836396.html) |
| D15 | SMCJ36CA | 1 | 36 V bidirectional TVS, DO-214AB, 1.5 kW | [SMC Diodes SMCJ36CA](https://www.smc-diodes.com/propdf/SMCJ.pdf) |
| F1 | 500 mA/60 V | 1 | 1812 resettable fuse (PTC) | [BHFUSE BSMD1812-050 Product Page](https://www.lcsc.com/product-detail/C883142.html) |
| FB1–FB5 | 600 Ω@100 MHz | 5 | 1206 ferrite bead | [Murata BLM31KN601SN1L](https://www.murata.com/en-us/products/productdetail?partno=BLM31KN601SN1L%40T) |
| FL1 | ACT45B-510-2P | 1 | Common-mode choke, SMD | [Murata ACT45B-510-2P](https://www.murata.com/en-us/products/productdata/8807038415390/QTN0099C.pdf) |
| J1 | 2×3 2.54 mm IDC | 1 | ESP-PROG 6-pin programming header | [LCSC C492441 Product Page](https://www.lcsc.com/product-detail/C492441.html) |
| J2 | 5-pin Code-A Male | 1 | DeviceNet/NMEA 2000 Micro-C connector | [NMEA 2000 Micro-C spec](https://www.nmea.org/nmea-2000.html) |
| J3 | Legacy Serial 3-pin | 1 | 3-pin Autohelm-style legacy serial connector | — |
| J4 | FPC 50-pin 0.5 mm | 1 | Top/bottom clamshell FPC connector for DWIN display | [Xunpu FPC-05FB-50PH20](https://en.xunpu.com.cn/product/388.html) |
| L1, L2 | 22 µH | 2 | Shielded power inductor, 1.6 A, 123 mΩ DCR, SMD 5×5 mm | [Bourns SRN5040TA-220M](https://www.bourns.com/docs/product-datasheets/srn5040ta.pdf) |
| L3 | 4.7 µH | 1 | Power inductor, 2.1 A, SMD 4×4 mm | [Bourns SRR4028 or equiv. Product Page](https://www.lcsc.com/product-detail/C602022.html) |
| L4 | 1 µH | 1 | Power inductor, 3.5 A, SMD 4×4 mm | [Product Page](https://www.lcsc.com/product-detail/C602020.html) |
| L5 | 1 µH | 1 | Chip inductor, 150 mA, 0603 | [Murata LQM18FN100M00D](https://www.murata.com/en-us/products/productdetail?partno=LQM18FN100M00D) |
| M1, M2 | 75 V MOV | 2 | 1206 metal oxide varistor | [Littelfuse V33MLA1206NH](https://www.littelfuse.com/products/varistors/multilayer-varistors/mlv/v33mla1206nh.aspx) |
| Q1 | BC807-25 | 1 | PNP 45 V 500 mA SOT-323 | [Nexperia BC807](https://assets.nexperia.com/documents/data-sheet/BC807_SER.pdf) |
| Q2, Q4, Q9 | AO3407A | 3 | P-channel 30 V 4.2 A SOT-23 MOSFET | [UMW AO3407A](https://www.umw-ic.com/en/product/list_55.html) |
| Q3, Q5 | S8050 | 2 | NPN 25 V 1.5 A SOT-23 | [JSMSEMI SS8050](https://www.lcsc.com/product-detail/C916392.html) |
| Q6 | PMV240SPR | 1 | P-channel 100 V 1.2 A SOT-23 MOSFET | [Nexperia PMV240SPR](https://assets.nexperia.com/documents/data-sheet/PMV240SPR.pdf) |
| Q7, Q12 | MMBTA56LT1G | 2 | PNP 80 V 500 mA SOT-23 | [Onsemi MMBTA56LT1G](https://www.onsemi.com/products/discrete-power-modules/general-purpose-transistors/mmbta56) |
| Q8, Q11 | BC847BS | 2 | NPN 45 V 100 mA SOT-363 dual | [Nexperia BC847BS](https://assets.nexperia.com/documents/data-sheet/BC847BS.pdf) |
| Q10 | 2N7002 | 1 | N-channel 60 V 300 mA SOT-23 MOSFET | [Nexperia 2N7002](https://assets.nexperia.com/documents/data-sheet/2N7002.pdf) |
| R1–R4, R11, R15, R17, R20, R21, R24, R26, R34, R61, R62 | 10 kΩ | 14 | 0603 thick-film 1% | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R5 | 32 kΩ | 1 | 0603 thin-film 0.1% | [Yageo Thin Film](https://www.lcsc.com/product-detail/C861839.html) |
| R6, R13, R19, R28, R31, R35, R38, R54 | 100 kΩ | 8 | 0603 thick-film 1% | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R8 | 6.8 kΩ | 1 | 0603 thick-film 1% | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R9, R51 | 10 Ω | 2 | 0603 thick-film 1% | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R10, R39 | 4.7 Ω | 2 | 0603 thick-film 1% | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R12, R25, R32, R50, R58 | 2.2 kΩ | 5 | 0603 thick-film 1% | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R14, R27, R29, R36, R55 | 390 Ω | 5 | 0603 thick-film 1% | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_51_RoHS_P_6.pdf) |
| R16 | 47 Ω | 1 | 0603 thick-film 1% | [Yageo RC Series](https://www.lcsc.com/product-detail/C114623.html) |
| R18 | 19.1 kΩ | 1 | 0603 thin-film 0.1% | [Yageo Thin Film](https://www.lcsc.com/product-detail/C855669.html) |
| R30, R37, R44, R47 | 22 kΩ | 4 | 0603 thick-film 1% | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R33 | 330 mΩ | 1 | 0603 shunt resistor 1% | [Yageo PT0603FR-070R33L](https://www.yageo.com/en/Product-Line/Resistors/Chip-Resistors/Thick-Film/PT/PT0603FR-070R33L) |
| R40 | 56 kΩ | 1 | 0603 thick-film 1% | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R41, R43 | 1 MΩ | 2 | 0603 thick-film 1% | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R42 | 30.9 kΩ | 1 | 0603 thick-film 1% | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R45 | 68 kΩ | 1 | 0603 thick-film 1% | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R46 | 2.4 kΩ | 1 | 0603 thick-film 1% | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R48, R49, R56 | 39 kΩ | 3 | 0603 thick-film 1% | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R52 | 1 kΩ | 1 | 0603 thin-film 0.1% | [Yageo Thin Film](https://www.lcsc.com/product-detail/C110776.html) |
| R53 | 220 mΩ | 1 | 0603 thick-film 1% | [Yageo RC Series](https://www.lcsc.com/product-detail/C326952.html) |
| R57 | 47 Ω | 1 | 1210 thick-film 5% 500 mW | [Yageo RC Series](https://www.lcsc.com/product-detail/C230466.html) |
| R59 | 12 kΩ | 1 | 0603 thick-film 1% | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R60 | 100 mΩ | 1 | 0603 thick-film 1% | [Yageo RC Series](https://www.lcsc.com/product-detail/C326946.html) |
| U1, U6 | LMR51610 | 2 | 4–65 V 1 A synchronous buck converter, SOT-23 | [TI LMR51610](https://www.ti.com/lit/ds/symlink/lmr51610.pdf) |
| U2 | INA219 | 1 | Current/power monitor with I²C, SOT-23-8 | [TI INA219](https://www.ti.com/lit/ds/symlink/ina219.pdf) |
| U3 | ESP32-S3-WROOM-1-N16R8 | 1 | Dual-core Wi-Fi/BT MCU module, 16 MB flash, 8 MB PSRAM | [Espressif ESP32-S3-WROOM-1](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf) |
| U4 | HT7833 | 1 | 3.3 V LDO regulator, SOT-89 | [Holtek HT78xx Series](https://www.holtek.com/page/detail/dev_tool/HT78xx) |
| U5 | SN65HVD234DR | 1 | 3.3 V CAN transceiver, SOIC-8 | [TI SN65HVD234](https://www.ti.com/lit/ds/symlink/sn65hvd234.pdf) |
| U7–U9 | TLP2309 | 3 | High-speed logic gate opto-isolator, SO-6 | [Toshiba TLP2309](https://toshiba.semicon-storage.com/ap-en/semiconductor/product/isolators-solid-state-relays/detail.TLP2309.html) |
| U10 | NUP2105LT1G | 1 | Dual-line CAN TVS diode array, SOT-23 | [Onsemi NUP2105LT1G](https://www.onsemi.com/pdf/datasheet/nup2105l-d.pdf) |
| U11 | ZXTR2012 | 1 | 12 V linear regulator, SOT-23 | [Diodes Inc ZXTR2012](https://www.diodes.com/assets/Datasheets/ZXTR2012.pdf) |
| U12 | OPT3004 | 1 | Ambient light sensor, WSON-6 | [TI OPT3004](https://www.ti.com/lit/ds/symlink/opt3004.pdf) |
| U13 | TMP112 | 1 | ±0.5 °C digital temperature sensor, SOT-563 | [TI TMP112](https://www.ti.com/lit/ds/symlink/tmp112.pdf) |

## PCB Design Notes

<SchematicViewer src="/img/schematics/mdd400-v2.9/pcb_markings.svg" alt="PCB markings" />

### Board Stackup

4-layer FR4 PCB with ENIG (immersion gold) surface finish and dark blue solder mask.

| Layer | Material | Thickness (mm) | Notes |
|---|---|---|---|
| L1 (F.Cu) | Outer copper 0.5 oz | 0.0175 | Plated to 1 oz |
| Prepreg | 7628 RC46%, DK 4.74 | 0.1855 (laminated) | |
| L2 (In1.Cu) | Inner copper 1 oz | 0.035 | Ground plane |
| Core | FR4, DK 4.6 | 1.1 (with Cu) | |
| L3 (In2.Cu) | Inner copper 1 oz | 0.035 | Power plane |
| Prepreg | 7628 RC46%, DK 4.74 | 0.1855 (laminated) | |
| L4 (B.Cu) | Outer copper 0.5 oz | 0.0175 | Plated to 1 oz |
| Solder mask | Epoxy, dark blue | 0.012 each side | Tented vias (front and back) |

### Fiducials

Four fiducials (FID1–FID4) are placed on the PCB for automated optical inspection (AOI) and pick-and-place alignment.

### Compliance Markings

The PCB silkscreen includes the following compliance marks:
- **CE** — EU Conformité Européenne
- **FCC** — US Federal Communications Commission
- **UKCA** — UK Conformity Assessed
- **RoHS** — Restriction of Hazardous Substances

Additional silkscreen labels:
- MDD400 version label (v2.8 silkscreen, updated to v2.9 in production)
- SixSense product logo
- © 2025 GM Consolidated Holdings Pty Ltd
- `docs.scadys.com/mdd400`
