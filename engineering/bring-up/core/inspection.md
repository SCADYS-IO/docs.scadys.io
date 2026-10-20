---
sidebar_position: 2
title: Bare Board and Assembly Inspection
sidebar_label: Inspection
---

# Bare Board and Assembly Inspection

Inspection runs twice: once on the bare board before paste, and once on the assembled board before any power is applied. Every fault found here is found without risk, because nothing is powered. Most first-prototype faults are assembly faults, and this stage is where they are cheapest to find.

## Stage 1: bare board, before paste

The bare-board checks confirm that the fabricated board matches the design where an error could not be corrected later.

- *Fiducials.* Each face carries three fiducials, and the two patterns differ, so the board cannot be loaded flipped or rotated.
- *Isolation.* Every isolation barrier reads open circuit across it, such as an isolated ground to the main ground, and an isolated supply to the main 3.3 V rail.
- *Outline and orientation.* A board outline that is nearly square can be loaded rotated by 90°. The sheet checks that the board seats in its housing or jig only one way.

## Stage 2: assembled, unpowered

The assembled-board checks look for the faults that hand assembly produces. They follow a fixed order, from the look of the board to the resistance of its rails.

### Visual inspection

Every fine-pitch part is inspected under the stereo microscope for bridges, for pins that are not wetted, and for a package that sits proud of the board. A processor that sits proud has open joints along its edges even when every visible pin looks soldered.

### Solder-bridge sweep

A bridge sweep reads every adjacent pin pair on the parts that are prone to bridging, with the meter's continuity beeper. The sheet names the parts and the pin pairs. Fine-pitch processors and QFN parts are always on the list, because a bridge under the package edge is easy to miss by eye, and so is any part that bridged on an earlier board.

A beep is checked against the netlist before it is called a fault, because some adjacent pins share a net by design.

### Orientation of polarised parts

Every polarised part is checked with the meter in diode mode before first power. A diode, an ESD protector or an electrolytic capacitor fitted backwards can hold a line at a diode drop, or fail when power is applied. The sheet gives, for each part, which pin the red lead goes on and what reading passes. For a unidirectional ESD diode on a data line, with the red lead on the line and the black lead on ground, a pass is no forward drop. A reading near 0.7 V means the part is backwards.

Small parts carry marks whose meaning differs between parts. An ESD diode's mark may identify its ground pin, which is the opposite of a rectifier's cathode band. The sheet states what the mark means for each such part. During placement, a part whose orientation is in doubt is measured with the meter before it is placed, rather than argued from the datasheet, so this check should find nothing.

### Hidden pads

A part with an exposed pad under its body, such as a QFN or WSON flash memory, is checked for continuity from that pad's net to ground. That reading is the only evidence the hidden pad soldered.

### Parts that must be absent

The sheet checks that every DNP part is absent, as well as that every fitted part is present. A fitted bus termination resistor or a fitted fallback link changes the circuit as much as a missing part does.

### Rail resistance to ground

Each supply rail is read to ground with the meter on resistance, in both lead polarities. The pass criterion is no dead short. Each value is recorded, because the first board's readings become the comparison for every later board. A rail with large capacitors creeps for 10 s to 20 s as they charge from the meter, so the settled value is recorded rather than the first reading.

### Connectors, probe access and coating

- *Connector part numbers* match the specified parts, because a connector of the same footprint from a different series may not mate.
- *Every probe-map point takes a probe*, so no point is blocked by a part or by solder.
- *No conformal coating* is applied before bring-up, because coating stops a probe reaching a pad.
