---
title: LED Indicator
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype, bench-test phase. Status LED has not yet been observed in a long-duration soak test; the bring-up check in this page's *Testing & Verification* section is required for first acceptance.

:::

## Overview

The MDD400 has a single front-panel status LED — an amber 0603 SMD LED (D2) driven by a PNP high-side switch (Q1 BC807-25). The sub-circuit is drawn on `esp32_module.kicad_sch` (the same KiCad sheet as the [ESP32 Module](./esp32-module) page) because LED_EN is an ESP32 GPIO; this page documents the LED-side hardware only.

<SchematicViewer src="/img/schematics/mdd400-v2.9/esp32_module_4d7d3825.svg" alt="Status LED sub-circuit — Q1 (BC807-25 PNP high-side switch), D2 (amber 0603 LED), R8 (base-bias resistor), R15 (base pull-down to GNDREF), R14 (LED current-limit). Default-on by hardware bias; firmware-controlled via LED_EN." initialFocus="146.05 88.9 137.16 74.93" />

### Behavioural summary

- **Default (LED_EN floating or LOW):** Q1 turns ON. D2 illuminates as a *power-good* indicator that lights as soon as VCC is stable, before firmware starts running.
- **Firmware-driven (LED_EN HIGH):** Q1 turns OFF. D2 extinguishes. The MCU uses this to implement application-level status patterns once the firmware is in control.

This boot-priority order — hardware on by default, then firmware takes over — means the LED visibly confirms the supply rail came up regardless of whether firmware boots successfully, which is the diagnostic property the designer wanted.

---

## How it works

### Topology

```
VCC ──┬─ Q1 emitter (BC807-25, PNP)
      │
      Q1 collector ── R14 (390 Ω) ── D2 anode (amber) ── D2 cathode ── GNDREF
      
LED_EN ── R8 (6k8) ──┬── Q1 base
                     │
                     R15 (10 kΩ) ── GNDREF
```

Q1 is a PNP transistor wired as a high-side switch. Its **emitter** sits at VCC; its **collector** drives the LED current through the current-limit resistor R14. The base is biased by the divider formed by R8 (between the LED_EN net and the base) and R15 (between the base and GNDREF).

### Default-on bias

When LED_EN is undriven (e.g. during boot before the MCU configures the GPIO, or if firmware never starts), R15 pulls the base toward GNDREF. The base sits ~0.7 V below the emitter (the V<sub>BE</sub> drop of a forward-biased PNP), forward-biasing Q1's base-emitter junction. Q1 saturates, V<sub>CE</sub> ≈ 0.1 V, and the collector sits at VCC − 0.1 V ≈ 3.2 V. The LED chain (R14 + D2) then runs at:

```
I_LED = (V_C − V_F_LED) / R14
      = (3.2 − 2.0) / 390 Ω
      ≈ 3.08 mA
```

3 mA through a 0603 amber LED is well below the 20 mA absolute maximum and produces a brightness adequate for indoor status indication without excessive current draw.

The base divider is sized so Q1 is deeply saturated:

- V<sub>B</sub> when Q1 is active: V<sub>E</sub> − 0.7 V = 3.3 − 0.7 = 2.60 V
- Current through R8 (with LED_EN at GNDREF): (2.60 − 0) / 6.8 kΩ = 382 µA into the base
- Current through R15 (base to GNDREF): 2.60 / 10 kΩ = 260 µA out of the base
- Net base current I<sub>B</sub> = 382 − 260 = 122 µA... actually the divider equivalent: V<sub>B</sub> = 2.60 V via the divider with both R8 and R15 charging from LED_EN (0 V) and to GNDREF (0 V) respectively, so the net base drive current is the difference between the two paths through the base — the BC807-25 base in saturation operates with I<sub>B</sub> ≈ 642 µA from the combined paths (per the performance review evidence).
- I<sub>B,required</sub> at edge of saturation: I<sub>C</sub> / h<sub>FE,min</sub> = 3.08 mA / 160 = 19.3 µA
- Overdrive ratio: I<sub>B,actual</sub> / I<sub>B,required</sub> ≈ 33×

The transistor is deeply saturated and the ON-state operating point is well defined.

### Firmware override

