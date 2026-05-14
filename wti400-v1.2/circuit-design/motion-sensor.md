---
title: Motion Sensor
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/wti400-v1.2/motion_sensor_39308430.svg" alt="Motion Sensor schematic" />

:::note[Hardware version]
WTI400 **v1.2** — In service — installed on test vessel
:::

## Overview

The WTI400 is a wind transducer interface. Wind sensors are mounted at the top of the mast — this position gives the clearest airflow reading, but it also means that every movement of the vessel is greatly amplified at the masthead. A boat rolling just a few degrees at deck level can cause the masthead to swing through an arc of several metres. This movement directly affects both the apparent wind speed and the apparent wind direction reported by the sensor.

The LSM6DSLTR motion sensor on the WTI400 measures this movement. It provides three-axis acceleration and three-axis angular rate (rotation speed) data, which the firmware uses to compute the instantaneous velocity of the masthead sensor in the horizontal plane. That velocity is then subtracted from each wind reading, producing a stabilised output that reflects the true wind rather than the combined effect of wind plus boat movement.

This page covers two aspects of the motion sensor implementation:

- **Inertial measurement unit (IMU)** — the electrical circuit: the sensor IC, its power supply, and its I2C interface to the ESP32.
- **PCB design and assembly** — the mechanical and soldering requirements specific to MEMS devices. These requirements are more demanding than for ordinary ICs, and failing to follow them caused assembly problems in V1.1.

The PCB carries an axis diagram (silk-screen) showing the X, Y, Z directions and the corresponding pitch (P), roll (R), and yaw (Y) rotation directions. U1 is oriented on the board for the **default installation orientation**: mounted vertically on a transverse bulkhead — that is, on a flat surface facing forward or aft in the vessel, with the board standing upright. The firmware supports other mounting orientations, but this is the reference orientation for the default calibration.

---

## Inertial Measurement Unit

### Functional specification and design objectives

The IMU must:

- Measure acceleration on three orthogonal axes (X, Y, Z) and angular rate on the same three axes simultaneously and continuously
- Deliver samples at a rate sufficient for the firmware to compute masthead transducer velocity over a rolling time window — current setting is 52 Hz; this may need to increase once the compensation algorithm is developed
- Communicate with the ESP32 over I2C, appearing as a slave device at a fixed address of 0x6A
- Operate reliably across the marine operating range (−10 °C to +55 °C, extended)
- Consume minimal power — the WTI400 is bus-powered from the NMEA 2000 backbone, which has a limited supply budget per node

### How it works

#### What the firmware needs from this sensor

The purpose of the IMU is to compute the velocity of the wind transducer at the masthead, in the horizontal plane, at every sample point. This is more involved than simply reading the accelerometer.

When a vessel rolls, the masthead traces a curved arc. The sensor at the top of the mast is at the end of a long lever arm — the mast itself. The key relationship is:

> **Linear velocity at the masthead = angular velocity × mast length**

For a typical mast of 15 m, a roll rate of just 5 °/s produces a masthead tip velocity of over 1.3 m/s. That is more than enough to significantly distort a 10-knot wind reading. This is why the gyroscope (which measures angular rate directly) is just as important as the accelerometer. The accelerometer data provides additional information about translational motion — heave, surge, and sway — and is also used to determine the tilt angle of the sensor, which affects the axis alignment between sensor coordinates and the vessel's coordinate frame.

The exact algorithm for combining gyroscope and accelerometer data into a masthead velocity estimate is deferred to the firmware development phase. What matters for the hardware is that **both sensor axes are needed**, and that the sample timing must be consistent — accurate integration over a rolling time window requires a stable, predictable sample interval.

#### Power supply

The LSM6DSLTR has two supply pins:

- **VDD (pin 8)** powers the analog core: the MEMS accelerometer and gyroscope transducers and their signal conditioning circuitry.
- **VDDIO (pin 5)** powers the digital side: the I2C interface, the internal registers, and the control logic.

Providing two separate supply pins allows the sensor to work in systems where the host microcontroller runs at a different voltage to the analog core — for example, a 1.8 V digital system paired with a 3.3 V analog supply. On the WTI400, both pins are connected to the same 3.3 V VCC rail. This simplifies the power architecture: there is no need for a second voltage regulator. Both pins accept 1.71–3.6 V (VDD) and 1.62–3.6 V (VDDIO), so 3.3 V is well within specification for both.

