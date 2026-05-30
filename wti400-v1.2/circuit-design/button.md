---
title: Button Input
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/wti400-v1.2/button_led_2240df5e.svg" alt="Button and LED — full sheet" />

:::note[Hardware version]
WTI400 **v1.2** — In service — installed on test vessel
:::

## Overview

The button is the primary user input on the WTI400 and is part of the user-facing button/LED UI on the front face of the device. It supports three interaction types — single press, double-click, and long press — allowing the user to give different instructions without additional controls. This page covers the hardware circuit that takes the raw mechanical switch signal and delivers a clean, debounced digital input to the ESP32 using a Schmitt trigger buffer.

This page covers a single sub-circuit — the **Button Input** — drawn on the `button_led` KiCad sheet (which it shares with the [RGB LED indicator](./led-indicator.md)):

- **Button Input** — SW1 tactile switch, ESD protection, RC debounce, and Schmitt-trigger conditioning to the BUTTON GPIO.

## Functional specification and design objectives

The button input circuit must:

- detect a press of SW1 and deliver a clean, glitch-free digital signal to an ESP32 GPIO;
- eliminate contact bounce — the rapid make-and-break transitions that occur in the first few milliseconds of any mechanical switch press;
- protect the input from electrostatic discharge (ESD) at the switch terminals; and
- present a defined signal level to the ESP32 during boot, before firmware has initialised.

## Button Input

<SchematicViewer src="/img/schematics/wti400-v1.2/button_led_2240df5e.svg" alt="Button input — SW1, D7 ESD diode, R40/C38 RC debounce, U10 Schmitt buffer. Zoom out to see the full sheet." initialFocus="12.7 12.7 139.7 92.71" />

### How it works

#### Mechanical switch and pull-up

SW1 is an SPST (single-pole, single-throw) SMD tactile switch with a 12 mm actuator. One terminal connects to the button input node; the other connects to GNDREF.

R41, a 10 kΩ resistor, pulls the button input node up to VCC (3.3 V) (pull-up). When SW1 is open (not pressed), R41 holds the input node firmly at 3.3 V — a logic HIGH. When SW1 is pressed, it connects the input node directly to ground, pulling it to 0 V — a logic LOW. The switch current at the moment of pressing is 3.3 V / 10 kΩ = 0.33 mA, well within SW1's 50 mA rating.

:::note[BUTTON signal polarity]
**BUTTON HIGH** — button not pressed (R41 holds input to VCC)
**BUTTON LOW** — button pressed (SW1 pulls input to GNDREF)
:::

#### ESD protection

D7, a 1N5819WS Schottky diode in a SOD-323 package, sits in series with the signal path between SW1 and the rest of the circuit. Any electrostatic discharge arriving at the switch terminals (from a user touch, for example) is clipped by D7 before it can reach the more sensitive components downstream. The Schottky forward voltage is low (~0.3 V), so normal signal levels pass through with minimal drop.

#### RC debounce filter

When a mechanical switch closes, its contacts do not make a single clean connection. They bounce — rapidly opening and closing many times over a period of typically 5–20 ms — before settling. To a fast digital input, this looks like a rapid burst of HIGH/LOW transitions rather than a single clean edge. If passed directly to the ESP32 it would trigger multiple false button-press events per physical press.

R40 (39 kΩ) and C38 (1 µF) form an RC low-pass filter in the signal path. When SW1 closes, C38 does not discharge instantly — it discharges through R40 at a rate set by the RC time constant:

```
τ = R × C = 39,000 Ω × 0.000001 F = 39 ms
```

This means the voltage at C38 takes roughly 39 ms to fall from VCC to near zero — far slower than the 5–20 ms bounce window. The bounce transients are averaged out, and the filter output is a smooth, slow-falling ramp. Similarly on release, C38 charges slowly through R40 and R41, producing a smooth-rising signal. The RC filter trades response speed for cleanliness: a 39 ms debounce time is imperceptible to a human user but eliminates bounce entirely.

