---
title: CAN Bus Power
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/can_bus_power_0f210798.svg" alt="CAN bus power schematic" viewBox="20 20 249 81" />

:::note[Hardware version]
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

## Overview

The CAN bus power circuit takes the raw NMEA 2000 bus supply (NET-S, nominally 12 V) and delivers a clean, protected supply rail (VS+) to the rest of the MDD400. Six sequential stages condition the input: primary surge clamping, a resettable fuse and reverse-polarity protection, bulk capacitor buffering, a two-stage LC EMI filter, an over-voltage protection switch with current shunt, and a secondary output clamp.

---

## CAN Bus Power

### Functional specification and design objectives

The CAN bus power circuit must:

- withstand NMEA 2000 bus surge events up to ISO 7637-2 Pulse 5b without component damage;
- block reverse polarity passively — no firmware involvement;
- provide a resettable overload fuse that restores automatically after a fault clears;
- suppress conducted EMI on the supply rail before it reaches the downstream circuits;
- disconnect VS+ if bus voltage rises above the INA219 current monitor's safe operating range; and
- deliver VS+ within 800 mV of NET-S under nominal operating current.

### How it works

The NMEA 2000 bus delivers power on NET-S (positive) and NET-C (ground). The MDD400 is bus-powered: GNDREF is tied directly to NET-C at J2. NET-S is nominally 9–16 V DC under IEC 61162-3, with a maximum charging voltage of 14.8 V. Surge events — load-dump, cable plug/unplug, or a switching transient elsewhere on the backbone — can reach hundreds of volts for microseconds at J2.

#### Stage 1 — Primary surge clamping

Two devices in parallel absorb surge energy before it reaches any active circuitry.

D10 (SM8S36CA) is a bidirectional TVS in a DO-218AB package with a 36 V standoff voltage and 6.6 kW peak pulse power rating. It clamps fast transients — including ISO 7637-2 Pulse 5b — to approximately 58 V during an 8/20 µs surge. The DO-218AB footprint uses copper pads on all layers with multiple through-hole vias for thermal relief during repeated surge events.

M2 (V33MLA1206NH) is a 75 V metal oxide varistor in 1206. MOVs are slower than TVS diodes but absorb more energy across a longer pulse. M2 absorbs the leading edge of slow high-energy transients before D10 needs to clamp.

#### Stage 2 — Fuse and reverse-polarity protection

F1 (BSMD1812-050-60V) is a 500 mA / 60 V PTC resettable fuse in 1812. A PTC is preferred over a one-shot fuse for a marine instrument: a blown fuse mid-passage leaves the instrument dead with no means of recovery. After a fault clears, F1 cools and resets automatically. The 500 mA hold current at 25 °C gives comfortable margin over the 242 mA nominal operating current — accidental trips from normal operation are not possible.

D12 (SS34) is a 40 V / 3 A Schottky diode in SMA, wired in series on the high-side rail. It blocks reverse polarity passively: if NET-S and NET-C are swapped, D12 prevents current from flowing. The Schottky forward voltage (~380 mV at 242 mA) contributes to the voltage drop budget.

#### Stage 3 — Bulk capacitor buffer

C51 and C52 (2 × 22 µF / 100 V, X7R, 2220) provide 44 µF of bulk capacitance at the post-fuse rail, decoupling cable impedance and storing energy during the brief window while D10 is clamping a surge event.

R60 (100 mΩ) damps LC resonance between the bulk capacitor bank and the EMI filter inductors that follow. R53 (220 mΩ) damps the resonance between the bulk stage and the first filter inductor. Both carry load current but dissipate only a few tens of milliwatts at nominal operating current.

R54 (100 kΩ) bleeds C51/C52 to zero when power is removed, preventing VS+ from remaining live after the bus is disconnected.

#### Stage 4 — Two-stage LC EMI filter

A cascaded LC ladder suppresses conducted EMI on the supply rail. Two filter stages are used because a single stage would require impractically large inductors to achieve the same attenuation.

**First stage**: L4 (1 µH, 3.5 A rated) with C47 (1 µF) and C45 (4.7 µF) as shunt capacitors to GNDREF. The two shunt capacitors in parallel give a nominal capacitance of 5.7 µF, derated to approximately 3.7 µF at 12 V DC bias (X7R characteristic).

**Second stage**: L3 (4.7 µH, 2.1 A rated) with C43 (22 µF), C46 (4.7 µF), C44 (100 nF), and C42 (100 nF). The X7R bulk caps C43 and C46 derate from 26.7 µF combined to approximately 17.4 µF at 12 V; C44/C42 provide additional high-frequency shunting at 200 nF. The filter output is the local net V_P1, which feeds the OVP switch.

| Stage | L | C_eff at 12 V | f_c |
|-------|---|---------------|-----|
| 1 | 1 µH | 3.7 µF | 83 kHz |
| 2 | 4.7 µH | 17.6 µF | 17.5 kHz |

