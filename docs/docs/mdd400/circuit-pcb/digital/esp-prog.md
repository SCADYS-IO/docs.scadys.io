
# ESP-Prog Programming Socket

The ESP-PROG programming header provides serial and boot/reset control signals for firmware upload via UART. It is compatible with [Espressif's ESP-PROG adapter](https://docs.espressif.com/projects/esp-iot-solution/en/latest/hw-reference/ESP-Prog_guide.html), and supports both development and production programming workflows.

In prototype builds, this header is populated with a 6-pin IDC male connector. In production, pogo pins in a programming fixture will make contact with the same through-hole pads from below.

![ESP-PROG Programming Socket](../../assets/images/esp_prog_schematic.png)

## Signal Connections

The 6-pin subset of the ESP-PROG interface is used:

* `EN`: connected to the ESP32-S3 EN (reset) pin;
* `BOOT`: connected to GPIO0 to select download mode;
* `U0_TX` / `U0_RX`: UART0 signals for flashing and serial output.

These are compatible with standard ESP-IDF programming tools.

## Over-voltage Protection

To guard against accidental over-voltage from misconfigured ESP-PROG modules (e.g. 5 V jumper set), an over-voltage protection circuit is included in prototypes. It uses:

* a [PMV240SPR](https://lcsc.com/datasheet/lcsc_datasheet_2410121947_Nexperia-PMV240SPR_C5361354.pdf) NMOS FET (Q2) as a series switch;
* a [BC807-25](https://lcsc.com/datasheet/lcsc_datasheet_2410121952_onsemi-MMBTA56LT1G_C85394.pdf) PNP transistor (Q3) as a voltage detector;
* resistor divider (R8/R9) and gate pull-down (R10) to set the trip point at approximately 3.4 V.

When VCC exceeds the turn-on threshold, Q3 conducts, pulling down the gate of Q2 and turning it off, thereby disconnecting the ESP-PROG VCC from the board.

In production, this circuit is not populated. Instead, R5 is fitted (0 Ω) to directly route VCC to the board.

See [ESP-PROG Hardware Guide](https://docs.espressif.com/projects/esp-iot-solution/en/latest/hw-reference/ESP-Prog_guide.html) for header pinout and interface details.





