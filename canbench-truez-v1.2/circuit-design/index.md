---
title: Circuit Design
hw_version: v1.1
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
sidebar_label: Overview
---

:::note[Hardware version]
CANBench TrueZ **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-truez/v1.1/)
:::

The CANBench TrueZ is a fully passive instrument. There is no microcontroller, no firmware, no switching converter. The whole board is two 1:1 RF transformers and a small resistor/capacitor network on a 2-layer FR-4 board, implementing the noise-separator method of Wang, Lee & Odendaal (IEEE TPE 2005): sum the two LISN lines to recover the common-mode component, difference them to recover the differential-mode component.

TrueZ is the companion to the [CANBench Duo](/canbench-duo/v1.1/) DC LISN. The Duo supplies the RF coupling, attenuation and front-end protection; TrueZ does only the mode separation.

## System architecture

Signal flows left-to-right. The two LISN line signals enter on SMA inputs `LISN+` / `LISN−`, each through a 10 Ω series damper, into the two transformers. They leave on two SMA outputs after their mode-specific terminations and DC-blocking capacitors:

- **Common-mode (T1).** The two windings of T1 are connected in series across `LISN+` and `LISN−`; the series midpoint sits at the average (common-mode) potential. A 49.9 Ω shunt to GNDREF terminates this node, and a 100 nF cap AC-couples it to the `CM-25Ω` output.
- **Differential-mode (T2).** The second transformer is wired to transform the line-to-line difference to a single-ended output, through a 49.9 Ω series resistor and a 100 nF DC-block to the `DM-100Ω` output.

The mode-specific terminations are the crux of the method. With a 50 Ω analyser input, the CM output's 49.9 Ω shunt presents ≈ 25 Ω at the common-mode node (faceplate **CM-25Ω**), and the DM output's 49.9 Ω series gives a 100 Ω measurement condition (faceplate **DM-100Ω**). These labels assume the analyser presents 50 Ω; a high-impedance scope input invalidates the loading.

## Subsystems

| Subsystem | Schematic sheet (V1.2) | Role |
| --- | --- | --- |
| [CM & DM Separator](./cm-dm.md) | `cm_dm` | The two TC1-1-13M+ baluns (T1 common-mode, T2 differential-mode) and the 10 Ω / 49.9 Ω / 100 nF network that extract and couple out the CM and DM components. |
| [Connectors & Markings](./connectors.md) | `connectors` | Four edge SMA jacks (`LISN+`/`LISN−` in, `CM-25Ω`/`DM-100Ω` out), the J1 GNDREF banana, and the PCB silkscreen / compliance markings. |

In V1.2 the CM/DM network is on the `cm_dm` sheet, and the connectors plus the silkscreen/markings on a dedicated `connectors` sheet. (V1.1 drew the connectors on the `cm_dm` sheet.)

## PCB layout and stack-up

The board is **71 × 42 mm**, **2-layer FR-4**, **1.6 mm overall thickness**, **1 oz copper** on both sides.

| Layer | Type | Thickness | Material | ε_r | Notes |
| --- | --- | --- | --- | --- | --- |
| F.SilkS | Top silkscreen | — | — | — | Markings + branding |
| F.Mask | Top solder mask | 0.010 mm | — | — | Dark (`#191919`) |
| F.Cu | Signal | 0.035 mm | Copper | — | Components, RF traces, coplanar GNDREF pour |
| Core | Dielectric | 1.510 mm | FR-4 | 4.5 | tan δ ≈ 0.02 |
| B.Cu | Ground | 0.035 mm | Copper | — | Continuous GNDREF plane — the RF return |
| B.Mask | Bottom solder mask | 0.010 mm | — | — | Dark (`#191919`) |
| B.SilkS | Bottom silkscreen | — | — | — | — |

### EMC layout philosophy

- **Controlled-impedance CPWG.** The RF input lines are routed as coplanar-waveguide-with-ground: ≈ 1.0 mm trace, 0.2 mm gap to the GNDREF pour, on the 1.6 mm FR-4 stack — targeting 50 Ω (design estimate ≈ 50–52 Ω; exact Z₀ pending field-solver / VNA confirmation).
- **Continuous ground reference.** GNDREF is poured on both copper layers, with dense via stitching (≈ 500 ground vias) forming a perimeter fence and clusters at the transformers and SMA launches. The continuous plane under each transformer follows the TC1-1-13M+ datasheet's grounding guidance.
- **Symmetry.** The two `LISN+` / `LISN−` feeds into each transformer are placed symmetrically; skew between them converts DM↔CM and corrupts the separation the product exists to perform.

### DRC

`kicad-cli` DRC reports **1 cosmetic violation** (silkscreen marking footprints S1/S6 overlapping at a single point) and **0 unconnected / 0 schematic-parity** issues. The silk overlap is bundled with the marking cleanup tracked on the [Tasks](../tasks.md) page.

## References

- J. Wang, F. C. Lee, W. Odendaal, *Characterization, Evaluation, and Design of Noise Separator for Conducted EMI Noise Diagnosis*, IEEE Trans. Power Electronics 20(4), 2005 — the separator method.
- Mini-Circuits, [*TC1-1-13M+*](https://www.minicircuits.com/pdfs/TC1-1-13M+.pdf) — 1:1 50 Ω RF balun, 4.5–3000 MHz; suggested PCB layout.
- EEVblog Forum, [*DIY DM/CM Separator for EMC — LISN Mate*](https://www.eevblog.com/forum/projects/diy-dm-cm-seperator-for-emc-lisn-mate/).
- IEC, [*CISPR 25*](https://webstore.iec.ch/publication/7077) — conducted-emissions measurement band and methods.
