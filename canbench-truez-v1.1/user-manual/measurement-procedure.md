---
title: Measurement Procedure
hw_version: v1.1
hw_status: prototype
hw_status_label: "Fabricated prototype — sole built unit (pre-InvenTree)"
---

:::note[Hardware version]
CANBench TrueZ **v1.1** — Fabricated prototype, sole built unit. V1.1 is electrically identical to the V1.2 schematic refresh but predates the InvenTree symbol-library migration; the schematic component metadata reflects legacy SCADYS naming. Testing and bench validation reference this V1.1 hardware.

**Other versions:** [v1.2 — schematic refresh (next version)](/canbench-truez/v1.2/)
:::

Workflow for resolving a DUT's conducted-emissions signature into its common-mode and differential-mode components. Assumes the bench is cabled per [Quick Start](./quick-start.md) and the analyser is configured per [Spectrum-Analyser Setup](./spectrum-analyser-setup.md).

## 1. Validate the analyser noise floor

Terminate the analyser input directly with 50 Ω (no TrueZ connected) and sweep the band. This is your reference floor for the session — the same step as for the CANBench Duo. A higher-than-usual floor means a bad cable, a contaminated terminator, or local interference; fix it before proceeding.

## 2. Baseline (Duo powered, DUT disconnected)

With the TrueZ cabled to the Duo's two LISN outputs and the analyser on the `CM-25Ω` output (50 Ω terminator on `DM-100Ω`), apply Duo supply power with the DUT disconnected. Sweep. Peaks here come from the bench supply or the environment, not the DUT — record them as the **environmental baseline**.

## 3. Common-mode sweep

Connect the DUT and power it normally. With the analyser on `CM-25Ω` (J4) and a 50 Ω terminator on `DM-100Ω` (J5), sweep. This is the **common-mode** conducted-emissions signature — disturbance the DUT couples to both supply lines together (typically via parasitic capacitance to chassis/ground).

## 4. Differential-mode sweep

Move the analyser to `DM-100Ω` (J5) and put the 50 Ω terminator on `CM-25Ω` (J4). Sweep. This is the **differential-mode** signature — disturbance that returns line-to-line through the supply rather than via chassis coupling.

## 5. Apply the low-end correction

Below ≈ 0.5 MHz the transformers droop, so the bottom of the band reads low. Apply the TrueZ correction curve (post-processing) to the CM and DM traces before comparing absolute low-band levels. Above ~1 MHz no correction is needed for relative work. See [Tasks](../tasks.md) for the calibration-curve status.

## 6. Interpret

Compare the CM and DM traces against the baseline and against each other. Which mode dominates tells you which mitigation to reach for — see [Interpreting Results](./interpreting-results.md).

:::caution[Cable matching and 50 Ω input]
Two results invalidate the measurement: mismatched input cables (converts DM↔CM) and a non-50 Ω analyser input (breaks the CM-25Ω / DM-100Ω calibration). Confirm both before trusting a trace — see [Common Pitfalls](./common-pitfalls.md).
:::
