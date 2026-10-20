---
sidebar_position: 2
title: Assembly Faults
---

# Assembly Faults

An assembly fault is a fault in how the board was built rather than in a part or the design. This page lists the kinds found on Scadys prototypes, with the measurement that finds each one and its usual cause.

## Solder bridges

A bridge joins two pins that should be separate.

- *How it shows.* A rail or signal sits at an unexpected intermediate voltage, two signals move together, or a supply draws more current than it should. A bridge between a transistor's base and another transistor's collector clamps a line at one base-emitter drop, about 0.8 V.
- *How it is found.* With the board unpowered, the meter's continuity beeper is run across every adjacent pin pair of the suspect part. A beep is checked against the netlist, because some adjacent pins share a net. A resistance lower than the circuit allows between two nets also points to a bridge. The bridge is then confirmed under the microscope.
- *Usual causes.* A stencil print that forced paste under the stencil, which a stiff card pressed down onto it does, paste that slumped during a long placement session, hand-applied paste during rework or a land pattern whose solder-mask openings merge with no mask dam between the pads.
- *Fix.* Flux, then a fine-tip iron dragged across the pins, solder wick, or hot air for a part whose pins are under its body.

## Open joints

An open joint leaves a pin unconnected even though it looks soldered.

- *How it shows.* A bus finds no devices, a processor does not start, or a pin reads open where it should read a diode drop.
- *How it is found.* With the board unpowered and the meter in diode mode, each signal pin is read to ground from the side flank of the pin. A healthy pin on a powered-down CMOS part shows a diode drop of about 0.5 V through its protection diode. An open joint reads open circuit. A power pin reads 0 Ω from its flank to its rail. Reading from the flank rather than the pad proves the joint itself.
- *Usual causes.* A part that sits proud of the board, such as a processor re-seated on flux with no fresh paste, or a ground pad that holds the package up so the edge pins do not reach their pads.
- *Fix.* A needle-tip iron with a little fresh paste on each open pin, or a full reflow of the part.

## Parts fitted the wrong way round

- *How it shows.* A diode or ESD protector fitted backwards holds its line a diode drop above ground. A USB device with backwards ESD diodes does not enumerate.
- *How it is found.* With the board unpowered and the meter in diode mode, the red lead goes on the line and the black lead on ground. A unidirectional ESD diode fitted correctly shows no forward drop. A reading near 0.7 V means it is backwards.
- *Usual cause.* A part whose identification mark does not mean "cathode". The TI ESD321's mark identifies pin 1, which is ground, and a habit formed on rectifier diodes places it the other way. Reading the datasheet during placement does not settle it reliably. A meter in diode mode across the part before it is placed does.
- *Fix.* The part is turned round. The footprint gains an explicit pin-1 or ground mark in silkscreen, and the bring-up sheet gains an orientation check before first power.

## Wrong part, missing part, extra part

A part from the wrong reel, a part left off and a DNP part fitted by mistake each change the circuit. The inspection stage checks connector part numbers, checks that DNP parts are absent, and compares rail resistances with the first good board, which shows a missing or extra load.

## Land-pattern faults that look like assembly faults

A land pattern whose solder-mask openings merge between pads leaves nothing to stop molten solder flowing from one pin to the next. Every board built on it bridges at the same place, however carefully it is assembled. A bridge that recurs at the same pins on two boards is therefore checked against the footprint's mask layer before the assembly is blamed. The library rule is that every pair of pads keeps a mask dam at least as wide as the fabricator's minimum, and that openings are never merged to work around a narrow dam.

## Process changes that prevent them

- *A clean paste print.* Paste is spread with a thick coated paper card held vertical and swiped horizontally, never pressed down with a stiff card.
- *Less paste on fine-pitch parts*, through reduced stencil apertures where a clean print still bridges.
- *A short time from print to reflow*, because paste slumps as it waits.
- *One reflow per part* wherever possible, because every extra heat cycle risks the joints around it.
- *A meter check of any part whose orientation is in doubt*, before it is placed.
- *The bridge sweep and the orientation checks before first power*, every time.
