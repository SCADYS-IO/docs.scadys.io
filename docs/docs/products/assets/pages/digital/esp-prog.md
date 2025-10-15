The ESP-PROG programming header provides serial and boot/reset control signals for firmware upload via UART. It is compatible with [Espressif's ESP-PROG adapter](https://docs.espressif.com/projects/esp-iot-solution/en/latest/hw-reference/ESP-Prog_guide.html), and supports both development and production programming workflows.

!!!warning
    The **over-voltage protection circuit is only populated in prototype and developer [tiers](../../../product_tiers.md)**. In all other versions/tiers, the protection circuit is left unpopulated and bypassed by a 0Ω resistor connecting `V_PROG` and `VCC`. Accidentally connecting 5V instead of 3.3V to the power pin of the ESP-PROG connector (e.g. not setting the DIL jumper on the ESP-PROG correctly) is likely to destroy the ESP32-S3. 

    The **UART0, BOOT and EN pins of the ESP32-S3 are unprotected**. Incorrect wiring of the ESP-PROG connector may damage the ESP32-S3 microcontroller. Use of programmers that do not conform to the [Espressif ESP-PROG](https://docs.espressif.com/projects/esp-iot-solution/en/latest/hw-reference/ESP-Prog_guide.html) reference design is not supported. Doing so will void any warranty.

In [prototype/developer tier](../../../product_tiers.md) builds, this header is populated with a 6-pin IDC male box connector. In production, pogo pins in a programming fixture will make contact with the same through-hole pads from below.

![ESP-PROG Programming Socket](../../images/esp_prog_render.png)

## Signal Connections

The 6-pin subset of the ESP-PROG interface is used:

* `ESP_EN`: connected to the ESP32-S3 `ESP_EN` (reset) pin;
* `ESP_BOOT`: connected to `GPIO0` to select download mode; and
* `ESP_TX` / `ESP_RX`: UART0 signals for flashing and serial output.

These are compatible with standard ESP-IDF programming tools.

## Over-voltage Protection

The ESP-PROG power input uses a low-dropout linear regulator (LDO) for over-voltage protection and conditioning. The LDO circuit can be bypassed by populating the 0R0 resistor between VCC and V-PROG.

![ESP-PROG Programming Socket](../../images/esp_prog_schematic.png)

The LDO uses a [UMW HT7833](https://www.lcsc.com/datasheet/C347195.pdf) regulator, which provides a regulated 3.3 V output for the ESP32-S3 module. Input power from the ESP-PROG header (*V_PROG*) passes through a [1N5819WS](https://www.lcsc.com/datasheet/C2927280.pdf) Schottky diode before entering the regulator, protecting against reverse-polarity connection. A second diode isolates the regulated *VCC* rail from backfeed when external power is applied to the board.

The regulation stage includes the following filtering components:

* 100 nF and 10 µF input capacitors for stability and transient suppression;
* 10 µF and 100 nF output capacitors for load stability and noise reduction; and
* reverse current protection diode between *VDD* and *V_PROG*.

This configuration ensures safe and stable operation during programming, even if the ESP-PROG module supplies voltages slightly above 3.3 V. The LDO provides continuous regulation within its rated limits rather than a hard cutoff, simplifying the design and improving reliability for both prototype and production use.

## References

* Espressif, [*Introduction to the ESP-Prog Board*](https://docs.espressif.com/projects/esp-iot-solution/en/latest/hw-reference/ESP-Prog_guide.html)
* Espressif, [*ESP-Prog User Guide*](https://documentation.espressif.com/espressif-esp-dev-kits/en/latest/other/esp-prog/user_guide.html?q=esp-prog)
* UMW, [*HT78xx Series LDO Regulator Datasheet*](https://www.lcsc.com/datasheet/C347195.pdf)
* JSMICRO Semiconductor, [*1N5819WS 40 V 1 A Schottky Barrier Rectifier Datasheet*](https://www.lcsc.com/datasheet/C2927280.pdf)
