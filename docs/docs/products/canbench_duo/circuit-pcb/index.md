# Dual-Channel LISN + CAN CDN Build Guide

This page documents the design, bill of materials, and build procedure for a custom dual-channel Line Impedance Stabilization Network (LISN) with integrated CAN Common-Mode Disturbance Network (CDN), suitable for in-line use with NMEA 2000 networks during conducted emissions pre-compliance testing.

## Purpose

The combined LISN + CDN provides:

* Two independent DC LISN channels (positive and negative conductors) to CISPR 25/ISO 7637 specification for measuring conducted emissions on both power lines.
* An integrated CAN common-mode noise pick-up network for monitoring conducted emissions on the CANH/CANL signal pair without disturbing communication.
* Realistic, repeatable connection to the Device Under Test (DUT) via short NMEA 2000 (N2K) fly leads and M12 DeviceNet connectors.
* Compatibility with laboratory-style setups via parallel banana sockets for both channels.

## Specifications

**LISN Section:**

* Channels: 2 (positive and negative)
* Frequency range: 150 kHz – 200 MHz (flat impedance, CISPR 25 compliant)
* Line impedance: 5 µH || 50 Ω per channel
* Max DC current: ≥ 5 A continuous
* Max DC voltage: 60 V
* Parallel banana sockets for lab connection to DUT/power source
* Bulk capacitance stack at DUT side per CISPR 25 to stabilise impedance over full band

**CAN CDN Section:**

* Type: High-impedance, AC-coupled common-mode sampler
* Input: Direct from CANH/CANL at DUT connector
* Output: SMA (50 Ω) with 220 nF DC-block capacitor and 1 kΩ summing resistors
* Bandwidth: 150 kHz – 200 MHz
* Optional SMA attenuator or on-board Pi pad for analyser protection

**Connections:**

* DUT side: 150 mm N2K fly lead with **female** M12 DeviceNet connector (5-pin A-coded)
* Backbone/power side: 150 mm N2K fly lead with **male** M12 DeviceNet connector (5-pin A-coded)
* Parallel 4 mm banana sockets for both LISN channels, in parallel with fly leads
* SMA outputs:

  * SMA #1: LISN positive line (NET-S)
  * SMA #2: LISN negative line (NET-C)
  * SMA #3: CAN CDN common-mode output

**Mechanical:**

* PCB: 2-layer FR-4, 1.6 mm thickness, ENIG finish
* Enclosure: Conductive aluminium, internal dimensions sized to fit PCB with endplates for fly leads, banana sockets, and SMAs
* Grounding: PCB ground plane bonded to enclosure at multiple points; 360° shield termination for N2K cable entry

## Schematic Overview

```
[Backbone M12 Male]--LISN+--[DUT M12 Female]
                     |             |
                     |             +-- CAN CDN (AC-coupled CM sampler) --> SMA #3
                     +-- Bulk C --> 50 Ω --> SMA #1 (NET-S)

[Backbone M12 Male]--LISN- --[DUT M12 Female]
                     |             |
                     +-- Bulk C --> 50 Ω --> SMA #2 (NET-C)


## Build Procedure

1. **Prepare PCB:** Verify PCB fabrication meets impedance and layout requirements. Clean copper contact areas for chassis bonds.
2. **Assemble LISN networks:** Populate inductors, bulk caps, HF bypass caps, terminations, and route as per schematic.
3. **Assemble CAN CDN:** Populate summing resistors, DC-block cap, SMA connector; keep loop area minimal.
4. **Install connectors:** Solder SMAs, mount banana sockets, solder fly leads, and secure 360° shield terminations to enclosure.
5. **Enclosure fit-up:** Install PCB into conductive enclosure, ensuring multiple low-impedance bonds between PCB ground and enclosure.
6. **Final assembly:** Fit endplates, secure fly leads, and check for mechanical strain relief.

