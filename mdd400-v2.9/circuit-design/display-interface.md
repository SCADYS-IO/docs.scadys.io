---
title: Display Interface
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

import SchematicViewer from '@site/src/components/SchematicViewer';

<SchematicViewer src="/img/schematics/mdd400-v2.9/display_interface_a875a4a8.svg" alt="Display Interface schematic" />

:::note Hardware version
MDD400 **v2.9** — Fabricated prototype — testing phase
:::

## Components

| Ref | Value | Description | Datasheet |
|---|---|---|---|
| J4 | FPC 50-pin 0.5 mm | Xunpu FPC-05FB-50PH20 — top/bottom clamshell FPC connector for DWIN display | [Xunpu FPC-05FB-50PH20](https://en.xunpu.com.cn/product/388.html) |
| Q4 | AO3407A | P-channel 30 V / 4.2 A SOT-23 MOSFET — high-side display power switch | [AOS AO3407A](https://www.aosmd.com/pdfs/datasheet/AO3407A.pdf) |
| Q5 | S8050 | NPN 25 V / 1.5 A SOT-23 — MOSFET gate driver | [onsemi SS8050](https://www.onsemi.com/pdf/datasheet/ss8050-d.pdf) |
| FB3 | 600 Ω@100 MHz | Murata BLM31KN601SN1L, 1206 ferrite bead — display supply EMI filter | [Murata BLM31KN601SN1L](https://www.murata.com/en-us/products/productdetail?partno=BLM31KN601SN1L%40T) |
| C37 | 10 µF / 25 V | Murata GRM21BZ71E106KE15L, 0805 MLCC — display supply bulk bypass | [Murata GRM21BZ71E106KE15L](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L) |
| C38 | 100 nF / 50 V | Murata GRM188R71H104KA93D, X7R 0603 MLCC — display supply HF bypass | [Murata GRM188R71H104KA93D](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D) |
| R34 | 10 kΩ | Yageo RC0603FR-0710KL, 0603 — Q4 gate pull-up to VDD (display off by default) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R31 | 100 kΩ | Yageo RC0603FR-07100KL, 0603 — Q5 base pull-down to GNDREF | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |
| R35 | 100 kΩ | Yageo RC0603FR-07100KL, 0603 — Q5 base series resistor (DISP_EN to Q5 base) | [Yageo RC Series](https://www.yageo.com/upload/media/product/products/datasheet/rchip/PYu-RC_Group_51_RoHS_L_12.pdf) |

## How It Works

The display interface connects the DWIN DMG48480F040_01WTC 4.0-inch capacitive touch display to the ESP32-S3 via a 50-pin FPC connector (J4). Of the 50 FPC pins, only the power rails and UART2 signals (DISP_TX and DISP_RX) are used; all other FPC pins are left unconnected.

The 5 V display supply (VDSP) is switched by a high-side P-channel MOSFET power switch. The AO3407A (Q4) sits between the VDD rail and the display supply node. Its gate is normally held at VDD via a 10 kΩ pull-up (R34), keeping V_GS = 0 V and the display unpowered during MCU boot and reset. When the ESP32 drives DISP_EN (GPIO21) high, the S8050 NPN transistor (Q5) conducts and pulls the Q4 gate toward GNDREF through R34, producing V_GS ≈ −4.8 V — well past the AO3407A threshold — and switching Q4 fully on. R35 (100 kΩ) limits Q5 base current to approximately 19 µA, sufficient to saturate Q5 at the 480 µA collector current drawn through R34. R31 (100 kΩ) holds Q5 off when DISP_EN is floating or low.

After Q4, the display supply passes through FB3 (BLM31KN601SN1L, 600 Ω at 100 MHz) before reaching the C37/C38 decoupling network and J4. FB3 attenuates high-frequency conducted noise from the display's internal backlight switching converter, preventing it from propagating onto the shared 5 V rail.

The DWIN display uses the DGUS II proprietary serial protocol over UART2. DISP_TX (ESP32-S3 GPIO48) connects to the display's UART RX, and DISP_RX (ESP32-S3 GPIO47) receives responses and touch events. All UI rendering, touch processing, and animation are handled entirely by the display's internal T5L microcontroller — the ESP32 acts only as a serial host issuing DGUS II commands and reading status responses.

## Design Rationale

The power switch defaults off for two reasons: to prevent spurious display activity and power draw before firmware initialises; and to allow firmware to perform a hard display reset by briefly cycling DISP_EN low, useful for recovering from display lock-up states.

The DGUS II protocol was chosen because it offloads all UI rendering complexity to the display's internal CPU. The ESP32 only needs to update display variable registers and read touch events — no framebuffer management or graphics compositing is required. This is appropriate for a system where the MCU simultaneously manages CAN communication, sensor polling, and Wi-Fi/BT connectivity.

The ferrite bead (FB3) was placed on the supply side of the decoupling network — between Q4 drain and the bulk capacitors — so that C37/C38 can absorb transients from both the display load and any noise conducted from the supply side. Placing FB3 between the caps and J4 would defeat the filtering effect.

## PCB Layout

All power switch components occupy a compact cluster on F.Cu; J4 is on B.Cu at the opposite side of the board directly adjacent to the display mounting area.

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 1 | C37 within 5 mm of VDSP node (Q4 drain / FB3 output) | Partial | C37 at (110.465, 79.703) F.Cu; Q4 at (117.3, 81.9) F.Cu: ~7.2 mm centre-to-centre. FB3 at (112.89, 81.9) is between them at ~3.3 mm from C37. Q4 → FB3 → C37 placement is correct; distance within functional limits. |
| 2 | C38 co-located with C37 | Met | C38 at (113.715, 79.703); C37 at (110.465, 79.703): 3.25 mm, same Y. Both on F.Cu in same row — optimal HF bypass placement. |
| 3 | FB3 upstream of C37/C38 (between Q4 and caps) | Met | FB3 at (112.890, 81.900) between Q4 (117.3) and C37/C38 row (110–114, 79.7). Schematic topology confirmed. |
| 4 | Q5 adjacent to Q4 gate | Good-practice | Q5 at (113.3, 85.0); Q4 at (117.3, 81.9): ~5.1 mm. Acceptable for low-frequency gate drive application. |
| 5 | R31/R35 adjacent to Q5 base | Met | R31 at (116.775, 84.625) and R35 at (116.775, 86.025): ~3.5 mm from Q5 at (113.3, 85.0). Both on F.Cu, close proximity. |
| 6 | J4 on B.Cu | Met | J4 at (124.0, 80.0) B.Cu, 180° — flip-lock FPC connector on back of board. ✓ |

## Design Calculations

| Parameter | Formula | Result |
|---|---|---|
| Q5 base current (I_B) | (3.3 V − 0.7 V) / 100 kΩ − 0.7 V / 100 kΩ | **19 µA** |
| Q5 collector current (I_C) | (5.0 V − 0.2 V) / 10 kΩ | **480 µA** |
| h_FE required for Q5 saturation | I_C / h_FE_min = 480 µA / 40 | **12 µA I_B needed** → 19 µA available → saturated ✓ |
| Q4 V_GS when Q5 saturated | 0.2 V − 5.0 V | **−4.8 V** (threshold −0.45 V to −1.5 V → fully enhanced) ✓ |
| Q4 R_DS(on) at V_GS = −4.5 V | AO3407A datasheet | **52 mΩ typ** |
| V_DS drop at 400 mA | 0.4 A × 0.052 Ω | **21 mV** — negligible ✓ |
| Q4 power dissipation at 400 mA | 0.4² × 0.052 Ω | **8.3 mW** — well within SOT-23 limits ✓ |
| FB3 voltage drop at 400 mA | 0.4 A × 0.05 Ω | **20 mV** — negligible ✓ |
| FB3 current margin | (3.0 A − 0.4 A) / 3.0 A | **86.7%** ✓ |
| C37 voltage stress | 5.0 V / 25 V rated | **20%** — well within 50% derating guideline ✓ |

:::caution Verification required — Fabricated prototype — testing phase

**Verify during bring-up:**
- **Display operating current**: Measure VDSP current at startup and under sustained backlight load. Performance review uses 400 mA as a conservative estimate — actual current may differ. Confirm within Q4 and FB3 ratings. *(performance_review Gap 1)*
- **Q4 gate voltage**: With DISP_EN = HIGH, measure Q4 gate voltage and confirm it is pulled to ≤ 0.5 V, verifying Q5 fully saturates and Q4 enters full enhancement. *(performance_review Gap 1)*
- **J4 supply pin proximity**: Confirm from Gerber / PCB editor the trace length between C37/C38 and the VDSP supply pin(s) of J4. The J4 centre at (124.0, 80.0) is ~13.5 mm from C37; actual supply pin location depends on DWIN FPC pinout and J4 orientation. *(pcb_review Gap 1)*

**For next version:**
- **C37 MPN dielectric confirmation**: Confirm actual temperature characteristic of GRM21BZ71E106KE15L ("BZ" series code). If dielectric is Y5V or Z5U, effective capacitance at 5 V DC bias may be substantially less than 10 µF — consider replacing with an X5R-rated part if effective capacitance is < 4.7 µF. *(v2.10-improvements)*
- **LCSC URLs in schematic**: Replace LCSC property URLs on C37 and C38 in `display_interface.kicad_sch` with Murata manufacturer URLs. *(v2.10-improvements)*
:::

## References

1. DWIN, [*DMG48480F040_01WTC Capacitive Touch Display Datasheet*](/assets/pdf/mdd400-v2.9/DMG48480F040_01WTC_Datasheet.pdf)
2. DWIN, [*T5L DGUS II Application Development Guide V2.9*](/assets/pdf/mdd400-v2.9/T5L_DGUSII-Application-Development-Guide-V2.9-0207.pdf)
3. AOS, [*AO3407A P-Channel MOSFET Datasheet*](https://www.aosmd.com/pdfs/datasheet/AO3407A.pdf)
4. onsemi, [*SS8050 NPN Transistor Datasheet*](https://www.onsemi.com/pdf/datasheet/ss8050-d.pdf)
5. Murata, [*BLM31KN601SN1L Ferrite Bead*](https://www.murata.com/en-us/products/productdetail?partno=BLM31KN601SN1L%40T)
6. Murata, [*GRM21BZ71E106KE15L 10 µF 0805 MLCC*](https://www.murata.com/en-us/products/productdetail?partno=GRM21BZ71E106KE15L)
7. Murata, [*GRM188R71H104KA93D 100 nF 0603 MLCC*](https://www.murata.com/en-us/products/productdetail?partno=GRM188R71H104KA93D%40D)
8. Xunpu, [*FPC-05FB-50PH20 50-pin FFC Connector*](https://en.xunpu.com.cn/product/388.html)
