---
title: Programming Socket
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype, bench-test phase. The board is the **developer/kit** assembly variant currently fitted (U4 / D3 / D4 / D5 / J1 populated, R22 DNP). Production builds reverse the DNP pattern and use a pogo-pin fixture; that configuration is described in the *Production variant* section below.

:::

## Overview

This page documents the MDD400 firmware-programming hardware on `esp32_module.kicad_sch`: the ESP-PROG-compatible IDC header J1, the optional HT7833 LDO (U4) with its three isolation Schottky diodes (D3, D4, D5), and the production-variant zero-ohm bridge (R22) that takes their place. The host MCU and its supply bypass are on the [ESP32 Module](./esp32-module) page.

<SchematicViewer src="/img/schematics/mdd400-v2.9/esp32_module_7c3ce4f1.svg" alt="ESP-PROG programming socket sub-circuit — J1 (2×3 2.54 mm IDC header, ESP-PROG-compatible), the three 1N5819WS Schottky diodes (D4 = VDD-to-V_PROG OR'ing; D3 = V_PROG-to-U4 V_IN forward isolation; D5 = Vout-to-Vin protection), U4 (HT7833 3.3 V LDO), and R22 (production-variant zero-ohm bridge, DNP on this prototype)." initialFocus="13.335 107.95 132.715 82.55" />

The two assembly variants share the same footprint:

- **Developer/kit variant** — J1, U4, D3, D4, D5 are populated; R22 is DNP. Programming uses the standard Espressif ESP-PROG adapter and cable through J1; the LDO regulates the OR'd V_PROG-or-VDD node down to VCC (3.3 V) so the module can't be damaged if the adapter is mis-jumpered to 5 V output. This is the V2.9 prototype build.
- **Production variant** — R22 is populated and J1 / U4 / D3 / D4 / D5 are DNP. The zero-ohm link bridges the board's regulated 3.3 V supply directly to VCC; programming uses a custom pogo-pin fixture contacting the J1 THT pad footprint from the rear of the board.

The two variants are **mutually exclusive — never populate both R22 and U4** (would short the LDO output to its own input through R22).

**Housing-side note (developer/kit).** The MDD400 housing includes a rear port opening sized for an ESP-PROG IDC cable, sealed with a rubber waterproof cover when not in use. J1's interior board position (30 mm from the nearest edge) is intentional to align with this port; in production the cover is permanent and a pogo-pin fixture is used from the rear instead.

---

## Functional specification and design objectives

- Expose a programming interface compatible with Espressif's standard ESP-PROG 6-pin adapter for the developer/kit build.
- Protect U3 from over-voltage if the ESP-PROG jumper is inadvertently set to 5 V instead of 3.3 V.
- OR the on-board VDD (5 V) bus with the programmer's V_PROG (5 V) so the LDO is supplied whether the board is independently powered or not.
- Prevent the programmer's V_PROG rail from back-feeding either the board's VDD bus or its VCC rail.
- Provide a zero-cost path to delete all programmer-side parts in production where a pogo-pin fixture replaces the IDC socket.

---

## How it works

### J1 — ESP-PROG-compatible IDC header

J1 (XFCN BH254V-6P) is a 2×3, 2.54 mm pitch through-hole IDC header matching the standard Espressif ESP-PROG pinout. The signal assignment matches the WTI400 V1.2 implementation:

| Pin | Net | ESP-PROG function |
|---|---|---|
| 1 | V_PROG | Programmer 5 V supply |
| 2 | ESP_TX | UART0 TX (out from module) |
| 3 | ESP_RX | UART0 RX (in to module) |
| 4 | GNDREF | Ground |
| 5 | ESP_BOOT | IO0 boot-strap |
| 6 | ESP_EN | Reset / EN |

TX and RX are named from the module's perspective; the ESP-PROG adapter handles the crossover internally.

### Dual-Schottky-OR'd LDO chain (developer/kit variant)

Three 1N5819WS Schottky diodes (D3, D4, D5) form a supply-OR'ing and protection network around U4:

```
VDD (5 V from board)  ─┐
                       ├─ D4 (anode VDD,   cathode V_PROG)
J1 pin 1 V_PROG       ─┴────────────────────────────┐
                                                    │
                       D3 (anode V_PROG, cathode Net-(D3-K))
                                                    │
                                            U4 V_IN ─┘
                                            U4 (HT7833 3.3 V LDO)
                                            U4 V_OUT = VCC
                                                    │
                                     D5 (anode VCC, cathode U4 V_IN)
```

