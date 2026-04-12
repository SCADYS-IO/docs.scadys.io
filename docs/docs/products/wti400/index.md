# WTI400 Analog Wind Transducer Interface

This page provides design and integration documentation for the **WTI400**, a marine wind transducer interface designed to bridge legacy analog masthead wind sensors into modern NMEA 2000 and legacy serial networks.

The WTI400 is a wind-focused specialization of the earlier MLI400 platform. It removes non-wind sensor channels (paddlewheel and thermistor) and extends compatibility across legacy wind transducer types, while adding onboard 6-axis motion sensing to support movement-stabilized wind processing.

## Documentation

* *[Circuit & PCB](circuit-pcb/index.md)* - hardware architecture, power and isolation strategy, digital and analog signal paths, and legacy serial interface implementation;
* *[Housing Design](housing/index.md)* - enclosure and connector layout considerations for marine installation;
* *[User Experience](ux/index.md)* - button and status behaviors plus Bluetooth/app interaction workflow;
* *[Firmware](firmware/index.md)* - firmware architecture, configuration model, and release tracking;
* *[Compliance](compliance/index.md)* - regulatory and standards targets for marine deployment.

!!! note
	For board-level implementation details, use the [WTI400 quick reference](quick_reference.md), including GPIO assignments, connector definitions, I2C devices, partition table, and PCB stackup.

## Scope

This documentation is intended for:

* engineering review of electrical and firmware architecture;
* integration of WTI400 into NMEA 2000 and mixed-protocol systems;
* manufacturing and test planning for pre-production and pilot builds; and
* future firmware migration and maintenance work in SCADYS.io repositories.

## Standards and Protocol Context

WTI400 is designed with reference to:

* *NMEA 2000 / CANBUS* - high-speed marine backbone integration;
* *NMEA 0183 and SeaTalk I* - legacy serial interoperability;
* *EMC and product compliance pathways* - CE, FCC, UKCA, and related market-entry requirements.

See [Compliance](compliance/index.md) for detailed status and target obligations.

## Product Background

WTI400 inherits field-proven concepts from the MLI400 lineage while narrowing scope to wind instrumentation. The design emphasis is robust legacy transducer support, predictable behavior in dynamic marine motion, and practical interoperability with both modern and legacy onboard electronics.

See [License Terms](../../about/license.md) for conditions of use and intellectual property ownership.
