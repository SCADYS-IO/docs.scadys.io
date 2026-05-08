---
title: CAN Transceiver
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/can_transceiver_7c76562e.svg" alt="CAN Transceiver schematic" />

:::note Hardware version
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

## Components

| Ref | Value | Description | Datasheet |
|---|---|---|---|
| J2 | M12-P5A-PPFM | STA M12 A-coded 5-pin male panel-mount socket — IEC 61076-2-101 / NEMA 2000, IP67 | [STA M12 Series Catalogue](https://www.nmea.org/nmea-2000.html) |
| U5 | SN65HVD234DR | Texas Instruments 3.3 V 1 Mbps CAN transceiver, ISO 11898-2, SOIC-8 | [TI SN65HVD234 (SLLS557H)](https://www.ti.com/lit/ds/symlink/sn65hvd234.pdf) |
| U10 | NUP2105LT1G | onsemi dual-line CAN TVS diode array, SOT-23 — 350 W peak, 24 V standoff | [onsemi NUP2105LT1G](http://www.onsemi.com/pub_link/Collateral/NUP2105L-D.PDF) |
| FL1 | ACT45B-510-2P-TL003 | TDK AEC-Q200 common-mode choke — 51 µH at 100 kHz, 2800 Ω at 10 MHz, 0.2 A rated, SMD | [TDK ACT45B Series](https://product.tdk.com/en/search/emc/emc/cmfc_auto/info?part_no=ACT45B-510-2P-TL003) |
| C18 | 10 µF / 25 V | X5R 0805 MLCC — VCC bulk bypass capacitor | [Murata GRM21B Series](https://www.murata.com/en-us/products/capacitor/ceramiccapacitor) |
| C19 | 100 nF / 50 V | X7R 0603 MLCC — high-frequency VCC bypass, immediately adjacent to U5 | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| C27, C28 | 15 pF / 100 V | C0G 0603 MLCC — post-CMC common-mode filter caps (NET-H and NET-L to GNDREF) | [Murata GCM1885C2A150JA16D](https://www.murata.com/en-us/products/productdetail?partno=GCM1885C2A150JA16D) |
| C34, C35 | 15 pF / 100 V | C0G 0603 MLCC — pre-CMC common-mode filter caps (NET-H and NET-L to GNDREF) | [Murata GCM1885C2A150JA16D](https://www.murata.com/en-us/products/productdetail?partno=GCM1885C2A150JA16D) |
| C36 | 100 pF / 50 V | X7R 0603 MLCC — differential filter cap across NET-H / NET-L | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| R16 | 47 Ω | 0603 — series resistor on RXD output (U5 Pin 4 to TWAI_RX) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R17 | 10 kΩ | 0603 — TWAI_TX pull-up to VCC; holds bus recessive when MCU GPIO is high-impedance | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R20 | 10 kΩ | 0603 — TWAI_EN pull-down to GNDREF; defaults transceiver to normal active mode at boot | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R21 | 10 kΩ | 0603 — slope-control resistor on U5 Rs pin (Pin 8 to GNDREF); sets reduced slew rate | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |

## How It Works

The CAN transceiver sub-sheet implements the ISO 11898-2 / NMEA 2000 physical layer, connecting the ESP32-S3 TWAI peripheral to an external NMEA 2000 backbone. The circuit is non-isolated: the CAN transceiver ground is referenced to board GNDREF, which ties directly to NET-C (bus power ground, J2 Pin 3). This is the standard topology for NMEA 2000 non-isolated nodes.

The physical connection is made via J2, an M12 A-coded 5-pin male connector rated IP67. Pin assignments follow the NMEA 2000 specification: NET-S (Pin 2, +12 V bus power), NET-C (Pin 3, bus ground / GNDREF), NET-H (Pin 4, CAN High), NET-L (Pin 5, CAN Low). The shield pin (Pin 1) is intentionally left floating internally, consistent with NMEA 2000 practice of bonding the shield drain wire to vessel ground at a single external point.

The NET-H and NET-L signals pass through a protection and filtering network before reaching the transceiver, following the TI SLLA271 connector-first TVS topology: Connector → TVS → CMC → Transceiver. Placing the TVS before the CMC clamps high-speed transients immediately at the connector entry point; the CMC's series impedance then limits the transient current in the TVS shunt path during surge events.

U10 (NUP2105LT1G TVS array) is placed first — physically closest to J2 (11.9 mm) — clamping both NET-H and NET-L against ESD and surge transients before any other component is reached. C35 and C34 (15 pF each, between TVS and CMC) then shunt residual high-frequency common-mode noise from each bus line to GNDREF. C36 (100 pF) spans NET-H to NET-L as a differential capacitor, attenuating differential-mode noise while remaining too small to affect signal integrity at 1 Mbps. FL1 (ACT45B-510-2P-TL003 common-mode choke) follows, presenting 2800 Ω common-mode impedance at 10 MHz while passing differential CAN signals with low insertion loss. On the transceiver side of FL1, C28 and C27 (15 pF each, post-CMC) provide a second common-mode filter stage to attenuate any residual noise that passes through the choke.

On the logic side, U5 (SN65HVD234DR) translates between the differential CAN bus and 3.3 V single-ended TWAI_TX / TWAI_RX signals for the ESP32-S3 TWAI peripheral. TWAI_TX drives U5 Pin 1 (D/TXD) with a 10 kΩ pull-up (R17) to VCC, holding the bus recessive when the MCU pin is high-impedance during reset or boot. TWAI_RX connects from U5 Pin 4 (R/RXD) through R16 (47 Ω) to the MCU; R16 limits inrush current and damps output ringing. TWAI_EN connects from the MCU to U5 Pin 5 (EN), with R20 (10 kΩ to GNDREF) holding the transceiver in normal active mode at power-up. U5 Pin 8 (Rs) is connected via R21 (10 kΩ to GNDREF), selecting a reduced slew rate that limits EMC emissions while maintaining adequate signal quality at 1 Mbps. The VCC supply (Pin 3) is decoupled by C19 (100 nF, immediately adjacent) and C18 (10 µF, bulk), as required by the SN65HVD234 datasheet §12. Neither TWAI_TX (GPIO13) nor TWAI_RX (GPIO12) are ESP32-S3 strapping pins, ensuring predictable CAN behaviour across all boot modes.

## Design Rationale

The SN65HVD234DR replaced the isolated ISO1042 transceiver used in earlier versions as part of the v2.9 redesign. The ground reference for the transceiver is now shared with NET-C (vessel network ground), which is the standard topology for NMEA 2000 non-isolated nodes. This simplification reduces component count and eliminates the transformer's power conversion losses while maintaining adequate EMC performance through the differential pair filtering network.

The ACT45B-510-2P-TL003 common-mode choke was chosen for its AEC-Q200 automotive qualification, high common-mode impedance (2800 Ω at 10 MHz), and rated current (0.2 A) that comfortably exceeds the CAN differential drive current (~12.5 mA per winding at 120 Ω termination). The filter structure follows TI SLLA271: U10 (TVS) intercepts transients first at the connector, then C35/C34 (pre-CMC caps) and FL1 (CMC) filter common-mode noise, then C28/C27 (post-CMC caps) provide a second attenuation stage — a pi-network around FL1 for enhanced common-mode rejection, with the TVS outside the pi at the connector entry.

The slope-control resistor R21 (10 kΩ on the Rs pin) sets a reduced edge slew rate on the SN65HVD234 bus driver, reducing radiated EMC emissions at the cost of slightly longer transition times (~50–100 ns). At NMEA 2000 operating speed (250 kbps), this rise time is 1.25–2.5% of the bit period — negligible impact on signal integrity. CAN bus traces are routed as a tightly-coupled differential pair with symmetry maintained between NET-H and NET-L to minimise mode conversion.

## PCB Layout

All CAN transceiver components are on F.Cu. The circuit occupies a 11.5 × 27 mm region (X: 88.0–99.5 mm, Y: 63.0–90.0 mm). The filter chain is laid out in a straight line from J2 (Y = 90 mm) inward toward U5 (Y = 67.5 mm), with U10 (TVS) physically closest to the connector — correct per TI SLLA271 connector-first topology.

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 1 | Connector-first protection chain, compact, U10 adjacent to J2 | Met | All filter/protection components within 12–20 mm of J2. U10 at (96.0, 81.2) is closest to J2 at 11.9 mm — correct per TI SLLA271. Physical placement order J2 → U10 → C36 → C34/C35 → FL1 → C28/C27 → U5 matches signal-flow order exactly. |
| 2 | C19 (100 nF) immediately adjacent to U5 VCC Pin 3 | Partial | C19 at (92.5, 65.9) is 3.85 mm centre-to-centre from U5 at (96.0, 67.5). Exact pin-to-pad separation requires rotation-corrected pin extraction for SOIC-8 at −90°. |
| 3 | C18 (10 µF) within 3 mm of U5 | Partial | C18 at (90.7, 65.7) is 5.6 mm from U5 centre. Exceeds 3 mm guideline; flagged for V2.10 layout tightening. |
| 4 | U10 Pin 3 (GNDREF) — short direct via to ground plane | Unverifiable | SOT-23 anode via placement requires trace/via layer inspection. |
| 5 | C34/C35 and C27/C28 symmetric about differential pair axis; FL1 centred | Met | C34 (93.2, 76.2) and C35 (98.8, 76.2): ±2.8 mm about X = 96.0. C27 (93.2, 72.8) and C28 (98.8, 72.8): ±2.8 mm about X = 96.0. FL1 at (96.0, 74.5) — centred. |
| 6 | NET-H / NET-L trace width ≥ 0.2 mm | Met | 0.20 mm width observed on both NET-H and NET-L routing segments throughout filter section. |
| 7 | NET-H / NET-L trace lengths matched to ±0.5 mm | Unverifiable | NET-H: 10 segments; NET-L: 9 segments. Length match requires measurement in PCB layout tool. |
| 8 | R16 (47 Ω) at U5 Pin 4 side of TWAI_RX | Met | R16 at (94.9, 63.0) — 4.5 mm from U5 toward transceiver output, not toward MCU. |
| 9 | Solid GNDREF plane under entire CAN circuit | Met | GNDREF zones confirmed on F.Cu (4 zones) and B.Cu (1 continuous zone) over the full circuit area. |
| 10 | Guard ring around pre-CMC section | Unverifiable | Guard ring / keepout zone presence requires copper pour inspection in layout tool. |

## Design Calculations

| Parameter | Formula | Result |
|---|---|---|
| Differential filter −3 dB (C36 = 100 pF, source R = 60 Ω) | 1 / (2π × 60 × 100 pF) | **26.5 MHz** — well above CAN fundamental (500 kHz @ 1 Mbps) |
| CAN signal attenuation at 1 Mbps fundamental (500 kHz) | f / f_c = 0.5 / 26.5 | < 0.04 dB — negligible |
| Pre-CMC cap impedance at 10 MHz (C35/C34 = 15 pF) | 1 / (2π × 10 MHz × 15 pF) | **1,061 Ω** per line |
| Common-mode attenuation at 10 MHz (per cap stage, simplified) | Z_C / (Z_FL1 + Z_C) = 1,061 / (2,800 + 1,061) | **−11.2 dB** per stage; two stages → > −22 dB total |
| FL1 winding current vs. rated (120 Ω termination, dominant = 1.5 V) | 1.5 V / 120 Ω = 12.5 mA; margin = (200 mA − 12.5 mA) / 200 mA | **93.7% margin** |
| RXD output filter f_c (R16 = 47 Ω, C_MCU ≈ 5 pF) | 1 / (2π × 47 × 5 pF) | **677 MHz** — no impact on CAN signal |
| Bus edge rise time at Rs = 10 kΩ (TI SLLS557H Fig. 39) | 50–100 ns | 1.25–2.5% of NMEA 2000 bit period (4 µs @ 250 kbps) ✓ |
| NUP2105LT1G clamp voltage vs. SN65HVD234 bus fault spec | V_clamp = 40 V @ 5 A; spec = ±36 V | ⚠️ 40 V clamp > 36 V fault spec — see Testing |

:::caution Verification required — Fabricated prototype — testing phase

**Verify during bring-up:**
- **EMC scan — CAN bus (CISPR 25 Class 5 / ISO 11452-2)**: Include NET-H, NET-L, TWAI_TX, and TWAI_RX in the full-board conducted and radiated emissions scan. The two-stage common-mode filter and differential filter are designed to meet CISPR 25 Class 5, but no formal measurement has been performed on the V2.9 prototype. *(performance_review Gap 1)*
- **U10 bus fault survivability**: Simulate or test the worst-case NMEA 2000 bus fault scenario (battery connection to CAN bus line). NUP2105LT1G V_clamp = 40 V at 5 A exceeds the SN65HVD234 ±36 V bus fault protection spec. U5 must rely on its internal fault-protection structures for the regime above 36 V. Verify U5 survives. *(performance_review Gap 2)*

**For next version:**
- **CAN filter simulation**: Add LTspice `.asc` simulation of the two-stage common-mode filter (C35/C34 + FL1 + C28/C27) and differential filter (C36) to `design-docs/`. Target: attenuation vs. frequency plot for CISPR 25 Class 5 pre-compliance assessment. *(performance_review Gap 3)*
- **C18 proximity**: Tighten C18 (10 µF bulk bypass) placement to within 3 mm pad-to-pad of U5 VCC. Current centre-to-centre distance is 5.6 mm. *(pcb_review Gap 3)*
:::

## References

1. Texas Instruments, [*SN65HVD23x 3.3-V CAN Bus Transceivers (SLLS557H)*](https://www.ti.com/lit/ds/symlink/sn65hvd234.pdf)
2. Texas Instruments, [*Layout Recommendations for PCBs Using High-Speed CAN Transceivers (SLLA271)*](https://www.ti.com/lit/an/slla271/slla271.pdf) — connector-first TVS topology (§3, Fig. 7)
3. onsemi, [*NUP2105LT1G Dual-Line CAN TVS Diode Datasheet*](http://www.onsemi.com/pub_link/Collateral/NUP2105L-D.PDF)
4. TDK, [*ACT45B Type Common Mode Filter/Choke*](https://product.tdk.com/en/search/emc/emc/cmfc_auto/info?part_no=ACT45B-510-2P-TL003)
5. Yageo, [*RC Series 0603 Chip Resistor Datasheet*](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf)
6. Murata, [*GCM1885C2A150JA16D — 15 pF / 100 V C0G 0603 MLCC*](https://www.murata.com/en-us/products/productdetail?partno=GCM1885C2A150JA16D)
7. Murata, [*GRM188R71H104KA93D — 100 nF / 50 V X7R 0603 MLCC*](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D)
8. National Marine Electronics Association, [*NMEA 2000 Standard*](https://www.nmea.org/nmea-2000.html)
9. ISO, *ISO 11898-2:2016 — Road Vehicles — Controller Area Network (CAN) — Part 2: High-speed medium access unit*
10. Electronic Design, [*CISPR 25 Class 5: Evaluating EMI in Automotive Applications*](https://www.electronicdesign.com/technologies/power/article/21274517/)
11. In Compliance Magazine, [*Automotive EMC Testing: CISPR 25, ISO 11452-2 and Equivalent Standards*](https://incompliancemag.com/automotive-emc-testing-cispr-25-iso-11452-2-and-equivalent-standards-part-1/)
