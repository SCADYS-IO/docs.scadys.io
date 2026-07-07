---
title: Ambient Light Sensor
hw_version: v3.0
hw_status: schematic
hw_status_label: "In design — V3.0 schematic capture in progress"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/i2c_sensors_0e420ae8.svg" alt="I²C sensors — full sheet" />

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype, bench-test phase. The OPT3004 has been bench-tested on this prototype using hardware test routines: I²C addressing, lux readout, and auto-ranging are functional. The V2.9 housing has a new aperture / lens window relative to the previous hardware revision, so the ALS-reading → display brightness lookup table — currently in the **MDD400 V1.0** PlatformIO/Arduino predecessor firmware and earmarked for migration into the planned V2.9 production ESP-IDF firmware — will need to be re-fitted on V2.9 hardware before deployment. See the [Display Interface](./display-interface) page for the firmware-side brightness control loop.

:::

## Overview

This page documents the OPT3004 ambient light sensor on `i2c_sensors.kicad_sch` — a digital lux sensor whose readings drive the firmware's automatic display-brightness loop. The I²C bus pull-ups (R1 on SCL; R2 ∥ R3 on SDA) are documented on the [ESP32 Module](./esp32-module#i2c-bus-pull-ups) page.

- **Ambient Light Sensor** — OPT3004 (U12) at I²C address **0x44**, drawn on the `i2c_sensors` KiCad sheet.

## Functional specification and design objectives

- Sense ambient light at the front face of the MDD400 housing, with a spectral response close to the human eye so that the measured value relates directly to perceived display brightness.
- Cover the full outdoor-to-night range a marine helm encounters (direct tropical sunlight at one extreme, near-total darkness on a moonless night helm watch at the other) without saturation or precision loss at either end.
- Output via I²C so no ESP32 ADC channel is consumed, freeing those channels for other measurements if needed in future.
- Run on the shared 3.3 V I²C bus (Standard Mode, 100 kHz) at a distinct address so the firmware can poll it independently of the other sensors.

## Ambient Light Sensor

<SchematicViewer src="/img/schematics/mdd400-v2.9/i2c_sensors_0e420ae8.svg" alt="OPT3004 ambient light sensor sub-circuit — U12 (TI OPT3004DNPR), C56 (100 nF V_DD bypass), and the open-drain INT pin connected (without ESP32 GPIO routing in V2.9 — firmware polls rather than interrupts)." initialFocus="19.05 12.7 133.35 88.9" />

The OPT3004 is at I²C address **0x44**.

### How it works

**U12 — TI OPT3004DNPR** is a 16-bit digital ambient light sensor in WSON-6 (with an exposed thermal pad on the underside). It combines a photodiode, transimpedance front-end, ADC, and I²C interface in a single 2.0 × 2.0 mm package. The output range is **0.01 to 83,000 lux** in auto-range mode, with the high dynamic range achieved by a floating-point-like exponent/mantissa register format that the firmware decodes back to a linear lux value.

**Spectral response.** The OPT3004's spectral response is photopic — it matches the human eye's sensitivity curve, peaking at ~555 nm (yellow-green) and rolling off into both blue and red. This means a reading of *X* lux corresponds to *X* lux of perceived brightness, regardless of the spectral content of the ambient light (sunlight, incandescent, LED, sodium-lamp helm lighting, moonlight). The brightness lookup table in firmware can therefore be tuned once and stay valid across illumination types.

**Auto-range mode.** Firmware writes the CONFIG register to enable auto-range conversion mode. The OPT3004 then adjusts its internal gain on each conversion to keep the measurement in-range. The result register contains the mantissa (12 bits) and an exponent code (4 bits); the firmware decodes lux = 0.01 × mantissa × 2^exponent.

