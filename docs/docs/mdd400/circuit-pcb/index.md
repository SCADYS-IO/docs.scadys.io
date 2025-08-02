# MDD400 Circuit Design and PCB Layout

This section provides an overview of the MDD400 circuit architecture and PCB layout, structured according to four electrical domains within the device: CAN, SMPS, Digital, and Legacy IO. Each domain implements a specific set of functions, with galvanic or pseudo-isolation between critical boundaries. The image below illustrates the physical layout of these domains on the main PCB:

![MDD400 Domain Layout](../assets/images/mdd400_domains.png)

---

## `SMPS` Domain

The CAN domain contains all circuitry related to the NMEA 2000 interface. Filtered and conditioned 12 V input from the NMEA 2000 backbone is used to supply this domain. Key components include:

* protection and power conditioning for the CAN supply rail;
* current sensing via a shunt and I2C power sensor circuit, communicating with the `DIGITAL` Domain via an I2C isolator; and
* a galvanically isolated CAN transceiver.

The I2C power sensor and CAN transceiver are powered from a local 5 V LDO regulator. 

The CAN domain is physically isolated on the PCB and galvanically isolated from the digital and legacy IO domains.

---

## `SMPS` Domain

The `SMPS` Domain generates internal power rails from the conditioned 12 V input supply, which is shared with the CAN domain. It includes:

* a 5.3 V DC-DC converter (VDD) used for display, buzzer, and other 5 V loads;
* a 3.3 V DC-DC converter (VCC) supplying digital logic and sensors; and
* input filtering, protection, and layout provisions for EMI suppression.

These regulators power the `DIGITAL` Domain. Ground and power planes between SMPS and digital domains are not galvanically isolated but are connected via two common-mode chokes.

---

## `DIGITAL` Domain

The `DIGITAL` Domain includes the main microcontroller and all logic-level circuitry. It is powered by the VDD and VCC rails provided by the `SMPS` Domain. This domain includes:

* microcontroller module;
* I2C temperature and ambient light sensors;
* TFT LCD touch screen HMI display.

While electrically connected to the `SMPS` Domain, the digital switching circuits are isolated from the CAN and Legacy IO domains.

---

## `LEGACY IO` Domain

The `LEGACY IO` Domain supports 12 V serial interfaces compatible with NMEA 0183 and SeaTalk systems. It is fully galvanically isolated from all other domains, with communication across the isolation barrier handled via opto-isolators. This domain includes:

* power and signal conditioning for legacy RX and TX lines;
* opto-isolated receive buffer; and
* discrete transmit driver circuit.

Power for this domain is derived from the serial input connector.

---

Each of these domains is described in detail in its corresponding documentation section, including full schematics, layout notes, and component selection rationale.
