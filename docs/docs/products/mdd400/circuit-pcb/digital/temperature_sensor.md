# Temperature Sensors

Temperature sensing particularly important in marine environments where direct sun exposure can rapidly elevate surface temperatures beyond the LCD's rated operating range. The MDD400's [DWIN DMG48480F040_01WTC display](tft_touch_display.md) display does not incorporate a temperature sensor, so external monitoring is required. When high temperature is detected, firmware may respond by dimming the backlight, issuing a warning, logging a diagnostic event or turning off the display by pulling [`DISP_EN`](../../quick_reference.md) low.

Temperature monitoring is a key diagnostic feature of the MDD400, providing insights into internal thermal conditions that may affect reliability, performance, and user experience. The design includes two complementary temperature sensors: 

* the internal ESP32-S3 junction sensor; and 
* an external high-accuracy I²C temperature sensor mounted near the display.

Together, the ESP32-S3's internal sensor and the external TMP112 provide robust and layered visibility into the thermal state of the MDD400, improving resilience and field reliability.

!!! note
    Refer to the [MDD400 quick reference](../../quick_reference.md) for GPIO and I2C bus address assignments.

## Internal Microcontroller Temperature Sensor

{% include-markdown "products/assets/pages/digital/esp32_temperature_sensor.md" %}

## External Display Temperature Sensor

To provide more meaningful thermal data near the display panel, a dedicated I2C temperature sensor is mounted on the main board, in close proximity to the rear of the capacitive touch LCD. 

{% include-markdown "products/assets/pages/digital/i2c_temperature_sensor.md" %}

## References

{% include-markdown "products/assets/pages/references/esp32_temp_sensor.md" %}
{% include-markdown "products/assets/pages/references/tmp112.md" %}