:::note[X7R DC bias derating]
X7R MLCC capacitance falls significantly with applied DC voltage. All filter capacitor values above are rated at 100 V; at 12 V operating voltage the effective capacitance is approximately 60–75% of the nominal value. Filter corner frequencies are calculated on the derated values. Measure actual capacitance at bring-up to verify.
:::

#### Stage 5 — Over-voltage protection and current shunt

The OVP circuit disconnects VS+ from V_P1 if the bus voltage rises above approximately 18.6 V. It protects the INA219 current monitor (U11, 40 V absolute maximum on the VS input): the 18.6 V trip point provides 21.4 V of margin below that limit. Without OVP, a sustained bus fault — a faulty charger or a wrong supply connected to the backbone — could drive the bus toward or beyond the ratings of downstream components. The LMR51610 buck converter (U1) is rated to 65 V and does not require this protection.

Q6 (PMV240SPR) is a P-channel MOSFET in SOT-23, wired as a series high-side switch between V_P1 (source) and the output node (drain). Under normal conditions, R44 (22 kΩ) pulls Q6's gate to GNDREF, giving V_GS ≈ −12 V — Q6 is fully on.

Q7 (MMBTA56LT1G) is a PNP BJT in SOT-23. Its emitter connects to V_P1; its base connects to the midpoint of the voltage divider formed by R46 (2.4 kΩ, upper arm, V_P1 to base) and R45 (68 kΩ, lower arm, base to GNDREF). When V_P1 rises to the OVP threshold, the divider raises the base potential, but the emitter (at V_P1) rises faster. Once the base-emitter voltage exceeds ~0.635 V, Q7 turns on; its collector current through R39 (4.7 Ω) raises Q6's gate toward V_P1, turning Q6 off and disconnecting VS+.

C41 (100 nF) in parallel with R45 adds noise immunity on the divider node, preventing false trips from conducted transients.

The OVP threshold is:

