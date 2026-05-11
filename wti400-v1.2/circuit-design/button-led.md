---
title: Button & LED
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/wti400-v1.2/button_led_a6421fe1.svg" alt="Button & LED schematic" />

:::note[Hardware version]

WTI400 **v1.2** — In service — installed on test vessel

:::

## Components

| Ref | Value | Description | Datasheet |
|-----|-------|-------------|-----------|
| SW1 | 6×6×12 mm | SPST SMD tactile switch, 12 mm actuator, 50 mA / 12 V | — |
| D1 | XL-3528RGBW-HM | XINGLIGHT SMD3528-4P common-anode RGB LED | [Datasheet](https://www.lcsc.com/datasheet/C2843813.pdf) |
| D7 | 1N5819WS | JSMSEMI 1N5819WS, 40 V / 350 mA Schottky diode, SOD-323 | [Datasheet](https://www.lcsc.com/datasheet/C2927280.pdf) |
| Q1 | BC807-25 | JSMSEMI BC807-25, 45 V / 500 mA PNP BJT, SOT-323 | [Datasheet](https://www.lcsc.com/datasheet/lcsc_datasheet_2304140030_JSMSEMI-BC807-25_C2669132.pdf) |
| U10 | 74LVC1G17GW | Nexperia 74LVC1G17GW,125 Schmitt-trigger buffer, 1.65–5.5 V, TSSOP-5 | [Datasheet](https://assets.nexperia.com/documents/data-sheet/74LVC1G17.pdf) |
| C35 | 100 nF/50 V | Murata GCM188R71H104KA57D, X7R 0603 — U10 VCC decoupling | [Datasheet](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C38 | 1 µF/25 V | Murata GCM188R71E105KA64D, X7R 0603 — debounce RC capacitor | [Datasheet](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71E105KA64D) |
| R5 | 10 kΩ | Yageo RC0603FR-07, ±1%, 0603 — Q1 base drive (LED_RED path) | — |
| R6 | 68 kΩ | Yageo RC0603FR-07, ±1%, 0603 — Q1 base bias to GND | — |
| R7 | 10 kΩ | Yageo RC0603FR-07, ±1%, 0603 — LED_GRN pull-up to VCC | — |
| R8 | 10 kΩ | Yageo RC0603FR-07, ±1%, 0603 — LED_BLU pull-up to VCC | — |
| R10 | 220 Ω | Yageo RC0603FR-07, ±1%, 0603 — blue channel current limiter | — |
| R11 | 220 Ω | Yageo RC0603FR-07, ±1%, 0603 — green channel current limiter | — |
| R12 | 680 Ω | Yageo RC0603FR-07, ±1%, 0603 — red channel current limiter (Q1 path) | — |
| R31 | 10 kΩ | Yageo RC0603FR-07, ±1%, 0603 — BUTTON output series protection | — |
| R40 | 39 kΩ | Yageo RC0603FR-0739KL, ±1%, 0603 — RC debounce resistor | — |
| R41 | 10 kΩ | Yageo RC0603FR-07, ±1%, 0603 — button input pull-up to VCC | — |

---

## How It Works

**Button input.** SW1 (SPST SMD tactile, 6×6×12 mm) connects between the button input node and GNDREF. R41 (10 kΩ) pulls the input node to VCC so the node is HIGH at rest and goes LOW when SW1 is pressed. D7 (1N5819WS Schottky, SOD-323) provides ESD and back-EMF protection at the switch. R40 (39 kΩ) and C38 (1 µF) form an RC low-pass network with τ = 39 ms, attenuating mechanical contact bounce (typically 5–20 ms) before the signal reaches U10. U10 (74LVC1G17, Schmitt-trigger buffer, TSSOP-5) applies a further 0.8 V of hysteresis (V_T+ ≈ 1.8 V, V_T− ≈ 1.0 V at VCC = 3.3 V), ensuring a single clean output edge for each button press. The conditioned signal exits via the BUTTON global label through R31 (10 kΩ series protection) to the ESP32 GPIO interrupt input on the `esp32_module` sheet. C35 (100 nF X7R) decouples U10's VCC pin.

**RGB LED indicator.** D1 (XL-3528RGBW-HM, SMD3528-4P) is a common-anode RGB LED whose anode connects directly to VCC (3.3 V). The three cathode pins — RK (red), GK (green), BK (blue) — are switched to GNDREF to illuminate each channel. The LED backlights the Scadys logo on the WTI400 front panel.

**Red channel — fail-on.** Q1 (BC807-25 PNP, SOT-323) is a low-side current-sink in the red channel. Q1 emitter connects via R12 (680 Ω) to D1 red cathode (RK); Q1 collector connects to GNDREF. R6 (68 kΩ) biases the base toward GND, holding Q1 ON by default (V_EB ≈ 0.6 V, active region). LED_RED (from ESP32) reaches the base through R5 (10 kΩ); when the ESP32 drives LED_RED HIGH (3.3 V), the R5/R6 divider raises the base to ~2.9 V, clamping V_EB to 0.42 V and turning Q1 OFF. The consequence is fail-on behaviour: if the ESP32 is in reset or LED_RED is floating, the red LED illuminates. Red channel current is ~0.74 mA in the active region.

**Green and blue channels — fail-off.** These channels are driven directly by ESP32 GPIOs without transistors. R7 (10 kΩ) and R8 (10 kΩ) pull LED_GRN and LED_BLU to VCC respectively. When a GPIO floats — during boot, reset, or if the firmware has not yet configured it — the pull-up holds the cathode side near VCC, matching the anode voltage and removing the forward bias from D1. The channel is therefore OFF by default. The ESP32 drives the pin LOW to illuminate the channel, pulling the cathode through R11 (220 Ω, green) or R10 (220 Ω, blue) toward GNDREF and forward-biasing D1. Channel current: I_GRN = I_BLU ≈ (3.3 − 3.0) / 220 ≈ 1.4 mA.

---

## Design Rationale

**Complementary fail-safe states.** The red channel defaults ON and the green/blue channels default OFF. On power-up, before firmware initialises the LED GPIOs, the board shows red — a clear visual indication that the ESP32 has not yet asserted control. Once firmware is running, it can extinguish red and assert green or blue for normal status indication. This behaviour requires no firmware awareness of the boot sequence; it falls out directly from the component values.

**680 Ω on the red channel.** Red has a lower forward voltage than green and blue (Vf ≈ 2.2 V vs 3.0 V), which would otherwise produce significantly more current through a 220 Ω resistor (I ≈ 5 mA). R12 = 680 Ω, combined with the Q1 V_EB drop in the active region, reduces the red channel to ~0.74 mA — closer to the 1.4 mA of the green and blue channels. Exact colour balance at firmware default PWM duty cycles is verified during bring-up.

**Q1 in active region, not saturation.** With V_EC = 0.60 V and V_EC_sat ≈ 0.1–0.2 V, Q1 operates in the active region rather than saturation. This is intentional: the LED is a low-current status indicator, not a high-efficiency switching load, and active-region operation simplifies the base-drive network (no saturation overdrive required). The single R6 bias resistor is sufficient.

---

## PCB Layout

All seventeen button_led components are placed on F.Cu. The circuit divides into two compact clusters: a button input cluster (SW1, U10, C35, D7, R40, C38, R41, R31) spanning 13 × 6 mm at board coordinates (106–119, 87–93), and an LED cluster split between current-limiting resistors (R10, R11, R12) immediately south of D1 at y ≈ 51 mm and base-drive/pull-up resistors (R5, R6, R7, R8) at x ≈ 142–146 mm.

| Requirement | Status | Evidence |
|-------------|--------|----------|
| SW1 front-panel accessible | ✅ Met | Enclosure aperture aligned with SW1 at (119, 90); 12 mm actuator accommodated by enclosure depth. Confirmed on *Sunny Spells* |
| C35 within 2 mm of U10 VCC pin | ⚠️ Partial | Centroid-to-centroid 2.3 mm; pin-to-pin 3.0 mm. Functional at U10 switching rates; noted for V2.0 |
| D1 visible from operator position | ✅ Met | Backlights Scadys logo aperture on front panel. Confirmed by enclosure design |
| R40/C38 between SW1 and U10 | ✅ Met | Signal path order: SW1 → D7 → R40 → C38 → U10 input; cluster spans 5 mm at y ≈ 93 |
| R41 near SW1/D7 | ✅ Met | R41 (111.1, 93.1): 1.6 mm from D7 |
| Q1 near D1 | ✅ Met | Q1 (121.8, 51.3) to D1 (119.0, 57.0): 6.4 mm |
| R10/R11/R12 near D1 cathodes | ✅ Met | Resistor cluster at y = 51.2, 5.8–6.2 mm south of D1 |
| BUTTON away from LED PWM traces | ✅ Met | BUTTON on B.Cu at y = 76.6; LED_GRN/BLU at y ≈ 46–47; separation ≥ 22 mm |

LED_GRN and LED_BLU each traverse ~40 mm on B.Cu (long-haul between the pull-up cluster at x ≈ 144–146 and the current-limiting cluster at x ≈ 116–118). At PWM frequencies below 10 kHz the trace lengths present no signal integrity concern.

---

## Design Calculations

| Parameter | Value | Notes |
|-----------|-------|-------|
| Pull-up current (R41) | 0.33 mA | SW1 rated 50 mA — 150× margin |
| Debounce τ (R40 × C38) | 39 ms | 2–8× typical bounce duration (5–20 ms) |
| Schmitt hysteresis (U10 at 3.3 V) | 0.8 V | V_T+ ≈ 1.8 V, V_T− ≈ 1.0 V |
| Red channel current (Q1 active) | 0.74 mA | (3.3 − 2.2 − 0.6) / 680; V_EB = 0.60 V ON, 0.42 V OFF |
| Green channel current | 1.36 mA | (3.3 − 3.0) / 220 |
| Blue channel current | 1.36 mA | (3.3 − 3.0) / 220 |
| Total LED current (all on) | 3.54 mA | Negligible on VCC rail |
| LED abs max per channel | 30 mA | Operating at 2.5–4.5 % of maximum |

---

:::caution

Verification required — In service

**Verify during bring-up:**
- LED colour balance: red runs at 0.74 mA vs 1.36 mA for green/blue (ratio ≈ 1 : 1.8). Verify perceived balance for status indication at firmware default PWM duty cycles; adjust duty in firmware if red appears dim relative to green/blue.

:::

---

## References

- Nexperia, [*74LVC1G17 Single Schmitt-trigger Buffer*](https://assets.nexperia.com/documents/data-sheet/74LVC1G17.pdf)
- JSMSEMI, [*BC807-25 PNP Bipolar Transistor*](https://www.lcsc.com/datasheet/lcsc_datasheet_2304140030_JSMSEMI-BC807-25_C2669132.pdf)
- JSMSEMI / Vishay, [*1N5819WS Schottky Diode*](https://www.lcsc.com/datasheet/C2927280.pdf)
- XINGLIGHT, [*XL-3528RGBW-HM SMD RGB LED*](https://www.lcsc.com/datasheet/C2843813.pdf)
- Murata, [*GCM188R71H104KA57D 100 nF/50 V X7R 0603*](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D)
- Murata, [*GCM188R71E105KA64D 1 µF/25 V X7R 0603*](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71E105KA64D)
- WTI400 V1.2 `schema_review/power_supplies.md` — VCC = 3.3 V rail source
