---
sidebar_position: 1
title: Components
sidebar_label: Overview
---

# Components

The Components are the parts every MDD page is built from. Each page describes what the part is for, how it is drawn, what colour and type roles it takes, and which parts the firmware draws in code and which come from artwork.

| Page | Covers |
|---|---|
| [Dials and rings](./dials-and-rings.md) | The dial card and its recessed surround, the tick ring, dial numbers, the compass card and the port and starboard sector arcs |
| [Needles and pointers](./needles-and-pointers.md) | The apparent wind needle, the pivot cap, the true wind pointer and the target bugs |
| [Readouts and windows](./readouts-and-windows.md) | Large values on a dial page, the frameless readout window and values in data cells |
| [Labels, units and buttons](./labels-units-and-buttons.md) | Labels and units as touch toggles, buttons, icon buttons and their pressed state |
| [Badges and markers](./badges-and-markers.md) | The SCADYS mark, the alert badge and the port and starboard steer arrows |
| [Vessel outline](./vessel-outline.md) | The hull drawn at the centre of the dial pages and the cross-track bar |

## Code or artwork

Every component is either drawn by the firmware in LVGL or exported from the page master as artwork. Each page says which.

- *Drawn in code.* Text, ticks, arcs, cells and frames take their colour from a palette role at run time.
- *Flat artwork* is exported as an alpha mask and tinted by its role.
- *Shaded artwork* is a full-colour image, rendered in a day and a night version from one drawing.
- *Source.* `ux/specs/pages/common.md`, "One artwork set for day and night". `ux/design/README.md`, layers.
