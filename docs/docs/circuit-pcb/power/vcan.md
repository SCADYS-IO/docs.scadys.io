# Isolated 5 V CAN Domain (V<SUB>CAN</SUB>)

Galvanic isolation between the CAN-side and logic-side domains is recommended by both the [NMEA 2000](https://www.nmea.org/standards.html) and [ISO 11898](https://www.iso.org/standard/66340.html) standards to improve EMC performance, prevent ground loops, and enhance system protection in electrically noisy environments. The isolated 5 V regulator provides a galvanically isolated power supply for the CAN transceiver (V<SUB>CAN</SUB>), allowing the CAN physical layer to operate on a floating domain independent of system ground.

## Design Criteria

The design requirements for the isolated 5 V CAN domain are as follows:

* Provide a regulated 5.0 V output referenced to an isolated ground domain.
* Operate from the system’s 5.33 V internal DC-DC converter output.
* Supply sufficient current for the isolated-side [ISO1044 CAN transceiver datasheet](https://ti.com/lit/ds/symlink/iso1042.pdf) (typically 5–6 mA, with headroom for transients).
* Maintain galvanic isolation between CAN and logic domains to comply with [NMEA 2000](https://www.nmea.org/standards.html) and [ISO 11898](https://www.iso.org/standard/66340.html) standards.
* Operate reliably in a marine environment with minimal noise, thermal rise, or sensitivity to load variation. 

## Circuit Description

The isolated 5 V CAN domain regulator schematic is shown below.

![V\<SUB>CAN\</SUB> Schematic](../../assets/images/vcan_schematic.png)

The circuit uses a transformer-based push-pull topology, driven by the [VPSC VPS8702 transformer driver](../../assets/pdf/VPSC-VPS8702_datasheet.pdf) and [VPT87BB-01A](https://lcsc.com/datasheet/lcsc_datasheet_2410121942_Nexperia-BAT54C-215_C37704.pdf) transformer. The output is full-wave rectified by a dual Schottky diode ([BAT54C](https://lcsc.com/datasheet/lcsc_datasheet_2410121942_Nexperia-BAT54C-215_C37704.pdf)) and regulated to a clean 5.0 V by a low-dropout linear regulator ([HT7550-1](https://www.holtek.com/webapi/116711/HT75xx-1v280.pdf)).

Power is supplied from the [switch-mode DC-DC converter output (+5.33V)](vcan.md), which maintains sufficient headroom for regulation and rectification losses.

The CAN side of the CAN transceiver will only be powered when 12V power is supplied via the CAN / NMEA 2000 connector's NET-S pin. The CAN Transceiver cannot be powered via the 5V supply from the [ESP-PROG](../connectors/esp_prog.md) programming connector.

---

## Protection

The circuit includes integrated protection features within both the transformer driver and LDO:

*VPS8702*

* Overcurrent protection with dynamic clamping.
* Overtemperature shutdown with automatic delayed recovery.
* Break-before-make switching with dead-time to prevent cross-conduction.
* Internal current limiting (~800 mA) and thermal self-protection.

*HT7550-1*

* Internal short-circuit and overtemperature protection.
* Tight quiescent current control (<6 µA) to minimize power draw.

No external protection components are required due to the light loading and low-energy nature of this isolated rail.

---

## Performance

This section evaluates the electrical performance of the isolated 5 V supply under real-world load and startup conditions. It includes efficiency, regulation headroom, ripple, and component behavior such as diode rectification performance.

* Load capability: Designed to supply 5.0 V at up to 100 mA, although the typical load is only 5–6 mA, sourced by the isolated side of the [ISO1042](https://www.ti.com/lit/ds/symlink/iso1042.pdf) CAN transceiver.
* Efficiency: The push-pull stage achieves ~80–85% conversion efficiency under mid-load. At low loads, total dissipation remains minimal.
* Dropout: The HT7550-1 operates with just 25 mV dropout at 6 mA, providing excellent regulation from a 5.3 V input.
* Noise and ripple: The output filter includes 2.2 µF + 100 nF X7R MLCCs for low ripple and clean analog supply performance.
* Rectification diode performance: The [BAT54C](https://lcsc.com/datasheet/lcsc_datasheet_2410121942_Nexperia-BAT54C-215_C37704.pdf) dual Schottky diode was selected for its low forward voltage drop (~250–300 mV at 6–10 mA) and fast switching speed (5 ns), making it well-suited for high-frequency rectification at 340 kHz. Its low leakage current and compact SOT-23 package also meet thermal and space constraints for this low-current, isolated supply. Although higher-rated diodes could provide additional surge headroom, the BAT54C remains well within specification under all expected load conditions.

---

## Component Selection

All active components were selected based on efficiency, isolation performance, and compact footprint. The key ICs, transformer and rectifier diode(s) are referenced in the schematic and described in the circuit description above.

For other passive components, standard guidelines were followed to ensure reliability and consistent performance across environmental conditions:

* X7R dielectric ceramic capacitors for all decoupling and filtering.
* Capacitors and resistors are 0603 footprint unless otherwise dictated by electrical constraints.

Component selection is guided by the need for low ESR, thermal stability and compatibility with automated assembly processes.

---

## PCB Layout

Careful attention was paid to PCB layout for performance and isolation:

* Short traces between U12, transformer, and diode minimize loop area and EMI.
* Input capacitor (C63) is placed adjacent to U12 for optimal HF bypassing.
* Primary and secondary grounds are routed as separate planes, with no copper overlap and minimum 3 mm spacing for reinforced isolation.
* V<SUB>CAN</SUB> domain is fully isolated and routed in its own ground zone (GNDC), used exclusively by the ISO1042 transceiver.
* No Thermal reliefs used in power paths to reduce resistance and switching loss.

The isolated domain is physically separated and labeled clearly in layout and silkscreen to ensure inspection clarity during assembly and QA.

<!-- # Isolated 5 V Regulator (V<SUB>CAN</SUB>)

Galvanic isolation between the CAN-side and logic-side domains is recommended by both the [NMEA 2000](https://www.nmea.org/standards.html) and [ISO 11898](https://www.iso.org/standard/66340.html) standards to improve EMC performance, prevent ground loops, and enhance system protection in electrically noisy environments. The isolated 5 V regulator provides a galvanically isolated power supply for the CAN transceiver (V<SUB>CAN</SUB>), allowing the CAN physical layer to operate on a floating domain independent of system ground.

## Circuit Description

The isolated 5 V regulator schematic is shown below.

![V\<SUB>CAN\</SUB> Schematic](../../assets/images/vcan_schematic.png)

The circuit uses a transformer-based push-pull topology, driven by the [VPSC VPS8702 transformer driver](../../assets/pdf/VPSC-VPS8702_datasheet.pdf) and [VPT87BB-01A](https://lcsc.com/datasheet/lcsc_datasheet_2410121942_Nexperia-BAT54C-215_C37704.pdf) transformer. The output is full-wave rectified by a dual Schottky diode ([BAT54C](https://lcsc.com/datasheet/lcsc_datasheet_2410121942_Nexperia-BAT54C-215_C37704.pdf)) and regulated to a clean 5.0 V by a low-dropout linear regulator ([HT7550-1](https://www.holtek.com/webapi/116711/HT75xx-1v280.pdf)).

Power is supplied from the switch-mode DC-DC converter output (+5.33V), which maintains sufficient headroom for regulation and rectification losses. 

The CAN side of the CAN transceiver will only be powered when 12V power is supplied via the CAN / NMEA 2000 connector's NET-S pin. The CAN Transceiver cannot be powered via the 5V supply from the [ESP-PROG](../connectors/esp_prog.md) programming connector.

---

## Protection

The circuit includes integrated protection features within both the transformer driver and LDO:

*VPS8702*

* Overcurrent protection with dynamic clamping.
* Overtemperature shutdown with automatic delayed recovery.
* Break-before-make switching with dead-time to prevent cross-conduction.
* Internal current limiting (~800 mA) and thermal self-protection.

*HT7550-1*

* Internal short-circuit and overtemperature protection.
* Tight quiescent current control (<6 µA) to minimize power draw.

No external protection components are required due to the light loading and low-energy nature of this isolated rail.

---

## Performance

This section evaluates the electrical performance of the isolated 5 V supply under real-world load and startup conditions. It includes efficiency, regulation headroom, ripple, and component behavior such as diode rectification performance.

* *Load capability*: Designed to supply 5.0 V at up to 100 mA, although the typical load is only 5–6 mA, sourced by the isolated side of the [ISO1042](https://www.ti.com/lit/ds/symlink/iso1042.pdf) CAN transceiver.
* *Efficiency*: The push-pull stage achieves ~80–85% conversion efficiency under mid-load. At low loads, total dissipation remains minimal.
* *Dropout*: The HT7550-1 operates with just 25 mV dropout at 6 mA, providing excellent regulation from a 5.3 V input.
* *Noise and ripple*: The output filter includes 2.2 µF + 100 nF X7R MLCCs for low ripple and clean analog supply performance.
* *Rectification diode performance*: The [BAT54C](https://lcsc.com/datasheet/lcsc_datasheet_2410121942_Nexperia-BAT54C-215_C37704.pdf) dual Schottky diode was selected for its low forward voltage drop (~250–300 mV at 6–10 mA) and fast switching speed (5 ns), making it well-suited for high-frequency rectification at 340 kHz. Its low leakage current and compact SOT-23 package also meet thermal and space constraints for this low-current, isolated supply. Although higher-rated diodes could provide additional surge headroom, the BAT54C remains well within specification under all expected load conditions.

---

## Component Selection

All active components were selected based on efficiency, isolation performance, and compact footprint. The key ICs, transformer and rectifier diode(s) are referenced in the schematic and described in the circuit description above.

For other passive components, standard guidelines were followed to ensure reliability and consistent performance across environmental conditions:

* X7R dielectric ceramic capacitors for all decoupling and filtering.
* Capacitors and resistors are 0603 footprint unless otherwise dictated by electrical constraints.

Component selection is guided by the need for low ESR, thermal stability and compatibility with automated assembly processes.

---

## PCB Layout

Careful attention was paid to PCB layout for performance and isolation:

* Short traces between U12, transformer, and diode minimize loop area and EMI.
* Input capacitor (C63) is placed adjacent to U12 for optimal HF bypassing.
* Primary and secondary grounds are routed as separate planes, with *no copper overlap* and minimum 3 mm spacing for reinforced isolation.
* V<SUB>CAN</SUB> domain is fully isolated and routed in its own ground zone (GNDC), used exclusively by the ISO1042 transceiver.
* No Thermal reliefs used in power paths to reduce resistance and switching loss.

The isolated domain is physically separated and labeled clearly in layout and silkscreen to ensure inspection clarity during assembly and QA. -->
