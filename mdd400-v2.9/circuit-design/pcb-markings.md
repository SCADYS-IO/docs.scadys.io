---
title: PCB Markings & Compliance
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/pcb_markings_1b3751c0.svg" alt="PCB Markings schematic" />

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype — testing phase

:::

## Board Specification

| Parameter | Value |
|---|---|
| PCB dimensions | ~95.2 × 95.2 mm (non-rectangular — see Board Outline below) |
| Board thickness | 1.6 mm |
| Layer count | 4 (F.Cu / In1.Cu / In2.Cu / B.Cu) |
| Copper weight | 17.5 µm (F.Cu, B.Cu); 35 µm (In1.Cu, In2.Cu) |
| Surface finish | ENIG (Electroless Nickel Immersion Gold) |
| Solder mask | Navy blue, both sides; 0.012 mm thickness; pad-to-mask clearance 0.075 mm |
| Min trace / space | Per design rules in KiCAD project |
| Inner layers | In1.Cu — power plane; In2.Cu — power plane |

## Board Outline

The PCB has a non-rectangular outline with rounded corners (radius ~2.4 mm) and a step on the right-hand edge to accommodate the enclosure geometry. The board extent spans approximately 66.4–161.6 mm in X and 42.4–137.6 mm in Y in KiCAD board coordinates.

The right side of the board has a notch/step between the upper and lower sections, visible in the edge-cut profile. This is a mechanical feature of the enclosure interface.

## Mounting Holes

Four mounting holes are positioned symmetrically on the board for panel or enclosure mounting. Courtyard boundaries are 4.065 mm radius at each hole centre (consistent with M3 hardware with standoffs).

| Reference | Position (mm) | Location |
|---|---|---|
| Top-left | (83.9, 45.4) | Top-left corner |
| Bottom-left | (83.9, 134.6) | Bottom-left corner |
| Top-right | (144.1, 45.4) | Top-right corner |
| Bottom-right | (144.1, 134.6) | Bottom-right corner |

Mounting hole pattern: 60.2 mm horizontal spacing × 89.2 mm vertical spacing.

## Fiducial Markers

Four fiducial markers (0.5 mm bare copper, 1.5 mm soldermask opening) support pick-and-place machine vision alignment on both sides of the board.

| Ref | Layer | Position (mm) | Note |
|---|---|---|---|
| FID1 | F.Cu | (71.0, 47.0) | Front, top-left pair |
| FID2 | F.Cu | (157.0, 133.0) | Front, bottom-right pair |
| FID3 | B.Cu | (71.0, 47.0) | Back, co-located with FID1 |
| FID4 | B.Cu | (157.0, 133.0) | Back, co-located with FID2 |

FID1/FID3 and FID2/FID4 form mirrored front/back pairs at the same XY coordinates. Diagonal spacing between fiducial pair centres: √(86² + 86²) ≈ 121.6 mm, providing a wide baseline for accurate pick-and-place angular correction.

## Silkscreen Marks

All marks listed below are silkscreen (non-copper) unless noted.

| Ref | Mark | Footprint | Purpose |
|---|---|---|---|
| S1 | `MDD400_v2.9` | `mdd400:Variant` | Board identity in copper — version traceability |
| S2 | CE Mark | `SILKS:CE_3.5mm` | EU Declaration of Conformity (Directive 2014/53/EU RED) |
| S3 | RoHS | `SILKS:EFUP_RoHS_China_4` | RoHS compliance and China EFUP (Environment Friendly Use Period) mark |
| S4 | FCC | `SILKS:FCC_3.5mm` | FCC Part 15 compliance identifier |
| S5 | SCADYS Logo | `SILKS:scadys_logo_10x10.f-mask` | Manufacturer logo, 10 × 10 mm, F.Mask |
| S6 | QR Code | `mdd400:qr_docs.scadys.io_products_mdd400_10` | Links to product documentation |
| S7 | UKCA Mark | `SILKS:UKCA_3.5mm` | UK Conformity Assessed mark (post-Brexit UK market) |
| S8 | Copyright | `SILKS:Copyright` | © 2025 GM Consolidated Holdings Pty Ltd |

## PCB Stackup Detail

| Layer | Name | Role | Thickness (µm) |
|---|---|---|---|
| 1 | F.Cu | Top signal layer | 17.5 |
| — | F.Cu prepreg | — | — |
| 2 | In1.Cu | Power plane | 35 |
| — | Core | — | — |
| 3 | In2.Cu | Power plane | 35 |
| — | B.Cu prepreg | — | — |
| 4 | B.Cu | Bottom signal layer | 17.5 |

The two inner copper planes (In1.Cu, In2.Cu) carry the primary power distribution for the board's isolated voltage domains. Signal routing is confined to F.Cu and B.Cu. The 4-layer stack provides low-impedance power delivery and a ground return plane for controlled-impedance signal traces.

:::caution

Verification required — Fabricated prototype — testing phase

**Verify during bring-up:**
- **QR code URL**: Confirm the QR code (S6) resolves to the correct live documentation URL (`docs.scadys.io/mdd400/v2.9`). The schematic lists `docs.scadys.com/mdd400` — verify the redirect or the printed URL is correct before mass production.
- **Copyright year**: S8 reads "© 2025" on a board dated 2026-05-04. Confirm whether the year should be updated before the next PCB fabrication run.
- **Fiducial recognition**: Confirm pick-and-place machine vision correctly recognises FID1–FID4 at (71.0, 47.0) and (157.0, 133.0) on both F.Cu and B.Cu before full production assembly.

:::

## References

- IPC-A-600: *Acceptability of Printed Boards*
- IPC-6012: *Qualification and Performance Specification for Rigid Printed Boards*
- EU, [*Radio Equipment Directive (RED) 2014/53/EU*](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32014L0053)
- FCC, [*Part 15 — Radio Frequency Devices*](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15)
