---
title: Temperature Sensor
hw_version: v3.0
hw_status: schematic
hw_status_label: "In design — V3.0 schematic capture in progress"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/i2c_sensors_0e420ae8.svg" alt="TMP112 temperature sensor — full sheet" />

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype, bench-test phase. The TMP112 has been bench-tested on this prototype: I²C addressing and 12-bit temperature readout are functional. Long-duration thermal-soak measurements (solar load, enclosed-housing hot-soak) and firmware-side thermal protection logic remain as bring-up items.

:::

## Overview

This page documents the TMP112 temperature sensor on the `i2c_sensors` KiCad sheet — a ±0.5 °C digital temperature sensor whose readings drive the firmware's thermal protection and display-derating logic.

- **Temperature Sensor (U13 — TMP112)** — a 12-bit I²C digital temperature sensor at address 0x48, mounted on B.Cu adjacent to the back of the DWIN display panel.

The I²C bus pull-ups (R1 on SCL; R2 ∥ R3 on SDA) are documented on the [ESP32 Module](./esp32-module#i2c-bus-pull-ups) page.

The TMP112 is at I²C address **0x48**.

## Functional specification and design objectives

- Sense PCB and display-stack temperature with enough accuracy to drive firmware-side thermal protection: alert thresholds, display brightness derating, and graceful shutdown.
- Place the sensor where its reading reflects the temperatures that matter — adjacent to the back of the DWIN display panel, so the reading tracks both PCB ambient and the display's own self-heating under sustained backlight.
- Run on the shared 3.3 V I²C bus (Standard Mode, 100 kHz) at a distinct address so the firmware can poll it independently of the other sensors.
- Expose an ALERT line for future interrupt-driven thresholds, even though the V2.9 firmware polls rather than uses ALERT.

## Temperature Sensor

<SchematicViewer src="/img/schematics/mdd400-v2.9/i2c_sensors_0e420ae8.svg" alt="TMP112 temperature sensor sub-circuit — U13 (TI TMP112AIDRLR), R62 (ALERT open-drain pull-up to VCC), and C57 (100 pF V_CC HF bypass; V2.10 backlog item is to add a 100 nF cap in parallel per the datasheet). Zoom out to see the full sheet." initialFocus="19.05 101.6 133.35 85.09" />

### How it works

**U13 — TI TMP112AIDRLR** is a 12-bit digital temperature sensor in SOT-563 (2.0 × 1.25 mm). It produces 0.0625 °C / LSB readings over a −40 °C to +125 °C range with ±0.5 °C accuracy from −25 °C to +85 °C. The sensor exposes both a temperature register and a configurable ALERT comparator output.

#### Mounting and thermal coupling

U13 is placed on **B.Cu** immediately adjacent to the back of the DWIN display panel. This placement means the TMP112 reading is influenced by:

- **PCB ambient** — the temperature of the board itself, which couples in solar load, internal self-heating from the ESP32 / SMPS / display power switch, and ambient-air heat ingress through the housing.
- **Display back-surface temperature** — the DWIN panel's back can reach significantly higher temperatures than the surrounding PCB during sustained high-backlight operation, particularly under direct sunlight on a helm console.

The single sensor therefore monitors both the *board* and the *display* thermal envelopes with one reading. Firmware uses the reading for two distinct protections (see *Firmware notes* below).

#### ALERT output

The TMP112 ALERT pin is open-drain and is pulled up to VCC through R62 (10 kΩ). The pin can be configured (via the CONFIG register) to assert when temperature crosses programmable high or low thresholds — usable for an interrupt-driven thermal protection scheme. **V2.9 firmware polls the TMP112 rather than using ALERT** — the temperature variable is slow-moving enough that polling at a ~1 Hz rate is more than sufficient for the protection thresholds in play. The pull-up keeps ALERT in a defined state and lets a future firmware revision opt into interrupt-driven mode without a hardware change.

#### Local supply decoupling

C57 (100 pF C0G) sits adjacent to U13's V<sub>CC</sub> pin. The TMP112 datasheet **recommends a 100 nF X7R cap** as the primary local bypass; the V2.9 board has only the 100 pF C0G. At the TMP112's ~50 µA idle current the under-spec is unlikely to cause observable problems, but it's a V2.10 backlog item to add a 100 nF cap at the same B.Cu location.

### Performance

| Parameter | Value | Notes |
|-----------|-------|-------|
| I²C address | 0x48 | Configured by ADD0 pin tie-off |
| Temperature range | −40 to +125 °C | Per TMP112 datasheet |
| Accuracy | ±0.5 °C (−25 to +85 °C) | Per TMP112 datasheet |
| Resolution | 12-bit, 0.0625 °C / LSB | Per TMP112 datasheet |
| Package | SOT-563 | 2.0 × 1.25 mm |
| Supply current | 50 µA active, 1 µA shutdown | VCC = 3.3 V |
| Mounting | B.Cu, adjacent to back of DWIN display panel | Couples both PCB ambient + display back-surface heat |
| ALERT pin | Open-drain, pulled to VCC via R62 = 10 kΩ | Unused in V2.9 firmware (polled mode); ready for V2.10 firmware if interrupt-driven mode is wanted |
| V<sub>CC</sub> bypass | C57 = 100 pF C0G, ~2.6 mm from V<sub>CC</sub> | **Under-spec per datasheet — V2.10 backlog item to add 100 nF X7R in parallel** |

## Firmware notes

The TMP112 reading is the input to two distinct **thermal protection** behaviours in the MDD400 firmware:

1. **Operator alerts.** When PCB / display temperature crosses a configured threshold, the firmware raises an on-screen alert on the DWIN display (via DGUS II command — see the [Display Interface](./display-interface) page). The marine operator can take corrective action (e.g. shade the helm, reduce display brightness manually).
2. **Display brightness derating.** Above a second threshold, the firmware automatically dims the display brightness to reduce the display's own thermal contribution. This is independent of the ALS-driven brightness loop — the *minimum* of the ALS-recommended and the thermally-permitted brightness wins.
3. **Graceful shutdown.** Above a third (highest) threshold, the firmware powers the display off via the DISP_EN line (see [Display Interface](./display-interface)) and enters a low-power mode, leaving only the LED status indicator and the CAN/NMEA path active. The firmware emits a final NMEA 2000 status message before entering the shutdown state.

**Polling rate.** A 1 Hz poll is sufficient — temperature moves slowly in marine enclosures even under solar load. Higher rates waste I²C bus time without giving useful resolution on the protection responses.

**Threshold tuning.** The three thresholds (alert / derate / shutdown) are firmware constants but should be tuned against the long-duration helm-position soak data from the bring-up tests below.

## PCB Layout

U13 sits in the sensor cluster on B.Cu at approximately (129.0, 65.0), with its local decoupling and pull-up tightly co-located within ~2.5 mm.

- **Thermal placement.** U13 is mounted on B.Cu immediately adjacent to the rear surface of the DWIN display panel, minimising thermal resistance between the display area and the sensor package so the reading tracks both PCB ambient and display self-heating.
- **Decoupling.** C57 (100 pF) is placed immediately adjacent to U13's VCC pin (Pin 6) — centre-to-centre ~2.6 mm, on the same layer. The 100 pF is under the TMP112 datasheet's 100 nF guideline; adding the 100 nF in parallel at this location is a V2.10 item.
- **ALERT pull-up.** R62 (10 kΩ) is placed on B.Cu immediately adjacent to U13's ALERT pin (Pin 2), centre-to-centre ~2.0 mm, keeping the open-drain trace short.
- **Ground.** U13's GND pad connects to the GNDREF plane through vias in the B.Cu copper zone. No isolation boundary exists in V2.9 — GNDREF is continuous from the sensor to the ESP32 and the CAN transceiver domain.

## Components

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| U13 | TMP112AIDRLR | TI ±0.5 °C digital temperature sensor, SOT-563, I²C address 0x48 | [TI TMP112 (SBOS473)](https://www.ti.com/lit/ds/symlink/tmp112.pdf) |
| R62 | 10 kΩ 0603 ±1 % | TMP112 ALERT open-drain pull-up to VCC | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C57 | 100 pF / 50 V C0G 0603 | TMP112 V<sub>CC</sub> HF bypass. **Under-spec per datasheet** — V2.10 adds 100 nF X7R in parallel | [Murata GRM1885C1H101JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D) |

The I²C bus pull-ups (R1, R2, R3) are listed in the [ESP32 Module](./esp32-module) Components table.

## Testing & Verification

:::caution

V2.9 is a fabricated prototype in the bench-test phase. The TMP112 acknowledges on the I²C bus and produces plausible temperature readings on the prototype. **Long-duration soak measurements and firmware-side thermal protection logic remain to be exercised.** The following are required.

**Hardware bring-up (rig at the bench):**

- **I²C addressing** — Issue a read of the CONFIG register at address 0x48. Pass if the TMP112 acknowledges and returns the expected default CONFIG value (0x60A0).
- **Room-temperature reading accuracy** — Read the temperature register at known room ambient. Pass if reading is within ±2 °C of a reference instrument co-located with the sensor (allows for self-heating offset and reference accuracy).
- **Hot-soak response** — Apply localised heat (heat gun at low setting, brief application) to the back of the DWIN display panel. Pass if the TMP112 reading rises within seconds and tracks the heat application.
- **Long-duration helm-position soak** — Mount the assembled MDD400 in a representative sun-loaded helm position for several hours; log the TMP112 reading at 1 Hz. Pass if peak temperature stays below the firmware *alert* threshold under expected operating conditions, and use the data to tune the three firmware thresholds (alert / derate / shutdown).
- **ALERT pin reachability** *(optional, for future firmware)* — Configure ALERT thresholds well below ambient. Pass if R62 holds ALERT high at idle and the open-drain output pulls cleanly to GNDREF when the threshold is crossed.

:::

## Gaps & next version

**Before next production run**

- **Long-duration thermal-soak validation** — Field-soak data (sun-loaded helm position, enclosed-housing hot-soak) has not yet been captured. Required to tune and confirm the alert / derate / shutdown thresholds before committing to a production run.

**Next version (V2.10)**

- **Add 100 nF X7R bypass on TMP112 V<sub>CC</sub>** — Add a 100 nF X7R cap in parallel with C57 (100 pF) at the same B.Cu location. TMP112 datasheet §9.2 recommends 100 nF minimum; the V2.9 100 pF C0G is below this guideline. At the TMP112's ~50 µA idle current the risk is low, but the 100 nF would follow the datasheet and reduce susceptibility to supply glitches during I²C transactions.

## References

- Texas Instruments, [*TMP112 High-Accuracy, Low-Power Digital Temperature Sensor (SBOS473)*](https://www.ti.com/lit/ds/symlink/tmp112.pdf).
- Yageo, [*RC Group Chip Resistor*](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf).
- Murata, [*GRM1885C1H101JA01D — 100 pF C0G 0603*](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D).
- NXP Semiconductors, [*I²C-bus specification and user manual (UM10204)*](https://www.nxp.com/docs/en/user-guide/UM10204.pdf).

## Related pages

- [ESP32-S3 Module](./esp32-module.md) — host MCU and the shared I²C bus pull-ups (R1 / R2 / R3)
- [Ambient Light Sensor](./ambient-light-sensor.md) — the other I²C sensor on the same `i2c_sensors` sheet
- [Display Interface](./display-interface.md) — firmware-side brightness derating and DISP_EN graceful-shutdown handling
- [Pin Assignments](/mdd400/v2.9/quick-reference/pin-assignments) — I²C GPIO assignments for the sensor bus
