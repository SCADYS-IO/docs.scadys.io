# Pre‑compliance EMC Testing

This section documents generalized pre‑compliance EMC approaches for NMEA 2000 devices, including conducted and radiated emissions reconnaissance and immunity spot‑checks.

## Pre‑compliance Testing Plan – NMEA 2000 Devices

A generalized plan to sequence bench reconnaissance, immunity spot‑checks, and formal lab sessions.

1. **Readiness & Modes**: Define worst‑case operation (display max, bus traffic, I/O activity).
2. **Power Integrity Review**: Scope ripple at regulators; verify return paths.
3. **Radiated Emissions Recon**: Near‑field probing with H‑loops/E‑stubs + LNA; log top peaks & fixes.
4. **Conducted Emissions Recon**: Use DC LISN on NET‑S; trend improvements; keep lead dress constant.
5. **Immunity Spot‑Checks**: VHF/UHF handhelds near cables/housing; optional marine SSB (installed).
6. **Pre‑compliance Lab**: Book emissions + ESD/EFT/Surge; bring spares and mitigation parts.
7. **Environmental & IP**: Temperature cycling, vibration, salt mist, ingress.
8. **Final Verification**: Regression checks; technical file collation.

## Compliance Matrix – NMEA 2000 Devices (General)

This matrix outlines common standards and tests typically applicable to NMEA 2000 devices. Adapt per product.

{% include-markdown "assets/html/compliance_matrix.html" %}
