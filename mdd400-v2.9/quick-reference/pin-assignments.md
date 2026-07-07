---
title: Pin Assignments
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — testing phase"
---

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype — testing phase

:::

## GPIO map

| Label | GPIO | Bias | Function | Description |
|---|---|---|---|---|
| AUDIO_PWM | GPIO10 | GNDREF | PWM | Audio buzzer driver |
| DISP_EN | GPIO21 | GNDREF | OUTPUT | TFT display enable (ENABLE = HIGH) |
| DISP_RX | GPIO47 | float | UART2 | From display TX pin |
| DISP_TX | GPIO48 | float | UART2 | To display RX pin |
| ESP_BOOT | GPIO0 | VCC | BOOT | ESP-PROG pin 6 |
| ESP_EN | EN | VCC | BOOT | ESP-PROG pin 1 |
| ESP_RX | GPIO44 | float | UART0 | ESP-PROG pin 5 |
| ESP_TX | GPIO43 | float | UART0 | ESP-PROG pin 3 |
| I2C_SCL | GPIO8 | VCC | I²C | I²C clock line |
| I2C_SDA | GPIO18 | VCC | I²C | I²C data line |
| LED_EN | GPIO9 | GNDREF | OUTPUT | LED enable (ENABLE = LOW) |
| ST_EN | GPIO1 | VCC | OUTPUT | Legacy serial TX enable (ENABLE = HIGH) |
| ST_RX | GPIO39 | float | UART1 | From legacy serial RX |
| ST_TX | GPIO41 | float | UART1 | To legacy serial TX |
| TWAI_RX | GPIO12 | float | TWAI | From CAN transceiver RXD pin |
| TWAI_TX | GPIO13 | float | TWAI | To CAN transceiver TXD pin |
| TWAI_EN | GPIO14 | GNDREF | TWAI | Pull up to enable CAN transceiver |

For the design rationale behind each assignment, see the corresponding [Circuit Design](../circuit-design/index.md) page.

## I²C addresses

| Device | I²C Address | Ref | Notes |
|---|---|---|---|
| TMP112 Temperature Sensor | 0x48 | U13 | ADD0 tied to GND |
| OPT3004 Ambient Light Sensor | 0x44 | U12 | ADDR pin tied to GND |
| INA219 Power Monitor | 0x40 | U2 | A1, A0 both tied to GND |
