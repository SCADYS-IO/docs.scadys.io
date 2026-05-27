---
title: PCB Markings & Compliance
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — test vessel (~1,000 sea miles)"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]

WTI400 **v1.2** — In service on the test vessel. The silkscreen marks, fiducials, and stackup documented here are as-built on the V1.2 boards deployed on the test vessel. Compliance-mark *content* is locked (the marks correspond to the EU RED 2014/53/EU, FCC Part 15, UKCA, RoHS, and China EFUP regulatory frameworks the WTI400 is targeted at), but final compliance-test confirmation (the test report that authorises affixing the CE / UKCA / FCC marks) is itself a V1.3 milestone — see the V1.3 backlog below.

:::

## Overview

This page documents the PCB-level markings on `pcb_markings.kicad_sch`: the **fiducial markers** that support automated assembly, the **silkscreen marks** that carry product identity and compliance information, and the **PCB stackup** that physically realises the four-layer construction described elsewhere in the docs.

<SchematicViewer src="/img/schematics/wti400-v1.2/pcb_markings_b90e6958.svg" alt="PCB markings schematic — full sheet (silkscreen labels block, fiducials block, PCB stackup block). Zoom and pan freely; per-sub-section zoomed views appear below." />

Three sub-sections on this page, in narrative order:

1. **Silkscreen marks and compliance** — board identity (S1), CE / UKCA / FCC / RoHS / China EFUP compliance marks (S2 / S7 / S4 / S3), Scadys logo (S5), product-documentation QR code (S6), copyright (S8).
2. **Fiducial markers** — four 0.5 mm bare-copper fiducials (FID1–FID4) supporting pick-and-place machine-vision alignment on both sides of the board.
3. **PCB stackup detail** — the layer-by-layer construction, copper weights, dielectric thicknesses, and surface finish.

The fourth engineer-drawn rectangle on this sheet is an empty placeholder.

The WTI400 board outline, mounting-hole positions, and overall mechanical interface match the **shared housing concept** that the WTI400 and MDD400 sister product both fit. Mechanical details live in `WTI400_V1.2.kicad_pcb` and are summarised in the *Mounting and board outline* section below.

---

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

---

## Silkscreen marks and compliance

<SchematicViewer src="/img/schematics/wti400-v1.2/pcb_markings_b90e6958.svg" alt="Silkscreen labels sub-section — board identity (S1), CE mark (S2), RoHS / China EFUP (S3), FCC mark (S4), Scadys logo (S5), QR code (S6), UKCA mark (S7), copyright (S8)." initialFocus="19.05 13.97 127.0 88.9" />

### Functional specification and design objectives

- Carry the regulatory marks required by the target markets — EU RED 2014/53/EU (CE), UK Conformity Assessed (UKCA), FCC Part 15 (USA), RoHS (EU restricted-substances), and China EFUP (Environment Friendly Use Period).
- Carry the manufacturer identity (Scadys logo + copyright) and the product identity (board variant + revision).
- Provide a machine-readable pointer (QR code) from the physical board to the live product documentation.

### How it works

All marks listed below are **silkscreen** unless noted. They sit on the F.Cu (top) and / or B.Cu (bottom) silkscreen layers.

| Ref | Mark | Footprint | Purpose / placement |
|---|---|---|---|
| **S1** | `WTI400_v1.2` board identity | `wti400:Variant` | Board identity in copper for version traceability — survives silkscreen wear |
| **S2** | CE mark | `SILKS:CE_3.5mm` | EU Declaration of Conformity (Directive 2014/53/EU Radio Equipment Directive) — applied after the V1.3 compliance pre-screening |
| **S3** | RoHS + China EFUP | `SILKS:EFUP_RoHS_China_4` | RoHS compliance (EU restricted substances) and China EFUP (Environment Friendly Use Period — "4" = 4-year mark) |
| **S4** | FCC mark | `SILKS:FCC_3.5mm` | FCC Part 15 compliance identifier (US RF emissions). The full FCC ID is carried by the ESP32-S3-WROOM-1 module's own marking (2AC7Z-ESP32S3WROOM1) since the module's pre-certification covers the WTI400's RF emissions |
| **S5** | Scadys logo | `SILKS:scadys_logo_10x10.f-mask` | Manufacturer logo, 10 × 10 mm, F.Mask layer — visible through the soldermask aperture |
| **S6** | Product-docs QR code | `wti400:qr_docs.scadys.io_products_wti400_10` | Machine-readable link from the physical board to the product docs at docs.scadys.io |
| **S7** | UKCA mark | `SILKS:UKCA_3.5mm` | UK Conformity Assessed mark (post-Brexit UK market replacement for CE on UK-only batches) |
| **S8** | Copyright | `SILKS:Copyright` | © 2025 GM Consolidated Holdings Pty Ltd |

