---
sidebar_position: 6
title: Bed-of-Nails Interfaces
---

# Bed-of-Nails Interfaces

A bed-of-nails jig presses spring-loaded pins onto pads on the board, so that a board can be tested and programmed without a connector and without a person holding probes. Scadys production boards are tested and flashed this way at the contract assembler, on a jig that Scadys supplies.

## The production jig

Scadys supplies the contract assembler with a bed-of-nails jig that includes the pogo programmer. The assembler places the assembled board on the jig, and the jig powers it, programs it through the programming pads and runs its electrical test, with no Scadys staff present. The board must therefore carry every contact the jig needs:

- *the six programming signals*, being the processor enable, 3.3 V, the UART transmit and receive lines, ground and the boot strap;
- *the test contacts*, on every rail and on every signal the electrical test reads; and
- *registration*, so the board seats on the jig in one position only.

## When a board needs it

A board revision intended to be close to production carries its bed-of-nails provision. The MDD500 V0.1 carried prototype test points on its service face only, which a jig cannot reach, and that omission is corrected in V0.2.

## Laying out the contacts

- *All contacts on one face.* A jig contacts one face, and that face is chosen with the housing and the parts in mind, because tall parts on the contact face limit where pins can land.
- *A minimum pad size.* Each contact pad is large enough for the jig's pins to hit reliably. Each test point on the production list records its net, its face and its minimum pad size.
- *Bare, flat pads.* A pogo pin lands on bare copper, so contact pads carry no silkscreen and no solder mask.
- *Pin 1 marked for the jig's view.* The programming pads are numbered and marked as the jig sees them. On the MDD500 V0.1, the programming pads were drawn as the footprint of a header on the opposite face, so their notch mark reads mirrored from the face the pads are on.

## One supply on the 3.3 V rail

The pogo-pad array carries the board's 3.3 V rail. The jig and the board's own regulator must never drive that rail at the same time. Either the jig powers the board through its supply input and leaves its own 3.3 V pin unconnected, or the board's input is left unpowered and the jig supplies 3.3 V through the programming pads. The jig's design states which. The bench socket's pin 2 is not connected, so the bench cable cannot make the mistake.

## The programming pads

Every board carries the six programming signals on a 2 × 3 pogo-pad array at 2.54 mm pitch, footprint `CON-POGO_PAD_2x3P_2.54`, as the jig's programming target. The 2.54 mm pitch suits a pogo pin far better than the 1.27 mm pads of the bench socket, so the pads stay on the board beside the socket, as [Programming interfaces and connectors](./programming-interfaces.md) describes.
