# FCC Part 15 (United States)

## Applies to

<table>
  <colgroup>
    <col style="width:25%">
    <col style="width:25%">
    <col style="width:25%">
    <col style="width:25%">
  </colgroup>
  <thead>
    <tr>
      <th class="centered">Lab Grade</th>
      <th class="centered">Pre-compliance Grade</th>
      <th class="centered">Complete Build Kit</th>
      <th class="centered">PCB + THT Kit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="centered">❌</td>
      <td class="centered">❌</td>
      <td class="centered">N/A</td>
      <td class="centered">N/A</td>
    </tr>
  </tbody>
</table>

<span class="footnote">❌ = requirement does not apply because the CANBench Duo contains no circuitry operating above 9 kHz.</span> <span class="footnote">N/A = requirement not applicable because the product is not supplied as a finished apparatus.</span>

## Scope

The United States Federal Communications Commission regulates electromagnetic emissions under [*47 CFR Part 15 – Radio Frequency Devices*](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15). Part 15 Subpart B covers unintentional radiators such as laboratory instruments, information technology equipment, and industrial controllers. The CANBench Duo has no digital circuitry or oscillators operating at frequencies above 9 kHz, and therefore is not classified as a digital device under the FCC definition. As a result, it falls outside the scope of Part 15 Subpart B.

## Why it is out of scope

The CANBench Duo is essentially a passive measurement fixture with supporting components. The only semiconductor devices present are linear switching transistors used to control status indicators. These transistors switch only at DC events, such as power connection or disconnection, and do not generate periodic signals at or above 9 kHz. Without microcontrollers, clock circuits, PWM dimming, or switching regulators, the product does not qualify as an unintentional radiator. Because of this, FCC Part 15B requirements do not apply.

## Implications

* No FCC Supplier’s Declaration of Conformity (SDoC) is required for the CANBench Duo in its current design.
* The product can be imported and marketed in the United States as a passive test fixture.
* If future revisions include active circuitry such as PWM drivers, microcontrollers, or DC-DC converters, the product would then fall within the scope of Part 15B, requiring compliance testing and an SDoC.

## References

1. Federal Communications Commission, [*47 CFR Part 15 – Radio Frequency Devices*](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15), Electronic Code of Federal Regulations, 2024
