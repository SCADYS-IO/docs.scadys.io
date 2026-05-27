---
title: Wind Interface
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — test vessel (~1,000 sea miles)"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]

WTI400 **v1.2** — In service on the test vessel. Approximately 1,000 sea miles accumulated with basic self-calibrating firmware. Subjective in-service performance satisfactory; **no quantitative bench measurements yet** for angle accuracy, ADC clipping, atan2 reconstruction, speed-pulse PPR, VAS rail under load, or LP2951 thermal soak. The Testing & Verification section lists the measurements required.

:::

## Overview

This page documents the **wind transducer interface**: everything between the masthead transducer's mast cable and the ESP32. It spans two KiCad sheets:

- **`wind_interface.kicad_sch`** — the analog signal chain, the connector ring, cable shield conditioning, the supply path from the LDO to the transducer, and the speed-pulse conditioning.
- **A portion of `power_supplies.kicad_sch`** — the LP2951 LDO (sub-block titled *"8V / 6v5 LDO REGULATOR (35mA max)"*) that produces the VAS rail. The Power Supply page documents only the LMR51610 SMPS portion of that sheet and cross-links here for the LDO.

<SchematicViewer src="/img/schematics/wti400-v1.2/wind_interface_29ee7881.svg" alt="Wind Interface schematic — full sheet (connectors, protection, conditioning, X/Y channels, speed pulse). Zoom and pan freely; per-sub-circuit zoomed views appear below." />

Five sub-circuits in narrative order:

1. **Wind transducer supply (VAS rail)** — LP2951 LDO from the power_supplies sheet. JP1 selects between two output setpoints; WND_EN / WND_ERR firmware handshake controls and monitors the rail.
2. **Connector and cable shield** — six Keystone 1211 quick-connect tabs, cable shield conditioning, the connector-side TVS row.
3. **Wind transducer power conditioning** — series Schottky D17, common-mode filter FL2 (also the GND_WIND ↔ GNDREF star point), local broadband bypass.
4. **Wind angle X and Y channels** — two functionally identical mirrored channels: protection chain, RF/EMI filter, non-inverting amplifier with input attenuation and DC bias.
5. **Wind speed pulse conditioning** — TVS, RF choke, divider to U11 input, Schmitt-trigger output to the ESP32.

**Scope limitation, V1.2:** the U12 amplifier bias is referenced to VCC rather than WIND_8V, so the operating point does not track the JP1 setpoint. **WTI400 V1.2 supports the Raymarine ST60 / E22078 family at JP1 8v4 only.** The 6v8 setting correctly supplies B&G 213 transducers but the X / Y channel output clips on negative half-cycles. The V2.0 fix is to tie R48 to WIND_8V and rescale.

---

## Wind transducer supply (VAS rail)

<SchematicViewer src="/img/schematics/wti400-v1.2/power_supplies_dc9f1982.svg" alt="LP2951 LDO sub-circuit — U13 (LP2951-50DR adjustable), feedback divider (R72 upper, R77/R78 selectable lower legs), JP1 (Vsel jumper), R79 (factory-select 0 Ω alternative), D16 (Vout-to-Vin protection diode), R55 (SHUTDOWN pull-up), R65 (ERROR pull-up), R74 (VAS bleed), C48 (feedforward), C51 (input bypass), C52 (output bypass), FB2 (LDO output to VAS digital-domain boundary ferrite). Zoom out to see the full power_supplies sheet." initialFocus="12.7 96.52 139.7 97.79" />

### Functional specification and design objectives

- Deliver **8.65 V or 6.89 V** to the transducer connector (after the series D17 drop documented in the *Wind transducer power conditioning* section below: 8.30 V or 6.54 V respectively).
- User-selectable setpoint via **JP1** (or hard-wired via **R79** at the factory).
- **Software-controlled enable** (WND_EN GPIO from ESP32 → LP2951 SHUTDOWN) so firmware can power-cycle the transducer independent of the digital VCC rail.
- **Fault reporting** (LP2951 ERROR → WND_ERR GPIO to ESP32) for overcurrent or undervoltage detection.
- Output noise and ripple low enough that the high-impedance op-amp input chain on the same board doesn't pick up LDO noise.

### How it works

#### The LDO and its supply

**U13 — LP2951-50DR** is the adjustable variant of TI's classic LP2951 micropower LDO (100 mA rated, 30 V max input, SOIC-8). It is operated in adjustable mode with an external feedback divider so the output voltage can be programmed by jumper. The input rail is **VSC** (the CAN-domain unregulated supply, nominally 9.0–14.8 V), which arrives via FB2 from the upstream protection chain documented on the [CAN Bus Power page](./can-bus-power). C51 (4.7 µF X7R 0805) bypasses VSC at the LP2951 input pin.

#### Voltage selection — JP1 and R79

The LP2951's adjustable feedback architecture uses an internal 1.235 V reference and an external resistor divider from VAS to the FEEDBACK pin:

```
V_VAS = V_ref × (1 + R_upper / R_lower)
      = 1.235 × (1 + 120 kΩ / R_lower)
```

- **R72 (120 kΩ)** is the fixed upper divider leg.
- **R78 (20 kΩ)** is the always-present lower leg.
- **R77 (6.2 kΩ)** is an *optional* series element in the lower leg.

**JP1 (3-pin 2.54 mm header, labelled Vsel)** is the selector. With the jumper in the **8v4** position, R77 is bypassed and the lower leg is R78 alone (20 kΩ) → V_VAS = 1.235 × (1 + 120/20) = **8.65 V** (Raymarine setpoint). With the jumper in the **6v8** position, R77 is in series with R78 (26.2 kΩ) → V_VAS = 1.235 × (1 + 120/26.2) = **6.89 V** (B&G setpoint).

**R79 (0 Ω, 0805)** is a factory-only zero-ohm alternative to JP1 — it bypasses R77 directly, hard-wiring the 8v4 setpoint without a user-accessible jumper. Three production assembly stances are valid:

| Assembly | JP1 | R79 | VAS setpoint |
|----------|-----|-----|--------------|
| **Field-configurable** *(test-vessel unit)* | Fitted | DNP | Operator-selectable: 8.65 V or 6.89 V |
| **Factory Raymarine** | DNP | Fitted | Hard-wired 8.65 V |
| **Factory B&G** | DNP | DNP | Hard-wired 6.89 V (R77 always in series) |

#### D16 is a protection diode, not in the VAS current path

**D16 (RBR3MM60BTR, SOD-123FL Schottky)** is wired **anode = VAS, cathode = VSC** — that is, output-to-input, reverse-biased in normal operation. It is the classic LP2951 Vout-to-Vin protection diode: it conducts only during a fast power-down where the VAS output capacitors would otherwise back-drive the LDO. **VAS at the LP2951 output pad is the LP2951's regulated output directly** — 8.65 V or 6.89 V; D16 does not appear in the VAS current path and does not affect the setpoint voltage. (The ~0.35 V drop that reduces VAS to WIND_8V at the connector comes from a *different* diode — D17 in the wind_interface sheet — covered in the *Wind transducer power conditioning* section below.)

