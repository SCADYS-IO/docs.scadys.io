---
title: Buzzer Driver
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/buzzer_driver.svg" alt="Buzzer Driver schematic" />

:::note Hardware version
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

## Components

| Ref | Value | Description | Datasheet |
|---|---|---|---|
| BZ0 | MLT-8530 | 80 dB passive electromagnetic buzzer, 16 Ω, 5 V, SMD 8.5×8.5 mm | [Jiangsu Huaneng MLT-8530](https://www.lcsc.com/product-detail/Buzzers_Jiangsu-Huaneng-Elec-MLT-8530_C94599.html) |
| Q2 | AO3407A | P-channel 30 V 4.2 A SOT-23 MOSFET — high-side buzzer switch | [UMW AO3407A](https://www.lcsc.com/product-detail/C347478.html) |
| Q3 | S8050 | NPN 25 V 1.5 A SOT-23 — MOSFET gate driver | [JSMSEMI SS8050](https://www.lcsc.com/product-detail/C916392.html) |
| D1 | BAT54 | 30 V 200 mA SOD-323F Schottky — inductive kickback clamp | [Nexperia BAT54J](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf) |
| R10 | 4.7 Ω | 0603 — output low-pass filter series resistor | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C12 | 4.7 µF/16 V | 0603 X7R MLCC — output low-pass filter shunt capacitor | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| R9 | 10 Ω | 0603 — damping resistor to GND | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R12 | 2.2 kΩ | 0603 — AUDIO_PWM base resistor | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R13 | 100 kΩ | 0603 — NPN base pull-down (fail-safe) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R11 | 10 kΩ | 0603 — MOSFET gate pull-up to VDD (default off) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |

## How It Works

The buzzer driver sub-sheet generates audio alert tones from the MLT-8530 passive electromagnetic transducer (BZ0). The transducer has a 16 Ω nominal impedance and is rated for 5 V operation, powered from the VDD rail.

Drive is provided by a two-stage switching circuit. The NPN transistor Q3 (S8050) acts as the low-side gate driver, controlled by the AUDIO_PWM signal from GPIO10 through a 2.2 kΩ base resistor (R12). A 100 kΩ pull-down (R13) on the transistor base ensures the buzzer remains off when the MCU pin is floating or during boot. When AUDIO_PWM goes high, Q3 conducts and pulls the gate of the P-channel MOSFET Q2 (AO3407A) low, connecting VDD to the transducer. A 10 kΩ pull-up (R11) to VDD holds the MOSFET gate high by default, keeping the buzzer off when Q3 is off.

A BAT54 Schottky diode (D1) is placed across the transducer terminals to absorb inductive kickback when the MOSFET switches off, protecting Q2 from reverse voltage spikes.

The output passes through a second-order passive low-pass filter: a 4.7 Ω series resistor (R10) and 4.7 µF shunt capacitor (C12), followed by a 10 Ω resistor (R9) to GND. This filter has a cutoff frequency of approximately 3–7 kHz. It attenuates PWM harmonics above ~5 kHz, shaping the tone from a harsh square wave toward a smoother, more intelligible sound. The intended tonal range for alert signals is C6 (1,046 Hz) to A7 (3,520 Hz), which passes through the filter with minimal attenuation while higher harmonics are suppressed.

## Design Rationale

The passive transducer requires an external drive circuit rather than a simple GPIO toggle because the 16 Ω impedance would draw ~300 mA from VDD — far exceeding the ESP32 GPIO current limit of 40 mA. The two-transistor switching stage (S8050 + AO3407A) handles this current from VDD without loading the MCU.

The low-pass filter at the transducer output serves two purposes: it reduces acoustic harshness by softening the PWM waveform edges, and it suppresses high-frequency conducted and radiated EMI that would otherwise propagate from the PWM switching edges into the power supply and board traces.

The 100 kΩ pull-down on Q3's base is a deliberate fail-safe: if the AUDIO_PWM GPIO floats high-impedance during a fault or debugging session, the pull-down ensures the buzzer remains silent rather than emitting a continuous tone.

## Design Calculations

- **Filter cutoff**: f_c ≈ 1 / (2π × 4.7 Ω × 4.7 µF) ≈ **7.2 kHz** (−3 dB point)
- **Alert tone range**: C6 (1,046 Hz) to A7 (3,520 Hz) — well below cutoff; harmonics above ~5 kHz attenuated
- **Peak transducer current**: V_DD / R_transducer = 5 V / 16 Ω ≈ **313 mA** (well within AO3407A 4.2 A rating)

## References

- Jiangsu Huaneng, [*MLT-8530 Piezoelectric Audio Transducer Product Page*](https://www.lcsc.com/product-detail/Buzzers_Jiangsu-Huaneng-Elec-MLT-8530_C94599.html)
- UMW Electronics, [*AO3407A P-Channel MOSFET Datasheet*](https://www.lcsc.com/product-detail/C347478.html)
- JSMSEMI, [*SS8050 NPN Transistor Datasheet*](https://www.lcsc.com/product-detail/C916392.html)
- Nexperia, [*BAT54J Schottky Diode Datasheet*](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf)
