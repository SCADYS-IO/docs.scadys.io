---
sidebar_position: 1
title: Preparation
---

# Preparation

Bring-up starts before the board reaches the bench. The bring-up sheet, the probe map, the instruments and the firmware are ready first, so that every step on the bench is a measurement rather than a search.

## The bring-up sheet

Each board has a printed bring-up sheet that takes the first assembled board from a bare board to a working instrument. Every step on the sheet has five columns.

| Column | Holds |
|---|---|
| Do | The action, such as "apply 12.0 V with a 0.2 A limit". |
| Probe | The point to measure and where it sits on the board. |
| Pass if | The value or window that passes, derived from the design. |
| Reading | The value measured, written in by hand at the bench. |
| Ref | The design brief and test the step comes from, and the requirement it verifies. |

The Probe and Pass columns carry everything needed at the bench, so no other document is opened while a step passes. The design brief named in the Ref column is opened only when a step fails. A header table records the board serial, the date, the chip revision, the firmware commit and the tester.

Some requirements are closed by a design check or a record rather than a bench step, such as a fabrication-gate result or an impedance figure from the fabricator's report. The sheet lists these in a "settled before the bench" section, ticked when the record is in hand.

## The probe map

A probe map shows every test point and probe pad, with its net, its position in millimetres from a board corner, and what it reads. Two details make the map usable.

- *Pad points name the pad end.* A reading taken at a resistor says which end, such as "on the pad away from the 3.3 V rail".
- *Isolated grounds carry their own rule.* A measurement on an isolated supply clips the probe ground to that supply's ground hook, never to the main ground.

## Instruments

Stages up to programming need four instruments:

- a multimeter with a diode-test range;
- a current-limited bench supply with a current readout;
- a two-channel oscilloscope; and
- a USB cable and a computer with the flashing tool.

Each instrument comes from the bench equipment register, which records what each instrument is verified to do. A bring-up step that needs a particular probe says so. A crystal node, for example, needs an active probe of 1 pF or less, because a 10 pF passive probe loads the oscillator and stops it.

## Tool versions and part handling

- *The flashing tool must support the chip revision on the board.* An older version of esptool fails against a newer chip revision with errors that look like a board fault, so the sheet names the minimum version.
- *Moisture-sensitive parts stay sealed until reflow.* A radio module rated MSL 3 stays in its bag with fresh desiccant until reflow day, or is baked to J-STD-033 before use.

## The bring-up app

Each board has a bring-up app, separate from the product firmware, that exercises the hardware and reports one result line per check. Each result carries one of four verdicts.

| Verdict | Meaning |
|---|---|
| `pass` or `fail` | The board judged the criterion itself. |
| `observe` | The board did its part, and the operator or an instrument judges the result, such as a tone heard or a waveform on the scope. |
| `skip` | The check did not run, with the reason given. |

Only a `pass` verifies a requirement. An `observe` is recorded with the operator's reading on the sheet. The app runs every check and does not stop at a failure, so its summary shows every result, but the bench rule still applies: the first failure is found before the next stage.

A bench host script flashes the app, reads its output to the summary line and writes a results file named by the board serial, with the raw log beside it. The results file names the hardware and firmware commits, so every result traces to the exact board and image it came from.
