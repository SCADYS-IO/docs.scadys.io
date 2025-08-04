# TWAI / CAN

All versions of the MDD400 are equipped with an industry-standard [CANBUS interface](../can/can_transceiver.md) that is fully compatible with [NMEA 2000](https://www.nmea.org/nmea-2000.html) and RV-C backbones. The interface uses a standard 5-pin A-coded DeviceNet connector and is galvanically isolated for improved EMC performance and system reliability.

Key features:

* galvanically isolated [CAN transceiver](https://www.ti.com/lit/ds/symlink/iso1042.pdf);
* ESD and surge protection compliant with [CISPR 25](https://www.electronicdesign.com/technologies/power/article/21274517/electronic-design-cispr-25-class-5-evaluating-emi-in-automotive-applications) and [ISO 11452-2](https://incompliancemag.com/automotive-emc-testing-cispr-25-iso-11452-2-and-equivalent-standards-part-1/);
* fully compliant with NMEA 2000 physical layer specification;
* shielding and filtering designed to eliminate ground loops and radiated noise; and
* protection features to prevent bus lock-up and ensure failsafe recovery.

Galvanic isolation of the CAN physical layer is achieved using the [ISO1042](https://www.ti.com/lit/ds/symlink/iso1042.pdf) isolated transceiver IC. This device provides 5 kVrms isolation between the controller side and the CAN side. A dedicated 5 V isolated supply, `VCAN`, is used to power the CAN side.

![CAN Transceiver Schematic](../../assets/images/can_transceiver_schematic.png)

Logic-level CAN communication is implemented through the TXD and RXD pins:

* [`TWAI_TX`](../../quick_reference.md) connects to the transceiver’s TXD pin. A 10 kΩ pull-up resistor ensures a defined idle state and reduces noise susceptibility when the MCU pin is high-Z; and
* [`TWAI_RX`](../../quick_reference.md) is connected to the transceiver’s RXD pin via a 390 Ω series resistor, which limits inrush current, dampens reflections, and protects the ESP32 input from voltage overshoot.

See the [quick reference](../../quick_reference.md) for the ESP32-S3 GPIO allocations.

## Datasheets and References

1. Maretron, *[How do I check the health of my NMEA 2000 cabling before powering my network?*](https://www.maretron.com/wp-content/phpkbv95/article.php?id=443)
2. National Marine Electronics Association, [*NMEA 2000 Standard*](https://www.nmea.org/nmea-2000.html)
3. Texas Instruments, [*ISO1042 Isolated CAN Transceiver*](https://www.ti.com/lit/ds/symlink/iso1042.pdf)
4. Electronic Design, [*CISPR 25 Class 5: Evaluating EMI in Automotive Applications*](https://www.electronicdesign.com/technologies/power/article/21274517/)
5. Compliance Magazine [*Automotive EMC Testing: CISPR 25, ISO 11452-2 and Equivalent Standards*](https://incompliancemag.com/automotive-emc-testing-cispr-25-iso-11452-2-and-equivalent-standards-part-1/)