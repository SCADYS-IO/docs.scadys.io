# ESP32-S3 GPIO Allocation

| GPIO    | Assigned to | Description                               |
| ------- | ----------- | ----------------------------------------- |
| GP0     |  `ESP_BOOT`       | *strapping pin, pull up, to ESP_PROG `ESP_BOOT`*  |
| GP1     |  [`ST_EN`](../../quick_reference.md)      | SeaTalk TX enable                         |
| GP2     |  `ST_TX`      | UART1 TX to SeaTalk TX                    |
| GP3     |             | *strapping pin, floating*                   |
| GP4     |             | unused, available                         |
| GP5     |             | unused, available                         |
| GP6     |             | unused, available                         |
| GP7     |             | unused, available                         |
| GP8     |  `I2C_SDA`        | I²C data (sensors)                        |
| GP9     |             | unused, available                         |
| GP10    | `AUDIO_PWM`  | PWM audio output                          |
| GP11    |             | unused, available                         |
| GP12    |             | unused, available                         |
| GP13    |  `TWAI_RX`    | CAN RX                                    |
| GP14    |  `TWAI_TX`    | CAN TX                                    |
| GP15    |             | unused, available                         |
| GP16    |             | unused, available                         |
| GP17    |  `LED_EN`   | Status LED control                        |
| GP18    |  `I2C_SCL`  | I²C clock (sensors)                       |
| GP19    |             | USB D-                                    |
| GP20    |             | USB D+                                    |
| GP21    |  `DISP_EN`  | TFT display enable (P-MOS gate drive)     |
| GP22    |             | *No pin on package*                         |
| GP23    |             | *No pin on package*                         |
| GP24    |             | *No pin on package*                         |
| GP25    |             | *No pin on package*                         |
| GP26    |             | Flash/PSRAM SPICS1                        |
| GP27    |             | Flash/PSRAM SPIHD                         |
| GP28    |             | Flash/PSRAM SPIWP                         |
| GP29    |             | Flash/PSRAM SPICS0                        |
| GP30    |             | Flash/PSRAM SPICLK                        |
| GP31    |             | Flash/PSRAM SPIQ                          |
| GP32    |             | Flash/PSRAM SPID                          |
| GP33    |             | *No pin on package*                         |
| GP34    |             | *No pin on package*                         |
| GP35    |             | Octal PSRAM                               |
| GP36    |             | Octal PSRAM                               |
| GP37    |             | Octal PSRAM                               |
| GP38    |  `ST_RX`      | UART1 RX to SeaTalk/NMEA0183 RX           |
| GP39    |             | JTAG, TDO                                 |
| GP40    |             | JTAG, TDO                                 |
| GP41    |             | JTAG, TDI                                 |
| GP42    |             | JTAG, TMS                                 |
| GP43    |  `ESP_TX`      | UART0 TX to ESP-PROG                      |
| GP44    |  `ESP_RX`      | UART0 RX to ESP-PROG                      |
| GP45    |             | strapping pin, low                        |
| GP46    |             | strapping pin, low                        |
| GP47    |  `DISP_TX`      | UART2 TX to display                       |
| GP48    |  `DISP_RX`      | UART2 RX from display                     |


Refer to the [ESP32-S3 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf) and [ESP-IDF JTAG documentation](https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-guides/jtag-debugging/index.html) for reserved pins, internal pull states, and JTAG assignments.

