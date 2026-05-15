---
title: CAN Bus Power
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/wti400-v1.2/can_bus_power_0819808b.svg" alt="CAN bus power schematic" viewBox="18 24 258 82" />

:::note[Hardware version]
WTI400 **v1.2** — In service — installed on test vessel
:::

## Overview

The CAN bus power circuit takes the raw NMEA 2000 bus supply (NET-S, nominally 12 V) and delivers a clean, protected supply rail (VSC) to the rest of the WTI400. Six sequential stages condition the input: primary surge clamping, a resettable fuse and reverse-polarity protection, bulk capacitor buffering, a two-stage LC EMI filter, an over-voltage protection switch, and a secondary output clamp.

---

## CAN Bus Power

### Functional specification and design objectives

The CAN bus power circuit must:

- withstand NMEA 2000 bus surge events up to ISO 7637-2 Pulse 5b without component damage;
- block reverse polarity passively — no firmware involvement;
- provide a resettable overload fuse that restores automatically after a fault clears;
- suppress conducted EMI on the supply rail before it reaches the downstream regulators;
- disconnect VSC if bus voltage rises above the LP2951 wind transducer LDO's safe operating range; and
- deliver VSC within 300 mV of NET-S under normal operating current.

### How it works

The NMEA 2000 bus delivers power on NET-S (positive) and NET-C (ground). The WTI400 is bus-powered: GNDREF is tied directly to NET-C at J2. NET-S is nominally 9–16 V DC under IEC 61162-3, with a maximum charging voltage of 14.8 V. Surge events — load-dump, cable plug/unplug, or a switching transient elsewhere on the backbone — can reach hundreds of volts for microseconds at J2.

#### Stage 1 — Primary surge clamping

Two devices in parallel absorb surge energy before it reaches any active circuitry.

D11 (SM8S36CA) is a bidirectional TVS in a DO-218AB package with a 36 V standoff voltage and 6.6 kW peak pulse power rating. It clamps fast transients — including ISO 7637-2 Pulse 5b — to approximately 58 V during an 8/20 µs surge. The DO-218AB footprint uses copper pads on all layers with four 1 mm through-hole vias for thermal relief during repeated surge events.

M1 (V33MLA1206NH) is a 75 V metal oxide varistor in 1206. MOVs are slower than TVS diodes but absorb more energy across a longer pulse. M1 absorbs the leading edge of slow high-energy transients before D11 needs to clamp.

#### Stage 2 — Fuse and reverse-polarity protection

F1 (BSMD1812-050-60V) is a 500 mA / 60 V PTC resettable fuse in 1812. A PTC is preferred over a one-shot fuse for a marine instrument: a blown fuse mid-passage leaves the instrument dead with no means of recovery. After a fault clears, F1 cools and resets automatically. The 500 mA hold current at 25 °C gives a 7× margin over the 65 mA continuous operating current — accidental trips from normal operation are not possible.

D9 (SS34) is a 40 V / 3 A Schottky diode in SMA, wired in series on the high-side rail immediately after F1. It blocks reverse polarity passively: if NET-S and NET-C are swapped, D9 prevents current from flowing. The Schottky forward voltage (~380 mV at 65 mA) contributes to the voltage drop budget.

#### Stage 3 — Bulk capacitor buffer

C41 and C42 (2 × 22 µF / 100 V, X7R, 2220) provide 44 µF of bulk capacitance at the post-fuse rail, decoupling cable impedance and storing energy during the brief window while D11 is clamping a surge event.

R43 (100 mΩ) damps LC resonance between the bulk capacitor bank and the EMI filter inductors that follow. Without it, the undamped series resonance at ~60 kHz would produce an impedance peak, degrading filter attenuation near that frequency. R39 (220 mΩ) damps the resonance between the bulk stage and the first filter inductor. Both are passive damping resistors — they carry load current but dissipate only 0.4 mW and 0.9 mW respectively at 65 mA operating current.

R42 (100 kΩ) bleeds C41/C42 to zero when power is removed, preventing VSC from remaining live after the bus is disconnected.

#### Stage 4 — Two-stage LC EMI filter

A cascaded LC ladder suppresses conducted EMI on the supply rail. Two filter stages are used because a single stage would require impractically large inductors to achieve the same attenuation.

**First stage**: L3 (1 µH, 3.5 A rated) with C39 (1 µF), C36 (4.7 µF), and C37 (4.7 µF) as shunt capacitors to GNDREF. The three shunt capacitors in parallel give an effective nominal capacitance of 10.7 µF, derated to approximately 6.3 µF at 12 V DC bias (X7R characteristic).

