---
sidebar_position: 2
title: Stress Firmware and Operating Modes
sidebar_label: Stress firmware
---

# Stress Firmware and Operating Modes

An emissions scan measures the board in whatever state its firmware holds it. The pre-scan therefore defines the states to measure, and a firmware build holds the board in its worst state for as long as a scan takes.

## Operating modes

Five operating modes cover the states a Scadys instrument runs in.

| Mode | State |
|---|---|
| A, idle | Low brightness, bus receive only. |
| B, typical | Medium brightness, normal bus receive and transmit. |
| C, worst case | Full brightness, maximum bus traffic, legacy serial transmitting, audio driven continuously at full scale. |
| D, display stress | The screen alternating between full white and a one-pixel checkerboard. |
| E, power cycling | Scripted power on and off, including brown-out edges. |

The pre-scan measures mode A and mode C, with mode D running inside the mode C build. Mode A shows the board's floor, and mode C shows its ceiling.

## The stress build

The stress build is an option in the board's bring-up app, off by default, in its own build folder beside the standard build. In its monitoring loop it holds every load at its worst at once:

- the backlight at full brightness and the screen switching between full white and a one-pixel checkerboard every few seconds;
- a continuous 1 kHz tone at full scale through the audio amplifier;
- NMEA 2000 frames sent continuously, at least several a second;
- legacy serial datagrams sent continuously; and
- the radio advertising.

The standard build is kept ready beside it, so mode A can be measured on the same board without a rebuild.

## Why every load is held continuously

A pulsed load does not dwell long enough to show its true level. A short audio burst, for example, is gone before an analyser sweep reaches its frequency, and a standards detector would weigh it lower again. The worst case is continuous drive, so every load in the stress build runs without a break for the whole scan.

## Enabled but idle is a separate state

A filterless class-D audio amplifier switches whenever it is enabled, even when it plays nothing. An amplifier that firmware leaves enabled between sounds is therefore a noise source in mode A as well as in mode C. If mode C is acceptable but an idle board shows the amplifier's switching frequency, the firmware's policy of shutting the amplifier down when idle is what removes it, and the scan is repeated with the amplifier both enabled and shut down.
