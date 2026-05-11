---
title: CAN Transceiver
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/wti400-v1.2/can_transceiver_92a44bba.svg" alt="CAN Transceiver schematic" />

:::note[Hardware version]

WTI400 **v1.2** — In service — installed on test vessel

:::

## Components

| Ref | Value | Description | Datasheet |
|---|---|---|---|
| J2 | M12-P5A-PPFM | STA M12 A-coded 5-pin male panel-mount socket — IEC 61076-2-101 / NMEA 2000, IP67 | [STA M12 Series Catalogue](/assets/datasheets/wti400-v1.2/STA-M12-Series-M2024-1.pdf) |
| U9 | NUP2105LT1G | onsemi dual-line CAN TVS diode array, SOT-23 — 350 W peak, 24 V standoff | [onsemi NUP2105LT1G](http://www.onsemi.com/pub_link/Collateral/NUP2105L-D.PDF) |
| FL1 | ACT45B-510-2P-TL003 | TDK AEC-Q200 common-mode choke — 51 µH at 100 kHz, 2800 Ω at 10 MHz, 0.2 A rated, SMD | [TDK ACT45B Series](/assets/datasheets/wti400-v1.2/ACT45B.pdf) |
| C27, C26 | 15 pF / 100 V | C0G 0603 MLCC — common-mode filter caps between TVS and CMC (NET-H and NET-L to GNDREF) | [Murata GCM1885C2A150JA16D](https://www.murata.com/en-us/products/productdetail?partno=GCM1885C2A150JA16D) |
| C25, C24 | 15 pF / 100 V | C0G 0603 MLCC — post-CMC common-mode filter caps (NET-H and NET-L to GNDREF) | [Murata GCM1885C2A150JA16D](https://www.murata.com/en-us/products/productdetail?partno=GCM1885C2A150JA16D) |
| C29 | 100 pF / 50 V | C0G 0603 MLCC — differential filter cap across NET-H / NET-L. **DNP** | [Murata GRM1885C1H101JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D) |
| U5 | SN65HVD234DR | Texas Instruments 3.3 V 1 Mbps CAN transceiver, ISO 11898-2, SOIC-8 | [TI SN65HVD234 (SLLS557H)](https://www.ti.com/lit/ds/symlink/sn65hvd234.pdf) |
| C19 | 100 nF / 50 V | X7R 0603 MLCC — high-frequency VCC bypass, immediately adjacent to U5 | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C18 | 10 µF / 25 V | X7R 0805 MLCC — VCC bulk bypass capacitor | [Murata GRM21BZ71E106KE15L](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |
| R14 | 47 Ω | 0603 — series resistor on RXD output (U5 Pin 4 to TWAI_RX) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R15 | 10 kΩ | 0603 — TWAI_TX pull-up to VCC; holds bus recessive when MCU GPIO is high-impedance | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R16 | 10 kΩ | 0603 — TWAI_EN pull-down to GNDREF; defaults transceiver to normal active mode at boot | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R17 | 10 kΩ | 0603 — slope-control resistor on U5 Rs pin (Pin 8 to GNDREF); sets reduced slew rate | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |

## How It Works

The CAN transceiver sub-sheet implements the ISO 11898-2 / NMEA 2000 physical layer, connecting the ESP32 TWAI peripheral to an external NMEA 2000 backbone. The circuit is non-isolated: the CAN transceiver ground is referenced to board GNDREF, which ties directly to NET-C (bus power ground, J2 Pin 3). This is the standard topology for NMEA 2000 non-isolated nodes. The V1.2 revision replaced an earlier isolated transceiver design with the SN65HVD234DR and removed the isolation transformer.

The physical connection is made via J2, an M12 A-coded 5-pin male connector rated IP67. Pin assignments follow the NMEA 2000 specification: NET-S (Pin 2, +12 V bus power), NET-C (Pin 3, bus ground / GNDREF), NET-H (Pin 4, CAN High), NET-L (Pin 5, CAN Low). The shield pin (Pin 1) is intentionally left floating internally, consistent with NMEA 2000 practice of bonding the shield drain wire to vessel ground at a single external point.

The NET-H and NET-L signals pass through a protection and filtering network before reaching the transceiver, following the TI SLLA271 connector-first TVS topology: **Connector → TVS → CMC → Transceiver**. Placing the TVS before the CMC clamps high-speed transients immediately at the connector entry point; the CMC's series impedance then limits the transient current in the TVS shunt path during surge events.

U9 (NUP2105LT1G TVS array) is placed first — physically closest to J2 (7.3 mm) — clamping both NET-H and NET-L against ESD and surge transients before any other component is reached. C27 and C26 (15 pF each, C0G, between TVS and CMC) then shunt residual high-frequency common-mode noise from each line to GNDREF. C29 (100 pF, differential, DNP) is footprinted and routed but not assembled — intentional, identical to the MDD400 design. FL1 (ACT45B-510-2P-TL003 common-mode choke) follows, presenting 2800 Ω common-mode impedance at 10 MHz while passing differential CAN signals with low insertion loss. On the transceiver side of FL1, C25 and C24 (15 pF each, post-CMC) provide a second common-mode filter stage to attenuate any residual noise that passes through the choke.

On the logic side, U5 (SN65HVD234DR) translates between the differential CAN bus and 3.3 V single-ended TWAI_TX / TWAI_RX signals for the ESP32 TWAI peripheral. TWAI_TX drives U5 Pin 1 (D/TXD) with a 10 kΩ pull-up (R15) to VCC, holding the bus recessive when the MCU pin is high-impedance during reset or boot. TWAI_RX connects from U5 Pin 4 (R/RXD) through R14 (47 Ω) to the MCU; R14 limits inrush current and damps output ringing. TWAI_EN connects from the MCU to U5 Pin 5 (EN), with R16 (10 kΩ to GNDREF) holding the transceiver in normal active mode at power-up. U5 Pin 8 (Rs) is connected via R17 (10 kΩ to GNDREF), selecting a reduced slew rate that limits EMC emissions while maintaining adequate signal quality at 1 Mbps. The VCC supply (Pin 3) is decoupled by C19 (100 nF, adjacent) and C18 (10 µF, bulk), per SN65HVD234 datasheet §12.

## Design Rationale

The SN65HVD234DR was adopted in V1.2 as part of the move to a non-isolated direct topology, replacing an earlier isolated design. The ground reference for the transceiver is now shared with NET-C (vessel network ground), which is the standard topology for NMEA 2000 non-isolated nodes. This simplification reduces component count and eliminates the isolation transformer while maintaining adequate EMC performance through the differential pair filtering network.

The filter structure follows TI SLLA271 (connector-first TVS topology): U9 (TVS) intercepts transients first at the connector, then C27/C26 (caps between TVS and CMC) and FL1 (CMC) filter common-mode noise, then C25/C24 (post-CMC caps) provide a second attenuation stage — a pi-network around FL1 for enhanced common-mode rejection, with the TVS outside the pi at the connector entry. The TDK ACT45B-510-2P was selected for its AEC-Q200 automotive qualification, 2800 Ω common-mode impedance at 10 MHz, and 0.2 A current rating that comfortably exceeds normal CAN winding current (12.5 mA).

The slope-control resistor R17 (10 kΩ on the Rs pin) sets a reduced edge slew rate on the SN65HVD234 bus driver, reducing radiated EMC emissions at the cost of slightly longer transition times (~50–100 ns). At NMEA 2000 operating speed (250 kbps), this represents 1.25–2.5% of the bit period — negligible impact on signal integrity.

## PCB Layout

All CAN transceiver components are on F.Cu in a compact strip (X ≈ 83–92 mm, Y ≈ 64–90 mm, ~9 mm wide × 26 mm tall). The physical placement order from J2 inward matches the signal-flow order exactly: J2 (Y = 90) → U9 (Y = 82.7) → C29/C27/C26 (Y = 77.7–80) → FL1 (Y = 76) → C25/C24 (Y = 74.3) → U5 (Y = 69).

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 1 | Connector-first chain; U9 adjacent to J2 | Met | U9 at 7.30 mm from J2 — closest component; correct per TI SLLA271. All filter/protection components within 21 mm of J2. |
| 2 | Filter chain order matches signal flow | Met | Physical Y-coordinate sequence: J2 → U9 → C27/C26 → FL1 → C25/C24 → U5. No re-ordering. |
| 3 | FL1 orientation and winding symmetry | Met | FL1 centred on X = 88 mm axis; C27/C26 and C25/C24 symmetric at ±2.8 mm about FL1 centre. |
| 4 | Pre-CMC and post-CMC trace separation | Met | FL1 body provides spatial separation; no extended parallel trace runs expected. |
| 5 | NET-H / NET-L differential pair symmetry | Met (from coordinates) | All symmetric components share X = 88 mm axis. Trace length match to ±0.5 mm requires routing tool verification. |
| 6 | U5 decoupling placement | Accepted (V1.2) | C19/C18 at ~2.5 mm trace from U5 Pin 3 (courtyard-limited by R14/R15). Accepted for V1.2; improvement identified for V1.3. |
| 7 | R14 at U5 Pin 4 side of TWAI_RX | Met | R14 at 4.84 mm from U5 centre, consistent with U5-side source placement. |
| 8 | Ground plane continuity | Unverifiable (coordinates) | All components on F.Cu; solid GNDREF plane expected. Verify in Gerber review. |
| 9 | No post-CMC TVS | Accepted (design) | Single pre-CMC TVS topology per TI SLLA271; accepted for 12 V NMEA 2000. |
| 10 | FL1 rated current vs. CAN winding current | Met | 12.5 mA winding current vs 200 mA rated — 93.75% spare capacity. |

## Design Calculations

| Parameter | Formula | Result |
|---|---|---|
| Pre-CMC cap impedance @ 10 MHz (C27/C26 = 15 pF) | 1 / (2π × 10 MHz × 15 pF) | **1,061 Ω** per line |
| Common-mode attenuation per stage @ 10 MHz | Z_C / (Z_FL1 + Z_C) = 1,061 / (2,800 + 1,061) | **−11.2 dB** per stage |
| Two-stage total CM attenuation @ 10 MHz | Two stages (pre-CMC + post-CMC) | **> −22.4 dB** total |
| Differential filter (C29 = 100 pF, DNP) — f_−3dB | 1 / (2π × 60 Ω × 100 pF) | **26.5 MHz** — well above CAN 1 Mbps fundamental (500 kHz); DNP acceptable |
| CAN winding current through FL1 (120 Ω termination) | 1.5 V / 120 Ω | **12.5 mA** (FL1 rated 200 mA — 93.75% margin) |
| RXD output filter f_−3dB (R14 = 47 Ω, C_GPIO ≈ 5 pF) | 1 / (2π × 47 × 5 pF) | **677 MHz** — zero impact on CAN signal |
| Bus edge rise time at Rs = 10 kΩ (SLLS557H Fig. 39) | 50–100 ns | 1.25–2.5% of NMEA 2000 bit period (4 µs @ 250 kbps) ✓ |
| U9 V_clamp vs. U5 bus fault spec | V_clamp = 40 V @ 5 A; spec = ±36 V | ⚠️ 40 V clamp > 36 V spec — see Testing |
| NUP2105LT1G junction capacitance loading | 30 pF per line; ISO 11898-2 budget = 100 pF per node | **60 pF total** — within budget ✓ |

:::caution

Verification required — In service — installed on test vessel

**Verify during bring-up:**
- **EMC scan — CAN bus (CISPR 25 Class 5 / ISO 11452-2)**: Include NET-H, NET-L, TWAI_TX, and TWAI_RX in the full-board conducted and radiated emissions scan. Two-stage common-mode filter and pre-CMC TVS topology designed for CISPR 25 Class 5 compliance, but no formal measurement has been performed. Required before CE marking or MED certification. *(performance_review Gap 1)*
- **IEC 61000-4-2 ESD test on M12 CAN connector**: Apply Level 4 (±8 kV contact discharge) ESD pulses to NET-H and NET-L pins of J2. Confirm U9 and U5 survive and CAN communication resumes without reset. *(performance_review Gap 4)*
- **Bus fault survivability**: Simulate or bench-test worst-case bus fault scenario (battery connection to CAN bus, or ISO 7637-2 Pulse 5b). U9 V_clamp = 40 V @ 5 A exceeds U5 SN65HVD234 ±36 V spec by 4 V — U5 relies on internal fault structures above 36 V. Verify U5 survives. *(performance_review Gap 2)*

**Before next production run:**
- **Correct LCSC datasheet URLs in schematic**: C26, C27, C24, C25, C29, C19, C18, FL1, R14 all reference LCSC PDF URLs. Update to official manufacturer PDFs per project rules. Note: C19 schematic MPN (GCM188R71H104KA57D) differs from LCSC link (GRM188R71H104KA93D) — confirm intended part before ordering. *(schema_review Gap 2)*

**For next version:**
- **Evaluate post-CMC TVS** *(conditional on EMC test result)*: If CISPR 25 or ISO 11452-2 testing reveals susceptibility, add a post-CMC TVS (e.g., PESD15VL1BA) between FL1 and U5. *(performance_review Gap 3)*
- **Relocate R14/R15; move C18/C19 adjacent to U5 Pin 3**: Reduces VCC bypass trace from ~2.5 mm (courtyard-limited) to ≤ 0.5 mm per SN65HVD234 §12. *(pcb_review F1)*
- **Confirm 24 V operation not approved**: Document explicitly in product specification. U9 V_RWM = 24 V is adequate for 12 V NMEA 2000 only. *(schema_review Gap 8)*

:::

## References

1. Texas Instruments, [*SN65HVD23x 3.3-V CAN Bus Transceivers (SLLS557H)*](https://www.ti.com/lit/ds/symlink/sn65hvd234.pdf)
2. Texas Instruments, [*Layout Recommendations for PCBs Using High-Speed CAN Transceivers (SLLA271)*](https://www.ti.com/lit/an/slla271/slla271.pdf) — connector-first TVS topology (§3, Fig. 7)
3. onsemi, [*NUP2105LT1G Dual-Line CAN TVS Diode Datasheet*](http://www.onsemi.com/pub_link/Collateral/NUP2105L-D.PDF)
4. TDK, [*ACT45B Type Common Mode Filter/Choke*](https://product.tdk.com/en/search/emc/emc/cmfc_auto/info?part_no=ACT45B-510-2P-TL003)
5. Yageo, [*RC Series 0603 Chip Resistor Datasheet*](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf)
6. Murata, [*GCM1885C2A150JA16D — 15 pF / 100 V C0G 0603 MLCC*](https://www.murata.com/en-us/products/productdetail?partno=GCM1885C2A150JA16D)
7. National Marine Electronics Association, [*NMEA 2000 Standard*](https://www.nmea.org/nmea-2000.html)
8. ISO, *ISO 11898-2:2016 — Road Vehicles — Controller Area Network (CAN) — Part 2: High-speed medium access unit*
9. IEC, *IEC 61000-4-2 — Electromagnetic compatibility (EMC) — Testing and measurement techniques — Electrostatic discharge immunity test*
