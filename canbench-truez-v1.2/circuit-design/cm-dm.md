---
title: CM & DM Separator
hw_version: v1.1
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]
CANBench TrueZ **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-truez/v1.1/)
:::

The CM & DM separator is the whole job of the TrueZ: it splits the CAN-pair noise signal on `LISN+` / `LISN−` into its **common-mode** and **differential-mode** components, each on a 50 Ω SMA output. Two Mini-Circuits TC1-1-13M+ 1:1 transmission-line baluns do the separation; the DC-blocking caps keep the bus DC out of the analyser, passing only the AC noise spectrum.

<SchematicViewer src="/img/schematics/canbench-truez-v1.2/cm_dm_f4247a75.svg" alt="CM & DM Separator schematic (cm_dm)" />

## Common-mode path (T1)

`LISN+` enters through `R1` (10 Ω damper) to T1 pin 1; `LISN−` through `R2` to T1 pin 4. T1's two 1:1 windings are connected in **series** — pin 3 bridged to pin 6 — so the bridged midpoint sits at the **average (common-mode) potential** of the two lines: a differential swing cancels there, a common-mode swing appears in full. `R5` (49.9 Ω) terminates this common-mode tap to GNDREF, and `C1` (100 nF) AC-couples it to the `CM-25Ω` output. With a 50 Ω analyser, R5 ∥ 50 Ω ≈ **25 Ω** at the node — the faceplate "CM-25Ω" condition.

## Differential-mode path (T2)

`LISN+` enters through `R3` (10 Ω) to T2 pin 1, with T2 pin 3 returned to GNDREF; `LISN−` through `R4` to T2 pin 6. The line-to-line difference is transformed to T2 pin 4, then through `R6` (49.9 Ω series) and `C2` (100 nF DC-block) to the `DM-100Ω` output. In series with a 50 Ω analyser, the 49.9 Ω gives a **100 Ω** measurement condition — the faceplate "DM-100Ω".

The two terminations are deliberately different — a **shunt** for CM, a **series** element for DM — because that is what the Wang–Lee–Odendaal method's CM and DM ports require. The 10 Ω dampers are kept small so they do not disturb the measurement; the output terminations define the impedance environment.

## Components

| Ref | Value | Function |
| --- | --- | --- |
| T1 | TC1-1-13M+ | 1:1 (50 Ω) RF balun, 4.5–3000 MHz. **Common-mode** transformer — windings series-connected; the midpoint is the CM tap. |
| T2 | TC1-1-13M+ | Same part. **Differential-mode** transformer — transforms the LINE+ − LINE− difference to a single-ended output. |
| R1, R2 | 10 Ω | Series dampers in the CM input legs — reduce transformer/cable parasitic peaking and limit surge / hot-plug energy. |
| R3, R4 | 10 Ω | Series dampers in the DM input legs. |
| R5 | 49.9 Ω | Thin-film **shunt** at the CM tap to GNDREF (CM-25Ω termination). |
| R6 | 49.9 Ω | Thin-film **series** element in the DM output path (DM-100Ω termination). |
| C1, C2 | 100 nF / 100 V | DC-blocking / AC-coupling caps to the CM and DM outputs (muRata GCJ188R72A104KA01D). |

## Operating envelope

Design intent, calculated against the V1.2 topology; VNA / golden-prototype confirmation pending.

| Parameter | Value |
| --- | --- |
| CM port effective impedance | ≈ 25 Ω (49.9 Ω ∥ analyser 50 Ω) |
| DM port effective impedance | ≈ 100 Ω (49.9 Ω + analyser 50 Ω) |
| DC-block high-pass corner | ≈ 32 kHz (CM) / ≈ 16 kHz (DM) — well below the useful band |
| Transformer band | 4.5 MHz – 3 GHz; insertion loss ≈ 0.18 dB @4.5 MHz → ≈ 0.68 dB @1 GHz |
| Low-frequency droop | below ≈ 0.5 MHz — corrected with a calibration curve |
| Cross-mode isolation floor | set by transformer balance (0.5 dB amplitude, 2° phase typ) |

The CM-25Ω / DM-100Ω semantics assume a 50 Ω analyser input. The transformer droops at the bottom of the CISPR band; the production intent is a one-time golden-prototype correction curve (see [Tasks](../tasks.md)).

## PCB layout notes

- T1/T2 sit centrally with their R1/R2 and R3/R4 dampers immediately at the feeds; output coupling caps C1/C2 are placed at their respective output SMA launches (≈ 7 mm), symmetrically about the board centreline.
- R5 carries an integrated via that drops the common-mode shunt to the B.Cu GNDREF plane.
- The RF input lines are CPWG (≈ 1.0 mm trace, 0.2 mm gap), GNDREF poured on both layers with dense via stitching; see [Circuit Design overview](./index.md) for the stack-up.

See `pcb_review/cm-dm-layout.md` and `performance_review/cm-dm.md` in the source repository for the per-component coordinate table and the full calculations.

## References

- J. Wang, F. C. Lee, W. Odendaal, *Noise Separator for Conducted EMI Diagnosis*, IEEE TPE 20(4), 2005.
- Mini-Circuits, [*TC1-1-13M+*](https://www.minicircuits.com/pdfs/TC1-1-13M+.pdf).

## Related pages

- [Connectors & Markings](./connectors.md) — the SMA/banana I/O and the faceplate labels.
- [User Manual → Measurement Procedure](../user-manual/measurement-procedure.md) — the operational CM/DM measurement workflow.
