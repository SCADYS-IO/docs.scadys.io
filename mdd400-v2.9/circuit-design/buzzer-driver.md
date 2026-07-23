---
title: Buzzer Driver
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — bench testing"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/buzzer_driver_3f9482b5.svg" alt="Buzzer driver — full sheet" />

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype, bench-test phase. PWM tone generation has been driven on this prototype: the AUDIO_PWM GPIO produces audible alert tones through the MLT-8530 transducer at expected current and frequency. The firmware tone library and alert taxonomy carry over from prior MDD400 hardware revisions. Specific bring-up items (CISPR EMI scan; filter simulation re-run with V2.9 component values) remain open and are tracked in the V2.10 backlog.

:::

## Overview

This page documents the audio-alert driver on `buzzer_driver.kicad_sch` — a high-side P-MOSFET buzzer driver that takes the ESP32 AUDIO_PWM signal and produces audible tones through an 16 Ω passive electromagnetic transducer (MLT-8530). The circuit is the MDD400's single audio output, used for system alerts (low-voltage, over-temperature, fault, user-acknowledged alarm) annunciated to the helm operator.

This page covers a single sub-circuit — the **Buzzer Driver** — drawn on the `buzzer_driver` KiCad sheet.

## Functional specification and design objectives

The buzzer driver circuit must:

- Drive a 16 Ω passive electromagnetic transducer at 5 V (peak current ~313 mA) from a single ESP32 GPIO that can sink/source only 40 mA — i.e. amplify the GPIO's drive capability ~8× via a high-side switch.
- Default to **silent** at power-up and any time AUDIO_PWM is undriven or tri-stated (firmware-fault tolerance, MCU-boot tolerance).
- Suppress PWM switching harmonics enough that the audible tone is intelligible and the conducted-emission noise on the VDD rail is bounded.
- Provide flyback clamping so the transducer's inductive collapse doesn't damage the high-side MOSFET.

## Buzzer Driver

<SchematicViewer src="/img/schematics/mdd400-v2.9/buzzer_driver_3f9482b5.svg" alt="Buzzer driver sub-circuit — Q3 (S8050 NPN gate driver), Q2 (AO3407A P-MOSFET high-side switch), R11 (Q2 gate pull-up to VDD), R12 + R13 (Q3 base-drive network with default-off pull-down), R10 + C12 + R9 (output low-pass filter), D1 (BAT54 flyback Schottky clamp), and BZ0 (MLT-8530 16 Ω passive electromagnetic transducer on B.Cu)." initialFocus="19.05 12.7 127.0 88.9" />

The transducer is mounted on B.Cu directly underneath the driver cluster on F.Cu; the FPC-style "speaker / buzzer" label in the schematic marks this rectangle.

### How it works

#### Drive stage — Q3 + Q2

The AUDIO_PWM signal from the ESP32 GPIO drives the base of **Q3 (S8050 NPN, SOT-23, V<sub>CEO</sub> = 25 V, h<sub>FE</sub> ≥ 40 at 100 mA)** through R12 (2.2 kΩ base series resistor). When AUDIO_PWM is HIGH (3.3 V), Q3 saturates and pulls the gate of **Q2 (AO3407A P-channel MOSFET, SOT-23, V<sub>DSS</sub> = −30 V, R<sub>DS(on)</sub> = 54 mΩ at V<sub>GS</sub> = −4.5 V)** down toward GND. With V<sub>GS</sub> ≈ −4.8 V (well past Q2's −0.45 V to −1.5 V threshold), Q2 conducts fully and connects the **VDD** (5 V) rail to the buzzer drive node.

When AUDIO_PWM is LOW, Q3 is off and **R11 (10 kΩ pull-up from Q2 gate to VDD)** holds Q2's gate at V<sub>GS</sub> = 0 — Q2 fully off, buzzer silent.

**Default-off bias is enforced two ways.** R11 holds Q2's gate at VDD (V<sub>GS</sub> = 0 → off) and **R13 (100 kΩ pull-down on Q3's base to GND)** holds Q3 off when AUDIO_PWM floats or tri-states. Either resistor alone would suffice, but both together mean any single resistor failure still leaves the buzzer silent. The default-off behaviour matters because the GPIO state during ESP32 boot, brown-out, and certain firmware-fault paths is undefined for some milliseconds — without R13, parasitic coupling on AUDIO_PWM could forward-bias Q3 through Q3's input capacitance and produce a spurious power-on chirp.

#### Output filter — R10 + C12 + R9

After Q2's drain, the drive node passes through a passive low-pass filter before reaching BZ0:

