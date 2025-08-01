# MDD400 Marine Data Display

This page contains detailed design documentation for the **MDD400**, a marine data display designed for integration into NMEA 2000 and legacy serial systems. The information is intended for engineers and technical stakeholders involved in system integration, evaluation, and product development.

The MDD400 is a self-contained embedded system with a touchscreen user interface, designed to operate in marine environments. It supports galvanically isolated CANBUS communication, 12 V serial protocols, Bluetooth configuration, and multiple regulated power domains.

---

## Documentation

* *[Circuit & PCB](circuit-pcb/index.md)* – system architecture, schematics, component selection, and PCB layout. This includes microcontroller, isolated and non-isolated power supplies, CANBUS interface, serial protocols, and sensors;
* *[Housing Design](housing/index.md)* – the enclosure, gaskets, mechanical fasteners, and environmental sealing;
* *[User Experience](ux/index.md)* – on-screen interface, mobile app configuration, and user interaction in marine environments;
* *[Firmware](firmware/index.md)* – embedded software architecture, configuration, and runtime services;
* *[Compliance](compliance/index.md)* – design targets for CE, FCC, IP rating, RoHS, and NMEA 2000 conformity.

Each section corresponds to a functional domain within the product architecture and aligns with the documentation navigation structure.

---

## Scope

This documentation provides:

* technical reference for all subsystems and their implementation;
* integration material for use with other onboard systems;
* support for certification, procurement, and engineering review; and
* guidance for licensed developers extending firmware or hardware functionality.

---

## Standards and Compliance

The MDD400 is designed with reference to the following standards:

* *CANBUS / NMEA 2000*: physical layer compatible with [ISO 11898-2](https://www.iso.org/standard/66340.html) and designed for use on [NMEA 2000](https://www.nmea.org/nmea-2000.html) networks;
* *Legacy Serial Protocols*: 12 V-level compatibility with [NMEA 0183](https://www.nmea.org/nmea-0183.html) and SeaTalk;
* *EMC and Safety*: target compliance with [CE](https://ec.europa.eu/growth/single-market/ce-marking_en), [FCC Part 15B](https://www.fcc.gov/engineering-technology/laboratory-division/general/equipment-authorization), and UKCA EMC directives;
* *Ingress Protection*: housing targets *IP65*, suitable for exposed marine installations.

The MDD400 is currently in the pre-production stage and will undergo independent testing prior to commercial release.

---

## Background

The MDD400 was developed during a full circumnavigation, with extensive field testing in operational conditions. Its design reflects the requirements of extended offshore use, including electrical isolation, protocol compatibility, and robust packaging.

This documentation reflects the current pre-production design revision.

---

See [License Terms](../license.md) for conditions of use and intellectual property ownership.

---

## References

1. ISO, "[ISO 11898-2:2016 - Road vehicles — Controller area network (CAN) — Part 2: High-speed medium access unit](https://www.iso.org/standard/66340.html)"
2. National Marine Electronics Association, "[NMEA 2000](https://www.nmea.org/nmea-2000.html)"
3. National Marine Electronics Association, "[NMEA 0183](https://www.nmea.org/nmea-0183.html)"
4. European Commission, "[CE Marking](https://ec.europa.eu/growth/single-market/ce-marking_en)"
5. FCC, "[FCC Part 15B - Equipment Authorization](https://www.fcc.gov/engineering-technology/laboratory-division/general/equipment-authorization)"
6. UK Government, "[Using the UKCA marking](https://www.gov.uk/guidance/using-the-ukca-marking)"
