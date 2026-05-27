---
title: Programming Socket
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — test vessel (~1,000 sea miles)"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

:::note[Hardware version]

WTI400 **v1.2** — In service on the test vessel. The page covers the **developer/kit** assembly variant currently fitted (U4 / D4 / D5 / J1 populated, R24 DNP); the *Production variant* section below describes the configuration the same PCB will carry once volume builds use the pogo-pin fixture.

:::

## Overview

This page documents the WTI400 firmware-programming hardware on `esp32_module.kicad_sch`: the ESP-PROG-compatible IDC header J1, the optional HT7833 LDO (U4) with its isolation Schottky diodes (D4, D5), and the production-variant zero-ohm bridge (R24) that takes their place. The host MCU and its supply bypass are on the [ESP32 Module](./esp32-module) page.

<SchematicViewer src="/img/schematics/wti400-v1.2/esp32_module_d5db8452.svg" alt="ESP-PROG programming socket sub-circuit — J1 (2×3 2.54 mm IDC header, ESP-PROG-compatible), D4 (input isolation Schottky), U4 (HT7833 3.3 V LDO), D5 (Vout-to-Vin protection Schottky), R24 (zero-ohm production-variant link), and LDO-input decoupling C20 + C21." initialFocus="13.335 107.95 132.715 82.55" />

The two assembly variants share the same footprint:

- **Developer/kit variant** — J1, U4, D4, D5 are populated; R24 is DNP. Programming is done with the standard Espressif ESP-PROG adapter and cable through J1; the LDO regulates the programmer's V_PROG (nominally 5 V) down to VCC (3.3 V) so the module can't be damaged if the adapter is mis-jumpered to 5 V output. This is the V1.2 build deployed on the test vessel.
- **Production variant** — R24 is populated and J1 / U4 / D4 / D5 are DNP. The zero-ohm link bridges VCC directly to V_PROG; programming uses a custom pogo-pin fixture contacting the J1 THT pad footprint from the top side of the board, and the board's own VCC powers the programming session.

The two variants are **mutually exclusive — never populate both R24 and U4** (would short the LDO output to its own input through R24 in an uncontrolled way).

---

## Functional specification and design objectives

- Expose a programming interface compatible with Espressif's standard ESP-PROG 6-pin adapter for the developer/kit build, so off-the-shelf tools can flash and debug the device.
- Protect U3 from over-voltage if the ESP-PROG jumper is inadvertently set to 5 V instead of 3.3 V.
- Prevent the programmer from being back-fed by the board's own VCC rail when both are connected.
- Provide a zero-cost path to delete all programmer-side parts in volume production where a pogo-pin fixture replaces the IDC socket.

---

## How it works

### J1 — ESP-PROG-compatible IDC header

J1 (XFCN BH254V-6P) is a 2×3, 2.54 mm pitch through-hole IDC header matching the standard Espressif ESP-PROG pinout. From the module's frame of reference:

| Pin | Net | ESP-PROG function |
|---|---|---|
| 1 | ESP_EN | Reset / EN |
| 2 | V_PROG | Programmer 5 V supply |
| 3 | ESP_TX | UART0 TX (out from module) |
| 4 | GNDREF | Ground |
| 5 | ESP_RX | UART0 RX (in to module) |
| 6 | ESP_BOOT | IO0 boot-strap |

TX and RX are named from the module's perspective; the ESP-PROG adapter performs the crossover internally. The pinout has been verified working with the standard ESP-PROG cable on both WTI400 V1.2 and MDD400 V2.9.

### Developer/kit V_PROG path

The current path from the programmer to VCC is a single forward-isolation Schottky followed by an LDO:

```
J1 pin 2 V_PROG (5 V from programmer)
   → D4 anode  (1N5819WS Schottky, forward isolation)
   → D4 cathode = U4 V_IN = Net-(D4-K)
   → U4 (HT7833 3.3 V LDO, SOT-89-3)
   → U4 V_OUT = VCC (3.3 V)
```

**D4 — forward isolation / back-feed protection.** When the programmer is disconnected and the board is powered normally (VCC = 3.3 V from the on-board SMPS), D4's anode sits at 0 V (J1 pin 2 unloaded) while its cathode is at U4 V<sub>IN</sub> ≈ VCC during start-up. D4 is reverse-biased and prevents any current path from board VCC back into the programmer's V_PROG pin.

**D5 — Vout-to-Vin protection.** Cathode at Net-(D4-K) (U4 V<sub>IN</sub>), anode at VCC. During normal LDO operation, U4 V<sub>IN</sub> sits ~1.35 V above VCC and D5 is reverse-biased (no current). During programmer-disconnection, the LDO input collapses while the VCC output capacitors (notably the C1 + C16 cluster) hold VCC for a few milliseconds. When VCC > U4 V<sub>IN</sub>, D5 conducts and bleeds VCC back through D5 to U4 V<sub>IN</sub>, preventing the output caps from back-charging U4 through its internal body diode. Same topology as D16 on the [Power Supply](./power-supplies) sheet.

