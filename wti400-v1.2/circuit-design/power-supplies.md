---
title: Power Supplies
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel Sunny Spells"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/wti400-v1.2/power_supplies_a4e708c6.svg" alt="Power Supplies schematic" />

:::note Hardware version
WTI400 **v1.2** — In service — installed on test vessel Sunny Spells
:::

## Components

| Ref | Value | Description | Datasheet |
|-----|-------|-------------|-----------|
| U2 | LMR51610XDBVR | Synchronous buck converter, 4–65 V in, 1 A, SOT-23-6, 400 kHz — VCC 3.3 V rail | [TI LMR51610](https://www.ti.com/lit/ds/symlink/lmr51610.pdf) |
| U13 | LP2951-50DR | Adjustable LDO, 100 mA, 30 V max, SOIC-8 — wind transducer supply (VAS) | [TI LP2951](http://www.ti.com/lit/ds/symlink/lp2951.pdf) |
| L1 | FNR5040S220MT | Shielded power inductor, 22 µH, 1.6 A Irms, 1.8 A Isat, DCR 168 mΩ, 5×5 mm | [LCSC C167971](https://www.lcsc.com/datasheet/C167971.pdf) |
| D16 | RBR3MM60BTR | Schottky diode, 60 V, 3 A, SOD-123FL — LP2951 Vout-to-Vin protection (anode=VAS, cathode=VSC; reverse-biased in normal operation) | [ROHM RBR3MM60BTR](https://fscdn.rohm.com/en/products/databook/datasheet/discrete/diode/schottky_barrier/rbr3mm60btr-e.pdf) |
| FB1, FB2 | BLM31KN601SN1L | Ferrite bead, 600 Ω @ 100 MHz, 80 mΩ DCR, 1206 — FB1: 3v3→VCC boundary; FB2: VSD→VSC LDO input filter | [Murata BLM31KN601SN1L](https://www.murata.com/en-us/api/pdfdownloadapi?cate=luBLM&partno=BLM31KN601SN1L) |
| JP1 | PZ254V-11-03P | 3-pin 2.54 mm THT header — wind transducer voltage select (6.8 V / 8.4 V) | — |
| C2 | 10 µF / 50 V X7R 1210 | VSD input bulk capacitor for buck converter | [Murata GRM32ER71H106KA12L](https://www.lcsc.com/datasheet/C77102.pdf) |
| C4 | 100 nF / 50 V X7R 0603 | VSD high-frequency input bypass | — |
| C9 | 1 pF / 100 V C0G 0603 | Feedback feedforward capacitor across R2 (3v3 → FB pin) | — |
| C10 | 1 nF / 50 V C0G 0603 | SW-node snubber capacitor — **DNP** | — |
| C11 | 100 nF / 50 V X7R 0603 | Bootstrap capacitor (CB pin → SW node) | — |
| C13 | 100 pF / 50 V C0G 0603 | 3v3 rail output bypass | — |
| C14, C15 | 10 µF / 50 V X7R 1210 | 3v3 output bulk capacitors — placed symmetrically flanking L1 | [Murata GRM32ER71H106KA12L](https://www.lcsc.com/datasheet/C77102.pdf) |
| C48 | 100 pF / 50 V C0G 0603 | LP2951 feedforward capacitor CFF (OUT→FB pin) | — |
| C51 | 4.7 µF / 25 V X7R 0805 | LP2951 input supply (VSC) bypass | — |
| C52 | 10 µF / 25 V X7R 0805 | VAS output bypass — sole LP2951 output capacitor | — |
| R1 | 32 kΩ 0603 ±0.1% | VCC feedback lower divider | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R2 | 100 kΩ 0603 ±1% | VCC feedback upper divider | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R13 | 22 Ω 0603 | SW-node snubber resistor — **DNP** | — |
| R55 | 39 kΩ 0603 | LP2951 SHUTDOWN pull-up to VCC — holds VAS off at boot | — |
| R65 | 10 kΩ 0603 | LP2951 ERROR pull-up to VCC — feeds WND_ERR to ESP32 | — |
| R72 | 120 kΩ 0603 | LP2951 upper feedback divider | — |
| R74 | 39 kΩ 0603 | VAS output bleed — discharges output caps on disable | — |
| R77 | 6.2 kΩ 0603 | LP2951 lower feedback shunt (B&G / 6.8 V setpoint) | — |
| R78 | 20 kΩ 0603 | LP2951 lower feedback main resistor | — |
| R79 | 0 Ω 0805 | Factory voltage-select link (alternative to JP1) — **DNP default** | — |
| TP1 | — | GNDREF test point — **DNP** | — |

## How It Works

The power supplies sheet implements two conversion stages and a set of domain boundary filters serving three distinct power rails: VCC (3.3 V logic), VAS (adjustable wind transducer supply), and VSD (unregulated CAN bus rail, sourced from the `can_bus_power` sheet).

**VCC 3.3 V buck converter.** U2 (LMR51610XDBVR) is a 400 kHz synchronous buck converter powered from VSD (nominally 12 V). C2 (10 µF bulk) and C4 (100 nF HF bypass) decouple the VIN pin. The switching node (SW) is connected to L1 (FNR5040S220MT, 22 µH) via a wide copper pour. C14 and C15 (each 10 µF X7R 1210) form the output filter, placed symmetrically either side of L1. The output voltage is set by R2 (100 kΩ) and R1 (32 kΩ): Vout = 0.8 × (1 + 100/32) = 3.300 V exactly. C9 (1 pF C0G) is the feedforward capacitor across R2; C11 (100 nF) is the bootstrap capacitor from CB to SW. The regulated 3v3 net passes through FB1 (BLM31KN601SN1L) before becoming VCC in the digital domain. A DNP snubber (R13 + C10) is available at the SW node edge for post-bring-up population if ringing is observed.

**VAS wind transducer LDO.** U13 (LP2951-50DR) is a 100 mA adjustable LDO powered from VSC — VSD filtered through FB2 (BLM31KN601SN1L). The output voltage is set by R72 (120 kΩ upper) with either R78 alone (20 kΩ) or R78 + R77 (26.2 kΩ total) as the lower leg, selectable via JP1 or assembly link R79. This produces either 8.65 V (Raymarine / Legacy Serial Protocol instruments) or 6.89 V (B&G wind instruments). C52 (10 µF X7R 0805) is the sole VAS output capacitor. C48 (100 pF C0G) is the TI-recommended feedforward capacitor (CFF) from OUT to FB, improving transient response and PSRR — particularly important at large output voltages where feedback divider ratios are high. D16 (RBR3MM60BTR) is wired anode = VAS, cathode = VSC as a Vout-to-Vin protection diode: normally reverse-biased, it prevents output capacitor charge from back-driving the LP2951 during power-down. It is not in the VAS load current path and does not affect the output setpoint.

**Firmware control and fault handling.** The LP2951 SHUTDOWN pin is active-HIGH (regulator off when SHUTDOWN is high). R55 (39 kΩ) pulls SHUTDOWN to VCC at boot, holding VAS off until the ESP32 is ready. After boot completes, the ESP32 drives WND_EN low, enabling VAS. If no transducer signal is detected on the analog inputs, the firmware releases WND_EN — R55 returns SHUTDOWN high, VAS disables, and an error code is flashed on the RGB status LED. The LP2951 ERROR pin (open-drain, active-low) is monitored via WND_ERR through R65 (10 kΩ pull-up). On an overcurrent or output undervoltage fault, the LP2951 asserts ERROR → WND_ERR goes low → firmware releases WND_EN → VAS shuts down → RGB LED flashes fault code.

**Domain boundaries.** FB1 is the sole path between the SMPS 3v3 copper and the VCC digital domain — no bypass connections exist across it. FB2 similarly isolates VSD from VSC at the LDO input. R74 (39 kΩ) provides a gentle bleed on VAS, ensuring the rail discharges cleanly when the LDO is disabled.

## Design Rationale

**Synchronous buck at 400 kHz.** The LMR51610 integrates both MOSFETs, eliminating an external catch diode and improving light-load efficiency — relevant during MCU sleep states when the WTI400 idles between NMEA 2000 transmissions. The 22 µH inductor was selected to keep ripple current at 27–29% of peak load across the 12–14.8 V VSD range, giving comfortable CCM headroom without an oversized inductor. Peak inductor current (426 mA at 14.8 V, 280 mA load) reaches only 24% of the 1.8 A Isat — the design has no saturation risk.

**LP2951 adjustable LDO for dual-transducer support.** The WTI400 must support both Raymarine/Legacy Serial Protocol instruments (~8 V, ≤25 mA) and B&G 213 instruments (nominally 6.5 V, 25–30 mA). A single adjustable LDO with a two-position feedback divider (JP1 or assembly link R79) avoids stocking two board variants. JP1 allows field reconfiguration; R79 allows factory-fixed builds for known transducer installations. The three assembly configurations are: JP1 fitted + R79 DNP (field-configurable); R79 fitted + JP1 DNP (factory 8.65 V / Raymarine); both DNP (factory 6.89 V / B&G).

**LP2951 new chip (CSO: RFB) and C52 ESR.** TI ships LP2951-50DR from two die revisions. The new chip (CSO: RFB) specifies an output capacitor ESR window of 0–2 Ω and explicitly recommends X7R MLCCs. C52 (10 µF X7R 0805, ESR ~5–50 mΩ) meets this requirement. The legacy chip (CSO: SHE) requires 0.5–10 Ω ESR and is incompatible with C52 — a tantalum or a series resistor would be needed. The CSO code must be confirmed on the procurement reel label before U13 is populated.

## PCB Layout

C14 and C15 are placed symmetrically on opposite sides of L1, each 4.12 mm from the inductor centre, at the same Y coordinate. This flanking arrangement minimises the output ripple current loop area — current flows from L1 pad directly into each cap without a long detour — and the caps provide radiated EMI shielding around the inductor body. The SW node is implemented as a filled copper pour (priority 50) running from the U2 SW pin to the L1 input pad; no narrow routed trace exists on this path. The full-board In1.Cu GNDREF plane (35 µm, 1 oz) underlies all power supply components, with 132 GNDREF vias (0.3 mm drill) stitching the SMPS F.Cu fills to the inner plane.

| Requirement | Status | Evidence |
|-------------|--------|----------|
| C4 (100 nF) within 1–2 mm of U2 VIN | Met | 2.62 mm centre-to-centre |
| SW node as copper pour, zero routed segments | Met | Pour priority 50, bbox x:76–80, y:51–89 mm |
| C11 (BST) adjacent to CB and SW pins | Met | 2.56 mm from U2 |
| C14, C15 flanking L1 symmetrically | Met | 4.12 mm each side — intentional EMI layout |
| FB1 sole bridge between 3v3 and VCC copper | Met | No bypass copper identified |
| FB2 sole bridge between VSD and VSC | Met | No bypass copper identified |
| VAS copper isolated from VCC and VSD | Met | VAS routed traces only; D16 sole VAS–VSC connection (protection, reverse-biased) |
| 26 GNDREF vias in LDO region | Met | x:68–90, y:108–125 mm |
| U13 thermal via array under package | Partial | 26 vias in LDO region; concentration directly under SOIC-8 body not confirmed — see Verification |

## Design Calculations

### VCC 3.3 V Rail

| Parameter | Value | Condition |
|-----------|-------|-----------|
| Output voltage | 3.300 V | 0.8 × (1 + 100 kΩ/32 kΩ) |
| Peak inductor current | 416 mA @ 12 V / 426 mA @ 14.8 V | Iout = 280 mA |
| Peak IL as % of Isat (1.8 A) | 23–24% | Healthy margin — no saturation risk |
| Estimated output ripple | 4–8 mV pp | 20 µF Ceff, nominal X7R ESR; verify at bench |
| U2 IC power dissipation | ~150 mW | Scaled from MDD400 V2.9 WEBENCH at 280 mA |
| U2 Tj @ 85°C ambient | 107.2°C | θJA = 148 °C/W (datasheet, DBV package) — 17.8°C margin |

### VAS Wind Transducer Rail

| Parameter | Value | Condition |
|-----------|-------|-----------|
| VAS setpoint — Raymarine (8v4) | 8.645 V | R_lower = R78 = 20 kΩ |
| VAS setpoint — B&G (6v8) | 6.891 V | R_lower = R78 + R77 = 26.2 kΩ |
| Output current headroom | 4.0× (Raymarine) / 3.3× (B&G) | vs 100 mA LP2951 limit |
| Max safe VAS current — absolute (Tj = 125°C, 85°C ambient, 14.8 V) | 41 mA (6v8) / 53 mA (8v4) | Pdiss_max = 325 mW |
| Max safe VAS current — 10°C margin (Tj = 115°C) | 31 mA (6v8) / 40 mA (8v4) | Pdiss_safe = 243 mW |
| Worst-case U13 Pdiss | 237.3 mW | VSD = 14.8 V, 30 mA, 6.89 V setpoint |
| U13 Tj @ 85°C ambient worst case | 114.2°C | θJA = 123 °C/W (datasheet, D package) — 10.8°C margin |

The B&G worst-case spec (30 mA at 6.89 V, VSD = 14.8 V) sits at the 10°C thermal margin boundary at 85°C ambient. Actual VAS current must be measured at bring-up; flag any instrument drawing more than 30 mA on the 6v8 setpoint.

:::caution Verification required — In service — installed on test vessel Sunny Spells

**Before next production run:**
- **LP2951-50DR CSO code**: Confirm reel label shows CSO: RFB (new chip) before populating U13. If CSO: SHE (legacy chip) is received, C52 must be replaced with a tantalum capacitor (ESR 0.5–5 Ω) or a 1–3.3 Ω resistor added in series before bring-up. Source: TI LP2951 datasheet §7.2.1.1.2.
- **JP1 silkscreen**: Confirm JP1 voltage positions (8v4 / 6v8) are legible on silkscreen from Gerber review.

**Verify during bring-up:**
- **VCC output ripple**: Measure at VCC test point under Wi-Fi burst load. Pass criterion: < 50 mV pp at 400 kHz fundamental.
- **VAS setpoint voltages**: At both JP1 positions, load VAS at 25 mA (Raymarine) and 30 mA (B&G); sweep VSD 9–14.8 V. Measure at board and at far end of representative 12–20 m mast cable. Expected: 8.65 V (8v4) / 6.89 V (6v8).
- **LP2951 stability**: Apply 5→35 mA load steps at both setpoints with a 12–20 m representative cable. Confirm no sustained oscillation. If instability is observed, increase C48 from 100 pF toward 150–220 pF.
- **U13 thermal soak**: Run 30 minutes at VSD = 14.8 V, 30 mA, 6v8 setpoint; record U13 package temperature. Expected Tj < 115°C at 85°C ambient.
- **Actual transducer current**: Measure IVAS with each target instrument type (Raymarine E22078/9, B&G 213). Flag if any instrument draws > 30 mA on the 6v8 setpoint.
:::

## References

- Texas Instruments, [*LMR516xx SIMPLE SWITCHER Power Converter Datasheet*](https://www.ti.com/lit/ds/symlink/lmr51610.pdf) — layout guidelines §8.4
- Texas Instruments, [*LP2951 Series of Adjustable Micropower Voltage Regulators Datasheet*](http://www.ti.com/lit/ds/symlink/lp2951.pdf) — §7.2.1.1.2 (CFF, ESR requirements)
- Texas Instruments, [*Pros and Cons of Using a Feedforward Capacitor with a Low-Dropout Regulator*](https://www.ti.com/lit/an/slva289b/slva289b.pdf), Application Note SLVA289
- Texas Instruments, [*Controlling Switch-Node Ringing in Synchronous Buck Converters*](https://www.ti.com/lit/an/slyt465/slyt465.pdf), Application Note SLYT465
- ROHM Semiconductor, [*RBR3MM60BTR Schottky Barrier Diode Datasheet*](https://fscdn.rohm.com/en/products/databook/datasheet/discrete/diode/schottky_barrier/rbr3mm60btr-e.pdf)
- Murata Electronics, [*BLM31KN601SN1L Ferrite Bead Datasheet*](https://www.murata.com/en-us/api/pdfdownloadapi?cate=luBLM&partno=BLM31KN601SN1L)
- Monolithic Power Systems, [*EMI Webinar: Practical Grounding and Layout*](https://www.monolithicpower.com/en/support/videos/emi-2-webinar-early-session.html)
- Scadys Internal, *WTI400 VAS — Wind Transducer Supply* (`docs.scadys.io/.assets/docs_old/docs/products/wti400/circuit-pcb/power/vas.md`)
- WTI400 V1.2 Schema Review — Power Supplies (`WTI400/hardware/WTI400_V1.2/schema_review/power_supplies.md`)
- WTI400 V1.2 PCB Review — Power Supplies Layout (`WTI400/hardware/WTI400_V1.2/pcb_review/power_supplies-layout.md`)
- WTI400 V1.2 Performance Review — Power Supplies (`WTI400/hardware/WTI400_V1.2/performance_review/power_supplies.md`)
