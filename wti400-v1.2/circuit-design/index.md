---
title: Circuit Design
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — test vessel (~1,000 sea miles)"
sidebar_label: Overview
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]

WTI400 **v1.2** — In service on the test vessel. The board has accumulated approximately 1,000 sea miles running a simple PlatformIO/Arduino firmware that emits NMEA 2000 wind sentences with hard-coded start-up constants and a self-calibrating ADC limits / midpoint scheme. **Wi-Fi has never been enabled** on any WTI400 V1.2 board; **BLE** has only been exercised during early BLE-library development on test hardware. The WTI400 is an **evolution of the MLI400 V1.0** (Marine Legacy Interface) which carried a wind interface and a bespoke PlatformIO/Arduino firmware; the MLI400 V1.0 was installed on the same test vessel during the circumnavigation, accumulating thousands of sea miles in service and feeding the design improvements that produced V1.2. A production ESP-IDF firmware is the next major project task. Subjective in-service performance of the current firmware is satisfactory; the per-circuit pages list the quantitative bench measurements still required.

:::

## Overview

The **WTI400** is a marine **Wind Transducer Interface** for **NMEA 2000** networks. It accepts a standard sine-wave wind transducer (Raymarine ST60 / E22078 family at the configured 8.4 V setpoint; B&G 213 supply-compatible at 6.8 V but requires the V2.0 ADC fix) and outputs calibrated *Apparent Wind Speed* and *Apparent Wind Angle* as PGN 130306 messages on the vessel CAN bus. A 6-DoF IMU on the same board provides heel / pitch / dynamic correction so the wind output is referenced to the vessel's true horizon rather than the mast's instantaneous orientation.

The WTI400 is a fully self-contained NMEA 2000 device: power and data enter on a single Micro-C connector, the wind transducer attaches at six quick-connect tabs on the opposite edge, and a single RGB LED + tactile button on the front face provide local UI without requiring a display.

This page narrates the system at the board level — the block diagram, power and signal flow, the four electrical isolation domains, the PCB stack-up, and the EMC philosophy that ties the layout together. Each functional block links to its own page where the schematic, layout, performance review, and firmware integration are documented in detail.

<SchematicViewer src="/img/schematics/wti400-v1.2/WTI400_V1.2_a2ad5755.svg" alt="WTI400 V1.2 hierarchical block diagram — the parent KiCad sheet showing each sub-sheet as a labelled block, with the inter-sheet bus connections (VCC, VSC, VAS, WIND_X / WIND_Y / WIND_SPD, TWAI bus, I²C bus, ST_* bus, etc.) routed between blocks." />

---

## Functional requirements and performance criteria

The WTI400 is a self-contained, bus-powered NMEA 2000 wind-transducer interface. The board-level requirements below drove the architecture; each is decomposed into per-circuit objectives on the subsystem pages (the *Functional specification and design objectives* section of each).

**System functional requirements**

- Draw all power and data from a single NMEA 2000 Micro-C connection — no external supply or auxiliary cabling.
- Accept a standard analog sine-wave wind transducer (WIND_X / WIND_Y angle channels + WIND_SPD anemometer pulse train) and supply it from a regulated, selectable wind rail.
- Reconstruct apparent wind angle (`atan2` of the X / Y channels) and apparent wind speed (pulse count) and emit them as PGN 130306 on the CAN bus at ~1 Hz.
- Sense vessel motion (6-DoF IMU) so the wind output can be referenced to the vessel's true horizon rather than the mast's instantaneous orientation.
- Provide local UI (RGB LED + tactile button) without requiring a display.
- Survive the marine NMEA 2000 electrical environment — bus transients, surge, reverse polarity, and over-voltage — without damage.
- Maintain four ground domains, crossing boundaries only through defined isolators (opto-isolated legacy serial; bus-referenced, non-isolated CAN; single-star-point wind return).
- Optionally bridge a single-wire 12 V legacy serial protocol (developer / kit tiers only).

**Performance criteria (design targets)**

