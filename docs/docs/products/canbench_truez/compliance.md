# Compliance

This page explains how the CANBench TrueZ fits within common regulatory frameworks. The product is a passive, non‑powered CM/DM noise separator intended for bench diagnostics alongside a DC LISN and a spectrum analyzer. It contains no active electronics and operates only through the signals provided by attached test equipment. The notes below describe which schemes apply, how we demonstrate conformity, and what markings or labels are used when the product is placed on the market in different regions.

!!! note
    This page provides implementation guidance for our own documentation. It is not legal advice. Market‑specific rules change; always check the current legislation and your importer’s obligations before sale.

## CE Mark

In the EU, CE marking is required when at least one CE‑marking directive applies. TrueZ does not fall under the Low Voltage Directive (2014/35/EU) because there is no mains or high‑voltage input, and it is not radio equipment. As a passive test accessory it is generally outside the scope of the EMC Directive (2014/30/EU) because it neither generates disturbances nor is susceptible in a way that would impair its intended function. However, the Restriction of Hazardous Substances Directive (RoHS, 2011/65/EU as amended by 2015/863) **is** a CE‑marking measure and does apply to articles with electrical connectors placed on the market.

Our approach is to affix the CE mark on the basis of RoHS conformity and to retain a Declaration of Conformity (DoC) that cites RoHS as the applicable legislation. The technical file includes supplier material declarations, an internal risk assessment (for completeness), and drawings showing labels and traceability marks.

## UKCA Mark

For the UK market, the logic mirrors the EU case. TrueZ is non‑powered test gear and falls outside the scope of UK EMC and LVD regulations, but it is within **UK RoHS** (The Restriction of the Use of Certain Hazardous Substances in Electrical and Electronic Equipment Regulations 2012 and amendments). We apply the **UKCA** mark based on RoHS conformity and maintain a UK Declaration of Conformity with the same evidence set as the EU file.

## FCC Compliance

In the United States, FCC Part 15 regulates radio‑frequency devices that radiate or intentionally generate RF energy. TrueZ is a passive accessory with no digital circuitry, clocks or power input. It is not an intentional radiator and is not a Part 15 unintentional radiator. No FCC equipment authorization, Supplier’s Declaration of Conformity, or FCC labeling is required. Packaging and user documentation still avoid implying radio function and include normal safety/common‑sense cautions appropriate for lab hardware.

## WEEE Compliance

The EU/UK WEEE schemes cover electrical and electronic equipment (EEE) that depends on electric currents to work. TrueZ is a passive mechanical/electrical article that does not itself need power to function; it does not meet the WEEE definition of EEE. We therefore do **not** mark the crossed‑out wheelie‑bin symbol and do not register as an EEE producer for this product. Where local take‑back or recycling schemes for **packaging** apply, we follow them (see EPR section).

## REACH Compliance

REACH imposes duties relating to Substances of Very High Concern (SVHCs) in articles. We request full‑material disclosures from suppliers, screen against the latest SVHC candidate list, and issue communication statements if any SVHC is present above 0.1% w/w in any homogeneous material. Where required in the EU, we submit SCIP notifications. The current design uses standard FR‑4 laminate, solder mask, SMA connectors and passive components; none are expected to contain SVHCs above threshold. We maintain evidence in the technical file and review with each significant BOM change.

## RoHS (EU/UK)

TrueZ conforms to EU RoHS (2011/65/EU as amended) and UK RoHS limits for lead, mercury, cadmium, hexavalent chromium, PBB, PBDE and the four phthalates. Conformity is demonstrated through supplier declarations, material data (IPC‑1752A where available), and audit sampling when components change. The CE/UKCA marks are applied on this basis, with traceability via product code and serial/batch number.

## RoHS (China)

If supplied to mainland China, we provide a China RoHS 2 material disclosure table (per GB/T 26572 and SJ/T 11364) and apply the appropriate environmental labeling, including the Environment‑Friendly Use Period (EFUP) mark. Given the materials used, we expect an EFUP of **10 years**, subject to supplier disclosures. Packaging and manuals include the table and icons in simplified Chinese as required.

## RoHS Korea

If placed on the Korean market, we meet the Korea RoHS/ELV/REACH scheme under the Act on Resource Circulation of Electrical and Electronic Equipment and Vehicles. This includes material restrictions equivalent to EU RoHS and, where required, provision of conformity information in Korean.

## California Prop 65 warning

California’s Proposition 65 requires a consumer warning if listed chemicals are present at exposure levels above the safe harbor. TrueZ is an industrial/lab accessory with minimal user exposure and is not expected to require a Prop 65 warning based on materials and typical use. We avoid blanket warnings; if any component change introduces a listed chemical with potential exposure, we will reassess and label accordingly.

## EU/UK packaging EPR & labelling

Packaging is covered by extended producer‑responsibility (EPR) rules in the EU and UK. We minimize packaging and use recyclable materials with clear identification codes (e.g., PAP, LDPE). Where thresholds require registration, we register as a packaging producer and report placed‑on‑market tonnage through the relevant scheme. On‑pack recycling marks and country‑specific symbols are applied as needed. The product itself carries CE/UKCA marks (RoHS basis), the manufacturer’s name and web address, model code, and batch/serial for traceability.

