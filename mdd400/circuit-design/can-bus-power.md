---
title: CAN Bus Power Protection
---

import useBaseUrl from '@docusaurus/useBaseUrl';

<img src={useBaseUrl('/img/schematics/mdd400/can_bus_power.svg')} alt="CAN Bus Power Protection schematic" />

## Components

| Ref | Value | Description |
|-----|-------|-------------|
| J2 | 5P Code-A Male | NMEA 2000 Micro-C 5-pin Code-A connector (male) |
| D10 | SM8S36CA | 36 V bidirectional TVS, 6.6 kW peak (DO-218AB) — primary clamp |
| D7 | PESD15VL1BA | 15 V bidirectional TVS, 200 W (SOD-323) — secondary clamp |
| D8 | BZT52C7V5S | 7.5 V Zener — overvoltage protection reference |
| D12 | SS34 | 40 V 3 A Schottky — reverse-polarity and freewheeling |
| F1 | 500 mA/60 V | Resettable PTC fuse, 1812 |
| M2 | 75 V | MOV varistor, 1206 |
| L3 | 4.7 µH | 2.1 A power inductor — CAN bus input filter |
| L4 | 1 µH | 3.5 A power inductor — CAN domain conditioning |
| Q6 | PMV240SPR | 100 V 1.2 A P-channel MOSFET — power switch |
| Q7 | MMBTA56LT1G | 80 V 500 mA PNP BJT — gate drive for Q6 |
| U2 | INA219 | I²C current/power monitor (I²C 0x40) |
| R33 | 0.33 Ω | Current shunt resistor for INA219 |
| R39 | 4.7 Ω | Inrush current limiting |
| R44 | 22 kΩ | Q7 base bias resistor |
| R45 | 68 kΩ | Q7 collector pull-up |
| R46 | 2.4 kΩ | Q6 gate drive resistor |
| R53 | 0.22 Ω | Additional current sense element |
| R54 | 100 kΩ | INA219 configuration pull-up |
| R60 | 0.1 Ω | Bus sense resistor |
| C42,C44 | 100 nF/100 V | High-frequency decoupling |
| C43,C51,C52 | 22 µF/100 V | Bulk decoupling, 2220 (rated for bus transients) |
| C45,C46 | 4.7 µF/100 V | Intermediate bulk capacitance |
| C47 | 1 µF/100 V | Filter capacitor |

## How It Works

Raw NMEA 2000 bus power enters through the Micro-C connector J2 and immediately encounters a multi-stage transient suppression network. The first stage is the SM8S36CA TVS diode (D10), an 8×5 SMC package rated for 6.6 kW peak pulse power, which clamps any spike above 58 V (breakdown at 40 V, clamping at 58 V for a 100 A surge). This absorbs the most energetic events such as load-dump transients from engine alternators that appear on poorly conditioned boat electrical systems.

The 7.5 V Zener D8 works together with the P-channel MOSFET Q6 and transistor Q7 to implement a discrete overvoltage crowbar that shuts off the power path if the bus voltage rises above approximately 18.6 V. A MOV varistor M2 provides additional line-to-ground clamping for sustained overvoltage conditions. The resettable PTC fuse F1 (500 mA, 60 V) limits the steady-state current drawn from the NMEA 2000 network to below the 1 A maximum permitted by the standard, and automatically resets after a fault clears.

After the protection stages, the INA219 current/power monitor IC (U2) measures the actual bus current via a 0.33 Ω shunt resistor R33. At the rated 80 mV full-scale shunt voltage, this gives a maximum measurable current of approximately 242 mA — the annotated value in the schematic. The INA219 reports both bus voltage and power consumption to the ESP32 firmware over I²C at address 0x40. This data is used to enforce the NMEA 2000 load limit and to log power consumption for diagnostic purposes.

Inductors L3 (4.7 µH) and L4 (1 µH) form a two-stage LC filter that attenuates switching noise from the DC-DC converters from appearing on the CAN bus and reduces high-frequency emissions conducted onto the network. Large-case, 100 V-rated MLCC capacitors (C43, C51, C52 at 22 µF each) are placed throughout the input path to handle the charge redistribution during transient events without cracking.

## Design Rationale

The choice of a DO-218AB package for the primary TVS (D10) is non-obvious: the package is physically large for a surface-mount component, but it is the smallest package that can safely absorb the 6.6 kW peak specified for the SM8S36CA. Placing this package close to J2 keeps the high-current fault path short. The secondary 200 W TVS (D7) provides a lower-energy but faster clamp for the signal-level transients that the primary device allows through.

X7R capacitors rated at 100 V are used throughout the CAN bus power section rather than the 50 V types used elsewhere on the board. Ceramic capacitors with X7R dielectric exhibit significant capacitance derating with DC bias; at half the rated voltage (50 V cap at 25 V) the effective capacitance can fall by 50% or more. The 100 V rating ensures adequate capacitance remains available during normal bus operation and during the transient peak that occurs just before the TVS conducts.

The PTC fuse (F1) was chosen over a traditional blade fuse because the NMEA 2000 installation environment makes in-field fuse replacement impractical. The 500 mA rating corresponds to the NMEA 2000 Class B load class, which is the correct class for a powered display device.
