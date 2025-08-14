# Power Sensor

The MDD400 continuously monitors its own supply voltage and current draw to provide diagnostic data, support fault detection, and enable intelligent power management.

The power sensor circuit (schematic below) uses a [INA219](https://www.ti.com/lit/ds/symlink/ina219.pdf) Current/Power Monitor With I²C Interface, located in the `CAN` domain. To maintain galvanic isolation from the `DIGITAL` domain, an [ISO1541](https://www.ti.com/lit/ds/symlink/iso1541.pdf) I²C isolator transfers [`I2C_SCL`](../../quick_reference.md) and [`I2C_SDA`](../../quick_reference.md) signals across the galvanic barrier.

The INA219's A1 and A0 address pins are both tied to ground, setting the address of the sensor on the I²C bus to [`0X40`](../../quick_reference.md).

See the [quick reference](../../quick_reference.md) for the ESP32-S3 GPIO allocations and a listing of all I²C devices and their addresses.

![I²C Power Sensor](../../assets/images/power_sensor.png)

## Voltage Sensing

The input voltage is sensed downstream of the over-voltage protection MOSFET, which disconnects the load when the supply exceeds 24.6 V. This ensures that the INA219 is never exposed to transients or sustained voltages above its absolute maximum input rating of 26 V. The INA219's VS pin is supplied from the 5.54 V isolated rail (`VDD`), and its voltage measurement is taken between IN+ and IN− referenced to `GNDC`.

As a result of this topology, the INA219 only measures the regulated supply voltage seen by the internal `CAN` domain circuitry, rather than the raw external supply. This is sufficient for diagnostic and power management purposes.

## Current Sensing

The input current is measured using a high-side 330 mΩ shunt resistor ([Yageo PT0603FR-070R33L](https://www.yageo.com/en/Product-Line/Resistors/Chip-Resistors/Thick-Film/PT/PT0603FR-070R33L)) placed between the protected supply (VS+) and the internal supply rail (VS−). This location ensures that current is measured after the MOSFET limiter, protecting the INA219 from over-current events during external transients such as load dump (ISO 7637-2 Pulse 5b).

At the maximum expected load current of 250 mA, the voltage drop across the shunt is 82.5 mV. The INA219 is configured for a programmable gain amplifier (PGA) setting of /2, yielding a ±160 mV full-scale input range. This provides sufficient headroom while maintaining acceptable resolution.

The effective current measurement resolution at 12-bit is approximately 118 μA/LSB:

* shunt voltage resolution = 160 mV / 2¹² = 39 μV;
* current resolution = 39 μV / 0.33 Ω ≈ 118 μA/LSB.

Peak measurable current without clipping is:

* I<sub>max</sub> = 160 mV / 0.33 Ω ≈ 485 mA.

This comfortably exceeds the 250 mA peak expected load.

## Galvanic Isolation

The INA219 is located in the `CAN` domain and shares a ground reference (`GNDC`) with other CAN-side components. The I²C signals are passed through an [ISO1541](https://www.ti.com/lit/ds/symlink/iso1541.pdf) digital isolator, with `VCC`1/GND1 referenced to the digital logic domain (`VCC`/`GNDREF`) and `VCC`2/GND2 referenced to the `CAN` domain (`VDD`/`GNDC`).

The I²C isolator supports bidirectional data communication (`I2C_SDA`), with `I2C_SDA` and `I2C_SCL` pull-up resistors on the isolated side to `VDD`. The digital logic domain already includes pull-up resistors to `VCC`, as noted in the [MCU section](../digital/esp32_s3.md) section.

![I²C Power Sensor](../../assets/images/i2c_isolator.png)

## Protection Considerations

By placing the shunt resistor downstream of the 24.6 V over-voltage MOSFET limiter, the INA219 is shielded from high-voltage transients and does not require additional series resistors or transient protection devices at IN+ or IN−. This simplifies the circuit and improves measurement accuracy.

## Datasheets and Citations

1. Texas Instruments, [*INA219 Current/Power Monitor With I²C Interface Datasheet*](https://www.ti.com/lit/ds/symlink/ina219.pdf)
2. Texas Instruments, [*ISO1541 Low-Power I²C Digital Isolator Datasheet*](https://www.ti.com/lit/ds/symlink/iso1541.pdf)
3. Yageo, [*PT0603FR-070R33L Precision Thick Film Resistor Datasheet*](https://www.yageo.com/en/Product-Line/Resistors/Chip-Resistors/Thick-Film/PT/PT0603FR-070R33L)