**Second stage**: L2 (4.7 µH, 2.1 A rated) with C33 (22 µF), C32 (100 nF), and C34 (100 nF). C33 derated to ~8.8 µF at 12 V; C32/C34 provide high-frequency shunting at 90 nF each. C32 also decouples the V_P1 node.

The filter output is the local net V_P1, which feeds the OVP switch.

| Stage | L | C_eff at 12 V | f_c |
|-------|---|---------------|-----|
| 1 | 1 µH | 6.3 µF | 63 kHz |
| 2 | 4.7 µH | 9.0 µF | 24 kHz |

:::note[X7R DC bias derating]
X7R MLCC capacitance falls significantly with applied DC voltage. All filter capacitor values above are rated at 100 V; at 12 V operating voltage the effective capacitance is approximately 60–75% of the nominal value. Filter corner frequencies are calculated on the derated values. Measure actual capacitance at bring-up to verify.
:::

#### Stage 5 — Over-voltage protection

The OVP circuit disconnects VSC from V_P1 if the bus voltage rises above approximately 18.6 V. It protects the LP2951 wind transducer LDO (U13, 30 V absolute maximum input), which would be destroyed by a sustained overvoltage — a 24 V system accidentally connected to the NMEA 2000 backbone, for example. The LMR51610 buck converter (U2) is rated to 65 V and does not require this protection.

:::note[OVP origin]
The same OVP topology was first used in the MDD400, where it protects the INA219 current monitor. The INA219 is not present in the WTI400, but the LP2951 (30 V maximum) provides the same design constraint.
:::

Q2 (PMV240SPR) is a P-channel MOSFET in SOT-23, wired as a series high-side switch between V_P1 (source) and VSC (drain). Under normal conditions, R26 (22 kΩ) pulls Q2's gate to GNDREF, giving V_GS ≈ −12 V — Q2 is fully on.

Q3 (MMBTA56LT1G) is a PNP BJT in SOT-23. Its emitter connects to V_P1; its base connects to the midpoint of the voltage divider formed by R28 (2.4 kΩ, upper arm, V_P1 to base) and R27 (68 kΩ, lower arm, base to GNDREF). When V_P1 rises to the OVP threshold, the voltage at Q3's base rises proportionally, but the emitter (at V_P1) rises faster. Once the base-emitter voltage exceeds ~0.635 V, Q3 turns on; its collector current through R25 (4.7 Ω) raises Q2's gate toward V_P1, turning Q2 off and disconnecting VSC.

C28 (100 nF) in parallel with R27 adds a 6.8 ms hysteresis time constant, preventing oscillation at the trip threshold.

The OVP threshold is:

```
V_threshold = V_BE × (R27 + R28) / R28
            = 0.635 V × (68,000 + 2,400) / 2,400
            = 18.6 V  (nominal, 25 °C)
```

**OVP has been verified on both MDD400 and WTI400 prototypes — confirmed disconnect at 18.6 V.**

V_BE decreases with temperature at approximately 2 mV/°C, causing the threshold to drift:

| Temperature | V_BE | V_threshold | Margin vs 14.8 V max |
|-------------|------|-------------|----------------------|
| 25 °C | 635 mV | 18.6 V | +3.8 V |
| 50 °C | 585 mV | 17.2 V | +2.4 V |
| 85 °C | 515 mV | 15.1 V | +0.3 V |

At 85 °C the margin above the NMEA 2000 maximum charging voltage (14.8 V) is 300 mV — see Gaps.

**D3 (BZT52C7V5S)** is a 7.5 V Zener between Q2's source (V_P1) and gate. During a D11-clamped surge, V_P1 peaks at ~58 V while Q2's gate is held near 0 V by R26. Without D3, V_GS would reach −58 V against a ±20 V rating. D3 clamps V_GS to −7.5 V throughout the event.

#### Stage 6 — Secondary output clamp

D2 (PESD15VL1BA) is a 15 V / 200 W bidirectional TVS across VSC and GNDREF. It catches fast transients that pass through Q2 before the OVP comparator can respond, providing a final protective barrier for the downstream regulators.

### Performance review

#### Voltage drop budget (NET-S to VSC)