Why hardware debounce rather than software-only? Software debounce is possible — the firmware can ignore transitions within a fixed window after the first edge — but it requires careful interrupt or timer management and must be re-implemented in every firmware version. A hardware RC filter solves the problem unconditionally, in silicon, regardless of what the firmware does. The Schmitt trigger (described below) adds a further layer that software cannot easily replicate.

#### Schmitt-trigger buffer

The RC filter output is a slow ramp, not a fast digital edge. If connected directly to a standard logic input, the slow transition through the input's switching threshold could cause the input to oscillate briefly — producing multiple output edges from a single input ramp.

U10, a Nexperia 74LVC1G17GW Schmitt-trigger buffer in a TSSOP-5 package, solves this. A Schmitt-trigger input has two separate switching thresholds:

- **V_T+** (positive-going threshold) ≈ 1.8 V at VCC = 3.3 V — the input must rise *above* this level before the output goes HIGH;
- **V_T−** (negative-going threshold) ≈ 1.0 V at VCC = 3.3 V — the input must fall *below* this level before the output goes LOW; and
- **Hysteresis band** = V_T+ − V_T− ≈ 0.8 V.

The 0.8 V gap between the two thresholds means that once the output has switched, the input must travel a full 0.8 V in the opposite direction before it switches back. Any noise or slow wavering near the threshold is ignored. The RC ramp passes cleanly through both thresholds, producing a single, sharp output edge in each direction.

U10 is a non-inverting buffer, so the BUTTON signal is LOW when pressed and HIGH when not pressed — the same polarity as the switch.

C35 (100 nF, X7R 0603) decouples U10's VCC pin, suppressing any supply noise that could affect the threshold voltages.

#### Output and boot-state pull-down

U10's output drives the BUTTON global label, which connects to the ESP32 GPIO on the `esp32_module` sheet. R31 (10 kΩ) connects BUTTON to GNDREF.

U10 is a push-pull output — it actively drives both HIGH and LOW, so BUTTON is always in a defined state during normal operation. R31 has no effect on normal operation. Its purpose is to hold BUTTON LOW during the brief window at power-up before VCC has stabilised and U10 has started driving.

:::note[Next version — R31 pull-down direction]
During boot, R31 holds BUTTON LOW, which reads as a button press. A weak pull-up to VCC (e.g. 100 kΩ) would be more correct: it would hold BUTTON HIGH during boot (not-pressed = idle), which is the safe default. It would also eliminate the ~0.33 mA continuous current drain that R31 currently causes (U10 driving HIGH against a 10 kΩ pull-down). The necessity of any pull resistor should also be reviewed — U10's push-pull output means the line is never floating during normal operation.
:::

### Performance

| Parameter | Value | Notes |
|-----------|-------|-------|
| Pull-up current (R41) | 0.33 mA | SW1 rated 50 mA — 150× margin |
| Debounce time constant τ | 39 ms | R40 × C38 = 39 kΩ × 1 µF |
| Typical contact bounce duration | 5–20 ms | τ is 2–8× the bounce window |
| Schmitt V_T+ (at 3.3 V) | ≈ 1.8 V | 74LVC1G17 datasheet |
| Schmitt V_T− (at 3.3 V) | ≈ 1.0 V | 74LVC1G17 datasheet |
| Hysteresis band | ≈ 0.8 V | V_T+ − V_T− |
| R31 continuous drain | 0.33 mA | VCC / R31; flows when button not pressed |

## Firmware notes

### Interrupt vs polling

The current firmware uses a FreeRTOS task that polls the BUTTON GPIO at a fixed interval and tracks elapsed time to distinguish press types. An interrupt-driven approach is an alternative worth considering.

**Polling approach (current):**
- a task wakes on a timer tick, reads the BUTTON GPIO state, and compares it to the previous state;
- on a LOW→HIGH transition (release), the elapsed time since the LOW→LOW (press) transition determines the press type;
- simple to implement; no risk of missing events if the poll interval is shorter than the minimum press duration; and
- consumes CPU time even when the button is idle.

