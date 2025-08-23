# Conducted Emissions

<h3>Conducted Emissions Standards – EMCBench CAN-LISN Focus</h3>
<table>
  <colgroup>
    <col style="width: 25%;">
    <col style="width: 15%;">
    <col style="width: 15%;">
    <col style="width: 15%;">
    <col style="width: 15%;">
    <col style="width: 15%;">
  </colgroup>
  <thead>
    <tr>
      <th>Standard / Reference</th>
      <th>Frequency Start</th>
      <th>Frequency End</th>
      <th>LISN Inductance</th>
      <th>LISN Impedance</th>
      <th>Port(s) Measured</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://webstore.iec.ch/publication/2402" target="_blank">CISPR&nbsp;25</a> (Automotive)</td>
      <td>150&nbsp;kHz</td>
      <td>108&nbsp;MHz</td>
      <td>5&nbsp;µH ±5%</td>
      <td>50&nbsp;Ω (to ground)</td>
      <td>V<sub>+</sub> and V<sub>−</sub> separately</td>
    </tr>
    <tr>
      <td><a href="https://webstore.iec.ch/publication/2212" target="_blank">EN&nbsp;60945</a> (Marine EMC)</td>
      <td>150&nbsp;kHz</td>
      <td>30&nbsp;MHz*</td>
      <td>5&nbsp;µH ±5%</td>
      <td>50&nbsp;Ω (to ground)</td>
      <td>DC supply line(s)</td>
    </tr>
    <tr>
      <td><a href="https://webstore.iec.ch/publication/2728" target="_blank">IEC&nbsp;61000-6-4</a> (Industrial generic)</td>
      <td>150&nbsp;kHz</td>
      <td>30&nbsp;MHz</td>
      <td>5&nbsp;µH ±5% (DC ports)<br>50&nbsp;µH ±20% (AC mains)</td>
      <td>50&nbsp;Ω (to ground)</td>
      <td>DC supply port</td>
    </tr>
    <tr>
      <td><a href="https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15" target="_blank">FCC&nbsp;Part&nbsp;15B</a> (Conducted)</td>
      <td>150&nbsp;kHz</td>
      <td>30&nbsp;MHz</td>
      <td>5&nbsp;µH ±5% (DC LISN for DC-powered devices)</td>
      <td>50&nbsp;Ω (to ground)</td>
      <td>Power port</td>
    </tr>
    <tr>
      <td><a href="https://infostore.saiglobal.com/en-au/Standards/AS-NZS-CISPR-32-2015-117441_SAIG_AS_AS_246378/" target="_blank">AS/NZS&nbsp;CISPR&nbsp;32</a> (Multimedia)</td>
      <td>150&nbsp;kHz</td>
      <td>30&nbsp;MHz</td>
      <td>5&nbsp;µH ±5% (DC LISN for DC ports)</td>
      <td>50&nbsp;Ω (to ground)</td>
      <td>DC power input</td>
    </tr>
  </tbody>
</table>

<p>* EN 60945 specifies 150 kHz to 30 MHz for conducted emissions, but many marine EMC test houses extend scans to 108 MHz to align with CISPR 25 practices when testing NMEA 2000 equipment.</p>


This page documents the design, bill of materials, and build procedure for a custom dual-channel Line Impedance Stabilization Network (LISN) with integrated CAN Common-Mode Disturbance Network (CDN), suitable for in-line use with NMEA 2000 networks during conducted emissions pre-compliance testing.

---

## Purpose

The combined LISN + CDN provides:

* Two independent DC LISN channels (positive and negative conductors) to CISPR 25/ISO 7637 specification for measuring conducted emissions on both power lines.
* An integrated CAN common-mode noise pick-up network for monitoring conducted emissions on the CANH/CANL signal pair without disturbing communication.
* Realistic, repeatable connection to the Device Under Test (DUT) via short NMEA 2000 (N2K) fly leads and M12 DeviceNet connectors.
* Compatibility with laboratory-style setups via parallel banana sockets for both channels.

---

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

---

## Schematic Overview

```
[Backbone M12 Male]--LISN+--[DUT M12 Female]
                     |             |
                     |             +-- CAN CDN (AC-coupled CM sampler) --> SMA #3
                     +-- Bulk C --> 50 Ω --> SMA #1 (NET-S)

[Backbone M12 Male]--LISN- --[DUT M12 Female]
                     |             |
                     +-- Bulk C --> 50 Ω --> SMA #2 (NET-C)
```

---

## Bill of Materials (key parts)

| Qty | Component               | Specification              | Notes                                                   |
| --- | ----------------------- | -------------------------- | ------------------------------------------------------- |
| 10  | Inductors               | 1.0–1.2 µH, ≥ 5 A, low DCR | 5 in series per channel for broadband response          |
| 6   | Capacitors, MLCC        | 2.2 µF, 100 V, X7R, 1210   | DUT-side bulk capacitance                               |
| 4   | Capacitors, MLCC        | 100 nF, 250 V, X7R, 1206   | HF bypass                                               |
| 2   | Electrolytic capacitors | 22 µF, 100 V, low ESR      | LF stability                                            |
| 2   | Resistors               | 50 Ω, ≥1 W, non-inductive  | LISN terminations                                       |
| 2   | Resistors               | 1 kΩ, 1%, 0603             | CAN CDN summing resistors                               |
| 1   | Capacitor               | 220 nF, C0G or film        | CAN CDN DC block                                        |
| 3   | SMA edge connectors     | 50 Ω, PCB mount            | LISN+ / LISN- / CAN CDN outputs                         |
| 4   | Banana sockets          | 4 mm panel mount           | Positive and negative LISN channels, DUT & source sides |
| 2   | NMEA 2000 drop cables   | 150 mm, 5-core shielded    | Hardwired fly leads to DUT and backbone                 |
| 2   | M12 connectors          | DeviceNet 5-pin A-coded    | Female to DUT, male to backbone                         |

---

## Build Procedure

1. **Prepare PCB:** Verify PCB fabrication meets impedance and layout requirements. Clean copper contact areas for chassis bonds.
2. **Assemble LISN networks:** Populate inductors, bulk caps, HF bypass caps, terminations, and route as per schematic.
3. **Assemble CAN CDN:** Populate summing resistors, DC-block cap, SMA connector; keep loop area minimal.
4. **Install connectors:** Solder SMAs, mount banana sockets, solder fly leads, and secure 360° shield terminations to enclosure.
5. **Enclosure fit-up:** Install PCB into conductive enclosure, ensuring multiple low-impedance bonds between PCB ground and enclosure.
6. **Final assembly:** Fit endplates, secure fly leads, and check for mechanical strain relief.

---

## Usage

1. Connect the backbone/power side fly lead to N2K power source.
2. Connect the DUT side fly lead to the device under test.
3. Place LISN enclosure on bonded ground plane.
4. For LISN measurements, connect SMA #1 (NET-S) or SMA #2 (NET-C) to analyser with 50 Ω termination.
5. For CAN common-mode noise measurements, connect SMA #3 to analyser (50 Ω termination, AC coupled).
6. Keep DUT cable runs short and flat over the ground plane for best repeatability.

---

## Safety Notes

* Observe polarity when connecting DUT and supply.
* Do not exceed current and voltage ratings.
* Use on bonded conductive ground plane in a shielded test area.
* The device is for measurement use only; not for permanent installation.
