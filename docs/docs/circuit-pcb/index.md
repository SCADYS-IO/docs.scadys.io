# Circuit & PCB

This section documents the complete electronics design of the MDD400, including schematics, power systems, sensors, communication interfaces, mechanical layout, and connector strategy. The subsections below cover all aspects of the circuit and PCB, from microcontroller integration to environmental considerations and mounting hardware.

* *[MCU and Storage](mcu_storage/index.md)*: Describes the ESP32-S3 microcontroller, external memory, and flash storage components. Includes details on peripheral connections, GPIO mapping, and boot configuration.

* *[Power Supply](power/index.md)*: Details the system's power architecture, including input protection, voltage regulation, and supply domains for digital, analog, and isolated CAN transceivers. Each power rail is described with respect to its design constraints and safety features.

* *[Communications](communications/index.md)*: Covers CANBUS (NMEA 2000 and RV-C), legacy serial (NMEA 0183, SeaTalk), Wi-Fi, and Bluetooth interfaces. Includes connector information, electrical isolation, signal conditioning, and protocol compatibility.

* *[Sensors](sensors/index.md)*: Documents onboard and external sensors, including voltage, current, temperature, ambient light, and wind transducers. Covers signal processing and sampling methods.

* *[User Interface](ui/index.md)*: Describes the touchscreen LCD interface, backlight control, and display enable logic. Covers both hardware integration and signal routing for the user interface subsystem.

* *[Expansion Connectors](connectors/index.md)*: Summarizes the physical headers used for in-field expansion, including I²C, 1-Wire, and ESP-PROG interfaces. Includes pinout, power availability, and supported external peripherals.

* *[PCB Design](pcb/index.md)*: Covers physical layout, connector placement, board stackup, grounding, and thermal management. Includes mechanical integration details and design for manufacturability.

This section serves as the primary reference for circuit analysis, hardware debug, and system integration.
