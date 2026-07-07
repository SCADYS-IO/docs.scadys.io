---
title: Power Monitor
hw_version: v3.0
hw_status: schematic
hw_status_label: "In design — V3.0 schematic capture in progress"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/i2c_sensors_0e420ae8.svg" alt="INA219 power monitor — full sheet" />

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype, bench-test phase. The INA219 has been bench-tested on this prototype: I²C addressing, current reading, and bus-voltage reading are all functional. Quantitative accuracy checks against a reference instrument and the final firmware PGA selection are open bring-up items.

:::

## Overview

This page documents the INA219 power monitor on `i2c_sensors.kicad_sch` — a high-side current and bus-voltage measurement IC that lets the firmware read the MDD400's NMEA 2000 bus supply current and voltage. The I²C bus pull-ups (R1 on SCL; R2 ∥ R3 on SDA) are documented on the [ESP32 Module](./esp32-module#i2c-bus-pull-ups) page.

This page covers a single sub-circuit:

- **Power Monitor** — the INA219 (U2) at I²C address **0x40** and its 330 mΩ shunt (R33), drawn on the `i2c_sensors` KiCad sheet.

## Functional specification and design objectives

- Continuously measure the MDD400's input supply current and bus voltage from the NMEA 2000 connection, with enough resolution and update rate to drive a *Power* page on the DWIN display and to raise low- / high-voltage alerts.
- Place the current-sense shunt where it sees only the regulated, OVP-protected supply (not the raw N2K cable input), so the INA219 is never exposed to N2K transients above its 26 V VS absolute maximum.
- Keep the shunt low enough that its voltage drop is negligible compared to the bus regulation, and small enough that the INA219's full-scale current range matches the actual peak load.
- Run on the shared 3.3 V I²C bus (Standard Mode, 100 kHz) at a distinct address so the firmware can poll it independently of the other sensors.

## Power Monitor

<SchematicViewer src="/img/schematics/mdd400-v2.9/i2c_sensors_0e420ae8.svg" alt="INA219 power monitor sub-circuit — U2 (TI INA219AIDCNR), R33 (Yageo 330 mΩ precision thick-film shunt, located in the power supply section), C8 (1 µF VCC bulk bypass), and C11 (100 nF VCC HF bypass)." initialFocus="152.4 12.7 130.81 88.9" />

### How it works

**U2 — TI INA219AIDCNR** is a high-side current / power monitor in SOT-23-8 with an integrated 12-bit ADC, a programmable-gain front-end on the differential shunt input, and an I²C interface. The shunt (R33, 330 mΩ, Yageo PT0603FR-070R33L thick-film precision resistor, ±1 %, 10 ppm/°C) is placed in series with the high-side supply rail **downstream of the OVP MOSFET** on the `can_bus_power.kicad_sch` sheet — so the INA219 never sees a supply above the ~19 V OVP cutoff, well within its 26 V V<sub>S</sub> absolute maximum.

The INA219's differential shunt input measures the V<sub>R33</sub> drop directly. With a 10 µV / LSB shunt-register resolution and the 330 mΩ shunt value:

- Current LSB = 10 µV / 0.33 Ω ≈ **30 µA**
- Full-scale current at PGA /4 (±160 mV FSR): 160 mV / 0.33 Ω ≈ **485 mA**
- Full-scale current at PGA /2 (±80 mV FSR): 80 mV / 0.33 Ω ≈ **242 mA**

At PGA /4 the INA219 measures up to ~485 mA — a comfortable margin above the MDD400's expected peak load (~250 mA at Wi-Fi TX + display backlight). At PGA /2 the same load would clip at ~242 mA, leaving no margin — so the firmware **must** configure PGA /4 (CONFIG register PG1:PG0 = 0b10) before reading.

**Bus voltage measurement.** The INA219's V<sub>BUS</sub> pin samples the same node that the shunt's high-side is tied to (i.e. the post-OVP, post-protection supply rail). At its 4 mV / LSB resolution, this reads the regulated input bus voltage with sub-percent precision — adequate for both the firmware's low/high-voltage alerting and the on-display *Power* page indication.

**Local supply decoupling.** C8 (1 µF X7R) and C11 (100 nF X7R) sit on the INA219's V<sub>CC</sub> (the 3.3 V digital supply, separate from the V<sub>S</sub> shunt-high-side pin). Standard two-tier decoupling: C11 for HF, C8 for bulk.