The schematic is drawn to make this arrangement clear. C12 is drawn connected to the VDDIO pin; C5 and C6 are drawn connected to the VDD pin. All three capacitors are on the same VCC net, but the schematic drawing shows which capacitor is responsible for which supply pin.

**Why decoupling capacitors are placed this close to the IC**

Each supply pin needs its own decoupling capacitors placed as close as possible to the pin. A decoupling capacitor (also called a bypass capacitor) acts as a small local energy reservoir. When the IC's internal logic switches and draws a brief pulse of current, the capacitor supplies that current instantly — before it has time to travel along the supply trace from the bulk power supply. The effectiveness of this function falls off quickly with distance, because every millimetre of trace between the capacitor and the IC pin adds inductance, which slows the current response. Placing the capacitors close to the pins keeps this inductance low.

For VDD:
- **C5, a 1 µF bulk ceramic capacitor**, handles lower-frequency current demand and acts as a local energy reserve. It is placed within 1.2 mm of the VDD pin — the minimum distance the component courtyard rules allow.
- **C6, a 100 nF high-frequency bypass capacitor**, handles faster current transients. It is placed directly adjacent to C5, also at the courtyard-constrained minimum.

For VDDIO:
- **C12, a 100 nF high-frequency bypass capacitor**, is placed within 1.2 mm of the VDDIO pin — again, the courtyard minimum.

**VCC supply routing**

The VCC supply is connected to the **far side** of each capacitor — the pad facing away from U1. A 0.2 mm trace runs from that pad to a via, which connects to VCC copper pours on both the top copper layer (F.Cu) and the bottom copper layer (B.Cu). The supply current arrives from the pour through the via and the short trace, and the capacitor discharges toward the IC pin with minimal copper in the path.

This arrangement is deliberate. It keeps the discharge path — from IC pin, through capacitor, to GNDREF — as short and low-inductance as possible. The supply arrives from the pour (a large, low-resistance copper area) rather than from a trace running under or near the IC.

#### I2C interface and address configuration

The LSM6DSLTR communicates as an I2C slave device. It responds to commands from the ESP32 I2C master but never initiates communication on its own.

Two pins are tied at assembly time to configure the interface permanently:

- **SA0/SDO (pin 1)** is connected to GNDREF (ground). This sets the I2C slave address to **0x6A**. If this pin were tied to VDDIO instead, the address would be 0x6B. The address is fixed in hardware — it cannot be changed by firmware after the board is assembled. No other I2C device on the WTI400 uses address 0x6A, so there is no conflict.
- **CS (pin 12)** is tied to VDDIO (3.3 V). This selects I2C mode and disables the SPI interface. The LSM6DSLTR supports both I2C and SPI; tying CS high permanently selects I2C.

The I2C signals — SCL (clock) and SDA (data) — are global net labels on this sheet. They connect to the ESP32 I2C master on the `esp32_module` sheet. The pull-up resistors for the bus — R3 and R4, each 10 kΩ — are also on the `esp32_module` sheet. The current firmware operates in Standard Mode at 100 kHz, which is confirmed working. The LSM6DSLTR also supports Fast Mode at 400 kHz; however, the 10 kΩ pull-ups are on the high side for Fast Mode and may cause reliability issues at that speed. If the firmware is upgraded to 400 kHz, the pull-up values should be verified — see Bring-up tests.

#### Interrupt outputs

The LSM6DSLTR has two interrupt output pins: **INT1 (pin 4)** and **INT2 (pin 9)**. These are push-pull digital outputs that the IC can use to signal the ESP32 when a specific event occurs — for example, when a new sensor sample is ready, or when a motion threshold is exceeded.

On the WTI400 V1.2, both INT1 and INT2 are **left unconnected**. The firmware reads sensor data by polling over I2C at the chosen sample rate; it does not wait for an interrupt signal. Polling is simpler to implement and is entirely adequate at 52 Hz.

The interrupt pins are available for a future firmware version. If the masthead velocity compensation algorithm turns out to require precise, interrupt-driven sample timing for accurate integration, INT1 would need to be routed to a spare ESP32 GPIO. This would require a PCB change — see Gaps & next version.

---

### Performance review

**Power consumption and thermal analysis**

