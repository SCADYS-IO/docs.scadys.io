---
title: Quick Reference
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]

WTI400 **v1.2** — In service — installed on test vessel

:::

## Pin Assignments

| Label | GPIO | Bias | Function | Description |
|---|---|---|---|---|
| I2C_SCL | GPIO8 | VCC | I²C | I²C clock — R3 10 kΩ pull-up to VCC |
| I2C_SDA | GPIO18 | VCC | I²C | I²C data — R4 10 kΩ pull-up to VCC |
| TWAI_RX | GPIO12 | float | TWAI | CAN RX from SN65HVD234 TXD (R14 47 Ω series) |
| TWAI_TX | GPIO13 | VCC | TWAI | CAN TX to SN65HVD234 RXD (R15 10 kΩ pull-up) |
| TWAI_EN | GPIO14 | GNDREF | TWAI | CAN transceiver enable — R16 10 kΩ pull-down; pull HIGH to enable |
| WIND_X | GPIO10 | float | ADC1 CH9 | X-axis wind angle — analog via U12A op-amp |
| WIND_Y | GPIO11 | float | ADC2 CH0 | Y-axis wind angle — analog via U12B op-amp |
| WIND_SPD | GPIO21 | float | INPUT | Wind speed pulse — Schmitt-triggered via U11 74LVC1G17 |
| WND_EN | GPIO47 | VCC | OUTPUT | Wind transducer supply enable — LP2951 U13 SHUTDOWN (R55 10 kΩ, active LOW) |
| WND_ERR | GPIO48 | VCC | INPUT | Wind transducer supply error — LP2951 U13 ERROR (R65 10 kΩ pull-up, open-drain, active LOW) |
| LED_RED | GPIO17 | GNDREF | OUTPUT | Red LED — Q1 PNP fail-on driver (R6 68 kΩ pulls base LOW by default; HIGH overrides) |
| LED_GRN | GPIO15 | VCC | OUTPUT | Green LED — R11 220 Ω, active LOW, common-anode D1 (R7 10 kΩ pull-up) |
| LED_BLU | GPIO7 | VCC | OUTPUT | Blue LED — R10 220 Ω, active LOW, common-anode D1 (R8 10 kΩ pull-up) |
| BUTTON | GPIO40 | VCC | INPUT | User button — R41 10 kΩ pull-up, R31 series, U10 Schmitt, R40/C38 RC debounce (τ = 39 ms) |
| ST_TX | GPIO41 | float | UART1 | Legacy serial TX — to opto-isolator U7 TLP2309 |
| ST_RX | GPIO39 | VCC | UART1 | Legacy serial RX — from opto-isolator U6 TLP2309 (R19 2.2 kΩ pull-up) |
| ST_EN | GPIO1 | VCC | OUTPUT | Legacy serial TX enable — R20 10 kΩ pull-up, active LOW; HIGH = TX disabled |
| ESP_TX | GPIO43 | float | UART0 | Programming UART TX — ESP-PROG J1 pin 3 |
| ESP_RX | GPIO44 | float | UART0 | Programming UART RX — ESP-PROG J1 pin 5 |
| ESP_EN | EN | VCC | BOOT | Chip enable / reset — R9 10 kΩ pull-up, C7 1 µF power-on delay (τ = 10 ms) |
| ESP_BOOT | GPIO0 | VCC | BOOT | Boot mode select — R18 10 kΩ pull-up, C22 100 nF; LOW at reset = ROM download mode |

## I²C Addresses

| Device | I²C Address | Ref | Notes |
|---|---|---|---|
| LSM6DSLTR 6DoF IMU | 0x6A | U1 | SA0 = GND (pin 1); CS = VDDIO (pin 12) selects I²C mode |

**Bus configuration:** R3 / R4 = 10 kΩ pull-ups to VCC. Rise time τ_r = 254 ns at C_bus = 30 pF (passes Standard and Fast mode). Maximum C_bus for Fast mode (400 kHz) with 10 kΩ pull-ups is 35 pF. Current firmware: Standard mode (100 kHz).

## Power Rails

