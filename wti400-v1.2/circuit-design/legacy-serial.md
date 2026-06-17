---
title: Legacy Serial Interface
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/wti400-v1.2/legacy_serial_rx_6b651028.svg" alt="Legacy serial interface — full sheet" />

:::note[Hardware version]
WTI400 **v1.2** — In service — installed on test vessel
:::

:::warning[Correction — `ST_EN` is active-HIGH (bench-validated 2026-06-17)]
The statements below that describe `ST_EN` as **active-LOW are incorrect.** The fabricated WTI400
V1.2 board — verified against the kicad-cli netlist and confirmed on the bench — establishes:

- **`ST_EN` is active-HIGH:** drive the GPIO **HIGH to enable** the transmitter; **LOW or undriven
  disables** it.
- **R22 (100 kΩ) is a pull-DOWN from `ST_EN` to GNDREF** (not a pull-up), so the transmitter is
  default-disabled on reset, boot, and GPIO float. **R23 (390 Ω)** is the U8 enable-LED series
  resistor; driving `ST_EN` HIGH lights the U8 LED and asserts enable.

The active-LOW wording in *Transmit path → Enable isolator*, *Firmware integration*, and *Bench
validation* predates this board revision and is pending a full re-review of this page against the
V1.2 netlist. Validated on WTI400 V1.2 and MDD400 V2.9 with the `legacy_serial_troubleshooting/`
bench-test app.
:::

## Overview

The legacy serial interface provides a galvanically isolated single-wire serial connection designed for full electrical compatibility with Raymarine's Legacy Serial Protocol (e.g. SeaTalk™). It connects to legacy marine instruments via a 3-pin connector and exposes three MCU signals — `ST_RX`, `ST_TX` and `ST_EN` (for receive, transmit and transmit enable respectively), each crossing the isolation barrier via a TLP2309 opto-isolator. The circuit is drawn across the `legacy_serial_rx` and `legacy_serial_tx` KiCad sheets.

The primary application on the WTI400 is to place apparent wind data onto a Legacy Serial Protocol bus as a direct drop-in replacement for an ST60 wind instrument.