**Interrupt-driven approach:**
- the ESP32 GPIO is configured to trigger an interrupt on a falling edge (press) and a rising edge (release);
- each interrupt records the current timestamp (e.g. `esp_timer_get_time()`);
- a lightweight ISR records the edge time and posts to a queue; a FreeRTOS task processes the queue and classifies the press;
- CPU is idle between presses; timing precision is limited only by interrupt latency (~1 µs on ESP32), not the poll interval; and
- slightly more complex to implement correctly (ISR must be minimal; queue sizing must handle rapid button activity).

Both approaches work with the hardware as built. The interrupt approach is more efficient and gives higher timing precision for double-click detection.

### Classifying press types

Regardless of the approach, the classification logic is the same. Three timings define the three press types:

| Press type | Detection criterion |
|------------|---------------------|
| Long press | BUTTON LOW for > T_long (e.g. 800 ms) |
| Double-click | Two LOW pulses, each < T_short (e.g. 300 ms), separated by a gap < T_gap (e.g. 400 ms) |
| Single press | BUTTON LOW for < T_short, no second press within T_gap |

The thresholds T_long, T_short, and T_gap should be configurable constants, not magic numbers. Human reaction time varies and the right values depend on the specific UX decisions for each firmware function assigned to the button.

:::note[Detection ordering]
Single press must be detected after the T_gap window has elapsed — otherwise the firmware cannot distinguish a single press from the first click of a double-click. This introduces a T_gap delay in single-press response. If instant single-press response is needed, consider acting on press (falling edge) rather than release, and cancelling the action if a second press follows within T_gap.
:::

## PCB Layout

The button input circuit shares the `button_led` sheet and PCB region with the RGB LED indicator. The button components form a compact cluster spanning roughly 13 mm × 6 mm on F.Cu: SW1, U10, C35, D7, R40, C38, R41, and R31. D7, R40, C38, and R41 occupy a tight 5 mm row; U10, C35, and R31 sit 3.5–4 mm north of it. SW1 is 9.5 mm east of U10 at the same latitude.

- **Switch placement.** SW1 (12 mm SMD tactile switch) is at board centre (119.0, 90.0). The WTI400 enclosure provides a front-panel aperture aligned with this board-centre position, and the enclosure standoff provides the depth required for the 12 mm actuator. SW1 is activated from the front panel in normal use — confirmed working on the test vessel.
- **Signal-path ordering.** The debounce chain is placed in signal order: SW1 → D7 (ESD) / R41 (pull-up) → R40 → C38 → U10 input, keeping the high-impedance debounced node compact (under 5 mm span). The exposed pull-up node from SW1 to the D7 anode (Net-(D7-A)) is 18.6 mm total; the debounced node from D7 cathode to U10 input (Net-(D7-K)) is just 4.9 mm.
- **Decoupling.** C35 (100 nF) sits adjacent to U10's VCC pin. Centroid-to-centroid spacing is 2.3 mm and VCC pad-to-pad is 3.0 mm — marginally outside the 2 mm guideline. For a 74LVC1G17 buffer on a 3.3 V rail at low current this bypass distance is unlikely to cause functional issues, and the VCC zone fill adds distributed capacitance. Flagged for V1.3 tightening.
- **BUTTON output routing.** The BUTTON net is 52.0 mm total: short F.Cu hops through R31, then a single 32.5 mm B.Cu segment (no stubs) carrying the signal at y=76.6 from the button cluster to the ESP32 module. This is acceptable for a low-speed interrupt signal. The BUTTON trace stays ≥ 22 mm clear of the LED PWM traces (LED_GRN/LED_BLU at y≈46–47) on both layers — no crossing or close proximity.
- **Ground and power.** A solid GNDREF zone (F.Cu, prio 15) covers the entire button region, with GNDREF stitching vias adjacent to U10 (109.25, 87.03) and C35 (107.2, 89.53) for low-impedance return near the Schmitt buffer. VCC reaches U10, C35, and R41 through the VCC zone fill with local stitching vias around the cluster.
- **Trace widths.** All button signal traces are 0.2 mm — appropriate for the sub-1 mA button-input currents; no high-current traces exist in this section.