| Criterion | Target | Basis |
|---|---|---|
| Supply input | 9–16 V DC from the N2K backbone | NMEA 2000 network voltage range |
| Board current budget | &lt; 150 mA typical (design target) | N2K LEN allocation; Wi-Fi contribution to be validated once production firmware exists |
| Wind-transducer supply rail | 8.4 V (Raymarine ST60 / E22078 family) or 6.8 V (B&G 213 supply-compatible), JP1-selectable | Transducer family setpoints; B&G 213 angle ADC fix deferred to V2.0 |
| Operating temperature | −10 °C to +70 °C (target) | Marine masthead-interface environment; pending qualification |
| Bus robustness | Survive bus transients, surge, reverse polarity, and over-voltage | Marine electrical environment |
| CAN physical layer | ISO 11898-2 at 250 kbps | NMEA 2000 |
| Conformance targets | CE RED 2014/53/EU, UKCA, FCC Part 15, RoHS, China EFUP, NMEA 2000 | Commercial-release compliance |

The per-circuit pages carry the detailed objectives and the calculations that verify them; this section is the system-level parent they trace to.

---

## Power flow

Power enters on the NMEA 2000 backbone through a single 5-pin Micro-C connector at the bus-side edge. It travels through three stages before reaching the digital, wind-transducer, and legacy-serial rails:

1. **CAN bus input protection** — fuse, TVS surge clamp, reverse-polarity Schottky, two-stage LC EMI filter, and over-voltage cut-off MOSFET pair (M1/M3 with threshold set by Zener D10). Documented on the [CAN Bus Power](./can-bus-power.md) page.
2. **VCC SMPS + VAS LDO** — an LMR51610 synchronous buck generates the **VCC (3.3 V)** digital rail; an LP2951 micropower LDO generates the **VAS (8.4 V or 6.8 V selectable via JP1)** wind-transducer supply. Both regulators sit on `power_supplies.kicad_sch`, but the LDO content is documented on the [Wind Interface](./wind-interface.md) page as part of the wind-transducer supply chain. The SMPS lives in a moat-bounded F.Cu / B.Cu GNDREF island that contains the switching return currents.
3. **Digital and wind distribution** — VCC feeds the ESP32 module, the motion sensor, the CAN transceiver, the legacy-serial RX/TX paths, and the button / LED indicator. VAS feeds the wind transducer connector through a series Schottky (D17) and a common-mode filter (FL2 — also the GND_WIND ↔ GNDREF star point).

