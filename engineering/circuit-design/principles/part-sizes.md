---
sidebar_position: 4
title: Part Sizes for Hand Assembly
sidebar_label: Part sizes (0603 against 0402)
---

# Part Sizes for Hand Assembly

Scadys prototypes are placed by hand under a stereo microscope, printed through a stencil and reflowed on a hot plate. The package sizes on the board decide how long that takes, how many joints need rework and whether a fault can be found with a meter probe.

## Passives: 0603 unless space forces 0402

- *0603 is the rule.* An 0603 part is quicker to place by hand and easier to inspect. It is also large enough to probe at its pads during fault-finding.
- *0402 is used only where space forces it*, such as the fan-out around a processor, where an 0603 decoupling capacitor cannot sit close enough to its pin. Where 0402 is used, it goes on the audited Scadys land patterns `RESISTOR:RES-0402` and `CAPACITOR:CAP-0402`.
- *Nothing smaller than 0402* is used for a passive.

0402 parts can be hand-placed, and the MDD500 carries many of them, but they are slow to place, hard to inspect and hard to probe. The MDD500 build is the reason the rule is 0603.

## Packages that are excluded

- *Leadless packages under 2 mm*, such as X2SON, DSBGA and any leadless part at 0.4 mm pitch, are excluded. A regulator offered only in X2SON is replaced by a SOT-23-5 alternative.
- *QFN and DFN packages* are accepted at a body of 2 mm or larger and a pitch of 0.5 mm or coarser. A finer-pitch processor, such as the 0.35 mm pitch QFN104 of the ESP32-P4, is carried only where no alternative exists, and its assembly is planned for specifically.

Small dual transistors in SOT-363 packages are accepted. They bridged on earlier boards because their land pattern merged the solder-mask openings between pins, and with a mask dam between every pair of pads they assemble cleanly.

## Paste printing

The paste print decides most of the solder faults on a hand-built board. Paste is spread across the stencil with a thick coated paper card, such as a business card, held vertical and swiped horizontally with light pressure. A stiff plastic card pressed down onto the stencil forces paste under it and around the apertures, and that bridges fine-pitch pins. On the first MDD500 board, the top face was printed with a pressed plastic card and its 0.35 mm pitch processor bridged in many places. The bottom face was printed with a paper card, and its 40-pin connector and two small sensors reflowed correctly first time.

A hand-placed board also takes hours, and paste slumps as it waits. A fine-pitch part is placed early, and the time from print to reflow is kept short.

## Orientation of small polarised parts

A small polarised part, such as a SOD-523 ESD diode, carries a single mark whose meaning differs between parts. On the TI ESD321, the mark identifies pin 1, which is ground, while habit from rectifier diodes reads a mark as the cathode. On the first MDD500 board the orientation of the two USB ESD diodes was argued from the datasheet during placement, and both were fitted backwards. A meter in diode mode across the part would have settled it in a minute.

Wherever a part's orientation is in doubt, the part is measured with a meter in diode mode before it is placed. A footprint for a part whose mark does not mean "cathode" also carries an explicit pin-1 or ground marking in silkscreen, and the bring-up sheet checks every polarised part's orientation before first power.
