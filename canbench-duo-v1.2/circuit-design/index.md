---
title: Circuit Design
hw_version: v1.2
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
sidebar_label: Overview
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]
CANBench Duo **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-duo/v1.1/)
:::

The CANBench Duo is a fully passive instrument. There is no microcontroller, no firmware, no switching converter. Everything described below is implemented with discrete components arranged on a 2-layer FR-4 board, with the layout following Jay_Diddy_B's [EEVblog 5 µH LISN design philosophy](https://www.eevblog.com/forum/projects/5uh-lisn-for-spectrum-analyzer-emcemi-work/).

<SchematicViewer src="/img/schematics/canbench-duo-v1.2/block_diagrams_2116f4b3.svg" alt="CANBench Duo V1.2 system block diagram" initialFocus="16 16 158 130" />

## System architecture

Power flows left-to-right across the board. The bench DC supply enters at the front-faceplate `SRC` banana pair, passes through a four-stage filter and protection chain, and emerges at the back-faceplate `DUT` banana pair (or the M12 N2K connector). RF disturbance signatures are tapped off the DUT-side rails and the CAN bus lines, attenuated and protected, and routed to three SMA outputs on the top extrusion.

The supply chain is **mirror-symmetric** across the board's central horizontal axis. The upper rail (positive) and lower rail (negative) carry identical topology — same protection FETs, same ferrite, same 5-stage LISN ladder, same damping resistors. Mirror symmetry across the Y = 90 mm axis minimises common-mode-to-differential-mode conversion in the measurement, which is the fundamental EMC requirement of any artificial network.

The three RF measurement ports share a common design pattern: a high-pass AC-couple at the input, a two-stage π attenuator giving about 10 dB of attenuation, a multi-stage clamp cascade for analyser protection, an integrated TVS at the SMA. The two LISN measurement ports tap the LISN ladder's DUT-side outputs (one per rail); the CAN common-mode port uses a 1 kΩ matched-pair summing front-end to extract the CAN bus common-mode voltage directly.

A discrete state-encoder LED on the top extrusion communicates the supply-chain health — Green for normal operation, Blue when the upstream protection FET (Q2) is not fully conducting (typically because F1 has blown), Red for reverse polarity, Off for no supply.

## Subsystems

| Subsystem | Schematic sheet | Role |
| --- | --- | --- |
| [LISN Supply Path](./lisn-supply-path.md) | `lisn_supply_path` | Fuse, reverse-polarity protection, ferrite filter, 5-stage 5 µH LC ladder. Delivers filtered supply to the DUT. |
| [LISN Measurement Ports](./lisn-measurement-ports.md) | `lisn_positive_measurement_port` + `lisn_negative_measurement_port` (mirror pair) | AC-coupled RF tap on each LISN rail. Two-stage π attenuator + multi-stage protection cascade + TPAZ1023 TVS + SMA output. |
| [CAN Common-Mode Port](./can-cm-port.md) | `can_cm_measurement_port` | High-impedance summing tap on CAN-H + CAN-L. Extracts CAN bus common-mode voltage to a 50 Ω SMA output. |
| [Connectors and Mechanical](./connectors-and-mechanical.md) | `connectors_and_mechanical` | Connector roster (4 banana + 3 SMA + 1 M12 N2K) and fiducials. Defines the dual-face enclosure layout. |
| [Power Indicator LED](./power-indicator-led.md) | `power_indicator_led` | XL-5050RGBC three-die LED + BC807 PNP state encoder. Four-state visual indicator: Off / Green / Blue / Red. |
| [PCB Markings](./pcb-markings.md) | `silks` | Regulatory marks (CE, UKCA, RoHS), branding (Logo, Copyright), QR code, hardware version stamp. |

## PCB Layout and Stack-up

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

The actual V1.2 RF traces are 0.2 mm wide rather than a controlled-impedance CPWG width (1.7 mm) or microstrip width (2.8 mm). The design archive documents this as a "diminishing returns" decision — given the high component density and short trace runs (≤ 10 mm between adjacent RF components, which is ≤ λ/560 at the 108 MHz band edge in FR-4), full CPWG via fencing was judged not worth the layout effort. The surrounding F.Cu GND pour + continuous B.Cu flood beneath provide the dominant return reference; the trace width is electrically lumped at the measurement-band frequencies.

### Design rules

| Rule | Value |
| --- | --- |
| Minimum track width | 1.0 mm (observed across the board) |
| Via diameter / drill | 0.6 mm / 0.3 mm |
| Minimum annular ring | 0.15 mm |
| Pad-to-mask clearance | 0 mm |
| Soldermask tenting | F + B (all vias tented) |
| Net classes | None defined explicitly (default class applies) |

The V1.2 `.kicad_pcb` does not contain an explicit `(design_rules ...)` block; all geometry comes from per-zone and per-footprint definitions. A future kicad-hygiene pass could add a formal net-class scheme — particularly for the SUPPLY± / DUT± high-current rails and the RF measurement-port traces.

## References

- Jay_Diddy_B, [*5 µH LISN for Spectrum Analyzer EMC/EMI work*](https://www.eevblog.com/forum/projects/5uh-lisn-for-spectrum-analyzer-emcemi-work/) — primary PCB-layout design reference
- HP / Keysight 11947A — transient limiter heritage informing the RF measurement-port protection cascade
- IEC, [*CISPR 25: Vehicles, boats and internal combustion engines — Radio disturbance characteristics*](https://webstore.iec.ch/publication/7077) — measurement-band and artificial-network definition
- IEC, [*Basic concepts for Artificial Networks (AN) used in EMC testing*](https://webstore.iec.ch/) — background notes
- Monolithic Power Systems, [*EMI Webinar: Practical Grounding and Layout*](https://www.monolithicpower.com/en/support/videos/emi-2-webinar-early-section.html)
