---
title: LISN Measurement Ports
hw_version: v1.2
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/canbench-duo-v1.2/lisn_positive_measurement_port_222e41ab.svg" alt="LISN+ measurement port schematic (lisn_positive_measurement_port)" />

:::note[Hardware version]
CANBench Duo **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-duo/v1.1/)
:::

## Overview

The LISN measurement ports are two mirror-image RF chains that tap the LISN-filtered DUT-side rails and present each rail's conducted-emissions signature as a 50 Ω signal at a board-mounted SMA. The upper-rail port (`RF_LISN_P`, SMA `J2`) taps `DUT+`; the lower-rail port (`RF_LISN_N`, SMA `J4`) taps `DUT−`. The two ports are full mirror images of each other across the board's Y = 90 mm axis — identical topology, identical component values, identical PCB layout.

This page covers a single sub-circuit — the **LISN Measurement Ports** — drawn across the `lisn_positive_measurement_port` and `lisn_negative_measurement_port` KiCad sheets.

The design is derived from Jay_Diddy_B's [EEVblog 5 µH LISN reference design](https://www.eevblog.com/forum/projects/5uh-lisn-for-spectrum-analyzer-emcemi-work/), itself based on the HP / Keysight 11947A transient limiter with high-pass filter.

## Functional specification and design objectives

The LISN measurement-port chain is designed to deliver:

- A clean view of conducted emissions across the **CISPR 25 measurement band (150 kHz – 108 MHz)** with margin to 120 MHz
- A **50 Ω source impedance** to the spectrum analyser
- Approximately **10 dB of added attenuation** to keep analyser front-ends in their useful dynamic range
- **DC blocking up to 48 V** so the bench supply's quiescent voltage does not reach the analyser
- A **multi-stage protection cascade** that limits residual transients at the SMA to a safe level for the analyser

## LISN Measurement Ports

<SchematicViewer src="/img/schematics/canbench-duo-v1.2/lisn_positive_measurement_port_222e41ab.svg" alt="LISN+ measurement port schematic (lisn_positive_measurement_port)" initialFocus="31 60 221 70" />

The lower-rail mirror has identical topology with mirrored refdes (e.g. `R20` → `R29`, `C15` → `C20`, `J2` → `J4`):

<SchematicViewer src="/img/schematics/canbench-duo-v1.2/lisn_negative_measurement_port_9a611945.svg" alt="LISN− measurement port schematic (lisn_negative_measurement_port)" initialFocus="31 60 221 70" />

### How it works

The signal-flow order from the LISN ladder's DUT-side output to the SMA matches the physical layout of the V1.1 board: right-to-left across the upper portion of the PCB.

#### Stage 1 — AC-couple from the LISN rail

Three parallel capacitors form the AC-couple from `DUT+` to the first internal node `RF_LP1`:

- `C15` — 100 nF / 100 V X7R (0805)
- `C18` — 1 µF / 100 V X7R (1210)
- `C19` — 1 µF / 100 V X7R (1210)

Total parallel capacitance is about 2.1 µF, which gives a low-frequency cut-off well below the CISPR 25 band edge. The 100 V rating leaves comfortable margin for the design's 48 V supply ceiling.

The lower-rail mirror uses `C20`, `C23`, `C24` from `DUT−` to `RF_LN1`.

#### Stage 2 — Two-stage π attenuator

The attenuator is built from thin-film 0.1 % matched resistors for impedance precision:

- `R20` (17.8 Ω series, 1206 thin-film) between `RF_LP1` and `RF_LP2`
- `R24` and `R25` (294 Ω each, 0805 thin-film) as shunts on `RF_LP1` and `RF_LP2`
- A second π section uses `R22` (45.3 Ω series), `R26` / `R27` / `R28` (130 Ω shunts)

The combined transfer function approximates 10 dB of attenuation across the measurement band, with the **input impedance at `RF_LP1` ≈ 48 Ω** — close to the 50 Ω port target. Numerical verification against the actual V1.2 BOM values is in `performance_review/lisn-measurement-ports.md`; full S21 / return-loss simulation against PCB parasitics is pending.