## Traceability and Declarations

* Declaration of Conformity (EU): cites RoHS 2011/65/EU (as amended). Kept with the technical file and supplied digitally on request.
* Declaration of Conformity (UK): cites UK RoHS. Supplied similarly.
* Technical file: BOM and supplier RoHS/REACH statements, mechanical drawings, label artwork, risk/justification notes for EMC/LVD out‑of‑scope decisions.

For questions about regional labeling or to request the current DoC, contact `compliance@scadys.io`.

## Compliance Matrix of Product Tiers

Refer to the matrix below to assess the level of compliance required for each produc tier.

{% include-markdown "assets/include/compliance_matrix.html" %}

## References
1. European Union, [*Directive 2014/30/EU on electromagnetic compatibility (EMC)*](https://eur-lex.europa.eu/eli/dir/2014/30/oj), Official Journal of the European Union, 2014  
2. UK Government, [*Electromagnetic Compatibility Regulations 2016*](https://www.gov.uk/guidance/emc-regulations-2016), UK Legislation and Guidance, 2016  
3. Federal Communications Commission, [*47 CFR Part 15 – Radio Frequency Devices*](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15), Electronic Code of Federal Regulations, 2024  
4. Innovation, Science and Economic Development Canada, [*Interference-Causing Equipment Standards*](https://ised-isde.canada.ca/site/spectrum-management-telecommunications/en/technical-standards-procedures/radio-standards-specifications/rss), ISED Technical Standards, 2024  
5. Australian Communications and Media Authority, [*Regulatory Compliance Mark (RCM)*](https://www.acma.gov.au/industry/supplier-compliance/regulatory-compliance-mark-rcm), ACMA Guidance, 2024  
6. International Electrotechnical Commission, [*IEC 61010-1: Safety requirements for electrical equipment for measurement, control, and laboratory use*](https://webstore.iec.ch/publication/1283), IEC Webstore, 2010  
7. European Union, [*Directive 2011/65/EU on the restriction of hazardous substances (RoHS)*](https://eur-lex.europa.eu/eli/dir/2011/65/oj), Official Journal of the European Union, 2011  
8. UK Government, [*Restriction of the Use of Certain Hazardous Substances (RoHS) Regulations*](https://www.gov.uk/guidance/rohs-compliance-and-guidance), UK Legislation and Guidance, 2012  
9. European Commission, [*Waste electrical and electronic equipment (WEEE)*](https://environment.ec.europa.eu/topics/waste-and-recycling/waste-electrical-and-electronic-equipment-weee_en), Environment Policy Guidance, 2024  
10. European Chemicals Agency, [*REACH authorisation process*](https://echa.europa.eu/regulations/reach/authorisation/reach-authorisation-process), ECHA Guidance, 2024  
11. Standardization Administration of China, [*SJ/T 11364: Marking for the restriction of hazardous substances in electrical and electronic products*](https://standards.globalspec.com/std/14383091/sj-t-11364), Chinese Standards, 2014  
12. Korean Agency for Technology and Standards, [*K-RoHS – Electrical and electronic equipment regulations*](https://www.kats.go.kr/en/kats/statutes/view.do?seq=53), KATS Statutes, 2024  
13. European Commission, [*Packaging and packaging waste*](https://environment.ec.europa.eu/topics/waste-and-recycling/packaging-and-packaging-waste_en), Environment Policy Guidance, 2024  
14. Office of Environmental Health Hazard Assessment, [*California Proposition 65*](https://oehha.ca.gov/proposition-65), OEHHA Guidance, 2024  
15. European Commission, [*Declaration of conformity guidance*](https://ec.europa.eu/docsroom/documents/45705), EU Commission Guidance, 2021  
16. International Organization for Standardization, [*ISO/IEC 17025: General requirements for the competence of testing and calibration laboratories*](https://www.iso.org/standard/66912.html), ISO Standards, 2017  
17. International Organization for Standardization, [*ISO 9001: Quality management systems*](https://www.iso.org/iso-9001-quality-management.html), ISO Standards, 2015  
18. International Electrotechnical Commission, [*IEC 62368-1: Audio/video, information and communication technology equipment*](https://webstore.iec.ch/publication/7574), IEC Webstore, 2018  
19. International Electrotechnical Commission, [*IEC 61558: Safety of power transformers, power supplies, reactors and similar products*](https://webstore.iec.ch/publication/150), IEC Webstore, 2005  
20. United Nations Economic Commission for Europe, [*UNECE Regulation No. 10: Electromagnetic compatibility*](https://unece.org/transport/vehicle-regulations/un-regulation-no-10-electromagnetic-compatibility), UNECE Vehicle Regulations, 2021  
21. European Union, [*Directive 2014/53/EU on radio equipment (RED)*](https://eur-lex.europa.eu/eli/dir/2014/53/oj), Official Journal of the European Union, 2014  

