---
title: CAN Transceiver
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/can_transceiver_7c76562e.svg" alt="CAN transceiver schematic" viewBox="20 28 225 74" />

:::note[Hardware version]
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

## Overview

The CAN transceiver connects the MDD400 to an NMEA 2000 network. It implements the ISO 11898-2 physical layer using a TI SN65HVD234DR 3.3 V transceiver driven directly by the ESP32-S3 TWAI peripheral. An NUP2105LT1G TVS and TDK ACT45B common-mode choke sit between the Micro-C connector and the transceiver, protecting against bus transients and conducted EMI before they reach the silicon.

---

## CAN Transceiver

### Functional specification and design objectives

The CAN transceiver circuit must:

- connect the ESP32-S3 TWAI peripheral to an NMEA 2000 backbone via a DeviceNet Micro-C connector;
- protect the transceiver from ESD and bus transients at the connector entry point;
- suppress common-mode EMI on the bus lines before they reach the transceiver;
- limit bus edge slew rate to reduce radiated emissions at NMEA 2000's 250 kbps operating speed;
- hold the bus recessive during boot, before firmware has initialised the TWAI peripheral; and
- keep the transceiver in standby until firmware explicitly enables it.

### How it works

#### NMEA 2000 physical layer

NMEA 2000 uses the CAN physical layer defined by ISO 11898-2: a differential bus with two signals — CANH and CANL — terminated at 120 Ω at each end of the backbone. The bus operates at 250 kbps. The MDD400 connects as a drop node; network termination is provided by the backbone, not this circuit.

The ESP32-S3 implements CAN via its TWAI (Two-Wire Automotive Interface) peripheral, which presents three signals to the hardware: TWAI_TX (transmit data), TWAI_RX (receive data), and TWAI_EN (transceiver enable). TWAI_TX and TWAI_RX are assigned to GPIO13 and GPIO12 respectively — neither is an ESP32-S3 strapping pin, ensuring predictable CAN behaviour across all boot modes.

#### NMEA 2000 connector (J2)

J2 is a DeviceNet Micro-C A-code 5-pin male panel-mount socket rated IP67. Full pin assignments are in the [Quick Reference](/mdd400/v2.9/quick-reference). The shield pin is left floating inside the device, consistent with NMEA 2000 practice of connecting the drain wire to vessel ground at a single external point only.

#### EMC protection chain

The signal path from J2 to U5 follows the connector-first TVS topology described in TI application note SLLA271: **Connector → TVS → CMC → Transceiver**. Placing the TVS before the CMC clamps high-speed transients at the connector entry point; the CMC's series impedance then limits current in the TVS shunt path during surge events.

U10 (NUP2105LT1G) is a dual-line TVS array in SOT-23, placed 11.9 mm from J2 — the closest component to the connector. It clamps both NET-H and NET-L against ESD and surge transients with a 24 V standoff voltage and 350 W peak dissipation rating. C35 and C34 (15 pF, C0G, 100 V), between U10 and FL1, shunt residual high-frequency common-mode noise from each line to GNDREF. C36 (100 pF, differential, between NET-H and NET-L) is a DNP footprint — differential capacitance can degrade signal integrity on a high-speed bus and is only populated if EMC testing reveals a specific need.

FL1 (ACT45B-510-2P-TL003) is a TDK AEC-Q200 qualified common-mode choke presenting 2800 Ω common-mode impedance at 10 MHz. It passes differential CAN signals with low insertion loss while suppressing common-mode conducted noise. C28 and C27 (15 pF each) form a second common-mode filter stage on the transceiver side of FL1, providing additional attenuation before the signal reaches U5.

:::note[No galvanic isolation]
The CAN transceiver ground (GNDREF) connects directly to NET-C — the NMEA 2000 bus ground. This is intentional. The MDD400 is bus-powered from NET-S and NET-C, so GNDREF and bus ground are the same node. A galvanic isolation barrier would serve no purpose and cannot prevent ground loops that do not exist in this topology.

Isolation was evaluated in an earlier revision. The isolated DC-DC converter required to power the secondary side introduced more conducted EMI than the isolation removed, and added a switching converter and transformer to the BOM. The non-isolated topology in V2.9 is simpler, quieter, and fully adequate for a bus-powered node. The legacy serial interface is isolated for a different reason: it has a separate power supply and ground reference, which does create ground loop risk.
:::

#### CAN transceiver (U5)

U5 is a Texas Instruments SN65HVD234DR — a 3.3 V CAN transceiver in SOIC-8, compliant with ISO 11898-2 and rated to 1 Mbps. It translates between the differential CANH/CANL bus and the single-ended TWAI_TX/TWAI_RX logic signals for the ESP32-S3.

Four resistors configure U5's behaviour:

