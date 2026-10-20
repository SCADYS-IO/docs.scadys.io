---
sidebar_position: 1
title: Bring-up and Verification
sidebar_label: Overview
---

# Bring-up and Verification

These pages describe how a new Scadys prototype is taken from a bare board to a working, verified instrument. The method is the same for every product. Each product applies it through its own bring-up sheet, which carries that board's test points, values and pass criteria.

## How the method is organised

The method has four parts.

1. *Core steps* run on every board, in order. They take the board from inspection through first power and programming to a checked power sequence and supply range.
2. *Function modules* are chosen per board. A module tests one function, such as a display, a sensor bus or an NMEA 2000 interface, and a board runs only the modules for the functions it carries.
3. *The EMC pre-scan* runs once the board works, to find the main emission sources before a formal laboratory test.
4. *Fault-finding* is used whenever a step fails.

[Recording results and closing out](./recording-results.md) covers what is written down at every step, and how a finding reaches the next board revision.

## Choosing the function modules

A board runs the modules that match the functions on its schematic.

| Module | Run it when the board carries |
|---|---|
| [Display and backlight](./modules/display-and-backlight.md) | A display panel or a backlight driver. |
| [Touch](./modules/touch.md) | A touch panel or an in-cell touch controller. |
| [Sensors](./modules/sensors.md) | Any I²C or SPI sensor, power monitor or inertial measurement unit. |
| [Audio](./modules/audio.md) | An audio amplifier or a beeper. |
| [Radio](./modules/radio.md) | Wi-Fi or Bluetooth, on the main processor or on a companion module. |
| [NMEA 2000](./modules/nmea-2000.md) | A CAN transceiver on an NMEA 2000 connector. |
| [Legacy serial](./modules/legacy-serial.md) | The Legacy Serial Protocol interface. |
| [Wind transducer input](./modules/wind-transducer-input.md) | An analog masthead wind transducer input. |

## Rules that apply throughout

- *Stop at the first failure.* A later step can damage a part while an earlier fault is still present, so the cause of a failed step is found before the next step starts.
- *Suspect the assembly first.* A failed step is far more often a solder bridge, an open joint or a part fitted the wrong way round than a failed part or a design flaw. [Fault-finding](./fault-finding/index.md) sets out the order of suspicion.
- *Every reading is written down when it is taken.* A reading records its value, the instrument, the setup and the date, as [Recording results and closing out](./recording-results.md) describes.
- *Nothing irreversible runs until every stage passes.* Burning a processor's eFuses, for example, cannot be undone, so it is the last step of bring-up rather than part of programming.
