---
title: CM & DM Separator
hw_version: v1.1
hw_status: prototype
hw_status_label: "Fabricated prototype — sole built unit (pre-InvenTree)"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/canbench-truez-v1.1/cm_dm_b38eb752.svg" alt="CM & DM Separator schematic (cm_dm)" />

:::note[Hardware version]
CANBench TrueZ **v1.1** — Fabricated prototype, sole built unit. V1.1 is electrically identical to the V1.2 schematic refresh but predates the InvenTree symbol-library migration; the schematic component metadata reflects legacy SCADYS naming. Testing and bench validation reference this V1.1 hardware.

**Other versions:** [v1.2 — schematic refresh (next version)](/canbench-truez/v1.2/)
:::

## Overview

The CM & DM separator is the whole job of the TrueZ: it splits the CAN-pair noise signal on `LISN+` / `LISN−` into its **common-mode** and **differential-mode** components, each on a 50 Ω SMA output. Two Mini-Circuits TC1-1-13M+ 1:1 transmission-line baluns do the separation; the DC-blocking caps keep the bus DC out of the analyser, passing only the AC noise spectrum.

The circuit is the entire `cm_dm` KiCad sheet — the RF heart of the board. It implements the noise-separator method of Wang, Lee & Odendaal (IEEE TPE 2005): sum the two LISN lines for common-mode (T1), difference them for differential-mode (T2), with mode-specific output terminations. TrueZ is the companion to the CANBench Duo DC LISN — the Duo provides the RF coupling, attenuation and front-end protection; TrueZ does only the mode separation.

## Functional specification and design objectives

TrueZ is a **passive, non-powered RF measurement accessory** that separates a CAN-pair conducted-noise signal into its common-mode and differential-mode parts for spectrum-analyser diagnosis (CISPR 25 pre-compliance / EMC bench work). It must split the two LISN lines so the intended mode transfers at near-unity, cross-mode leakage stays low, and the LISN-side source sees a real 50 Ω across the band. The faceplate port semantics assume a 50 Ω analyser input.

| Objective | Target |
| --- | --- |
| CM port termination | ≈ 25 Ω (49.9 Ω shunt ∥ analyser 50 Ω) — faceplate "CM-25Ω" |
| DM port termination | ≈ 100 Ω (49.9 Ω series + analyser 50 Ω) — faceplate "DM-100Ω" |
| Output port impedance | 50 Ω SMA, single-ended |
| Working band | 4.5 MHz – 3 GHz (transformer); CISPR conducted band 150 kHz – 108 MHz |
| Insertion loss | ≈ 0.18 dB @4.5 MHz → ≈ 0.68 dB @1 GHz (per transformer) |
| DC-block high-pass corner | ≈ 32 kHz (CM) / ≈ 16 kHz (DM) — below the useful band |
| Cross-mode isolation floor | set by transformer balance (0.5 dB amplitude, 2° phase typ) |
| RF power / DC handling | abs-max 0.25 W RF, 30 mA DC per transformer |

