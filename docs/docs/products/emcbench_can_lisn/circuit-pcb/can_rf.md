# CAN RF Measurement Port

* Type: High-impedance, AC-coupled common-mode sampler
* Input: Direct from CANH/CANL at DUT connector
* Output: SMA (50 Ω) with 220 nF DC-block capacitor and 1 kΩ summing resistors
* Bandwidth: 150 kHz – 200 MHz
* Optional SMA attenuator or on-board Pi pad for analyser protection


<!-- 

I have updated the `dc_supply_path.md` document and re-annotated the schematic for the 5 µH LISN ladder. We've also made changes to the damper circuits and generated new impedance/phase plots based on the updated design.

Please perform the following updates and additions to the document:

---

## 1. Update component references
Update all in-text component references to match the latest schematic annotations. The new schematic uses updated identifiers (`L1…L10`, `C7…C14`, `R9…R17`). Ensure that every mentioned inductor, capacitor, and resistor matches the schematic exactly.

---

## 2. Add new damper resistors and explain the configuration
We’ve added additional resistors in the damper stages (e.g. `R14–R17` at the DUT node). Please:
- Describe the purpose of these new resistors in the circuit (e.g. ESR emulation, damping function, impedance shaping)
- Explain why they are configured in parallel or series with specific capacitors
- Keep the explanation consistent with the established tone of the document (technical prose, not bullet points)
- mention that it was in response to simulation.
- mention that in field testing the resistor values may be adjusted.

---

## 3. Insert and explain performance plots
Add the two attached performance plots (impedance and phase vs frequency) to the 5 µH LISN Ladder section.

Please include:
- A caption or brief figure description for each image
- A narrative performance explanation in the surrounding text:
  - Highlight how the LISN shows a mostly inductive response across the test band
  - Explain how the damping networks suppress resonance
  - Compare the simulated response to the expected ~5 µH reactance curve
  - Comment on how added ESR in the output shunt improves high-frequency stability

Image files:
- `dut_5uh_impedance.png`: shows |Z(f)| for the LISN with and without ESR
- `dut_5uh_phase.png`: shows phase angle of impedance vs frequency

---

## 4. Final Output
- Return the updated `dc_supply_path.md` content as complete markdown
- output the markdown in the canvas
- Retain all prior section headings and formatting
- Embed the performance graphs using markdown syntax with proper image paths
- Ensure the References section remains intact at the end
- Do not use bold emphasis anywhere



 -->

