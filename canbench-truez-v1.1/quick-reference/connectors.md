---
title: External Connectors
hw_version: v1.1
hw_status: prototype
hw_status_label: "Fabricated prototype — sole built unit (pre-InvenTree)"
---

:::note[Hardware version]
CANBench TrueZ **v1.1** — Fabricated prototype, sole built unit. V1.1 is electrically identical to the V1.2 schematic refresh but predates the InvenTree symbol-library migration; the schematic component metadata reflects legacy SCADYS naming. Testing and bench validation reference this V1.1 hardware.

**Other versions:** [v1.2 — schematic refresh (next version)](/canbench-truez/v1.2/)
:::

Five external connections: two SMA inputs, two SMA outputs, one ground banana. All RF ports are 50 Ω.

| Refdes | Type | Faceplate label | Direction | Net | Role |
|---|---|---|---|---|---|
| J2 | Edge SMA, 50 Ω | **LISN+** | Input | `RF_LISN_LINE+` | Positive LISN line from the CANBench Duo |
| J3 | Edge SMA, 50 Ω | **LISN−** | Input | `RF_LISN_LINE−` | Negative LISN line from the CANBench Duo |
| J4 | Edge SMA, 50 Ω | **CM-25Ω** | Output | `RF_LISN_CM` | Common-mode component to the analyser |
| J5 | Edge SMA, 50 Ω | **DM-100Ω** | Output | `RF_LISN_DM` | Differential-mode component to the analyser |
| J1 | Keystone 1211 banana | — | Ground | `GNDREF` | Measurement ground reference |

**Cabling:** drive J2/J3 from the CANBench Duo's two LISN-output SMAs with two identical cables (matched length). Connect one output (J4 *or* J5) at a time to the analyser's 50 Ω input. The CM-25Ω / DM-100Ω impedance labels are valid only with a 50 Ω analyser input.

For the connector design rationale and the silkscreen markings, see [Circuit Design → Connectors & Markings](../circuit-design/connectors.md).
