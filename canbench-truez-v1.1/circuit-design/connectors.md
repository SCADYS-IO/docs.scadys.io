---
title: Connectors & Markings
hw_version: v1.1
hw_status: prototype
hw_status_label: "Fabricated prototype — sole built unit (pre-InvenTree)"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/canbench-truez-v1.1/cm_dm_b38eb752.svg" alt="Connectors schematic (cm_dm sheet) — full view" />

:::note[Hardware version]
CANBench TrueZ **v1.1** — Fabricated prototype, sole built unit. V1.1 is electrically identical to the V1.2 schematic refresh but predates the InvenTree symbol-library migration; the schematic component metadata reflects legacy SCADYS naming. Testing and bench validation reference this V1.1 hardware.

**Other versions:** [v1.2 — schematic refresh (next version)](/canbench-truez/v1.2/)
:::

## Overview

This page covers the board's external interface and its PCB markings. In V1.1 the connectors are drawn on the `cm_dm` KiCad sheet; the silkscreen / compliance markings are on the `silks` sheet.

The interface is five connectors: two SMA inputs (J2/J3), two SMA outputs (J4/J5), and one GNDREF banana (J1). All four RF ports are 50 Ω edge-mount SMA jacks; the banana is a Keystone 1211 quick-connect terminal. All signal processing happens on the CM & DM separator — this interface only presents the net endpoints at the connectors.

## Functional specification and design objectives

The connector and marking set must:

- present the two LISN input lines (`RF_LISN_LINE+` / `RF_LISN_LINE−`) from the CANBench Duo on two 50 Ω SMA jacks;
- present the two separator outputs — common-mode (`RF_LISN_CM`) and differential-mode (`RF_LISN_DM`) — on two 50 Ω SMA jacks, each compatible with a 50 Ω analyser input;
- maintain 50 Ω controlled impedance on all four SMA centre nets and a continuous GNDREF reference across every shield;
- provide a single GNDREF banana for analyser / probe ground reference; and
- carry the standard SCADYS regulatory and identification markings as graphical silkscreen with no electrical function.

## Connectors

<SchematicViewer src="/img/schematics/canbench-truez-v1.1/cm_dm_b38eb752.svg" alt="Connectors — J2/J3 SMA inputs, J4/J5 SMA outputs, J1 GNDREF banana on the cm_dm sheet. Zoom out to see the full sheet." />

| Ref | Type | Faceplate label | Role |
| --- | --- | --- | --- |
| J2 | Edge SMA (BWSMA-KE11), 50 Ω | **LISN+** | Input — positive LISN line (`RF_LISN_LINE+`) from the CANBench Duo |
| J3 | Edge SMA, 50 Ω | **LISN−** | Input — negative LISN line (`RF_LISN_LINE−`) |
| J4 | Edge SMA, 50 Ω | **CM-25Ω** | Output — common-mode component (`RF_LISN_CM`) |
| J5 | Edge SMA, 50 Ω | **DM-100Ω** | Output — differential-mode component (`RF_LISN_DM`) |
| J1 | Keystone 1211 banana | — | GNDREF measurement reference |

### How it works

All four SMA shields and the J1 banana land on the continuous GNDREF plane. Drive `LISN+` / `LISN−` from the CANBench Duo's two LISN-output SMAs with **two identical cables** — cable skew between the two feeds converts DM↔CM and degrades the separation. The `CM-25Ω` / `DM-100Ω` impedance labels assume a 50 Ω analyser input; see [CM & DM Separator](./cm-dm.md). Each SMA's pin 1 is the centre net; pin 2 is the shield, tied to GNDREF.

## Silkscreen & PCB markings

The `silks` sheet carries the standard SCADYS marking set, all graphical (no electrical function):

- Regulatory marks — **CE** (S2), **UKCA** (S5), **China RoHS / EFUP** (S3)
- **SCADYS.IO** logo (S4 — single pad is an explicit no-connect), copyright line (S6)
- PCB **version** stamp (S1) and a documentation **QR code** (S7)
- Two fiducials (FID1, FID2) for pick-and-place

<SchematicViewer src="/img/schematics/canbench-truez-v1.1/silks_dd19b49f.svg" alt="Silkscreen / markings (silks sheet) — S1–S7 marking set plus fiducials. Zoom out to see the full sheet." />

## PCB Layout

