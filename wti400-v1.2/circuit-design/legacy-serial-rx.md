---
title: Legacy Serial RX
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel Sunny Spells"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/wti400-v1.2/legacy_serial_rx_73020a10.svg" alt="Legacy Serial RX schematic" />

:::note Hardware version
WTI400 **v1.2** — In service — installed on test vessel *Sunny Spells*
:::

## Components

| Ref | Value | Description | Datasheet |
|-----|-------|-------------|-----------|
| J3 | CON-THT-SEATALK-0292 | Custom 3-pin THT connector, pin-compatible with the Raymarine SeaTalk I connector. Accepts standard Raymarine SeaTalk plugs or 1211 spade female crimp connectors. Pin 1 = 12 V (RED), Pin 2 = GND (BLACK), Pin 3 = SIG (YELLOW). | — |
| D13 | SS34 | MSKSEMI SS34 Schottky diode, SMA, 40 V / 3 A — reverse-polarity protection on LDO_VIN power input | [Datasheet](https://www.lcsc.com/datasheet/lcsc_datasheet_2310100931_MSKSEMI-SS34-MS_C2836396.pdf) |
| R69 | 47 Ω / 1210 / 500 mW | Yageo AC1210JR-0747RL, AEC-Q200 thick-film — pulse-damping resistor; limits inrush and surge current on LDO_VIN entry | [Datasheet](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-AC_Group_52_RoHS_L_12.pdf) |
| D15 | SMCJ36CA | Littelfuse SMCJ36CA bidirectional TVS, DO-214AB — fast transient suppression on LDO_VIN rail, V_clamp ≈ 58 V at I_PP | [Datasheet](https://www.littelfuse.com/assetdocs/smcj.pdf) |
| M2 | V33MLA1206NH | Littelfuse V33MLA1206NH MOV varistor, 1206 — high-energy surge absorption on LDO_VIN rail, V_clamp ≈ 75 V | [Datasheet](https://www.littelfuse.com/assetdocs/varistor-v33mla1206nh-datasheet.pdf) |
| FB3 | BLM31KN601SN1L | Murata BLM31KN601SN1L ferrite bead, 600 Ω @ 100 MHz — conducted HF EMI attenuation on LDO_VIN rail | [Datasheet](https://www.murata.com/en-us/api/pdfdownloadapi?cate=&partno=BLM31KN601SN1L) |
| C58 | 1 µF / 100 V / 1206 | Murata GRM31CR72A105KA01K, X7R — bulk input decoupling on LDO_VIN rail | [Datasheet](https://www.murata.com/en-us/products/productdetail?partno=GRM31CR72A105KA01K) |
| U14 | ZXTR2012FF | Diodes Inc. ZXTR2012FF, SOT-23F — 100 V-input / 12 V / 30 mA linear regulator; generates VST from LDO_VIN | [Datasheet](https://www.diodes.com/assets/Datasheets/ZXTR2012FF.pdf) |
| C54 | 10 µF / 25 V / 0805 | Murata GRM21BZ71E106KE15L, X7R — bulk output reservoir on VST rail | [Datasheet](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |
| C53 | 100 nF / 50 V / 0603 | Murata GRM188R71H104KA93D, X7R — HF bypass on VST rail near U14 | [Datasheet](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D) |
| R29 | 22 kΩ / 0603 | Yageo RC Series, ±1% — pull-up from VST to ST_SIG; holds bus line HIGH during idle | [Datasheet](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| D6 | BAT54J | Nexperia BAT54J Schottky, SOD-323F — blocks VST pull-up R29 from loading the bus during idle | [Datasheet](https://www.nexperia.com/products/diodes/schottky-diodes-and-rectifiers/BAT54J.html) |
| C49 | 100 pF / 50 V / 0603 | Murata GRM1885C1H101JA01D, C0G — RF bypass on ST_SIG at J3 end | [Datasheet](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D) |
| D14 | PESD15VL1BA | Nexperia PESD15VL1BA ESD TVS, SOD-323 — clamps ESD events on ST_SIG to GND_ST | [Datasheet](https://www.nexperia.com/products/esd-protection-tvs-filtering-and-signal-conditioning/esd-protection/PESD15VL1BA.html) |
| L6 | 1 µH / 0603 | Murata LQM18FN1R0M00D — series inductor on ST_SIG forming LC low-pass filter with C50 | [Datasheet](https://www.murata.com/en-us/api/pdfdownloadapi?cate=&partno=LQM18FN1R0M00D) |
| C50 | 100 pF / 50 V / 0603 | Murata GRM1885C1H101JA01D, C0G — RF bypass on ST_SIG after L6 | [Datasheet](https://www.murata.com/en-us/products/productdetail?partno=GRM1885C1H101JA01D) |
| R30 | 2.2 kΩ / 0603 | Yageo RC Series, ±1% — LED current-limiting resistor in the opto input path | [Datasheet](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| U6 | TLP2309 | Toshiba TLP2309 logic-gate opto-isolator, SO-6, 3750 Vrms — galvanic isolation between Legacy Serial Protocol (VST/GND_ST) and digital (VCC/GNDREF) domains | [Datasheet](https://toshiba.semicon-storage.com/ap-en/semiconductor/product/isolators-solid-state-relays/detail.TLP2309.html) |
| R19 | 2.2 kΩ / 0603 | Yageo RC Series, ±1% — pull-up from VCC (3.3 V) to U6 open-collector output; defines ST_RX HIGH level | [Datasheet](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C23 | 100 nF / 50 V / 0603 | VCC supply bypass capacitor at U6 output side (VCC to GNDREF) | — |

---

## How It Works

The legacy-serial-rx circuit is a receive-only, opto-isolated interface for the Legacy Serial Protocol bus (e.g. SeaTalk™). It accepts a 3-pin bus connection from J3 — 12 V power, GND, and the single-wire signal line — and delivers a galvanically isolated 3.3 V logic-level signal (ST_RX) to the ESP32 MCU GPIO.

**Power entry and conditioning.** Raw 12 V bus power from J3 pin 1 enters a series protection chain: 47 Ω pulse-damping resistor R69 (AEC-Q200 rated, 1210 package) limits inrush and surge current; bidirectional TVS D15 (SMCJ36CA, ~58 V clamp at peak pulse current) provides fast transient suppression; varistor M2 (V33MLA1206NH, 75 V clamp) supplements with high-energy surge absorption; reverse-polarity Schottky D13 (SS34) blocks inverted power connections. Ferrite bead FB3 (BLM31KN601SN1L, 600 Ω @ 100 MHz) attenuates conducted HF EMI. Bulk capacitors C58 (1 µF / 100 V) and C54 (10 µF / 25 V) provide reservoir energy; C53 (100 nF) provides local HF bypass. Linear regulator U14 (ZXTR2012FF) generates a stable 12 V VST supply for the opto LED drive and pull-up network. At bus voltages below ~12.9 V, U14 operates in the dropout region and VST tracks approximately V_bus − 0.9 V; LED current remains above the TLP2309 minimum across the full 9–16 V NMEA 2000 bus range.

**Signal path and filtering.** The ST_SIG line from J3 pin 3 passes through a two-stage RF filter: C49 (100 pF) shunts HF noise to GND_ST close to the connector, and an LC filter formed by L6 (1 µH) in series with C50 (100 pF) provides a second filter stage. ESD TVS D14 (PESD15VL1BA) clamps electrostatic discharge events on ST_SIG to GND_ST. The effective −3 dB of the filter is approximately 723 kHz (RC-dominated by R30 and C50), well above the 4800/9600 baud operating rate.

**Opto drive.** Pull-up resistor R29 (22 kΩ from VST) holds the ST_SIG line HIGH during idle. Series Schottky D6 (BAT54J) is in the drive path between VST and the opto LED; it prevents the pull-up from loading the bus when no device is transmitting. Current-limiting resistor R30 (2.2 kΩ) is in series with the TLP2309 LED. When a bus device asserts a LOW on ST_SIG, current flows from VST through R29 and D6 into U6's LED:

```
I_LED = (V_ST − V_D6_F − V_LED_F) / R30
      = (12.0 V − 0.45 V − 1.20 V) / 2200 Ω ≈ 4.7 mA  (at V_bus = 16 V)
```

LED current remains above the TLP2309 minimum at all NMEA 2000 bus voltages (≥ 2.93 mA at 9 V bus — see Design Calculations).

**Opto-isolation and output.** U6 (TLP2309) provides 3750 Vrms galvanic isolation with ±15 kV/µs common-mode transient immunity. The LED input side operates in the VST / GND_ST domain; the output side is in the VCC (3.3 V) / GNDREF digital domain. The output is non-inverting: bus LOW → LED ON → U6 output pulled LOW through R19 (2.2 kΩ to VCC) → ST_RX LOW. Bus HIGH (idle) → LED OFF → ST_RX pulled HIGH by R19. The TLP2309 supports up to 1 Mbit/s, providing a >100× margin above the 9600 baud maximum bus rate.

**Ground domain isolation.** The LED side of U6 is referenced to GND_ST — the isolated Legacy Serial Protocol ground — which has no DC path or capacitive coupling to GNDREF (digital ground). The opto-isolator is the only link between the two domains.

---

## Design Rationale

Galvanic isolation is essential for Legacy Serial Protocol installations: legacy marine instruments are independently powered, each referenced to its own chassis ground. Without isolation, ground loop currents corrupt the single-wire bus and can introduce noise indistinguishable from data. The TLP2309 was selected for its high common-mode transient immunity (±15 kV/µs) and 1 Mbit/s speed margin.

The power protection chain (R69 → D13 → D15/M2 → FB3) is staged to handle the full NMEA 2000 threat environment. R69 is first in the chain — it limits peak surge current into the clamp devices before the Schottky diode. D15 responds in nanoseconds to fast transients; M2 absorbs slow high-energy surges that exceed D15's pulse power rating. R69 is AEC-Q200 qualified with a 500 mW continuous rating and 1210 thermal mass, appropriate for marine transient environments.

U14 (ZXTR2012FF) regulates the LED drive supply to 12 V regardless of bus voltage variations across the NMEA 2000 range. At bus voltages below ~12.9 V, U14 enters the dropout region and VST tracks approximately V_bus − 0.9 V. Even at 9 V bus, I_LED ≈ 2.93 mA — well above the TLP2309 minimum. The J3 connector uses a custom THT footprint that is pin-compatible with the Raymarine SeaTalk I connector, allowing standard SeaTalk plugs or 1211 spade female crimp connectors to mate directly without adapters.

---

## PCB Layout

U6 (TLP2309) straddles the GND_ST / GNDREF domain boundary. A 1.4 mm copper-free gap passes through the U6 body on both F.Cu and In1.Cu — exceeding the IPC-2221 Class B ≥ 0.8 mm minimum for the applicable working voltage. No copper fill crosses the isolation gap on any layer.

| Requirement | Status | Evidence |
|-------------|--------|----------|
| U6 straddles GND_ST/GNDREF boundary; no other component breaches it | ✅ Met | U6 at (141.5, 79.6); LED pads at Y=76.35 (GNDREF side), output pads at Y=82.85 (GND_ST side); 1.4 mm gap confirmed F.Cu and In1.Cu |
| Front-end protection (D13, R69) near J3 | ⚠️ Partial | R69 14.5 mm, D13 20.6 mm from J3; J3 THT footprint clearance prevents closer placement |
| Signal ESD (D14, C49) near J3 | ⚠️ Partial | D14 22.8 mm, C49 21.4 mm from J3; chain order correct: C49 → D14 → L6 → C50 |
| C58 (1 µF LDO_VIN) within 2 mm of U14 VIN pin | ⚠️ Not met | 7.70 mm pad-to-pin; validate under transient load during bring-up |
| C54 (10 µF VST) within 2 mm of U14 VOUT pin | ⚠️ Not met | 5.46 mm pad-to-pin; validate under transient load during bring-up |
| D15/M2 after R69, before FB3 | ✅ Met | Net-(D13-A): R69 pad2 → D13 anode, D15 anode, M2 anode in parallel; FB3 downstream |
| R29/D6/R30 close to U6 LED input | ✅ Met | R29 4.0 mm, R30 5.1 mm, D6 7.2 mm from U6 centroid |
| GND_ST/GNDREF isolation maintained on all layers | ✅ Met | F.Cu and In1.Cu: 1.4 mm gap; B.Cu: GNDREF only (no GND_ST); no zone polygon crosses gap |
| C23 (VCC bypass) within 2 mm of U6 VCC pin | ⚠️ Partial | C23 9.4 mm from U6 VCC pad; placed at output cluster; dedicated bypass at U6 pad to be added at V2.0 |
| VST trace width ≥ 0.5 mm on LDO_VIN surge section | 🔲 Unverifiable | Requires Gerber or DRC review |

**Protection chain topology as built.** The PCB places R69 first in the chain (R69 pad1 = J3 pin 1; R69 pad2 feeds the shared Net-(D13-A) node with D13 anode, D15 anode, and M2 anode in parallel). D13 cathode then feeds FB3 → U14. R69 first ensures the surge resistor limits current into the clamp devices before the Schottky diode; D13 still provides reverse-polarity protection by blocking reverse current at the anode node.

**Component clusters.** All 20 components are on F.Cu: power protection cluster (R69, D13, D15, M2: 7×10 mm at X:137–146, Y:108–122); LDO/filter cluster (FB3, C58, U14, C54, C53: 10×8 mm); signal filter cluster (C49, D14, L6, C50: 5×3 mm); LED drive cluster (D6, R29, R30: 5×6 mm); output side (R19, C23: Y=73.7, north of U6).

---

## Design Calculations

### VST and I_LED Across NMEA 2000 Bus Voltage Range

U14 ZXTR2012FF regulates at 12 V when V_IN > 12.2 V. After D13 (0.45 V) and R69 (~0.24 V at 5 mA), V_IN ≈ V_bus − 0.7 V. Regulation threshold: V_bus ≈ 12.9 V.

| Bus voltage | V_IN (U14) | VST | I_LED | Notes |
|-------------|-----------|-----|-------|-------|
| 16 V (max) | 15.31 V | 12.0 V | 4.70 mA | Regulated |
| 12 V (nom) | 11.31 V | ~11.1 V | 4.30 mA | Dropout |
| 9 V (min) | 8.31 V | ~8.1 V | 2.93 mA | Dropout |

I_LED = (V_ST − V_D6_F − V_LED_F) / R30; V_D6_F = 0.45 V; V_LED_F = 1.20 V; R30 = 2.2 kΩ.
All values exceed TLP2309 minimum I_F ≈ 1 mA. ✓

**U14 thermal:** At V_bus = 16 V, I_VST ≈ 5.4 mA: P_D = (15.31 − 12.0) × 5.4 mA = 19 mW. At 95 °C/W (SOT-23F), ΔT_j < 2 °C — no thermal concern under normal operating conditions.

### Signal Filter

| Parameter | Value |
|-----------|-------|
| LC resonant frequency (L6 × C50) | 1 / (2π√(1 µH × 100 pF)) = **15.9 MHz** |
| Effective −3 dB (R30 × C50) | 1 / (2π × 2200 × 100 pF) = **723 kHz** |
| Legacy Serial Protocol signal content | ≤ 50 kHz (9600 baud) |
| Filter margin above signal band | >14× |

### Protection Chain

| Threat | Component | Characteristic |
|--------|-----------|----------------|
| Reverse polarity | D13 SS34 | Blocks reverse; V_F = 0.45 V forward |
| Fast transient / ISO 7637-2 | D15 SMCJ36CA | V_BR = 40 V min; V_C = 58.1 V at I_PP = 43.5 A |
| High-energy surge | M2 V33MLA1206NH | V_clamp ≈ 75 V; max energy 0.6 J |
| Conducted HF EMI | FB3 BLM31KN601SN1L | 600 Ω @ 100 MHz; DCR = 80 mΩ |
| Signal ESD | D14 PESD15VL1BA | V_BR = 15 V; V_clamp ≈ 17 V at 1 A |

### Isolation

| Parameter | Requirement | As Built |
|-----------|-------------|----------|
| Copper gap across U6 isolation boundary | ≥ 0.8 mm (IPC-2221 Class B) | **1.4 mm** (F.Cu and In1.Cu) |
| TLP2309 isolation voltage | — | 3750 Vrms |
| Common-mode transient immunity | — | ±15 kV/µs |

### NMEA 0183 Listener Compliance

Input loading at 2.0 V differential: ≈ 0.36 mA (< 2.0 mA NMEA 0183 listener limit). ✓

---

:::caution Verification required — In service

**Before next production run:**
- **C49/C50 schematic Datasheet URL:** Fix URL in `legacy_serial_rx.kicad_sch` from GRM188R71H104KA93D (100 nF, wrong) to GRM1885C1H101JA01D (100 pF, correct). Metadata-only; BOM value is unaffected. *(performance_review Gap 1)*
- **LDO_VIN trace width:** Confirm via Gerber or DRC that the LDO_VIN entry trace (R69 → D13/D15/M2 cluster) is ≥ 0.5 mm. *(pcb_review F6)*

**Verify during bring-up:**
- **U14 bypass capacitor stability:** Under transient load, confirm VST is stable with no oscillation. C58 (7.70 mm from U14 VIN), C54 (5.46 mm from VOUT), and C53 (6.92 mm from VOUT) all exceed the ≤ 2 mm guideline. If instability is observed, rework C58 and C54 to within 2 mm of U14 pins. *(pcb_review F2, performance_review Gap 4)*
- **U14 LED current at 9 V bus:** Measure VST and I_LED at 9 V bus. Expected I_LED ≈ 2.93 mA (above TLP2309 minimum ≈ 1 mA). Verify reliable RX reception at low-end NMEA 2000 bus voltage. *(performance_review Gap 2)*

**For next version:**
- **Dedicated U6 LED-supply bypass:** No bypass is placed at U6's LED-side supply pin; C23 is 9.4 mm from U6 VCC pad. Add a 100 nF bypass at U6 pad 1/3 area and a dedicated bypass adjacent to U6 VCC pin (pad 6) in V2.0. *(pcb_review F3, performance_review Gap 5)*
- **Guard ring around U6 isolation gap:** No guard ring confirmed. Marine salt-spray environment increases ionic creepage risk. Add an unconnected guard trace at V2.0 if conformal coating is not applied. *(pcb_review F4, performance_review Gap 6)*

:::

---

## References

1. Toshiba, [*TLP2309 High-Speed Logic Gate Opto-Isolator*](https://toshiba.semicon-storage.com/ap-en/semiconductor/product/isolators-solid-state-relays/detail.TLP2309.html)
2. Diodes Inc., [*ZXTR2012FF 100 V Input, 12 V 30 mA Regulator Transistor*](https://www.diodes.com/assets/Datasheets/ZXTR2012FF.pdf)
3. Nexperia, [*BAT54J Schottky Diode*](https://www.nexperia.com/products/diodes/schottky-diodes-and-rectifiers/BAT54J.html)
4. Nexperia, [*PESD15VL1BA ESD Protection Diode*](https://www.nexperia.com/products/esd-protection-tvs-filtering-and-signal-conditioning/esd-protection/PESD15VL1BA.html)
5. Littelfuse, [*SMCJ36CA Transient Voltage Suppressor*](https://www.littelfuse.com/assetdocs/smcj.pdf)
6. Littelfuse, [*V33MLA1206NH Varistor*](https://www.littelfuse.com/assetdocs/varistor-v33mla1206nh-datasheet.pdf)
7. MSKSEMI, [*SS34-MS Schottky Diode*](https://www.lcsc.com/datasheet/lcsc_datasheet_2310100931_MSKSEMI-SS34-MS_C2836396.pdf)
8. Murata Electronics, [*BLM31KN601SN1L Ferrite Bead*](https://www.murata.com/en-us/api/pdfdownloadapi?cate=&partno=BLM31KN601SN1L)
9. Murata Electronics, [*LQM18FN1R0M00D 1 µH Inductor*](https://www.murata.com/en-us/api/pdfdownloadapi?cate=&partno=LQM18FN1R0M00D)
10. Yageo, [*AC1210JR-0747RL AEC-Q200 Thick-Film Resistor*](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-AC_Group_52_RoHS_L_12.pdf)
11. Noland Engineering, [*Understanding and Implementing NMEA 0183 and RS422 Serial Data Interfaces*](https://www.nolandeng.com/downloads/Interfaces.pdf)
12. Raymarine, [*SeaTalk Interface Overview*](https://web.archive.org/web/20090902021951/http://raymarine.custhelp.com/app/answers/detail/a_id/1016/~/seatalk-communications---overview)
13. IPC, *IPC-2221 Generic Standard on Printed Board Design*, Table 6-1
