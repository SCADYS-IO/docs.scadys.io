---
title: Circuit Design
hw_version: v3.0
hw_status: schematic
hw_status_label: "In design — V3.0 schematic capture in progress"
sidebar_label: Overview
---

:::note[Hardware version]

MDD400 **v3.0** — ESP32-P4 / MIPI-DSI / LVGL platform re-base. This board is at **schematic-capture** stage; no V3.0 hardware exists yet.

**Other versions:** [v2.9 — fabricated prototype (current)](/mdd400/v2.9/)

:::

:::info[Under construction — V3.0 capture in progress]

The per-circuit schematic documentation is regenerated as each V3.0 sheet is captured. Carried-over circuits (CAN bus power, CAN transceiver, I²C sensors, legacy serial, LED, PCB markings) retain their V2.9 content pending pin re-pointing; the host, display, and power sheets are being redrawn.

See the [Tasks](/mdd400/v3.0/tasks) page for status.

:::

## Part selection and design for reliability

Components are selected against a written policy rather than by availability or price. The policy exists because the
failure modes that matter on a Scadys board are not the ones that show up on a bench: they appear months later, in the
field, after thermal cycling and vibration.

Four rules shape the passive selection on every board.

**Dielectric and voltage derating.** Ceramic capacitors are X7R or C0G, never X5R, because X5R is rated only to 85 °C
and the inside of a sealed housing reaches that. Bulk ceramics are run at or below 25 % of their rated voltage, which
bounds DC-bias capacitance loss and removes any dependence on the exact capacitance-versus-voltage curve.

**Land patterns come from the component manufacturer, not from the PCB tool.** A ceramic capacitor that cracks under
board flexure fails as a **short circuit**. On a supply rail, that stops the instrument working, with no warning and no
field diagnosis. The amount of solder in the joint controls how much force reaches the ceramic, and the amount of
solder is set by the copper land pattern. Scadys uses the land windows published by Murata and Samsung, which are
narrower than the IPC-7351 defaults that PCB tools generate. Resistor lands are taken from the resistor
manufacturer's own recommendation for the same reason.

**Inductor saturation current is specified against the regulator's current limit, not against the load.** A switching
regulator drives its inductor to the current limit during a short circuit, a hard load step, or inrush, regardless of
what the steady load is. The figure used is the saturation current at temperature, not at 25 °C.

**Where an open circuit would destroy the board, the part is chosen for that.** The high-side resistor of a switching
regulator's feedback divider is the clearest case: if it goes open, the regulator reads the output as far too low,
drives its duty cycle to maximum, and the rail runs up toward the input voltage. Everything downstream of it dies. The
part in that position is a thin-film type qualified against sulphur corrosion, which is the mechanism that makes a
chip resistor fail open. It costs nothing.

:::note[Design standard]

The reasoning behind the capacitor land patterns, including the manufacturers' own statements on solder volume and
cracking, is set out in the engineering note **[MLCC Land Patterns and Flex Cracking](/engineering/mlcc-land-patterns)**.

:::

Every footprint used on a board must be audited against its manufacturer's land pattern, and against the fabricator's
process limits, before that board is released. The audit is recorded per part and is invalidated automatically if the
footprint changes afterwards. **No board goes to fabrication with an unaudited footprint.**

---
