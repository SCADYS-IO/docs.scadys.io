---
sidebar_position: 4
title: Audio
---

# Audio

This module checks an audio amplifier and its speaker, or a beeper. It confirms that the amplifier is silent when it should be and clean when it plays.

## Off state

The amplifier's shutdown or enable line reads below its off threshold at power-up, and the speaker is silent. A filterless class-D amplifier switches whenever it is enabled, even with no signal, so an amplifier that is enabled but idle is still a source of noise. The off state at power-up is part of [First power](../core/first-power.md).

## Tone

The app plays a 1 kHz tone at a fixed level below full scale, and the operator listens. The tone must be clean and steady. A brief click when the amplifier enables is acceptable. A click at every tone, a buzz or distortion is a failure.

## Signal checks

Where the tone is wrong, the bit clock, the word clock and the data line are captured on the scope. The word clock must run at the sample rate the firmware sets, and the amplifier's mode pin must sit at the level that selects the channel the firmware sends.

## Emissions

The speaker leads radiate the amplifier's switching. A continuous full-scale tone is the amplifier's worst emissions state, and the [EMC pre-scan](../emc-pre-scan/index.md) measures it in that state.