**R17 (10 kΩ, TXD pull-up to VCC)** holds U5's D input HIGH during boot, before the TWAI peripheral has initialised. TXD HIGH is the recessive bus state. Without R17, a floating TXD pin during reset could drive the bus dominant and block all network traffic.

**R20 (10 kΩ, EN pull-down to GNDREF)** holds U5's EN pin LOW at power-up. EN LOW places the SN65HVD234DR in standby; EN HIGH enables normal operation. The pull-down keeps the transceiver off the bus until firmware drives TWAI_EN HIGH.

**R21 (10 kΩ, slope control)** connects U5's Rs pin to GNDREF, selecting slope-control mode. This limits the bus driver edge slew rate, reducing radiated EMI. At NMEA 2000's 250 kbps, the resulting transition time (~50–100 ns) is less than 2.5% of the 4 µs bit period — negligible impact on signal integrity.

**R16 (47 Ω, RXD damping)** sits in series between U5's R output and TWAI_RX at the ESP32-S3 GPIO. It damps ringing caused by the GPIO input capacitance and trace inductance, preventing false bit edges from reaching the TWAI peripheral. No equivalent resistor is fitted on TXD: the transceiver's TXD input is low-impedance, and bus edge rate is governed by R21 rather than the ESP32-S3 drive strength.

:::note[V2.9 — non-isolated topology]
V2.9 replaced an isolated CAN transceiver (ISO1042) with the SN65HVD234DR and removed the isolation transformer. All references to an isolated CAN interface in earlier design documents apply to previous revisions only.
:::

#### VCC decoupling

U5's VCC (pin 3) is decoupled by C19 (100 nF, X7R, placed immediately adjacent to U5) and C18 (10 µF, X7R, bulk bypass), following the SN65HVD234 datasheet recommendation. In V2.9, C18 centre-to-centre distance from U5 is ~5.6 mm — flagged for tightening in V2.10.

### Performance review

| Parameter | Calculation | Result |
|-----------|-------------|--------|
| Pre-CMC cap CM impedance @ 10 MHz (15 pF) | 1 / (2π × 10 MHz × 15 pF) | 1,061 Ω per line |
| CM attenuation per stage @ 10 MHz | Z_C / (Z_FL1 + Z_C) = 1,061 / (2,800 + 1,061) | −11.2 dB |
| Two-stage CM attenuation @ 10 MHz | Two stages combined | > −22.4 dB |
| C36 differential filter f−3dB (100 pF, DNP, 60 Ω source) | 1 / (2π × 60 Ω × 100 pF) | 26.5 MHz — no impact on 250 kbps signal if populated |
| FL1 winding current (120 Ω bus termination, 1.5 V dominant) | 1.5 V / 120 Ω | 12.5 mA (rated 200 mA — 93% margin) |
| Bus edge rise time at Rs = 10 kΩ | SN65HVD234 datasheet Fig. 39 | 50–100 ns = 1.25–2.5% of 4 µs bit period |
| RXD filter f−3dB (R16 = 47 Ω, C_GPIO ≈ 5 pF) | 1 / (2π × 47 Ω × 5 pF) | 677 MHz — no impact on CAN signal |
| U10 junction capacitance per node | 30 pF × 2 lines | 60 pF (ISO 11898-2 node budget: 100 pF) ✓ |
| U10 clamp voltage vs. U5 bus fault spec | 40 V @ 5 A vs. ±36 V | ⚠ 4 V excess — verify survivability at bring-up |

### Bring-up tests

1. **Bus idle — recessive state**: with TWAI_EN LOW, measure CANH and CANL at J2 — pass if both sit at approximately 2.5 V.
2. **Transceiver enable**: assert TWAI_EN HIGH — pass if U5 enters normal mode with no bus disturbance visible on a scope.
3. **TXD default**: before TWAI initialised, measure TXD at U5 pin 1 — pass if HIGH (R17 holding recessive).
4. **TWAI loopback**: configure TWAI peripheral in self-test/loopback mode; transmit a frame — pass if received without error.
5. **Receive on live network**: connect to an NMEA 2000 network; capture traffic with a CAN analyser — pass if frames are received at 250 kbps with no error frames.
6. **Transmit on live network**: send a test PGN — pass if the frame appears on the network and is acknowledged by another node.
7. **Bus fault survivability**: apply a brief over-voltage to CANH/CANL at J2; confirm U10 clamps and U5 survives. Note the 4 V clamp-vs-spec margin — see Gaps.

### Gaps & next version

**Verify at bring-up**

- **U10 clamp margin**: U10 clamps at 40 V @ 5 A; the SN65HVD234DR bus fault specification is ±36 V. U5 relies on its internal clamping structures above 36 V. Verify U5 survives the worst-case bus fault scenario before committing to a production run.

**Next version**

