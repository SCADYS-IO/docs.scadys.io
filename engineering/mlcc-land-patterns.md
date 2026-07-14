---
sidebar_position: 2
title: MLCC Land Patterns
---

# MLCC Land Patterns and Flex Cracking

Multilayer ceramic capacitors (MLCCs) are the most numerous components on a Scadys board. They are also the ones whose
failure mode is worst. A cracked MLCC usually fails as a short circuit, and a short circuit across a supply rail stops
the instrument working. There is no warning, no degraded mode, and no way to diagnose it in the field.

This page sets out how Scadys designs the printed-circuit land patterns that these capacitors are soldered to, and why
those patterns are not the ones a PCB tool would generate by default.

## The failure

A ceramic capacitor is a stack of metal electrodes separated by a brittle ceramic dielectric. It is soldered rigidly to
the board at both ends. When the board bends, the capacitor cannot bend with it. The strain is transferred through the
solder joints into the ceramic, and if it is large enough the ceramic cracks between two electrode layers.

The crack bridges electrodes of opposite polarity. The capacitor becomes a short circuit.

Boards bend more often than is comfortable to think about:

- during depanelisation, when the board is broken out of its manufacturing panel;
- when a connector is pushed home;
- when a mounting screw is torqued down against a slightly non-flat surface;
- when a hull slams in a seaway; and
- through thermal cycling, because the ceramic and the board expand at different rates.

All of these are routine for a marine instrument.

## The link to the land pattern

The strain reaching the ceramic depends on how much solder is in the joint and where it sits. That, in turn, is set by
the copper land pattern the capacitor is soldered to.

Samsung states the relationship directly in its MLCC Product Manual [1]:

> It is required to design a PCB with consideration of a solder land pattern and its size to apply an appropriate amount
> of solder to MLCC. The amount of the solder at the edge may impact directly on cracks in MLCC.

> The design of a suitable solder land is necessary since the more the solder amount is, the larger the force MLCC
> experiences and the higher the chance MLCC cracks.

Murata gives the same guidance and publishes the same kind of land table [2].

The chain is therefore short and unambiguous:

**land pattern size, then solder volume, then force into the ceramic, then crack, then short circuit.**

Two aspects of the land matter.

**Pad length** is the dominant term in solder volume. A pad that is longer than the manufacturer specifies puts more
solder into the joint and more force into the part.

**The gap between the pads** decides where the solder sits. A ceramic capacitor is metallised only at its ends; the
centre of the underside is bare ceramic. If the gap is too small, the pads reach in underneath that bare ceramic, and
solder is deposited precisely where a crack starts.

## Why the industry-standard pattern is not used

The usual reference for surface-mount land patterns is IPC-7351. Most PCB tools, including KiCad, generate chip
footprints from it by default.

IPC-7351 optimises a chip land for solderability and for visual inspection of the joint. Those are reasonable goals,
and they lead it to specify pads that are **wider** than the capacitor manufacturers recommend.

For a 1210 (3225 metric) capacitor:

| Source | Pad width |
|---|---|
| Murata, recommended | 1.8 mm to 2.3 mm |
| Samsung, recommended | 1.80 mm to 2.20 mm |
| IPC-7351, nominal | 2.70 mm |

The two largest capacitor manufacturers in the world independently recommend a pad **narrower than the 2.5 mm body of
the part**. IPC-7351 specifies one wider than the body. More pad means more solder, and more solder means more force
into the ceramic.

Scadys therefore takes the land pattern from the component manufacturer, not from IPC-7351, and records the deviation
in the footprint itself so that it is not later "corrected" back.

## Where the manufacturers disagree

Murata and Samsung agree closely at some case sizes and differ at others. At 1210 their recommended gap windows are
identical. At 0603 and 0805 they do not overlap: Murata asks for a larger gap and a shorter pad than Samsung.

Where they differ, Scadys takes **the larger gap and the shorter pad**. Both choices reduce the solder volume, and the
larger gap keeps solder away from the bare ceramic. The design is biased toward the failure being designed out.

## The Scadys land patterns

Dimensions follow the manufacturers' convention: `a` is the gap between the pads, `b` is the pad length along the
capacitor, and `c` is the pad width across it.

| Case size | Metric | a (gap) | b (pad length) | c (pad width) |
|---|---|---|---|---|
| 0603 | 1608 | 0.70 mm | 0.70 mm | 0.90 mm |
| 0805 | 2012 | 1.10 mm | 0.80 mm | 1.35 mm |
| 1210 | 3225 | 2.20 mm | 1.10 mm | 2.00 mm |

Every one sits inside the window published by at least one manufacturer for that size, and inside both where the two
agree.

:::caution[These are not the tool defaults]

If a footprint is regenerated from a PCB tool's built-in chip library, it will not match this table. The land pattern is
a reliability decision, and it is recorded in the footprint's description field for exactly that reason.

:::

## What else is done

The land pattern is necessary but not sufficient. Scadys also applies the following.

**Soft-termination parts are preferred**, and are required where a bank of capacitors sits directly across a supply
rail. These use a conductive-resin layer in the termination that absorbs board strain instead of passing it into the
ceramic. They cost a few cents more than a standard part.

**Orientation.** Capacitors are placed with their long axis perpendicular to the direction in which the board is most
likely to bend.

**Keep-out distance.** Capacitors are kept at least 5 mm from board edges, mounting holes and depanelisation routes,
which are where board flexure is greatest.

**Symmetric thermal relief.** Both pads of a capacitor are connected to the surrounding copper in the same way. If one
pad sits on a large copper pour and the other on a thin track, the part heats unevenly during reflow, which can lift one
end of it off the board.

## A note on why this page exists

Scadys found in July 2026 that its own capacitor footprint library carried PCB-tool default land patterns, which were
outside the manufacturers' recommended windows at every case size. The boards built on them worked. They passed
inspection and they passed bench test.

That proves only that the joints were solderable. Flex cracks do not appear on the bench. They appear in the field,
after thermal cycling and vibration, and they appear as a dead unit.

The library has been corrected, and the reasoning is published here so that it is not quietly lost.

## References

1. Samsung Electro-Mechanics, *MLCC Product Manual*, sections 4-4-4 (solder amount and cracking) and 5-4 (land dimension).
2. Murata Manufacturing, *Chip Multilayer Ceramic Capacitors Catalog*, C02E, January 2021, Notice section, Table 2 (Reflow Soldering Method).
3. IPC, *IPC-7351B, Generic Requirements for Surface Mount Design and Land Pattern Standard*.
