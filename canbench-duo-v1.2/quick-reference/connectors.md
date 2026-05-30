---
title: External Connectors
hw_version: v1.2
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
---

:::note[Hardware version]
CANBench Duo **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-duo/v1.1/)
:::

Connector roster for the CANBench Duo enclosure. The unit has a dual-face layout — bench supply on the front, DUT on the back, measurement outputs on the top.

## Roster

| Ref | Face | Type | Role | Rating (design intent) |
|---|---|---|---|---|
| `J5` | Front | Changzhou Amass 24.245.1 banana (RED) | SRC+ — bench-supply positive input | 10 A continuous (connector class); 4 A continuous limited by upstream LISN |
| `J7` | Front | Changzhou Amass 24.245.2 banana (BLACK) | SRC− — bench-supply negative input | 10 A continuous (connector class); 4 A continuous limited by upstream LISN |
| `J1` | Back | Changzhou Amass 24.245.1 banana (RED) | DUT+ — LISN-filtered positive output to DUT | 10 A continuous (connector class); 4 A continuous LISN limit |
| `J3` | Back | Changzhou Amass 24.245.2 banana (BLACK) | DUT− — LISN-filtered negative output to DUT | 10 A continuous (connector class); 4 A continuous LISN limit |
| `J10` | Top extrusion | Shenzhen STA M12-S5A-PPFM (Micro-C 5-pin Code A Female) | DUT supply + N2K combined — NMEA 2000 / DeviceNET pinout | 4 A per pin (M12 spec); same 4 A LISN limit applies |
| `J2` | Top extrusion | HCTL HC-SMA6565-13H-G (SMA Female Vertical) | RF measurement output — LISN+ (upper-rail RF tap) | < 500 mA DC; RF 12–18 GHz capable, VSWR ≤ 1.3:1 to 6 GHz |
| `J4` | Top extrusion | HCTL HC-SMA6565-13H-G (SMA Female Vertical) | RF measurement output — LISN− (lower-rail RF tap) | < 500 mA DC; RF 12–18 GHz capable, VSWR ≤ 1.3:1 to 6 GHz |
| `J6` | Top extrusion | HCTL HC-SMA6565-13H-G (SMA Female Vertical) | RF measurement output — CAN common-mode tap | < 500 mA DC; RF 12–18 GHz capable, VSWR ≤ 1.3:1 to 6 GHz |
| Binding post | Front | Knurled-knob with wire-braid to PCB GNDREF | Chassis-ground bond | Not current-rated; reference connection only |
| `J8` | (footprint, DNP) | Keystone 1211 THT pad | Reserved alternative chassis-bond — **NOT POPULATED on V1.1 / V1.2** | — |

## M12 N2K pinout (J10)

J10 is a **female** M12 A-coded (Micro-C) receptacle. The diagram shows the pin layout viewed from the front (mating face) of the connector.

![NMEA 2000 M12 A-coded female connector — front view: pin 1 Shield, pin 2 NET-S (+V), pin 3 NET-C (−V), pin 4 NET-H (CAN-H), pin 5 NET-L (CAN-L)](/img/canbench-duo-v1.2/nmea2000_connector_pinout_female.svg)

| Pin | Net | Role |
|---|---|---|
| 1 | SHIELD | Cable shield / drain |
| 2 | NET-S | DUT+ (LISN-filtered supply positive) |
| 3 | NET-C | DUT− (LISN-filtered supply negative) |
| 4 | NET-H | CAN-H |
| 5 | NET-L | CAN-L |

Standard NMEA 2000 / DeviceNET Micro-C pinout — any compliant N2K cable will mate correctly.

## SMA termination

Three 50 Ω SMA terminators is the minimum kit. Unused SMA ports must be terminated to avoid resonances, standing waves, and false CM signatures during measurement. See [User Manual → Common Pitfalls](../user-manual/common-pitfalls.md).

## Engineering rationale

For the design intent behind the dual-face layout, the source/DUT directionality enforced by the LISN protection chain, and the per-connector mechanical detail (faceplate cutouts, render gallery, render geometry), see [Connectors & Mechanical](../circuit-design/connectors-and-mechanical.md) in the Circuit Design section.
