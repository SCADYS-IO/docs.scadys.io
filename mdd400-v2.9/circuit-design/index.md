---
title: Circuit Design
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
sidebar_label: Overview
---

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype — testing phase

:::

## System Architecture

The MDD400 is a marine data display that connects to an NMEA 2000 backbone, receives CAN bus data, and presents it on a 4-inch TFT capacitive touch display. Power and data are supplied by a single NMEA 2000 DeviceNet Micro-C connector, which provides nominal 12 V supply, CAN-H, and CAN-L signals. The device is a fully self-contained node: no external power supply is required beyond the NMEA 2000 network connection.

The circuit is organised into three electrically isolated functional domains. The **CAN domain** (GNDC/NET-C) accepts raw 12 V input and hosts the CAN transceiver and input protection circuitry. The **SMPS domain** (GNDSMPS) provides two isolated regulated rails — 3.3 V (VCC) and 5.0 V (VDD) — derived from the CAN domain via an internal DC-DC conversion stage. The **DIGITAL domain** (GNDREF) houses the ESP32-S3 microcontroller, sensors, display interface, and audio output. An optional fourth domain, the **LEGACY IO domain** (GNDS), provides a galvanically isolated interface to legacy serial (single-wire 12 V) and NMEA 0183 instruments.

Power flows from the NMEA 2000 connector through a multi-stage input protection network (TVS, MOV, polarity diode, resettable fuse, and 2-stage LC EMI filter), and then through two synchronous buck converters based on the Texas Instruments LMR51610. The 3.3 V rail powers all digital logic; the 5.0 V rail powers the DWIN TFT display and onboard buzzer.

Data flows from the NMEA 2000 CAN bus through the SN65HVD234 3.3 V CAN transceiver to the ESP32-S3 TWAI peripheral. The ESP32 decodes incoming PGN data, drives the DWIN display via UART2 using the DGUS II protocol, and monitors environmental conditions (temperature, ambient light, input voltage, and current) via a shared I²C bus. An optional legacy serial interface — accessed through TLP2309 opto-isolators — supports half-duplex Legacy Serial I and NMEA 0183 receive-only operation.

## Sub-Sheet Summary

| Subsystem | Sub-sheet | Role |
|---|---|---|
| CAN Bus Power & Protection | `can_bus_power.kicad_sch` | Input protection, EMI filtering, over-voltage cutoff, power conditioning for the CAN domain |
| Power Supplies & Domain Isolation | `power_supplies.kicad_sch` | 3.3 V and 5.0 V synchronous buck converters; domain isolation boundaries |
| CAN Transceiver & NMEA 2000 Interface | `can_transceiver.kicad_sch` | NMEA 2000 connector, CAN signal filtering, SN65HVD234 transceiver |
| ESP32-S3 Module & Programming | `esp32_module.kicad_sch` | ESP32-S3-WROOM-1 module, GPIO bias, ESP-PROG header, I²C bus |
| I²C Sensors | `i2c_sensors.kicad_sch` | INA219 power monitor, TMP112 temperature sensor, OPT3004 ambient light sensor |
| Display Interface | `display_interface.kicad_sch` | DWIN DGUS II display, FPC connector, P-channel MOSFET power switch |
| Buzzer Driver | `buzzer_driver.kicad_sch` | MLT-8530 buzzer, PWM driver, output low-pass filter |
| Legacy Serial RX | `legacy_serial_rx.kicad_sch` | Opto-isolated receive buffer, input protection, signal conditioning |
| Legacy Serial TX | `legacy_serial_tx.kicad_sch` | Opto-isolated TX and EN stages, open-drain NMOS line driver |
| PCB Markings & Compliance | `pcb_markings.kicad_sch` | Board stackup, fiducials, compliance marks, silkscreen labels |
