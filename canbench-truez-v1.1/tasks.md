---
title: Tasks
hw_version: v1.1
hw_status: prototype
hw_status_label: "Fabricated prototype — sole built unit (pre-InvenTree)"
---

:::note[Hardware version]
CANBench TrueZ **v1.1** — Fabricated prototype, sole built unit. V1.1 is electrically identical to the V1.2 schematic refresh but predates the InvenTree symbol-library migration; the schematic component metadata reflects legacy SCADYS naming. Testing and bench validation reference this V1.1 hardware.

**Other versions:** [v1.2 — schematic refresh (next version)](/canbench-truez/v1.2/)
:::

Outstanding validation and clean-up work for the CANBench TrueZ, derived from the schematic / PCB / performance review evidence.

## Validation (measurement)

| Task | Why |
|---|---|
| **Golden-prototype VNA / tracking-generator sweep** | Replace the simulated correction curve with measured CM and DM transfer + cross-mode leakage across 150 kHz – 108 MHz. This is the headline outstanding item — the low-end correction is currently modelled, not measured. |
| **Confirm CPWG Z₀** | The RF traces target ≈ 50 Ω (1.0 mm trace / 0.2 mm gap on 1.6 mm FR-4, design estimate ≈ 50–52 Ω). Confirm with a field solver or TDR. |
| **Confirm cross-mode isolation** | Measure the CM↔DM isolation against the transformer-balance floor (0.5 dB amplitude, 2° phase typ). |

## Marking / artwork (before next fabrication)

| Task | Detail |
|---|---|
| Reconcile PCB version / variant strings | The PCB part number (`0C-1.1 … GRN`), the S1 silk stamp (`0C-1.2-SMA`), and the SKU comment (`…-BLK-A`) disagree — settle one version/variant before production artwork. |
| Fix the QR-code domain | Silk QR reads `docs.scadys.com`; the live domain is `docs.scadys.io`. |
| Resolve the S1/S6 silk courtyard overlap | DRC flags the PCB-version and Copyright marking footprints overlapping at one point (cosmetic). |
| Update the PCB title block | The `.kicad_pcb` title block still reads "CANBus LISN and CM Monitor" (CANBench-Duo clone title); update to "CANBench TrueZ CM/DM Noise Splitter" to match the schematic. |

## Notes

- DRC on the V1.1 board is otherwise clean (0 unconnected, 0 schematic-parity); the single violation is the cosmetic silk overlap above.
- TrueZ is fully passive — no firmware, no power-rail or thermal validation applies.
