---
title: PCB Markings & Compliance
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — bench testing"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/pcb_markings_c0beb6b5.svg" alt="PCB markings schematic — full sheet (silkscreen labels block, fiducials block, PCB stackup block). Zoom and pan freely; per-sub-section zoomed views appear below." />

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype. The silkscreen marks, fiducials, and stackup documented here are as-built on the V2.9 prototype boards. Compliance-mark *content* is locked (the marks themselves correspond to the EU RED 2014/53/EU, FCC Part 15, UKCA, RoHS, and China EFUP regulatory frameworks the MDD400 is targeted at), but final compliance-test confirmation (the test report that authorises affixing the CE / UKCA / FCC marks) is itself a V2.10 milestone — see the V2.10 backlog below.

:::

## Overview

This page documents the PCB-level markings on `pcb_markings.kicad_sch`: the **fiducial markers** that support automated assembly, the **silkscreen marks** that carry product identity and compliance information, and the **PCB stackup** that physically realises the four-layer construction described elsewhere in the docs.

Three sub-sections on this page, in narrative order:

1. **Silkscreen marks and compliance** — board identity (S1), CE / UKCA / FCC / RoHS / China EFUP compliance marks (S2 / S7 / S4 / S3), Scadys logo (S5), product-documentation QR code (S6), copyright (S8).
2. **Fiducial markers** — four 0.5 mm bare-copper fiducials (FID1–FID4) supporting pick-and-place machine-vision alignment on both sides of the board.
3. **PCB stackup detail** — the layer-by-layer construction, copper weights, dielectric thicknesses, and surface finish.

The fourth engineer-drawn rectangle on this sheet is an empty placeholder.

Some board-level mechanical details (board outline, mounting hole positions) live in the `MDD400_V2.9.kicad_pcb` file rather than on `pcb_markings.kicad_sch` — they're summarised in the *Mounting and board outline* section below.

## Functional specification and design objectives

The board markings, fiducials, and stackup must:

- carry the regulatory marks required by the target markets — EU RED 2014/53/EU (CE), UK Conformity Assessed (UKCA), FCC Part 15 (USA), RoHS (EU restricted-substances), and China EFUP (Environment Friendly Use Period);
- carry the manufacturer identity (Scadys logo + copyright) and the product identity (board variant + revision), with the variant / revision in copper for wear-resistant traceability;
- provide a machine-readable pointer (QR code) from the physical board to the live product documentation;
- provide reference markers for the pick-and-place machine's vision system so it can compensate for board-to-board placement variation and skew, with a wide diagonal baseline so small absolute fiducial-detection error translates to a small angular correction error across the whole board;
- mirror the F.Cu fiducials on B.Cu at the same XY coordinates so single-pass setup works for two-sided assembly;
- realise a four-layer construction giving two signal layers (F.Cu, B.Cu) and two inner layers (In1.Cu, In2.Cu) for power and ground distribution, with inner layers heavier (1 oz / 35 µm) than outer layers (0.5 oz / 17.5 µm) for low-resistance power planes; and
- hold a total board thickness of 1.6 mm — standard for marine enclosures and compatible with the panel-mount housing geometry — while letting layer roles change region-by-region so the SMPS, CAN-bus power, digital, and isolation domains each get a stack-up that suits them.

## Board specification

| Parameter | Value |
|---|---|
| PCB dimensions | 95.2 × 95.2 mm (non-rectangular outline — see *Mounting and board outline* below) |
| Board thickness | 1.6 mm |
| Layer count | 4 (F.Cu / In1.Cu / In2.Cu / B.Cu) |
| Copper weight | 17.5 µm (0.5 oz) — F.Cu, B.Cu; 35 µm (1 oz) — In1.Cu, In2.Cu |
| Surface finish | ENIG (Electroless Nickel Immersion Gold) |
| Solder mask | Navy blue, both sides; 0.012 mm thickness; pad-to-mask clearance 0.075 mm |
| Min trace / space | Per design rules in the KiCAD project |
| Manufacturing class | IPC-6012 Class 2 |

## Silkscreen marks and compliance

