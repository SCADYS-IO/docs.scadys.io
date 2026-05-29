---
title: Spectrum-Analyser Setup
hw_version: v1.1
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
---

:::note[Hardware version]
CANBench TrueZ **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-truez/v1.1/)
:::

The TrueZ presents a 50 Ω source at each output across the conducted-emissions band. Any analyser that covers the band and accepts a 50 Ω input will work. The analyser configuration is the same as for the [CANBench Duo](/canbench-duo/v1.1/user-manual/spectrum-analyser-setup) — only the impedance requirement is stricter.

:::warning[The analyser input must be 50 Ω]
The faceplate measurement conditions — **CM-25Ω** (49.9 Ω shunt in parallel with the analyser's 50 Ω) and **DM-100Ω** (49.9 Ω series with the analyser's 50 Ω) — are defined for a **50 Ω analyser input**. A high-impedance oscilloscope input, or an analyser switched to 1 MΩ, changes the loading and invalidates the calibration. Confirm 50 Ω before measuring.
:::

## General configuration (any analyser)

| Parameter | Value |
|---|---|
| Input impedance | 50 Ω (mandatory) |
| Start frequency | 150 kHz (CISPR 25 low edge) |
| Stop frequency | 30 MHz for routine work; 108 MHz for the full CISPR 25 band |
| Detector | Peak (Max-hold for time-varying disturbances) |
| Reference level | Adjust per analyser; typical −60 dBm to −20 dBm |
| Attenuation | 10 dB starting point |
| RBW | 9 kHz (150 kHz – 30 MHz) / 120 kHz (30 – 108 MHz) for CISPR-aligned work; otherwise auto |
| LNA / preamp | OFF for normal signal levels |

## Low-frequency correction

The TC1-1-13M+ transformers droop below ≈ 0.5 MHz, so readings at the bottom of the CISPR conducted band (150 kHz upward) read low until corrected. Apply the TrueZ low-end **correction curve** in post-processing (a one-time curve characterised from a golden prototype; see [Tasks](../tasks.md) for the calibration status). Above ~1 MHz the transformer response is flat and no correction is needed for relative measurements.

## tinySA ULTRA (recommended)

The tinySA ULTRA is the analyser SCADYS uses for engineering validation. Use the General configuration above; set the input to 50 Ω, Peak detector, LNA off, 10 dB attenuation as a starting point, and extend the stop frequency to 108 MHz for the full band.

See [Measurement Procedure](./measurement-procedure.md) for the sweep workflow.
