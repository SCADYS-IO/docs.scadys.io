---
title: Buzzer Driver
---

import useBaseUrl from '@docusaurus/useBaseUrl';

<img src={useBaseUrl('/img/schematics/mdd400/buzzer_driver.svg')} alt="Buzzer Driver schematic" />

## Components

| Ref | Value | Description |
|-----|-------|-------------|
| BZ0 | MLT-8530 | 80 dB passive electromagnetic buzzer, 2.7 kHz, SMD 8.5×8.5 mm |
| Q2 | AO3407 | 30 V 4.2 A P-channel MOSFET — buzzer power switch |
| Q3 | S8050 | 25 V 1.5 A NPN BJT — gate drive for Q2 |
| D1 | BAT54 | 30 V 200 mA Schottky — flyback clamp |
| R9 | 10 Ω | Gate series resistor (limits switching transients) |
| R10 | 4.7 Ω | Inrush current limiting |
| R11 | 10 kΩ | Q3 base pull-down (ensures Q2 off at boot) |
| R12 | 2.2 kΩ | Q3 base drive resistor |
| R13 | 100 kΩ | Q2 gate pull-up (ensures Q2 off when Q3 is off) |
| C12 | 4.7 µF/16 V | Local supply decoupling for the buzzer circuit |

## How It Works

The MLT-8530 is a passive (externally driven) electromagnetic buzzer. Unlike a self-oscillating active buzzer, it requires a drive signal at or near its 2.7 kHz resonant frequency to produce maximum sound output. The AUDIO\_PWM net (GPIO 10) from the ESP32 supplies this PWM signal; the firmware LEDC peripheral generates the drive waveform at the correct frequency and can vary duty cycle to produce tones of different volumes.

The AUDIO\_PWM signal drives the base of the NPN transistor Q3 through the resistor divider R12/R11. When AUDIO\_PWM goes high, Q3 saturates and pulls Q2's gate low through R9, turning on the P-channel MOSFET Q2 and connecting the VDD (5 V) supply to the buzzer. When AUDIO\_PWM goes low, Q3 turns off, R13 pulls Q2's gate back to VDD, and Q2 turns off. This two-transistor topology inverts the logic: the buzzer is driven by a high AUDIO\_PWM, and Q2's P-channel nature means the buzzer current returns through the MOSFET's source to VDD rather than flowing through the ESP32 GPIO.

The Schottky diode D1 is placed across the buzzer terminals to clamp the inductive kick that occurs when Q2 turns off. An electromagnetic buzzer contains a coil; when the current through it is interrupted, the coil's stored energy produces a voltage spike that could otherwise exceed Q2's 30 V drain-source breakdown. The BAT54's low forward voltage (typically 300 mV at low current) ensures the clamp engages quickly. The 4.7 µF decoupling capacitor C12 absorbs the local supply current transient during each PWM cycle.

## Design Rationale

A passive buzzer was specified over an active (self-oscillating) type to give the firmware complete control over pitch and tone. The MLT-8530's 2.7 kHz natural resonance is in the range most easily perceived by humans in ambient noise environments typical of a boat cockpit. Driving it at a different frequency is possible but reduces sound pressure level significantly.

The P-channel MOSFET (Q2) acts as a high-side switch, keeping the buzzer's return path to ground unconditionally connected and only switching the supply side. This is the safer topology for an inductive load: there is no risk of a ground loop forming through the substrate of the MOSFET. The AO3407 was chosen because it is the same part used for the display power switch (Q4), reducing the number of unique components on the board.

The R11 pull-down on Q3's base ensures that Q2 is off (buzzer silent) during ESP32 boot before the GPIO is configured, preventing an unintended startup beep.
