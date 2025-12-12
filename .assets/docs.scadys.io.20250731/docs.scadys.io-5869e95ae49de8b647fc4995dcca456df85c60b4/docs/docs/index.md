# MDD400 Technical Documentation

This site contains detailed design documentation for the **MDD400**, a marine data display designed for integration into NMEA 2000 and legacy serial systems. The information presented here is intended for engineers and technical stakeholders involved in system integration, product evaluation, and development.

The MDD400 is a self-contained embedded system with a touchscreen user interface, designed to operate in marine environments. It supports galvanically isolated CANBUS communication, 12 V serial protocols, Bluetooth configuration, and multiple regulated power domains.

---

## Documentation

* *[Circuit & PCB](circuit-pcb/index.md)* – Hardware architecture, schematics, component selection, and PCB layout. This section includes the microcontroller, power supply, communications, sensors, and board design.
* *[Housing Design](housing/index.md)* – The physical enclosure, environmental sealing, and mounting features. Covers front bezel, rear casing, panel overlay, gaskets, and mechanical integration.
* *[User Experience](ux/index.md)* – Describes how users interact with the device, including on-screen navigation, mobile app configuration, and UI behavior in marine conditions.
* *[Firmware Architecture](firmware/index.md)* – The software running on the MDD400. Includes system structure, task scheduling, configuration, and embedded services.
* *[Regulatory Compliance](compliance/index.md)* – Applicable standards and conformity documentation for CE, FCC, RoHS, IP rating, and NMEA 2000 certification.
* *[References](references.md)* – Supporting documents, data sheets, and external standards referenced in the design.
* *[License Terms](license.md)* – Terms of use, licensing, and intellectual property ownership under which this documentation and associated IP are provided.

Each section corresponds to a subsystem and follows the hardware and firmware structure defined in the schematics and PCB layout.

---

## Scope

This documentation is intended to provide:

* Sufficient detail to understand all major subsystems and their implementation
* Reference material for integration with other onboard electronics
* Technical background for certification, review, or procurement purposes
* Support for licensed developers and partners customizing firmware or extending functionality

---

## Standards and Compliance

The MDD400 is designed with reference to the following technical standards and regulatory requirements:

* *CANBUS / NMEA 2000*: Compatible with the [ISO 11898-2](https://www.iso.org/standard/66340.html) physical layer and designed for use with [NMEA 2000](https://www.nmea.org/nmea-2000.html) marine networks.
* *Legacy Serial Protocols*: Supports 12 V serial interfaces, electrically compatible with [NMEA 0183](https://www.nmea.org/nmea-0183.html) and SeaTalk systems.
* *EMC and Safety*: Design practices align with the intent of [CE](https://ec.europa.eu/growth/single-market/ce-marking_en), [FCC Part 15B](https://www.fcc.gov/engineering-technology/laboratory-division/general/equipment-authorization), and UKCA EMC and safety directives. Specific testing for emissions, immunity, and safety is planned for final production units.
* *Environmental Protection*: Housing design targets ingress protection rating of *IP65*, suitable for use in exposed marine installations.

The MDD400 is currently in the pre-production phase. The device will undergo independent testing to verify compliance with [CE](https://ec.europa.eu/growth/single-market/ce-marking_en), [FCC Part 15B](https://www.fcc.gov/engineering-technology/laboratory-division/general/equipment-authorization), and [UKCA](https://www.gov.uk/guidance/using-the-ukca-marking) prior to commercial release.

---

## About the MDD400

The MDD400 was developed in a marine operational context, with field testing conducted during a full circumnavigation. Its design reflects the practical requirements of extended offshore deployment, including electrical isolation, redundant protection features, and support for legacy and modern protocols.

This documentation reflects the current pre-production design revision.

---

**See [License Terms](license.md) for conditions of use and intellectual property rights.**