The connectors define the board I/O on three edges: inputs (J2/J3) on the left, outputs (J4/J5) on the right, the GNDREF banana (J1) central.

- **Placement.** J2 (84.5, 75) and J3 (84.5, 105) are mirrored ±15 mm about Y=90 on the left edge and feed the central transformers (X 116.5 / 123.5). J4 (155.5, 75) and J5 (155.5, 105) sit on the right edge, each 7 mm from its coupling cap C1/C2 on the same Y row. J1 (105.5, 90) is central and clear of the RF traces. FID1 (87, 90) / FID2 (153, 90) flank the board for assembly alignment.
- **Routing.** The input centre nets `RF_LISN_LINE+` / `RF_LISN_LINE−` are routed as 1.0 mm CPWG with a 0.2 mm GNDREF gap; output centre nets reach J4/J5 via C1/C2. Exact Z₀ is confirmed against the FR-4 stack-up in performance review.
- **Ground.** Each SMA launch is via-stitched into the GNDREF plane. All SMA shields (pin 2) and the J1 banana land on the single continuous GNDREF pour (F.Cu pour + B.Cu plane); a perimeter via fence and per-launch stitching clusters provide a low-impedance return at each coax transition.

## Components

| Ref | Value | Function | Datasheet |
| --- | --- | --- | --- |
| J2 | BWSMA-KE11 | Edge SMA jack, 50 Ω — input `RF_LISN_LINE+` (pin 1 centre, pin 2 shield/GNDREF) | [BAT WIRELESS BWSMA-KE11](https://www.lcsc.com/datasheet/C5250058.pdf) |
| J3 | BWSMA-KE11 | Edge SMA jack, 50 Ω — input `RF_LISN_LINE−` | [BAT WIRELESS BWSMA-KE11](https://www.lcsc.com/datasheet/C5250058.pdf) |
| J4 | BWSMA-KE11 | Edge SMA jack, 50 Ω — common-mode output `RF_LISN_CM` | [BAT WIRELESS BWSMA-KE11](https://www.lcsc.com/datasheet/C5250058.pdf) |
| J5 | BWSMA-KE11 | Edge SMA jack, 50 Ω — differential-mode output `RF_LISN_DM` | [BAT WIRELESS BWSMA-KE11](https://www.lcsc.com/datasheet/C5250058.pdf) |
| J1 | Keystone 1211 | PCB-mount banana / quick-connect terminal — GNDREF measurement reference | [Keystone 1211](https://www.lcsc.com/datasheet/C20626108.pdf) |

## Gaps & next version

**Before next production run**

- **PCB version / variant inconsistency** — the marked version strings disagree across the PCB part number (`PCB-0C-1.1-SMA-GRN-C`, green), the S1 silk stamp ("0C-1.2-SMA"), and the title-block SKU comment ("0C-1.1-SMA-BLK-A", black). Reconcile to a single version/variant before any production artwork release.
- **QR-code domain** — S7 silk reads `docs.scadys.com/canbench_truez`; the live docs domain is `docs.scadys.io`. Correct the `.com`→`.io` typo on the next revision.
- **S1/S6 silk courtyard overlap** at (120, 108.5) — the PCB-version (S1) and Copyright (S6) marking footprints are stacked (DRC courtyards_overlap). Cosmetic; resolve alongside the marking cleanup above.

**Next version**

- **Clone-leftover footprint-lib refs** — S1 (`mdd400:Variant`) and S7 (`WTI400:qr_…`) reference silk symbols from the MDD400/WTI400 libraries, a remnant of the project clone. The silk renders correctly; normalise to the TrueZ silk library.
- **PCB title block** still carries the Duo-clone title — update when the version/variant is reconciled.

The marking-placeholder items are also tracked on the [Tasks](../tasks.md) page.

## References

- BAT WIRELESS, [*BWSMA-KE11 edge-mount SMA jack*](https://www.lcsc.com/datasheet/C5250058.pdf).
- Keystone Electronics, [*1211 PCB quick-connect terminal*](https://www.lcsc.com/datasheet/C20626108.pdf).

## Related pages

- [CM & DM Separator](./cm-dm.md) — the separator the SMA outputs present, and the source of the CM-25Ω / DM-100Ω impedance labels.
- [External Connectors](../quick-reference/connectors.md) — the connector roster, faceplate labels, and cabling quick reference.
