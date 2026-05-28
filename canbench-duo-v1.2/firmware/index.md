---
title: Firmware
hw_version: v1.2
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
sidebar_label: Firmware
---

:::note[Hardware version]
CANBench Duo **v1.2** — Fabricated prototype, testing phase.
:::

## The CANBench Duo has no firmware

The CANBench Duo is a **fully passive instrument**. There is no microcontroller on the board, no switching converter, no clock, no flash memory, no code of any kind.

Everything the instrument does — filtering the supply, presenting LISN impedance, attenuating measurement signals, encoding the four-state power LED, blowing the fuse on over-current — is implemented with discrete passive and small-signal components arranged on the PCB. The behaviour falls out of physics, not from instructions.

## Why no firmware

The design choice is deliberate and aligns with the broader SCADYS-IO measurement-instrument philosophy:

1. **No code path that can be wrong.** A LISN's job is to present a predictable impedance to the DUT and tap RF disturbance into a 50 Ω port. Both jobs are solvable with passive networks; adding a microcontroller adds firmware behaviour, decoupling, clock noise, and an EMI source inside the very instrument designed to measure EMI.
2. **No power-up sequencing.** The protection FETs, the LED state encoder, and the LISN ladder all self-bias from the same rails they protect or operate from. No initialisation step has to complete before the instrument is functional.
3. **No firmware-update path required.** The instrument behaviour is fixed at fabrication; field bring-up requires no special-cable interface, no flash tool, and no version-management process.
4. **Lower BOM cost and complexity.** A passive instrument is cheaper to manufacture, easier to test, and has no firmware-support tail for the lifetime of the product.

The [Power Indicator LED](../circuit-design/power-indicator-led.md) page covers the most "logic-like" feature on the board — the four-state encoding via an RGB LED + a single BC807 PNP — and shows how the state behaviour is implemented purely by net topology against the LISN supply-path rail relationships.

## What this means for users

There is no firmware to update, no boot loader to enter, no version of "the code" to know about. The instrument's behaviour is determined entirely by the **hardware version** stamped on the PCB silkscreen (currently `0B-1.1-CAN` on the fabricated V1.1 prototype; `0B-1.2-CAN` on the V1.2 schematic). When the hardware version stamp changes, the behaviour may change; otherwise it does not.

## Related pages

- [Circuit Design](../circuit-design/index.md) — the discrete topology that implements the full instrument behaviour
- [Power Indicator LED](../circuit-design/power-indicator-led.md) — the closest thing to "logic" on the board, implemented entirely in passive + BJT topology
