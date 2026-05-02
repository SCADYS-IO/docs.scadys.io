---
title: Compliance
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
sidebar_label: Compliance
---

:::note Hardware version
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

The MDD400 is designed with reference to the standards and directives listed below. The device is currently in the prototype and pre-certification phase — independent testing will be conducted prior to commercial release.

## CE Marking (EU)

The MDD400 is intended to carry the CE mark under the following EU directives:

- **Electromagnetic Compatibility Directive 2014/30/EU** — radiated and conducted emissions, and immunity testing to CISPR 32 / EN 55032 (Class B) and EN 55035.
- **Low Voltage Directive 2014/35/EU** — the device operates below 50 V DC and is classified as low voltage equipment.
- **RoHS Directive 2011/65/EU** — all components and PCB materials sourced with RoHS certificates of compliance; lead-free ENIG surface finish and solder process.

Pre-compliance emissions and immunity testing will be performed using the final enclosure and firmware before Declaration of Conformity is issued.

## FCC (United States)

The MDD400 is designed to meet **FCC Part 15, Class B** requirements for unintentional radiators. A formal emissions test report will be prepared by an accredited test laboratory. The device will be labelled in accordance with 47 CFR §15.19. Testing includes radiated and conducted emissions using the final production enclosure and firmware build.

## UKCA (United Kingdom)

CE design targets are equivalent to UKCA technical requirements. UKCA conformity assessment and marking will be applied for UK market entry in parallel with CE.

## RoHS / REACH / WEEE

| Regulation | Status |
|---|---|
| RoHS 2011/65/EU (amended by 2015/863/EU) | Lead-free design; component CoCs to be collated |
| REACH SVHC | No intentionally added SVHCs above 0.1 % w/w; full SCIP submission on first sale |
| WEEE 2012/19/EU | WEEE category 9 (monitoring and control instruments); registration required for EU/UK sales |

## Ingress Protection

The enclosure targets **IP65** (IEC 60529) — fully dust-tight, protected against water jets from any direction. Connectors are rated IP67 when mated. Third-party IP testing will be conducted during pre-certification on production-representative units.

## NMEA 2000

The MDD400 CAN physical interface conforms to **ISO 11898-2** and is designed for use on NMEA 2000 networks:

- Galvanic isolation via SN65HVD234DR (500 Vrms) between the NMEA 2000 bus domain (GNDC) and the internal digital ground (GNDREF).
- Network power draw within NMEA 2000 allowed limits for LEN=1 and LEN=2.
- DeviceNet Micro-C M12 connector (J1) as specified by the NMEA 2000 physical standard.
- PGNs assigned in accordance with MFD and general display categories.

Final NMEA 2000 certification will be coordinated with the National Marine Electronics Association (NMEA) prior to commercial release.

## References

- European Commission, [*CE Marking*](https://ec.europa.eu/growth/single-market/ce-marking_en)
- FCC, [*FCC Part 15B — Equipment Authorization*](https://www.fcc.gov/engineering-technology/laboratory-division/general/equipment-authorization)
- UK Government, [*Using the UKCA Marking*](https://www.gov.uk/guidance/using-the-ukca-marking)
- IEC, [*IEC 60529: Degrees of Protection Provided by Enclosures (IP Code)*](https://webstore.iec.ch/publication/2452)
- NMEA, [*NMEA 2000 Standard*](https://www.nmea.org/nmea-2000.html)
- ISO, [*ISO 11898-2:2016 — CAN High-Speed Medium Access Unit*](https://www.iso.org/standard/66340.html)
