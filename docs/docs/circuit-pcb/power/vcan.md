
# Isolated CAN Transceiver 5 Volt Domain (V<sub>CAN</sub>)

Galvanic isolation between the CAN-side and logic-side domains is **recommended**, and the schematic is shown below\*\* by both the [NMEA 2000](https://www.nmea.org/standards.html) and [ISO 11898](https://www.iso.org/standard/66340.html) standards to improve EMC performance, prevent ground loops, and enhance system protection in electrically noisy environments.

![VCAN Schematic](../../assets/images/vcan_schematic.png)

A galvanically isolated 5 Volt supply for the CAN transceiver is provided on the (V<sub>CAN</sub>) rail, referenced to the isolated ground (GNDCAN). This power is derived from the internal 5.3 V rail using a transformer-based isolated supply.

A [VPSC VPS8702 transformer driver](../../assets/pdf/VPSC-VPS8702_datasheet.pdf) converts the 5.3 V input from the V<sub>PP</sub> into a high-frequency push-pull signal suitable for driving a non-center-tapped isolation transformer. The selected transformer is a 1:1 device ([VPT87BB-01A](https://lcsc.com/datasheet/lcsc_datasheet_2108142130_VPSC-VPT87BB-01A_C2846912.pdf)), rated for reinforced isolation up to 3 kV and compatible with the VPS8702 drive topology.

The transformer's secondary winding is connected to a full-wave rectifier using low forward voltage [Schottky diodes](https://www.diodes.com/assets/Datasheets/BAT54.pdf). The rectified output is smoothed using a combination of ceramic and bulk capacitors to provide a low-ripple DC supply.

To achieve a regulated 5.0 V output, the filtered voltage is passed through a [HT7550-1](https://lcsc.com/datasheet/lcsc_datasheet_2506261414_UMW-Youtai-Semiconductor-Co---Ltd--HT7550-1_C347189.pdf) low-dropout linear regulator. With a typical dropout voltage of approximately 100 mV, the HT7550-1 provides sufficient regulation margin from a nominal 5.3 V input to maintain a stable output under varying load conditions.

The LDO is bypassed with a 2.2 µF / 25 V ceramic capacitor and a 100 nF / 50 V ceramic capacitor placed in parallel. These are located close to the VOUT and GND pins and provide local bulk storage and high-frequency noise suppression for the ISO1042 transceiver.

Primary-side filtering on the VPS8702 input includes a 2.2 µF / 25 V ceramic capacitor placed near the VIN pin. The rectified DC output on the isolated side is filtered with a 2.2 µF / 25 V capacitor before feeding the LDO.

