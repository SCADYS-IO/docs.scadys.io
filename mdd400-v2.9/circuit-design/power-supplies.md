---
title: Power Supplies
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/power_supplies.svg" alt="Power Supplies schematic" />

:::note Hardware version
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

## Components

| Ref | Value | Description | Datasheet |
|---|---|---|---|
| U1 | LMR51610 | 4–65 V 1 A synchronous buck converter, SOT-23 (VCC 3.3 V) | [TI LMR51610](https://www.ti.com/lit/ds/symlink/lmr51610.pdf) |
| U6 | LMR51610 | 4–65 V 1 A synchronous buck converter, SOT-23 (VDD 5.0 V) | [TI LMR51610](https://www.ti.com/lit/ds/symlink/lmr51610.pdf) |
| L1 | 22 µH | Shielded power inductor, 1.6 A, 123 mΩ DCR (VCC) | [Bourns SRN5040TA-220M](https://www.bourns.com/docs/product-datasheets/srn5040ta.pdf) |
| L2 | 22 µH | Shielded power inductor, 1.6 A, 123 mΩ DCR (VDD) | [Bourns SRN5040TA-220M](https://www.bourns.com/docs/product-datasheets/srn5040ta.pdf) |
| C5, C14 | 10 µF/50 V | 1210 X7R MLCC — input bulk capacitor (VCC) | [Murata GRM32ER71H106KA12L](https://www.murata.com/en-us/products/productdetail?partno=GRM32ER71H106KA12L%40D) |
| C15, C20 | 10 µF/50 V | 1210 X7R MLCC — output capacitor (VCC) | [Murata GRM32ER71H106KA12L](https://www.murata.com/en-us/products/productdetail?partno=GRM32ER71H106KA12L%40D) |
| C32, C33 | 10 µF/50 V | 1210 X7R MLCC — input/output capacitor (VDD) | [Murata GRM32ER71H106KA12L](https://www.murata.com/en-us/products/productdetail?partno=GRM32ER71H106KA12L%40D) |
| C6, C10 | 100 nF/50 V | 0603 X7R MLCC — high-frequency bypass | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| C7, C23 | 1 pF/100 V | 0603 C0G — snubber timing | — |
| C9, C24 | 1 nF/50 V | 0603 — feedforward capacitor | — |
| C13, C31 | 100 pF/50 V | 0603 C0G — feedforward capacitor | — |
| R5 | 32 kΩ | 0603 thin-film — RT resistor (switching frequency) | — |
| R6 | 100 kΩ | 0603 — feedback upper divider (VCC) | — |
| R42 | 30.9 kΩ | 0603 — feedback lower divider (VCC, sets 3.3 V) | — |
| R19 | 100 kΩ | 0603 — feedback upper divider (VDD) | — |
| R18 | 19.1 kΩ | 0603 thin-film — feedback lower divider (VDD, sets ~5.0 V) | — |
| FB1, FB2 | 600 Ω@100 MHz | 1206 ferrite bead — SMPS/DIGITAL ground isolation | [Murata BLM31KN601SN1L](https://www.murata.com/en-us/products/productdetail?partno=BLM31KN601SN1L%40T) |
| FB4 | 600 Ω@100 MHz | 1206 ferrite bead — power rail isolation | [Murata BLM31KN601SN1L](https://www.murata.com/en-us/products/productdetail?partno=BLM31KN601SN1L%40T) |

## How It Works

The power supplies sub-sheet generates the two regulated rails required by the DIGITAL domain. Both converters are synchronous buck regulators based on the Texas Instruments LMR51610, operating at 400 kHz and sharing the same inductor and capacitor types for BOM consolidation.

The VCC 3.3 V converter (U1) is configured with a 100 kΩ / 30.9 kΩ feedback divider to set the 3.3 V output. It supplies all digital logic: the ESP32-S3 module, the SN65HVD234 CAN transceiver logic side, TMP112, OPT3004, and INA219. Typical load is ~90 mA; it must support peak bursts up to ~275 mA during ESP32 Wi-Fi transmit. Simulated output ripple is &lt;8 mV peak-to-peak.

The VDD 5.0 V converter (U6) is configured with a 100 kΩ / 18 kΩ feedback divider, producing a 5.244 V output under WEBENCH simulation at 18 V input and 245 mA load. It powers the DWIN TFT display and the MLT-8530 buzzer exclusively. Peak current is ~250 mA at full display brightness. Simulated ripple is &lt;15 mV peak-to-peak.

Both converters share the GNDSMPS reference, which is connected to the DIGITAL domain (GNDREF) via ferrite beads on both power rails and a 100 pF bypass capacitor across the ground boundary. No direct DC connection exists between GNDSMPS and GNDREF — preserving high-impedance isolation between switching and digital grounds while allowing the common-mode bypass path needed for EMC compliance.

## Design Rationale

The LMR51610 was selected because it integrates synchronous rectification, operates over a wide input range (4–65 V), and is available in SOT-23. The 400 kHz switching frequency is a deliberate trade-off: higher than the 200–300 kHz typical of older regulators (reducing inductor size), but below 1 MHz (limiting switching losses and RF emissions).

The 22 µH Bourns SRN5040TA-220M inductors are generously specified — 1.6 A saturation current against a &lt;0.5 A peak ripple — to avoid core saturation and thermal problems in the confined enclosure. Low DCR (123 mΩ) keeps resistive losses minimal. The shielded construction reduces radiated EMI consistent with the tight PCB layout.

The 1210-size Murata 10 µF X7R input/output capacitors are selected for their effective capacitance at operating bias voltages. An 0805 10 µF capacitor at 12 V can lose 80% of its rated capacitance due to DC bias derating; the 1210 size retains effective capacitance while maintaining the high-frequency performance needed to suppress switching ripple.

The SMPS-to-DIGITAL isolation boundary (ferrite beads + 100 pF Y-cap-style bypass) follows JESD22/IEC guidance on minimising high-frequency noise coupling between switching and digital ground planes without creating ground loops or impairing low-frequency noise rejection.

## Design Calculations

Key simulated values (TI WEBENCH design reports):

**VDD 5.0 V** (18 V input, 245 mA output):
- Output voltage: 5.244 V
- Efficiency: 93.1% — power dissipation 95 mW
- Phase margin: 61.1° — gain margin: −15.6 dB (stable)
- Inductor ripple current: 427 mA peak
- Inductor dissipation: 9.3 mW — temperature rise < 0.3 °C at full load

**VCC 3.3 V** (12 V input, 275 mA output):
- Output voltage: 3.300 V
- Efficiency: 88.3% — power dissipation 107 mW
- Phase margin: 47.4° — gain margin: −11.9 dB (stable)
- Inductor ripple current: 313 mA peak
- Inductor dissipation: 9.4 mW — temperature rise < 0.3 °C at full load

LMR51610 internal thermal shutdown: 165 °C. Junction temperatures remain within limits at ambient up to 80 °C.

## References

- Texas Instruments, [*LMR516xx SIMPLE SWITCHER® 4-V to 65-V, 0.6-A/1-A Buck Converter Datasheet*](https://www.ti.com/lit/ds/symlink/lmr51610.pdf)
- Texas Instruments, [*Controlling switch-node ringing in synchronous buck converters*](https://www.ti.com/lit/an/slyt465/slyt465.pdf), Application Note SLYT465
- Texas Instruments, [*Design Consideration on Boot Resistor in Buck Converter*](https://www.ti.com/lit/an/snvaa73/snvaa73.pdf), Application Note SNVAA73
- Bourns, [*SRN5040TA-220M Power Inductor Datasheet*](https://www.bourns.com/docs/product-datasheets/srn5040ta.pdf)
- Murata, [*GRM32ER71H106KA12L 10 µF 1210 X7R Capacitor Datasheet*](https://www.murata.com/en-us/products/productdetail?partno=GRM32ER71H106KA12L%40D)
- Monolithic Power Systems, [*EMI Webinar: Practical Grounding and Layout*](https://www.monolithicpower.com/en/support/videos/emi-2-webinar-early-session.html)