The WTI400 LDO path has **one** isolation Schottky in the forward direction (D4), as opposed to MDD400's two in series — the WTI400 has no separate 5 V VDD bus that needs OR-ing protection at the same node, so the simpler chain suffices.

### LDO input decoupling

C20 (100 nF X7R 0603) and C21 (10 µF X7R 0805) sit on Net-(D4-K), 3.6 mm and 5.4 mm from U4 V<sub>IN</sub> respectively. Two-tier decoupling on the LDO input is required by the HT7833 datasheet for stable regulation. The LDO output decoupling (C16 / C17) is described on the [ESP32 Module](./esp32-module) page — those caps double as VCC bypass on the host side.

### Production variant

R24 (0 Ω 0805) is populated, J1 / U4 / D4 / D5 are DNP. The zero-ohm link bridges VCC directly to V_PROG. A custom pogo-pin fixture contacts the J1 THT pad footprint from the top side; the board's own VCC supplies the programming session current, so no external 5 V source is needed during flashing. Once production-flashed and the cover is fitted, no further programmer access is required for normal field operation.

---

## Performance review

| Parameter | Value | Notes |
|-----------|-------|-------|
| D4 V<sub>F</sub> at ~200 mA | 0.35 V typ / 0.40 V worst | JSMSEMI 1N5819WS |
| U4 V<sub>IN</sub> (typical) | 4.65 V | V_PROG 5.00 V − 0.35 V D4 |
| U4 dropout at 300 mA | 0.30 V | HT7833 datasheet |
| U4 headroom (typical) | 1.05 V | 4.65 V − (3.3 V + 0.30 V) — passes |
| U4 P<sub>d</sub> @ 100 mA programming | 0.135 W | (4.65 − 3.3) × 0.10 |
| U4 P<sub>d</sub> @ 450 mA abs-max | 0.608 W | Reference; not the operating point |
| U4 R<sub>θJA,eff</sub> (as-built) | ~50 °C/W | 56 mm² 4-layer copper + 9 thermal vias |
| U4 T<sub>j</sub> @ 100 mA, 70 °C amb | 76.8 °C | 48.2 °C margin (38 %) to 125 °C T<sub>j,max</sub> |
| U4 tab net | V<sub>IN</sub> (Net-(D4-K)) | **Tab is V<sub>IN</sub>, not GND** — layout must not connect to GNDREF |
| ESP_TX trace length | 33.1 mm | Under 50 mm; no series damping needed |
| ESP_RX trace length | 30.6 mm | Under 50 mm; no series damping needed |
| ESP_EN trace length | 57.1 mm | Exceeds 50 mm guideline; RC-limited signal — accepted for V1.2 |
| Schottky type | JSMSEMI 1N5819WS, 40 V / 350 mA, SOD-323 | D4 + D5 same part |
| Header type | 2×3, 2.54 mm IDC THT (XFCN BH254V-6P) | ESP-PROG compatible |

**Why thermal is fine even at modest copper spreading.** U4 is only active during programming sessions. During normal operation (Wi-Fi running, programmer disconnected) the V_PROG path is at 0 V, D4 is reverse-biased, U4 sees no input voltage, and U4 dissipates nothing. The 76.8 °C / 100 mA / 70 °C-ambient figure above is for a worst-case programming session in a hot enclosure — outside that window U4 is dormant.

---

## Bring-up tests

1. **End-to-end programming via ESP-PROG** — Flash a known firmware image at 921600 baud over the standard ESP-PROG adapter and cable. Pass if the image flashes cleanly, the device boots, and Wi-Fi associates. *(Confirmed working on WTI400 V1.2 and MDD400 V2.9.)*
2. **D4 back-feed check** — Power the board from its own SMPS only, with the programmer disconnected. Probe J1 pin 2 (V_PROG). Pass if pin 2 measures &lt; 0.1 V (any voltage above this indicates leakage through D4 or contamination).
3. **U4 thermal soak during programming** — Hold the SoC in ROM download mode while the programmer drives sustained UART traffic for 60 s. Probe U4 body temperature with a contact thermocouple. Record peak. Pass if peak ≤ 95 °C in a 70 °C ambient (≥ 30 °C T<sub>j</sub> margin).

---

## Components

