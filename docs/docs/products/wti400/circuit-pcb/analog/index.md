# _ANALOG_ Domain

The `ANALOG` domain contains the wind transducer front-end circuits used to acquire legacy masthead sensor signals and present them to the digital processing path.

## Scope

This domain covers:

* wind speed pulse input conditioning;
* wind angle signal acquisition via orthogonal analog channels (`WIND_X`, `WIND_Y`);
* transducer supply interaction with the selectable `VAS` rail (6.5 V / 8.0 V); and
* fault-tolerant interfacing between external sensor wiring and onboard conversion logic.

## Signal Paths

WTI400 supports the primary signal forms used by legacy analog wind transducers:

* pulse-frequency wind speed signals; and
* analog directional channels used for angle derivation.

Acquired signals are conditioned and routed to the ESP32-S3 ADC and timing inputs for firmware-level normalization, filtering, and stabilization.

## Interface Considerations

The analog front-end is designed for marine wiring environments where cable length, external noise, and mixed-ground installations are common. Layout and protection choices focus on preserving signal integrity while keeping the interface practical for retrofit installations.

See [Quick Reference](../../quick_reference.md) for pin assignments and connector mapping related to wind transducer inputs.
