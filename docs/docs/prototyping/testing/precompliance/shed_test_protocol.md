# Shed Test Protocol

This protocol describes how to use a **steel-clad shed with no mains wiring** as a low-noise RF environment for **relative EMC measurements** and **immunity spot-checks**.  
It is intended for **pre-compliance testing** of SCADYS.io NMEA 2000 products using portable, low-cost equipment.

---

## 1. Purpose

The shed acts as a quasi-shielded enclosure, reducing ambient RF noise from nearby transmitters, mains wiring, and electronics.  
While not a certified anechoic or TEM cell, it allows **repeatable comparative measurements** between design iterations and after mitigation changes.

---

## 2. Equipment

**Minimum:**
- **HT5 active antenna** (0.1–3 GHz)  
- **tinySA Ultra** spectrum analyser (with HT004 LNA if required)  
- **AGM 12 V 80 Ah battery** – preferred for DUT power to avoid conducted noise  
- **M12 inline LISN** (for conducted emissions measurements, if applicable)  
- **Tripod** for antenna positioning  
- **Measuring tape** to fix antenna/DUT distances  
- **Log sheet** or digital logging device

**Optional / For immunity:**
- **Handheld VHF transceiver** (156–162 MHz)  
- **Handheld UHF transceiver** (400–480 MHz)  
- **Marine SSB transceiver** (2–30 MHz, installed on vessel)  
- **Wanptek WPS3010H/B** bench PSU (only if battery use not possible)

---

## 3. Setup

1. **Clear the shed** of any unnecessary electronics.  
2. **Seal the shed** — close all doors/windows to maintain a stable RF environment.  
3. **Mark fixed positions** for:
   - Antenna
   - DUT (Device Under Test)
   - Cables and LISN (if used)  
   These positions must be **identical for baseline and DUT sweeps**.
4. **Connect DUT** to power:
   - **Default:** AGM 12 V battery.
   - **Alternative:** Wanptek WPS3010H/B PSU (DC output only; ensure no mains cables enter shed).
5. **Minimise lead lengths** and dress cables consistently between tests.

---

## 4. Baseline Measurement

1. **Configure analyser**:  
   - Frequency span: e.g., 150 kHz–1 GHz (or product-specific)  
   - Resolution bandwidth: as per CISPR guidelines (e.g., 9 kHz below 30 MHz, 120 kHz above 30 MHz)  
2. **Place HT5 antenna** at marked position; connect to tinySA Ultra (with LNA if required).  
3. **Record ambient sweep** with DUT powered **off**.  
4. Save trace as **baseline reference** for later subtraction/comparison.

---

## 5. DUT Measurement

1. Power on DUT in **worst-case EMC mode** (maximum comms activity, all displays/outputs active).  
2. Repeat sweep under identical analyser settings.  
3. Save trace for overlay with baseline.  
4. Identify peaks significantly above baseline — these are candidate emissions for mitigation.

---

## 6. Immunity Spot-Checks

1. **Select handheld radio** (VHF or UHF).  
2. **Transmit** near DUT cabling and enclosure at safe duty cycle and power:  
   - Typical: 5–10 W, FM or AM carrier, a few seconds per frequency.  
   - Keep antenna 5–30 cm from target cable/enclosure.  
3. Observe DUT behaviour for resets, comms dropouts, or abnormal operation.  
4. **Marine SSB** (if available) can be used for HF spot-checks on vessel-installed units.

---

## 7. Data Recording

- Date, time, weather conditions (can affect RF propagation)  
- DUT serial/configuration and firmware version  
- Antenna/DUT positions, distances, orientations  
- Power source used  
- Spectrum analyser settings and sweep parameters  
- Observed emissions (frequency, amplitude, suspected source)  
- Immunity test results (frequency, power, DUT reaction)

---

## 8. Limitations

- The shed is **not fully shielded** — strong local transmitters can still appear in baseline.  
- Results are **relative**, not absolute compliance measurements.  
- Antenna factor and calibration data may be unavailable — readings are comparative only.  
- Repeatability depends on strictly following setup positions and cable routing.

---

**Tip:** Always keep one set of traces as a **golden reference** for a known-good DUT build. Future units can be compared quickly for regressions.

