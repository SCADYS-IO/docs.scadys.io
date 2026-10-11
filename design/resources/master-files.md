---
sidebar_position: 4
title: Master files
---

# Master files

Every page is drawn in one master file, in VectorCraft. The master holds the whole page as it will look, so it can be judged by eye, and its layers say which parts become artwork and which the firmware draws.

## Keep one VectorCraft master per page

Each page's master is `design/<page>/MDD_Page_<Page>.vectorcraft`, saved compressed and in day colours. The first is the wind page, `design/wind/MDD_Page_Wind.vectorcraft`.

- *Day colours.* A master always rests in day colours. The night version is rendered from it by swapping each role's day colour for its night colour, so no night copy of a master is ever kept.
- *Illustrator originals.* A page first drawn in Illustrator keeps its `.ai` file as the record of that drawing. VectorCraft cannot write the Illustrator format, so the `.ai` is never edited once a VectorCraft master exists.
- *Source.* `ux/design/README.md`, change of master. VectorCraft runbook, design files. `ux/design/LEARNINGS.md`, entries 15 and 20.

## Set up a new master on whole pixels

A master is one 720 × 720 artboard, in RGB, with its origin at the top left.

- *Whole pixels.* Every position, size and stroke is a whole pixel, font sizes are whole pixels and the dial centre is exactly (360, 360).
- *Real fonts and role colours.* Text is set in the real fonts at its role size, and every shape takes its role's colour.
- *Source.* `ux/design/README.md`, "Draw from scratch on whole pixels" and document setup.

## Start from the templates

The templates are in `design/_template/`.

| File | What it is |
|---|---|
| `MDD_Template_Dial.ai` | The dial page template, in Illustrator |
| `safe_area_720.svg` | The MDD500 corner safe area at 720 × 720, placed at (0, 0) on the `REF safe area` layer |
| `SVG/Day_Vessel.svg` and `SVG/Night_Vessel.svg` | The vessel outline, 147 × 502 px, placed at 1.11 scale on a dial page |
| `SVG/DAY_Logo.svg` and `SVG/NIGHT_Logo.svg` | The SCADYS mark, placed at 45 × 63 px |
| `SVG/DAY_Alert.svg` and `SVG/NIGHT_Alert.svg` | The alert badge, 66 × 60 px |
| `1x/` | The same six shapes as PNG at 1x, for a quick look |

- *Source.* `ux/design/README.md`, layers. `ux/specs/pages/wind.md`, vessel outline, logo mark and alert.

## Draw figures in VectorCraft too

The figures in these guidelines are drawn in VectorCraft by scripts in `guidelines/figures/`, with their sources kept in `guidelines/figures/src/`. The scripts take every colour from `palette.json` and place the template shapes by transform, so a figure changes with the palette.

- *Source.* `ux/guidelines/figures/figkit.py` and `components.py`.

:::note[Not yet ruled]

A dial template in VectorCraft. The only template is still the Illustrator file, and the wind master serves as the working example until one is made. The Illustrator menu steps in `ux/design/README.md` are also still to be rewritten for VectorCraft.

:::