| Rail | Voltage | Source | Loads |
|---|---|---|---|
| NET-S | 9–16 V (nom. 12 V) | NMEA 2000 backbone via J2 M12 | Input power — feeds CAN bus power sub-sheet |
| VSC | 9–14.8 V (protected) | Q2 PMV240SPR OVP switch, EMI filter L2/L3, fuse F1 | LMR51610 (→ VCC), LP2951 (→ VAS) |
| VCC | 3.3 V ±2 % | LMR51610XDBVR buck (U2), 1 A, 400 kHz | ESP32-S3 (U3), SN65HVD234 (U5), LSM6DSLTR (U1), signal logic |
| VAS | 8.65 V (8v4) or 6.89 V (6v8) | LP2951 LDO (U13), 25 mA rated | Wind transducer via J5 and D17 Schottky; WIND_8V = VAS − 0.35 V |
| VST | ~12 V (tracks NET-S above 12.9 V, dropout below) | ZXTR2012FF regulator (U14), 30 mA | Legacy serial opto-isolator bias (U6, U7, U8) |
| V_PROG | 3.3 V from 5 V programmer | HT7833 LDO (U4) — **developer variant only** | VCC during programming; DNP in production (R24 0 Ω bridges VCC) |

**JP1 setpoints:** 8v4 position → VAS = 8.65 V → WIND_8V ≈ 8.30 V (Raymarine E22078). 6v8 position → VAS = 6.89 V → WIND_8V ≈ 6.54 V (B&G 213).

## External Connectors

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

## Component List

