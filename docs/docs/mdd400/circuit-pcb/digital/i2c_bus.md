# I²C Bus

The ESP32-S3 communicates with three external peripherals on a shared I²C bus:

* a [Temperature Sensor](temperature_sensor.md) at address `0x48`;
* an [Ambient Light Sensor](ambient_light_sensor.md) at address `0x44`; and
* a [power sensor](../can/power_sensor.md) at address `0x40`, located in the isolated [CAN domain](../can/index.md) is accessed via an I2C isolator.

All three devices share the same SDA and SCL signal lines. A single set of 4.7 kΩ pull-up resistors is present on the digital domain side (VCC), and a second set is placed on the CAN domain side (VDD), beyond the I²C isolator. Each device includes local decoupling capacitors as required by its datasheet.