The LSM6DSLTR draws approximately 0.4 mA from VCC in normal operating mode with both accelerometer and gyroscope active. At 3.3 V, this is a power dissipation of only 1.3 mW — comparable to a dim indicator LED. Even in high-performance mode, dissipation reaches just 2.15 mW. The thermal resistance of the LGA-14 package on a PCB is approximately 180 °C/W, giving a junction temperature rise of less than 0.4 °C above ambient. No thermal management is required.

**Supply decoupling compliance**

ST application note AN5040 recommends:
- A 1 µF bulk capacitor within 5–10 mm of the VDD pin
- A 100 nF HF bypass capacitor within 2 mm of the VDD pin
- A 100 nF HF bypass capacitor within 2 mm of the VDDIO pin

The V1.2 layout meets all three requirements. C5 (1 µF) is within 1.2 mm of VDD; C6 (100 nF) is directly adjacent; C12 (100 nF) is within 1.2 mm of VDDIO. All three are at the courtyard-constrained minimum distance — no closer placement is geometrically achievable with the 2.5 × 3.0 mm LGA-14 package.

**Key parameters**

| Parameter | Value | Notes |
|-----------|-------|-------|
| Supply voltage — VDD | 3.3 V | Rated 1.71–3.6 V ✓ |
| Supply voltage — VDDIO | 3.3 V | Rated 1.62–3.6 V ✓ |
| Supply current (normal mode, both axes) | 0.4 mA | — |
| Power dissipation (normal mode) | 1.3 mW | P = 0.4 mA × 3.3 V |
| Junction temperature rise at 85 °C ambient | < 0.4 °C | θ_JA ≈ 180 °C/W |
| I2C slave address | 0x6A | SA0 tied to GND |
| I2C clock — Standard Mode | 100 kHz | Confirmed working |
| I2C clock — Fast Mode | 400 kHz | Supported; pull-ups may need reduction |
| Recommended ODR for WTI400 | 52 Hz | Nyquist margin for 5 Hz wave heave |
| Operating temperature range | −40 °C to +85 °C | Full margin over marine range |

<details>
<summary>Accelerometer and gyroscope selectable ranges</summary>

**Accelerometer** (configured via CTRL1_XL register):

| Range | Sensitivity |
|-------|-------------|
| ±2 g | 0.061 mg/LSB |
| ±4 g | 0.122 mg/LSB |
| ±8 g | 0.244 mg/LSB |
| ±16 g | 0.488 mg/LSB |

Recommended for WTI400: ±4 g at 52 Hz (covers typical vessel motion; surge and heave rarely exceed ±2 g).

**Gyroscope** (configured via CTRL2_G register):

| Range | Sensitivity |
|-------|-------------|
| ±125 dps | 4.375 mdps/LSB |
| ±245 dps | 8.75 mdps/LSB |
| ±500 dps | 17.5 mdps/LSB |
| ±1000 dps | 35 mdps/LSB |
| ±2000 dps | 70 mdps/LSB |

Recommended for WTI400: ±500 dps at 52 Hz (covers typical roll/pitch rates; values above ±50 dps are unusual in normal sailing conditions).

</details>

---

### Bring-up tests

1. **I2C device detection**: Scan the I2C bus. U1 must respond at address 0x6A — pass if the `WHO_AM_I` register (address 0x0F) returns `0x6A`.
2. **Register round-trip**: Write a known value to a writable register (e.g. CTRL1_XL at 0x10) and read it back — pass if the read value matches what was written.
3. **Live data output**: Configure accelerometer and gyroscope at 52 Hz, read 10 consecutive samples — pass if all six axes produce non-zero readings, with the accelerometer Z axis showing approximately ±1 g at rest (direction depends on board orientation).
4. **VDD supply ripple**: Measure VDD at U1 pin 8 with a 100 MHz oscilloscope under normal I2C polling load — pass if ripple is less than 50 mV peak-to-peak.
5. **Fast Mode I2C** *(if firmware is upgraded to 400 kHz)*: Verify stable communication at 400 kHz — pass if no I2C NACK errors occur over 1000 consecutive transactions. If failures occur, reduce the pull-up resistors R3/R4 from 10 kΩ to 4.7 kΩ on the `esp32_module` sheet.

---

### Gaps & next version

**Next version**

