---
title: Connectors & Mechanical
hw_version: v1.1
hw_status: prototype
hw_status_label: "Fabricated prototype — sole built unit (pre-InvenTree)"
---

:::note[Hardware version]
CANBench Duo **v1.1** — Fabricated prototype, sole built unit. V1.1 is electrically identical to the V1.2 schematic refresh but predates the InvenTree symbol-library migration; the schematic component metadata reflects legacy SCADYS naming. Testing and bench validation reference this V1.1 hardware.

**Other versions:** [v1.2 — schematic refresh (next version)](/canbench-duo/v1.2/)
:::

The CANBench Duo uses a **dual-face connector layout** built around the YG-H10A extruded aluminium enclosure. Three classes of cables come and go: bench supply, DUT supply / N2K, and measurement. Each class emerges from a different face of the enclosure, so all three can lie flat on the test bench without crossing.

| Connector class | Face | Connectors |
| --- | --- | --- |
| Bench supply input | Vertical **front** faceplate | `J5` RED + `J7` BLACK banana sockets (SRC) |
| DUT supply / N2K output | Vertical **back** faceplate + top extrusion | `J1` RED + `J3` BLACK banana sockets (DUT) + `J10` M12-5 N2K |
| Measurement outputs | **Top** extrusion (B.Cu side) | `J2` SMA (LISN+), `J4` SMA (LISN−), `J6` SMA (CAN-CM) |

![CANBench Duo enclosure — isometric showing top extrusion (SMAs + M12 + LED) and front faceplate (SRC bananas)](/img/canbench-duo-v1.1/render_1.PNG)

![CANBench Duo enclosure — top extrusion view with three SMAs, M12 N2K, indicator window, and front-faceplate chassis-ground binding post](/img/canbench-duo-v1.1/render_2.PNG)

![CANBench Duo enclosure — back faceplate showing DUT banana pair](/img/canbench-duo-v1.1/render_3.PNG)

## Connector roster

### Banana sockets (J1, J3, J5, J7)

Four Changzhou Amass `24.245.x` horizontal edge-mount THT banana sockets — two pairs of RED/BLACK on opposite vertical faceplates:

| Ref | Colour | Net | Face | Role |
| --- | --- | --- | --- | --- |
| `J5` | RED | `SUPPLY+` | Front | Bench supply positive in |
| `J7` | BLACK | `SUPPLY−` | Front | Bench supply negative in |
| `J1` | RED | `DUT+` | Back | DUT positive out (LISN-filtered) |
| `J3` | BLACK | `DUT−` | Back | DUT negative out (LISN-filtered) |

Directionality is fixed by the internal LISN protection chain — bench supply enters on the SRC pair, passes through fuse + reverse-polarity protection + ferrite + LISN ladder, and emerges on the DUT pair. **Wiring the bench supply to the DUT pair (or DUT to the SRC pair) bypasses the entire protection chain.** The Red LED state on the top indicator catches reverse polarity within either pair, but it cannot catch SRC-vs-DUT pair swap.

Banana socket per-pin current rating: typically 10 A continuous for this connector class. The LISN supply path's design intent is **4 A continuous @ 25 °C** — well within the socket rating.

### SMA measurement outputs (J2, J4, J6)

Three HCTL HC-SMA6565-13H-G SMA Female Vertical THT connectors on the top extrusion, evenly spaced 26.5 mm apart along the X = 110 mm column:

| Ref | Net | Position (X, Y) mm | Role |
| --- | --- | --- | --- |
| `J2` | `RF_LISN_P` | (110, 116.5) | LISN+ measurement (upper rail) |
| `J6` | `RF_CAN_CM` | (110, 90) | CAN common-mode measurement (centre row) |
| `J4` | `RF_LISN_N` | (110, 63.5) | LISN− measurement (lower rail) |

All three SMAs are visually and electrically interchangeable — same part number, same pinout (centre pin = signal, outer = GNDREF), same characteristic impedance (50 Ω nominal). The HCTL part is rated to typically 12–18 GHz with VSWR ≤ 1.3:1 to 6 GHz, comfortably above the design's 108 MHz upper measurement-band edge. For certification-quality measurement work, validate the actual return loss at 108 MHz via VNA on the as-built board.

### M12 N2K connector (J10)

A single Shenzhen STA M12-S5A-PPFM panel-mount female receptacle following the standard NMEA 2000 / DeviceNET Micro-C 5-pin Code A pinout:

| Pin | Net | Standard mapping |
| --- | --- | --- |
| 1 | `GNDREF` | SHIELD |
| 2 | `DUT+` | NET-S (V+) |
| 3 | `DUT−` | NET-C (V−) |
| 4 | `NET-H` | CAN-H |
| 5 | `NET-L` | CAN-L |

J10's pins 2 / 3 tie to the **same `DUT+` / `DUT−` nets** as the back-faceplate banana pair, so a DUT plugged into J10 via a standard N2K cable receives the **LISN-filtered DC supply AND the CAN bus on the same connector**. This matches the way N2K-attached devices receive power and connectivity from the backbone cable. The pinout is **identical to the SCADYS-IO platform's MDD400 / WTI400 / MLI400 / MDG400** — any of those products can be powered + bussed via the CANBench Duo's J10.