**D4** (VDD → V_PROG OR'ing). With the programmer disconnected (J1 V_PROG = 0 V), D4 forward-biases from VDD into the V_PROG net so U4 still has an input source — the developer/kit board can run from its own VDD without an external programmer plugged in. With the programmer attached and active (V_PROG = 5 V), D4 reverse-biases (because V_PROG > VDD by the V_F headroom), isolating the V_PROG node from the on-board 5 V bus.

**D3** (V_PROG → U4 V<sub>IN</sub> forward isolation). Carries the LDO supply current in both topologies above. With the programmer disconnected and the board independently powered, D3 prevents any path from VCC (held briefly by output caps during start-up transients) back-feeding the V_PROG net via U4's internal body diode.

**D5** (Vout-to-Vin protection). Cathode at Net-(D3-K) (U4 V<sub>IN</sub>), anode at VCC. During normal LDO operation, U4 V<sub>IN</sub> sits ~1.0 V above VCC and D5 is reverse-biased. During power-down, the LDO input collapses while the output capacitors (C1, C16, C26) hold VCC for a few milliseconds; when VCC &gt; U4 V<sub>IN</sub>, D5 conducts and bleeds VCC back through D5 to U4 V<sub>IN</sub>, preventing the output caps from back-charging U4 through its body diode. Same topology as D16 on the [Power Supplies](./power-supplies) sheet and D5 on the WTI400 V1.2 esp32_module sheet.

The MDD400 LDO path therefore has **two** Schottky drops in the forward direction when the board is powering itself (VDD → D4 → V_PROG → D3 → U4 V<sub>IN</sub>), versus the WTI400's **one** drop (V_PROG → D4 → U4 V<sub>IN</sub>). The MDD400 needs the second drop because the dev/kit topology has to OR the on-board VDD bus into the same V_PROG node; the WTI400 has no VDD bus to merge in and the simpler chain suffices.

### LDO input decoupling

PCB review Verification #2 notes that the nearest dedicated capacitor to U4 V<sub>IN</sub> is C22 (100 nF) at ~3.3 mm — outside the &le; 1 mm tight-decoupling guideline. The Net-(D3-K) trace is short and the LDO is stable at the load currents in use; this is acceptable as a dev/kit-variant concern. The LDO **output**-side decoupling (C16 / C17 and the broader VCC pour) is described on the [ESP32 Module](./esp32-module) page — those caps double as VCC bypass on the host side.

### Production variant

R22 (0 Ω 0603) is populated, J1 / U4 / D3 / D4 / D5 are DNP. The zero-ohm link bridges the board's regulated 3.3 V supply directly to VCC. A custom pogo-pin fixture contacts the J1 THT pad footprint from the rear of the board; the board's own VCC supplies the programming session current. Once production-flashed and the rear cover is permanent, no further programmer access is required.

---

## Performance review

| Parameter | Value | Notes |
|-----------|-------|-------|
| D3, D4, D5 part | JSMSEMI 1N5819WS, 40 V / 350 mA, SOD-323 | Same Schottky across all three positions |
| 1N5819WS V<sub>F</sub> @ ~200 mA | 0.35 V typ / 0.40 V worst | Per JSMSEMI datasheet |
| U4 V<sub>IN</sub> (typical, board-powered VDD path) | 4.30 V | 5.00 V − 2 × 0.35 V (D4 then D3) |
| U4 V<sub>IN</sub> (typical, programmer path) | 4.65 V | 5.00 V − 0.35 V (D3 only) |
| U4 dropout at 300 mA | 0.30 V | HT7833 datasheet |
| U4 headroom (board-powered, typical) | 0.70 V | 4.30 V − (3.3 V + 0.30 V dropout) — passes |
| U4 headroom (programmer-powered, typical) | 1.05 V | 4.65 V − (3.3 V + 0.30 V dropout) — passes |
| U4 P<sub>d</sub> @ 300 mA Wi-Fi TX peak | 0.51 W | Conservative reference (5 V rail) |
| U4 P<sub>d</sub> @ 200 mA Wi-Fi average | 0.34 W | Conservative reference |
| U4 R<sub>θJA,eff</sub> (as-built) | ~60 °C/W | 64 mm² F.Cu + 16 thermal vias + 64 mm² B.Cu + full-board internal planes |
| U4 T<sub>j</sub> @ 300 mA, 70 °C amb | 100.6 °C | 24.4 °C margin (19.5 %) to 125 °C — **flagged: under 20 % margin** |
| U4 T<sub>j</sub> @ 200 mA, 70 °C amb | 90.4 °C | 34.6 °C margin (27.7 %) |
| U4 T<sub>j</sub> @ 450 mA abs-max, 70 °C amb | 115.9 °C | 9.1 °C margin (7.3 %) — abs-max scenario only |
| U4 tab net | V<sub>IN</sub> (Net-(D3-K)) | **Tab is V<sub>IN</sub>, not GND** — layout must not connect to GNDREF |
| ESP_TX / ESP_RX straight-line distance | ~29.5 mm | Routed length unverified; if &gt; 50 mm add 33 Ω damping (V2.10 backlog) |
| Header type | 2×3, 2.54 mm IDC THT (XFCN BH254V-6P) | ESP-PROG compatible |

**Thermal margin caveat.** The 19.5 % margin at 300 mA / 70 °C ambient is below the standard 20 % safety threshold. This is a developer/kit-only concern (U4 is DNP in production) and the 70 °C marine ambient is the *rated* environment; the prototype is bench-tested at room temperature where the margin is much larger. Verifying T<sub>j</sub> on a powered prototype under a sustained Wi-Fi TX load is a bring-up test.

---

## Bring-up tests

1. **End-to-end programming via ESP-PROG** — Flash a known firmware image at 921600 baud over the standard ESP-PROG adapter and cable. Pass if the image flashes cleanly, the device boots, and Wi-Fi associates.
2. **VDD-only operation** — Disconnect the ESP-PROG cable; power the board from VDD alone. Pass if the LDO produces 3.30 V ±2 % and the ESP32 boots normally. Confirms D4 OR'ing path.
3. **D3 back-feed check** — Power the board from its own VDD only; probe J1 pin 1 (V_PROG). Pass if pin 1 measures &lt; 0.1 V above VDD − V<sub>F</sub>(D4) (any larger reading indicates leakage on the OR'd node).
4. **U4 thermal soak under Wi-Fi TX** — Run sustained 802.11b TX from cold start for 30 minutes; record U4 body temperature with a thermocouple every 5 minutes. Pass if peak T<sub>j</sub> stays below 110 °C in a 70 °C-ambient soak chamber, or below 80 °C at room ambient. If T<sub>j</sub> exceeds 110 °C, expand the F.Cu pour or add vias in V2.10.

---

## Components

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| U4 | HT7833 | UMW HT7833-A 3.3 V fixed-output LDO, SOT-89-3, 450 mA. Regulates the OR'd V_PROG/VDD node to VCC during developer/kit operation. **Developer/kit variant only** — DNP in production | [UMW HT7833-A](/assets/datasheets/mdd400-v2.9/HT7833.pdf) |
| D3 | 1N5819WS | JSMSEMI Schottky, 40 V / 350 mA, SOD-323. Forward isolation diode on the V_PROG path (anode V_PROG, cathode Net-(D3-K) = U4 V<sub>IN</sub>). **Developer/kit variant only** — DNP in production | [JSMSEMI 1N5819WS](/assets/datasheets/mdd400-v2.9/1N5819WS.pdf) |
| D4 | 1N5819WS | JSMSEMI Schottky, SOD-323. VDD-to-V_PROG OR'ing diode (anode VDD, cathode V_PROG). Lets the on-board 5 V VDD bus feed U4 when no external programmer is connected. **Developer/kit variant only** — DNP in production | [JSMSEMI 1N5819WS](/assets/datasheets/mdd400-v2.9/1N5819WS.pdf) |
| D5 | 1N5819WS | JSMSEMI Schottky, SOD-323. Vout-to-Vin protection on the LDO (cathode = U4 V<sub>IN</sub>, anode = VCC). Conducts only during power-down to discharge VCC output caps without back-charging U4. Same topology as D16 on the power_supplies sheet. **Developer/kit variant only** — DNP in production | [JSMSEMI 1N5819WS](/assets/datasheets/mdd400-v2.9/1N5819WS.pdf) |
| J1 | XFCN BH254V-6P | 2×3, 2.54 mm pitch THT IDC header — ESP-PROG-compatible programming interface. Maker/kit builds: socket fitted, rear-port housing access. **Production: DNP**, pogo-pin fixture used instead | [XFCN BH254V-6P](/assets/datasheets/mdd400-v2.9/BH254V-6P.pdf) |
| R22 | 0 Ω 0603 (DNP on V2.9) | Production-variant zero-ohm bridge: VCC ↔ regulated 3.3 V supply directly. Populated only when U4 / D3 / D4 / D5 / J1 are DNP. **Never populate alongside U4** | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |

The LDO **output**-side decoupling (C16 / C17 plus the distributed VCC-pour bypass) doubles as VCC bypass on the host side and is listed in the Components table on the [ESP32 Module](./esp32-module) page.

---

## References

- Espressif Systems, [*ESP-PROG Hardware Guide*](https://docs.espressif.com/projects/esp-iot-solution/en/latest/hw-reference/ESP-Prog_guide.html).
- UMW, [*HT7833-A SOT-89 LDO*](/assets/datasheets/mdd400-v2.9/HT7833.pdf).
- JSMSEMI, [*1N5819WS SOD-323 Schottky*](/assets/datasheets/mdd400-v2.9/1N5819WS.pdf).
- XFCN, [*BH254V-6P 2×3 2.54 mm IDC Header*](/assets/datasheets/mdd400-v2.9/BH254V-6P.pdf).
- Yageo, [*RC Group Chip Resistor*](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf).
- [ESP32 Module](./esp32-module) — host MCU; VCC bypass; EN / BOOT control-line networks.
- [Power Supplies](./power-supplies) — VCC rail generation; D5 mirrors D16 (Vout-to-Vin protection) on that sheet.
