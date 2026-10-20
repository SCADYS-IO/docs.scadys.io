---
sidebar_position: 1
title: Display and Backlight
---

# Display and Backlight

This module brings up a display panel and its backlight. The panel is connected while the board is unpowered, and the bring-up app drives it from a known test pattern.

## Before the panel lights

- *The backlight is off at power-up.* The dimming signal reads below its logic-low threshold and the panel stays dark until firmware turns it on. A backlight that flashes on at power-up shows the dimming input is floating or wrongly pulled.
- *The panel's power sequence passes.* Its rail order, the delay between its logic and analog supplies, and its reset timing are checked in [Power sequence and supply range](../core/power-sequence-and-supply-range.md) before any picture is expected.
- *The panel answers its identity read.* A MIPI DSI panel returns its driver IC's identity bytes to a short read before video starts. A correct identity proves the control path, the lane wiring of the low-power link and the panel's supplies.

## Picture

The app shows a test pattern, and the step passes when the pattern appears with no corruption on the expected number of lanes. A panel that answers its identity read and takes its initialisation table but shows a black screen with the backlight on is receiving a video stream it cannot display. The fault is then in the video settings, not the hardware. Each setting is found by changing one variable at a time, working through the lane count, the pixel format, the pixel clock and the vertical and horizontal timing. Each result is recorded, including the ones that failed.

A pixel clock request is checked against the clock the driver actually produces, because a clock divider can only reach certain frequencies, and a driver that compensates for the difference may cut the line short.

## Backlight current

The backlight current is measured at full brightness against the window the design gives, either with a meter in series or across a sense resistor. A reading taken indirectly carries its uncertainty, and a reading at the edge of the window is recorded as "at the limit", not as a clean pass.

## Dimming

The backlight is swept across its full dimming range while it is filmed on a phone at 24, 25, 30 and 60 frames per second, and listened to in a quiet room. The step passes when the film shows no flicker or banding at any frame rate, and when no whine is audible. Pulsed backlight current can make a panel's flex and ceramic capacitors sing at the dimming frequency. A dimming frequency above the audible range at normal brightness, with a lower frequency kept only for the lowest levels, removes the whine without a visible step at the changeover.

## Supply behaviour

The backlight is often the board's largest load, so its behaviour on a weak supply is part of this module. A backlight boost converter that cycles on and off at a supply's current limit shows as a flashing screen. The supply limit is set well above the board's full-load current before this module runs, and the board's behaviour on a sagging input is tested separately in [Power sequence and supply range](../core/power-sequence-and-supply-range.md).
