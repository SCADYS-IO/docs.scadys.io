---
title: Bill of Materials
hw_version: v1.2
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
---

:::note[Hardware version]
CANBench TrueZ **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-truez/v1.1/)
:::

Full component list for the CANBench TrueZ v1.2, grouped by value. The board is a passive RF network — no active devices, no power rails.

| Refs | Value | Qty | Package | Description | Manufacturer / MPN | Datasheet |
|---|---|---|---|---|---|---|
| T1, T2 | TC1-1-13M+ | 2 | AT224-1A | 1:1 (50 Ω) RF transmission-line balun, 4.5–3000 MHz — T1 common-mode, T2 differential-mode | Mini-Circuits TC1-1-13M+ | [PDF](https://www.minicircuits.com/pdfs/TC1-1-13M+.pdf) |
| R1–R4 | 10 Ω | 4 | 0603 | Series damper in each LISN input leg | YAGEO RC0603FR-0710RL | [PDF](https://yageogroup.com/content/datasheet/asset/file/PYU-RC_GROUP_51_ROHS_L) |
| R5, R6 | 49.9 Ω | 2 | 0603 (R5 with via) | Thin-film 0.1 % termination — R5 CM shunt, R6 DM series | YAGEO RT0603BRD0749R9L | [PDF](https://www.lcsc.com/datasheet/C861434.pdf) |
| C1, C2 | 100 nF / 100 V | 2 | 0603 | DC-blocking / AC-coupling cap on the CM and DM outputs | muRata GCJ188R72A104KA01D | [PDF](https://www.lcsc.com/datasheet/C161117.pdf) |
| J2–J5 | BWSMA-KE11 | 4 | Edge SMA | 50 Ω SMA jack — LISN+/LISN− inputs, CM/DM outputs | BAT WIRELESS BWSMA-KE11 | [PDF](https://www.lcsc.com/datasheet/C5250058.pdf) |
| J1 | CHASSIS | 1 | Keystone 1211 | GNDREF banana / quick-connect terminal | YIYUAN YTC-3-PCB281308 | [PDF](https://www.lcsc.com/datasheet/C20626108.pdf) |
| PCB1 | 0C-1.1 | 1 | — | The printed circuit board (71 × 42 mm, 2-layer FR-4) | SCADYS.IO | — |

Silkscreen / marking symbols (CE, UKCA, RoHS, logo, QR, copyright, version, fiducials) are graphical only and excluded from the BOM. See [Circuit Design → Connectors & Markings](../circuit-design/connectors.md).
