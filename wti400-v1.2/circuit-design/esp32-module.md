---
title: ESP32 Module
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — test vessel (~1,000 sea miles)"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/wti400-v1.2/esp32_module_d5db8452.svg" alt="ESP32 module schematic — full sheet (MCU module, supply bypass, ESP-PROG programming socket). Zoom and pan freely; per-sub-circuit zoomed views appear below." />

:::note[Hardware version]

WTI400 **v1.2** — In service on the test vessel. Approximately 1,000 sea miles accumulated running a simple PlatformIO/Arduino firmware on the ESP32 with **Wi-Fi never enabled** and **BLE** only exercised during early BLE-library development on test hardware. The firmware emits NMEA 2000 wind sentences with hard-coded start-up speed-conversion and installation-angle constants and hard-coded initial WIND_X / WIND_Y ADC limits; the limits and midpoint are then self-adjusted at run-time as new extremes are observed. I2C bus runs at **Standard mode (100 kHz)**. A production ESP-IDF firmware is the next major project task. Subjective in-service performance is satisfactory; the Testing & Verification section lists what's still to be measured.

:::

## Overview

This page documents the WTI400's main application processor — an Espressif ESP32-S3-WROOM-1-N16R8 module — and its host-side surroundings on `esp32_module.kicad_sch`: VCC bypass, control-line RC networks, and the I2C bus pull-ups. The firmware-programming hardware (J1 ESP-PROG IDC socket, the optional HT7833 LDO U4, isolation Schottkys D4 / D5, and the production-variant R24 zero-ohm bridge) is also on this sheet but is documented on its own [Programming Socket](./programming-socket.md) page.

Two sub-circuits in narrative order:

- **ESP32-S3 module and signal map** — U3 itself, its global-label fan-out to every other sub-sheet, and the antenna-end clearance treatment.
- **VCC supply bypass and control-line RC networks** — multi-stage VCC decoupling at U3's 3V3 pads, the EN power-on RC, the IO0 boot-strap RC, and the I2C bus pull-ups (R3 SCL, R4 SDA).

## Functional specification and design objectives

The ESP32 module circuit must:

- house a pre-certified, dual-core Wi-Fi/Bluetooth MCU module with enough on-board flash and PSRAM to run the WTI400 firmware without external memory;
- expose the module's I/O cleanly to every other sub-sheet via hierarchical global labels so the system-level schematic stays readable;
- maintain the module's pre-certification by satisfying Espressif's antenna keep-out requirement on the PCB;
- provide multi-stage VCC bypass at U3's 3V3 castellated pads, sized to handle ESP32-S3 Wi-Fi TX current pulses without sagging the 3.3 V rail;
- hold ESP_EN (CHIP_PU) and ESP_BOOT (IO0) at clean, well-defined logic states during power-up and during normal operation;
- time the EN release after VCC stabilises, satisfying Espressif's minimum reset-extension requirement; and
- pull the shared I2C bus (SDA, SCL) up to VCC at a value compatible with both the current Standard-mode firmware and the on-PCB bus capacitance.

## ESP32-S3 module and signal map

<SchematicViewer src="/img/schematics/wti400-v1.2/esp32_module_d5db8452.svg" alt="ESP32-S3 module sub-circuit — U3 (ESP32-S3-WROOM-1-N16R8) with all hierarchical global labels for inter-sheet signal fan-out." initialFocus="13.335 12.7 132.715 95.25" />

### How it works

**U3 — ESP32-S3-WROOM-1-N16R8** is an Espressif system-in-package module carrying:

- ESP32-S3 dual-core Xtensa LX7 SoC at up to 240 MHz,
- 16 MB QSPI flash,
- 8 MB PSRAM,
- 2.4 GHz Wi-Fi + BT 5 LE radio with integrated PCB antenna,
- FCC / CE / IC pre-certifications.

The module's only supply input is the 3.3 V VCC rail from the [Power Supply](./power-supplies.md) page. All bypass, EN, BOOT, and I2C pull-up infrastructure on this sheet sits on that rail.

U3 fans out to every other sub-sheet through hierarchical global labels. Functionally:

