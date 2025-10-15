# ESP32-S3 Micro-controller Module

The MDD400 design is based on the [ESP32-S3-WROOM-1-N16R8](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf) module, a fully integrated wireless microcontroller that includes a dual-core Xtensa® LX7 CPU running at up to 240 MHz, 512 KB SRAM, and 8 MB PSRAM. The module supports both Wi-Fi and Bluetooth / BLE, and offers a wide array of digital peripherals including SPI, I²C, UART, PWM, ADC, DAC, and TWAI®. The integrated QSPI flash and PSRAM interface supports external memory for advanced applications such as graphical user interfaces, data logging, and OTA update handling. Enhanced security features include secure boot, flash encryption, and hardware HMAC/RSA modules. The module is fully certified and incorporates an integrated antenna.

## ESP32-S3 GPIO Connections

The ESP32-S3 module is connected to the following peripherals:

* the [CANBUS interface](twai.md) is accessed via a galvanically isolated CAN transceiver;
* two environmental sensors: an [ambient light sensor](ambient_light_sensor.md) and [temperature sensor](temperature_sensor.md) are accessed via the I²C bus;
* an I²C [voltage/current sensor](../can/power_sensor.md), in the isolated [`CAN` domain](../can/index.md), is accessed via an I²C isolator;
* the [HMI display](tft_touch_display.md) is addressed via UART and its 5 V power is switched with a MOSFET high-side switch;
* a single [status LED](status_led.md) is connected to an [output pin](../../quick_reference.md) for diagnostics; 
* the serial interface in the [`LEGACY IO` domain](../seatalk/index.md) is addressed via three opto-isolators; and
* a [flash programming header](esp32_s3.md), pin-compatible with Espressif's ESP-Prog programmer's 6-pin IDC connector is connected to UART 0 and the [`ESP_BOOT`](../../quick_reference.md) and [`ESP_EN`](../../quick_reference.md) pins. 

The schematic shows the pin allocations on the ESP32-S3 module as implemented in the MDD400 design. 

![ESP32-S3 MCU Pin Allocation](../../assets/images/esp32_pin_allocation.png)

The following pull-up resistors and timing capacitors are included on selected GPIOs to ensure correct startup behaviour and stable logic levels:

* [`ESP_EN`](../../quick_reference.md) is pulled up to `VCC` with 10 kΩ and has a 1 µF capacitor to `GNDREF`;
* [`ESP_BOOT`](../../quick_reference.md) (GPIO0) is pulled up to `VCC` with 10 kΩ and has a 100 nF capacitor to `GNDREF`; and
* I²C lines ([`I2C_SCL`](../../quick_reference.md) and [`I2C_SDA`](../../quick_reference.md)) are pulled up to `VCC` with 10 kΩ resistors.

The ESP32-S3-WROOM-1 module includes [48 GPIOs](https://docs.espressif.com/projects/esp-idf/en/v5.5/esp32s3/api-reference/peripherals/gpio.html), many of which are multifunctional. The following GPIO assignments are used in the MDD400:

{% include-markdown "../../assets/include/table_1_gpio_assignments.html" %}

## Memory

{% include-markdown "products/assets/pages/digital/esp32_memory.md" %}

## Flash Storage

{% include-markdown "products/assets/pages/digital/esp32_flash_storage.md" %}

## I²C Bus

The ESP32-S3 communicates with three external peripherals on a shared I²C bus.

{% include-markdown "products/mdd400/assets/include/table_3_i2c_device_list.html" %}

All three devices share the same [`I2C_SDA`](../../quick_reference.md) and [`I2C_SCL`](../../quick_reference.md) signal lines. A single set of 4.7 kΩ pull-up resistors is present on the `DIGITAL` domain side (`VCC`), and a second set is placed on the `CAN` domain side (`VDD`), beyond the I²C isolator. Each device includes local decoupling capacitors as required by its datasheet.

## Datasheets and References

{% include-markdown "products/assets/pages/references/esp32_s3.md" %}
{% include-markdown "products/assets/pages/references/tmp112.md" %}
{% include-markdown "products/assets/pages/references/opt3004.md" %}
{% include-markdown "products/assets/pages/references/ina219.md" %}



