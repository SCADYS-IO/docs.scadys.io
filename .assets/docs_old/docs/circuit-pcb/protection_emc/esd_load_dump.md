# ESD and Load Dump

The schematic below shows the full protection circuit for the NET-S input, including a primary TVS diode, PTC fuse, filtering components, and secondary clamping at the downstream side.

![NET-S Power Protection](../../assets/images/net_s_protection.png)

A [JK-mSMD075-33 resettable fuse (PTC)](https://lcsc.com/datasheet/lcsc_datasheet_2304140030_Jinrui-Electronic-Materials-Co--JK-mSMD075-33_C369169.pdf) is included downstream of the primary TVS diode to protect against sustained overloads and short-circuit faults in downstream components. The PTC is not involved in the suppression of fast transients but fulfills requirements in both NMEA and ISO marine standards that mandate overcurrent protection for device safety. Under fault conditions, it limits current by entering a high-resistance state and automatically resets once the fault is cleared. This device has a hold current of 750 mA and a trip current of approximately 1.5 A, offering effective protection for low-power marine electronics while minimizing nuisance trips.

The first line of defence against both electrostatic discharge (ESD) and high-energy surge events is a high-power transient voltage suppressor (TVS) diode. The [SM8S36CA TVS diode](https://www.smc-diodes.com/propdf/SM8S20CA%20THRU%20SM8S43CA%20N2149%20REV.-.pdf) is used at the 12 V input to clamp and absorb energy during overvoltage events. It is placed directly at the connector before any other active circuitry, allowing it to respond instantly to surge events.

This diode begins clamping at approximately 58 V and is rated for 6.6 kW peak pulse power (10/1000 µs waveform). It is bidirectional, allowing it to suppress both positive and negative transients relative to system ground. During a surge event — such as alternator load dump, battery disconnection under load, or inductive spike — the [SM8S36CA](https://www.smc-diodes.com/propdf/SM8S20CA%20THRU%20SM8S43CA%20N2149%20REV.-.pdf) diverts energy away from sensitive downstream circuits by rapidly entering avalanche breakdown.

This component was selected specifically for its compatibility with [ISO 7637-2](https://www.iso.org/standard/50925.html) Pulse 5b waveforms, including worst-case unsuppressed load dumps of up to 150 V. Simulation and test confirm that the clamped voltage at the downstream surge stopper FET remains within safe limits during these conditions.

The TVS diode also contributes to ESD protection, supplementing local filtering and layout strategies. It is capable of absorbing ±30 kV contact discharges when tested per [IEC 61000-4-2](https://webstore.iec.ch/en/publication/68954), with negligible leakage under normal operating voltages.

A surface mount automotive [V33MLA1206NH](https://lcsc.com/datasheet/lcsc_datasheet_2410121837_Littelfuse-V33MLA1206NH_C187727.pdf) Metal Oxide Varistor (MOV) with a clamping voltage of 75 V is fitted in parallel with the TVS.

