# CANBench Duo

## Functional Specification

The CANBench Duo is a compact, open‑hardware pre‑compliance fixture designed for DC‑powered CANbus devices. It integrates:

- dual 5 µH DC LISN channels, compliant with CISPR 25/ISO 7637 impedance requirements, for measuring conducted emissions on both the positive (`NET‑S`) and negative (`NET‑C`) supply conductors;
- a high‑impedance, AC‑coupled CAN common‑mode monitor for measuring noise on the CANH/CANL pair without disrupting communication;
- analyzer‑safe outputs with SMA connectors for each LISN channel and the common‑mode monitor, suitable for 50 Ω measurement equipment.

## Use Case

The CANBench Duo is intended for **conducted emissions pre‑compliance testing** of DC‑powered CANbus devices, including NMEA 2000 marine electronics and other automotive or industrial control systems. Typical applications include:

- verifying conducted emissions performance during development;
- screening for compliance before third‑party lab testing;
- diagnosing and troubleshooting noise issues in CANbus devices.

## Connections

- **DeviceNet M12 (5‑pin A‑coded)**:
  - DUT side: 150 mm fly lead with female M12 connector;
  - backbone/power side: 150 mm fly lead with male M12 connector.
- **Banana sockets (4 mm)**:
  - in parallel with M12 connections for both `NET‑S` and `NET‑C` lines, enabling lab‑style connection to DC supplies and DUTs.
- **SMA connectors**:
  - SMA #1: LISN positive line (`NET‑S`);
  - SMA #2: LISN negative line (`NET‑C`);
  - SMA #3: CAN common‑mode monitor output.

## Notes

- The device is for measurement use only and is not intended for permanent installation;
- use on a bonded conductive ground plane in a shielded test area for best repeatability;
- observe current and voltage ratings when connecting DUT and power source.
