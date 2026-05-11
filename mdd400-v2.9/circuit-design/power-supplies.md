---
title: Power Supplies
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/power_supplies_0eeb927d.svg" alt="Power Supplies schematic" />

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype — testing phase

:::

## Components

| Ref | Value | Description | Datasheet |
|---|---|---|---|
| U6 | LMR51610 | Synchronous buck converter, 4–65 V in, 1 A, SOT-23, 400 kHz — VDD 5.0 V | [TI LMR51610](/assets/datasheets/mdd400-v2.9/LMR51610.pdf) |
| U1 | LMR51610 | Synchronous buck converter, 4–65 V in, 1 A, SOT-23, 400 kHz — VCC 3.3 V | [TI LMR51610](/assets/datasheets/mdd400-v2.9/LMR51610.pdf) |
| L2 | 22 µH | Semi-shielded power inductor, 1.62 A sat, 123 mΩ DCR, 5×5 mm — VDD output filter | [Bourns SRN5040TA](/assets/datasheets/mdd400-v2.9/SRN5040TA.pdf) |
| L1 | 22 µH | Semi-shielded power inductor, 1.62 A sat, 123 mΩ DCR, 5×5 mm — VCC output filter | [Bourns SRN5040TA](/assets/datasheets/mdd400-v2.9/SRN5040TA.pdf) |
| C33 | 10 µF/50 V | X7R 1210 MLCC — VDD input bulk decoupling | [Murata GRM32ER71H106KA12L](https://www.murata.com/en-us/products/productdetail?partno=GRM32ER71H106KA12L%40D) |
| C20, C32 | 10 µF/50 V | X7R 1210 MLCC — VDD output bulk capacitors (×2) | [Murata GRM32ER71H106KA12L](https://www.murata.com/en-us/products/productdetail?partno=GRM32ER71H106KA12L%40D) |
| C21 | 100 nF/50 V | X7R 0603 MLCC — VDD input high-frequency decoupling | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| C25 | 100 nF/50 V | X7R 0603 MLCC — VDD bootstrap hold reservoir (VSD→SW) | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| C23 | 1 pF/100 V | C0G 0603 MLCC — VDD bootstrap capacitor (BST–SW pin) | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| C31 | 100 pF/50 V | C0G 0603 MLCC — VDD feedback feedforward capacitor (across R19) | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| C24 | 1 nF/50 V | C0G 0603 MLCC — VDD SW-node snubber capacitor (DNP) | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| C15 | 10 µF/50 V | X7R 1210 MLCC — VCC input bulk decoupling | [Murata GRM32ER71H106KA12L](https://www.murata.com/en-us/products/productdetail?partno=GRM32ER71H106KA12L%40D) |
| C5, C14 | 10 µF/50 V | X7R 1210 MLCC — VCC output bulk capacitors (×2) | [Murata GRM32ER71H106KA12L](https://www.murata.com/en-us/products/productdetail?partno=GRM32ER71H106KA12L%40D) |
| C6 | 100 nF/50 V | X7R 0603 MLCC — VCC input high-frequency decoupling | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| C10 | 100 nF/50 V | X7R 0603 MLCC — VCC bootstrap hold reservoir (VSD→SW) | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| C7 | 1 pF/100 V | C0G 0603 MLCC — VCC bootstrap capacitor (BST–SW pin) | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| C13 | 100 pF/50 V | C0G 0603 MLCC — VCC feedback feedforward capacitor (across R6) | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| C9 | 1 nF/50 V | C0G 0603 MLCC — VCC SW-node snubber capacitor (DNP) | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| R19 | 100 kΩ | Thick film 0603 — VDD feedback upper divider | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R18 | 19.1 kΩ | Thin film 0603 — VDD feedback lower divider (sets 5.0 V output with R19) | — |
| R23 | 22 Ω | Thick film 0603 — VDD SW-node snubber resistor, series with C24 (DNP) | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R6 | 100 kΩ | Thick film 0603 — VCC feedback upper divider | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R5 | 32 kΩ | Thin film 0603 — VCC feedback lower divider (sets 3.3 V output with R6) | — |
| R7 | 22 Ω | Thick film 0603 — VCC SW-node snubber resistor, series with C9 (DNP) | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| FB2 | 600 Ω@100 MHz | 1206 ferrite bead, 80 mΩ DCR — VDD output EMI filter (5V0→VDD) | [Murata BLM31KN601SN1L](https://www.murata.com/en-us/products/productdetail?partno=BLM31KN601SN1L%40T) |
| FB1 | 600 Ω@100 MHz | 1206 ferrite bead, 80 mΩ DCR — VCC output EMI filter (3v3→VCC) | [Murata BLM31KN601SN1L](https://www.murata.com/en-us/products/productdetail?partno=BLM31KN601SN1L%40T) |
| FB4 | 600 Ω@100 MHz | 1206 ferrite bead, 80 mΩ DCR — CAN-to-SMPS input filter (VSC→VSD) | [Murata BLM31KN601SN1L](https://www.murata.com/en-us/products/productdetail?partno=BLM31KN601SN1L%40T) |
| TP1 | GNDREF | Test point on GNDREF rail (DNP) | — |

> **Snubber footprints DNP by default:** R23/C24 (VDD) and R7/C9 (VCC) are placed on the board but not populated. Footprints are retained for post-EMC-test population if SW-node ringing requires damping.

## How It Works

The `power_supplies` sheet implements two independent synchronous buck converters that generate the regulated rails from the VSD input (nominally 12 V, supplied from the `can_bus_power` sheet via FB4). A single ground reference, GNDREF, serves both converters and the digital domain — V2.9 eliminated the galvanic isolation transformer present in V2.8, eliminating both a separate PGND domain and the push-pull driver/transformer stage. FB4 (VSC→VSD) at the sheet boundary provides EMI filtering at the CAN-to-SMPS domain interface.

**VDD 5.0 V converter (U6, L2):** U6 (LMR51610XDBVR) operates at 400 kHz. The input stage uses C33 (10 µF/50 V X7R 1210) for bulk energy storage and C21 (100 nF X7R 0603) for high-frequency bypass directly at the VIN pin. The SW pin drives L2 (Bourns SRN5040TA-220M, 22 µH, 1.62 A sat) followed by C20 and C32 (2× 10 µF X7R 1210) as the output filter. Output voltage is set by the feedback divider R19 (100 kΩ upper) / R18 (19.1 kΩ lower): Vout = 0.8 × (1 + 100/19.1) = 4.989 V ≈ 5.0 V. C31 (100 pF C0G) is the feedforward capacitor across R19. The bootstrap path uses C23 (1 pF C0G, directly between BST and SW pins) for gate-drive charging, and C25 (100 nF X7R, connecting VSD to the SW node) as the BST hold reservoir during converter start-up and light load. Snubber components R23 (22 Ω) and C24 (1 nF) are placed at the edge of the SW copper pour and are DNP. FB2 bridges the 5V0 net to the VDD rail at the SMPS/digital boundary. Maximum output is 250 mA.

**VCC 3.3 V converter (U1, L1):** Identical topology to VDD. U1 configured at 400 kHz. Input: C15 (10 µF bulk) + C6 (100 nF HF bypass). L1 (22 µH SRN5040TA) + C5/C14 (2× 10 µF X7R 1210) output filter. Feedback: R6 (100 kΩ upper) / R5 (32 kΩ lower): Vout = 0.8 × (1 + 100/32) = 3.300 V exactly. C13 (100 pF C0G) feedforward across R6. Bootstrap: C7 (1 pF C0G) BST capacitor + C10 (100 nF X7R) BST hold reservoir (VSD→SW). Snubber R7/C9 are DNP. FB1 bridges 3v3 to VCC at the domain boundary. Peak output 275 mA during ESP32 Wi-Fi transmit.

## Design Rationale

The LMR51610 integrates synchronous rectification, operates over a wide input range (4–65 V), and is available in a compact SOT-23 package. The 400 kHz fixed switching frequency reduces inductor size compared with 200–300 kHz legacy designs while remaining below 1 MHz, where switching losses and RF emissions increase significantly. Both converters share the same IC, inductor, and capacitor types, reducing BOM complexity.

The Bourns SRN5040TA-220M (22 µH, 1.62 A sat, 123 mΩ DCR) is conservatively sized for this application: peak inductor current at maximum load reaches only ~460 mA — 28% of the saturation rating — leaving substantial margin against core saturation in temperature extremes or transient overloads. The semi-shielded construction contains radiated flux within the 5×5 mm body. Output capacitors use 1210-size X7R MLCCs; a smaller 0805 part at 12 V input would lose more than 60% of rated capacitance due to DC bias derating, whereas the 1210 X7R parts retain effective capacitance under operating bias.

V2.9 eliminated the galvanic isolation transformer and push-pull driver from V2.8, replacing them with a single GNDREF domain. Ferrite beads FB1 and FB2 are not isolation boundaries — they are high-side EMI filters on the output rails, attenuating switching ripple before it reaches the digital domain. FB4 at the CAN-to-SMPS input serves the same function on the power inlet. The layout implements the MPS EMI Webinar per-circuit ground isolation strategy (0.4 mm perimeter moat + layered GNDREF fills on all inner copper layers) to contain switching-domain EMI without requiring a separate ground plane.

## PCB Layout

The two LMR51610 converters are co-located in the SMPS region (X: 71.8–86.2 mm) on F.Cu, mirrored at Y = 53.8 mm (U1/VCC) and Y = 69.4 mm (U6/VDD), with 15.6 mm centre-to-centre spacing. The layout follows the MPS EMI Webinar circuit-level isolation strategy strictly: each converter cell is enclosed by a **0.4 mm `copper pour not allowed` keepout moat** on F.Cu, In1.Cu, and In2.Cu, preventing any external copper from entering. Inside each moat, a layered GNDREF fill (priority-1 tight zone → priority-14 full-cell zone on F.Cu; priority-26 solid fills on both In1.Cu and In2.Cu) provides the ground reference. 195 GNDREF vias (0.3 mm drill) stitch F.Cu to the inner planes. SW nodes are implemented as copper pours (not routed traces), eliminating SW-to-inductor trace inductance. Ferrite beads FB1 and FB2 at x = 89.0 mm are the sole high-frequency connections between the SMPS copper and the digital VCC/VDD regions.

The feedback lower-divider resistors (R5/R18) connect via through-vias to all four copper layers; on F.Cu the via lands on the outer surrounding GNDREF pour rather than the tight local pour that forms the VIN hot-loop return. Convergence of the feedback GND return and the VIN capacitor return occurs on the In1.Cu/In2.Cu planes — consistent with LMR51610 §8.4.1.2, which recommends placing the feedback return on a different layer or region from the SW node, with the ground plane providing shielding.

### Verification Summary

| # | Requirement | Status | Evidence |
|---|---|---|---|
| P1 | HF input caps (C6/C21) within 1–2 mm of VIN/GND pins | Met | C6↔U1: 2.62 mm; C21↔U6: 2.62 mm |
| P2 | BST caps (C7/C23) adjacent to BST and SW pins | Met | C7↔U1: 3.35 mm; C23↔U6: 3.35 mm, 0.2 mm trace |
| P3 | BST hold caps (C10/C25) adjacent to BST pin | Met | C10/C25 at x≈80.8; SW-side connection direct (0.3 mm) |
| P4 | Feedback dividers (R5/R6/C13; R18/R19/C31) close to FB pin | Met | R5/R18 at 3.19 mm; R6/R19 at 3.32 mm from IC |
| P5 | Output inductors connected to SW pin copper pour | Met | L1/L2 on same x-column; SW pour spans IC-to-inductor gap |
| P7 | Snubber footprints DNP; C9 correct | **⚠️ Partial** | C9 marked DNP; **C24, R7, R23 missing DNP attribute** |
| P8 | FB1/FB2 in-line at SMPS/digital boundary | Met | Both at x=89.0 mm, straddling SMPS copper (x≤86.2) and VCC/VDD copper (x≥88.5) |
| R1 | SW nets implemented as copper pour | Met | Zero routed segments; VCC SW pour 3×4 mm; VDD SW pour 3×3.85 mm |
| R2 | VIN/PGND hot-loop short | Met | C6/U1 GND share Y=53.8 mm; straight 3.625 mm return, loop area ≈6.6 mm² |
| G1 | Per-circuit layered GNDREF with via stitching | Met | 2×F.Cu tight+extended zones + 2×inner-plane fills per converter; 195 GNDREF vias |
| G2 | 0.4 mm keepout moat per circuit on 3 layers | Met | Two moats confirmed: U1 outer 71.8–86.2×45.8–64.2 mm; U6 outer 71.8–86.2×63.8–79.2 mm |
| G5 | AGND/PGND convergence | Met | R5/R18 vias to outer GNDREF pour on F.Cu; VIN-side and FB-side GND converge on In1.Cu/In2.Cu per §8.4.1.2 |
| T1 | U1/U6 GND via stitching to inner plane | Met | 195 GNDREF vias in SMPS area; SOT-23 no exposed pad — GND/output pins the dissipation path |

## Design Calculations

Key values from TI WEBENCH design reports (`design-docs/vdd_design_report.pdf`, `design-docs/vcc_design_report.pdf`) and schematic calculations.

### VDD 5.0 V (U6, L2)

| Parameter | Value | Conditions |
|---|---|---|
| Output voltage (calculated) | 4.989 V ≈ 5.0 V | Vref=0.8 V, R19=100 kΩ, R18=19.1 kΩ |
| IC power dissipation | ≈ 94 mW | WEBENCH Total Pd=0.09 W @ 240 mA, Vin=9–18 V |
| IC junction temp (25°C ambient) | 31–35°C | WEBENCH Tj chart, 240 mA output |
| IC junction temp (85°C ambient) | ≈ 91–95°C | WEBENCH ΔTj + 85°C — below 125°C limit |
| Inductor ripple ΔIL @ Vin=12 V | 331 mA | D=0.417, ΔIL = 5.0×0.583 / (22 µH × 400 kHz) |
| Peak inductor current @ Vin=12 V | 416 mA | 25.7% of Isat=1.62 A |
| Inductor dissipation | 7.7 mW | Iout² × DCR = 0.250² × 123 mΩ |
| WEBENCH simulation Vout | 5.0 V | Rfbb=19.1 kΩ — exact match to actual R18 |
| WEBENCH duty cycle | ≈55% / ≈28% | Vin=9 V / Vin=18 V |

### VCC 3.3 V (U1, L1)

| Parameter | Value | Conditions |
|---|---|---|
| Output voltage (calculated) | 3.300 V | Vref=0.8 V, R6=100 kΩ, R5=32 kΩ |
| IC power dissipation | ≈ 126 mW | WEBENCH Total Pd=0.11 W @ 240 mA, Vin=9–18 V |
| IC junction temp (25°C ambient) | 32–38°C | WEBENCH Tj chart, 240 mA output |
| IC junction temp (85°C ambient) | ≈ 94–100°C | WEBENCH ΔTj + 85°C — below 125°C limit |
| Inductor ripple ΔIL @ Vin=12 V | 272 mA | D=0.275, ΔIL = 3.3×0.725 / (22 µH × 400 kHz) |
| Peak inductor current @ Vin=12 V | 411 mA | 25.4% of Isat=1.62 A |
| Inductor dissipation | 9.3 mW | Iout² × DCR = 0.275² × 123 mΩ |
| WEBENCH simulation Vout | 3.3 V | Rfbb=32.0 kΩ — exact match to actual R5 |
| WEBENCH duty cycle | ≈37% / ≈19% | Vin=9 V / Vin=18 V |

### Ferrite Beads (FB1, FB2, FB4)

Murata BLM31KN601SN1L — 1206, 600 Ω @ 100 MHz, DCR = 80 mΩ.

| Ref | Rail | Max current | Dissipation |
|---|---|---|---|
| FB1 | 3v3 → VCC | 275 mA | 6.1 mW |
| FB2 | 5V0 → VDD | 250 mA | 5.0 mW |
| FB4 | VSC → VSD | 525 mA (VDD + VCC combined) | 22.1 mW |

FB4 carries the summed input current for both converters. At 525 mA the 22 mW dissipation is within the 1206 package rating — no thermal flag.

:::caution

Verification required — Fabricated prototype — testing phase

**Before next production run:**
- C24, R7, R23: set `(attr smd dnp)` in the PCB file to match schematic DNP designation; only C9 is currently marked DNP.

**Verify during bring-up:**
- Output ripple (VDD and VCC): no numerical ripple figure is available from the 2-page WEBENCH reports; measure at bench with oscilloscope.
- VCC ripple at 275 mA Wi-Fi burst: WEBENCH simulation is at 240 mA steady state; measure VCC undershoot and ripple during ESP32 Wi-Fi transmit with oscilloscope.
- Loop stability (phase margin / gain margin): values from old evidence file cannot be traced to a verified source; re-run WEBENCH with full Bode plot export, or measure on bench.
- BST hold cap trace length (C10, C25): both caps are at x≈80.8 mm, approximately 9 mm from the VSD strip pour; check BST pin waveform at first bring-up to confirm bootstrap charging is unaffected.
- Thermal model: θJA = 200 °C/W used for Tj calculations is from training knowledge; verify against LMR51610 datasheet Section 7.4 (DBV package).

:::

## References

- Texas Instruments, [*LMR516xx SIMPLE SWITCHER® 4-V to 65-V, 0.6-A/1-A Buck Converter Datasheet*](https://www.ti.com/lit/ds/symlink/lmr51610.pdf) — local copy: `/assets/datasheets/mdd400-v2.9/LMR51610.pdf`
- Texas Instruments, *WEBENCH Design Report — LMR51610DBVR, 9–18 V to 5.0 V @ 245 mA, Rfbb=19.1 kΩ* — `MDD400/hardware/MDD400_V2.9/design-docs/vdd_design_report.pdf`
- Texas Instruments, *WEBENCH Design Report — LMR51610DBVR, 9–18 V to 3.3 V @ 300 mA, Rfbb=32.0 kΩ* — `MDD400/hardware/MDD400_V2.9/design-docs/vcc_design_report.pdf`
- Texas Instruments, [*Controlling switch-node ringing in synchronous buck converters*](https://www.ti.com/lit/an/slyt465/slyt465.pdf), Application Note SLYT465
- Texas Instruments, [*Design Consideration on Boot Resistor in Buck Converter*](https://www.ti.com/lit/an/snvaa73/snvaa73.pdf), Application Note SNVAA73
- Bourns, [*SRN5040TA Semi-shielded AEC-Q200 Power Inductors Datasheet*](https://www.bourns.com/docs/product-datasheets/srn5040ta.pdf) — local copy: `/assets/datasheets/mdd400-v2.9/SRN5040TA.pdf`
- Murata, [*GRM32ER71H106KA12L 10 µF 1210 X7R Capacitor*](https://www.murata.com/en-us/products/productdetail?partno=GRM32ER71H106KA12L%40D)
- Murata, [*GRM188R71H104KA93D 0603 MLCC Series*](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D)
- Murata, [*BLM31KN601SN1L 1206 Ferrite Bead*](https://www.murata.com/en-us/products/productdetail?partno=BLM31KN601SN1L%40T)
- Yageo, [*RC Group Thick Film Chip Resistors*](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf)
- Monolithic Power Systems, [*EMI Webinar: Practical Grounding and Layout*](https://www.monolithicpower.com/en/support/videos/emi-2-webinar-early-session.html)