| Refs | Value | Qty | Description | Datasheet |
|---|---|---|---|---|
| U1 | LSM6DSLTR | 1 | ST 6DoF IMU, LGA-14, I²C/SPI, ±16 g / ±2000 dps | [ST LSM6DSL](https://www.st.com/resource/en/datasheet/lsm6dsl.pdf) |
| U2 | LMR51610XDBVR | 1 | TI 4–65 V / 1 A synchronous buck, SOT-23-6 | [TI LMR51610](https://www.ti.com/lit/ds/symlink/lmr51610.pdf) |
| U3 | ESP32-S3-WROOM-1-N16R8 | 1 | Espressif dual-core LX7 MCU, 16 MB flash, 8 MB PSRAM, Wi-Fi + BT5 LE | [Espressif ESP32-S3-WROOM-1](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf) |
| U4 | HT7833 | 1 | UMW 3.3 V LDO, SOT-89-3, 450 mA — **developer variant only** | [UMW HT7833-A](https://www.lcsc.com/datasheet/C347195.pdf) |
| U5 | SN65HVD234DR | 1 | TI CAN transceiver, 3.3 V, 1 Mbps, ISO 11898-2, SOIC-8 | [TI SN65HVD234](https://www.ti.com/lit/ds/symlink/sn65hvd234.pdf) |
| U6, U7, U8 | TLP2309 | 3 | Toshiba high-speed opto-isolator, SO-6, 3750–5000 Vrms | [Toshiba TLP2309](https://toshiba.semicon-storage.com/ap-en/semiconductor/product/isolators-solid-state-relays/detail.TLP2309.html) |
| U9 | NUP2105LT1G | 1 | onsemi dual-line CAN TVS array, SOT-23, 24 V standoff | [onsemi NUP2105L](http://www.onsemi.com/pub_link/Collateral/NUP2105L-D.PDF) |
| U10, U11 | 74LVC1G17GW | 2 | Nexperia Schmitt-trigger buffer, 1.65–5.5 V, TSSOP-5 | [Nexperia 74LVC1G17](https://assets.nexperia.com/documents/data-sheet/74LVC1G17.pdf) |
| U12 | TLV9002IDR | 1 | TI dual RRIO op-amp, 1 MHz GBW, SOIC-8 | [TI TLV9002](https://www.ti.com/lit/ds/symlink/tlv9002.pdf) |
| U13 | LP2951-50DR | 1 | TI adjustable LDO, 100 mA, 30 V max, SOIC-8 | [TI LP2951](http://www.ti.com/lit/ds/symlink/lp2951.pdf) |
| U14 | ZXTR2012FF | 1 | Diodes Inc. 12 V / 30 mA linear regulator, 100 V input, SOT-23F | [Diodes ZXTR2012FF](https://www.diodes.com/assets/Datasheets/ZXTR2012FF.pdf) |
| Q1 | BC807-25 | 1 | JSMSEMI PNP BJT, 45 V / 500 mA, SOT-323 | [Nexperia BC807](https://assets.nexperia.com/documents/data-sheet/BC807_SER.pdf) |
| Q2 | PMV240SPR | 1 | Nexperia P-MOSFET, 100 V / 1.2 A, SOT-23 | [Nexperia PMV240SPR](https://assets.nexperia.com/documents/data-sheet/PMV240SPR.pdf) |
| Q3, Q8 | MMBTA56LT1G | 2 | onsemi PNP BJT, 80 V / 500 mA, SOT-23 | [onsemi MMBTA56](https://www.onsemi.com/pdf/datasheet/mmbta56lt1-d.pdf) |
| Q4, Q7 | BC847BS | 2 | Nexperia NPN dual BJT, SOT-363 | [Nexperia BC847BS](https://assets.nexperia.com/documents/data-sheet/BC847BS.pdf) |
| Q5 | AO3407A | 1 | AOS P-MOSFET, 30 V / 4.2 A, SOT-23 | [AOS AO3407A](https://www.aosmd.com/pdfs/datasheet/AO3407A.pdf) |
| Q6 | 2N7002 | 1 | Nexperia N-MOSFET, 60 V / 300 mA, SOT-23 | [Nexperia 2N7002](https://assets.nexperia.com/documents/data-sheet/2N7002.pdf) |
| D1 | XL-3528RGBW-HM | 1 | XINGLIGHT SMD3528 common-anode RGB LED | [LCSC C2843813](https://www.lcsc.com/datasheet/C2843813.pdf) |
| D2, D14, D19 | PESD15VL1BA | 3 | Nexperia bidirectional TVS, 15 V, 200 W (8/20 µs), SOD-323 | [Nexperia PESD15VL1BA](https://assets.nexperia.com/documents/data-sheet/PESD15VL1BA.pdf) |
| D3 | BZT52C7V5S | 1 | Diodes Inc. zener 7.5 V, 200 mW, SOD-323 | [Diodes BZT52C](https://www.diodes.com/assets/Datasheets/BZT52C.pdf) |
| D4, D5, D7 | 1N5819WS | 3 | JSMSEMI Schottky, 40 V / 350 mA, SOD-323 | [JSMSEMI 1N5819WS](/assets/datasheets/wti400-v1.2/1N5819WS.pdf) |
| D6, D17 | BAT54J | 2 | Nexperia Schottky, SOD-323F | [Nexperia BAT54J](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf) |
| D8 | BZT52C15S | 1 | Diodes Inc. zener 15 V, 200 mW, SOD-323 | [Diodes BZT52C](https://www.diodes.com/assets/Datasheets/BZT52C.pdf) |
| D9, D13 | SS34 | 2 | MSKSEMI Schottky, 40 V / 3 A, SMA | [MSKSEMI SS34](https://www.lcsc.com/product-detail/C2836396.html) |
| D10 | BZT52C3V6S | 1 | Vishay zener 3.6 V, 200 mW, SOD-323 | [Vishay BZT52C](https://www.vishay.com/docs/85816/bzt52c.pdf) |
| D11 | SM8S36CA | 1 | FUXINSEMI bidirectional TVS, 36 V, 6.6 kW (8/20 µs), DO-218AB | [SMC SM8S36CA](https://www.smc-diodes.com/propdf/SM8S20CA%20THRU%20SM8S43CA%20N2149%20REV.-.pdf) |
| D12 | BAT54S | 1 | Nexperia dual series Schottky, 30 V, SOT-23 | [Nexperia BAT54S](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf) |
| D15 | SMCJ36CA | 1 | Littelfuse bidirectional TVS, 36 V, DO-214AB | [Littelfuse SMCJ36CA](https://www.littelfuse.com/assetdocs/smcj.pdf) |
| D16 | RBR3MM60BTR | 1 | ROHM Schottky, 60 V / 3 A, SOD-123FL | [ROHM RBR3MM60BTR](https://fscdn.rohm.com/en/products/databook/datasheet/discrete/diode/schottky_barrier/rbr3mm60btr-e.pdf) |
| D18, D20, D21, D22 | SD09C-7 | 4 | Diodes Inc. bidirectional TVS, 9 V, 400 W (8/20 µs), SOD-323F | [Diodes SD09C](https://www.diodes.com/assets/Datasheets/SD09C.pdf) |
| F1 | BSMD1812-050 | 1 | BHFUSE resettable PTC fuse, 500 mA hold, 60 V, 1812 | [LCSC C883142](https://www.lcsc.com/product-detail/C883142.html) |
| L1 | FNR5040S220MT | 1 | Shielded power inductor, 22 µH, 1.6 A, 5×5 mm | [LCSC C167971](https://www.lcsc.com/datasheet/C167971.pdf) |
| L2 | FHD4012S-4R7MT | 1 | Power inductor, 4.7 µH, 2.1 A, 4×4 mm | [cjiang FHD4012S](https://www.cjinductors.com/product/fhd4012s/) |
| L3 | FHD4012S-1R0MT | 1 | Power inductor, 1 µH, 3.5 A, 4×4 mm | [cjiang FHD4012S](https://www.cjinductors.com/product/fhd4012s/) |
| L4, L5, L6 | LQM18FN1R0M00D | 3 | Murata RF choke, 1 µH, 150 mA, 0603 | [Murata LQM18FN1R0M00D](https://www.murata.com/en-us/products/productdetail?partno=LQM18FN1R0M00D) |
| L7 | LQM18FN100M00D | 1 | Murata RF choke, 10 µH, 50 mA, 0603 | [Murata LQM18FN100M00D](https://www.murata.com/en-us/products/productdetail?partno=LQM18FN100M00D) |
| FB1, FB2, FB3 | BLM31KN601SN1L | 3 | Murata ferrite bead, 600 Ω @ 100 MHz, 1206 | [Murata BLM31KN601SN1L](https://www.murata.com/en-us/api/pdfdownloadapi?cate=luBLM&partno=BLM31KN601SN1L) |
| FL1 | ACT45B-510-2P-TL003 | 1 | TDK common-mode choke, 51 µH, 2800 Ω @ 10 MHz, 0.2 A, AEC-Q200 | [TDK ACT45B-510-2P](https://product.tdk.com/en/search/emc/emc/cmfc_auto/info?part_no=ACT45B-510-2P-TL003) |
| FL2 | SMCM7060-132T | 1 | SXN common-mode filter, 1.3 kΩ @ 100 MHz, 2-winding | [LCSC C381616](https://www.lcsc.com/datasheet/lcsc_datasheet_2108131830_SXN-Shun-Xiang-Nuo-Elec-SMCM7060-132T_C381616.pdf) |
| C33, C41, C42 | 22 µF / 100 V | 3 | 2220 X7R MLCC | [PSA FS55X225K251EGG](https://www.lcsc.com/product-detail/C153032.html) |
| C2, C14, C15 | 10 µF / 50 V | 3 | 1210 X7R MLCC | [Murata GRM32ER71H106KA12L](https://www.murata.com/en-us/products/productdetail?partno=GRM32ER71H106KA12L%40D) |
| C1, C16, C52, C54 | 10 µF / 25 V | 4 | 0805 X7R MLCC | [Murata GRM21BZ71E106KE15L](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |
| C36, C37 | 4.7 µF / 100 V | 2 | 1206 X7R MLCC | [Murata GRM31CR72A475KA73L](https://www.murata.com/en-us/products/search) |
| C51 | 4.7 µF / 25 V | 1 | 0805 X7R MLCC | [Murata GRM21BZ71E475KE15L](https://www.murata.com/en-us/products/search) |
| C39, C58 | 1 µF / 100 V | 2 | 1206 X7R MLCC | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C5, C7, C38 | 1 µF / 25 V | 3 | 0603 X7R MLCC | [Murata GCM188R71E105KA64D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71E105KA64D) |
| C32, C34 | 100 nF / 100 V | 2 | 0603 X7R MLCC | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C4, C10, C11, C17, C19, C20, C22, C23, C28, C30, C31, C35, C40, C43, C53, C55 | 100 nF / 50 V | 16 | 0603 X7R MLCC | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C6, C12 | 100 nF / 50 V | 2 | 0603 X7R MLCC (motion sensor VDDIO) | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C3 | 100 nF / 50 V | 1 | 0603 X7R MLCC (mid-freq VCC bypass) | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C8, C13 | 100 pF / 50 V | 2 | 0603 C0G MLCC | [Murata GRM1885C1H101JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D) |
| C24, C25, C26, C27 | 15 pF / 100 V | 4 | 0603 C0G MLCC (CAN CMC filter) | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C44, C45 | 1 nF / 50 V | 2 | 0603 C0G MLCC (wind ADC anti-alias) | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C46, C56 | 15 pF / 50 V | 2 | 0603 C0G MLCC | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C50, C49 | 100 pF / 50 V | 2 | 0603 C0G MLCC (legacy RX LC filter) | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C48 | 100 pF / 50 V | 1 | 0603 C0G MLCC (LP2951 feedforward CFF) | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C9 | 1 pF / 100 V | 1 | 0603 C0G MLCC (VCC FB feedforward) | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C47 | 2.2 nF / 50 V | 1 | 0603 C0G MLCC (legacy TX rise-time RC) | [Murata GRM1881X0J223JA01](https://www.murata.com/en-us/products/search) |
| C57 | 1 nF / 50 V | 1 | 0603 C0G MLCC (wind shield HF bypass) | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C10 (SW snubber), C29 (CAN diff) | 100 nF / 50 V or 100 pF / 50 V | — | **DNP** — see circuit docs for conditions | — |
| R1 | 32 kΩ | 1 | 0603 thin-film ±0.1 % (VCC feedback lower) | [Yageo Thin Film](https://www.lcsc.com/product-detail/C861839.html) |
| R2, R42, R55, R65, R74 | 100 kΩ | 5 | 0603 thick-film ±1 % | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R3, R4, R9, R15, R16, R18, R20, R31, R41 | 10 kΩ | 9 | 0603 thick-film ±1 % | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R5, R7, R8 | 10 kΩ | 3 | 0603 thick-film ±1 % (LED drive / pull-ups) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R19 | 2.2 kΩ | 1 | 0603 thick-film ±1 % (legacy RX pull-up) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R6 | 68 kΩ | 1 | 0603 thick-film ±1 % (Q1 base bias) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R10, R11 | 220 Ω | 2 | 0603 thick-film ±1 % (blue/green LED) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R12 | 680 Ω | 1 | 0603 thick-film ±1 % (red LED, Q1 path) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R14 | 47 Ω | 1 | 0603 thick-film ±1 % (SN65HVD234 RXD damping) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R17 | 10 kΩ | 1 | 0603 thick-film ±1 % (SN65HVD234 Rs slope) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R21, R23 | 390 Ω | 2 | 0603 thick-film ±1 % (legacy TX/EN opto LED limit) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R22 | 100 kΩ | 1 | 0603 thick-film ±1 % (legacy TX opto output VST pull-up) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R24 | 0 Ω (DNP) | 1 | 0603 zero-ohm — **production variant only** | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R25 | 4.7 Ω | 1 | 0603 thick-film ±1 % (OVP collector series) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R26, R34 | 22 kΩ | 2 | 0603 thick-film ±1 % | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R27 | 68 kΩ | 1 | 0603 thick-film ±1 % (OVP divider lower) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R28 | 2.4 kΩ | 1 | 0603 thick-film ±1 % (OVP divider upper) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R29, R33 | 22 kΩ | 2 | 0603 thick-film ±1 % (legacy RX/TX ST_SIG pull-up to VST) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R30 | 2.2 kΩ | 1 | 0603 thick-film ±1 % (legacy RX opto LED limit) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R32 | 390 Ω | 1 | 0603 thick-film ±1 % (legacy TX EN secondary) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R35, R68 | 39 kΩ | 2 | 0603 thick-film ±1 % | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R36, R38, R41 (see above) | 1 MΩ | 2 | 0603 thick-film ±1 % (legacy TX high-Z bias — R36, R38) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R37 | 30.9 kΩ | 1 | 0603 thick-film ±1 % (legacy TX gate driver) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R39 | 220 mΩ | 1 | 0603 thick-film ±1 % (CAN LC input damping) | [Yageo RC Series](https://www.lcsc.com/product-detail/C326952.html) |
| R40 | 39 kΩ | 1 | 0603 thick-film ±1 % (button debounce R) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R43 | 100 mΩ | 1 | 0603 thick-film ±1 % (CAN bulk ESR damping) | [Yageo RC Series](https://www.lcsc.com/product-detail/C326946.html) |
| R44, R45, R46 | 39 kΩ | 3 | 0603 thick-film ±1 % (legacy TX bias/timing) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R47, R54 | 22 kΩ | 2 | 0603 thick-film ±1 % (U12 bias divider upper) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R48, R53 | 68 kΩ | 2 | 0603 thick-film ±1 % (U12 bias divider lower) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R49, R52 | 56 kΩ | 2 | 0603 thick-film ±1 % (U12 Rg gain) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R50, R51 | 62 kΩ | 2 | 0603 thick-film ±1 % (U12 Rf feedback) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R56, R70 | 2.2 kΩ | 2 | 0603 thick-film ±1 % (legacy TX output stage) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R57 | 10 Ω | 1 | 0603 thick-film ±1 % (legacy TX series) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R58, R59, R60, R61 | 56 kΩ | 4 | 0603 thick-film ±1 % (U12 input attenuator/shunt) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R62 | 100 kΩ | 1 | 0603 thick-film ±1 % (wind speed divider lower) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R63 | 150 kΩ | 1 | 0603 thick-film ±1 % (wind speed divider upper) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R64 | 330 Ω | 1 | 0603 thick-film ±1 % (U11 input current limit) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R66 | 1 kΩ | 1 | 0603 thick-film ±1 % (legacy TX driver bias) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R67 | 390 Ω | 1 | 0603 thick-film ±1 % (Q6 gate drive) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R69 | 47 Ω | 1 | 1210 thick-film ±1 %, 500 mW (legacy RX LDO_VIN pulse damping) | [Yageo RC Series](https://www.lcsc.com/product-detail/C230466.html) |
| R71 | 12 kΩ | 1 | 0603 thick-film ±1 % (legacy TX rise-time RC discharge) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R72 | 120 kΩ | 1 | 0603 thick-film ±1 % (LP2951 upper feedback) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R73 | 39 kΩ | 1 | 0603 thick-film ±1 % (legacy TX feedback bias) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R75 | 1 MΩ | 1 | 0603 thick-film ±1 % (wind shield DC bleed) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R76 | 22 kΩ | 1 | 0603 thick-film ±1 % (WIND_SPD P-line pull-up to WIND_8V) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R77 | 6.2 kΩ | 1 | 0603 thick-film ±1 % (LP2951 lower feedback shunt, B&G) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R78 | 20 kΩ | 1 | 0603 thick-film ±1 % (LP2951 lower feedback main) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R79 | 0 Ω (DNP) | 1 | 0805 zero-ohm — **factory voltage select link** | — |
| SW1 | Tactile 6×6×12 mm | 1 | SPST N.O., 50 mA / 12 V, SMD | — |

## PCB Design Notes

<SchematicViewer src="/img/schematics/wti400-v1.2/pcb_markings_74767fa4.svg" alt="PCB markings" />

### Board Stackup

4-layer FR4 PCB, IPC-6012 Class 2, ENIG surface finish, dark blue solder mask. Board outline: 95.2 × 95.2 mm.

| Layer | Number | Type | Thickness | Role |
|---|---|---|---|---|
| F.Cu | 0 | Signal | 17.5 µm (0.5 oz, plated to ~35 µm) | Component side; VCC and GNDREF fills; routed signals |
| In1.Cu | 4 | Power / GND | 35 µm (1 oz) | GNDREF solid ground plane (return path) for top layer |
| In2.Cu | 6 | Power | 35 µm (1 oz) | GNDREF solid ground plane (return path) for bottom layer |
| B.Cu | 2 | Signal | 17.5 µm (0.5 oz, plated to ~35 µm) | GNDREF and VCC fills; signal routing |

### Compliance Markings

The PCB silkscreen includes:
- **CE** — EU Conformité Européenne
- **FCC** — US Federal Communications Commission
- **UKCA** — UK Conformity Assessed
- **RoHS** — Restriction of Hazardous Substances

Additional silkscreen labels:
- WTI400 v1.2 version label
- SixSense product logo
- © 2026 GM Consolidated Holdings Pty Ltd
- `docs.scadys.io/wti400`
