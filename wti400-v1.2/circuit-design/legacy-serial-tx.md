---
title: Legacy Serial TX
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/wti400-v1.2/legacy_serial_tx_ea52b8b5.svg" alt="Legacy Serial TX schematic" />

:::note[Hardware version]

WTI400 **v1.2** — In service — installed on test vessel

:::

## Components

| Ref | Value | Description | Datasheet |
|-----|-------|-------------|-----------|
| U7 | TLP2309 | Toshiba TLP2309 high-speed opto-isolator, SO-6, 5000 Vrms — TX signal isolator (digital → legacy) | [Datasheet](https://toshiba.semicon-storage.com/ap-en/semiconductor/product/isolators-solid-state-relays/detail.TLP2309.html) |
| U8 | TLP2309 | Toshiba TLP2309 high-speed opto-isolator, SO-6, 5000 Vrms — TX enable (ST_EN) isolator | [Datasheet](https://toshiba.semicon-storage.com/ap-en/semiconductor/product/isolators-solid-state-relays/detail.TLP2309.html) |
| Q4 | BC847BS | Nexperia BC847BS NPN dual, SOT-363 — gate driver stage 1; both units used in the Q6 push-pull gate driver chain | [Datasheet](https://assets.nexperia.com/documents/data-sheet/BC847BS.pdf) |
| Q5 | AO3407A | AOS AO3407A P-channel MOSFET, SOT-23, 30 V / 4.2 A — legacy-side high-side switch in gate driver chain | [Datasheet](https://www.aosmd.com/pdfs/datasheet/AO3407A.pdf) |
| Q6 | 2N7002 | Nexperia 2N7002 N-channel MOSFET, SOT-23, 60 V / 300 mA — open-drain line driver; pulls ST_SIG to GNDS during TX logic '0' | [Datasheet](https://assets.nexperia.com/documents/data-sheet/2N7002.pdf) |
| Q7 | BC847BS | Nexperia BC847BS NPN dual, SOT-363 — gate driver stage 2; together with Q4 forms the push-pull buffer for Q6 | [Datasheet](https://assets.nexperia.com/documents/data-sheet/BC847BS.pdf) |
| Q8 | MMBTA56LT1G | onsemi MMBTA56LT1G PNP, SOT-23, 80 V / 500 mA — high-side rise-time assist; provides brief current pulse into ST_SIG on each low-to-high bus transition | [Datasheet](https://www.onsemi.com/products/discrete-power-modules/general-purpose-transistors/mmbta56) |
| D8 | BZT52C15S | Diodes Inc. BZT52C15S 15 V zener, SOD-323 — ST_SIG line clamp | [Datasheet](https://www.diodes.com/assets/Datasheets/BZT52C.pdf) |
| D12 | BAT54S | Nexperia BAT54S dual series Schottky, SOT-23, 30 V — gate circuit protection | [Datasheet](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf) |
| R20 | 10 kΩ | 0603 — ST_TX opto input pull-up to VCC | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R21, R23 | 390 Ω | 0603 — opto LED current-limiting resistors (R21 = U7 TX; R23 = U8 EN) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R22 | 100 kΩ | 0603 — U7 TX opto output pull-up to VST | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R32 | 390 Ω | 0603 — U8 EN secondary circuit (EN signal path) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R33 | 22 kΩ | 0603 — ST_SIG pull-up to VST; sets bus idle-high state and provides Q8 rise-time assist current path | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R34 | 100 kΩ | 0603 — EN opto output pull-down on legacy side | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R35 | 56 kΩ | 0603 — gate driver bias | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R36, R38 | 1 MΩ | 0603 — high-impedance bias in driver chain | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R37 | 30.9 kΩ | 0603 — gate driver bias | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R44 | 22 kΩ | 0603 — base/gate pull-down | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R45, R46, R68 | 39 kΩ | 0603 — timing / bias network | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R56, R70 | 2.2 kΩ | 0603 — output and legacy-side base resistors | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R57 | 10 Ω | Yageo RC0603FR-0710RL, 0603 — series resistor in output stage | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R66 | 1 kΩ | Yageo RC0603FR-071KL, 0603 thick-film, ±1% — driver chain bias | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R67 | 390 Ω | 0603 — Q6 gate drive resistor | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R71 | 12 kΩ | 0603 — C47 discharge path (rise-time assist RC network) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R73 | 10 kΩ | 0603 — feedback current-limit bias | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C30 | 100 nF / 50 V | Murata GCM188R71H104KA57D, X7R 0603 — VST supply bypass at TX isolator block (legacy side) | [Datasheet](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C31 | 100 nF / 50 V | Murata GCM188R71H104KA57D, X7R 0603 — VCC supply bypass at EN isolator block (digital side) | [Datasheet](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C47 | 2.2 nF / 50 V | Murata GRM1885C1H222JA01D, C0G 0603 — rise-time assist RC timing capacitor | [Datasheet](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H222JA01D) |

---

## How It Works

The legacy-serial-tx circuit implements an isolated, open-drain transmit driver for the 12 V single-wire Legacy Serial Protocol bus (e.g. SeaTalk™). The circuit has three stages: a UART TX opto-isolator (U7), a TX enable (ST_EN) opto-isolator (U8), and a discrete NMOS open-drain line driver (Q6) with a high-side rise-time assist.

**TX Isolator (U7).** The ST_TX signal from the ESP32 is transferred across the galvanic barrier via a TLP2309 opto-isolator. The input side drives the opto LED through a 10 kΩ pull-up (R20) and 390 Ω series resistor (R21), producing approximately 5.6 mA LED current. The output is an open-collector phototransistor with a 100 kΩ pull-up (R22) to VST, providing a buffered replica of ST_TX on the legacy domain side.

**EN Isolator (U8).** A second TLP2309 transfers the ST_EN enable signal with inverted-and-default-disabled logic. ST_EN pulled HIGH (default) → U8 LED off → EN output de-asserted → transmitter disabled. ST_EN driven LOW by firmware → U8 LED on → EN output asserted → transmitter enabled. R23 (390 Ω) limits LED current on the digital side; R32 (390 Ω) and R34 (100 kΩ) bias the legacy-side output. C31 (100 nF) bypasses VCC on the digital side of U8. This arrangement ensures the transmitter is inactive during boot, reset, and any MCU fault.

**NMOS Line Driver (Q6).** The final stage is a 2N7002 N-channel MOSFET that pulls ST_SIG to ground during a logic '0' transmission. The gate is driven via a two-transistor push-pull buffer (Q4/Q7, both BC847BS SOT-363 dual NPN packages). When TX = '0' (transmit), the gate is driven HIGH through R67, and Q6 sinks bus current, pulling ST_SIG toward GNDS. When TX = '1' (idle), the gate is pulled LOW and Q6 turns off, allowing ST_SIG to float HIGH through the 22 kΩ pull-up R33. Q5 (AO3407A P-channel MOSFET) acts as the high-side switch in the legacy-side gate driver chain. D8 (BZT52C15S, V_Z = 15 V) clamps the ST_SIG line against transients, with 3 V headroom above nominal VST = 12 V. D12 (BAT54S dual Schottky) clamps the gate node within safe bounds during transitions.

**Rise-Time Assist (Q8).** To improve the rising edge speed when Q6 turns off — important for reliable reception by legacy devices — Q8 (MMBTA56LT1G PNP) provides a brief high-side current pulse into ST_SIG via an AC-coupled path. C47 (2.2 nF, C0G) and R71 (12 kΩ discharge path) give a time constant τ = 26.4 µs, which fully discharges between bit transitions at 4800 bps (one bit period = 208 µs) while providing a sharp edge at each low-to-high transition. R68 (39 kΩ) provides the AC-coupling biasing in the rise-time assist network.

---

## Design Rationale

The three-stage isolated architecture — TX opto, EN opto, open-drain MOSFET driver — is the minimum structure needed for half-duplex single-wire operation with default-disable safety and full galvanic isolation. The EN opto with inverted logic ensures that any GPIO float or firmware fault results in the transmitter being off, not on, preventing unintended bus driving.

The rise-time assist stage addresses a known limitation of open-drain drivers on long or capacitively loaded bus cables: the passive pull-up alone provides a slow rising edge, which can degrade timing margins for devices with tight setup/hold requirements. The PNP pulse driver actively charges the cable capacitance at the start of each '1' bit without permanently increasing bus current draw.

R66 (1 kΩ) is specified as Yageo RC0603FR-071KL (thick-film, ±1%). The KiCAD library symbol incorrectly annotated this as an RT-series thin-film part; the RC-series thick-film designation in the schematic instance property is authoritative and matches the BOM.

---

## PCB Layout

U7 and U8 (TLP2309 pair) are co-linear at Y=79.6, 6.5 mm apart, both oriented at −90°. The isolation boundary runs horizontally between Y=78.8 (GNDREF zone bottom) and Y=80.2 (GND_ST zone top), a 1.4 mm copper-free strip that both opto bodies straddle. All 34 components are on F.Cu in a compact column approximately 10 × 40 mm (X:147–157, Y:73–114).

| Requirement | Status | Evidence |
|-------------|--------|----------|
| U7/U8 straddle GNDREF/GND_ST boundary; isolation gap ≥ 0.4 mm | ✅ Met | 1.4 mm copper-free zone on F.Cu and In1.Cu; 3.5× IEC 60747-5-5 minimum; no fill or trace crosses the gap |
| Digital copper (GNDREF, VCC) confined to Y < 78.8 | ✅ Met | GNDREF zone polygon confirmed at Y=78.8 on F.Cu and In1.Cu; VCC fill does not enter GND_ST domain |
| Legacy copper (GND_ST, VST) confined to Y > 80.2 | ✅ Met | GND_ST zone starts at Y=80.2; VST zone at Y=84.4; no legacy copper north of Y=80.2 |
| GNDREF and GND_ST zones do not share vias | ✅ Met | GNDREF vias at Y=78.5; GND_ST vias at Y=80.5; no shared vias |
| C30 (100 nF VST) adjacent to U7 VST supply | ⚠️ Partial | C30 at 4.0 mm from U7 centroid; equidistant from both optos; functionally acceptable at 4800 bps |
| C31 (100 nF VCC) adjacent to U8 VCC pin | ✅ Met | C31 at 4.0 mm from U8; 9.9 mm from U7 (U7 lacks dedicated VCC bypass — see F2) |
| Q4/Q7/Q6 gate driver cluster compact | ✅ Met | Q4–Q6 6.9 mm, Q6–Q7 3.4 mm; bias resistors within 3.3 mm in same column |
| C47 (2.2 nF rise-time assist) close to Q8 | ✅ Met | C47 5.5 mm from Q8; R71 4.3 mm from Q8; cluster spans 4.4 mm in Y |
| D8 (15 V zener) close to ST_SIG bus entry | ⚠️ Partial | D8 10.7 mm from ST_SIG isolation boundary via at (148.0, 86.75); functional at 4800 bps |
| No PCB creepage slot at isolation boundary | ℹ️ None present | 1.4 mm copper-free gap meets IEC 60747-5-5; slot recommended at V2.0 if formal certification pursued |

ST_SIG crosses to B.Cu via a via at (148.0, 86.75) and runs 17.3 mm on B.Cu before returning to F.Cu at Q6's drain. The B.Cu segment keeps ST_SIG out of the dense F.Cu component area. VST supply traces on B.Cu are 0.6 mm wide; all signal traces are 0.2 mm.

---

## Design Calculations

| Parameter | Formula | Result |
|-----------|---------|--------|
| U7/U8 LED current | (VCC − V_F) / R_series = (3.3 − 1.1) / 390 Ω | **~5.6 mA** — above TLP2309 1 mA minimum ✓ |
| Rise-time assist τ (C47 × R71) | 2.2 nF × 12 kΩ | **26.4 µs** |
| Bit period at 4800 bps | 1 / 4800 | **208 µs** |
| τ / bit period | 26.4 µs / 208 µs | **12.7%** — fully discharges within one bit period ✓ |
| Bus pull-up current (R33 = 22 kΩ, VST = 12 V) | 12 V / 22 kΩ | **0.55 mA** |
| Q6 V_DS(on) at bus pull-up current | 0.55 mA × ~1 Ω R_DS(on) | **~0.55 mV** — negligible bus low voltage ✓ |
| D8 clamp headroom at nominal VST | 15 V − 12 V | **3 V** — D8 does not conduct at nominal bus voltage ✓ |
| TLP2309 isolation voltage | Per datasheet | **5000 Vrms** — well above marine environment requirement ✓ |

---

:::caution

Verification required — In service

**Verify during bring-up:**
- **D8 static current at high bus voltage:** At VST = 15–16 V (top of NMEA 2000 range), D8 (V_Z = 15 V) begins to conduct. Measure zener/leakage current at VST = 16 V. Confirm dissipation is within the 200 mW continuous rating and bus logic is unaffected. *(performance_review Gap 1)*

**For next version:**
- **Move D8 closer to ST_SIG isolation boundary:** D8 is 10.7 mm from the ST_SIG isolation boundary via at (148.0, 86.75). Functional at 4800 bps; relocate to Y ≈ 86–88 in V2.0 to better match placement intent. *(performance_review Gap 2, pcb_review F3)*
- **Add PCB creepage slot at isolation boundary** *(conditional on formal EMC/safety certification)*: The 1.4 mm copper-free gap meets IEC 60747-5-5 clearance; a milled slot would further increase creepage. Evaluate for V2.0 if CE marking or MED certification is pursued. *(performance_review Gap 3, pcb_review F1)*
- **Add dedicated 100 nF VCC bypass adjacent to U7:** C31 (100 nF VCC) serves U8 at 4.0 mm; U7's VCC pin is 9.9 mm from C31 with only the VCC zone fill for decoupling. Add a dedicated 100 nF 0603 adjacent to U7 VCC pin in V2.0. *(performance_review Gap 4, pcb_review F2)*

:::

---

## References

1. Toshiba, [*TLP2309 High-Speed Opto-Isolator Datasheet*](https://toshiba.semicon-storage.com/ap-en/semiconductor/product/isolators-solid-state-relays/detail.TLP2309.html)
2. Nexperia, [*BC847BS NPN Transistor Datasheet*](https://assets.nexperia.com/documents/data-sheet/BC847BS.pdf)
3. Nexperia, [*2N7002 NMOS Transistor Datasheet*](https://assets.nexperia.com/documents/data-sheet/2N7002.pdf)
4. onsemi, [*MMBTA56LT1G PNP Transistor Datasheet*](https://www.onsemi.com/products/discrete-power-modules/general-purpose-transistors/mmbta56)
5. AOS, [*AO3407A P-Channel MOSFET Datasheet*](https://www.aosmd.com/pdfs/datasheet/AO3407A.pdf)
6. Diodes Inc, [*BZT52C15S Zener Diode Datasheet*](https://www.diodes.com/assets/Datasheets/BZT52C.pdf)
7. Nexperia, [*BAT54S Dual Schottky Diode Datasheet*](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf)
8. Murata, [*GRM1885C1H222JA01D C0G 2.2 nF 0603 MLCC*](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H222JA01D)
9. Noland Engineering, [*Understanding and Implementing NMEA 0183 and RS422 Serial Data Interfaces*](https://www.nolandeng.com/downloads/Interfaces.pdf)
