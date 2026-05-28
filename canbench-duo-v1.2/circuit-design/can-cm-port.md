---
title: CAN Common-Mode Port
hw_version: v1.2
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]
CANBench Duo **v1.2** — Fabricated prototype, testing phase.
:::

The CAN common-mode measurement port is a **high-impedance, non-terminating tap** on the CAN bus that extracts the common-mode voltage of the CAN-H / CAN-L pair and presents it as a 50 Ω signal at SMA `J6` for spectrum-analyser measurement. Common-mode disturbance often dominates the upper-band conducted-emissions signature of a CAN-bus system, and this port makes it directly measurable.

<SchematicViewer src="/img/schematics/canbench-duo-v1.2/can_cm_measurement_port_b9681fff.svg" alt="CAN common-mode port schematic (can_cm_measurement_port)" initialFocus="36 60 195 70" />

:::warning[This port does not terminate the CAN bus]
The CAN CM port is a high-impedance summing tap. The standard 120 Ω CAN-bus termination must be provided by the DUT and/or the upstream backbone. **Connecting the CAN CM port to an unterminated bus will degrade signalling and produce bus errors.** The bus-impedance perturbation when the bus is properly terminated (60 Ω each end with the standard 120 Ω terminators) is less than 3 % — negligible.
:::

## Signal flow

The CAN bus enters via pins 4 (`NET-H`) and 5 (`NET-L`) of the M12 N2K connector `J10` on the [connectors-and-mechanical](./connectors-and-mechanical.md) sheet. From there, the chain runs left-to-right along the board's central Y ≈ 90 mm axis through to the SMA `J6` at the leftmost edge.

### Stage 1 — Common-mode summing

Two equal-weight 1 kΩ thin-film resistors form the summing front-end:

- `R41` — 1 kΩ, 0603 thin-film **±0.1 %**, between `NET-H` and `RF_CAN1`
- `R38` — 1 kΩ, 0603 thin-film **±0.1 %**, between `NET-L` and `RF_CAN1`

By Kirchhoff, the voltage at the summing node `RF_CAN1` is `(V_H + V_L) / 2` — the common-mode voltage of the CAN bus. The differential-mode component (CAN-H and CAN-L moving in opposite directions, which is how the CAN bus signals data) cancels by symmetry, leaving only the common-mode content at `RF_CAN1`.

The matching tolerance between R38 and R41 bounds the **common-mode rejection ratio (CMRR)** of the front-end. With 0.1 % matched thin-film, the theoretical CMRR at DC is about 60 dB. CMRR degrades at higher frequencies because the AC-couple capacitors (next stage) are X7R ±10 % — looser matching than the resistor pair — and because PCB trace asymmetry between the NET-H and NET-L paths adds further imbalance.

### Stage 2 — AC-couple

Two parallel 100 nF capacitors block the CAN bus's DC offset (nominally 2.5 V common-mode):

- `C25` — 100 nF / 100 V X7R (0805)
- `C26` — 100 nF / 100 V X7R (0805)

Combined parallel capacitance is 200 nF. The 100 V rating leaves a huge margin over the 2.5 V CAN-bus quiescent CM and the higher transient CM voltages possible during EMC events.

### Stage 3 — Two-stage π attenuator

A two-stage π attenuator brings the common-mode amplitude down to a level safe for the spectrum-analyser input:

```
RF_CAN5 ─── R42 (68.1 Ω) ─── RF_CAN6 ─── R40 (5.1 Ω) ─── RF_CAN_CM ─── J6
                │                            │
              R46 (91 Ω)                  R47 (91 Ω)
                │                            │
              GNDREF                       GNDREF
```

All four attenuator resistors are 0.1 % thin-film for impedance precision. The combined transfer function from `RF_CAN5` to `RF_CAN_CM` (loaded with 50 Ω at the SMA) is approximately **−10 dB**, with an input impedance at `RF_CAN5` of about 48 Ω — close to the 50 Ω port target.

Note that the full transfer function from the CAN bus's common-mode voltage to the analyser SMA includes the voltage division across the 1 kΩ summing pair: the high-impedance summing front-end gives up about 21 dB on its own to avoid loading the bus, then the π attenuator adds another 10 dB, for a total of about **31 dB** from `V_CM` at the bus to the analyser. Users back-calculating bus CM levels from analyser readings should account for this.

`R40` (5.1 Ω) serves two roles: it is both the second-stage π attenuator's series element AND the current limiter between the outer and inner protection clamps in the next stage.

### Stage 4 — Multi-stage protection cascade

The protection cascade follows the same pattern as the [LISN measurement ports](./lisn-measurement-ports.md), but with **simpler 1-diode clamps at both stages** because CAN-bus signal swings are smaller than the LISN measurement-band signals — single forward V_F drops suffice without conducting at normal operating levels.

1. **Outer 1-diode bipolar clamp at `RF_CAN6`.** `D25` (cathode on RF_CAN6, anode on GNDREF) and `D26` (anode on RF_CAN6, cathode on GNDREF) — anti-parallel 1N4148W pair clamping at ±0.6 V.

