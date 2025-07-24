# Power Supply Subsystem

The MDD400 power system is structured for marine and RV applications. It supports multiple regulated voltage domains, galvanic isolation, and protection against electrical faults and environmental transients. The subsystem is divided into the following sections:

* *[Unregulated 12V Domain (V<sub>SS</sub>)](vss.md)*: The unregulated input domain accepts 12 V power from NMEA 2000 or RV-C sources. This rail supplies all downstream regulators and includes over-voltage and over-current protection, power budgeting, and Load Equivalency Number (LEN) analysis.
* *[Primary 5V Domain (V<sub>PP</sub>)](vpp.md)*: A 5.33 V rail derived from the 12 V input using a synchronous buck converter. It supplies the LCD display, the 3.3 V digital domain (V<sub>CC</sub>), and the 5 V isolated CAN domain (V<sub>CAN</sub>). Includes current limiting, thermal protection, and EMC considerations.
* *[Isolated CAN Domain (V<sub>CAN</sub>)](vcan.md)*: A 5 V isolated supply for the CAN transceiver, providing galvanic isolation from the NMEA 2000 network. Implemented using a transformer-isolated topology with linear regulation.
* *[Digital Logic Domain (V<sub>CC</sub>)](vcc.md)*: Provides 3.3 V for the ESP32-S3 MCU, CAN transceiver, I²C sensors, and other digital loads. Derived from V<sub>PP</sub> via a linear regulator. Includes decoupling, load analysis, and thermal management.
* *[Analog Sensor Domain (V<sub>AS</sub>)](vas.md)*: An optional 8 V supply used to power legacy masthead wind transducers. Includes discrete current limiting, undervoltage monitoring, and compatibility with Raymarine and B\&G sensor types.
* 
Each section documents the associated power rail, including circuit topology, protection features, operating margins, and PCB layout notes.
