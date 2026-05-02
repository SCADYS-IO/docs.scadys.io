---
title: MDD400 Overview
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

:::note Hardware version
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

The MDD400 is a marine data display designed for integration into NMEA 2000 and legacy serial (Autohelm/NMEA 0183) networks. It provides a 4-inch capacitive touchscreen interface for real-time vessel data, powered from the NMEA 2000 bus or an external 12 V supply. The v2.9 prototype is a 95 × 95 mm four-layer PCB based on an ESP32-S3-WROOM-1 module with galvanically isolated CAN transceiver, isolated Legacy Serial TX/RX, onboard power conditioning, and a suite of I²C environmental sensors.

The MDD400 supports NMEA 2000 (ISO 11898-2 CAN physical layer), 12 V single-wire Legacy Serial I bus, Bluetooth for mobile configuration, and the DWIN DGUS II display protocol. All marine bus interfaces are galvanically isolated from the internal digital ground. The device is designed for IP65 installation in cockpit and helm environments.

## Version History

| Version | Status | Summary |
|---|---|---|
| v2.10 | Work in progress | Not yet fabricated |
| v2.9 | Fabricated prototype | Ground-plane rework, CAN transceiver replaced (SN65HVD234DR), I²C isolator removed, Legacy Serial TX transistor improvements |
| v2.8 | Archived | Preceded v2.9 ground-plane and CAN transceiver changes |
| v2.7 | Archived | — |
| v2.6 | Archived | — |
| v2.5 | Archived | — |
| v2.4 | Archived | — |
| v2.3 | Archived | — |
| v2.2 | Archived | — |
| v2.1 | Archived | — |
| v2.0 | Archived | First v2.x major revision |
| v1.0 | Archived | Initial production-intent design |
