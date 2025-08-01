# EMC

The MDD400 is designed to meet both conducted and radiated electromagnetic emissions requirements for CE ([EN 55032 Class B](https://webstore.iec.ch/publication/24377)) and [FCC Part 15](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15) compliance, while ensuring robustness against electromagnetic immunity threats in line with [ISO 11452-2](https://www.iso.org/standard/43855.html) and [ISO 7637-2](https://www.iso.org/standard/50925.html). To this end, a combination of discrete filtering components and PCB layout strategies are employed to suppress emissions and protect sensitive circuitry.

## Conducted Emissions

The primary 12 V input is filtered using a multi-stage EMI suppression network consisting of:

* a π-filter topology with 22 µF ceramic input capacitors, 10 nF mid-filter capacitor, and additional 22 µF output capacitors;
* a high-performance shielded common-mode choke (SMCM7D60-132T) rated for 1.3 A;
* a 100 mΩ sense resistor for diagnostic current monitoring; and
* a 600 Ω @ 100 MHz ferrite bead (FB3) to attenuate high-frequency common-mode noise to/from the switching regulator domain.

This network effectively attenuates conducted emissions above 1 MHz and isolates switch-mode regulator noise from reaching the vessel's 12 V supply lines. The design target was to suppress switching harmonics to < 100 mV peak-to-peak, as observed at the 12 V input under full load.

## Radiated Emissions

Careful segregation of analog, digital, and high-current switching grounds helps reduce loop areas and suppress radiated emissions. Key measures include:

* low-inductance return paths using filled copper pours;
* edge-stitched ground planes isolating external connector regions;
* strategic placement of high-frequency capacitors near connector pins (e.g., 100 pF across CAN\_H/L); and
* controlled routing of the legacy serial line to minimize emissions.

## CANBUS Interface Filtering

The CAN interface is galvanically isolated and filtered to reduce both emissions and susceptibility to EMI. The filtering stage is shown below:

![CAN Filter Schematic](../../assets/images/can_filter_schematic.png)

The CAN filter includes:

* 15 pF capacitors from each CAN line to chassis ground (NET-C);
* a 100 pF differential capacitor between CAN\_H and CAN\_L;
* a high-isolation common-mode choke (ACT45B-510-2P-TL003);
* an [NUP2105L](https://www.onsemi.com/products/esd-protection/esd-suppressors/nup2105lt1g) TVS array for ESD and transient suppression.

This design approach follows the recommendations of [ISO 11898-2](https://www.iso.org/standard/63648.html) and prevents radiated noise from coupling into the NMEA 2000 network.

## Isolated CAN Transceiver

The galvanic isolation of the CAN physical layer is achieved using the [ISO1042](https://www.ti.com/lit/ds/symlink/iso1042.pdf) isolated transceiver IC. This device provides 5 kVrms isolation between the controller side and the CAN side. A dedicated 5 V isolated supply, VCAN, is used to power the CAN side.

![CAN Transceiver Schematic](../../assets/images/can_transceiver_schematic.png)

## Grounding and Isolation Strategy

The MDD400 employs separate digital (GND) and connector/chassis (NET-C) ground domains. These are joined only at carefully controlled locations, typically through the shield of common-mode chokes or designated net-ties. This strategy minimizes ground bounce, avoids ground loops, and enhances immunity to conducted and radiated transients.

## Wireless Subsystem (Wi-Fi and Bluetooth)

The MDD400 incorporates the Espressif [ESP32-S3](https://www.espressif.com/en/products/socs/esp32-s3/resources) microcontroller, which includes integrated Wi-Fi and Bluetooth/BLE radios. The module carries CE and FCC modular certification, having been tested to comply with [FCC Part 15](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15) Subparts C and E, EN 300 328 and EN 301 489 under the [Radio Equipment Directive (RED)](https://eur-lex.europa.eu/eli/dir/2014/53/oj). Provided the integration guidelines (antenna layout, decoupling, trace clearance) are followed — as they are in the MDD400 — no further radiated emissions testing is required at the system level.

