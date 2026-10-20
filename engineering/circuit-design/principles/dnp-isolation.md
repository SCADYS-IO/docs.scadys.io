---
sidebar_position: 3
title: Isolating Circuit Blocks with DNP Parts
sidebar_label: DNP isolation
---

# Isolating Circuit Blocks with DNP Parts

A prototype carries every option the product might need, because a prototype that is built only in the expected configuration proves nothing about the alternatives. A DNP (do not populate) part is the tool that makes this cheap. Its land is on the board, but the part is not fitted, so a circuit can be connected or disconnected by fitting or removing one resistor.

## Fit the fallback circuit, isolate it with a link

Where a block has a fallback, the fallback's parts are fitted on the prototype, and a DNP 0 Ω link disconnects its output. A fallback is then enabled by fitting one link on an assembled board, rather than by placing a regulator and its capacitors by hand on a board that is already built.

On the MDD410 and MDD500 prototypes, the panel's 1.8 V IO rail normally comes from the processor's internal LDO. A separate 1.8 V regulator, `U3` with `C13` and `C24`, is fitted as the fallback, but its output is isolated by the DNP link `R104`. The regulator costs a few cents. Retrofitting a SOT-23-5 regulator and two 0603 capacitors onto a populated board costs far more, and risks the board.

## Exactly one link in a select group

Where a rail can come from several sources, each source has its own link to the rail, and exactly one link is fitted. The schematic states that rule beside the links, so a technician never fits two and connects two supplies together.

A select link that sits in series with another link is a trap. If enabling a source needs two links, fitting one of them does nothing, and nothing on the board says why. Wherever that happens, the schematic note says so, and so does the product's bring-up sheet.

## A resistor in the select position measures current

On a prototype, a 1 Ω 1 % resistor in a select position turns the link into a current shunt. The voltage across it gives the rail current directly, with no break in the circuit. The production board fits 0 Ω in the same land.

## Leave a land for a value not yet known

Where a part's correct value can only be found on the bench, the land is placed and the part is fitted at a neutral value or left DNP. A USB data line carries 0 Ω in a land sized for a 22 Ω series resistor, because the reference designs use 0 Ω but a signal-integrity problem would need the resistor. A filter capacitor whose value is not yet proven is better left DNP than fitted at a value that does nothing.

## Why this is planned in, not patched on

A wired link, a bodge wire or a leaded part added on the bench is fragile, hides the real circuit from the next person, and can itself become the fault. On the first MDD500 board, a leaded 10 kΩ resistor added to force a converter on simply fought a processor output that is designed to hold that converter off before firmware runs. Every isolation point a bring-up might need is therefore designed in as a DNP land before the board is ordered.

## Documenting DNP parts

Every DNP part is documented in full, with its function and the condition under which it is fitted. Product pages mark it as "DNP - not fitted at launch" on first mention, and a DNP sub-circuit carries a "Not fitted at launch" notice at the top of its page.
