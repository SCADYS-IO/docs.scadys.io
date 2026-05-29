---
title: Compliance
hw_version: v1.2
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
sidebar_label: Compliance
---

:::note[Hardware version]
CANBench Duo **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-duo/v1.1/)
:::

:::warning[Status: no formal certification yet]
The CANBench Duo V1.1 fabricated prototype carries CE, UKCA, and RoHS marks on the PCB silkscreen as a **forward-looking conformity claim**. Formal Declaration of Conformity, EMC test report, and component-level lead-free verification are pending the V1.3 production release. Neither the V1.1 prototype nor the V1.2 schematic is a certified product.
:::

## Current status

| Directive / standard | V1.1 / V1.2 status |
| --- | --- |
| EU Directive 2014/30/EU — EMC | Mark present on silkscreen; formal compliance assessment pending |
| EU Directive 2014/35/EU — LVD | Not applicable (≤ 48 V DC operation, below LVD threshold) |
| EU Directives 2011/65/EU + 2015/863/EU — RoHS | Mark present; all V1.2 BOM components carry "ROHS" suffix in InvenTree |
| EU Directive 765/2008/EC — CE marking rules | Mark present at 3.5 mm letter height (below 5 mm minimum — known V1.3 fix) |
| UK Statutory Instrument 696/2008 — UKCA | Mark present at 3.5 mm letter height (same V1.3 fix) |
| ISO 7637-2 — Vehicle transient testing | **Not applicable.** CANBench Duo is a passive bench measurement instrument; the protection chain handles ESD and bench-handling transients only |
| CISPR 25 — Vehicle conducted-emissions measurement band | Topology supports 150 kHz – 108 MHz measurement; full S21 / return-loss VNA verification pending |
| NMEA 2000 — Marine networking standard | **Not certified.** The M12 connector form factor and J10 pinout are N2K-compatible; the instrument itself is not N2K-certified |

## What is in place

Several pieces of the conformity assessment exist as engineering artefacts:

- **Bill-of-materials lead-free status** — every component on the V1.2 BOM has a `ROHS` suffix in its InvenTree record. The China-RoHS EFUP variant of the silkscreen mark is used (`SILKS:EFUP_RoHS_China_4`), which is acceptable for both EU and China markets when the BOM is lead-free.
- **Schema-review evidence** — all six circuits have been schema-reviewed with kicad-cli BOM and netlist as canonical sources; topology is fully documented.
- **PCB-layout review evidence** — placement, ground continuity, mirror symmetry, cross-sheet loop-area measurements are documented in the `pcb_review/` evidence files.
- **Performance-review evidence** — component-level operating points calculated against datasheet ratings; thermal envelopes, current ratings, and CMRR bounds are documented in the `performance_review/` evidence files.
- **Design-intent narrative** — each circuit's design-intent file captures the engineering rationale behind the topology choices.

## What is pending

For V1.3 to be a certifiable release, the following needs to be in place — listed in approximate execution order:

1. **EMC compliance testing at an accredited lab.** Conducted-emissions and radiated-emissions sweeps against the applicable harmonised standards under CE EMC Directive 2014/30/EU. Output: EMC test report.
2. **Declaration of Conformity (DoC).** A signed document, kept on file by SCADYS as the responsible economic operator, declaring conformity against the applicable directives and standards. References the EMC test report.
3. **UKCA conformity assessment.** Post-Brexit equivalent of the CE assessment; same underlying technical work but a separate document trail.
4. **CE / UKCA silkscreen mark upsize** from 3.5 mm to ≥ 5 mm letter height per the directive's minimum-height requirement. V1.3 silkscreen update.
5. **Silkscreen layer migration (F.SilkS → B.SilkS)** so the regulatory marks face the user side of the assembled enclosure alongside the laser-etched operational labels. V1.3 layout candidate.
6. **QR-code URL correction** — the V1.1 silkscreen carries `docs.scadys.com/mdd400`, a clone-leftover from the project's origin as an MDD400 fork. V1.2 schematic correction is in place; V1.3 fabrication will be correct.

## V1.1 prototype scope

The V1.1 fabricated prototype is a **prototype, not a released product**. It is used for internal engineering validation and pre-compliance measurement-band characterisation. The CE / UKCA marks on its silkscreen are a forward-looking claim that the design topology supports the relevant directives; they are **not** a representation that the prototype has been formally assessed against those directives.

Anyone using a V1.1 prototype is expected to treat it as engineering hardware. It is **not** to be placed on the EU or UK markets until the V1.3 release with the formal conformity assessment complete.

## ISO 7637-2 scope clarification

The CANBench Duo is **not designed for ISO 7637-2 transient testing**. ISO 7637-2 Pulse 5a / 5b (load dump, 100+ V sustained transients) would exceed the protection FET voltage ratings (the V1.2 design margin is sized for ~ 100 V transients). The protection chain handles ESD events and bench-handling transients (e.g. accidentally shorting the supply, hot-plugging a DUT), not vehicle-loaddump-class energy.

If load-dump transient testing is required for a DUT, use a dedicated transient generator upstream of the CANBench Duo, with the LISN's RF measurement ports terminated into 50 Ω during the transient injection.

## Related pages

- [PCB Markings & Compliance](../circuit-design/pcb-markings.md) — the silkscreen marks themselves and known V1.1 silkscreen issues
- [Housing](../housing/index.md) — the enclosure-level chassis-bonding strategy contributing to the overall EMC behaviour
- [Tasks](../tasks.md) — V1.3 compliance-related fixes are tracked here

## References

- EU Directive 765/2008/EC — *CE marking rules*
- EU Directive 2014/30/EU — *Electromagnetic compatibility*
- EU Directive 2014/35/EU — *Low Voltage Directive*
- EU Directives 2011/65/EU and 2015/863/EU — *RoHS*
- UK Statutory Instrument 696/2008 — *UKCA*
- IEC, [*CISPR 25: Vehicles, boats and internal combustion engines — Radio disturbance characteristics*](https://webstore.iec.ch/publication/7077)
- ISO 7637-2 — *Road vehicles — Electrical disturbances from conduction and coupling — Part 2: Transient conduction* (NOT applicable to this product)
- IEC 61000-4-2 — *Electrostatic discharge immunity test*
- NMEA 2000 — *Marine networking standard* (connector form factor only — instrument is not N2K-certified)
