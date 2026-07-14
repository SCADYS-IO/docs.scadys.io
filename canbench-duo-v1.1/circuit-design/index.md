---
title: Circuit Design
hw_version: v1.1
hw_status: prototype
hw_status_label: "Fabricated prototype — sole built unit (pre-InvenTree)"
sidebar_label: Overview
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]
CANBench Duo **v1.1** — Fabricated prototype, sole built unit. V1.1 is electrically identical to the V1.2 schematic refresh but predates the InvenTree symbol-library migration; the schematic component metadata reflects legacy SCADYS naming. Testing and bench validation reference this V1.1 hardware.

**Other versions:** [v1.2 — schematic refresh (next version)](/canbench-duo/v1.2/)
:::

The CANBench Duo is a fully passive instrument. There is no microcontroller, no firmware, no switching converter. Everything described below is implemented with discrete components arranged on a 2-layer FR-4 board, with the layout following Jay_Diddy_B's [EEVblog 5 µH LISN design philosophy](https://www.eevblog.com/forum/projects/5uh-lisn-for-spectrum-analyzer-emcemi-work/).

<SchematicViewer src="/img/schematics/canbench-duo-v1.1/block_diagrams_28aa9266.svg" alt="CANBench Duo V1.1 system block diagram" initialFocus="16 16 158 130" />

## Overview

Power flows left-to-right across the board. The bench DC supply enters at the front-faceplate `SRC` banana pair, passes through a four-stage filter and protection chain, and emerges at the back-faceplate `DUT` banana pair (or the M12 N2K connector). RF disturbance signatures are tapped off the DUT-side rails and the CAN bus lines, attenuated and protected, and routed to three SMA outputs on the top extrusion.

The supply chain is **mirror-symmetric** across the board's central horizontal axis. The upper rail (positive) and lower rail (negative) carry identical topology — same protection FETs, same ferrite, same 5-stage LISN ladder, same damping resistors. Mirror symmetry across the Y = 90 mm axis minimises common-mode-to-differential-mode conversion in the measurement, which is the fundamental EMC requirement of any artificial network.

The three RF measurement ports share a common design pattern: a high-pass AC-couple at the input, a two-stage π attenuator giving about 10 dB of attenuation, a multi-stage clamp cascade for analyser protection, an integrated TVS at the SMA. The two LISN measurement ports tap the LISN ladder's DUT-side outputs (one per rail); the CAN common-mode port uses a 1 kΩ matched-pair summing front-end to extract the CAN bus common-mode voltage directly.

A discrete state-encoder LED on the top extrusion communicates the supply-chain health — Green for normal operation, Blue when the upstream protection FET (Q2) is not fully conducting (typically because F1 has blown), Red for reverse polarity, Off for no supply.

## Functional requirements and performance criteria

The CANBench Duo is a passive measurement fixture: a dual-line DC LISN with an integrated CAN common-mode monitor. The board-level requirements below drove the architecture; each is decomposed into per-circuit objectives on the subsystem pages.

**Fixture functional requirements**

- Pass a bench DC supply through to the DUT while presenting a stable, mostly-inductive LISN source impedance across the CISPR 25 measurement band, decoupling the DUT's RF disturbance behaviour from the upstream bench supply.
- Tap the RF disturbance signature off each DUT-side rail and present it as a 50 Ω signal at a board-mounted SMA, with enough added attenuation to keep a spectrum analyser front-end in its useful dynamic range.
- Extract the CAN-bus common-mode voltage with a high-impedance summing front-end that does not terminate or appreciably perturb the bus.
- Block the bench supply's DC offset from reaching the analyser, and limit residual transients at every SMA to a level safe for the analyser.
- Maintain strict upper-/lower-rail mirror symmetry so common-mode-to-differential-mode conversion in the measurement is minimised.
- Stay fully passive — no MCU, no firmware, no switching converter — and survive bench-class ESD and supply-mishap events (reverse polarity, blown fuse) without damage.

**Performance criteria (design targets)**

