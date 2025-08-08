# PCB Design

The MDD400 circuit and PCB design follow a domain-based architecture to ensure clean signal routing, domain-specific power distribution and effective isolation. The PCB is organized into four distinct domains: `CAN`, `SMPS`, `DIGITAL`, and `LEGACY IO`, each physically and electrically partitioned.

![MDD400 Domain Layout](../../assets/images/mdd400_domains.png)

## Domain Structure and Isolation

Each domain implements a defined function and maintains its own power and ground reference. Isolation boundaries are carefully managed using opto-isolators, digital isolators, and filtered power transitions. Key boundaries include:

* galvanic isolation between `CAN` and `DIGITAL` domains, using isolated transceivers and a dedicated 5 V linear regulator in the `CAN` domain;
* galvanic isolation between `LEGACY IO` and `DIGITAL` domains, implemented with opto-isolators;
* high-frequency isolation (but not galvanic) between the `SMPS` and `DIGITAL` domains, using common-mode chokes.

These strategies ensure that noise, ground loops, or transients from external interfaces do not propagate into sensitive logic subsystems.

## Stackup and Layer Allocation

The MDD400 uses a four-layer PCB structure optimized for signal integrity, EMI performance, and manufacturability. The stackup includes:

* four isolated ground planes (`GNDREF`, `GNDC`, `GNDSMPS`, `GNDST`) to provide low-inductance return paths;
* top and bottom signal layers, including domain-specific power pours and controlled impedance routing; and
* embedded capacitance in the `DIGITAL` domain via top and bottom `VCC` and `VDD` pours coupled to the internal `GNDREF` plane.

All domains are defined by their own copper regions, with isolation gaps of at least 6 mm maintained on all layers.

## Layout and Routing Practices

Functional areas are compartmentalised to prevent coupling between noisy and sensitive sections. Highlights include:

* high-frequency switching elements (e.g. DC-DC converters) confined to the bottom left quadrant (`SMPS` domain);
* analog and digital components grouped centrally in the `DIGITAL` domain;
* legacy and CAN interface components placed at opposite (left and right) board edges, maintaining isolation spacing; and
* return paths kept short and local, with via stitching around high-current and high-speed devices.

All inter-domain signal paths are routed through isolators. Ground and power planes are never shared between isolated domains.

## Connectors and Domain Entry Points

Each external interface is associated with a single domain. The following connectors are used:

{% include-markdown "mdd400/assets/include/table_5_connectors.html" %}

Routing from these connectors into the circuit is carefully managed to preserve isolation and minimize noise injection.

## Summary

The PCB and circuit architecture of the MDD400 reflects a clear separation of concerns between high-speed logic, analog sensing, switching power, and external interface protection. Layout and stackup are designed for low EMI, strong immunity to external faults, and high reliability in demanding marine environments.

