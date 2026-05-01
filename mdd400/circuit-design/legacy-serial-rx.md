---
title: Legacy Serial RX
---

import useBaseUrl from '@docusaurus/useBaseUrl';

<img src={useBaseUrl('/img/schematics/mdd400/legacy_serial_rx.svg')} alt="Legacy Serial RX schematic" />

## Components

| Ref | Value | Description |
|-----|-------|-------------|
| J3 | Seatalk | Three-pin Legacy Serial connector (THT, 1211 QF pins) |
| U7 | TLP2309 | 1 Mbit/s logic-output optoisolator, SO-6 |
| U11 | ZXTR2012 | 12 V LDO, 30 mA, 100 V input, SOT-23F |
| D6 | BAT54 | 30 V 200 mA Schottky — signal clamp |
| D13 | SS34 | 40 V 3 A Schottky — reverse-polarity and freewheeling |
| D14 | PESD15VL1BA | 15 V bidirectional TVS, 200 W — ESD clamp |
| D15 | SMCJ36CA | 36 V bidirectional TVS, 1.5 kW — primary transient clamp |
| M1 | 75V | MOV varistor, 1206 |
| L5 | 1 µH | 150 mA inductor — RF filter |
| FB5 | 600 Ω @ 100 MHz | Ferrite bead — isolated domain boundary |
| R25 | 2.2 kΩ | Optoisolator LED drive current limiting |
| R30 | 22 kΩ | Signal level set |
| R32 | 2.2 kΩ | LED current series resistor |
| R57 | 47 Ω / 500 mW | AEC-Q200 series current limiting resistor (1210) |
| C30 | 100 nF/50 V | Supply decoupling |
| C49,C50 | 100 pF/50 V | Signal line RF filter |
| C53 | 100 nF/50 V | Isolated supply decoupling |
| C54 | 10 µF/25 V | Isolated supply bulk |
| C55 | 1 µF/100 V | ZXTR2012 output capacitor |

## How It Works

The Legacy Serial bus uses a single-wire, 12 V open-collector signalling scheme. The bus idles at 12 V (pulled up by the transmitting device) and a transmitting node pulls the bus to ground to assert a logic zero. The receive circuit must detect this from the perspective of the MDD400 while maintaining galvanic isolation between the external network wiring and the internal digital circuitry.

The connector J3 brings in three terminals: 12 V bus, ground (shield), and the data line. Before the signal reaches the optoisolator, it passes through a multi-stage protection chain. The SMCJ36CA (D15, 1.5 kW) and PESD15VL1BA (D14, 200 W) TVS diodes clamp transients from the cable. The MOV varistor M1 handles sustained overvoltage. The 47 Ω 500 mW series resistor R57 limits fault current; its 1210 package and AEC-Q200 qualification indicate it is specified to survive the high peak power that occurs during a clamp event without opening.

The ZXTR2012 LDO (U11) generates the 12 V isolated supply (VST) from the incoming bus line (LDO\_VIN). This is the supply voltage used on the isolated side of the receive circuit. The ZXTR2012 is rated for up to 100 V input, which allows it to tolerate the peak bus voltage during transient events that the clamps do not fully suppress. Its output (VST) powers the LED side of the optoisolator.

The TLP2309 optoisolator (U7) performs the galvanic isolation. The LED side connects the data line through R25 and R32 current-limiting resistors; when the bus is pulled low by a transmitter, current flows through the LED and the phototransistor output switches low. The phototransistor collector is on the VST-powered side. The digital output from U7 crosses the isolation barrier as ST\_RX and arrives at the ESP32's GPIO 39 on the internal VCC domain.

The 1 µH inductor L5 and 100 pF capacitors C49/C50 form an RF low-pass filter on the data line before the optoisolator input, attenuating high-frequency noise that would otherwise couple into the isolated domain through the optoisolator's inter-winding capacitance.

## Design Rationale

Galvanic isolation on the receive path is mandatory for a marine product. Boat electrical systems are notorious for ground loops formed by multiple bonding paths through seawater, engine blocks, and shore power connections. Without isolation, a ground potential difference of a few volts between the legacy serial network ground and the MDD400 ground would corrupt received data or damage the optoisolator. The TLP2309 provides 5 kV RMS isolation voltage and operates at up to 1 Mbit/s, well above the 4,800 baud used by the legacy protocol.

The ZXTR2012 is an unusual choice for a 12 V regulator — it requires a 100 V input-rated LDO because the bus line voltage is referenced to the network ground, not to the board's GNDREF. Any surge that reaches the connector can transiently appear as a high common-mode voltage at the LDO's input pin. The 100 V rating provides adequate margin. Its 30 mA output current is sufficient to supply the optoisolator LED and the ferrite bead FB5 filtered VST domain.

The 500 mW, AEC-Q200 rated 47 Ω resistor R57 is annotated in the schematic as a "pulse damping resistor". Its 1210 package (larger than the 0603 types used elsewhere) was chosen specifically because it can absorb the peak power dissipation during a line fault without failing open — an open resistor in this position would leave the bus data line unconnected to the optoisolator, silently breaking receive.
