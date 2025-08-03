# TWAI / CAN

All versions of the MDD400 are equipped with an industry-standard [CANBUS interface](../can/can_transceiver.md) that is fully compatible with [NMEA 2000](https://www.nmea.org/nmea-2000.html) and RV-C backbones. The interface uses a standard 5-pin A-coded DeviceNet connector and is galvanically isolated for improved EMC performance and system reliability.
ith
Key features:

* galvanically isolated CAN transceiver ([ISO1042](https://www.ti.com/lit/ds/symlink/iso1042.pdf));
* ESD and surge protection compliant with CISPR 25 and ISO 11452-2;
* fully compliant with NMEA 2000 physical layer specification;
* shielding and filtering designed to eliminate ground loops and radiated noise; and
* protection features to prevent bus lock-up and ensure failsafe recovery.

Galvanic isolation of the CAN physical layer is achieved using the [ISO1042](https://www.ti.com/lit/ds/symlink/iso1042.pdf) isolated transceiver IC. This device provides 5 kVrms isolation between the controller side and the CAN side. A dedicated 5 V isolated supply, VCAN, is used to power the CAN side.

![CAN Transceiver Schematic](../../assets/images/can_transceiver_schematic.png)

Logic-level CAN communication is implemented through the TX and RX pins:

* `TWAI_TX` connects to the transceiver’s TXD pin. A 10 kΩ pull-up resistor ensures a defined idle state and reduces noise susceptibility when the MCU pin is high-Z; and
* `TWAI_RX` is connected to the transceiver’s RXD pin via a 390 Ω series resistor, which limits inrush current, dampens reflections, and protects the ESP32 input from voltage overshoot.
