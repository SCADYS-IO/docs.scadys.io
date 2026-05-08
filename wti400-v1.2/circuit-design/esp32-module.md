---
title: ESP32 Module
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel Sunny Spells"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/wti400-v1.2/esp32_module_5df19389.svg" alt="ESP32 Module schematic" />

:::note Hardware version
WTI400 **v1.2** — In service — installed on test vessel Sunny Spells
:::

## Components

| Ref | Value | Description | Datasheet |
|---|---|---|---|
| U3 | ESP32-S3-WROOM-1-N16R8 | Espressif dual-core Xtensa LX7 MCU module, 240 MHz, 16 MB QSPI flash, 8 MB PSRAM, 2.4 GHz Wi-Fi + BT5 LE, integrated antenna, pre-certified (FCC/CE/IC) | [Espressif ESP32-S3-WROOM-1 Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf) |
| U4 | HT7833 | UMW HT7833-A 3.3 V fixed-output LDO regulator, SOT-89-3, 450 mA. Regulates programmer 5 V (V_PROG) to VCC (3.3 V) during firmware flashing. **Developer/kit variant only** — DNP in production builds | [UMW HT7833-A](https://www.lcsc.com/datasheet/C347195.pdf) |
| D4 | 1N5819WS | JSMSEMI Schottky diode, SOD-323, 40 V / 350 mA. Input isolation diode: anode at J1 V_PROG, cathode at U4 VIN. Prevents board VCC from back-feeding to the programmer when both are connected | [JSMSEMI 1N5819WS](/assets/datasheets/wti400-v1.2/1N5819WS.pdf) |
| D5 | 1N5819WS | JSMSEMI Schottky diode, SOD-323. Vout-to-Vin protection: cathode at U4 VIN, anode at VCC. Conducts only during power-down when output capacitors exceed the input rail — same function as D16 in the power_supplies sub-sheet | [JSMSEMI 1N5819WS](/assets/datasheets/wti400-v1.2/1N5819WS.pdf) |
| J1 | 2×3 2.54 mm IDC | XFCN BH254V-6P 2×3-pin through-hole IDC header. ESP-PROG-compatible programming interface: Pin 1 = ESP_EN, Pin 2 = V_PROG, Pin 3 = ESP_TX, Pin 4 = GNDREF, Pin 5 = ESP_RX, Pin 6 = ESP_BOOT. **Developer/kit variant only** | [XFCN BH254V-6P](/assets/datasheets/wti400-v1.2/XFCN-BH254V-6P.pdf) |
| R9 | 10 kΩ | Pull-up resistor — VCC to ESP_EN (U3 CHIP_PU). Holds module in active state during normal operation | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R18 | 10 kΩ | Pull-up resistor — VCC to ESP_BOOT (U3 IO0). Holds IO0 HIGH to select SPI flash boot mode during normal operation | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R3 | 10 kΩ | I2C pull-up — VCC to I2C_SCL | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R4 | 10 kΩ | I2C pull-up — VCC to I2C_SDA | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R24 | 0 Ω (DNP) | Zero-ohm solder-bridge link. **Production variant only** — when populated (and U4/D4/D5/J1 DNP), directly bridges VCC to V_PROG; board supply powers the pogo-pin programmer directly | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C7 | 1 µF / 25 V | RC timing capacitor — ESP_EN net to GNDREF. Forms τ = 10 ms power-on delay with R9 | [Murata GCM188R71E105KA64D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71E105KA64D) |
| C22 | 100 nF / 50 V | RC filter capacitor — ESP_BOOT net to GNDREF. Noise filter on IO0 boot-strap | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C8 | 100 pF / 50 V | C0G RF bypass — VCC to GNDREF, < 1 mm from U3 pad 3 | [Murata GRM1885C1H101JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D) |
| C3 | 100 nF / 50 V | Mid-frequency bypass — VCC to GNDREF, < 1 mm from U3 pad 3 | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C1 | 10 µF / 25 V | Bulk bypass — VCC to GNDREF, 0805, < 1 mm from U3 pad 3 | [Murata GRM21BZ71E106KE15L](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |
| C16 | 10 µF / 25 V | Bulk bypass — VCC to GNDREF, LDO output side | [Murata GRM21BZ71E106KE15L](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |
| C17 | 100 nF / 50 V | Mid-frequency bypass — VCC to GNDREF, LDO output side | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C20 | 100 nF / 50 V | LDO input bypass — V_PROG / Net-(D4-K) to GNDREF | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C21 | 10 µF / 25 V | LDO input bulk bypass — V_PROG / Net-(D4-K) to GNDREF | [Murata GRM21BZ71E106KE15L](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |

## How It Works

The ESP32 module sub-sheet provides the main application processor for the WTI400. It is centred on an Espressif ESP32-S3-WROOM-1-N16R8 module (U3) — a dual-core Xtensa LX7 at up to 240 MHz, with 16 MB QSPI flash, 8 MB PSRAM, integrated 2.4 GHz Wi-Fi and BT5 LE, and a pre-certified integrated PCB antenna. U3 interfaces with all other sub-sheets via global labels: TWAI_TX / TWAI_RX / TWAI_EN (CAN transceiver), I2C_SDA / I2C_SCL (motion sensor and other I2C peripherals), WIND_X / WIND_Y / WIND_SPD / WND_EN / WND_ERR (wind interface), ST_TX / ST_RX / ST_EN (legacy serial), LED_RED / LED_GRN / LED_BLU and BUTTON (button/LED sub-sheet), and ESP_TX / ESP_RX / ESP_EN / ESP_BOOT (programming interface). I2C bus pull-ups R3 (SCL) and R4 (SDA) are on this sub-sheet in the VCC domain.

The schematic supports two build variants for the programming power path. The **developer/kit variant** — the V1.2 build including the unit on *Sunny Spells* — has U4, D4, D5, and J1 populated. V_PROG from J1 Pin 2 passes through D4 (input isolation Schottky) to U4 VIN; U4 (HT7833 LDO) regulates the programmer's 5 V down to 3.3 V; U4 VOUT connects directly to VCC. D4 prevents the board VCC from back-feeding to the programmer when both are simultaneously connected. D5 is a Vout-to-Vin protection diode (cathode at U4 VIN, anode at VCC) — reverse-biased during normal operation, it conducts only during power-down to prevent the VCC output capacitors from back-charging U4 through its internal body diode; the same topology as D16 in the power supplies sub-sheet. R24 (0 Ω) is DNP. In the **production variant**, R24 is populated and U4 / D4 / D5 / J1 are all DNP: VCC is bridged directly to V_PROG and programming is performed by a pogo-pin fixture contacting the J1 THT pad footprint.

The J1 programming header (2×3, 2.54 mm pitch, IDC-compatible) matches the standard Espressif ESP-PROG 6-pin pin-out and has been verified working with the standard ESP-PROG programmer and cable on both MDD400 V2.9 and WTI400 V1.2. The TX / RX signals are named from the module's frame of reference; the programmer adapter performs the required TX/RX swap.

U3 EN (CHIP_PU) is pulled to VCC through R9 (10 kΩ), with C7 (1 µF) from the ESP_EN net to GNDREF forming an RC power-on delay (τ = 10 ms). U3 IO0 (ESP_BOOT) is pulled to VCC through R18 (10 kΩ) with C22 (100 nF) to GNDREF as a noise filter, selecting SPI flash boot mode during normal operation. During programming, the ESP-PROG tool pulls ESP_BOOT low and toggles ESP_EN to enter ROM download mode.

## Design Rationale

The dual-variant LDO / zero-ohm topology provides developer-grade protection without a hardware penalty in production. During development, U4 (HT7833) protects U3 from overvoltage if the ESP-PROG adapter jumper is inadvertently set to 5 V; in production the LDO and isolation diodes are simply omitted and a zero-ohm link takes their place. The WTI400 uses one isolation diode (D4) compared to MDD400's three, because the WTI400 has no separate 5 V VDD bus requiring protection — the V_PROG path connects directly to U4 VIN.

The PCB antenna of the ESP32-S3-WROOM-1 is positioned at the board edge with a board cutout underneath the antenna section, satisfying the Espressif copper-free clearance requirement without requiring a layout keepout zone. The VCC bypass capacitors (C8 100 pF C0G, C3 100 nF, C1 10 µF) are placed < 1 mm from U3 pad 3 (3V3 castellated pad, top row), meeting the Espressif 2–5 mm requirement for multi-stage decoupling.

## PCB Layout

All esp32_module components are on F.Cu. U3 is placed in the upper-right corner of the board, antenna end facing the right board edge. The LDO / programmer power cluster (U4, D4, D5, C20, C21, C16, C17, R24) is a compact group at x ≈ 107–111 mm, y ≈ 63–78 mm, adjacent to J1. The EN and BOOT RC pairs (R9/C7 and R18/C22) are tightly co-located, and the I2C pull-ups (R3, R4) are grouped at the top of the VCC zone.

| # | Requirement | Status | Evidence |
|---|---|---|---|
| P1 | U3 antenna faces board edge; no copper in antenna area | Met | Antenna end at right board edge; PCB cutout under antenna removes substrate and fill copper — Espressif clearance requirement met without keepout zone |
| P2 | VCC bypass caps within 2–5 mm of U3 3V3 pad | Met | C8, C3, C1 all < 1 mm from U3 pad 3 (top castellated row) |
| P3 | 100 pF C0G closest; 100 nF middle; 10 µF outer in bypass cluster | Partial | Within the cluster: C8 (100 pF) at y = 51.15, C3 (100 nF) at y = 49.6, C1 (10 µF) at y = 47.8 — ordering acceptable within the < 1 mm cluster |
| P4 | C16 / C17 near LDO output (VCC junction) | Met | C16 and C17 within 3.5–5.4 mm of U4 |
| P5 | U4 and input decoupling (C20, C21) close to J1 | Met | C20 3.6 mm, C21 5.4 mm from U4; J1 12.8 mm from U4 |
| P6 | D4, D5 close to J1 and U4; V_PROG path compact | Met | D4/D5 in vertical cluster with U4; full V_PROG path within 13 mm of J1 |
| P7 | J1 accessible for programmer / pogo-pin fixture | Partial | J1 at board interior (30 mm from nearest edge); pogo-pin fixture access from top surface is the practical method |
| P8 | EN RC pair (R9, C7) close to U3 EN pad | Partial | R9/C7 tightly paired (1.6 mm apart) but 21 mm from U3 EN pad — acceptable; ESP_EN is RC-limited |
| P9 | BOOT RC pair (R18, C22) close to U3 IO0 pad | Partial | R18/C22 tightly paired (1.5 mm apart); 18.8 mm trace from J1 to U3 BOOT pad |
| P10 | R3 / R4 I2C pull-ups near I2C bus entry | Met | R3/R4 co-located 1.4 mm apart; adequate for on-PCB 100 kHz I2C |
| G1 | Continuous GNDREF plane under U3 | Met | GNDREF zones on F.Cu (prio 12 + prio 15) and B.Cu (prio 12); 31 GNDREF vias under U3 footprint |
| G2 | No inner-plane copper under U3 body | Met | In1.Cu GNDREF zone covers SMPS region only (x ≈ 72–86 mm); no inner fill under U3 |
| D1 | Multi-stage VCC decoupling present | Met | 100 pF C0G + 100 nF + 20 µF total bulk on VCC rail |
| D4 | LDO input decoupling (C20, C21) within 2–5 mm of U4 VIN | Met | C20 within 3.6 mm, C21 within 5.4 mm of U4 VIN |
| T1 | U4 thermal spreading adequate for use case | Met | Net-(D4-K) copper on all 4 layers (56 mm² total) + 9 thermal vias; programming-only use; T_j ≈ 76.8 °C at 100 mA / 70 °C amb |

## Design Calculations

| Parameter | Value | Notes |
|---|---|---|
| U4 VIN (typical) | 4.65 V | V_PROG 5.0 V − D4 V_F 0.35 V |
| U4 LDO headroom | 1.05 V | 4.65 V − (3.3 V + 300 mV dropout) |
| EN power-on delay τ | 10 ms | R9 10 kΩ × C7 1 µF; 14× Espressif 1 ms minimum |
| EN valid HIGH time | ~14 ms | 1.4 × τ to reach ≥ 0.75 × VCC |
| BOOT RC τ | 1 ms | R18 10 kΩ × C22 100 nF |
| U4 P_d (100 mA programming) | 0.135 W | (4.65 − 3.3) × 0.10 |
| U4 T_j at 100 mA / 70 °C amb | 76.8 °C | 70 + 0.135 × 50 °C/W; margin 48.2 °C (38.5 %) |
| U4 R_θJA_eff (as-built) | ~50 °C/W | 4-layer 56 mm² copper + 9 vias; programming-only |
| ESP_TX / ESP_RX trace length | 33.1 / 30.6 mm | Below 50 mm threshold — no series damping required |
| I2C t_r at C_bus = 30 pF | 254 ns | 0.8473 × 10 kΩ × 30 pF; Standard and Fast mode pass |
| I2C t_r at C_bus = 50 pF | 424 ns | Passes Standard mode (≤ 1000 ns); fails Fast mode (≤ 300 ns) |
| Max C_bus for Fast mode (10 kΩ) | 35 pF | Threshold for 400 kHz with current pull-up values |

:::caution Verification required — In service — installed on test vessel Sunny Spells

**Verify during bring-up:**
- **I2C Fast-mode capability**: Current firmware uses Standard mode (100 kHz) — confirmed compliant with 10 kΩ pull-ups for C_bus ≤ 118 pF. If firmware is upgraded to Fast mode (400 kHz), verify C_bus ≤ 35 pF with a logic analyser and measure SCL/SDA rise times. Reduce R3/R4 to 4.7 kΩ if C_bus > 35 pF before enabling 400 kHz.

:::

## References

1. Espressif Systems, [*ESP32-S3-WROOM-1 & WROOM-1U Module Datasheet*](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf)
2. Espressif Systems, [*ESP32-S3 Datasheet*](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
3. Espressif Systems, [*ESP-PROG Hardware Guide*](https://docs.espressif.com/projects/esp-iot-solution/en/latest/hw-reference/ESP-Prog_guide.html)
4. Espressif Systems, [*ESP-IDF API Reference — GPIO & RTC GPIO*](https://docs.espressif.com/projects/esp-idf/en/v5.5/esp32s3/api-reference/peripherals/gpio.html)
5. UMW, *HT7833-A SOT-89 LDO Datasheet*, https://www.lcsc.com/datasheet/C347195.pdf
6. JSMSEMI, [*1N5819WS SOD-323 Schottky Diode Datasheet*](/assets/datasheets/wti400-v1.2/1N5819WS.pdf)
7. XFCN, [*BH254V-6P 2×3 2.54 mm IDC Header Datasheet*](/assets/datasheets/wti400-v1.2/XFCN-BH254V-6P.pdf)
8. NXP Semiconductors, *UM10204 I²C-bus specification and user manual*, Rev 7.0, 2021
9. Yageo, [*RC Group Chip Resistor Datasheet*](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf)
