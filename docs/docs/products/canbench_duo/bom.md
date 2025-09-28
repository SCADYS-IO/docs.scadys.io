
# Bill of Materials (key parts)

| Qty | Component               | Specification              | Notes                                                   |
| --- | ----------------------- | -------------------------- | ------------------------------------------------------- |
| 10  | Inductors               | 1.0–1.2 µH, ≥ 5 A, low DCR | 5 in series per channel for broadband response          |
| 6   | Capacitors, MLCC        | 2.2 µF, 100 V, X7R, 1210   | DUT-side bulk capacitance                               |
| 4   | Capacitors, MLCC        | 100 nF, 250 V, X7R, 1206   | HF bypass                                               |
| 2   | Electrolytic capacitors | 22 µF, 100 V, low ESR      | LF stability                                            |
| 2   | Resistors               | 50 Ω, ≥1 W, non-inductive  | LISN terminations                                       |
| 2   | Resistors               | 1 kΩ, 1%, 0603             | CAN CDN summing resistors                               |
| 1   | Capacitor               | 220 nF, C0G or film        | CAN CDN DC block                                        |
| 3   | SMA edge connectors     | 50 Ω, PCB mount            | LISN+ / LISN- / CAN CDN outputs                         |
| 4   | Banana sockets          | 4 mm panel mount           | Positive and negative LISN channels, DUT & source sides |
| 2   | NMEA 2000 drop cables   | 150 mm, 5-core shielded    | Hardwired fly leads to DUT and backbone                 |
| 2   | M12 connectors          | DeviceNet 5-pin A-coded    | Female to DUT, male to backbone                         |
