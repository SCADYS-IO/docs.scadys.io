---
title: Motion Sensor
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel Sunny Spells"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/wti400-v1.2/motion_sensor_39308430.svg" alt="Motion Sensor schematic" />

:::note Hardware version
WTI400 **v1.2** — In service — installed on test vessel *Sunny Spells*
:::

## Components

| Ref | Value | Description | Datasheet |
|-----|-------|-------------|-----------|
| U1 | LSM6DSLTR | ST Microelectronics LSM6DSLTR 6DoF iNEMO IMU — 3-axis accelerometer + 3-axis gyroscope, LGA-14 (2.5×3.0 mm), I2C/SPI | [Datasheet](https://www.st.com/resource/en/datasheet/lsm6dsl.pdf) |
| C5 | 1 µF / 25 V / 0603 | VDD bulk decoupling capacitor | — |
| C6 | 100 nF / 50 V / 0603 | VDD high-frequency bypass capacitor | — |
| C12 | 100 nF / 50 V / 0603 | VDDIO high-frequency bypass capacitor | — |

---

## How It Works

The motion_sensor sub-sheet provides a 6-degree-of-freedom (6DoF) inertial measurement unit for the WTI400. U1 (LSM6DSLTR) is an ST Microelectronics MEMS IMU containing a 3-axis accelerometer and a 3-axis gyroscope in a single LGA-14 package.

**Power supply.** U1 has two supply pins: VDD (pin 8, analog core) and VDDIO (pin 5, digital I/O), both connected to the VCC rail (3.3 V). C5 (1 µF) and C6 (100 nF) decouple VDD; C12 (100 nF) decouples VDDIO. The separate VDDIO pin allows the digital interface to operate at a different voltage to the analog core — in this design both are tied to the same 3.3 V rail.

**I2C interface.** U1 communicates as an I2C slave. The SA0/SDO pin (pin 1) is tied to GNDREF, setting the I2C slave address to **0x6A**. The CS pin (pin 12) is tied to VDDIO, selecting I2C mode and disabling the SPI interface. I2C_SCL and I2C_SDA are global labels that connect to the ESP32 I2C master on the `esp32_module` sheet. Pull-up resistors for the bus are provided on the `esp32_module` sheet (R3/R4 = 10 kΩ).

**Interrupt outputs.** INT1 (pin 4) and INT2 (pin 9) are left unconnected. The WTI400 firmware reads sensor data by polling over I2C; no hardware interrupts are used.

---

## Design Rationale

The LSM6DSLTR was selected for its low power consumption (~0.4 mA at 3.3 V in normal operating mode), compact LGA-14 footprint, and its embedded machine learning core — which allows low-latency motion detection without firmware overhead. Both VDD and VDDIO are tied to the same 3.3 V VCC rail; this is within specification (VDD: 1.71–3.6 V; VDDIO: 1.62–3.6 V) and simplifies the power architecture.

Decoupling follows ST AN5040 recommendations: a 1 µF bulk capacitor (C5) and a 100 nF HF bypass (C6) on VDD, and a 100 nF HF bypass (C12) on VDDIO. All three capacitors are placed at the minimum distance from U1 that component courtyard clearances allow. Power dissipation is negligible (P_D ≈ 1.3 mW), so no thermal management is required.

INT1 and INT2 are left floating by design. Polling is adequate for the WTI400's vessel motion logging use case (typical ODR 52 Hz), and it avoids the GPIO routing complexity of interrupt-driven operation.

---

## PCB Layout

All four components are on F.Cu. U1 is placed approximately 50 mm from the nearest switching power supply cell, on a continuous GNDREF ground plane (In1.Cu). A copper-pour keepout zone on F.Cu surrounds U1 to prevent unintended fills under the LGA-14 package.

| Requirement | Status | Evidence |
|-------------|--------|----------|
| U1 away from switching power supplies | ✅ Met | ~50 mm from nearest SMPS cell; no high-current switching nodes within 50 mm |
| U1 on continuous ground plane | ✅ Met | In1.Cu GNDREF plane continuous; F.Cu keepout zone prevents copper pour under LGA-14 |
| SA0/SDO (pin 1) tied to GNDREF | ✅ Met | Pin 1 net = GNDREF; I2C address = 0x6A |
| CS (pin 12) tied to VDDIO | ✅ Met | Pin 12 net = VCC; I2C mode selected |
| INT1/INT2 (pins 4, 9) left floating | ✅ Met | Unconnected pads; intentional |
| C5/C6 as close as possible to U1 VDD pin | ✅ Met | At courtyard-constrained minimum distance (~1 mm courtyard-to-courtyard) |
| C12 as close as possible to U1 VDDIO pin | ✅ Met | At courtyard-constrained minimum distance |
| U1 orientation aligned with PCB axes | ✅ Met | Rotation 0° |

---

## Design Calculations

| Parameter | Value | Notes |
|-----------|-------|-------|
| VDD / VDDIO supply | 3.3 V | Rated range: VDD 1.71–3.6 V; VDDIO 1.62–3.6 V ✓ |
| Supply current (normal mode, accel + gyro) | 0.4 mA | Both axes active |
| Power dissipation (normal mode) | 1.3 mW | P_D = 0.4 mA × 3.3 V |
| Junction temperature rise at 85 °C ambient | ~0.4 °C | θ_JA ≈ 180 °C/W; ΔT_j negligible |
| I2C slave address | 0x6A | SA0 = GND |
| I2C max clock (Fast Mode) | 400 kHz | Standard Mode (100 kHz) confirmed working |
| Accelerometer full-scale range | ±2 / ±4 / ±8 / ±16 g | Firmware-selectable |
| Gyroscope full-scale range | ±125 to ±2000 dps | Firmware-selectable |
| Recommended ODR (WTI400) | 52 Hz | Nyquist margin for 5 Hz wave heave |

---

:::caution Verification required — In service

**Verify during bring-up:**
- **VDD ripple:** Measure VDD at U1 with a 100 MHz oscilloscope under normal I2C polling load. Target: < 50 mV peak-to-peak. C5 and C6 are at the courtyard-constrained minimum distance from U1 VDD pin. *(performance_review Gap 5)*

:::

---

## References

1. ST Microelectronics, [*LSM6DSL iNEMO Inertial Module Datasheet*](https://www.st.com/resource/en/datasheet/lsm6dsl.pdf)
2. ST Microelectronics, [*AN5040 — LSM6DSL Always-On 3D Accelerometer and 3D Gyroscope*](https://www.st.com/resource/en/application_note/an5040-lsm6dsl-alwayson-3d-accelerometer-and-3d-gyroscope-stmicroelectronics.pdf)
