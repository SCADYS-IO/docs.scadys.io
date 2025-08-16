# LISN


## Measurement Port

Essential blocks (in signal order, SMA → DUT tap):

* *Edge‑launch SMA (female):* clean 50 Ω transition to your CPWG; robust, repeatable connectorization.
* *ultra‑low‑cap ESD at the connector:*, RF‑grade ESD array (≈0.2–0.8 pF/line, bidirectional). Catches direct ESD/cable‑mate spikes right at the shell with minimal RF loading.
* *short 50 Ω CPWG run (via‑fenced):* as short as practical (a few cm max), no stubs, gentle bends, ground‑via fence both sides. Preserves return path and keeps S11 flat to 108 MHz.
* *Fixed attenuator pad:* protects the analyser and damps small impedance wiggles; a single switch/jumper can select IN/OUT.
  * option A: bypass (0 dB) for max sensitivity; or
  * option B: inline 10 dB π‑pad or T‑pad using 1 % RF resistors.
* *RF limiter (small‑signal diodes to ground):* topology: two series 1N4148 (or BAV99) to GND in each polarity (i.e., anti‑parallel series pairs). Clip level: ~±1.2–1.4 V (gentle onset, low capacitance). “Last line” amplitude clipper for bursts without loading small signals.
* *DC‑blocking capacitor(s) (series, port side):* choose effective C so f_c ≲ 50–80 kHz with 50 Ω (e.g., 0.047–0.1 µF effective). One cap is simplest; two back‑to‑back X7R can be used to raise DC rating and symmetry (remember two in series halves C). Voltage: ≥100 V is a safe default for 12/24 V systems. Prevents any DC/bias from reaching the analyser, ensures flat passband from 150 kHz up.
* *small series “coupling” resistor (optional, 0–51 Ω):* between the DC‑block and the choke. Tames peaking with layout parasitics and shares surge energy; 0–22 Ω is usually enough if you already have a 10 dB pad.
* *coupling choke to the DUT line:* ≈1 mH RF choke (the same class used in the Wurth design). Decent SRF and low parasitic C; DCR not critical; current rating enough for fault cases. Forms the HF‑only coupling branch so the port “sees” the line noise, not DC.
* *DUT tap point (on the DUT side of the 5 µH ladder):* You want the measurement to reflect the standard 5 µH+50 Ω environment the DUT “sees”.
* *port side housekeeping (simple, but useful):* 50 Ω shunt footprint (normally DNP): lets you terminate the port when no analyser is connected (prevents a floating node during bring‑up).
* *high‑value bleed (e.g., 470 k–1 MΩ to GND on the port side of the DC‑block):* discharges the series cap after disconnects and keeps the limiter bias neutral.