| Signal group | Labels | Direction | Counterpart sub-sheet |
|---|---|---|---|
| Wind transducer analog | WIND_X, WIND_Y | ADC input (U3 → ADC) | [Wind Interface](./wind-interface.md) |
| Wind transducer pulse | WIND_SPD | Edge-triggered GPIO | [Wind Interface](./wind-interface.md) |
| Wind transducer control | WND_EN, WND_ERR | GPIO out / GPIO in | [Wind Interface](./wind-interface.md) |
| CAN / NMEA 2000 | TWAI_TX, TWAI_RX, TWAI_EN | UART-like | [CAN Transceiver](./can-transceiver.md) |
| Legacy serial | ST_TX, ST_RX, ST_EN | UART2 | [Legacy Serial Interface](./legacy-serial.md) |
| Motion sensing | I2C_SDA, I2C_SCL | I2C bus | [Motion Sensor](./motion-sensor.md) |
| Local UI | BUTTON, LED_RED, LED_GRN, LED_BLU | GPIO | [Button Input](./button.md) / [LED Indicator](./led-indicator.md) |
| Programming | ESP_TX, ESP_RX, ESP_EN, ESP_BOOT | UART0 + control | J1 (this sheet) |

The I2C bus pull-ups (R3, R4) live on this sheet rather than on the motion-sensor sheet because the bus is shared and the pull-ups belong with the master rather than any one slave. They're described under the *VCC supply bypass and control-line RC networks* sub-circuit below.

**Antenna-end clearance.** The Espressif module datasheet requires the antenna projection area to be free of copper on all PCB layers. The WTI400 V1.2 layout achieves this with a physical PCB cutout under the antenna section: the substrate is removed entirely, which also removes any fill copper that might otherwise have been carried there by zone priority alone. No `keepout` rule area is needed because the cutout makes the requirement self-enforcing. Module pre-certification is preserved.

### Performance

| Parameter | Value | Notes |
|-----------|-------|-------|
| CPU clock (max) | 240 MHz | Dual-core LX7 |
| Flash | 16 MB QSPI | On-package |
| PSRAM | 8 MB | On-package |
| Wi-Fi PHY | 802.11 b/g/n, 2.4 GHz | Pre-certified module |
| Pre-certifications | FCC ID 2AC7Z-ESP32S3WROOM1, CE RED 2014/53/EU, IC | Maintained by antenna keep-out (cutout) |
| Antenna keep-out method | PCB cutout under antenna section | Substrate + copper removed; no rule area needed |
| Bypass and control-line decoupling | Described in next sub-circuit | C1/C3/C8 + EN/BOOT RC + I2C pull-ups |

## VCC supply bypass and control-line RC networks

<SchematicViewer src="/img/schematics/wti400-v1.2/esp32_module_d5db8452.svg" alt="VCC supply bypass and control-line RC networks sub-circuit — main 3V3 bypass cluster (C8 100 pF C0G, C3 100 nF, C1 10 µF) at U3 pads, LDO-output-side bypass (C16 10 µF, C17 100 nF), EN RC pair (R9 + C7), BOOT RC pair (R18 + C22), and I2C bus pull-ups (R3 SCL, R4 SDA)." initialFocus="146.05 12.7 137.16 76.2" />

### How it works

**Multi-stage VCC bypass at U3, ordered for force-commutation.** The bypass cluster is placed in a straight line from U3's pad 2 (the 3V3 castellated supply pad), smallest cap first:

- **C8 — 100 pF / 50 V C0G 0603** at the front, VCC pad as close to U3 pad 2 as the courtyards allow.
- **C3 — 100 nF / 50 V X7R 0603** immediately adjacent to C8, as close as the courtyards allow.
- **C1 — 10 µF / 25 V X7R 0805** immediately adjacent to C3, again as close as the courtyards allow.

Critically, the VCC pads of C8 / C3 / C1 are **isolated from the surrounding F.Cu VCC pour**: a narrow private VCC trace daisy-chains the three VCC pads, and the trace ties into the broader VCC pour through a single via only at the *far* end of C1. The current path from the pour into U3 is therefore forced to be **pour → via → C1 → C3 → C8 → U3 pad 2**, with no short-cut path that bypasses the caps. Each cap sees the U3 load current and contributes its frequency band — C8 catches the fastest transients first because of its low-ESL C0G construction, C3 fills in the mid band, C1 supplies bulk charge replenishment. Spreading-inductance shortcuts through the pour can't bypass any of them.

