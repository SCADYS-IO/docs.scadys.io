---
title: Circuit Design
hw_version: v1.2
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
sidebar_label: Overview
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]
CANBench TrueZ **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-truez/v1.1/)
:::

The CANBench TrueZ is a fully passive instrument. There is no microcontroller, no firmware, no switching converter. The whole board is two 1:1 RF transformers and a small resistor/capacitor network on a 2-layer FR-4 board, implementing the noise-separator method of Wang, Lee & Odendaal (IEEE TPE 2005): sum the two LISN lines to recover the common-mode component, difference them to recover the differential-mode component.

TrueZ is the companion to the [CANBench Duo](/canbench-duo/v1.1/) DC LISN. The Duo supplies the RF coupling, attenuation and front-end protection; TrueZ does only the mode separation.

<SchematicViewer src="/img/schematics/canbench-truez-v1.2/CANBench_TrueZ_V1.2_0af8bf7f.svg" alt="CANBench TrueZ V1.2 parent schematic sheet — the CM & DM separator network with its two TC1-1-13M+ baluns and the four SMA / banana connectors, showing the LISN+ / LISN− inputs and the CM-25Ω / DM-100Ω outputs." />

---

## Overview

Signal flows left-to-right. The two LISN line signals enter on SMA inputs `LISN+` / `LISN−`, each through a 10 Ω series damper, into the two transformers. They leave on two SMA outputs after their mode-specific terminations and DC-blocking capacitors:

- **Common-mode (T1).** The two windings of T1 are connected in series across `LISN+` and `LISN−`; the series midpoint sits at the average (common-mode) potential. A 49.9 Ω shunt to GNDREF terminates this node, and a 100 nF cap AC-couples it to the `CM-25Ω` output.
- **Differential-mode (T2).** The second transformer is wired to transform the line-to-line difference to a single-ended output, through a 49.9 Ω series resistor and a 100 nF DC-block to the `DM-100Ω` output.

The mode-specific terminations are the crux of the method. With a 50 Ω analyser input, the CM output's 49.9 Ω shunt presents ≈ 25 Ω at the common-mode node (faceplate **CM-25Ω**), and the DM output's 49.9 Ω series gives a 100 Ω measurement condition (faceplate **DM-100Ω**). These labels assume the analyser presents 50 Ω; a high-impedance scope input invalidates the loading.

---

## Functional requirements and performance criteria

TrueZ is a passive measurement fixture: a two-port-in, two-port-out RF separator that resolves a LISN's two line signals into their common-mode and differential-mode components for a spectrum analyser. The board carries no active devices, so the requirements are entirely about preserving the measurement — passing the noise spectrum faithfully, presenting the correct port impedances, and not letting one mode leak into the other.

**System functional requirements**

- Resolve the two LISN line signals (`LISN+` / `LISN−`) into separate common-mode and differential-mode outputs by the Wang–Lee–Odendaal method (sum for CM, difference for DM).
- Present each output on a 50 Ω SMA jack so it drives a spectrum analyser directly.
- Terminate each mode at its method-defined condition — a shunt for CM, a series element for DM — assuming a 50 Ω analyser input.
- Block the bus DC while passing the AC noise spectrum, so only disturbance reaches the analyser.
- Keep the two input feeds symmetric, so line-to-line skew does not convert DM↔CM and corrupt the separation.
- Pass the conducted-emissions band with low, repeatable insertion loss.

**Performance criteria (design targets)**

The values below are design intent, calculated from datasheet specifications against the V1.2 topology (electrically identical to V1.1); empirical VNA / golden-prototype confirmation is pending.

| Criterion | Target | Basis |
|---|---|---|
| CM port effective impedance | ≈ 25 Ω (49.9 Ω shunt ∥ analyser 50 Ω) | Wang–Lee–Odendaal CM-port termination; assumes a 50 Ω analyser input |
| DM port effective impedance | ≈ 100 Ω (49.9 Ω series + analyser 50 Ω) | Wang–Lee–Odendaal DM-port termination; assumes a 50 Ω analyser input |
| Port impedance | 50 Ω at each of the four SMA jacks | Spectrum-analyser / LISN interface convention |
| Measurement bandwidth | 4.5 MHz – 3 GHz | TC1-1-13M+ transformer band; useful from the low CISPR band up |
| Insertion loss (transformer) | ≈ 0.18 dB @4.5 MHz → ≈ 0.68 dB @1 GHz | TC1-1-13M+ datasheet, applied 2× (one balun per mode path) |
| Cross-mode isolation floor | Set by transformer balance (0.5 dB amplitude, 2° phase typ) | TC1-1-13M+ datasheet balance specification |
| Low-frequency droop | Below ≈ 0.5 MHz — corrected with a one-time golden-prototype calibration curve | TC1-1-13M+ low-end roll-off; correction is the production intent, not yet measured |

