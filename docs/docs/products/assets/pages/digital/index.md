An industry-standard CANBUS interface is provided that is fully compatible with *NMEA 2000* and RV-C backbones. The interface uses a standard 5-pin A-coded male DeviceNet connector and a 3.3 V non-isolated CAN transceiver, directly interfaced to the MCU TWAI peripheral aligning with the dominant topology used in NMEA 2000 certified devices, where the CAN transceiver ground is referenced to the vessel network ground.

The CAN physical layer is implemented using the Texas Instruments [SN65HVD234](https://www.ti.com/lit/ds/symlink/sn65hvd234.pdf) 3.3 V high-speed CAN transceiver. The device is controlled by the MCU using standard TXD/RXD signals, with an additional *ST_EN* (standby enable) control line used to place the transceiver into a low-power standby state when the CAN interface is not required.

Key features:

* non-isolated 3.3 V CAN transceiver compatible with the MCU TWAI peripheral;
* support for active and standby operating modes via the *ST_EN* control input;
* ESD and surge protection designed to meet CISPR 25 and ISO 11452-2 automotive EMC requirements;
* passive common-mode filtering and TVS protection optimised for NMEA 2000 cabling;
* shield termination and grounding strategy consistent with NMEA 2000 physical layer guidance; and
* failsafe receiver behaviour to prevent bus lock-up during power sequencing or MCU reset.

## References

1. National Marine Electronics Association, *NMEA 2000 Standard®*, [https://www.nmea.org/nmea-2000.html](https://www.nmea.org/nmea-2000.html).
2. Maretron, *How do I check the health of my NMEA 2000 cabling before powering my network?*, [https://www.maretron.com/wp-content/phpkbv95/article.php?id=443](https://www.maretron.com/wp-content/phpkbv95/article.php?id=443).
3. Texas Instruments, *SN65HVD234 3.3-V CAN Transceiver Datasheet*, [https://www.ti.com/lit/ds/symlink/sn65hvd234.pdf](https://www.ti.com/lit/ds/symlink/sn65hvd234.pdf).
4. Murata, *ACT45B-510-2P Common-Mode Choke Datasheet*, [https://www.murata.com/en-us/products/productdata/8807038415390/QTN0099C.pdf](https://www.murata.com/en-us/products/productdata/8807038415390/QTN0099C.pdf).
5. onsemi, *NUP2105LT1G Dual-Line CAN TVS Diode Datasheet*, [https://www.onsemi.com/pdf/datasheet/nup2105l-d.pdf](https://www.onsemi.com/pdf/datasheet/nup2105l-d.pdf).
6. Electronic Design, *CISPR 25 Class 5: Evaluating EMI in Automotive Applications*, [https://www.electronicdesign.com/technologies/power/article/21274517/](https://www.electronicdesign.com/technologies/power/article/21274517/).
7. In Compliance Magazine, *Automotive EMC Testing: CISPR 25, ISO 11452-2 and Equivalent Standards*, [https://incompliancemag.com/automotive-emc-testing-cispr-25-iso-11452-2-and-equivalent-standards-part-1/](https://incompliancemag.com/automotive-emc-testing-cispr-25-iso-11452-2-and-equivalent-standards-part-1/).
