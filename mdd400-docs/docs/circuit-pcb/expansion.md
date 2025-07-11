# Expansion Connectors

Expansion port connectors are not populated on consumer versions of the
MDD400. Only the MDD400-DEV version gives makers and the open-source
community access these connectors.

These connectors expose the microcontroller pins and no protection is
provided to ensure the maximum utility. The \[SDA\], \[SCL\], \[EN\] and
\[BOOT\] pins are pulled up to Vcc by 10k Ω resistors. All other pins
are not pulled up or down to maximise utility.

## ESP-PROG

Describe the ESP-PROG here

### Flash Programmer

Used in production for flashing firmware

Is a through-hole part. In production a dedicated programmer with pogo
pins is used to interface to the same footprint

### JTAG Debugging Port

The JTAG connector (1.27mm pitch, 2x5 pins) is compatible with the
ESP-PROG cable.

It is only populated tin the MDD400-DEV version.

The connector can be used for expanding four MCU pins to off-PCB
functions. The connector provides GND and 5v. In addition, 3.3v can also
be provided (on pin 10 of the connector) by closing the adjacent solder
jumper.

## I2C

Has a 4 pin, 2.54mm pitch male header, compatible with DuPont
cable/connectors. Exposes GND, 3v3, \[SDA\] and \[SCL\]

## One-Wire

The \[1-WIRE\] pin, GND and 5V is connected to this 3-pin, 2.54mm pitch
male header compatible with DuPont cable/connectors. Provides an
interface for industry standard DS18B20 one-wire temperature sensors.