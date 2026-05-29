---
title: Housing
hw_version: v1.1
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
sidebar_label: Housing
---

:::note[Hardware version]
CANBench TrueZ **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-truez/v1.1/)
:::

The CANBench TrueZ is housed in a **Yongu H06** split extruded-aluminium enclosure — a small two-piece extrusion with a slide-in PCB and screwed end plates (faceplates).

## Enclosure

| Parameter | Value |
|---|---|
| Type | Yongu H06 split extruded aluminium |
| Body width | 63 mm |
| Body height | 25 mm |
| Internal slide length | 75 ± 0.1 mm |
| Body material | 6063-T5 extruded aluminium |
| End plates | 5052-H32 aluminium |
| Fixings | M2.5 × 6 countersunk screws |
| Finish | Black anodized, laser-etched labels |

The PCB outline is 71 × 42 mm and slides lengthwise into the 75 mm internal channel. The PCB plus its SMA flanges is ≈ 0.35 mm shorter than the internal length, which drives the assembly sequence below (avoid pre-stressing the faceplates).

## Faceplate & markings

- **Input faceplate:** `LISN+` / `LISN−` (SMA).
- **Output faceplate:** `DM-100Ω` / `CM-25Ω` (SMA).
- **Bottom:** product label, documentation QR code, product-code barcode, compliance marks.

:::caution[Pre-production markings]
The QR code and product/version code in the current artwork are pre-production placeholders to be corrected before production release — see [Tasks](../tasks.md).
:::

## Chassis bonding

The SMA shells and mounting hardware bond the PCB GNDREF copper to the aluminium chassis, stabilising the RF return paths and improving measurement repeatability — consistent with the single-GNDREF EMC philosophy of the [Circuit Design](../circuit-design/index.md).

## Assembly sequence

The SMAs are soldered in place (rather than pre-soldered then forced into the enclosure) to avoid residual stress and faceplate bending given the ~0.35 mm length clearance.

1. Disassemble the enclosure.
2. Fit the SMA connectors to the faceplates, nuts **finger-tight only**, noting SMA pin orientation.
3. Fit the faceplates to the **top** extrusion, again noting SMA pin orientation.
4. Slide the PCB into position between the SMA pins.
5. Solder the SMA **ground** pins to the bottom of the PCB.
6. Fit the bottom extrusion, then remove the top extrusion.
7. Solder the SMA **top** pins.
8. Reassemble the top extrusion and tighten the SMA nuts to ≈ **0.3 N·m**.

## Notes

Dimensions are a working spec from the design record and the Yongu H06 manufacturer drawing; confirm against the drawing and the as-built unit before production. No IP rating is specified — this is a bench accessory, not an environmental enclosure.
