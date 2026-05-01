---
title: ESP32 Module
---

import useBaseUrl from '@docusaurus/useBaseUrl';

<img src={useBaseUrl('/img/schematics/mdd400/esp32_module.svg')} alt="ESP32 Module schematic" />

## Components

| Ref | Value | Description |
|-----|-------|-------------|
| U3 | ESP32-S3-WROOM-1-N16R8 | ESP32-S3 Wi-Fi/BT module, 16 MB flash, 8 MB PSRAM |
| U4 | HT7833 | 3.3 V 450 mA LDO regulator, SOT-89 |
| J1 | 2×3 2.54 mm | IDC programming header (ESP-PROG compatible) |
| Q1 | BC807-25 | 45 V 500 mA PNP BJT — status LED driver |
| D2 | AMBER | Amber status LED, 0603 |
| D3–D5 | 1N5819WS | 40 V 350 mA Schottky diodes — power steering |
| R4 | 10 kΩ | ESP_EN pull-up |
| R8 | 6.8 kΩ | LED base bias resistor |
| R14 | 390 Ω | LED current-limiting resistor |
| R15 | 10 kΩ | LED_EN pull-down |
| R22 | 0 Ω | Solder-selectable link |
| R24 | 10 kΩ | ESP_BOOT pull-up |
| C1,C16,C26 | 10 µF/25 V | Bulk supply decoupling |
| C2,C17,C22,C29 | 100 nF/50 V | High-frequency supply decoupling |
| C3 | 1 µF/25 V | LDO output capacitor |
| C4 | 100 pF/50 V | RF bypass |

## How It Works

The ESP32-S3-WROOM-1 module (U3) is the main application processor. It communicates with the rest of the board through global net labels: TWAI\_TX/RX drive the CAN transceiver, DISP\_TX/RX and DISP\_EN drive the display, ST\_TX/RX/EN drive the Legacy Serial interface, I2C\_SDA/SCL connect to the sensor bus, and AUDIO\_PWM drives the buzzer. ESP\_TX and ESP\_RX (GPIO 43/44, UART0) are available on the programming header J1 for debug access.

The HT7833 LDO (U4) provides an initial 3.3 V supply to VCC as soon as power is applied, before the LMR51610 DC-DC converters in the power supplies sheet have completed their start-up sequence. Three 1N5819WS Schottky diodes (D3–D5) steer power between the LDO output and the DC-DC output to VCC, whichever is higher, preventing back-flow and allowing seamless handover.

The status LED circuit uses a PNP transistor (Q1) with base drive through R8 and R14. The LED\_EN signal from GPIO 9 is active-low — pulling it low saturates Q1 and turns the LED on. A 10 kΩ base pull-down (R15) biases Q1 on by default if LED\_EN is floating during boot, ensuring a power-good indication even before the firmware configures the GPIO. The schematic note confirms this: the firmware should drive LED\_EN high to disable the LED.

The programming header J1 follows the standard ESP-PROG 2×3 pinout. ESP\_TX, ESP\_RX, ESP\_EN, and ESP\_BOOT are all available, allowing firmware download over UART0 or JTAG. The R22 zero-ohm link provides a board-level option to disconnect a net if needed during bring-up.

## Design Rationale

The N16R8 variant of the ESP32-S3-WROOM-1 was chosen for its 8 MB octal-PSRAM, which allows the firmware to keep large NMEA 2000 data structures and display frame buffers in external memory while running the RTOS from internal SRAM. The 16 MB flash supports over-the-air firmware updates with dual-bank partitioning.

The HT7833 LDO start-up supply is a pragmatic choice: the LMR51610 DC-DC converters require a minimum input voltage of 4 V and several milliseconds to ramp, but the ESP32 must release its EN line only when VCC is stable. The LDO bridges that gap without adding a sequencing IC. At steady state the LDO is reverse-biased by the higher DC-DC output and carries no current.

The default-on LED behaviour during boot was a deliberate firmware-robustness decision. A module that has lost its firmware or is stuck in a boot loop will still illuminate the status LED, making field diagnosis straightforward without requiring UART access.