**Why FCC ID isn't on the board directly.** The ESP32-S3-WROOM-1 module carries its own FCC ID label on the module itself (visible through the module's metal can window). The board-level FCC mark (S4) is the generic Part 15 compliance identifier; the *device-specific* FCC ID for the WTI400 is the same as the module's because the module's pre-certification covers the device's RF emissions (subject to the antenna keep-out — a physical PCB cutout under the antenna section — documented on the [ESP32 Module](./esp32-module.md) page).

**Why both CE and UKCA marks are present.** Post-Brexit, the UK market requires UKCA rather than CE marking on goods placed on the UK market specifically. The WTI400 carries both so a single fabrication run can serve both EU and UK markets — the compliance test reports themselves are technically equivalent (both based on the same harmonised standards under different statutory instruments).

### Performance review

| Mark | Visible on | Permanence |
|---|---|---|
| S1 board identity | Copper (not silkscreen) | Permanent — copper etch survives field handling and solder wash |
| S2 CE, S4 FCC, S7 UKCA | F.Cu silkscreen | Standard silkscreen — durable in field use, may wear under prolonged direct contact |
| S3 RoHS / EFUP | F.Cu silkscreen | Same |
| S5 Scadys logo | F.Mask aperture | Visible through soldermask opening; very durable |
| S6 QR code | F.Cu silkscreen | Critical that the QR remains legible — survives operator wear under normal helm conditions |
| S8 Copyright | F.Cu silkscreen | Standard silkscreen |