The CM-25Ω / DM-100Ω semantics are only valid with a 50 Ω analyser input; a high-impedance scope input without a 50 Ω termination invalidates the calibration. The transformer droops at the bottom of the CISPR band (below ≈ 0.5 MHz); the production intent is a one-time golden-prototype correction curve. **That correction curve is currently a *simulated* model, not measured** — see [Gaps & next version](#gaps--next-version).

## CM/DM separation network

### How it works

#### Common-mode path (T1)

`LISN+` enters through `R1` (10 Ω damper) to T1 pin 1; `LISN−` through `R2` to T1 pin 4. T1's two 1:1 windings are connected in **series** — pin 3 bridged to pin 6 — so the bridged midpoint sits at the **average (common-mode) potential** of the two lines: a differential swing cancels there, a common-mode swing appears in full. `R5` (49.9 Ω) terminates this common-mode tap to GNDREF, and `C1` (100 nF) AC-couples it to the `CM-25Ω` output. With a 50 Ω analyser, R5 ∥ 50 Ω ≈ **25 Ω** at the node — the faceplate "CM-25Ω" condition.

#### Differential-mode path (T2)

`LISN+` enters through `R3` (10 Ω) to T2 pin 1, with T2 pin 3 returned to GNDREF; `LISN−` through `R4` to T2 pin 6. The line-to-line difference is transformed to T2 pin 4, then through `R6` (49.9 Ω series) and `C2` (100 nF DC-block) to the `DM-100Ω` output. In series with a 50 Ω analyser, the 49.9 Ω gives a **100 Ω** measurement condition — the faceplate "DM-100Ω".

The two terminations are deliberately different — a **shunt** for CM, a **series** element for DM — because that is what the Wang–Lee–Odendaal method's CM and DM ports require. The 10 Ω dampers are kept small so they do not disturb the measurement; the output terminations define the impedance environment.

### Performance

Design intent, calculated against the V1.1 topology; VNA / golden-prototype confirmation pending.

| Parameter | Value |
| --- | --- |
| CM port effective impedance | ≈ 25 Ω (49.9 Ω ∥ analyser 50 Ω) |
| DM port effective impedance | ≈ 100 Ω (49.9 Ω + analyser 50 Ω) |
| DC-block high-pass corner | ≈ 32 kHz (CM) / ≈ 16 kHz (DM) — well below the useful band |
| Transformer band | 4.5 MHz – 3 GHz; insertion loss ≈ 0.18 dB @4.5 MHz → ≈ 0.68 dB @1 GHz |
| Low-frequency droop | below ≈ 0.5 MHz — corrected with a calibration curve |
| Cross-mode isolation floor | set by transformer balance (0.5 dB amplitude, 2° phase typ) |

The CM-25Ω / DM-100Ω semantics assume a 50 Ω analyser input. The transformer droops at the bottom of the CISPR band; the production intent is a one-time golden-prototype correction curve.

## PCB Layout

- T1/T2 sit centrally with their R1/R2 and R3/R4 dampers immediately at the feeds; output coupling caps C1/C2 are placed at their respective output SMA launches (≈ 7 mm), symmetrically about the board centreline.
- R5 carries an integrated via that drops the common-mode shunt to the B.Cu GNDREF plane; the DM path (R6 series → C2) carries no shunt, matching the asymmetric Wang–Lee–Odendaal terminations.
- The RF input lines are CPWG (≈ 1.0 mm trace, 0.2 mm gap), GNDREF poured on both layers with dense via stitching (≈ 498 vias forming a perimeter fence and clustering at the SMA launches and transformers); see [Circuit Design overview](./index.md) for the stack-up.
- The `LISN+` / `LISN−` input pair is placed symmetrically (mirrored ±15 mm about the Y centreline), with 6× ground-PTH stitching per transformer per the TC1-1-13M+ suggested layout. All SMA shields and the J1 banana land on the single GNDREF.

## Components

| Ref | Value | Function | Datasheet |
| --- | --- | --- | --- |
| T1 | TC1-1-13M+ | 1:1 (50 Ω) RF balun, 4.5–3000 MHz. **Common-mode** transformer — windings series-connected; the midpoint is the CM tap. | [Mini-Circuits](https://www.minicircuits.com/pdfs/TC1-1-13M+.pdf) |
| T2 | TC1-1-13M+ | Same part. **Differential-mode** transformer — transforms the LINE+ − LINE− difference to a single-ended output. | [Mini-Circuits](https://www.minicircuits.com/pdfs/TC1-1-13M+.pdf) |
| R1, R2 | 10 Ω | Series dampers in the CM input legs — reduce transformer/cable parasitic peaking and limit surge / hot-plug energy. | [Yageo RC](https://yageogroup.com/content/datasheet/asset/file/PYU-RC_GROUP_51_ROHS_L) |
| R3, R4 | 10 Ω | Series dampers in the DM input legs. | [Yageo RC](https://yageogroup.com/content/datasheet/asset/file/PYU-RC_GROUP_51_ROHS_L) |
| R5 | 49.9 Ω | Thin-film **shunt** at the CM tap to GNDREF (CM-25Ω termination). | [YAGEO RT0603](https://www.lcsc.com/datasheet/C861434.pdf) |
| R6 | 49.9 Ω | Thin-film **series** element in the DM output path (DM-100Ω termination). | [YAGEO RT0603](https://www.lcsc.com/datasheet/C861434.pdf) |
| C1, C2 | 100 nF / 100 V | DC-blocking / AC-coupling caps to the CM and DM outputs (muRata GCJ188R72A104KA01D). | [muRata](https://www.lcsc.com/datasheet/C161117.pdf) |

## Gaps & next version

**Before next production run**

- Confirm the `LISN+` / `LISN−` routed trace-length match — the input feeds are symmetric by placement, but a minor 1.27 mm X-offset at the T2 feed remains; full DM/CM balance depends on routed-length equality and should be verified if low cross-mode leakage is critical.

**Next version**

- Measure CM/DM transfer, insertion loss and cross-mode isolation/leakage across the CISPR band on a golden prototype (VNA / tracking generator). **The low-end correction curve is currently a *simulated* model, not measured** — do not publish the simulated corner figures as characterised performance until measured.
- Confirm the exact CPWG Z₀ (field solver / TDR); the geometry targets 50 Ω with an estimate of ≈ 50–52 Ω.
- Confirm the amplitude/phase-unbalance-driven isolation floor (0.5 dB / 2°) against the assembled board's measured isolation.

## References

- J. Wang, F. C. Lee, W. Odendaal, *Characterization, Evaluation, and Design of Noise Separator for Conducted EMI Noise Diagnosis*, IEEE TPE 20(4), 2005.
- Mini-Circuits, [*TC1-1-13M+*](https://www.minicircuits.com/pdfs/TC1-1-13M+.pdf).
- IEC, *CISPR 25* — conducted-emissions limits / methods.

## Related pages

- [Connectors & Markings](./connectors.md) — the SMA/banana I/O and the faceplate labels.
- [User Manual → Measurement Procedure](../user-manual/measurement-procedure.md) — the operational CM/DM measurement workflow.
