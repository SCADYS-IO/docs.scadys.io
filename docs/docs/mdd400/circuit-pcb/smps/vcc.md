# _VCC_ DC-DC Converter (3.3 V)

## Design Criteria

The `VCC` domain supplies 3.3 V regulated power to all digital subsystems, including the [ESP32-S3](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_datasheet_en.pdf), [OPT3004](https://www.ti.com/lit/ds/symlink/opt3004.pdf) ambient light sensor, [TMP112](https://www.ti.com/lit/ds/symlink/tmp112.pdf) temperature sensor, and the microcontroller side of the [ISO1042](https://www.ti.com/lit/ds/symlink/iso1042.pdf) and [ISO1541](https://www.ti.com/lit/ds/symlink/iso1541.pdf) digital interfaces. It is derived from the 12 V input rail (`VSS`) using a synchronous buck converter based on the [Texas Instruments LMR51610](https://www.ti.com/lit/ds/symlink/lmr51610.pdf). Key design requirements include:

* provide a stable 3.3 V output for digital and isolated logic domains;
* operate reliably across a 9–18 V automotive/RV supply range;
* support peak output current of up to 275 mA during Wi-Fi transmission;
* achieve high efficiency to limit thermal rise in the enclosure; and
* ensure quiet operation compatible with analog and radio subsystems.

Typical current draw is ~90 mA, with headroom for full-load peaks during burst activity from the ESP32.

## Circuit Description

The circuit schematic for the 3.3 V DC-DC converter is based on the Texas Instruments [WEBENCH design](../../assets/pdf/vcc_design_report.pdf).

![`VCC` SMPS schematic](../../assets/images/vcc_schematic.png)

The input filter includes a 4.7 µF X7R ceramic capacitor (C24), supported by a high-frequency 100 nF bypass capacitor (C25) and a [Murata BLM31KN601SN1L](https://www.lcsc.com/datasheet/lcsc_datasheet_2209271730/Murata-Electronics-BLM31KN601SN1L_C668306.pdf) ferrite bead (600 Ω @ 100 MHz) to isolate SMPS noise from the upstream supply.

The main converter is implemented with a [LMR51610](https://www.ti.com/lit/ds/symlink/lmr51610.pdf) synchronous buck regulator, configured for 400 kHz switching frequency (LMR51610XDBVR). A 22 µH [Bourns SRN5040TA-220M](https://www.bourns.com/docs/product-datasheets/srn5040ta.pdf?sfvrsn=df477df6_5) inductor with 110 mΩ DCR and 1.6 A saturation current is used. Output capacitance is provided by two 10 µF X7R MLCCs, resulting in a simulated ripple voltage of 7.1 mV peak-to-peak under maximum load.

The feedback resistor divider (R21/R25) is adjusted to provide a nominal 3.3 V output using 100 kΩ / 32 kΩ. External compensation and snubber networks are not populated by default, but pads are provided for tuning based on layout parasitics, consistent with the guidance in [SLYT465](https://www.ti.com/lit/an/slyt465/slyt465.pdf) and [SNVAA73](https://www.ti.com/lit/an/snvaa73/snvaa73.pdf).

## Protection

The LMR51610 includes the following protection mechanisms:

* cycle-by-cycle peak current limit;
* thermal shutdown at 165 °C junction temperature; and
* input under-voltage lockout (UVLO) (not implemented).

These features protect the converter and connected subsystems from overload, thermal events, and supply brownout.

## Performance

Simulated results from the WEBENCH design report under worst-case conditions (18 V input, 245 mA load) are as follows:

* output voltage: 3.300 V (nominal);
* efficiency: 88.3%;
* total power dissipation: 107 mW;
* phase margin: 47.4°;
* gain margin: −11.9 dB; and
* peak inductor ripple current: 313 mA.

The SRN5040TA-220M inductor dissipates 9.4 mW at 245 mA, resulting in <0.3 °C temperature rise. The converter operates comfortably within thermal limits up to 80 °C ambient.

## Components

The following components were selected to meet performance, cost, and availability constraints:

* input filter: [*Murata BLM31KN601SN1L*](https://www.lcsc.com/datasheet/lcsc_datasheet_2209271730/Murata-Electronics-BLM31KN601SN1L_C668306.pdf) 600 Ω @ 100 MHz ferrite bead; 
* regulator IC: [*Texas Instruments LMR51610*](https://www.ti.com/lit/ds/symlink/lmr51610.pdf), 6-pin SOT-23 (LMR51610XDBVR);
* inductor: [*Bourns SRN5040TA-220M*](https://www.bourns.com/docs/product-datasheets/srn5040ta.pdf?sfvrsn=df477df6_5), 22 µH, 110 mΩ DCR;
* output capacitor: 2 × 10 µF X7R MLCCs (0805);
* output filter: [*SMCM7060-102T*](https://lcsc.com/datasheet/lcsc_datasheet_2410121451_SXN-Shun-Xiang-Nuo-Elec-SMCM7060-102T_C381615.pdf) 1 kΩ @ 100MHz common mode line filter; and
* feedback, compensation, and timing components: 0402 thick-film resistors (63–125 mW) and X7R MLCCs.

## PCB Layout

The 3.3 V converter layout is identical to the 5.25 V section, with shared design constraints and stackup:

![`VCC` SMPS layout](../../assets/images/vpp_ground_plane.png)

* tight input and output loop areas with short trace lengths;
* SW node enclosed in a ground moat and surrounded by vias;
* all components placed to minimize EMI and thermal hotspots;
* snubber and compensation footprints accessible for tuning.

These layout choices support quiet operation, mechanical symmetry, and efficient heat spreading.


## Datasheets and References

1. Texas Instruments, [*LMR516xx SIMPLE SWITCHER® Power Converter, 4-V to 65-V, 0.6-A/1-A Buck Converter in a SOT-23 Package Datasheet*](https://www.ti.com/lit/ds/symlink/lmr51610.pdf)
2. Texas Instruments, [*Controlling switch-node ringing in synchronous buck converters*](https://www.ti.com/lit/an/slyt465/slyt465.pdf), Application Note SLYT465
3. Texas Instruments, [*Design Consideration on Boot Resistor in Buck Converter*](https://www.ti.com/lit/an/snvaa73/snvaa73.pdf), Application Note SNVAA73
4. Espressif, [*ESP32-S3 32-bit MCU & 2.4 GHz Wi-Fi & Bluetooth 5 (LE) Datasheet*](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf)
5. Texas Instruments, [*OPT3004 Ambient Light Sensor (ALS) Datashee*t](https://www.ti.com/lit/ds/symlink/opt3004.pdf)
6. Texas Instruments, [*TMP112 High-Accuracy, Low-Power, Digital Temperature Sensors Datasheet*](https://www.ti.com/lit/ds/symlink/tmp112.pdf)
7. Texas Instruments, [*ISO1042 Isolated CAN Transceiver Datasheet*](https://www.ti.com/lit/ds/symlink/iso1042.pdf)
8. Texas Instruments, [*ISO1541 Low-Power Bidirectional I²C Isolators Datasheet*](https://www.ti.com/lit/ds/symlink/iso1541.pdf)
9. DWIN, [*DMG48480F040_02WTCZ02COF HMI TFT LCD Display with Capacitive Touch Screen Datasheet*](https://www.dwin-global.com/4-0-inch-intelligent-display-model-dmg48480f040_02wtcz02cof-series-product/)
10. Jiangsu Huaneng, [*MLT-8530 Electro-Magnetic Buzzer (SMD Type) Datasheet*](https://lcsc.com/datasheet/lcsc_datasheet_2410010301_Jiangsu-Huaneng-Elec-MLT-8530_C94599.pdf)
11. Bourns, [*SRN5040TA-220M Semi-shielded AEC-Q200 Compliant Power Inductors Datasheet*](https://www.bourns.com/docs/product-datasheets/srn5040ta.pdf?sfvrsn=df477df6_5)
12. SXN, [*SMCM Series (SMCM7060-102T) Common Mode Line Filter Datasheet*](https://lcsc.com/datasheet/lcsc_datasheet_2410121451_SXN-Shun-Xiang-Nuo-Elec-SMCM7060-102T_C381615.pdf)
13. Monolithic Power Systems, [*EMI Webinar: Practical Grounding and Layout*](https://www.monolithicpower.com/en/support/videos/emi-2-webinar-early-session.html?srsltid=AfmBOop1N5qpjFNFHkvJIyWCZOyt30Mt_P6bsL53Dz79rUJPYOWXOTq6)