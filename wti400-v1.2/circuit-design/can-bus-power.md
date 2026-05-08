---
title: CAN Bus Power
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel Sunny Spells"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/wti400-v1.2/can_bus_power_0819808b.svg" alt="CAN Bus Power schematic" />

:::note Hardware version
WTI400 **v1.2** — In service — installed on test vessel Sunny Spells
:::

## Components

| Ref | Value | Description | Datasheet |
|-----|-------|-------------|-----------|
| C28 | 100 nF / 50 V | X7R MLCC 0603 — OVP divider hysteresis capacitor | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C32 | 100 nF / 100 V | X7R MLCC 0603 — HF decoupling at V_P1 node | [Murata GCJ188R72A104KA01D](https://www.murata.com/en-us/products/productdetail?partno=GCJ188R72A104KA01D) |
| C33 | 22 µF / 100 V | X7R MLCC 2220 — second-stage EMI filter bulk cap | [PSA FS55X226K101LRG](https://www.psa.com.tw/en/product_detail.php?lang=en&id=100) |
| C34 | 100 nF / 100 V | X7R MLCC 0603 — second-stage EMI filter HF decoupling | [Murata GCJ188R72A104KA01D](https://www.murata.com/en-us/products/productdetail?partno=GCJ188R72A104KA01D) |
| C36 | 4.7 µF / 100 V | X7R MLCC 1206 — first-stage EMI filter shunt cap | [Murata GRM31CZ72A475KE11L](https://www.murata.com/en-us/products/productdetail?partno=GRM31CZ72A475KE11L) |
| C37 | 4.7 µF / 100 V | X7R MLCC 1206 — first-stage EMI filter shunt cap (parallel with C36) | [Murata GRM31CZ72A475KE11L](https://www.murata.com/en-us/products/productdetail?partno=GRM31CZ72A475KE11L) |
| C39 | 1 µF / 100 V | X7R MLCC 1206 — first-stage EMI filter shunt cap | [Murata GRM31CR72A105KA01K](https://www.murata.com/en-us/products/productdetail?partno=GRM31CR72A105KA01K) |
| C41 | 22 µF / 100 V | X7R MLCC 2220 — bulk input cap, post-fuse surge storage | [PSA FS55X226K101LRG](https://www.psa.com.tw/en/product_detail.php?lang=en&id=100) |
| C42 | 22 µF / 100 V | X7R MLCC 2220 — bulk input cap (parallel with C41) | [PSA FS55X226K101LRG](https://www.psa.com.tw/en/product_detail.php?lang=en&id=100) |
| D2 | PESD15VL1BA | 15 V / 200 W bidirectional TVS SOD-323 — secondary VSC clamp | [Nexperia PESD15VL1BA](https://assets.nexperia.com/documents/data-sheet/PESD15VL1BA.pdf) |
| D3 | BZT52C7V5S | 7.5 V / 200 mW Zener SOD-323 — Q2 gate-source protection | [Diodes Inc BZT52C7V5S-7-F](https://www.diodes.com/assets/Datasheets/BZT52C.pdf) |
| D9 | SS34 | 40 V / 3 A Schottky SMA — reverse-polarity protection | [MSKSEMI SS34-MS](https://www.msksemi.com/upload/MSKSEMI-SS34-MS_datasheet.pdf) |
| D11 | SM8S36CA | 36 V / 6.6 kW bidirectional TVS DO-218AB — primary surge clamp | [FUXINSEMI SM8S36CA](https://www.fuxinsemi.com/cn/products/detail_200.html) |
| F1 | 500 mA / 60 V | PTC resettable fuse 1812 — series overload protection | [BHFUSE BSMD1812-050-60V](https://www.bhfuse.com/ProductDetail.aspx?id=BSMD1812-050-60V) |
| L2 | 4.7 µH | 2.1 A / 2.6 A Isat power inductor 4×4 mm — second-stage EMI filter | [cjiang FHD4012S-4R7MT](https://www.cjinductors.com/product/fhd4012s/) |
| L3 | 1 µH | 3.5 A / 4.6 A Isat power inductor 4×4 mm — first-stage EMI filter | [cjiang FHD4012S-1R0MT](https://www.cjinductors.com/product/fhd4012s/) |
| M1 | V33MLA1206NH | 75 V MOV 1206 — parallel surge energy absorber | [Littelfuse V33MLA1206NH](https://www.littelfuse.com/products/varistors/multilayer-varistors-mlv/v33mla1206nh.aspx) |
| Q2 | PMV240SPR | 100 V / 1.2 A P-channel MOSFET SOT-23 — OVP series switch | [Nexperia PMV240SPR](https://assets.nexperia.com/documents/data-sheet/PMV240SPR.pdf) |
| Q3 | MMBTA56LT1G | 80 V / 500 mA PNP BJT SOT-23 — OVP sense transistor | [onsemi MMBTA56LT1G](https://www.onsemi.com/pdf/datasheet/mmbta56lt1-d.pdf) |
| R25 | 4.7 Ω | 0603 — Q3 collector series resistor; limits Q2 gate current | [YAGEO RC0603 series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R26 | 22 kΩ | 0603 — Q2 gate pull-down; holds Q2 ON normally | [YAGEO RC0603 series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R27 | 68 kΩ | 0603 — OVP divider lower arm (Q3 base to GNDREF) | [YAGEO RC0603 series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R28 | 2.4 kΩ | 0603 — OVP divider upper arm (V_P1 to Q3 base) | [YAGEO RC0603 series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R39 | 220 mΩ | 0603 — LC filter input damping resistor | [YAGEO RC0603 series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R42 | 100 kΩ | 0603 — bulk capacitor bleed/discharge resistor | [YAGEO RC0603 series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R43 | 100 mΩ | 0603 — bulk capacitor ESR damping resistor | [YAGEO RC0603 series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |

## How It Works

Raw power from the NMEA 2000 CAN bus arrives on the **NET-S** net from connector J2. This circuit processes it through six sequential stages before delivering a clean, protected supply on the **VSC** global net to the rest of the WTI400 board.

**Stage 1 — Primary surge clamping.** D11 (SM8S36CA bidirectional TVS, 36 V standoff, 6.6 kW peak) is placed across the raw input. It absorbs load-dump and fast transients — ISO 7637-2 Pulse 5b and similar — clamping the rail to 58.1 V during an 8/20 µs surge. M1 (V33MLA1206NH MOV, 75 V) is in parallel, absorbing slower high-energy transients before D11 needs to clamp.

**Stage 2 — Fuse and reverse-polarity protection.** F1 (BSMD1812-050-60V, 500 mA PTC) provides resettable overload protection. It is self-resetting — after a fault clears, the board recovers without manual intervention. D9 (SS34 Schottky) follows F1 in the high-side rail, blocking reverse polarity passively.

**Stage 3 — Bulk capacitor stage with ESR damping.** C41 and C42 (2 × 22 µF / 100 V, 44 µF combined) decouple the upstream cable impedance and store energy clamped by D11 during surges. R43 (100 mΩ) damps LC resonance within the bulk stage. R39 (220 mΩ) damps the LC resonance between the bulk stage and the EMI filter input — both are passive energy-absorbing resistors, not sense elements. R42 (100 kΩ) bleeds the bulk capacitors to zero when power is removed.

**Stage 4 — Two-stage LC EMI filter.** A cascaded ladder network provides broadband conducted EMI suppression. The first stage uses L3 (1 µH) with C39/C36/C37 as shunt capacitors; the second stage uses L2 (4.7 µH) with C33/C34/C32. The filter output is the local net **V_P1**, which feeds the OVP switch.

**Stage 5 — Over-voltage protection switch.** Q2 (PMV240SPR P-channel MOSFET) is the series power switch between V_P1 (source) and VSC (drain). Normally, R26 (22 kΩ) pulls Q2's gate to ground, giving V_GS ≈ −12 V — Q2 is fully ON.

The OVP comparator monitors V_P1 through the voltage divider R28 (2.4 kΩ, upper arm) and R27 (68 kΩ, lower arm), with C28 (100 nF) in parallel with R27 to provide a 6.8 ms hysteresis time constant. Q3 (MMBTA56LT1G PNP), with its emitter at V_P1 and base at the divider output, turns ON when the base-emitter voltage magnitude exceeds ~0.635 V — corresponding to V_P1 ≈ 18.6 V. When Q3 turns ON, its collector current through R25 (4.7 Ω) raises Q2's gate toward V_P1, turning Q2 OFF and disconnecting VSC from the input.

D3 (BZT52C7V5S, 7.5 V Zener) connects between Q2's source (V_P1) and Q2's gate, clamping V_GS to −7.5 V at all times. This is a gate-source protection device: PMV240SPR's V_GS rating is ±20 V, and during a surge event D11 may momentarily allow V_P1 to reach 58 V before clamping. Without D3, Q2's gate oxide would be exposed to −58 V in that window. D3 limits the stress to −7.5 V throughout.

**Stage 6 — Secondary VSC output clamp.** D2 (PESD15VL1BA, 15 V standoff, 200 W bidirectional TVS) across VSC and GNDREF catches any fast transients that pass through Q2 before it can respond.

## Design Rationale

**Three-level surge architecture.** M1 (MOV) absorbs the leading edge of slow high-energy transients; D11 (TVS) handles fast transients and residual surge energy; D2 (output TVS) catches anything that reaches the downstream supply rail. This mirrors the approach used in the MDD400 CAN bus power circuit, where the same topology proved effective against NMEA 2000 network transients in an operational installation.

**Damping resistor placement.** R43 (100 mΩ) and R39 (220 mΩ) suppress LC resonance between the bulk capacitor bank and the EMI filter. Without them, the undamped series-resonance between the bulk caps and the filter inductors would produce a low-frequency peak in the filter's impedance, reducing attenuation near the resonant frequency and creating a potential instability in the supply. The 320 mΩ combined series resistance damps the RLC network with ζ ≈ 0.18 (slightly underdamped), which is sufficient to suppress sustained oscillation while keeping resistive losses negligible at the 65 mA operating current.

**D3 gate protection topology.** In a standard P-channel OVP switch, the gate-source voltage during a surge event is limited only by R26's pull-down current and the gate trace parasitics. During D11 clamping (V_P1 peak ≈ 58 V), Q2's gate would be held near 0 V by R26 while its source rises to 58 V — V_GS = −58 V, 2.9× over the ±20 V rating. D3 limits this to −7.5 V in a tight clamp loop with minimal trace inductance between D3 and Q2's gate/source pins.

**OVP threshold and temperature trade-off.** Setting the threshold via a plain resistive divider (without a separate voltage reference) makes the threshold temperature-sensitive at −58.7 mV/°C. At 85 °C ambient, the threshold falls to 15.1 V — 300 mV above the 14.8 V NMEA 2000 maximum charging voltage. This margin is acceptable for a board rated to 70 °C, but a future version should increase R28 from 2.4 kΩ to 2.7 kΩ to raise the 85 °C threshold to 17.4 V.

**F1 self-resetting selection.** A PTC fuse is preferred over a one-shot fuse for a marine instrument. A blown fuse on a sailing passage leaves the instrument dead; a self-resetting device restores operation after the overcurrent condition is removed. The 500 mA hold rating at 25 °C gives a 4× margin over the 65 mA continuous operating current at 85 °C, making accidental trips from normal operation effectively impossible.

## PCB Layout

The can_bus_power circuit occupies the left column of the WTI400 PCB (x ≈ 70–95 mm), with the input protection components (D11, F1, D9) at the bottom and the OVP switch (Q2, Q3, D3) at the top. Power flows bottom-to-top on the schematic; on the PCB this corresponds to a power flow from the connector J2 (right side of the column) up through the protection chain.

The main supply rail uses named copper pour zones throughout rather than routed traces — appropriate for a < 200 mA load. VSC runs 0.6 mm on B.Cu for 45.8 mm as a dedicated backbone trace, fed front-to-back via vias at Q2's drain.

| Requirement | Status | Notes |
|---|---|---|
| D11 close to J2 connector | Accepted constraint | J2 is soldered directly; mounting flange precludes D11 closer than 16.1 mm. M1 (8.5 mm from J2) provides earlier slow-transient absorption. |
| D11 thermal pad with inner-layer vias | Met | DO-218AB footprint uses *.Cu pads across all copper layers; 4 × 1 mm thru-hole vias in footprint |
| M1 adjacent to D11 with short GNDREF return | Met | M1 at 7.9 mm from D11; both return to solid F.Cu GNDREF pour |
| F1 thermally isolated from D11 | Partial | F1 is 7.7 mm from D11 — closer than recommended. Bench surge qualification required; see Verification section below |
| L2/L3 inductor body keepout ≥ 2 mm | Partial | Edge-to-edge gap = 1.95 mm (0.05 mm short). Fix in V2.0. |
| R43/R39 power rail trace | Met | Both pads within copper pour zones; rail carries < 200 mA |
| D3 close to Q2 gate/source | Met | D3 is 3.0 mm from Q2; tight gate-clamp loop |
| D2 close to Q2 drain | Met | D2 is 2.7 mm from Q2 |

## Design Calculations

### OVP Threshold

The OVP threshold is set by the resistive divider and Q3's base-emitter onset voltage:

```
V_threshold = V_BE(onset) × (R27 + R28) / R28
            = 0.635 V × (68 000 + 2 400) / 2 400
            = 18.6 V  (nominal, 25 °C)
```

The threshold is temperature-sensitive at −58.7 mV/°C:

| Ambient temperature | V_threshold | Margin vs 14.8 V NMEA max |
|---|---|---|
| 25 °C | 18.6 V | +3.8 V |
| 50 °C | 17.2 V | +2.4 V |
| 85 °C | 15.1 V | +0.3 V |
| ~90 °C | 14.8 V | 0 V (crossover) |

### EMI Filter Corner Frequencies

Accounting for X7R DC bias derating at 12 V:

| Capacitor | Nominal | Effective at 12 V |
|---|---|---|
| C33 (22 µF / 100 V, 2220) | 22 µF | ~8.8 µF |
| C36, C37 (4.7 µF / 100 V, 1206) | 4.7 µF | ~2.8 µF each |
| C39 (1 µF / 100 V, 1206) | 1 µF | ~0.7 µF |
| C32, C34 (100 nF / 100 V, 0603) | 100 nF | ~90 nF each |

```
Stage 1 (L3 = 1 µH, C_eff = 6.3 µF):   f_c1 = 1/(2π√(LC)) = 63 kHz
Stage 2 (L2 = 4.7 µH, C_eff = 9.0 µF): f_c2 = 1/(2π√(LC)) = 24 kHz

Theoretical attenuation at 1 MHz:  −112 dB combined
Practical attenuation at 1 MHz:    ~−60 to −80 dB (parasitics-limited)
```

### Voltage Drop Budget (NET-S to VSC)

| Element | Drop at 65 mA | Drop at 115 mA peak |
|---|---|---|
| F1 (PTC cold, ~0.5 Ω) | 33 mV | 58 mV |
| D9 SS34 (forward voltage) | 380 mV | 430 mV |
| R43 (100 mΩ) | 7 mV | 12 mV |
| R39 (220 mΩ) | 14 mV | 25 mV |
| Q2 (R_DS(on) = 365 mΩ) | 24 mV | 42 mV |
| **Total** | **458 mV** | **567 mV** |

At NMEA 2000 minimum bus voltage (9.0 V): **VSC_min ≈ 8.54 V**. The LP2951 in the 8v4 variant (Raymarine) requires ~8.95 V minimum input; it will lose regulation at absolute minimum bus voltage under full transducer load. The 6v8 variant (B&G) passes with 1.35 V margin. This is an accepted design constraint — typical bus voltage is 12–13 V.

:::caution Verification required — Prototype

**Verify during bring-up:**
- OVP trip point: confirm VSC disconnects at 18.0–19.5 V with no oscillation at threshold
- F1 thermal coupling: run IEC 61000-4-5 surge sequence; confirm F1 body temperature < 70 °C post-surge
- MLCC capacitance at 12 V DC bias: measure C33, C36, C37, C39 to verify filter corner frequencies
- L2 cold-start inrush: SPICE simulation before first power-on; confirm I_peak(L2) ≤ 2.6 A

**For next version (V2.0):**
- Increase R28 to 2.7 kΩ: raises OVP threshold at 85 °C from 15.1 V to 17.4 V, providing 2.6 V margin vs NMEA max charging voltage
- Increase L2/L3 spacing by 0.1 mm to satisfy 2 mm body-edge keepout
- Replace D11 with Littelfuse or STMicro qualified SM8S36CA equivalent for CE/ABYC production
:::

## References

| Item | Source |
|---|---|
| PMV240SPR datasheet | [Nexperia](https://assets.nexperia.com/documents/data-sheet/PMV240SPR.pdf) |
| MMBTA56LT1G datasheet | [onsemi](https://www.onsemi.com/pdf/datasheet/mmbta56lt1-d.pdf) |
| SS34-MS datasheet | [MSKSEMI](https://www.msksemi.com/upload/MSKSEMI-SS34-MS_datasheet.pdf) |
| BSMD1812-050-60V datasheet | [BHFUSE](https://www.bhfuse.com/ProductDetail.aspx?id=BSMD1812-050-60V) |
| FHD4012S series datasheet | [cjiang](https://www.cjinductors.com/product/fhd4012s/) |
| PESD15VL1BA datasheet | [Nexperia](https://assets.nexperia.com/documents/data-sheet/PESD15VL1BA.pdf) |
| BZT52C7V5S-7-F datasheet | [Diodes Inc](https://www.diodes.com/assets/Datasheets/BZT52C.pdf) |
| SM8S36CA datasheet | [FUXINSEMI](https://www.fuxinsemi.com/cn/products/detail_200.html) |
| V33MLA1206NH datasheet | [Littelfuse](https://www.littelfuse.com/products/varistors/multilayer-varistors-mlv/v33mla1206nh.aspx) |
| NMEA 2000 Corrigendum 3 §10.4 | Bus voltage range, surge and polarity protection requirements |
| IEC 60945:2002 | Maritime navigation equipment — general EMC requirements |
