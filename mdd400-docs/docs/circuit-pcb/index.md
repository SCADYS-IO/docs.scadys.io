# Introduction

The MDD400 is a compact data display unit designed for integration with modern marine and recreational vehicle (RV) electrical systems. It is optimised for the NMEA 2000[^8]/CANBUS backbone, displaying data via a serial HMI interface driven over UART. Offloading graphical updates to the display controller allows the onboard microcontroller to focus on interfacing, protocol translation, and data processing, supporting a wide range of sensor and bus configurations.

## Design Philosophy

The MDD400 was developed for deployment in marine environments, where electrical systems are exposed to harsh physical conditions and frequent voltage disturbances. However, recognising the similarity between marine and automotive/RV 12 V systems --- particularly in terms of wiring topology, fault conditions, and user expectations --- the MDD400 has been designed with potential future certification for road-going vehicles in mind. 

The overarching philosophy is to design for realistic abuse scenarios, reducing the likelihood of damage in the field and thereby eliminating the need for return-to-base repairs. This strategy supports the planned 24-month, no-questions-asked replacement warranty --- a competitive differentiator intended to rival established marine brands while avoiding the overhead of setting up global repair facilities.

This section outlines the design principles, performance goals and safety considerations that inform the entire hardware design.

### Environmental and Electrical Survivability

The MDD400 must survive common transients found on 12 V DC supply rails, including:

- load dump conditions up to 150 V (per ISO 7637-2[^1] Pulse 5b);
- reverse polarity connection of 12--14 V;
- electrostatic discharge (ESD), following IEC 61000-4-2[^2];
- conducted and radiated emissions (per CISPR 25 / EN 55025[^3]);
- and ground bounce and other anomalies from long DC wiring typical in boats and RVs.

To ensure compatibility with both marine and automotive domains, protection circuitry has been tested against the most demanding load dump waveforms from ISO 7637-2[^1], and both power supply and communication interfaces have been isolated or filtered to maintain signal integrity and protect sensitive components.

### Robust Power Distribution

Four separate power rails are implemented:

- *primary power domain*, supplying a 5 V rail at up to 2.0A peak using a switching regulator;
- *digital logic domain,* supplying a regulated low-ripple 3.3 V rail using a linear LDO regulator; and
- *analog sensor domain*, supplying a 8V / 6.5v rail at up to 50mA using a linear LDO for the wind sensor interface.

Each includes current limiting, thermal protection, and either undervoltage lockout (UVLO) or controlled enable logic. Combined with a discrete surge stopper circuit, the system is designed to self-recover from faults without the use of fuses or mechanical resets.

The 5 V rail is generated from the 12 V input using a high-efficiency synchronous buck converter, reducing power loss while providing a stable intermediate supply. This 5 V rail feeds the serial display and acts as the input to the 3.3 V LDO, ensuring low ripple on the digital logic rail. This architecture improves efficiency over directly stepping 12--14.8 V down to 3.3 V, while retaining the noise performance and simplicity of LDO regulation where it matters most.

The 8 V rail is implemented using a low-dropout linear regulator and is used exclusively for the masthead analog wind transducer. The transducer draws less than 50 mA under normal operation, making the linear approach thermally acceptable and electrically clean. The regulator is selectively enabled via \[WIND_EN\], conserving power when the wind interface is not in use.

### Mission Resilience and Safety

Critical circuits (e.g. such as power monitoring, communication interfaces and display) remain functional under abnormal voltage conditions. The system does not rely on any software-controlled start-up sequence or central controller to protect hardware against electrical faults. Where possible, faults are detected and isolated at the analog level.

Additionally:

- the device is protected against short-circuits and sustained over-voltage;
- no fuse is required to isolate faults --- the MOSFET protection circuit self-recovers;
- dual-input polarity protection ensures that legacy serial and NMEA2000 inputs remain independent.

### Electromagnetic Compatibility (EMC)

EMC compliance was a foundational design requirement. Particular attention was given to:

- separation of analog and digital ground planes;
- use of common-mode chokes, pi filters and LC filtering at all external interfaces;
- low-inductance return paths and surface-mount TVS diodes; and
- and shielding/isolation of NMEA2000 and legacy serial connectors.

The product is designed to meet both CE and FCC Class B emissions limits and includes on-board suppression to meet ISO 11452-2[^4] and ISO 7637-2[^1].

### Serviceability and Field Upgradeability

Firmware updates and configuration are supported over Bluetooth/BLE. In production, firmware flashing is performed using a pogo-pin programming jig that interfaces with a 6-pin 0.5 mm pitch header footprint compatible with the ESP-PROG programmer. The 6-pin header, while fitted to prototypes, is not populated in the final assembly. It may be included in a development or open-source variant. Currently, the programming interface includes polarity protection for power pins but lacks further ESD or transient protection --- this will be reviewed in future revisions.

