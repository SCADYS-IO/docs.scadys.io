---
sidebar_position: 5
title: Radiated Emissions
---

# Radiated Emissions

The radiated scan measures what the assembled instrument radiates, from 30 MHz to 1 GHz, with an antenna at a fixed distance. It shows which near-field sources actually escape the housing and cables.

## Ambient first

Before any board is powered, two ambient traces are recorded, with the board under test and the benchmark both switched off:

1. the analyser input terminated, which gives the instrument's own floor; and
2. the antenna at its measuring position, which gives the room's ambient.

Every later trace is read against these, because a peak in the ambient is not the board's.

## Setup

- *The board is assembled in its housing*, as a customer would fit it, and powered from the battery.
- *The antenna stands on its tripod at a fixed, measured distance*, about 1 m, and the distance is written on every record.
- *The cables are laid the same way every time.* A cable is often the antenna that radiates a board's noise, so a change in its route changes the reading more than many fixes do.
- *The analyser settings are recorded on every screenshot*, so any trace can be repeated.

## Procedure

1. Record the board in mode A.
2. Record the board in mode C, with the stress build running.
3. Record the benchmark display at its brightest and busiest setting, at the same position, distance, cable layout and supply.

## Range

The antenna's stated range is 0.1 GHz to 3 GHz, so readings from 30 MHz to 100 MHz are outside its specification and are reported as indicative only. A 2.4 GHz radio sits above the 1 GHz top of the scan but inside the antenna's range, and it is noted separately rather than treated as an emission finding.
