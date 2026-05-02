---
title: Legacy Serial RX
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/legacy_serial_rx.svg" alt="Legacy Serial RX schematic" />

:::note Hardware version
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

## Components

| Ref | Value | Description | Datasheet |
|---|---|---|---|
| J3 | Legacy Serial 3-pin | Autohelm-style 3-pin connector (12 V, GND, SIG) | — |
| U7 | TLP2309 | High-speed logic gate opto-isolator, SO-6, 5000 Vrms | [Toshiba TLP2309](https://toshiba.semicon-storage.com/ap-en/semiconductor/product/isolators-solid-state-relays/detail.TLP2309.html) |
| U11 | ZXTR2012 | 12 V linear regulator, SOT-23 | [Diodes Inc ZXTR2012](https://www.diodes.com/assets/Datasheets/ZXTR2012.pdf) |
| D6 | BAT54 | SOD-323F Schottky — blocks pull-up from loading shared bus | [Nexperia BAT54J](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf) |
| D13 | SS34 | 40 V 3 A SMA Schottky — reverse polarity protection on VST input | [MSKSEMI SS34](https://www.lcsc.com/product-detail/C2836396.html) |
| D14 | PESD15VL1BA | 15 V bidirectional ESD/TVS on signal line | [Nexperia PESD15VL1BA](https://assets.nexperia.com/documents/data-sheet/PESD15VL1BA.pdf) |
| D15 | SMCJ36CA | 36 V bidirectional TVS, DO-214AB, 1.5 kW — power input surge protection | [SMC Diodes SMCJ36CA](https://www.smc-diodes.com/propdf/SMCJ.pdf) |
| M1 | 75 V MOV | 1206 metal oxide varistor — legacy power supply transient protection | [Littelfuse V33MLA1206NH](https://www.littelfuse.com/products/varistors/multilayer-varistors/mlv/v33mla1206nh.aspx) |
| FB5 | 600 Ω@100 MHz | 1206 ferrite bead — EMC filtering on VST supply | [Murata BLM31KN601SN1L](https://www.murata.com/en-us/products/productdetail?partno=BLM31KN601SN1L%40T) |
| L5 | 1 µH | 0603 chip inductor — signal low-pass filter | [Murata LQM18FN100M00D](https://www.murata.com/en-us/products/productdetail?partno=LQM18FN100M00D) |
| R25 | 2.2 kΩ | 0603 — opto LED current-limiting resistor | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R30 | 22 kΩ | 0603 — ST_SIG pull-up to VST | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R32 | 2.2 kΩ | 0603 — opto output pull-up to VCC | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R57 | 47 Ω (1210) | 1210 thick-film — series damping resistor on VST supply | [Yageo RC Series](https://www.lcsc.com/product-detail/C230466.html) |
| C30 | 100 nF/50 V | 0603 — signal RF bypass | — |
| C49, C50 | 100 pF/50 V | 0603 — signal filter caps | — |
| C53 | 100 nF/50 V | 0603 — opto output filter capacitor | — |
| C54 | 10 µF/25 V | 0805 — VST supply bulk decoupling | — |
| C55 | 1 µF/100 V | 1206 — supply bulk capacitor | — |

## How It Works

The legacy serial RX sub-sheet provides a galvanically isolated receive path for 12 V single-wire Legacy Serial I signals and NMEA 0183 RS-422/RS-232 talkers. The legacy domain ground (GNDS) is completely isolated from GNDREF (digital) — no DC or capacitive coupling exists between the two on the PCB.

The 3-pin Autohelm-style connector (J3) carries 12 V power (pin 1), GND (pin 2), and signal (pin 3, ST_SIG). The 12 V input is protected by a Schottky reverse polarity diode (D13), a 1.5 kW TVS (D15), an MOV (M1), a series damping resistor (R57), a ferrite bead (FB5), and bulk/decoupling capacitors. The signal line passes through a PESD15VL1BA ESD diode (D14), RF bypass capacitors (C30, C49, C50), and a 1 µH chip inductor (L5) forming a ~700 kHz low-pass filter — attenuating RF noise while preserving signal integrity at 4800/9600 baud.

The core of the receiver is a Toshiba TLP2309 high-speed logic gate opto-isolator (U7). The input side is powered from the 12 V VST domain (via the ZXTR2012 LDO U11). The ST_SIG line is pulled to VST through a 22 kΩ resistor (R30) — idle state is 12 V high. A series BAT54 Schottky diode (D6) blocks the pull-up current from flowing back onto a shared bus during idle. When the line is pulled low by a transmitting device, current flows through the 2.2 kΩ resistor (R25) and into the LED of the opto-isolator.

At VST = 12 V nominal with the Schottky VF ≈ 0.45 V and opto LED Vf ≈ 1.2 V:

```
I_F = (12 V − 0.45 V − 1.2 V) / 2.2 kΩ ≈ 4.5 mA
```

This is well above the TLP2309 saturation threshold, ensuring reliable detection. The output side of the opto is pulled to VCC (3.3 V) via 2.2 kΩ (R32) and filtered with 100 nF (C53), producing a clean logic-level signal on ST_RX (GPIO39). The output is non-inverting: a low on ST_SIG → low on ST_RX.

All six possible pin permutations of the 3-pin connector (12 V, GND, SIG) result in electrically safe conditions — no permutation causes damage to the MDD400 or connected devices.

## Design Rationale

Galvanic isolation via opto-isolator prevents ground loop currents between the legacy serial bus (GNDS) and the MDD400's internal digital ground (GNDREF). Legacy marine networks often run between instruments with independently grounded enclosures and different reference potentials, making this isolation essential for reliable single-wire bus operation.

The 22 kΩ pull-up and BAT54 series diode are the key elements enabling compatibility with the shared-wire Legacy Serial I bus: the pull-up holds the line high when no device is transmitting, and the diode prevents the pull-up from loading the bus during active transmit from another device.

The NMEA 0183 listener specification requires input loading ≤ 2 mA at 2.0 V differential. At a 2.0 V input, the effective current draw is approximately 0.36 mA — well within specification.

## References

- Toshiba, [*TLP2309 High-Speed Logic Gate Opto-Isolator Datasheet*](https://toshiba.semicon-storage.com/ap-en/semiconductor/product/isolators-solid-state-relays/detail.TLP2309.html)
- Nexperia, [*BAT54J Schottky Diode Datasheet*](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf)
- SMC Diodes, [*SMCJ36CA TVS Diode Datasheet*](https://www.smc-diodes.com/propdf/SMCJ.pdf)
- Noland Engineering, [*Understanding and Implementing NMEA 0183 and RS422 Serial Data Interfaces*](https://www.nolandeng.com/downloads/Interfaces.pdf)