```
V_threshold = V_BE × (R45 + R46) / R46
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

**D8 (BZT52C7V5S)** is a 7.5 V Zener between Q6's source (V_P1) and gate. During a D10-clamped surge, V_P1 peaks at ~58 V while Q6's gate is held near 0 V by R44. Without D8, V_GS would reach −58 V against a ±20 V rating. D8 clamps V_GS to −7.5 V throughout the event.

**R33 (330 mΩ)** is the current-sense shunt on the VS+ output. It carries the full MDD400 load current; the voltage drop across R33 (80 mV at 242 mA nominal) is read by the INA219 (U11) on the I²C sensors sub-sheet.

#### Stage 6 — Secondary output clamp

D7 (PESD15VL1BA) is a 15 V / 200 W bidirectional TVS across VS+ and GNDREF. It catches fast transients that pass through Q6 before the OVP comparator can respond, providing a final protective barrier for the downstream circuits.

:::caution[D7 clamp margin — verify at bring-up]
D7's open-circuit clamp voltage is approximately 44 V — above the INA219's 40 V absolute maximum on the VS pin. Under a real transient, the clamped voltage will be lower because D7 conducts into the INA219 input impedance; the actual loaded clamp has not been quantitatively confirmed. Verify at bring-up — see Gaps.
:::

### Performance review

#### Voltage drop budget (NET-S to VS+)

| Element | Drop at 242 mA | Drop at 500 mA (PTC hold) |
|---------|----------------|--------------------------|
| F1 (PTC cold, ~0.5 Ω) | 121 mV | 250 mV |
| D12 (Schottky V_F) | ~380 mV | ~430 mV |
| R60 (100 mΩ) | 24 mV | 50 mV |
| R53 (220 mΩ) | 53 mV | 110 mV |
| Q6 (R_DS(on) = 365 mΩ) | 88 mV | 183 mV |
| R33 (330 mΩ) | 80 mV | 165 mV |
| **Total** | **~746 mV** | **~1188 mV** |

At NMEA 2000 minimum bus voltage (9.0 V): VS+_min ≈ 8.25 V at nominal load. Downstream regulators (LMR51610 rated to 65 V, LP5907 LDO) are unaffected by this margin. This is an accepted design constraint — typical operating bus voltage is 12–13 V.

### Bring-up tests

1. **Reverse polarity**: apply −12 V to NET-S — pass if VS+ remains at 0 V and no components become warm.
2. **Normal operation**: apply 12 V; measure VS+ — pass if VS+ ≈ 11.25 V (within the ~750 mV drop budget).
3. **OVP trip**: slowly raise supply voltage — pass if VS+ drops to 0 V between 17.5 V and 19.5 V with no oscillation at the threshold. *(Verified at 18.6 V on both MDD400 and WTI400 prototypes.)*
4. **OVP hysteresis**: after trip, slowly reduce supply voltage — pass if VS+ recovers cleanly at a voltage measurably below the trip point.
5. **PTC fuse**: short VS+ briefly — pass if F1 trips and the board powers up again without intervention after the fault clears.
6. **Bleed resistor**: remove supply; measure VS+ discharge time — pass if VS+ reaches < 1 V in approximately 4.4 s (R54 × 44 µF).
7. **EMI filter ripple**: scope VS+ with a 242 mA load — pass if supply ripple is below the LMR51610 VIN ripple tolerance.
8. **Filter capacitance at bias**: measure C43, C45, C46, C47 at 12 V DC bias — record actual values and compare against derated filter corner frequency calculations.
9. **D7 clamp under transient**: inject a fast transient onto VS+ representative of OVP turn-off spike or cable-coupled ESD; measure peak VS+ voltage — pass if VS+ stays below 40 V (INA219 VS abs max).
10. **INA219 current reading**: at 242 mA nominal load, confirm the INA219 reads within ±5% of the expected value (cross-check against a bench ammeter).

### Gaps & next version

**Verify at bring-up**

- **D7 clamp margin**: D7 (PESD15VL1BA) clamps at approximately 44 V open-circuit — above the INA219 VS absolute maximum of 40 V. The loaded clamp will be lower, but this has not been quantitatively confirmed. If the loaded clamp voltage exceeds 40 V under a representative transient, substitute D7 with a part with a lower standoff (e.g. PESD12VL1BA, ~34 V clamp at 200 W).
- **F1 thermal proximity to D10**: confirm F1 body temperature stays below 70 °C after an IEC 61000-4-5 surge sequence — D10 dissipates surge energy as heat and F1 is in the same vicinity.
- **L3 cold-start inrush**: confirm peak current through L3 at power-on stays below the 2.6 A saturation rating.

**Next version**

- **OVP threshold margin at temperature**: at 85 °C the OVP threshold reaches 15.1 V — only 300 mV above the 14.8 V NMEA 2000 maximum charging voltage. Raising the margin requires either increasing the 25 °C trip point (by decreasing R46 or increasing R45, which shifts both thresholds together), or replacing the divider-only comparator with a voltage reference for temperature-stable operation.
- **Over-temperature disconnect**: the OVP threshold drift with temperature is not a reliable thermal cutout — at typical bus voltages the threshold never drops to the operating voltage. A two-component board modification can add a genuine over-temperature disconnect: wire a normally-closed thermal switch (85 °C or 100 °C rated, e.g. Murata PKGS series) in series between R44 and GNDREF, and add a 100 kΩ pull-up from Q6's gate to its source (V_P1). Under normal conditions R44 dominates and Q6 remains on; when the switch opens on overtemperature, the pull-up holds V_GS ≈ 0 and Q6 turns off. Sensor placement is critical — the switch must be adjacent to the hottest component (Q6 or L3/L4).
- **R33 Kelvin routing**: verify that INA219 IN+ and IN− sense traces connect from the inner edges of R33's pads, separate from the main VS+ power traces, to minimise current measurement error.
- **D8 proximity**: tighten D8 to within 2 mm of Q6's gate/source (currently 3.0 mm) to reduce gate loop area.
- **D10 sourcing for production**: qualify a Littelfuse or STMicro equivalent SM8S36CA for CE/ABYC certification — the current FUXINSEMI part is suitable for prototype but not preferred for production compliance documentation.

---

## Components

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| D10 | SM8S36CA | Bidirectional TVS, DO-218AB, 36 V / 6.6 kW — primary surge clamp | [FUXINSEMI SM8S36CA](https://www.fuxinsemi.com/cn/products/detail_200.html) |
| M2 | V33MLA1206NH | MOV, 1206, 75 V — slow high-energy transient absorber | [Littelfuse V33MLA1206NH](https://www.littelfuse.com/products/varistors/multilayer-varistors-mlv/v33mla1206nh.aspx) |
| F1 | 500 mA / 60 V | PTC resettable fuse, 1812 — series overload protection | [BHFUSE BSMD1812-050-60V](https://www.bhfuse.com/ProductDetail.aspx?id=BSMD1812-050-60V) |
| D12 | SS34 | Schottky, SMA, 40 V / 3 A — reverse-polarity protection | [MSKSEMI SS34-MS](https://www.msksemi.com/upload/MSKSEMI-SS34-MS_datasheet.pdf) |
| C51, C52 | 22 µF / 100 V | X7R 2220 — bulk input capacitors (44 µF combined) | [PSA FS55X226K101LRG](https://www.psa.com.tw/en/product_detail.php?lang=en&id=100) |
| R60 | 100 mΩ | 0603 — bulk capacitor ESR damping | — |
| R53 | 220 mΩ | 0603 — LC filter input damping | — |
| R54 | 100 kΩ | 0603 — bulk capacitor bleed/discharge | — |
| L4 | 1 µH | 3.5 A / 4.6 A Isat, 4×4 mm — first-stage EMI filter inductor | [cjiang FHD4012S-1R0MT](https://www.cjinductors.com/product/fhd4012s/) |
| C47 | 1 µF / 100 V | X7R 1206 — first-stage filter shunt cap | [Murata GRM31CR72A105KA01K](https://www.murata.com/en-us/products/productdetail?partno=GRM31CR72A105KA01K) |
| C45 | 4.7 µF / 100 V | X7R 1206 — first-stage filter shunt cap (parallel with C47) | [Murata GRM31CZ72A475KE11L](https://www.murata.com/en-us/products/productdetail?partno=GRM31CZ72A475KE11L) |
| L3 | 4.7 µH | 2.1 A / 2.6 A Isat, 4×4 mm — second-stage EMI filter inductor | [cjiang FHD4012S-4R7MT](https://www.cjinductors.com/product/fhd4012s/) |
| C43 | 22 µF / 100 V | X7R 2220 — second-stage filter bulk cap | [PSA FS55X226K101LRG](https://www.psa.com.tw/en/product_detail.php?lang=en&id=100) |
| C46 | 4.7 µF / 100 V | X7R 1206 — second-stage filter shunt cap | [Murata GRM31CZ72A475KE11L](https://www.murata.com/en-us/products/productdetail?partno=GRM31CZ72A475KE11L) |
| C44, C42 | 100 nF / 100 V | X7R 0603 — second-stage filter HF shunt caps | [Murata GCJ188R72A104KA01D](https://www.murata.com/en-us/products/productdetail?partno=GCJ188R72A104KA01D) |
| Q6 | PMV240SPR | P-channel MOSFET, SOT-23, 100 V / 1.2 A — OVP series switch | [Nexperia PMV240SPR](https://assets.nexperia.com/documents/data-sheet/PMV240SPR.pdf) |
| Q7 | MMBTA56LT1G | PNP BJT, SOT-23, 80 V / 500 mA — OVP sense transistor | [onsemi MMBTA56LT1G](https://www.onsemi.com/pdf/datasheet/mmbta56lt1-d.pdf) |
| D8 | BZT52C7V5S | Zener, SOD-323, 7.5 V — Q6 gate-source clamp | [Diodes Inc BZT52C7V5S-7-F](https://www.diodes.com/assets/Datasheets/BZT52C.pdf) |
| R46 | 2.4 kΩ | 0603 — OVP divider upper arm (V_P1 to Q7 base) | — |
| R45 | 68 kΩ | 0603 — OVP divider lower arm (Q7 base to GNDREF) | — |
| C41 | 100 nF / 50 V | X7R 0603 — OVP divider noise filter | — |
| R39 | 4.7 Ω | 0603 — Q7 collector resistor; limits Q6 gate current | — |
| R44 | 22 kΩ | 0603 — Q6 gate pull-down; holds Q6 on under normal conditions | — |
| R33 | 330 mΩ | 0603 — VS+ current-sense shunt (feeds INA219 U11) | — |
| D7 | PESD15VL1BA | Bidirectional TVS, SOD-323, 15 V / 200 W — secondary VS+ clamp | [Nexperia PESD15VL1BA](https://assets.nexperia.com/documents/data-sheet/PESD15VL1BA.pdf) |

---

## References

- Nexperia, [*PMV240SPR P-channel MOSFET*](https://assets.nexperia.com/documents/data-sheet/PMV240SPR.pdf)
- Nexperia, [*PESD15VL1BA Bidirectional TVS*](https://assets.nexperia.com/documents/data-sheet/PESD15VL1BA.pdf)
- onsemi, [*MMBTA56LT1G PNP Bipolar Transistor*](https://www.onsemi.com/pdf/datasheet/mmbta56lt1-d.pdf)
- Littelfuse, [*V33MLA1206NH Multilayer Varistor*](https://www.littelfuse.com/products/varistors/multilayer-varistors-mlv/v33mla1206nh.aspx)
- BHFUSE, [*BSMD1812-050-60V PTC Resettable Fuse*](https://www.bhfuse.com/ProductDetail.aspx?id=BSMD1812-050-60V)
- cjiang, [*FHD4012S Series Power Inductors*](https://www.cjinductors.com/product/fhd4012s/)
- Texas Instruments, [*INA219 Zero-Drift Bidirectional Current/Power Monitor*](https://www.ti.com/lit/ds/symlink/ina219.pdf)
- ISO, *ISO 7637-2:2011 — Road vehicles — Electrical disturbances from conduction and coupling — Part 2: Electrical transient conduction*
- NMEA / IEC, *IEC 61162-3 — Maritime navigation and radiocommunication equipment — NMEA 2000*
