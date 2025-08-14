# Isolated CAN Transceiver

All versions of the MDD400 are equipped with an industry-standard CANBUS interface that is fully compatible with [NMEA 2000](https://www.nmea.org/nmea-2000.html) and RV-C backbones. The interface uses a [standard 5-pin A-coded male DeviceNet connector](https://www.maretron.com/wp-content/phpkbv95/article.php?id=443) and is galvanically isolated for improved EMC performance and system reliability.

Key features:

* galvanically isolated [CAN transceiver](https://www.ti.com/lit/ds/symlink/iso1042.pdf);
* ESD and surge protection compliant with [CISPR 25](https://www.electronicdesign.com/technologies/power/article/21274517/electronic-design-cispr-25-class-5-evaluating-emi-in-automotive-applications) and [ISO 11452-2](https://incompliancemag.com/automotive-emc-testing-cispr-25-iso-11452-2-and-equivalent-standards-part-1/);
* fully compliant with NMEA 2000 physical layer specification;
* shielding and filtering designed to eliminate ground loops and radiated noise; and
* protection features to prevent bus lock-up and ensure failsafe recovery.

## CAN Transceiver

Galvanic isolation of the CAN physical layer is achieved using the [ISO1042](https://www.ti.com/lit/ds/symlink/iso1042.pdf) isolated transceiver IC. This device provides 5 kVrms isolation between the controller side and the CAN side. A dedicated 5 V isolated supply, `VCAN`, is used to power the CAN side.

![CAN Transceiver Schematic](../../assets/images/can_transceiver_schematic.png)

Logic-level CAN communication is implemented through the TX and RX pins:

* `TWAI_TX` connects to the transceiver’s TXD pin. A 10 kΩ pull-up resistor ensures a defined idle state and reduces noise susceptibility when the MCU pin is high-Z; and
* `TWAI_RX` is connected to the transceiver’s RXD pin via a 390 Ω series resistor, which limits inrush current, dampens reflections, and protects the ESP32 input from voltage overshoot.

The ISO1042 includes several internal features to prevent CAN bus lock-up or erratic behaviour:

* TXD dominant timeout protects against stuck-low faults on the TX line;
* undervoltage lockout disables outputs when either side loses power;
* failsafe biasing ensures a recessive state if lines are unconnected or inputs are floating;
* thermal shutdown protects the device during sustained fault conditions.

These features allow the MDD400 to recover automatically from faults without locking the bus.

Neither `TWAI_TX` nor `TWAI_RX` are strapping pins on the ESP32-S3, ensuring reliable CAN bus behaviour during flashing, reset, and power-up.

## Signal Conditioning

The CAN interface is galvanically isolated and filtered to reduce both emissions and susceptibility to EMI. The filtering stage is shown below.

![CAN Filter Schematic](../../assets/images/can_filter_schematic.png)

The `NET-H` and `NET-L` signals pass through the following components prior to reaching the transceiver:

* 15 pF capacitors to local CAN ground (`NET-C`), providing high-frequency common-mode filtering;
* a 100 pF differential capacitor across `NET-H` and `NET-L`, attenuating differential-mode noise;
* a [common-mode choke](https://www.murata.com/en-us/products/productdata/8807038415390/QTN0099C.pdf), used to suppress high-frequency common-mode interference;
* a [dual transient voltage suppression (TVS) array](https://www.onsemi.com/pdf/datasheet/nup2105l-d.pdf), providing protection against differential and common-mode voltage transients; and
* an [isolated CAN transceiver](https://www.ti.com/lit/ds/symlink/iso1042.pdf), which includes integrated galvanic isolation and failsafe features.

This signal conditioning network is designed following guidance from [Texas Instruments](https://www.ti.com/lit/ab/snoaaa1/snoaaa1.pdf) and [Monolithic Power Systems](https://www.monolithicpower.com/en/blog/post/from-cold-crank-to-load-dump-a-primer-on-automotive-transients), and is intended to minimise emissions and maximise immunity to electrical noise.

The `NET-H` and `NET-L` signals are routed as a tightly coupled differential pair with controlled impedance. Routing is kept short and direct between the connector, filtering components, and transceiver to minimise parasitic inductance and reduce discontinuities. The trace layout eliminated vias and stubs and prioritises symmetry to preserve signal integrity.

These design measures support compliance with EMC standards such as [CISPR 25](https://www.diodes.com/design/support/cispr-25) and [ISO 11452-2](https://www.iso.org/standard/68557.html), which are applicable to automotive and marine CAN networks.

To maintain galvanic isolation, the CAN transceiver's isolated ground (`GNDC`) is physically separated from the system ground (`GNDREF`) using a dedicated ground plane region. A minimum clearance of 2.5–4.0 mm is maintained between the isolated and logic ground planes, consistent with IPC-2221 and marine EMC best practices. This clearance helps ensure the isolation barrier is not compromised by parasitic coupling or leakage currents, and supports the reinforced isolation rating of the ISO1042 transceiver.

## Power Supply

The CAN transceiver operates from an isolated 5 V supply on the CAN-side domain ([`VCAN`](vcan.md)), referenced to the isolated ground (`GNDC`). The logic side is powered from the 3.3 V `DIGITAL` domain supply rail ([`VCC`](../smps/vcc.md)).

## Datasheets and References

1. National Marine Electronics Association, [*NMEA 2000 Standard®*](https://www.nmea.org/nmea-2000.html)
2. Maretron, [*How do I check the health of my NMEA 2000 cabling before powering my network?*](https://www.maretron.com/wp-content/phpkbv95/article.php?id=443)
3. Electronic Design, [*CISPR 25 Class 5: Evaluating EMI in Automotive Applications*](https://www.electronicdesign.com/technologies/power/article/21274517/)
4. Compliance Magazine [*Automotive EMC Testing: CISPR 25, ISO 11452-2 and Equivalent Standards*](https://incompliancemag.com/automotive-emc-testing-cispr-25-iso-11452-2-and-equivalent-standards-part-1/)
5. Texas Instruments, [*ISO1042 Isolated CAN Transceiver Datasheet*](https://www.ti.com/lit/ds/symlink/iso1042.pdf)
6. Murata, [*ACT45B-510-2P Common-Mode Choke Datasheet*](https://www.murata.com/en-us/products/productdata/8807038415390/QTN0099C.pdf)
7. On Semiconductor, [*NUP2105LT1G Dual-Line CAN TVS Datasheet*](https://www.onsemi.com/pdf/datasheet/nup2105l-d.pdf)