#### Stage 3 — C-L-C high-pass filter

A C-L-C network sets the LF cut-off of the chain:

- `C16` and `C17` (470 nF each, 0805 X7R) as series elements
- `L11` + `L12` (470 µH each, in series via `Net-(L11-Pad1)`, shunt to GNDREF) — together a 940 µH choke from `RF_LP3` to ground

With two 470 nF capacitors effectively in series (≈ 235 nF) and a 940 µH shunt inductor, the ideal LF corner is:

```
f_0 ≈ 1 / (2π · √(L · C)) = 1 / (2π · √(940 µH · 235 nF)) ≈ 10.7 kHz
```

About a decade below the CISPR 25 lower band edge of 150 kHz — well clear of the measurement region. The C-L-C also blocks the upstream LISN-rail DC offset from reaching the diode-clamp stage.

#### Stage 4 — Multi-stage protection cascade

Four protection stages stack between the attenuator network and the SMA, each progressively limiting voltage and absorbing energy:

1. **Outer bipolar 2-diode clamp at `RF_LP6`.** `D6` + `D11` (series-stacked anode-to-cathode) and `D7` + `D12` (mirror polarity) form a ±1.2 V clamp using 1N4148W fast-switching diodes. Two-diode series gives roughly half the junction capacitance per leg compared to a single diode — important for keeping HF measurement fidelity (the 1N4148W single-diode capacitance is about 4 pF; the series pair is about 2 pF per leg).

2. **`R21` (5.1 Ω) inter-stage current limiter.** Between the outer clamp at `RF_LP6` and the inner clamp at `RF_LISN_P`. When the outer clamp engages, R21 limits the current that flows into the inner stage.

3. **Inner bipolar 1-diode clamp at `RF_LISN_P`.** `D8` and `D9` (anti-parallel 1N4148W pair) provide a tighter ±0.6 V clamp at the SMA-output net. Because R21 has already attenuated the residual transient energy, this stage handles much lower peak current than the outer stage and can clamp tighter without sacrificing reliability.

4. **Integrated TVS `D10` at the SMA.** Tech Public TPAZ1023-02F multi-channel TVS in a DFN1210-6 package. Six channels are available; **only Channel 1 (I/O1) is populated** on the design — pin 1 connects to `RF_LISN_P`, pin 3 to GNDREF, pins 2/4/5/6 are deliberately left unconnected. Single-channel population minimises parasitic capacitance loading on the RF node (each active channel adds about 0.3 pF; populating all six would slacken HF response).

The cascade — 2-diode clamp → 5.1 Ω → 1-diode clamp → TVS — successively limits voltage and absorbs energy: the outer 2-diode clamp catches gross transients, R21 limits current into the inner stage, the inner 1-diode clamp tightens the residual transient further, and the TVS catches anything else (especially ESD events with sub-ns rise times).

#### Stage 5 — SMA output

`RF_LISN_P` connects to `J2` (HCTL HC-SMA6565-13H-G SMA Female Vertical, 50 Ω THT). A 1 MΩ bleeder (`R23`) ties `RF_LISN_P` to GNDREF — provides a defined DC reference at the SMA when no analyser is connected, with high enough resistance not to load the RF measurement.

The lower-rail chain ends at `J4` (RF_LISN_N) on the same top-extrusion column as `J2`, mirror-placed across Y = 90.

### Performance

Design intent — calculated in `performance_review/lisn-measurement-ports.md` against V1.2 BOM specs. SPICE simulation against PCB parasitics is pending for full S21 / return-loss verification.

