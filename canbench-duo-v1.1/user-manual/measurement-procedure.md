---
title: Measurement Procedure
hw_version: v1.1
hw_status: prototype
hw_status_label: "Fabricated prototype — sole built unit (pre-InvenTree)"
---

:::note[Hardware version]
CANBench Duo **v1.1** — Fabricated prototype, sole built unit. V1.1 is electrically identical to the V1.2 schematic refresh but predates the InvenTree symbol-library migration; the schematic component metadata reflects legacy SCADYS naming. Testing and bench validation reference this V1.1 hardware.

**Other versions:** [v1.2 — schematic refresh (next version)](/canbench-duo/v1.2/)
:::

Standard sweep workflow for characterising a DUT's conducted-emissions signature on the LISN-stabilised supply rails. Assumes the bench is set up per [Quick Start](./quick-start.md) and the analyser is configured per [Spectrum-Analyser Setup](./spectrum-analyser-setup.md).

## 1. Validate the analyser noise floor

Terminate the analyser input directly with 50 Ω (no LISN connected). Sweep the band.

Typical observed noise floor on a tinySA ULTRA:

| Attenuation | Noise floor |
|---|---|
| 20 dB | ~ −75 dBm |
| 10 dB | ~ −85 dBm |
| 0 dB | below ~ −90 dBm |

These values are normal and serve as your reference floor for the session. If your analyser shows substantially higher floor, suspect a defective cable, a contaminated terminator, or local RF interference — fix the floor before proceeding.

## 2. Baseline measurement (LISN powered, DUT disconnected)

Connect:

- analyser → `LISN+` (J2)
- 50 Ω terminator → `LISN−` (J4)
- 50 Ω terminator → `CAN CM` (J6)

Apply bench-supply power. Leave the DUT disconnected.

**Expected:** noise floor approximately equal to the analyser baseline; no significant peaks. Any large peaks here come from the bench supply or the environment, not the DUT. Note them as the **environmental baseline** — they will appear in every subsequent sweep regardless of the DUT.

## 3. DUT measurement

Connect the DUT to the DUT-side banana pair (or via the M12). Power on. Sweep.

Compare against the baseline — only DUT-dependent changes count as conducted-emissions signatures. The interpretation step (which signatures are CM vs DM, which are dominant, what they tell you about the DUT) is covered in [Interpreting Results](./interpreting-results.md).

## 4. Additional — CAN common-mode tap (J6, RF_CAN_CM)

The CAN CM port (J6) taps the CAN bus's common-mode voltage directly, via 1 kΩ matched-pair summing resistors (R38, R41) presenting 2 kΩ series differential load across the bus. Use this when the DUT has CAN connectivity and you want to characterise CAN-bus CM noise independently of the supply-rail measurement.

:::caution[The CAN CM port does not terminate the bus]
J6 is a high-impedance measurement tap. The standard 120 Ω CAN-bus termination must be provided by the DUT or the backbone. Connecting the CAN CM port to an unterminated bus will degrade signalling and produce bus errors.
:::

Workflow:

- analyser → `CAN CM` (J6)
- 50 Ω terminator → `LISN+` (J2)
- 50 Ω terminator → `LISN−` (J4)
- Ensure the DUT is connected via the M12 (J10) so the CAN-H / CAN-L pair is energised; or hand-wire the DUT's CAN bus to a backbone that includes the CANBench Duo's J10 in series.

Sweep. The result is the CAN-bus common-mode signature, which often dominates the upper-band emissions of a CAN-bus system and can be analysed independently of the supply-rail CM/DM measurement.

See [Interpreting Results](./interpreting-results.md) for the LISN+/LISN− symmetry comparison and the CANBench TrueZ CM/DM separation workflow.
