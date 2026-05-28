---
title: LISN Supply Path
hw_version: v1.2
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]
CANBench Duo **v1.2** — Fabricated prototype, testing phase. The LISN supply path topology is identical to V1.1 (the fabricated hardware); V1.2 is the InvenTree-canonical schematic revision.
:::

<SchematicViewer src="/img/schematics/canbench-duo-v1.2/lisn_supply_path_4334ab46.svg" alt="LISN Supply Path schematic (lisn_supply_path)" />

The LISN supply path is the four-stage passive front-end of the CANBench Duo. It implements a **CISPR 25-style dual-line 5 µH artificial network** for DC conducted-emissions measurement. The path takes a bench DC supply at the SOURCE banana sockets, delivers a filtered RF-stabilised copy of that supply to the DUT banana sockets, and presents a stable mostly-inductive source impedance to the DUT across the CISPR 25 measurement band (150 kHz to 108 MHz).

The entire stage is passive and bidirectional with respect to RF currents. There is no MCU, no firmware, no switching converter — only fuses, MOSFETs, diodes, ferrite beads, inductors, capacitors, and resistors.

## Signal flow

Power flows in four stages from the bench-supply input on the front faceplate to the DUT-side banana pair at the back faceplate.

### Stage 1 — Protection

The positive rail enters from `J5` (SRC+) and is fused immediately by `F1`, a 5 A Littelfuse Nano2 Slo-Blo in an OMNI-BLOK 154 series holder. The post-fuse net is clamped by `D3` (SMCJ58CA, 58 V bidirectional TVS) to GNDREF. The negative rail (`J7`, SRC−) has its own TVS `D4` directly to GNDREF.

Each rail then passes through a MOSFET acting as a reverse-polarity protection switch:

- `Q2` — VBsemi SUD50P08 (P-channel TO-252, V_DSS = 100 V) on the positive rail, drain on the post-fuse net, source on `VSS+`
- `Q3` — STMicroelectronics STD80N10F7 (N-channel TO-252, V_DSS = 100 V) on the negative rail, drain on `SUPPLY−`, source on `VSS−`

The gate bias uses a discrete self-biased scheme: each FET's gate sits on a 10:1 divider (a 1 MΩ resistor from gate to source — `R5`/`R13` — and a 100 kΩ resistor from gate to the opposite rail — `R7`/`R15`). A 47 Ω stopper (`R4`/`R12`) sits between the divider node and the gate to suppress oscillation. With correct polarity at SOURCE, the divider pulls each gate well past V_th toward the opposite rail (about −12 V for Q2, +12 V for Q3 at a 13 V CAN supply), turning the FETs hard on. With reversed polarity, both FETs sit at V_GS ≈ 0 V and only the body diodes can conduct — and they are oriented to block reverse current.

A 15 V Zener (`D2` for Q2, `D5` for Q3) clamps each FET's V_GS to a safe value against supply transients.

**Why the VBsemi SUD50P08 100 V variant rather than the original Vishay 80 V part?** Margin. The SMCJ58CA TVS clamps at 93.6 V peak during an ESD event. The 100 V V_DSS rating gives 6.8 % margin to the clamp voltage. The Vishay 80 V variant would have exceeded the rating by 17 % which is not acceptable for repeated events.

### Stage 2 — Ferrite filter

Each post-protection rail (`VSS+`, `VSS−`) passes through a 30 Ω @ 100 MHz power ferrite bead (`FB1` upper, `FB2` lower — muRata BLE32PN300SN1L, R_DC = 1.6 mΩ). The ferrites couple in series and present a frequency-dependent loss that decouples the DUT's RF disturbance behaviour from the upstream bench supply's source impedance — a fundamental LISN function.

At the ladder entry, both rails carry an identical **three-decade shunt stack to GNDREF**:

- A **22 µF X7R bulk reservoir** (`C3` / `C10`, PSA Prosperity Dielectrics 2220), damped through a **1.2 Ω series resistor** (`R39` / `R44`) to prevent it from forming a high-Q tank with the upstream impedance. V1.0 of the design used a Panasonic FK electrolytic at this position whose intrinsic ESR provided the damping; V1.1 swapped to a higher-stability MLCC and added the explicit damping resistor.
- **2.2 µF X7R** (`C1` / `C8`) and **100 nF X7R** (`C2` / `C9`) MLCCs, undamped — providing mid-band and HF decoupling.
- Bleed resistors `R6` / `R14` (100 kΩ from VSF± to GNDREF) provide a high-impedance discharge path when SOURCE is removed.

