# WTI400 Circuit Design and PCB Layout

This section documents the WTI400 hardware architecture and board-level implementation. The design is organized into functional domains so power flow, isolation boundaries, signal conditioning, and protocol interfaces can be reviewed independently.

!!! note
	Refer to the [WTI400 quick reference](../quick_reference.md) for GPIO assignments, I2C device map, connector definitions, flash partitions, and PCB stackup.

## Functional Domains

The WTI400 documentation is structured across four domain views:

* *[POWER](power/index.md)* - isolated supply generation for digital logic and wind transducer rails (`VCC` and `VAS`);
* *[DIGITAL](digital/index.md)* - ESP32-S3 control logic, CAN transceiver interface, programming header, and local status peripherals;
* *[ANALOG](analog/index.md)* - wind transducer analog front-end and signal conditioning path;
* *[LEGACY IO](seatalk/index.md)* - SeaTalk I / NMEA 0183-compatible serial interface and isolation circuits.

## Design Priorities

The circuit and layout implementation prioritizes:

* compatibility with legacy analog wind transducers;
* interoperability with NMEA 2000 and legacy serial systems;
* domain isolation and noise suppression suitable for marine installations; and
* maintainable partitioning for firmware and hardware verification.

## Domain Boundaries and Isolation

Isolation and boundary control are central to WTI400 behavior under electrical noise and transients. The `POWER` and `DIGITAL` domain documentation describes the galvanic and high-impedance boundaries, while `LEGACY IO` documents opto-isolated serial signal handling.

For details, start with [POWER](power/index.md) and then follow each domain section.
