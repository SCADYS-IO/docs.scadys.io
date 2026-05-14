# Checkpoint — 2026-05-07 WTI400 esp32_module docs complete
*Session date: 2026-05-07*
*Status: esp32_module pipeline complete (all 3 evidence files + checklists + docs page); next circuit is wind_interface*

---

## What We Accomplished

**Config / nav fixes:**
- Removed stale `id: 'wti400'` plugin block from `docusaurus.config.js` (was pointing to old placeholder `wti400/` directory)
- Updated navbar WTI400 link from `/wti400` → `/wti400/v1.2` in `docusaurus.config.js`
- Updated homepage product card link from `/wti400` → `/wti400/v1.2` in `src/pages/index.js`

**Status correction — all WTI400 V1.2 pages:**
- WTI400 V1.2 is fabricated and in-service on test vessel (confirmed by designer 2026-05-07)
- Updated all `hw_status` frontmatter from `wip`/`prototype` → `in-service` across all files in `docs.scadys.io/wti400-v1.2/`
- Updated all hardcoded version banner text and caution admonition headers to "In service — installed on test vessel"
- Memory saved: `project_wti400_status.md`

**can_transceiver docs page (completed in prior session, verified this session):**
- Build was failing due to missing datasheet static assets; fixed by copying WTI400 datasheets to `docs.scadys.io/static/assets/datasheets/wti400-v1.2/` and renaming `STA M12 Series -M2024-1.pdf` → `STA-M12-Series-M2024-1.pdf` (spaces in filename break Docusaurus broken-link checker)

**esp32_module — full pipeline:**
- Schema review: `WTI400/hardware/WTI400_V1.2/schema_review/esp32_module.md` — all 5 gaps resolved via reverse interview
  - Gap 2 (D4 polarity): confirmed anode→J1, cathode→U4 VIN
  - Gap 3 (C7 net): confirmed ESP_EN to GNDREF (RC timing, τ = 10 ms)
  - Gap 4 (R24 config): V1.2 is developer variant (R24 DNP, U4/D4/D5/J1 populated)
  - Gap 5 (datasheets): `1N5819WS.pdf` and `XFCN-BH254V-6P.pdf` copied to datasheets/ and static assets
  - D5 corrected to Vout-to-Vin protection diode (same as D16 in power_supplies), not OR'ing diode
  - J1 pin-out corrected: Pin1=ESP_EN, Pin2=V_PROG, Pin3=ESP_TX, Pin4=GND, Pin5=ESP_RX, Pin6=ESP_BOOT
- PCB review: `WTI400/hardware/WTI400_V1.2/pcb_review/esp32_module-layout.md` — all flags resolved
  - F1 (antenna keepout): PCB cutout under antenna — no keepout zone required
  - F2 (VCC bypass caps): C8/C3/C1 are < 1 mm from U3 pad 3 — Espressif requirement met
  - F3 (ESP_EN 57.1 mm trace): accepted for V1.2 (RC-limited, confirmed working on Sunny Spells)
  - F4 (J1 pinout): confirmed matching standard ESP-PROG 6-pin header
  - F5 (D5 function): corrected to Vout-to-Vin protection diode
  - T1 (U4 thermal): U4 copper on all 4 layers (56 mm² total) + 9 vias; programming-only; T_j ≈ 76.8 °C at 100 mA / 70 °C — comfortable margin
- Performance review: `WTI400/hardware/WTI400_V1.2/performance_review/esp32_module.md`
  - All thermal flags corrected: U4 programming-only, 56 mm² 4-layer copper + 9 vias, T_j well within limits
  - VCC bypass cap concern resolved (< 1 mm from U3 pad 3)
  - Antenna concern resolved (PCB cutout)
  - Gap 5 (I2C Fast-mode): conditional on firmware — Standard mode confirmed OK; Fast mode requires C_bus verification
  - Gap 6 (ESP_EN trace): accepted for V1.2
- Checklists updated:
  - `testing-checklist.md`: added `## esp32_module` — 1 item (I2C Fast-mode, conditional)
  - `v2.0-improvements.md`: added `## esp32_module` — 1 item (UART series damping resistors)
- Docs page written: `docs.scadys.io/wti400-v1.2/circuit-design/esp32-module.md` — all sections complete
- Datasheet added to static assets: `1N5819WS.pdf`, `XFCN-BH254V-6P.pdf`
- Build verified clean after all changes

**Completed circuits so far (WTI400 V1.2):**
- power_supplies ✓
- can_bus_power ✓
- can_transceiver ✓
- esp32_module ✓

## What Is In Progress

Nothing in progress — esp32_module pipeline fully complete and build verified.

## What Is Next

Remaining WTI400 V1.2 circuits (all have `{/* AI_CONTENT_PENDING */}` stubs):
1. **wind_interface** — no evidence files yet; full pipeline needed (schema → pcb → performance → checklists → docs)
2. **motion_sensor** — no evidence files yet
3. **button_led** — no evidence files yet
4. **legacy_serial_rx** — no evidence files yet
5. **legacy_serial_tx** — no evidence files yet
6. **Step 7**: WTI400 Overview page (`docs.scadys.io/wti400-v1.2/index.md`)
7. **Step 8**: Final build verification + push

## Resumption Prompt

You are continuing the `/hardware-docs wti400 v1.2` pipeline for the WTI400 wind transducer interface documentation site at `docs.scadys.io`.

**Current state:** Four circuits are complete (power_supplies, can_bus_power, can_transceiver, esp32_module). The next circuit is **wind_interface**.

**Key facts to carry forward:**
- WTI400 V1.2 is fabricated and **in-service** on test vessel (not a prototype). All docs use `hw_status: in-service`, `hw_status_label: "In service — installed on test vessel"`.
- The V1.2 build is the **developer/kit variant**: U4/D4/D5/J1 populated, R24 DNP.
- Evidence files live at `WTI400/hardware/WTI400_V1.2/{schema_review,pcb_review,performance_review}/`
- Docs pages live at `docs.scadys.io/wti400-v1.2/circuit-design/`
- Static datasheets: `docs.scadys.io/static/assets/datasheets/wti400-v1.2/` (currently: ACT45B, GRM31CR72A105KA01K, LMR51610, NUP2105LT1G, PESD15VL1BA, SN65HVD234, SS34, STA-M12-Series-M2024-1, V33MLA1206NH, 1N5819WS, XFCN-BH254V-6P)
- MDD400 V2.9 evidence files at `MDD400/hardware/MDD400_V2.9/` are authoritative cross-reference for shared circuits
- Always `npm run clear && npm run build` to verify before reporting done
- Prefer reverse interview over leaving gaps open — ask the designer one question at a time

**Immediate next step:** Begin Step 6a for `wind_interface` — check if `schema_review/wind_interface.md` exists, spawn schema review agent if not, then present the pause block.
