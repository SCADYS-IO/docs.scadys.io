---
title: CAN Transceiver
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/can_transceiver_5a125230.svg" alt="CAN Transceiver schematic" />

:::note Hardware version
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

## Components

| Ref | Value | Description | Datasheet |
|---|---|---|---|
| J2 | 5-pin Code-A Male | DeviceNet/NMEA 2000 Micro-C connector | [NMEA 2000](https://www.nmea.org/nmea-2000.html) |
| U5 | SN65HVD234DR | 3.3 V 1 Mbps CAN transceiver, SOIC-8 | [TI SN65HVD234](https://www.ti.com/lit/ds/symlink/sn65hvd234.pdf) |
| U10 | NUP2105LT1G | Dual-line CAN TVS diode array, SOT-23 | [Onsemi NUP2105LT1G](https://www.onsemi.com/pdf/datasheet/nup2105l-d.pdf) |
| FL1 | ACT45B-510-2P | Common-mode choke, SMD | [Murata ACT45B-510-2P](https://www.murata.com/en-us/products/productdata/8807038415390/QTN0099C.pdf) |
| C18 | 10 µF/25 V | 0805 X7R MLCC — VCC bulk bypass | [Murata Product Page](https://www.murata.com/en-us/products/search) |
| C19 | 100 nF/50 V | 0603 X7R MLCC — high-frequency bypass | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| C27, C28 | 15 pF/100 V | 0603 C0G — NET-H/NET-L common-mode filter caps | — |
| C34, C35 | 15 pF/100 V | 0603 C0G — additional CAN line filtering | — |
| C36 | 100 pF/50 V | 0603 — differential capacitor across NET-H/NET-L | — |
| R16 | 47 Ω | 0603 — series resistor on TWAI_RX line | [Yageo RC Series](https://www.lcsc.com/product-detail/C114623.html) |
| R17 | 10 kΩ | 0603 — TWAI_TX pull-up (defines recessive state at boot) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R20, R21 | 10 kΩ | 0603 — CAN control signal bias resistors | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |

## How It Works

The CAN transceiver sub-sheet implements the NMEA 2000 physical layer. A 5-pin A-coded DeviceNet Micro-C connector (J2) receives the network connection. Pin assignments follow the NMEA 2000 specification: NET-S (+12 V), NET-C (0 V/ground), NET-H (CAN high), NET-L (CAN low), and SHLD (cable shield — left floating internally per NMEA 2000 practice to prevent ground loops).

The NET-H and NET-L signals pass through a three-stage protection and filtering network before reaching the transceiver. First, small-value capacitors (15 pF, C27/C28/C34/C35) shunt high-frequency interference to the local CAN ground. A 100 pF differential capacitor (C36) across NET-H/NET-L attenuates differential-mode noise. The Murata ACT45B-510-2P common-mode choke (FL1) provides high-frequency common-mode suppression without affecting differential signal integrity. Finally, the NUP2105LT1G dual TVS array (U10) clamps differential and common-mode transients, protecting the transceiver input from ESD and bus fault events.

The Texas Instruments SN65HVD234DR (U5) is a 3.3 V CAN transceiver that interfaces directly with the ESP32-S3 TWAI peripheral. TWAI_TX connects to TXD through a 10 kΩ pull-up to VCC, ensuring the bus remains in the recessive state when the MCU pin is high-impedance during reset or flashing. TWAI_RX connects to RXD via a 47 Ω series resistor to limit inrush current and attenuate ringing. TWAI_EN (GPIO14) controls transceiver standby — pulled to GNDREF at boot, then driven high by firmware to enable CAN.

The SN65HVD234 includes TXD dominant timeout protection (prevents bus lockup if TX is stuck low), undervoltage lockout, failsafe receiver output on open/floating bus lines, and thermal shutdown.

Neither TWAI_TX (GPIO13) nor TWAI_RX (GPIO12) are ESP32-S3 strapping pins, so CAN bus activity at power-up cannot affect boot mode selection.

## Design Rationale

The SN65HVD234DR replaced the isolated ISO1042 transceiver used in earlier versions as part of the v2.9 redesign that removed the CAN-domain isolation transformer. The ground reference for the transceiver is now shared with NET-C (vessel network ground), which is the standard topology for NMEA 2000 devices. This simplification reduces component count and eliminates the transformer's power conversion losses while maintaining adequate EMC performance through the differential pair filtering network.

CAN differential traces are routed as a tightly-coupled, controlled-impedance pair. Routing is kept short and direct from connector to filter components to transceiver, with symmetry maintained between NET-H and NET-L to minimise mode conversion and preserve signal integrity across the full NMEA 2000 baud rate range (250 kbps).

## References

- Texas Instruments, [*SN65HVD234 3.3-V CAN Transceiver Datasheet*](https://www.ti.com/lit/ds/symlink/sn65hvd234.pdf)
- Murata, [*ACT45B-510-2P Common-Mode Choke Datasheet*](https://www.murata.com/en-us/products/productdata/8807038415390/QTN0099C.pdf)
- Onsemi, [*NUP2105LT1G Dual-Line CAN TVS Diode Datasheet*](https://www.onsemi.com/pdf/datasheet/nup2105l-d.pdf)
- NMEA, [*NMEA 2000 Standard*](https://www.nmea.org/nmea-2000.html)
- In Compliance Magazine, [*Automotive EMC Testing: CISPR 25, ISO 11452-2 and Equivalent Standards*](https://incompliancemag.com/automotive-emc-testing-cispr-25-iso-11452-2-and-equivalent-standards-part-1/)
