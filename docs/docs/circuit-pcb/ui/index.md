# User Interface

The user interface subsystem includes the LCD display and capacitive touchscreen components that provide visual feedback and user input capabilities. These interfaces are tightly integrated with the ESP32-S3 via UART and GPIO, and are powered from the 5 V rail with appropriate control logic.

* *[Display](display.md)*: Describes the UART-connected DWIN LCD module used in the MDD400. Includes interface configuration, power control, and layout considerations. The display supports the DGUS II protocol for rendering preloaded graphics and responding to serial commands.

* *[Touch](touch.md)*: Covers the capacitive touch panel integrated with the LCD. Details the touch controller interface, signal routing, and interrupt configuration for touch input events.

These components together enable an embedded graphical user interface, allowing interaction with system functions, configuration, and data presentation.
