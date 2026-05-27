---
title: Pin Assignments
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel"
---

:::note[Hardware version]

WTI400 **v1.2** — In service — installed on test vessel

:::

## GPIO map

| Label | GPIO | Bias | Function | Description |
|---|---|---|---|---|
| I2C_SCL | GPIO8 | VCC | I²C | I²C clock — R3 10 kΩ pull-up to VCC |
| I2C_SDA | GPIO18 | VCC | I²C | I²C data — R4 10 kΩ pull-up to VCC |
| TWAI_RX | GPIO12 | float | TWAI | CAN RX from SN65HVD234 TXD (R14 47 Ω series) |
| TWAI_TX | GPIO13 | VCC | TWAI | CAN TX to SN65HVD234 RXD (R15 10 kΩ pull-up) |
| TWAI_EN | GPIO14 | GNDREF | TWAI | CAN transceiver enable — R16 10 kΩ pull-down; pull HIGH to enable |
| WIND_X | GPIO10 | float | ADC1 CH9 | X-axis wind angle — analog via U12A op-amp |
| WIND_Y | GPIO11 | float | ADC2 CH0 | Y-axis wind angle — analog via U12B op-amp |
| WIND_SPD | GPIO21 | float | INPUT | Wind speed pulse — Schmitt-triggered via U11 74LVC1G17 |
| WND_EN | GPIO47 | VCC | OUTPUT | Wind transducer supply enable — LP2951 U13 SHUTDOWN (R55 10 kΩ, active LOW) |
| WND_ERR | GPIO48 | VCC | INPUT | Wind transducer supply error — LP2951 U13 ERROR (R65 10 kΩ pull-up, open-drain, active LOW) |
| LED_RED | GPIO17 | GNDREF | OUTPUT | Red LED — Q1 PNP fail-on driver (R6 68 kΩ pulls base LOW by default; HIGH overrides) |
| LED_GRN | GPIO15 | VCC | OUTPUT | Green LED — R11 220 Ω, active LOW, common-anode D1 (R7 10 kΩ pull-up) |
| LED_BLU | GPIO7 | VCC | OUTPUT | Blue LED — R10 220 Ω, active LOW, common-anode D1 (R8 10 kΩ pull-up) |
| BUTTON | GPIO40 | VCC | INPUT | User button — R41 10 kΩ pull-up, R31 series, U10 Schmitt, R40/C38 RC debounce (τ = 39 ms) |
| ST_TX | GPIO41 | float | UART1 | Legacy serial TX — to opto-isolator U7 TLP2309 |
| ST_RX | GPIO39 | VCC | UART1 | Legacy serial RX — from opto-isolator U6 TLP2309 (R19 2.2 kΩ pull-up) |
| ST_EN | GPIO1 | VCC | OUTPUT | Legacy serial TX enable — R20 10 kΩ pull-up, active LOW; HIGH = TX disabled |
| ESP_TX | GPIO43 | float | UART0 | Programming UART TX — ESP-PROG J1 pin 3 |
| ESP_RX | GPIO44 | float | UART0 | Programming UART RX — ESP-PROG J1 pin 5 |
| ESP_EN | EN | VCC | BOOT | Chip enable / reset — R9 10 kΩ pull-up, C7 1 µF power-on delay (τ = 10 ms) |
| ESP_BOOT | GPIO0 | VCC | BOOT | Boot mode select — R18 10 kΩ pull-up, C22 100 nF; LOW at reset = ROM download mode |

For the design rationale behind each assignment, see the corresponding [Circuit Design](../circuit-design/index.md) page.

## I²C addresses

| Device | I²C Address | Ref | Notes |
|---|---|---|---|
| LSM6DSLTR 6DoF IMU | 0x6A | U1 | SA0 = GND (pin 1); CS = VDDIO (pin 12) selects I²C mode |

**Bus configuration:** R3 / R4 = 10 kΩ pull-ups to VCC. Rise time τ_r = 254 ns at C_bus = 30 pF (passes Standard and Fast mode). Maximum C_bus for Fast mode (400 kHz) with 10 kΩ pull-ups is 35 pF. Current firmware: Standard mode (100 kHz).
