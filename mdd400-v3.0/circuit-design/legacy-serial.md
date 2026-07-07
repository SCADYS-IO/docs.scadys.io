---
title: Legacy Serial Interface
hw_version: v3.0
hw_status: schematic
hw_status_label: "In design — V3.0 schematic capture in progress"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/legacy_serial_rx_70e608ae.svg" alt="Legacy serial interface — full sheet" />

:::note[Hardware version]
MDD400 **v2.9** — Prototype — under test
:::

:::note[`ST_EN` polarity — active-HIGH (carried from V2.9)]
**`ST_EN` is active-HIGH** — drive the GPIO HIGH to enable the transmitter; LOW or undriven disables it. This was validated on the fabricated MDD400 V2.9 board and its KiCad netlist and carries over to V3.0. R28 (100 kΩ) is a pull-down from `ST_EN` to GNDREF (default-disable); R29 (390 Ω) is the U9 enable-LED series resistor.

This sheet is a **carry-over** from V2.9 and is still being re-pointed to the ESP32-P4 (`ST_EN` → GPIO4); the pin and refdes references in the body below reflect V2.9 until that pass. A broader netlist re-review of the TX-isolator output network also remains pending.
:::

## Overview

The legacy serial interface provides a galvanically isolated single-wire serial connection designed for full electrical compatibility with Raymarine's Legacy Serial Protocol (e.g. SeaTalk™). It connects to legacy marine instruments via a 3-pin connector and exposes three MCU signals — `ST_RX`, `ST_TX` and `ST_EN` (for receive, transmit and transmit enable respectively), each crossing the isolation barrier via a TLP2309 opto-isolator.

The primary application on the MDD400 is to receive and display data from Legacy Serial Protocol or single-ended NMEA 0183 instruments. Wind, compass, and boat speed data arriving via this interface are also used internally for calculations such as true wind. A future use case for the transmit path is autopilot control over the Legacy Serial Protocol; the hardware is capable, but firmware implementation is out of scope for this document.

