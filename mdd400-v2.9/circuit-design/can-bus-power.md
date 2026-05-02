---
title: CAN Bus Power Protection
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/can_bus_power.svg" alt="CAN Bus Power Protection schematic" />

:::note Hardware version
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

## Components

| Ref | Value | Description | Datasheet |
|---|---|---|---|
| D10 | SM8S36CA | 36 V bidirectional TVS, DO-218AB, 6.6 kW peak | [SMC Diodes SM8S36CA](https://www.smc-diodes.com/propdf/SM8S20CA%20THRU%20SM8S43CA%20N2149%20REV.-.pdf) |
| M2 | 75 V MOV | 1206 metal oxide varistor, 75 V clamp | [Littelfuse V33MLA1206NH](https://www.littelfuse.com/products/varistors/multilayer-varistors/mlv/v33mla1206nh.aspx) |
| D12 | SS34 | 40 V 3 A SMA Schottky — reverse polarity protection | [MSKSEMI SS34](https://www.lcsc.com/product-detail/C2836396.html) |
| F1 | 500 mA/60 V | 1812 resettable PTC fuse | [BHFUSE BSMD1812-050](https://www.lcsc.com/product-detail/C883142.html) |
| C43, C51, C52 | 22 µF/100 V | 2220 X7R MLCC — bulk/damping capacitors | [PSA FS55X225K251EGG](https://www.lcsc.com/product-detail/C153032.html) |
| R60 | 100 mΩ | 0603 — series damping resistor | [Yageo RC Series](https://www.lcsc.com/product-detail/C326946.html) |
| R54 | 100 kΩ | 0603 — parallel discharge resistor | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| L4 | 1 µH | EMI filter stage 1 inductor, 3.5 A, 4×4 mm | [Product Page](https://www.lcsc.com/product-detail/C602020.html) |
| L3 | 4.7 µH | EMI filter stage 2 inductor, 2.1 A, 4×4 mm | [Product Page](https://www.lcsc.com/product-detail/C602022.html) |
| C42, C44 | 100 nF/100 V | 0603 X7R — EMI filter stage 1 shunt capacitors | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C45, C46 | 4.7 µF/100 V | 1206 X7R — EMI filter stage 2 shunt capacitors | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| Q6 | PMV240SPR | P-channel MOSFET, 100 V, 1.2 A — over-voltage cutoff switch | [Nexperia PMV240SPR](https://assets.nexperia.com/documents/data-sheet/PMV240SPR.pdf) |
| Q7 | MMBTA56LT1G | PNP transistor — over-voltage threshold comparator | [Onsemi MMBTA56LT1G](https://www.onsemi.com/products/discrete-power-modules/general-purpose-transistors/mmbta56) |
| D8 | BZT52C7V5S | 7.5 V SOD-323 zener — MOSFET gate clamp | [Diodes Inc BZT52C7V5S](https://www.diodes.com/assets/Datasheets/BZT52C.pdf) |
| D7 | PESD15VL1BA | 15 V bidirectional ESD/TVS — downstream surge clamping | [Nexperia PESD15VL1BA](https://assets.nexperia.com/documents/data-sheet/PESD15VL1BA.pdf) |
| R44 | 22 kΩ | 0603 — over-voltage divider upper | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R45 | 68 kΩ | 0603 — over-voltage divider lower | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R46 | 2.4 kΩ | 0603 — PNP base resistor | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R33 | 330 mΩ | 0603 precision shunt — INA219 current sense | [Yageo PT0603FR-070R33L](https://www.yageo.com/en/Product-Line/Resistors/Chip-Resistors/Thick-Film/PT/PT0603FR-070R33L) |
| U11 | ZXTR2012 | 12 V linear regulator, SOT-23 | [Diodes Inc ZXTR2012](https://www.diodes.com/assets/Datasheets/ZXTR2012.pdf) |

## How It Works

The CAN bus power sub-sheet accepts the raw 12 V supply from the NMEA 2000 backbone (NET-S pin) and conditions it through a staged protection and filtering network before delivering clean, regulated input to the internal DC-DC converters.

The first protection stage is the SM8S36CA bidirectional TVS diode (D10) placed directly across the input. It clamps surge events — alternator load dump, battery disconnect under load, inductive spikes — at approximately 58 V, and is rated for 6.6 kW peak pulse power (10/1000 µs waveform). A V33MLA1206NH MOV (M2) is fitted in parallel to absorb slower, higher-energy transients and improve protection diversity. Together they satisfy the requirements of ISO 7637-2 Pulses 1, 2a, 3a, and 3b in 12 V systems.

After the TVS/MOV stage a 500 mA resettable PTC fuse (F1) limits sustained overcurrent. An SS34 Schottky diode (D12) in the power path provides reverse polarity protection. A 22 µF bulk capacitor bank (C43, C51) with a 100 mΩ series damping resistor (R60) absorbs surge energy and damps resonance on the input cable; a 100 kΩ parallel resistor (R54) ensures safe discharge after power removal.

A two-stage differential-mode LC EMI filter follows: stage 1 uses a 1 µH power inductor (L4) and ~10 µF ceramic capacitance, stage 2 a 4.7 µH inductor (L3) and ~22 µF ceramic capacitance. Simulated attenuation exceeds 60 dB at 10 MHz and 100 dB above 100 MHz, suppressing both incoming backbone noise and outgoing emissions from the internal switching converters.

The over-voltage protection circuit disconnects the load above ~24.6 V using a PMV240SPR P-channel MOSFET (Q6) as a series switch. A resistive divider (R44/R45) monitors the supply voltage; when the divided voltage exceeds ~0.65 V the MMBTA56 PNP transistor (Q7) conducts, pulling the MOSFET gate high and turning it off. The 7.5 V zener (D8) clamps V_GS to protect the MOSFET gate. Threshold is set just below the INA219 power sensor's 26 V maximum input rating, shielding it from overvoltage events. The circuit is self-resetting: the output restores automatically when input voltage returns below the threshold.

A ZXTR2012 12 V linear regulator (U11) provides a clean 12 V supply for the legacy serial domain (VST), derived from the conditioned input.

## Design Rationale

The SM8S36CA TVS handles ISO 7637-2 Pulse 5b safely in 12 V systems — thermal analysis shows only ~8 °C junction temperature rise under a 150 V, 400 ms pulse absorbing ~320 mJ. However, in a 24 V system a Pulse 5b event (300 V, 400 ms) dissipates over 18 J, exceeding the device's thermal capability. This limits the MDD400 to 12 V NMEA 2000 deployments for full Pulse 5b compliance.

The Schottky reverse polarity diode was preferred over a MOSFET ideal-diode circuit because the generous input voltage headroom (nominal 12 V input to 3.3/5 V regulated outputs) makes the ~0.5 V forward drop acceptable, and the passive diode offers simpler failure modes with no risk of gate drive faults or latch-up.

## Design Calculations

- **ISO 7637-2 Pulse 5b** (12 V system, 150 V/400 ms): ~320 mJ absorbed, ~8 °C Tj rise — compliant
- **ISO 7637-2 Pulse 5b** (24 V system, 300 V/400 ms): >18 J — thermal runaway risk; not suitable
- **IEC 61000-4-2 ESD**: SM8S36CA rated ±30 kV contact discharge
- **EMI filter attenuation** (simulation): >60 dB @ 10 MHz, >100 dB above 100 MHz
- **Over-voltage threshold**: ~24.6 V (R44=22 kΩ, R45=68 kΩ → Vdiv at 24.6 V input ≈ 0.65 V)

## References

- ISO, [*ISO 7637-2: Road vehicles — Electrical disturbances from conduction and coupling Part 2*](https://www.iso.org/standard/50925.html)
- SMC Diodes, [*SM8S36CA Bidirectional TVS Diode Datasheet*](https://www.smc-diodes.com/propdf/SM8S20CA%20THRU%20SM8S43CA%20N2149%20REV.-.pdf)
- Littelfuse, [*V33MLA1206NH Metal Oxide Varistor Datasheet*](https://www.littelfuse.com/products/varistors/multilayer-varistors/mlv/v33mla1206nh.aspx)
- Nexperia, [*PMV240SPR P-Channel MOSFET Datasheet*](https://assets.nexperia.com/documents/data-sheet/PMV240SPR.pdf)
- Texas Instruments, [*INA219 Current/Power Monitor Datasheet*](https://www.ti.com/lit/ds/symlink/ina219.pdf)
- NMEA, [*NMEA 2000 Standard*](https://www.nmea.org/nmea-2000.html)
