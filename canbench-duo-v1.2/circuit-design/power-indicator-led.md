---
title: Power Indicator LED
hw_version: v1.2
hw_status: schematic
hw_status_label: "Next-version schematic — InvenTree refresh of V1.1"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]
CANBench Duo **v1.2** — Schematic-stage refresh of the V1.1 fabricated prototype. V1.2 is electrically identical to V1.1 and carries the InvenTree-canonical component metadata; no V1.2 boards exist yet — testing and bring-up reference the V1.1 hardware.
:::

A single XL-5050RGBC three-die RGB LED on the top extrusion encodes four supply-chain states. The encoding is entirely topological — there is no MCU, no firmware, no software. Each colour falls out of the rail relationships in the LISN supply-path protection chain.

<SchematicViewer src="/img/schematics/canbench-duo-v1.2/power_indicator_led_9ffed5e0.svg" alt="Power Indicator LED schematic (power_indicator_led)" initialFocus="103 46 54 60" />

## State table

| Indicator | Condition | What it means | What to do |
| --- | --- | --- | --- |
| **Off** | No bench-supply voltage | The bench supply is not connected, the supply is set to 0 V, or the supply cable to the SRC sockets is open. | Check the bench supply is on and wired to the SRC banana pair (front faceplate). |
| **Green** | Correct polarity, both protection FETs conducting, F1 intact | Normal operation. LISN delivers the filtered supply to the DUT bananas (J1 / J3) and the M12 N2K connector (J10). | Proceed with measurement. |
| **Blue** | Q2 protection FET not fully conducting — typically because F1 has blown | A DUT-side over-current event has usually blown the SRC+ rail's 5 A Nano2 Slo-Blo fuse, depriving the upstream P-FET (Q2) of its drain reference. The bench supply is still present at the SRC pair; the DUT pair is dead. A brief Blue flash at supply turn-on (see below) is a separate, benign variant of the same mechanism. | Power the bench supply down. Remove the DUT. Replace F1. If the LED stays Blue with no DUT attached after a fresh fuse, suspect Q2. Investigate the DUT for an over-current condition before reconnecting. |
| **Red** | Reverse polarity at the SRC pair | The bench supply cables are reversed at the SRC banana pair — V_BLACK > V_RED. The internal protection FETs prevent current flow downstream, so the DUT pair is not energised. | Power the bench supply down. Reverse the SRC cables to the correct RED-to-`SUPPLY+`, BLACK-to-`SUPPLY−` orientation. |

A brief Blue flash for ~ ms at supply turn-on is normal and benign — Q2's gate-bias divider takes a few RC time constants to bring Q2 fully ON, and during that interval V(SUPPLY+) − V(VSS+) momentarily exceeds Q1's V_BE threshold. The LED settles to Green once Q2 reaches full conduction.

The LED is visible through the top extrusion of the YG-H10A enclosure (see `render_1.PNG` and `render_2.PNG` on the [Connectors & Mechanical](./connectors-and-mechanical.md) page), so a technician looking down at the bench can read the state at a glance.

## Topology

Five components implement the encoding:

| Ref | Value | Role |
| --- | --- | --- |
| `D1` | XL-5050RGBC | Three-die RGB LED — independent R / G / B dies with separate anode + cathode pairs |
| `Q1` | BC807-25 (PNP, SOT-23) | High-side switch driving the Blue die anode |
| `R1` | 10 kΩ, 0805 | Green-die current limiter (anode side) |
| `R3` | 10 kΩ, 0805 | Red + Blue shared current limiter (cathode side) |
| `R2` | 100 kΩ, 0603 | Q1 base bias — provides the DC path from `VSS+` to `SUPPLY−` that lets Q1 sense the SUPPLY+ − VSS+ delta |

The rail connections determine each state:

- **Green** — `D1.GA` (Green anode) sits on `VSS+` through R1; `D1.GK` (Green cathode) sits on `VSS−`. When the protection FETs conduct, V(VSS+) ≫ V(VSS−), and Green is forward-biased.
- **Red** — `D1.RA` (Red anode) sits on the shared Red-anode / Blue-cathode node through R3 to `SUPPLY−`; `D1.RK` (Red cathode) sits on `SUPPLY+`. When the SRC pair is reverse-wired, V(SUPPLY−) > V(SUPPLY+) + V_F_red, and Red conducts.
- **Blue** — `D1.BA` (Blue anode) is driven by Q1's collector. Q1 is a PNP with E on `SUPPLY+`, B on `VSS+`. Q1 turns on when V(SUPPLY+) − V(VSS+) > V_BE_on ≈ 0.65 V. Under normal operation Q2 (the P-FET in the reverse-polarity protection chain) holds VSS+ within mV of SUPPLY+, so Q1 stays off and Blue is dark. When F1 blows, VSS+ no longer has a current path to SUPPLY+, R2 pulls VSS+ toward SUPPLY−, the V(SUPPLY+) − V(VSS+) gap opens up to the full supply voltage, Q1 saturates, and Blue lights via R3 to `SUPPLY−`.
- **Off** — no supply means no current path; all three dies are dark.

