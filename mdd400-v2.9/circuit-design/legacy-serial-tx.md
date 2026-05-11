---
title: Legacy Serial TX
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/legacy_serial_tx_3119b6b9.svg" alt="Legacy Serial TX schematic" />

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype — testing phase

:::

## Components

| Ref | Value | Description | Datasheet |
|---|---|---|---|
| U8 | TLP2309 | Toshiba high-speed opto-isolator, SO-6, 5000 Vrms — TX signal isolator (digital → legacy) | [Toshiba TLP2309](https://toshiba.semicon-storage.com/ap-en/semiconductor/product/isolators-solid-state-relays/detail.TLP2309.html) |
| U9 | TLP2309 | Toshiba high-speed opto-isolator, SO-6, 5000 Vrms — TX enable (ST_EN) isolator | [Toshiba TLP2309](https://toshiba.semicon-storage.com/ap-en/semiconductor/product/isolators-solid-state-relays/detail.TLP2309.html) |
| Q10 | 2N7002 | Nexperia N-channel 60 V / 300 mA SOT-23 MOSFET — TX open-drain line driver | [Nexperia 2N7002](https://assets.nexperia.com/documents/data-sheet/2N7002.pdf) |
| Q8, Q11 | BC847BS | Nexperia NPN 45 V / 100 mA SOT-363 dual — gate driver stages | [Nexperia BC847BS](https://assets.nexperia.com/documents/data-sheet/BC847BS.pdf) |
| Q12 | MMBTA56LT1G | onsemi PNP 80 V / 500 mA SOT-23 — high-side rise-time assist | [onsemi MMBTA56LT1G](https://www.onsemi.com/products/discrete-power-modules/general-purpose-transistors/mmbta56) |
| Q9 | AO3407A | AOS P-channel 30 V / 4.2 A SOT-23 MOSFET — legacy-side gate driver chain | [AOS AO3407A](https://www.aosmd.com/pdfs/datasheet/AO3407A.pdf) |
| D9 | BZT52C15S | Diodes Inc 15 V SOD-323 zener — ST_SIG line clamp | [Diodes Inc BZT52C15S](https://www.diodes.com/assets/Datasheets/BZT52C.pdf) |
| D11 | BAT54S | Nexperia 30 V SOT-23 dual Schottky — gate circuit protection | [Nexperia BAT54S](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf) |
| R26 | 10 kΩ | 0603 — ST_TX opto input pull-up to VCC | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R27, R29 | 390 Ω | 0603 — opto LED current-limiting resistors | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R28 | 100 kΩ | 0603 — TX opto output pull-up to VST | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R38 | 100 kΩ | 0603 — EN opto output pull-down | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R36 | 390 Ω | 0603 — ST_EN opto LED current limiter | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R37 | 22 kΩ | 0603 — ST_SIG pull-up to VST (bus idle state and rise-time bias) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R40 | 56 kΩ | 0603 — gate driver bias | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R41, R43 | 1 MΩ | 0603 — high-impedance bias in driver chain | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R42 | 30.9 kΩ | 0603 — gate driver bias | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R47 | 22 kΩ | 0603 — base/gate pull-down | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R48, R49, R56 | 39 kΩ | 0603 — timing / bias network | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R50, R58 | 2.2 kΩ | 0603 — output and base resistors | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R52 | 1 kΩ | Yageo RT0603BRD071KL, 0603 thin-film — driver chain bias | [Yageo RT Thin Film](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RT_Film_C_51.pdf) |
| R55 | 390 Ω | 0603 — Q10 gate drive resistor | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R59 | 12 kΩ | 0603 — C48 discharge path (rise-time assist RC network) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R61 | 10 kΩ | 0603 — feedback current limit bias | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C39, C40 | 100 nF / 50 V | Murata GCM188R71H104KA57D, X7R 0603 MLCC — VST and VCC supply bypass | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C48 | 2.2 nF / 50 V | Murata GRM1885C1H222JA01D, C0G 0603 MLCC — rise-time assist RC timing capacitor | [Murata GRM1885C1H222JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H222JA01D) |

## How It Works

The legacy serial TX sub-sheet implements an isolated, open-drain transmit driver for the 12 V single-wire Legacy Serial I bus (e.g. SeaTalk™). The circuit has three stages: a UART TX opto-isolator (U8), a TX enable (ST_EN) opto-isolator (U9), and a discrete NMOS open-drain line driver (Q10) with a high-side rise-time assist.

**TX Isolator (U8):** The ST_TX signal from the ESP32 (GPIO41) is transferred across the galvanic barrier via a TLP2309 opto-isolator. The input side drives the opto LED through a 10 kΩ pull-up and 390 Ω series resistor, producing approximately 5.6 mA LED current — well into the saturation region. The output is an open-collector phototransistor with a 100 kΩ pull-up to VST, providing a non-inverting buffered replica of ST_TX on the legacy domain side.

**EN Isolator (U9):** A second TLP2309 transfers the ST_EN signal (GPIO1) with inverted-and-default-disabled logic. ST_EN pulled high (default) → LED off → EN line pulled low → line driver disabled. ST_EN driven low by firmware → LED on → EN line driven high → line driver enabled. This ensures the transmitter is inactive at boot and during any MCU reset.

**NMOS Line Driver (Q10):** The final stage is a 2N7002 N-channel MOSFET that pulls ST_SIG to ground during a logic '0' transmission. The gate is driven via a two-transistor push-pull buffer (Q8/Q11 BC847BS dual NPN). When TX = low (transmit '0'), the gate is driven high through R55, and Q10 sinks current, pulling ST_SIG to GNDS. When TX = high (idle), the gate is pulled low and Q10 turns off, allowing ST_SIG to float high through the 22 kΩ pull-up (R37).

**Rise-Time Assist (Q12):** To improve the rising edge speed when Q10 turns off — important for reliable reception by legacy devices — a MMBTA56 PNP transistor (Q12) provides a brief high-side current pulse into ST_SIG via an AC-coupled path (C48, R59). The 2.2 nF capacitor (C48) and 12 kΩ discharge path (R59) give a time constant of 26.4 µs, which fully discharges between bit transitions at 4800 bps (one bit period = 208 µs) while providing a sharp edge during each low-to-high transition.

**Feedback current limiting** in the driver chain prevents excessive current through the gate-driver transistors during active-low output states.

## Design Rationale

The three-stage isolated architecture — TX opto, EN opto, open-drain MOSFET driver — is the minimum structure needed for half-duplex single-wire operation with default-disable safety and full galvanic isolation. The EN opto with inverted logic ensures that any GPIO float or firmware fault results in the transmitter being off, not on, preventing unintended bus driving.

The rise-time assist stage addresses a known limitation of open-drain drivers on long or capacitively loaded bus cables: the passive pull-up alone provides a slow rising edge, which can degrade timing margins for devices with tight setup/hold requirements. The PNP pulse driver actively charges the cable capacitance at the start of each '1' bit, improving edge rates without permanently increasing bus current draw.

The v2.9 revision added base-emitter resistors to the TX input transistors (Q8/Q11) and revised the opto pull-up resistor values to improve switching reliability and reduce ringing.

## PCB Layout

All components are on F.Cu, arranged in an elongated column with the opto-isolators at the top forming the isolation boundary.

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 1 | U8/U9 isolation barrier — no copper bridging GNDREF/GNDS | Unverifiable | Requires Gerber inspection of copper zone boundaries under U8 (148.0, 79.6) and U9 (154.5, 79.6). |
| 2 | C40 (100 nF) adjacent to U8/U9 VCC pins | Met | C40 at (157.5, 82.3); U9 at (154.5, 79.6): ~4.0 mm. Acceptable bypass proximity for this low-speed isolation circuit. |
| 3 | C39 (100 nF) adjacent to VST supply node | Partial | C39 at (151.0, 82.3): same Y row as C40. Distance to U8 legacy-side output: ~4.1 mm. Acceptable; exact VST entry trace requires verification. |
| 4 | C48 near Q12 (rise-time assist loop compact) | Unverifiable | C48 PCB position not recovered from extraction. Inspect PCB editor to confirm proximity to Q12 (150.8, 109.3). |
| 5 | Q10 (line driver) near output node | Met | Q10 at (150.8, 101.5): within 8 mm of Q12 (109.3) and D9 (97.0). Driver cluster is compact for 4800 bps application. |
| 6 | GNDREF / GNDS zone separation throughout PCB | Unverifiable | Requires Gerber / DRC inspection. |

## Design Calculations

| Parameter | Formula | Result |
|---|---|---|
| U8/U9 LED current | (VCC − V_F) / R_series ≈ (3.3 − 1.1) / 390 Ω | **~5.6 mA** — above TLP2309 1 mA minimum ✓ |
| Rise-time assist τ (C48 + R59) | 2.2 nF × 12 kΩ | **26.4 µs** |
| Bit period at 4800 bps | 1 / 4800 | **208 µs** |
| τ / bit period | 26.4 µs / 208 µs | **12.7%** — fully discharges within one bit period ✓ |
| Bus pull-up current (R37 = 22 kΩ, VST = 12 V) | 12 V / 22 kΩ | **0.55 mA** |
| Q10 V_DS(on) at bus pull-up current | 0.55 mA × ~1 Ω R_DS(on) | **~0.55 mV** — negligible bus low voltage ✓ |
| D9 clamp headroom at nominal VST | 15 V − 12 V | **3 V** — D9 does not conduct at nominal bus voltage ✓ |
| TLP2309 isolation voltage | Per datasheet | **5000 Vrms** — well above marine environment requirement ✓ |

:::caution

Verification required — Fabricated prototype — testing phase

**Verify during bring-up:**
- **Protocol compatibility at 4800 bps**: Connect to a real SeaTalk or Legacy Serial I device and verify correct framing, bit timing, and bus levels at 4800 bps. Confirm rising edges (Q12 rise-time assist) are within timing margins. *(performance_review — protocol compliance)*
- **D9 static current at high bus voltage**: With VST at 15–16 V (top of NMEA 2000 range), measure current through D9 (BZT52C15S, V_Z = 15 V). Confirm no excessive dissipation or bus-level interference. *(performance_review Gap 1)*
- **Isolation barrier Gerber check**: Confirm GNDREF and GNDS copper zones are cleanly separated under U8/U9 and throughout the PCB; no copper bridging the isolation gap. *(pcb_review Gap 1)*
- **Unlocated components placement**: Inspect PCB editor to confirm C48, Q11, R36, R40, R42, R47, R59, R61 are placed, and that C48 (rise-time assist cap) is adjacent to Q12. *(pcb_review Gap 2)*

**For next version:**
- **LCSC URLs in schematic**: Replace LCSC property URLs for U8/U9, Q9, Q12, D9, D11 in `legacy_serial_tx.kicad_sch` with manufacturer URLs. *(v2.10-improvements)*
- **D9 TVS upgrade** *(conditional)*: If testing shows D9 conducts at VST = 15–16 V, replace with a bidirectional TVS with V_RWM ≥ 16 V to add margin. *(v2.10-improvements)*

:::

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
