---
title: Housing
hw_version: v1.1
hw_status: prototype
hw_status_label: "Fabricated prototype — sole built unit (pre-InvenTree)"
sidebar_label: Housing
---

:::note[Hardware version]
CANBench TrueZ **v1.1** — Fabricated prototype, sole built unit. V1.1 is electrically identical to the V1.2 schematic refresh but predates the InvenTree symbol-library migration; the schematic component metadata reflects legacy SCADYS naming. Testing and bench validation reference this V1.1 hardware.

**Other versions:** [v1.2 — schematic refresh (next version)](/canbench-truez/v1.2/)
:::

The CANBench TrueZ is housed in a **Yongu H06** split extruded-aluminium enclosure — a small two-piece extrusion with a slide-in PCB and screwed end plates (faceplates).

![CANBench TrueZ assembled enclosure render](/img/canbench-truez-v1.1/canbench_truez_render.png)

## Overview

This page covers the mechanical housing of the CANBench TrueZ — a passive measurement instrument with no active electronics. It documents the enclosure (Yongu YG-H06), the faceplate layout and markings, chassis bonding, and the build-order assembly sequence used for the fabricated prototype.

Status: the V1.1 unit is the sole fabricated prototype. Dimensions are a working spec from the design record and the Yongu YG-H06 manufacturer drawing; the marking artwork carries pre-production placeholders.

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

![Input faceplate — LISN+ / LISN− SMA jacks](/img/canbench-truez-v1.1/faceplate_inputs.png)

![Output faceplate — DM-100Ω / CM-25Ω SMA jacks](/img/canbench-truez-v1.1/faceplate_outputs.png)

![Enclosure bottom — product label, QR code, barcode, compliance marks](/img/canbench-truez-v1.1/enclosure_bottom.png)

:::caution[Pre-production markings]
The QR code and product/version code in the current artwork are pre-production placeholders to be corrected before production release — see [Tasks](../tasks.md).
:::

## Chassis bonding

The SMA shells and mounting hardware bond the PCB GNDREF copper to the aluminium chassis, stabilising the RF return paths and improving measurement repeatability — consistent with the single-GNDREF EMC philosophy of the [Circuit Design](../circuit-design/index.md).

## Assembly sequence

The SMAs are soldered in place (rather than pre-soldered then forced into the enclosure) to avoid residual stress and faceplate bending given the ~0.35 mm length clearance.

1. Disassemble the enclosure.

   ![Assembly step 1 — enclosure disassembled](/img/canbench-truez-v1.1/assembly_step_0.png)

2. Fit the SMA connectors to the faceplates, nuts **finger-tight only**, noting SMA pin orientation.

   ![Assembly step 2 — SMA connectors fitted to faceplates](/img/canbench-truez-v1.1/assembly_step_1.png)

3. Fit the faceplates to the **top** extrusion, again noting SMA pin orientation.

   ![Assembly step 3 — faceplates fitted to the top extrusion](/img/canbench-truez-v1.1/assembly_step_2.png)

4. Slide the PCB into position between the SMA pins.

   ![Assembly step 4 — PCB slid into position](/img/canbench-truez-v1.1/assembly_step_3.png)

5. Solder the SMA **ground** pins to the bottom of the PCB.

   ![Assembly step 5 — SMA ground pins soldered](/img/canbench-truez-v1.1/assembly_step_4.png)

6. Fit the bottom extrusion, then remove the top extrusion.

   ![Assembly step 6 — bottom extrusion fitted, top removed](/img/canbench-truez-v1.1/assembly_step_5.png)

7. Solder the SMA **top** pins.

   ![Assembly step 7 — SMA top pins soldered](/img/canbench-truez-v1.1/assembly_step_6.png)

8. Reassemble the top extrusion and tighten the SMA nuts to ≈ **0.3 N·m**.

   ![Assembly step 8 — top extrusion reassembled, nuts torqued](/img/canbench-truez-v1.1/assembly_step_7.png)

## Notes

No IP rating is specified — this is a bench accessory, not an environmental enclosure.

## Gaps & next version

- Dimensions are a working spec from the design record and the Yongu YG-H06 manufacturer drawing; confirm against the drawing and the as-built unit before production.
- The QR code and product/version code in the current marking artwork are pre-production placeholders to be corrected before production release — see [Tasks](../tasks.md).

## Related pages

- [Circuit Design](../circuit-design/index.md) — single-GNDREF EMC philosophy behind the chassis bond
- [Connectors (Quick Reference)](../quick-reference/connectors.md) — SMA port assignments
- [Tasks](../tasks.md) — outstanding pre-production items

## References

- Yongu YG-H06 split extruded-aluminium enclosure — manufacturer drawing
- CANBench TrueZ design record (working mechanical spec)