- **TWAI_TX damping footprint**: no series resistor is fitted on TXD. Add a DNP 0603 footprint to allow evaluation at bring-up without a board respin.
- **C36 population decision**: resolve DNP status after EMC testing; either populate or remove the footprint.
- **Tighten C18 placement**: move C18 adjacent to U5 pin 3 to reduce the bulk bypass trace from ~5.6 mm to ≤ 3 mm.
- **NMEA 2000 certification**: the physical layer meets ISO 11898-2, but formal NMEA 2000 certification has not been pursued. Required before any commercial release.

---

## Firmware notes

### TWAI peripheral configuration

Configure the TWAI peripheral before asserting TWAI_EN. Enabling the transceiver before initialisation is complete risks transmitting a spurious dominant bit onto a live network.

| Parameter | Value |
|-----------|-------|
| Bit rate | 250 kbps |
| Mode | Normal |
| GPIO assignments | see [Quick Reference](/mdd400/v2.9/quick-reference) — assert TWAI_EN HIGH after TWAI init |

NMEA 2000 uses 11-bit (standard frame) CAN identifiers. Configure the TWAI acceptance filter to receive all IDs, or filter to the specific PGNs the application requires.

### NMEA 2000 PGN layer

The CAN physical layer is the scope of this page. PGN encoding, fast-packet reassembly, and ISO 11783-3 network address claiming are handled at a higher layer and are not covered here.

---

## Components

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| J2 | DeviceNet Micro-C A-code male | IP67 panel-mount socket — NMEA 2000 network connection | [STA M12 Series](/assets/datasheets/mdd400-v2.9/STA-M12-Series-M2024-1.pdf) |
| U10 | NUP2105LT1G | Dual-line CAN TVS array, SOT-23 — ESD and surge clamp | [onsemi NUP2105LT1G](http://www.onsemi.com/pub_link/Collateral/NUP2105L-D.PDF) |
| FL1 | ACT45B-510-2P-TL003 | Common-mode choke, AEC-Q200, 51 µH / 2800 Ω @ 10 MHz | [TDK ACT45B](https://product.tdk.com/en/search/emc/emc/cmfc_auto/info?part_no=ACT45B-510-2P-TL003) |
| C34, C35 | 15 pF / 100 V | C0G 0603 — pre-CMC common-mode filter caps | [Murata GCM1885C2A150JA16D](https://www.murata.com/en-us/products/productdetail?partno=GCM1885C2A150JA16D) |
| C27, C28 | 15 pF / 100 V | C0G 0603 — post-CMC common-mode filter caps | [Murata GCM1885C2A150JA16D](https://www.murata.com/en-us/products/productdetail?partno=GCM1885C2A150JA16D) |
| C36 | 100 pF / 50 V | C0G 0603 — differential filter cap across NET-H/NET-L. **DNP** | [Murata GRM1885C1H101JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D) |
| U5 | SN65HVD234DR | 3.3 V CAN transceiver, ISO 11898-2, SOIC-8 | [TI SN65HVD234 (SLLS557H)](https://www.ti.com/lit/ds/symlink/sn65hvd234.pdf) |
| C19 | 100 nF / 50 V | X7R 0603 — U5 VCC high-frequency bypass (adjacent) | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D) |
| C18 | 10 µF / 25 V | X5R 0805 — U5 VCC bulk bypass | — |
| R16 | 47 Ω | 0603 — RXD series damping (U5 pin 4 to TWAI_RX) | — |
| R17 | 10 kΩ | 0603 — TXD pull-up to VCC; holds bus recessive at boot | — |
| R20 | 10 kΩ | 0603 — EN pull-down to GNDREF; holds transceiver in standby at boot | — |
| R21 | 10 kΩ | 0603 — Rs slope-control resistor (U5 pin 8 to GNDREF) | — |

---

## References

- Texas Instruments, [*SN65HVD23x 3.3-V CAN Bus Transceivers (SLLS557H)*](https://www.ti.com/lit/ds/symlink/sn65hvd234.pdf)
- Texas Instruments, [*Layout Recommendations for PCBs Using High-Speed CAN Transceivers (SLLA271)*](https://www.ti.com/lit/an/slla271/slla271.pdf)
- onsemi, [*NUP2105LT1G Dual-Line CAN TVS Diode Array*](http://www.onsemi.com/pub_link/Collateral/NUP2105L-D.PDF)
- TDK, [*ACT45B Type Common Mode Filter/Choke*](https://product.tdk.com/en/search/emc/emc/cmfc_auto/info?part_no=ACT45B-510-2P-TL003)
- NMEA, [*NMEA 2000 Standard*](https://www.nmea.org/nmea-2000.html)
- ISO, *ISO 11898-2:2016 — Road vehicles — Controller area network (CAN) — Part 2: High-speed medium access unit*
