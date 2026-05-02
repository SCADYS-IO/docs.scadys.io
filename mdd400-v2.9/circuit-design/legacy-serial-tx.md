---
title: Legacy Serial TX
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/legacy_serial_tx.svg" alt="Legacy Serial TX schematic" />

:::note Hardware version
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

## Components

| Ref | Value | Description | Datasheet |
|---|---|---|---|
| U8 | TLP2309 | High-speed opto-isolator, SO-6 — UART TX isolator | [Toshiba TLP2309](https://toshiba.semicon-storage.com/ap-en/semiconductor/product/isolators-solid-state-relays/detail.TLP2309.html) |
| U9 | TLP2309 | High-speed opto-isolator, SO-6 — TX enable (ST_EN) isolator | [Toshiba TLP2309](https://toshiba.semicon-storage.com/ap-en/semiconductor/product/isolators-solid-state-relays/detail.TLP2309.html) |
| Q10 | 2N7002 | N-channel 60 V 300 mA SOT-23 MOSFET — TX line driver | [Nexperia 2N7002](https://assets.nexperia.com/documents/data-sheet/2N7002.pdf) |
| Q8, Q11 | BC847BS | NPN 45 V 100 mA SOT-363 dual — gate driver stages | [Nexperia BC847BS](https://assets.nexperia.com/documents/data-sheet/BC847BS.pdf) |
| Q12 | MMBTA56LT1G | PNP 80 V 500 mA SOT-23 — high-side rise-time assist | [Onsemi MMBTA56LT1G](https://www.onsemi.com/products/discrete-power-modules/general-purpose-transistors/mmbta56) |
| Q9 | AO3407A | P-channel MOSFET — used in gate driver chain | [UMW AO3407A](https://www.lcsc.com/product-detail/C347478.html) |
| D9 | BZT52C15S | 15 V SOD-323 zener — clamp in gate/base circuit | [Diodes Inc BZT52C15S](https://www.diodes.com/assets/Datasheets/BZT52C.pdf) |
| D11 | BAT54S | 30 V SOT-23 dual series Schottky — gate circuit protection | [Nexperia BAT54S](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf) |
| R26 | 10 kΩ | 0603 — ST_TX opto input pull-up | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R27, R29 | 390 Ω | 0603 — opto LED current-limiting resistors | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_51_RoHS_P_6.pdf) |
| R28 | 100 kΩ | 0603 — opto TX output pull-up to VST | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R38 | 100 kΩ | 0603 — EN opto output pull-down | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R36 | 390 Ω | 0603 — ST_EN opto LED current limiter | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_51_RoHS_P_6.pdf) |
| R37 | 22 kΩ | 0603 — ST_SIG pull-up to VST (rise-time bias) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R40 | 56 kΩ | 0603 — gate driver bias | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R41, R43 | 1 MΩ | 0603 — high-impedance bias in driver chain | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R42 | 30.9 kΩ | 0603 — driver bias | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R47 | 22 kΩ | 0603 — base/gate network | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R48, R49, R56 | 39 kΩ | 0603 — timing / bias network | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R50, R58 | 2.2 kΩ | 0603 — output and base resistors | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R52 | 1 kΩ | 0603 thin-film | [Yageo Thin Film](https://www.lcsc.com/product-detail/C110776.html) |
| R55 | 390 Ω | 0603 — gate driver | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_51_RoHS_P_6.pdf) |
| R59 | 12 kΩ | 0603 — RC timing network discharge path | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R61 | 10 kΩ | 0603 — feedback current limit bias | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C39, C40 | 100 nF/50 V | 0603 — decoupling | — |
| C48 | 2.2 nF/50 V | 0603 C0G — rise-time assist RC timing capacitor | [Murata GRM1881X0J243JA01](https://search.murata.co.jp/Ceramy/image/img/A01X/G101/ENG/GRM1881X0J243JA01-01A.pdf) |

## How It Works

The legacy serial TX sub-sheet implements an isolated, open-drain transmit driver for the 12 V single-wire Legacy Serial I bus. The circuit has three stages: a UART TX opto-isolator (U8), a TX enable (ST_EN) opto-isolator (U9), and a discrete NMOS open-drain line driver (Q10) with a high-side rise-time assist.

**TX Isolator (U8):** The ST_TX signal from the ESP32 (GPIO41) is transferred across the galvanic barrier via a TLP2309 opto-isolator. The input side drives the opto LED through a 10 kΩ pull-up and 390 Ω series resistor, producing ~6.7 mA LED current — well into saturation. The output is an open-collector phototransistor with a 100 kΩ pull-up to VST, providing a non-inverting buffered replica of ST_TX on the legacy domain side.

**EN Isolator (U9):** A second TLP2309 transfers the ST_EN signal (GPIO1) with inverted-and-default-disabled logic. ST_EN pulled high (default) → LED off → EN line pulled low → line driver disabled. ST_EN driven low by firmware → LED on → EN line driven high → line driver enabled. This ensures the transmitter is inactive at boot and during any MCU reset.

**NMOS Line Driver (Q10):** The final stage is a 2N7002 N-channel MOSFET that pulls ST_SIG to ground during a logic '0' transmission. The gate is driven via a two-transistor push-pull buffer (Q8/Q11 BC847BS dual NPN). When TX = low (transmit '0'), the gate is driven high through R55, and Q10 sinks current, pulling ST_SIG to GNDS. When TX = high (idle), the gate is pulled low and Q10 turns off, allowing ST_SIG to float high through the 22 kΩ pull-up (R37).

**Rise-Time Assist (Q12):** To improve the rising edge speed when Q10 turns off — important for reliable reception by legacy devices — a MMBTA56 PNP transistor (Q12) provides a brief high-side current pulse into ST_SIG via an AC-coupled path (C48, R48, R56). The 2.2 nF capacitor (C48) and ~12 kΩ discharge path (R59) give a time constant of ~12 µs, which fully discharges between bit transitions at 4800 bps (Legacy Serial I) while providing a sharp edge during the low-to-high transition.

**Feedback current limiting** in the driver chain prevents excessive current through the gate-driver transistors during active-low output states.

## Design Rationale

The three-stage isolated architecture — TX opto, EN opto, open-drain MOSFET driver — is the minimum structure needed for half-duplex single-wire operation with default-disable safety and full galvanic isolation. The EN opto with inverted logic ensures that any GPIO float or firmware fault results in the transmitter being off, not on, preventing unintended bus driving.

The rise-time assist stage addresses a known limitation of open-drain drivers on long or capacitively loaded bus cables: the passive pull-up alone provides a slow rising edge, which can degrade timing margins for devices with tight setup/hold requirements. The PNP pulse driver actively charges the cable capacitance at the start of each '1' bit, improving edge rates without permanently increasing bus current draw.

The v2.9 revision added base-emitter resistors to the TX input transistors (Q8/Q11) and revised the opto pull-up resistor values to improve switching reliability and reduce ringing — changes visible in the schematic changelog.

## References

- Toshiba, [*TLP2309 Opto-Isolator Datasheet*](https://toshiba.semicon-storage.com/ap-en/semiconductor/product/isolators-solid-state-relays/detail.TLP2309.html)
- Nexperia, [*BC847BS NPN Transistor Datasheet*](https://assets.nexperia.com/documents/data-sheet/BC847BS.pdf)
- Nexperia, [*2N7002 NMOS Transistor Datasheet*](https://assets.nexperia.com/documents/data-sheet/2N7002.pdf)
- Onsemi, [*MMBTA56LT1G PNP Transistor Datasheet*](https://www.onsemi.com/products/discrete-power-modules/general-purpose-transistors/mmbta56)
- Noland Engineering, [*Understanding and Implementing NMEA 0183 and RS422 Serial Data Interfaces*](https://www.nolandeng.com/downloads/Interfaces.pdf)
