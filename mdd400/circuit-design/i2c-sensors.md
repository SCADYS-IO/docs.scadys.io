---
title: I²C Sensors
---

import useBaseUrl from '@docusaurus/useBaseUrl';

<img src={useBaseUrl('/img/schematics/mdd400/i2c_sensors.svg')} alt="I²C Sensors schematic" />

## Components

| Ref | Value | Description |
|-----|-------|-------------|
| U2 | INA219 | I²C current/power monitor, 26 V max input, SOT-23-8 |
| U12 | OPT3004 | Ambient light sensor, I²C, WSON-6 |
| U13 | TMP112 | Temperature sensor ±0.5 °C, I²C, SOT-563 |
| R1 | 10 kΩ | I²C SCL pull-up to VCC |
| R2 | 10 kΩ | I²C SDA pull-up to VCC |
| R3 | 10 kΩ | Additional I²C SDA pull-up (parallel) |
| R62 | 10 kΩ | Additional I²C SCL pull-up (parallel) |
| C8 | 1 µF/25 V | Local VCC decoupling |
| C11 | 100 nF/50 V | High-frequency VCC decoupling |
| C56 | 100 nF/50 V | Sensor supply decoupling |
| C57 | 100 pF/50 V | RF bypass |

## How It Works

All three sensors share the single I²C bus (I2C\_SDA on GPIO 18, I2C\_SCL on GPIO 8) with 10 kΩ pull-up resistors to VCC. The pull-up resistors are split across two pairs (R1/R2 and R62/R3) to allow the effective pull-up resistance to be adjusted at bring-up by depopulating one pair. For a bus with three devices and typical wire lengths, the combined 5 kΩ pull-up (two 10 kΩ in parallel) keeps the SDA and SCL rise times within the I²C specification at 400 kHz (Fast Mode).

The INA219 (U2, address 0x40) monitors both bus voltage and the current drawn by the MDD400 from the NMEA 2000 network. The shunt resistor R33 (0.33 Ω, located in the CAN bus power sheet) creates a voltage drop proportional to current; the INA219 amplifies and digitises this differential voltage. With a 0.33 Ω shunt and the device's 80 mV full-scale setting, the measurement range is 0–242 mA at 10 µA resolution. The firmware uses this reading to enforce the NMEA 2000 Class B load limit and to surface power consumption data as a PGN.

The OPT3004 (U12, address 0x44) measures ambient illuminance across a wide range (0.01 lux to 83 klux) with a spectral response that closely matches the human eye. The firmware reads this value and adjusts the DWIN display backlight brightness accordingly, ensuring the display remains readable in direct sunlight without being uncomfortably bright at night. The OPT3004 rejects artificial light sources that flicker at 50/60 Hz, which would otherwise cause oscillating brightness adjustments in a marina or harbour environment.

The TMP112 (U13, address 0x48) measures the PCB temperature to within ±0.5 °C over its full −40 °C to +125 °C range. The firmware uses this reading to detect abnormal operating conditions and may throttle the display brightness or log a fault if the board temperature exceeds thresholds set in the application configuration.

## Design Rationale

All three I²C devices were chosen for their small package size, low quiescent current, and compatibility with 3.3 V operation without level shifting. The INA219's 26 V maximum input on the bus voltage pin matches the worst-case VSD rail voltage, though the actual bus will not exceed 16 V under normal NMEA 2000 operation.

The address assignments were chosen to avoid conflicts: INA219 (0x40), OPT3004 (0x44), and TMP112 (0x48) are all configurable with address pins, and the selected addresses are the factory defaults for each device, minimising the need for address-select resistors. The firmware uses the standard I²C scan at boot to verify all three devices are present before beginning normal operation.