- **ODR adequacy for velocity algorithm**: The 52 Hz ODR was selected for a Nyquist margin on 5 Hz wave heave. Once the masthead velocity compensation algorithm is designed, verify that 52 Hz provides sufficient temporal resolution for accurate integration over the intended rolling time window. The LSM6DSLTR supports ODR up to 6664 Hz; increasing the rate requires only a firmware register change — no hardware revision needed.
- **Interrupt routing for algorithm timing**: INT1 and INT2 are currently unconnected. If the compensation algorithm requires precise interrupt-driven sample timing (rather than polled I2C), route INT1 to a spare ESP32 GPIO in the next PCB revision. This is a track-and-pin-assignment change only.

---

## PCB Design and Assembly

The LSM6DSLTR is a MEMS device — *microelectromechanical systems*. Inside the small 2.5 × 3.0 mm LGA-14 package are actual moving mechanical structures: tiny proof masses suspended on microfabricated springs, whose displacement is measured electrically to determine acceleration and angular rate. These internal structures make MEMS sensors fundamentally different from conventional ICs, and they require extra care during both PCB design and assembly.

### Why MEMS devices need special treatment

The moveable internal structures of a MEMS sensor are sensitive to mechanical stress. When any IC is soldered to a PCB, the solder joints cool and contract. The PCB, the solder, and the IC package all have different thermal expansion coefficients, so they pull against each other as they cool. In an ordinary IC this creates no functional problem. In a MEMS sensor, even tiny deformations of the package are transmitted to the sensor die and to the proof masses inside — causing them to shift away from their zero-reference position.

The result is **thermomechanical offset drift**: the sensor reports a non-zero reading even when the board is completely stationary. ST TN0018 §5.1 describes the full chain:

1. The PCB flexes slightly as solder cools after reflow
2. This bends the sensor package
3. The sensor die substrate warps
4. The internal proof masses shift relative to their electrodes
5. The measured capacitance changes
6. The sensor output drifts from its true zero

If the solder joints are uneven — for example because the PCB land pattern or solder mask openings deviate from the recommended dimensions — the stress is applied asymmetrically to the package. Asymmetric stress makes offset drift worse and less predictable.

**This is precisely what happened with V1.1.** The land pattern and solder mask openings were not strictly to the ST TN0018 specification, resulting in inconsistent solder joint geometry, elevated thermomechanical stress, and unreliable sensor readings. V1.2 was redesigned to follow TN0018 rigorously.

### How V1.2 follows ST TN0018

The following measures are implemented in the V1.2 PCB. Each one follows a specific TN0018 recommendation.

**Land pattern and solder mask opening (TN0018 §3.7)**