2. **`R40` (5.1 Ω) current limiter.** Same R40 that is also the π-attenuator's second-stage series resistor. Limits current into the inner clamp during transient events.

3. **Inner 1-diode bipolar clamp at `RF_CAN_CM`.** `D22` and `D23` mirror the outer clamp arrangement at the SMA-output net.

4. **Integrated TVS `D24`.** Tech Public TPAZ1023-02F — same part used on the LISN measurement ports. Only Channel 1 populated; pin 1 to `RF_CAN_CM`, pin 3 to GNDREF, pins 2/4/5/6 are deliberately left unconnected for minimum parasitic capacitance.

### Stage 5 — SMA output

`RF_CAN_CM` connects to `J6` (SMA Female Vertical, 50 Ω) at the top extrusion. `R43` (1 MΩ) ties `RF_CAN_CM` to GNDREF as a defined DC reference at the SMA when no analyser is connected.

## Operating envelope

Design intent — calculated in `performance_review/can-cm-port.md` against V1.2 BOM specs.

| Parameter | Target | Status |
| --- | --- | --- |
| Measurement band | 150 kHz – 108 MHz (CISPR 25) | Topology supports |
| Source impedance to analyser | 50 Ω | Network input impedance ≈ 48 Ω at LF |
| Added attenuation (π stage) | ≈ 10 dB | Two-stage π attenuator nominal |
| Total bus-to-SMA transfer | ≈ −31.5 dB at LF | 21 dB summing front-end loss + 10 dB attenuator |
| DC voltage block | up to 100 V | C25 / C26 100 V rating; CAN bus quiescent CM is 2.5 V |
| CMRR at DC | ≈ 60 dB | Bounded by R38 / R41 0.1 % matching |
| CMRR at 1 MHz | ~ 40 dB | Limited by C25 / C26 X7R ±10 % matching |
| CMRR at 108 MHz | < 30 dB | Limited by PCB trace asymmetry between NET-H and NET-L paths |
| CAN bus impedance perturbation | < 3 % | 2 kΩ inter-line load vs 60 Ω parallel terminators |
| Stray Cj at SMA output | ≈ 4.3 pF | Same as LISN measurement ports |

The CMRR vs frequency curve is bounded analytically here; SPICE / VNA characterisation on the as-built V1.2 board would close the analytical bound with measurement. The dominant HF limitation is the AC-couple capacitor matching (X7R ±10 %), not the matched-pair resistor front-end.

:::warning[Not for ISO 7637-2 transient testing]
Same scope clarification as the LISN measurement ports — this is a passive measurement instrument, not a transient-injection compliance test fixture.
:::

## PCB layout notes

The CAN CM port components sit in a single left-to-right cascade along the board's Y ≈ 90 mm axis — between the upper (LISN+) and lower (LISN−) measurement ports.

The dominant layout constraint is the **symmetric placement of R38 and R41**. The CAN CM port's CMRR depends critically on matched-length trace geometry from CAN-H and CAN-L (at J10's pins 4 and 5) to the summing node `RF_CAN1` (at R38 / R41's `RF_CAN1` pads). Even a millimetre of length asymmetry between the NET-H and NET-L traces translates to a CMRR penalty at higher frequencies. The V1.1 layout places R38 and R41 at the same X coordinate with a 1.6 mm Y spacing about the Y = 90 mm axis — supporting symmetric routing in principle. NET-H has 4 F.Cu segments and NET-L has 2 in the as-built layout; a future revision could re-route for closer length matching.

The protection cascade follows the same component-island pattern as the LISN measurement ports: clamp diode pairs as compact 2-component islands at their respective nodes, TPAZ1023 placed within 2.5 mm of the SMA centre pin, F.Cu coplanar ground pour around the RF traces.

`R40` (5.1 Ω, 0603 thick-film AC0603) is the only thick-film resistor in the RF path. The rest of the chain uses YAGEO RT-series thin-film at 0.1 % tolerance. R40 only conducts during clamp events; the thick-film tolerance (±1 %, ±200 ppm/°C) is acceptable for the current-limiter role.

See `pcb_review/can-cm-port-layout.md` in the source repository for the per-component coordinate table.

## Related pages

- [LISN Measurement Ports](./lisn-measurement-ports.md) — the sister RF measurement chain; topologically similar but with 2-diode-series outer clamps for the higher LISN measurement-band amplitudes
- [LISN Supply Path](./lisn-supply-path.md) — the LISN ladder also delivers DC supply to the DUT via the M12 N2K connector (J10 pin 2 / pin 3); the CAN-H / CAN-L lines (pins 4 / 5) tapped here arrive on the same connector
- [Connectors and Mechanical](./connectors-and-mechanical.md) — J10 M12 N2K pin map (Shield, NET-S, NET-C, CAN-H, CAN-L) and J6 SMA placement on the top extrusion
- [Quick Reference](../quick-reference.md) — operational measurement workflow including the "external 120 Ω termination required" caveat