#### Enable / fault — SHUTDOWN, ERROR, and the firmware handshake

The LP2951 has two interface pins that connect to ESP32 GPIOs as the global signals **WND_EN** and **WND_ERR**:

- **SHUTDOWN (pin 3) is active-HIGH** — pulling SHUTDOWN high *disables* the regulator. **R55 (39 kΩ)** pulls SHUTDOWN to VCC = 3.3 V, so VAS is OFF at boot. The ESP32 drives WND_EN low to enable the rail.
- **ERROR (pin 5) is open-drain, active-LOW** — asserts during overcurrent fold-back or output undervoltage. **R65 (10 kΩ)** pulls it up to VCC. The WND_ERR global label carries this fault signal back to the ESP32 as a power-good / fault indicator.

The intended firmware control sequence:

1. **Boot complete** → ESP32 drives WND_EN low → LP2951 SHUTDOWN low → VAS enabled.
2. **No transducer signal detected** *(open-circuit cable, missing transducer)* → firmware releases WND_EN → R55 pulls SHUTDOWN high → LP2951 disabled → RGB LED flashes the no-transducer error code.
3. **LP2951 ERROR asserts** *(overcurrent or output undervoltage)* → ERROR pin pulls WND_ERR low → firmware releases WND_EN → R55 pulls SHUTDOWN high → LP2951 disabled → RGB LED flashes the transducer-fault error code.

R55's HIGH pull-up state is the **safe state** — any GPIO floating (boot, reset, brownout) leaves VAS off rather than energising the transducer with no firmware oversight.

#### Output filtering and bleed

**C52 (10 µF X7R 0805)** is the VAS output capacitor — sole output cap on this rail, comfortably above the LP2951's 1 µF minimum stability requirement. **C48 (100 pF C0G)** is a feedforward capacitor across the upper divider leg (VAS → FEEDBACK), tightening transient response when the long masthead cable adds significant capacitive load at the connector. C48 is a candidate for an increase to 820 pF if instability is observed during bring-up — pending a corresponding part addition in InvenTree.

**R74 (39 kΩ)** is a gentle bleed across the VAS output. When the LDO is disabled, R74 discharges C52 (and the small connector-side bypass downstream) so the rail collapses promptly rather than holding a residual charge for several seconds.

**FB2 (BLM31KN601SN1L, 1206, 600 Ω @ 100 MHz, 80 mΩ DCR)** is the ferrite bead at the LDO output / wind-interface domain boundary. It is the only copper path between the LP2951 output node (POWER domain on the schematic) and the VAS rail that feeds the wind_interface sheet (DIGITAL domain label). This isolates any residual switching artefacts from the upstream SMPS / CAN-domain from the high-impedance op-amp input chain.

### Performance review

| Parameter | Value | Condition | Notes |
|-----------|-------|-----------|-------|
| V_VAS at JP1 8v4 | 8.65 V | R_lower = 20 kΩ | Raymarine setpoint; designed |
| V_VAS at JP1 6v8 | 6.89 V | R_lower = 26.2 kΩ | B&G setpoint; designed |
| WIND_8V at connector (after D17) | 8.30 V / 6.54 V | I = 25 mA | See *Wind transducer power conditioning* |
| LP2951 rated I_out | 100 mA | Datasheet | 65–75 mA headroom over typical transducer loads |
| Expected transducer load — Raymarine E22078 | ~22–25 mA | Hall + dual op-amp quiescent | Measured |
| Expected transducer load — B&G 213 | 25–30 mA | Per `wind.md` empirical data | V2.0-only at correct ADC bias |
| LP2951 dropout @ 30 mA | < 0.4 V | Datasheet | VSC ≥ ~9 V required to regulate 8v4 setpoint |
| LDO dissipation @ VSC = 14.8 V, 25 mA, 8v4 | 154 mW | (14.8 − 8.65) × 25 mA | Continuous worst-case |
| LDO dissipation @ VSC = 14.8 V, 30 mA, 6v8 | 237 mW | (14.8 − 6.89) × 30 mA | Continuous worst-case |
| LP2951 SOIC-8 θJA | 123 °C/W | Datasheet, D package | No exposed pad |
| ΔTj @ 237 mW | 29.2 °C | P × θJA | Worst-case B&G operating point |
| Tj @ 85 °C ambient worst case | ~114 °C | 85 + 29 | **11 °C margin** below 125 °C limit |
| D16 dissipation (normal operation) | 0 mW | Reverse-biased | Conducts only during fast power-down |

A V1.3 / V2.0 candidate is the **DRG package** of the LP2951 (LP2951CSDRG, exposed pad, θJA = 48 °C/W) — would more than halve the junction-temperature rise. Tracked in `v2.0-improvements.md`.

### Bring-up tests

1. **VAS rail voltage under load** — at each JP1 position, load VAS to 25 mA (Raymarine) and 30 mA (B&G) with a precision bench load. Sweep VSC across 9.0–14.8 V. Pass if VAS holds within ±2 % of 8.65 V / 6.89 V across the full range. Measure at the LP2951 output pad **and** at the J5 connector tab (after D17 and FL2). *(testing-checklist.md — power_supplies)*
2. **U13 thermal soak** — VSC = 14.8 V, JP1 6v8, 30 mA load, 30-minute run. Record LP2951 package temperature with a thermal probe. Pass if Tj_estimated stays below 110 °C at 40 °C ambient (gives margin for 85 °C ambient operation). *(testing-checklist.md — power_supplies)*
3. **WND_EN / WND_ERR handshake** — verify that VAS is off at boot (WND_EN floating), comes up when firmware drives WND_EN low, and that disconnecting the transducer (load step to open-circuit) asserts WND_ERR via ESP32 GPIO. *(testing-checklist.md — wind_interface)*
4. **C48 stability check** — with the longest representative mast cable attached (transducer at end), monitor VAS for sustained oscillation at JP1 6v8 / 30 mA load. If observed, populate C48 = 820 pF as the V1.2 tuning knob. *(testing-checklist.md — power_supplies)*

---

## Connector and cable shield

<SchematicViewer src="/img/schematics/wti400-v1.2/wind_interface_29ee7881.svg" alt="Connector and cable shield sub-circuits — six Keystone 1211 quick-connect tabs (J4 shield, J5 WIND_8V, J6 X analog, J7 Y analog, J8 P pulse, J9 GND_WIND), connector-side TVS row (D18 WIND_8V, D20 X, D21 Y, D22 P), cable shield conditioning (D19 PESD15VL1BA TVS, R75 1 MΩ DC bleed, C57 1 nF HF bypass)." initialFocus="13.97 152.4 132.08 44.45" />

### Functional specification and design objectives