:::info[J10 current rating = design limit]
The M12-S5A-PPFM is rated **4 A per pin**, which matches the LISN supply path's 4 A continuous design intent exactly. Zero margin. For DUT currents up to 4 A continuous J10 is acceptable; for higher currents, use the back-faceplate banana pair (J1/J3, ~10 A rated) instead — at the cost of CAN-bus connectivity, which then has to be cabled separately.
:::

:::warning[Not an N2K-certified device]
The M12 connector form factor is N2K-compatible and the pinout follows the NMEA 2000 standard, but the CANBench Duo itself is a **measurement instrument** — it does not carry the N2K logo or certification. The IP67 rating is a side effect of using the standard N2K connector class, not a marine-deployment claim. This is a **bench instrument**.
:::

### Chassis-ground binding post

A wire braid runs from the PCB GNDREF (at the J8 Keystone pad position on F.Cu) to a knurled-knob binding post on the front faceplate, visible in `render_2.PNG`. The `J8` PCB pad itself is `(dnp yes)` — the chassis bond uses the external binding post instead, which gives the user a tool-free way to bond the enclosure body to an external ground rod or test-bench ground.

The binding post is the primary chassis-bond path on V1.1 / V1.2. Future revisions may populate J8 directly if a screw-down stud bond proves preferable in the field.

### Fiducials (FID1, FID2)

Two pick-and-place fiducial marks at diagonally opposite corners of the PCB — `FID1` at the top-left, `FID2` at the bottom-right. Used by the assembly machine's vision system for two-point board registration. No user-facing role.

## Mechanical orientation

The PCB sits inside the YG-H10A extruded aluminium enclosure with the following orientation (see [`canbench-duo-enclosure-orientation` memory](../housing/index.md) for the canonical reference):

- **B.Cu (with the SMAs, M12, and indicator LED) faces UP** through the top extrusion cutouts
- **F.Cu (with the bananas, fiducials, and silkscreen markings) faces DOWN** against the GRP test bench
- Banana sockets emerge horizontally through the vertical front + back faceplates
- The chassis-ground binding post protrudes from the front faceplate next to the SRC banana pair

This orientation is unusual compared to many bench instruments where everything is on a single front face. The motivation is **cable layout**: measurement cables emerging upward from the top let the SMA cables drape naturally; the front + back banana pairs let bench-supply and DUT cables enter from opposite sides without crossing the SMA cables. The instrument lies flat on the GRP bench surface with all cables in their natural orientation.

## Connector specifications

| Connector | Manufacturer / MPN | Rating | Mating cycles | IP rating |
| --- | --- | --- | --- | --- |
| Banana sockets (J1/J3/J5/J7) | Changzhou Amass 24.245.1 (RED) / 24.245.2 (BLACK) | 10 A | 5 000+ | None |
| SMA Female Vertical (J2/J4/J6) | HCTL HC-SMA6565-13H-G | 50 Ω, 12–18 GHz, < 500 mA DC | 500+ | None |
| M12 N2K (J10) | Shenzhen STA M12-S5A-PPFM | 4 A per pin | 100+ | IP67 (connector class) |
| Chassis-ground binding post | YIYUAN YTC-3-PCB281308 (J8 pad, DNP) — wire braid to enclosure post | High-current | One-time install | N/A |

## Known mechanical items

- **High-current trace widths** for the `SUPPLY±` / `DUT±` / `VSS±` / `VSF±` nets are not yet verified against IPC-2152 for the 4 A continuous design intent. Board-level minimum track width is 1.0 mm; IPC-2152 indicates ~ 1.5 mm at 4 A continuous, 30 °C rise on 1 oz outer-layer copper. V1.3 candidate.
- **HCTL HC-SMA6565-13H-G return loss at 108 MHz** is not characterised in the manufacturer datasheet. Adequate for pre-compliance work; VNA confirmation pending for certification-grade measurement.
- **J9 numbering gap** — intentional, an artefact of refdes renumbering during V1.0 → V1.1 → V1.2 evolution.

## Related pages

- [LISN Supply Path](./lisn-supply-path.md) — the fuse, reverse-polarity FET pair, ferrite, and LISN ladder that sit between the SRC and DUT banana pairs
- [LISN Measurement Ports](./lisn-measurement-ports.md) — the RF chains driving the LISN+ / LISN− SMAs (J2 / J4)
- [CAN Common-Mode Port](./can-cm-port.md) — the RF chain driving the CAN-CM SMA (J6) and tapping J10's pins 4 / 5
- [Power Indicator LED](./power-indicator-led.md) — the indicator visible through the top extrusion
- [User Manual → Quick Start](../user-manual/quick-start.md) — operational workflow including cable-layout conventions; [Quick Reference → Connectors](../quick-reference/connectors.md) — connector roster lookup table
