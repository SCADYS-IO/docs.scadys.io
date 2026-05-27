---
title: Circuit Design
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — bench testing"
sidebar_label: Overview
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype, bench-test phase. The board has been driven end-to-end on the bench: power-up, CAN/NMEA 2000 connectivity, the DWIN DGUS II display, the three I²C sensors, and the buzzer all functional. The firmware tone library, alert taxonomy, and brightness-control loop carry over from earlier MDD400 hardware revisions, where they were tuned over significant in-service operating hours including extended open-ocean passages. V2.9 introduces a new housing, a new ambient-light-sensor placement, and a few hardware updates from the prior revision — see each per-circuit page for the specific bring-up tasks that remain open.

:::

## Overview

The **MDD400** is a marine multi-function display node for **NMEA 2000** vessel networks. It draws power and data from a single NMEA 2000 DeviceNet Micro-C connector and presents the network data — engine, navigation, environmental, alarm — on a 4.0-inch capacitive-touch DWIN display housed at the helm. It is a fully self-contained NMEA 2000 device: no external power, no auxiliary cabling, no separate display module. An optional galvanically-isolated legacy serial interface adds a backwards-compatibility path for older instrumentation (single-wire 12 V protocols and NMEA 0183).

This page narrates the system at the board level — the block diagram, power and signal flow, the four electrical isolation domains, the PCB stack-up, and the EMC philosophy that ties the layout together. Each functional block links to its own page where the schematic, layout, performance review, and firmware integration are documented in detail.

<SchematicViewer src="/img/schematics/mdd400-v2.9/MDD400_V2.9_7ea61dc4.svg" alt="MDD400 V2.9 hierarchical block diagram — the parent KiCad sheet showing each sub-sheet as a labelled block, with the inter-sheet bus connections (VDD, VCC, GNDREF, TWAI bus, I²C bus, DISP_* bus, ST_* bus, etc.) routed between blocks." />

---

## Power flow

Power enters on the NMEA 2000 backbone through a single 5-pin Micro-C connector at the bus-side panel. It travels through three stages before reaching the digital and display rails:

1. **CAN bus input protection** — TVS clamp, MOV, reverse-polarity Schottky, resettable fuse, two-stage LC EMI filter, and over-voltage cut-off MOSFET. Documented on the [CAN Bus Power](./can-bus-power.md) page.
2. **Synchronous buck conversion** — two LMR51610 buck converters generate the regulated **VCC (3.3 V)** digital rail and the **VDD (5.0 V)** display / buzzer rail from the protected NMEA 2000 supply. Both converters live in a moat-bounded F.Cu / B.Cu GNDREF island that contains the switching return currents. Documented on the [Power Supplies](./power-supplies.md) page.
3. **Digital and display distribution** — VCC feeds the ESP32 module, the three I²C sensors, the CAN transceiver, and the legacy-serial RX/TX paths. VDD feeds the display interface (through a firmware-controlled high-side P-MOSFET switch, with FB3 EMI conditioning) and the buzzer driver (through a similar P-MOSFET / NPN gate-driver combination with output low-pass filtering). Documented on the [Display Interface](./display-interface.md) and [Buzzer Driver](./buzzer-driver.md) pages.

