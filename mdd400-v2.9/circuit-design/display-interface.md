---
title: Display Interface
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — bench testing"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/display_interface_6644bddb.svg" alt="Display Interface schematic — full sheet (display power switch with VDSP rail conditioning; DWIN DMG48480F040 FPC connector). Zoom and pan freely; per-sub-circuit zoomed views appear below." />

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype, bench-test phase. The DWIN display has been driven end-to-end through DGUS II on this prototype using bench test routines: power-switching, the UART link, command issuance, and touch-event round-tripping are functional. The production firmware (planned in ESP-IDF, migrating from the MDD400 V1.0 PlatformIO/Arduino predecessor) will drive display brightness from the on-board ambient light sensor. The V2.9 housing introduces a new ALS placement, so the brightness lookup will need to be re-calibrated against the previous lookup curve — which was tuned over significant in-service open-ocean operating hours on the MDD400 V1.0 hardware — before the migrated brightness loop can ship on V2.9.

:::

## Overview

This page documents the MDD400's interface to its 4.0-inch capacitive-touch DWIN DGUS II display module, drawn on `display_interface.kicad_sch`. The interface consists of two sub-circuits:

1. **Display power switch and VDSP rail conditioning** — high-side P-MOSFET (Q4) switched on by an NPN gate driver (Q5) under firmware control via DISP_EN, followed by a ferrite bead (FB3) and a two-stage bypass cluster (C37, C38) on the switched VDSP rail.
2. **DWIN display FPC connector and UART2 link** — J4 (50-pin 0.5 mm FPC) carrying VDSP, GNDREF, and the DISP_TX / DISP_RX UART2 lines that drive the DGUS II protocol.

The display module is a DWIN **DMG48480F040_01WTC** — a 4.0-inch, 480 × 480 capacitive-touch panel with an integrated T5L SoC, internal backlight driver, and DGUS II serial protocol. The ESP32 acts solely as a DGUS II host: it issues display-update commands and reads back touch events; all rendering, animation, and touch-event processing run on the T5L inside the display.

## Functional specification and design objectives

The display power switch sub-circuit must:

- Switch the display module's 5 V supply on and off under firmware control, so the display can be left dark during MCU boot and reset and can be hard-power-cycled by firmware to recover from any T5L lock-up.
- Default to **off** at power-up (display does not light before firmware initialises) and at any time DISP_EN is undriven or tri-stated.
- Decouple the switched VDSP rail well enough to absorb both the display's inrush at power-on and the high-frequency conducted noise from the display's internal backlight converter.
- Keep the conducted-noise back-flow onto the on-board 5 V VDD rail below a level that would couple into the rest of the digital domain (ESP32, sensors, CAN transceiver).

The display FPC connector sub-circuit must:

- Connect a 50-pin 0.5 mm FPC cable to the DWIN DMG48480F040 display panel.
- Carry **only** the four signals the DGUS II protocol needs (VDSP, GNDREF, DISP_TX, DISP_RX); leave the other 46 pins on the FPC connector unconnected.
- Mount on the back of the PCB (B.Cu) so the FPC can fold cleanly behind the display when assembled into the housing.

## Display power switch and VDSP rail conditioning

<SchematicViewer src="/img/schematics/mdd400-v2.9/display_interface_6644bddb.svg" alt="Display power switch sub-circuit — Q4 (AO3407A P-MOSFET high-side switch), Q5 (S8050 NPN gate driver), R34 (Q4 gate pull-up), R31 + R35 (Q5 base-drive network), FB3 (BLM31KN601SN1L ferrite bead), and the VDSP bypass cluster C37 + C38." initialFocus="19.05 101.6 127.0 88.9" />

### How it works

#### High-side power switch — Q4 + Q5

The AO3407A (Q4, P-channel, V<sub>DSS</sub> = −30 V, R<sub>DS(on)</sub> = 52 mΩ at V<sub>GS</sub> = −4.5 V, SOT-23) sits between the on-board 5 V VDD rail and the switched VDSP node. Its source is at VDD; its drain feeds FB3 → the VDSP bypass cluster → J4. R34 (10 kΩ) pulls Q4's gate up to VDD by default — V<sub>GS</sub> = 0 V keeps Q4 off, and the display is unpowered until firmware acts.

