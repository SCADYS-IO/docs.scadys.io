---
title: I²C Sensors
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/i2c_sensors_9a5c8376.svg" alt="I²C Sensors schematic" />

:::note Hardware version
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

## Components

| Ref | Value | Description | Datasheet |
|---|---|---|---|
| U2 | INA219 | Current/power monitor with I²C, SOT-23-8 | [TI INA219](https://www.ti.com/lit/ds/symlink/ina219.pdf) |
| U12 | OPT3004 | Ambient light sensor, WSON-6 | [TI OPT3004](https://www.ti.com/lit/ds/symlink/opt3004.pdf) |
| U13 | TMP112 | ±0.5 °C digital temperature sensor, SOT-563 | [TI TMP112](https://www.ti.com/lit/ds/symlink/tmp112.pdf) |
| R33 | 330 mΩ | 0603 precision shunt — INA219 current sense | [Yageo PT0603FR-070R33L](https://www.yageo.com/en/Product-Line/Resistors/Chip-Resistors/Thick-Film/PT/PT0603FR-070R33L) |
| R1, R2, R3 | 10 kΩ | 0603 — I²C bus pull-ups (SCL, SDA, SDA second) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R62 | 10 kΩ | 0603 — TMP112 ALERT pull-up | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C8 | 1 µF/25 V | 0603 X7R — INA219/TMP112 local bypass | — |
| C11 | 100 nF/50 V | 0603 X7R — high-frequency bypass | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| C56 | 100 nF/50 V | 0603 X7R — OPT3004 bypass | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| C57 | 100 pF/50 V | 0603 C0G — OPT3004 additional bypass | — |

## How It Works

Three I²C peripherals share the ESP32-S3's I²C bus (GPIO8 SCL, GPIO18 SDA): an INA219 power monitor, a TMP112 temperature sensor, and an OPT3004 ambient light sensor. All three operate from the 3.3 V (VCC) supply and respond on separate addresses, allowing the ESP32 to poll them independently without bus arbitration.

The **INA219** (U2, address 0x40) measures the MDD400's own supply current and voltage. A 330 mΩ precision thick-film shunt resistor (R33) is placed on the high-side supply rail, downstream of the over-voltage protection MOSFET. This placement ensures the INA219 never sees transients above 24.6 V — the cutoff threshold — protecting it from supply line events that could exceed its 26 V absolute maximum. At the maximum expected load of 250 mA, the shunt drops 82.5 mV. With the PGA set to /2 (±160 mV full-scale), the 12-bit ADC resolves approximately 118 µA/LSB and can measure up to ~485 mA before clipping.

The **TMP112** (U13, address 0x48) is a 12-bit, ±0.5 °C accuracy digital temperature sensor mounted close to the rear of the DWIN display panel. It is connected via I²C and alerts the firmware when temperature crosses a threshold — important in marine environments where direct sun exposure can heat the enclosure and drive the display beyond its rated operating range. The ADD0 pin is tied to GND to set address 0x48. A 10 kΩ pull-up (R62) on the ALERT output allows firmware to configure a threshold interrupt without polling.

The **OPT3004** (U12, address 0x44) is a 16-bit ambient light sensor with a spectral response closely matching the human eye, covering 0.01 to 83,000 lux. It is positioned close to the front panel to measure incident light on the display surface. The ADDR pin is tied to GND to set address 0x44. The INT output is pulled up to VCC via 10 kΩ but is not connected to an ESP32 GPIO in this design — the sensor is polled by firmware on a regular interval rather than interrupt-driven.

## Design Rationale

The three sensors were selected to give the firmware closed-loop visibility over the three main environmental variables that affect MDD400 reliability and user experience in service: supply health (INA219), thermal headroom (TMP112), and display readability (OPT3004).

Placing the INA219 shunt downstream of the over-voltage protection MOSFET avoids the need for additional series protection components at the sensor inputs, simplifying the circuit and improving measurement accuracy by eliminating the voltage drop of any protective element from the measurement path.

The OPT3004 was preferred over a simple photodiode or LDR because its I²C output eliminates ADC resource usage on the ESP32, its auto-ranging exponent/mantissa format handles the full outdoor lux range without saturation, and its human-eye-matched spectral response directly relates the measured value to perceived display brightness.

## Design Calculations

**INA219 current measurement resolution:**
- Shunt: 330 mΩ; PGA: /2 → ±160 mV full-scale
- Shunt voltage resolution @ 12-bit: 160 mV / 4096 ≈ 39 µV/LSB
- Current resolution: 39 µV / 0.33 Ω ≈ **118 µA/LSB**
- Peak measurable current: 160 mV / 0.33 Ω ≈ **485 mA** (well above 250 mA expected peak)
- Voltage drop at 250 mA: 0.33 Ω × 0.25 A = **82.5 mV**

**TMP112 resolution:** 12-bit, 0.0625 °C/LSB; accuracy ±0.5 °C over −40 °C to +125 °C

**OPT3004 dynamic range:** 0.01 to 83,000 lux in automatic range mode

## References

- Texas Instruments, [*INA219 Current/Power Monitor With I²C Interface Datasheet*](https://www.ti.com/lit/ds/symlink/ina219.pdf)
- Texas Instruments, [*TMP112 High-Accuracy, Low-Power Digital Temperature Sensor Datasheet*](https://www.ti.com/lit/ds/symlink/tmp112.pdf)
- Texas Instruments, [*OPT3004 Ambient Light Sensor (ALS) Datasheet*](https://www.ti.com/lit/ds/symlink/opt3004.pdf)
- Yageo, [*PT0603FR-070R33L Precision Thick Film Resistor Datasheet*](https://www.yageo.com/en/Product-Line/Resistors/Chip-Resistors/Thick-Film/PT/PT0603FR-070R33L)
