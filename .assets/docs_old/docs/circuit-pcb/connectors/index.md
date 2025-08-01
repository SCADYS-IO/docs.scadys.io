# Expansion Connectors

The MDD400 includes several expansion headers for development, configuration, and sensor connectivity. These connectors expose internal signals and power rails to allow in-field expansion or lab testing. Each connector is documented with pin assignments, electrical characteristics, and intended use cases.

* *[ESP-PROG](esp_prog.md)*: A 10-pin, 1.27 mm JTAG connector compatible with the Espressif ESP-PROG debugging and programming tool. It supports firmware flashing in production and JTAG debugging in the MDD400-DEV variant. The footprint includes GND, 5 V, and optionally 3.3 V via a solder jumper. In production, a pogo-pin fixture interfaces to the same pads.

* *[I²C](i2c.md)*: A 4-pin, 2.54 mm pitch header (GND, 3.3 V, SDA, SCL) for connecting external I²C-compatible sensors or peripherals. The layout supports standard DuPont-style connectors and provides access to the same bus used by the onboard ambient light and temperature sensors.

* *[1-Wire](one_wire.md)*: A 3-pin, 2.54 mm pitch header (GND, 5 V, 1-WIRE) intended for DS18B20-compatible digital temperature sensors. The interface supports connection to multiple daisy-chained 1-Wire devices with external pull-up as needed.

These connectors enable flexible prototyping and field expansion of the MDD400 without requiring modification to the core PCB or enclosure.
