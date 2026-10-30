---
sidebar_position: 5
title: Double-Sided Boards
---

# Double-Sided Boards

A double-sided board places parts on both faces. It saves area and lets a connector or sensor sit on the face it serves, but every part on the second face changes how the board is stencilled, reflowed, inspected and repaired.

## What goes on each face

The Scadys display boards put almost everything on one face and keep the other face light.

- *The heavy and fine-pitch parts share one face.* On one SCADYS display board, 282 of 331 placements are on the rear face, including the processor, the radio module, the power MOSFET, the TVS diodes, the wound inductors, the large capacitors and the external connectors.
- *The other face carries small, light parts.* The display face holds 0402 and 0603 passives, two small sensors, the display and touch flat-flex connectors and the programming pogo pads. Its finest pitch is the 0.5 mm of the 40-pin display connector.
- *A part goes on the second face for a reason.* The display connectors must face the display, and the ambient light sensor must face the window. A part is not moved to the second face only to save space.

## Surface tension sets the weight limit

A part whose solder melts while it hangs upside down is held only by the surface tension of the molten solder. For lead-free solder that holds a part up to about 0.047 g/mm² of pad area. Small passives and sensors sit well inside that limit. A module, a power package or a wound inductor does not.

In an oven, the whole first face hangs through the second reflow, so every part on it must pass this check. On a hot plate, the heavy face sits on the pre-heater below its melting point while the light face is reflowed, and only the area under the hot air comes close to melting. A heavy part directly opposite a light-face part under the hot air is therefore the one at risk, and the hot air is kept short and local there.

## Reflow order

The order depends on how the board is reflowed.

- *On a hot plate, the heavy face goes first.* The heavy face carries the most complex parts, and while the light face is still bare the board lies flat on the plate. Every part on the heavy face can then be inspected and reworked on the plate until the light face is placed. The light face follows with the board on risers, the hot plate as a pre-heater and hot air for the final rise. A foil shield covers any part with a single-reflow limit, such as the ESP32-C6-MINI-1 module.
- *In an oven, the light face goes first.* The heavy parts then see only one reflow, and the light parts, which pass the surface-tension check, ride through the second reflow upside down. A part with a single-reflow limit must be on the face reflowed last.

Scadys prototypes are currently reflowed on a hot plate. Through-hole parts are hand-soldered after both faces are reflowed.

## A populated face changes stencilling and rework

A stencil must lie flat on the board. Once one face is populated, the stencil for the other face needs a jig that clears the parts already fitted, and a stencil can no longer be laid over a populated face at all. That has two consequences.

- *Any part that is fitted early blocks the stencil.* On the first MDD500 board, the processor's regulator output capacitors were on the light face, so the whole light face was printed through a stencil jig and fitted before first power, rather than part by part.
- *Rework on a populated board uses hand-applied paste.* When the first MDD500 board's processor was replaced, the stencil could not lie on the populated board, so the site was pasted by hand. Hand paste is less even than stencilled paste, and that board then needed one bridge cleared before power.

Rework of a part on one face heats the other face too. A board under rework sits on risers that clear the parts below it, with the hot plate as a pre-heater and hot air for the final rise, and a foil shield over any part that must not see another reflow. [Reflowing and reworking difficult parts](../../bring-up/fault-finding/reflow-and-rework.md) gives the method.

## Fiducials and fabrication output

A double-sided board carries fiducials on both faces, three per face, placed so that the two sets cannot be superimposed and the board cannot be loaded the wrong way round. The fabrication output for a double-sided board is checked for the rotation of every bottom-face part before it is ordered, because a bottom-face rotation error is invisible in a top-face review.
