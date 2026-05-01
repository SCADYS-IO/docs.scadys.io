---
title: Display Interface
---

import useBaseUrl from '@docusaurus/useBaseUrl';

<img src={useBaseUrl('/img/schematics/mdd400/display_interface.svg')} alt="Display Interface schematic" />

## Components

| Ref | Value | Description |
|-----|-------|-------------|
| J4 | 50p, top/bottom, flip-type | 50-pin 0.5 mm FPC connector, double-sided, hinged lid |
| Q4 | AO3407 | 30 V 4.2 A P-channel MOSFET — display power switch |
| Q5 | S8050 | 25 V 1.5 A NPN BJT — gate drive for Q4 |
| FB3 | 600 Ω @ 100 MHz | Ferrite bead — VDSP supply filtering |
| R31 | 100 kΩ | Q5 base pull-down |
| R34 | 10 kΩ | Q5 base drive resistor |
| R35 | 100 kΩ | Q4 gate pull-up (ensures Q4 off when DISP_EN low) |
| C37 | 10 µF/25 V | VDSP bulk decoupling |
| C38 | 100 nF/50 V | VDSP high-frequency decoupling |

## How It Works

The display module connects to the MDD400 through a 50-pin 0.5 mm flip-type FPC connector (J4). The flip-type mechanism — where the contacts are accessible from both sides of the cable — allows the display cable to be routed in either orientation without a separate reversed-pinout version of the connector.

Power to the display is switched by a P-channel MOSFET (Q4, AO3407). The DISP\_EN signal from the ESP32 (GPIO 21) drives an NPN transistor Q5, whose collector pulls Q4's gate low to turn on the MOSFET and apply VDSP (5 V) to the display. When DISP\_EN is low, Q5 is off, the gate pull-up resistor R35 holds Q4's gate at VDSP, and the MOSFET is fully off — cutting power to the display entirely. This allows the firmware to cold-restart the display module in the event of a communication lockup, and saves power when the display is not needed.

The VDSP rail is derived from VDD (5 V) through the ferrite bead FB3 (600 Ω at 100 MHz). FB3 decouples the display switching power from the rest of the 5 V domain, preventing the high startup current of the display backlight LED driver from causing a momentary voltage dip on VDD. The combination of FB3 with the 10 µF and 100 nF capacitors on J4 side provides local energy storage for fast transients and high-frequency noise suppression.

Communication with the display uses the DWIN serial protocol over UART: DISP\_TX (GPIO 48) carries commands from the ESP32 to the display, and DISP\_RX (GPIO 47) carries events and touch data from the display back to the ESP32. These signals connect directly from the ESP32 module to the FPC connector pins without additional buffering, since the DWIN module operates at 3.3 V logic.

## Design Rationale

A flip-type FPC connector was specified because it is mechanically robust for a product that will be assembled and occasionally serviced. The double-sided contact design allows either face of the cable to connect, which gives more flexibility in display module placement relative to the main board. A 50-pin count with 0.5 mm pitch is standard for DWIN's T5L display series, which is the target display family for this product.

The switched power architecture for the display, rather than a simple always-on supply, was chosen because the DWIN display module contains a microcontroller and can become unresponsive if its UART receive buffer overflows or if firmware on the display side encounters a fault. Software-controlled power cycling provides a reliable recovery mechanism without requiring the user to disconnect the main NMEA 2000 cable.
