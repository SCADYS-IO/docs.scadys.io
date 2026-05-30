---
title: LED Indicator
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/wti400-v1.2/button_led_2240df5e.svg" alt="LED indicator — full sheet" />

:::note[Hardware version]
WTI400 **v1.2** — In service — installed on test vessel
:::

## Overview

The RGB LED is the WTI400's sole visual output — it gives the user feedback on device state and responds to button input. Three independent channels (red, green, blue) allow the firmware to signal different states by illuminating individual colours or combinations. The LED backlights the Scadys logo aperture on the front panel.

Red serves a secondary role: it illuminates by default at power-on, before firmware initialises, acting as a power-good indicator.

This page covers a single sub-circuit — the **RGB LED Indicator** — drawn on the `button_led` KiCad sheet (shared with the [Button](./button.md) input).

## Functional specification and design objectives

The LED indicator circuit must:

- illuminate each of the three colour channels independently under firmware control;
- default to red ON and green/blue OFF at power-up, before the ESP32 has initialised its GPIOs;
- provide a visible power-good indication with no firmware involvement; and
- limit current through each channel to a safe level that gives approximately equal perceived brightness.

## RGB LED Indicator

<SchematicViewer src="/img/schematics/wti400-v1.2/button_led_2240df5e.svg" alt="RGB LED Indicator — D1 common-anode RGB LED, Q1 red-channel switch, R5–R12 drive network. Zoom out to see the full sheet." initialFocus="12.7 106.68 139.7 90.17" />

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

### Performance

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

## PCB Layout

All seventeen `button_led` components sit on F.Cu of the four-layer board. The LED drive network is grouped into two clusters, with D1 placed for front-panel visibility.

- **D1 placement.** D1 (119.0, 57.0) is positioned at board centre so it aligns with the enclosure's backlit Scadys logo aperture — D1 illuminates the logo from behind. Aperture alignment is confirmed by the enclosure design.
- **Current-limiting cluster.** R10, R11, R12 are co-located in a 2.8 mm row at y = 51.2, immediately south of D1 (5.8–6.2 mm away), interposed between the drive nets and the D1 cathode pins. Q1 sits 6.4 mm south of D1 on the same x-axis, with a short 1.5 mm Net-(Q1-E) stub to R12.
- **Base-drive / pull-up cluster.** R5, R6, R7, R8 are co-located in a 4.2 mm row at x ≈ 142–146, near the F.Cu–B.Cu via transitions for the LED_RED / LED_GRN / LED_BLU signals. R5/R6 (Q1 base drive) sit ~20 mm west of Q1, and Net-(Q1-B) runs 25 mm total (18.8 mm on B.Cu). At the slow LED switching rates (&lt; 10 kHz) this causes no signal-integrity issue, but it is flagged to move R5/R6 closer to Q1 in the next layout revision.
- **LED drive traces.** LED_GRN and LED_BLU each span ~40 mm total, dominated by a long B.Cu horizontal run between R7/R8 (x ≈ 144–146) and R11/R10 (x ≈ 116–117). At PWM dimming frequencies (&lt; 10 kHz) these lengths present no signal-integrity concern and no damping resistors are required. All `button_led` signal traces are 0.2 mm wide, appropriate for the &lt; 5 mA channel currents.
- **Power and ground.** D1's common anode (pad 2) connects to the VCC zone (F.Cu + B.Cu); a VCC stitching via sits within 1 mm of D1. Q1's collector and R6 return to the large F.Cu GNDREF zone that covers the whole component area, supplemented by In1.Cu GNDREF fill and local stitching vias.

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

## Testing & Verification

:::caution

The V1.2 prototype on the test vessel has accumulated approximately 1,000 sea miles. The RGB LED illuminates red on power-up before firmware runs (confirming the Q1 fail-on topology) and the firmware can independently drive red, green, and blue under operator control. **The V1.2 prototype shipped with R10 = R11 = 220 &Omega; &mdash; these values do not account for green's higher luminous efficiency and produce a visually unbalanced output.** No quantitative bench measurements have been performed on Vf at operating point, perceived brightness balance after the R10 / R11 rework, or boot-state behaviour with a scope. The following are required.

**Hardware bring-up (rig at the bench, after R10 / R11 rework):**

- **Power-good indication** &mdash; Apply VCC with no firmware running. Pass if red illuminates immediately and green and blue remain off.
- **Red off** &mdash; Run firmware that asserts LED_RED HIGH. Pass if red extinguishes completely.
- **Green on / off** &mdash; Drive LED_GRN LOW; pass if green illuminates. Drive HIGH; pass if green extinguishes.
- **Blue on / off** &mdash; Drive LED_BLU LOW; pass if blue illuminates. Drive HIGH; pass if blue extinguishes.
- **Brightness balance** &mdash; Illuminate each channel in turn at the corrected resistor values. Measure Vf across each LED die and record actual operating current. Assess perceived brightness; pass if no channel appears more than 2&times; brighter than the others.
- **Fail-safe states** &mdash; Cycle power several times. Pass if red always illuminates before firmware asserts control and green / blue never flicker on during boot.

:::

## Gaps & next version

**Before next production run**

- **R10 and R11 correction** — R11 must change from 220 Ω to 1 kΩ and R10 from 220 Ω to 270 Ω before the next fabrication run. The 220 Ω values do not account for green's luminous efficiency relative to red and blue. Rework existing prototypes by hand (replacement 0603 resistors) and verify brightness balance at bring-up.

**Next version (V1.3)**

- **Verify Vf at operating point** — The resistor calculations use Vf estimated from the V-A curve at low current. Measure actual Vf for each channel at operating current on the reworked prototype and refine resistor values if the predicted brightness balance is not achieved.
- **R12 (red) balance review** — With R11 corrected to 1 kΩ, re-verify red vs green / blue balance and adjust R12 if needed.
- **Move R5/R6 closer to Q1** — R5/R6 (Q1 base drive) are ~20 mm west of Q1, giving a 25 mm Net-(Q1-B) trace. No functional impact at LED switching rates, but tighten the placement to reduce the base switching-loop area in the next layout revision.

## References

- XINGLIGHT, [*XL-3528RGBW-HM Technical Data Sheet*](/assets/datasheets/wti400-v1.2/xinglight_xl-3528RGBW-HM.pdf)
- JSMSEMI, [*BC807-25 PNP Bipolar Transistor*](https://www.lcsc.com/datasheet/lcsc_datasheet_2304140030_JSMSEMI-BC807-25_C2669132.pdf)

## Related pages

- [Button](./button.md) — the other half of the button/LED UI, sharing the `button_led` sheet
- [ESP32-S3 Module](./esp32-module.md) — the LED_RED / LED_GRN / LED_BLU GPIOs driving D1
- [Power Supplies](./power-supplies.md) — derives the 3.3 V VCC rail that feeds the LED anode
- [Pin Assignments](/wti400/v1.2/quick-reference/pin-assignments) — the LED GPIO assignments
