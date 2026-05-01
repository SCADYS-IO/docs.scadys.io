---
title: Circuit Design
sidebar_label: Overview
---

The MDD400 is a marine data display that receives NMEA 2000 network data via its CAN bus interface and presents instrument information on a DWIN colour touchscreen. The device is powered directly from the NMEA 2000 backbone (nominally 12 V) and draws no more than 500 mA at the network connector.

At its core is an Espressif ESP32-S3-WROOM-1 module running the application firmware over Wi-Fi and Bluetooth while simultaneously handling CAN bus traffic through the on-chip TWAI peripheral. A 50-pin FPC connector links the ESP32 to the DWIN display module via UART. A Legacy Serial interface provides backward compatibility with older instrumentation systems that use a proprietary single-wire protocol; both a receive and a transmit path are implemented with galvanic isolation.

Power enters through the NMEA 2000 Micro-C connector and immediately passes through a multi-stage protection circuit before being split into isolated domains. Two TI LMR51610 synchronous buck converters generate the 3.3 V digital rail (VCC) and the 5.0 V display rail (VDD) from the raw bus voltage. An HT7833 LDO supplements VCC during start-up. The Legacy Serial transmit path requires an isolated 12 V supply, generated on the isolated side by a ZXTR2012 high-voltage LDO. Ferrite beads and optoisolators establish hard boundaries between the SMPS, CAN, Digital, and Legacy Serial domains so that faults on the network wiring cannot propagate to the processor.

Data flows as follows: CAN bus signals arrive at the NMEA 2000 connector, pass through a common-mode filter and ESD clamp, and reach the SN65HVD234 transceiver, which presents a standard differential-to-logic interface to the ESP32 TWAI peripheral. I²C sensors on the board — an INA219 power monitor, an OPT3004 ambient-light sensor, and a TMP112 temperature sensor — are read by the firmware to manage power budgets and display brightness. Audible feedback is provided by a passive buzzer driven through a P-channel MOSFET switch.

## Subsystems

| Subsystem | Sub-sheet | Role |
|-----------|-----------|------|
| ESP32-S3 Module & Programming | `esp32_module.kicad_sch` | Main processor, programming interface, status LED |
| Power Supplies & Domain Isolation | `power_supplies.kicad_sch` | 3.3 V and 5.0 V DC-DC converters, domain isolation |
| CAN Bus Power & Protection | `can_bus_power.kicad_sch` | NMEA 2000 connector, overvoltage protection, current sensing |
| CAN Transceiver & NMEA 2000 Interface | `can_transceiver.kicad_sch` | Differential CAN transceiver, ESD clamp, common-mode filter |
| Display Interface | `display_interface.kicad_sch` | DWIN FPC connector, switched 5 V display supply |
| I²C Sensors | `i2c_sensors.kicad_sch` | Power, light, and temperature monitoring over I²C |
| Buzzer Driver | `buzzer_driver.kicad_sch` | PWM-driven passive buzzer for audible alerts |
| Legacy Serial RX | `legacy_serial_rx.kicad_sch` | Isolated receive path for single-wire legacy protocol |
| Legacy Serial TX | `legacy_serial_tx.kicad_sch` | Isolated transmit path for single-wire legacy protocol |