The interface is a single signal wire and is therefore half-duplex: it either receives or transmits, never both at once. Receive is NMEA 0183 listener compliant at 4800 and 38400 baud. The transmit path carries the Legacy Serial Protocol only; it is not NMEA 0183 compliant, and the firmware transmits SeaTalk only (see [NMEA 0183 caveats](#nmea-0183-caveats)).

**Sub-circuits:**
- [3-wire connector and bus modes](#3-wire-connector-and-bus-modes) — physical interface, Legacy Serial Protocol and NMEA 0183 wiring;
- [12 V power protection and regulation](#12-v-power-protection-and-regulation) — bus supply conditioning and LDO;
- [Receive path](#receive-path) — signal filtering and isolated receive opto; and
- [Transmit path](#transmit-path) — isolated transmit, enable gate, and open-drain line driver.

## Functional specification and design objectives

The legacy serial interface must:

- present a 3-pin connector that is pin-compatible with Raymarine's legacy plug and accepts standard Raymarine plugs or 1211 spade crimp connectors;
- operate as both a listener and a transmitter on a Legacy Serial Protocol bus at 4800 baud with 9-bit framing;
- maintain a galvanic isolation barrier between the legacy bus domain (VST / GND_ST) and the digital domain (VCC / GNDREF), with the opto-isolators as the only electrical link across the boundary;
- regulate the 12 V bus supply to a stable VST rail across the full NMEA 2000 bus-voltage range (9–16 V), holding sufficient opto LED drive current even in dropout;
- protect the bus entry against reverse polarity, fast transients, high-energy surges, ESD, and conducted HF EMI before any active device;
- hold the transmit line driver off by default — during MCU boot, reset, firmware fault, and any GPIO float condition — so the bus can only be driven by an explicit firmware action;
- accelerate the bus rising edge so long-cable installations meet the 4800 baud bit timing; and
- provide single-ended NMEA 0183 receive compatibility (listener compliance at 4800 / 38400 baud), with transmit restricted to the Legacy Serial Protocol (SeaTalk) and not NMEA 0183 compliant.

## 3-Wire Connector and Bus Modes

<SchematicViewer src="/img/schematics/wti400-v1.2/legacy_serial_rx_6b651028.svg" alt="Legacy serial — connector and bus modes" initialFocus="158.75 101.6 125.73 63.5" />

### How it works

J3 is a 3-pin through-hole connector with a custom footprint that is pin-compatible with Raymarine's legacy 3-pin connector. It accepts standard Raymarine plugs directly, or 1211 spade female crimp connectors.

| Pin | Colour | Signal | Function |
|-----|--------|--------|----------|
| 1 | RED | 12 V | Bus supply input — powers the on-board LDO (VST domain) |
| 2 | BLACK | GND | Isolated bus ground (GND_ST) |
| 3 | YELLOW | SIG | Single-wire signal line (ST_SIG) |

![Legacy serial 3-pin connector — pin 1 12 V (red), pin 2 GND (black), pin 3 SIG (yellow)](/img/wti400-v1.2/legacy_serial_pinout.svg)

#### Legacy Serial Protocol Mode

In Legacy Serial Protocol mode all three pins are used as supplied by the bus:

- pin 1 provides 12 V bus power;
- pin 2 is the bus ground reference; and
- pin 3 carries the single-wire, idle-HIGH, active-LOW serial signal at 4800 baud.

The WTI400 can both listen to and transmit on the bus. During transmit, Q6 (2N7002) pulls pin 3 LOW; during idle and receive, pin 3 is held HIGH by R33 (22 kΩ pull-up to VST). The protocol is half-duplex: the MCU must not transmit while another device is holding the bus LOW.

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
- **NMEA 0183 talker** — required; the TX line driver (Q6, VST pull-up R33) needs VST to assert the bus LOW. Connect a 9–16 V supply to pin 1.
:::

The receive circuit draws approximately 0.36 mA from the line at 2.0 V input, within the NMEA 0183 listener limit of 2.0 mA. The TLP2309 propagation delay (≤ 1 µs) and signal filter cut-off (723 kHz) both support NMEA 0183 at 4800 baud and at 38400 baud (high-speed).

#### NMEA 0183 Caveats

**Single wire — receive or transmit, never both.** The interface is one signal wire and is half-duplex; it either listens or talks, never simultaneously. NMEA 0183 assumes separate talker and listener lines, so this single wire cannot act as a standard bidirectional NMEA 0183 node, and NMEA 0183 is supported as a listener (receive) only.

**Receive (listener) — compatible.** The receive circuit meets the NMEA 0183 listener electrical specification at 4800 baud and 38400 baud. The connection is single-ended (TALK-A referenced to GND_ST); it is not a true RS-422 differential receiver. In installations with a shared, low-impedance ground between the WTI400 and the NMEA 0183 talker, this is functionally equivalent. In installations with floating or noisy grounds, common-mode noise rejection will be lower than a proper RS-422 differential front-end.

**Transmit (talker) — not RS-422 compliant.** The TX output is a single-wire open-drain signal: pin 3 is pulled to GND_ST (≈ 0 V) by Q6 during a logic 0, and pulled to VST (≈ 12 V) by R33 during idle and logic 1. Standard RS-422 NMEA 0183 talkers produce a differential signal of ≥ ±2 V between TALK-A and TALK-B. When this circuit's output is connected to a strict RS-422 receiver (TALK-A = pin 3, TALK-B = GND_ST), the logic 0 state produces a differential of ≈ 0 V — outside the RS-422 mark/space threshold — and the receiver will not detect it correctly.

The transmit path is not NMEA 0183 compliant. The single-ended open-drain output can drive some non-standard NMEA 0183 inputs that accept single-ended 12 V logic (for example older Garmin, B&G, and Furuno equipment, and chartplotters with TTL-level NMEA 0183 inputs), but this is not a supported mode; confirm the receiver's input specification before relying on it. In normal operation the firmware transmits on the Legacy Serial Protocol (SeaTalk) only.

The TX circuit is optimised for 4800 baud (Legacy Serial Protocol). At 9600 baud the rise-time assist operates at reduced effectiveness (see [Rise-Time Assist](#rise-time-assist--q8-mmbta56lt1g-c47-r71)); 38400 baud is not supported.

## 12 V Power Protection and Regulation

<SchematicViewer src="/img/schematics/wti400-v1.2/legacy_serial_rx_6b651028.svg" alt="Legacy Serial RX — connector and filter section" initialFocus="12.7 101.6 146.05 95.25" />

### How it works

The 12 V bus supply on J3 pin 1 passes through a six-stage protection chain before reaching the LDO regulator.

#### Inrush and surge limiting

R69, a 47 Ω AEC-Q200 thick-film resistor in a 1210 package (500 mW continuous rating), is the first element in the chain. Its position before all clamp devices ensures that peak transient current into the downstream components is limited before reverse-polarity protection or clamping take effect.

#### Reverse-polarity protection

D13 (SS34 Schottky, 40 V / 3 A, SMA) blocks inverted bus connections. Its 0.45 V forward drop is included in all VST voltage and current calculations.

#### Transient suppression

D15 (SMCJ36CA bidirectional TVS, DO-214AB) provides fast transient clamping, responding in nanoseconds. The clamping voltage at peak pulse current is approximately 58 V. M2 (V33MLA1206NH MOV varistor) supplements the TVS for slow, high-energy surges that exceed D15's pulse power rating; its clamp voltage is approximately 75 V.

#### EMI attenuation

FB3 (BLM31KN601SN1L ferrite bead, 600 Ω at 100 MHz, DCR 80 mΩ) attenuates conducted high-frequency EMI on the LDO_VIN rail after the clamp devices.

#### Bulk capacitance

C58 (1 µF / 100 V / X7R, 1206) provides reservoir energy at the LDO input. C54 (10 µF / 25 V / X7R, 0805) and C53 (100 nF / 50 V / X7R, 0603) decouple the LDO output rail (VST).

#### LDO regulation — U14 (ZXTR2012FF)

U14 is a 100 V-input, 12 V / 30 mA linear regulator in SOT-23F. It generates VST — the stable 12 V supply for the opto-isolator LED drive circuit and the bus pull-up. The ZXTR2012FF is specified to regulate at 12 V with a dropout voltage of approximately 0.9 V, giving a regulation threshold of V_bus ≈ 12.9 V.

Below 12.9 V (down to the NMEA 2000 minimum of 9 V), U14 operates in dropout and VST tracks approximately V_bus − 0.9 V. This ensures sufficient LED forward current across the full NMEA 2000 bus voltage range (see [Design Calculations](#design-calculations)).

The VST rail is not MCU-controlled. It is live whenever the Legacy Serial Protocol bus supplies power on J3 pin 1. The VST domain (GND_ST) is electrically isolated from GNDREF (digital ground) — there is no DC or capacitive path between the two domains on the PCB. The opto-isolators are the only electrical link across the boundary.

## Receive Path

<SchematicViewer src="/img/schematics/wti400-v1.2/legacy_serial_rx_6b651028.svg" alt="Legacy Serial RX — receive buffer section" initialFocus="12.7 12.7 146.05 88.9" />

### How it works

The signal on J3 pin 3 (ST_SIG) passes through a two-stage RF filter and ESD clamp before reaching the TLP2309 opto-isolator.

#### Signal filtering and ESD

C49 (100 pF / 50 V / C0G, 0603) shunts high-frequency noise on ST_SIG to GND_ST close to J3. D14 (PESD15VL1BA, SOD-323) clamps electrostatic discharge events on ST_SIG to GND_ST; its standoff voltage is 15 V. L6 (1 µH, 0603) in series with C50 (100 pF / 50 V / C0G, 0603) forms a second LC filter stage, with a resonant frequency of 15.9 MHz and an effective −3 dB (R30 × C50) of 723 kHz.

#### Opto drive — D6, R29, R30

R29 (22 kΩ from VST) is the bus pull-up, holding ST_SIG HIGH during idle and defining the open-collector drive level. D6 (BAT54J Schottky, SOD-323F) is in series between VST and the TLP2309 LED drive path; it is reverse-biased when the bus is idle (both its anode and cathode at VST) and conducts only when the bus is pulled LOW. This prevents the LED drive current from loading the bus continuously. R30 (2.2 kΩ) limits the LED forward current.

When a bus device or NMEA 0183 talker asserts a LOW on ST_SIG:

```
I_LED = (VST − V_D6_F − V_LED_F) / R30
      = (12.0 V − 0.45 V − 1.20 V) / 2200 Ω ≈ 4.70 mA (at VST = 12 V)
```

At the NMEA 2000 minimum bus voltage of 9 V, VST drops to approximately 8.1 V (U14 in dropout), giving I_LED ≈ 2.93 mA — above the TLP2309 I_F(ON) minimum.

#### Isolation — U6 (TLP2309)

U6 is a Toshiba TLP2309 logic-gate opto-isolator (SO-6, 3750 Vrms isolation voltage, ±15 kV/µs common-mode transient immunity). The LED input side operates in the VST / GND_ST (legacy) domain; the output side is in the VCC (3.3 V) / GNDREF (digital) domain.

The TLP2309 has inverter logic (LED ON → output LOW). In the circuit, bus LOW drives the LED ON, which pulls the output LOW. The result is non-inverting from the bus perspective:

| ST_SIG (bus) | U6 LED | ST_RX (MCU) |
|---|---|---|
| HIGH (idle) | OFF | HIGH |
| LOW (active) | ON | LOW |

R19 (2.2 kΩ, VCC to U6 output) is the output pull-up. C23 (100 nF) is the VCC bypass at the output side of U6.

## Transmit Path

<SchematicViewer src="/img/schematics/wti400-v1.2/legacy_serial_tx_7e83f909.svg" alt="Legacy Serial TX schematic" initialFocus="12.7 12.7 138.43 177.8" />

### How it works

The TX circuit has four functional stages: an enable opto-isolator (U8) that gates the transmitter by default, a TX opto-isolator (U7) that transfers the UART data signal across the isolation barrier, a two-transistor push-pull gate driver (Q4, Q7) with a PMOS high-side switch (Q5) that drives the NMOS line driver (Q6), and a rise-time assist stage (Q8) that accelerates bus rising edges.

#### Enable isolator — U8 (TLP2309), default-disable

U8 is a TLP2309 opto-isolator that transfers the `ST_EN` signal across the isolation barrier with inverted, default-disable logic.

The MCU side of U8 has R23 (390 Ω) in series with the LED. When `ST_EN` is undriven or HIGH, no LED current flows and the transmitter is disabled. When the MCU drives `ST_EN` LOW, current flows through R23 into the U8 LED, asserting the EN signal on the legacy side.

This arrangement ensures the TX line driver is off during MCU boot, reset, any firmware fault, and any GPIO float condition. The transmitter can only be enabled by an explicit firmware action.

#### TX isolator — U7 (TLP2309)

U7 transfers `ST_TX` across the isolation barrier. The input side has a 10 kΩ pull-up (R20) from VCC to the LED anode and a 390 Ω series resistor (R21). The LED is off when `ST_TX` is HIGH (bus idle); when the MCU drives `ST_TX` LOW, the LED conducts at approximately 5.6 mA. The output side has a 100 kΩ pull-up (R22) from VST, producing a buffered replica of the bus signal on the legacy domain side.

#### Gate driver — Q4, Q7 (BC847BS), Q5 (AO3407A), Q6 (2N7002)

The gate driver takes the U7 output and drives Q6 (2N7002, 60 V / 300 mA N-channel MOSFET), the open-drain line driver.

Q4 and Q7 are two transistors from a BC847BS dual NPN pair (SOT363), forming a push-pull pre-driver. Q5 (AO3407A P-channel MOSFET, 30 V / 4.2 A) is the high-side element of the gate driver chain; D12 (BAT54S dual Schottky) clamps gate nodes against transient overvoltage.

When the bus is idle (`ST_TX` HIGH): U7 output is HIGH, Q6 gate is pulled LOW, Q6 is off, and ST_SIG floats HIGH through R33 (22 kΩ to VST).

When the MCU transmits a logic 0 (`ST_TX` LOW): U7 output goes LOW, the gate driver asserts Q6 gate HIGH through R67 (390 Ω gate resistor), Q6 conducts, and ST_SIG is pulled to GND_ST. Q6 R_DS(on) ≈ 2.8–5 Ω produces a bus LOW voltage of &lt; 10 mV at pull-up current levels — negligible.

D8 (BZT52C15S, 15 V zener, SOD-323) clamps ST_SIG against positive transients. The 3 V headroom above VST = 12 V ensures D8 does not conduct under normal operating conditions.

#### Rise-time assist — Q8 (MMBTA56LT1G), C47, R71

When Q6 turns off, the bus rising edge is initially slow because R33 (22 kΩ) charges the cable capacitance passively. For a typical Legacy Serial Protocol installation with 10 m of cable (≈ 1 nF), the passive RC time constant is 22 kΩ × 1 nF = 22 µs — marginal against a 208 µs bit period. For longer cable runs (up to 80 m, ≈ 8 nF), the passive RC exceeds 176 µs, which is too slow for reliable reception.

Q8 (MMBTA56LT1G PNP) provides a brief high-side current pulse into ST_SIG via an AC-coupled path. C47 (2.2 nF C0G) and R71 (12 kΩ) set the pulse duration. Q8 turns on at the start of each LOW-to-HIGH transition and sources current from VST through R57 (10 Ω) into ST_SIG. Q8 turns off once C47 has charged through R71.

The cable charges to VST via Q8 and R57 (10 Ω): for an 8 nF cable, τ_charge = 10 Ω × 8 nF = 80 ns. The cable reaches full voltage well within one assist pulse. The assist pulse duration τ_assist = C47 × R71 = 2.2 nF × 12 kΩ = **26.4 µs**.

| Baud rate | Bit period | τ_assist / bit period | Rise-time assist effectiveness |
|---|---|---|---|
| 4800 baud (Legacy Serial Protocol) | 208 µs | 12.7 % | Effective — fully discharges between transitions |
| 9600 baud | 104 µs | 25.4 % | Marginal — C47 partially discharged at next transition |
| 38400 baud (NMEA 0183 HS) | 26 µs | ~100 % | Ineffective — C47 cannot discharge between bits |

:::caution[Rise-time assist — recommended rework for V1.2]
**Recommendation: change C47 from 2.2 nF to 820 pF.** With R71 = 12 kΩ unchanged, this gives τ_assist = 9.8 µs.

- At 4800 baud: τ_assist / T = 4.7 % — fully effective; cable (8 nF) charges in ≈ 80 ns, well within the 9.8 µs pulse. No degradation for Legacy Serial Protocol long-cable installations.
- At 9600 baud: τ_assist / T = 9.4 % — effective. The 9.8 µs assist pulse fully discharges before the next bit.

This is a component value change only. C47 is a 0603 C0G capacitor; the footprint is unchanged. The change is achievable by reworking existing V1.2 boards and updating the schematic BOM. Update the schematic value for C47 to 820 pF and fit the correct value on all assembled units.

38400 baud (NMEA 0183 HS) TX remains unsupported with either C47 value. Supporting 38400 baud would require further reduction of C47 to ≈ 220 pF, which would reduce the assist pulse to 2.6 µs — insufficient to reliably charge cable lengths beyond 2–3 m. A redesign of the assist stage (e.g. a constant-current source or firmware-adaptive baud rate detection) would be required for robust HS NMEA 0183 TX support.
:::

#### Feedback current-limiting loop — Q7 (BC847BS TR2)

The second transistor of the Q7 BC847BS package monitors current through Q6. When Q6 sinks significant drain current, the voltage across R57 rises and turns on Q7 TR2, which steals base drive from the push-pull stage, limiting Q6 gate voltage and preventing excessive drain current. This protects the gate driver chain during output shorts or bus faults.

## Firmware notes

### Power domain

The VST rail is not MCU-controlled. It is live whenever the Legacy Serial Protocol bus supplies power on J3 pin 1, independent of any MCU action.

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
| `ST_EN` | Output | LOW | Drive LOW to enable TX. Leave HIGH (or undriven) to disable. Pull-up on MCU side ensures TX disabled on reset. |
| `ST_TX` | Output | — | UART TX signal. HIGH = bus idle; LOW = bus asserted. Same polarity as standard UART TX — connect directly to UART TX peripheral, no inversion needed. |

**Transmit sequence:**
1. Monitor `ST_RX`; wait for bus idle (HIGH for ≥ 1 bit period).
2. Drive `ST_EN` LOW to enable the TX path.
3. Transmit via `ST_TX` using the UART peripheral at 4800 baud, 8E1 (Legacy Serial Protocol) or 8N1 (NMEA 0183).
4. After the last stop bit, return `ST_EN` HIGH to tri-state the line driver.
5. Resume monitoring `ST_RX`.

**Collision detection:** while transmitting, compare `ST_RX` against the expected `ST_TX` state. If `ST_RX` is LOW when `ST_TX` is HIGH, another device is driving the bus simultaneously. Abort transmission, release `ST_EN`, and implement a random back-off before retrying (consistent with Legacy Serial Protocol bus arbitration practice).

## Design Calculations

<details>
<summary>VST and I_LED across NMEA 2000 bus voltage range</summary>

U14 ZXTR2012FF regulates at 12 V when V_IN > 12.9 V (after 0.45 V across D13 and ≈ 0.24 V across R69 at 5 mA). Below this threshold, VST ≈ V_bus − 0.9 V.

| V_bus | VST | I_LED | Notes |
|-------|-----|-------|-------|
| 16 V (max) | 12.0 V | 4.5 mA | Regulated |
| 12 V (nom) | 11.1 V | 4.1 mA | Dropout |
| 9 V (min) | 8.1 V | 2.3 mA | Dropout; above TLP2309 I_F(ON) ≥ 10 mA recommended but functional |

I_LED = (VST − V_D6_F − V_LED_F) / R30; V_D6_F = 0.45 V; V_LED_F = 1.20 V (typ); R30 = 2.2 kΩ.

U14 thermal at V_bus = 16 V, I_VST ≈ 5.4 mA: P_D = (15.31 − 12.0) × 5.4 mA = 18 mW. At 95 °C/W (SOT-23F), ΔT_j &lt; 2 °C.

</details>

<details>
<summary>Signal filter</summary>

| Parameter | Value |
|-----------|-------|
| LC resonant frequency (L6 × C50) | 1 / (2π√(1 µH × 100 pF)) = **15.9 MHz** |
| Effective −3 dB (R30 × C50 dominated) | 1 / (2π × 2200 × 100 pF) = **723 kHz** |
| Legacy Serial Protocol signal content | ≤ 50 kHz (4800 baud) |
| NMEA 0183 HS signal content | ≤ 400 kHz (38400 baud) |
| Filter margin above signal band (4800 baud) | > 14× |

</details>

<details>
<summary>Protection chain</summary>

| Threat | Component | Characteristic |
|--------|-----------|----------------|
| Reverse polarity | D13 SS34 | V_F = 0.45 V forward; blocks reverse current |
| Fast transient / ISO 7637-2 | D15 SMCJ36CA | V_BR = 40 V min; V_C = 58.1 V at I_PP = 43.5 A |
| High-energy surge | M2 V33MLA1206NH | V_clamp ≈ 75 V; max energy 0.6 J |
| Conducted HF EMI | FB3 BLM31KN601SN1L | 600 Ω @ 100 MHz; DCR = 80 mΩ |
| Signal ESD | D14 PESD15VL1BA | V_BR = 15 V; V_clamp ≈ 17 V at 1 A |

</details>

<details>
<summary>Rise-time assist</summary>

Current values (C47 = 2.2 nF, R71 = 12 kΩ):

| Parameter | Value |
|-----------|-------|
| τ_assist (C47 × R71) | 2.2 nF × 12 kΩ = **26.4 µs** |
| τ_cable (R57 × C_cable, 10 m run) | 10 Ω × 1 nF = **10 ns** |
| τ_cable (R57 × C_cable, 80 m run) | 10 Ω × 8 nF = **80 ns** |
| τ_assist / bit period @ 4800 baud | 26.4 µs / 208 µs = **12.7 %** |
| τ_assist / bit period @ 9600 baud | 26.4 µs / 104 µs = **25.4 %** |

Recommended rework values (C47 = 820 pF, R71 = 12 kΩ unchanged):

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
| U7 / U8 LED current | (VCC − V_LED_F) / R_series = (3.3 − 1.1) / 390 Ω | **5.6 mA** — well above the TLP2309 1 mA minimum I_F for the CTR spec; opto saturates reliably |
| Q6 V_DS(on) at pull-up current | 12 V / 22 kΩ × 2.8 Ω R_DS(on) | **&lt; 1.5 mV** — negligible bus LOW voltage |

</details>

<details>
<summary>Isolation</summary>

| Parameter | Requirement | As built |
|-----------|-------------|----------|
| TLP2309 isolation voltage (U6, U7, U8) | — | **3750 Vrms** (Toshiba TLP2309 datasheet, section 7) |
| Common-mode transient immunity | — | ±15 kV/µs (min) |
| PCB copper-free gap (U6) | ≥ 0.8 mm (IPC-2221 Class B) | **1.4 mm** (F.Cu and In1.Cu confirmed) |
| PCB copper-free gap (U7/U8) | ≥ 0.8 mm | **1.4 mm** |

</details>

<details>
<summary>NMEA 0183 listener compliance (receive)</summary>

| Parameter | NMEA 0183 limit | As built |
|-----------|----------------|---------|
| Minimum input differential for detection | 200 mV | Opto threshold well below 2.0 V ✓ |
| Maximum input load current at 2.0 V | 2.0 mA | **0.36 mA** ✓ |
| Maximum baud rate (TLP2309 switching) | — | 1 Mbit/s (far above 38400 baud) ✓ |

Input load at 2.0 V: I = (2.0 V − V_LED_F) / R30 = (2.0 − 1.20) / 2200 = **0.36 mA** (D6 isolated from load path when bus voltage is below VST; load is from R30 and LED series path only).

</details>

## PCB Layout

Both the receive and transmit sub-circuits sit on the right-hand side of the 95.2 × 95.2 mm four-layer board, downstream of J3 at (140.0, 97.0). All circuit components are on F.Cu. The defining feature of the layout is a horizontal isolation boundary that separates the legacy bus domain (GND_ST / VST) from the digital domain (GNDREF / VCC).

### Isolation boundary

The isolation boundary runs horizontally across the PCB. A 1.4 mm copper-free zone passes through the bodies of U6, U7, and U8 on both F.Cu and In1.Cu — the GNDREF zone stops at Y = 78.8 and the GND_ST zone starts at Y = 80.2. No copper fill, trace, or via crosses this zone on any layer. B.Cu carries GNDREF only on the digital side; GND_ST is confined to F.Cu and In1.Cu on the legacy side.

| Requirement | Status | Evidence |
|-------------|--------|---------|
| U6 straddles GND_ST/GNDREF boundary; 1.4 mm gap | ✅ Met | LED-side pads (1, 3) at Y = 76.35 (GNDREF side); output pads (4, 5, 6) at Y = 82.85 (GND_ST side) |
| U7/U8 co-linear; 1.4 mm gap; no shared vias | ✅ Met | U7 and U8 at Y = 79.6, 6.5 mm apart; GNDREF vias at Y = 78.5; GND_ST vias at Y = 80.5 |
| Isolation gap ≥ 0.4 mm (IEC 60747-5-5) | ✅ Met | 1.4 mm zone-to-zone; via edge-to-edge clearance 1.4 mm — 3.5× margin |
| GND_ST and GNDREF zones do not share vias | ✅ Met | Confirmed on F.Cu and In1.Cu |
| No fill or trace crosses isolation gap on any layer | ✅ Met | Verified on all layers |

No milled PCB creepage slot is present; isolation relies on the 1.4 mm copper-free zone plus the TLP2309 SO-6 package body, which satisfies the rated clearance for the 12 V bus.

### Component placement — receive side

| Requirement | Status | Evidence |
|-------------|--------|---------|
| R69 / D13 / D15 / M2 power protection close to J3 | ⚠️ Partial | R69 14.5 mm (closest power-chain part), M2 14.2 mm, D13 20.6 mm; J3 THT body clearance limits proximity; cluster order correct |
| R29 / D6 / R30 close to U6 LED input | ✅ Met | R29 4.0 mm, R30 5.1 mm, D6 7.2 mm from U6 centroid |
| D14 (ESD) and C49 (RF bypass) near J3 on ST_SIG | ⚠️ Partial | D14 22.8 mm, C49 21.4 mm from J3; THT clearance prevents closer placement; chain order correct |
| C58 (1 µF LDO input bypass) ≤ 2 mm from U14 VIN | ⚠️ Not met | 7.70 mm pad-to-pin; validate under transient load at bring-up |
| C54 (10 µF VST output) ≤ 2 mm from U14 VOUT | ⚠️ Not met | 5.46 mm pad-to-pin; validate under transient load at bring-up |
| C53 (100 nF HF bypass) ≤ 2 mm from U14 VOUT | ⚠️ Not met | 6.92 mm pad-to-pin; validate under transient load at bring-up |
| C23 (VCC bypass) ≤ 2 mm from U6 VCC pin | ⚠️ Not met | 9.4 mm; add dedicated bypass at U6 pin 6 in V2.0 |

The protection chain is laid out connector-first as **J3 → R69 → D13/D15/M2 (shared anode node) → FB3 → C58 → U14 → C54/C53 → VST**. R69 is electrically first, limiting surge current before the clamp devices; D13 then provides reverse-polarity blocking and D15/M2 clamp the shared node to GND_ST.

### Component placement — transmit side

| Requirement | Status | Evidence |
|-------------|--------|---------|
| C30 (100 nF VST bypass) adjacent to U7 | ⚠️ Partial | 4.0 mm from U7, 4.4 mm from U8; serves both optos; no dedicated U7 VCC bypass |
| C31 (100 nF VCC bypass) adjacent to U8 | ✅ Met | 4.0 mm from U8 (9.9 mm to U7) |
| Q4 / Q5 / Q6 / Q7 / D12 gate driver cluster compact | ✅ Met | 3.5 × 10.8 mm cluster; Q6–Q7 3.4 mm; bias resistors within 3.3 mm |
| C47 / R71 / R68 rise-time assist cluster close to Q8 | ✅ Met | C47 5.5 mm, R71 4.3 mm, R68 1.6 mm from Q8 |
| D8 (zener clamp) close to ST_SIG isolation via | ⚠️ Partial | 10.7 mm from via at (148.0, 86.75); functional at 4800 baud; relocate in V2.0 |
| R57 (10 Ω series) in output path near Q6 | ✅ Met | 4.2 mm from Q6, in the driver column |

### Signal routing

ST_SIG exits the opto output cluster at (148.0, 86.75), crosses to B.Cu via a via at that location, runs 17.3 mm south on B.Cu, then returns to F.Cu at Q6's drain area. This B.Cu segment keeps ST_SIG out of the dense F.Cu component area without violating the isolation zone. VST supply traces are 0.6 mm wide on both F.Cu and B.Cu; all signal traces are 0.2 mm. NET-side stitching-via rows at Y = 78.5 (GNDREF) and Y = 80.5 (GND_ST) reinforce the zone edges immediately above and below the opto row.

The minimum 0.5 mm trace width on the surge-carrying LDO_VIN entry segment (R69 output through the D13/D15/M2 cluster) could not be confirmed from text-level PCB data and must be verified by Gerber or DRC review.

## Components

| Ref | Value | Description | Datasheet |
|-----|-------|-------------|-----------|
| J3 | CON-THT-SEATALK-0292 | Custom 3-pin THT, pin-compatible with Raymarine's legacy 3-pin connector; accepts Raymarine plugs or 1211 spade crimp connectors | — |
| D13 | SS34 | MSKSEMI SS34 Schottky, SMA, 40 V / 3 A — reverse-polarity protection | [SS34](https://www.lcsc.com/datasheet/lcsc_datasheet_2310100931_MSKSEMI-SS34-MS_C2836396.pdf) |
| R69 | 47 Ω / 1210 / 500 mW | Yageo AC1210JR-0747RL, AEC-Q200 thick-film — pulse-damping resistor at LDO_VIN entry | [AC1210JR-0747RL](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-AC_Group_52_RoHS_L_12.pdf) |
| D15 | SMCJ36CA | Littelfuse SMCJ36CA bidirectional TVS, DO-214AB — fast transient suppression, V_clamp ≈ 58 V | [SMCJ36CA](https://www.littelfuse.com/assetdocs/smcj.pdf) |
| M2 | V33MLA1206NH | Littelfuse V33MLA1206NH MOV varistor, 1206 — high-energy surge absorption, V_clamp ≈ 75 V | [V33MLA1206NH](/assets/datasheets/wti400-v1.2/V33MLA1206NH.pdf) |
| FB3 | BLM31KN601SN1L | Murata BLM31KN601SN1L ferrite bead, 600 Ω @ 100 MHz — conducted HF EMI attenuation | [BLM31KN601SN1L](https://www.murata.com/en-us/api/pdfdownloadapi?cate=&partno=BLM31KN601SN1L) |
| C58 | 1 µF / 100 V / 1206 / X7R | Murata GRM31CR72A105KA01K — bulk input decoupling, LDO_VIN | [GRM31CR72A105KA01K](/assets/datasheets/wti400-v1.2/GRM31CR72A105KA01K.pdf) |
| U14 | ZXTR2012FF | Diodes Inc. ZXTR2012FF, SOT-23F, 100 V input / 12 V / 30 mA LDO — generates VST from LDO_VIN | [ZXTR2012FF](/assets/datasheets/wti400-v1.2/ZXTR2012FF.pdf) |
| C54 | 10 µF / 25 V / 0805 / X7R | Murata GRM21BZ71E106KE15L — bulk output reservoir, VST rail | [GRM21BZ71E106KE15L](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |
| C53 | 100 nF / 50 V / 0603 / X7R | Murata GRM188R71H104KA93D — HF bypass, VST rail | [GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D) |
| R29 | 22 kΩ / 0603 | Yageo RC Series, ±1% — bus pull-up from VST to ST_SIG | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| D6 | BAT54J | Nexperia BAT54J Schottky, SOD-323F — blocks VST pull-up from loading bus during idle | [BAT54J](/assets/datasheets/wti400-v1.2/BAT54J.pdf) |
| C49 | 100 pF / 50 V / 0603 / C0G | Murata GRM1885C1H101JA01D — RF bypass on ST_SIG at J3 | [GRM1885C1H101JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D) |
| D14 | PESD15VL1BA | Nexperia PESD15VL1BA ESD TVS, SOD-323 — clamps ESD events on ST_SIG | [PESD15VL1BA](/assets/datasheets/wti400-v1.2/PESD15VL1BA.pdf) |
| L6 | 1 µH / 0603 | Murata LQM18FN1R0M00D — series inductor, LC filter on ST_SIG | [LQM18FN1R0M00D](https://www.murata.com/en-us/api/pdfdownloadapi?cate=&partno=LQM18FN1R0M00D) |
| C50 | 100 pF / 50 V / 0603 / C0G | Murata GRM1885C1H101JA01D — shunt cap, LC filter on ST_SIG | [GRM1885C1H101JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D) |
| R30 | 2.2 kΩ / 0603 | Yageo RC Series, ±1% — LED current-limiting resistor, RX opto input | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| U6 | TLP2309 | Toshiba TLP2309, SO-6, 3750 Vrms — RX galvanic isolation opto | [TLP2309](/assets/datasheets/wti400-v1.2/TLP2309.pdf) |
| R19 | 2.2 kΩ / 0603 | Yageo RC Series, ±1% — pull-up from VCC to U6 output; defines ST_RX HIGH level | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C23 | 100 nF / 50 V / 0603 | VCC bypass at U6 output side | — |
| U7 | TLP2309 | Toshiba TLP2309, SO-6, 3750 Vrms — TX signal isolator (digital → legacy) | [TLP2309](/assets/datasheets/wti400-v1.2/TLP2309.pdf) |
| U8 | TLP2309 | Toshiba TLP2309, SO-6, 3750 Vrms — TX enable isolator (default-disable) | [TLP2309](/assets/datasheets/wti400-v1.2/TLP2309.pdf) |
| R20 | 10 kΩ / 0603 | Yageo RC Series — ST_TX pull-up to VCC; holds LED off at default | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R21, R23 | 390 Ω / 0603 | Yageo RC Series — LED current-limiting (R21 = U7 TX; R23 = U8 EN) | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R22 | 100 kΩ / 0603 | Yageo RC Series — U7 TX opto output pull-up to VST | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R32 | 390 Ω / 0603 | Yageo RC Series — U8 EN opto secondary bias | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R33 | 22 kΩ / 0603 | Yageo RC Series — ST_SIG pull-up to VST; sets bus idle-HIGH | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R34 | 100 kΩ / 0603 | Yageo RC Series — EN opto output pull-down on legacy side | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R35 | 56 kΩ / 0603 | Yageo RC Series — gate driver bias | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R36, R38 | 1 MΩ / 0603 | Yageo RC Series — high-impedance bias, driver chain | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R37 | 30.9 kΩ / 0603 | Yageo RC Series — gate driver bias | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R44 | 22 kΩ / 0603 | Yageo RC Series — base/gate pull-down | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R45, R46, R68 | 39 kΩ / 0603 | Yageo RC Series — timing / bias network | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R56, R70 | 2.2 kΩ / 0603 | Yageo RC Series — output and legacy-side base resistors | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R57 | 10 Ω / 0603 | Yageo RC0603FR-0710RL — series resistor, Q8 rise-time assist output | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R66 | 1 kΩ / 0603 | Yageo RC0603FR-071KL, thick-film, ±1% — driver chain bias (KiCAD symbol incorrectly shows RT-series thin-film; RC-series is correct and matches BOM) | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R67 | 390 Ω / 0603 | Yageo RC Series — Q6 gate drive resistor | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R71 | 12 kΩ / 0603 | Yageo RC Series — C47 discharge path, rise-time assist RC | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R73 | 10 kΩ / 0603 | Yageo RC Series — feedback current-limit bias | [RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C30 | 100 nF / 50 V / 0603 / X7R | Murata GCM188R71H104KA57D — VST bypass at U7 | [GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C31 | 100 nF / 50 V / 0603 / X7R | Murata GCM188R71H104KA57D — VCC bypass at U8 | [GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C47 | **820 pF** / 50 V / 0603 / C0G | Murata GRM1885C1H821JA01D (or equivalent) — rise-time assist timing capacitor (**updated from 2.2 nF; rework required**) | — |
| Q4, Q7 | BC847BS | Nexperia BC847BS NPN dual, SOT363 — gate driver push-pull pre-driver (both units used) | [BC847BS](/assets/datasheets/wti400-v1.2/BC847BS.pdf) |
| Q5 | AO3407A | AOS AO3407A P-channel MOSFET, SOT-23, 30 V / 4.2 A — high-side gate driver | [AO3407A](/assets/datasheets/wti400-v1.2/AO3407A.pdf) |
| Q6 | 2N7002 | Nexperia 2N7002 N-channel MOSFET, SOT-23, 60 V / 300 mA — open-drain line driver | [2N7002](/assets/datasheets/wti400-v1.2/2N7002.pdf) |
| Q8 | MMBTA56LT1G | onsemi MMBTA56LT1G PNP, SOT-23, 80 V / 500 mA — rise-time assist high-side source | [MMBTA56LT1G](/assets/datasheets/wti400-v1.2/MMBTA56LT1G.pdf) |
| D8 | BZT52C15S | Diodes Inc. BZT52C15S 15 V zener, SOD-323 — ST_SIG line clamp | [BZT52C15S](/assets/datasheets/wti400-v1.2/BZT52C15S.pdf) |
| D12 | BAT54S | Nexperia BAT54S dual series Schottky, SOT-23, 30 V — gate circuit protection | [BAT54S](https://assets.nexperia.com/documents/data-sheet/BAT54_SER.pdf) |

## Testing & Verification

:::caution

The V1.2 prototype on the test vessel uses the legacy serial interface as a Legacy Serial Protocol drop-in replacement for an ST60 wind instrument, transmitting apparent wind data onto the Legacy Serial Protocol bus at 4800 baud. RX and TX have been exercised across approximately 1,000 sea miles of in-service use. **The C47 rise-time-assist capacitor on V1.2 prototypes is the original 2.2 nF value &mdash; a rework to 820 pF is required.** No quantitative bench measurements have been performed on isolation behaviour, NMEA 0183 listener compliance, U14 thermal at the top of the bus-voltage range, D8 leakage at 16 V, surge survivability, or rise-time-assist effectiveness at 4800 / 9600 baud after the rework. The following are required.

**Hardware bring-up (rig at the bench, after C47 rework to 820 pF):**

Power:
- **Nominal supply** &mdash; Apply 12 V to J3 pin 1 with pin 2 to GND. Pass if VST = 12.0 &plusmn; 0.5 V.
- **Dropout** &mdash; Apply 9 V to J3 pin 1. Pass if VST &asymp; 8.1 V (dropout) and ST_RX still responds to bus signal with LED current &ge; 2.9 mA.
- **Top of range** &mdash; Apply 16 V to J3 pin 1. Pass if VST regulates at 12.0 &plusmn; 0.5 V and U14 junction &Delta;T &lt; 2 &deg;C.
- **Reverse polarity** &mdash; Apply &minus;12 V on pin 1, GND on pin 2. Pass if VST = 0 V and no component failure.
- **Swapped pins** &mdash; Apply 12 V with pin 1 and pin 2 swapped. Pass if VST = 0 V and no component failure.

Receive:
- **Bus idle** &mdash; Pass if ST_RX &asymp; VCC (&ge; 2.9 V).
- **Bus pulled low** &mdash; Pull J3 pin 3 to GND via 1 k&Omega;. Pass if ST_RX &le; 0.4 V.
- **4800 baud framing** &mdash; Apply 4800 baud test pattern on J3 pin 3. Pass if framing is captured cleanly on UART RX with no framing errors.
- **38400 baud framing** &mdash; Apply NMEA 0183 HS pattern at 38400 baud. Pass if framing is captured cleanly.
- **NMEA 0183 listener load** &mdash; Measure input current at J3 pin 3 = 2.0 V. Pass if &le; 2.0 mA.
- **Dropout LED current** &mdash; Measure VST and I_LED at V_bus = 9 V. Pass if I_LED &ge; 2.0 mA and no missed transitions.

Transmit:
- **Default-disabled** &mdash; Assert ST_EN HIGH (or leave undriven), measure ST_SIG. Pass if ST_SIG = VST (&asymp; 12 V via R33).
- **Enable, idle** &mdash; Assert ST_EN LOW, ST_TX HIGH. Pass if ST_SIG = VST and Q6 not conducting.
- **Enable, asserted** &mdash; Assert ST_EN LOW, ST_TX LOW. Pass if ST_SIG &lt; 50 mV.
- **Rise time at 4800 baud** &mdash; Toggle ST_TX at 4800 baud and scope the rising edge at ST_SIG. Pass if edge reaches &ge; 80 % of VST within 50 &micro;s.
- **Rise time at 9600 baud** &mdash; Toggle ST_TX at 9600 baud after the C47 rework. Pass if edge reaches &ge; 80 % of VST within 30 &micro;s.
- **D8 static current at 16 V** &mdash; Measure D8 zener leakage and continuous dissipation at V_bus = 16 V. Pass if dissipation &le; 200 mW.
- **Surge survivability** &mdash; Apply 58 V transient on ST_SIG (clamped by upstream TVS). Pass if no gate-driver or Q6 damage.

:::

## Gaps & next version

**Before next production run**

- **C47 rework: 2.2 nF → 820 pF** — Update the schematic BOM and rework all assembled V1.2 units. Component value change only (0603 C0G footprint unchanged). Restores rise-time-assist effectiveness at 4800 baud on long cables and adds 9600 baud capability.
- **C58 and C54 bypass distance** — C58 is 7.70 mm from U14 VIN; C54 is 5.46 mm from U14 VOUT (C53 is 6.92 mm). All exceed the ≤ 2 mm guideline. If VST oscillation is observed under transient load at bring-up, rework the caps to within 2 mm of U14 pins.
- **C49 / C50 schematic part-number fix** — KiCAD schematic lists the wrong manufacturer P/N (GRM188R71H104KA93D, 100 nF) for C49 / C50; assembled BOM value (100 pF) is correct. Metadata-only fix in the schematic.
- **R66 KiCAD symbol series** — KiCAD symbol shows RT-series thin-film; the RC-series thick-film 1 kΩ is correct and matches the BOM. Metadata-only fix in the schematic.
- **LDO_VIN surge trace width** — Confirm via Gerber or DRC that the surge-carrying trace from R69 to the D13/D15/M2 cluster is ≥ 0.5 mm (not extractable from text-level PCB data).
- **DRC run** — DRC was not run during the PCB review. Run `kicad-cli pcb drc --severity-error --severity-warning`, particularly around the isolation gap.

**Next version (V1.3 / V2.0)**

- **Replace J3 with M12 3-pin waterproof connector** — M12 A-code or B-code, panel-mount, IP67, field-wireable; the Legacy Serial Protocol pin assignment (power / ground / signal) maps directly. The 1211-compatible footprint is replaced; no circuit changes required.
- **C23 bypass distance** — Add a dedicated 100 nF 0603 bypass adjacent to U6 pin 6 (currently 9.4 mm away).
- **Dedicated VCC bypass at U7** — Add a 100 nF 0603 adjacent to U7 VCC pin (pin 6); C31 (the nearest discrete bypass) is 9.9 mm from U7.
- **Dedicated bypass at U6 LED supply** — No bypass is placed at U6's LED supply node (pad 1); add a 100 nF cap for HF immunity in the marine environment.
- **Guard ring around U6 isolation gap** — Add an unconnected guard trace if conformal coating is not applied; reduces ionic creepage risk in marine salt-spray.
- **D8 proximity** — Relocate D8 to within ≈ 3 mm of the ST_SIG isolation via (currently 10.7 mm) for better transient suppression.
- **Front-end protection distance from J3** — D14 / C49 / D13 are 14–23 mm from J3 due to THT body clearance; review whether a revised connector placement or rear-side protection could reduce the unprotected trace length.
- **PCB creepage slot** — Evaluate a milled slot at the U6 and U7 / U8 isolation boundaries if CE / MED certification is pursued.
- **HS NMEA 0183 TX support** — Robust 38400 baud TX requires a redesigned rise-time-assist stage (e.g. a constant-current source) — not achievable with a simple C47 value change.

## References

1. Toshiba, [*TLP2309 High-Speed Logic Gate Opto-Isolator*](/assets/datasheets/wti400-v1.2/TLP2309.pdf)
2. Nexperia, [*2N7002 N-Channel MOSFET*](/assets/datasheets/wti400-v1.2/2N7002.pdf)
3. Nexperia, [*BC847BS NPN/NPN Dual Transistor*](/assets/datasheets/wti400-v1.2/BC847BS.pdf)
4. Nexperia, [*BAT54J Schottky Diode*](/assets/datasheets/wti400-v1.2/BAT54J.pdf)
5. Nexperia, [*PESD15VL1BA ESD Protection Diode*](/assets/datasheets/wti400-v1.2/PESD15VL1BA.pdf)
6. AOS, [*AO3407A P-Channel MOSFET*](/assets/datasheets/wti400-v1.2/AO3407A.pdf)
7. Diodes Inc., [*ZXTR2012FF 100 V LDO Regulator*](/assets/datasheets/wti400-v1.2/ZXTR2012FF.pdf)
8. Diodes Inc., [*BZT52C15S Zener Diode*](/assets/datasheets/wti400-v1.2/BZT52C15S.pdf)
9. onsemi, [*MMBTA56LT1G PNP Transistor*](/assets/datasheets/wti400-v1.2/MMBTA56LT1G.pdf)
10. Littelfuse, [*SMCJ36CA Transient Voltage Suppressor*](https://www.littelfuse.com/assetdocs/smcj.pdf)
11. Littelfuse, [*V33MLA1206NH Varistor*](/assets/datasheets/wti400-v1.2/V33MLA1206NH.pdf)
12. MSKSEMI, [*SS34-MS Schottky Diode*](/assets/datasheets/wti400-v1.2/SS34.pdf)
13. Murata, [*BLM31KN601SN1L Ferrite Bead*](https://www.murata.com/en-us/api/pdfdownloadapi?cate=&partno=BLM31KN601SN1L)
14. Murata, [*LQM18FN1R0M00D 1 µH Inductor*](https://www.murata.com/en-us/api/pdfdownloadapi?cate=&partno=LQM18FN1R0M00D)
15. Yageo, [*AC1210JR-0747RL AEC-Q200 Thick-Film Resistor*](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-AC_Group_52_RoHS_L_12.pdf)
16. IPC, *IPC-2221 Generic Standard on Printed Board Design*, Table 6-1
17. IEC, *IEC 60747-5-5 — Semiconductor devices — Optoelectronic devices — Isolation voltage*
18. Noland Engineering, [*Understanding and Implementing NMEA 0183 and RS422*](https://www.nolandeng.com/downloads/Interfaces.pdf)
19. Raymarine, [*SeaTalk Interface Overview*](https://web.archive.org/web/20090902021951/http://raymarine.custhelp.com/app/answers/detail/a_id/1016/~/seatalk-communications---overview)

## Related pages

- [Wind Interface](./wind-interface.md) — the transducer front-end whose apparent-wind data this interface places on the bus
- [Power Supplies](./power-supplies.md) — the digital VCC rail that powers the opto-isolator MCU side
- [ESP32 Module](./esp32-module.md) — the UART GPIOs driving `ST_RX` / `ST_TX` / `ST_EN`
- [External Connectors](/wti400/v1.2/quick-reference/connectors) — J3 pinout and the full connector roster