## Components

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| SW1 | 6×6×12 mm | SPST SMD tactile switch — user button | — |
| D7 | 1N5819WS | Schottky diode, SOD-323 — ESD protection in button path | [Datasheet](https://www.lcsc.com/datasheet/C2927280.pdf) |
| U10 | 74LVC1G17GW | Schmitt-trigger buffer, TSSOP-5 — signal conditioning | [Datasheet](https://assets.nexperia.com/documents/data-sheet/74LVC1G17.pdf) |
| C35 | 100 nF / 50 V | X7R 0603 — U10 VCC decoupling | — |
| C38 | 1 µF / 25 V | X7R 0603 — RC debounce capacitor | — |
| R31 | 10 kΩ | 0603 — BUTTON boot-state pull-down (see Gaps) | — |
| R40 | 39 kΩ | 0603 — RC debounce resistor | — |
| R41 | 10 kΩ | 0603 — button input pull-up to VCC | — |

## Testing & Verification

:::caution

The V1.2 prototype on the test vessel responds to single press, double-click, and long press inputs without observed false triggers or missed presses across approximately 1,000 sea miles of in-service use. The RC debounce + Schmitt-trigger chain operates as designed in normal field conditions. **No quantitative bench measurements have been performed on debounce effectiveness with a scope, boot-state behaviour during VCC ramp-up, or the R31 continuous-drain figure.** The following are required.

**Hardware bring-up (rig at the bench):**

- **Input logic levels** &mdash; With SW1 open, measure BUTTON at U10 output. Pass if &ge; 2.0 V (logic HIGH). Press and hold SW1; pass if &le; 0.4 V (logic LOW).
- **Debounce effectiveness** &mdash; Connect an oscilloscope to U10 output and press SW1 rapidly several times. Pass if no more than one LOW transition per press is visible at U10 output.
- **ESD protection present** &mdash; Verify D7 is fitted and oriented correctly (cathode toward input node, anode toward GNDREF path). Visual inspection; pass if D7 marking matches silkscreen.
- **Boot-state pull-down** &mdash; Power the board with no firmware running. Measure BUTTON; pass if LOW (&le; 0.4 V). Note: this is the current expected behaviour but is flagged for review in V1.3.

:::

## Gaps & next version

**Next version (V1.3)**

- **R31 pull-down direction** &mdash; R31 currently holds BUTTON LOW during boot, which reads as a button press. A weak pull-up (e.g. 100 k&Omega;) to VCC would hold BUTTON HIGH (not-pressed = idle) during boot &mdash; the correct safe default. Review whether any pull resistor is needed at all given U10's push-pull output. Also eliminates the ~0.33 mA continuous drain that R31 currently causes.
- **C35 decoupling distance** &mdash; C35 VCC pad sits 3.0 mm pad-to-pad from U10's VCC pin, marginally outside the 2 mm guideline. Move C35 adjacent to U10's VCC pin in the next layout revision.

## References

- Nexperia, [*74LVC1G17 Single Schmitt-trigger Buffer*](https://assets.nexperia.com/documents/data-sheet/74LVC1G17.pdf)
- JSMSEMI / Vishay, [*1N5819WS Schottky Diode*](https://www.lcsc.com/datasheet/C2927280.pdf)
- Murata, [*GCM188R71E105KA64D 1 µF / 25 V X7R 0603*](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71E105KA64D)

## Related pages

- [RGB LED Indicator](./led-indicator.md) — the other half of the user-facing button/LED UI, sharing the `button_led` sheet
- [ESP32-S3 Module](./esp32-module.md) — receives the BUTTON signal on its GPIO
- [Pin Assignments](/wti400/v1.2/quick-reference/pin-assignments) — the BUTTON GPIO assignment and the full pin roster