**Mounting and aperture.** U12 is placed on **B.Cu**, immediately behind the front face of the MDD400 housing. The housing has a small aperture (or, in the V2.9 housing iteration, a small lens window) above U12's optical-active area so ambient light can reach the photodiode through the front face. The aperture / lens geometry of V2.9 differs from the previous hardware revision — that means the *transfer function* from outside-housing illuminance to OPT3004 raw reading has shifted, and the firmware's lookup table needs to be re-fitted. This is the **single most important V2.9 bring-up task** for the ALS.

**INT pin.** The OPT3004 has an INT output that can flag when the reading crosses high / low thresholds. The current V2.9 design does **not** route INT to an ESP32 GPIO — the firmware polls the OPT3004 at a sub-second rate, which is more than fast enough for eye-adaptation timescales. The INT pin is open-drain; if a future firmware revision wants to interrupt-drive on threshold crossings, an external pull-up to V<sub>DD</sub> must be added (V2.10 backlog item).

**Local supply decoupling.** C56 (100 nF X7R) sits adjacent to U12's V<sub>DD</sub> pin. The OPT3004 is low-power (sub-mA average) and doesn't need a separate bulk reservoir at its supply pin — the broader VCC pour and the ESP32-side bulk caps handle low-frequency reservoir duty.

### Performance

| Parameter | Value | Notes |
|-----------|-------|-------|
| I²C address | 0x44 | Configured by ADDR pin tie-off |
| Dynamic range | 0.01 lux to 83,000 lux | Auto-range mode |
| Resolution at low end | 0.01 lux | Sufficient for moonless night-helm lighting |
| Spectral response | Photopic (peak ~555 nm) | Matches human eye sensitivity |
| Package | WSON-6 with exposed pad | Pad must tie to GNDREF |
| V<sub>DD</sub> bypass | C56 = 100 nF X7R, ~2.3 mm from V<sub>DD</sub> | Adequate; OPT3004 is low-power |
| INT pin connection | Open-drain, not routed to ESP32 in V2.9 | Firmware polls; INT pull-up is a V2.10 item if interrupt-driven mode is wanted |
| Mounting | B.Cu, aligned with housing aperture / lens | V2.9 aperture differs from prior hardware — firmware lookup re-fit required |

## Firmware notes