| Parameter | Target | Status |
| --- | --- | --- |
| Measurement band | 150 kHz – 108 MHz (CISPR 25), margin to 120 MHz | Topology supports |
| Source impedance to analyser | 50 Ω | Network input impedance ≈ 48 Ω at LF |
| Added attenuation | ≈ 10 dB | Two-stage π attenuator nominal |
| DC voltage block | up to 48 V | Limited by C15 / C20 (100 V X7R) — actual margin > 100 V |
| LF corner | ≈ 10.7 kHz (C-L-C high-pass) | Below 150 kHz CISPR band edge |
| Stray Cj at SMA output | ≈ 4.3 pF | D8/D9 ≈ 3 pF + D10 ≈ 0.3 pF + SMA pad ≈ 1 pF |
| Analyser-side residual transient limit | ≤ +10 dBm into 50 Ω | Bounded by the protection cascade |
| ESD tolerance at SMA | IEC 61000-4-2 ±8 kV air / ±6 kV contact (design target) | TPAZ1023 specific rating verification pending |

:::warning[Not for ISO 7637-2 transient testing]
The TVS cascade is designed for ESD and bench-handling events only. ISO 7637-2 Pulse 5a/5b (load dump, 100+ V sustained transients) would exceed the chain's capability and risks damage to the LISN's protection FETs upstream and the TVS at the SMA itself.
:::

## PCB Layout

The measurement-port components sit in two rows across the upper portion of the board (LISN+ at Y ≈ 117 mm) and the lower portion (LISN− at Y ≈ 64 mm), mirror-placed across Y = 90 mm. The signal flow runs **right-to-left** along each row, from the AC-couple cap cluster at the DUT-rail tap (X ≈ 156 mm) through the attenuator and clamp cascade to the SMA at the leftmost board edge (X ≈ 110 mm).

Specific layout choices worth calling out:

- **0.2 mm RF trace widths** are NOT a mistake. The archive documents this as a "diminishing returns" decision: given the high component density and short trace runs (≤ 10 mm between adjacent RF components), full controlled-impedance CPWG (1.7 mm trace width) or microstrip (2.8 mm) was judged unnecessary. At the 108 MHz band edge in FR-4, λ/10 ≈ 14 cm — orders of magnitude above the actual trace lengths. The impedance mismatch over such short lengths is electrically lumped.
- **F.Cu coplanar ground pour** surrounds each RF trace, with the B.Cu continuous GNDREF flood as the reference plane below. This is the CPWG-like geometry, just with thin signal traces.
- **Outer clamp pairs** (D6+D11, D7+D12) sit as compact 4-component diode islands at `RF_LP6` with the GNDREF-side via directly into the F.Cu pour. Mirror on the lower rail with D13+D18, D14+D19.
- **TPAZ1023 `D10`** is placed 2.5 mm from `J2`'s centre pin — minimum-inductance path for the SMA-side clamp. Same for `D17` and `J4`.
- **Shunt-choke pair** (L11 + L12 in series to GND, mirror with L13 + L14) sits compactly at X = 140.75 mm, 6 mm Y-spacing between the two chokes. Mirror on the lower rail.

See `pcb_review/lisn-measurement-ports-layout.md` in the source repository for the full per-component coordinate table and verification.

## Components

The two ports are full mirror images. Each row covers both rails (positive-rail ref / negative-rail ref); footprint, value, and part are identical across the mirror pair.

