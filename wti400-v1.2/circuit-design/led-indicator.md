---
title: LED Indicator
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/wti400-v1.2/button_led_a6421fe1.svg" alt="Button & LED schematic" />

:::note[Hardware version]
WTI400 **v1.2** — In service — installed on test vessel
:::

## Overview

The RGB LED is the WTI400's sole visual output — it gives the user feedback on device state and responds to button input. Three independent channels (red, green, blue) allow the firmware to signal different states by illuminating individual colours or combinations. The LED backlights the Scadys logo aperture on the front panel.

Red serves a secondary role: it illuminates by default at power-on, before firmware initialises, acting as a power-good indicator.

---

## RGB LED Indicator

### Functional specification and design objectives

The LED indicator circuit must:

- illuminate each of the three colour channels independently under firmware control;
- default to red ON and green/blue OFF at power-up, before the ESP32 has initialised its GPIOs;
- provide a visible power-good indication with no firmware involvement; and
- limit current through each channel to a safe level that gives approximately equal perceived brightness.

### How it works

D1 is an XL-3528RGBW-HM, a common-anode RGB LED in a 3.5 × 2.8 mm SMD3528-4P package. Its anode (pad 2) connects directly to VCC (3.3 V). The three cathode pins — RK (red, pad 1), GK (green, pad 3), BK (blue, pad 4) — are pulled toward GNDREF to illuminate each channel. The firmware drives the LED by asserting the corresponding signal LOW.

:::note[LED signal polarity]
**LED_RED / LED_GRN / LED_BLU HIGH** — channel off
**LED_RED / LED_GRN / LED_BLU LOW** — channel on
:::

The three channels use two different drive topologies, because the red channel has a specific default-on requirement that green and blue do not.

#### Red channel — PNP transistor, fail-on

Q1, a BC807-25 PNP BJT in a SOT-323 package, is the low-side current sink for the red channel. This topology gives the red channel a fail-on default state.

The emitter of Q1 connects via R12 (680 Ω) to D1's red cathode (RK). The collector connects to GNDREF. R6 (68 kΩ) pulls Q1's base toward GNDREF, holding the base-emitter voltage V_EB at approximately 0.6 V and keeping Q1 in its active region — that is, conducting. With Q1 on, current flows from VCC through D1's anode, through the red die, through R12, through Q1, to GNDREF. The red LED is on.

To turn the red LED off, the ESP32 asserts LED_RED HIGH (3.3 V). This signal reaches Q1's base through R5 (10 kΩ). The R5/R6 voltage divider raises the base voltage to approximately 2.9 V, clamping V_EB to 0.4 V — below the ~0.5 V threshold needed for Q1 to conduct. Q1 turns off and the red channel goes dark.

**Why this matters at boot:** when the ESP32 is in reset, or at the moment VCC rises before firmware has run, LED_RED is floating or driven to an undefined state. Q1's base is pulled to GNDREF by R6, so Q1 is on by default. The red LED illuminates immediately on power-up, with no firmware involvement. This is intentional — red on = power is present and the board is alive. Once firmware initialises and asserts LED_RED HIGH, red extinguishes and the firmware takes over status signalling.

#### Green and blue channels — direct drive, fail-off

Green and blue are driven directly by ESP32 GPIOs through current-limiting resistors — no transistor is needed, because these channels must default to off rather than on.

R7 (10 kΩ) connects LED_GRN to VCC. R8 (10 kΩ) connects LED_BLU to VCC. When the ESP32 GPIO is floating or in reset, these pull-ups hold LED_GRN and LED_BLU HIGH — matching the anode voltage and leaving no forward bias across the green or blue die. Both channels remain off.

To illuminate a channel, the ESP32 drives the corresponding GPIO LOW. This pulls the cathode through the current-limiting resistor (R11 for green, R10 for blue) toward GNDREF, forward-biasing D1 and allowing current to flow.

### Performance review

#### Datasheet values (at IF = 20 mA, Ta = 25 °C)

| Channel | Forward voltage Vf | Luminous intensity |
|---------|--------------------|--------------------|
| Red | 1.8 – 2.2 V | 150 – 200 mcd |
| Green | 2.9 – 3.2 V | 400 – 600 mcd |
| Blue | 3.0 – 3.3 V | 120 – 180 mcd |

The datasheet Vf values are specified at 20 mA. At the WTI400's operating current (~1–2 mA), the forward voltage is approximately 200–300 mV lower for each channel — as seen on the V-A characteristic curve in the datasheet. This is important: the green and blue channels appear to have very little headroom at 20 mA specs, but are workable at low operating current.

#### Luminous efficiency and brightness balance

Green is significantly more efficient than red or blue:

| Channel | Midpoint intensity | Efficiency | Relative current for equal brightness |
|---------|-------------------|------------|--------------------------------------|
| Red | 175 mcd @ 20 mA | 8.75 mcd/mA | 1.00× |
| Green | 500 mcd @ 20 mA | 25.0 mcd/mA | 0.35× |
| Blue | 150 mcd @ 20 mA | 7.50 mcd/mA | 1.17× |

