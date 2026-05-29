---
title: Spectrum-Analyser Setup
hw_version: v1.2
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
---

:::note[Hardware version]
CANBench Duo **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.
:::

The CANBench Duo presents a 50 Ω source at each SMA output across the CISPR 25 measurement band (150 kHz – 108 MHz). Any spectrum analyser that covers this band and accepts a 50 Ω input will work; the differences are in resolution, dynamic range, and ergonomics.

## General configuration (any analyser)

These are the parameters to set regardless of which analyser you have:

| Parameter | Value |
|---|---|
| Input impedance | 50 Ω |
| Start frequency | 150 kHz (CISPR 25 low edge) |
| Stop frequency | 30 MHz for routine work; 108 MHz for full CISPR 25 band |
| Detector | Peak (Max-hold for time-varying disturbances) |
| Reference level | Adjust per analyser; typical −60 dBm to −20 dBm |
| Attenuation | 10 dB starting point — see notes below |
| Resolution bandwidth (RBW) | Per CISPR 25 (9 kHz for 150 kHz – 30 MHz; 120 kHz for 30 – 108 MHz) where formal compliance is the goal; otherwise match the analyser's auto-RBW |
| Averaging | Off for peak detection; enable for stable noise-floor comparisons |

**Attenuation notes:**
- Each CANBench Duo measurement port has built-in attenuation of ≈ 10 dB. Account for this in your reference-level / amplitude calculations.
- Start with **10 dB analyser attenuation** to leave headroom for transients.
- Drop to **0 dB** only after confirming the input signal will not exceed the analyser's first-mixer compression point (typically +10 dBm at the analyser's input — well above anything the CANBench Duo's protection cascade lets through under normal operation).

**LNA / preamplifier:** OFF for the CANBench Duo's typical −60 dBm to −90 dBm signal range. Only enable if you need to characterise the analyser's own noise floor with the LISN unpowered.

## tinySA ULTRA (recommended)

The tinySA ULTRA is the analyser used by SCADYS for engineering validation. It is inexpensive, portable, and adequate for conducted-emissions characterisation work below the formal compliance level.

Recommended baseline:

| Setting | Value |
|---|---|
| Mode | Spectrum Analyzer |
| Start Frequency | 150 kHz |
| Stop Frequency | 30 MHz (extend to 108 MHz for full CISPR 25 band) |
| Detector | Peak |
| LNA | OFF |
| Attenuation | Manual |
| Initial Attenuation | 10 dB |
| Vertical Scale | Fixed |
| Typical Range | −60 dBm to −100 dBm |

For higher-resolution work near the noise floor, drop the attenuation and add averaging. For routine pre-compliance sweeps, the table above is a good starting point.

## Other analysers

The CANBench Duo's signal levels and frequency band are within the working range of practically any modern spectrum analyser — Rigol DSA / RSA series, Siglent SSA, Keysight FieldFox, Tektronix RSA, R&S FSC / FPC, etc. For these:

- Use the **General configuration** table above as a starting point.
- For **formal CISPR 25 compliance work**, you also need the prescribed RBW values (9 kHz / 120 kHz), a Quasi-Peak detector option, and a calibrated RF chain — the CANBench Duo is a **pre-compliance** instrument, not a substitute for a certified compliance setup.
- For **EMI receivers** with built-in CISPR 25 measurement templates, configure the receiver to drive the SMA input directly and let the receiver handle the band sequencing.

## What the CANBench Duo does NOT do

- It does not amplify. Maximum useful sensitivity is the analyser's noise floor minus the CANBench Duo's ≈ 10 dB attenuation.
- It does not provide quasi-peak detection — that lives in the analyser.
- It does not auto-sequence the CISPR 25 sub-bands — you (or the analyser) drive the sweep configuration.

See [Measurement Procedure](./measurement-procedure.md) for the step-by-step sweep workflow.