- **R10 (4.7 Ω 0603)** in series with the drive path.
- **C12 (4.7 µF X7R 0603)** shunt to GND immediately after R10.
- **R9 (10 Ω 0603)** in parallel with C12 as a damping resistor (loosens the filter Q, prevents ringing).

The −3 dB point of the R10 + C12 first-order low-pass is:

```
f_c = 1 / (2π × R10 × C12) = 1 / (2π × 4.7 Ω × 4.7 µF) ≈ 7.2 kHz
```

The MDD400 tone palette runs from C6 (1,046 Hz) to A7 (3,520 Hz) — comfortably below the filter corner, so alert tones pass with &lt; 1 dB attenuation. Above the filter corner, PWM-edge harmonics roll off at 20 dB/decade, attenuating both audible artefacts (harsh switching edge) and conducted EMI on the VDD rail.

#### Flyback clamp — D1

**D1 (BAT54 Schottky, SOD-323F)** sits across BZ0 with its cathode at the drive node and its anode at GND. During the OFF-edge of each PWM cycle, the inductance of BZ0 tries to drive the drive node *below* GND (inductive kickback). D1 clamps that excursion at one Schottky V<sub>F</sub> (~0.3 V below GND), keeping Q2's V<sub>DS</sub> well within its 30 V rating and avoiding damage to its body diode.

#### Transducer — BZ0

**BZ0 (MLT-8530)** is a 16 Ω passive electromagnetic transducer rated for 5 V continuous, with mechanical resonance near 2.7 kHz (giving best efficiency in the middle of the tone palette). It's mounted on **B.Cu** directly beneath the driver cluster — saving F.Cu real estate and putting the transducer flush against the rear face of the MDD400 housing for the cleanest acoustic coupling out of the enclosure.

### Performance

| Parameter | Value | Notes |
|-----------|-------|-------|
| Transducer impedance | 16 Ω nominal | MLT-8530, passive electromagnetic |
| Peak drive current | ~313 mA | 5 V / 16 Ω at full Q2-on |
| Q2 R<sub>DS(on)</sub> at V<sub>GS</sub> = −4.5 V | 54 mΩ typ | AOS AO3407A |
| Q2 V<sub>DS</sub> drop at 313 mA | ~17 mV | Negligible |
| Q2 P<sub>d</sub> at 313 mA | 5.3 mW | I² × R<sub>DS(on)</sub>; far inside SOT-23 limits |
| Q3 base current (AUDIO_PWM HIGH) | ~1.2 mA | (3.3 − 0.7) / 2.2 kΩ |
| Q3 collector capacity at I<sub>B</sub> = 1.2 mA | ~200 mA | h<sub>FE</sub> = 170 × I<sub>B</sub> — well above the ~500 µA needed to pull Q2's gate to within mV of GND |
| Default-off behaviour | Buzzer silent when AUDIO_PWM floats | R11 + R13 both enforce; either alone would suffice |
| Filter f<sub>−3dB</sub> | ~7.2 kHz | 1 / (2π × R10 × C12) |
| Alert tone range | C6 (1,046 Hz) to A7 (3,520 Hz) | Below f<sub>−3dB</sub>; attenuation &lt; 1 dB at A7 |
| Transducer resonance | ~2.7 kHz | Falls inside tone palette — peak acoustic efficiency in the middle of the alert range |
| Flyback clamp | BAT54 Schottky, V<sub>F</sub> ~0.3 V | Cathode at drive node; keeps Q2 V<sub>DS</sub> safely within 30 V |

## Firmware notes

The AUDIO_PWM signal is driven by the ESP32-S3's **LEDC** (LED-Controller) PWM peripheral configured for audio-frequency operation. LEDC is the natural choice over MCPWM because the buzzer is single-ended (no need for the complementary outputs MCPWM offers) and LEDC's hardware-driven frequency / duty change gives gap-free tone transitions.

The MDD400 firmware **tone library and alert taxonomy carry over from prior hardware revisions**, where the alert taxonomy was tuned through operator feedback over significant in-service hours. The current tones cover:

- **Power alerts** — low-voltage and high-voltage warnings derived from INA219 readings (see the [Power Monitor](./power-monitor.md) page).
- **Thermal alerts** — alert / derate / shutdown progression driven by TMP112 thresholds (see the [Temperature Sensor](./temperature-sensor.md) page). The **graceful-shutdown event must annunciate audibly** before the firmware powers the display down — the buzzer is the only output that remains accessible after the display goes dark, so it's the operator's last warning that the device is shutting down.
- **N2K bus events** — connection / disconnection, address-claim conflict, NMEA 2000 instance change confirmations.
- **User acknowledgements** — a short confirmation tone for touch-screen interactions that don't have on-screen feedback.

