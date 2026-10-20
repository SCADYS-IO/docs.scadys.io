---
sidebar_position: 1
title: Principles
sidebar_label: Overview
---

# Circuit Design Principles

These pages set out how a Scadys board is designed so that a prototype can be assembled by hand, probed, isolated block by block, programmed and repaired. Every Scadys prototype is built in-house, on a hot plate and with hot air, and is brought up on the bench by one engineer. A board that ignores these principles still works when it is perfect. It is very hard to bring up when it is not, and a first prototype never is.

| Principle | Covers |
|---|---|
| [Test points](./test-points.md) | Which nets get a test point or a through-hole ring, which face they sit on, and which nets are probed at component pads instead. |
| [Isolating circuit blocks with DNP parts](./dnp-isolation.md) | Fitting fallback circuits but leaving them disconnected, select links, and current-measurement links. |
| [Part sizes for hand assembly](./part-sizes.md) | The 0603 rule, the packages that are excluded, paste printing and orientation checks on small parts. |
| [Double-sided boards](./double-sided-boards.md) | What goes on each face, the reflow order, and what a populated face does to stencilling and rework. |
| [Bed-of-nails interfaces](./bed-of-nails.md) | The assembler's test and programming jig, and what it needs from the board. |
| [Programming interfaces and connectors](./programming-interfaces.md) | The 6-pin ESP-PROG connector, programmer power, USB sockets on maker versions and companion-module access. |
| [Thermal relief on through-hole pads](./thermal-relief.md) | Making hand-soldered through-hole pads on a copper pour solderable with an iron. |

These principles are written for the prototype. A production board may remove parts that only serve bring-up, such as a current-measurement resistor, and each page says where that applies.
