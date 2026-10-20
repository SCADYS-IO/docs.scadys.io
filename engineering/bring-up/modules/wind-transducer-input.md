---
sidebar_position: 8
title: Wind Transducer Input
---

# Wind Transducer Input

This module checks an analog masthead wind transducer input. It covers the transducer's supply, the two direction signals and the speed pulse. The transducer can be simulated on the bench with a supply and a signal source, or an actual transducer can be connected.

## Transducer supply

- *Voltage at the connector.* The transducer supply is read at the board's connector under the transducer's rated load. The reading is compared with the design value for the selected transducer family, because the supply voltage depends on the family selected.
- *Across the input range.* The board's input is swept across its rated range, and the transducer supply must hold its value.
- *Load step.* The load is stepped across its range, and the supply must settle without sustained oscillation. A low-dropout regulator that rings on a load step usually needs a change to its feedback or output capacitor.
- *At the far end.* The supply is read at the masthead end of a full-length cable, because a long cable drops a measurable voltage at the transducer's current.

## Fault line

The transducer supply's error output asserts on a power fault, such as an overcurrent or an output short. It is tested with a deliberate short on the transducer supply, and the firmware must see the fault. An open circuit draws no current, so a disconnected transducer does not assert the fault line. A disconnect is detected from the loss of the direction signals instead.

## Direction signals

The direction signals are a sine and a cosine, each biased about half the transducer supply. Each is swept across the transducer's output range at the connector, and the conditioned voltage at the processor's ADC input is compared with the design's transfer function, including the points where the conditioning clips. The computed direction is then checked at 0°, 90°, 180° and 270°, and through a full 360° rotation.

Where one direction signal uses an ADC that the radio driver also uses, direction cannot be read while the radio is active. The test is run with the radio both off and on, and the result is recorded.

## Speed pulse

The speed input takes the transducer's pulse output, squared up for the processor. A pulse source is swept across the transducer's range, and the measured rate must match the source. The pulses per revolution come from the transducer manufacturer's documentation and are confirmed against an actual transducer turning at a known rate.
