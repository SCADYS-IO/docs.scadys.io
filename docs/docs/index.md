# MDD400 Technical Documentation

This site contains detailed design documentation for the **MDD400**, a marine data display designed for integration into NMEA 2000 and legacy serial systems. The information presented here is intended for engineers and technical stakeholders involved in system integration, product evaluation, and development.

The MDD400 is a self-contained embedded system with a touchscreen user interface, designed to operate in marine environments. It supports galvanically isolated CANBUS communication, 12 V serial protocols, Bluetooth configuration, and multiple regulated power domains.

---

## Documentation Structure

* [Circuit & PCB](circuit-pcb/index.md)

  * [MCU and Storage](circuit-pcb/mcu_storage/index.md)
  * [Power Supply](circuit-pcb/power/index.md)
  * [Communications Interfaces](circuit-pcb/communications/index.md)
  * [Sensors](circuit-pcb/sensors/index.md)
  * [User Interface](circuit-pcb/ui/index.md)
  * [Expansion Connectors](circuit-pcb/connectors/index.md)
  * [PCB Design](circuit-pcb/pcb/index.md)
  * [Appendices](circuit-pcb/appendices.md)
  * [Change Log](circuit-pcb/changelog.md)

* [Housing Design](housing/index.md)

* [User Experience](ux/index.md)

* [Firmware Architecture](firmware/index.md)

* [Regulatory Compliance](compliance/index.md)

* [References](references.md)

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

* **CANBUS / NMEA 2000**: Compatible with the ISO 11898-2 physical layer and designed for use with NMEA 2000 marine networks.
* **Legacy Serial Protocols**: Supports 12 V serial interfaces, electrically compatible with NMEA 0183 and SeaTalk systems.
* **EMC and Safety**: Design practices align with the intent of CE, FCC Part 15B, and UKCA EMC and safety directives. Specific testing for emissions, immunity, and safety is planned for final production units.
* **Environmental Protection**: Housing design targets ingress protection rating of **IP65**, suitable for use in exposed marine installations.

The MDD400 is currently in the pre-production phase. The device will undergo independent testing to verify compliance with [CE](https://ec.europa.eu/growth/single-market/ce-marking_en), [FCC Part 15B](https://www.fcc.gov/engineering-technology/laboratory-division/general/equipment-authorization), and [UKCA](https://www.gov.uk/guidance/using-the-ukca-marking) prior to commercial release.

---

## About the MDD400

The MDD400 was developed in a marine operational context, with field testing conducted during a full circumnavigation. Its design reflects the practical requirements of extended offshore deployment, including electrical isolation, redundant protection features, and support for legacy and modern protocols.

This documentation reflects the current pre-production design revision.
