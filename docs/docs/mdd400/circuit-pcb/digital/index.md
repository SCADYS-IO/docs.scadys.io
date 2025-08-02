# `DIGITAL` Domain

The `DIGITAL` domain includes all logic and user interface components directly addressed by the micro-controller. It is powered by regulated 3.3 V and 5.0 V supplies derived from the isolated SMPS domain. All circuits in this domain share a common GNDREF potential.

* At the centre of the digital domain is the [ESP32-S3-WROOM-1-N16R8](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf) module. This microcontroller includes a dual-core LX7 processor, 512 kB of internal SRAM, and 8 MB of integrated PSRAM. The ESP32-S3 provides Wi-Fi, Bluetooth LE, secure boot, flash encryption, and a wide array of digital peripherals. External QSPI flash (16 MB) stores firmware and application data, partitioned to support OTA firmware updates and file system access.
* The industry-standard [CANBUS interface](../can/can_transceiver.md) is accessed via a galvanically isolated [ ISO1042 CAN transceiver](https://www.ti.com/lit/ds/symlink/iso1042.pdf). 
* the MDD400 communicates with three external [I²C peripherals](i2c_bus.md): an [ambient light sensor](ambient_light_sensor.md), [temperature sensor](temperature_sensor.md) and [power sensor](../can/power_sensor.md).
* The user interface is built around a 480×480 capacitive touch [TFT display from DWIN](tft_touch_display.md), which communicates with the ESP32-S3 using UART2 and the [DGUS II protocol](../../assets/pdf/T5L_DGUSII-Application-Development-Guide-V2.9-0207.pdf).
* A single [status LED](status_led.md) is provided for visual diagnostics and boot confirmation. 
* The ESP32 is programmed via UART0 using a [programming header](esp32_s3.md). 

The ESP32's 16 MB of flash is partitioned to support dual-bank OTA updates, core dumps, persistent storage (NVS), and a SPIFFS filesystem. SPIFFS is used for OTA staging via BLE and persistent storage of diagnostic and historical NMEA data.

The 8 MB PSRAM is used for buffering history data for UI graphing, and may also be used for image decoding or OTA caching.

## References

1. Espressif, [ESP32-S3-WROOM-1 & WROOM-1U Module Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf)
2. Texas Instruments, [TMP112 Low-Power Digital Temperature Sensor Datasheet](https://www.ti.com/lit/ds/symlink/tmp112.pdf)
3. Texas Instruments, [OPT3004 Ambient Light Sensor Datasheet](https://www.ti.com/lit/ds/symlink/opt3004.pdf)
4. Texas Instruments, [INA219 Current/Power Monitor With I2C Interface Datasheet](https://www.ti.com/lit/ds/symlink/ina219.pdf)
5. DWIN, [DGUS II Application Development Guide V2.9](../../assets/pdf/T5L_DGUSII-Application-Development-Guide-V2.9-0207.pdf)
6. UMWElectronics, [AO3407A P-Channel MOSFET Datasheet](https://lcsc.com/datasheet/lcsc_datasheet_2311091734_UMW-Youtai-Semiconductor-Co---Ltd--AO3407A_C347478.pdf)
7. Espressif, [ESP-PROG Hardware Guide](https://docs.espressif.com/projects/esp-iot-solution/en/latest/hw-reference/ESP-Prog_guide.html)
