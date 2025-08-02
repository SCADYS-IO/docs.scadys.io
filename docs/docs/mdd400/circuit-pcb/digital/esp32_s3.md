# ESP32-S3 Micro-controller Module

The MDD400 design is based on the [ESP32-S3-WROOM-1-N16R8](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf) module, a fully integrated wireless microcontroller that includes a dual-core Xtensa® LX7 CPU running at up to 240 MHz, 512 KB SRAM, and 8 MB PSRAM. The module supports both Wi-Fi and Bluetooth / BLE, and offers a wide array of digital peripherals including SPI, I²C, UART, PWM, ADC, DAC, and TWAI®. The integrated QSPI flash and PSRAM interface supports external memory for advanced applications such as graphical user interfaces, data logging, and OTA update handling. Enhanced security features include secure boot, flash encryption, and hardware HMAC/RSA modules. The module is fully certified and incorporates an integrated antenna.


## ESP32-S3 GPIO Connections

The following schematic shows the pin allocations on the ESP32-S3 module as implemented in the MDD400 design. Only the connected GPIOs are shown, along with power and decoupling connections to the VCC supply.

![ESP32-S3 MCU Pin Allocation](../../assets/images/esp32_pin_allocation.png)

The following pull-up resistors and timing capacitors are included on selected GPIOs to ensure correct startup behaviour and stable logic levels:

* `EN` is pulled up to VCC with 10 kΩ and has a 1 µF capacitor to GNDREF;
* `BOOT` (GPIO0) is pulled up to VCC with 10 kΩ and has a 100 nF capacitor to GNDREF; and
* I²C lines (`SCL` and `SDA`) are pulled up to VCC with 10 kΩ resistors.

The ESP32-S3-WROOM-1 module includes 48 GPIOs, many of which are multifunctional. The table below summarises the GPIO assignments used in the MDD400 design, including signal labels and usage notes. Strapping pins, reserved functions, and duplicated interfaces are also noted.

A complete listing of the ESP32-S3 GPIO pin assignments is available at [esp32_s3_pins.md](esp32_s3_pins.md).

## Memory

The ESP32-S3 module includes two types of RAM:

* **SRAM**: 512 kB internal static RAM, used by default for stack, heap, and program data;
* **PSRAM**: 8 MB of external pseudo-static RAM, accessible via the memory-mapped SPI interface.

The ESP-IDF heap allocator is configured to use both internal and external memory. Internal SRAM provides low-latency access and is prioritized for timing-sensitive operations, while external PSRAM is used for large buffers and dynamic structures.

In the MDD400, PSRAM is reserved primarily for storage of time-series data associated with incoming NMEA traffic. These time series support real-time and historical graphing functions on the LCD display. The PSRAM allows extensive buffering of sampled values across multiple channels without consuming internal SRAM resources.

Additional PSRAM-based buffers may be allocated at runtime for image decoding, OTA staging, or caching depending on future firmware requirements and available heap space.


## I²C Bus

The ESP32-S3 communicates with three external peripherals on a shared I²C bus:

