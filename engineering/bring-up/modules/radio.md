---
sidebar_position: 5
title: Radio
---

# Radio

This module checks Wi-Fi and Bluetooth, whether the radio is on the main processor or on a companion module. A companion module is a processor in its own right, so it is brought up in the same order as the main processor before any wireless test runs.

## Companion module first

Where the radio is a companion module, five checks run before the wireless test, in this order.

1. *Enable timing.* The module's enable line is captured on the scope at power-up, and its rise is compared with the module's datasheet requirement.
2. *ROM boot log.* The module's own UART is read at 115200 baud through a 3.3 V adapter. The adapter's supply pin is never connected to the board. A ROM banner shows the module is alive.
3. *Identity.* The flashing tool reads the module's chip identity through its UART.
4. *Host reset control.* The host holds the module's reset low and releases it. The module's log must stop while reset is held and print its banner on release.
5. *Host link.* The module takes its companion firmware and appears to the host on the interface that joins them, such as SDIO, reporting ready.

Two things recur on this kind of design. An external programmer cannot reset the module while the host drives the module's enable line push-pull, so the host is held in its own download mode before the module is flashed from outside. And the companion firmware's default settings, such as its link mode and its network hostname, are recorded at bring-up, because the product firmware inherits them.

## Wireless test

- *Wi-Fi scan.* Several scans each find a plausible number of access points across a plausible range of signal levels.
- *Wi-Fi join.* The board joins a known network, gets an address and passes a ping test to the gateway.
- *Bluetooth scan.* A scan finds nearby advertisers.
- *Bluetooth advertising.* The board advertises under its name, and a phone or computer lists it.

## Supply

The radio draws in bursts. The supply limit is raised well above the board's full-load current before this module runs, because a supply that limits during a transmit burst makes other parts of the board misbehave, such as a backlight converter that cycles.
