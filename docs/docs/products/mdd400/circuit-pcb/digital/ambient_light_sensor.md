# Ambient Light Sensor

The MDD400 incorporates an ambient light sensor to enable automatic backlight brightness control and improve visibility in changing lighting conditions. This functionality is particularly valuable in marine environments, where ambient light can vary widely—from direct sunlight to nighttime operation. Automatic adjustment reduces power consumption, minimizes glare, and extends the useful lifetime of the display.

## OPT3004 Digital Ambient Light Sensor

The system uses the [OPT3004DNPR](https://www.ti.com/lit/ds/symlink/opt3004.pdf), a low-power digital ambient light sensor with high dynamic range and spectral response closely matching the human eye. The sensor communicates with the ESP32-S3 via I²C and is connected to the same bus as the TMP112 temperature sensor ([`I2C_SCL`](../../quick_reference.md) and [`I2C_SDA`](../../quick_reference.md) pins). The OPT3004 address is configured via the ADDR pin (connected to GND), setting its I²C address to [`0x44`](../../quick_reference.md).

![OPT3004 Sensor Schematic](../../assets/images/als_schematic.png)

See the [quick reference](../../quick_reference.md) for the ESP32-S3 GPIO allocations and a listing of all I²C devices and their addresses.

The OPT3004 provides a 16-bit lux measurement over a dynamic range of 0.01 lux to 83,000 lux, automatically scaling via its built-in exponent/mantissa format. This range is ideal for both indoor/dim environments and direct sunlight detection. The sensor includes an interrupt output (INT), which is not used in the current design but is brought out to a test point for future expansion.

The device is powered from the 3.3 V logic supply (`VCC`) and is locally decoupled with 100 pF and 1 µF capacitors (C7 and C8). A 10 kΩ pull-up resistor (R9) is used on the I²C lines. The sensor is positioned close to the front panel of the device to ensure accurate readings of incident light on the display surface.

## Firmware Use

The ESP32-S3 periodically polls the OPT3004 and uses the reported lux value to adjust the backlight brightness of the LCD panel. The lux value is scaled to a target brightness level using a configurable mapping curve, and includes hysteresis and time-series smoothing to avoid flicker during rapid ambient light transitions.

In low-light conditions, the firmware reduces the backlight intensity and switches the UI to night mode to preserve night vision. In bright conditions, full brightness is applied to maintain readability. The ambient light value is also recorded in system diagnostics and used to correlate with temperature trends or display behavior.

The use of a dedicated ambient light sensor improves user experience and provides adaptive behavior in real-world conditions where lighting varies significantly throughout the day.

## Datasheets and References

1. Texas Instruments, [*OPT3004 Ambient Light Sensor Datasheet*](https://www.ti.com/lit/ds/symlink/opt3004.pdf), Document No. SBOS705C