| Criterion | Target | Basis |
|---|---|---|
| Measurement band | 150 kHz – 108 MHz, margin to 120 MHz | CISPR 25 conducted-emissions band |
| LISN port impedance | ≈ 4.7 Ω at 150 kHz, rising as jωL | 5 µH artificial-network ladder (CISPR 25) |
| RF output (SMA) impedance | 50 Ω at each of the 3 SMA ports | Spectrum-analyser input standard |
| Added attenuation per RF port | ≈ 10 dB | Two-stage π attenuator; keeps analyser in dynamic range |
| DC supply current rating | 4.0 A @ 25 °C ambient (3.0 A @ 40 °C) | LISN ladder R_DC, fuse + ferrite thermal limit |
| Supply voltage range | 9–48 V continuous DC (≤ 55 V ceiling) | TVS clamps non-conductive below ~55–58 V; downstream parts ≥ 100 V rated |
| DC voltage block (RF ports) | up to 48 V (LISN), up to 100 V (CAN CM) | AC-couple cap voltage rating (100 V X7R) |
| CAN-bus perturbation | &lt; 3 % | High-impedance 1 kΩ summing tap vs 60 Ω parallel terminators |
| Analyser-side residual transient | ≤ +10 dBm into 50 Ω | Multi-stage clamp + TPAZ1023 TVS cascade |
| ESD tolerance at SMA | IEC 61000-4-2 ±8 kV air / ±6 kV contact (design target) | Topological design target; TVS datasheet verification pending |

The per-circuit pages carry the detailed objectives and the calculations that verify them; this section is the system-level parent they trace to.

## Subsystems

| Subsystem | Schematic sheet | Role |
| --- | --- | --- |
| [LISN Supply Path](./lisn-supply-path.md) | `lisn_supply_path` | Fuse, reverse-polarity protection, ferrite filter, 5-stage 5 µH LC ladder. Delivers filtered supply to the DUT. |
| [LISN Measurement Ports](./lisn-measurement-ports.md) | `lisn_positive_measurement_port` + `lisn_negative_measurement_port` (mirror pair) | AC-coupled RF tap on each LISN rail. Two-stage π attenuator + multi-stage protection cascade + TPAZ1023 TVS + SMA output. |
| [CAN Common-Mode Port](./can-cm-port.md) | `can_cm_measurement_port` | High-impedance summing tap on CAN-H + CAN-L. Extracts CAN bus common-mode voltage to a 50 Ω SMA output. |
| [Connectors and Mechanical](./connectors-and-mechanical.md) | `connectors_and_mechanical` | Connector roster (4 banana + 3 SMA + 1 M12 N2K) and fiducials. Defines the dual-face enclosure layout. |
| [Power Indicator LED](./power-indicator-led.md) | `power_indicator_led` | XL-5050RGBC three-die LED + BC807 PNP state encoder. Four-state visual indicator: Off / Green / Blue / Red. |
| [PCB Markings](./pcb-markings.md) | `silks` | Regulatory marks (CE, UKCA, RoHS), branding (Logo, Copyright), QR code, hardware version stamp. |

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

The board is **99 × 79 mm**, **2-layer FR-4**, **1.6 mm overall thickness**, **1 oz copper** on both sides.

| Layer | Type | Thickness | Material | ε_r | Notes |
| --- | --- | --- | --- | --- | --- |
| F.SilkS | Top silkscreen | — | — | — | Regulatory marks + branding (PCB underside in the assembled enclosure) |
| F.Mask | Top solder mask | 0.010 mm | — | — | Dark green |
| F.Cu | Signal | 0.035 mm | Copper | — | Components + signal traces + 23 isolated GNDREF islands |
| Core | Dielectric | 1.510 mm | FR-4 | 4.5 | tan δ ≈ 0.02 |
| B.Cu | Signal | 0.035 mm | Copper | — | Single continuous GNDREF flood — the primary RF return plane |
| B.Mask | Bottom solder mask | 0.010 mm | — | — | Dark green |
| B.SilkS | Bottom silkscreen | — | — | — | Empty on V1.1/V1.2 |

The total layer thickness sums to **1.6 mm**. KiCad-CLI export confirms layer-by-layer consistency.

