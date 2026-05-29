---
title: Connectors & Markings
hw_version: v1.1
hw_status: prototype
hw_status_label: "Fabricated prototype — sole built unit (pre-InvenTree)"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]
CANBench TrueZ **v1.1** — Fabricated prototype, sole built unit. V1.1 is electrically identical to the V1.2 schematic refresh but predates the InvenTree symbol-library migration; the schematic component metadata reflects legacy SCADYS naming. Testing and bench validation reference this V1.1 hardware.

**Other versions:** [v1.2 — schematic refresh (next version)](/canbench-truez/v1.2/)
:::

This page covers the board's external interface and its PCB markings. In V1.1 the connectors are drawn on the `cm_dm` sheet (below, first viewer); the silkscreen / compliance markings are on the `silks` sheet (second viewer).

<SchematicViewer src="/img/schematics/canbench-truez-v1.1/cm_dm_b38eb752.svg" alt="Connectors schematic (cm_dm sheet)" />
<SchematicViewer src="/img/schematics/canbench-truez-v1.1/silks_dd19b49f.svg" alt="Silkscreen / markings (silks sheet)" />

## Connectors

| Ref | Type | Faceplate label | Role |
| --- | --- | --- | --- |
| J2 | Edge SMA (BWSMA-KE11), 50 Ω | **LISN+** | Input — positive LISN line (`RF_LISN_LINE+`) from the CANBench Duo |
| J3 | Edge SMA, 50 Ω | **LISN−** | Input — negative LISN line (`RF_LISN_LINE−`) |
| J4 | Edge SMA, 50 Ω | **CM-25Ω** | Output — common-mode component (`RF_LISN_CM`) |
| J5 | Edge SMA, 50 Ω | **DM-100Ω** | Output — differential-mode component (`RF_LISN_DM`) |
| J1 | Keystone 1211 banana | — | GNDREF measurement reference |

All four SMA shields and the J1 banana land on the continuous GNDREF plane. Drive `LISN+` / `LISN−` from the CANBench Duo's two LISN-output SMAs with **two identical cables** — cable skew between the two feeds converts DM↔CM and degrades the separation. The `CM-25Ω` / `DM-100Ω` impedance labels assume a 50 Ω analyser input; see [CM & DM Separator](./cm-dm.md).

## Silkscreen & PCB markings

The `silks` sheet carries the standard SCADYS marking set, all graphical (no electrical function):

- Regulatory marks — **CE**, **UKCA**, **China RoHS / EFUP**
- **SCADYS.IO** logo, copyright line
- PCB **version** stamp and a documentation **QR code**
- Two fiducials for pick-and-place

:::caution[Pre-production markings]
The PCB version string, the variant/colour codes, and the QR code in the current artwork are **pre-production placeholders**. The marked version strings disagree across the PCB part number, the silk stamp, and the SKU comment, and the QR domain reads `.com` rather than `.io`. These are tracked for correction on the [Tasks](../tasks.md) page before any production artwork release.
:::

## PCB layout notes

The connectors define the board I/O on three edges: inputs (J2/J3) on the left, outputs (J4/J5) on the right, the GNDREF banana (J1) central. Each SMA launch is via-stitched into the GNDREF plane. See `pcb_review/connectors-layout.md` in the source repository for coordinates.

## References

- BAT WIRELESS, [*BWSMA-KE11 edge-mount SMA jack*](https://www.lcsc.com/datasheet/C5250058.pdf).
- Keystone Electronics, [*1211 PCB quick-connect terminal*](https://www.lcsc.com/datasheet/C20626108.pdf).
