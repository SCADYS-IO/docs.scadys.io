---
title: User Manual
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — test vessel (~1,000 sea miles)"
---

:::note[Hardware version]

WTI400 **v1.2** — In service on the test vessel (~1,000 sea miles), running a simple PlatformIO/Arduino firmware that emits NMEA 2000 wind sentences.

:::

The User Manual covers the operator-facing workflow of the WTI400 — installation, transducer wiring, IMU calibration, status LED and button operation, and troubleshooting.

:::info[Coming soon]

The operator manual for the WTI400 V1.2 is **not yet available**.

The WTI400 is in service today, running a simple PlatformIO/Arduino firmware that emits NMEA 2000 wind sentences. Its operator-facing behaviour exists and works in the field; what is pending is a documentation pass of the in-service workflow — installation, transducer wiring, IMU calibration, status LED and button operation, and troubleshooting.

The WTI400's local UI is a single **RGB LED + tactile button** on the front face. The red channel lights by default at power-on as a *power-good* indicator, before firmware initialises; firmware then drives the three colour channels to signal device state and respond to button input. The planned **Status LED** and **Fault-finding** pages below will cover how to read it; see [LED Indicator](../circuit-design/led-indicator.md) in the Circuit Design section for the full hardware behaviour.

This section will be published once the in-service operator workflow has been documented. For the installed-firmware status and the planned production ESP-IDF migration, see the [Firmware](../firmware/index.md) section and the [Tasks](../tasks.md) page.

:::

| Planned page | What it will cover |
|---|---|
| Quick Start | Connect to the NMEA 2000 backbone, attach the wind transducer, power on |
| Installation | Mounting, transducer wiring at the six quick-connect tabs, JP1 supply-setpoint selection |
| Calibration | IMU heel/pitch reference setup and wind ADC limits / midpoint scheme |
| Status LED | What the RGB indicator colours mean and how the button responds |
| Common Pitfalls | Mistakes to avoid during installation and use |
| Fault-finding | Reading the front-face RGB status LED and other on-unit checks to diagnose a fault |
| Troubleshooting | Diagnosing and resolving common faults |
