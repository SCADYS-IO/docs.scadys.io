---
sidebar_position: 7
title: Live Fixes and Recording Findings
sidebar_label: Live fixes and findings
---

# Live Fixes and Recording Findings

A pre-scan ends with fixes tried on the bench and findings written down. A finding names a frequency, a source and a fix, and it carries the evidence that the fix works.

## The known-emitter list

Before the scan, a list of the board's known emitters is built from the schematic, the design briefs and the bring-up records. Every peak is labelled against it. The list takes every source of a periodic signal on the board:

- *each switching converter*, at its switching frequency from its datasheet or design brief;
- *each PWM output*, such as backlight dimming, at the frequency the firmware actually sets;
- *a class-D audio amplifier*, at its switching frequency and the width of its spread spectrum, noting that it switches whenever it is enabled;
- *each high-speed link*, such as a MIPI DSI display link, at the clock that its lane rate implies;
- *each clock*, such as a pixel clock or a processor crystal, and the memory interface; and
- *each radio*, at its band.

Each entry also generates its harmonics, and each pair of switching converters generates beat frequencies at the sums and differences of their frequencies. A peak that matches nothing on the list is labelled unknown and located with the near-field probe.

## Live fixes

The two or three worst offenders each get a quick fix on the bench, where one exists, followed by a re-scan with nothing else changed. Typical fixes are:

- a ferrite on a cable;
- a clip-on shield over a part or a flex; and
- a lower setting on the load, such as a lower backlight brightness, to confirm the source.

A fix that lowers the emission by 3 dB or more is a finding worth keeping. Below 3 dB the change is inside the repeatability of an uncalibrated bench and is not counted.

## Recording

- *Each trace* is saved as a screenshot with the analyser settings visible, the mode, the supply, the distance and the cable layout recorded beside it.
- *Each finding* is raised against the board's next revision as a change, giving the frequency, the source, the evidence and the fix, as [Recording results and closing out](../recording-results.md) describes.
- *The session record* holds the setup, the settings, every trace and the benchmark comparison, and states that no reading is a compliance result.