The cleverness is that the Blue-state mechanism is the **gate-protection circuit's own behaviour under fault**, not a separate fault-detection circuit.

## Operating envelope

LED current at the typical 12 V N2K supply and the maximum 48 V supply:

| State | I_LED @ 12 V | I_LED @ 48 V | Notes |
| --- | --- | --- | --- |
| Green | 0.98 mA | 4.58 mA | Limited by R1 (10 kΩ); D1 die max is 20 mA — comfortable margin |
| Red | 1.00 mA | 4.60 mA | Limited by R3 (10 kΩ) |
| Blue | 0.90 mA | 4.50 mA | Limited by R3 (10 kΩ), reduced by Q1 V_CE_sat ≈ 0.2 V |

Brightness ranges from comfortably-readable at 12 V to bright but not blinding at 48 V — appropriate for an always-on indicator.

### Resistor power utilisation

| Resistor | Footprint | Rated power | Worst-case dissipation @ 48 V | Utilisation |
| --- | --- | --- | --- | --- |
| R1 | 0805, 0.25 W | 250 mW | 210 mW (Green ON) | 84 % |
| R3 | 0805, 0.25 W | 250 mW | 210 mW (Red or Blue ON) | 84 % |
| R2 | 0603, 0.1 W | 100 mW | 23 mW | 23 % |

At the 48 V supply ceiling, R1 and R3 sit at 84 % of their power rating when the corresponding die is on. **V1.3 upsizes R1 and R3 to 1206 (0.4 W rating)** for better thermal margin. V1.1 / V1.2 carry the 0805 footprint as a known steady-state limit at 48 V.

### Load on the supply

Total worst-case loading of the indicator circuit on the bench supply: ≈ 4.6 mA at 48 V (one die on). Against the LISN's 4 A continuous design current that's 0.1 % loading — entirely negligible.

## PCB layout notes

D1 is on **B.Cu** at (76.0, 90.0), facing up through the YG-H10A top extrusion. Q1, R1, R2, R3 are clustered on F.Cu beneath D1 inside a 5 × 3 mm island around (X = 75, Y = 90) — close to the SRC banana pair (J5 / J7 at X = 71.5) since that's the entry of the SUPPLY+ / SUPPLY− rails the indicator is sensing. The Q1.C → D1.BA trace stays under ~5 mm including one cross-layer via, keeping the high-impedance Blue-drive node short.

## Why no firmware?

The indicator could equivalently be implemented as a single tri-colour LED driven by an MCU sampling rail voltages. The discrete topological version was chosen because:

1. **No firmware to debug.** The state encoding is wired into the rail relationships; there is no code path that can be wrong.
2. **No power-up logic.** Q1 + Q2 + Q3 all bias themselves up by the same rails they're protecting; there is no MCU initialisation sequence to fail.
3. **Cost.** Five small passives + one BJT in SOT-23 + one RGB LED beats a microcontroller + crystal + decoupling + firmware-flash effort for this single-function need.

This is consistent with the broader CANBench Duo philosophy — the instrument is **fully passive**, no MCU on the board, no firmware in the field. Everything that happens, happens because of physics.

## Related pages

- [LISN Supply Path](./lisn-supply-path.md) — the fuse (F1), reverse-polarity protection FETs (Q2 P-FET on `SUPPLY+`, Q3 N-FET on `SUPPLY−`), and the `VSS+` / `VSS−` rail definitions referenced by the state encoder
- [Connectors & Mechanical](./connectors-and-mechanical.md) — the YG-H10A top extrusion through which D1 is visible

## References

- XINGLIGHT, [*XL-5050RGBC RGB LED, SMD5050-6P*](https://www.lcsc.com/datasheet/C2843868.pdf) — D1
- Nexperia, [*BC807 PNP BJT*](https://assets.nexperia.com/documents/data-sheet/BC807_SER.pdf) — Q1
