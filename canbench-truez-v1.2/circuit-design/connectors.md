---
title: Connectors & Markings
hw_version: v1.1
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]
CANBench TrueZ **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-truez/v1.1/)
:::

This page covers the board's external interface and its PCB markings. In V1.2 the connectors and the silkscreen / compliance markings share the dedicated `connectors` sheet (V1.1 drew the connectors on the `cm_dm` sheet).

<SchematicViewer src="/img/schematics/canbench-truez-v1.2/connectors_d458b4c9.svg" alt="Connectors & Markings schematic (connectors)" />

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