The VCC distribution exploits a deliberate **VCC – GNDREF – GNDREF – VCC** plane-pair stack-up across the digital domain: F.Cu and B.Cu carry VCC pour, and the two inner layers carry unbroken GNDREF. This creates two distributed VCC↔GNDREF plane-pair capacitors that decouple the rail at GHz frequencies with no parasitic inductance and no ESR — explained in detail on the [Power Supplies](./power-supplies.md#vcc-plane-pair-in-the-digital-area) page and exploited specifically on the [ESP32 Module](./esp32-module.md) page (force-commutated daisy-chain bypass cluster at U3 pad 2).

VDD has no similar plane-pair treatment — it's used only by the display and buzzer, both of which have local bulk + HF bypass at their consumer ends.

---

## Data flow

The ESP32-S3-WROOM-1-N16R8 module (U3 on the [ESP32 Module](./esp32-module.md) page) is the system controller. All inter-block data signals fan out from U3 over hierarchical labels on the schematic:

- **NMEA 2000 (CAN)** — TWAI_TX / TWAI_RX / TWAI_EN drive the SN65HVD234 transceiver on the [CAN Transceiver](./can-transceiver.md) page, which connects to NET-H / NET-L on the Micro-C connector through a two-stage common-mode filter and split-termination network. The ESP32-S3 TWAI peripheral handles CAN frame transmission and reception; firmware decodes incoming PGNs and emits outgoing status/alert PGNs.
- **DWIN display** — DISP_TX / DISP_RX / DISP_EN drive the DWIN DMG48480F040 4.0-inch capacitive-touch panel over UART2 using the DGUS II proprietary serial protocol. All rendering, animation, and touch-event processing run on the display's internal T5L SoC; the ESP32 acts only as a DGUS II host. DISP_EN gives firmware control over the display's power state (default off; firmware-controlled hard reset path). Documented on the [Display Interface](./display-interface.md) page.
- **I²C sensor bus** — I2C_SCL / I2C_SDA at I²C Standard mode (100 kHz) connect three slaves: [INA219 Power Monitor](./power-monitor.md) at 0x40 (NMEA 2000 bus current and voltage); [OPT3004 Ambient Light Sensor](./ambient-light-sensor.md) at 0x44 (drives the firmware brightness loop); [TMP112 Temperature Sensor](./temperature-sensor.md) at 0x48 (drives the three-tier thermal protection: alert / derate / graceful shutdown). Bus pull-ups (R1 / R2 / R3) physically live on the i2c_sensors sub-sheet but logically belong with the MCU — documented on the [ESP32 Module](./esp32-module.md) page.
- **Audio output** — AUDIO_PWM drives the [Buzzer Driver](./buzzer-driver.md) page's two-transistor high-side switch. The ESP32-S3 LEDC peripheral generates the audio-frequency PWM; the R10 / C12 / R9 low-pass filter (f<sub>−3dB</sub> ≈ 7.2 kHz) shapes the PWM into clean alert tones. The buzzer is the **last audible warning** before the graceful-shutdown event powers the display down via DISP_EN.
- **Status LED** — LED_EN drives the [LED Indicator](./led-indicator.md) page's PNP high-side switch. Default-on by hardware bias so the LED is on as soon as VCC is stable, before firmware boots — a board-up power-good indicator that doesn't depend on the MCU.
- **Programming interface** — ESP_TX / ESP_RX / ESP_EN / ESP_BOOT terminate at the [Programming Socket](./programming-socket.md) page's J1 ESP-PROG IDC header (developer/kit build) or the J1 THT pad footprint (production pogo-pin programming, R22 zero-ohm link in place of the LDO chain).
- **Legacy serial (optional)** — ST_TX / ST_RX / ST_EN drive opto-isolated transmit and receive paths to the legacy serial backbone (single-wire 12 V protocol and NMEA 0183 receive-only operation). Documented on the [Legacy Serial Interface](./legacy-serial.md) page.

---

## Ground domain map

The MDD400 has **four electrically isolated ground domains**, each with its own pour and isolation creepage gap. Crossing a domain boundary is always via a defined isolator (transformer-coupled CAN transceiver, opto-coupler for legacy serial, or a regulator's input-output isolation).

| Domain | Reference | Scope | Crossing devices |
|---|---|---|---|
| **CAN domain** | GNDC | NMEA 2000 input — Micro-C connector, input protection (TVS / MOV / fuse / Schottky), EMI filter, OVP MOSFET. References the NMEA 2000 NET-C. | NMEA 2000 bus differential coupling crosses to **GNDREF** via the SN65HVD234 CAN transceiver's internal isolation. |
| **SMPS domain** | GNDSMPS | Buck-converter switching island — LMR51610 cores, switching inductors, hot loops. Bounded by a copper-pour moat on all four layers. | Crosses to **GNDREF** via FB1 / FB2 ferrite beads on the output rails (low-frequency continuous, high-frequency blocked). |
| **DIGITAL domain** | GNDREF | Everything downstream of the SMPS — ESP32, sensors, display, buzzer, status LED. The main return for the VCC plane-pair stack-up across the digital area. | Crosses to **GNDS** via TLP2309 opto-couplers in the legacy serial paths. |
| **LEGACY IO domain** *(optional, populated for legacy-serial builds)* | GNDS | Galvanically isolated legacy serial backbone — single-wire 12 V signalling and NMEA 0183 receive. Has its own isolated 12 V supply (ZXTR2012FF LDO on the [Legacy Serial RX](./legacy-serial.md) sheet). | Crosses to **GNDREF** *only* via TLP2309 opto-couplers; no DC continuity. |

The board enforces these boundaries with 1.4 mm creepage gaps across each isolation line and copper-free zones across all four layers within those gaps. Layout violations across an isolation boundary would break the galvanic separation — the design-intent notes on each isolation-crossing page flag this for any future PCB cleanup.

---

## Subsystems

Each block on the schematic block diagram above maps to one or more docs pages:

| Function | Docs page | KiCad sheet | What it covers |
|---|---|---|---|
| NMEA 2000 input protection | [CAN Bus Power](./can-bus-power.md) | `can_bus_power.kicad_sch` | TVS / MOV / fuse / reverse-polarity diode; two-stage LC EMI filter; OVP MOSFET cut-off |
| 3.3 V + 5.0 V buck conversion | [Power Supplies](./power-supplies.md) | `power_supplies.kicad_sch` | Two LMR51610 buck converters; moat-bounded SMPS island; VCC plane-pair distribution; domain isolation boundaries |
| CAN transceiver | [CAN Transceiver](./can-transceiver.md) | `can_transceiver.kicad_sch` | SN65HVD234 transceiver; CAN common-mode filter; split-termination + TVS protection on NET-H / NET-L |
| MCU + VCC bypass + I²C bus pull-ups | [ESP32 Module](./esp32-module.md) | `esp32_module.kicad_sch` + `i2c_sensors.kicad_sch` | ESP32-S3-WROOM-1-N16R8; force-commutated VCC bypass at U3 pad 2; EN / BOOT control-line networks; I²C bus pull-ups (R1 / R2 / R3) |
| Programming hardware | [Programming Socket](./programming-socket.md) | `esp32_module.kicad_sch` | J1 ESP-PROG IDC header; HT7833 LDO + dual-Schottky-OR'd chain (D3 / D4 / D5); production-variant R22 zero-ohm bridge |
| Status LED | [LED Indicator](./led-indicator.md) | `esp32_module.kicad_sch` | Q1 PNP high-side switch driving D2 amber LED via LED_EN; default-on bias |
| Power monitor | [Power Monitor](./power-monitor.md) | `i2c_sensors.kicad_sch` | INA219 at 0x40; 330 mΩ shunt R33 in series with post-OVP supply; firmware-driven *Power* display page |
| Ambient light sensor | [Ambient Light Sensor](./ambient-light-sensor.md) | `i2c_sensors.kicad_sch` | OPT3004 at 0x44; photopic spectral response; drives firmware brightness loop |
| Temperature sensor | [Temperature Sensor](./temperature-sensor.md) | `i2c_sensors.kicad_sch` | TMP112 at 0x48; PCB + display thermal coupling on B.Cu; three-tier firmware protection (alert / derate / shutdown) |
| Display | [Display Interface](./display-interface.md) | `display_interface.kicad_sch` | DWIN DMG48480F040 4.0-inch DGUS II display; high-side P-MOSFET switched VDSP rail; 50-pin FPC connector |
| Audio alerts | [Buzzer Driver](./buzzer-driver.md) | `buzzer_driver.kicad_sch` | MLT-8530 passive electromagnetic transducer; high-side P-MOSFET drive via NPN gate driver; output LP filter; flyback Schottky |
| Legacy serial | [Legacy Serial Interface](./legacy-serial.md) | `legacy_serial_rx.kicad_sch` + `legacy_serial_tx.kicad_sch` | Opto-isolated transmit and receive paths to single-wire 12 V protocols and NMEA 0183; ZXTR2012FF isolated supply; TLP2309 opto-couplers |
| PCB markings & compliance | n/a *(not a docs page)* | `pcb_markings.kicad_sch` | Fiducials, compliance marks, silkscreen labels |

---

## PCB stack-up and layer allocation

The MDD400 V2.9 PCB is a **four-layer** design manufactured to IPC-6012 Class 2, with ENIG surface finish and dark blue solder mask. The stack-up is asymmetric in copper weight (signal layers at 0.5 oz / 17.5 µm; inner layers at 1 oz / 35 µm) and the layer roles change region-by-region across the board:

| Layer | # | Type | Thickness | Role |
|---|---|---|---|---|
| F.Cu | 0 | Signal | 17.5 µm (0.5 oz) | Component layer; VCC pour in the digital region; GNDREF moat-bounded fills under SMPS and isolation islands; routed signals |
| In1.Cu | 4 | Power | 35 µm (1 oz) | Unbroken GNDREF in the digital region (one half of the plane pair); GNDREF moat inside the SMPS island |
| In2.Cu | 6 | Power | 35 µm (1 oz) | Unbroken GNDREF in the digital region (other half of the plane pair); domain-dependent fills elsewhere |
| B.Cu | 2 | Signal | 17.5 µm (0.5 oz) | VCC pour in the digital region; GNDREF fills under SMPS and isolation islands; signal routing |

**In the digital region** (ESP32 module, sensors, display power switch, buzzer driver), F.Cu and B.Cu carry **VCC pour**; In1.Cu and In2.Cu carry unbroken **GNDREF**. The two VCC↔GNDREF plane pairs (F.Cu↔In1.Cu and In2.Cu↔B.Cu) separated by 0.1855 mm prepreg form a distributed VCC bypass capacitor across the whole digital area — no parasitic inductance, no ESR, effective up to GHz frequencies. This is what makes the force-commutated three-cap daisy-chain at U3 pad 2 sufficient for the antenna's 2.4 GHz fundamental: above the discrete caps' package ESL, the plane pair takes over.

**In the SMPS island** (LMR51610 cores, switching nodes, hot loops), all four layers carry **GNDREF** with a copper-keepout moat surrounding the island. Switching return currents are contained inside the moat; the only escape path is through B.Cu, which adds enough inductance to attenuate HF coupling into the rest of the board. Documented in detail on the [Power Supplies](./power-supplies.md) page.

**Across isolation boundaries** (CAN-bus side to digital domain; legacy-serial side to digital domain), all four layers carry **copper-free 1.4 mm creepage gaps**. Crossing devices (transceiver, opto-couplers, ferrite beads, regulators with isolated I/O) are the only DC paths between domains.

---

## EMC layout philosophy

The MDD400 layout follows three principles, each grounded in a specific reference:

1. **Confine the switching converters.** Per the Monolithic Power Systems EMI webinar (*Practical Grounding and Layout*), every buck-converter SW node, input hot loop, and output hot loop is kept inside the SMPS island. The island is surrounded by a 0.4 mm copper-keepout moat on F.Cu and B.Cu; the inner GNDREF planes provide a containment cage. Documented on the [Power Supplies](./power-supplies.md) page.

2. **Use the VCC↔GNDREF plane pair as the primary GHz-band decoupling.** Discrete bypass caps handle frequencies up to their package self-resonance (~100 MHz for 0603 X7R, higher for C0G). Above that, the plane pair takes over — provided the digital area's F.Cu / B.Cu pours stay as VCC (not GNDREF) so the plane-pair geometry is preserved. The moat-bounded GNDREF on F.Cu / B.Cu is therefore **only** under the SMPS, CAN-bus-power, and isolation islands; extending it into the digital area would break the plane-pair capacitance.

3. **Preserve module pre-certification with antenna keep-out.** The ESP32-S3-WROOM-1's FCC / CE / IC pre-certification is contingent on a 3 mm copper-free area in the antenna projection. The MDD400 layout exceeds this by 2× — ≥ 6.3 mm clearance on F.Cu, ≥ 10.9 mm on B.Cu, with the antenna aligned to a dedicated board-edge slot. Documented on the [ESP32 Module](./esp32-module.md) page.

The display backlight switching converter (internal to the DWIN module) is the secondary noise source. FB3 (BLM31KN601SN1L) on the VDSP rail between Q4 drain and the C37 / C38 cluster contains the display-side conducted noise behind a ferrite bead — see the [Display Interface](./display-interface.md) page.

---

## Testing & Verification

:::caution

V2.9 is a fabricated prototype. Each circuit page has its own Testing & Verification list — the items below are the **system-level** items that span multiple sub-circuits or require integrated bring-up.

**System-level bring-up (rig the assembled MDD400 at the bench):**

- **NMEA 2000 round-trip** — Plug into a live N2K backbone. Pass if the MDD400 acquires an address, receives PGNs from other nodes, and emits its own status PGNs cleanly.
- **End-to-end power-up sequence** — Apply N2K supply with all sensors connected. Confirm the timing of: VCC stable → ESP32 boots → status LED lights (hardware bias, before firmware) → firmware initialises → display powers on via DISP_EN → DGUS II UI appears → sensor polling starts → CAN ready.
- **Power-cycle robustness** — Brown-out the N2K supply repeatedly (50+ cycles). Confirm: no spurious buzzer chirp during boot; no display flicker between firmware-off and firmware-on states; no I²C bus lock-up on the sensor side; ESP32 always boots cleanly.
- **Thermal soak** — Mount the assembled MDD400 in a representative helm position (sun-loaded) for several hours. Log TMP112 reading; INA219 voltage / current. Use this data to tune the three TMP112 firmware thresholds (alert / derate / shutdown).
- **Graceful-shutdown sequence** — Drive TMP112 reading above the shutdown threshold via heat. Confirm: buzzer annunciates *before* DISP_EN drops the display; final NMEA 2000 status message emitted; device enters low-power mode with LED still indicating.
- **Brightness-loop characterisation** — Bench-test the ALS → DGUS II brightness lookup across the full ambient range (dark / indoor / direct sunlight). Re-fit the lookup table for the V2.9 housing aperture; apply DGUS II step-boundary hysteresis. (Carries over significant tuning effort from prior MDD400 hardware revisions.)

**For V2.10 (tracked in `v2.10-improvements.md`):**

- All per-circuit V2.10 entries documented on the individual pages.
- Cross-cutting items: DISP_TX / DISP_RX series damping if routed traces exceed 50 mm; CISPR 32 conducted-emission scan; full BOM dielectric audit (specifically C37 on the Display Interface and C57 on the Temperature Sensor).
- Sister-product cross-reference: the WTI400 V1.2 uses the same buck converter, the same ESP32-S3 module, and the same CAN transceiver. Where V2.10 introduces a change that also applies to WTI400 V1.3, the items are cross-referenced between the two product backlogs.

:::

---

## References

- **Sister product** — [WTI400 V1.2 Circuit Design](/wti400/v1.2/circuit-design/) — shares the buck converter, ESP32-S3 module, and CAN transceiver subsystems. The WTI400 evolved from the MLI400 V1.0 (Marine Legacy Interface) which carried the firmware lineage into the WTI400.
- Texas Instruments, [*LMR51610 Synchronous Buck Converter*](https://www.ti.com/lit/ds/symlink/lmr51610.pdf) — VCC and VDD switching regulators.
- Texas Instruments, [*SN65HVD234 3.3 V CAN Transceiver*](https://www.ti.com/lit/ds/symlink/sn65hvd234.pdf) — NMEA 2000 transceiver.
- Espressif Systems, [*ESP32-S3-WROOM-1 Module Datasheet*](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf) — system controller.
- DWIN, *DMG48480F040_01WTC Capacitive Touch Display Datasheet* — `/assets/pdf/mdd400-v2.9/DMG48480F040_01WTC_Datasheet.pdf`.
- Monolithic Power Systems, [*EMI Webinar: Practical Grounding and Layout*](https://www.monolithicpower.com/en/support/videos/emi-2-webinar-early-session.html) — referenced throughout the layout philosophy on the [Power Supplies](./power-supplies.md) page.
- NMEA 2000 Network Specification — IEC 61162-1 / SAE J1939 family.