**No mute or volume control on the hardware side.** Volume is fixed at the drive level set by the R10 / C12 / R9 filter. Firmware-level muting is supported by simply stopping LEDC output; volume reduction would require a software duty-cycle reduction, which trades against tone purity (less time at full drive) — usually not worth doing.

## PCB Layout

All driver and filter components are tightly grouped in a 16.9 × 7.3 mm region on F.Cu, laid out left-to-right in signal-flow order: Q3 base drive (R12/R13) → Q3 → Q2 gate (R11) → Q2 drain → output filter (R10, C12, R9) → D1 → BZ0. BZ0 is mounted on B.Cu directly beneath the driver cluster, keeping the drive-current path short through vias.

- **Switching loop.** Keep the Q2–BZ0–GND switching loop physically tight to minimise enclosed area. C12 sits ~3.9 mm from Q2 (well inside the 10 mm guideline), and D1's cathode is placed adjacent to the Q2 drain / BZ0 terminal with a short anode via to the GND plane.
- **Gate and base drive.** R11 (gate pull-up) is on the correct side of Q2, ~6 mm from the gate pin for low gate-drive impedance; R12 and R13 sit within ~4–5 mm of Q3's base for a short, noise-immune base-drive path.
- **High-current routing.** R10 and R9 carry the full ~300 mA peak transducer current, routed on ≥ 0.5 mm-wide traces (0.6 mm observed) in ≥ 1 oz copper.
- **Grounding.** AUDIO_PWM is routed away from the Q2 switching node, and the Q3/PWM digital-ground return is intended to join the Q2/BZ0 power-ground return at a single star point near Q3. A local GND pour under the BZ0 footprint on B.Cu ties back to the main GND plane. The 4-layer stack (F.Cu / In1.Cu / In2.Cu / B.Cu) provides inner-plane GND returns via vias.