The internal regulators and protection circuits are designed to handle most common wiring faults gracefully, allowing field servicing with minimal tools or expertise.

The design is prepared for dual certification paths: marine installations via NMEA2000 guidelines and CE/FCC emissions certification, with provisions for future expansion into the recreational vehicle (RV) space.

## Functional Domains.

Key hardware features include:

- CANBUS interface for communicating with the NMEA 2000[^8] backbone;
- TFT LCD display with capacitive touch screen connected via high-speed UART;
- ambient light sensor connected to the I²C bus;
- temperature and power sensing systems for protection and diagnostics;
- robust, fault-tolerant hardware and interfaces designed for marine electrical environments;
- optional plug-and-play legacy serial data interface (e.g. NMEA 0183 or SeaTalk-compatible) on selected models;
- support for analog wind transducers (angle and speed) on selected models;
- Bluetooth/BLE for configuration and firmware updates via mobile app; and
- Wi-Fi-ready for future protocols such as SignalK and OneNet.

The hardware is organized into five functional domains (subsystems), as shown in the block diagram:

### Power Supply

The system is powered from a 12 V source via either the NMEA 2000[^8] network or the (optional) legacy serial connection. Input power passes through reverse polarity protection, surge and current limiting, and an EMI filter before being regulated to:

- 5 V for display and logic circuits (via SMPS);
- 3.3 V for the digital domain (via LDO); and
- 8 V for the analog wind transducer interface (via LDO) on selected models.

All three regulators are designed to balance cost, robustness, and efficiency in line with the MDD400's overall mission to survive real-world abuse without requiring repair or user intervention.

### Communication Interfaces

All versions of the MDD400 are supplied with an industry standard CANBUS interface that is electically compatible with NMEA 2000[^8] and RV-C backbones. On selected models a RS422 compatible, plug&play interface that accepts legacy marine serial protocols such as NMEA 0183 and SeaTalk® is also provided.

### Sensors

The following sensors are used by the MDD400:

- ESP32-S3[^7] integrated temperature sensor for diagnostics and protection;
- analog current and voltage sensors for self-monitoring and diagnostics; and
- Texas Instruments OPT3004[^5] ambient light sensor on the I²C bus for automatic display dimming.

An analog wind transducer input for analog wind angle and frequency-based wind speed measurement is provided on selected models.

### User Interface

A custom DWIN DMG48480F040_01WTC[^1] capacitive touchscreen display is used as user interface. The 4" TFT LCD display has a resolution of 480×480 pixels and communicates with the ESP32-S3[^7] over UART using the DGUS II protocol.

### Processing

An Espressif ESP32-S3[^7] microcontroller module handles all system logic, sensing, and communication. It manages protocol parsing, sensor readings, and updates to the display. The module includes Bluetooth/BLE for configuration and firmware updates, with Wi-Fi reserved for future features.

[^1]: ISO 7637-2:2011, *Road vehicles — Electrical disturbances from conduction and coupling — Part 2: Electrical transient conduction along supply lines only* International Organization for Standardization, 2011*
[^2]: IEC 61000-4-2:2008, *Electromagnetic compatibility (EMC) — Part 4-2: Testing and measurement techniques — Electrostatic discharge immunity test*, International Electrotechnical Commission, 2008*
[^3]: CISPR 25:2021, *Vehicles, boats and internal combustion engines – Radio disturbance characteristics – Limits and methods of measurement for the protection of on-board receivers, International Electrotechnical Commission (IEC), 2021*
[^4]: ISO 11452-2:2021, *Road vehicles — Component test methods for electrical disturbances from narrowband radiated electromagnetic energy — Part 2: Absorber-lined shielded enclosure, International Organization for Standardization, 2021*
[^5]: Texas Instruments, [*OPT3004 — Ambient Light Sensor*](https://www.ti.com/lit/ds/symlink/opt3004.pdf), Rev. E, Oct. 2020
[^6]: DWIN Technology, [*DMG48480F040_01WTC – 4.0 Intelligent Display, COF Series*](https://www.dwin-global.com/4-0-inch-intelligent-display-model-dmg48480f040_02wtcz02cof-series-product/)
[^7]: Espressif Systems, [*ESP32-S3-WROOM-1/1U/2 Datasheet: Wi-Fi & Bluetooth LE SoC Modules*](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_datasheet_en.pdf), v1.9, 2023
[^8]: NMEA,  *NMEA 2000® Standard for Serial-Data Networking of Marine Electronic Devices, Version 3.200, National Marine Electronics Association, 2018*
