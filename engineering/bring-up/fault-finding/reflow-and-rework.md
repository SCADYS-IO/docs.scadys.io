---
sidebar_position: 3
title: Reflowing and Reworking Difficult Parts
sidebar_label: Reflow and rework
---

# Reflowing and Reworking Difficult Parts

Scadys prototypes are reflowed on a hot plate, with hot air for local work and a thermal camera to watch temperatures. This page covers the parts that are hard to reflow or rework: fine-pitch packages with a ground pad, modules with a single-reflow limit, connectors on heavy copper, and any part on a board that is already populated on both faces.

## Solder and profile

The Scadys bench paste is SAC0307 (Sn99Ag0.3Cu0.7), Type 4 powder, with a melting point of 217 °C on its label. Alloy literature gives SAC0307 a melting range that ends at about 227 °C. On the bench, the paste reflowed fully with the hot plate at 218 °C, so the label figure matches what the paste actually does, and a thermocouple through one profile on a scrap board settles which figure governs.

A full reflow follows the lead-free profile limits:

| Phase | Limit |
|---|---|
| Ramp to 150 °C | 1 °C/s to 3 °C/s |
| Soak, 150 °C to 200 °C | 60 s to 120 s |
| Time above liquidus | More than 30 s |
| Peak | 235 °C to 250 °C, and below 245 °C where a module's datasheet asks for it |
| Cooling | 1 °C/s to 5 °C/s, never faster than 6 °C/s |
| Total | 8 minutes at most |

## Reading temperature with a thermal camera

A thermal camera reads green solder mask well and bare metal or shiny solder poorly, because their emissivity is low. Readings are therefore taken on the solder mask beside the part, or on a piece of black tape placed there, rather than on a pad or a joint. On the Scadys hot plate, the camera reading on the board matched the plate's thermostat setting.

## Modules with a single-reflow limit

A radio module such as the ESP32-C6-MINI-1 may be reflowed only once. It is placed on the face reflowed last, as [Double-sided boards](../../circuit-design/principles/double-sided-boards.md) describes, and any later rework near it covers it with a foil heat shield. The module is also moisture-sensitive, at MSL 3, so it stays sealed with fresh desiccant until its reflow, or is baked to J-STD-033 first.

## Fine-pitch packages with a ground pad

A QFN processor with a large ground pad is the hardest part on a Scadys board.

- *Paste.* A fine-pitch QFN bridges when paste is forced under the stencil, which a stiff card pressed down onto the stencil does. Paste is spread with a thick coated paper card held vertical and swiped horizontally, and the part is placed and reflowed soon after printing.
- *The ground pad heats last.* The pad sits under the package and is the last land to reach temperature, so a short dwell above liquidus leaves it unwetted while the edge pins look fine.
- *Re-seating needs fresh paste.* A part lifted and re-seated on flux alone sits proud, because the ground pad keeps only the solder that survived the wick. Its edge pins then make no contact. A re-seated part gets fresh paste on its ground pad and on its pins.
- *Inspection afterwards.* The pin sweep, the flank-to-rail continuity on every power pin and the diode-mode reading on every signal pin, described in [Assembly faults](./assembly-faults.md), are repeated after every rework of the part, before power.

## Rework on a board populated on both faces

A part on a populated board cannot be printed through a stencil, because a stencil cannot lie flat over parts. The site is pasted by hand, which is less even than a stencil, so the bridge sweep after rework matters more. The method that keeps the rest of the board safe is:

1. the board stands on risers that clear the parts on its lower face;
2. the hot plate runs at about 150 °C as a pre-heater, so the hot air only adds the last 80 °C to 90 °C locally;
3. a foil shield covers any part that must not see another reflow;
4. hot air lifts the old part, and the site is cleaned and pasted;
5. hot air reflows the new part; and
6. the thermal camera watches the opposite face while the hot air works.

Small parts on the lower face hang upside down during this and are held by the surface tension of their solder, which holds a part up to about 0.047 g/mm² of pad area for lead-free solder. Passives and small sensors under a reworked processor stay in place.

## Connectors on heavy copper

A connector whose pins join solid ground and supply pours takes heat away faster than a soldering iron can supply it, so the iron cannot make the joint. Such a connector is soldered with hot air or on the hot plate. The board's next revision gives those pins thermal relief, which keeps the copper's current capacity while letting an iron make the joint.
