---
sidebar_position: 1
title: Fault-Finding
sidebar_label: Order of suspicion
---

# Fault-Finding

When a bring-up step fails, the cause is found before the next step starts. This page sets the order in which causes are suspected. The pages that follow cover assembly faults, rework, measurement traps and worked cases from Scadys boards.

## Order of suspicion

A failed step on a hand-built prototype is suspected in this order.

1. *The assembly.* A solder bridge, an open joint, a part fitted the wrong way round, a wrong part or a part left off. On Scadys prototypes this is by far the commonest cause, and it is the cheapest to check, because it needs only a meter, a microscope and an unpowered board.
2. *The expected value.* The bring-up sheet's pass window may be wrong. A sheet is written before the first board exists, from datasheets that describe a part's normal operation, and the board under test may be in a state the datasheet describes elsewhere, such as a processor with no firmware. The datasheet and the reference manual are re-read for the exact state of the board before the reading is called a fault.
3. *The part.* A part damaged in assembly, by heat, by ESD or by a fault earlier in bring-up, or a part that is counterfeit or the wrong revision.
4. *The design.* A circuit that does not do what the design intended.

Each step is cleared before the next is suspected. A part is not replaced while an assembly fault could still explain the symptom, and a design change is not proposed while the part could still be at fault.

## Why this order

Replacing a part costs the part, a rework cycle with its own risk to the board and, for a scarce processor, one of a few units. It also destroys evidence, because the joints and the removed part can no longer be measured as they were. Checking the assembly costs minutes, and checking the expected value costs a careful reading of the datasheet.

On the first MDD500 board, a processor was replaced on readings that looked like a dead core. The replacement gave identical readings, and the processor's own boot log then showed both were healthy: the sheet expected a rail voltage that the processor does not produce before firmware. Every real fault on that board was an assembly fault. [The case studies](./case-studies.md) give the detail.

## Before removing any part

A part is removed only when every item in this list is done and recorded:

- every joint of the part has been inspected under the microscope;
- every adjacent pin pair has been swept for bridges, with the board unpowered;
- every power and ground pin has been read for continuity from its pin flank to its rail;
- every polarised part on the failing circuit has been checked for orientation;
- the expected value has been re-derived from the datasheet for the board's exact state; and
- the cheapest proof of life the part offers has been tried, such as a processor's ROM boot log.

## Work on a written process

A fault that survives the first hour gets a written fault-finding process before more rework. The process lists the hypotheses, the reading that would separate each one, and the order to take the readings in, unpowered readings first. Every reading is recorded with its conditions, so a reading that later turns out to have been taken in a different state can be identified and set aside rather than trusted.
