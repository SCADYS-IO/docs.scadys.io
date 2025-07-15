# Temperature Sensors

Temperature monitoring is a key diagnostic feature of the MDD400, providing insights into internal thermal conditions that may affect reliability, performance, and user experience. The design includes two complementary temperature sensors: the internal ESP32-S3 junction sensor and an external high-accuracy I²C temperature sensor (TMP112) mounted near the display.

Together, the ESP32-S3's internal sensor and the external TMP112 provide robust and layered visibility into the thermal state of the MDD400, improving resilience and field reliability.

## Internal Microcontroller Temperature Sensor

The ESP32-S3 microcontroller includes an integrated temperature sensor, which is sampled periodically by firmware. This sensor provides an estimate of the chip's internal junction temperature and is useful for monitoring system-level heating caused by sustained processor load, ambient temperature rise, or enclosure heat buildup. 

While not calibrated for precision use, this internal sensor allows early detection of abnormal heating, and supports thermal diagnostics across a typical range of --20 °C to +125 °C. Measured values are exposed via the system's diagnostics interface and may be used in conjunction with voltage and current data to identify thermal trends.

However, due to its location within the silicon die, this sensor does not reflect the temperature of nearby components - particularly those affected by external heat sources such as direct sunlight. 

## External Display Temperature Sensor

To provide more meaningful thermal data near the display panel, a dedicated TMP112AIDRLR temperature sensor is mounted on the main board, in close proximity to the rear of the capacitive touch LCD. This sensor is connected to the ESP32-S3 via the I²C bus pins \[SCL\] and \[SDA\]. The TMP112 device address is configured via the ADD0 pin to 0x48, the default address when ADD0 is tied to GND.

The TMP112 supports 12-bit resolution (0.0625 °C per bit) with typical accuracy of ±0.5 °C across the range --40 °C to +125 °C. It is powered from the regulated logic supply (VCC), and includes 100 pF and 1 µF local bypass capacitors (C55 and C56) for stability. A 10 kΩ pull-up resistor (R38) is fitted on the ALERT line, allowing firmware to configure an interrupt for temperature threshold crossing if needed. 

This sensor provides a reliable indicator of display-local temperature - particularly important in marine environments where direct sun exposure can rapidly elevate surface temperatures beyond the LCD's rated operating range. The DWIN DMG48480F040_01WTC display does not incorporate an internal temperature sensor, so external monitoring is required. When high temperature is detected, firmware may respond by dimming the backlight, issuing a warning, logging a diagnostic event or turning off the display by pulling \[DISP_EN\] low.
