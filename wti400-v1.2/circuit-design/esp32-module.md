---
title: ESP32 Module
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — test vessel (~1,000 sea miles)"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]

WTI400 **v1.2** — In service on the test vessel. Approximately 1,000 sea miles accumulated with the ESP32 continuously Wi-Fi-active. Self-calibrating firmware running, I2C bus at **Standard mode (100 kHz)**. The firmware carries hard-coded start-up speed-conversion and installation-angle constants and hard-coded initial WIND_X / WIND_Y ADC limits; the limits and midpoint are then self-adjusted at run-time as new extremes are observed. Subjective in-service performance is satisfactory; the Testing & Verification section lists what's still to be measured.

:::

## Overview

This page documents the WTI400's main application processor — an Espressif ESP32-S3-WROOM-1-N16R8 module — and the surrounding circuitry on `esp32_module.kicad_sch`: VCC bypass, control-line RC networks, the I2C bus pull-ups, the ESP-PROG programming socket, and the dual-variant LDO that supplies VCC during firmware flashing.

<SchematicViewer src="/img/schematics/wti400-v1.2/esp32_module_eb5ab595.svg" alt="ESP32 module schematic — full sheet (MCU module, supply bypass, ESP-PROG programming socket). Zoom and pan freely; per-sub-circuit zoomed views appear below." />

Three sub-circuits in narrative order:

1. **ESP32-S3 module and signal map** — U3 itself, its global-label fan-out to every other sub-sheet, and the antenna-end clearance treatment.
2. **VCC supply bypass and control-line RC networks** — multi-stage VCC decoupling at U3's 3V3 pads, the EN power-on RC, the IO0 boot-strap RC, and the I2C bus pull-ups.
3. **ESP-PROG programming socket and dual-variant LDO** — J1 ESP-PROG-compatible header, the developer-variant HT7833 LDO chain (U4 + isolation Schottky D4 + Vout-to-Vin protection D5), and the production-variant zero-ohm bridge (R24).

The page covers the V1.2 **developer/kit** assembly variant — U4, D4, D5, J1 populated and R24 DNP — which is the build installed on the test vessel. The production variant is described in the third sub-section as the configuration the same PCB will carry once volume builds are programmed via pogo-pin fixture.

---

## ESP32-S3 module and signal map

<SchematicViewer src="/img/schematics/wti400-v1.2/esp32_module_eb5ab595.svg" alt="ESP32-S3 module sub-circuit — U3 (ESP32-S3-WROOM-1-N16R8) with all hierarchical global labels for inter-sheet signal fan-out." initialFocus="13.335 12.7 132.715 95.25" />

### Functional specification and design objectives

- House a pre-certified, dual-core Wi-Fi/Bluetooth MCU module with enough on-board flash and PSRAM to run the WTI400 firmware without external memory.
- Expose the module's I/O cleanly to every other sub-sheet via hierarchical global labels so the system-level schematic stays readable.
- Maintain the module's pre-certification by satisfying Espressif's antenna keep-out requirement on the PCB.

### How it works

**U3 — ESP32-S3-WROOM-1-N16R8** is an Espressif system-in-package module carrying:

- ESP32-S3 dual-core Xtensa LX7 SoC at up to 240 MHz,
- 16 MB QSPI flash,
- 8 MB PSRAM,
- 2.4 GHz Wi-Fi + BT 5 LE radio with integrated PCB antenna,
- FCC / CE / IC pre-certifications.

The module's only supply input is the 3.3 V VCC rail from the [Power Supply](./power-supplies) page. All bypass, EN, BOOT, and I2C pull-up infrastructure on this sheet sits on that rail.

U3 fans out to every other sub-sheet through hierarchical global labels. Functionally:

