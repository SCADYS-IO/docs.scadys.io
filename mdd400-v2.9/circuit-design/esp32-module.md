---
title: ESP32 Module
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype, bench-test phase. The board is the **developer/kit** assembly variant. The firmware-programming hardware (J1 / U4 / D3 / D4 / D5 populated, R22 DNP) is documented on its own [Programming Socket](./programming-socket) page.

:::

## Overview

This page documents the MDD400's main application processor — an Espressif ESP32-S3-WROOM-1-N16R8 module — and its host-side surroundings on `esp32_module.kicad_sch`: VCC bypass and the EN / BOOT control-line networks. Two other functional blocks are drawn on the same sheet but live on their own pages:

- The **firmware programming socket** (J1 IDC header, the optional HT7833 LDO U4, the three OR'ing Schottky diodes D3 / D4 / D5, and the production-variant zero-ohm bridge R22) → [Programming Socket](./programming-socket).
- The **status LED** (Q1 PNP switching the amber D2 LED via the LED_EN signal) → [LED Indicator](./led-indicator).

<SchematicViewer src="/img/schematics/mdd400-v2.9/esp32_module_4d7d3825.svg" alt="ESP32 module schematic — full sheet (MCU module, supply bypass, ESP-PROG programming socket, status LED). Zoom and pan freely; per-sub-circuit zoomed views appear below." />

Two sub-circuits on this page, in narrative order:

1. **ESP32-S3 module and signal map** — U3 itself, its global-label fan-out to every other sub-sheet, and the antenna-end clearance treatment.
2. **VCC supply bypass and control-line RC networks** — multi-stage VCC decoupling at U3's 3V3 pad, the EN power-on RC, and the IO0 boot-strap pull-up.

---

## ESP32-S3 module and signal map

<SchematicViewer src="/img/schematics/mdd400-v2.9/esp32_module_4d7d3825.svg" alt="ESP32-S3 module sub-circuit — U3 (ESP32-S3-WROOM-1-N16R8) with all hierarchical global labels for inter-sheet signal fan-out." initialFocus="13.335 12.7 132.715 95.25" />

### Functional specification and design objectives

- House a pre-certified, dual-core Wi-Fi/Bluetooth MCU module with enough on-board flash and PSRAM to run the MDD400 firmware (DGUS UI assets in flash, OTA dual-image layout, SPIFFS) without external memory.
- Expose the module's I/O cleanly to every other sub-sheet via hierarchical global labels so the system-level schematic stays readable.
- Maintain the module's pre-certification by satisfying Espressif's antenna keep-out requirement on the PCB.

### How it works

**U3 — ESP32-S3-WROOM-1-N16R8** is an Espressif system-in-package module carrying:

- ESP32-S3 dual-core Xtensa LX7 SoC at up to 240 MHz,
- 16 MB QSPI flash,
- 8 MB PSRAM,
- 2.4 GHz Wi-Fi + BT 5 LE radio with integrated PCB antenna,
- FCC / CE / IC pre-certifications.

**Why the N16R8 part variant.** The DGUS II display protocol on the [Display Interface](./display-interface) page uploads UI asset binaries to ESP flash; the OTA firmware update strategy requires a dual-partition layout holding two full firmware images simultaneously; and SPIFFS or LittleFS occupies additional flash. The 16 MB flash + 8 MB PSRAM variant provides the headroom for all three without a board revision when feature scope grows.

The module's only supply input is the 3.3 V VCC rail — described in the *VCC supply bypass* sub-circuit below.

U3 fans out to every other sub-sheet through hierarchical global labels. Functionally:

| Signal group | Labels | Direction | Counterpart sub-sheet |
|---|---|---|---|
| CAN / NMEA 2000 | TWAI_TX, TWAI_RX, TWAI_EN | UART-like | [CAN Transceiver](./can-transceiver) |
| Display interface | DISP_TX, DISP_RX, DISP_EN | UART + control | [Display Interface](./display-interface) |
| Legacy serial | ST_TX, ST_RX, ST_EN | UART | [Legacy Serial Interface](./legacy-serial) |
| I²C peripherals | I2C_SDA, I2C_SCL | I²C bus | [Power Monitor](./power-monitor), [Ambient Light Sensor](./ambient-light-sensor), [Temperature Sensor](./temperature-sensor) |
| Audio | AUDIO_PWM | PWM out | [Buzzer Driver](./buzzer-driver) |
| Status LED | LED_EN | GPIO out (default-on by HW bias) | [LED Indicator](./led-indicator) |
| Programming | ESP_TX, ESP_RX, ESP_EN, ESP_BOOT | UART0 + control | J1 (this sheet) |

#### I2C bus pull-ups

The MDD400 I²C bus is shared across three sensor slaves on the `i2c_sensors.kicad_sch` sub-sheet: the [Power Monitor](./power-monitor) (INA219 at 0x40), the [Ambient Light Sensor](./ambient-light-sensor) (OPT3004 at 0x44), and the [Temperature Sensor](./temperature-sensor) (TMP112 at 0x48). The bus pull-ups are placed physically on that sub-sheet (near the sensor cluster, so the GND return paths to the slaves are short), but logically they belong to the MCU and are documented here:

- **R1 — 10 kΩ** on I2C_SCL to VCC.
- **R2 + R3 — both 10 kΩ** on I2C_SDA to VCC, in parallel — i.e. **5 kΩ effective** on SDA.

The asymmetric pull-up choice (10 kΩ SCL, 5 kΩ SDA) compensates for the higher capacitive load on SDA — every slave on the bus contributes capacitance on SDA when it acknowledges, but only the master drives SCL. The bus runs at I²C **Standard Mode (100 kHz)**; rise-time at 5 kΩ ∥ 50 pF bus capacitance is τ ≈ 250 ns, well inside the 1000 ns Standard-Mode limit.

**Antenna-end clearance.** The Espressif module datasheet requires the antenna projection area to be free of copper on all PCB layers. The MDD400 V2.9 layout satisfies this with generous keep-out: the F.Cu GNDREF pour boundary sits ≥ 6.3 mm beyond the antenna end, the B.Cu GNDREF pour ≥ 10.9 mm, and the antenna is aligned with a dedicated board-edge slot. The 3 mm minimum is exceeded by a factor of two. Module pre-certification is preserved.

### Performance review

| Parameter | Value | Notes |
|-----------|-------|-------|
| CPU clock (max) | 240 MHz | Dual-core LX7 |
| Flash | 16 MB QSPI | On-package |
| PSRAM | 8 MB | On-package |
| Wi-Fi PHY | 802.11 b/g/n, 2.4 GHz | Pre-certified module |
| Pre-certifications | FCC ID 2AC7Z-ESP32S3WROOM1, CE RED 2014/53/EU, IC | Maintained by antenna keep-out |
| Antenna keep-out (F.Cu) | ≥ 6.3 mm | Exceeds 3 mm Espressif minimum |
| Antenna keep-out (B.Cu) | ≥ 10.9 mm | Exceeds 3 mm Espressif minimum |
| GND stitching vias under U3 | 41 vias, ~1.0 mm spacing at the right-column edge | ≤ 1.5 mm guideline met |

### Bring-up tests

1. **VCC rail under sustained Wi-Fi TX (worst-case load)** — Using a Wi-Fi-enabled test build (production firmware does not enable Wi-Fi), run a 30-minute 802.11b TX burst / TCP iperf at typical operating distance. Pass if the VCC rail (probed at U3 pad 2) stays within ±3 % of 3.3 V throughout, with no Wi-Fi disconnects.

---

## VCC supply bypass and control-line RC networks

<SchematicViewer src="/img/schematics/mdd400-v2.9/esp32_module_4d7d3825.svg" alt="VCC supply bypass and control-line RC networks sub-circuit — main 3V3 bypass cluster (C4 100 pF C0G, C2 100 nF, C1 10 µF) at U3 pad 2, additional bulk and mid-frequency bypass on the VCC pour (C16 / C26 10 µF, C17 / C22 / C29 100 nF, C3 1 µF), EN pull-up (R4 + C3 RC), and BOOT pull-up (R24)." initialFocus="146.05 12.7 137.16 76.2" />

### Functional specification and design objectives

- Provide multi-stage VCC bypass at U3's 3V3 castellated pad, sized to handle ESP32-S3 Wi-Fi TX current pulses without sagging the 3.3 V rail.
- Hold ESP_EN (CHIP_PU) and ESP_BOOT (IO0) at clean, well-defined logic states during power-up and during normal operation.
- Time the EN release after VCC stabilises, satisfying Espressif's minimum reset-extension requirement.

### How it works

**Multi-stage VCC bypass at U3, ordered for force-commutation.** The bypass cluster is placed in a straight line from U3's pad 2 (the 3V3 castellated supply pad), smallest cap first:

- **C4 — 100 pF / 50 V C0G 0603** at the front, VCC pad as close to U3 pad 2 as the courtyards allow.
- **C2 — 100 nF / 50 V X7R 0603** immediately adjacent to C4, as close as the courtyards allow.
- **C1 — 10 µF / 25 V X7R 0805** immediately adjacent to C2, again as close as the courtyards allow.

Critically, the VCC pads of C4 / C2 / C1 are **isolated from the surrounding F.Cu VCC pour**: a narrow private VCC trace daisy-chains the three VCC pads, and the trace ties into the broader VCC pour through a single via only at the *far* end of C1. The current path from the pour into U3 is therefore forced to be **pour → via → C1 → C2 → C4 → U3 pad 2**, with no short-cut path that bypasses the caps. Each cap sees the U3 load current and contributes its frequency band — C4 catches the fastest transients first because of its low-ESL C0G construction, C2 fills in the mid band, C1 supplies bulk charge replenishment. Spreading-inductance shortcuts through the pour can't bypass any of them.

Additional VCC decoupling sits on the broader VCC pour:

- **Mid-frequency band:** C17, C22, C29 (100 nF X7R each) distributed across the VCC pour for local decoupling near peripheral load points.
- **Bulk band:** C16 and C26 (10 µF X7R each) plus C3 (1 µF X7R) for low-frequency reservoir.

Total VCC bypass on the digital domain: 100 pF + 4× 100 nF + 1 µF + 3× 10 µF ≈ **31.4 µF** bulk + 400 nF mid + 100 pF RF — significantly above the Espressif minimum (100 nF + 10 µF at the 3V3 pin).

**The stack-up does the very-high-frequency work.** Across the digital area, the four-layer board is poured as **VCC – GNDREF – GNDREF – VCC** (F.Cu and B.Cu both carry VCC; In1.Cu and In2.Cu carry unbroken GNDREF). This creates two VCC↔GNDREF plane pairs separated by the prepreg stack — a distributed bypass capacitor across the whole digital region with no parasitic inductance and no ESR. The consequences specifically for U3 are:

- The GNDREF stitching vias under U3's footprint (41 in total, with a tight ~1.0 mm column at the right edge) drop straight to the two inner GNDREF planes — the return path for any current entering U3 pad 2 has essentially zero parasitic inductance.
- The discrete C4 / C2 / C1 chain handles transients up to the frequency where its own package ESL starts to dominate; above that, the plane-pair capacitance takes over with effectively zero ESL. The plane pair, not the discrete cluster, is what decouples U3 at the antenna's 2.4 GHz fundamental and its harmonics — which is also why the single tie-in via at C1's far end is sufficient rather than risky: the pour-side decoupling at GHz frequencies is the plane pair, not the via inductance.
- The unbroken inner GNDREF planes give the antenna an unbroken reference under its entire projection back into the board — important for the module's pre-certified RF behaviour to be preserved.

**EN power-on delay.** R4 (10 kΩ) pulls ESP_EN up to VCC; C3 (1 µF) sits from ESP_EN to GNDREF. The pair forms an RC charge curve that delays EN assertion after the VCC rail comes up:

```
τ_EN = R4 × C3 = 10 kΩ × 1 µF = 10 ms
```

Time to reach the ESP32-S3's valid-HIGH threshold (≥ 0.75 × VCC ≈ 2.48 V) is approximately 1.4 × τ ≈ 14 ms. Espressif requires the EN RC to be ≥ 1 ms; 10 ms is a 10× margin and ensures the rail is fully stable before the SoC starts.

**BOOT strap.** R24 (10 kΩ) pulls ESP_BOOT (U3 IO0) up to VCC. Unlike the EN net, **there is no RC capacitor on IO0** — adding one would slow IO0's rise and could delay response to programmer-driven boot-mode entry (where the ESP-PROG tool pulls IO0 LOW via J1 just before toggling EN). The pull-up alone is sufficient: parasitic trace + pin capacitance (~ 15 pF) charges through R24 in &lt; 1 µs, so IO0 is valid HIGH well before EN releases at ~14 ms. During programming, ESP-PROG overrides R24 by pulling IO0 LOW through J1 pin 5, and the module enters ROM download mode when EN is toggled.

### Performance review

| Parameter | Value | Notes |
|-----------|-------|-------|
| C4 (RF, first in chain) | 100 pF C0G | VCC pad courtyard-touching U3 pad 2 |
| C2 (mid, second in chain) | 100 nF X7R | Adjacent to C4 (courtyard-touching) |
| C1 (bulk, third in chain) | 10 µF X7R | Adjacent to C2 (courtyard-touching); single via to F.Cu VCC pour at far end |
| Additional VCC bypass on the pour | C16 / C26 10 µF, C3 1 µF, C17 / C22 / C29 100 nF | Distributed mid + bulk decoupling |
| Total VCC bypass on U3 | 31.4 µF + 400 nF + 100 pF | ~3× Espressif minimum |
| Bypass topology | Force-commutated daisy chain | Private VCC trace, isolated from F.Cu pour except at C1-far via |
| EN RC time constant τ | 10 ms | R4 × C3 |
| EN time to valid HIGH | ~14 ms | 1.4 × τ, threshold = 0.75 × VCC |
| BOOT pull-up | R24 = 10 kΩ, no RC cap | t<sub>r</sub> (parasitic) &lt; 1 µs |
| GPIO strapping conflict check | None on this sheet | Compliant with ESP32-S3 boot requirements |

### Bring-up tests

1. **VCC rail under Wi-Fi TX** — Probe at U3 pad 2 during a sustained 802.11b TX burst. Pass if the rail stays within ±3 % of 3.30 V with no individual dip below 3.10 V (covers the C1 / C16 / C26 bulk reservoir behaviour combined with the plane-pair).
2. **EN release timing** — Trigger oscilloscope on VCC rising; capture ESP_EN. Pass if ESP_EN crosses 2.48 V (valid HIGH threshold) ≥ 10 ms after VCC reaches 3.0 V.
3. **BOOT pull-up integrity** — With the board in normal operation, probe ESP_BOOT. Pass if it sits stable at VCC (≥ 3.10 V) with no glitches over a 60 s capture.

---

## Components

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| U3 | ESP32-S3-WROOM-1-N16R8 | Espressif dual-core Xtensa LX7 MCU module, 240 MHz, 16 MB QSPI flash, 8 MB PSRAM, 2.4 GHz Wi-Fi + BT 5 LE, pre-certified | [Espressif ESP32-S3-WROOM-1](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf) |
| R4 | 10 kΩ 0603 ±1 % | EN pull-up — VCC to ESP_EN (U3 CHIP_PU). With C3 forms power-on RC delay (τ = 10 ms) | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R24 | 10 kΩ 0603 ±1 % | BOOT pull-up — VCC to ESP_BOOT (U3 IO0). Selects SPI flash boot mode during normal operation; no RC cap, by design | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R1 | 10 kΩ 0603 ±1 % | I²C bus pull-up on SCL to VCC. Physically placed on `i2c_sensors.kicad_sch` near the sensor cluster | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R2 | 10 kΩ 0603 ±1 % | I²C bus pull-up on SDA to VCC (parallel with R3). Physically on `i2c_sensors.kicad_sch` | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R3 | 10 kΩ 0603 ±1 % | Second I²C bus pull-up on SDA to VCC (parallel with R2 → 5 kΩ effective). Physically on `i2c_sensors.kicad_sch` | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C1 | 10 µF / 25 V X7R 0805 | VCC main-cluster bulk bypass, third in chain (courtyard-touching adjacent to C2); single via to F.Cu VCC pour at far end | [Murata GRM21BZ71E106KE15L](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |
| C2 | 100 nF / 50 V X7R 0603 | VCC main-cluster mid-frequency bypass, second in chain (between C4 and C1) | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C3 | 1 µF / 25 V X7R 0603 | EN RC timing capacitor (ESP_EN to GNDREF). τ = 10 ms with R4 | [Murata GCM188R71E105KA64D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71E105KA64D) |
| C4 | 100 pF / 50 V C0G 0603 | VCC main-cluster RF bypass, first in chain (VCC pad courtyard-touching U3 pad 2) | [Murata GRM1885C1H101JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D) |
| C16, C26 | 10 µF / 25 V X7R 0805 | Additional VCC bulk bypass on the F.Cu VCC pour | [Murata GRM21BZ71E106KE15L](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |
| C17, C22, C29 | 100 nF / 50 V X7R 0603 | Additional VCC mid-frequency bypass distributed across the pour | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |

Programming-socket components (U4, D3, D4, D5, J1, R22) are listed on the [Programming Socket](./programming-socket) page. Status-LED components (Q1, R8, R14, R15, D2) are on the [LED Indicator](./led-indicator) page.

---

## Testing & Verification

:::caution

V2.9 is a fabricated prototype in the bench-test phase. Programming via the ESP-PROG adapter has been confirmed working on both MDD400 V2.9 and WTI400 V1.2. **No quantitative bench measurements have been performed on the VCC bypass, EN RC, BOOT pull-up, or LDO thermal behaviour yet.** The following are required.

**Hardware bring-up (rig at the bench):**

- **VCC rail under Wi-Fi TX** — Probe at U3 pad 2 during a sustained 802.11b TX burst. Pass if the rail stays within ±3 % of 3.30 V with no individual dip below 3.10 V.
- **EN release timing** — Trigger on VCC rising; capture ESP_EN. Pass if ESP_EN crosses 2.48 V ≥ 10 ms after VCC reaches 3.0 V.
- **BOOT pull-up integrity** — Capture ESP_BOOT over a 60 s window during normal operation. Pass if it sits stable at VCC with no glitches.

Programmer-side bring-up (end-to-end programming, VDD-only operation, D3 back-feed check, U4 thermal soak) is on the [Programming Socket](./programming-socket) page.

**For V2.10 (tracked in `v2.10-improvements.md`):**

- **ESP_TX / ESP_RX trace length verification** — Measure actual routed length in the KiCAD PCB editor. If either trace exceeds 50 mm, add 33 Ω series damping at the U3 output pads per the ESP-PROG Hardware Guide. (Straight-line distance is ~29.5 mm; routed length not yet extracted.)
- **DISP_TX / DISP_RX series damping** — Likely longer traces than the J1 path; same 33 Ω damping policy if > 50 mm. The damping resistors belong adjacent to the *transmitter* output (U3 DISP_TX pad and the display module TX pad respectively).

:::

---

## References

- Espressif Systems, [*ESP32-S3-WROOM-1 & WROOM-1U Module Datasheet*](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf).
- Espressif Systems, [*ESP32-S3 Datasheet*](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf).
- Espressif Systems, [*ESP-IDF API Reference — GPIO & RTC GPIO*](https://docs.espressif.com/projects/esp-idf/en/v5.5/esp32s3/api-reference/peripherals/gpio.html).
- Yageo, [*RC Group Chip Resistor*](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf).
- Murata Electronics, [*GRM21BZ71E106KE15L — 10 µF X7R 0805*](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L).
- Murata Electronics, [*GCM188R71H104KA57D — 100 nF X7R 0603*](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D).
- Murata Electronics, [*GCM188R71E105KA64D — 1 µF X7R 0603*](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71E105KA64D).
- Murata Electronics, [*GRM1885C1H101JA01D — 100 pF C0G 0603*](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D).
- [Programming Socket](./programming-socket) — J1 IDC header; HT7833 LDO; dual-Schottky-OR'd chain; programming bring-up.
- [LED Indicator](./led-indicator) — Status LED (Q1 PNP, D2 amber, LED_EN behaviour).
