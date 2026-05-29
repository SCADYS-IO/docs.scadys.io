---
title: Interpreting Results
hw_version: v1.1
hw_status: prototype
hw_status_label: "Fabricated prototype — sole built unit (pre-InvenTree)"
---

:::note[Hardware version]
CANBench Duo **v1.1** — Fabricated prototype, sole built unit. V1.1 is electrically identical to the V1.2 schematic refresh but predates the InvenTree symbol-library migration; the schematic component metadata reflects legacy SCADYS naming. Testing and bench validation reference this V1.1 hardware.

**Other versions:** [v1.2 — schematic refresh (next version)](/canbench-duo/v1.2/)
:::

Once you have a clean measurement set per the [Measurement Procedure](./measurement-procedure.md), the next step is reading the trace. The CANBench Duo's LISN topology lets you make a small number of useful distinctions about what the DUT is emitting.

## Baseline vs DUT

The **environmental baseline** (LISN powered, DUT disconnected — step 2 of the measurement procedure) is your reference for the session. Anything that appears in both the baseline and the DUT trace is coming from the bench supply, the ambient RF environment, or the analyser itself — *not* from the DUT.

The **DUT-specific signature** is the difference. Peaks present in the DUT trace but absent in the baseline are the DUT's conducted emissions. Magnitude shifts (e.g. a baseline peak that grows by 20 dB when the DUT is on) usually indicate the DUT is exciting an environmental resonance, not generating a new one.

## LISN+ / LISN− symmetry comparison

The CANBench Duo's two LISN measurement ports tap the upper rail (`LISN+`, J2) and the lower rail (`LISN−`, J4) of the supply. With a fully symmetric DUT, the two ports should show **identical signatures** in both magnitude and shape.

Compare the two:

| Observation | Interpretation |
|---|---|
| Similar signatures on both rails | Likely **common-mode (CM) dominant** — the DUT is coupling disturbance to both rails together (typically via parasitic capacitance to chassis or local ground). |
| Asymmetric signatures (different on each rail) | **Differential-mode (DM) content present** — the DUT is generating distinct switching activity that returns through the LISN ladder rather than via chassis coupling. |
| One rail much hotter than the other | DUT power topology is asymmetric (e.g. a buck converter whose switching node is on one rail only), OR a wiring fault is concentrating return current on one side. |

The simplest way to do this comparison is to sweep `LISN+` with `LISN−` terminated in 50 Ω, save the trace, then swap (sweep `LISN−` with `LISN+` terminated) and overlay.

## CM / DM separation via CANBench TrueZ

For more precise CM/DM resolution, pair the CANBench Duo with a **CANBench TrueZ** (the companion product). The TrueZ accepts both LISN rails as inputs and resolves them into separate CM and DM outputs:

```
LISN+ → TrueZ +
LISN− → TrueZ −
analyser → TrueZ CM (or TrueZ DM)
50 Ω terminator → the unused TrueZ output
```

This gives a clean, single-trace measurement of CM-only and DM-only content respectively, which is much easier to compare against limit lines than the rail-by-rail measurement.

## CAN common-mode interpretation

The CAN-CM port (J6, when used per the [Measurement Procedure](./measurement-procedure.md) §4) gives you the CAN bus's common-mode voltage at the SMA output via a 1 kΩ matched-pair summing tap. Read this trace as the CAN-bus-specific CM disturbance, distinct from supply-rail CM. The two are typically driven by different mechanisms in the DUT — supply CM comes from switching converters, CAN CM comes from the transceiver's transmit slew + bus impedance imbalance.

## What "pre-compliance" means

The CANBench Duo is a **pre-compliance** instrument. It will tell you:

- Whether your DUT has obvious conducted-emissions problems before you book a compliance test lab.
- Where in the band the worst offenders live, so you can target filter changes.
- How architectural changes (different filter topology, different switching frequency, etc.) compare against each other in relative terms.

It will NOT tell you:

- Whether your DUT passes CISPR 25 at a specific class limit — that requires a calibrated chain, a Quasi-Peak detector at the prescribed RBWs, and (typically) an accredited lab.
- Whether your DUT meets a radiated-emissions limit — this is conducted only.
- Absolute amplitude accuracy beyond the typical ±1–2 dB of the analyser plus the CANBench Duo's measurement-port attenuation tolerance.

Treat CANBench Duo measurements as **engineering data**, not as a compliance verdict.

## References

- IEC, [*CISPR 25: Vehicles, boats and internal combustion engines — Radio disturbance characteristics*](https://webstore.iec.ch/publication/7077) — the measurement-band and limit-line framework the CANBench Duo's design aligns to.
- For the engineering rationale of the LISN topology that makes these distinctions possible, see [LISN Measurement Ports](../circuit-design/lisn-measurement-ports.md) and [LISN Supply Path](../circuit-design/lisn-supply-path.md) in the Circuit Design section.
