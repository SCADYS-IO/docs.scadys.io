---
title: User Manual
hw_version: v2.9
hw_status: prototype
hw_status_label: "Fabricated prototype — bench testing"
---

:::note[Hardware version]

MDD400 **v2.9** — Fabricated prototype, bench-test phase. V2.9 currently runs only per-peripheral hardware test routines; the production firmware that drives the operator-facing experience has not been written yet.

:::

:::info[Coming soon]

The operator manual for the MDD400 V2.9 is **not yet available**.

The MDD400's operator workflow — page navigation, configuration, brightness and sensor calibration, alert handling, and troubleshooting — is delivered by the production firmware. V2.9 is a fabricated prototype that today runs only per-peripheral bench-test routines, so there is no operator-facing behaviour to document for this revision yet.

This section will be published once the production ESP-IDF firmware is available and validated on V2.9 hardware. See the [Firmware](../firmware/index.md) section and the [Tasks](../tasks.md) page for the production-firmware status.

:::

## What this section will cover

When the operator manual is published, it will include:

| Page | What it will cover |
|---|---|
| Quick Start | Connect to the NMEA 2000 backbone, mount at the helm, power on |
| Page Navigation | Moving between the display pages (power, engine, navigation, tanks, wind, alarms) |
| Configuration | Setting up the display via the touch interface |
| Calibration | Ambient-light brightness response and sensor setup |
| Status LED | What the front-panel indicator means and what to do |
| Common Pitfalls | Mistakes to avoid during installation and use |
| Troubleshooting | Diagnosing and resolving common faults |

## What you can rely on today

The one operator-visible behaviour that is fixed in hardware — independent of firmware — is the **front-panel status LED**. By default it lights amber as a *power-good* indicator as soon as the NMEA 2000 supply is stable, before any firmware runs; firmware can later take over the LED for application-level status. See [LED Indicator](../circuit-design/led-indicator.md) in the Circuit Design section for the full behaviour.

For an overview of what the MDD400 is and does, see the [MDD400 Overview](../index.md). For engineering rationale (circuit topology, component values, design intent), see the [Circuit Design](../circuit-design/index.md) section. For fast-lookup tables (pin assignments, power rails, connectors, BOM), see [Quick Reference](../quick-reference/index.md).
