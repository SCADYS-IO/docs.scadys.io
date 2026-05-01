---
title: Legacy Serial TX
---

import useBaseUrl from '@docusaurus/useBaseUrl';

<img src={useBaseUrl('/img/schematics/mdd400/legacy_serial_tx.svg')} alt="Legacy Serial TX schematic" />

## Components

| Ref | Value | Description |
|-----|-------|-------------|
| U8 | TLP2309 | 1 Mbit/s logic-output optoisolator — TX enable isolation |
| U9 | TLP2309 | 1 Mbit/s logic-output optoisolator — TX data isolation |
| Q8,Q11 | BC847 | 45 V 100 mA dual NPN BJT, SOT-363 — drive stages |
| Q9 | AO3407 | 30 V 4.2 A P-channel MOSFET — bus pull-up switch |
| Q10 | 2N7002 | 60 V 300 mA N-channel MOSFET — bus pull-down driver |
| Q12 | MMBTA56LT1G | 80 V 500 mA PNP BJT — high-side gate drive |
| D9 | BZT52C15S | 15 V Zener — VST supply reference |
| D11 | BAT54S | 30 V dual series Schottky — signal steering |
| R26 | 10 kΩ | ESP_EN isolation LED drive |
| R27,R29,R36,R55 | 390 Ω | Optoisolator LED current setting |
| R28,R38 | 100 kΩ | Bias resistors |
| R30 | 22 kΩ | Q9 gate control |
| R37,R47 | 22 kΩ | Transistor base/collector bias |
| R40 | 56 kΩ | Level-set divider |
| R41,R43 | 1 MΩ | High-impedance bus monitoring |
| R42 | 30.9 kΩ | Precision divider resistor |
| R48,R49,R56 | 39 kΩ | Signal conditioning |
| R50,R58 | 2.2 kΩ | Base drive resistors |
| R51 | 10 Ω | Gate damping resistor |
| R52 | 1 kΩ | Precision current sense |
| R59 | 12 kΩ | Feedback network |
| R61 | 10 kΩ | Pull-up resistor |
| C39,C40 | 100 nF/50 V | Supply decoupling |
| C48 | 2.2 nF/50 V | Signal filter |

## How It Works

The Legacy Serial transmit circuit drives the single-wire open-collector bus at 12 V logic levels from the 3.3 V isolated digital domain. Two TLP2309 optoisolators (U8 and U9) cross the isolation barrier in the transmit direction: U8 carries the ST\_EN enable signal from GPIO 1, and U9 carries the ST\_TX data signal from GPIO 41.

On the bus side, the circuit must reproduce the open-collector characteristic of the legacy protocol. When a node transmits a logic one (idle), the bus is passively pulled up to 12 V by the network's wired-OR pull-up resistors. When a node transmits a logic zero (dominant), it pulls the bus to ground. The MDD400 must be able to assert a dominant state by pulling the data line low with enough current to overcome other nodes' pull-ups, while not actively driving the bus high (which would create a bus conflict with any other transmitting node).

The transistor network around Q8, Q9, Q10, Q11, and Q12 implements this open-collector drive with the 12 V VST rail. When ST\_TX is asserted, U9's output activates the transistor chain: Q10 (N-channel MOSFET) pulls the bus data line to GND\_ST through a controlled impedance. The pull-down is strong enough to dominate the 12 V pull-up of the network. When ST\_TX is de-asserted, Q10 turns off and the bus floats back to 12 V through the network's own pull-up resistors.

The ST\_EN signal (via U8) enables the transmit driver entirely. When ST\_EN is low (driver disabled), the bus pull-down is held off regardless of ST\_TX. This is the default state on power-up and allows the MDD400 to listen on the bus without transmitting, which is important during initialisation and when the protocol requires a device to listen before speaking.

The 15 V Zener D9 clamps the VST rail on the isolated side to a known reference voltage, protecting the transistor bases and collector circuits against VST variations. The dual BAT54S (D11) steers currents in the gate drive path.

## Design Rationale

Two separate optoisolators for data and enable reflect the need for independent, fast isolation of both control signals. A single dual-channel optoisolator package was not used because the TLP2309 single-channel SO-6 package provides better channel-to-channel isolation than a dual package, and the timing skew between the two channels is deterministic with separate devices.

The choice of a P-channel MOSFET (Q9, AO3407) as a high-side switch and N-channel MOSFET (Q10, 2N7002) as the pull-down was driven by the 12 V bus voltage on the isolated side. A MOSFET gate must be driven to within V\_gs(th) of its source rail, which requires a dedicated transistor stage (Q8/Q11/Q12) when the source rail is 12 V and the driving logic is at 3.3 V through the optoisolator. The MMBTA56 PNP (Q12) provides the high-side gate drive to turn Q9 on and off cleanly.

Precision components appear in two places: the 1% thin-film 1 kΩ resistor R52 and the 30.9 kΩ resistor R42 set the transmit driver's bias point accurately. Their tight tolerances ensure the transmitted waveform meets the legacy protocol's timing and amplitude specifications across temperature.
