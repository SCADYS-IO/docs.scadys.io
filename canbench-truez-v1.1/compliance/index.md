---
title: Compliance
hw_version: v1.1
hw_status: prototype
hw_status_label: "Fabricated prototype — sole built unit (pre-InvenTree)"
sidebar_label: Compliance
---

:::note[Hardware version]
CANBench TrueZ **v1.1** — Fabricated prototype, sole built unit. V1.1 is electrically identical to the V1.2 schematic refresh but predates the InvenTree symbol-library migration; the schematic component metadata reflects legacy SCADYS naming. Testing and bench validation reference this V1.1 hardware.

**Other versions:** [v1.2 — schematic refresh (next version)](/canbench-truez/v1.2/)
:::

## Overview

The CANBench TrueZ is a **passive, non-powered RF test accessory** — no active devices, no radio, no mains connection. As a passive bench measurement instrument it carries **no marine / NMEA 2000 compliance obligation**. Its regulatory position rests primarily on the **RoHS** material basis rather than on emissions / immunity testing.

**Status:** V1.1 is a fabricated prototype; the regulatory marks on the silkscreen are a forward-looking conformity claim and the formal Declaration of Conformity is pending (see the table below).

:::caution[Prototype status]
V1.1 is a fabricated prototype. The PCB silkscreen carries the regulatory marks as a forward-looking conformity claim; a formal Declaration of Conformity and any required test reports are **pending**. Do not treat V1.1 as a certified product.
:::

| Mark / regime | Position |
|---|---|
| **CE (EU)** | On a RoHS basis — passive accessory; no powered emitter, so no RED/EMC active-emissions scope. DoC pending. |
| **UKCA (UK)** | Equivalent RoHS basis for the GB market. |
| **RoHS — EU / UK** | Lead-free / restricted-substance compliant build intent (EU 2011/65, UK SI 2012/3032). |
| **RoHS — China (EFUP)** | China RoHS / EFUP mark carried on the silkscreen. |
| **WEEE / REACH** | Applicable as an electronic accessory; statements to be finalised with the DoC. |
| **FCC** | No intentional radiator; passive accessory — no active-emitter FCC scope. |

## Why so light

TrueZ contains only two RF transformers and a passive resistor/capacitor network. It draws no power and emits nothing of its own; it is connected only between a LISN and a spectrum analyser on the bench. The compliance burden is therefore the material (RoHS) and waste (WEEE) regimes rather than emissions/immunity testing.

Note that TrueZ is a tool used *for* conducted-emissions diagnosis (per **CISPR 25**); that standard is the measurement context, not a certification the device itself carries.

The version/variant strings and QR code in the current silkscreen artwork are pre-production placeholders — see [Tasks](../tasks.md).

## Related pages

- [CANBench TrueZ home](/canbench-truez/v1.1/)
- [Circuit Design](../circuit-design/index.md)
- [Tasks](../tasks.md)

## References

- EU 2011/65 (RoHS, recast) and amendments — restriction of hazardous substances.
- UK SI 2012/3032 — The Restriction of the Use of Certain Hazardous Substances in Electrical and Electronic Equipment Regulations.
- Directive 2012/19/EU (WEEE); Regulation (EC) 1907/2006 (REACH).
- CISPR 25 — measurement context for conducted-emissions diagnosis (the use case for the instrument, not a mark it carries).
