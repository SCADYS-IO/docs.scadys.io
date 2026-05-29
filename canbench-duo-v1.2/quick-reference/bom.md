---
title: Bill of Materials
hw_version: v1.2
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
---

:::note[Hardware version]
CANBench Duo **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-duo/v1.1/)
:::

The CANBench Duo V1.2 BOM, grouped by Value. Sources are sample suppliers; substitute equivalents permitted where noted in [Circuit Design](../circuit-design/index.md).

| Refs | Value | Footprint | Qty | Description | Datasheet |
| --- | --- | --- | --- | --- | --- |
| C1, C8 | 2u2/100V | CAP-1210 | 2 | muRata GCM32ER72A225KA35L — 100 V 2.2 µF X7R ±10% MLCC | — |
| C2, C9, C15, C20, C25, C26 | 100n/100V | CAP-0805 | 6 | muRata GCM21BR72A104KA37L — 100 V 100 nF X7R ±10% MLCC | — |
| C3, C10 | 22u/100V | CAP-2220 | 2 | PSA Prosperity Dielectrics FS55X226K101LRG — 100 V 22 µF X7R ±10% MLCC | — |
| C4, C11 | 220n/250V | CAP-1210 | 2 | muRata GRM32DR72E224KW01L — 250 V 220 nF X7R ±10% MLCC | — |
| C5, C7, C12, C14 | 33p/630V | CAP-1206 | 4 | muRata GCM31A5C2J330JX01D — 630 V 33 pF C0G ±5% MLCC | — |
| C6, C13 | 1n/630V | CAP-1206 | 2 | muRata GRM31B5C2J102JW01L — 630 V 1 nF C0G ±5% MLCC | — |
| C16, C17, C21, C22 | 470n/50V | CAP-0805 | 4 | muRata GCM21BR71H474KA55L — 50 V 470 nF X7R ±10% MLCC | — |
| C18, C19, C23, C24 | 1u/100V | CAP-1210 | 4 | muRata GRM32CR72A105KA35L — 100 V 1 µF X7R ±10% MLCC | — |
| D1 | XL-5050RGBC | LED-XL-5050RGBC | 1 | XINGLIGHT — SMD5050-6P 3-die RGB LED | — |
| D2, D5 | BZT52C15 | SOD-123 | 2 | Diodes Inc. — 15 V 370 mW Zener (gate-clamp for Q2 / Q3) | [Diodes BZT52C15](https://www.diodes.com/assets/Datasheets/ds18005.pdf) |
| D3, D4 | SMCJ58CA | SMC (DO-214AB) | 2 | DOWO SMCJ58CA — 58 V bidirectional TVS, V_C 93.6 V at 16 A | [Littelfuse SMCJ58CA reference](https://www.littelfuse.com/products/tvs-diodes/automotive-tvs/spa-automotive-tvs/smcj58ca.aspx) |
| D6–D9, D11–D16, D18, D19, D22, D23, D25, D26 | 1N4148W | SOD-123 | 16 | DIODES Incorporated 1N4148W-7-F — 100 V 300 mA fast switching diode | — |
| D10, D17, D24 | TPAZ1023-02F | DFN1210-6 | 3 | Tech Public TPAZ1023-02F — multi-channel integrated TVS, V_C 15 V at 3 A (single channel populated on each placement) | — |
| F1 | 0154005.DRT | OMNI-BLOK + 449 insert | 1 | Littelfuse Nano2 Slo-Blo 5 A in 154 series holder | [Littelfuse 154](https://www.littelfuse.com/assetdocs/littelfuse-fuse-154-series-data-sheet) + [449](https://www.littelfuse.com/assetdocs/littelfuse_fuse_449_datasheet.pdf) |
| FB1, FB2 | 30Ω@100MHz | IND-1210 | 2 | muRata BLE32PN300SN1L — power ferrite bead, R_DC 1.6 mΩ | — |
| J1, J5 | RED banana | THT edge-mount | 2 | Changzhou Amass 24.245.1 — horizontal edge-mount RED banana socket | — |
| J3, J7 | BLACK banana | THT edge-mount | 2 | Changzhou Amass 24.245.2 — same as J1/J5, BLACK | — |
| J2, J4, J6 | SMA Female Vertical | CON-SMA6565 | 3 | HCTL HC-SMA6565-13H-G — 50 Ω, THT, vertical | — |
| J10 | N2K Female | M12 panel-mount | 1 | Shenzhen STA M12-S5A-PPFM — NMEA 2000 / DeviceNET Micro-C 5-pin Code A Female, IP67 | — |
| L1–L10 | 1 µH, 7 mΩ | IND-7266 | 10 | Shenzhen Shouhan CYA0630-1.0UH — 12 A I_sat (LISN ladder series inductor) | (local PDF in source repo) |
| L11–L14 | 470 µH | IND-5942 | 4 | PROD Tech PSWSAA5942-471M — 120 mA, 6.8 Ω DCR (shunt-choke pair on RF measurement ports) | — |
| Q1 | BC807-25 | SOT-23 | 1 | Nexperia BC807-25 — PNP BJT, state-encoder switch for the indicator LED | [Nexperia BC807](https://assets.nexperia.com/documents/data-sheet/BC807_SER.pdf) |
| Q2 | SUD50P08 | TO-252 | 1 | VBsemi SUD50P08-25L-E3-VB — 100 V P-channel MOSFET, R_DS(on) 17 mΩ (high-side reverse-polarity protection) | [Vishay SUD50P08 (JEDEC reference)](https://www.vishay.com/docs/72606/sud50p08.pdf) |
| Q3 | STD80N10F7 | TO-252 | 1 | STMicroelectronics STD80N10F7 — 100 V N-channel MOSFET, R_DS(on) 10 mΩ (low-side reverse-polarity protection) | [ST STD80N10F7](https://www.st.com/resource/en/datasheet/std80n10f7.pdf) |
| R1, R3 | 10 kΩ | RES-0805 | 2 | YAGEO — LED current limiters (R1 Green-path, R3 Red/Blue-path) | — |
| R2, R7, R15 | 100 kΩ | RES-0603 | 3 | YAGEO — gate-mesh + LED state-encoder bias | — |
| R4, R12 | 47 Ω | RES-1206 | 2 | YAGEO PE1206 — gate-stopper resistors for Q2 / Q3 | — |
| R5, R13, R23, R32, R43 | 1 MΩ | RES-0603 | 5 | YAGEO — gate-source pull resistors + SMA-port bleeders | — |
| R6, R14 | 100 kΩ | RES-0603 (VIA) | 2 | YAGEO — VSF± rail bleed resistors | — |
| R8, R16 | 10 Ω | RES-2512 | 2 | YAGEO RT2512 — LISN ladder shunt-cap damper (10 Ω × 220 nF → 72 kHz RC corner) | — |
| R9, R17 | 470 Ω | RES-2512 | 2 | YAGEO RT2512 — LISN ladder shunt-cap damper (470 Ω × 33 pF → 10 MHz RC corner) | — |
| R10, R11, R18, R19 | 0.68 Ω | RES-0805 | 4 | YAGEO — parallel-pair shunt-cap damper (0.34 Ω effective at DUT-node 1 nF caps) | — |
| R20, R29 | 17.8 Ω | RES-1206 | 2 | YAGEO RT1206 thin-film 0.1% — measurement-port π-attenuator series | — |
| R21, R30, R40 | 5.1 Ω | RES-0603 | 3 | YAGEO AC0603 — measurement-port current limiter / inter-clamp series | — |
| R22, R31 | 45.3 Ω | RES-0603 | 2 | YAGEO RT0603 thin-film 0.1% — measurement-port π-attenuator series | — |
| R24, R25, R33, R34 | 294 Ω | RES-0805 | 4 | YAGEO RT0805 thin-film 0.1% — π-attenuator shunts on RF_LP1 / RF_LP2 | — |
| R27, R28, R36, R37 | 130 Ω | RES-0603 | 4 | YAGEO RT0603 thin-film 0.1% — π-attenuator shunts on RF_LP4 / RF_LP6 | — |
| R38, R41 | 1 kΩ | RES-0603 | 2 | YAGEO RT0603 thin-film 0.1% — **CAN-bus common-mode summing pair** (matched 0.1 % for CMRR) | — |
| R39, R44 | 1.2 Ω | RES-1206 | 2 | YAGEO PE1206 — series-damper between VSF± and bulk caps C3 / C10 | — |
| R42 | 68.1 Ω | RES-0603 | 1 | YAGEO RT0603 thin-film 0.1% — π-attenuator series stage 1 (CAN CM port) | — |
| R46, R47 | 91 Ω | RES-0603 | 2 | YAGEO RT0603 thin-film 0.1% — π-attenuator shunts (CAN CM port) | — |
| FID1, FID2 | Fiducial | MCH-FIDUCIAL | 2 | Pick-and-place registration | — |
| J8 | Keystone 1211 | THT | 1 (DNP) | YIYUAN YTC-3-PCB281308 — chassis-ground stud, **NOT POPULATED on V1.1/V1.2** (chassis bond is via wire braid from PCB GNDREF to enclosure binding post) | — |

> The Datasheet column carries manufacturer URLs where reachable. Several parts (the LED, the TPAZ1023 TVS, the muRata MLCC family, the PROD Tech inductor, the Changzhou Amass bananas, the HCTL SMA, the Shenzhen STA M12, the Shouhan CYA0630) do not have publicly indexed English manufacturer pages; refer to the canonical LCSC redirect URLs in the engineering BOM (`PCB/CANBench_Duo_V1.2/schema_review/`) for those parts.