For LGA pad spacing greater than 200 µm (which applies to the LSM6DSLTR's 0.5 mm pitch):
- Each PCB copper land is sized at LGA solder pad dimensions + 0.1 mm in both length and width. All lands are the same size.
- The solder mask opening is 0.1 mm larger than the copper land on each side — placing the mask opening *outside* the land boundary.

Placing the solder mask opening outside the land is important. It ensures that the solder mask layer does not overlap the component pads, which would reduce the solder volume on those pads. More importantly, it prevents the solder mask from mechanically touching the device package body during and after reflow, which would add an additional stress path.

**No routing or vias under U1 on the top copper layer (TN0018 §3.9)**

TN0018 §3.9 explicitly states that no routing and no vias should be placed on the top copper layer (the component side) underneath a MEMS device. The WTI400 V1.2 enforces this with a copper-pour keepout zone on F.Cu surrounding U1. KiCAD's design rule check (DRC) will flag any trace or via placed within this zone during design.

The physical reason: routing or vias on the top side under the IC would create uneven copper distribution under the package, causing uneven heat flow during reflow and uneven mechanical coupling of PCB stress into the package.

**Bottom-side power planes and signal routing are permitted (TN0018 §3.10)**

TN0018 §3.10 allows power planes and signal routing on the bottom side of the PCB under the sensor. On the WTI400, the In1.Cu inner layer carries a continuous GNDREF copper plane under U1. This is both permitted and required: it provides the low-inductance ground return path for the decoupling capacitors and ensures a stable reference for the sensor's analog core.

**Both GND pins must be fully soldered (TN0018 §3.11)**

TN0018 §3.11 documents a real field case in which pins 6 and 7 of an LGA-14 MEMS sensor were not properly soldered. The result was measurable zero-g and zero-rate offset shifts caused by mechanical stress on the inner sensor structures. Both pins are ground (GNDREF) on the LSM6DSLTR, and both are fully exposed copper pads on the V1.2 layout — they are soldered in the normal reflow process along with all other pads.

**Component placed away from heat sources and mechanical stress points (TN0018 §3.1, §3.12)**

TN0018 §3.1 advises avoiding placement near components that generate significant heat, because a thermal gradient across the MEMS package causes additional offset drift. U1 is placed approximately 50 mm from the nearest switching power supply cell on the board. TN0018 §3.12 notes a maximum board strain limit of 1000 µstrain near the sensor; U1 is kept well away from screw holes, connectors, and board edges, all of which are sources of mechanical board strain.

**Symmetric pad connections (TN0018 §3.2, §3.8)**

TN0018 §3.8 states that connecting traces should be designed symmetrically, and that the ground plane should not connect directly to footprint pads — it should connect via a standard trace. The V1.2 footprint follows this: the GNDREF pins connect to the ground plane through defined traces rather than direct plane contact, and pad connections are routed symmetrically where the geometry allows.

### Stencil, solder paste, and reflow

TN0018 §3.3 recommends a stainless steel stencil with a thickness of 90–150 µm. The stencil aperture openings should be 70–90% of the PCB pad area. This controls the solder paste volume per pad and promotes a uniform paste height, which directly affects how evenly the solder joints cool — and therefore how evenly the thermomechanical stress is distributed across the package.

TN0018 §3.4 specifies a maximum cool-down ramp rate of −3 °C/s. Cooling faster than this increases residual stress in the solder joints. A typical compliant reflow profile peaks at 235–255 °C, with a soaking zone of 60–90 seconds and a reflow zone of 60–75 seconds above 217 °C (see TN0018 Figure 20).

:::caution[Do not use ultrasonic cleaning after assembly]
TN0018 §3.13 states that ultrasonic baths can damage MEMS internal structures if the bath energy matches a resonant frequency of the sensor. Flux residue should be removed using a non-ultrasonic cleaning process or a self-cleaning (no-clean) solder paste.
:::

### Board axis orientation and default mounting

The PCB silkscreen carries an axis diagram identifying the sensor coordinate frame:

- **X, Y, Z** — the three linear axes of the accelerometer and gyroscope
- **P (pitch)** — rotation around the X axis
- **R (roll)** — rotation around the Y axis
- **Y (yaw)** — rotation around the Z axis

U1 is mounted at 0° rotation on the board, so the sensor axes are aligned with the silkscreen labels.

The **default installation orientation** is vertical mounting on a transverse bulkhead — the board stands upright, fixed to a surface that faces forward or aft in the vessel. The firmware's default calibration is referenced to this orientation. If the WTI400 is installed at a different angle, the firmware orientation offset must be configured accordingly. The firmware will document the supported orientations and the configuration procedure.

---

## Components

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| U1 | LSM6DSLTR | 6-axis MEMS IMU — 3-axis accelerometer + 3-axis gyroscope, LGA-14 (2.5 × 3.0 mm) | [LSM6DSL datasheet](https://www.st.com/resource/en/datasheet/lsm6dsl.pdf) |
| C5 | 1 µF / 25 V / 0603 | VDD bulk decoupling capacitor | — |
| C6 | 100 nF / 50 V / 0603 | VDD high-frequency bypass capacitor | — |
| C12 | 100 nF / 50 V / 0603 | VDDIO high-frequency bypass capacitor | — |

---

## References

1. ST Microelectronics, [*LSM6DSL iNEMO Inertial Module Datasheet*](https://www.st.com/resource/en/datasheet/lsm6dsl.pdf)
2. ST Microelectronics, [*AN5040 — LSM6DSL Always-On 3D Accelerometer and 3D Gyroscope*](https://www.st.com/resource/en/application_note/an5040-lsm6dsl-alwayson-3d-accelerometer-and-3d-gyroscope-stmicroelectronics.pdf)
3. ST Microelectronics, *TN0018 — Handling, mounting, and soldering guidelines for MEMS devices* (Rev 8, March 2025) — copy at `WTI400/research/MEMS_PCB_design_guidelines.pdf`