The post-ferrite rails (`VSF+`, `VSF−`) are the actual LISN-ladder inputs.

### Stage 3 — 5 µH LISN ladder

Each rail then passes through a five-stage LC ladder with Q-damped shunt caps at each intermediate node. The upper rail is:

```
VSF+ → L1 → C4 (220 nF, damped by R8 = 10 Ω) → L2 → C5 (33 pF, damped by R9 = 470 Ω) → L3 → … → L5 → DUT+
```

Each series inductor is identical: 1 µH / 7 mΩ DCR (Shouhan CYA0630-1.0UH, rated 12 A saturation). Five series 1 µH per rail = **5 µH total**, matching the CISPR 25 artificial-network target.

The **frequency-staggered Q-damping** is the standout feature of this design. Each shunt cap has a different RC corner determined by its series damping resistor:

| Ladder node | Cap | Damper | RC corner | Role |
| --- | --- | --- | --- | --- |
| Between L1 and L2 | C4 (220 nF) | R8 (10 Ω) | 72 kHz | Bulk shunt; kicks in below the LISN band edge |
| Between L3 and L4 | C5 (33 pF) | R9 (470 Ω) | 10 MHz | Mid-band ringing damper |
| At DUT+ output | C6 (1 nF) | R10‖R11 (0.34 Ω) | ~ 470 MHz | HF ringing damper at the DUT-facing end |

The deliberate frequency stagger avoids the impedance peaks that an undamped multi-stage ladder would exhibit between the ladder's natural resonances. The result is a smooth band-wide impedance curve, ideal for repeatable conducted-emissions measurement.

A 33 pF C0G shunt (`C7`) sits at the DUT+ output direct-to-GNDREF (no series damper), providing the final fast HF roll-off at the DUT-facing end.

The lower rail is structurally identical with `L6`–`L10`, `C11`/`R16`, `C12`/`R17`, `C13`/`R18‖R19`, `C14`.

### Stage 4 — Output to DUT

`L5` and `L10` hand off directly to `DUT+` and `DUT−`, which leave this sheet on global labels and reach the DUT banana sockets (`J1`, `J3`) on the [connectors-and-mechanical](./connectors-and-mechanical.md) sheet, and also pin 2 / pin 3 of the M12 N2K connector (`J10`).

The `DUT+` and `DUT−` outputs are also the **RF tap points** feeding the downstream [LISN measurement-port](./lisn-measurement-ports.md) sheets. The measurement-port chain AC-couples from these nets via three parallel capacitors (`C15+C18+C19` on the upper rail, `C20+C23+C24` on the lower) and presents the RF disturbance signal at SMA outputs `J2` (RF_LISN_P) and `J4` (RF_LISN_N). This is the standard CISPR LISN measurement geometry — the measurement port samples the RF voltage at the DUT-side rail, where the DUT's disturbance currents flow.

## Operating envelope

The values below are design intent, calculated against V1.2 actual component datasheet specs in `performance_review/lisn-supply-path.md`. Empirical confirmation via thermal and VNA testing on the V1.1 hardware is pending.

| Parameter | Condition | Limit / spec | Notes |
| --- | --- | --- | --- |
| Operating input voltage (continuous) | DC bench use | 9–48 V | TVS clamps remain non-conductive; all downstream parts ≥ 100 V rated |
| Absolute continuous input ceiling | DC bench use | ≤ 55 V | Above ~ 55–58 V the SMCJ58CA TVS begins to conduct |
| ESD / benign surge tolerance | Fast transients on SRC posts | Clamped by D3 / D4 | For bench mishaps; **not** ISO 7637-2 load-dump absorption |
| Continuous current (as built) | 25 °C ambient | 4.0 A | Comfortable thermal margin |
| Continuous current (warm ambient) | 40 °C ambient | 3.0 A | ≈ 1 A derate for fuse + bead temperature rise |
| Short surge current | ≤ 10 ms, single shot | up to 10 A | Time-lag fuse rides through |
| Extended surge current | ≤ 100 ms, single shot | up to 6 A | Low duty cycle to prevent heat soak |
| DC path drop at 4 A bench-to-DUT | Calculated | ≈ 0.47 V | Dominated by the LISN ladder R_DC contribution |
| Total board dissipation at 4 A | Calculated | ≈ 2.0 W | 56 % in the LISN ladder inductors |
| Inductor saturation | Steady or surge | ≥ 12 A per inductor | The 1 µH parts are **not** the continuous-current bottleneck |