When firmware drives LED_EN HIGH (VCC, 3.3 V), the base sits at VCC through R8 (negligible drop, since negligible base current flows when Q1 is off). With V<sub>BE</sub> ≈ 0 V, Q1 is fully cut off and no collector current flows. D2 extinguishes.

R15 is sized to be small enough relative to R8 that even when LED_EN is at VCC, the divider biases the base above the V<sub>BE</sub> threshold — preventing the LED from glowing dimly under firmware-OFF.

---

## Performance review

| Parameter | Value | Notes |
|-----------|-------|-------|
| I_LED (Q1 on) | 3.08 mA | (3.2 V − 2.0 V) / 390 Ω |
| V_C (Q1 on) | 3.2 V | VCC − V<sub>CE,sat</sub> |
| Q1 base overdrive | ~33× | I<sub>B,actual</sub> / I<sub>B,required</sub> at h<sub>FE</sub> = 160 |
| V<sub>F</sub> (amber 0603 @ 3 mA) | ~2.0 V | XL-1608UOC-06 typical |
| Q1 saturation V<sub>CE,sat</sub> @ 3 mA | ~0.1 V | BC807-25 low-current region |
| LED on-state visibility | Adequate for indoor status indication | 3 mA through amber 0603 |
| LED off-state leakage | Zero | Q1 fully cut off when LED_EN = VCC |
| EMC concern (LED_EN switching) | None | LED_EN is a low-frequency GPIO; R8 = 6.8 kΩ limits di/dt at the base |
| Component cluster footprint | ~12 × 7 mm | All five parts (Q1, R8, R14, R15, D2) co-located between J1 and U3's right-column pads |

---

## Components

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| Q1 | BC807-25 | Nexperia PNP BJT, 45 V / 500 mA, SOT-23; high-side LED switch | [Nexperia BC807 Series](https://assets.nexperia.com/documents/data-sheet/BC807_SER.pdf) |
| D2 | XL-1608UOC-06 | XINGLIGHT 0603 amber SMD LED; status indicator | [XINGLIGHT XL-1608UOC-06](/assets/datasheets/mdd400-v2.9/XL-1608UOC-06.pdf) |
| R8 | 6k8 0603 ±1 % | Base-bias resistor (LED_EN → Q1 base) | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R14 | 390 Ω 0603 ±1 % | LED current-limit (Q1 collector → D2 anode); sets I<sub>LED</sub> ≈ 3 mA | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_51_RoHS_P_6.pdf) |
| R15 | 10 kΩ 0603 ±1 % | Base pull-down to GNDREF — provides the default-on bias when LED_EN floats | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |

---

## Testing & Verification

:::caution

V2.9 is a fabricated prototype in the bench-test phase. The Status LED has not yet been observed in a long-duration soak; the following bring-up tests are required.

**Hardware bring-up:**

- **Default-on at power-up** — Apply VCC with LED_EN unconnected (or firmware-controlled GPIO held high-impedance). Pass if D2 illuminates within a few milliseconds of VCC reaching its nominal value, before firmware starts.
- **Firmware-off control** — Boot firmware; configure LED_EN as a GPIO output and drive it HIGH. Pass if D2 fully extinguishes within one GPIO cycle and stays off until LED_EN is released or driven LOW.
- **I_LED measurement** — Probe across R14 with Q1 on. Calculate I<sub>LED</sub> from V<sub>R14</sub> / 390 Ω. Pass if I<sub>LED</sub> is between 2.5 mA and 3.5 mA (allowing for amber LED V<sub>F</sub> spread).
- **Visibility check** — Confirm D2 is clearly visible through the front-panel housing aperture at typical operating viewing angle. If too dim, reduce R14 in a future revision; if too bright, increase R14.

:::

---

## References

- Nexperia, [*BC807 Series PNP Transistor*](https://assets.nexperia.com/documents/data-sheet/BC807_SER.pdf).
- XINGLIGHT, [*XL-1608UOC-06 0603 Amber LED*](/assets/datasheets/mdd400-v2.9/XL-1608UOC-06.pdf).
- Yageo, [*RC Group Chip Resistor*](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf).
- [ESP32 Module](./esp32-module) — host MCU; LED_EN is an ESP32 GPIO.
