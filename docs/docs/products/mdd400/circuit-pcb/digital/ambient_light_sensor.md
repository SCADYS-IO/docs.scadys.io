# Ambient Light Sensor

The MDD400 incorporates an I<sup>2</sup>C ambient light sensor to enable automatic backlight brightness control and improve visibility in changing lighting conditions.

!!! note
    Refer to the [MDD400 quick reference](../../quick_reference.md) for GPIO assignments, flash partitioning, I2C bus address assignments, board stackup and connector details.

 This functionality is particularly valuable in marine environments, where ambient light can vary widely—from direct sunlight to nighttime operation. Automatic adjustment reduces power consumption, minimizes glare, and extends the useful lifetime of the display.

As the sensor is polled continuously, the interrupt pin is *not* connected to the ESP32.

## OPT3004 Digital Ambient Light Sensor

{% include-markdown "products/assets/pages/digital/opt3004.md" %}

The sensor is positioned close to the front panel of the device to ensure accurate readings of incident light on the display surface. 

## Firmware Use

The ESP32-S3 periodically polls the OPT3004 and uses the reported lux value to adjust the backlight brightness of the LCD panel. The lux value is scaled to a target brightness level using a configurable mapping curve, and includes hysteresis and time-series smoothing to avoid flicker during rapid ambient light transitions.

In low-light conditions, the firmware reduces the backlight intensity and switches the UI to night mode to preserve night vision. In bright conditions, full brightness is applied to maintain readability. The ambient light value is also recorded in system diagnostics and used to correlate with temperature trends or display behavior.

The use of a dedicated ambient light sensor improves user experience and provides adaptive behavior in real-world conditions where lighting varies significantly throughout the day.

## Datasheets and References

* Texas Instruments, [*OPT3004 Ambient Light Sensor Datasheet*](https://www.ti.com/lit/ds/symlink/opt3004.pdf)