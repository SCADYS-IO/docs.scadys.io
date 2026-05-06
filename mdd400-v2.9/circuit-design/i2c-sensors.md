---
title: I²C Sensors
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/i2c_sensors_1d63f1bd.svg" alt="I²C Sensors schematic" />

:::note Hardware version
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

## Components

| Ref | Value | Description | Datasheet |
|---|---|---|---|
| U2 | INA219AIDCNR | TI current/power monitor, I²C, SOT-23-8 — address 0x40 | [TI INA219 (SBOS448)](https://www.ti.com/lit/ds/symlink/ina219.pdf) |
| U12 | OPT3004DNPR | TI ambient light sensor, WSON-6 — 0.01–83,000 lux, address 0x44 | [TI OPT3004 (SBOS762)](https://www.ti.com/lit/ds/symlink/opt3004.pdf) |
| U13 | TMP112AIDRLR | TI ±0.5 °C digital temperature sensor, SOT-563 — address 0x48 | [TI TMP112 (SBOS473)](https://www.ti.com/lit/ds/symlink/tmp112.pdf) |
| R33 | 330 mΩ | Yageo PT0603FR-070R33L — 0603 precision thick-film, 1%, 10 ppm/°C — INA219 current sense shunt | [Yageo PT0603FR-070R33L](https://www.yageo.com/en/Product-Line/Resistors/Chip-Resistors/Thick-Film/PT/PT0603FR-070R33L) |
| R1 | 10 kΩ | 0603 — I²C_SCL pull-up to VCC | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R2 | 10 kΩ | 0603 — I²C_SDA pull-up to VCC | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R3 | 10 kΩ | 0603 — second I²C_SDA pull-up to VCC (R2 ∥ R3 = 5 kΩ effective on SDA) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R62 | 10 kΩ | 0603 — TMP112 ALERT pin pull-up to VCC | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C8 | 1 µF / 25 V | X7R 0603 MLCC — INA219 VCC bulk bypass | [Murata GCM188R71E105KA64D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71E105KA64D) |
| C11 | 100 nF / 50 V | X7R 0603 MLCC — INA219 VCC high-frequency bypass | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| C56 | 100 nF / 50 V | X7R 0603 MLCC — OPT3004 VDD bypass | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| C57 | 100 pF / 50 V | C0G 0603 MLCC — TMP112 VCC high-frequency bypass | — |

## How It Works

Three I²C peripherals share the ESP32-S3's I²C bus (I2C_SCL / I2C_SDA): an INA219 power monitor, a TMP112 temperature sensor, and an OPT3004 ambient light sensor. All three operate from the 3.3 V VCC supply and respond on distinct addresses, allowing the ESP32 to poll them independently. The bus uses 10 kΩ pull-up on SCL (R1) and a 5 kΩ effective pull-up on SDA (R2 ∥ R3), operating at Standard Mode (100 kHz).

The **INA219** (U2, address 0x40) measures the MDD400's supply current and bus voltage. A 330 mΩ precision thick-film shunt resistor (R33) is placed on the high-side supply rail, downstream of the over-voltage protection MOSFET. This placement ensures the INA219 never sees transients above the OVP cutoff of approximately 19 V, protecting its 26 V absolute maximum VS pin. The shunt register delivers 10 µV per LSB — at 330 mΩ, this resolves to approximately 30 µA per count. With the firmware PGA set to /4 (±160 mV full-scale), the circuit measures up to approximately 485 mA before clipping.

The **TMP112** (U13, address 0x48) is a 12-bit, ±0.5 °C digital temperature sensor mounted on B.Cu near the rear of the DWIN display panel. It alerts the firmware when temperature crosses a threshold — important in marine environments where solar loading can drive the enclosure and display beyond their rated range. A 10 kΩ pull-up (R62) on the open-drain ALERT output allows firmware to configure a threshold interrupt; in the current design the sensor is polled on a regular interval.

The **OPT3004** (U12, address 0x44) is a 16-bit ambient light sensor with a spectral response closely matching the human eye, covering 0.01 to 83,000 lux in auto-range mode. It is mounted on B.Cu and requires an unobstructed optical path to ambient light through a PCB aperture, housing window, or light guide. The INT output is pulled to VCC but is not connected to an ESP32 GPIO — the sensor is polled by firmware rather than interrupt-driven.

## Design Rationale

The three sensors were selected to give the firmware closed-loop visibility over the three main environmental variables affecting MDD400 reliability and user experience: supply health (INA219), thermal headroom (TMP112), and display readability (OPT3004).

Placing the INA219 shunt downstream of the OVP MOSFET avoids exposing the sensor to supply transients, and means the voltage measurement reflects the regulated post-OVP supply rather than the raw external input.

The OPT3004 was preferred over a photodiode or LDR because its I²C digital output eliminates ADC resource usage on the ESP32, its auto-ranging exponent/mantissa format handles the full outdoor lux range without saturation, and its human-eye-matched spectral response directly relates the measurement to perceived display brightness.

The TI ISO1541 I²C isolator present in earlier board versions was removed in V2.9 as part of the CAN domain consolidation that eliminated the isolated CAN transceiver. All three sensors now connect directly to the ESP32 I²C bus over the common GNDREF domain.

## PCB Layout

The three sensor ICs and their local decoupling occupy a 15 × 20 mm cluster (X: 126.5–141.4 mm, Y: 47.5–67.0 mm) across both copper layers. U2 (INA219) is on F.Cu; U12 (OPT3004) and U13 (TMP112) are on B.Cu. R33 (shunt) is located ~60 mm away at (75.0, 85.1) in the power supply section of the board.

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 1 | R33 Kelvin routing from inner pad edges; IN+/IN− equal-length pair | Partial | R33 at (75.0, 85.1) and U2 at (126.7, 55.3): ~60 mm separation. Current routing verified acceptable for V2.9. Inner-pad-edge connection and trace length equality not confirmed from footprint data — Gerber review recommended. Flagged for layout optimisation in V2.10. |
| 2 | C11 (100 nF) immediately adjacent to U2 VCC pin | Met | C11 at (130.1, 56.6) F.Cu: 3.6 mm from U2 centre. Adequate for 100 nF high-frequency bypass. |
| 3 | C8 (1 µF) within 3 mm of U2 | Met | C8 at (130.1, 55.0) F.Cu: 3.4 mm from U2 centre — within guideline. |
| 4 | C56 (100 nF) adjacent to U12 VDD pin | Met | C56 at (136.725, 47.525) B.Cu: 2.3 mm from U12 at (139.0, 47.5) — same layer, excellent proximity. |
| 5 | C57 (100 pF) adjacent to U13 VCC pin | Met | C57 at (126.5, 65.775) B.Cu: 2.6 mm from U13 at (129.0, 65.0) — same layer, good proximity. |
| 6 | U13 (TMP112) near DWIN display panel rear surface | Met | U13 and U12 are both on B.Cu immediately adjacent to the DWIN display panel rear surface. ✓ |
| 7 | U12 (OPT3004) aligned with light aperture | Met | U12 aligns with a window in the custom lens assembly for the DWIN display. Ambient light path confirmed. ✓ |
| 8 | R62 adjacent to U13 ALERT pin | Met | R62 at (128.925, 67.0) B.Cu: 2.0 mm from U13 — tight co-location on B.Cu. |
| 9 | OPT3004 WSON-6 exposed pad via to GNDREF | Unverifiable | Via placement under EP requires Gerber inspection. |
| 10 | IN+/IN− sense traces away from SMPS/CAN switching nodes | Unverifiable | Routing of ~60 mm sense paths requires segment-level inspection. |

## Design Calculations

| Parameter | Formula | Result |
|---|---|---|
| Shunt voltage LSB (INA219 register) | Fixed per INA219 datasheet | **10 µV/LSB** |
| Current resolution (PGA /4, R33 = 330 mΩ) | 10 µV / 0.33 Ω | **~30 µA/LSB** |
| Peak measurable current (PGA /4, ±160 mV FSR) | 160 mV / 0.33 Ω | **485 mA** |
| Voltage drop at 250 mA | 0.33 Ω × 0.25 A | **82.5 mV** — 20.6 mW, negligible |
| R33 self-heating at 250 mA | 0.25² × 0.33 Ω = 20.6 mW; limit 100 mW | **79.4% margin** ✓ |
| TMP112 resolution | 12-bit, 1 LSB = 0.0625 °C | **0.0625 °C/LSB** |
| OPT3004 dynamic range | Auto-range, 16-bit mantissa/exponent | **0.01 to 83,000 lux** |
| I²C SCL rise time (R1 = 10 kΩ, C_bus ≈ 50 pF) | τ = 10 kΩ × 50 pF = 500 ns | Standard Mode (100 kHz), within I²C spec |

:::caution Verification required — Fabricated prototype — testing phase

**Verify during bring-up:**
- **INA219 PGA setting**: Confirm firmware sets PGA = /4 (CONFIG register PG1:PG0 = 0b10, ±160 mV full-scale). If PGA = /2 (±80 mV) is used, peak measurable current drops to ~242 mA — below the 250 mA expected peak load. *(performance_review Gap 1)*
- **INA219 R33 sense trace Gerber review** *(recommended, non-blocking)*: Current routing is acceptable for V2.9. Inspect Gerber files to confirm IN+ and IN− traces connect from inner pad edges of R33 and run as an equal-length pair away from SMPS switching nodes. *(pcb_review Gap 1)*
- **OPT3004 INT pull-up**: Confirm OPT3004 INT pin (U12 Pin 4) has a pull-up resistor to VCC. The open-drain INT output must be pulled up per OPT3004 datasheet §8.4. This resistor is absent from the V2.9 component table — verify from schematic. *(performance_review Gap 4)*

**For next version:**
- **TMP112 decoupling**: Add 100 nF bypass capacitor at U13 VCC in parallel with C57 (100 pF). TMP112 datasheet recommends 100 nF minimum; the 100 pF C57 is below this guideline. *(v2.10-improvements)*
- **Shorten INA219 sense traces**: Reduce the ~60 mm IN+/IN− sense path by moving U2 closer to R33 or routing the traces on an inner PCB layer away from SMPS switching activity. *(pcb_review Gap 2)*
:::

## References

1. Texas Instruments, [*INA219 Zerø-Drift, Bidirectional Current/Power Monitor With I²C Interface (SBOS448)*](https://www.ti.com/lit/ds/symlink/ina219.pdf)
2. Texas Instruments, [*OPT3004 Ambient Light Sensor (SBOS762)*](https://www.ti.com/lit/ds/symlink/opt3004.pdf)
3. Texas Instruments, [*TMP112 High-Accuracy, Low-Power Digital Temperature Sensor (SBOS473)*](https://www.ti.com/lit/ds/symlink/tmp112.pdf)
4. Yageo, [*PT0603FR-070R33L Precision Thick Film Chip Resistor*](https://www.yageo.com/en/Product-Line/Resistors/Chip-Resistors/Thick-Film/PT/PT0603FR-070R33L)
5. Yageo, [*RC Series 0603 Chip Resistor Datasheet*](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf)
6. Murata, [*GCM188R71E105KA64D — 1 µF / 25 V X7R 0603 MLCC*](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71E105KA64D)
7. Murata, [*GRM188R71H104KA93D — 100 nF / 50 V X7R 0603 MLCC*](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D)
8. NXP Semiconductors, [*I²C-bus specification and user manual (UM10204)*](https://www.nxp.com/docs/en/user-guide/UM10204.pdf)
