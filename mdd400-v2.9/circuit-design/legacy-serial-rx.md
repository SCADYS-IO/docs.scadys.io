---
title: Legacy Serial RX
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/legacy_serial_rx_734f7a0d.svg" alt="Legacy Serial RX schematic" />

:::note Hardware version
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

## Components

| Ref | Value | Description | Datasheet |
|-----|-------|-------------|-----------|
| J3 | CON-THT-SEATALK-0292 | Custom 3-pin THT connector, pin-compatible with the Raymarine SeaTalk I connector. Accepts standard Raymarine SeaTalk plugs or 1211 spade female crimp connectors. Pin 1 = 12 V (RED), Pin 2 = GND (BLACK), Pin 3 = SIG (YELLOW). | — |
| D13 | SS34 | MSKSEMI SS34-MS Schottky diode, SMA, 40 V / 3 A — reverse-polarity protection on LDO_VIN power input | [SS34.pdf](/assets/datasheets/mdd400-v2.9/SS34.pdf) |
| R57 | 47 Ω / 1210 / 500 mW | Yageo AC1210JR-0747RL — AEC-Q200 pulse-damping resistor; limits inrush and surge current on LDO_VIN entry | [AC1210JR-0747RL.pdf](/assets/datasheets/mdd400-v2.9/AC1210JR-0747RL.pdf) |
| D15 | SMCJ36CA | Littelfuse SMCJ36CA bidirectional TVS, DO-214AB — fast transient suppression on LDO_VIN rail, V_clamp ≈ 58 V at I_PP | [SMCJ36CA.pdf](/assets/datasheets/mdd400-v2.9/SMCJ36CA.pdf) |
| M1 | V33MLA1206NH | Littelfuse V33MLA1206NH MOV varistor, 1206 — high-energy surge absorption on LDO_VIN rail, V_clamp ≈ 75 V | [V33MLA1206NH.pdf](/assets/datasheets/mdd400-v2.9/V33MLA1206NH.pdf) |
| FB5 | BLM31KN601SN1L | Murata BLM31KN601SN1L ferrite bead, 0603, 600 Ω @ 100 MHz — conducted HF EMI attenuation on LDO_VIN rail | [BLM31KN601SN1L.pdf](/assets/datasheets/mdd400-v2.9/BLM31KN601SN1L.pdf) |
| C55 | 1 µF / 100 V / 1206 | Murata GRM31CR72A105KA01K — bulk input decoupling on LDO_VIN rail | [GRM31CR72A105KA01K.pdf](/assets/datasheets/mdd400-v2.9/GRM31CR72A105KA01K.pdf) |
| U11 | ZXTR2012FF | Diodes Inc. ZXTR2012FF, SOT-23F — 100 V-input / 12 V / 30 mA linear regulator; generates VST from LDO_VIN | [ZXTR2012.pdf](/assets/datasheets/mdd400-v2.9/ZXTR2012.pdf) |
| C54 | 10 µF / 25 V / 0805 | Murata GRM21BZ71E106KE15L — bulk output reservoir on VST rail | [Murata product page](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |
| C53 | 100 nF / 50 V / 0603 | Murata GRM188R71H104KA93D — HF bypass on VST rail near U11 | [GRM188R71H104KA93D.pdf](/assets/datasheets/mdd400-v2.9/GRM188R71H104KA93D.pdf) |
| R30 | 22 kΩ / 0603 | Yageo RC Series — pull-up from VST to ST_SIG; holds bus line HIGH during idle | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| D6 | BAT54J | Nexperia BAT54J Schottky, SOD-323F — blocks VST pull-up R30 from loading the bus during idle | [BAT54J.pdf](/assets/datasheets/mdd400-v2.9/BAT54J.pdf) |
| C49 | 100 pF / 50 V / 0603 | Murata GRM1885C1H101JA01D (C0G) — RF bypass on ST_SIG at J3 end | [Murata GRM1885C1H101JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D) |
| D14 | PESD15VL1BA | Nexperia PESD15VL1BA ESD TVS, SOD-323 — clamps ESD events on ST_SIG to GND_ST | [PESD15VL1BA.pdf](/assets/datasheets/mdd400-v2.9/PESD15VL1BA.pdf) |
| L5 | 1 µH / 0603 | Murata LQM18FN1R0M00D — series inductor on ST_SIG forming LC low-pass filter with C50 | [LQM18FN1R0M00D.pdf](/assets/datasheets/mdd400-v2.9/LQM18FN1R0M00D.pdf) |
| C50 | 100 pF / 50 V / 0603 | Murata GRM1885C1H101JA01D (C0G) — RF bypass on ST_SIG after L5 | [Murata GRM1885C1H101JA01D](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D) |
| R32 | 2.2 kΩ / 0603 | Yageo RC Series — LED current-limiting resistor in the opto input path | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| U7 | TLP2309 | Toshiba TLP2309 logic-gate opto-isolator, SO-6, 3750 Vrms — galvanic isolation between Legacy Serial Protocol (VST/GND_ST) and digital (VCC/GNDREF) domains | [TLP2309.pdf](/assets/datasheets/mdd400-v2.9/TLP2309.pdf) |
| R25 | 2.2 kΩ / 0603 | Yageo RC Series — pull-up from VCC (3.3 V) to U7 open-collector output; defines ST_RX HIGH level | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C30 | 100 nF / 50 V / 0603 | VCC supply bypass capacitor at U7 output side (VCC to GNDREF) | [Murata](https://www.murata.com/) |

## How It Works

The legacy-serial-rx circuit is a receive-only, opto-isolated interface for the Legacy Serial Protocol bus (e.g. SeaTalk™). It accepts a 3-pin bus connection from J3 — 12 V power, GND, and the single-wire signal line — and delivers a galvanically isolated 3.3 V logic-level signal (ST_RX) to the ESP32 MCU GPIO.

**Power entry and conditioning.** Raw 12 V bus power from J3 pin 1 enters a series protection chain. A 47 Ω pulse-damping resistor R57 (AEC-Q200 rated, 1210 package) limits inrush and surge currents. Downstream, a bidirectional TVS D15 (SMCJ36CA, ~58 V clamp at peak pulse current) provides fast transient suppression, and varistor M1 (V33MLA1206NH, 75 V clamp) supplements this with high-energy surge absorption. Reverse-polarity protection Schottky D13 (SS34) blocks damage from inverted power connections. Ferrite bead FB5 (BLM31KN601SN1L, 600 Ω @ 100 MHz) attenuates conducted HF EMI. Bulk capacitors C55 (1 µF / 100 V) and C54 (10 µF / 25 V) provide reservoir energy, with C53 (100 nF) for HF bypass. Linear regulator U11 (ZXTR2012FF) takes the LDO_VIN rail and generates a stable VST supply for the opto LED drive and pull-up network.

**Signal path and filtering.** The ST_SIG line from J3 pin 3 passes through a two-stage RF filter: C49 (100 pF) shunts HF noise to GND_ST close to the connector, and an LC filter formed by L5 (1 µH) in series with C50 (100 pF) provides a second filter stage. ESD TVS D14 (PESD15VL1BA) clamps electrostatic discharge events on ST_SIG to GND_ST. The effective −3 dB of the filter is approximately 723 kHz (RC-dominated by R32 and C50) — well above the 4800/9600 baud operating rate, preserving signal integrity while strongly attenuating RF interference.

**Opto drive.** Pull-up resistor R30 (22 kΩ from VST) holds the ST_SIG line HIGH during idle. Series Schottky D6 (BAT54J) is in the drive path between VST and the opto LED; it prevents the pull-up from loading the bus when no device is transmitting. Current-limiting resistor R32 (2.2 kΩ) is in series with the TLP2309 LED. When a bus device asserts a LOW on ST_SIG, current flows through D6 and R32 into U7's LED:

```
I_LED = (V_ST − V_D6_F − V_LED_F) / R32
      = (12.0 V − 0.45 V − 1.20 V) / 2200 Ω ≈ 4.7 mA  (at V_bus = 16 V)
```

LED current remains above the TLP2309 minimum at all NMEA 2000 bus voltages (≥ 2.93 mA at 9 V bus — see Design Calculations).

**Opto-isolation and output.** U7 (TLP2309) provides 3750 Vrms galvanic isolation with ±15 kV/µs common-mode transient immunity. The LED input side operates in the VST / GND_ST domain; the output side is in the VCC (3.3 V) / GNDREF digital domain. The output is non-inverting at signal level: bus LOW → LED ON → U7 output pulled LOW through R25 (2.2 kΩ to VCC) → ST_RX LOW. Bus HIGH (idle) → LED OFF → ST_RX pulled HIGH by R25. The TLP2309 supports up to 1 Mbit/s, providing a >100× margin above the 9600 baud maximum bus rate.

**Ground domain isolation.** The LED side of U7 is referenced to GND_ST — the isolated Legacy Serial Protocol ground — which has no DC path or capacitive coupling to GNDREF (digital ground) or GND_SMPS. The opto-isolator is the only link between the two domains.

## Design Rationale

Galvanic isolation is essential for Legacy Serial Protocol installations: legacy marine instruments are independently powered, each referenced to its own chassis ground. Without isolation, ground loop currents corrupt the single-wire bus and can introduce noise that is indistinguishable from data. The TLP2309 was selected for its high common-mode transient immunity (±15 kV/µs) and 1 Mbit/s speed margin.

The power protection chain (R57 → D13 → D15/M1 → FB5) is staged to handle the full NMEA 2000 threat environment: the series resistor R57 limits peak surge current before the clamp devices, D15 responds in nanoseconds to fast transients, and M1 absorbs slow high-energy surges that exceed D15's pulse power rating. R57 is AEC-Q200 qualified with a 500 mW continuous rating and 1210 thermal mass, appropriate for automotive-grade transient environments.

U11 (ZXTR2012FF) regulates the LED drive supply to 12 V regardless of bus voltage variations across the NMEA 2000 range. At bus voltages below ~12.9 V (the regulation threshold after D13 and R57 drops), U11 enters the dropout region and VST tracks approximately V_bus − 0.9 V. The LED current remains adequate across the full 9–16 V bus range: even at 9 V bus, I_LED ≈ 2.93 mA, well above the TLP2309 minimum.

The J3 connector uses a custom THT footprint (CON-THT-SEATALK-0292) that is pin-compatible with the Raymarine SeaTalk I connector. This allows standard Raymarine SeaTalk plugs or 1211 spade female crimp connectors to mate directly without adapters.

## PCB Layout

The opto-isolator U7 straddles the GND_ST / GNDREF domain boundary. A 1.4 mm copper-free gap passes through the U7 body on both F.Cu and In1.Cu — exceeding the IPC-2221 Class B ≥ 0.8 mm minimum for the applicable working voltage. The GND_ST copper island is present on F.Cu and In1.Cu; GNDREF fills B.Cu and In2.Cu fully (no GND_ST on these layers). No copper fill crosses the isolation gap on any layer.

| Requirement | Status | Evidence |
|-------------|--------|----------|
| U7 straddles GND_ST/GNDREF boundary; no other component breaches it | Met | Isolation gap 1.4 mm at X=141.5, confirmed F.Cu and In1.Cu |
| Front-end protection (D13, D14, R57, C49) close to J3 | Partial | 14–23 mm from J3; J3 physical size and required clearance prevent closer top-side placement |
| C55 (1 µF VIN) within 2 mm of U11 VIN pin | Partial | 9.2 mm — caps are in the U11 cluster area but not at pin level |
| C54 (10 µF VOUT) within 2 mm of U11 VOUT pin | Partial | 5.0 mm — electrically correct; proximity target not met |
| D15/M1 placed immediately after R57, before FB5 | Met | All three share the Net-(D13-A) node between R57 and D13-cathode |
| GND_ST isolation boundary maintained on all layers | Met | No zone polygon crosses the gap; GND_SMPS not present in this domain |
| No copper pour crossing isolation gap; ≥ 0.8 mm | Met | 1.4 mm gap on F.Cu and In1.Cu through U7 body |
| VST trace width ≥ 0.5 mm on surge-current-carrying section | Unverifiable | Requires Gerber or DRC review |
| C30 (VCC bypass) within 2 mm of U7 VCC pin | Met | 0.8 mm pad-to-pad, constrained by component courtyard outlines |

**Protection chain topology as built:** The PCB routes J3 → R57 → shared node (D13 anode, D15 anode, M1 anode) → D13 cathode → FB5 → U11. R57 is electrically first in the chain, before the reverse-polarity diode D13. This ensures the surge resistor limits current into the clamp devices before the Schottky diode separates the protected LDO_VIN rail. Both D15 (fast TVS) and M1 (MOV) are connected directly at the R57 output node, in parallel, for complementary transient suppression.

## Design Calculations

### U11 Regulation and VST Across Bus Voltage Range

The ZXTR2012FF regulates at 12 V when V_IN > V_OUT + V_CE(sat) ≈ 12.2 V. After D13 (0.45 V) and R57 (~0.24 V at 5 mA), V_IN ≈ V_bus − 0.7 V. Regulation threshold: V_bus ≈ 12.9 V.

| Bus voltage | V_IN (U11) | VST | I_LED | Notes |
|-------------|-----------|-----|-------|-------|
| 16 V (max) | 15.31 V | 12.0 V | 4.70 mA | Regulated |
| 12 V (nom) | 11.31 V | ~11.1 V | 4.30 mA | Dropout |
| 9 V (min) | 8.31 V | ~8.1 V | 2.93 mA | Dropout |

I_LED = (V_ST − V_D6_F − V_LED_F) / R32; V_D6_F = 0.45 V; V_LED_F = 1.20 V; R32 = 2.2 kΩ.
All values exceed TLP2309 minimum I_F ≈ 1 mA. ✓

**U11 thermal:** At V_bus = 16 V, I_VST ≈ 5.4 mA: P_D = (15.31 − 12.0) × 5.4 mA = 19 mW. At 95 °C/W (SOT-23F), ΔT_j < 2 °C — no thermal concern under normal NMEA 2000 operating conditions.

### Signal Filter

L5 (1 µH) and C50 (100 pF) form an LC filter; R32 (2.2 kΩ) as load dominates the response below the LC resonance.

| Parameter | Value |
|-----------|-------|
| LC resonant frequency | 1 / (2π√(1 µH × 100 pF)) = 15.9 MHz |
| Effective −3 dB (RC pole: R32 × C50) | 1 / (2π × 2200 × 100 pF) = **723 kHz** |
| Legacy Serial Protocol signal content | ≤ 50 kHz (9600 baud) |
| Filter margin above signal band | >14× |

### Protection Chain

| Threat | Component | Characteristic |
|--------|-----------|----------------|
| Reverse polarity | D13 SS34 | Blocks reverse; V_F = 0.45 V forward |
| Fast transient / ISO 7637-2 | D15 SMCJ36CA | V_BR = 40 V min; V_C = 58.1 V at I_PP = 43.5 A |
| High-energy surge | M1 V33MLA1206NH | V_clamp ≈ 75 V; max energy 0.6 J |
| Conducted HF EMI | FB5 BLM31KN601SN1L | 600 Ω @ 100 MHz; DCR = 80 mΩ |
| Signal ESD | D14 PESD15VL1BA | V_BR = 15 V; V_clamp ≈ 17 V at 1 A |

During a power rail transient clamped by D15, U11 continues to regulate VST at 12 V (D15 clamp voltage is within U11's 100 V maximum input). LED current is unaffected by power rail transients.

### NMEA 0183 Listener Compliance

Input loading at 2.0 V differential: ≈ 0.36 mA (< 2.0 mA NMEA 0183 listener limit). ✓

### Isolation

| Parameter | Requirement | As Built |
|-----------|-------------|----------|
| Copper gap across U7 isolation boundary | ≥ 0.8 mm (IPC-2221 Class B) | **1.4 mm** (F.Cu and In1.Cu) |
| TLP2309 isolation voltage | — | 3750 Vrms |
| Common-mode transient immunity | — | ±15 kV/µs |

:::caution Verification required — Fabricated prototype

**Verify during bring-up:**
- **Legacy Serial I protocol compatibility at 4800 bps:** Connect to a real Legacy Serial I device; verify ST_RX waveform framing, bit timing, and idle HIGH level on oscilloscope.
- **VST across bus voltage range:** Measure VST and I_LED at 9 V, 12 V, and 16 V bus. Confirm I_LED > 1 mA at 9 V bus (expected ≈ 2.93 mA).
- **U11 bypass capacitor stability:** Under toggling LED load, confirm VST is stable with no oscillation. C55 (9.2 mm from U11 VIN) and C54 (5.0 mm from VOUT) exceed the ≤ 2 mm guideline; rework if instability is observed.

**Before next production run:**
- **LDO_VIN trace width:** Confirm via Gerber or DRC that the LDO_VIN entry trace (R57 → D13/D15/M1 cluster) is ≥ 0.5 mm. *(pcb_review Gap 4)*
- **Isolation barrier Gerber check:** Confirm GND_ST/GNDREF separation on F.Cu and In1.Cu through U7; no traces cross the boundary. *(pcb_review)*
- **C49/C50 schematic Datasheet URL:** Fix URL in `legacy_serial_rx.kicad_sch` from GRM188R71H104KA93D (100 nF, wrong) to GRM1885C1H101JA01D (100 pF, correct). *(schema_review)*

**For next version:**
- **Front-end protection proximity to J3:** D13, D14, C49 are 20–23 mm from J3 due to the connector's large physical footprint. Assess whether rear-side placement of the signal protection cluster is practical in V2.10. *(pcb_review Gap P2a/P2b)*
- **Dedicated VCC decoupling at U7 LED supply:** Add a 100 nF bypass cap close to U7 pin 1 (VST/LED side). C53 is in the U11 cluster (40 mm from U7); R32 (2.2 kΩ) partially compensates. *(pcb_review Gap D2)*
- **Guard ring around U7 isolation gap:** No guard ring identified in PCB data. Recommended for marine environments where ionic contamination is a risk. *(pcb_review Gap G4)*
:::

## References

1. Toshiba, [*TLP2309 High-Speed Logic Gate Opto-Isolator*](/assets/datasheets/mdd400-v2.9/TLP2309.pdf)
2. Diodes Inc., [*ZXTR2012FF 100 V Input, 12 V 30 mA Regulator Transistor*](/assets/datasheets/mdd400-v2.9/ZXTR2012.pdf)
3. Nexperia, [*BAT54J Schottky Diode*](/assets/datasheets/mdd400-v2.9/BAT54J.pdf)
4. Nexperia, [*PESD15VL1BA ESD Protection Diode*](/assets/datasheets/mdd400-v2.9/PESD15VL1BA.pdf)
5. Littelfuse, [*SMCJ36CA Transient Voltage Suppressor*](/assets/datasheets/mdd400-v2.9/SMCJ36CA.pdf)
6. Littelfuse, [*V33MLA1206NH Varistor*](/assets/datasheets/mdd400-v2.9/V33MLA1206NH.pdf)
7. MSKSEMI, [*SS34-MS Schottky Diode*](/assets/datasheets/mdd400-v2.9/SS34.pdf)
8. Murata Electronics, [*BLM31KN601SN1L Ferrite Bead*](/assets/datasheets/mdd400-v2.9/BLM31KN601SN1L.pdf)
9. Murata Electronics, [*LQM18FN1R0M00D 1 µH Inductor*](/assets/datasheets/mdd400-v2.9/LQM18FN1R0M00D.pdf)
10. Yageo, [*AC1210JR-0747RL AEC-Q200 Thick-Film Resistor*](/assets/datasheets/mdd400-v2.9/AC1210JR-0747RL.pdf)
11. Noland Engineering, [*Understanding and Implementing NMEA 0183 and RS422 Serial Data Interfaces*](https://www.nolandeng.com/downloads/Interfaces.pdf)
12. Raymarine, [*SeaTalk Interface Overview*](https://web.archive.org/web/20090902021951/http://raymarine.custhelp.com/app/answers/detail/a_id/1016/~/seatalk-communications---overview)
13. IPC, *IPC-2221 Generic Standard on Printed Board Design*, Table 6-1
