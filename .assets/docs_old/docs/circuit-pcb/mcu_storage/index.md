# MCU and Storage

This section describes the digital processing and memory subsystem of the MDD400. It includes the main microcontroller, volatile and non-volatile memory, and storage components used for firmware, configuration, and runtime data.

* *[ESP32-S3](esp32_s3.md)*: The central microcontroller is an ESP32-S3, which integrates Wi-Fi, Bluetooth Low Energy, and a dual-core Xtensa processor. This section covers pin assignments, bootstrapping configuration, and peripheral connections including UART, I²C, SPI, and ADC.
* *[I2C](i2c.md)*: Describes the inter-ic communication bus and lists the attached devicews and their addresses.
* *[Memory](memory.md)*: Describes the external SRAM (PSRAM) used for framebuffer storage, buffering, and heap expansion. Connection details and initialization notes are included.
* *[Flash Storage](flash_storage.md)*: Documents the onboard SPI flash memory used to store firmware, user configuration, and data logs. Includes layout considerations and expected memory usage.

Together, these components form the core digital subsystem responsible for application execution, peripheral control, and user interface logic.
