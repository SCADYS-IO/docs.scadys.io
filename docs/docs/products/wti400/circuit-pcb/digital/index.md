# _DIGITAL_ Domain

The `DIGITAL` domain includes all logic and user interface components directly addressed by the [ESP32-S3](esp32_s3.md) micro-controller:

* the [CANBUS interface](can_transceiver.md) is accessed via a Texas Instruments [SN65HVD234](https://www.ti.com/lit/ds/symlink/sn65hvd234.pdf) 3.3 V high-speed CAN transceiver;
* the serial interface in the [`LEGACY IO` domain](../seatalk/index.md) is addressed via three opto-isolators; and
* a [flash programming header](esp32_s3.md), pin-compatible with [Espressif's ESP-Prog](https://docs.espressif.com/projects/esp-iot-solution/en/latest/hw-reference/ESP-Prog_guide.html) programmer's 6-pin IDC connector is connected to UART 0 and the `ESP_BOOT` and `ESP_EN` pins. 

The `DIGITAL` domain is powered from a regulated 3.3 V supply derived from the isolated [`SMPS` domain](../power/index.md). All circuits in the `DIGITAL` domain share a common ground reference `GNDREF`, isolated from the `CAN`, `SMPS` and `LEGACY IO` domain grounds.

!!! note
    Refer to the [WTI400 quick reference](../../quick_reference.md) for GPIO assignments, flash partitioning, I2C bus address assignments, board stackup and connector details.


## References

{% include-markdown "products/assets/pages/references/esp32_s3.md" %}