# _DIGITAL_ Domain

The `DIGITAL` domain includes all logic and user interface components directly addressed by the [ESP32-S3](esp32_s3.md) micro-controller:

* the [CANBUS interface](can_transceiver.md) is accessed via a Texas Instruments [SN65HVD234](https://www.ti.com/lit/ds/symlink/sn65hvd234.pdf) 3.3 V high-speed CAN transceiver;
* two environmental sensors: an [ambient light sensor](ambient_light_sensor.md) and [temperature sensor](temperature_sensor.md) are accessed via the I²C bus;
* a [voltage/current sensor](power_sensor.md), is accessed via the I²C bus;
* the [HMI display](tft_touch_display.md) is addressed via UART and its 5 V power is switched with a MOSFET high-side switch;
* a single [status LED](status_led.md) is connected to an output pin for diagnostics; 
* the serial interface in the [`LEGACY IO` domain](../seatalk/index.md) is addressed via three opto-isolators; and
* a [flash programming header](esp32_s3.md), pin-compatible with [Espressif's ESP-Prog](https://docs.espressif.com/projects/esp-iot-solution/en/latest/hw-reference/ESP-Prog_guide.html) programmer's 6-pin IDC connector is connected to UART 0 and the `ESP_BOOT` and `ESP_EN` pins. 

The `DIGITAL` domain is powered from regulated 3.3 V and 5.0 V supplies derived from the [`SMPS` domain](../power/index.md). All circuits in the `DIGITAL` domain share a common ground reference `GNDREF`, isolated from the `LEGACY IO` domain ground.

!!! note
    Refer to the [MDD400 quick reference](../../quick_reference.md) for GPIO assignments, flash partitioning, I2C bus address assignments, board stackup and connector details.


## References

{% include-markdown "products/assets/pages/references/esp32_s3.md" %}