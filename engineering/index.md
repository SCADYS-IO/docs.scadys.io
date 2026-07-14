---
sidebar_position: 1
title: Engineering Notes
sidebar_label: Overview
---

# Engineering Notes

These pages describe design rules that Scadys applies across every product, rather than to one board. They are
referenced from the Circuit Design section of each product, in the **Part selection and design for reliability**
section.

A design rule earns a page here when three things are true:

- it applies to more than one product;
- getting it wrong has a consequence that is disproportionate to the cost of getting it right; and
- the reason is not obvious from the schematic, so it would be lost if it were not written down.

## Design standards

| Note | Covers | Why it exists |
|---|---|---|
| [MLCC Land Patterns and Flex Cracking](./mlcc-land-patterns.md) | Ceramic capacitor land patterns; solder volume; flex-crack short circuits; soft-termination parts; capacitor placement | A cracked ceramic capacitor fails as a short circuit. On a supply rail that stops the instrument working. The land pattern that prevents it costs nothing. |

## Why these are published

Scadys documentation is written first for the engineer who has to maintain the boards, and second for anyone
evaluating them. A design rule that lives only in a footprint file or in someone's memory is a rule that will be
undone by the next person who does not know it is there.

Publishing the reasoning is the only reliable way to keep it.

:::note[These are design rules, not marketing]

Where a rule exists because Scadys got something wrong first, the page says so. That is the useful part.

:::