| Ref | Value | Function | Datasheet |
|-----|-------|----------|-----------|
| U4 | HT7833 | UMW HT7833-A 3.3 V fixed-output LDO, SOT-89-3, 450 mA. Regulates programmer V_PROG to VCC during firmware flashing. **Developer/kit variant only** — DNP in production builds | [UMW HT7833-A](https://www.lcsc.com/datasheet/C347195.pdf) |
| D4 | 1N5819WS | JSMSEMI Schottky, 40 V / 350 mA, SOD-323. Input isolation Schottky on the V_PROG path (anode = J1 V_PROG, cathode = U4 V<sub>IN</sub>). Prevents back-feed from VCC to the programmer | [JSMSEMI 1N5819WS](/assets/datasheets/wti400-v1.2/1N5819WS.pdf) |
| D5 | 1N5819WS | JSMSEMI Schottky, SOD-323. Vout-to-Vin protection on the LDO (cathode = U4 V<sub>IN</sub>, anode = VCC). Conducts only during power-down to discharge VCC output caps without back-charging U4. Same topology as D16 on the power_supplies sheet | [JSMSEMI 1N5819WS](/assets/datasheets/wti400-v1.2/1N5819WS.pdf) |
| J1 | XFCN BH254V-6P | 2×3, 2.54 mm pitch THT IDC header — ESP-PROG-compatible programming interface. **Developer/kit variant only** | [XFCN BH254V-6P](/assets/datasheets/wti400-v1.2/XFCN-BH254V-6P.pdf) |
| R24 | 0 Ω 0805 (DNP on V1.2) | Production-variant zero-ohm bridge VCC ↔ V_PROG. Populated only when U4 / D4 / D5 / J1 are DNP. **Never populate alongside U4** | [Yageo RC Group](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| C20 | 100 nF / 50 V X7R 0603 | LDO input bypass (Net-(D4-K) to GNDREF), 3.6 mm from U4 V<sub>IN</sub> | [Murata GCM188R71H104KA57D](https://www.murata.com/en-us/products/productdetail?partno=GCM188R71H104KA57D) |
| C21 | 10 µF / 25 V X7R 0805 | LDO input bulk bypass (Net-(D4-K) to GNDREF), 5.4 mm from U4 V<sub>IN</sub> | [Murata GRM21BZ71E106KE15L](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |

The LDO **output**-side decoupling caps (C16 / C17) double as VCC bypass on the host side and are listed in the Components table on the [ESP32 Module](./esp32-module) page.

---

## Testing & Verification

:::caution

The developer/kit assembly variant (J1 / U4 / D4 / D5 populated, R24 DNP) is the build deployed on the test vessel. End-to-end programming via the standard Espressif ESP-PROG adapter has been confirmed working on both WTI400 V1.2 and MDD400 V2.9, and field firmware updates have been performed on the test-vessel unit without observed failures. **No quantitative bench measurements have been performed on D4 back-feed leakage, U4 thermal soak during sustained programming traffic, or the production-variant R24 path under any pogo-pin fixture.** The following are required.

**Hardware bring-up (rig at the bench, developer/kit variant):**

- **End-to-end programming via ESP-PROG** &mdash; Flash a known firmware image at 921600 baud over the standard ESP-PROG adapter and cable. Pass if the image flashes cleanly, the device boots, and Wi-Fi associates. (Confirmed working on WTI400 V1.2 and MDD400 V2.9.)
- **D4 back-feed check** &mdash; Power the board from its own SMPS only, with the programmer disconnected. Probe J1 pin 2 (V_PROG). Pass if pin 2 measures &lt; 0.1 V (any voltage above this indicates leakage through D4 or contamination).
- **U4 thermal soak during programming** &mdash; Hold the SoC in ROM download mode while the programmer drives sustained UART traffic for 60 s. Probe U4 body temperature with a contact thermocouple and record peak. Pass if peak &le; 95 &deg;C in a 70 &deg;C ambient (&ge; 30 &deg;C Tj margin).

**For production variant (R24 populated, J1 / U4 / D4 / D5 DNP):**

- **Pogo-pin fixture programming** &mdash; Once the pogo-pin fixture exists, verify end-to-end flashing through it using the board's own VCC for the programming session. Confirm no contamination, no over-stress, and matching pinout to the J1 THT pad footprint.

**For V1.3 (tracked in `v1.3-improvements.md`):**

- **Shorten the ESP_EN routing** &mdash; V1.2 has a 57.1 mm ESP_EN trace from J1 through R9 / C7 to U3 pad 3 (EN). Re-route R9 / C7 closer to U3's EN pad to bring the trace below the 50 mm guideline. (Also tracked on the [ESP32 Module](./esp32-module) page.)

:::

---

## References

- Espressif Systems, [*ESP-PROG Hardware Guide*](https://docs.espressif.com/projects/esp-iot-solution/en/latest/hw-reference/ESP-Prog_guide.html).
- UMW, [*HT7833-A SOT-89 LDO*](https://www.lcsc.com/datasheet/C347195.pdf).
- JSMSEMI, [*1N5819WS SOD-323 Schottky*](/assets/datasheets/wti400-v1.2/1N5819WS.pdf).
- XFCN, [*BH254V-6P 2×3 2.54 mm IDC Header*](/assets/datasheets/wti400-v1.2/XFCN-BH254V-6P.pdf).
- Yageo, [*RC Group Chip Resistor*](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf).
- [ESP32 Module](./esp32-module) — host MCU; VCC bypass; EN / BOOT control-line networks.
- [Power Supply](./power-supplies) — VCC rail generation; D5 mirrors D16 (Vout-to-Vin protection) on that sheet.