Q5 (S8050 NPN, V<sub>CEO</sub> = 25 V, h<sub>FE</sub> ≥ 40 at 100 mA, SOT-23) is the gate driver. Its collector is tied to Q4's gate; its emitter to GNDREF. When the ESP32 drives **DISP_EN** (GPIO21) HIGH (3.3 V), the base divider R35 (100 kΩ from DISP_EN to Q5 base) + R31 (100 kΩ from base to GNDREF) gives Q5 a base current of ~19 µA, which is well above the ~12 µA needed to saturate Q5 at the 480 µA collector current drawn through R34. Q5 saturates with V<sub>CE,sat</sub> ≈ 0.2 V, pulling Q4's gate to ~0.2 V above GND. V<sub>GS</sub> = 0.2 − 5.0 = −4.8 V — well past Q4's −0.45 V to −1.5 V threshold — and Q4 turns fully on. R31 also ensures Q5 is held off when DISP_EN is floating or tri-stated, locking the display *off* across power-up, reset, and any firmware fault that leaves the GPIO in input mode.

#### Supply rail conditioning — FB3 + C37 + C38

After Q4, the VDSP rail passes through FB3 (Murata BLM31KN601SN1L, 1206, 600 Ω at 100 MHz, 50 mΩ DC resistance, 3 A rated) before reaching the bypass cluster. FB3 attenuates conducted noise from the display's internal backlight switching converter from propagating back onto the on-board 5 V rail. C37 (10 µF 0805 X7R) is the bulk reservoir; C38 (100 nF 0603 X7R) sits beside it on the same VDSP node for HF bypass. Both caps are on the *display-side* of the ferrite bead — placing them upstream would defeat the noise-filtering purpose.

The 5 V rail entering FB3 (Q4 drain) is therefore the *clean* side; the rail leaving FB3 (J4 supply) is the *display-side* node that the display itself can pollute, with the FB3 ↔ cap loop containing that pollution.

### Performance

| Parameter | Value | Notes |
|-----------|-------|-------|
| Q5 base current I<sub>B</sub> at DISP_EN = 3.3 V | 19 µA | (3.3 V − 0.7 V) / 100 kΩ − 0.7 V / 100 kΩ |
| Q5 collector current I<sub>C</sub> | 480 µA | (5.0 V − 0.2 V) / 10 kΩ |
| I<sub>B</sub> required for Q5 saturation | ~12 µA | I<sub>C</sub> / h<sub>FE,min</sub> = 480 µA / 40 |
| Q5 saturation overdrive | 1.6× | Saturated and stable; not deep saturation |
| Q4 V<sub>GS</sub> when Q5 saturated | −4.8 V | 0.2 V − 5.0 V; threshold = −0.45 to −1.5 V |
| Q4 R<sub>DS(on)</sub> at V<sub>GS</sub> = −4.5 V | 52 mΩ typ | AO3407A datasheet |
| Q4 V<sub>DS</sub> drop at 400 mA | 21 mV | I × R<sub>DS(on)</sub> |
| Q4 P<sub>d</sub> at 400 mA | 8.3 mW | I² × R<sub>DS(on)</sub>; well within SOT-23 |
| FB3 DC voltage drop at 400 mA | 20 mV | I × R<sub>DC</sub> = 0.4 A × 0.05 Ω |
| FB3 current margin | 86.7 % | (3.0 A − 0.4 A) / 3.0 A |
| C37 voltage stress | 20 % of rating | 5 V on 25 V cap — within 50 % derating guideline |
| C37 effective capacitance at 5 V DC bias | **Unverified** | "BZ" Murata series code; X5R / Y5V / Z5U dielectric not yet confirmed (V2.10 item) |
| Default-off behaviour | DISP_EN floating → display off | R31 pulls Q5 base low; Q4 V<sub>GS</sub> = 0; Q4 off |
| Hard-reset capability | Cycle DISP_EN LOW for ≥ 1 ms | Recovers from T5L lock-up |

## DWIN display FPC connector and UART2 link

<SchematicViewer src="/img/schematics/mdd400-v2.9/display_interface_6644bddb.svg" alt="DWIN display FPC connector sub-circuit — J4 (Xunpu FPC-05FB-50PH20 50-pin 0.5 mm FPC connector), carrying VDSP, GNDREF, and the DISP_TX / DISP_RX UART2 link to the display's T5L SoC." initialFocus="19.05 12.7 127.0 88.9" />

### How it works

**J4 — Xunpu FPC-05FB-50PH20** is a 50-pin, 0.5 mm pitch FPC connector with a top/bottom clamshell flip-lock actuator. Only four pins are wired:

