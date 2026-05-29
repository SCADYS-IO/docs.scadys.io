---
title: Interpreting Results
hw_version: v1.1
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
---

:::note[Hardware version]
CANBench TrueZ **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.

**Other versions:** [v1.1 — fabricated prototype (current)](/canbench-truez/v1.1/)
:::

The whole point of the TrueZ is to answer one question: **is the DUT's conducted noise mainly common-mode or differential-mode?** The answer tells you which mitigation to reach for, instead of guessing.

## Reading the CM vs DM split

Overlay the `CM-25Ω` and `DM-100Ω` traces (both corrected for the low-end droop). For each problem peak, note which mode dominates:

| Dominant mode | What it means | Typical source in the DUT |
|---|---|---|
| **Common-mode** (CM trace higher) | Disturbance couples to both supply lines together, returning via chassis / earth | Parasitic capacitance from a switching node to chassis; cable-to-ground coupling; transceiver slew driving the bus against ground |
| **Differential-mode** (DM trace higher) | Disturbance flows line-to-line, returning through the supply pair | Switching-converter ripple on the supply rails; ground-bounce between the two rails |
| **Both comparable** | Mixed mechanism, or a mode-conversion path between them | Asymmetric layout / harness converting one mode to the other |

## Choosing the mitigation

Match the fix to the dominant mode:

| If CM-dominant | If DM-dominant |
|---|---|
| Common-mode choke on the supply / bus pair | Differential (line-to-line) LC or π filter |
| Ferrite clamp / sleeve on the cable | X-capacitor across the rails near the source |
| Improve chassis bonding / reduce the parasitic-C path to ground | Reduce the switching-loop area at the converter |
| Shielding; reduce switch-node-to-chassis coupling | Reroute the harness to shorten the differential return |

After applying a candidate fix, re-sweep both modes and compare against the previous set — the value of the TrueZ is the **relative** before/after comparison, which directly shows whether the mitigation worked on the mode you targeted.

## What "pre-compliance" means

The TrueZ + CANBench Duo chain is a **pre-compliance / diagnostic** setup. It will tell you which mode dominates, where in the band the offenders live, and whether a mitigation helped — in relative terms. It will **not** give a certified CISPR 25 pass/fail (that needs a calibrated chain, a Quasi-Peak detector at the prescribed RBWs, and an accredited lab). Treat the traces as engineering data, not a compliance verdict.

## References

- J. Wang, F. C. Lee, W. Odendaal, *Characterization, Evaluation, and Design of Noise Separator for Conducted EMI Noise Diagnosis*, IEEE TPE 20(4), 2005 — the CM/DM separation method.
- IEC, [*CISPR 25*](https://webstore.iec.ch/publication/7077) — the conducted-emissions measurement framework.
- For the topology that makes the split possible, see [Circuit Design → CM & DM Separator](../circuit-design/cm-dm.md).
