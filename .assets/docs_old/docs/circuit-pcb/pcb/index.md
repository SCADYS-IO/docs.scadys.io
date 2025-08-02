# PCB Design

This section covers the mechanical and electrical layout considerations of the MDD400 printed circuit board. It includes the arrangement of key components, connector placement, layer stackup, grounding strategy, thermal management, and mechanical fastening. These aspects collectively support EMC performance, mechanical integrity, manufacturability, and serviceability.

* *[Stackup](stackup.md)*: Defines the four-layer PCB construction used in the MDD400, including signal, power, and ground planes. Stackup design supports controlled impedance routing, effective EMI containment, and robust return path integrity for high-speed and power signals.
* *[Layout](layout.md)*: Describes the general arrangement of power, signal, and ground routing on the PCB. Includes placement strategies for analog/digital separation, component grouping, interface boundaries, and signal integrity control for high-speed and sensitive signals.
* *[Earthing](earthing.md)*: Describes the grounding and shielding strategy across functional domains—logic, CAN, serial, and chassis ground. Includes net-tie details, isolated ground regions, and return path management.
* *[Galvanic Isolation](galvanic_isolation.md)*: Describes the isolation barriers that separate the CAN and SeaTalk/Serial domains from the main `DIGITAL` Domain. Includes implementation details, creepage/clearance enforcement, and conformance to isolation voltage requirements.
* *[Thermal Management](thermal_management.md)*: Documents the copper pours, via stitching, and thermal relief strategies used to manage heat dissipation from switching regulators, power semiconductors, and the LCD backlight driver.
* *[Connectors](connectors.md)*: Lists all onboard connectors with notes on mechanical alignment, strain relief, and placement relative to housing openings and cable routing constraints.
* *[Fasteners](fasteners.md)*: Specifies PCB mounting hardware, hole locations, and mechanical constraints used to secure the board within the enclosure and maintain alignment.

This section provides reference information for layout review, board fabrication, and integration into the mechanical enclosure.