| Signal group | Labels | Direction | Counterpart sub-sheet |
|---|---|---|---|
| Wind transducer analog | WIND_X, WIND_Y | ADC input (U3 → ADC) | [Wind Interface](./wind-interface) |
| Wind transducer pulse | WIND_SPD | Edge-triggered GPIO | [Wind Interface](./wind-interface) |
| Wind transducer control | WND_EN, WND_ERR | GPIO out / GPIO in | [Wind Interface](./wind-interface) |
| CAN / NMEA 2000 | TWAI_TX, TWAI_RX, TWAI_EN | UART-like | [CAN Transceiver](./can-transceiver) |
| Legacy serial | ST_TX, ST_RX, ST_EN | UART2 | [Legacy Serial Interface](./legacy-serial) |
| Motion sensing | I2C_SDA, I2C_SCL | I2C bus | [Motion Sensor](./motion-sensor) |
| Local UI | BUTTON, LED_RED, LED_GRN, LED_BLU | GPIO | [Button Input](./button) / [LED Indicator](./led-indicator) |
| Programming | ESP_TX, ESP_RX, ESP_EN, ESP_BOOT | UART0 + control | J1 (this sheet) |

The I2C bus pull-ups (R3, R4) live on this sheet rather than on the motion-sensor sheet because the bus is shared and the pull-ups belong with the master rather than any one slave. They're described under the *VCC supply bypass and control-line RC networks* sub-circuit below.

**Antenna-end clearance.** The Espressif module datasheet requires the antenna projection area to be free of copper on all PCB layers. The WTI400 V1.2 layout achieves this with a physical PCB cutout under the antenna section: the substrate is removed entirely, which also removes any fill copper that might otherwise have been carried there by zone priority alone. No `keepout` rule area is needed because the cutout makes the requirement self-enforcing. Module pre-certification is preserved.

### Performance review

| Parameter | Value | Notes |
|-----------|-------|-------|
| CPU clock (max) | 240 MHz | Dual-core LX7 |
| Flash | 16 MB QSPI | On-package |
| PSRAM | 8 MB | On-package |
| Wi-Fi PHY | 802.11 b/g/n, 2.4 GHz | Pre-certified module |
| Pre-certifications | FCC ID 2AC7Z-ESP32S3WROOM1, CE RED 2014/53/EU, IC | Maintained by antenna keep-out (cutout) |
| Antenna keep-out method | PCB cutout under antenna section | Substrate + copper removed; no rule area needed |
| Bypass and control-line decoupling | Described in next sub-circuit | C1/C3/C8 + EN/BOOT RC + I2C pull-ups |

### Bring-up tests

1. **Wi-Fi link stability under prolonged TX** — Run a 30-minute TCP iperf at typical operating distance from the access point. Pass if no Wi-Fi disconnects occur and the supply rail (measured at U3 pad 2) stays within ±3 % of 3.3 V throughout. *(Exercises antenna clearance and the VCC decoupling described below under sustained TX bursts.)*

---

## VCC supply bypass and control-line RC networks

<SchematicViewer src="/img/schematics/wti400-v1.2/esp32_module_eb5ab595.svg" alt="VCC supply bypass and control-line RC networks sub-circuit — main 3V3 bypass cluster (C8 100 pF C0G, C3 100 nF, C1 10 µF) at U3 pads, LDO-output-side bypass (C16 10 µF, C17 100 nF), EN RC pair (R9 + C7), BOOT RC pair (R18 + C22), and I2C bus pull-ups (R3 SCL, R4 SDA)." initialFocus="146.05 12.7 137.16 76.2" />

### Functional specification and design objectives

- Provide multi-stage VCC bypass at U3's 3V3 castellated pads, sized to handle ESP32-S3 Wi-Fi TX current pulses without sagging the 3.3 V rail.
- Hold ESP_EN (CHIP_PU) and ESP_BOOT (IO0) at clean, well-defined logic states during power-up and during normal operation.
- Time the EN release after VCC stabilises, satisfying Espressif's minimum reset-extension requirement.
- Pull the shared I2C bus (SDA, SCL) up to VCC at a value compatible with both the current Standard-mode firmware and the on-PCB bus capacitance.

### How it works

**Multi-stage VCC bypass at U3, ordered for force-commutation.** The bypass cluster is placed in a straight line from U3's pad 2 (the 3V3 castellated supply pad), smallest cap first:

- **C8 — 100 pF / 50 V C0G 0603** at the front, VCC pad as close to U3 pad 2 as the courtyards allow.
- **C3 — 100 nF / 50 V X7R 0603** immediately adjacent to C8, as close as the courtyards allow.
- **C1 — 10 µF / 25 V X7R 0805** immediately adjacent to C3, again as close as the courtyards allow.

