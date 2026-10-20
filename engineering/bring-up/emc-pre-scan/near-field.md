---
sidebar_position: 4
title: Near-field Source Location
sidebar_label: Near-field
---

# Near-field Source Location

A near-field probe held close to the board picks up the field of one structure at a time, so it shows where an emission comes from. The near-field sweep runs before the antenna scan, so that each peak the antenna sees already has a source.

## Setup

The board runs open on the bench in mode C, powered from the battery. The probe connects to the analyser, with the 20 dB preamplifier between them when a trace sits near the analyser's noise floor.

## Two probes, two kinds of field

- *The H-loop* picks up magnetic field, which comes from a loop carrying a changing current. It finds switching converters, their inductors and hot loops, and current-carrying cables.
- *The E-stub* picks up electric field, which comes from a conductor with a changing voltage on it. It finds high-speed flex cables and cables whose voltage swings, such as a speaker lead.

## Where to sweep

The H-loop is moved slowly over each of these, in turn:

- every switching converter and its inductor;
- any high-speed display or camera flex and its connector;
- the speaker leads and the audio amplifier; and
- the bus connector and its cable.

The E-stub then covers the flex cables and every external cable.

For each of the top offenders, the frequency, the structure and the position where the reading peaks are recorded. A peak that moves with the probe across a part has a source in that part. A peak that is strongest along a cable means the cable is radiating a signal it carries, or a common-mode current on it.

## Exit

The near-field sweep is complete when each top offender has a named source and at least one fix worth trying, as gate G2 of the [EMC sequence](./index.md) requires.