| FPC pin role | Net | ESP32-S3 endpoint | Direction (from ESP32) |
|---|---|---|---|
| Display supply | VDSP | (via Q4 / FB3 / C37 / C38) | Power |
| Display ground | GNDREF | (board GNDREF) | Power return |
| DGUS II command | DISP_TX | GPIO48 → display UART RX | Out |
| DGUS II status / touch | DISP_RX | GPIO47 ← display UART TX | In |

The remaining 46 pins are intentionally left unconnected — they're not needed for the DGUS II workflow.

**DGUS II protocol.** The DWIN T5L SoC inside the display handles all rendering, animation, and touch-event processing locally. The ESP32 communicates with it over UART2 by sending DGUS II command frames (write to display-variable memory, write to image area, query touch event status, etc.) and reading back response or event frames. Typical baud rate is 115 200 bps; the link is a plain 3.3 V CMOS UART (the T5L expects 3.3 V logic levels, matched by ESP32-S3 GPIO).

**No backlight PWM line on the FPC.** The display's internal driver controls the backlight; backlight brightness is set over the DGUS II command channel itself. There is no separate backlight-enable or PWM line on the FPC, so brightness control is purely firmware-driven through serial commands. (See *Firmware notes* below for the brightness-vs-ambient-light approach.)

### Performance

| Parameter | Value | Notes |
|-----------|-------|-------|
| J4 part | Xunpu FPC-05FB-50PH20 | 50-pin 0.5 mm pitch FPC, top/bottom clamshell flip-lock |
| Used pins | 4 of 50 | VDSP, GNDREF, DISP_TX, DISP_RX |
| Connector mounting | B.Cu | Back of board; FPC folds behind display when housed |
| DISP_TX straight-line distance (U3 → J4) | Routed length unverified | V2.10 backlog item: if &gt; 50 mm add 33 Ω series damping at U3 |
| DISP_RX straight-line distance (J4 → U3) | Routed length unverified | Same V2.10 backlog item |
| UART baud rate | 115 200 bps (typical) | Configurable in DGUS II project file |
| Display protocol | DGUS II (proprietary serial) | T5L SoC handles UI rendering, animation, touch processing |
| Display panel | 4.0-inch, 480 × 480, capacitive touch | DWIN DMG48480F040_01WTC |

## Firmware notes

A short pointer set for firmware writers — the DGUS II side has matured on the **MDD400 V1.0** PlatformIO/Arduino predecessor firmware through significant in-service operating hours (including extended open-ocean passages); that code is the planned starting point for the V2.9 production ESP-IDF firmware. V2.9 introduces a new housing and a new ambient-light-sensor placement that will require **re-calibration of the brightness lookup curve** against the previous behaviour before the migrated loop can ship.

**Brightness control loop.**

1. The ambient light sensor (ALS) lives on the I²C bus — see the [Ambient Light Sensor](./ambient-light-sensor.md) page for the sensor part and address.
2. Firmware reads the ALS at a low rate (sub-second is fine — eye adaptation is slow).
3. A lookup table maps ALS reading → target DGUS II brightness setpoint. The DGUS II brightness command is **not very granular** — only a handful of discrete steps — so the lookup must be coupled with hysteresis to prevent visible flicker as ambient light drifts across a step boundary.
4. The lookup curve from the prior hardware revision is the starting point; the new V2.9 ALS placement (different housing geometry, possibly different sensor orientation relative to the panel) means the *same* ambient illuminance now produces a *different* ALS reading. The lookup table input axis must be re-mapped before re-deploying the firmware on V2.9.
5. Night-vision considerations matter: avoid producing a startling brightness step when the ambient light rises briefly (e.g. a brief light-flash overhead during a night passage). Slew-limit upwards more aggressively than downwards.

**DGUS II send-side cadence.**

- Brightness commands: send only when the lookup decides a step has changed (don't poll-and-write).
- UI variable updates: send only when the variable's underlying value has actually changed (don't refresh the whole frame on a fixed timer; the T5L is fine letting variables persist).

**T5L boot-time.**

- After DISP_EN goes HIGH (or after a hard-reset cycle), wait ~600 ms before issuing DGUS II commands. The T5L is not responsive until it finishes its internal boot sequence.

## PCB Layout

The power-switch cluster (Q4, FB3, C37, C38, Q5, R31, R34, R35) sits on F.Cu within roughly X: 110–118 mm, Y: 79–87 mm; J4 is on B.Cu at (124, 80), 6–14 mm away depending on which pin is referenced.

