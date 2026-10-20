---
sidebar_position: 7
title: Programming Interfaces and Connectors
sidebar_label: Programming interfaces
---

# Programming Interfaces and Connectors

A prototype is flashed, reset and monitored hundreds of times during bring-up, and a production board is flashed once, at the assembler. The programming interface serves both, so it is chosen for the production route first and the bench second.

## The 6-pin ESP-PROG connector

Every Scadys board is programmed through a 6-pin connector that matches the program header of the Espressif ESP-PROG. It carries six signals:

| Signal | Purpose |
|---|---|
| Enable | Resets the processor. |
| 3.3 V | The board's logic rail on the pogo pads. Not connected on the bench socket. |
| UART transmit | The processor's console and the ROM bootloader's output. |
| UART receive | Flashing commands and console input. |
| Ground | The common reference. |
| Boot | Holds the boot strap so the processor enters download mode on reset. |

The flashing tool drives the enable and boot lines itself, so the processor is reset into download mode, flashed and restarted with no button pressed.

The signals reach two footprints on the board:

- *an SMD 2 × 3 IDC socket at 1.27 mm pitch*, which takes the ESP-PROG's own cable on the bench; and
- *a 2 × 3 pogo-pad array at 2.54 mm pitch*, which the assembler's bed-of-nails jig contacts, as [Bed-of-nails interfaces](./bed-of-nails.md) describes.

A companion processor, such as the ESP32-C6 radio module, has its own socket of the same type.

## The UART carries the ROM log

The UART on the programming connector also carries the processor's ROM bootloader log, which prints before any firmware runs. That log is the cheapest proof that a blank processor is alive. On the first MDD500 board, a processor that read as dead on its rails printed a normal ROM log showing a blank flash and a watchdog reset loop, which showed the processor was healthy.

## One supply on the 3.3 V rail

An ESP-PROG offers a 3.3 V output on pin 2 of its program header. The programmer and the board's own regulator must never drive the 3.3 V rail at the same time. Pin 2 of every ESP-PROG socket on a Scadys board is therefore left unconnected, so a standard ESP-PROG cable plugs in safely, and the board is always powered from its own supply input while it is programmed. On the first MDD500 board, the socket's pin 2 carried the 3.3 V rail, and the programmer's pin had to be cut from the bench cable.

## USB programming sockets

A USB programming socket is not fitted on a production board. The 6-pin connector is the programming route. A USB socket in a marine instrument corrodes and wears out mechanically with repeated use, and an exposed USB port is an attack route into the unit. It also adds a part, a connector opening and ESD protection that the product does not need. A maker version of a product may carry a USB socket, because a maker programs the unit from a computer with no programmer.

Where a USB socket is fitted to an ESP32-P4 or ESP32-S3 board, it is wired to the processor's own USB Serial/JTAG controller, which carries flashing, the console and JTAG debugging on one cable. Four rules go with it.

- *`VBUS` is not connected.* The cable carries data only, and the board is powered from its own supply input.
- *ESD protection is unidirectional and orientation matters.* A TI ESD321 fitted backwards holds its line a diode drop above ground, and the host sees nothing. On the first MDD500 board both were fitted backwards.
- *No eFuse that disables JTAG or USB is ever burnt.* Burning `DIS_USB_JTAG`, `DIS_PAD_JTAG` or `JTAG_SEL_ENABLE` removes the debug port permanently on that unit.
- *Opening the USB console resets the chip* through the USB Serial/JTAG control lines, so a running app is logged from its reset or read with those lines held off.

With factory eFuses, the ESP32-P4's JTAG source is its USB Serial/JTAG controller. A board without a USB socket therefore has no JTAG debug unless its USB data lines reach pads that a bench cable can contact, and that is decided per board revision.

## A companion module needs its own access

The ESP32-P4 boards carry an ESP32-C6 radio module as a companion processor. The module has its own UART, enable and boot strap, and they are brought to their own connector so the module can be flashed and its boot log read on its own. The host processor drives the module's enable line in the product. While the host drives that line push-pull, an external programmer cannot pull it low to reset the module, so the host is held in its own ROM download mode, which releases the line, before the module is flashed from outside.
