---
sidebar_position: 5
title: Case Studies
---

# Case Studies

These cases come from the bring-up of two Scadys prototypes. In both, a failed part was suspected first, and in both, the real faults were in the assembly or in the expected value.

## MDD500 V0.1, board 1

The first MDD500 board was assembled by hand in October 2026. It has an ESP32-P4 processor, U4, in a 0.35 mm pitch QFN104 package, on a board populated on both faces.

### Bridges from the paste print

The top face was printed through a 0.10 mm stencil with full paste on U4, and placement took about eight hours. After reflow, U4 showed many solder bridges, at least eight of them, including one between the flash clock and data pins that read through on the flash chip. The power monitor, U11, was bridged as well.

The board's mask dams were present and correct, so the bridges came from the paste print. The paste was spread with a stiff plastic card pressed down onto the stencil, which forced paste under the stencil and around the apertures. U11 was reworked the same day.

The bottom face was later printed with a thick coated paper card, held vertical and swiped horizontally, and its 40-pin connector and two small sensors reflowed correctly first time.

### Open joints after a paste-free re-seat

U4 and the radio module were lifted, cleaned and re-seated on flux alone, with no fresh paste. At first power the board drew 38 mA, the UART pins read 0 V, and several of the processor's internal rails read near zero. In diode mode, both UART pins read open circuit to ground. Under the microscope, many of U4's edge pins were not touching their pads, because the package sat proud. Re-soldering one side with a needle iron and a little paste brought both UART pins to a 0.51 V diode drop, and all four sides were then re-soldered.

### A good processor replaced on a wrong expectation

With every joint confirmed, the processor's core rail still read millivolts, against the bring-up sheet's expectation of about 1.1 V. A written fault-finding process ran to its end, and its readings were taken as a core domain open inside the package. U4 was replaced with a second chip, using hot air to lift it, hand-applied paste because the stencil could not lie on the populated board, and the hot plate to reflow it.

The new chip gave the same readings. A serial adapter on the processor's UART then captured the ROM boot log at 115200 baud. It showed the ROM running, reading an all-ones header from a blank flash, and resetting on its watchdog every few hundred milliseconds. That is a healthy processor with nothing to run. The core rail reads millivolts on a blank ESP32-P4 because the processor powers it only when firmware enables the external converter. The bring-up sheet's expected value was wrong. The first chip, removed on the strength of that expectation, is unproven rather than dead.

### Backwards ESD diodes

The board did not appear as a USB device. D+ sat at 0.81 V and D- at 0 V. With the board unpowered, the meter in diode mode, the red lead on each USB line and the black lead on ground, both lines read 0.767 V, a forward diode drop to ground. The two ESD diodes, D1 and D2, were fitted backwards. Their mark identifies pin 1, which is ground, and they had been placed with the mark at the USB end, where habit puts a cathode band. The footprint was correct.

Their orientation had been argued from the datasheet during placement. A meter in diode mode across one diode before placing it would have settled the question in a minute, and saved a day of fault-finding and rework. With both turned round, the board enumerated as a USB Serial/JTAG device on the next power-up.

### An open joint on the sensor bus

The bring-up app then found no devices on its first I²C bus. Unpowered, both bus lines read their pull-ups into the 3.3 V rail, but the processor's data pin read open from its flank to the pull-up's pad. A touch with the needle iron fixed it, and the next scan found all three sensors.

### What the board taught

- Every fault on the board was an assembly fault. There were bridges, open joints and two parts fitted backwards.
- The one apparent part failure was a wrong expected value, and it cost a processor.
- The ROM boot log is the cheapest proof that a blank processor is alive, and it belongs in first power.
- The next build prints paste with a paper card, keeps the time from print to reflow short and measures any part whose orientation is in doubt before placing it, with the bridge sweep and orientation checks before first power.

## MDD400 V2.9, board 1

The MDD400 V2.9 board drives its Legacy Serial Protocol line through small dual transistors in SOT-363 packages.

### A transmit line stuck near 1 V

The legacy serial transmitter did not work. The line sat clamped at about 1.08 V. In-circuit voltages pointed into the driver stage: one transistor's base was off, yet its collector sat at 0.80 V. That looked like leakage inside the transistor.

Before any part was removed, the board was powered down and each adjacent pin pair of the driver transistors was read for continuity. Two pairs were shorted, pins 2 and 3 of Q11 and pins 2 and 3 of Q8, and the microscope confirmed solder bridges on both. The Q11 bridge tied one transistor's base to its partner's collector, so the base-emitter junction clamped the line at one diode drop. The Q8 bridge was hidden behind the Q11 fault until both were cleared. Flux, a fine-tip iron, wick and hot air cleared them, the retest passed, and no part was replaced.

### The cause was the footprint

The bridges had a cause beyond assembly. The SOT-363 footprint in the library carried one merged solder-mask opening across each row of three pins, so there was no mask dam between them. The same defect caused bridges on a WTI400 board and on other footprints, including a display flat-flex connector and a temperature sensor. The library was corrected so that every pair of pads keeps a mask dam at least as wide as the fabricator's minimum. The same audit found the ESP32-P4 footprint's dam was half the minimum, and corrected it before the MDD500 was ordered.

### What the board taught

- An in-circuit reading that suggests a failed part is confirmed with the board unpowered before the part is removed. Inspecting first saved a good transistor.
- A bridge that recurs at the same pins on more than one board points to the footprint, not the assembler.