- **Switched-rail order.** The VDSP rail runs Q4 drain → FB3 → C37/C38 → J4. FB3 is correctly placed between Q4's drain and the decoupling node (≈ 2.4 mm from Q4, 3.3 mm from C37), so the bulk and HF caps sit on the display-side of the ferrite where they contain backlight-converter noise.
- **Decoupling.** C38 (100 nF) is co-located with C37 (10 µF) on the same F.Cu row, 3.25 mm centre-to-centre — good parallel decoupling. C37 is ~7.2 mm from Q4's drain, further than the 5 mm target but acceptable at display operating frequencies with no critical timing requirement.
- **Gate-drive path.** Q5 is ~5.1 mm from Q4's gate — acceptable for an infrequent enable/disable switch, not a high-frequency application. R31/R35 (Q5 base network) sit ~3.5 mm from Q5's base, keeping base trace inductance low. R34 (gate pull-up) is ~7.6 mm from Q4's gate; larger than ideal but a DC pull-up that need not be co-located.
- **FPC mount.** J4 is on B.Cu (180°) as required by the flip-lock orientation, so the FPC cable folds cleanly behind the display when housed.

## Components

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| J4 | Xunpu FPC-05FB-50PH20 | 50-pin 0.5 mm pitch FPC connector, top/bottom flip-lock; B.Cu mount | [Xunpu FPC-05FB-50PH20](https://en.xunpu.com.cn/product/388.html) |
| Q4 | AO3407A | AOS P-channel MOSFET, SOT-23. V<sub>DSS</sub> = −30 V, I<sub>D</sub> = −4.2 A, R<sub>DS(on)</sub> = 52 mΩ at V<sub>GS</sub> = −4.5 V. High-side switch for VDSP | [AOS AO3407A](https://www.aosmd.com/pdfs/datasheet/AO3407A.pdf) |
| Q5 | S8050 | NPN BJT, SOT-23. V<sub>CEO</sub> = 25 V, h<sub>FE</sub> ≥ 40 at 100 mA. Gate driver for Q4 | [onsemi SS8050](https://www.onsemi.com/pdf/datasheet/ss8050-d.pdf) |
| FB3 | BLM31KN601SN1L | Murata 1206 ferrite bead, 600 Ω at 100 MHz, 50 mΩ DCR, 3 A rated. Series filter on VDSP between Q4 drain and bypass cluster | [Murata BLM31KN601SN1L](https://www.murata.com/en-us/products/productdetail?partno=BLM31KN601SN1L%40T) |
| C37 | 10 µF / 25 V 0805 | Murata GRM21BZ71E106KE15L — bulk bypass on VDSP after FB3. Effective capacitance at 5 V bias to be confirmed (V2.10 item) | [Murata GRM21BZ71E106KE15L](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |
| C38 | 100 nF / 50 V X7R 0603 | Murata GRM188R71H104KA93D — HF bypass on VDSP | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| R34 | 10 kΩ 0603 ±1 % | Yageo — Q4 gate pull-up to VDD (default-off bias) | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R31 | 100 kΩ 0603 ±1 % | Yageo — Q5 base pull-down to GNDREF (default-off bias when DISP_EN floats) | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R35 | 100 kΩ 0603 ±1 % | Yageo — base series resistor from DISP_EN (ESP32 GPIO21) to Q5 base | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |

## Testing & Verification

:::caution

V2.9 is a fabricated prototype in the bench-test phase. DGUS II command issuance, touch-event reception, and power-switching have been confirmed on the prototype. **The following measurements and re-calibrations are required before the page can be marked verified.**

**Hardware bring-up (rig at the bench):**

- **Default-off at power-up** — Apply VDD and probe VDSP at J4 with DISP_EN unconnected (firmware-controlled GPIO held high-impedance). Pass if VDSP measures &lt; 50 mV.
- **Power-on transition** — Drive DISP_EN HIGH from firmware; probe Q4 gate. Pass if Q4 gate is pulled to ≤ 0.5 V within one GPIO cycle, confirming Q5 saturates and Q4 enters full enhancement.
- **VDSP rail under display load** — Measure VDSP at J4 with the display fully active (backlight on, UI animation running). Pass if VDSP stays within ±2 % of the VDD rail value with no individual dip below 4.85 V.
- **Operating-current characterisation** — Measure VDD-side current at backlight off and 25 / 50 / 75 / 100 %, with and without active UI animation. Pass if peak current stays well within Q4's 4.2 A and FB3's 3 A ratings. (Performance review used 400 mA as a conservative estimate; replace with measured value.)
- **Hard-reset recovery** — With the display on, briefly drive DISP_EN LOW for 10 ms then HIGH. Pass if the T5L re-boots and DGUS II commands resume after the documented T5L boot time (~600 ms typ).
- **UART round-trip** — Send a DGUS II "read variable" command at a known address. Pass if the display responds within the documented latency window and the response frame parses cleanly.
- **Touch event reception** — Tap a documented touch zone. Pass if the corresponding DGUS II touch-event frame arrives on DISP_RX with the correct touch coordinates.
- **FPC seating** — After engaging the J4 clamshell, gently flex the FPC at the connector edge while monitoring the UART link. Pass if there are no momentary disconnects.
- **Brightness lookup re-calibration** — Bench-test at multiple ambient illuminances (direct sunlight, indoor office, night helm, totally dark) and re-fit the ALS-reading → DGUS II brightness step curve, applying hysteresis at each step boundary. Pass if brightness tracks ambient light with no visible flicker across step boundaries.

:::

## Gaps & next version

**Before next production run**

- **Display operating-current measurement** — The DWIN DMG48480F040_01WTC operating current has not been measured on the V2.9 prototype; the performance review assumes 400 mA conservatively. Measure peak current at all backlight settings and confirm Q4 (4.2 A) and FB3 (3 A) operating points before committing to a production run.
- **Brightness lookup re-calibration** — The V2.9 housing and ALS placement differ from the prior hardware revision, so the existing ALS-reading → DGUS II brightness step lookup table must be re-characterised on V2.9 hardware before the migrated firmware can ship.
- **J4 VDSP trace length** — The VDSP supply trace from C37/C38 (110.5, 79.7) to J4 (124.0, 80.0) is ~13.5 mm straight-line; effective length depends on which J4 pin carries VDSP. Verify the FPC pinout and routed trace length in Gerber review.

**Next version (V2.10)**

- **C37 dielectric / voltage-derating confirmation** — Confirm the Murata "BZ" series code (GRM21BZ71E106KE15L) corresponds to a temperature characteristic where effective capacitance at 5 V DC bias remains ≥ 4.7 µF. If the dielectric is Y5V / Z5U and derating is severe, swap for an X5R-rated 10 µF / 25 V 0805 part.
- **LCSC URLs in schematic** — C37, C38, and FB3 KiCAD property fields currently reference LCSC datasheet URLs. Replace with Murata manufacturer URLs in a V2.10 schematic pass.
- **DISP_TX / DISP_RX series damping if traces ≥ 50 mm** — Already tracked under the ESP32 module in `v2.10-improvements.md`; cross-referenced here because the damping resistors belong adjacent to each transmitter (U3 DISP_TX pad and the display module TX pad respectively).

## References

- DWIN, *DMG48480F040_01WTC Capacitive Touch Display Datasheet* — `/assets/pdf/mdd400-v2.9/DMG48480F040_01WTC_Datasheet.pdf`.
- DWIN, *T5L DGUS II Application Development Guide V2.9* — `/assets/pdf/mdd400-v2.9/T5L_DGUSII-Application-Development-Guide-V2.9-0207.pdf`.
- AOS, [*AO3407A P-Channel MOSFET*](https://www.aosmd.com/pdfs/datasheet/AO3407A.pdf).
- onsemi, [*SS8050 NPN Transistor*](https://www.onsemi.com/pdf/datasheet/ss8050-d.pdf).
- Murata, [*BLM31KN601SN1L Ferrite Bead*](https://www.murata.com/en-us/products/productdetail?partno=BLM31KN601SN1L%40T).
- Murata, [*GRM21BZ71E106KE15L — 10 µF X7R 0805*](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L).
- Murata, [*GRM188R71H104KA93D — 100 nF X7R 0603*](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D).
- Xunpu, [*FPC-05FB-50PH20 50-pin FPC Connector*](https://en.xunpu.com.cn/product/388.html).
- Yageo, [*RC Group Chip Resistor*](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf).

## Related pages

- [ESP32 Module](./esp32-module.md) — host MCU; DISP_TX / DISP_RX / DISP_EN drive lines and the UART2 routing.
- [Ambient Light Sensor](./ambient-light-sensor.md) — ALS used to drive the firmware brightness loop.
- [Power Supplies](./power-supplies.md) — derives the on-board 5 V VDD rail that Q4 switches to VDSP.
- [Pin Assignments](/mdd400/v2.9/quick-reference/pin-assignments) — GPIO21 (DISP_EN), GPIO47/48 (UART2) mappings.