<SchematicViewer src="/img/schematics/mdd400-v2.9/pcb_markings_c0beb6b5.svg" alt="Silkscreen labels sub-section — board identity (S1), CE mark (S2), RoHS / China EFUP (S3), FCC mark (S4), Scadys logo (S5), QR code (S6), UKCA mark (S7), copyright (S8)." initialFocus="19.05 13.97 127.0 88.9" />

All marks listed below are **silkscreen** unless noted. They sit on the F.Cu (top) and / or B.Cu (bottom) silkscreen layers.

| Ref | Mark | Footprint | Purpose / placement |
|---|---|---|---|
| **S1** | `MDD400_v2.9` board identity | `mdd400:Variant` | Board identity in copper for version traceability — survives silkscreen wear |
| **S2** | CE mark | `SILKS:CE_3.5mm` | EU Declaration of Conformity (Directive 2014/53/EU Radio Equipment Directive) — applied after the V2.10 compliance pre-screening |
| **S3** | RoHS + China EFUP | `SILKS:EFUP_RoHS_China_4` | RoHS compliance (EU restricted substances) and China EFUP (Environment Friendly Use Period — "4" = 4-year mark) |
| **S4** | FCC mark | `SILKS:FCC_3.5mm` | FCC Part 15 compliance identifier (US RF emissions). The full FCC ID is carried by the ESP32-S3-WROOM-1 module's own marking (2AC7Z-ESP32S3WROOM1) since the module's pre-certification covers the MDD400's RF emissions |
| **S5** | Scadys logo | `SILKS:scadys_logo_10x10.f-mask` | Manufacturer logo, 10 × 10 mm, F.Mask layer — visible through the soldermask aperture |
| **S6** | Product-docs QR code | `mdd400:qr_docs.scadys.io_products_mdd400_10` | Machine-readable link from the physical board to the product docs at docs.scadys.io |
| **S7** | UKCA mark | `SILKS:UKCA_3.5mm` | UK Conformity Assessed mark (post-Brexit UK market replacement for CE on UK-only batches) |
| **S8** | Copyright | `SILKS:Copyright` | © 2025 GM Consolidated Holdings Pty Ltd |

**Why FCC ID isn't on the board directly.** The ESP32-S3-WROOM-1 module carries its own FCC ID label on the module itself (visible through the module's metal can window). The board-level FCC mark (S4) is the generic Part 15 compliance identifier; the *device-specific* FCC ID for the MDD400 is the same as the module's because the module's pre-certification covers the device's RF emissions (subject to the antenna keep-out documented on the [ESP32 Module](./esp32-module.md) page).

**Why both CE and UKCA marks are present.** Post-Brexit, the UK market requires UKCA rather than CE marking on goods placed on the UK market specifically. The MDD400 carries both so a single fabrication run can serve both EU and UK markets — the compliance test reports themselves are technically equivalent (both based on the same harmonised standards under different statutory instruments).

**Mark permanence.**

| Mark | Visible on | Permanence |
|---|---|---|
| S1 board identity | Copper (not silkscreen) | Permanent — copper etch survives field handling and solder wash |
| S2 CE, S4 FCC, S7 UKCA | F.Cu silkscreen | Standard silkscreen — durable in field use, may wear under prolonged direct contact |
| S3 RoHS / EFUP | F.Cu silkscreen | Same |
| S5 Scadys logo | F.Mask aperture | Visible through soldermask opening; very durable |
| S6 QR code | F.Cu silkscreen | Critical that the QR remains legible — survives operator wear under normal helm conditions |
| S8 Copyright | F.Cu silkscreen | Standard silkscreen |

## Fiducial markers

<SchematicViewer src="/img/schematics/mdd400-v2.9/pcb_markings_c0beb6b5.svg" alt="Fiducial markers sub-section — FID1 / FID2 on F.Cu, FID3 / FID4 on B.Cu (mirrored at the same XY positions), supporting pick-and-place machine-vision alignment." initialFocus="146.05 13.97 127.0 88.9" />

Four 0.5 mm bare-copper fiducial markers (with 1.5 mm soldermask openings) form two mirrored pairs:

| Ref | Layer | Position (mm) | Pair |
|---|---|---|---|
| **FID1** | F.Cu | (71.0, 47.0) | Front, top-left pair (mirrors with FID3) |
| **FID2** | F.Cu | (157.0, 133.0) | Front, bottom-right pair (mirrors with FID4) |
| **FID3** | B.Cu | (71.0, 47.0) | Back, co-located with FID1 |
| **FID4** | B.Cu | (157.0, 133.0) | Back, co-located with FID2 |

