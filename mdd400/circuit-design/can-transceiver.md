---
title: CAN Transceiver
---

import useBaseUrl from '@docusaurus/useBaseUrl';

<img src={useBaseUrl('/img/schematics/mdd400/can_transceiver.svg')} alt="CAN Transceiver schematic" />

## Components

| Ref | Value | Description |
|-----|-------|-------------|
| U5 | SN65HVD234DR | 1 Mbit/s CAN transceiver, 3.3 V, SOIC-8 |
| U10 | NUP2105LT1G | Dual-line CAN bus ESD protection, 24 V clamp, SOT-23 |
| FL1 | ACT45B-510-2P | 51 µH common-mode filter, 2-line, 4.5×3.2 mm |
| C18 | 10 µF/25 V | VCC supply decoupling, 0805 |
| C19 | 100 nF/50 V | High-frequency VCC decoupling |
| C27,C28 | 15 pF/100 V | CANH line filter capacitor |
| C34,C35 | 15 pF/100 V | CANL line filter capacitor |
| C36 | 100 pF/50 V | Shield/common-mode decoupling |
| R16 | 47 Ω | CAN bus series termination resistor (split termination) |
| R17 | 10 kΩ | U5 RS pin pull-down (high-speed mode) |
| R20 | 10 kΩ | CANH bus bias |
| R21 | 10 kΩ | CANL bus bias |

## How It Works

The SN65HVD234 (U5) translates between the ESP32's single-ended TWAI\_TX and TWAI\_RX logic signals and the ISO 11898 differential CAN bus used by NMEA 2000. The device is a 3.3 V CAN transceiver with a wide common-mode input range of −7 V to +12 V, which accommodates the ground potential differences that can exist between nodes on a marine network.

The RS (rate select) pin of U5 is pulled low through R17 (10 kΩ) to select high-speed mode, allowing the transceiver to operate at up to 1 Mbit/s, well above the 250 kbit/s used by NMEA 2000. The transceiver enable is tied to the TWAI\_EN net from the ESP32 (GPIO 14), which drives the device into a low-current standby mode when the CAN peripheral is inactive.

Before the CAN signals reach U5, they pass through a TDK ACT45B common-mode filter (FL1). This device presents 51 µH in common-mode but very low impedance in differential mode, so it has no effect on the differential CAN signal but strongly attenuates common-mode conducted emissions — a key requirement for NMEA 2000 CE compliance. The NUP2105LT1G (U10) provides additional ESD protection directly on the CANH and CANL lines, clamping both lines to 24 V to protect U5 from bus line faults.

Four 15 pF capacitors (C27, C28, C34, C35) form a two-stage RC filter on each bus line to remove high-frequency interference arriving from the cable. The 47 Ω resistor R16 in series with the bus lines is the device's contribution to the NMEA 2000 split termination scheme. NMEA 2000 specifies a 120 Ω termination impedance at each end of the trunk cable; this device, as a drop-off node, does not terminate the trunk but uses the 47 Ω as an AC termination to dampen signal reflections at the stub.

## Design Rationale

The SN65HVD234 was chosen specifically because it operates from a 3.3 V supply directly compatible with the ESP32's IO voltage, avoiding the level-shifting circuit that a 5 V transceiver would require. Its wide common-mode range is important in a marine environment where galvanic corrosion, long cable runs, and multiple earthing points create significant ground potential differences across the network.

The common-mode filter FL1 is placed ahead of the ESD clamp U10 rather than after it. At this position it attenuates high-frequency common-mode interference before it reaches the transceiver, reducing the radiated emissions from the ESD protection device's parasitic inductance during clamp events. The capacitor values on the bus lines (15 pF) are intentionally small to avoid loading the differential impedance of the CAN bus and distorting the signal eye at 250 kbit/s.
