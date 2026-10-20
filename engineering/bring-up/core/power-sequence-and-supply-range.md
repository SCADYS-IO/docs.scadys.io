---
sidebar_position: 5
title: Power Sequence and Supply Range
sidebar_label: Power sequence and supply range
---

# Power Sequence and Supply Range

This stage checks that the board's rails come up in the order its parts require, that they recover correctly from a brown-out, and that the board works across the full supply range it is rated for. It runs with firmware loaded, because the full sequence includes the rails that firmware enables.

## Power sequence

Every part with a sequencing requirement in its datasheet gets a step. The sheet states the order or the delay that passes, and the scope captures it.

- *Rail order at power-up.* The rails are captured together on the scope, and their order is compared with the documented order for the fitted circuit. Where the board has an unfitted alternative path, the sheet notes which order belongs to which path.
- *Delays between rails.* A part that needs one rail to settle before another rises, such as a display panel's logic supply before its analog supply, gets a step that measures the delay from the first rail crossing its threshold to the second rail rising.
- *Reset timing.* A reset line held low until the rails are valid, and released a minimum time before the first command, is measured on the scope.
- *Power-good signals.* A power-good output rises only after its rail is in regulation. Where the rail is too high for the scope probe, the converter's feedback pin is read instead.

## Brown-out recovery

A marine supply sags when an engine starts, and a power sequence that is correct at a clean power-up can be wrong on recovery from a sag. Each sequencing step is therefore repeated on brown-out recovery. The bus is taken below the point where the board's regulators drop out, then stepped back to the nominal voltage, and the same delays are measured. A slow sag is tested as well as a fast step, because a slow fall and rise can leave firmware out of step with a converter that turned itself off and on.

## Supply range

The supply-range steps run the board at the limits it is rated for, with its heaviest load on, such as a display at full brightness.

- *Low bus.* The board runs at the lowest rated input voltage. The voltage is set at the board's input, not at the supply, because the leads and the drop cable lose a measurable voltage at full current. The sheet gives the minimum voltage that the board's internal rail must hold at full load, and the reading is compared with it.
- *High bus.* The board runs at the highest rated input voltage without a restart.
- *Current at low bus.* The board current at the lowest voltage and full load is recorded and compared with the design figure. It is the highest current the board draws in normal service.
- *Reverse polarity.* The supply is reversed at the board's input for 10 s at the high-bus voltage. The board must draw no current and nothing may become warm. It must then run normally at the correct polarity.

## Longer tests

Holds at an elevated voltage for an hour, supply ripple sweeps, ground offsets, open-line tests on the bus connector, surge and fuse tests need equipment or time beyond the first bench session. The bring-up sheet lists them in an "after bring-up" section, each with the design brief that describes it, and they run once the board has passed every core step.