* the [TMP112](https://www.ti.com/lit/ds/symlink/tmp112.pdf) temperature sensor, located near the display, is addressed at `0x48`;
* the [OPT3004](https://www.ti.com/lit/ds/symlink/opt3004.pdf) ambient light sensor, also located on the front panel side of the board, is addressed at `0x44`; and
* the [INA219](https://www.ti.com/lit/ds/symlink/ina219.pdf) current/voltage monitor, located in the CAN domain and accessed via an I²C isolator, is addressed at `0x40`.

All three devices share the same SDA and SCL signal lines. A single set of 4.7 kΩ pull-up resistors is present on the digital domain side (VCC), and a second set is placed on the CAN domain side (VDD), beyond the I²C isolator. Each device includes local decoupling capacitors as required by its datasheet.

Refer to the [ESP32-S3 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf) and [ESP-IDF JTAG documentation](https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-guides/jtag-debugging/index.html) for reserved pins, internal pull states, and JTAG assignments.

## Flash Storage

The ESP32-S3 module in the MDD400 includes 16 MB of external QSPI flash. Flash is divided into multiple regions according to the partition table shown below:

| Name     | Type | SubType  | Offset  | Size     | Flags |
| -------- | ---- | -------- | ------- | -------- | ----- |
| nvs      | data | nvs      | 0x9000  | 0x5000   |       |
| otadata  | data | ota      | 0xe000  | 0x2000   |       |
| app0     | app  | ota\_0   | 0x10000 | 0x500000 |       |
| app1     | app  | ota\_1   | —       | 0x500000 |       |
| spiffs   | data | spiffs   | —       | 0x5e0000 |       |
| coredump | data | coredump | —       | 0x10000  |       |

### Application Regions

Two 5 MB OTA slots are defined (`app0` and `app1`), allowing firmware to be updated via Bluetooth or serial without overwriting the running image. OTA updates are managed by the ESP-IDF OTA subsystem using a dual-bank approach.

### Non-volatile Data

The `nvs` partition stores key-value pairs for configuration and calibration data, while `otadata` tracks OTA image states.

### SPIFFS Usage

The `spiffs` partition is used as a general-purpose filesystem. During OTA update via BLE, this region serves as a temporary staging area for update payloads, including display image resources and configuration files, which the firmware subsequently writes to the DWIN display over UART.

In normal operation, the SPIFFS partition stores history and diagnostic data, including time-series records of incoming NMEA data. These may include environmental trends, fault logs, or usage statistics.

Partitioning and access control within the SPIFFS area is not yet finalised. One approach could involve prefix-based file organisation (e.g. `/ota/`, `/hist/`, `/diag/`), or maintaining a metadata index to track file type and source.

### Core Dumps

The `coredump` partition is reserved for post-crash diagnostics, allowing firmware to write a memory snapshot for later retrieval via serial or BLE tools.

## ESP-Prog Programming Socket

The ESP-PROG programming header provides serial and boot/reset control signals for firmware upload via UART. It is compatible with [Espressif's ESP-PROG adapter](https://docs.espressif.com/projects/esp-iot-solution/en/latest/hw-reference/ESP-Prog_guide.html), and supports both development and production programming workflows.

In prototype builds, this header is populated with a 10-pin IDC male connector. In production, pogo pins in a programming fixture will make contact with the same through-hole pads from below.

![ESP-PROG Programming Socket](../../assets/images/esp_prog_schematic.png)

### Signal Connections

The 6-pin subset of the ESP-PROG interface is used:

* `EN`: connected to the ESP32-S3 EN (reset) pin;
* `BOOT`: connected to GPIO0 to select download mode;
* `U0_TX` / `U0_RX`: UART0 signals for flashing and serial output.

These are compatible with standard ESP-IDF programming tools.

### Over-voltage Protection

To guard against accidental over-voltage from misconfigured ESP-PROG modules (e.g. 5 V jumper set), an over-voltage protection circuit is included in prototypes. It uses:

* a [PMV240SPR](https://lcsc.com/datasheet/lcsc_datasheet_2410121947_Nexperia-PMV240SPR_C5361354.pdf) NMOS FET (Q2) as a series switch;
* a [BC807-25](https://lcsc.com/datasheet/lcsc_datasheet_2410121952_onsemi-MMBTA56LT1G_C85394.pdf) PNP transistor (Q3) as a voltage detector;
* resistor divider (R8/R9) and gate pull-down (R10) to set the trip point at approximately 3.4 V.

When VCC exceeds the turn-on threshold, Q3 conducts, pulling down the gate of Q2 and turning it off, thereby disconnecting the ESP-PROG VCC from the board.

In production, this circuit is not populated. Instead, R5 is fitted (0 Ω) to directly route VCC to the board.

See [ESP-PROG Hardware Guide](https://docs.espressif.com/projects/esp-iot-solution/en/latest/hw-reference/ESP-Prog_guide.html) for header pinout and interface details.

---

## References

1. Espressif, [ESP32-S3-WROOM-1 & WROOM-1U Module Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf)
2. Espressif, [ESP32-S3 Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
3. Espressif, [ESP-IDF JTAG Debugging Guide](https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-guides/jtag-debugging/index.html)
4. Espressif, [ESP-PROG Hardware Guide](https://docs.espressif.com/projects/esp-iot-solution/en/latest/hw-reference/ESP-Prog_guide.html)
5. Texas Instruments, [TMP112 Low-Power Digital Temperature Sensor Datasheet](https://www.ti.com/lit/ds/symlink/tmp112.pdf)
6. Texas Instruments, [OPT3004 Ambient Light Sensor Datasheet](https://www.ti.com/lit/ds/symlink/opt3004.pdf)
7. Texas Instruments, [INA219 Current/Power Monitor With I2C Interface Datasheet](https://www.ti.com/lit/ds/symlink/ina219.pdf)
8. Nexperia, [PMV240SPR P-Channel MOSFET Datasheet](https://lcsc.com/datasheet/lcsc_datasheet_2410121947_Nexperia-PMV240SPR_C5361354.pdf)
9. Onsemi, [BC807-25 PNP Transistor Datasheet](https://lcsc.com/datasheet/lcsc_datasheet_2410121952_onsemi-MMBTA56LT1G_C85394.pdf)