Green is 2.9× more efficient than red. To achieve equal perceived brightness, the green channel must carry roughly one-third the current of red, and blue must carry slightly more than red.

:::caution[R10 and R11 require correction — prototype rework needed]
The V1.2 values of R10 = 220 Ω and R11 = 220 Ω do not account for the large difference in luminous efficiency between channels. Green at 220 Ω would be approximately 3× brighter than red and blue. The values below are the corrected recommendations, calculated from the datasheet efficiency data.
:::

#### Recommended resistor values

Using estimated Vf at ~1–2 mA operating current (from V-A curve): Vf_red ≈ 1.75 V, Vf_green ≈ 2.75 V, Vf_blue ≈ 2.85 V.

| Channel | Resistor | V across R | I at typ Vf | Brightness |
|---------|----------|-----------|-------------|------------|
| Red | R12 = **680 Ω** (no change) | 1.0 V | 1.47 mA | ~12.9 mcd |
| Green | R11 = **1 kΩ** (was 220 Ω) | 0.55 V | 0.55 mA | ~13.8 mcd |
| Blue | R10 = **270 Ω** (was 220 Ω) | 0.45 V | 1.67 mA | ~12.5 mcd |

Predicted balance at typical operating point: **12.9 : 13.8 : 12.5 mcd** — effectively equal.

These calculations use Vf values read from the datasheet V-A curve at low current. Actual operating-point Vf must be measured at bring-up and resistor values adjusted if needed.

### Bring-up tests

1. **Power-good indication**: apply VCC with no firmware running — pass if red illuminates immediately and green and blue remain off.
2. **Red off**: run firmware that asserts LED_RED HIGH — pass if red extinguishes completely.
3. **Green on/off**: drive LED_GRN LOW — pass if green illuminates; drive HIGH — pass if green extinguishes.
4. **Blue on/off**: drive LED_BLU LOW — pass if blue illuminates; drive HIGH — pass if blue extinguishes.
5. **Brightness balance**: illuminate each channel in turn at the corrected resistor values. Measure Vf across each LED die and record actual operating current. Assess perceived brightness — pass if no channel appears more than 2× brighter than the others. Adjust R10 or R11 in firmware or with further rework if needed.
6. **Fail-safe states**: cycle power several times and confirm that red always illuminates before firmware asserts control, and that green and blue never flicker on during boot.

### Gaps & next version

**Before next production run**

- **R10 and R11 correction**: R11 must change from 220 Ω to 1 kΩ and R10 from 220 Ω to 270 Ω before the next fabrication run. The 220 Ω values do not account for green's luminous efficiency relative to red and blue. Rework the existing prototype (hand-solder replacement 0603 resistors) and verify brightness balance at bring-up.

**Next version**

- **Verify Vf at operating point**: the resistor calculations above use Vf estimated from the V-A curve at low current. Measure actual Vf for each channel at operating current on the prototype and refine resistor values if the predicted brightness balance is not achieved.
- **R12 (red) balance review**: R12 was originally 680 Ω to compensate for red's lower Vf relative to green/blue. With R11 now corrected to 1 kΩ, re-verify red vs green/blue balance and adjust R12 if needed.

---

## Components

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| D1 | XL-3528RGBW-HM | Common-anode RGB LED, SMD3528-4P — status indicator | [Datasheet](/assets/datasheets/wti400-v1.2/xinglight_xl-3528RGBW-HM.pdf) |
| Q1 | BC807-25 | PNP BJT, SOT-323 — red channel low-side switch | [Datasheet](https://www.lcsc.com/datasheet/lcsc_datasheet_2304140030_JSMSEMI-BC807-25_C2669132.pdf) |
| R5 | 10 kΩ | 0603 — LED_RED signal path to Q1 base | — |
| R6 | 68 kΩ | 0603 — Q1 base pull-down; holds red on by default | — |
| R7 | 10 kΩ | 0603 — LED_GRN pull-up to VCC; holds green off by default | — |
| R8 | 10 kΩ | 0603 — LED_BLU pull-up to VCC; holds blue off by default | — |
| R10 | **270 Ω** *(rework from 220 Ω)* | 0603 — blue channel current limiter | — |
| R11 | **1 kΩ** *(rework from 220 Ω)* | 0603 — green channel current limiter | — |
| R12 | 680 Ω | 0603 — red channel current limiter (Q1 emitter path) | — |

---

## References

- XINGLIGHT, [*XL-3528RGBW-HM Technical Data Sheet*](/assets/datasheets/wti400-v1.2/xinglight_xl-3528RGBW-HM.pdf)
- JSMSEMI, [*BC807-25 PNP Bipolar Transistor*](https://www.lcsc.com/datasheet/lcsc_datasheet_2304140030_JSMSEMI-BC807-25_C2669132.pdf)