### Layer allocation

F.Cu carries all component pads and signal traces. Twenty-three intentionally-isolated GNDREF islands sit on F.Cu — each island provides a local return reference for one DC-filter component (a damped shunt cap, a bulk cap, a protection-cluster pad). The islands are NOT continuous with the surrounding RF ground pour on the same layer; they connect to the B.Cu pour via short vias beneath their respective components.

B.Cu is **almost entirely a single continuous GNDREF flood**, broken only at component-pad cutouts and a few small annotation gaps. It is the primary return-current path AND the reference plane for the CPWG-like geometry around the RF measurement-port traces on F.Cu.

### EMC layout philosophy

Three principles, derived from Jay_Diddy_B's EEVblog reference design:

1. **Strict mirror symmetry across Y = 90 mm.** The upper-rail LISN ladder (L1–L5) sits 11.5 mm above this axis; the lower-rail ladder (L6–L10) is 11.5 mm below. The protection FETs, the per-ladder-node damping resistors, the AC-couple caps at the DUT-side tap, and the SMA verticals all follow the mirror. Symmetry minimises common-mode-to-differential-mode conversion in the LISN measurement.

2. **Isolated F.Cu GNDREF islands for parasitic-capacitance minimisation.** Each DC-filter component's GND-side connection terminates on a local copper island, NOT on a large continuous F.Cu pour. Large pours add unwanted pad-to-ground capacitance that slackens the ladder's high-frequency behaviour. Same rationale applies to **minimised pad sizes** — every footprint uses the smallest pad that meets solderability requirements.

3. **CPWG-style coplanar ground pour around RF traces.** The 50 Ω measurement-port traces (RF_LISN_P, RF_LISN_N, RF_CAN_CM, plus intermediate nets RF_LP1–6 and RF_LN1–6) are surrounded on both sides on F.Cu by GND pour at controlled spacing, with the B.Cu flood as the reference plane below. This is the standard 50 Ω routing topology for 2-layer FR-4 RF instrumentation.

The actual V1.1 RF traces are 0.2 mm wide rather than a controlled-impedance CPWG width (1.7 mm) or microstrip width (2.8 mm). The design archive documents this as a "diminishing returns" decision — given the high component density and short trace runs (≤ 10 mm between adjacent RF components, which is ≤ λ/560 at the 108 MHz band edge in FR-4), full CPWG via fencing was judged not worth the layout effort. The surrounding F.Cu GND pour + continuous B.Cu flood beneath provide the dominant return reference; the trace width is electrically lumped at the measurement-band frequencies.

### Design rules

| Rule | Value |
| --- | --- |
| Minimum track width | 1.0 mm (observed across the board) |
| Via diameter / drill | 0.6 mm / 0.3 mm |
| Minimum annular ring | 0.15 mm |
| Pad-to-mask clearance | 0 mm |
| Soldermask tenting | F + B (all vias tented) |
| Net classes | None defined explicitly (default class applies) |

The V1.1 `.kicad_pcb` does not contain an explicit `(design_rules ...)` block; all geometry comes from per-zone and per-footprint definitions. A future kicad-hygiene pass could add a formal net-class scheme — particularly for the SUPPLY± / DUT± high-current rails and the RF measurement-port traces.

## References

- Jay_Diddy_B, [*5 µH LISN for Spectrum Analyzer EMC/EMI work*](https://www.eevblog.com/forum/projects/5uh-lisn-for-spectrum-analyzer-emcemi-work/) — primary PCB-layout design reference
- HP / Keysight 11947A — transient limiter heritage informing the RF measurement-port protection cascade
- IEC, [*CISPR 25: Vehicles, boats and internal combustion engines — Radio disturbance characteristics*](https://webstore.iec.ch/publication/7077) — measurement-band and artificial-network definition
- IEC, [*Basic concepts for Artificial Networks (AN) used in EMC testing*](https://webstore.iec.ch/) — background notes
- Monolithic Power Systems, [*EMI Webinar: Practical Grounding and Layout*](https://www.monolithicpower.com/en/support/videos/emi-2-webinar-early-section.html)