**Field heritage.** The WTI400 V1.2 silkscreen has been in service on the test vessel for approximately 1,000 sea miles. Subjective inspection confirms the marks remain legible after that field exposure (open-deck installation, salt environment, UV exposure). The prior MLI400 V1.0 hardware revision (the WTI400's predecessor — installed on the same test vessel during the circumnavigation) used the same silkscreen process and survived an order of magnitude more sea miles without mark degradation.

### Bring-up tests

1. **QR code resolves to live docs** — Scan S6 with a phone QR reader. Pass if the URL matches the live product-docs URL exactly. The schematic-side `qr_docs.scadys.io_products_wti400_10` footprint reference must match the deployed URL — a typo or path-change here ships a broken QR on the production board.
2. **Compliance-mark legibility** — Photograph each silkscreen mark under typical installation lighting. Pass if all marks are clearly readable at arm's length (Scadys logo, CE, UKCA, FCC, RoHS / EFUP all unambiguous).
3. **Copyright year currency** — Confirm S8 reads the correct year for the production batch. The current silkscreen footprint reads "© 2025" but boards manufactured later may need a year refresh.

---

## Fiducial markers

<SchematicViewer src="/img/schematics/wti400-v1.2/pcb_markings_b90e6958.svg" alt="Fiducial markers sub-section — FID1 / FID2 on F.Cu, FID3 / FID4 on B.Cu (mirrored at the same XY positions), supporting pick-and-place machine-vision alignment." initialFocus="146.05 13.97 127.0 88.9" />

### Functional specification and design objectives

- Provide reference markers for the pick-and-place machine's vision system so it can compensate for board-to-board placement variation and skew.
- Give a wide diagonal baseline (large XY separation) so that small absolute fiducial-detection error translates to a small angular correction error across the whole board.
- Mirror the F.Cu fiducials on B.Cu at the same XY coordinates so single-pass setup works for two-sided assembly.

### How it works

Four 0.5 mm bare-copper fiducial markers (with 1.5 mm soldermask openings) form two mirrored pairs:

| Ref | Layer | Pair |
|---|---|---|
| **FID1** | F.Cu | Front, top-left pair (mirrors with FID3) |
| **FID2** | F.Cu | Front, bottom-right pair (mirrors with FID4) |
| **FID3** | B.Cu | Back, co-located with FID1 |
| **FID4** | B.Cu | Back, co-located with FID2 |

The pattern mirrors the MDD400 sister product's fiducial layout because the two share the same physical board outline (housing-compatible). A wide diagonal baseline between FID1 and FID2 gives the pick-and-place's angular-correction calculation low sensitivity to fiducial-detection noise — a 50 µm placement uncertainty at each fiducial translates to a fraction of a degree of angular correction error, well below the 0.5° typical pick-and-place placement tolerance.

The **mirrored front / back placement** at identical XY coordinates means the same vision-system fixturing can index both sides without re-teaching coordinates — saves setup time on two-sided assembly runs.

### Performance review

| Parameter | Value | Notes |
|---|---|---|
| Fiducial copper diameter | 0.5 mm | Per IPC-7351 Class 2 recommendation |
| Soldermask opening | 1.5 mm | 3× copper diameter — sufficient for vision-system contrast |
| F/B co-location accuracy | 0 µm (by design) | FID1 / FID3 and FID2 / FID4 share the same XY in the .kicad_pcb |
| Vision-system suitability | Confirmed by V1.2 production assembly | Same fiducial pattern used on MDD400 sister product |

### Bring-up tests

1. **Pick-and-place machine vision recognises all four fiducials** — Confirm at the start of each production assembly run that the pick-and-place machine successfully detects FID1–FID4 without manual override. Pass if both F.Cu and B.Cu setups complete without operator intervention. *(Already confirmed for the V1.2 production batch installed on the test vessel.)*

---

## PCB stackup detail

<SchematicViewer src="/img/schematics/wti400-v1.2/pcb_markings_b90e6958.svg" alt="PCB stackup sub-section — 4-layer construction (F.Cu / In1.Cu / In2.Cu / B.Cu) with copper weights and dielectric layers." initialFocus="19.05 102.87 127.0 88.9" />

### Functional specification and design objectives

- Four-layer construction giving two signal layers (F.Cu, B.Cu) and two inner layers (In1.Cu, In2.Cu) for power and ground distribution.
- Inner layers heavier (1 oz / 35 µm) than outer layers (0.5 oz / 17.5 µm) to give low-resistance power planes without inflating the cost of finer signal-layer features.
- Total board thickness of 1.6 mm — standard for marine enclosures and compatible with the panel-mount housing geometry.
- Layer roles change region-by-region across the board so the SMPS, CAN-bus power, wind-LDO, digital, and isolation domains each get the stack-up that suits them.

### How it works

The physical stack-up, from top to bottom:

| Layer | # | Type | Thickness | Dielectric below | Notes |
|---|---|---|---|---|---|
| **F.Cu** | 1 | Signal + plane | 17.5 µm (0.5 oz) | F.Cu prepreg | Component side; carries VCC pour in the digital region, GNDREF moat fills under SMPS / CAN-power / wind-LDO islands |
| **In1.Cu** | 2 | Power plane | 35 µm (1 oz) | Core | Unbroken GNDREF in the digital region (one half of the VCC plane pair); GNDREF moat inside the SMPS island |
| **In2.Cu** | 3 | Power plane | 35 µm (1 oz) | B.Cu prepreg | Unbroken GNDREF in the digital region (other half of the plane pair); domain-dependent fills elsewhere |
| **B.Cu** | 4 | Signal + plane | 17.5 µm (0.5 oz) | — | Back-of-board; carries VCC pour in the digital region (mirrors F.Cu), GNDREF fills under SMPS / CAN-power / wind-LDO islands |

The **VCC – GNDREF – GNDREF – VCC** layer ordering across the digital region creates two distributed VCC↔GNDREF plane-pair capacitors (F.Cu↔In1.Cu and In2.Cu↔B.Cu, each separated by 0.1855 mm prepreg). The plane-pair capacitance is what gives the digital domain GHz-frequency bypass with no parasitic ESL or ESR — see the [Power Supply](./power-supplies.md#in-the-vcc-digital-area) page for the full rationale and the [ESP32 Module](./esp32-module.md) page for the force-commutated discrete-cap topology that hands off to the plane pair above the discrete caps' self-resonance.

In the **SMPS, CAN-bus power, and wind-LDO islands**, all four layers carry GNDREF inside a copper-keepout moat that contains switching return currents.

Across **isolation boundaries** (CAN domain to digital domain; legacy-serial domain to digital domain), all four layers carry copper-free 1.4 mm creepage gaps. The wind-transducer connector also has a copper-free isolation gap up to the FL2 common-mode filter's GND_WIND ↔ GNDREF star point — see the [Wind Interface](./wind-interface.md) page.

### Performance review

The stackup specification has been validated by the V1.2 production assembly and the ~1,000 sea miles of in-service operation on the test vessel. Quantitative impedance / capacitance measurements have not been re-taken explicitly — the in-service performance (Wi-Fi link stability, no observed EMC issues from co-located equipment, no field-failure modes attributable to the stackup) is the empirical confirmation.

---

## Mounting and board outline

The WTI400 V1.2 board has a non-rectangular outline shared with the MDD400 V2.9 sister product (both fit the same housing concept). Board extent:

| Parameter | Value |
|---|---|
| Board outline | Non-rectangular with rounded corners (~2.4 mm radius) and a step on the right-hand edge for the enclosure interface |
| Board extent (KiCAD coordinates) | x: 66.4–161.6 mm, y: 42.4–137.6 mm |
| Mounting hole pattern | Four-corner pattern matching the housing's panel-mount inserts |

Each mounting hole is sized for M3 hardware plus standoffs. The four mounting holes engage the housing's panel-mount inserts; no additional mechanical retention is needed. The same mounting-hole pattern is used on the MDD400 sister product so the two products are interchangeable from a housing-attachment perspective.

The right-side edge step accommodates the wind-transducer connector tab cluster (J4–J9) that protrudes through a dedicated housing aperture — this is the one outline difference of practical consequence between the WTI400 and the MDD400 (which has no transducer-side tabs).

---

## Components

| Ref | Type | Layer | Function | Source |
|---|---|---|---|---|
| S1 | Copper board ID `WTI400_v1.2` | F.Cu copper | Permanent product / variant identifier | `wti400:Variant` footprint |
| S2 | CE silkscreen mark | F.Cu silkscreen | EU RED 2014/53/EU compliance | `SILKS:CE_3.5mm` |
| S3 | RoHS / China EFUP silkscreen | F.Cu silkscreen | EU RoHS + China EFUP (4-year mark) | `SILKS:EFUP_RoHS_China_4` |
| S4 | FCC silkscreen mark | F.Cu silkscreen | FCC Part 15 compliance | `SILKS:FCC_3.5mm` |
| S5 | Scadys logo | F.Mask aperture | Manufacturer identity, 10 × 10 mm | `SILKS:scadys_logo_10x10.f-mask` |
| S6 | Product-docs QR code | F.Cu silkscreen | Machine-readable link to live docs | `wti400:qr_docs.scadys.io_products_wti400_10` |
| S7 | UKCA silkscreen mark | F.Cu silkscreen | UK Conformity Assessed | `SILKS:UKCA_3.5mm` |
| S8 | Copyright silkscreen | F.Cu silkscreen | © 2025 GM Consolidated Holdings Pty Ltd | `SILKS:Copyright` |
| FID1 | Fiducial marker | F.Cu | Pick-and-place vision alignment, top-left pair | 0.5 mm copper, 1.5 mm mask opening |
| FID2 | Fiducial marker | F.Cu | Pick-and-place vision alignment, bottom-right pair | 0.5 mm copper, 1.5 mm mask opening |
| FID3 | Fiducial marker | B.Cu | Mirror of FID1 on the back | 0.5 mm copper, 1.5 mm mask opening |
| FID4 | Fiducial marker | B.Cu | Mirror of FID2 on the back | 0.5 mm copper, 1.5 mm mask opening |

---

## Testing & Verification

:::caution

V1.2 is in service. The marks and fiducials have been validated by the V1.2 production assembly and by the in-service deployment on the test vessel. A few items remain open for the V1.3 production fabrication run.

**Hardware bring-up (already validated on V1.2 production):**

- ~~QR-code URL resolution~~ — Validated on the V1.2 boards in service.
- ~~Compliance-mark legibility~~ — Validated; marks survive open-deck installation.
- ~~Pick-and-place fiducial recognition~~ — Validated through V1.2 production assembly.

**For V1.3 (tracked in `v1.3-improvements.md`):**

- **Compliance test reports** — The CE, UKCA, and FCC marks on the silkscreen indicate the device is designed for compliance with the corresponding standards. The actual *test reports* that authorise affixing those marks are part of the V1.3 compliance pre-screening campaign (CISPR 32 conducted emissions, FCC Part 15 radiated, RED 2014/53/EU harmonised standards, NMEA 2000 conformance). The marks should not be affixed on production boards until the test reports are signed off.
- **Copyright year update** — Refresh S8 to the V1.3 production year if it differs from 2025.
- **Re-scan QR code URL** — Confirm the deployed URL still matches the silkscreen QR on the V1.3 PCB before fabrication.

:::

---

## References

- IPC-A-600: *Acceptability of Printed Boards*.
- IPC-6012: *Qualification and Performance Specification for Rigid Printed Boards*.
- IPC-7351: *Generic Requirements for Surface Mount Design and Land Pattern Standard* (fiducial-marker dimensions).
- EU, [*Radio Equipment Directive (RED) 2014/53/EU*](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32014L0053).
- FCC, [*Part 15 — Radio Frequency Devices*](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15).
- UK Government, [*UKCA Marking*](https://www.gov.uk/guidance/using-the-ukca-marking).
- EU, [*RoHS Directive 2011/65/EU*](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32011L0065).
- China SJ/T 11364-2014, *Marking for the Restricted Use of Hazardous Substances in Electronic and Electrical Products* (EFUP / China RoHS).
- NMEA 2000 Network Specification — IEC 61162-1 / SAE J1939 family.
- [Circuit Design Overview](./index.md) — the system-level stack-up rationale that this page realises physically.
- Sister-product reference: [MDD400 V2.9 PCB Markings & Compliance](/mdd400/v2.9/circuit-design/pcb-markings) — same board outline and stack-up; minor differences in board-identity and QR-code URL.