For the full breakdown of component-level dissipations, gate-bias divider analysis, TVS-vs-MOSFET margin, and continuous-current limiting factors, see `performance_review/lisn-supply-path.md` in the source repository.

:::warning[Not for ISO 7637-2 transient testing]
The TVS clamp at 93.6 V is appropriate for ESD events and bench-class transients. ISO 7637-2 Pulse 5a/5b (load dump, 100–120 V sustained) would exceed the MOSFET V_DSS regardless of TVS behaviour. Do **not** use the CANBench Duo as a transient-injection compliance test fixture.
:::

## PCB layout notes

The supply chain is laid out **left-to-right** across the V1.1 PCB, signal-flow order matching the schematic. Specific layout choices worth calling out:

- The **protection cluster** (F1, D3, Q2 on the upper rail; D4, Q3 on the lower) sits near the SRC banana entry at the board's left edge (X ≈ 80–90 mm). The loop area is moderate (~ 150–200 mm²) — sufficient for the bench-class transient response targeted; not minimised because the LISN signal-flow direction makes a tighter loop awkward.
- The **gate-mesh islands** (the 1 MΩ + 100 kΩ + 47 Ω + 15 V Zener cluster around each FET's gate-source pins) are placed as compact 4-component islands per FET. The high-impedance gate net `Net-(Q2-G)` shows just three F.Cu segments — short, clean, away from the high-current source traces.
- The **LISN ladder** (L1–L5 upper, L6–L10 lower) is a straight horizontal chain at 9 mm uniform spacing, mirror-symmetric across the board's Y = 90 mm axis. Each chain is 36 mm long total.
- The **damping-resistor row** sits below the upper ladder (Y = 107.25 mm) and above the lower ladder (Y = 72.75 mm), parallel to the ladder, with R10 + R11 (and R18 + R19) stacked as parallel pairs for the 0.34 Ω total at the C6 / C13 shunt nodes.
- The **C3 + R39 bulk-reservoir cluster** sits at the VSF+ entry (X ≈ 100.7 mm) with R39 collocated 6 mm vertically from C3, both on a narrow PCB strip. The mirror C10 + R44 sits at the VSF− entry.
- **GNDREF continuity beneath the ladder** is preserved by the B.Cu flood — no moats, no splits in the ground plane under the LISN region. The F.Cu islands provide local return references for individual filter components without disturbing the B.Cu reference plane.

See `pcb_review/lisn-supply-path-layout.md` in the source repository for the full per-component coordinate table and verification against the schema-review's layout requirements.

## Design provenance

This LISN topology follows Jay_Diddy_B's EEVblog 5 µH LISN reference design. The key inherited choices:

- 5-section 1 µH ladder rather than a single 5 µH inductor — pushes each coil's self-resonance higher and spreads parasitics along the line, giving a flatter impedance vs. frequency than a lumped 5 µH would.
- Frequency-staggered damping at the ladder shunt-cap nodes — controlled-Q damping at each natural ladder resonance.
- F.Cu DC-filter islands + minimised pad sizes — parasitic-capacitance minimisation, keeping the ladder's HF behaviour clean.
- Self-driven ideal-diode reverse-polarity protection with discrete passive gate bias — lower BOM than an ideal-diode IC, with better margin to the TVS clamp voltage given the 100 V VBsemi FET variant chosen here.

## Related pages

- [LISN Measurement Ports](./lisn-measurement-ports.md) — the RF tap chains hanging off `DUT+` / `DUT−`
- [Power Indicator LED](./power-indicator-led.md) — the front-panel state-encoder LED whose colours decode the supply-chain health
- [Connectors and Mechanical](./connectors-and-mechanical.md) — the bench-side and DUT-side banana sockets feeding and feeding from this circuit
- [Circuit Design overview](./index.md) — the system architecture
