---
sidebar_position: 2
title: Test Points
---

# Test Points

A test point exists to answer a question during bring-up or fault-finding. The question decides which net gets one, and the way the board is serviced decides where it goes.

## Placement rules

Scadys boards follow four layout rules for test points.

- *Every test point sits on the service face.* A Scadys display is serviced with the display fitted and only the rear cover removed, so every test point sits on the face that points to the rear. A test point on the other face cannot be reached on an assembled unit.
- *A net that is often one side of a two-probe measurement gets a through-hole test ring.* The tester has two hands. A through-hole ring with a 2 mm pad takes a clip lead that stays connected, so one hand is left for the probe and the other for the instrument. Every board carries at least two ground rings and one more for each isolated ground, such as the legacy serial ground. The main logic rail and any rail that many readings are taken against also get rings. On the MDD500, the 3.3 V and 1.8 V rails were read against so often that each should have carried a ring.
- *No test point sits on a switching node.* A test-point stub on a converter's switch node adds inductance and radiates. A switch node is probed with a short ground-spring tip on a component pad.
- *Logic signals are probed at named component pads.* A pull-up resistor or a series resistor already gives an accessible pad on most signal nets. The bring-up sheet names the pad, such as "R12 pad 1 for `I2C_0_SDA`", and no copper is spent on a dedicated point.

## Which nets earn a test point

A test point earns its place when the reading it gives separates one fault from another. A supply rail is the obvious case, but it is not the only one.

- *Every supply rail* gets a test point, including the rails that a processor makes internally and brings out to pins.
- *Every input-protection node* gets one, because the supply input, the reverse-polarity stage and any surge or filter node are where an input fault is located.
- *A net that shows whether a block has started* gets one where it exists. On an ESP32-P4 board, the flash supply output `VDDO_FLASH` reads 3.3 V once the chip's power-management unit has run, and the USB D+ line shows whether the chip has left reset. Those two readings separate a dead chip from a chip that is running without firmware, which a rail reading alone cannot do.
- *A configuration or audio-interface signal* that is hard to reach on a fine-pitch part gets one when it is needed to confirm a mode, such as the I2S mode and word-clock lines of a class-D amplifier.

## Labels carry the expected value from the datasheet

A test-point label is read at the bench as the expected value. It must therefore match the current datasheet, not an earlier assumption. On the first MDD500 board, the test point labelled `1V9` carried the processor's in-package PSRAM supply, which the datasheet gives as 1.8 V. The label held an older expectation, and the correct reading looked like a fault until the datasheet was checked.

## Production

A bed-of-nails fixture needs its contact points on one face, at a minimum pad size, in places a fixture can reach. Prototype test points on the service face do not meet that need. Production test points are therefore added once the production test method is chosen, as [Bed-of-nails interfaces](./bed-of-nails.md) describes.
