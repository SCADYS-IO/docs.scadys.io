---
sidebar_position: 4
title: Measurement Traps
---

# Measurement Traps

A reading is only as good as the conditions it was taken in. Each trap on this page has produced a wrong conclusion on a Scadys board, and each has a simple guard.

## A wrong expected value

A pass window written from a part's normal operation can be wrong for the state the board is in. A processor with no firmware, a regulator that firmware has not enabled and a test point labelled with an older design value all produce correct readings that fail the sheet. Before a reading is called a fault, the datasheet and the reference manual are re-read for the board's exact state, and the expected value is re-derived.

## Lead polarity in diode mode

A diode-mode reading means nothing without knowing which lead was where. The polarity is recorded with every reading, in the form "red on the line, black on ground". A set of readings with no polarity recorded is repeated rather than interpreted.

## A weak pull-up reads like a driven output

A processor pin with an internal pull-up reads close to the supply on a meter, exactly like a pin the processor drives high. The difference shows when the pin is touched with a finger or loaded with a resistor: a pull-up sags, and a driven output holds. A pin that sags is not proof that the processor is running.

## Data reads as an unsteady voltage

A UART transmit line idles high and carries bursts of data. A meter averages the bursts and shows an unsteady voltage just below the supply, which looks like a fault. The line is read on a scope or with a serial adapter instead.

## Meter leakage on an undriven node

A 10 MΩ meter can read about a volt on a node that nothing drives, through leakage alone. A reading on a rail that should be off is confirmed with a load across it, such as 100 kΩ, which collapses a leakage voltage and barely affects a real supply.

## Capacitor creep

A rail with large capacitors reads a rising resistance for 10 s to 20 s while the meter charges them. The settled value is the one recorded.

## A mislabelled pin

A reading taken on the wrong pin of a small package gives a confident wrong answer. Each reading on a fine-pitch or small part names the pin, and a surprising reading is repeated on the pin, located under the microscope, before it is used.

## Readings taken in a different state

A reading taken while another fault was present describes that fault, not the board. When a fault is fixed, every reading taken before the fix is marked void and repeated. A reading whose conditions were not recorded, such as a current with no supply voltage or limit noted, is struck rather than trusted.

## Probing a powered fine-pitch part

A probe that slips on a powered fine-pitch part bridges two pins for an instant, which can destroy the part. Joints on fine-pitch parts are checked unpowered, from the side flank. Powered readings are taken at test points or at the pads of passive parts.

## Mirrored pad numbering

A pad array drawn as the footprint of a header on the opposite face reads mirrored from the face it is probed on. The probe map and the sheet name the net at each pad, and a reading is taken by net rather than by pad number.