| Element | Drop at 65 mA | Drop at 115 mA peak |
|---------|--------------|---------------------|
| F1 (PTC cold, ~0.5 Ω) | 33 mV | 58 mV |
| D9 (Schottky V_F) | 380 mV | 430 mV |
| R43 (100 mΩ) | 7 mV | 12 mV |
| R39 (220 mΩ) | 14 mV | 25 mV |
| Q2 (R_DS(on) = 365 mΩ) | 24 mV | 42 mV |
| **Total** | **458 mV** | **567 mV** |

At NMEA 2000 minimum bus voltage (9.0 V): VSC_min ≈ 8.54 V. The LP2951 in the 8v4 variant (Raymarine) requires ≥ 8.95 V input; it will lose regulation at absolute minimum bus voltage under full transducer load. The 6v8 variant (B&G) passes with 1.35 V margin. This is an accepted design constraint — typical operating bus voltage is 12–13 V.

### Bring-up tests

1. **Reverse polarity**: apply −12 V to NET-S — pass if VSC remains at 0 V and no components become warm.
2. **Normal operation**: apply 12 V; measure VSC — pass if VSC ≈ 11.5 V.
3. **OVP trip**: slowly raise supply voltage — pass if VSC drops to 0 V between 17.5 V and 19.5 V with no oscillation at the threshold. *(Verified at 18.6 V on both MDD400 and WTI400 prototypes.)*
4. **OVP hysteresis**: after trip, slowly reduce supply voltage — pass if VSC recovers cleanly at a voltage measurably below the trip point.
5. **PTC fuse**: short VSC briefly — pass if F1 trips and the board powers up again without intervention after the fault clears.
6. **Bleed resistor**: remove supply; measure VSC discharge time — pass if VSC reaches < 1 V in approximately 4.4 s (R42 × 44 µF).
7. **EMI filter ripple**: scope VSC with a 65 mA load — pass if supply ripple is below the LMR51610 VIN ripple tolerance.
8. **Filter capacitance at bias**: measure C33, C36, C37, C39 at 12 V DC bias — record actual values and compare against derated filter corner frequency calculations.
9. **Surge**: apply an ISO 7637-2 Pulse 5b transient (or bench equivalent) to NET-S — pass if VSC remains stable and all components survive.

### Gaps & next version

**Verify at bring-up**

- **F1 thermal proximity to D11**: F1 is 7.7 mm from D11 — closer than recommended for a device that dissipates surge energy as heat. Run an IEC 61000-4-5 surge sequence and confirm F1 body temperature stays below 70 °C post-surge.
- **L2 cold-start inrush**: confirm peak current through L2 at power-on stays below the 2.6 A saturation rating.

**Next version**

- **OVP threshold margin at temperature**: at 85 °C the OVP threshold reaches 15.1 V — only 300 mV above the 14.8 V NMEA 2000 maximum charging voltage. Raising the margin requires either increasing the 25 °C trip point (by decreasing R28 or increasing R27, which shifts both thresholds together), or replacing the divider-only comparator with a voltage reference for temperature-stable operation.
- **L2/L3 body spacing**: current edge-to-edge gap is 1.95 mm — 0.05 mm short of the 2 mm keepout. Increase in next layout revision.
- **D11 sourcing for production**: qualify a Littelfuse or STMicro equivalent SM8S36CA for CE/ABYC certification — the current FUXINSEMI part is suitable for prototype but not preferred for production compliance documentation.

---