Critically, the VCC pads of C8 / C3 / C1 are **isolated from the surrounding F.Cu VCC pour**: a narrow private VCC trace daisy-chains the three VCC pads, and the trace ties into the broader VCC pour through a single via only at the *far* end of C1. The current path from the pour into U3 is therefore forced to be **pour → via → C1 → C3 → C8 → U3 pad 2**, with no short-cut path that bypasses the caps. Each cap sees the U3 load current and contributes its frequency band — C8 catches the fastest transients first because of its low-ESL C0G construction, C3 fills in the mid band, C1 supplies bulk charge replenishment. Spreading-inductance shortcuts through the pour can't bypass any of them.

A second VCC bypass pair (C16 10 µF + C17 100 nF) sits 3.5 mm from U4 on the LDO output / programmer power side, providing decoupling on the same VCC node near the LDO junction. Total VCC bypass on the U3 supply: 100 pF + 2× 100 nF + 2× 10 µF — two times the Espressif minimum (100 nF + 10 µF).

**The stack-up does the very-high-frequency work.** Across the digital area, the four-layer board is poured as **VCC – GNDREF – GNDREF – VCC** (F.Cu and B.Cu both carry VCC; In1.Cu and In2.Cu carry unbroken GNDREF). This creates two VCC↔GNDREF plane pairs separated by 0.1855 mm prepreg — a distributed bypass capacitor across the whole digital region with no parasitic inductance and no ESR. The full reasoning is on the [Power Supply](./power-supplies#in-the-vcc-digital-area) page; the consequences specifically for U3 are:

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

**I2C bus pull-ups.** R3 (10 kΩ) on I2C_SCL and R4 (10 kΩ) on I2C_SDA are the bus pull-ups for the shared I2C connecting U3 to the [Motion Sensor](./motion-sensor) sub-sheet (and any other I2C peripherals added in future revisions). At Standard mode (100 kHz) the pull-up value is fine for any reasonable on-PCB bus capacitance. The Fast-mode (400 kHz) margin tightens (see the performance table); a V1.3 backlog item tracks reducing R3 / R4 to 4.7 kΩ if a firmware upgrade to 400 kHz is needed.

### Performance review

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
| EN trace length (J1 → R9/C7 cluster → U3 pad 3 / EN) | 57.1 mm | RC-limited signal, accepted for V1.2 (see *V1.3* below) |
| BOOT RC time constant τ | 1 ms | R18 × C22 |
| BOOT time to valid HIGH | ~2.2 ms | 2.2 × τ |
| I2C bus rise time t<sub>r</sub> @ C<sub>bus</sub> = 30 pF | 254 ns | 0.8473 × 10 kΩ × 30 pF — Standard mode pass, Fast mode pass |
| I2C bus rise time t<sub>r</sub> @ C<sub>bus</sub> = 50 pF | 424 ns | Standard mode pass, **Fast mode fail** |
| Maximum C<sub>bus</sub> for Standard mode (100 kHz) | 118 pF | t<sub>r</sub> ≤ 1000 ns at R<sub>pu</sub> = 10 kΩ |
| Maximum C<sub>bus</sub> for Fast mode (400 kHz) | 35 pF | t<sub>r</sub> ≤ 300 ns at R<sub>pu</sub> = 10 kΩ |
| I2C pull-up current | 0.29 mA per line | (3.3 − 0.4) V / 10 kΩ — well below ESP32-S3 I<sub>OL</sub> 20 mA spec |

### Bring-up tests

1. **VCC rail under Wi-Fi TX** — Probe at U3 pad 2 during a sustained 802.11b TX burst. Pass if the rail stays within ±3 % of 3.30 V with no individual dip below 3.10 V (covers the C1 / C16 bulk reservoir behaviour).
2. **EN release timing** — Trigger oscilloscope on VCC rising; capture ESP_EN. Pass if ESP_EN crosses 2.48 V (valid HIGH threshold) ≥ 10 ms after VCC reaches 3.0 V.
3. **I2C rise time measurement** — With the firmware running normally (Standard mode), capture SDA and SCL transitions on a fast scope or logic analyser. Record 30 %-to-70 % rise time. Pass if t<sub>r</sub> ≤ 1000 ns (Standard mode); record actual C<sub>bus</sub> for future Fast-mode planning.

---

## ESP-PROG programming socket and dual-variant LDO

<SchematicViewer src="/img/schematics/wti400-v1.2/esp32_module_eb5ab595.svg" alt="ESP-PROG programming socket sub-circuit — J1 (2×3 2.54 mm IDC header, ESP-PROG-compatible), D4 (input isolation Schottky), U4 (HT7833 3.3 V LDO), D5 (Vout-to-Vin protection Schottky), R24 (zero-ohm production-variant link), and LDO-input decoupling C20 + C21." initialFocus="13.335 107.95 132.715 82.55" />

### Functional specification and design objectives

- Expose a programming interface compatible with Espressif's standard ESP-PROG 6-pin adapter so the developer build can be flashed and debugged with off-the-shelf tools.
- Protect U3 from over-voltage if the adapter is wired or jumpered to 5 V output rather than 3.3 V.
- Prevent the programmer from being back-fed by the board's own VCC rail when both are connected.
- Provide a zero-cost path to remove all programmer-side parts in volume production where a pogo-pin fixture replaces the IDC socket.

### How it works

**J1 — XFCN BH254V-6P** is a 2×3, 2.54 mm pitch through-hole IDC header matching the standard Espressif ESP-PROG pinout. From the module's frame of reference:

| Pin | Net | ESP-PROG function |
|---|---|---|
| 1 | ESP_EN | Reset / EN |
| 2 | V_PROG | Programmer 5 V supply |
| 3 | ESP_TX | UART0 TX (out from module) |
| 4 | GNDREF | Ground |
| 5 | ESP_RX | UART0 RX (in to module) |
| 6 | ESP_BOOT | IO0 boot-strap |

TX and RX are named from the module's perspective; the ESP-PROG adapter handles the crossover internally. The pinout has been verified working with the standard ESP-PROG cable on both WTI400 V1.2 and MDD400 V2.9.

**Developer/kit variant (V1.2 build on the test vessel).** U4, D4, D5 and J1 are populated; R24 is DNP. The V_PROG path is:

```
J1 pin 2 (V_PROG, 5 V from programmer)
   → D4 anode  (1N5819WS Schottky, isolation)
   → D4 cathode = U4 VIN = Net-(D4-K)
   → U4 (HT7833 3.3 V LDO, SOT-89-3)
   → U4 VOUT = VCC (3.3 V)
```

**D4 — back-feed protection.** When the programmer is disconnected and the board is powered normally (VCC = 3.3 V from the on-board SMPS), D4's anode sits at 0 V (J1 pin 2 unloaded) while its cathode is at U4 V<sub>IN</sub> ≈ VCC during start-up. D4 is reverse-biased and prevents any current path from board VCC back into the programmer's V_PROG pin.

**D5 — Vout-to-Vin protection.** Cathode at Net-(D4-K) (U4 V<sub>IN</sub>), anode at VCC. During normal LDO operation, U4 V<sub>IN</sub> sits ~1.35 V above VCC and D5 is reverse-biased (no current). During programmer-disconnection, the LDO input collapses while the output capacitors (C1, C16) hold VCC for a few milliseconds. When VCC > U4 V<sub>IN</sub>, D5 conducts and bleeds VCC back through D5 to U4 V<sub>IN</sub>, preventing the output caps from back-charging U4 through its internal body diode. This is the same topology as D16 on the [Power Supply](./power-supplies) sheet.

The WTI400 LDO path has **one** isolation Schottky in the forward direction (D4), as opposed to MDD400's two in series — the WTI400 has no separate 5 V VDD bus that needs OR-ing protection at the same node, so the simpler chain suffices.

**LDO input decoupling.** C20 (100 nF X7R 0603) and C21 (10 µF X7R 0805) sit on Net-(D4-K), 3.6 mm and 5.4 mm from U4 V<sub>IN</sub> respectively. Two-tier decoupling on the LDO input is required by the HT7833 datasheet for stable regulation. C16 / C17 on the output side double as the second-tier VCC bypass described in the previous sub-circuit.

**Production variant.** R24 (0 Ω 0805) is populated and U4 / D4 / D5 / J1 are DNP. The zero-ohm link bridges VCC directly to V_PROG: programming is performed with a pogo-pin fixture contacting the J1 THT pad footprint from the top side of the board, and the board's own VCC supplies the programming session current. **The two variants are mutually exclusive — never populate both R24 and U4** (back-feeds VCC into the LDO output uncontrolled).

### Performance review

| Parameter | Value | Notes |
|-----------|-------|-------|
| D4 V<sub>F</sub> at ~200 mA | 0.35 V typ / 0.40 V worst | 1N5819WS Schottky |
| U4 V<sub>IN</sub> (typical) | 4.65 V | V_PROG 5.00 V − 0.35 V D4 |
| U4 dropout at 300 mA | 0.30 V | HT7833 datasheet |
| U4 headroom (typical) | 1.05 V | 4.65 V − (3.3 + 0.30) — passes |
| U4 P<sub>d</sub> @ 100 mA programming | 0.135 W | (4.65 − 3.3) × 0.10 |
| U4 P<sub>d</sub> @ 450 mA abs-max | 0.608 W | Reference; not the operating point |
| U4 R<sub>θJA,eff</sub> (as-built) | ~50 °C/W | 56 mm² 4-layer copper + 9 thermal vias |
| U4 T<sub>j</sub> @ 100 mA, 70 °C amb | 76.8 °C | 48.2 °C margin (38 %) to 125 °C T<sub>j,max</sub> |
| U4 tab net | V<sub>IN</sub> (Net-(D4-K)) | **Tab is V<sub>IN</sub>, not GND** — layout must not connect to GNDREF |
| ESP_TX trace length | 33.1 mm | Under 50 mm; no series damping needed |
| ESP_RX trace length | 30.6 mm | Under 50 mm; no series damping needed |
| ESP_EN trace length | 57.1 mm | Exceeds 50 mm guideline; RC-limited signal — accepted for V1.2 |
| Schottky type | JSMSEMI 1N5819WS, 40 V / 350 mA, SOD-323 | D4 + D5 same part |
| Header type | 2×3, 2.54 mm IDC THT (XFCN BH254V-6P) | ESP-PROG compatible |

**Why thermal is fine even at modest copper spreading.** U4 is only active during programming sessions. During normal operation (Wi-Fi running, programmer disconnected) the V_PROG path is at 0 V, D4 is reverse-biased, U4 sees no input voltage, and U4 dissipates nothing. The 76.8 °C / 100 mA / 70 °C-ambient figure above is for a worst-case programming session in a hot enclosure — outside that window U4 is dormant.

### Bring-up tests

1. **End-to-end programming via ESP-PROG** — Flash a known firmware image at 921600 baud over the standard ESP-PROG adapter and cable. Pass if the image flashes cleanly, the device boots, and Wi-Fi associates. *(Confirmed working on WTI400 V1.2 and MDD400 V2.9.)*
2. **D4 back-feed check** — Power the board from its own SMPS only, with the programmer disconnected. Probe J1 pin 2 (V_PROG). Pass if pin 2 measures &lt; 0.1 V (any voltage above this indicates leakage through D4 or contamination).
3. **U4 thermal soak during programming** — Hold the SoC in ROM download mode while the programmer drives sustained UART traffic for 60 s. Probe U4 body temperature with a contact thermocouple. Record peak. Pass if peak ≤ 95 °C in a 70 °C ambient (≥ 30 °C T<sub>j</sub> margin).

---

## Components

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| U3 | ESP32-S3-WROOM-1-N16R8 | Espressif dual-core Xtensa LX7 MCU module, 240 MHz, 16 MB QSPI flash, 8 MB PSRAM, 2.4 GHz Wi-Fi + BT 5 LE, pre-certified | [Espressif ESP32-S3-WROOM-1](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf) |
| U4 | HT7833 | UMW HT7833-A 3.3 V fixed-output LDO, SOT-89-3, 450 mA. Regulates programmer V_PROG to VCC during firmware flashing. **Developer/kit variant only** — DNP in production builds | [UMW HT7833-A](https://www.lcsc.com/datasheet/C347195.pdf) |
| D4 | 1N5819WS | JSMSEMI Schottky, 40 V / 350 mA, SOD-323. Input isolation Schottky on the V_PROG path (anode = J1 V_PROG, cathode = U4 V<sub>IN</sub>). Prevents back-feed from VCC to the programmer | [JSMSEMI 1N5819WS](/assets/datasheets/wti400-v1.2/1N5819WS.pdf) |
| D5 | 1N5819WS | JSMSEMI Schottky, SOD-323. Vout-to-Vin protection on the LDO (cathode = U4 V<sub>IN</sub>, anode = VCC). Conducts only during power-down to discharge VCC output caps without back-charging U4. Same topology as D16 on the power_supplies sheet | [JSMSEMI 1N5819WS](/assets/datasheets/wti400-v1.2/1N5819WS.pdf) |
| J1 | XFCN BH254V-6P | 2×3, 2.54 mm pitch THT IDC header — ESP-PROG-compatible programming interface. **Developer/kit variant only** | [XFCN BH254V-6P](/assets/datasheets/wti400-v1.2/XFCN-BH254V-6P.pdf) |
| R3 | 10 kΩ 0603 ±1 % | I2C bus pull-up — VCC to I2C_SCL | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R4 | 10 kΩ 0603 ±1 % | I2C bus pull-up — VCC to I2C_SDA | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R9 | 10 kΩ 0603 ±1 % | EN pull-up — VCC to ESP_EN (U3 CHIP_PU). With C7 forms power-on RC delay (τ = 10 ms) | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R18 | 10 kΩ 0603 ±1 % | BOOT pull-up — VCC to ESP_BOOT (U3 IO0). Selects SPI flash boot mode during normal operation | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R24 | 0 Ω 0805 (DNP on V1.2) | Production-variant zero-ohm bridge VCC ↔ V_PROG. Populated only when U4 / D4 / D5 / J1 are DNP. **Never populate alongside U4** | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C1 | 10 µF / 25 V X7R 0805 | VCC main-cluster bulk bypass, third in chain from U3 pad 2 (single via to F.Cu VCC pour at far end) | [Murata GRM21BZ71E106KE15L](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |
| C3 | 100 nF / 50 V X7R 0603 | VCC main-cluster mid-frequency bypass, second in chain (between C8 and C1) | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C7 | 1 µF / 25 V X7R 0603 | EN RC timing capacitor (ESP_EN to GNDREF). τ = 10 ms with R9 | [Murata GCM188R71E105KA64D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71E105KA64D) |
| C8 | 100 pF / 50 V C0G 0603 | VCC main-cluster RF bypass, first in chain (VCC pad courtyard-touching U3 pad 2) | [Murata GRM1885C1H101JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D) |
| C16 | 10 µF / 25 V X7R 0805 | LDO-output-side VCC bulk bypass, ~3.5 mm from U4 | [Murata GRM21BZ71E106KE15L](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |
| C17 | 100 nF / 50 V X7R 0603 | LDO-output-side VCC mid-frequency bypass | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C20 | 100 nF / 50 V X7R 0603 | LDO input bypass (Net-(D4-K) to GNDREF), 3.6 mm from U4 V<sub>IN</sub> | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C21 | 10 µF / 25 V X7R 0805 | LDO input bulk bypass (Net-(D4-K) to GNDREF), 5.4 mm from U4 V<sub>IN</sub> | [Murata GRM21BZ71E106KE15L](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |
| C22 | 100 nF / 50 V X7R 0603 | BOOT filter (ESP_BOOT to GNDREF). τ = 1 ms with R18 | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |

---

## Testing & Verification

:::caution

The V1.2 prototype on the test vessel has been Wi-Fi-active for approximately 1,000 sea miles with the firmware described in the operating-context note at the top of this page. Programming via the ESP-PROG adapter has been confirmed working on both WTI400 V1.2 and MDD400 V2.9. **No quantitative bench measurements have been performed on the VCC bypass, EN RC, BOOT RC, or LDO thermal behaviour yet.** The following are required.

**Hardware bring-up (rig at the bench):**

- **VCC rail under Wi-Fi TX** — Probe at U3 pad 2 during a sustained 802.11b TX burst. Pass if the rail stays within ±3 % of 3.30 V with no individual dip below 3.10 V.
- **EN release timing** — Trigger on VCC rising; capture ESP_EN. Pass if ESP_EN crosses 2.48 V ≥ 10 ms after VCC reaches 3.0 V.
- **I2C rise time** — Capture SDA / SCL transitions during normal Standard-mode (100 kHz) operation. Record 30 %-to-70 % t<sub>r</sub> and infer C<sub>bus</sub>. Pass if t<sub>r</sub> ≤ 1000 ns.
- **End-to-end programming** — Flash a known image via ESP-PROG at 921600 baud; pass if image flashes cleanly and the device boots. *(Confirmed working in field use.)*
- **D4 back-feed check** — Programmer disconnected, board powered from on-board SMPS. Probe J1 pin 2. Pass if &lt; 0.1 V.
- **U4 thermal soak during programming** — Hold ROM download mode under sustained UART traffic for 60 s. Probe U4 body temperature with a thermocouple. Pass if peak ≤ 95 °C in a 70 °C ambient.

**Conditional — only if firmware is upgraded to I2C Fast mode (400 kHz):**

- **C<sub>bus</sub> measurement** — Measure SCL / SDA rise time at 400 kHz. Pass if t<sub>r</sub> ≤ 300 ns. If C<sub>bus</sub> exceeds 35 pF (the threshold for 400 kHz with 10 kΩ pull-ups), reduce R3 / R4 to 4.7 kΩ before enabling Fast mode (tracked as a V1.3 backlog item).

**For V1.3:**

- **Shorten the ESP_EN routing** — V1.2 has a 57.1 mm ESP_EN trace from J1 through R9 / C7 to U3 pad 3 (EN). The signal is RC-limited and the trace is acceptable as-is, but the route picks up board noise before the SoC is active. Re-route R9 / C7 closer to U3's EN pad to bring the trace below the 50 mm guideline.
- **Reduce I2C pull-ups for Fast-mode capability** — If firmware needs 400 kHz I2C, drop R3 / R4 to 4.7 kΩ to widen the C<sub>bus</sub> margin from 35 pF up to ~75 pF.

:::

---

## References

- Espressif Systems, [*ESP32-S3-WROOM-1 & WROOM-1U Module Datasheet*](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf).
- Espressif Systems, [*ESP32-S3 Datasheet*](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf).
- Espressif Systems, [*ESP-PROG Hardware Guide*](https://docs.espressif.com/projects/esp-iot-solution/en/latest/hw-reference/ESP-Prog_guide.html).
- Espressif Systems, [*ESP-IDF API Reference — GPIO & RTC GPIO*](https://docs.espressif.com/projects/esp-idf/en/v5.5/esp32s3/api-reference/peripherals/gpio.html).
- UMW, [*HT7833-A SOT-89 LDO*](https://www.lcsc.com/datasheet/C347195.pdf).
- JSMSEMI, [*1N5819WS SOD-323 Schottky*](/assets/datasheets/wti400-v1.2/1N5819WS.pdf).
- XFCN, [*BH254V-6P 2×3 2.54 mm IDC Header*](/assets/datasheets/wti400-v1.2/XFCN-BH254V-6P.pdf).
- NXP Semiconductors, *UM10204 I²C-bus specification and user manual*, Rev 7.0, 2021.
- Yageo, [*RC Group Chip Resistor*](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf).
- Murata Electronics, [*GRM21BZ71E106KE15L — 10 µF X7R 0805*](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L).
- Murata Electronics, [*GCM188R71H104KA57D — 100 nF X7R 0603*](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D).
- Murata Electronics, [*GCM188R71E105KA64D — 1 µF X7R 0603*](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71E105KA64D).
- Murata Electronics, [*GRM1885C1H101JA01D — 100 pF C0G 0603*](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D).
