# Reverse Polarity Protection and Shield

The 12 V input from the [NMEA 2000](https://www.nmea.org/nmea-2000.html) connector is protected from reverse polarity using a discrete Schottky diode.

A MOSFET-based reverse protection scheme was considered but not adopted. The primary justification for using a simple diode is the presence of generous headroom in the input voltage range (nominal 12 V vs. 5 V and 3.3 V regulated rails), which makes the forward voltage drop acceptable. Diode protection offers simpler implementation, lower component cost, and greater resilience to fault modes such as latch-up or shoot-through.

The primary component is the [SS34](https://lcsc.com/datasheet/lcsc_datasheet_2310100931_MSKSEMI-SS34-MS_C2836396.pdf) (DO-214AC/SMA package), which provides reliable protection against reverse connections while introducing minimal voltage drop in normal operation:

* Maximum Reverse Voltage (VRRM): 40 V
* Average Forward Current (IF(AV)): 3.0 A
* Surge Current Rating (IFSM, 8.3 ms): 100 A
* Typical Forward Voltage Drop (VF @ 1 A): ~0.5 V
* Reverse Leakage Current: ~0.5 mA at 40 V

This approach ensures automatic recovery from incorrect wiring and protects downstream circuitry by blocking reverse current. The forward voltage drop is acceptable given the headroom available between the 12 V input and the downstream regulators.

Under reverse polarity conditions, the Schottky diode blocks current flow entirely, and no reverse current is conducted.

A TVS diode is also placed between the SHIELD pin of the NMEA 2000 connector and chassis ground. This diode is normally unpopulated and included for test and development purposes. It uses the [TPD1E05U06](https://www.ti.com/lit/ds/symlink/tpd1e05u06.pdf), a low-capacitance ESD protection diode with excellent clamping performance.

![NMEA 2000 Connector and Shield](../../assets/images/n2k_shield_circuit.png)
