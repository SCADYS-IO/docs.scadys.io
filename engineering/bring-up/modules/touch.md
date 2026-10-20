---
sidebar_position: 2
title: Touch
---

# Touch

This module checks a touch controller, whether a separate controller on its own connector or a touch engine built into the display panel. Touch is tested with the display running, so the operator can see where the touches land.

## Controller and interrupt

- *Identity.* The touch controller answers at its strapped bus address and returns its chip identity, firmware version and coordinate range.
- *Interrupt.* The interrupt line is captured on the scope through a touch. It must reach a valid logic high for the processor's input, above the input-high threshold at the IO voltage it runs on.

## Coverage

A grid of targets is drawn on the screen, nine points or more, and each is touched in turn. Every point must report, at the position touched. An in-cell touch engine shares the panel's timing, so a display timing change can stop touch reporting entirely. If touch reports nothing while the display runs, the display's vertical timing is checked before the touch hardware.

## Bus speed

The touch bus is captured on the scope at each speed the firmware might use. The rise time of the clock and data lines is compared with the bus standard's limit for that speed. Where the faster speed fails its rise-time limit, the firmware runs the bus at the slower speed, and the result is recorded so the firmware setting traces to a measurement.

## Wet touch

A marine display must ignore water on the glass and still respond to a finger. The wet-touch test runs with a recorder image that logs every touch report with a timestamp, and a marker grid on the glass as targets. Each run applies one wetness condition, and the conditions run from mild to severe:

1. dry glass, as the reference;
2. a fine mist;
3. standing drops; and
4. a dried salt film.

Each condition has two checks. With nobody touching the glass, the log must show no touch at all. Taps and swipes across the grid must then register in order, as they do on dry glass. A comparison against an earlier product on the same rig shows whether a new panel is better or worse, and the final test runs on the cover glass and housing the product ships with.
