---
title: Status LED
hw_version: v1.1
hw_status: prototype
hw_status_label: "Fabricated prototype — sole built unit (pre-InvenTree)"
---

:::note[Hardware version]
CANBench Duo **v1.1** — Fabricated prototype, sole built unit. V1.1 is electrically identical to the V1.2 schematic refresh but predates the InvenTree symbol-library migration; the schematic component metadata reflects legacy SCADYS naming. Testing and bench validation reference this V1.1 hardware.

**Other versions:** [v1.2 — schematic refresh (next version)](/canbench-duo/v1.2/)
:::

A single RGB LED on the top extrusion communicates the supply-chain health of the CANBench Duo. There is no MCU, no firmware, no software — each colour falls out of the rail relationships in the protection chain, so what you see is the true state of the hardware at that instant.

## State table

| Indicator | Condition | What to do |
|---|---|---|
| **Off** | No bench-supply voltage at the SRC banana pair | Check the bench supply is on and wired to the SRC banana pair (front faceplate, RED to SRC+, BLACK to SRC−). |
| **Green** | Correct polarity, normal operation | Proceed with measurement. LISN delivers the filtered supply to the DUT bananas (J1 / J3) and the M12 N2K connector (J10). |
| **Blue** | Q2 protection FET not fully conducting — typically because F1 has blown | Power the bench supply down. Remove the DUT. Replace F1 (Littelfuse Nano2 Slo-Blo 5 A, in the 154 series holder). If Blue persists with no DUT attached and a fresh fuse, suspect Q2. Investigate the DUT for an over-current condition before reconnecting. |
| **Red** | Reverse polarity at the SRC pair (V_BLACK > V_RED) | Power the bench supply down. Reverse the SRC cables to the correct RED-to-`SUPPLY+`, BLACK-to-`SUPPLY−` orientation. |

## Brief Blue flash at power-on is benign

A **brief Blue flash for a few ms** at supply turn-on is normal. Q2's gate-bias divider takes a few RC time constants to bring Q2 fully ON, and during that interval the V(SUPPLY+) − V(VSS+) gap momentarily exceeds the LED state-encoder's threshold. The LED settles to Green once Q2 reaches full conduction.

If the Blue **persists** (does not settle to Green within ~ 100 ms), treat it as a fault per the state table above.

## Troubleshooting flow

1. **LED is Off but the bench supply is on and the wiring looks right.**
   - Check the SRC banana sockets for a loose or oxidised contact.
   - Verify the bench supply is actually delivering voltage at its output terminals (use a multimeter at the SRC banana pair).
   - If voltage is present at SRC and the LED is still off, the LED's own bias circuit may have failed — escalate to engineering.

2. **LED stays Red after reversing the cables.**
   - Confirm the cable polarity at *both* ends — sometimes only the bench-supply end gets swapped while the banana end stays reversed.
   - Multimeter at the SRC banana pair: SRC+ should read positive relative to SRC−.

3. **LED stays Blue after replacing the fuse and removing the DUT.**
   - The fuse has likely blown again under no load, or Q2 is faulty.
   - With the bench supply OFF, check F1 for continuity (multimeter, fuse out of holder).
   - If F1 is intact, Q2 is the next suspect — escalate to engineering.

4. **LED is Green but the DUT shows no supply at its connector.**
   - The LED reports the protection-chain state, not the DUT-side voltage. Measure VDUT directly at the DUT banana pair (J1 / J3).
   - If VDUT is absent despite Green, suspect a wiring fault between the DUT banana pair and the DUT, or an open in the LISN filter ladder (rare — would also affect the noise floor).

## Engineering rationale

For the circuit topology, component values, and the reasoning behind the four-state encoding, see [Power Indicator LED](../circuit-design/power-indicator-led.md) in the Circuit Design section. The state table on this page is the operator-facing summary; the circuit-design page is the engineering source of truth.

For a fast lookup of the state table without context, see [Quick Reference → LED States](../quick-reference/led-states.md).
