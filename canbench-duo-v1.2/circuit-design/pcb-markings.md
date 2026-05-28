---
title: PCB Markings & Compliance
hw_version: v1.2
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

:::note[Hardware version]
CANBench Duo **v1.2** — Fabricated prototype, testing phase.
:::

The CANBench Duo uses a **two-place marking system**. Permanent traceability markings are silkscreened on the PCB underside; user-facing operational labels are etched on the enclosure top extrusion. Separating the two roles keeps the immutable PCB record clean from the day-to-day operating labels that the user actually reads in front of them.

## What is on the PCB underside

Seven silkscreen marks on F.SilkS (the front-copper-side silkscreen). In the assembled YG-H10A enclosure, F.Cu faces down against the GRP test bench, so these marks are not directly visible without flipping the unit — they are the **permanent traceability record**, not a user-facing readout.

| Ref | Mark | Position (X, Y) mm | Purpose |
| --- | --- | --- | --- |
| `S1` | `0B-1.2-CAN` PCB version stamp | (97, 54) | Encodes PCB revision (0B), product version (1.2), and family designator (CAN) |
| `S3` | UKCA | (165.5, 125) | UK conformity mark |
| `S4` | CE | (156.5, 125) | EU conformity mark |
| `S5` | SCADYS-IO logo (9 × 9 mm, with F.Mask cutout) | (77.5, 57.5) | SCADYS-IO branding |
| `S6` | "© 2025 GM Consolidated Holdings Pty Ltd" | (106.4, 127) | Copyright notice |
| `S7` | QR code | (77.5, 68) | Links to the canonical docs page for this product / version |
| `S8` | RoHS (China-RoHS EFUP variant) | (148, 125) | Restriction of Hazardous Substances mark |

The regulatory marks cluster at the top edge of the board (S3 + S4 + S8); the product-identification cluster sits at the bottom-left (S5 + S7 + S1).

## What is on the enclosure top

The user-facing labels — `SRC`, `DUT`, `GRP`, and the connector reference designators — are laser-etched or printed on the YG-H10A top aluminium extrusion. These are the labels a technician reads during a measurement session and are intentionally separate from the PCB silkscreen.

The [Connectors & Mechanical](./connectors-and-mechanical.md) page covers the enclosure-top labelling. The PCB-silkscreen marks documented on this page are the **permanent record**; they are not the daily-use signage.

## PCB version stamp format

`0B-1.2-CAN` decodes as:

- **`0B`** — PCB revision letter ("Rev B"). Increments with each fabrication-impacting layout change.
- **`1.2`** — product version. Matches the `CANBench_Duo_V1.2` KiCad project name and the docs URL slug.
- **`CAN`** — product family designator distinguishing the CANBench Duo from the WTI400 / MDD400 / MLI400 / MDG400 family.

The V1.1 fabricated prototype carries `0B-1.1-CAN`; V1.2 schematic carries `0B-1.2-CAN`; V1.3 will carry `0C-1.3-CAN` (next PCB revision, next product version).

## Certification status

The V1.1 / V1.2 prototype carries the CE, UKCA, and RoHS marks on the silkscreen as a **forward-looking conformity claim**. **No formal compliance certification has been performed yet.**

| Mark | Underlying directive | V1.2 status |
| --- | --- | --- |
| CE | 2014/30/EU (EMC); 2014/35/EU (LVD, N/A at ≤ 48 V DC) | Mark present, Declaration of Conformity pending |
| UKCA | UK SI 696/2008 | Mark present, conformity assessment pending |
| RoHS | 2011/65/EU + 2015/863/EU | Mark present; V1.2 BOM is lead-free (all components carry "ROHS" suffix in InvenTree) |

:::warning[No formal certification yet]
The CE and UKCA marks on the V1.1 prototype silkscreen anticipate the formal conformity assessment expected before public release. They are a forward-looking conformity claim, **not evidence of completed certification testing**. Before V1.3 fabrication for public release, either the formal Declaration of Conformity must be in place OR the regulatory marks must be removed from the silkscreen.
:::

## Known V1.1 / V1.2 silkscreen issues

A handful of items carry over to V1.3 — all documented here for transparency:

- **QR-code URL on the V1.1 fabricated prototype is `docs.scadys.com/mdd400`** — a clone-leftover from the project's origin as an MDD400 fork. The QR points to the wrong product's docs. The V1.2 schematic has the correct URL queued (`docs.scadys.io/canbench-duo/v1.2`); next fabrication will be correct. Any V1.1 prototype already in the field reaches the correct page via direct URL or web search instead.
- **CE and UKCA mark letter height is 3.5 mm** — below the 5 mm minimum implied by EU Directive 765/2008/EC Annex II for products that are not size-constrained. The PCB is 99 × 79 mm — not size-constrained. V1.3 upsizes to 5 mm.
- **Silkscreen layer is F.SilkS (PCB underside)** — in the assembled enclosure, F.SilkS faces the bench, not the user. V1.3 may migrate the regulatory cluster to B.SilkS so it is visible from the top alongside the SRC / DUT / GRP enclosure labels.

These items do not affect the V1.1 prototype's usability — they are non-conformities pending the V1.3 release for public-market readiness.

## Related pages

- [Connectors & Mechanical](./connectors-and-mechanical.md) — the enclosure top extrusion labelling that complements the PCB silkscreen
- [Compliance](../compliance/index.md) — full compliance status including the pending formal certification work
- [Tasks](../tasks.md) — V1.3 silkscreen fixes are tracked here

## References

- EU Directive 765/2008/EC — *CE marking rules*
- EU Directive 2014/30/EU — *Electromagnetic compatibility*
- UK Statutory Instrument 696/2008 — *UKCA marking*
- Directives 2011/65/EU and 2015/863/EU — *Restriction of Hazardous Substances (RoHS)*
- ISO/IEC 18004 — *QR Code specification*
