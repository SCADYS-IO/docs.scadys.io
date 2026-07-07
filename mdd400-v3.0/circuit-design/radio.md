---
title: Wi-Fi / BLE Radio
hw_version: v3.0
hw_status: schematic
hw_status_label: "In design — V3.0 schematic capture in progress"
---

:::note[Hardware version]

MDD400 **v3.0** — ESP32-P4 / MIPI-DSI / LVGL platform re-base. This board is at **schematic-capture** stage; no V3.0 hardware exists yet.

**Other versions:** [v2.9 — fabricated prototype (current)](/mdd400/v2.9/)

:::

:::info[Under construction — V3.0 capture in progress]

**New for V3.0.** The ESP32-P4 host has no radio, so V3.0 adds an **ESP32-C6-MINI-1** companion module to provide **Wi-Fi 6 and Bluetooth LE**. The module connects to the P4 over **SDIO** and runs Espressif's companion (`esp-hosted` / NCP) firmware — not application code. The carrier supplies its 3V3 and VBAT; the module carries its own flash and power.

Two module variants are in the part set: the **PCB-antenna** part for prototypes and the **external-antenna** part (`-1U`) for production. This page will be generated from the host sheet (`esp32_module.kicad_sch`) once the radio block is drawn.

See the [Tasks](/mdd400/v3.0/tasks) page for status.

:::