| Refs (pos / neg) | Value | Function | Datasheet |
| --- | --- | --- | --- |
| C15 / C20 | 100 nF / 100 V X7R, 0805 | First AC-couple cap from DUT± rail to RF_LP1/RF_LN1 (parallel with C18/C19) | [muRata GCM21BR72A104KA37L](https://www.lcsc.com/datasheet/C85866.pdf) |
| C18, C19 / C23, C24 | 1 µF / 100 V X7R, 1210 | Bulk AC-couple, parallel with C15/C20 (total ≈ 2.1 µF) | [muRata GCM32CR72A105KA35L](https://www.lcsc.com/datasheet/C91605.pdf) |
| C16, C17 / C21, C22 | 470 nF / 50 V X7R, 0805 | Series elements of the C-L-C high-pass filter | [muRata GCM21BR71H474KA55L](https://www.lcsc.com/datasheet/C405303.pdf) |
| L11, L12 / L13, L14 | 470 µH, IND-5942 | Series pair (940 µH) shunt choke from RF_LP3/RF_LN3 to GNDREF | [PROD Tech PSWSAA5942-471M (LCSC C46628485)](https://www.lcsc.com/datasheet/C46628485.pdf) |
| R20 / R29 | 17.8 Ω, 0.1 % thin-film, 1206 | First-section π-attenuator series element (RF_LP1 → RF_LP2) | [YAGEO RT1206BRD0717R8L](https://www.lcsc.com/datasheet/C870466.pdf) |
| R24, R25 / R33, R34 | 294 Ω, 0.1 % thin-film, 0805 | First-section π-attenuator shunts on RF_LP1/RF_LP2 | [YAGEO RT0805BRD07294RL](https://www.lcsc.com/datasheet/C865360.pdf) |
| R22 / R31 | 45.3 Ω, 0.1 % thin-film, 0603 | Second-section π-attenuator series element (RF_LP4 → RF_LP6) | [YAGEO RT0603BRD0745R3L](https://www.lcsc.com/datasheet/C861416.pdf) |
| R26, R27, R28 / R35, R36, R37 | 130 Ω, 0.1 % thin-film, 0603 | Second-section shunts / HF damping at RF_LP3/RF_LP4/RF_LP6 | [YAGEO RT0603BRD07130RL](https://www.lcsc.com/datasheet/C705724.pdf) |
| D6, D7, D11, D12 / D13, D14, D18, D19 | 1N4148W, SOD-123 | Outer bipolar 2-diode clamp (±1.2 V) at RF_LP6/RF_LN6 | [DIODES 1N4148W-7-F](https://www.lcsc.com/datasheet/C83528.pdf) |
| R21 / R30 | 5.1 Ω, 1 % thick-film, 0603 | Inter-stage current limiter between outer and inner clamps | [YAGEO AC0603FR-075R1L](https://www.lcsc.com/datasheet/C227988.pdf) |
| D8, D9 / D15, D16 | 1N4148W, SOD-123 | Inner bipolar 1-diode clamp (±0.6 V) at RF_LISN_P/RF_LISN_N | [DIODES 1N4148W-7-F](https://www.lcsc.com/datasheet/C83528.pdf) |
| D10 / D17 | TPAZ1023-02F, DFN1210-6 | Integrated multi-channel TVS at the SMA — only Channel 1 populated | [Tech Public TPAZ1023-02F (LCSC C41408050)](https://www.lcsc.com/datasheet/C41408050.pdf) |
| R23 / R32 | 1 MΩ, 1 % thick-film, 0603 | DC bleeder from RF_LISN_P/RF_LISN_N to GNDREF | [YAGEO RC0603FR-071ML](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| J2 / J4 | SMA Female Vertical, 50 Ω THT | RF output to spectrum analyser / disturbance meter | [HCTL HC-SMA6565-13H-G](https://www.lcsc.com/datasheet/C5723200.pdf) |

## Gaps & next version

**Before next production run**

- **TPAZ1023 ESD survivability** — the "3 A @ 8/20 µs" rating in the BOM is a surge spec, not the IEC 61000-4-2 sub-µs ESD profile; the manufacturer's full datasheet (HBM / CDM / IEC 61000-4-2 ratings) is not publicly indexed in English. Fetch the datasheet and confirm the SMA ESD rating before committing to a production run.
- **Full S21 / return-loss verification** — SPICE simulation against the netlist (and ideally VNA characterisation of the as-built board) is still pending; the ≈ 10 dB attenuation, 50 Ω port match across the band, and ≈ 10.7 kHz high-pass corner all need numerical confirmation. A SPICE-confirmed return-loss measurement at the SMA would also close the 0.2 mm RF-trace-width question analytically.
- **R24 / R25 (R33 / R34) dissipation at fault conditions** — the 125 mW π-attenuator shunts may exceed their rating when the cascade is driven to its +10 dBm SMA limit. Confirm via SPICE the maximum allowed DUT-side input level keeps these ≤ 125 mW.
- **L11–L14 surge current** — confirm via SPICE that peak current through the shunt chokes during an IEC 61000-4-2 Level 4 ESD event stays ≤ the 120 mA rating; specify a higher-current variant in V1.3 if exceeded.

**Next version (V1.3)**

- **0.2 mm RF trace widths** — by design (see PCB Layout) and acceptable at ≤ 108 MHz given the short trace runs; V1.3 may revisit if HF performance falls short of the SPICE/VNA results.
- **Sparse SMA ground-via cluster** — fewer ground stitching vias around each SMA than the routing memory recommends. Recurring across all three SMAs (`J2`, `J4`, and `J6` on the CAN CM port). Either V1.3 layout cleanup or empirical confirmation that the IEC 61000-4-2 ESD performance is acceptable as built.
- **R21 / R30 (5.1 Ω) thick-film** in an otherwise thin-film RF chain — only conducts during clamp events, not under normal operation. V1.3 cleanup candidate to restore the RF-path thin-film discipline.
- **Cross-sheet HF tap stub** — the DUT-side HF shunt caps (C7, C14, on the LISN supply-path sheet) sit at the LISN ladder end (X = 142 mm), ~ 27 mm away from the DUT banana sockets (J1 / J3 at X = 168.5 mm). The 27 mm trace adds parasitic inductance not bypassed by the HF shunts. V1.3 candidate: add HF shunt caps at the J1 / J3 banana ends.

## Measurement workflow

For the operational measurement workflow (spectrum-analyser configuration, baseline noise floor validation, LISN+ / LISN− symmetry comparison, environmental coupling considerations) see the [User Manual](../user-manual/index.md). The key user-facing points:

- **Always terminate unused SMA ports with 50 Ω.** Unterminated ports cause false CM signatures, resonances, and unstable traces.
- **Maintain repeatable geometry** between comparative sweeps. Cable routing, DUT position, and proximity to nearby electronics significantly affect low-level common-mode measurements.
- **Compare LISN+ vs LISN−** to identify CM (similar signatures) vs DM (asymmetric signatures) content. For full CM / DM separation, pair the CANBench Duo with a CANBench TrueZ.

## References

- Jay_Diddy_B, [*5 µH LISN for spectrum-analyzer EMC/EMI work* (EEVblog forum)](https://www.eevblog.com/forum/projects/5uh-lisn-for-spectrum-analyzer-emcemi-work/)
- DIODES Incorporated, [*1N4148W-7-F SOD-123 fast switching diode*](https://www.lcsc.com/datasheet/C83528.pdf)
- Tech Public, [*TPAZ1023-02F multi-channel ESD/TVS (DFN1210-6)*](https://www.lcsc.com/datasheet/C41408050.pdf)
- HCTL, [*HC-SMA6565-13H-G SMA Female Vertical 50 Ω*](https://www.lcsc.com/datasheet/C5723200.pdf)
- IEC, *IEC 61000-4-2 — Electromagnetic compatibility (EMC) — Electrostatic discharge immunity test*
- CISPR, *CISPR 25 — Vehicles, boats and internal combustion engines — Radio disturbance characteristics — Limits and methods of measurement*

## Related pages

- [LISN Supply Path](./lisn-supply-path.md) — the LISN ladder providing the `DUT+` / `DUT−` rails being tapped by these measurement ports
- [CAN Common-Mode Port](./can-cm-port.md) — the sister measurement chain on the CAN data lines, structurally similar but with simpler clamping
- [Connectors and Mechanical](./connectors-and-mechanical.md) — SMA Female Vertical placement on the top extrusion (J2 and J4)
- [User Manual](../user-manual/index.md) — operational measurement workflow, spectrum-analyser setup, and results interpretation