- Provide a service-friendly transducer connection: individual quick-connect tabs the marine installer can wire in the field, with clear silkscreen identification (no keyed housing).
- Clamp every incoming conductor at the connector entry — supply, X, Y, P, shield — with a TVS sized for the expected operating voltage on that conductor.
- Prevent the cable shield from floating (a floating shield can accumulate charge and discharge destructively through the first thing it touches when reconnected).
- Keep the **GND_WIND** transducer return domain electrically isolated from the board's **GNDREF** except at a single deliberate star point.

### How it works

#### Six quick-connect tabs, not a multi-way housing

J4–J9 are six **Keystone 1211** solder tabs in a row at the board edge. The mast cable is wired one conductor per tab by the installer; there is no keyed connector body. Silkscreen labels at each tab identify the function:

| Tab | Net | Function | Raymarine wire colour | B&G 213 wire colour |
|-----|-----|----------|------------------------|----------------------|
| J4 | WIND_SHLD | Cable shield (terminates to GND_WIND) | (drain) | (screen) |
| J5 | WIND_8V | Transducer supply | RED | ORANGE |
| J6 | X | Wind angle X (cosine / PORT) | BLUE | BLUE (Phase B) |
| J7 | Y | Wind angle Y (sine / STB) | GREEN | GREEN (Phase G) |
| J8 | P | Speed pulse | YELLOW | VIOLET |
| J9 | GND_WIND | Transducer ground return | BLACK | BLACK |

(Raymarine ST60, E22078, ST50, Autohelm transducers are pin-compatible across the family. B&G 213 post-March-1996 uses a 7-pin Network connector with different assignments — earlier B&G 213 units have a 6-pin connector and should be wired with reference to the B&G service documentation.)

#### Cable shield conditioning — a three-component sub-circuit at J4

The cable shield gets its own protection treatment at the connector — distinct from the signal/power TVS row:

- **D19 (PESD15VL1BA)** — bidirectional TVS, 15 V standoff, 200 W (8/20 µs). Clamps the shield to GND_WIND. The 15 V standoff is generous: the shield has no defined operating voltage (typically near 0 V because the cable's outer conductor is tied to vessel earth at the far end), so the wide standoff provides headroom for shield-ground potential differences in the marine environment.
- **R75 (1 MΩ)** — DC bleed from WIND_SHLD to GND_WIND. Prevents the shield from floating when the transducer cable is disconnected. The 1 MΩ value is high enough to be electrically invisible during normal operation (an 8 V miswiring fault would draw only 8 µA) but low enough to drain accumulated static charge in seconds.
- **C57 (1 nF C0G)** — HF bypass from WIND_SHLD to GND_WIND. Provides a low-impedance return path (≈ 159 Ω at 1 MHz, 16 Ω at 10 MHz) for RF currents arriving on the shield conductor, shorting them into the transducer ground domain rather than letting them propagate onto the board analog reference.

#### Connector-side TVS row — one clamp per incoming conductor

Each non-shield conductor gets its own bidirectional TVS at the connector entry, all clamping to GND_WIND:

- **D18 (SD09C-7)** — WIND_8V supply, 9 V standoff. Placed on the connector side of FL2 so the CMF acts on conducted transients before the TVS clamps them.
- **D20 (SD09C-7)** — X analog line, 9 V standoff. Trace from J6 signal pad to D20 = 3 mm.
- **D21 (SD09C-7)** — Y analog line, 9 V standoff. Mirror of D20.
- **D22 (SD09C-7)** — P speed pulse, 9 V standoff. Trace from J8 to D22 = 3 mm.

The 9 V standoff is the right size for the 8.3 V or 6.5 V operating voltage on these conductors: above any normal level (no leakage at operating voltage), below the cable insulation rating, comfortably below the absolute-maximum input on downstream silicon. Peak clamp voltage at 1 A surge = ~15 V (datasheet 8/20 µs waveform); the LC chokes downstream (L4, L5, L7) and series resistors (R63, R64) further attenuate the clamp tail before it reaches U11 / U12.

The schematic carries an explicit placement instruction: *"Place C44, C45 and D20 at the connector in the order shown."* This means the cap–TVS–choke topological order on the X and Y lines is a fixed layout constraint, not a routing convenience.

### Performance review

| Parameter | Value | Notes |
|-----------|-------|-------|
| TVS standoff vs operating voltage (8 V conductors) | 9 V > 8.3 V | All clear; no normal-operation conduction |
| TVS standoff vs shield (D19) | 15 V > 0 V | Wide margin for marine shield-ground potential |
| TVS pad-to-connector-pad trace | 3 mm | Meets ≤ 3 mm guideline (measured 2026-05-08) |
| C57 impedance at 1 MHz | 159 Ω | Adequate HF shield-to-ground shunt |
| R75 leakage at fault (8 V) | 8 µA | Negligible |

### Bring-up tests

1. **Connector silkscreen verification** — visually confirm tab labels (SHLD / 8V / X / Y / P / GND) match the J4–J9 net assignments before first transducer connection.
2. **Shield continuity** — with no transducer attached, measure R75 from WIND_SHLD to GND_WIND. Pass if 0.95–1.05 MΩ. *(testing-checklist.md — wind_interface)*

---

## Wind transducer power conditioning

<SchematicViewer src="/img/schematics/wti400-v1.2/wind_interface_29ee7881.svg" alt="Wind transducer power conditioning sub-circuit — D17 (BAT54 series Schottky, anode=VAS, cathode=FL2 pin 3), FL2 (SMCM7060-132T common-mode filter; also the GND_WIND ↔ GNDREF star point through winding 2), C55 (100 nF X7R broadband bypass on WIND_8V), C56 (15 pF C0G HF bypass on WIND_8V). Adjacent cable shield conditioning (D19, R75, C57) and WIND_8V connector-side TVS (D18) shown to the right." initialFocus="146.05 82.55 127.0 82.55" />

### Functional specification and design objectives

- Reduce the VAS rail (8.65 V or 6.89 V at the LDO) to a connector-side WIND_8V net that lives at approximately 8.0 V (Raymarine) or 6.5 V (B&G nominal) — both within the respective transducer's accepted supply range.
- Block back-EMF and reverse-current from the transducer or its long cable reaching the VAS rail during transients or power-down.
- Strip common-mode EMI conducted on the supply and ground conductors of the mast cable before it reaches the LDO or the board analog reference.
- Establish a **single GND_WIND ↔ GNDREF star point** so transducer-side return currents do not flow through the analog measurement reference.
- Provide local broadband decoupling on WIND_8V at the connector for any load step driven from the transducer side.

### How it works

#### D17 — series Schottky in the supply path

**D17 (BAT54J,115, Nexperia, SOD-323F)** is a small-signal Schottky diode placed in series in the VAS → FL2 → connector path. Anode = VAS (LDO output domain); cathode = FL2 pin 3 (winding 1 input).

Two design intentions in one part:

- **Voltage drop** — the forward drop (~0.35 V at 25 mA, datasheet typ) is the deliberate margin between the LP2951 setpoint and the connector voltage. WIND_8V = VAS − V_f(D17):

  | JP1 | VAS | D17 V_f | WIND_8V | Transducer expected supply |
  |-----|-----|---------|---------|-----------------------------|
  | 8v4 | 8.65 V | 0.35 V | **8.30 V** | Raymarine E22078: 7.5–10 V ✅ |
  | 6v8 | 6.89 V | 0.35 V | **6.54 V** | B&G 213: ~6.5 V nominal ✅ |

- **Reverse-current block** — the diode is reverse-biased to back-EMF from the transducer (e.g. when an inductive transducer winding flies back during a power-cycle, or when the long mast cable's distributed inductance releases stored energy). This prevents transients from punching back into the LP2951 output and stressing C52.

D17 is placed in the *LDO region* of the PCB (8 mm from FL2, 28 mm from the connector). Counter-intuitive at first glance — protection is usually at the connector — but D17 is a *series block*, not a surge clamp. The connector-side TVS D18 handles surges. Placing D17 at the LDO end keeps the unprotected VAS trace short and routes the post-D17 supply through the entire common-mode filter and TVS chain before it reaches the cable.

#### FL2 — common-mode filter AND star ground

**FL2 (SXN SMCM7060-132T)** is a 4-pin two-winding common-mode filter (1.3 kΩ at 100 MHz, 21 mΩ DCR per winding, 7×6 mm SMD). Its connectivity:

| FL2 pin | Net | Role |
|---------|-----|------|
| 3 | Net-(D17-K) | VAS-side input (winding 1) |
| 2 | WIND_8V | Connector-side output (winding 1) |
| 4 | GNDREF | Board reference side (winding 2) |
| 1 | GND_WIND | Transducer return side (winding 2) |

Two roles:

- **Common-mode filter** — windings 1 and 2 are wound on a single common ferrite core, so any common-mode current on the supply+ground pair (current flowing in the same direction on both conductors) sees a high impedance, while differential-mode current (the actual supply current flowing out on +V and returning on the ground) sees only the winding DCR. This attenuates conducted EMI arriving from the mast cable as common-mode noise.
- **Star ground point** — winding 2 is the *only* electrical connection between **GNDREF** (board analog/digital reference) and **GND_WIND** (transducer cable return). The PCB enforces this — GNDREF and GND_WIND have isolated copper pours bounded at the right edge of FL2 (x = 88.1 mm) with no parallel copper bridge. All TVS cathodes at the connector (D18, D19, D20, D21, D22) reference GND_WIND. The signal-chain GNDREF references (R59, R60 divider lower legs; U12 GND pin; VSENSE shunt R62; all op-amp decoupling) reference GNDREF. The two only meet at FL2.

The 21 mΩ winding 2 DCR translates to a 0.5 mV drop at 25 mA — well below 0.1 ADC LSB at 12-bit / 3.3 V — so the star point doesn't introduce a measurable bias error on the analog readings.

#### C55, C56 — broadband bypass on WIND_8V at the connector

**C55 (100 nF X7R, Murata GCM188R71H104KA57D)** and **C56 (15 pF C0G, Murata GCM1885C2A150JA16D)** sit on the connector side of FL2 between WIND_8V and GND_WIND. They cooperate:

- C55 handles bulk decoupling — supports any load step the transducer takes (Hall sensor switching, op-amp current draw inside the transducer head).
- C56 handles the upper-frequency band that C55's parasitic ESL can't reach.

Together they supplement the FL2 common-mode filtering with a local energy reservoir for transducer-side transients. At 25 mA load and a 100 mV allowable rail droop, the 100 nF holds the rail for ~2 µs — adequate for any transducer-internal transient.

### Performance review

| Parameter | Value | Notes |
|-----------|-------|-------|
| WIND_8V @ 8v4, 25 mA | 8.30 V | VAS − V_f(D17) |
| WIND_8V @ 6v8, 25 mA | 6.54 V | VAS − V_f(D17) |
| D17 dissipation @ 25 mA | 8.75 mW | I × V_f; SOD-323F θJA ≈ 300 °C/W |
| D17 ΔTj @ 25 mA | 2.6 °C | Negligible |
| FL2 winding 1 DCR drop @ 25 mA | 0.5 mV | Negligible |
| FL2 winding 2 GND offset @ 25 mA | 0.5 mV | < 0.1 ADC LSB; analog accuracy preserved |
| C55+C56 stored energy | 3.24 µJ | Available for transducer-side load step |
| GND_WIND ↔ GNDREF copper paths outside FL2 | 0 | PCB verified 2026-05-08 |

---

## Wind angle X and Y channels

<SchematicViewer src="/img/schematics/wti400-v1.2/wind_interface_29ee7881.svg" alt="Wind angle X ADC buffer sub-circuit (Y channel is identical with mirrored designators — see table below) — D20 (SD09C-7 TVS), L4 (1 µH RF/EMI choke), C44 (1 nF C0G filter cap), R58/R59 (56 kΩ input divider), R47/R48 (bias divider), R49 (Rg), R50 (Rf), U12A non-inverting amplifier → WIND_X." initialFocus="13.97 12.7 132.08 69.85" />

The two analog wind angle channels are functionally and electrically identical — exact mirrors of each other, so that the firmware `atan2(WIND_Y, WIND_X)` direction reconstruction sees a symmetric pair. The pair occupies the top half of the schematic with X on the left and Y on the right; the PCB layout mirrors trace lengths and component orientations around U12's vertical centreline. Any systematic offset or gain mismatch between the two would appear as a fixed angular error in atan2 output, so symmetry is a first-class requirement.

### Designator map (X ↔ Y)

| Function | X channel | Y channel |
|----------|-----------|-----------|
| Connector tab | J6 | J7 |
| Connector TVS (9 V SD09C-7) | D20 | D21 |
| Series RF/EMI choke (1 µH) | L4 | L5 |
| LC filter cap (1 nF C0G) | C44 | C45 |
| Input series attenuator (56 kΩ) | R58 | R61 |
| Input shunt to GNDREF (56 kΩ) | R59 | R60 |
| Op-amp half | U12 unit A (pins 1–3) | U12 unit B (pins 5–7) |
| Gain Rg (56 kΩ) | R49 | R52 |
| Feedback Rf (62 kΩ) | R50 | R51 |
| Bias upper (22 kΩ from VCC) | R47 | R54 |
| Bias lower (68 kΩ to GNDREF) | R48 | R53 |
| Output to ESP32 | WIND_X | WIND_Y |

The remainder of this section describes the X channel; everything applies identically to the Y channel with the designator substitutions above.

### Functional specification and design objectives

- Take the transducer's analog X-channel Hall sensor output (referenced to GND_WIND) and deliver it to an ESP32 ADC GPIO (referenced to GNDREF) over the full 0–3.3 V ADC input range.
- Survive ESD and conducted transients on the mast cable.
- Maintain matched gain and offset against the Y channel — atan2 angular accuracy depends on the X/Y pair behaving identically.

### How it works

#### Protection chain ordering

From the J6 connector tab to U12A's input, the X-channel signal traverses (in PCB order):

```
J6 tab → D20 TVS (9 V standoff, GND_WIND) → L4 (1 µH choke) → C44 (1 nF shunt to GNDREF) → R58 (56 kΩ series) → R59 (56 kΩ shunt to GNDREF) → U12A pin 3 (+ input)
```

Each stage adds a different kind of protection: TVS clamps the fast surge tail, L4/C44 forms an LC filter, the R58/R59 divider provides 2× attenuation while presenting a high impedance to the op-amp input.

#### L4/C44 — RF/EMI filter, not anti-aliasing

The LC corner is:

```
f_c = 1 / (2π √(L × C)) = 1 / (2π √(1 µH × 1 nF)) ≈ 5.03 MHz
```

5 MHz is **five orders of magnitude above the wind signal bandwidth** (< 10 Hz — a 50-knot wind through a typical anemometer produces a few hertz of angle modulation at most). The role of L4/C44 is **RF/EMI mitigation** — attenuating conducted noise arriving on the 10–20 m mast cable acting as a long antenna for VHF, marine SSB, and broadcast band signals. The large aliasing margin over the ESP32 ADC's sample rate is a free side-effect, not the design intent. Calling these "anti-aliasing" caps in earlier evidence understated the role.

The Murata LQM18FN1R0M00D self-resonant frequency is ~350 MHz — five decades above the LC corner, so L4 behaves as a pure inductor at the filter operating frequency.

#### Non-inverting amplifier with input attenuation and DC level shift

U12A is configured as a non-inverting op-amp with two extra features at its inputs: a divider on the (+) input and a DC bias network on the (−) input.

**At the non-inverting input (pin 3):**

- **R58 (56 kΩ)** in series from the L4/C44 filter output.
- **R59 (56 kΩ)** shunt to GNDREF.

These form a divide-by-two attenuator:

```
V_plus = V_signal × R59 / (R58 + R59) = V_signal × 0.5
```

**At the inverting input (pin 2):**

- **R47 (22 kΩ)** from VCC to bias junction.
- **R48 (68 kΩ)** from bias junction to GNDREF.

This generates the DC bias voltage:

```
V_bias = VCC × R48 / (R47 + R48) = 3.3 × 68 / (22 + 68) = 2.49 V
```

- **R49 (56 kΩ, Rg)** from bias junction to inverting input.
- **R50 (62 kΩ, Rf)** from WIND_X output back to inverting input.

Combined transfer function (ideal op-amp):

```
V_out = V_plus × (1 + Rf/Rg) − V_bias × (Rf/Rg)
      = (V_signal / 2) × (1 + 62/56) − 2.49 × (62/56)
      = V_signal × 1.054 − 2.76 V
```

**Designed for the Raymarine Hall sensor mid-point at ~4.15 V (half of WIND_8V = 8.30 V at JP1 8v4):**

| V_signal (transducer X output) | V_out (to ESP32 ADC) | Notes |
|--------------------------------|----------------------|-------|
| 2.62 V | 0.00 V | ← lower clip threshold |
| 3.00 V | 0.40 V | Measured min, Raymarine ±1.0 V swing |
| 4.15 V | 1.61 V | **Hall mid-point @ 8v4 — ADC centre** ✅ |
| 5.00 V | 2.51 V | Measured max, Raymarine ±1.0 V swing |
| 5.73 V | 3.28 V | ← upper clip threshold |
| 6.00 V | 3.56 V → clipped to 3.28 V | Measured max, Raymarine ±1.5 V worst-case |
| 2.50 V | −0.125 V → clipped to 0 V | Measured min, Raymarine ±1.5 V worst-case |

The U12 TLV9002 is RRIO, so its output saturates at the supply rails (≈ 20 mV from VCC and GND); the clip thresholds correspond to the rail limits, not internal headroom loss.

#### V1.2 design limitation — bias is VCC-referenced, not WIND_8V-referenced

**V_bias = 2.49 V is fixed** regardless of JP1 setpoint because R47/R48 reference VCC = 3.3 V, not WIND_8V. The amplifier is centred on the Raymarine Hall mid-point at 8v4. At JP1 6v8 the Hall mid-point drops to ~3.27 V, the input divider produces V_plus = 1.64 V, and:

```
V_out_mid (6v8) = 1.64 × 2.107 − 2.49 × (62/56) = 0.69 V
```

The amplifier is no longer ADC-centred. The negative half-wave of the X signal (V_signal < 2.62 V) clips to 0 V, the atan2 reconstruction loses the lower half of every direction cycle, and the firmware cannot recover a usable angle.

**WTI400 V1.2 supports the Raymarine ST60 / E22078 family at JP1 8v4 only.** JP1 6v8 produces the correct WIND_8V supply for B&G 213 but the U12 output is not usable. The V2.0 fix is to tie R48 to WIND_8V instead of VCC and rescale R47/R48 so V_bias tracks the setpoint — tracked in `v2.0-improvements.md`.

### Performance review

| Parameter | Value | Notes |
|-----------|-------|-------|
| Gain (1 + Rf/Rg) | 2.107× | 1 + 62 kΩ / 56 kΩ |
| Input divider ratio | 0.5× | R59 / (R58 + R59) |
| Effective transfer slope | 1.054× | gain × divider |
| V_bias (fixed) | 2.49 V | VCC × R48 / (R47 + R48) |
| Transfer | V_out = V_signal × 1.054 − 2.76 V | At JP1 8v4 |
| ADC mid-range output @ Raymarine Hall mid (4.15 V) | 1.61 V | ✅ centred |
| Negative clip threshold (V_signal) | 2.62 V | Below this → V_out = 0 V |
| Positive clip threshold (V_signal) | 5.73 V | Above this → V_out ≈ 3.28 V |
| Measured Raymarine swing | 2.5–6.0 V | Bench data; clips ~0.4 V at both ends |
| Gain-bandwidth headroom | 47,000× over 10 Hz | 1 MHz GBW / (2.107 × 10) |
| Op-amp input impedance | ~ 112 kΩ | R58 + R59 |
| LC filter corner | 5.03 MHz | Five decades above wind signal BW |
| Inductor SRF margin | 70× | L4 SRF ~350 MHz / 5 MHz operating |

### Bring-up tests

1. **ADC range characterisation** — rotate the vane through a full 360°, log raw WIND_X and WIND_Y ADC counts. Identify the compass bearings where clipping occurs and quantify the resulting atan2 reconstruction error. If unacceptable, reduce R50/R51 (Rf, currently 62 kΩ) to bring the full measured swing within the 3.3 V ADC range; otherwise let firmware compensate. *(testing-checklist.md — wind_interface)*
2. **atan2 zero-angle calibration** — hold vane at 0°, 90°, 180°, 270° (referenced to a marked vessel heading), record firmware-reported angle. Confirm zero offset and maximum reconstruction error across all four quadrants. *(testing-checklist.md — wind_interface)*
3. **Inter-channel crosstalk** — drive WIND_X with a 1 kHz, 1 V_pk test signal at the J6 tab, leave WIND_Y open. Pass if WIND_Y ADC counts show < 1 LSB of 1 kHz content. *(testing-checklist.md — wind_interface)*

---

## Wind speed pulse conditioning

<SchematicViewer src="/img/schematics/wti400-v1.2/wind_interface_29ee7881.svg" alt="Wind speed pulse conditioning sub-circuit — D22 (SD09C-7 TVS at J8), L7 (10 µH RF choke in P line), R76 (22 kΩ pull-up to WIND_8V), R63 (150 kΩ upper divider), R62 (100 kΩ shunt to GNDREF), VSENSE node, R64 (330 Ω series current-limit to U11 input), D10 (BZT52C3V6S 3.6 V zener clamp), C46 (15 pF C0G HF filter), U11 (74LVC1G17 Schmitt-trigger buffer), output WIND_SPD to ESP32 GPIO." initialFocus="13.97 82.55 132.08 69.85" />

### Functional specification and design objectives

- Convert the transducer's anemometer reed-switch pulse (open-circuit HIGH at ~8 V, momentary LOW during the reed contact) into a clean 3.3 V logic edge for ESP32 interrupt-driven pulse counting.
- Survive ESD and RF on the P line at the masthead cable.
- Use Schmitt-trigger hysteresis as a hardware fallback against contact bounce (with firmware as the primary debounce).

### How it works

The signal path from the J8 connector tab to the WIND_SPD GPIO traverses (in PCB order):

```
J8 tab → D22 TVS (9 V, GND_WIND)
       → L7 (10 µH RF choke)
       → [R76 pull-up to WIND_8V]
       → R63 (150 kΩ series upper divider)
       → VSENSE node [R62 100 kΩ shunt to GNDREF, C46 15 pF HF cap]
       → R64 (330 Ω current-limit)
       → U11 input
       → U11 output → WIND_SPD → ESP32 GPIO
```

**R76 (22 kΩ)** is the pull-up that holds the P line HIGH when the reed switch is open. With the transducer's reed switch normally open, P sits at ~ WIND_8V; the reed pulls P to GND_WIND for the brief duration of each rotation pulse.

**R63 / R62 voltage divider** brings the ~8 V P-HIGH down to a level compatible with U11's 3.3 V supply:

```
V_VSENSE = WIND_8V × R62 / (R63 + R62 + R76_effective)
         ≈ 8 × 100 / 250 = 3.2 V    (R76 in parallel-pull-up is negligible; first-order calc)
```

VSENSE at 3.2 V is just below VCC = 3.3 V, well above U11's V_IH (≈ 1.65 V at 3.3 V supply for the 74LVC family), and below the 3.6 V D10 zener clamp threshold (so D10 is reverse-biased and draws no current in normal operation).

**R64 (330 Ω)** is the series current-limit between the divider output and U11's input pin. If a fault drives VSENSE above U11's V_in,max, R64 holds the fault current below the input clamp diode rating until D10 conducts.

**D10 (BZT52C3V6S, 3.6 V zener)** clamps VSENSE during transients. Normal operation: V_VSENSE = 3.2 V < V_Z = 3.6 V → D10 off. Fault: V_VSENSE driven above 3.6 V → D10 conducts, capping VSENSE at ~3.6 V. With R63 = 150 kΩ in series, the worst-case fault current at V_P = 18 V into the divider is (18 − 3.6) / 150 kΩ = 96 µA → D10 dissipation = 0.35 mW — well below the 200 mW rating.

**C46 (15 pF C0G)** filters HF noise at the VSENSE node — important because R64 + the U11 input capacitance + C46 form a low-pass filter that smooths the very fast leading edge of the divided P signal before it crosses U11's Schmitt threshold.

**U11 (Nexperia 74LVC1G17GW, TSSOP-5)** is a Schmitt-trigger buffer with ~0.8 V hysteresis at VCC = 3.3 V (V_T+ ≈ 1.6 V, V_T− ≈ 0.8 V). The hysteresis is a hardware safety net: a slowly-changing input from a marginal reed-switch contact gets cleanly squared up at the output. **Firmware does the primary debounce** by interrupt-timing the WIND_SPD edges — but U11 ensures the interrupt sees a single clean edge per actual reed contact, not a burst of micro-edges from contact bounce.

### Performance review

| Parameter | Value | Notes |
|-----------|-------|-------|
| P HIGH @ JP1 8v4 | ~8.0 V | WIND_8V via R76 pull-up |
| P LOW (reed closed) | ~0 V | GND_WIND via reed switch |
| VSENSE @ P HIGH | 3.2 V | Within U11 V_in range; D10 off |
| U11 V_IH (typ) | 1.65 V | Logic HIGH recognised |
| U11 hysteresis (typ) | 0.8 V | V_T+ − V_T− |
| D10 P_diss @ 18 V fault | 0.35 mW | Well below 200 mW |
| R76 P-line risetime constant | 0.45 ns | L7/R76; orders of magnitude faster than reed bounce |
| Expected reed-switch pulse rate | 1–100 Hz | 2 pulses per anemometer rotation (Raymarine) |

### Bring-up tests

1. **Speed pulse PPR calibration** — spin the anemometer at a measured rate (bench tachometer or known wind tunnel). Log WIND_SPD ISR rate vs RPM. Confirm 2 PPR (Raymarine spec) and derive the firmware calibration constant. *(testing-checklist.md — wind_interface)*
2. **VSENSE voltage at P HIGH** — measure VSENSE with the transducer connected and the reed switch open. Expected 3.0–3.3 V (slightly below 3.2 V calculated value due to R76 loading). *(testing-checklist.md — wind_interface)*

---

## Components

### Wind transducer supply (LP2951 portion, on `power_supplies.kicad_sch`)

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| U13 | LP2951-50DR | Adjustable LDO regulator, 100 mA, 30 V max, SOIC-8 — generates the VAS rail from VSC | [TI LP2951](http://www.ti.com/lit/ds/symlink/lp2951.pdf) |
| D16 | RBR3MM60BTR | Schottky barrier, 60 V / 3 A, SOD-123FL — LP2951 Vout-to-Vin protection diode (anode=VAS, cathode=VSC) | [ROHM RBR3MM60BTR](https://fscdn.rohm.com/en/products/databook/datasheet/discrete/diode/schottky_barrier/rbr3mm60btr-e.pdf) |
| JP1 | Vsel | 3-pin 2.54 mm pin header — Raymarine / B&G transducer setpoint selector | [LCSC C2937625](https://www.lcsc.com/datasheet/C2937625.pdf) |
| FB2 | BLM31KN601SN1L | 1206 ferrite bead, 600 Ω @ 100 MHz, 80 mΩ DCR — LDO output / VAS domain boundary | [Murata BLM31KN601SN1L](https://www.lcsc.com/datasheet/lcsc_datasheet_2209271730_Murata-Electronics-BLM31KN601SN1L_C668306.pdf) |
| R55 | 39 kΩ 0603 ±1 % | LP2951 SHUTDOWN pull-up to VCC (rail off at boot) | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R65 | 10 kΩ 0603 ±1 % | LP2951 ERROR pull-up to VCC (open-drain output) | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R72 | 120 kΩ 0603 ±1 % | LP2951 feedback divider upper leg | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R74 | 39 kΩ 0603 ±1 % | VAS output bleed (discharges C52 when LDO disabled) | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R77 | 6.2 kΩ 0603 ±1 % | Feedback divider lower-leg option for 6v8 setpoint | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R78 | 20 kΩ 0603 ±1 % | Feedback divider lower-leg main resistor (always present) | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R79 | 0 Ω 0805 | Factory voltage-select alternative to JP1 (bypasses R77 → hard-wires 8v4) | — |
| C48 | 100 pF / 50 V C0G 0603 | LP2951 feedforward across upper feedback resistor (820 pF candidate pending InvenTree part) | — |
| C51 | 4.7 µF / 25 V X7R 0805 | LP2951 input (VSC) bypass | — |
| C52 | 10 µF / 25 V X7R 0805 | LP2951 output (VAS) bypass | — |

### Wind interface (on `wind_interface.kicad_sch`)

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| J4 | 1211 | Keystone 1211 solder tab — WIND_SHLD (cable shield) | [Keystone 1211](https://www.keyelco.com/product.cfm/product_id/10085) |
| J5 | 1211 | Keystone 1211 solder tab — WIND_8V (transducer supply) | [Keystone 1211](https://www.keyelco.com/product.cfm/product_id/10085) |
| J6 | 1211 | Keystone 1211 solder tab — X analog (cosine / PORT) | [Keystone 1211](https://www.keyelco.com/product.cfm/product_id/10085) |
| J7 | 1211 | Keystone 1211 solder tab — Y analog (sine / STB) | [Keystone 1211](https://www.keyelco.com/product.cfm/product_id/10085) |
| J8 | 1211 | Keystone 1211 solder tab — P (speed pulse) | [Keystone 1211](https://www.keyelco.com/product.cfm/product_id/10085) |
| J9 | 1211 | Keystone 1211 solder tab — GND_WIND (transducer return) | [Keystone 1211](https://www.keyelco.com/product.cfm/product_id/10085) |
| U12 | TLV9002IDR | TI dual RRIO op-amp, 1 MHz GBW, SOIC-8 — X (unit A) and Y (unit B) non-inverting amplifiers | [TI TLV9002](https://www.ti.com/lit/ds/symlink/tlv9002.pdf) |
| U11 | 74LVC1G17GW | Nexperia Schmitt-trigger buffer, TSSOP-5 — speed pulse conditioning | [Nexperia 74LVC1G17](https://assets.nexperia.com/documents/data-sheet/74LVC1G17.pdf) |
| FL2 | SMCM7060-132T | SXN 4-pin two-winding common-mode filter, 1.3 kΩ @ 100 MHz, 21 mΩ DCR — supply/return CMF and GND_WIND ↔ GNDREF star point | [SXN SMCM7060-132T](https://www.lcsc.com/datasheet/lcsc_datasheet_2108131830_SXN-Shun-Xiang-Nuo-Elec-SMCM7060-132T_C381616.pdf) |
| D17 | BAT54J,115 | Nexperia Schottky, V_f ≈ 0.35 V @ 25 mA, SOD-323F — series reverse-current block in VAS supply path | [Nexperia BAT54 series](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf) |
| D18 | SD09C-7 | Diodes Inc. bidirectional TVS, 9 V standoff, 400 W (8/20 µs) — WIND_8V connector clamp | [Diodes SD09C](https://www.diodes.com/assets/Datasheets/SD09C.pdf) |
| D19 | PESD15VL1BA | Nexperia bidirectional TVS, 15 V standoff, 200 W — cable shield clamp | [Nexperia PESD15VL1BA](https://assets.nexperia.com/documents/data-sheet/PESD15VL1BA.pdf) |
| D20 | SD09C-7 | Diodes Inc. bidirectional TVS, 9 V standoff — X analog clamp at connector | [Diodes SD09C](https://www.diodes.com/assets/Datasheets/SD09C.pdf) |
| D21 | SD09C-7 | Diodes Inc. bidirectional TVS, 9 V standoff — Y analog clamp at connector | [Diodes SD09C](https://www.diodes.com/assets/Datasheets/SD09C.pdf) |
| D22 | SD09C-7 | Diodes Inc. bidirectional TVS, 9 V standoff — P speed-pulse clamp at connector | [Diodes SD09C](https://www.diodes.com/assets/Datasheets/SD09C.pdf) |
| D10 | BZT52C3V6S | Vishay zener, 3.6 V, 200 mW, SOD-323 — VSENSE clamp at U11 input | [Vishay BZT52C series](https://www.vishay.com/docs/85816/bzt52c.pdf) |
| L4 | 1 µH 0603 | Murata LQM18FN1R0M00D, 150 mA, 260 mΩ DCR — RF/EMI choke on X line | [Murata LQM18FN1R0M00D](https://www.murata.com/en-us/products/productdetail?partno=LQM18FN1R0M00D) |
| L5 | 1 µH 0603 | Murata LQM18FN1R0M00D — RF/EMI choke on Y line | [Murata LQM18FN1R0M00D](https://www.murata.com/en-us/products/productdetail?partno=LQM18FN1R0M00D) |
| L7 | 10 µH 0603 | Murata LQM18FN100M00D, 50 mA, 1.17 Ω DCR — RF choke on P (speed pulse) line | [Murata LQM18FN100M00D](https://www.murata.com/en-us/products/productdetail?partno=LQM18FN100M00D) |
| R47, R54 | 22 kΩ 0603 ±1 % | U12 bias divider upper leg (X and Y; VCC → bias junction) | — |
| R48, R53 | 68 kΩ 0603 ±1 % | U12 bias divider lower leg (X and Y; bias junction → GNDREF) | — |
| R49, R52 | 56 kΩ 0603 ±1 % | U12 gain resistor Rg (X and Y) | — |
| R50, R51 | 62 kΩ 0603 ±1 % | U12 feedback resistor Rf (X and Y) | — |
| R58, R61 | 56 kΩ 0603 ±1 % | U12 input series attenuator (X and Y) | — |
| R59, R60 | 56 kΩ 0603 ±1 % | U12 input shunt to GNDREF (X and Y) | — |
| R62 | 100 kΩ 0603 ±1 % | VSENSE divider lower leg (shunt to GNDREF) | — |
| R63 | 150 kΩ 0603 ±1 % | VSENSE divider upper leg (P → VSENSE) | — |
| R64 | 330 Ω 0603 ±1 % | Series current-limit into U11 input | — |
| R75 | 1 MΩ 0603 ±1 % | Cable shield DC bleed (WIND_SHLD → GND_WIND) | — |
| R76 | 22 kΩ 0603 ±1 % | P-line pull-up to WIND_8V (P HIGH when reed open) | — |
| C40 | 100 nF / 50 V X7R 0603 | U12 VCC supply bypass | [Murata GCM188R71H104KA57D](https://www.lcsc.com/product-detail/C71664.html) |
| C43 | 100 nF / 50 V X7R 0603 | U11 VCC supply bypass | [Murata GCM188R71H104KA57D](https://www.lcsc.com/product-detail/C71664.html) |
| C44 | 1 nF / 50 V C0G 0603 | LC filter cap on X line (with L4) | [Murata GRM1885C1H102JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H102JA01D) |
| C45 | 1 nF / 50 V C0G 0603 | LC filter cap on Y line (with L5) | [Murata GRM1885C1H102JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H102JA01D) |
| C46 | 15 pF / 100 V C0G 0603 | VSENSE HF filter at U11 input node | [Murata GCM1885C2A150JA16D](https://www.murata.com/en-us/products/productdetail?partno=GCM1885C2A150JA16D) |
| C55 | 100 nF / 50 V X7R 0603 | WIND_8V broadband bypass at connector side of FL2 | [Murata GCM188R71H104KA57D](https://www.lcsc.com/product-detail/C71664.html) |
| C56 | 15 pF / 100 V C0G 0603 | WIND_8V HF bypass at connector side of FL2 (with C55) | [Murata GCM1885C2A150JA16D](https://www.murata.com/en-us/products/productdetail?partno=GCM1885C2A150JA16D) |
| C57 | 1 nF / 50 V C0G 0603 | Cable shield HF bypass (WIND_SHLD → GND_WIND) | [Murata GRM1885C1H102JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H102JA01D) |

---

## Testing & Verification

:::caution

The V1.2 prototype on the test vessel has accumulated ~1,000 sea miles with basic self-calibrating firmware. In-service performance is **satisfactory subjectively** but **no quantitative bench measurements** have been performed on the wind interface yet. The following are required.

**Hardware bring-up (rig at the bench, transducer attached):**

- **WIND_8V rail at J5 under load** — Measure at the connector tab at JP1 8v4, transducer connected and rotating. Expected 8.30 V at 25 mA. Repeat at JP1 6v8 → expected 6.54 V at 25 mA.
- **VAS rail voltage** — Confirm 8.65 V (8v4) / 6.89 V (6v8) at the LP2951 output pad under each load condition.
- **LP2951 thermal soak** — 30 min run at VSC = 14.8 V, JP1 6v8, 30 mA load. Record package temperature. Pass if estimated Tj stays below 110 °C at 40 °C ambient.
- **VSENSE voltage at P HIGH** — Reed switch open, transducer connected. Expected ~3.0–3.3 V.
- **WND_EN / WND_ERR handshake** — Verify VAS is off at boot, enables when WND_EN is driven low, asserts WND_ERR low when the cable is disconnected (transducer absent).
- **ADC range characterisation** — Rotate vane through full 360°, log raw WIND_X / WIND_Y ADC counts. Identify clipping bearings and quantify atan2 reconstruction error. Decision point: if clipping is unacceptable, reduce R50/R51 (Rf) in a V2.0 spin; if acceptable, document the angular error budget for firmware compensation.
- **atan2 zero-angle calibration** — Hold vane at 0°, 90°, 180°, 270° (referenced to a marked heading). Record firmware-reported angle. Document zero offset and maximum reconstruction error across all four quadrants.
- **Speed pulse PPR calibration** — Drive anemometer at measured RPM, log WIND_SPD ISR rate, confirm 2 PPR (Raymarine spec), derive firmware calibration constant.
- **Inter-channel crosstalk** — 1 kHz, 1 V_pk on WIND_X with WIND_Y open. Pass if < 1 LSB of 1 kHz content appears on WIND_Y.

**For V2.0:**

- **Tie R48 (and R53 mirror) to WIND_8V instead of VCC** and rescale R47/R48 so V_bias tracks the JP1 setpoint. Centres V_out at the ADC mid-range at *both* setpoints, enabling B&G 213 (and similar 6.5 V Hall-bias transducers) on the same hardware.
- **Re-prioritise the F.Cu GND_WIND zone to priority 16** (currently 15, same as GNDREF unnamed fill) so domain separation is enforced by zone priority rather than the clearance rule alone.

:::

---

## References

- Texas Instruments, [*LP2951 Series of Adjustable Micropower Voltage Regulators*](http://www.ti.com/lit/ds/symlink/lp2951.pdf).
- Texas Instruments, [*TLV9001/2 1-MHz, Low-Power, RRIO Op Amp*](https://www.ti.com/lit/ds/symlink/tlv9002.pdf).
- Nexperia, [*74LVC1G17 Single Schmitt-trigger Buffer*](https://assets.nexperia.com/documents/data-sheet/74LVC1G17.pdf).
- Nexperia, [*BAT54 Series Schottky Barrier Diodes*](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf).
- ROHM, [*RBR3MM60BTR Schottky Barrier Diode*](https://fscdn.rohm.com/en/products/databook/datasheet/discrete/diode/schottky_barrier/rbr3mm60btr-e.pdf).
- Diodes Incorporated, [*SD09C Low-Capacitance TVS Array*](https://www.diodes.com/assets/Datasheets/SD09C.pdf).
- Nexperia, [*PESD15VL1BA ESD Protection Diode*](https://assets.nexperia.com/documents/data-sheet/PESD15VL1BA.pdf).
- Vishay, [*BZT52C3V6S Zener Diode*](https://www.vishay.com/docs/85816/bzt52c.pdf).
- SXN, [*SMCM7060-132T Common-Mode Filter*](https://www.lcsc.com/datasheet/lcsc_datasheet_2108131830_SXN-Shun-Xiang-Nuo-Elec-SMCM7060-132T_C381616.pdf).
- Murata Electronics, [*LQM18FN1R0M00D 1 µH Inductor*](https://www.murata.com/en-us/products/productdetail?partno=LQM18FN1R0M00D).
- Murata Electronics, [*LQM18FN100M00D 10 µH Inductor*](https://www.murata.com/en-us/products/productdetail?partno=LQM18FN100M00D).
- [Transducer Compatibility Reference](../transducer-compatibility) — per-transducer pin-outs, supply requirements, signal-level characteristics, and WTI400 V1.2 compatibility for the Raymarine ST60 / E22078 / E22079 / ST50 / Autohelm family, B&G 213 and Network units, and the Navman 3150.
