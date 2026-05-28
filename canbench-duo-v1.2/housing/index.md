---
title: Housing
hw_version: v1.2
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
sidebar_label: Housing
---

:::note[Hardware version]
CANBench Duo **v1.2** — Fabricated prototype, testing phase.
:::

The CANBench Duo PCB sits inside a **Yongu YG-H10A extruded aluminium split enclosure** with black anodised finish. The extrusion forms the top and bottom faces; two vertical aluminium faceplates close the front and back. The PCB slides into milled grooves in the extrusion.

## Orientation

The PCB orientation inside the enclosure is non-obvious and matters for both cable layout and the visibility of the indicator LED:

- **B.Cu (the layer with the SMAs, M12 N2K connector, and indicator LED) faces UP** through the top extrusion. The SMA bodies, the M12 panel-mount thread, and the RGB LED window all emerge through cutouts in the top aluminium face.
- **F.Cu (the layer with the bananas, fiducials, and silkscreen markings) faces DOWN** against the GRP test bench. The PCB silkscreen — CE / UKCA / RoHS marks, SCADYS logo, QR code, hardware version stamp — is on the underside; it is the **permanent traceability record**, not the user-facing readout.
- **Banana sockets emerge horizontally** through the vertical front and back faceplates: SRC (J5 / J7) on the front, DUT (J1 / J3) on the back.
- **The chassis-ground binding post** protrudes from the front faceplate next to the SRC banana pair. Internally, a wire braid runs from the PCB GNDREF (at the J8 Keystone pad position on F.Cu) to this binding post.

The instrument lies **flat on the GRP test bench**, top face up. From above the user sees the three SMA outputs, the M12 N2K port, and the indicator LED. From the front they see the SRC banana pair and the chassis-ground binding post; from the back they see the DUT banana pair.

## Cable layout convention

The dual-face connector layout was chosen specifically to keep cables clear of one another during measurement:

| Cable | Enters from | Goes to |
| --- | --- | --- |
| Bench supply | Front faceplate (SRC bananas) | Bench DC PSU |
| DUT supply / N2K | Back faceplate (DUT bananas) or top extrusion (M12 J10) | Device under test |
| Measurement | Top extrusion (SMAs J2 / J4 / J6) | Spectrum analyser, optionally via CANBench TrueZ |
| Chassis bond | Front faceplate (knurled-knob binding post) | External ground rod or test-bench ground |

Cables emerge in the directions they need to travel — supply forward, DUT backward, measurement upward — without crossing each other or the chassis-bond braid. The instrument's overall footprint on the GRP is small (the PCB is 99 × 79 mm; the enclosure adds about 10 mm per side) so it fits between other bench instruments without dominating the workspace.

## Enclosure markings

Per [`canbench-duo-enclosure-orientation`](#related-pages), the **user-facing operational labels** — `SRC`, `DUT`, `GRP`, and the connector reference designators — are laser-etched onto the top aluminium extrusion. Laser marking on black anodised aluminium produces a matte light-grey-on-black graphic that is durable, solvent-resistant, and UV-resistant.

The labels live on the enclosure, **not on the PCB silkscreen**. The PCB silkscreen carries the regulatory and identification marks ([PCB Markings & Compliance](../circuit-design/pcb-markings.md)) — these are intentionally separate roles: enclosure labels are what the user reads during a measurement session; PCB silkscreen is the immutable record under the bench.

For the prototype runs, the laser-etching is done on a Creality Falcon 5W diode laser using vector artwork (SVG / DXF). For production this is expected to move to a fibre laser with anodize-removal pads at SMA / M12 / binding-post bonding sites for low-resistance chassis bonds.

## Chassis bonding

The aluminium enclosure body forms a Faraday-cage-like shield around the PCB; for this to work electrically, the body must be reliably bonded to PCB GNDREF.

V1.1 / V1.2 implement chassis bonding with **two independent paths**:

1. **SMA shells and M12 connector body** — the connector outer conductors (already on GNDREF per the schematic) thread through the top aluminium extrusion. The aluminium-on-anodized-aluminium contact has measurable resistance; anodize removal at the bonding interface is **planned for the production fixture** (under SMA bulkhead nuts and the M12 thread).
2. **Wire-braid jumper from PCB GNDREF to the front-faceplate binding post** — provides a direct, low-impedance path independent of the connector-shell-to-extrusion path.

The intent for production assembly is to use **internal sharktooth / star lock washers against laser-cleared aluminium pads** at each connector body's bonding interface. The cleared area should be larger than the inner tooth engagement diameter and slightly smaller than the washer outer diameter, so all teeth contact bare aluminium while the cleared spot remains hidden after assembly. Typical torque values: SMA bulkhead nut at 0.6–0.9 N·m; binding post at 2–3 N·m.

## Material notes

| Item | Specification |
| --- | --- |
| Enclosure body | Yongu YG-H10A extruded aluminium split, black anodised |
| Faceplates | Aluminium, black anodised |
| Top extrusion cutouts | SMA × 3, M12 panel-mount, LED window |
| Front faceplate cutouts | 2 × banana (SRC), chassis-ground binding post |
| Back faceplate cutouts | 2 × banana (DUT) |
| Internal mounting | PCB slides into milled grooves; no internal standoffs needed |
| Surface markings | Laser-etched, light-grey on black anodised, matte finish |

## Known housing items

- **Anodize removal at chassis-bond interfaces** is on the V1.3 production fixture plan. V1.1 / V1.2 prototype units rely on the wire-braid binding-post path as the primary chassis bond; the SMA / M12 secondary path may add resistance until anodize removal is in place.
- **PCB silkscreen vs enclosure label orientation** — the regulatory marks (CE / UKCA / RoHS) are on F.SilkS, which faces DOWN. V1.3 may migrate them to B.SilkS so they appear on the top face alongside the laser-etched operational labels, satisfying the visibility requirement of the regulatory directives more directly.
- **Production-fixture anodize-clear pads** are sized for sharktooth-washer bonding per the recommendations above; the fixture artwork file is a separate deliverable to the PCB design files.

## Related pages

- [Connectors & Mechanical](../circuit-design/connectors-and-mechanical.md) — the per-connector roster, the dual-face cable layout, and the enclosure render gallery
- [PCB Markings & Compliance](../circuit-design/pcb-markings.md) — the seven silkscreen marks that live on F.SilkS underside
- [Power Indicator LED](../circuit-design/power-indicator-led.md) — D1 visible through the top extrusion
- [Compliance](../compliance/index.md) — formal certification status of the regulatory markings

## References

- Yongu, *H10 series extruded aluminium split enclosure* — manufacturer catalogue
- ISO/IEC — *Anodised aluminium surface treatment and laser marking* (general industry practice)
