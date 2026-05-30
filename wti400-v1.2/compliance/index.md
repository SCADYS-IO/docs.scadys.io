---
title: Compliance
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel"
sidebar_label: Compliance
---

:::note[Hardware version]

WTI400 **v1.2** — In service on the test vessel.

:::

## Overview

This page covers the regulatory and standards compliance posture of the WTI400 — CE under the Radio Equipment Directive (RED), UKCA, FCC Part 15, RoHS / REACH / WEEE, ingress protection, and NMEA 2000.

The WTI400 is designed with reference to the standards and directives listed below. The V1.2 board is an in-service prototype revision; it is **designed-for** compliance with these requirements, and there are **no independent test reports yet**. Formal testing and certification will be conducted on production-representative units prior to the first Retail launch (expected V1.3 or V2.0). The dedicated **compliance pre-screening campaign is scheduled for V1.3** — see the [Tasks](../tasks.md) backlog.

:::info[Pending]

The following are not yet in place and are tracked for the V1.3 compliance pre-screening campaign:

- Pre-compliance radiated and conducted emissions / immunity measurements (RED / EMC) on production-representative units with the final enclosure and firmware.
- FCC Part 15 Class B emissions test report from an accredited laboratory.
- UKCA conformity assessment in parallel with CE.
- Component RoHS certificates of compliance collation and REACH SVHC / SCIP submission.
- WEEE registration for EU / UK sales.
- Third-party ingress-protection (IP) testing on production-representative units.
- NMEA 2000 conformance certification coordinated with the National Marine Electronics Association.

No achieved certification is asserted on this page. Each section below states the design target and notes that testing is pending.

:::

## CE Marking — Radio Equipment Directive 2014/53/EU (RED)

Because the WTI400 incorporates the 2.4 GHz Wi-Fi / Bluetooth 5 LE radio of the ESP32-S3-WROOM-1 module, the EU compliance route is the **Radio Equipment Directive 2014/53/EU (RED)** rather than the standalone EMC / Low Voltage directives. RED draws in:

- **Article 3.1(a) — health and safety** — the device operates from the NMEA 2000 backbone at 9–16 V DC and is classified as low-voltage equipment.
- **Article 3.1(b) — electromagnetic compatibility** — radiated and conducted emissions and immunity, with reference to the relevant EN 55032 / EN 55035 family.
- **Article 3.2 — efficient use of radio spectrum** — addressed by use of the **pre-certified ESP32-S3-WROOM-1 module**; the integrated radio carries its own module-level approvals, with end-product testing on the final assembly still to be performed.

Pre-compliance emissions and immunity measurements, using the final enclosure and firmware, are pending and form part of the V1.3 compliance pre-screening campaign. This section states a design target; it does not assert a Declaration of Conformity.

## UKCA (United Kingdom)

The CE / RED design targets are equivalent to the UK technical requirements. UKCA conformity assessment and marking are planned for UK market entry in parallel with CE. No UKCA assessment has been completed for V1.2.

## FCC (United States)

The WTI400 is **designed to meet FCC Part 15, Class B** requirements for unintentional radiators, with the intentional-radiator portion covered by the pre-certified module's FCC ID. A formal emissions test report from an accredited test laboratory, and labelling in accordance with 47 CFR §15.19, are pending and will use the final production enclosure and firmware build. No FCC test report exists for V1.2.

## RoHS / REACH / WEEE

| Regulation | Design target / status |
|---|---|
| RoHS 2011/65/EU (amended by 2015/863/EU) | Lead-free design (ENIG finish, lead-free solder process); component CoCs to be collated — pending |
| REACH SVHC | No intentionally added SVHCs above 0.1 % w/w intended; full SCIP submission planned on first sale — pending |
| WEEE 2012/19/EU | WEEE category 9 (monitoring and control instruments); registration required for EU / UK sales — pending |
| China EFUP | Environmental Friendly Use Period marking targeted for the China market — pending |

## Ingress Protection

The enclosure **targets IP65** (IEC 60529) — fully dust-tight and protected against water jets from any direction. The Micro-C connector is rated IP67 when mated; the V1.2 wind-transducer interface uses six quick-connect tabs, with an STA M12-S 6A IP67 connector planned for V1.3. Third-party IP testing on production-representative units is pending; no IP rating has been independently verified for V1.2.

## NMEA 2000

The WTI400 CAN physical interface conforms to **ISO 11898-2** and is designed for use on NMEA 2000 networks:

- The CAN front end is **non-isolated**: GNDREF is referenced directly to the NMEA 2000 bus ground (NET-C), the standard topology for a bus-powered node. The only opto-isolated interface on the board is the legacy serial path (GNDS), not the CAN bus.
- Network power draw designed to fall within NMEA 2000 allowed limits (design projection — the typical-current figure is unvalidated because Wi-Fi has never been enabled on a V1.2 board; see the product [Overview](../index.md)).
- Micro-C 5-pin connector as specified by the NMEA 2000 physical standard.
- Apparent-wind output as PGN 130306, in accordance with the wind-instrument category.

Final NMEA 2000 conformance certification will be coordinated with the National Marine Electronics Association (NMEA) prior to commercial release. No NMEA 2000 certification has been granted for V1.2.

## Related pages

- [Tasks](../tasks.md) — V1.2 in-service verification and the V1.3 / V2.0 compliance backlog
- [Circuit Design → PCB markings](../circuit-design/pcb-markings.md) — regulatory and identification markings on the board
- [WTI400 Overview](../index.md) — product home

## References

- European Commission, [*Radio Equipment Directive (RED) 2014/53/EU*](https://single-market-economy.ec.europa.eu/sectors/electrical-and-electronic-engineering-industries-eei/radio-equipment-directive-red_en)
- FCC, [*FCC Part 15B — Equipment Authorization*](https://www.fcc.gov/engineering-technology/laboratory-division/general/equipment-authorization)
- UK Government, [*Using the UKCA Marking*](https://www.gov.uk/guidance/using-the-ukca-marking)
- IEC, [*IEC 60529: Degrees of Protection Provided by Enclosures (IP Code)*](https://webstore.iec.ch/publication/2452)
- NMEA, [*NMEA 2000 Standard*](https://www.nmea.org/nmea-2000.html)
- ISO, [*ISO 11898-2:2016 — CAN High-Speed Medium Access Unit*](https://www.iso.org/standard/66340.html)
