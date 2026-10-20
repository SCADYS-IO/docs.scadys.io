---
sidebar_position: 6
title: Recording Results and Closing Out
sidebar_label: Recording results
---

# Recording Results and Closing Out

A bring-up is only as useful as its record. The record lets a later board be compared with the first, lets a finding reach the next revision, and lets every claim that a requirement is met be traced to a reading.

## Every reading

Each reading on the bring-up sheet records five things:

- the value, with its unit;
- the instrument, such as the meter or scope model;
- the setup, such as the scope's timebase or the supply's voltage and limit;
- the date; and
- the uncertainty, where the reading was indirect or at the edge of the window.

"At the limit, not a clean pass" is an allowed result, and it is better than a pass that hides a marginal reading. Where a step teaches something about the board, such as a correct value that looks wrong, the lesson is written beside the step so the next tester reads it at the bench.

## Automated results

The bench host script writes a results file for each board, named by the board's serial, with the raw console log beside it. The file names the hardware revision and commit, the firmware version and commit, and whether the image on the board matches the build that produced it. Only a `pass` in that file verifies a requirement. An `observe` is verified by the reading on the sheet.

## Findings

Every fault, every wrong expected value and every EMC finding is raised as a tracked item when it is found, not at the end of the session. A finding names:

- what was seen, and the reading that showed it;
- the cause, once known;
- the fix on this board, if one was made; and
- the change the next revision needs.

The change is listed in the next revision's change register, so the next board is designed with every lesson of this one. A wrong expected value is corrected on the bring-up sheet itself as well, so the next tester does not meet the same trap.

## Closing out a board

A board's bring-up is closed when:

- every core step and every chosen function module has a recorded result;
- every failure has a cause and a finding;
- the irreversible steps that wait for a fully passed board, such as identity eFuses, are done; and
- the tests that need longer or other equipment are listed with the conditions they need, in the sheet's "after bring-up" section.
