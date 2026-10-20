---
sidebar_position: 7
title: Legacy Serial
---

# Legacy Serial

This module checks the Legacy Serial Protocol interface, which connects to older instruments over a single shared data line (for example SeaTalk™). The interface has an isolated side and a processor side, so every measurement on the isolated side uses the isolated ground.

## Idle

The interface is off by default. With it disabled, the data line idles high, at the level set by the bus pull-up.

## Receive

A talker sends at 4,800 baud onto the line, and both sides of the isolator are captured on the scope. The framing must be clean on the line side, and the processor-side signal must follow it with the polarity the firmware expects.

## Transmit

The transmitter drives a square wave of known frequency onto the line, and both sides are captured. The edge count over a fixed window must match the frequency sent, a driven low must pull the line below its logic-low threshold, and the processor-side signal must toggle with it.

## When the line is stuck

A transmit line held at an intermediate voltage is the classic legacy-serial fault. On earlier boards it was a bridge on a small dual-transistor package in the driver, which tied a base to a collector and clamped the line at one base-emitter drop. The fault is found with the board unpowered, by reading each adjacent pin pair of the driver transistors for continuity, and confirmed under the microscope before any part is removed. [The case studies](../fault-finding/case-studies.md) give a worked example.
