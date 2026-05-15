---
title: Button Input
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

The button is the primary user input on the WTI400. It supports three interaction types — single press, double-click, and long press — allowing the user to give different instructions without additional controls. This page covers the hardware circuit that takes the raw mechanical switch signal and delivers a clean, debounced digital input to the ESP32 using a Schmitt trigger buffer.

---

## Button Input

### Functional specification and design objectives

The button input circuit must:

- detect a press of SW1 and deliver a clean, glitch-free digital signal to an ESP32 GPIO;
- eliminate contact bounce — the rapid make-and-break transitions that occur in the first few milliseconds of any mechanical switch press;
- protect the input from electrostatic discharge (ESD) at the switch terminals; and
- present a defined signal level to the ESP32 during boot, before firmware has initialised.

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

### Performance review

| Parameter | Value | Notes |
|-----------|-------|-------|
| Pull-up current (R41) | 0.33 mA | SW1 rated 50 mA — 150× margin |
| Debounce time constant τ | 39 ms | R40 × C38 = 39 kΩ × 1 µF |
| Typical contact bounce duration | 5–20 ms | τ is 2–8× the bounce window |
| Schmitt V_T+ (at 3.3 V) | ≈ 1.8 V | 74LVC1G17 datasheet |
| Schmitt V_T− (at 3.3 V) | ≈ 1.0 V | 74LVC1G17 datasheet |
| Hysteresis band | ≈ 0.8 V | V_T+ − V_T− |
| R31 continuous drain | 0.33 mA | VCC / R31; flows when button not pressed |

### Bring-up tests

1. **Input logic levels**: With SW1 open, measure BUTTON at U10 output — pass if ≥ 2.0 V (logic HIGH). Press and hold SW1, measure again — pass if ≤ 0.4 V (logic LOW).
2. **Debounce effectiveness**: Connect an oscilloscope to U10 output. Press SW1 rapidly several times — pass if no more than one LOW transition per press is visible at U10 output.
3. **ESD protection present**: Verify D7 is fitted and oriented correctly (cathode toward input node, anode toward GNDREF path). Visual inspection — pass if D7 marking matches silkscreen.
4. **Boot-state pull-down**: Power the board with no firmware running. Measure BUTTON — pass if LOW (≤ 0.4 V). Note: this is the current expected behaviour but is flagged for review — see Gaps.

### Gaps & next version

**Next version**

- **R31 pull-down direction**: R31 currently holds BUTTON LOW during boot, which reads as a button press. A weak pull-up (e.g. 100 kΩ) to VCC would hold BUTTON HIGH (not-pressed = idle) during boot — the correct safe default. Review whether any pull resistor is needed at all, given U10's push-pull output. Also eliminates the 0.33 mA continuous drain.

---

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

---

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

---

## References

- Nexperia, [*74LVC1G17 Single Schmitt-trigger Buffer*](https://assets.nexperia.com/documents/data-sheet/74LVC1G17.pdf)
- JSMSEMI / Vishay, [*1N5819WS Schottky Diode*](https://www.lcsc.com/datasheet/C2927280.pdf)
- Murata, [*GCM188R71E105KA64D 1 µF / 25 V X7R 0603*](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71E105KA64D)