The diagonal between FID1 / FID2 centres is √(86² + 86²) ≈ **121.6 mm** — a wide baseline that gives the pick-and-place's angular-correction calculation low sensitivity to fiducial-detection noise. A 50 µm placement uncertainty at each fiducial translates to roughly ±0.024° of angular correction error — well below the 0.5° typical pick-and-place placement tolerance.

The **mirrored front / back placement** at identical XY coordinates means the same vision-system fixturing can index both sides without re-teaching coordinates — saves setup time on two-sided assembly runs.

| Parameter | Value | Notes |
|---|---|---|
| Fiducial copper diameter | 0.5 mm | Per IPC-7351 Class 2 recommendation |
| Soldermask opening | 1.5 mm | 3× copper diameter — sufficient for vision-system contrast |
| Diagonal baseline (FID1 → FID2) | ~121.6 mm | Wide baseline → low angular-error sensitivity |
| F/B co-location accuracy | 0 µm (by design) | FID1 / FID3 and FID2 / FID4 share the same XY in the .kicad_pcb |
| Vision-system suitability | Confirmed by prior production runs | Same fiducial pattern used on prior MDD400 hardware revisions through pick-and-place assembly |

## PCB stackup detail

<SchematicViewer src="/img/schematics/mdd400-v2.9/pcb_markings_c0beb6b5.svg" alt="PCB stackup sub-section — 4-layer construction (F.Cu / In1.Cu / In2.Cu / B.Cu) with copper weights and dielectric layers." initialFocus="19.05 102.87 127.0 88.9" />

The physical stack-up, from top to bottom:

| Layer | # | Type | Thickness | Dielectric below | Notes |
|---|---|---|---|---|---|
| **F.Cu** | 1 | Signal + plane | 17.5 µm (0.5 oz) | F.Cu prepreg | Component side; carries VCC pour in the digital region, GNDREF moat fills under SMPS / CAN-power / isolation islands |
| **In1.Cu** | 2 | Power plane | 35 µm (1 oz) | Core | Unbroken GNDREF in the digital region (one half of the VCC plane pair); GNDREF moat inside the SMPS island |
| **In2.Cu** | 3 | Power plane | 35 µm (1 oz) | B.Cu prepreg | Unbroken GNDREF in the digital region (other half of the plane pair); domain-dependent fills elsewhere |
| **B.Cu** | 4 | Signal + plane | 17.5 µm (0.5 oz) | — | Back-of-board; carries VCC pour in the digital region (mirrors F.Cu), GNDREF fills under SMPS / CAN-power / isolation islands |

The **VCC – GNDREF – GNDREF – VCC** layer ordering across the digital region creates two distributed VCC↔GNDREF plane-pair capacitors (F.Cu↔In1.Cu and In2.Cu↔B.Cu, each separated by 0.1855 mm prepreg). The plane-pair capacitance is what gives the digital domain GHz-frequency bypass with no parasitic ESL or ESR — see the [Power Supplies](./power-supplies.md) page for the full rationale and the [ESP32 Module](./esp32-module.md) page for the force-commutated discrete-cap topology that hands off to the plane pair above the discrete caps' self-resonance.

In the **SMPS and CAN-bus power islands**, all four layers carry GNDREF inside a copper-keepout moat that contains switching return currents.

Across **isolation boundaries** (CAN domain to digital domain; legacy-serial domain to digital domain), all four layers carry copper-free 1.4 mm creepage gaps.

The stackup specification has been validated by prior MDD400 hardware revisions in production through pick-and-place assembly. No quantitative impedance / capacitance measurements have been re-taken on V2.9 specifically — see the V2.10 backlog.

## Mounting and board outline

The MDD400 V2.9 board has a non-rectangular outline shared with the WTI400 V1.2 sister product (both fit the same housing concept). Board extent and mounting-hole pattern:

| Parameter | Value |
|---|---|
| Board outline | Non-rectangular with rounded corners (~2.4 mm radius) and a step on the right-hand edge for the enclosure interface |
| Board extent (KiCAD coordinates) | x: 66.4–161.6 mm, y: 42.4–137.6 mm |
| Mounting hole pattern | 60.2 × 89.2 mm rectangular pattern |