The interface is a single signal wire and is therefore half-duplex: it either receives or transmits, never both at once. Receive is NMEA 0183 listener compliant at 4800 and 38400 baud. The transmit path carries the Legacy Serial Protocol only; it is not NMEA 0183 compliant, and the firmware transmits SeaTalk only (see [NMEA 0183 caveats](#nmea-0183-caveats)).

This page covers four sub-circuits drawn across the `legacy_serial_rx` and `legacy_serial_tx` KiCad sheets:

- **[3-wire connector and bus modes](#3-wire-connector-and-bus-modes)** — physical interface, Legacy Serial Protocol and NMEA 0183 wiring;
- **[12 V power protection and regulation](#12-v-power-protection-and-regulation)** — bus supply conditioning and LDO;
- **[Receive path](#receive-path)** — signal filtering and isolated receive opto; and
- **[Transmit path](#transmit-path)** — isolated transmit, enable gate, and open-drain line driver.

## Functional specification and design objectives

The legacy serial interface circuit must:

- provide a 3-pin connector pin-compatible with Raymarine's legacy 3-pin connector, accepting Raymarine plugs or 1211 spade crimp connectors;
- support both Legacy Serial Protocol (half-duplex, 9-bit framing, 4800 baud) and single-ended NMEA 0183 receive;
- maintain a galvanic isolation barrier between the bus-powered legacy domain (VST / GND_ST) and the digital domain (VCC / GNDREF), with the opto-isolators as the only electrical link across it;
- condition the 12 V bus supply against reverse polarity, fast transients, high-energy surges, and conducted HF EMI before regulation;
- regulate a stable VST rail across the full 9–16 V NMEA 2000 bus voltage range to keep the opto-isolator LED drive above its minimum forward current;
- present `ST_RX` as a standard UART-compatible signal that is NMEA 0183 listener compliant at 4800 and 38400 baud; and
- gate the transmit line driver default-disabled, enabled only by explicit firmware action, with rise-time assist for reliable Legacy Serial Protocol transmission over long cable runs.

## 3-Wire Connector and Bus Modes

<SchematicViewer src="/img/schematics/mdd400-v2.9/legacy_serial_rx_70e608ae.svg" alt="Legacy Serial RX — connector and bus modes. Zoom out to see the full sheet." initialFocus="158.75 101.6 125.73 63.5" />

### How it works

J3 is a 3-pin through-hole connector with a custom footprint that is pin-compatible with Raymarine's legacy 3-pin connector. It accepts standard Raymarine plugs directly, or 1211 spade female crimp connectors.

| Pin | Colour | Signal | Function |
|-----|--------|--------|----------|
| 1 | RED | 12 V | Bus supply input — powers the on-board LDO (VST domain) |
| 2 | BLACK | GND | Isolated bus ground (GND_ST) |
| 3 | YELLOW | SIG | Single-wire signal line (ST_SIG) |

![Legacy serial 3-pin connector — pin 1 12 V (red), pin 2 GND (black), pin 3 SIG (yellow)](/img/mdd400-v2.9/legacy_serial_pinout.svg)

#### Legacy Serial Protocol Mode

In Legacy Serial Protocol mode all three pins are used as supplied by the bus:

- pin 1 provides 12 V bus power;
- pin 2 is the bus ground reference; and
- pin 3 carries the single-wire, idle-HIGH, active-LOW serial signal at 4800 baud.

The MDD400 can both listen to and transmit on the bus. During transmit, Q10 (2N7002) pulls pin 3 LOW; during idle and receive, pin 3 is held HIGH by R37 (22 kΩ pull-up to VST). The protocol is half-duplex: the MCU must not transmit while another device is holding the bus LOW.

Legacy Serial Protocol uses 9-bit framing: 4800 baud, 1 start bit, 8 data bits, 1 attribute bit (transmitted as the 9th data bit, conventionally mapped to the UART parity position), 1 stop bit. The attribute bit distinguishes command bytes from data bytes in a multi-byte message.

#### NMEA 0183 Receive Mode

For NMEA 0183 single-ended receive, connect the talker output as follows:

| J3 Pin | NMEA 0183 talker wire |
|--------|----------------------|
| 1 (RED) | Not connected (listener-only); 9–16 V supply required if transmitting |
| 2 (BLACK) | TALK-B (RS-422 A−, signal return / reference) |
| 3 (YELLOW) | TALK-A (RS-422 A+, active signal) |

:::note[12 V supply — when required]
- **Legacy Serial Protocol** — always required; bus power on pin 1 is the only supply source;
- **NMEA 0183 listener only** — not required; the RX buffer draws its LED drive current passively from the talker signal;
- **NMEA 0183 talker** — required; the TX line driver (Q10, VST pull-up R37) needs VST to assert the bus LOW. Connect a 9–16 V supply to pin 1.
:::

The receive circuit draws approximately 0.36 mA from the line at 2.0 V input, within the NMEA 0183 listener limit of 2.0 mA. The TLP2309 propagation delay (≤ 1 µs) and signal filter cut-off (723 kHz) both support NMEA 0183 at 4800 baud and at 38400 baud (high-speed).

#### NMEA 0183 Caveats

**Single wire — receive or transmit, never both.** The interface is one signal wire and is half-duplex; it either listens or talks, never simultaneously. NMEA 0183 assumes separate talker and listener lines, so this single wire cannot act as a standard bidirectional NMEA 0183 node, and NMEA 0183 is supported as a listener (receive) only.

**Receive (listener) — compatible.** The receive circuit meets the NMEA 0183 listener electrical specification at 4800 baud and 38400 baud. The connection is single-ended (TALK-A referenced to GND_ST); it is not a true RS-422 differential receiver. In installations with a shared, low-impedance ground between the MDD400 and the NMEA 0183 talker, this is functionally equivalent. In installations with floating or noisy grounds, common-mode noise rejection will be lower than a proper RS-422 differential front-end.

**Transmit (talker) — not RS-422 compliant.** The TX output is a single-wire open-drain signal: pin 3 is pulled to GND_ST (≈ 0 V) by Q10 during a logic 0, and pulled to VST (≈ 12 V) by R37 during idle and logic 1. Standard RS-422 NMEA 0183 talkers produce a differential signal of ≥ ±2 V between TALK-A and TALK-B. When this circuit's output is connected to a strict RS-422 receiver (TALK-A = pin 3, TALK-B = GND_ST), the logic 0 state produces a differential of ≈ 0 V — outside the RS-422 mark/space threshold — and the receiver will not detect it correctly.

The transmit path is not NMEA 0183 compliant. The single-ended open-drain output can drive some non-standard NMEA 0183 inputs that accept single-ended 12 V logic (for example older Garmin, B&G, and Furuno equipment, and chartplotters with TTL-level NMEA 0183 inputs), but this is not a supported mode; confirm the receiver's input specification before relying on it. In normal operation the firmware transmits on the Legacy Serial Protocol (SeaTalk) only.

The TX circuit is optimised for 4800 baud (Legacy Serial Protocol). At 9600 baud the rise-time assist operates at reduced effectiveness (see [Rise-Time Assist](#rise-time-assist--q12-mmbta56lt1g-c48-r59)); 38400 baud is not supported.

## 12 V Power Protection and Regulation

<SchematicViewer src="/img/schematics/mdd400-v2.9/legacy_serial_rx_70e608ae.svg" alt="Legacy Serial RX — connector and filter section" initialFocus="12.7 101.6 146.05 95.25" />

### How it works

The 12 V bus supply on J3 pin 1 passes through a six-stage protection chain before reaching the LDO regulator.

#### Inrush and surge limiting

R57, a 47 Ω AEC-Q200 thick-film resistor in a 1210 package (500 mW continuous rating), is the first element in the chain. Its position before all clamp devices ensures that peak transient current into the downstream components is limited before reverse-polarity protection or clamping take effect.

#### Reverse-polarity protection

D13 (SS34 Schottky, 40 V / 3 A, SMA) blocks inverted bus connections. Its 0.45 V forward drop is included in all VST voltage and current calculations.

#### Transient suppression

D15 (SMCJ36CA bidirectional TVS, DO-214AB) provides fast transient clamping, responding in nanoseconds. The clamping voltage at peak pulse current is approximately 58 V. M1 (V33MLA1206NH MOV varistor) supplements the TVS for slow, high-energy surges that exceed D15's pulse power rating; its clamp voltage is approximately 75 V.

#### EMI attenuation

FB5 (BLM31KN601SN1L ferrite bead, 600 Ω at 100 MHz, DCR 80 mΩ) attenuates conducted high-frequency EMI on the LDO_VIN rail after the clamp devices.

#### Bulk capacitance

C55 (1 µF / 100 V / X7R, 1206) provides reservoir energy at the LDO input. C54 (10 µF / 25 V / X7R, 0805) and C53 (100 nF / 50 V / X7R, 0603) decouple the LDO output rail (VST).

#### LDO regulation — U11 (ZXTR2012FF)

U11 is a 100 V-input, 12 V / 30 mA linear regulator in SOT-23F. It generates VST — the stable 12 V supply for the opto-isolator LED drive circuit and the bus pull-up. The ZXTR2012FF is specified to regulate at 12 V with a dropout voltage of approximately 0.9 V, giving a regulation threshold of V_bus ≈ 12.9 V.

Below 12.9 V (down to the NMEA 2000 minimum of 9 V), U11 operates in dropout and VST tracks approximately V_bus − 0.9 V. This ensures sufficient LED forward current across the full NMEA 2000 bus voltage range (see Performance below).

### Performance

<details>
<summary>VST and I_LED across NMEA 2000 bus voltage range</summary>

U11 ZXTR2012FF regulates at 12 V when V_IN > 12.9 V (after 0.45 V across D13 and ≈ 0.24 V across R57 at 5 mA). Below this threshold, VST ≈ V_bus − 0.9 V.

| V_bus | VST | I_LED | Notes |
|-------|-----|-------|-------|
| 16 V (max) | 12.0 V | 4.5 mA | Regulated |
| 12 V (nom) | 11.1 V | 4.1 mA | Dropout |
| 9 V (min) | 8.1 V | 2.93 mA | Dropout; above the TLP2309 1 mA minimum I_F for CTR — functional |

I_LED = (VST − V_D6_F − V_LED_F) / R32; V_D6_F = 0.45 V; V_LED_F = 1.20 V (typ); R32 = 2.2 kΩ.

U11 thermal at V_bus = 16 V, I_VST ≈ 5.4 mA: P_D = (15.31 − 12.0) × 5.4 mA = 18 mW. At 95 °C/W (SOT-23F), ΔT_j &lt; 2 °C.

</details>

<details>
<summary>Protection chain</summary>

| Threat | Component | Characteristic |
|--------|-----------|----------------|
| Reverse polarity | D13 SS34 | V_F = 0.45 V forward; blocks reverse current |
| Fast transient / ISO 7637-2 | D15 SMCJ36CA | V_BR = 40 V min; V_C = 58.1 V at I_PP = 43.5 A |
| High-energy surge | M1 V33MLA1206NH | V_clamp ≈ 75 V; max energy 0.6 J |
| Conducted HF EMI | FB5 BLM31KN601SN1L | 600 Ω @ 100 MHz; DCR = 80 mΩ |
| Signal ESD | D14 PESD15VL1BA | V_BR = 15 V; V_clamp ≈ 17 V at 1 A |

</details>

## Receive Path

<SchematicViewer src="/img/schematics/mdd400-v2.9/legacy_serial_rx_70e608ae.svg" alt="Legacy Serial RX — receive buffer section" initialFocus="12.7 12.7 146.05 88.9" />

### How it works

The signal on J3 pin 3 (ST_SIG) passes through a two-stage RF filter and ESD clamp before reaching the TLP2309 opto-isolator.

#### Signal filtering and ESD

C49 (100 pF / 50 V / C0G, 0603) shunts high-frequency noise on ST_SIG to GND_ST close to J3. D14 (PESD15VL1BA, SOD-323) clamps electrostatic discharge events on ST_SIG to GND_ST; its standoff voltage is 15 V. L5 (1 µH, 0603) in series with C50 (100 pF / 50 V / C0G, 0603) forms a second LC filter stage, with a resonant frequency of 15.9 MHz and an effective −3 dB (R32 × C50) of 723 kHz.

#### Opto drive — D6, R30, R32

R30 (22 kΩ from VST) is the bus pull-up, holding ST_SIG HIGH during idle and defining the open-collector drive level. D6 (BAT54J Schottky, SOD-323F) is in series between VST and the TLP2309 LED drive path; it is reverse-biased when the bus is idle (both its anode and cathode at VST) and conducts only when the bus is pulled LOW. This prevents the LED drive current from loading the bus continuously. R32 (2.2 kΩ) limits the LED forward current.

When a bus device or NMEA 0183 talker asserts a LOW on ST_SIG:

```
I_LED = (VST − V_D6_F − V_LED_F) / R32
      = (12.0 V − 0.45 V − 1.20 V) / 2200 Ω ≈ 4.70 mA (at VST = 12 V)
```

At the NMEA 2000 minimum bus voltage of 9 V, VST drops to approximately 8.1 V (U11 in dropout), giving I_LED ≈ 2.93 mA — above the TLP2309 I_F(ON) minimum.

#### Isolation — U7 (TLP2309)

U7 is a Toshiba TLP2309 logic-gate opto-isolator (SO-6, 3750 Vrms isolation voltage, ±15 kV/µs common-mode transient immunity). The LED input side operates in the VST / GND_ST (legacy) domain; the output side is in the VCC (3.3 V) / GNDREF (digital) domain.

The TLP2309 has inverter logic (LED ON → output LOW). In the circuit, bus LOW drives the LED ON, which pulls the output LOW. The result is non-inverting from the bus perspective:

| ST_SIG (bus) | U7 LED | ST_RX (MCU) |
|---|---|---|
| HIGH (idle) | OFF | HIGH |
| LOW (active) | ON | LOW |

R25 (2.2 kΩ, VCC to U7 output) is the output pull-up. C30 (100 nF) is the VCC bypass at the output side of U7.

### Performance

<details>
<summary>Signal filter</summary>

| Parameter | Value |
|-----------|-------|
| LC resonant frequency (L5 × C50) | 1 / (2π√(1 µH × 100 pF)) = **15.9 MHz** |
| Effective −3 dB (R32 × C50 dominated) | 1 / (2π × 2200 × 100 pF) = **723 kHz** |
| Legacy Serial Protocol signal content | ≤ 50 kHz (4800 baud) |
| NMEA 0183 HS signal content | ≤ 400 kHz (38400 baud) |
| Filter margin above signal band (4800 baud) | > 14× |

</details>

<details>
<summary>NMEA 0183 listener compliance (receive)</summary>

| Parameter | NMEA 0183 limit | As built |
|-----------|----------------|---------|
| Minimum input differential for detection | 200 mV | Opto threshold well below 2.0 V ✓ |
| Maximum input load current at 2.0 V | 2.0 mA | **0.36 mA** ✓ |
| Maximum baud rate (TLP2309 switching) | — | 1 Mbit/s (far above 38400 baud) ✓ |

Input load at 2.0 V: I = (2.0 V − V_LED_F) / R32 = (2.0 − 1.20) / 2200 = **0.36 mA** (D6 isolated from load path when bus voltage is below VST; load is from R32 and LED series path only).

</details>

## Transmit Path

<SchematicViewer src="/img/schematics/mdd400-v2.9/legacy_serial_tx_aa415734.svg" alt="Legacy Serial TX schematic" initialFocus="12.7 12.7 138.43 177.8" />

### How it works

The TX circuit has four functional stages: an enable opto-isolator (U9) that gates the transmitter by default, a TX opto-isolator (U8) that transfers the UART data signal across the isolation barrier, a two-transistor push-pull gate driver (Q8, Q11) with a PMOS high-side switch (Q9) that drives the NMOS line driver (Q10), and a rise-time assist stage (Q12) that accelerates bus rising edges.

#### Enable isolator — U9 (TLP2309), default-disable

U9 is a TLP2309 opto-isolator that transfers the `ST_EN` enable signal across the isolation barrier. **`ST_EN` is active-HIGH.**

The MCU side of U9 has R29 (390 Ω) in series with the LED, and R28 (100 kΩ) as a pull-down from `ST_EN` to GNDREF. When the MCU drives `ST_EN` **HIGH**, current flows through R29 into the U9 LED, turning it on and asserting the enable signal on the legacy side. When `ST_EN` is **LOW or undriven**, no LED current flows and the transmitter is disabled.

R28 holds `ST_EN` LOW so the TX line driver is off during MCU boot, reset, any firmware fault, and any GPIO-float condition. The transmitter can only be enabled by an explicit firmware action — driving `ST_EN` HIGH.

#### TX isolator — U8 (TLP2309)

U8 transfers `ST_TX` across the isolation barrier. The input side has a 10 kΩ pull-up (R26) from VCC to the LED anode and a 390 Ω series resistor (R27). The LED is off when `ST_TX` is HIGH (bus idle); when the MCU drives `ST_TX` LOW, the LED conducts at approximately 5.6 mA. The output side (in the VST / GND_ST legacy domain) reproduces the TX signal and feeds the gate-driver chain. *(The precise refdes assignments of the U8/U9 legacy-side pull-up/pull-down network are pending the netlist re-review noted at the top of this page.)*

#### Gate driver — Q8, Q11 (BC847BS), Q9 (AO3407A), Q10 (2N7002)

The gate driver takes the U8 output and drives Q10 (2N7002, 60 V / 300 mA N-channel MOSFET), the open-drain line driver.

Q8 and Q11 are two transistors from a BC847BS dual NPN pair (SOT363), forming a push-pull pre-driver. Q9 (AO3407A P-channel MOSFET, 30 V / 4.2 A) is the high-side element of the gate driver chain; D11 (BAT54S dual Schottky) clamps gate nodes against transient overvoltage.

When the bus is idle (`ST_TX` HIGH): U8 output is HIGH, Q10 gate is pulled LOW, Q10 is off, and ST_SIG floats HIGH through R37 (22 kΩ to VST).

When the MCU transmits a logic 0 (`ST_TX` LOW): U8 output goes LOW, the gate driver asserts Q10 gate HIGH through R55 (390 Ω gate resistor), Q10 conducts, and ST_SIG is pulled to GND_ST. Q10 R_DS(on) ≈ 2.8–5 Ω produces a bus LOW voltage of &lt; 10 mV at pull-up current levels — negligible.

D9 (BZT52C15S, 15 V zener, SOD-323) clamps ST_SIG against positive transients. The 3 V headroom above VST = 12 V ensures D9 does not conduct under normal operating conditions.

#### Rise-time assist — Q12 (MMBTA56LT1G), C48, R59

When Q10 turns off, the bus rising edge is initially slow because R37 (22 kΩ) charges the cable capacitance passively. For a typical Legacy Serial Protocol installation with 10 m of cable (≈ 1 nF), the passive RC time constant is 22 kΩ × 1 nF = 22 µs — marginal against a 208 µs bit period. For longer cable runs (up to 80 m, ≈ 8 nF), the passive RC exceeds 176 µs, which is too slow for reliable reception.

Q12 (MMBTA56LT1G PNP) provides a brief high-side current pulse into ST_SIG via an AC-coupled path. C48 (2.2 nF C0G) and R59 (12 kΩ) set the pulse duration. Q12 turns on at the start of each LOW-to-HIGH transition and sources current from VST through R51 (10 Ω) into ST_SIG. Q12 turns off once C48 has charged through R59.

The cable charges to VST via Q12 and R51 (10 Ω): for an 8 nF cable, τ_charge = 10 Ω × 8 nF = 80 ns. The cable reaches full voltage well within one assist pulse. The assist pulse duration τ_assist = C48 × R59 = 2.2 nF × 12 kΩ = **26.4 µs**.

| Baud rate | Bit period | τ_assist / bit period | Rise-time assist effectiveness |
|---|---|---|---|
| 4800 baud (Legacy Serial Protocol) | 208 µs | 12.7 % | Effective — fully discharges between transitions |
| 9600 baud | 104 µs | 25.4 % | Marginal — C48 partially discharged at next transition |
| 38400 baud (NMEA 0183 HS) | 26 µs | ~100 % | Ineffective — C48 cannot discharge between bits |

:::caution[Rise-time assist — recommended rework for V2.9]
**Recommendation: change C48 from 2.2 nF to 820 pF.** With R59 = 12 kΩ unchanged, this gives τ_assist = 9.8 µs.

- At 4800 baud: τ_assist / T = 4.7 % — fully effective; cable (8 nF) charges in ≈ 80 ns, well within the 9.8 µs pulse. No degradation for Legacy Serial Protocol long-cable installations.
- At 9600 baud: τ_assist / T = 9.4 % — effective. The 9.8 µs assist pulse fully discharges before the next bit.

This is a component value change only. C48 is a 0603 C0G capacitor; the footprint is unchanged. The change is achievable by reworking existing V2.9 boards and updating the schematic BOM. Update the schematic value for C48 to 820 pF and fit the correct value on all assembled units.

38400 baud (NMEA 0183 HS) TX remains unsupported with either C48 value. Supporting 38400 baud would require further reduction of C48 to ≈ 220 pF, which would reduce the assist pulse to 2.6 µs — insufficient to reliably charge cable lengths beyond 2–3 m. A redesign of the assist stage (e.g. a constant-current source or firmware-adaptive baud rate detection) would be required for robust HS NMEA 0183 TX support.
:::

#### Feedback current-limiting loop — Q11 (BC847BS TR2)

The second transistor of the Q11 BC847BS package monitors current through Q10. When Q10 sinks significant drain current, the voltage across R51 rises and turns on Q11 TR2, which steals base drive from the push-pull stage, limiting Q10 gate voltage and preventing excessive drain current. This protects the gate driver chain during output shorts or bus faults.

### Performance

<details>
<summary>Rise-time assist</summary>

Current values (C48 = 2.2 nF, R59 = 12 kΩ):

| Parameter | Value |
|-----------|-------|
| τ_assist (C48 × R59) | 2.2 nF × 12 kΩ = **26.4 µs** |
| τ_cable (R51 × C_cable, 10 m run) | 10 Ω × 1 nF = **10 ns** |
| τ_cable (R51 × C_cable, 80 m run) | 10 Ω × 8 nF = **80 ns** |
| τ_assist / bit period @ 4800 baud | 26.4 µs / 208 µs = **12.7 %** |
| τ_assist / bit period @ 9600 baud | 26.4 µs / 104 µs = **25.4 %** |

Recommended rework values (C48 = 820 pF, R59 = 12 kΩ unchanged):

| Parameter | Value |
|-----------|-------|
| τ_assist | 820 pF × 12 kΩ = **9.84 µs** |
| τ_assist / bit period @ 4800 baud | 9.84 µs / 208 µs = **4.7 %** |
| τ_assist / bit period @ 9600 baud | 9.84 µs / 104 µs = **9.5 %** |

</details>

<details>
<summary>TX opto LED current</summary>

| Signal | Formula | Result |
|--------|---------|--------|
| U8 / U9 LED current | (VCC − V_LED_F) / R_series = (3.3 − 1.1) / 390 Ω | **5.6 mA** — well above the TLP2309 1 mA minimum I_F for CTR; opto saturates reliably |
| Q10 V_DS(on) at pull-up current | 12 V / 22 kΩ × 2.8 Ω R_DS(on) | **&lt; 1.5 mV** — negligible bus LOW voltage |

</details>

<details>
<summary>Isolation</summary>

| Parameter | Requirement | As built |
|-----------|-------------|----------|
| TLP2309 isolation voltage (U7, U8, U9) | — | **3750 Vrms** (Toshiba TLP2309 datasheet, section 7) |
| Common-mode transient immunity | — | ±15 kV/µs (min) |
| PCB copper-free gap (U7) | ≥ 0.8 mm (IPC-2221 Class B) | **1.4 mm** (F.Cu and In1.Cu confirmed) |
| PCB copper-free gap (U8/U9) | ≥ 0.8 mm | **1.4 mm** (confirmed on F.Cu; GNDS zone boundary unverified — check Gerber) |

</details>

## Firmware notes

### Power domain

The VST rail is not MCU-controlled. It is live whenever the Legacy Serial Protocol bus supplies power on J3 pin 1. The VST domain (GND_ST) is electrically isolated from GNDREF (digital ground) — there is no DC or capacitive path between the two domains on the PCB. The opto-isolators are the only electrical link across the boundary.

### Receive

`ST_RX` presents as a standard UART-compatible signal to the ESP32:

- **Idle bus** → `ST_RX` HIGH (≥ 2.97 V, VCC − V_OL; TLP2309 V_OL ≤ 0.4 V);
- **Bus asserted LOW** → `ST_RX` LOW (≤ 0.4 V).

Configure the ESP32 UART peripheral as follows for Legacy Serial Protocol:

| Parameter | Value |
|-----------|-------|
| Baud rate | 4800 |
| Data bits | 8 |
| Parity | even (maps the 9th attribute bit to the parity position) |
| Stop bits | 1 |
| Line idle level | HIGH |

For NMEA 0183: 4800 baud or 38400 baud, 8N1, no parity.

`ST_RX` can be assigned to any GPIO configured as a UART RX input. No inversion is needed.

### Transmit

| Signal | Direction | Active level | Description |
|--------|-----------|--------------|-------------|
| `ST_EN` | Output | HIGH | Drive HIGH to enable TX. Leave LOW (or undriven) to disable. R28 pull-down on MCU side ensures TX disabled on reset / boot / GPIO float. |
| `ST_TX` | Output | — | UART TX signal. HIGH = bus idle; LOW = bus asserted. Same polarity as standard UART TX — connect directly to UART TX peripheral, no inversion needed. |

**Transmit sequence:**
1. Monitor `ST_RX`; wait for bus idle (HIGH for ≥ 1 bit period).
2. Drive `ST_EN` HIGH to enable the TX path.
3. Transmit via `ST_TX` using the UART peripheral at 4800 baud, 8E1 (Legacy Serial Protocol) or 8N1 (NMEA 0183).
4. After the last stop bit, return `ST_EN` LOW to disable the line driver.
5. Resume monitoring `ST_RX`.

**Collision detection:** while transmitting, compare `ST_RX` against the expected `ST_TX` state. If `ST_RX` is LOW when `ST_TX` is HIGH, another device is driving the bus simultaneously. Abort transmission, drive `ST_EN` LOW, and implement a random back-off before retrying (consistent with Legacy Serial Protocol bus arbitration practice).

## PCB Layout

### Isolation boundary

The isolation boundary runs horizontally across the PCB, separating the GND_ST (legacy) domain from GNDREF (digital). A 1.4 mm copper-free zone passes through the bodies of U7, U8, and U9 on both F.Cu and In1.Cu. No copper fill, trace, or via crosses this zone on any layer. B.Cu carries GNDREF only on the digital side; GND_ST is confined to F.Cu and In1.Cu on the legacy side.

| Requirement | Status | Evidence |
|-------------|--------|---------|
| U7 straddles GND_ST/GNDREF boundary; 1.4 mm gap confirmed | ✅ Met | LED pads at Y = 76.35 (GNDREF side); output pads at Y = 82.85 (GND_ST side) |
| U8/U9 isolation barrier copper zone clearance | ⚠️ Unverifiable | Requires Gerber inspection; cannot confirm from position data alone |
| GND_ST and GNDREF zones do not share vias | ✅ Met (U7 side) | Confirmed on F.Cu and In1.Cu for U7 region |
| No fill or trace crosses isolation gap on any layer | ✅ Met (U7 side) | Verified on all layers; U8/U9 side requires Gerber check |

### Component placement — receive side

| Requirement | Status | Evidence |
|-------------|--------|---------|
| R30 / D6 / R32 close to U7 LED input | ✅ Met | R30 3.96 mm, D6 7.2 mm from U7 centroid |
| D14 (ESD) and C49 (RF bypass) near J3 | ⚠️ Partial | D14 22.8 mm, C49 21.4 mm from J3; J3 THT footprint clearance prevents closer placement; chain order correct |
| C55 (1 µF LDO input bypass) ≤ 2 mm from U11 VIN | ⚠️ Not met | 9.2 mm; validate under transient load at bring-up |
| C54 (10 µF VST output) ≤ 2 mm from U11 VOUT | ⚠️ Not met | 5.0 mm; validate under transient load at bring-up |
| C30 (VCC bypass) near U7 VCC pin | ✅ Met | 3.3 mm from U7 pad 6 (courtyard-to-courtyard) |

### Component placement — transmit side

| Requirement | Status | Evidence |
|-------------|--------|---------|
| C39 (100 nF VST bypass) adjacent to U8/U9 | ✅ Met | C39 4.1 mm from U8; acceptable proximity |
| C40 (100 nF VCC bypass) adjacent to U8/U9 | ✅ Met | C40 4.0 mm from U9; functionally acceptable |
| Q8 / Q11 / Q10 gate driver cluster compact | ✅ Met | Main cluster Q8–Q10 spans Y = 79.6–101.5 mm; Q10 at 101.5 mm, D9 at 97.0 mm, Q8 at 94.6 mm — within 22 mm |
| C48 (rise-time assist timing) and R59 close to Q12 | ⚠️ Unverifiable | C48 and R59 PCB positions not recovered from PCB data; confirm via PCB editor |
| D9 (zener clamp) close to ST_SIG output | ⚠️ Partial | D9 at (150.9, 97.0); Q10 at (150.8, 101.5); 4.5 mm separation — acceptable |

### Signal routing

The protection chain is built connector-first: J3 → R57 → D13-anode (with D15/M1 in parallel) → D13-cathode → FB5 → U11 → VST. The transmit-side component cluster occupies approximately X: 147–158 mm, Y: 73–113 mm on F.Cu — an elongated column of ~11 × 40 mm. U8/U9 optocouplers anchor the top (Y ≈ 79.6); the legacy-side output devices (Q10, Q12, D9) occupy the lower section (Y ≈ 97–112). VST supply traces should be ≥ 0.5 mm wide on the power entry section carrying surge current; confirm via DRC.

## Components

| Ref | Value | Description | Datasheet |
|-----|-------|-------------|-----------|
| J3 | CON-THT-SEATALK-0292 | Custom 3-pin THT, pin-compatible with Raymarine's legacy 3-pin connector; accepts Raymarine plugs or 1211 spade crimp connectors | — |
| D13 | SS34 | MSKSEMI SS34 Schottky, SMA, 40 V / 3 A — reverse-polarity protection | [SS34](/assets/datasheets/mdd400-v2.9/SS34.pdf) |
| R57 | 47 Ω / 1210 / 500 mW | Yageo AC1210JR-0747RL, AEC-Q200 thick-film — pulse-damping resistor at LDO_VIN entry | [AC1210JR-0747RL](/assets/datasheets/mdd400-v2.9/AC1210JR-0747RL.pdf) |
| D15 | SMCJ36CA | Littelfuse SMCJ36CA bidirectional TVS, DO-214AB — fast transient suppression, V_clamp ≈ 58 V | [SMCJ36CA](/assets/datasheets/mdd400-v2.9/SMCJ36CA.pdf) |
| M1 | V33MLA1206NH | Littelfuse V33MLA1206NH MOV varistor, 1206 — high-energy surge absorption, V_clamp ≈ 75 V | [V33MLA1206NH](/assets/datasheets/mdd400-v2.9/V33MLA1206NH.pdf) |
| FB5 | BLM31KN601SN1L | Murata BLM31KN601SN1L ferrite bead, 600 Ω @ 100 MHz — conducted HF EMI attenuation | [BLM31KN601SN1L](/assets/datasheets/mdd400-v2.9/BLM31KN601SN1L.pdf) |
| C55 | 1 µF / 100 V / 1206 / X7R | Murata GRM31CR72A105KA01K — bulk input decoupling, LDO_VIN | [GRM31CR72A105KA01K](/assets/datasheets/mdd400-v2.9/GRM31CR72A105KA01K.pdf) |
| U11 | ZXTR2012FF | Diodes Inc. ZXTR2012FF, SOT-23F, 100 V input / 12 V / 30 mA LDO — generates VST from LDO_VIN | [ZXTR2012FF](/assets/datasheets/mdd400-v2.9/ZXTR2012.pdf) |
| C54 | 10 µF / 25 V / 0805 / X7R | Murata GRM21BZ71E106KE15L — bulk output reservoir, VST rail | [GRM21BZ71E106KE15L](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |
| C53 | 100 nF / 50 V / 0603 / X7R | Murata GRM188R71H104KA93D — HF bypass, VST rail | [GRM188R71H104KA93D](/assets/datasheets/mdd400-v2.9/GRM188R71H104KA93D.pdf) |
| R30 | 22 kΩ / 0603 | Yageo RC Series, ±1% — bus pull-up from VST to ST_SIG | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| D6 | BAT54J | Nexperia BAT54J Schottky, SOD-323F — blocks VST pull-up from loading bus during idle | [BAT54J](/assets/datasheets/mdd400-v2.9/BAT54J.pdf) |
| C49 | 100 pF / 50 V / 0603 / C0G | Murata GRM1885C1H101JA01D — RF bypass on ST_SIG at J3 | [GRM1885C1H101JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D) |
| D14 | PESD15VL1BA | Nexperia PESD15VL1BA ESD TVS, SOD-323 — clamps ESD events on ST_SIG | [PESD15VL1BA](/assets/datasheets/mdd400-v2.9/PESD15VL1BA.pdf) |
| L5 | 1 µH / 0603 | Murata LQM18FN1R0M00D — series inductor, LC filter on ST_SIG | [LQM18FN1R0M00D](/assets/datasheets/mdd400-v2.9/LQM18FN1R0M00D.pdf) |
| C50 | 100 pF / 50 V / 0603 / C0G | Murata GRM1885C1H101JA01D — shunt cap, LC filter on ST_SIG | [GRM1885C1H101JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D) |
| R32 | 2.2 kΩ / 0603 | Yageo RC Series, ±1% — LED current-limiting resistor, RX opto input | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| U7 | TLP2309 | Toshiba TLP2309, SO-6, 3750 Vrms — RX galvanic isolation opto | [TLP2309](/assets/datasheets/mdd400-v2.9/TLP2309.pdf) |
| R25 | 2.2 kΩ / 0603 | Yageo RC Series, ±1% — pull-up from VCC to U7 output; defines ST_RX HIGH level | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C30 | 100 nF / 50 V / 0603 | VCC bypass at U7 output side | — |
| U8 | TLP2309 | Toshiba TLP2309, SO-6, 3750 Vrms — TX signal isolator (digital → legacy) | [TLP2309](/assets/datasheets/mdd400-v2.9/TLP2309.pdf) |
| U9 | TLP2309 | Toshiba TLP2309, SO-6, 3750 Vrms — TX enable isolator (default-disable) | [TLP2309](/assets/datasheets/mdd400-v2.9/TLP2309.pdf) |
| R26 | 10 kΩ / 0603 | Yageo RC Series — ST_TX pull-up to VCC; holds LED off at default | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R27, R29 | 390 Ω / 0603 | Yageo RC Series — LED current-limiting (R27 = U8 TX; R29 = U9 EN) | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R28 | 100 kΩ / 0603 | Yageo RC Series — pull-down from `ST_EN` to GNDREF; holds TX default-disabled on reset / boot / GPIO float | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R36 | 390 Ω / 0603 | Yageo RC Series — U9 EN opto secondary bias | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R37 | 22 kΩ / 0603 | Yageo RC Series — ST_SIG pull-up to VST; sets bus idle-HIGH | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R38 | 100 kΩ / 0603 | Yageo RC Series — EN opto output pull-down on legacy side | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R40 | 56 kΩ / 0603 | Yageo RC Series — gate driver bias | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R41, R43 | 1 MΩ / 0603 | Yageo RC Series — high-impedance bias, driver chain | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R42 | 30.9 kΩ / 0603 | Yageo RC Series — gate driver bias | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R47 | 22 kΩ / 0603 | Yageo RC Series — base/gate pull-down | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R48, R49, R56 | 39 kΩ / 0603 | Yageo RC Series — timing / bias network | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R50, R58 | 2.2 kΩ / 0603 | Yageo RC Series — output and legacy-side base resistors | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R51 | 10 Ω / 0603 | Yageo RC0603FR-0710RL — series resistor, Q12 rise-time assist output | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R52 | 1 kΩ / 0603 | Yageo RC0603FR-071KL, thick-film, ±1% — driver chain bias | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R55 | 390 Ω / 0603 | Yageo RC Series — Q10 gate drive resistor | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R59 | 12 kΩ / 0603 | Yageo RC Series — C48 discharge path, rise-time assist RC | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R61 | 10 kΩ / 0603 | Yageo RC Series — feedback current-limit bias | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C39 | 100 nF / 50 V / 0603 / X7R | Murata GCM188R71H104KA57D — VST bypass at U8 | [GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C40 | 100 nF / 50 V / 0603 / X7R | Murata GCM188R71H104KA57D — VCC bypass at U9 | [GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C48 | **820 pF** / 50 V / 0603 / C0G | Murata GRM1885C1H821JA01D (or equivalent) — rise-time assist timing capacitor (**updated from 2.2 nF; rework required**) | — |
| Q8, Q11 | BC847BS | Nexperia BC847BS NPN dual, SOT363 — gate driver push-pull pre-driver (both units used) | [BC847BS](https://assets.nexperia.com/documents/data-sheet/BC847BS.pdf) |
| Q9 | AO3407A | AOS AO3407A P-channel MOSFET, SOT-23, 30 V / 4.2 A — high-side gate driver | [AO3407A](https://aosmd.com/res/data_sheets/AO3407A.pdf) |
| Q10 | 2N7002 | Nexperia 2N7002 N-channel MOSFET, SOT-23, 60 V / 300 mA — open-drain line driver | [2N7002](https://assets.nexperia.com/documents/data-sheet/2N7002.pdf) |
| Q12 | MMBTA56LT1G | onsemi MMBTA56LT1G PNP, SOT-23, 80 V / 500 mA — rise-time assist high-side source | [MMBTA56LT1G](https://www.onsemi.com/pdf/datasheet/mmbta56lt1g-d.pdf) |
| D9 | BZT52C15S | Diodes Inc. BZT52C15S 15 V zener, SOD-323 — ST_SIG line clamp | [BZT52C15S](https://www.diodes.com/assets/Datasheets/BZT52C.pdf) |
| D11 | BAT54S | Nexperia BAT54S dual series Schottky, SOT-23, 30 V — gate circuit protection | [BAT54S](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf) |

## Testing & Verification

:::caution

V2.9 is a prototype under test. The galvanically isolated legacy-serial interface (receive, transmit, and enable paths all crossing the TLP2309 opto barrier) is in place on the V2.9 board, but **end-to-end Legacy Serial Protocol receive and transmit verification on a live bus, NMEA 0183 listener compliance measurement, rise-time-assist behaviour at 4800 / 9600 baud, and U11 LDO behaviour across the 9–16 V NMEA 2000 bus range have not yet been measured on the prototype.** The V2.9 boards also need the **C48 rework from 2.2 nF to 820 pF** applied before TX timing is meaningful.

**Hardware bring-up (rig at the bench) — power:**

- **Apply 12 V to J3 pin 1** — VST regulates at 12.0 ± 0.5 V.
- **Apply 9 V to J3 pin 1** — VST ≈ 8.1 V (dropout); pass if LED current still ≥ 2.9 mA and ST_RX responds to bus signal.
- **Apply 16 V to J3 pin 1** — VST regulates at 12.0 ± 0.5 V; pass if U11 junction ΔT &lt; 2 °C.
- **Reverse polarity / swapped pins** — Apply −12 V or swap pin 1 and pin 2. Pass if VST = 0 V and no component damage.

**Hardware bring-up (rig at the bench) — receive:**

- **Idle bus** — Pass if ST_RX ≈ VCC (≥ 2.9 V).
- **Force LOW via 1 kΩ to GND** — Pass if ST_RX ≤ 0.4 V.
- **4800 baud test pattern** — Pass if UART RX captures correct framing with no errors.
- **38400 baud (NMEA 0183 HS) test pattern** — Pass if UART RX captures correct framing with no errors.
- **NMEA 0183 listener compliance** — Pass if input current at J3 pin 3 = 2.0 V stays ≤ 2.0 mA (target ~0.36 mA).
- **VST = 9 V (dropout) RX behaviour** — Pass if I_LED ≥ 2.0 mA and ST_RX transitions correctly with no missed edges.

**Hardware bring-up (rig at the bench) — transmit (after C48 rework to 820 pF):**

- **ST_EN LOW (or undriven)** — Pass if ST_SIG sits at VST (~12 V via R37) and the transmitter is off.
- **ST_EN HIGH, ST_TX HIGH** — Pass if ST_SIG = VST and Q10 is not conducting.
- **ST_EN HIGH, ST_TX LOW** — Pass if ST_SIG &lt; 50 mV (Q10 conducting and bus pulled LOW).
- **4800 baud rising edge** — Pass if ST_SIG reaches ≥ 80 % VST within 50 µs (rise-time assist functioning).
- **9600 baud rising edge** — Pass if ST_SIG reaches ≥ 80 % VST within 30 µs (assist effective after C48 rework).
- **VST = 16 V** — Pass if D9 (V_Z = 15 V) zener leakage / dissipation stays ≤ 200 mW.
- **58 V transient on ST_SIG (clamped upstream)** — Pass if the gate driver and Q10 survive.

:::

## Gaps & next version

**Before next production run**

- **LDO bypass capacitor proximity** — None of U11's bypass capacitors meets the ≤ 2 mm pin guideline (C55 = 9.2 mm from VIN, C54 = 5.0 mm from VOUT, C53 = 6.6 mm from VOUT). The ZXTR2012FF datasheet requires them for regulation stability. Validate VST under transient load at bring-up; rework C55 and C54 to within 2 mm of their U11 pins if oscillation is observed.
- **C48 rise-time-assist rework** — Change C48 from 2.2 nF to 820 pF (R59 unchanged at 12 kΩ). Same 0603 C0G footprint; update the schematic value and rework all assembled units before TX bring-up.
- **LDO_VIN trace width** — Confirm via Gerber or DRC that the surge-current path from R57 through the D13 / D15 / M1 cluster is ≥ 0.5 mm wide (SMCJ36CA peak pulse current 43.5 A at 8/20 µs).
- **U8/U9 isolation barrier copper clearance** — GNDREF / GNDS zone boundary under U8/U9 is unverifiable from position data; confirm no copper bridge between isolated domains via Gerber inspection.
- **Rise-time-assist component placement** — C48, Q11, R36, R40, R42, R47, R59, R61 PCB positions were not recoverable from review data; confirm placement relative to Q12 in the PCB editor before bring-up.
- **C49 / C50 schematic metadata** — The KiCAD schematic lists the wrong manufacturer part for C49 and C50 (GRM188R71H104KA93D, 100 nF); the correct part is GRM1885C1H101JA01D (100 pF). The assembled BOM value is correct; fix the schematic property fields.
- **DRC not run** — DRC was not run during PCB review. Run with `--severity-error --severity-warning` before committing to a production run.

**Next version (V2.10)**

- **Connector swap to M12 3-pin** — Replace J3's proprietary Raymarine-compatible THT footprint with an M12 A-code or B-code 3-pin male panel-mount socket (IP67, field-wireable). The Legacy Serial Protocol pin assignment (power / ground / signal) maps directly; no circuit changes required.
- **Front-end protection distance to J3** — D13, D14, and C49 sit 20–23 mm from J3 due to the large THT connector footprint. Review whether a revised connector footprint or rear-side placement could shorten the unprotected trace.
- **C30 dedicated bypass at U7 pin 6** — Currently 3.3 mm; add a dedicated 100 nF 0603 adjacent to pin 6 if bring-up shows high-speed switching issues.
- **Guard ring around U7 isolation gap** — Marine salt-spray increases ionic creepage risk on uncoated boards; add an unconnected guard trace if conformal coating is not specified.
- **D9 proximity to ST_SIG boundary** — Confirm D9 is within 5 mm of the isolation boundary; relocate closer for better transient suppression.
- **PCB creepage slot at U8 / U9** — The 1.4 mm copper-free gap meets IEC 60747-5-5; a milled PCB slot would increase creepage. Evaluate when CE marking or MED certification is pursued.
- **38400 baud TX support** — Requires further reduction of C48 to ≈ 220 pF (pulse too short for cable runs > 2–3 m) or a redesigned assist stage (constant-current source or firmware-adaptive baud-rate detection).

## References

1. Toshiba, [*TLP2309 High-Speed Logic Gate Opto-Isolator*](/assets/datasheets/mdd400-v2.9/TLP2309.pdf)
2. Nexperia, [*2N7002 N-Channel MOSFET*](https://assets.nexperia.com/documents/data-sheet/2N7002.pdf)
3. Nexperia, [*BC847BS NPN/NPN Dual Transistor*](https://assets.nexperia.com/documents/data-sheet/BC847BS.pdf)
4. Nexperia, [*BAT54J Schottky Diode*](/assets/datasheets/mdd400-v2.9/BAT54J.pdf)
5. Nexperia, [*PESD15VL1BA ESD Protection Diode*](/assets/datasheets/mdd400-v2.9/PESD15VL1BA.pdf)
6. AOS, [*AO3407A P-Channel MOSFET*](https://aosmd.com/res/data_sheets/AO3407A.pdf)
7. Diodes Inc., [*ZXTR2012FF 100 V LDO Regulator*](/assets/datasheets/mdd400-v2.9/ZXTR2012.pdf)
8. Diodes Inc., [*BZT52C15S Zener Diode*](https://www.diodes.com/assets/Datasheets/BZT52C.pdf)
9. onsemi, [*MMBTA56LT1G PNP Transistor*](https://www.onsemi.com/pdf/datasheet/mmbta56lt1g-d.pdf)
10. Littelfuse, [*SMCJ36CA Transient Voltage Suppressor*](/assets/datasheets/mdd400-v2.9/SMCJ36CA.pdf)
11. Littelfuse, [*V33MLA1206NH Varistor*](/assets/datasheets/mdd400-v2.9/V33MLA1206NH.pdf)
12. MSKSEMI, [*SS34-MS Schottky Diode*](/assets/datasheets/mdd400-v2.9/SS34.pdf)
13. Murata, [*BLM31KN601SN1L Ferrite Bead*](/assets/datasheets/mdd400-v2.9/BLM31KN601SN1L.pdf)
14. Murata, [*LQM18FN1R0M00D 1 µH Inductor*](/assets/datasheets/mdd400-v2.9/LQM18FN1R0M00D.pdf)
15. Yageo, [*AC1210JR-0747RL AEC-Q200 Thick-Film Resistor*](/assets/datasheets/mdd400-v2.9/AC1210JR-0747RL.pdf)
16. IPC, *IPC-2221 Generic Standard on Printed Board Design*, Table 6-1
17. Noland Engineering, [*Understanding and Implementing NMEA 0183 and RS422*](https://www.nolandeng.com/downloads/Interfaces.pdf)
18. Raymarine, [*SeaTalk Interface Overview*](https://web.archive.org/web/20090902021951/http://raymarine.custhelp.com/app/answers/detail/a_id/1016/~/seatalk-communications---overview)

## Related pages

- [CAN Transceiver](./can-transceiver.md) — the NMEA 2000 physical-layer interface and its connector-first protection chain
- [Power Supplies](./power-supplies.md) — the VCC / GNDREF digital domain that the opto-isolator outputs drive into
- [ESP32-S3 Module](./esp32-module.md) — the UART GPIO assignments behind `ST_RX`, `ST_TX`, and `ST_EN`
- [Pin Assignments](/mdd400/v2.9/quick-reference/pin-assignments) — the GPIO map for the legacy-serial signals