The VCC distribution exploits a deliberate **VCC – GNDREF – GNDREF – VCC** plane-pair stack-up across the digital domain: F.Cu and B.Cu carry VCC pour, and the two inner layers carry unbroken GNDREF. This creates two distributed VCC↔GNDREF plane-pair capacitors that decouple the rail at GHz frequencies with no parasitic inductance and no ESR — explained in detail on the [Power Supply](./power-supplies.md#in-the-vcc-digital-area) page and exploited specifically on the [ESP32 Module](./esp32-module.md) page (force-commutated daisy-chain bypass cluster at U3 pad 2).

VAS has its own bypass topology (the LP2951's output cap C52, output bleed R74, and the C48 feedforward) — documented on the [Wind Interface](./wind-interface.md) page.

---

## Data flow

The ESP32-S3-WROOM-1-N16R8 module (U3 on the [ESP32 Module](./esp32-module.md) page) is the system controller. All inter-block data signals fan out from U3 over hierarchical labels on the schematic:

- **NMEA 2000 (CAN)** — TWAI_TX / TWAI_RX / TWAI_EN drive the SN65HVD234 transceiver on the [CAN Transceiver](./can-transceiver.md) page, which connects to NET-H / NET-L on the Micro-C connector through a two-stage common-mode filter and split-termination network. The ESP32-S3 TWAI peripheral emits PGN 130306 (apparent wind) at ~1 Hz; firmware also receives heading-reference and vessel-motion PGNs from other nodes when available.
- **Wind transducer signals** — three analog/digital signals come in over the [Wind Interface](./wind-interface.md):
  - **WIND_X / WIND_Y** — two analog sine channels (cosine + sine relative to the transducer's mechanical reference) sampled at the ESP32-S3 ADC's native rate. Firmware does `atan2` reconstruction to derive apparent wind angle.
  - **WIND_SPD** — anemometer reed-switch pulse train (~2 Hz to ~100 Hz across the operating speed range), conditioned by a 74LVC1G17 Schmitt trigger and counted on a GPIO interrupt.
  - **WND_EN / WND_ERR** — control / status pair for the LP2951 LDO that supplies the wind transducer. Firmware enables / disables the transducer rail and reads the LDO's open-drain ERROR output for fault detection.
- **Motion sensing** — I2C_SCL / I2C_SDA at I²C Standard mode (100 kHz) connect to the LSM6DSLTR 6-DoF IMU on the [Motion Sensor](./motion-sensor.md) page (accelerometer + gyroscope, address 0x6A). Firmware polls the IMU at ~52 Hz to apply heel / pitch / dynamic correction to the raw transducer signals. Bus pull-ups (R3 / R4) live on the ESP32 module sheet.
- **Local UI** — a single tactile **BUTTON** and an **RGB LED** (LED_RED / LED_GRN / LED_BLU) on the [Button Input](./button.md) and [LED Indicator](./led-indicator.md) pages provide configuration, mode selection, and status indication without requiring a display. The RGB LED backlights the Scadys logo on the front face.
- **Programming interface** — ESP_TX / ESP_RX / ESP_EN / ESP_BOOT terminate at the [Programming Socket](./programming-socket.md) page's J1 ESP-PROG IDC header (developer/kit build) or the J1 THT pad footprint (production pogo-pin programming, R24 zero-ohm link in place of the LDO chain).
- **Legacy serial (optional)** — ST_TX / ST_RX / ST_EN drive opto-isolated transmit and receive paths to the legacy serial backbone (single-wire 12 V protocol — e.g. for output to older instrument displays). Documented on the [Legacy Serial Interface](./legacy-serial.md) page.

---

## Ground domain map

The WTI400 has **four electrically isolated ground domains**, each with its own pour and isolation creepage gap. Crossing a domain boundary is always via a defined isolator (transformer-coupled CAN transceiver, opto-coupler for legacy serial, common-mode filter at the wind connector, or a regulator's input-output isolation).

| Domain | Reference | Scope | Crossing devices |
|---|---|---|---|
| **CAN domain** | GNDC | NMEA 2000 input — Micro-C connector, input protection (fuse / TVS / Schottky), EMI filter, OVP MOSFET. References the NMEA 2000 NET-C. | NMEA 2000 bus differential coupling crosses to **GNDREF** via the SN65HVD234 CAN transceiver's internal isolation. |
| **DIGITAL domain** | GNDREF | Main domain — VCC SMPS, ESP32, motion sensor, CAN transceiver, button / LED, programming socket, the VCC plane-pair stack-up. | Crosses to **GND_WIND** via FL2 common-mode filter (also the star point). Crosses to **GNDS** via TLP2309 opto-couplers in the legacy serial paths. |
| **WIND domain** | GND_WIND | Wind transducer interface — six Keystone 1211 quick-connect tabs (J4–J9), cable shield conditioning, D17 series Schottky, FL2 CMF, broadband bypass. References the transducer cable shield. | Joined to **GNDREF** at a single star point on FL2 — DC-continuous but separated for AC return paths. |
| **LEGACY IO domain** *(optional, populated for legacy-serial builds)* | GNDS | Galvanically isolated legacy serial backbone — single-wire 12 V signalling. Has its own isolated 12 V supply (ZXTR2012FF LDO on the [Legacy Serial Interface](./legacy-serial.md) sheet). | Crosses to **GNDREF** *only* via TLP2309 opto-couplers; no DC continuity. |

The board enforces these boundaries with 1.4 mm creepage gaps across each full-isolation line (CAN ↔ digital, legacy-serial ↔ digital) and a copper-free isolation gap across the wind connector's GND_WIND ↔ GNDREF boundary up to the FL2 star point.

---

## Subsystems

Each block on the schematic block diagram above maps to one or more docs pages:

| Function | Docs page | KiCad sheet | What it covers |
|---|---|---|---|
| NMEA 2000 input protection | [CAN Bus Power](./can-bus-power.md) | `can_bus_power.kicad_sch` | Fuse F1, TVS D11, PI filter L2/L3 + C33–C39, OVP MOSFET pair M1/M3 with Zener-set threshold |
| 3.3 V VCC SMPS | [Power Supply](./power-supplies.md) | `power_supplies.kicad_sch` | LMR51610 buck converter; moat-bounded SMPS island; VCC plane-pair distribution; domain isolation boundaries |
| CAN transceiver | [CAN Transceiver](./can-transceiver.md) | `can_transceiver.kicad_sch` | SN65HVD234 transceiver; CAN common-mode filter; split-termination + PESD15VL1BA TVS protection |
| MCU + VCC bypass + I²C pull-ups | [ESP32 Module](./esp32-module.md) | `esp32_module.kicad_sch` | ESP32-S3-WROOM-1-N16R8; force-commutated VCC bypass at U3 pad 2; EN / BOOT RC networks; I²C bus pull-ups (R3 / R4) |
| Programming hardware | [Programming Socket](./programming-socket.md) | `esp32_module.kicad_sch` | J1 ESP-PROG IDC header; HT7833 LDO + single-Schottky-isolation chain (D4 / D5); production-variant R24 zero-ohm bridge |
| Wind transducer interface | [Wind Interface](./wind-interface.md) | `wind_interface.kicad_sch` + (LP2951 portion of) `power_supplies.kicad_sch` | VAS LDO (8.4 V / 6.8 V via JP1); six Keystone 1211 tabs (J4–J9); D17 series Schottky; FL2 CMF; X / Y channel buffer amplifier; speed-pulse Schmitt trigger |
| Transducer compatibility | [Transducer Compatibility](../transducer-compatibility.md) | n/a *(documentation only)* | Per-transducer pin-out, supply requirements, signal-level characteristics, V1.2 compatibility matrix |
| Motion sensor | [Motion Sensor](./motion-sensor.md) | `motion_sensor.kicad_sch` | LSM6DSLTR 6-DoF IMU (accelerometer + gyroscope) at I²C 0x6A; firmware polls at ~52 Hz for heel / pitch / dynamic correction |
| Local UI — tactile button | [Button Input](./button.md) | `button_led.kicad_sch` | SW1 tactile switch; pull-up biasing; debounce expectations |
| Local UI — RGB LED | [LED Indicator](./led-indicator.md) | `button_led.kicad_sch` | RGB LED (D1) backlighting the Scadys logo; current limiting (R10–R12); LED_RED / LED_GRN / LED_BLU GPIO mapping |
| Legacy serial | [Legacy Serial Interface](./legacy-serial.md) | `legacy_serial_rx.kicad_sch` + `legacy_serial_tx.kicad_sch` | Galvanically-isolated transmit and receive paths; ZXTR2012FF isolated 12 V supply; TLP2309 opto-couplers; 2N7002 open-drain output driver |
| PCB markings & compliance | [PCB Markings & Compliance](./pcb-markings.md) | `pcb_markings.kicad_sch` | Silkscreen marks (CE / UKCA / FCC / RoHS / EFUP); board-identity copper; Scadys logo; product-docs QR; fiducial markers; PCB stackup detail; mounting and board outline |

---

## Part selection and design for reliability

Components are selected against a written policy rather than by availability or price. The policy exists because the
failure modes that matter on a Scadys board are not the ones that show up on a bench: they appear months later, in the
field, after thermal cycling and vibration.

Three rules shape the passive selection on every board.

**Dielectric and voltage derating.** Ceramic capacitors are X7R or C0G, never X5R, because X5R is rated only to 85 °C
and the inside of a sealed housing reaches that. Bulk ceramics are run at or below 25 % of their rated voltage, which
bounds DC-bias capacitance loss and removes any dependence on the exact capacitance-versus-voltage curve.

**Land patterns come from the component manufacturer, not from the PCB tool.** A ceramic capacitor that cracks under
board flexure fails as a **short circuit**. On a supply rail, that stops the instrument working, with no warning and no
field diagnosis. The amount of solder in the joint controls how much force reaches the ceramic, and the amount of
solder is set by the copper land pattern. Scadys uses the land windows published by Murata and Samsung, which are
narrower than the IPC-7351 defaults that PCB tools generate.

**Inductor saturation current is specified against the regulator's current limit, not against the load.** A switching
regulator drives its inductor to the current limit during a short circuit, a hard load step, or inrush, regardless of
what the steady load is.

:::note[Design standard]

The reasoning behind the capacitor land patterns, including the manufacturers' own statements on solder volume and
cracking, is set out in the engineering note **[MLCC Land Patterns and Flex Cracking](/engineering/mlcc-land-patterns)**.

:::

---

## PCB stack-up and layer allocation

The WTI400 V1.2 PCB is a **four-layer** design manufactured to IPC-6012 Class 2, with ENIG surface finish and dark blue solder mask. The stack-up is asymmetric in copper weight (signal layers at 0.5 oz / 17.5 µm; inner layers at 1 oz / 35 µm) and the layer roles change region-by-region across the board:

| Layer | # | Type | Thickness | Role |
|---|---|---|---|---|
| F.Cu | 0 | Signal | 17.5 µm (0.5 oz) | Component layer; VCC pour in the digital region; GNDREF moat-bounded fills under SMPS, CAN-power, and wind-LDO sections; routed signals |
| In1.Cu | 4 | Power | 35 µm (1 oz) | Unbroken GNDREF in the digital region (one half of the plane pair); GNDREF moat inside the SMPS island |
| In2.Cu | 6 | Power | 35 µm (1 oz) | Unbroken GNDREF in the digital region (other half of the plane pair); domain-dependent fills elsewhere |
| B.Cu | 2 | Signal | 17.5 µm (0.5 oz) | VCC pour in the digital region; GNDREF fills under SMPS / CAN-power / wind-LDO islands; signal routing |

**Board outline:** 95.2 × 95.2 mm (Edge.Cuts x: 66.4–161.6 mm, y: 42.4–137.6 mm).

**In the digital region** (ESP32 module, motion sensor, CAN transceiver, button / LED), F.Cu and B.Cu carry **VCC pour**; In1.Cu and In2.Cu carry unbroken **GNDREF**. The two VCC↔GNDREF plane pairs (F.Cu↔In1.Cu and In2.Cu↔B.Cu) separated by 0.1855 mm prepreg form a distributed VCC bypass capacitor across the whole digital area — no parasitic inductance, no ESR, effective up to GHz frequencies. This is what makes the force-commutated three-cap daisy-chain at U3 pad 2 sufficient for the antenna's 2.4 GHz fundamental: above the discrete caps' package ESL, the plane pair takes over.

**In the SMPS island** (LMR51610 core, switching nodes, hot loops, x &lt; 88 mm), all four layers carry **GNDREF** with a copper-keepout moat surrounding the island. Switching return currents are contained inside the moat. The same moat-and-fence pattern is applied around the **CAN-bus power section** and the **wind-transducer LDO section** — both are similarly noisy and similarly contained. Documented in detail on the [Power Supply](./power-supplies.md) page.

**Across isolation boundaries** (CAN-bus side to digital domain; legacy-serial side to digital domain), all four layers carry **copper-free 1.4 mm creepage gaps**. Crossing devices (CAN transceiver, opto-couplers, ferrite beads, LDOs) are the only DC paths between domains. The GND_WIND ↔ GNDREF boundary at the wind connector is also held copper-free up to the FL2 star point.

---

## EMC layout philosophy

The WTI400 layout follows three principles, each grounded in a specific reference:

1. **Confine the switching converters.** Per the Monolithic Power Systems EMI webinar (*Practical Grounding and Layout*), every buck-converter SW node, input hot loop, and output hot loop is kept inside the SMPS island. The island is surrounded by a 0.4 mm copper-keepout moat on F.Cu and B.Cu; the inner GNDREF planes provide a containment cage. The same containment is applied to the CAN-bus power section and the wind-LDO section. Documented on the [Power Supply](./power-supplies.md) page.

2. **Use the VCC↔GNDREF plane pair as the primary GHz-band decoupling.** Discrete bypass caps handle frequencies up to their package self-resonance (~100 MHz for 0603 X7R, higher for C0G). Above that, the plane pair takes over — provided the digital area's F.Cu / B.Cu pours stay as VCC (not GNDREF) so the plane-pair geometry is preserved. The moat-bounded GNDREF on F.Cu / B.Cu is therefore **only** under the SMPS, CAN-bus power, and wind-LDO islands; extending it into the digital area would break the plane-pair capacitance.

3. **Preserve module pre-certification with antenna keep-out.** The ESP32-S3-WROOM-1's FCC / CE / IC pre-certification is contingent on a copper-free area in the antenna projection. The WTI400 layout uses a physical PCB cutout under the antenna section — the substrate is removed entirely, which also removes any fill copper that might otherwise have been carried there by zone priority alone. No `keepout` rule area is needed because the cutout makes the requirement self-enforcing. Documented on the [ESP32 Module](./esp32-module.md) page.

Other layout notes:

- The WIND_X and WIND_Y analog traces are routed as a matched pair, separated by 5 mm with a GNDREF copper fill between them. No deliberate shielding is required at the operating signal frequencies (&lt; 5 Hz wind sine wave) — the L4 / L5 RF chokes on each channel are for RF / EMI ingress at the masthead cable, not for inter-channel crosstalk.
- I²C traces (I2C_SCL, I2C_SDA) run from the ESP32 module to the motion sensor without crossing any switching power domain — both are in the digital region.
- The CAN differential pair (NET-H, NET-L) is routed as a matched pair with the common-mode filter immediately at the M12 connector. The transceiver (U5) sits on the boundary between the CAN domain and the digital domain, with the differential pair always staying in the CAN domain.

---

## References

- **Sister product** — [MDD400 V2.9 Circuit Design](/mdd400/v2.9/circuit-design/) — shares the buck converter, ESP32-S3 module, and CAN transceiver subsystems. Mirror product designed alongside the WTI400; the two share design decisions, layout patterns, and several backlog items.
- **Predecessor product** — MLI400 V1.0 (*Marine Legacy Interface*) — the bespoke-firmware wind interface that preceded the WTI400. Installed on the test vessel for the circumnavigation; the firmware lineage and several design decisions carry forward into V1.2.
- [Transducer Compatibility Reference](../transducer-compatibility.md) — per-transducer pin-outs, supply requirements, signal-level characteristics, and V1.2 compatibility matrix.
- Texas Instruments, [*LMR51610 Synchronous Buck Converter*](https://www.ti.com/lit/ds/symlink/lmr51610.pdf) — VCC switching regulator.
- Texas Instruments, [*LP2951 Adjustable Micropower Voltage Regulator*](http://www.ti.com/lit/ds/symlink/lp2951.pdf) — VAS wind-transducer LDO.
- Texas Instruments, [*SN65HVD234 3.3 V CAN Transceiver*](https://www.ti.com/lit/ds/symlink/sn65hvd234.pdf) — NMEA 2000 transceiver.
- Texas Instruments, [*TLV9002 1-MHz Rail-to-Rail Op-Amp*](https://www.ti.com/lit/ds/symlink/tlv9002.pdf) — wind X / Y channel buffer amplifier.
- STMicroelectronics, [*LSM6DSL 6-DoF IMU*](https://www.st.com/resource/en/datasheet/lsm6dsl.pdf) — motion sensor.
- Espressif Systems, [*ESP32-S3-WROOM-1 Module Datasheet*](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf) — system controller.
- Monolithic Power Systems, [*EMI Webinar: Practical Grounding and Layout*](https://www.monolithicpower.com/en/support/videos/emi-2-webinar-early-session.html) — referenced throughout the layout philosophy on the [Power Supply](./power-supplies.md) page.
- NMEA 2000 Network Specification — IEC 61162-1 / SAE J1939 family.