| Hole position (mm) | Location |
|---|---|
| (83.9, 45.4) | Top-left corner |
| (83.9, 134.6) | Bottom-left corner |
| (144.1, 45.4) | Top-right corner |
| (144.1, 134.6) | Bottom-right corner |

Each hole has a 4.065 mm courtyard radius — consistent with M3 hardware plus standoffs. The four mounting holes engage the housing's panel-mount inserts; no additional mechanical retention is needed.

## PCB Layout

The board is a 4-layer stack-up (F.Cu / In1.Cu / In2.Cu / B.Cu) of 1.6 mm total thickness on FR4 (ε_r 4.5, prepreg 0.1855 mm, core 1.1 mm), with ENIG finish and dark-blue epoxy solder mask plus white direct-print silkscreen on both sides. F.Cu and B.Cu are the signal / component layers; In1.Cu and In2.Cu are dedicated GNDREF power planes carrying a solid ground pour beneath the entire SMPS region (the "VST" zone, 66.4–88.3 × 42.4–82.8 mm), giving a low-impedance return and EMI shielding between the switching converters on F.Cu and any signals on B.Cu.

- **Grounding / via stitching.** 195 GNDREF vias (0.3 mm drill) in the SMPS area (x 70–90, y 45–85 mm) stitch the F.Cu GNDREF pour to the In1.Cu and In2.Cu planes; all 1081 board vias use a uniform 0.3 mm drill / 0.6 mm size (0.15 mm annular ring).
- **Converter isolation.** Each buck converter (U1, U6) is enclosed by a 0.4 mm copper-keepout moat on F.Cu + In1.Cu + In2.Cu so no external pour enters the cell; SW nodes are copper pours (not traces) to minimise inductance; ferrite beads FB1 / FB2 at x = 89 mm and FB4 at (71.1, 82.9) are the sole HF connections between the SMPS copper and the digital VCC / VDD and CAN domains.
- **Mask / silkscreen.** Pad-to-mask clearance is 0.075 mm; soldermask is tented front and back; soldermask min width is not explicitly set (KiCAD default applies). Silkscreen marks and fiducials sit on these mask / silk layers — fiducials are bare-copper apertures in the mask for vision contrast.
- **DRC.** The configured-rule DRC (KiCAD 10.0.1, default constraints) returns 0 violations, 0 unconnected items, 0 schematic-parity errors. Zone refill was not re-run from the CLI (`--refill-zones` unavailable in this build) — a GUI refill is recommended before tape-out.

## Components

| Ref | Type | Layer | Function | Source |
|---|---|---|---|---|
| S1 | Copper board ID `MDD400_v2.9` | F.Cu copper | Permanent product / variant identifier | `mdd400:Variant` footprint |
| S2 | CE silkscreen mark | F.Cu silkscreen | EU RED 2014/53/EU compliance | `SILKS:CE_3.5mm` |
| S3 | RoHS / China EFUP silkscreen | F.Cu silkscreen | EU RoHS + China EFUP (4-year mark) | `SILKS:EFUP_RoHS_China_4` |
| S4 | FCC silkscreen mark | F.Cu silkscreen | FCC Part 15 compliance | `SILKS:FCC_3.5mm` |
| S5 | Scadys logo | F.Mask aperture | Manufacturer identity, 10 × 10 mm | `SILKS:scadys_logo_10x10.f-mask` |
| S6 | Product-docs QR code | F.Cu silkscreen | Machine-readable link to live docs | `mdd400:qr_docs.scadys.io_products_mdd400_10` |
| S7 | UKCA silkscreen mark | F.Cu silkscreen | UK Conformity Assessed | `SILKS:UKCA_3.5mm` |
| S8 | Copyright silkscreen | F.Cu silkscreen | © 2025 GM Consolidated Holdings Pty Ltd | `SILKS:Copyright` |
| FID1 | Fiducial marker | F.Cu | Pick-and-place vision alignment, top-left pair | 0.5 mm copper, 1.5 mm mask opening |
| FID2 | Fiducial marker | F.Cu | Pick-and-place vision alignment, bottom-right pair | 0.5 mm copper, 1.5 mm mask opening |
| FID3 | Fiducial marker | B.Cu | Mirror of FID1 on the back | 0.5 mm copper, 1.5 mm mask opening |
| FID4 | Fiducial marker | B.Cu | Mirror of FID2 on the back | 0.5 mm copper, 1.5 mm mask opening |

