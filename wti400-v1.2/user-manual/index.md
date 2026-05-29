---
title: User Manual
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — test vessel (~1,000 sea miles)"
---

:::note[Hardware version]

WTI400 **v1.2** — In service on the test vessel (~1,000 sea miles), running a simple PlatformIO/Arduino firmware that emits NMEA 2000 wind sentences.

:::

:::info[Coming soon]

The operator manual for the WTI400 V1.2 is **not yet available**.

The WTI400 is in service today, but its operator-facing documentation — installation, transducer wiring, IMU calibration, LED/button operation, and troubleshooting — has not yet been written up. This section will be published once the operator workflow has been documented from the in-service deployment.

For the installed-firmware status and the planned production ESP-IDF migration, see the [Firmware](../firmware/index.md) section and the [Tasks](../tasks.md) page.

:::

## What this section will cover

When the operator manual is published, it will include:

| Page | What it will cover |
|---|---|
| Quick Start | Connect to the NMEA 2000 backbone, attach the wind transducer, power on |
| Installation | Mounting, transducer wiring at the six quick-connect tabs, JP1 supply-setpoint selection |
| Calibration | IMU heel/pitch reference setup and wind ADC limits / midpoint scheme |
| Status LED | What the RGB indicator colours mean and how the button responds |
| Common Pitfalls | Mistakes to avoid during installation and use |
| Troubleshooting | Diagnosing and resolving common faults |

## What you can rely on today

The WTI400's local UI is a single **RGB LED + tactile button** on the front face. The red channel lights by default at power-on as a *power-good* indicator, before firmware initialises; firmware then drives the three colour channels to signal device state and respond to button input. See [LED Indicator](../circuit-design/led-indicator.md) in the Circuit Design section for the full behaviour.

Transducer wiring and supply-setpoint details are already documented — see [Transducer Compatibility](../transducer-compatibility.md) for the per-transducer pin-out, supply, and signal-level matrix.

For an overview of what the WTI400 is and does, see the [WTI400 Overview](../index.md). For engineering rationale (circuit topology, component values, design intent), see the [Circuit Design](../circuit-design/index.md) section. For fast-lookup tables (pin assignments, power rails, connectors, BOM), see [Quick Reference](../quick-reference/index.md).
