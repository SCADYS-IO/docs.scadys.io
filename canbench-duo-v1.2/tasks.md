---
title: Tasks
hw_version: v1.2
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

:::note[Hardware version]
CANBench Duo **v1.2** — Fabricated prototype, testing phase. V1.2 is the InvenTree-canonical schematic revision of the fabricated V1.1 board; both ship the same topology. V1.3 will be the next fabrication and will roll up the items below.
:::

Outstanding work falls into two groups: **V1.3 hardware fixes** (changes to the PCB / schematic for the next fabrication) and **validation work** (measurements and simulations against the as-built V1.1 hardware).

## V1.3 hardware fixes

Items to address in the V1.3 schematic and layout before the next fabrication run:

| # | Item | Source |
| --- | --- | --- |
| 1 | Correct the S7 QR-code URL on the silkscreen — replace `docs.scadys.com/mdd400` (clone-leftover from the MDD400 fork) with the canonical CANBench Duo docs URL | [PCB Markings](./circuit-design/pcb-markings.md) |
| 2 | Upsize R1 and R3 (LED current limiters) from 0805 to 1206 footprint (0.25 W → 0.4 W rating) to improve thermal margin at the 48 V supply ceiling | [Power Indicator LED](./circuit-design/power-indicator-led.md) |
| 3 | Upsize CE and UKCA silkscreen marks from 3.5 mm to ≥ 5 mm letter height per regulatory minimum | [PCB Markings](./circuit-design/pcb-markings.md) / [Compliance](./compliance/index.md) |
| 4 | Add HF shunt capacitors at the DUT-side banana ends (J1 / J3) to bypass the ~ 27 mm of `DUT±` rail trace between the LISN ladder output (current C7 / C14 shunt position) and the banana terminals | [LISN Supply Path](./circuit-design/lisn-supply-path.md) |
| 5 | Migrate silkscreen markings from F.SilkS to B.SilkS so the regulatory + identification cluster faces the user-visible top face alongside the laser-etched enclosure labels | [PCB Markings](./circuit-design/pcb-markings.md) / [Housing](./housing/index.md) |
| 6 | Verify high-current trace widths against IPC-2152 for the 4 A continuous design intent — extract per-segment widths for `SUPPLY±` / `DUT±` / `VSS±` / `VSF±` nets; widen to ≥ 1.5 mm if any segment falls short | [Connectors & Mechanical](./circuit-design/connectors-and-mechanical.md) |
| 7 | Add ground-via stitching density around the SMA shells (J2 / J4 / J6) and the M12 N2K connector body (J10) | [LISN Measurement Ports](./circuit-design/lisn-measurement-ports.md) / [CAN CM Port](./circuit-design/can-cm-port.md) |
| 8 | Resolve the Q1 symbol library mismatch — `Transistor - PNP:PNP-SOT323-BC807-000180` symbol vs the actual `PKG-SOT-23` BC807-25 installed part. KiCad-hygiene library cleanup | [Power Indicator LED](./circuit-design/power-indicator-led.md) |
| 9 | Migrate `EMCBench CAN-LISN:qr-code` and `EMCBench CAN-LISN:version_knockout` project-local footprints to SCADYS-canonical `SILKS:` library for cross-product consistency | [PCB Markings](./circuit-design/pcb-markings.md) |
| 10 | Review whether to populate J8 (Keystone chassis-ground stud) in V1.3, or keep the wire-braid-to-binding-post chassis bond strategy unchanged | [Connectors & Mechanical](./circuit-design/connectors-and-mechanical.md) / [Housing](./housing/index.md) |

## Validation work

Measurements and analyses to run against the V1.1 fabricated hardware (or as numerical / SPICE work where applicable):

| # | Work | Purpose |
| --- | --- | --- |
| 1 | **VNA characterisation of LISN port impedance** at the DUT banana sockets (J1 / J3), 150 kHz – 108 MHz | Confirm the LISN presents the expected ~ 5 µH artificial-network impedance at the DUT terminals, not just at the ladder output. Closes the V1.3 fix #4 question (whether DUT-side HF shunts are necessary) |
| 2 | **VNA characterisation of measurement-port S21** for all three SMAs (J2 / J4 / J6) | Confirm the ≈ −10 dB attenuator transfer function and the upper-band-edge return loss at 108 MHz |
| 3 | **VNA characterisation of CMRR** vs frequency on the CAN CM port (J6) | Confirm the calculated CMRR bound (≈ 60 dB at DC, falling to < 30 dB at 108 MHz). Identify the dominant degradation mechanism (resistor matching vs trace asymmetry vs cap tolerance) |
| 4 | **Thermal characterisation of the high-current path** at 4 A continuous, 25 °C and 40 °C ambient | Validate the thermal-derate envelope (4 A @ 25 °C → 3 A @ 40 °C). Closes V1.3 fix #6 |
| 5 | **SPICE simulation of LISN ladder impedance** with PCB parasitics | Provide closed-form expected curves for VNA comparison; identify any frequency-shaped artefacts |
| 6 | **SPICE simulation of measurement-port S21** with PCB parasitics | Same purpose for the RF measurement chain |
| 7 | **Q2 protection-FET power-up Blue-flash duration** measurement | Quantify the BLUE-LED transient at supply turn-on (estimated ~ ms set by Q2 gate-bias RC) — confirm benign duration |
| 8 | **IEC 61000-4-2 ESD characterisation** of the SMA outputs and M12 connector | Validate the design target of ±8 kV air / ±6 kV contact at the measurement ports |
| 9 | **TPAZ1023 ESD specifications** — confirm against the actual Tech Public datasheet for the multi-channel TVS used in the protection cascade | Document the specific ESD ratings claimed by the part vs the topology-derived targets |
| 10 | **Murata BLE32 ferrite rated current** datasheet fetch and verify against the LISN supply path's 4 A continuous design intent | Close the open datasheet-spec gap on the ferrite |
| 11 | **CISPR 25 baseline noise floor** sweep with the LISN inputs terminated and the analyser at its measurement settings | Establish the instrument's noise floor — the floor below which DUT signatures cannot be resolved |
| 12 | **LISN+ / LISN− symmetry comparison** measurement against a known DUT | Validate the mirror-symmetric layout's CM-to-DM conversion suppression |

## Pre-release compliance

For the V1.3 release to be a market-ready product, the work in the [Compliance](./compliance/index.md) page also needs to be in place:

- EMC compliance testing at an accredited lab
- Declaration of Conformity (CE + UKCA)
- RoHS verification of the full V1.3 BOM

These are organisational / process tasks rather than engineering work, but they bind to the V1.3 release schedule.

## Related pages

- [Compliance](./compliance/index.md) — formal certification status and the V1.3 release gate
- [Quick Reference](./quick-reference.md) — the operational baseline measurement procedure that informs the validation work above
- [Circuit Design](./circuit-design/index.md) — per-circuit pages cross-link back to specific V1.3 items
