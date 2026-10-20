---
sidebar_position: 3
title: First Power
---

# First Power

First power applies the supply to an unprogrammed board for the first time. The board has no firmware, so this stage tests only what the hardware does on its own: the input stage, the regulators that start without firmware, and the processor's ROM.

## Current limit

The supply is set to the nominal bus voltage, 12.0 V for a Scadys marine instrument, with a low current limit, and connected through the board's own supply connector. For a first board, no record gives the current with no firmware, so the limit is a starting value rather than a derived one. A 0.2 A limit is the Scadys starting point. The first reading, the supply current, decides whether the limit can be raised.

The limit must still let the processor start. If the processor's datasheet gives a minimum supply current for start-up above the limit, the limit is raised to that figure once the first current reading shows no fault.

## Read in a fixed order

The sheet lists the readings in the order they are taken, from the supply inward.

1. *Supply current.* It must sit below the limit and be steady. The value is recorded, with the conditions, because it is the first comparison for every later board.
2. *Power indicator.* A status LED fed from the main rail lights.
3. *Input stage.* The bus supply after the input protection reads close to the supply voltage.
4. *Regulators that start without firmware.* Each reads inside its window, such as 3.247 V to 3.353 V for a 3.3 V converter.
5. *Rails and outputs that must be off.* Each reads below a stated ceiling. A display supply, a backlight, an audio amplifier and any rail that firmware enables should all be off.
6. *Enable timing.* The processor enable rises only after its supply is settled, measured on the scope.
7. *The processor's ROM boot log.* It is read on the processor's UART.

## Some rails read low, and that is correct

With no firmware, several rails read low or near zero, and the sheet says so beside each one. A rail that firmware enables reads close to 0 V. A rail that a processor makes internally may read at a partial value. Where an odd-looking value is correct, the sheet says why and gives the value measured on the first good board.

The pass windows for this stage come from the processor's documentation of its state before firmware, not from the rail's value in normal operation. On the first MDD500 board, the bring-up sheet expected the processor's core rail at about 1.1 V before firmware. It reads millivolts, because the processor powers that rail only when firmware enables the external converter. The wrong expectation led to a good processor being replaced, as [the case studies](../fault-finding/case-studies.md) describe.

## The ROM boot log proves a blank processor is alive

An Espressif processor prints a ROM banner on its UART at 115200 baud before any firmware runs. With a blank flash, the log shows the banner, a message that the flash header is invalid, and a watchdog reset that repeats every few hundred milliseconds. That pattern is a healthy processor with nothing to run. It is the one reading that proves a blank processor is alive.

A multimeter on the UART transmit pad proves nothing either way. The line idles high and carries bursts of data, so a meter shows an unsteady voltage on a working chip and a steady weak pull-up voltage on a chip that is not running.

A current reading helps here too. Holding the processor in reset and releasing it changes the supply current by the amount the ROM draws while it runs. A change in current on release shows the processor is executing.
