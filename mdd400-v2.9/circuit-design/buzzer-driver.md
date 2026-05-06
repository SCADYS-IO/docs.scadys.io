---
title: Buzzer Driver
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/buzzer_driver_12f77fec.svg" alt="Buzzer Driver schematic" />

:::note Hardware version
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

## Components

| Ref | Value | Description | Datasheet |
|---|---|---|---|
| BZ0 | MLT-8530 | 80 dB passive electromagnetic buzzer, 16 Ω, 5 V, 2.7 kHz resonance, SMD 8.5×8.5 mm | [Jiangsu Huaneng MLT-8530](/assets/datasheets/mdd400-v2.9/MLT-8530.pdf) |
| Q2 | AO3407A | P-channel MOSFET, high-side switch, −30 V / 4.3 A / Rds(on) 54 mΩ, SOT-23 | [Alpha & Omega AO3407A](https://www.aosmd.com/pdfs/datasheet/AO3407A.pdf) |
| Q3 | S8050 | NPN BJT, low-side gate driver, 25 V / 1.5 A, SOT-23 | [ON Semiconductor SS8050](https://www.onsemi.com/pdf/datasheet/ss8050-d.pdf) |
| D1 | BAT54 | Schottky diode, inductive kickback clamp across BZ0, 30 V / 200 mA, SOD-323F | [Nexperia BAT54 Series](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf) |
| C12 | GRM188Z71C475KE21D | 4.7 µF / 16 V X7R 0603 MLCC — output low-pass filter shunt capacitor | [Murata GRM188Z71C475KE21D](https://www.murata.com/en-us/products/productdetail?partno=GRM188Z71C475KE21D) |
| R10 | 4.7 Ω | 0603 — output low-pass filter series resistor | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R9 | 10 Ω | 0603 — low-pass filter shunt damping resistor to GND | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R11 | 10 kΩ | 0603 — Q2 gate pull-up to VDD; holds Q2 OFF by default (Vgs ≈ 0 V) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R12 | 2.2 kΩ | 0603 — Q3 base current-limiting resistor from AUDIO_PWM | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R13 | 100 kΩ | 0603 — Q3 base pull-down; ensures buzzer off during MCU boot or floating GPIO | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |

## How It Works

The buzzer driver sub-sheet generates audio alert tones from the MLT-8530 passive electromagnetic transducer (BZ0). The transducer has 16 Ω nominal impedance and is rated for 5 V operation, powered from the VDD rail. Direct GPIO drive is not feasible because the transducer would draw approximately 313 mA (5 V / 16 Ω) — far exceeding the ESP32 GPIO current limit of 40 mA. An external two-stage switching circuit handles this current from VDD.

Drive is controlled by the AUDIO_PWM signal from the ESP32 GPIO. When AUDIO_PWM is HIGH, Q3 (S8050 NPN) conducts through its 2.2 kΩ base resistor (R12), pulling the gate of Q2 (AO3407A P-channel MOSFET) LOW toward GND. With its gate pulled below the threshold voltage, Q2 turns ON and connects VDD to BZ0, sourcing current through the transducer. When AUDIO_PWM is LOW, Q3 is off and R11 (10 kΩ pull-up to VDD) holds the Q2 gate HIGH, giving Vgs ≈ 0 V and keeping Q2 OFF. A 100 kΩ pull-down (R13) on the Q3 base ensures the transistor remains off — and therefore the buzzer remains silent — if the GPIO floats during boot or a fault condition.

When Q2 switches off, the inductive field in BZ0 collapses and attempts to drive the transducer terminals negative relative to GND. D1 (BAT54 Schottky) across BZ0 clamps this flyback transient to one diode forward voltage, protecting Q2 from reverse voltage spikes.

The output passes through a passive low-pass filter: R10 (4.7 Ω) in series with the drive path, C12 (4.7 µF) shunt to GND, and R9 (10 Ω) shunt damping resistor also to GND. This filter has a calculated −3 dB point of approximately 7.2 kHz, attenuating PWM switching harmonics above ~5 kHz while passing the intended alert tone range of C6 (1,046 Hz) to A7 (3,520 Hz) with less than 1 dB attenuation. The PWM audio library running on the ESP32 generates musical notes by modulating the AUDIO_PWM duty cycle at audio frequencies.

## Design Rationale

The two-transistor drive topology (S8050 NPN + AO3407A P-channel MOSFET) is chosen because the 16 Ω transducer impedance would draw ~313 mA from VDD at full voltage — well beyond what a GPIO can supply directly. The P-channel MOSFET as a high-side switch is the simplest configuration for this supply voltage and load: it is natively off when its gate is at VDD (Vgs = 0), requires no negative gate drive, and is turned on simply by pulling its gate toward GND via Q3.

The 100 kΩ pull-down (R13) on the Q3 base is a deliberate fail-safe. During ESP32 boot, GPIOs can float or drive unpredictably for milliseconds. Without R13, a floating AUDIO_PWM pin could forward-bias Q3 through parasitic capacitance, generating an unintended startup tone. The pull-down holds Q3 firmly off until the firmware actively drives AUDIO_PWM HIGH.

The R10/C12/R9 low-pass filter serves two purposes. Acoustically, it softens the square-wave edge of the PWM drive into a smoother waveform, reducing harsh switching artifacts and making alert tones more intelligible. Electrically, it suppresses high-frequency conducted and radiated EMI from the PWM switching edges propagating into the VDD rail and surrounding traces.

## PCB Layout

All driver components are placed on the F.Cu (top) layer in a compact 16.9 × 7.3 mm cluster (X: 93.5–109.4 mm, Y: 57.1–58.85 mm). BZ0 is mounted on B.Cu (back copper) directly beneath the driver circuit. Signal flow runs left-to-right from input (Q3/R12/R13) through Q2 gate drive (R11) to the output filter (R10/C12/R9) and kickback clamp (D1).

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 1 | Q2–BZ0–GND switching loop tight, minimal area | Partial | Components clustered within 7 mm radius; full trace/via loop routing not verified from footprint data |
| 2 | D1 cathode adjacent to Q2 drain; anode via to GND | Partial | D1 (SOD-323F) at 7.3 mm lateral from Q2; anode return via routing not confirmed from footprint data |
| 3 | C12 ≤ 10 mm from Q2 output node | Met | C12 at 3.9 mm from Q2 (well within limit); 0.6 mm wide traces observed in this region |
| 4 | Q3/AUDIO_PWM GND separated from Q2/BZ0 power GND | Unverifiable | Zone-level copper pour analysis required |
| 5 | AUDIO_PWM routed away from Q2 switching node | Unverifiable | Net present; trace path relative to switching node requires segment inspection |
| 6 | R10 and R9 traces ≥ 0.5 mm wide for ~300 mA | Partial | 0.6 mm traces observed in this area; full trace path audit not completed |
| 7 | R11 close to Q2 gate | Met | R11 6 mm from Q2 gate — well-positioned |
| 8 | R12 and R13 close to Q3 base | Met | R12 ~3.8 mm, R13 ~5.2 mm from Q3 base |
| 9 | Local GND pour under BZ0 (B.Cu) | Unverifiable | Back copper zone structure not extractable from footprint data |

## Design Calculations

| Parameter | Formula | Result |
|---|---|---|
| Peak transducer current | V_DD / R_BZ0 = 5 V / 16 Ω | **313 mA** |
| Q2 conduction loss | I² × Rds(on) = (0.313)² × 54 mΩ | **5.3 mW** (negligible) |
| Filter −3 dB point | 1 / (2π × R10 × C12) = 1 / (2π × 4.7 × 4.7×10⁻⁶) | **7.2 kHz** |
| Alert tone range | C6 to A7 | 1,046–3,520 Hz (well below f_c) |
| Alert tone attenuation at A7 | f / f_c = 3,520 / 7,200 | < 1 dB |

The Q3 base drive is well within S8050 ratings: I_B = (3.3 V − 0.7 V) / 2.2 kΩ ≈ 1.2 mA, which at hFE~170 supports I_C up to ~200 mA — sufficient to pull the Q2 gate to within millivolts of GND via Q3 saturation.

:::caution Verification required — Fabricated prototype — testing phase

**Verify during bring-up:**
- **EMI scan — buzzer PWM path**: Include the buzzer drive net in the CISPR 32 conducted-emission scan of the prototype. The R10/C12/R9 filter is calculated to attenuate harmonics above 7.2 kHz, but no measurement has been performed. *(performance_review Gap 1)*

**For next version:**
- **Buzzer filter simulation**: Re-run the PWM filter simulation with V2.9 component values (R10 4.7 Ω / C12 4.7 µF / R9 10 Ω) and record operating conditions (PWM frequency, duty cycle, load impedance). Add simulation source file to `design-docs/`. Current waveform images originate from V2.8 old-docs with unrecorded conditions. *(performance_review Gap 2)*
:::

## References

1. Jiangsu Huaneng, [*MLT-8530 Electromagnetic Buzzer Datasheet*](/assets/datasheets/mdd400-v2.9/MLT-8530.pdf)
2. Alpha & Omega Semiconductor, [*AO3407A P-Channel MOSFET Datasheet*](https://www.aosmd.com/pdfs/datasheet/AO3407A.pdf)
3. ON Semiconductor, [*SS8050 NPN Epitaxial Silicon Transistor Datasheet*](https://www.onsemi.com/pdf/datasheet/ss8050-d.pdf)
4. Nexperia, [*BAT54 Series Schottky Diode Datasheet*](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf)
5. Yageo, [*RC Series 0603 Chip Resistor Datasheet*](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf)
6. Murata, [*GRM188Z71C475KE21D — 4.7 µF/16 V 0603 MLCC*](https://www.murata.com/en-us/products/productdetail?partno=GRM188Z71C475KE21D)
