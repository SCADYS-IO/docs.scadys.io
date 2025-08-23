# FCC Part 15 (United States)

## Scope

The United States Federal Communications Commission regulates electromagnetic emissions under [*47 CFR Part 15 – Radio Frequency Devices*](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15). Part 15 Subpart B covers unintentional radiators such as laboratory instruments, information technology equipment, and industrial controllers. SCADYS.IO retail products has no digital circuitry or oscillators operating at frequencies above 9 kHz, and therefore is not classified as a digital device under the FCC definition. As a result, it falls outside the scope of Part 15 Subpart B.

## Why it is out of scope

SCADYS.IO retail products is essentially a passive measurement fixture with supporting components. The only semiconductor devices present are linear switching transistors used to control status indicators. These transistors switch only at DC events, such as power connection or disconnection, and do not generate periodic signals at or above 9 kHz. Without microcontrollers, clock circuits, PWM dimming, or switching regulators, the product does not qualify as an unintentional radiator. Because of this, FCC Part 15B requirements do not apply.

## Implications

* No FCC Supplier’s Declaration of Conformity (SDoC) is required for SCADYS.IO retail products in its current design.
* The product can be imported and marketed in the United States as a passive test fixture.
* If future revisions include active circuitry such as PWM drivers, microcontrollers, or DC-DC converters, the product would then fall within the scope of Part 15B, requiring compliance testing and an SDoC.

## References

1. Federal Communications Commission, [*47 CFR Part 15 – Radio Frequency Devices*](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15), Electronic Code of Federal Regulations, 2024