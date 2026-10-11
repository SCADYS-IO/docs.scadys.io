---
sidebar_position: 1
title: Display Design Guidelines
sidebar_label: Overview
---

# SCADYS Display Design Guidelines

These guidelines are the reference that every page, control and graphic asset on the SCADYS Marine Data Displays is designed against. They follow the shape of Apple's [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines), cut down to a marine instrument that is read at a glance from across a cockpit by day and at night, and that is operated by a gloved, wet hand.

## Audience

The guidelines are written for the people who design and build the display pages.

- *The designer* draws pages and assets against them and checks a drawing against them before it goes to the panel.
- *The firmware engineer* builds pages in LVGL against them, because a page spec states only where a page departs from them.
- *The reviewer* judges a page against them and cites the guideline a change breaks.

## How each guideline is written

Each guideline states the rule, the reason for it and the source it comes from.

- *The rule* is a heading and one or two sentences, written as an instruction.
- *The reason* says what goes wrong without the rule, so a reader can judge a case the rule did not foresee. A guideline whose ruling recorded no reason gives none, rather than an invented one.
- *The source* names the specification or the design record that holds the ruling, so a reader can check it and a later change can be traced.
- *A figure* shows a correct example beside an incorrect one where a picture makes the rule clearer. Every figure is drawn in VectorCraft and kept with the guidelines.

A guideline that has not yet been decided is shown as an open item, as below. An open item is never filled with an assumed rule.

:::note[Not yet ruled]

An open question, with the specification or record that tracks it.

:::

## Sections

| Section | Covers | Status |
|---|---|---|
| [Foundations](./foundations/index.md) | Legibility, colour, typography, layout, materials and depth, motion, night use and touch accessibility | Draft |
| [Patterns](./patterns/index.md) | Data states, alerts, gestures, page navigation, settings and confirmation, and lock and wake | Draft |
| [Components](./components/index.md) | Dials, rings and sector arcs, needles and pointers, readouts and windows, labels, units and buttons, badges and markers, and the vessel outline | Draft |
| [Platforms](./platforms/index.md) | The MDD400, MDD410 and MDD500, and a placeholder for the SCADYS mobile app | Draft |
| Resources | The palette, the fonts, the VectorCraft master template and the layer scheme | Not yet written |

## Products

The guidelines cover three products. They share one design at 720 × 720 pixels, and each shows it on its own panel.

- *MDD400.* A DWIN smart display with an ESP32-S3 host, 480 × 480 pixels, which takes the design at two-thirds scale.
- *MDD410.* An ESP32-P4 with a 4 in MIPI-DSI panel at 720 × 720 pixels, which is the design reference.
- *MDD500.* An ESP32-P4 with a 5 in MIPI-DSI panel at 720 × 720 pixels, which shows the same pixels larger and hides the corners behind a rounded window.

A SCADYS mobile app is planned. The Foundations are written so that they hold for it too, wherever the rulings allow. A value that belongs to one display, such as a pixel position, says which display it belongs to.

## Source

The guidelines summarise the page and interaction specifications in the private `SCADYS-IO/ux` repository under `specs/` and the palette in `tokens/palette.json`. Where a guideline and a specification disagree, the specification is the authority and the guideline is corrected.