A second VCC bypass pair (C16 10 µF + C17 100 nF) sits 3.5 mm from U4 on the LDO output / programmer power side, providing decoupling on the same VCC node near the LDO junction. Total VCC bypass on the U3 supply: 100 pF + 2× 100 nF + 2× 10 µF — two times the Espressif minimum (100 nF + 10 µF).

**The stack-up does the very-high-frequency work.** Across the digital area, the four-layer board is poured as **VCC – GNDREF – GNDREF – VCC** (F.Cu and B.Cu both carry VCC; In1.Cu and In2.Cu carry unbroken GNDREF). This creates two VCC↔GNDREF plane pairs separated by 0.1855 mm prepreg — a distributed bypass capacitor across the whole digital region with no parasitic inductance and no ESR. The full reasoning is on the [Power Supply](./power-supplies.md#in-the-vcc-digital-area) page; the consequences specifically for U3 are:

- The 31 GND vias under U3's footprint drop straight to the two inner GNDREF planes — the return path for any current entering U3 pad 2 has essentially zero parasitic inductance.
- The discrete C8 / C3 / C1 chain handles transients up to the frequency where its own package ESL starts to dominate; above that, the plane-pair capacitance takes over with effectively zero ESL. The plane pair, not the discrete cluster, is what decouples U3 at the antenna's 2.4 GHz fundamental and its harmonics — which is also why the single tie-in via at C1's far end is sufficient rather than risky: the pour-side decoupling at GHz frequencies is the plane pair, not the via inductance.
- The unbroken inner GNDREF planes give the antenna an unbroken reference under its entire projection back into the board — important for the module's pre-certified RF behaviour to be preserved.

**EN power-on delay.** R9 (10 kΩ) pulls ESP_EN up to VCC; C7 (1 µF) sits from ESP_EN to GNDREF. The pair forms an RC charge curve that delays the EN assertion after the VCC rail comes up:

```
τ_EN = R9 × C7 = 10 kΩ × 1 µF = 10 ms
```

Time to reach the ESP32-S3's valid-HIGH threshold (≥ 0.75 × VCC ≈ 2.48 V) is approximately 1.4 × τ ≈ 14 ms. Espressif requires the EN RC to be ≥ 1 ms; 10 ms is a 10× margin and ensures the rail is fully stable before the SoC starts.

**BOOT strap.** R18 (10 kΩ) pulls ESP_BOOT (U3 IO0) up to VCC; C22 (100 nF) filters noise on the IO0 boot-strap node. The RC is much shorter:

```
τ_BOOT = R18 × C22 = 10 kΩ × 100 nF = 1 ms
```

IO0 reaches the valid HIGH well before EN releases (~14 ms later), so the module enters normal SPI-flash boot mode. During programming, ESP-PROG pulls IO0 low through J1 pin 6, overriding the pull-up, and the module enters ROM download mode when EN is then toggled.

**I2C bus pull-ups.** R3 (10 kΩ) on I2C_SCL and R4 (10 kΩ) on I2C_SDA are the bus pull-ups for the shared I2C connecting U3 to the [Motion Sensor](./motion-sensor.md) sub-sheet (and any other I2C peripherals added in future revisions). At Standard mode (100 kHz) the pull-up value is fine for any reasonable on-PCB bus capacitance. The Fast-mode (400 kHz) margin tightens (see the performance table); a V1.3 backlog item tracks reducing R3 / R4 to 4.7 kΩ if a firmware upgrade to 400 kHz is needed.

### Performance

| Parameter | Value | Notes |
|-----------|-------|-------|
| C8 (RF, first in chain) | 100 pF C0G | VCC pad courtyard-touching U3 pad 2 |
| C3 (mid, second in chain) | 100 nF X7R | Adjacent to C8 (courtyard-touching) |
| C1 (bulk, third in chain) | 10 µF X7R | Adjacent to C3 (courtyard-touching); single via to F.Cu VCC pour at far end |
| C16, C17 (LDO output side) | 10 µF + 100 nF | 3.5 mm from U4 |
| Total VCC bypass on U3 | 20 µF + 200 nF + 100 pF | 2× Espressif minimum |
| Bypass topology | Force-commutated daisy chain | Private VCC trace, isolated from F.Cu pour except at C1-far via |
| EN RC time constant τ | 10 ms | R9 × C7 |
| EN time to valid HIGH | ~14 ms | 1.4 × τ, threshold = 0.75 × VCC |
| EN trace length (J1 → R9/C7 cluster → U3 pad 3 / EN) | 57.1 mm | RC-limited signal, accepted for V1.2 (see *Gaps & next version*) |
| BOOT RC time constant τ | 1 ms | R18 × C22 |
| BOOT time to valid HIGH | ~2.2 ms | 2.2 × τ |
| I2C bus rise time t<sub>r</sub> @ C<sub>bus</sub> = 30 pF | 254 ns | 0.8473 × 10 kΩ × 30 pF — Standard mode pass, Fast mode pass |
| I2C bus rise time t<sub>r</sub> @ C<sub>bus</sub> = 50 pF | 424 ns | Standard mode pass, **Fast mode fail** |
| Maximum C<sub>bus</sub> for Standard mode (100 kHz) | 118 pF | t<sub>r</sub> ≤ 1000 ns at R<sub>pu</sub> = 10 kΩ |
| Maximum C<sub>bus</sub> for Fast mode (400 kHz) | 35 pF | t<sub>r</sub> ≤ 300 ns at R<sub>pu</sub> = 10 kΩ |
| I2C pull-up current | 0.29 mA per line | (3.3 − 0.4) V / 10 kΩ — well below ESP32-S3 I<sub>OL</sub> 20 mA spec |

## PCB Layout

All esp32_module components sit on F.Cu, on a four-layer board (1.6 mm total, ENIG finish) poured for the digital domain as **VCC – GNDREF – GNDREF – VCC**: F.Cu and B.Cu carry VCC, the two inner planes (In1.Cu / In2.Cu) carry unbroken GNDREF. U3 (148.3, 62.1, rotated −90°) is in the upper-right of the board with its antenna end at the right board edge (x ≈ 161.6).

- **Antenna clearance.** U3's antenna end faces the right board edge. A PCB board cutout under the antenna section physically removes the substrate and all fill copper from the antenna projection area, so no `rule_area` keepout is required and module pre-certification is preserved.
- **VCC bypass cluster — force-commutated daisy chain.** C8 (100 pF C0G), C3 (100 nF), and C1 (10 µF) are courtyard-touching adjacent to U3 pad 2 (the 3V3 supply pad), daisy-chained smallest-cap-first: C8 nearest pad 2 (y = 51.15), C3 next (y = 49.6), C1 outermost (y = 47.8). The three caps' VCC pads are deliberately isolated from the surrounding F.Cu VCC pour and connected to it through a single via at the C1-far end only (a ~0.2 mm private VCC trace at x ≈ 152.32), forcing the load current to traverse pour → via → C1 → C3 → C8 → U3 pad 2. (An earlier review pass mis-identified pad 3 as the VCC pad; corrected 2026-05-27 — pad 2 is 3V3/VCC, pad 3 is EN. The as-built layout has the caps courtyard-touching pad 2.)
- **LDO-output decoupling.** C16 (10 µF) and C17 (100 nF) are 3.5 mm from U4 on the VCC node near the LDO output (U4 pad 3 = VCC directly). LDO input decoupling (C20 100 nF at 3.6 mm, C21 10 µF at 5.4 mm) and the U4/D4/D5/R24 programmer cluster sit at x ≈ 107–111 on the board's left side and are covered on the [Programming Socket](./programming-socket.md) page.
- **EN RC pair.** R9 (10 kΩ pull-up) and C7 (1 µF timing cap) are tightly paired 1.6 mm apart at (150.8, 50.4) / (149.2, 50.4), at the top of the VCC cluster (~21 mm from U3's EN pad at y = 70.85). The ESP_EN route from U3 through R9/C7 to J1 totals 57.1 mm — above the 50 mm guideline but accepted for V1.2 because the signal is RC-limited (see *Gaps & next version*).
- **BOOT RC pair.** R18 (10 kΩ pull-up) and C22 (100 nF filter) are paired 1.5 mm apart at (134.5, 73.7) / (136.0, 73.7), nearer J1 than U3. ESP_BOOT routes J1 pin 6 → R18/C22 → U3 pad 27 in 18.8 mm total — adequate, as BOOT is toggled only during programming.
- **I2C pull-ups.** R3 (SCL) and R4 (SDA) are co-located 1.4 mm apart at (139.2, 50.2) / (140.6, 50.2) in the VCC cluster area, feeding the I2C bus labels that route to the motion-sensor sub-sheet. Adequate for a 400 kHz I2C bus.
- **UART routing.** ESP_TX (~33.1 mm) and ESP_RX (~30.6 mm) are both under the 50 mm threshold, so no 33 Ω series damping resistors are required.
- **Ground / decoupling planes.** 31 GNDREF vias under U3's footprint stitch F.Cu to B.Cu and drop straight to the two inner GNDREF planes, giving near-zero return-path inductance for current entering U3 pad 2. U3 pad 41 (the internal exposed-pad array) uses a solid (zone_connect = 2) connection to the GNDREF fill. No inner-plane copper sits under the U3 module body, and the unbroken inner GNDREF planes provide a continuous RF reference under the antenna projection.

## Components

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| U3 | ESP32-S3-WROOM-1-N16R8 | Espressif dual-core Xtensa LX7 MCU module, 240 MHz, 16 MB QSPI flash, 8 MB PSRAM, 2.4 GHz Wi-Fi + BT 5 LE, pre-certified | [Espressif ESP32-S3-WROOM-1](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf) |
| R3 | 10 kΩ 0603 ±1 % | I2C bus pull-up — VCC to I2C_SCL | [Yageo RC Group](https://yageogroup.com/content/datasheet/asset/file/PYU-RC_GROUP_51_ROHS_L) |
| R4 | 10 kΩ 0603 ±1 % | I2C bus pull-up — VCC to I2C_SDA | [Yageo RC Group](https://yageogroup.com/content/datasheet/asset/file/PYU-RC_GROUP_51_ROHS_L) |
| R9 | 10 kΩ 0603 ±1 % | EN pull-up — VCC to ESP_EN (U3 CHIP_PU). With C7 forms power-on RC delay (τ = 10 ms) | [Yageo RC Group](https://yageogroup.com/content/datasheet/asset/file/PYU-RC_GROUP_51_ROHS_L) |
| R18 | 10 kΩ 0603 ±1 % | BOOT pull-up — VCC to ESP_BOOT (U3 IO0). Selects SPI flash boot mode during normal operation | [Yageo RC Group](https://yageogroup.com/content/datasheet/asset/file/PYU-RC_GROUP_51_ROHS_L) |
| C1 | 10 µF / 25 V X7R 0805 | VCC main-cluster bulk bypass, third in chain from U3 pad 2 (single via to F.Cu VCC pour at far end) | [Murata GRM21BZ71E106KE15L](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |
| C3 | 100 nF / 50 V X7R 0603 | VCC main-cluster mid-frequency bypass, second in chain (between C8 and C1) | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C7 | 1 µF / 25 V X7R 0603 | EN RC timing capacitor (ESP_EN to GNDREF). τ = 10 ms with R9 | [Murata GCM188R71E105KA64D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71E105KA64D) |
| C8 | 100 pF / 50 V C0G 0603 | VCC main-cluster RF bypass, first in chain (VCC pad courtyard-touching U3 pad 2) | [Murata GRM1885C1H101JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D) |
| C16 | 10 µF / 25 V X7R 0805 | LDO-output-side VCC bulk bypass, ~3.5 mm from U4 (LDO described on the [Programming Socket](./programming-socket.md) page) | [Murata GRM21BZ71E106KE15L](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |
| C17 | 100 nF / 50 V X7R 0603 | LDO-output-side VCC mid-frequency bypass | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C22 | 100 nF / 50 V X7R 0603 | BOOT filter (ESP_BOOT to GNDREF). τ = 1 ms with R18 | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |

Programming-socket components (U4, D4, D5, J1, R24, C20, C21) are listed on the [Programming Socket](./programming-socket.md) page.

## Testing & Verification

:::caution

The V1.2 prototype on the test vessel has been in service for approximately 1,000 sea miles running the PlatformIO/Arduino firmware described in the operating-context note at the top of this page (Wi-Fi has never been enabled; BLE only exercised during early library development on test hardware). Programming via the ESP-PROG adapter has been confirmed working on both WTI400 V1.2 and MDD400 V2.9. **No quantitative bench measurements have been performed on the VCC bypass, EN RC, BOOT RC, or LDO thermal behaviour yet.** The following are required.

**Hardware bring-up (rig at the bench):**

- **VCC rail under Wi-Fi TX** — Probe at U3 pad 2 during a sustained 802.11b TX burst. Pass if the rail stays within ±3 % of 3.30 V with no individual dip below 3.10 V.
- **EN release timing** — Trigger on VCC rising; capture ESP_EN. Pass if ESP_EN crosses 2.48 V ≥ 10 ms after VCC reaches 3.0 V.
- **I2C rise time** — Capture SDA / SCL transitions during normal Standard-mode (100 kHz) operation. Record 30 %-to-70 % t<sub>r</sub> and infer C<sub>bus</sub>. Pass if t<sub>r</sub> ≤ 1000 ns.

Programmer-side bring-up (end-to-end programming, D4 back-feed check, U4 thermal soak) is on the [Programming Socket](./programming-socket.md) page.

:::

## Gaps & next version

**Before next production run**

- **I2C Fast-mode bus characterisation** — If firmware is upgraded to I2C Fast mode (400 kHz), measure SCL / SDA rise time at 400 kHz. Pass if t<sub>r</sub> ≤ 300 ns. If C<sub>bus</sub> exceeds 35 pF (the threshold for 400 kHz with 10 kΩ pull-ups), reduce R3 / R4 to 4.7 kΩ before enabling Fast mode.

**Next version (V1.3)**

- **Shorten the ESP_EN routing** — V1.2 has a 57.1 mm ESP_EN trace from J1 through R9 / C7 to U3 pad 3 (EN). The signal is RC-limited and the trace is acceptable as-is, but the route picks up board noise before the SoC is active. Re-route R9 / C7 closer to U3's EN pad to bring the trace below the 50 mm guideline.
- **Reduce I2C pull-ups for Fast-mode capability** — If firmware needs 400 kHz I2C, drop R3 / R4 to 4.7 kΩ to widen the C<sub>bus</sub> margin from 35 pF up to ~75 pF.

## References

- Espressif Systems, [*ESP32-S3-WROOM-1 & WROOM-1U Module Datasheet*](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf).
- Espressif Systems, [*ESP32-S3 Datasheet*](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf).
- Espressif Systems, [*ESP-IDF API Reference — GPIO & RTC GPIO*](https://docs.espressif.com/projects/esp-idf/en/v5.5/esp32s3/api-reference/peripherals/gpio.html).
- NXP Semiconductors, *UM10204 I²C-bus specification and user manual*, Rev 7.0, 2021.
- Yageo, [*RC Group Chip Resistor*](https://yageogroup.com/content/datasheet/asset/file/PYU-RC_GROUP_51_ROHS_L).
- Murata Electronics, [*GRM21BZ71E106KE15L — 10 µF X7R 0805*](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L).
- Murata Electronics, [*GCM188R71H104KA57D — 100 nF X7R 0603*](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D).
- Murata Electronics, [*GCM188R71E105KA64D — 1 µF X7R 0603*](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71E105KA64D).
- Murata Electronics, [*GRM1885C1H101JA01D — 100 pF C0G 0603*](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D).

## Related pages

- [Programming Socket](./programming-socket.md) — J1 ESP-PROG IDC header, HT7833 LDO, isolation Schottkys, and the production-variant R24 bridge that share this sheet
- [Power Supplies](./power-supplies.md) — derives the 3.3 V VCC rail and the VCC–GNDREF plane-pair stack-up that decouples U3
- [Motion Sensor](./motion-sensor.md) — the I2C slave served by the R3 / R4 bus pull-ups on this sheet
- [Pin Assignments](/wti400/v1.2/quick-reference/pin-assignments) — the full U3 GPIO map behind the signal-fan-out table