The CM-25Ω / DM-100Ω semantics assume a 50 Ω analyser input; a high-impedance scope input invalidates the intended loading and the calibration. The per-circuit [CM & DM Separator](./cm-dm.md) page carries the detailed objectives and the calculations that verify them; this section is the system-level parent they trace to.

---

## Subsystems

| Subsystem | Schematic sheet (V1.2) | Role |
| --- | --- | --- |
| [CM & DM Separator](./cm-dm.md) | `cm_dm` | The two TC1-1-13M+ baluns (T1 common-mode, T2 differential-mode) and the 10 Ω / 49.9 Ω / 100 nF network that extract and couple out the CM and DM components. |
| [Connectors & Markings](./connectors.md) | `connectors` | Four edge SMA jacks (`LISN+`/`LISN−` in, `CM-25Ω`/`DM-100Ω` out), the J1 GNDREF banana, and the PCB silkscreen / compliance markings. |

In V1.2 the CM/DM network is on the `cm_dm` sheet, and the connectors plus the silkscreen/markings on a dedicated `connectors` sheet. (V1.1 drew the connectors on the `cm_dm` sheet.)

---

## Part selection and design for reliability

Components are selected against a written policy rather than by availability or price. The policy exists because the
failure modes that matter on a Scadys board are not the ones that show up on a bench: they appear months later, in the
field, after thermal cycling and vibration.

Three rules shape the passive selection on every board.

**Dielectric and voltage derating.** Ceramic capacitors are X7R or C0G, never X5R, because X5R is rated only to 85 °C
and the inside of a sealed housing reaches that. Bulk ceramics are run at or below 25 % of their rated voltage, which
bounds DC-bias capacitance loss and removes any dependence on the exact capacitance-versus-voltage curve.

**Land patterns come from the component manufacturer, not from the PCB tool.** A ceramic capacitor that cracks under
board flexure fails as a **short circuit**. On a supply rail, that stops the instrument working, with no warning and no
field diagnosis. The amount of solder in the joint controls how much force reaches the ceramic, and the amount of
solder is set by the copper land pattern. Scadys uses the land windows published by Murata and Samsung, which are
narrower than the IPC-7351 defaults that PCB tools generate.

**Inductor saturation current is specified against the regulator's current limit, not against the load.** A switching
regulator drives its inductor to the current limit during a short circuit, a hard load step, or inrush, regardless of
what the steady load is.

:::note[Design standard]

The reasoning behind the capacitor land patterns, including the manufacturers' own statements on solder volume and
cracking, is set out in the engineering note **[MLCC Land Patterns and Flex Cracking](/engineering/mlcc-land-patterns)**.

:::

---

## PCB stack-up and layer allocation

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

## EMC layout philosophy

- **Controlled-impedance CPWG.** The RF input lines are routed as coplanar-waveguide-with-ground: ≈ 1.0 mm trace, 0.2 mm gap to the GNDREF pour, on the 1.6 mm FR-4 stack — targeting 50 Ω (design estimate ≈ 50–52 Ω; exact Z₀ pending field-solver / VNA confirmation).
- **Continuous ground reference.** GNDREF is poured on both copper layers, with dense via stitching (≈ 500 ground vias) forming a perimeter fence and clusters at the transformers and SMA launches. The continuous plane under each transformer follows the TC1-1-13M+ datasheet's grounding guidance.
- **Symmetry.** The two `LISN+` / `LISN−` feeds into each transformer are placed symmetrically; skew between them converts DM↔CM and corrupts the separation the product exists to perform.

## DRC

`kicad-cli` DRC reports **1 cosmetic violation** (silkscreen marking footprints S1/S6 overlapping at a single point) and **0 unconnected / 0 schematic-parity** issues. The silk overlap is bundled with the marking cleanup tracked on the [Tasks](../tasks.md) page.

## References

- J. Wang, F. C. Lee, W. Odendaal, *Characterization, Evaluation, and Design of Noise Separator for Conducted EMI Noise Diagnosis*, IEEE Trans. Power Electronics 20(4), 2005 — the separator method.
- Mini-Circuits, [*TC1-1-13M+*](https://www.minicircuits.com/pdfs/TC1-1-13M+.pdf) — 1:1 50 Ω RF balun, 4.5–3000 MHz; suggested PCB layout.
- EEVblog Forum, [*DIY DM/CM Separator for EMC — LISN Mate*](https://www.eevblog.com/forum/projects/diy-dm-cm-seperator-for-emc-lisn-mate/).
- IEC, [*CISPR 25*](https://webstore.iec.ch/publication/7077) — conducted-emissions measurement band and methods.