## Components

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| BZ0 | MLT-8530 | Jiangsu Huaneng 80 dB passive electromagnetic buzzer, 16 Ω, 5 V, ~2.7 kHz resonance, 8.5 × 8.5 mm SMD, B.Cu mount | [Jiangsu Huaneng MLT-8530](/assets/datasheets/mdd400-v2.9/MLT-8530.pdf) |
| Q2 | AO3407A | AOS P-channel MOSFET, SOT-23, V<sub>DSS</sub> = −30 V, I<sub>D</sub> = −4.3 A, R<sub>DS(on)</sub> = 54 mΩ at V<sub>GS</sub> = −4.5 V. High-side switch for the buzzer drive | [AOS AO3407A](https://www.aosmd.com/pdfs/datasheet/AO3407A.pdf) |
| Q3 | S8050 | NPN BJT, SOT-23, V<sub>CEO</sub> = 25 V, h<sub>FE</sub> ≥ 40 at 100 mA. Gate driver for Q2 | [onsemi SS8050](https://www.onsemi.com/pdf/datasheet/ss8050-d.pdf) |
| D1 | BAT54 | Nexperia Schottky diode, SOD-323F, 30 V / 200 mA, V<sub>F</sub> ~0.3 V. Inductive-kickback clamp across BZ0 | [Nexperia BAT54 Series](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf) |
| C12 | 4.7 µF / 16 V X7R 0603 | Murata GRM188Z71C475KE21D — output low-pass filter shunt capacitor | [Murata GRM188Z71C475KE21D](https://www.murata.com/en-us/products/productdetail?partno=GRM188Z71C475KE21D) |
| R10 | 4.7 Ω 0603 ±1 % | Yageo — output low-pass filter series resistor | [Yageo RC Group](https://yageogroup.com/content/datasheet/asset/file/PYU-RC_GROUP_51_ROHS_L) |
| R9 | 10 Ω 0603 ±1 % | Yageo — low-pass filter shunt damping resistor (loosens Q, prevents ringing) | [Yageo RC Group](https://yageogroup.com/content/datasheet/asset/file/PYU-RC_GROUP_51_ROHS_L) |
| R11 | 10 kΩ 0603 ±1 % | Yageo — Q2 gate pull-up to VDD (holds Q2 OFF by default, V<sub>GS</sub> = 0) | [Yageo RC Group](https://yageogroup.com/content/datasheet/asset/file/PYU-RC_GROUP_51_ROHS_L) |
| R12 | 2.2 kΩ 0603 ±1 % | Yageo — Q3 base series resistor (AUDIO_PWM to Q3 base) | [Yageo RC Group](https://yageogroup.com/content/datasheet/asset/file/PYU-RC_GROUP_51_ROHS_L) |
| R13 | 100 kΩ 0603 ±1 % | Yageo — Q3 base pull-down to GND (default-off bias when AUDIO_PWM floats) | [Yageo RC Group](https://yageogroup.com/content/datasheet/asset/file/PYU-RC_GROUP_51_ROHS_L) |

## Testing & Verification

:::caution

V2.9 is a fabricated prototype in the bench-test phase. PWM tone generation has been driven through the buzzer at expected current and frequency; the firmware tone library and alert taxonomy carry over from prior hardware. **EMI scanning and the filter-simulation re-run remain open.** The following are required.

**Hardware bring-up (rig at the bench):**

- **Default-off at power-up** — Apply VDD with AUDIO_PWM unconnected. Pass if no audible chirp occurs during the first 500 ms after VDD comes up.
- **Single-tone correctness** — Drive AUDIO_PWM with a 2 kHz square wave. Pass if the buzzer emits an audible tone of recognisable pitch at expected loudness.
- **Tone-palette sweep** — Drive AUDIO_PWM from 1 kHz to 4 kHz in 100 Hz steps. Pass if all tones are clearly audible without distortion or dropouts; record any resonant peaks / dips for firmware-library tuning.
- **Default-off recovery** — Drive a continuous tone, then release AUDIO_PWM to high-impedance. Pass if the tone stops immediately and no audible artefact persists.
- **Current draw at full duty** — Drive AUDIO_PWM with a 50 % duty-cycle 2 kHz square wave; probe VDD-side current. Pass if peak / average current is consistent with the calculated ~313 mA peak / ~156 mA average.

:::

## Gaps & next version

**Before next production run**

- **Q2–BZ0 loop area** — Trace/via routing in the critical switching loop is not verifiable from footprint positions; confirm minimal enclosed area in a Gerber-layer inspection.
- **D1 anode return path** — Confirm the exact routing of D1's anode to the GND plane (single short via vs. trace path) in the Gerber review.
- **Ground star-point** — Zone-polygon / copper-pour analysis is needed to confirm the Q3/Q2 ground-separation strategy and star-point location near Q3.
- **AUDIO_PWM routing** — Segment-level trace inspection required to confirm separation from the Q2 switching node.
- **BZ0 GND pour (B.Cu)** — Confirm copper-pour coverage under the BZ0 footprint on the back copper layer.

**Next version (V2.10)**

- **Re-run the buzzer-filter simulation with V2.9 component values** — R10 4.7 Ω, C12 4.7 µF, R9 10 Ω. Record operating conditions (PWM frequency, duty cycle, load impedance). Add the simulation source to `design-docs/`. The waveform images currently sourced from V2.8 old-docs have unrecorded operating conditions and should be superseded.
- **CISPR 32 conducted-emission scan including the buzzer drive net** — the R10 / C12 / R9 filter is calculated to attenuate harmonics above ~7.2 kHz, but no measurement has been performed. Include the buzzer drive net in the prototype's conducted-emission scan during V2.10 compliance pre-screening.

## References

- Jiangsu Huaneng, [*MLT-8530 Electromagnetic Buzzer*](/assets/datasheets/mdd400-v2.9/MLT-8530.pdf).
- AOS (Alpha & Omega Semiconductor), [*AO3407A P-Channel MOSFET*](https://www.aosmd.com/pdfs/datasheet/AO3407A.pdf).
- onsemi, [*SS8050 NPN Transistor*](https://www.onsemi.com/pdf/datasheet/ss8050-d.pdf).
- Nexperia, [*BAT54 Series Schottky Diode*](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf).
- Yageo, [*RC Group Chip Resistor*](https://yageogroup.com/content/datasheet/asset/file/PYU-RC_GROUP_51_ROHS_L).
- Murata, [*GRM188Z71C475KE21D — 4.7 µF / 16 V X7R 0603*](https://www.murata.com/en-us/products/productdetail?partno=GRM188Z71C475KE21D).
- Espressif Systems, [*ESP-IDF LEDC Peripheral Reference*](https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-reference/peripherals/ledc.html).

## Related pages

- [ESP32-S3 Module](./esp32-module.md) — host MCU; AUDIO_PWM is an ESP32 GPIO driven by the LEDC peripheral
- [Power Monitor](./power-monitor.md) — INA219 power alerts the buzzer annunciates
- [Temperature Sensor](./temperature-sensor.md) — TMP112 thermal alerts, including the audible graceful-shutdown warning
- [Pin Assignments](/mdd400/v2.9/quick-reference/pin-assignments) — the AUDIO_PWM GPIO assignment
