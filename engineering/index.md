---
sidebar_position: 1
title: Engineering
sidebar_label: Overview
---

# Engineering

These pages hold the engineering practice that Scadys applies across every product, rather than to one board. The product pages describe what each board is. These pages describe how a Scadys board is designed so that it can be built and tested by hand, and how a new prototype is brought up, checked for emissions and repaired.

## Sections

| Section | Covers |
|---|---|
| [Circuit design principles](./circuit-design/principles/index.md) | Design for prototyping: test points, isolating circuit blocks with DNP parts, part sizes for hand assembly, double-sided boards, bed-of-nails interfaces, programming connectors and thermal relief. |
| [Parts](./circuit-design/parts/index.md) | Rules for particular part families, starting with MLCC land patterns and flex cracking. |
| [Bring-up and verification](./bring-up/index.md) | The general method for bringing up a new prototype: core steps for every board, function modules chosen per board, the in-house EMC pre-scan and fault-finding. |

## What earns a page here

A rule or a method earns a page here when three things are true:

- it applies to more than one product;
- getting it wrong costs far more than getting it right; and
- the reason is not obvious from the schematic or the board, so it would be lost if it were not written down.

## Why these are published

Scadys documentation is written first for the engineer who has to maintain the boards, and second for anyone evaluating them or building one. A rule that lives only in a footprint file, or in one person's memory, is undone by the next person who does not know it is there.
