# PCB Stackup

The MDD400 uses a four-layer PCB with a structure optimized for signal integrity, EMI suppression, and power distribution across isolated domains. Each domain is assigned a specific ground reference and signal routing strategy, ensuring predictable return paths and minimal coupling between subsystems.

![PCB Stackup](../../assets/images/pcb_stackup.png)

## Layer Arrangement

The PCB stackup is constructed using industry-standard materials and lamination techniques. The outer layers are used for component placement and signal routing, while the internal layers serve as solid planes for ground and power distribution.

{% include-markdown "mdd400/assets/include/table_4_pcb_stackup.html" %}

All copper layers are finished to 1 oz after plating. The two internal layers provide low-impedance return paths and effective shielding for routed signals on the outer layers.

Power and ground pours are used on the outer layers to reduce impedance and support distributed decoupling:

* VCC is poured on top and bottom layers in the `DIGITAL` domain;
* ground references (GNDREF, GNDC, GNDSMPS) are poured on outer layers as appropriate;
* stitching vias connect outer pours to internal planes; and
* signal traces are routed over solid ground regions to ensure short return paths.

## Functional Domain Layer Strategies

The MDD400 PCB is divided into four isolated functional domains: `CAN`, `SMPS`, `DIGITAL`, and `LEGACY IO`. Each domain uses a tailored layer strategy to balance electrical performance, noise suppression, and manufacturability.

![MDD400 Functional Domains](../../assets/images/mdd400_domains.png)

### _CAN_ Domain

The `CAN` domain prioritizes clean ground references and low loop inductance to support robust communication and protection circuitry. The layout emphasizes separation from switching noise and provides strong EMI shielding.

* `GNDC` ground plane is poured on all four layers;
* signal traces are routed mostly on the top layer;
* power output traces (VSS) are routed on Layer 3 only;
* Layer 2 and Layer 4 are reserved as uninterrupted GNDC planes;
* stitching vias are placed under protection components and around filter capacitors, with full edge stitching at 1 mm intervals.

### _SMPS_ Domain

The `SMPS` domain handles high-frequency switching and power conversion. Layout is guided by best practices from Monolithic Power Systems to minimize radiated emissions and ground bounce.

* `GNDSMPS` ground is poured on all four layers;
* Layer 1 has two separate ground islands under the switch controller and SW node, connected to underlying ground planes via stitching vias;
* Layer 2 includes a continuous `GNDSMPS` plane with a moat surrounding the DC-DC area to suppress edge radiation;
* Layer 3 is used for power output (`VCC`, `VDD`) and feedback traces;
* Layer 4 provides a clean uninterrupted `GNDSMPS` ground pour.

`VSS` from the `CAN` domain enters this region on _Layer 1_ via ferrite beads. All layers feature edge stitching at 1 mm intervals.

### _DIGITAL_ Domain

The `DIGITAL` domain supports the ESP32 MCU and other logic subsystems. It is optimized for low-noise operation, embedded capacitance, and structured power distribution.

* `VCC` power is poured on both outer layers (top and bottom);
* `GNDREF` is poured continuously on the two internal layers (L2 and L3);
* signal traces are routed horizontally on Layer 1 and vertically on Layer 4; and
* `VCC` is stitched to `GNDREF` using a dense via grid.

This structure creates embedded capacitance between `VCC` and `GNDREF`, supplementing discrete decoupling:

* area: ~2500 mm²;
* dielectric thickness: 185.5 µm;
* dielectric constant (FR4): ~4.5;
* estimated parallel plate capacitance: ~538 pF.

### _LEGACY IO_ Domain

The `LEGACY IO` domain is galvanically isolated and handles legacy 12 V serial interfaces. To preserve isolation and reduce parasitic coupling, signal routing and copper allocation are tightly constrained.

* `GNDST` is poured on all four layers;
* signal traces are limited to the top layer;
* no traces are routed on internal or bottom layers;
* isolation is implemented using opto-isolators between domains.

## Surface Finish and Solder Mask

All exposed copper uses _ENIG_ (Electroless Nickel Immersion Gold), providing reliable contact and resistance to oxidation.

The outer layers are coated with LPI (liquid photoimageable) solder mask, except at exposed pads or vias. Variants used across builds:

* green: used for early proof-of-concept prototypes;
* blue: used for early hand-soldered units;
* black: used for production assemblies.

The isolation barrier region is left unmasked to improve surface clearance and reduce moisture or capacitive coupling.

## Thermal Management

Heat dissipation is handled through thermal vias and copper plane coupling:

* via arrays are placed under or near thermally active devices, including the ESP32-S3, SMPS devices, TVS diode, and isolated CAN transformer;
* thermal pads are connected to internal and bottom copper pours;
* high-power components are isolated from temperature-sensitive areas.

## References

1. Monolithic Power Systems, [*EMI Webinar: Practical Grounding and Layout*](https://www.monolithicpower.com/en/support/videos/emi-2-webinar-early-session.html?srsltid=AfmBOop1N5qpjFNFHkvJIyWCZOyt30Mt_P6bsL53Dz79rUJPYOWXOTq6)
