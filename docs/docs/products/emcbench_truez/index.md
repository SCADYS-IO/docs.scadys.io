# EMCBench CAN-LISN

The EMCBench CAN-LISN is a dual-line DC LISN with integrated CAN common-mode monitor.

## Functional Specification

The EMCBench CAN-LISN follows the principle that a pre-compliance fixture should emulate laboratory test conditions as closely as possible, while remaining accessible and inexpensive for developers. The design philosophy is to provide per-line accuracy for pre-compliance testing and additional diagnostic tools that support practical debugging, all in a compact, open-hardware package.

It integrates:

- dual 5 µH DC LISN channels, compliant with [CISPR 25](https://webstore.iec.ch/publication/7077) / [ISO 7637](https://www.iso.org/standard/71201.html) impedance requirements, for measuring conducted emissions on both the positive (`NET-S`) and negative (`NET-C`) supply conductors;
- a high-impedance, AC-coupled CAN common-mode monitor for measuring noise on the CANH/CANL pair without disrupting communication; and
- analyzer-safe outputs with SMA connectors for each LISN channel and the common-mode monitor, suitable for 50 Ω measurement equipment.

## Use Case

The EMCBench CAN-LISN is designed with the philosophy that inexpensive tools such as the [TinySA](https://tinysa.org/wiki/) spectrum analyzer can still provide meaningful insights if connected through a well-defined and repeatable measurement fixture. By using SMA outputs, the fixture interfaces directly with such analyzers. Likewise, many CAN devices in marine and industrial settings use A-coded Micro-C 5-pin connectors, which are therefore adopted here.

The EMCBench CAN-LISN is intended for conducted emissions pre-compliance testing of DC-powered CANbus devices, including NMEA 2000 marine electronics and other automotive or industrial control systems. Typical applications include:

- verifying conducted emissions performance during development;
- screening for compliance before third-party lab testing; and
- diagnosing and troubleshooting noise issues in CANbus devices.

## Connections

The connection philosophy is to make the EMCBench CAN-LISN simple, familiar, and interoperable with both laboratory and field equipment. CAN devices often rely on standardized connectors, while test equipment relies on banana sockets and SMA ports. The fixture reflects this by providing each style of connection in parallel.

### DeviceNet M12 (5-pin A-coded)

- DUT side: 150 mm fly lead with female M12 connector  
- backbone/power side: 150 mm fly lead with male M12 connector  

### Banana sockets (4 mm)

- in parallel with M12 connections for both `NET-S` and `NET-C` lines, enabling lab-style connection to DC supplies and DUTs  

### SMA connectors

- SMA #1: LISN positive line (`NET-S`) for per-line absolute measurements  
- SMA #2: LISN negative line (`NET-C`) for per-line absolute measurements  
- SMA #3: differential-mode (DM) diagnostic port  
- SMA #4: common-mode (CM) diagnostic port  

## Notes

The operating philosophy is to treat per-line LISN outputs as the truth for pre-compliance work, while CM/DM outputs are provided as diagnostic aids. The DM and CM ports are intended to guide mitigation strategies such as shielding, chokes, or filtering, but do not replace individual per-line results, which remain the compliance-relevant measurement.

- the device is for measurement use only and is not intended for permanent installation  
- use on a bonded conductive ground plane in a shielded test area for best repeatability  
- observe current and voltage ratings when connecting DUT and power source  
- note that CM/DM diagnostic ports do not always maintain the strict 25 Ω (CM) and 100 Ω (DM) source impedances defined in [CISPR 25](https://webstore.iec.ch/publication/7077). They are intended for relative diagnostics only and should not be used as substitutes for the per-line compliance measurements  

## References

1. Electronic Design, [*CISPR 25 Class 5: Evaluating EMI in Automotive Applications*](https://www.electronicdesign.com/technologies/power/article/21274517/)  
2. Compliance Magazine, [*Automotive EMC Testing: CISPR 25, ISO 11452-2 and Equivalent Standards*](https://incompliancemag.com/automotive-emc-testing-cispr-25-iso-11452-2-and-equivalent-standards-part-1/)  
3. IEC, [*CISPR 25: Vehicles, boats and internal combustion engines – Radio disturbance characteristics – Limits and methods of measurement for the protection of on-board receivers*](https://webstore.iec.ch/publication/7077)  
4. ISO, [*ISO 7637-2: Road vehicles – Electrical disturbances from conduction and coupling – Part 2: Electrical transient conduction along supply lines only*](https://www.iso.org/standard/71201.html)
5. YONGU Enclosure, [*YONGU Split Aluminum Handheld Enclosure H06 63*35mm*](https://www.yg-enclosure.com/product/yongu-split-aluminum-handheld-enclosure-h06-63-35mm.html)