## Testing & Verification

:::caution

V2.9 is a fabricated prototype. The marks and fiducials are present on the prototype board, but a few items need verification before the V2.10 production fabrication run.

**Hardware bring-up (rig at the bench):**

- **QR-code URL resolution** — Scan S6 with a phone QR reader. Pass if the resolved URL matches the live docs URL exactly. *(Earlier MDD400 hardware revisions had a `docs.scadys.com` → `docs.scadys.io` URL transition; the V2.9 schematic footprint reads `docs.scadys.io` but verify on the as-fabricated board.)*
- **Compliance-mark legibility** — Photograph each silkscreen mark under typical helm-position lighting. Pass if all marks (Scadys logo, CE, UKCA, FCC, RoHS / EFUP) are clearly readable and unambiguous at arm's length.
- **Copyright year currency** — Confirm S8 reads the correct year for the production batch. Pass if it reads "© 2025" on the V2.9 prototype; refresh for later batches.
- **Pick-and-place fiducial recognition** — Confirm at the start of the assembly run that the pick-and-place machine detects FID1–FID4. Pass if both F.Cu and B.Cu setups complete without operator override.

:::

## Gaps & next version

**Before next production run**

- **Solder mask min width** — Not explicitly set in the KiCAD setup block, so the default applies. Confirm with the fab house against the 0.012 mm mask thickness specified in the stackup.
- **Finished copper weight** — F.Cu / B.Cu are 0.0175 mm = 18 µm (≈ ½ oz) starting weight; ENIG adds a negligible ~0.075–0.12 µm Au. If the fab requires a minimum *finished* copper weight, confirm 0.5 oz + plating meets the requirement for the 1 A converter current.
- **DRC zone refill** — DRC ran on the existing filled zones; the CLI build lacks `--refill-zones`. Run a manual zone refill in the KiCAD GUI before tape-out to confirm no fill changes.
- **Re-scan QR code URL** — Confirm the deployed docs URL still matches the silkscreen QR (S6) on the V2.10 PCB before fabrication.

**Next version (V2.10)**

- **Compliance test reports** — The CE, UKCA, and FCC silkscreen marks indicate design intent only. The actual test reports that authorise affixing those marks are part of the V2.10 compliance pre-screening campaign (CISPR 32 conducted emissions, FCC Part 15 radiated, RED 2014/53/EU harmonised standards). The marks must not be affixed on production boards until the reports are signed off.
- **Copyright year update** — Refresh S8 to the V2.10 production year if it differs from 2025.
- **Stackup re-validation** — No quantitative impedance / plane-pair-capacitance measurements have been taken on V2.9 specifically; re-validate against the prior-revision production data if the stack-up changes.

## References

- IPC-A-600: *Acceptability of Printed Boards*.
- IPC-6012: *Qualification and Performance Specification for Rigid Printed Boards*.
- IPC-7351: *Generic Requirements for Surface Mount Design and Land Pattern Standard* (fiducial-marker dimensions).
- EU, [*Radio Equipment Directive (RED) 2014/53/EU*](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32014L0053).
- FCC, [*Part 15 — Radio Frequency Devices*](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15).
- UK Government, [*UKCA Marking*](https://www.gov.uk/guidance/using-the-ukca-marking).
- EU, [*RoHS Directive 2011/65/EU*](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32011L0065).
- China SJ/T 11364-2014, *Marking for the Restricted Use of Hazardous Substances in Electronic and Electrical Products* (EFUP / China RoHS).

## Related pages

- [Power Supplies](./power-supplies.md) — the SMPS converters and VCC plane-pair this stack-up physically realises
- [ESP32 Module](./esp32-module.md) — the RF module whose pre-certification covers the board-level FCC mark, plus its antenna keep-out
- [Circuit Design Overview](./index.md) — the system-level stack-up rationale that this page realises physically
- Sister-product reference: [WTI400 V1.2 PCB Markings & Compliance](/wti400/v1.2/circuit-design/pcb-markings) — same board outline and stack-up; minor differences in board-identity and QR-code URL
