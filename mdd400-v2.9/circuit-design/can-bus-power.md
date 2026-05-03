---
title: CAN Bus Power Protection
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/can_bus_power_5c32b433.svg" alt="CAN Bus Power Protection schematic" />

:::note Hardware version
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

## Components

| Ref | Value | Description | Datasheet |
|---|---|---|---|
| D10 | SM8S36CA | Bidirectional TVS, 36 V standoff, 58.1 V / 6.6 kW clamp, DO-218AB — primary input transient protection | [SM8S36CA](https://www.lcsc.com/datasheet/C4355049.pdf) |
| M2 | V33MLA1206NH | MOV, 75 V rated, 43.5 V clamp at 1 A, 1206 — secondary slow-transient absorber in parallel with D10 | [V33MLA1206NH](https://lcsc.com/datasheet/lcsc_datasheet_2410121837_Littelfuse-V33MLA1206NH_C187727.pdf) |
| D12 | SS34 | Schottky rectifier, 40 V / 3 A, SMA — reverse polarity protection in series with NET-S rail | [SS34](https://www.lcsc.com/datasheet/lcsc_datasheet_2310100931_MSKSEMI-SS34-MS_C2836396.pdf) |
| F1 | BSMD1812-050 | PTC resettable fuse, 500 mA hold / 1 A trip, 60 V, 1812 — series current limiting | [BSMD1812-050](https://lcsc.com/datasheet/lcsc_datasheet_2504101957_BHFUSE-BSMD1812-050-60V_C883142.pdf) |
| C51, C52 | 22 µF / 100 V | X7R MLCC, 2220 — bulk input capacitors; post-fuse surge energy storage and damping | [FS55X225K251EGG](https://www.lcsc.com/datasheet/lcsc_datasheet_2304140030_PSA-Prosperity-Dielectrics-FS55X225K251EGG_C153032.pdf) |
| R60 | 100 mΩ | 0603 thick-film — series damping resistor for bulk capacitor stage | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R53 | 220 mΩ | 0603 thick-film — inter-stage damping between bulk caps and EMI filter | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R54 | 100 kΩ | 0603 — bleed resistor; discharges bulk capacitors after power removal | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| L4 | 1 µH | Power inductor, 3.5 A / 4.6 A sat., 4×4 mm — EMI filter stage 1 | [Murata LQM/LQH (LCSC C602020)](https://www.lcsc.com/datasheet/C602020.pdf) |
| C47 | 1 µF / 100 V | X7R MLCC, 1206 — stage 1 filter output capacitor | — |
| C45 | 4.7 µF / 100 V | X7R MLCC, 1206 — stage 1 filter output capacitor (∥ C47) | [LCSC C2997285](https://www.lcsc.com/datasheet/C2997285.pdf) |
| L3 | 4.7 µH | Power inductor, 2.1 A / 2.6 A sat., 4×4 mm — EMI filter stage 2 | [Murata LQM/LQH (LCSC C602022)](https://www.lcsc.com/datasheet/C602022.pdf) |
| C43 | 22 µF / 100 V | X7R MLCC, 2220 — stage 2 filter bulk output capacitor | [FS55X225K251EGG](https://www.lcsc.com/datasheet/lcsc_datasheet_2304140030_PSA-Prosperity-Dielectrics-FS55X225K251EGG_C153032.pdf) |
| C46 | 4.7 µF / 100 V | X7R MLCC, 1206 — stage 2 filter output capacitor (∥ C43) | [LCSC C2997285](https://www.lcsc.com/datasheet/C2997285.pdf) |
| C44 | 100 nF / 100 V | X7R MLCC, 0603 — high-frequency decoupling at V_P1 output | [Murata GCJ188R72A104KA01D](https://www.lcsc.com/datasheet/C161117.pdf) |
| C42 | 100 nF / 100 V | X7R MLCC, 0603 — high-frequency decoupling at V_P1 (∥ C43/C44/C46) | [Murata GCJ188R72A104KA01D](https://www.lcsc.com/datasheet/C161117.pdf) |
| R45 | 68 kΩ | 0603 — upper arm of OVP voltage divider (V_P1 to Q7 base) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R46 | 2.4 kΩ | 0603 — lower arm of OVP voltage divider (Q7 base to GNDREF) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C41 | 100 nF / 50 V | X7R MLCC, 0603 — noise filter on OVP divider node | [Murata GRM188R71H104KA93D](https://www.lcsc.com/datasheet/lcsc_datasheet_2410010301_Murata-Electronics-GRM188R71H104KA93D_C77055.pdf) |
| Q7 | MMBTA56LT1G | PNP BJT, 80 V / 500 mA, SOT-23 — OVP sense transistor | [onsemi MMBTA56LT1G](https://www.onsemi.com/pub/Collateral/MMBTA56LT1G-D.pdf) |
| R44 | 22 kΩ | 0603 — Q6 gate pull-down; holds Q6 on under normal operating conditions | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R39 | 4.7 Ω | 0603 — Q6 gate series resistor; limits gate charging current and damps oscillation | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| D8 | BZT52C7V5S | Zener, 7.5 V / 200 mW, SOD-323 — clamps Q6 VGS to protect gate oxide | [Diodes Inc BZT52C7V5S](https://www.diodes.com/assets/Datasheets/BZT52C.pdf) |
| Q6 | PMV240SPR | P-channel MOSFET, 100 V / 1.2 A / 365 mΩ RDS(on), SOT-23 — series OVP pass switch | [Nexperia PMV240SPR](https://assets.nexperia.com/documents/data-sheet/PMV240SPR.pdf) |
| D7 | PESD15VL1BA | Bidirectional TVS, 15 V standoff, 44 V clamp, 200 W, SOD-323 — secondary surge protection on VS+ output | [Nexperia PESD15VL1BA](https://assets.nexperia.com/documents/data-sheet/PESD15VL1BA.pdf) |
| R33 | 330 mΩ | 0603 thick-film — current-sense shunt on VS+ output (annotated: 80 mV = 242 mA) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |

## How It Works

The CAN bus power circuit takes the raw 12 V NMEA 2000 backbone supply (`NET-S`, arriving via the `VSC` global net) and conditions it through four sequential stages: input surge protection, polarity protection and fusing, two-stage differential EMI filtering, and an over-voltage protection (OVP) pass switch. The filtered and protected output (`VS+`) supplies the CAN transceiver and related downstream circuitry.

**Input protection stage.** D10 (SM8S36CA, 36 V standoff, 58.1 V clamp) is placed directly across NET-S to absorb ISO 7637-2 transients — load dump (Pulse 5b), relay switching (Pulses 1, 2a), and ESD up to ±30 kV contact discharge. M2 (V33MLA1206NH MOV, 75 V rated, 43.5 V clamp at 1 A) is fitted in parallel to absorb slower, higher-energy transients that would sustain D10 conduction; the MOV's softer clamping characteristic complements the TVS's fast response. D12 (SS34 Schottky, 40 V / 3 A) is in series in the power path for passive reverse polarity protection. F1 (BSMD1812-050, 500 mA hold / 1 A trip PTC) limits sustained overcurrent after the polarity diode.

**Bulk damping stage.** C51 and C52 (2 × 22 µF / 100 V, 2220 MLCC) in parallel form a 44 µF bulk reservoir that stores clamped surge energy, decouples the upstream cable impedance, and damps post-clamp ringing. R60 (100 mΩ) provides series damping within the bulk stage; R53 (220 mΩ) provides additional damping between the bulk stage and the EMI filter input, suppressing LC resonance in the combined network (combined 320 mΩ ≈ 1.06 × R_crit = 301 mΩ — critically damped, Q ≈ 0.47). R54 (100 kΩ) bleeds stored charge after power removal.

**Two-stage EMI filter.** L4 (1 µH, 3.5 A) feeds [C47 (1 µF) ∥ C45 (4.7 µF)] forming stage 1 (f₁ = 66.6 kHz). L3 (4.7 µH, 2.1 A) feeds [C46 (4.7 µF) ∥ C43 (22 µF) ∥ C44 (100 nF) ∥ C42 (100 nF)] forming stage 2 (f₂ = 14.2 kHz) on the filtered `V_P1` net. The cascaded ladder provides >60 dB differential-mode attenuation at 10 MHz, suppressing both incoming backbone noise and outgoing emissions from the internal switching regulators.

**Over-voltage protection (OVP) stage.** Q6 (PMV240SPR, P-channel MOSFET) acts as a series pass switch between V_P1 and VS+. Under normal conditions, R44 (22 kΩ) pulls Q6's gate low relative to its source, keeping it on. The divider R45 (68 kΩ) / R46 (2.4 kΩ) monitors V_P1; when V_P1 rises above approximately 19.1 V (V_trip = V_BE × (R45 + R46) / R46 = 0.65 V × 29.4 = 19.1 V; schematic annotates ~18.6 V reflecting component tolerances), Q7 (MMBTA56LT1G PNP) turns on and pulls Q6's gate toward V_P1, turning Q6 off and disconnecting VS+. C41 (100 nF) on the divider node provides noise immunity. D8 (BZT52C7V5S, 7.5 V zener) clamps Q6's VGS. The circuit is self-resetting when input voltage drops back below the threshold. On the VS+ output, D7 (PESD15VL1BA, 44 V clamp) provides secondary residual-surge protection, and R33 (330 mΩ, annotated "80 mV = 242 mA") is the current-sense shunt feeding the INA219 current monitor on the I²C sensors sub-sheet.

## Design Rationale

The SM8S36CA was selected for its 6.6 kW / 10 µs peak rating and DO-218AB package, which provides the thermal mass needed for ISO 7637-2 Pulse 5b load-dump events. Thermal analysis confirms only ~8 °C junction temperature rise under a 12 V system Pulse 5b (87 V open-circuit, 400 ms), leaving a 57 °C margin to T_j(max) at 85 °C ambient. The device is unsuitable for 24 V Pulse 5b (~18 J), which constrains the MDD400 to 12 V NMEA 2000 systems for full transient compliance.

The MOV (M2) in parallel with D10 serves a complementary role: TVS diodes respond to fast transients in nanoseconds but have limited energy capacity; MOVs absorb slower, higher-energy events more efficiently. This combination improves protection robustness without requiring a larger TVS.

The Schottky diode (D12) for reverse polarity protection was chosen over a MOSFET ideal-diode circuit because the generous input headroom (12 V input to 3.3/5 V regulated outputs) makes the ~0.38 V forward-voltage drop acceptable, and the passive solution has no failure modes from gate-drive faults or latch-up.

The two-stage LC filter architecture was chosen over a single-stage to achieve steeper roll-off at low frequencies. Two cascaded stages each contributing −40 dB/decade above their respective corners (66.6 kHz and 14.2 kHz) produce a combined slope exceeding −80 dB/decade above 67 kHz — sufficient to meet CISPR 32 Class B conducted limits with margin.

The OVP threshold of ~18.6–19.1 V protects downstream devices from accidental 24 V supply connections (which would otherwise exceed the INA219 VS abs-max of 40 V and the CAN transceiver supply ratings) while passing the NMEA 2000 operating range of 9–16 V with ample margin. The BJT-based OVP topology was chosen over a dedicated supervisor IC to minimise component count; the PNP sense transistor and P-channel pass switch form a latch-free, self-resetting circuit.

## PCB Layout

The entire CAN bus power circuit operates within the board-level GNDREF domain (CAN power domain ground). There is no ground isolation within this sub-sheet — all ground returns stitch to the common GNDREF plane. The MPS EMI priority-zone topology assigns this circuit to the main GNDREF region, with the large 9063 mm² copper pour providing low-impedance return paths throughout.

| # | Requirement | Status | Notes |
|---|---|---|---|
| P1 | D10, M2 within 3–5 mm of J2 NET-S pad | Accepted — physical constraint | 17.4 mm due to DeviceNet connector body/flange preventing closer DO-218AB placement; 1.8 mm NET-S trace accepted |
| P2 | C51, C52 side-by-side after F1; GNDREF vias stitched | Met | 6.1 mm separation; copper pour and GNDREF vias confirmed |
| P3 | EMI filter chain linear, L4–L3 ≥ 5 mm | Met | L4→L3 = 6.0 mm; no stage interleaving |
| P4 | OVP cluster (Q6, Q7, R45/R46/C41) grouped; Q7→R39→Q6 gate short | Met | Gate loop 5.1 mm²; OVP block in 3.4 × 9 mm footprint |
| P5 | D7 on VS+ downstream of R33; copper fills both pads | Met | D7 3.1 mm from R33; VS+ copper pour covers both |
| P6 | D8 within 2 mm of Q6 gate/source | Partial | 3.0 mm — benign at OVP µs timescale; flagged for v2.10 |
| R1 | NET-S trace ≥ 1.0 mm | Met | 1.8 mm routed + 27 mm² copper pour in clamp loop |
| R2 | V_P1 ≥ 0.5 mm; no shared via with OVP divider | Met | V_P1 as 58 mm² pour; no shared via confirmed |
| R3 | R33 shunt — Kelvin connections | Partial | Acceptable for V2.9; inner-edge tap not confirmed; flagged for v2.10 |
| R4 | R53 in series, ≥ 0.5 mm | Met | 0.9 mm pads; series in-line placement confirmed |
| R5 | Gate loop area < 50 mm² | Met | ~5.1 mm² — well within limit |
| G1 | All on GNDREF; no isolated domain ground | Met | All 27 components verified on GNDREF or circuit nets only |
| G2 | TVS/MOV return via copper pour, not traces | Met | 9063 mm² GNDREF pour; 23 vias in D10 anode region |
| G3 | Filter cap returns individual short vias | Unverifiable | Pour topology consistent with individual vias; cannot confirm from geometry alone |
| G4 | OVP divider ground at quiet point | Unverifiable | OVP at y=92–96, bulk caps at y=118 — 20 mm physical separation reduces coupling |
| G5 | No split plane or guard ring within circuit | Met | Single GNDREF domain; no keepouts or splits found |
| D1 | C41 within 2 mm of Q7 base | Partial | 3.6 mm; electrically close via copper pour; benign at ms OVP timescales |
| D2 | C44 at V_P1 output | Met | Adjacent to C43 at L3 output |
| D3 | C42 at V_P1 stage 2 output | Met | Correctly on V_P1 alongside C43/C44/C46 |
| D4 | Filter caps adjacent to inductors; vias at body | Met | Caps 4.7–8.2 mm from respective inductors; GNDREF vias confirmed |
| T1 | D10 anode pour ≥ 300 mm²; ≥ 2 vias to inner plane | Met | 9063 mm² pour; 23 vias in D10 region stitching to In1.Cu and In2.Cu |
| T2 | D12 cathode copper pour | Met | 8 mm² pour on cathode; anode on GNDREF pour |
| T3 | Q6 SOT-23 standard pad; no thermal via | Met | 21–33 mW at nominal current — well within 710 mW limit |
| T4 | L4, L3 identically oriented | Met | Both at 90° rotation |
| T5 | F1 ≥ 5 mm from C41 and Q7 | Met | 23.8 mm to C41; 24.2 mm to Q7 |

**Non-obvious placements:**

- **Input protection cluster (D10, M2, D12, F1)** at x:[86–95] y:[105–116] is 15–17 mm from J2 rather than the target 3–5 mm. The DeviceNet connector body and PCB mounting flange physically prevent the tall DO-218AB package (D10) from being placed closer. The 1.8 mm NET-S trace adds ~10 nH to the clamp path; at 15 mA/ns dI/dt this contributes ~150 mV additional clamp overshoot above 58.1 V — within the margin of all downstream devices.

- **EMI filter chain** runs top-to-bottom along the decreasing-y axis, with inductors on the right column (x ≈ 80.5 mm) and filter capacitors on the left column (x ≈ 74–80 mm). This left/right split keeps the two LC stages in linear order without interleaving and achieves the ≥5 mm inter-inductor spacing needed to prevent magnetic coupling.

## Design Calculations

### Over-Voltage Protection Threshold

| Parameter | Value | Source |
|---|---|---|
| R45 (upper divider) | 68 kΩ | Schematic |
| R46 (lower divider) | 2.4 kΩ | Schematic |
| Q7 V_BE (nominal) | 0.65 V | Datasheet typical |
| V_trip (calculated) | **19.1 V** | V_BE × (R45+R46)/R46 |
| Schematic annotation | ~18.6 V | Implies V_BE = 0.634 V |
| Discrepancy | 2.7% | Within BJT V_BE spread (0.60–0.70 V) |
| Margin to INA219 VS abs-max (40 V) | 52% | (40−19.1)/40 |

### Pass Switch and Diode Losses

| Component | Condition | Power dissipation |
|---|---|---|
| Q6 PMV240SPR (R_DS(on) = 365 mΩ) | 242 mA nominal | 21.4 mW |
| Q6 PMV240SPR | 500 mA (PTC hold) | 91.3 mW (13% of 710 mW limit) |
| D12 SS34 (V_F ≈ 0.38 V) | 242 mA nominal | 91.9 mW |

### EMI Filter

| Stage | L | C_total | f_corner |
|---|---|---|---|
| Stage 1 (L4) | 1 µH | C47 (1 µF) ∥ C45 (4.7 µF) = 5.7 µF | **66.6 kHz** |
| Stage 2 (L3) | 4.7 µH | C46 (4.7 µF) ∥ C43 (22 µF) ∥ C44 (100 nF) ∥ C42 (100 nF) = 26.9 µF | **14.2 kHz** |

Combined attenuation: >60 dB at 10 MHz, >100 dB above 100 MHz (simulation from old-docs; CISPR 32 scan required to validate against V2.9 values — see Testing & Verification).

### Bulk Stage Resonance Damping

| Parameter | Value |
|---|---|
| L_eff (L4) | 1 µH |
| C_bulk (C51 ∥ C52) | 44 µF |
| Critical damping resistance R_crit | 2 × √(L/C) = **301 mΩ** |
| Actual damping (R53 + R60) | 220 + 100 = **320 mΩ** |
| Quality factor Q | √(L/C) / R_damp = **0.47** (critically damped) |

### ISO 7637-2 Pulse 5b — Thermal (SM8S36CA, 12 V system)

| Parameter | Value |
|---|---|
| Test level | Level IV: V_oc = 87 V, R_i = 0.5 Ω, t = 400 ms |
| Peak clamp current | (87 − 58.1) / 0.5 = 57.8 A |
| Peak clamping power | 58.1 × 57.8 = 3358 W |
| Energy absorbed (simulation) | ~320 mJ |
| Estimated ΔTj | **~8 °C** |
| T_j at T_amb = 85 °C | 93 °C — 57 °C below T_j(max) 150 °C |

### NMEA 2000 LEN Budget

| Operating mode | Current | LEN (1 LEN = 83.3 mA at 12 V) |
|---|---|---|
| Nominal (242 mA) | 242 mA | **2.9 LEN** |
| PTC hold (500 mA) | 500 mA | **6.0 LEN** |
| Limit | — | 8 LEN |

:::caution Testing & Verification — Fabricated prototype — testing phase

**Before next production run:**
- Update `can_bus_power.kicad_sch` title block rev from "2.8" to "2.9" to match the enclosing hardware version.

**Verify during bring-up:**
- **OVP trip voltage**: Measure actual OVP disconnect voltage on prototype. Confirm threshold is in the 18.6–19.1 V range. Note: schematic annotation says ~18.6 V; component calculation gives 19.1 V — 2.7% discrepancy within BJT V_BE tolerance.
- **D7 clamp voltage under transient**: Measure or SPICE-simulate loaded clamp voltage of D7 (PESD15VL1BA) with INA219 input impedance under a representative post-OVP residual transient. D7 open-circuit clamp is 44 V; INA219 VS abs-max is 40 V. At rated 200 W with INA219 input loading the clamped voltage will be lower than open-circuit, but this has not been quantitatively confirmed.
- **EMI filter attenuation**: Perform conducted-emission scan (CISPR 32 Class B) on the prototype to validate the >60 dB at 10 MHz attenuation claim. The simulation result originates from old-docs and has not been re-run against V2.9 component values; the calculated corner frequencies (66.6 kHz and 14.2 kHz) are consistent with the claim but empirical validation is required.
- **VS+ load current**: Measure total VS+ current draw from the CAN transceiver and connected drivers to confirm it remains below the 500 mA PTC hold threshold in all operating modes.

**For next version:**
- **D7 TVS substitution** (conditional on test result): If testing confirms the loaded clamp voltage exceeds INA219 VS abs-max (40 V), substitute D7 with a same-footprint SOD-323 bidirectional TVS with V_clamp ≤ 40 V — e.g. PESD12VL1BA (12 V standoff, ~34 V clamp at 200 W). Verify clamp current against INA219 input impedance before selecting.
- **R33 Kelvin routing**: Route INA219 IN+ and IN− sense traces from the inner edges of R33 pad 1 and pad 2 respectively, separate from the main VS+/VSC power traces. Current routing is acceptable but not optimal for current measurement accuracy.
- **C41 and D8 proximity** (nice-to-have): Tighten C41 to within 2 mm of Q7 base pin (currently 3.6 mm) and D8 to within 2 mm of Q6 gate/source (currently 3.0 mm). Both deviations are functionally benign at OVP µs timescales.
- **EMI filter simulation source**: Add LTspice `.asc` source file to `design-docs/` using V2.9 component values to replace the untraced old-docs attenuation figures.
:::

## References

1. SMC Diode Solutions, [*SM8S36CA Bidirectional TVS Diode Datasheet*](https://www.lcsc.com/datasheet/C4355049.pdf)
2. Littelfuse, [*V33MLA1206NH Metal Oxide Varistor Datasheet*](https://lcsc.com/datasheet/lcsc_datasheet_2410121837_Littelfuse-V33MLA1206NH_C187727.pdf)
3. MSKSEMI, [*SS34 Schottky Barrier Rectifier Datasheet*](https://www.lcsc.com/datasheet/lcsc_datasheet_2310100931_MSKSEMI-SS34-MS_C2836396.pdf)
4. BHFUSE, [*BSMD1812-050 PTC Resettable Fuse Datasheet*](https://lcsc.com/datasheet/lcsc_datasheet_2504101957_BHFUSE-BSMD1812-050-60V_C883142.pdf)
5. onsemi, [*MMBTA56LT1G PNP General-Purpose Transistor Datasheet*](https://www.onsemi.com/pub/Collateral/MMBTA56LT1G-D.pdf)
6. Nexperia, [*PMV240SPR P-Channel MOSFET Datasheet*](https://assets.nexperia.com/documents/data-sheet/PMV240SPR.pdf)
7. Diodes Incorporated, [*BZT52C7V5S Zener Diode Datasheet*](https://www.diodes.com/assets/Datasheets/BZT52C.pdf)
8. Nexperia, [*PESD15VL1BA Bidirectional TVS Diode Datasheet*](https://assets.nexperia.com/documents/data-sheet/PESD15VL1BA.pdf)
9. PSA Prosperity Dielectrics, [*FS55X225K251EGG 22 µF / 100 V MLCC Datasheet*](https://www.lcsc.com/datasheet/lcsc_datasheet_2304140030_PSA-Prosperity-Dielectrics-FS55X225K251EGG_C153032.pdf)
10. Murata Electronics, [*GCJ188R72A104KA01D 100 nF / 100 V MLCC Datasheet*](https://www.lcsc.com/datasheet/C161117.pdf)
11. Murata Electronics, [*1 µH / 3.5 A Power Inductor Datasheet (LCSC C602020)*](https://www.lcsc.com/datasheet/C602020.pdf)
12. Murata Electronics, [*4.7 µH / 2.1 A Power Inductor Datasheet (LCSC C602022)*](https://www.lcsc.com/datasheet/C602022.pdf)
13. Yageo, [*RC_Group 0603 Thick-Film Resistor Series Datasheet*](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf)
14. Texas Instruments, [*INA219 Zero-Drift Bidirectional Current/Power Monitor Datasheet*](https://www.ti.com/lit/ds/symlink/ina219.pdf)
15. International Standards Organization, [*ISO 7637-2:2011 — Road vehicles: Electrical disturbances from conduction and coupling, Part 2: Supply lines*](https://www.iso.org/standard/50925.html)
16. NMEA, [*NMEA 2000 Standard*](https://www.nmea.org/nmea-2000.html)
17. Monolithic Power Systems, [*EMI Webinar: Practical Grounding and Layout*](https://www.monolithicpower.com/en/support/videos/emi-2-webinar-early-session.html)
