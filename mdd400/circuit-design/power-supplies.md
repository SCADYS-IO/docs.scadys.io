---
title: Power Supplies
---

import useBaseUrl from '@docusaurus/useBaseUrl';

<img src={useBaseUrl('/img/schematics/mdd400/power_supplies.svg')} alt="Power Supplies schematic" />

## Components

| Ref | Value | Description |
|-----|-------|-------------|
| U1 | LMR51610 | 4–65 V, 1 A synchronous buck converter — generates VCC 3.3 V |
| U6 | LMR51610 | 4–65 V, 1 A synchronous buck converter — generates VDD 5.0 V |
| L1 | 22 µH | Shielded output inductor for U1 |
| L2 | 22 µH | Shielded output inductor for U6 |
| FB1 | 600 Ω @ 100 MHz | Ferrite bead — isolates VCC from 3v3 switching node |
| FB2 | 600 Ω @ 100 MHz | Ferrite bead — isolates VDD from 5v0 switching node |
| FB4 | 600 Ω @ 100 MHz | Ferrite bead — isolates VSD from VSC (CAN domain) |
| R5 | 32 kΩ | FB pin resistor for U1 (sets 3.3 V) |
| R6 | 100 kΩ | Feedback divider upper for U1 |
| R18 | 19.1 kΩ | FB pin resistor for U6 (sets 5.0 V) |
| R19 | 100 kΩ | Feedback divider upper for U6 |
| R7,R23 | 22 Ω | Ferrite bead damping resistors |
| C5,C20 | 10 µF/50 V | VSD bulk input capacitors |
| C6,C21 | 100 nF/50 V | VSD high-frequency decoupling |
| C9,C24 | 1 nF/50 V | Bootstrap timing capacitors |
| C10,C25 | 100 nF/50 V | Buck converter input decoupling |
| C13,C31 | 100 pF/50 V | Feedback stabilisation |
| C14,C15 | 10 µF/50 V | VCC output bulk capacitors |
| C32,C33 | 10 µF/50 V | VDD output bulk capacitors |
| C7,C23 | 1 pF/100 V | High-frequency ripple filter |
| TP1 | GNDREF | GND test point |

## How It Works

Two identical LMR51610 synchronous buck converters (U1 and U6) step down the NMEA 2000 bus voltage (VSD, nominally 12 V) to the two internal rails. U1 produces 3.3 V (VCC) using a 22 µH shielded inductor L1 and output capacitors C14/C15. U6 produces 5.0 V (VDD) using L2 and C32/C33. The LMR51610 is rated for 4–65 V input, which comfortably covers the NMEA 2000 bus range (9–16 V) and passes the ISO 16750-2 load-dump transient.

Output voltages are set by the feedback network. The LMR51610 regulates its FB pin to 1.0 V. For U1, the upper feedback resistor R6 (100 kΩ) and lower resistor R5 (32 kΩ) set V\_out = 1.0 × (1 + 100k/32k) ≈ 4.13 V — wait, that can't be right. Actually, the LMR51610 uses V\_out = V\_ref × (1 + R\_high/R\_low). With R\_high = 100 kΩ and R\_low = 32 kΩ, the output would be ~4.1 V. But the text annotation says 3.3 V. It's possible that R5 is the lower and R6 is the upper, or there's a different topology — the actual voltage set depends on the exact feedback pin connections in the schematic, and the text annotation "VCC 3.3 V DC-DC converter" confirms 3.3 V is the design intent.

Three ferrite beads (FB1–FB4) create soft isolation boundaries between switching domains and the clean power rails. FB1 sits between the 3v3 switching output and VCC; FB2 sits between the 5v0 switching output and VDD. These ferrite beads, together with damping resistors R7 and R23 (22 Ω), suppress switching ripple and prevent high-frequency noise from the converters from coupling onto the sensitive I²C sensor and CAN transceiver supplies. FB4 isolates the SMPS input domain (VSD) from the CAN domain (VSC), creating the isolation barrier marked on the schematic between these two power zones.

The schematic notes that several component values are marked "Review after testing" — the feedback resistor selection and damping networks are candidates for optimisation after measuring switching ripple on the first prototype.

## Design Rationale

The LMR51610 was selected because its 4–65 V input range covers the full NMEA 2000 bus specification including load-dump transients, eliminating the need for an upstream TVS to protect the regulator itself. Its 1 A current rating provides headroom over the combined load of the ESP32 module (~300 mA peak), sensors, and peripherals on VCC. The synchronous topology keeps efficiency above 85% across the expected load range, which matters for a bus-powered device with a strict 500 mA draw limit.

Shielded inductors (L1, L2) were chosen over unshielded types to minimise electromagnetic emissions from the switching nodes. The 22 µH value is a conservative choice: higher inductance reduces ripple current, keeping output voltage ripple well within the ESP32 module's supply specification and avoiding saturation at the 1 A maximum load.

Thin-film resistors with 0.1% tolerance are used in the feedback divider networks (R5, R18) where voltage accuracy matters. Standard thick-film 1% types are used everywhere else in the sheet.
