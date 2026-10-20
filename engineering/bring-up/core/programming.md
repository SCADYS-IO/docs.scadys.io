---
sidebar_position: 4
title: Programming and the Bring-up App
sidebar_label: Programming
---

# Programming and the Bring-up App

The programming stage proves that the processor can be reached, identified and flashed, and that it boots from its own flash. It then loads the bring-up app that runs the rest of the method.

## Steps

1. *Connect the programmer.* An ESP-PROG connects to the board's 6-pin programming connector, with its 3.3 V pin left unconnected while the board is powered from its own supply input. On a maker version with a USB socket, the host lists the processor's USB Serial/JTAG device instead, with or without firmware.
2. *Identify the chip.* The flashing tool resets the processor into download mode and reads the chip type and revision. The revision is written in the sheet's header, because firmware and tool support depend on it.
3. *Identify the flash.* The flashing tool reads the flash memory's JEDEC identity and size, which must match the fitted part.
4. *Flash a test image.* The tool writes an image and verifies every hash.
5. *Boot from flash.* After a power cycle with nothing connected, the board boots its image without help.
6. *Debug, where the board has a JTAG route.* The debugger halts and resumes the processor over JTAG, which proves the debug path.
7. *Flash through the production route.* Where the board carries its production bed-of-nails contacts, the image is also written through the jig, with the board powered the way the jig powers it.

If the programmer cannot reach the chip, the ROM boot log on the connector's UART is read first, because it shows whether the processor is running at all.

## Irreversible settings wait

Identity eFuses, security eFuses and any other one-time setting are not written in this stage. They cannot be undone, so they are written only after every stage has passed. No eFuse that disables JTAG or USB is written at any stage, as [Programming interfaces and connectors](../../circuit-design/principles/programming-interfaces.md) explains.

## The console

The processor's console runs on the UART of the programming connector, and on the USB Serial/JTAG port where a board has one. Opening a USB console can reset the chip through its control lines, so the bench host script opens the port with those lines held off and reads a running app without restarting it.

## Loading the bring-up app

Once the board passes this stage, the bring-up app is flashed and the host script runs it. The app checks the board's functions in the order of the function modules and writes one result line per check, with the step number from the bring-up sheet. The results file then holds every automated result, and the bring-up sheet holds every reading the operator takes.

The supply limit is raised before the app runs, because the app turns on loads that first power did not. A backlight or a radio at full power can draw more than the first-power limit, and a supply that limits during a test makes the board misbehave in ways that look like faults. A backlight boost converter cycling at the supply limit, for example, shows as a flashing screen.