The OPT3004 reading is the input to the **automatic display brightness loop**. The matching firmware-side guidance is on the [Display Interface](./display-interface.md#firmware-notes) page. Summary of the bits that belong on the OPT3004 side:

- **Re-calibration on V2.9 is mandatory.** The brightness lookup table from the **MDD400 V1.0** PlatformIO/Arduino predecessor firmware was tuned over significant in-service operating hours (including extended open-ocean passages). The V2.9 housing has a new ALS aperture / lens placement, so the same outside illuminance now produces a *different* OPT3004 raw reading. The lookup table's input axis must be re-mapped against the V2.9 housing before the migrated brightness loop can be deployed in the planned V2.9 production ESP-IDF firmware.
- **Sub-second polling rate is sufficient.** Eye adaptation is slow; a 1–4 Hz polling rate matches typical needs. Don't poll faster than necessary — the OPT3004's auto-range conversion time (~800 ms at full integration) is the bottleneck anyway.
- **Hysteresis at brightness step boundaries.** DGUS II brightness commands have a small number of discrete steps. The lookup must include hysteresis at each step boundary so the brightness doesn't flicker when ambient light drifts across a threshold.

## PCB Layout

U12 (OPT3004) is placed on B.Cu at (139.0, 47.5), aligned with the window in the custom DWIN lens assembly so the ambient-light path through the lens to the sensor active area is unobstructed — this optical access is the critical placement constraint. C56 (100 nF V<sub>DD</sub> bypass) sits ~2.3 mm from U12's V<sub>DD</sub> pin on the same layer (B.Cu), close enough for effective high-frequency decoupling. The WSON-6 exposed pad (EP, GND) must tie to the GNDREF plane through at least one via directly under or adjacent to the pad; via placement under the exposed pad still requires Gerber verification. The sensor and its decoupling cap cluster with the other I²C sensors in a 15 × 20 mm area on B.Cu immediately behind the DWIN display panel; all sensor grounds connect to the continuous GNDREF plane (no isolation boundary exists in V2.9 — the ISO1541 was removed).

## Components

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| U12 | OPT3004DNPR | TI ambient light sensor, WSON-6, I²C address 0x44, 0.01–83,000 lux | [TI OPT3004 (SBOS762)](https://www.ti.com/lit/ds/symlink/opt3004.pdf) |
| C56 | 100 nF / 50 V X7R 0603 | OPT3004 V<sub>DD</sub> high-frequency bypass | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |

The I²C bus pull-ups (R1, R2, R3) are listed in the [ESP32 Module](./esp32-module) Components table.

## Testing & Verification

:::caution

V2.9 is a fabricated prototype in the bench-test phase. The OPT3004 acknowledges on the I²C bus and produces plausible lux readings on the prototype. **The brightness lookup table needs to be re-fitted against the V2.9 housing aperture before the firmware can be deployed.** The following are required.

**Hardware bring-up (rig at the bench):**

- **I²C addressing** — Issue a `read manufacturer ID` to address 0x44. Pass if the OPT3004 acknowledges and returns the expected manufacturer ID.
- **CONFIG register write-back** — Write auto-range conversion mode to the CONFIG register, read it back. Pass if the read-back matches.
- **Dark reading** — Cover the housing aperture with an opaque cover. Pass if the reported lux value falls below 1 lux within a few conversion cycles.
- **Bright reading** — Aim a known bright source at the housing aperture (e.g. a bench LED panel with a measured lux output). Pass if reported lux is within ±20 % of a reference lux meter co-located at the housing surface.
- **Auto-range stability** — Sweep ambient illuminance across the full operating range (dark → indoor → direct sunlight) while logging the OPT3004 reading. Pass if there are no skipped ranges or stuck-state behaviours.
- **Brightness lookup table re-fit** — Characterise the V2.9 housing aperture's transfer function from outside illuminance to OPT3004 raw reading at multiple ambient levels (direct sunlight, indoor office, twilight, night helm, total dark) and re-fit the lookup. Pass if the firmware brightness loop produces the same perceived display brightness vs ambient as the prior hardware revision did, with DGUS II step-boundary hysteresis applied.

:::

## Gaps & next version

**Before next production run**

- **OPT3004 EP via** — Via placement under the WSON-6 exposed pad (EP, GND) to the GNDREF plane requires Gerber verification; confirm at least one via directly under or adjacent to the pad before committing to a production run.
- **Brightness lookup table re-fit** — The V2.9 housing aperture / lens differs from the prior hardware revision, shifting the illuminance-to-reading transfer function. Re-fit the lookup table against V2.9 hardware before the firmware is deployed.

**Next version (V2.10)**

- **OPT3004 INT pull-up** — If a future firmware revision wants to interrupt-drive on threshold crossings, the open-drain INT pin needs an external pull-up to V<sub>DD</sub>. Currently absent; polled mode in current firmware doesn't require it, so this is a forward-looking item. Connecting INT to a spare GPIO would also require a board respin.

## References

- Texas Instruments, [*OPT3004 Ambient Light Sensor (SBOS762)*](https://www.ti.com/lit/ds/symlink/opt3004.pdf).
- Murata, [*GRM188R71H104KA93D — 100 nF X7R 0603*](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D).
- NXP Semiconductors, [*I²C-bus specification and user manual (UM10204)*](https://www.nxp.com/docs/en/user-guide/UM10204.pdf).

## Related pages

- [Temperature Sensor](./temperature-sensor.md) — the TMP112 sibling sensor on the same `i2c_sensors` sheet and I²C bus
- [ESP32-S3 Module](./esp32-module.md) — host MCU and the shared I²C bus pull-ups (R1 / R2 / R3)
- [Display Interface](./display-interface.md) — firmware-side brightness control loop driven by the OPT3004 reading
- [Pin Assignments](/mdd400/v2.9/quick-reference/pin-assignments) — the I²C bus GPIO assignments and sensor addresses
