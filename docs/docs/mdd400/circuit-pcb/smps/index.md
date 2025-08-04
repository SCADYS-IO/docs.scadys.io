# _SMPS_ Domain

The `SMPS` domain provides two regulated supplies for the `DIGITAL` domain: 

* a 5.0 V rail (`VDD`) for the display and audio transducer; and
* a 3.3 V rail (`VCC`) for the MCU and attached devices.

Both supplies are implemented using synchronous buck converters based on the [Texas Instruments LMR51610](https://www.ti.com/lit/ds/symlink/lmr51610.pdf) regulator IC. The `SMPS` domain ground reference (`GNDSMPS`) is directly tied to the `CAN` domain ground (`GNDC`), and its 12 V input is filtered and conditioned by the upstream [`NET-S` filter](../can/power_conditioning.md). The `VSS` rail supplied to the `SMPS` domain is protected against over-voltage, reverse polarity, and conducted EMI.

Each SMPS converter has its own feedback and filtering network tailored to the downstream load. The converter is configured for 400 kHz operation and uses a [low DCR 22 µH shielded inductor](https://www.bourns.com/docs/product-datasheets/srn5040ta.pdf?sfvrsn=df477df6_5). 

Detailed implementation of each converter is covered in the `VDD` and `VCC` sections. 

Layout follows [best practice for minimising radiated EMI](https://www.monolithicpower.com/en/support/videos/emi-2-webinar-early-session.html?srsltid=AfmBOop1N5qpjFNFHkvJIyWCZOyt30Mt_P6bsL53Dz79rUJPYOWXOTq6), including:

* tight hot loops on both the input and output;
* shielded inductor with minimal above PCB radiators;
* selection and placement of passives; 
* ground plane isolation and via stitching; and
* provision for optional damping of ringing in the switching loop.

Thermal design includes stitched copper pours under the regulator and output inductor. The output inductor is generously specified with low DCR and no thermal or stability concerns are expected.

## 5.0 V SMPS (_VDD_)

The 5.0 V rail supplies intermediate power to:

* the [DWIN DMG48480F040_02WTCZ02COF LCD display](https://www.dwin-global.com/4-0-inch-intelligent-display-model-dmg48480f040_02wtcz02cof-series-product/); and
* the [Jiangsu Huaneng MLT-8530](https://lcsc.com/datasheet/lcsc_datasheet_2410010301_Jiangsu-Huaneng-Elec-MLT-8530_C94599.pdf) buzzer.

Nominal output current is 245 mA under full display brightness, with a total design load of up to 250 mA. Simulated ripple is <15 mV peak-to-peak.

## 3.3 V SMPS (_VCC_)

The 3.3 V rail supplies all digital logic and interfaces, including:

* the [ESP32-S3](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_datasheet_en.pdf);
* the [OPT3004](https://www.ti.com/lit/ds/symlink/opt3004.pdf) ambient light sensor;
* the [TMP112](https://www.ti.com/lit/ds/symlink/tmp112.pdf) temperature sensor;
* the logic side of the [ISO1042](https://www.ti.com/lit/ds/symlink/iso1042.pdf) CAN transceiver; and
* the [ISO1541](https://www.ti.com/lit/ds/symlink/iso1541.pdf) I²C isolator.

This converter is identical to the 5.0 V converter, apart from the feedback network. Typical load is ~90 mA, peaking at ~275 mA during Wi-Fi operation. Simulated ripple is <8 mV peak-to-peak.

## Layout and Filtering

The `SMPS` domain is galvanically isolated from the `CAN` and `DIGITAL` domains via two ferrite beads on the `VSS` (GND) lines and two common-mode chokes across the `VDD` and `VCC` outputs. This isolation strategy is illustrated in the following schematic:

![Isolation of Power Domains](../../assets/images/power_domains_isolation.png)

* the CAN and `SMPS` Domains share a ground reference (`GNDC`/`GNDSMPS`), with net ties located on the (quiet) bottom copper pour, directly under low-impedance ferrites (600 Ω @ 100 MHz) that supply the two DC-DC converters;
* the SMPS and DIGITAL domains are connected via isolated power and ground paths, filtered through [common-mode chokes](https://lcsc.com/datasheet/lcsc_datasheet_2410121451_SXN-Shun-Xiang-Nuo-Elec-SMCM7060-102T_C381615.pdf); and
* no direct copper or trace connection exists between `GNDSMPS` and `GNDREF`, maintaining domain isolation.

This configuration ensures suppression of high-frequency noise propagation between domains, minimises EMI, and protects digital logic from transients or disturbances originating in the `CAN` domain.

The PCB layout, passive component selection, and ground plane strategy closely follow the recommendations presented in the [Monolithic Power Systems EMI Webinar](https://www.monolithicpower.com/en/support/videos/emi-2-webinar-early-session.html?srsltid=AfmBOop1N5qpjFNFHkvJIyWCZOyt30Mt_P6bsL53Dz79rUJPYOWXOTq6), which offers comprehensive guidance on grounding and EMI reduction in switching power supplies.

Both SMPS circuits include:

* tight placement of the input capacitor, inductor, and output filter;
* minimal loop areas on both VIN and SW paths;
* separated analog and power ground connections, converging under the IC pad;
* provision for snubber resistor and capacitor across the SW node; and
* ground moat around SW trace to limit EMI.

A shared 2-stage LC EMI filter in the upstream `CAN` domain ensures clean input supply. Each SMPS has local ceramic input capacitance (10 µF + 100 nF) for high-frequency decoupling. The power layout maintains short trace lengths and robust thermal via arrays.

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
