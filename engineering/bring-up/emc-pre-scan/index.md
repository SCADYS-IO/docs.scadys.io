---
sidebar_position: 1
title: EMC Pre-scan
sidebar_label: Overview
---

# EMC Pre-scan

The EMC pre-scan is an in-house emissions survey of a working prototype. It finds the board's main emission sources, compares them with a shipping product and tests quick fixes, so that the next board revision goes to a formal laboratory with its worst problems already addressed.

## What an in-house result can and cannot claim

The pre-scan uses a tinySA Ultra spectrum analyser. That analyser has no CISPR quasi-peak or average detector, and the antenna used has no calibrated antenna factor. No reading from the pre-scan is therefore a pass or a fail against EN 60945, CISPR 32 or any other emissions standard, and every write-up says so.

What the pre-scan does show is relative:

- which emitters dominate, and at which frequencies;
- how the board compares with a shipping, CE-marked marine display of similar class, measured the same way; and
- whether a fix lowers an emission, and by how much.

Each result is a finding that names a frequency, a source and a candidate fix. Emissions are quantified properly at a formal pre-compliance laboratory, later in the sequence below.

## Where the pre-scan sits

Scadys runs EMC work as a sequence of gates. The pre-scan covers two of them.

| Gate | Work | Exit criterion |
|---|---|---|
| G0 | Readiness: schematics, BOM, block diagram and an EMC stress firmware build | All design inputs complete |
| G1 | Power integrity: ripple at every converter output, returns and filter placement | No ripple over 100 mV peak to peak on any rail in the worst-case mode |
| G2 | Radiated survey: near-field probes, then an antenna, 30 MHz to 1 GHz, with live fixes | Top offenders found, each with at least one workable fix |
| G3 | Conducted survey: LISN on the supply, 150 kHz to 30 MHz | No large low-frequency components, and candidate fixes reduce each by at least 3 dB |
| G4 | Immunity spot checks: handheld VHF and UHF radios near cables and seams | No loss of function or reset |
| G5 | Enclosure: gasket compression and a pressure-differential bubble test | No sealing defects |
| G6 | Formal pre-compliance laboratory: radiated, conducted, ESD and burst | Failures quantified, quick fixes re-tested |
| G7 | Environmental laboratory: vibration, temperature cycling and salt mist | Pass or fail, with corrective actions |
| G8 | Final verification and technical file | Ready for conformity assessment |

The pre-scan is gates G2 and G3, run on the bench with the stress firmware from G0.

## Instruments

| Instrument | Use |
|---|---|
| tinySA Ultra | Spectrum analyser for every scan. |
| CANBench Duo | A passive dual-line DC LISN, giving one 50 Ω port per supply line. |
| CANBench TrueZ | A passive common-mode and differential-mode separator, fed from both LISN ports. |
| Twelve 50 Ω SMA terminators | One on every RF port that is not in use. |
| H-loop and E-stub near-field probes | Locating sources on the board and cables. |
| 20 dB preamplifier | Raising signals that sit near the analyser's noise floor. |
| Active antenna, 0.1 GHz to 3 GHz, on a tripod | Radiated scans at a fixed distance. |
| 12 V AGM battery | The supply for every emissions scan, because it adds no conducted noise of its own. |

The antenna's stated range starts at 100 MHz, so a radiated reading between 30 MHz and 100 MHz is outside its specification and is reported as indicative only.

## Pages in this section

1. [Stress firmware and operating modes](./stress-firmware.md)
2. [Conducted emissions](./conducted-emissions.md)
3. [Near-field source location](./near-field.md)
4. [Radiated emissions](./radiated-emissions.md)
5. [Benchmark comparison](./benchmark-comparison.md)
6. [Live fixes and recording findings](./live-fixes-and-findings.md)