**Shunt placement note.** R33 is physically located ~60 mm away from U2 in the can_bus_power section of the board. The differential IN+ / IN− sense traces run that 60 mm distance. For V2.9 this is acceptable (single-frequency DC measurement; INA219's input is high-impedance and the differential reading rejects common-mode noise), but a V2.10 layout pass could shorten the sense paths by moving U2 closer to R33 or routing the sense pair on an inner layer away from SMPS switching activity — see the V2.10 backlog.

### Performance

| Parameter | Value | Notes |
|-----------|-------|-------|
| I²C address | 0x40 | Configured by A0 / A1 pin tie-offs at U2 |
| Shunt-voltage LSB | 10 µV | Fixed per INA219 datasheet |
| Current LSB at R33 = 330 mΩ | ~30 µA | 10 µV / 0.33 Ω |
| Full-scale current at PGA /4 (±160 mV) | 485 mA | 160 mV / 0.33 Ω — used by firmware |
| Full-scale current at PGA /2 (±80 mV) | 242 mA | Insufficient for the MDD400 peak — **don't use** |
| Bus-voltage LSB | 4 mV | Fixed per INA219 datasheet |
| V<sub>S</sub> abs-max | 26 V | Protected by upstream OVP (~19 V cutoff) |
| R33 voltage drop at 250 mA | 82.5 mV | 0.33 Ω × 0.25 A — negligible vs bus regulation |
| R33 self-heating at 250 mA | 20.6 mW | 0.0625 × 0.33 W — within 0603 100 mW rating (79 % margin) |
| Sense-pair length, R33 → U2 | ~60 mm | Acceptable for V2.9; V2.10 backlog item |

## Firmware notes

The INA219 underpins the **NMEA 2000 bus power monitoring** feature in the MDD400 firmware:

1. The firmware polls the INA219 at a low rate (1 Hz is fine — the bus voltage and current are slow-moving variables in normal operation).
2. Bus current and bus voltage are presented on a dedicated **Power** page on the DWIN display (via DGUS II variable writes — see the [Display Interface](./display-interface) page).
3. Firmware raises **low-voltage** and **high-voltage** alerts when bus voltage falls below or rises above configured thresholds. Low-voltage indicates either upstream cable trouble or a deep-discharge battery; high-voltage indicates a charging system fault (alternator over-voltage, etc.).
4. **Always configure PGA /4** before the first measurement read — the default at reset is PGA /1, which would clip far below the 250 mA peak load. The CONFIG register write must precede the first useful read.

## PCB Layout

The INA219 (U2) and its local decoupling sit in the sensor cluster on F.Cu, while the 330 mΩ shunt R33 is an outlier ~60 mm away in the can_bus_power section of the board — so the differential IN+ / IN− sense pair runs that full distance between the two regions.

- **Decoupling.** C11 (100 nF) is placed immediately adjacent to U2's VS/VCC pin (~3.6 mm centre-to-centre) per the INA219 datasheet, with C8 (1 µF bulk) downstream in the VCC rail at ~3.4 mm — at the 3 mm guideline.
- **Shunt sense routing.** The IN+ / IN− pair should tap the inner pad edges of R33 (Kelvin connection) and run as an equal-length, tight parallel pair on the same layer. On V2.9 the ~60 mm run is user-verified as acceptable for the DC measurement, but inner-pad-edge Kelvin connection and trace length/layer equality are not confirmed from footprint data — Gerber review is recommended.
- **Noise isolation.** The ~60 mm sense pair crosses board regions carrying SMPS and CAN activity; it should be routed away from the LMR51610 switching node, SMPS ground-return currents, CAN bus traces, and via stitching rows to protect the differential measurement.
- **Ground.** All I²C sensor grounds connect to a continuous GNDREF — there is no isolation boundary in V2.9 (the ISO1541 was removed); GNDREF is continuous from the sensors through to the ESP32 and CAN transceiver domain.

## Components

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| U2 | INA219AIDCNR | TI bidirectional current / power monitor, SOT-23-8, I²C address 0x40 | [TI INA219 (SBOS448)](https://www.ti.com/lit/ds/symlink/ina219.pdf) |
| R33 | 330 mΩ 0603 | Yageo PT0603FR-070R33L precision thick-film shunt, ±1 %, 10 ppm/°C. Located on `can_bus_power.kicad_sch` in series with the post-OVP supply rail | [Yageo PT0603FR-070R33L](https://www.yageo.com/en/Product-Line/Resistors/Chip-Resistors/Thick-Film/PT/PT0603FR-070R33L) |
| C8 | 1 µF / 25 V X7R 0603 | INA219 V<sub>CC</sub> bulk bypass | [Murata GCM188R71E105KA64D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71E105KA64D) |
| C11 | 100 nF / 50 V X7R 0603 | INA219 V<sub>CC</sub> high-frequency bypass | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |

The I²C bus pull-ups (R1, R2, R3) are listed in the [ESP32 Module](./esp32-module) Components table.

## Testing & Verification

:::caution

V2.9 is a fabricated prototype in the bench-test phase. The INA219 acknowledges on the I²C bus and returns plausible current / bus-voltage readings on the prototype. **No quantitative accuracy or drift measurements have been performed yet.** The following are required.

**Hardware bring-up (rig at the bench):**

- **I²C addressing** — Issue a `read manufacturer ID` to address 0x40. Pass if the INA219 acknowledges and returns the expected manufacturer ID.
- **PGA configuration** — Read back the CONFIG register after firmware initialisation. Pass if PG1:PG0 = 0b10 (PGA /4, ±160 mV FSR).
- **Calibrated current accuracy** — At a known load (e.g. 100 mA / 200 mA / 400 mA drawn through a bench-confirmed resistive load), read the INA219 current register and compare against a reference instrument. Pass if within ±1 % at full-scale (~485 mA) and within ±5 % at 10 % full-scale.
- **Bus voltage accuracy** — Compare the INA219 bus-voltage register against a calibrated DMM on the post-OVP rail. Pass if within ±1 %.
- **Shunt self-heating drift** — Hold the load at the expected peak (250 mA) for 30 minutes and record any drift in the indicated current. Pass if drift &lt; ±0.5 % over the test period.

:::

## Gaps & next version

**Before next production run**

- **R33 Kelvin connection** — Verify in Gerber review that IN+ / IN− tap from the *inner* edges of R33's pads (not from a downstream point), so the sense voltage is exactly V<sub>R33</sub> rather than V<sub>R33</sub> + trace drop, and that the pair is equal-length on the same layer.
- **Sense-pair noise exposure** — The ~60 mm IN+ / IN− pair crosses board regions with SMPS and CAN activity. Inspect the route to confirm it is isolated from the LMR51610 switching node and SMPS ground-return currents.

**Next version (V2.10)**

- **Shorten sense-pair routing** — The IN+ / IN− pair currently runs ~60 mm from R33 (in the CAN bus-power section) to U2 (in the sensor cluster). Move U2 closer to R33 or route the sense pair on an inner layer away from SMPS switching activity to tighten common-mode rejection.

## References

- Texas Instruments, [*INA219 Zerø-Drift, Bidirectional Current/Power Monitor With I²C Interface (SBOS448)*](https://www.ti.com/lit/ds/symlink/ina219.pdf).
- Yageo, [*PT0603FR-070R33L Precision Thick Film Chip Resistor*](https://www.yageo.com/en/Product-Line/Resistors/Chip-Resistors/Thick-Film/PT/PT0603FR-070R33L).
- Murata, [*GCM188R71E105KA64D — 1 µF X7R 0603*](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71E105KA64D).
- Murata, [*GRM188R71H104KA93D — 100 nF X7R 0603*](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D).
- NXP Semiconductors, [*I²C-bus specification and user manual (UM10204)*](https://www.nxp.com/docs/en/user-guide/UM10204.pdf).

## Related pages

- [CAN Bus Power](./can-bus-power.md) — upstream OVP and the post-OVP supply rail that R33 is in series with
- [ESP32 Module](./esp32-module.md) — host MCU and the I²C bus pull-ups (R1 / R2 / R3) that this sensor shares
- [Display Interface](./display-interface.md) — the Power page on the DWIN display is fed by INA219 readings
- [Pin Assignments](/mdd400/v2.9/quick-reference/pin-assignments) — I²C bus GPIO assignments for the sensor bus