## Components

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| D11 | SM8S36CA | Bidirectional TVS, DO-218AB, 36 V / 6.6 kW — primary surge clamp | [FUXINSEMI SM8S36CA](https://www.fuxinsemi.com/cn/products/detail_200.html) |
| M1 | V33MLA1206NH | MOV, 1206, 75 V — slow high-energy transient absorber | [Littelfuse V33MLA1206NH](https://www.littelfuse.com/products/varistors/multilayer-varistors-mlv/v33mla1206nh.aspx) |
| F1 | 500 mA / 60 V | PTC resettable fuse, 1812 — series overload protection | [BHFUSE BSMD1812-050-60V](https://www.bhfuse.com/ProductDetail.aspx?id=BSMD1812-050-60V) |
| D9 | SS34 | Schottky, SMA, 40 V / 3 A — reverse-polarity protection | [MSKSEMI SS34-MS](https://www.msksemi.com/upload/MSKSEMI-SS34-MS_datasheet.pdf) |
| C41, C42 | 22 µF / 100 V | X7R 2220 — bulk input capacitors (44 µF combined) | [PSA FS55X226K101LRG](https://www.psa.com.tw/en/product_detail.php?lang=en&id=100) |
| R43 | 100 mΩ | 0603 — bulk capacitor ESR damping | — |
| R39 | 220 mΩ | 0603 — LC filter input damping | — |
| R42 | 100 kΩ | 0603 — bulk capacitor bleed/discharge | — |
| L3 | 1 µH | 3.5 A / 4.6 A Isat, 4×4 mm — first-stage EMI filter inductor | [cjiang FHD4012S-1R0MT](https://www.cjinductors.com/product/fhd4012s/) |
| C39 | 1 µF / 100 V | X7R 1206 — first-stage filter shunt cap | [Murata GRM31CR72A105KA01K](https://www.murata.com/en-us/products/productdetail?partno=GRM31CR72A105KA01K) |
| C36, C37 | 4.7 µF / 100 V | X7R 1206 — first-stage filter shunt caps (parallel) | [Murata GRM31CZ72A475KE11L](https://www.murata.com/en-us/products/productdetail?partno=GRM31CZ72A475KE11L) |
| L2 | 4.7 µH | 2.1 A / 2.6 A Isat, 4×4 mm — second-stage EMI filter inductor | [cjiang FHD4012S-4R7MT](https://www.cjinductors.com/product/fhd4012s/) |
| C33 | 22 µF / 100 V | X7R 2220 — second-stage filter bulk cap | [PSA FS55X226K101LRG](https://www.psa.com.tw/en/product_detail.php?lang=en&id=100) |
| C32, C34 | 100 nF / 100 V | X7R 0603 — second-stage filter HF shunt caps | [Murata GCJ188R72A104KA01D](https://www.murata.com/en-us/products/productdetail?partno=GCJ188R72A104KA01D) |
| Q2 | PMV240SPR | P-channel MOSFET, SOT-23, 100 V / 1.2 A — OVP series switch | [Nexperia PMV240SPR](https://assets.nexperia.com/documents/data-sheet/PMV240SPR.pdf) |
| Q3 | MMBTA56LT1G | PNP BJT, SOT-23, 80 V / 500 mA — OVP sense transistor | [onsemi MMBTA56LT1G](https://www.onsemi.com/pdf/datasheet/mmbta56lt1-d.pdf) |
| D3 | BZT52C7V5S | Zener, SOD-323, 7.5 V — Q2 gate-source clamp | [Diodes Inc BZT52C7V5S-7-F](https://www.diodes.com/assets/Datasheets/BZT52C.pdf) |
| R28 | 2.4 kΩ | 0603 — OVP divider upper arm (V_P1 to Q3 base) | — |
| R27 | 68 kΩ | 0603 — OVP divider lower arm (Q3 base to GNDREF) | — |
| C28 | 100 nF / 50 V | X7R 0603 — OVP hysteresis capacitor (parallel with R27) | — |
| R25 | 4.7 Ω | 0603 — Q3 collector resistor; limits Q2 gate current | — |
| R26 | 22 kΩ | 0603 — Q2 gate pull-down; holds Q2 on under normal conditions | — |
| D2 | PESD15VL1BA | Bidirectional TVS, SOD-323, 15 V / 200 W — secondary VSC clamp | [Nexperia PESD15VL1BA](https://assets.nexperia.com/documents/data-sheet/PESD15VL1BA.pdf) |

---

## References

- Nexperia, [*PMV240SPR P-channel MOSFET*](https://assets.nexperia.com/documents/data-sheet/PMV240SPR.pdf)
- Nexperia, [*PESD15VL1BA Bidirectional TVS*](https://assets.nexperia.com/documents/data-sheet/PESD15VL1BA.pdf)
- onsemi, [*MMBTA56LT1G PNP Bipolar Transistor*](https://www.onsemi.com/pdf/datasheet/mmbta56lt1-d.pdf)
- Littelfuse, [*V33MLA1206NH Multilayer Varistor*](https://www.littelfuse.com/products/varistors/multilayer-varistors-mlv/v33mla1206nh.aspx)
- BHFUSE, [*BSMD1812-050-60V PTC Resettable Fuse*](https://www.bhfuse.com/ProductDetail.aspx?id=BSMD1812-050-60V)
- cjiang, [*FHD4012S Series Power Inductors*](https://www.cjinductors.com/product/fhd4012s/)
- ISO, *ISO 7637-2:2011 — Road vehicles — Electrical disturbances from conduction and coupling — Part 2: Electrical transient conduction*
- NMEA / IEC, *IEC 61162-3 — Maritime navigation and radiocommunication equipment — NMEA 2000*
