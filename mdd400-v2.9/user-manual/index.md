---
title: User Manual
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — bench testing"
---

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype, bench-test phase. V2.9 currently runs only per-peripheral hardware test routines; the production firmware that drives the operator-facing experience has not been written yet.

:::

The User Manual covers the operator-facing workflow of the MDD400 — installation, page navigation, configuration, calibration, status indication, and troubleshooting.

:::info[Coming soon]

The operator manual for the MDD400 V2.9 is **not yet available**.

The MDD400's operator workflow — page navigation, configuration, brightness and sensor calibration, alert handling, and troubleshooting — is delivered by the production firmware. V2.9 is a fabricated prototype that today runs only per-peripheral bench-test routines, so there is no operator-facing behaviour to document for this revision yet.

The MDD400's operator output is the helm-facing display; there is no status indicator on the front panel. The board's amber status LED (D2) is **rear-facing** — visible at the rear connector panel (where the NMEA 2000 cable enters) but not from the helm. Beyond technician bring-up, it gives an owner a basic power-good / fault check at the connector panel — useful before returning a unit for repair; the planned **Fault-finding** section below will cover how to read it. See [LED Indicator](../circuit-design/led-indicator.md) in the Circuit Design section for its hardware behaviour.

This section will be published once the production ESP-IDF firmware is available and validated on V2.9 hardware. See the [Firmware](../firmware/index.md) section and the [Tasks](../tasks.md) page for the production-firmware status.

:::

| Planned page | What it will cover |
|---|---|
| Quick Start | Connect to the NMEA 2000 backbone, mount at the helm, power on |
| Page Navigation | Moving between the display pages (power, engine, navigation, tanks, wind, alarms) |
| Configuration | Setting up the display via the touch interface |
| Calibration | Ambient-light brightness response and sensor setup |
| Common Pitfalls | Mistakes to avoid during installation and use |
| Fault-finding | Reading the rear-panel status LED and other on-unit checks to diagnose a fault before returning a unit for repair |
| Troubleshooting | Diagnosing and resolving common faults |
