# Introduction

The MDD400 is a compact data display unit designed for integration with
modern marine and recreational vehicle (RV) electrical systems. It is
optimised for the NMEA 2000/CANBUS backbone, displaying data via a
serial HMI interface driven over UART. Offloading graphical updates to
the display controller allows the onboard microcontroller to focus on
interfacing, protocol translation, and data processing, supporting a
wide range of sensor and bus configurations.

## Design Philosophy

The MDD400 was developed for deployment in marine environments, where
electrical systems are exposed to harsh physical conditions and frequent
voltage disturbances. However, recognising the similarity between marine
and automotive/RV 12 V systems --- particularly in terms of wiring
topology, fault conditions, and user expectations --- the MDD400 has
been designed with potential future certification for road-going
vehicles in mind.

The overarching philosophy is to design for realistic abuse scenarios,
reducing the likelihood of damage in the field and thereby eliminating
the need for return-to-base repairs. This strategy supports the planned
24-month, no-questions-asked replacement warranty --- a competitive
differentiator intended to rival established marine brands while
avoiding the overhead of setting up global repair facilities.

This section outlines the design principles, performance goals and
safety considerations that inform the entire hardware design.

### Environmental and Electrical Survivability

The MDD400 must survive common transients found on 12 V DC supply rails,
including:

- load dump conditions up to 150 V (per ISO 7637-2 Pulse 5b);
- reverse polarity connection of 12--14 V;
- electrostatic discharge (ESD), following IEC 61000-4-2;
- conducted and radiated emissions (per CISPR 25 / EN 55025);
- and ground bounce and other anomalies from long DC wiring typical in
  boats and RVs.

To ensure compatibility with both marine and automotive domains,
protection circuitry has been tested against the most demanding load
dump waveforms from ISO 7637-2, and both power supply and communication
interfaces have been isolated or filtered to maintain signal integrity
and protect sensitive components.

### Robust Power Distribution

Four separate power rails are implemented:

- *primary power domain*, supplying a 5 V rail at up to 2.0A peak using
  a switching regulator;
- *digital logic domain,* supplying a regulated low-ripple 3.3 V rail
  using a linear LDO regulator;
- *analog sensor domain*, supplying a 8V rail at up to 100mA using a
  linear LDO for the wind sensor interface.

Each includes current limiting, thermal protection, and either
undervoltage lockout (UVLO) or controlled enable logic. Combined with a
discrete surge stopper circuit, the system is designed to self-recover
from faults without the use of fuses or mechanical resets.

The 5 V rail is generated from the 12 V input using a high-efficiency
synchronous buck converter, reducing power loss while providing a stable
intermediate supply. This 5 V rail feeds the serial display and acts as
the input to the 3.3 V LDO, ensuring low ripple on the digital logic
rail. This architecture improves efficiency over directly stepping
12--14.8 V down to 3.3 V, while retaining the noise performance and
simplicity of LDO regulation where it matters most.

The 8 V rail is implemented using a low-dropout linear regulator and is
used exclusively for the masthead analog wind transducer. The transducer
draws less than 50 mA under normal operation, making the linear approach
thermally acceptable and electrically clean. The regulator is
selectively enabled via \[WIND_EN\], conserving power when the wind
interface is not in use.

### Mission Resilience and Safety

Critical circuits --- such as power monitoring, communication interfaces
and display --- remain functional under abnormal voltage conditions. The
system does not rely on any software-controlled start-up sequence or
central controller to protect hardware against electrical faults. Where
possible, faults are detected and isolated at the analog level.

Additionally:

- the device is protected against short-circuits and sustained
  over-voltage;
- no fuse is required to isolate faults --- the MOSFET protection
  circuit self-recovers;
- dual-input polarity protection ensures that legacy serial and NMEA2000
  inputs remain independent.

### Electromagnetic Compatibility (EMC)

EMC compliance was a foundational design requirement. Particular
attention was given to:

- separation of analog and digital ground planes;
- use of common-mode chokes, pi filters and LC filtering at all external
  interfaces;
- low-inductance return paths and surface-mount TVS diodes;
- and shielding/isolation of NMEA2000 and legacy serial connectors.

The product is designed to meet both CE and FCC Class B emissions limits
and includes on-board suppression to meet ISO 11452-2 and ISO 7637-2.

### Serviceability and Field Upgradeability

Firmware updates and configuration are supported over Bluetooth/BLE. In
production, firmware flashing is performed using a pogo-pin programming
jig that interfaces with a 6-pin 0.5 mm pitch header footprint
compatible with the ESP-PROG programmer. The 6-pin header, while fitted
to prototypes, is not populated in the final assembly. It may be
included in a development or open-source variant. Currently, the
programming interface includes polarity protection for power pins but
lacks further ESD or transient protection --- this will be reviewed in
future revisions.

The internal regulators and protection circuits are designed to handle
most common wiring faults gracefully, allowing field servicing with
minimal tools or expertise.

The design is prepared for dual certification paths: marine
installations via NMEA2000 guidelines and CE/FCC emissions
certification, with provisions for future expansion into the
recreational vehicle (RV) space.

## Functional Domains

Key hardware features include:

- CANBUS interface for communicating with the NMEA 2000 backbone;
- TFT LCD display with capacitive touch screen connected via high-speed
  UART;
- ambient light sensor connected to the I²C bus;
- temperature and power sensing systems for protection and diagnostics;
- robust, fault-tolerant hardware and interfaces designed for marine
  electrical environments;
- optional plug-and-play legacy serial data interface (e.g. NMEA 0183 or
  SeaTalk-compatible) on selected models;
- support for analog wind transducers (angle and speed) on selected
  models;
- Bluetooth/BLE for configuration and firmware updates via mobile app;
  and
- Wi-Fi-ready for future protocols such as SignalK and OneNet.

The hardware is organized into five functional domains (subsystems), as
shown in the block diagram:

### Power Supply

The system is powered from a 12 V source via either the NMEA 2000
network or the (optional) legacy serial connection. Input power passes
through reverse polarity protection, surge and current limiting, and an
EMI filter before being regulated to:

- 5 V for display and logic circuits (via SMPS);
- 3.3 V for the digital domain (via LDO); and
- 8 V for the analog wind transducer interface (via LDO) on selected
  models.

All three regulators are designed to balance cost, robustness, and
efficiency in line with the MDD400's overall mission to survive
real-world abuse without requiring repair or user intervention.

### Communication Interfaces {#communication-interfaces-1}
- NMEA 2000 (CANBUS) via the ESP32-S3's internal TWAI peripheral and
  external CAN transceiver; and, on selected models
- a RS422 compatible, plug&play interface that accepts legacy marine
  serial protocols such as NMEA 0183 and SeaTalk®.

### Sensors

The following sensors are used by the MDD400:

- ESP32-S3 integrated temperature sensor for diagnostics and protection;
- analog current and voltage sensors for self-monitoring and
  diagnostics;
- Texas Instruments OPT3004 ambient light sensor on the I²C bus for
  automatic display dimming; and
- wind transducer inputs for analog wind angle and frequency-based wind
  speed.

### USER INTERFACE SUBSYSTEM

A custom DWIN DMG48480F040_01WTC[^15] capacitive touchscreen display
is used as user interface. The 4" TFT LCD display has a resolution of
480×480 pixels and communicates with the ESP32-S3 over UART using the
DGUS II protocol.

### Processing

An Espressif ESP32-S3 microcontroller module handles all system logic,
sensing, and communication. It manages protocol parsing, sensor
readings, and updates to the display. The module includes Bluetooth/BLE
for configuration and firmware updates, with Wi-Fi reserved for future
features.

# Power Supply Subsystem

## Power Supply Protection and Filtering

### Overview and Design Criteria

The electrical environment aboard small vessels shares many
characteristics with automotive systems, but with greater variation and
typically less standardisation. Marine electrical systems may
incorporate multiple battery banks --- often with separate cranking and
house systems --- and are increasingly adopting lithium chemistries such
as LiFePO₄. It is not uncommon for vessels to include 24 V or 48 V
subsystems or to operate some loads from inverter-generated AC power.

Despite this variability, the communication and sensor networks relevant
to the MDD400 are standardised to operate from nominal 12 V supplies.
The NMEA 2000 backbone, as well as legacy protocols such as SeaTalk and
NMEA 0183, are all 12 V-based. These systems are generally unregulated,
powered by user-installed cabling, and often exposed to transients
caused by inductive loads, battery switching, or alternator events. The
MDD400 must tolerate these conditions while maintaining safe operation
of downstream circuitry.

Designing for this environment requires careful attention to both
transient suppression and steady-state fault protection. The MDD400
input protection circuit is modelled on best practices from automotive
design, particularly those outlined in ISO 7637-2[^1]. While this
standard is not mandatory in marine applications, it provides a useful
baseline for evaluating and simulating real-world transient events.

The MDD400's power input protection strategy is defined by the design
criteria in *Table 1*, reflecting expected conditions on small vessel
12 V systems. These criteria guided the selection and simulation of each
protection stage.

  -----------------------------------------------------------------------
  **Protection    **Design Criteria**
  Function**      
  --------------- -------------------------------------------------------
  Reverse         Survive continuous reverse connection of ±12 V; no
  Polarity        damage; automatic recovery

  Load Dump and   Survive ISO 7637-2 Pulse 5b (150 V, 400ms exponential
  Surge Clamping  decay); limit to \< 60 V

  ESD Protection  Tolerate ±15 kV air discharge per IEC 61000-4-2[^2]

  Over-voltage    Disconnect load above 18.5 V; reconnect below 18.5 V
  Limiting        without latch-up

  Current         Limit current to \~1.0 A; tolerate sustained overloads
  Limiting        without damage

  EMC Filtering   Suppress conducted emissions above 1 MHz; limit
                  conducted noise to \< 100 mV p-p; contain radiated
                  emissions to meet FCC Part 15 and EN 55032 Class B
                  limits
  -----------------------------------------------------------------------

  : Table 1: Power Supply Protection Design Criteria

These functions are implemented discretely to reduce cost, improve
component availability, and allow field observability. Where
appropriate, the design includes thermal protection and is engineered to
fail safe under fault conditions.

The sections that follow describe each function in detail.

### Reverse Polarity Protection

Both 12 V inputs --- NMEA 2000 and legacy serial --- are protected from
reverse polarity using discrete Schottky diodes.

A MOSFET-based reverse protection scheme was considered but not adopted.
The primary justification for using a simple diode is the presence of
generous headroom in the input voltage range (nominal 12 V vs. 5 V and
3.3 V regulated rails), which makes the forward voltage drop acceptable.
Diode protection offers simpler implementation, lower component cost,
and greater resilience to fault modes such as latch-up or shoot-through.

The primary component is the SS34 (DO-214AC/SMA package) [^3], which
provides reliable protection against reverse connections while
introducing minimal voltage drop in normal operation:

- Maximum Reverse Voltage (VRRM): 40V
- Average Forward Current (IF(AV)): 3.0A
- Surge Current Rating (IFSM, 8.3ms): 100 A
- Typical Forward Voltage Drop (VF @ 1 A): \~0.5V
- Reverse Leakage Current: \~0.5 mA at 40V

This approach ensures automatic recovery from incorrect wiring and
protects downstream circuitry by blocking reverse current. The forward
voltage drop is acceptable given the headroom available between the 12 V
input and the downstream regulators.

A solder jumper in parallel with the diode is included on the legacy
serial interface for development and testing. This allows the interface
to be used as a 12 V power source for external equipment if required,
while maintaining galvanic isolation from the NMEA 2000 backbone.

This approach ensures automatic recovery from incorrect wiring and
avoids damage to sensitive downstream components. Under reverse polarity
conditions, the Schottky diode blocks current flow entirely, and no
reverse current is conducted.

A solder jumper in parallel with the diode is included on the legacy
serial interface for development and testing. This allows the interface
to be used as a 12 V power source for external equipment if required,
while still maintaining galvanic separation from the NMEA 2000
backbone.2.1.3 Load Dump and ESD

Describes the expected surge conditions (including alternator
disconnect), ESD threats, and the use of a high-power TVS diode to clamp
spikes safely.

### ESD and Load Dump Protection

The first line of defence against both electrostatic discharge (ESD) and
high-energy surge events is a high-power transient voltage suppressor
(TVS) diode. The SM8S36CA [^16] is used at the 12 V input, upstream
of the surge stopper MOSFET, to clamp and absorb energy during
overvoltage events.

This diode begins clamping at approximately 58 V and is rated for 6.6 kW
peak pulse power (10/1000 µs waveform). It is bidirectional, allowing it
to suppress both positive and negative transients relative to system
ground. During a surge event --- such as alternator load dump, battery
disconnection under load, or inductive spike --- the SM8S36CA diverts
energy away from sensitive downstream circuits by rapidly entering
avalanche breakdown.

This component was selected specifically for its compatibility with ISO
7637-2 Pulse 5b[^1] waveforms, including worst-case unsuppressed load
dumps of up to 150 V. Simulation and test confirm that the clamped
voltage at the downstream surge stopper FET remains within safe limits
during these conditions.

The TVS diode also contributes to ESD protection, supplementing local
filtering and layout strategies. It is capable of absorbing ±30 kV
contact discharges when tested per IEC 61000-4-2 [^2], with
negligible leakage under normal operating voltages.

Its placement upstream of the MOSFET allows it to protect the input
circuitry without exposing internal logic or regulation components to
surge currents.

Simulation of the SM8S36CA response to an ISO 7637-2 Pulse 5b event ---
approximated as a 150 V exponential decay with a time constant of 80 ms
--- confirms that the diode clamps the downstream voltage to a maximum
of 58 V throughout the transient. This provides over 40% margin relative
to the 100 V absolute maximum of the surge stopper MOSFET and 65 V
rating of the primary SMPS controller \[16\]. The diode's power
absorption capability exceeds the energy of the test waveform, ensuring
robust protection even during worst-case alternator disconnect or
overvoltage conditions.

![A graph with a red line AI-generated content may be
incorrect.](media/media/image1.png){width="6.490277777777778in"
height="3.216666666666667in"}

The simulated energy absorbed by the SM8S36CA during a worst-case ISO
Pulse 5b event is approximately 16.7 J, well within the capabilities of
this device. With a peak pulse power rating of 6600 W (10/1000 µs
waveform), the diode offers ample headroom for marine surge events. This
safety margin ensures long-term reliability even under repeated
transient exposure.

### Over-voltage & Current-limiting

The over-voltage and current-limiting functionality is implemented using
a discrete surge stopper circuit built around a P-channel MOSFET, two
bipolar junction transistors (BJTs), and a high-side shunt resistor.

The over-voltage cutoff is defined by a resistive voltage divider
connected to the input rail. When the divided voltage exceeds the
base-emitter threshold of a monitoring PNP transistor (approximately
0.6--0.7 V), the transistor begins conducting. This pulls the gate of
the P-channel MOSFET upward, switching it off and disconnecting the
load. The resistor values are selected to yield a trip point of
approximately 18.5 V, sufficient to protect all downstream regulators
and components from accidental overvoltage conditions --- for example,
an alternator operating without a battery load.

The current-limiting function is based on a 0.68 Ω high-side shunt
resistor. A second BJT monitors the voltage across the shunt. When the
drop exceeds \~0.7 V (corresponding to \~1.0 A), this transistor
activates and also pulls up the MOSFET gate, disabling the load path.
This mechanism protects the regulator and filter stages from sustained
overcurrent events such as short circuits or excessive inrush.

The MMBT5401 PNP transistors used to sense current and voltage and drive
the MOSFET gate have a Vce of 150V and a maximum Ice of 600 mA,
improving reliability under high dV/dt switching conditions and
providing a faster turn-off transition for the MOSFET. This ensures that
both over-voltage and over-current protections activate swiftly and
effectively.

![](media/media/image2.png){width="6.490277777777778in"
height="3.8680555555555554in"}

The operation of this circuit has been validated under load dump
simulation and current injection tests. Transients above the trip point
result in sharp MOSFET cutoff with minimal overshoot. The system
automatically recovers when the fault condition clears, ensuring
seamless protection without requiring external intervention.

A simulated ISO 7637-2 Pulse 5b transient (150 V peak, 80 ms decay) was
applied to the input. When the input exceeds the 18.5 V trip threshold,
the gate voltage begins rising rapidly through the 4.7 Ω gate resistor
and 100 nF equivalent capacitance. Once the gate voltage crosses the
MOSFET's Vgs(off) threshold (approximately --2 V), the device switches
off, and the output is suppressed to near zero. The simulated response
confirms that the MOSFET turns off within microseconds of the
over-voltage condition, limiting downstream exposure and avoiding stress
to the 42 V-rated linear regulator and other sensitive circuitry.

The circuit also incorporates hysteresis, which prevents the MOSFET from
oscillating on and off near the trip point. When the MOSFET switches off
due to an over-voltage event, the load is disconnected and the voltage
at the upper leg of the voltage divider rises slightly, maintaining the
transistor in conduction. The MOSFET only re-enables once the input
voltage falls well below the trip threshold, ensuring stable operation
during slow-falling or noisy input conditions.

### Analysis and Failure Mode

Each of the three onboard power supply rails --- the 5 V SMPS, 3.3 V
LDO, and 8 V LDO --- incorporate integrated protection features to
ensure safe and reliable operation. These include short-circuit
protection, thermal shutdown, and undervoltage lockout (UVLO), as
detailed in sections 2.2, 2.3 and 2.4 respectively.

This section summarises the simulated and expected performance of each
input protection element under worst-case load dump conditions. It also
identifies their operating margins and expected failure modes.

*Reverse Polarity Protection*

The SS34 Schottky diode used on each power input is rated for 3.0 A
average forward current and 100 A surge for 8.3 ms. In reverse polarity
scenarios, the diode blocks current flow with minimal leakage (\~0.5 mA
at 40 V). The diode recovers automatically when correct polarity is
restored. Based on its electrical characteristics and the low impedance
of marine supply wiring, this component can safely tolerate sustained
reverse connection of 12--14 V without damage or thermal stress. No
failure mode is expected within the defined design limits.

The SS34 Schottky diode used on each power input provides low-loss
polarity protection with a typical forward voltage drop of approximately
0.5 V. The diode is rated for 3.0 A continuous forward current and can
tolerate surge currents up to 100 A for 8.3 ms. To verify its
suitability for transient load dump conditions, a time-series simulation
was performed using the worst-case ISO 7637-2 Pulse 5b profile.

In this scenario, the diode was modelled conducting up to 88 A peak
current with a decaying profile over approximately 43 ms. The simulated
energy dissipation was approximately 2.66 J, resulting in a calculated
peak junction temperature of \~146 °C assuming a thermal capacitance of
0.45 J/°C and 40 °C ambient. This remains below the device's 175 °C
absolute maximum junction temperature.

The results confirm that the SS34 operates within thermal and electrical
ratings even during extreme surge events. While the diode is operating
close to its limit, the simulated performance under these rare
transients justifies its use in this design. The part recovers
automatically once correct polarity is restored and no failure mode is
expected under normal or reverse connection scenarios.

*Transient Suppression (TVS Diode)*

The SM8S36CA is placed upstream of the MOSFET and begins clamping at
36 V, reaching a maximum clamped voltage of approximately 58 V during
surge conditions. Simulation of ISO 7637-2 Pulse 5b (150 V peak, 80 ms
exponential decay) using time-series integration shows the diode absorbs
approximately 19.3 J of energy. Assuming a conservative thermal
capacitance of 0.16 J/°C and ambient temperature of 40 °C, the peak
junction temperature is calculated at approximately 148 °C --- safely
below the device's 175 °C absolute maximum rating.

The expected temperature of the PCB pad beneath the TVS is estimated at
\~145 °C during this event, based on typical thermal gradients and
copper pour area. This remains below solder softening thresholds for
SAC305, with no long-term degradation expected. The TVS has sufficient
energy capacity to withstand multiple such transients without failure.

*Surge Stopper Circuit (MOSFET and BJT Controller)*

The over-voltage protection circuit operates effectively up to the
\~18.5 V threshold, disconnecting the load using a fast-switching
P-channel MOSFET. Simulation confirms that downstream voltage rises only
marginally before the MOSFET turns off within a few microseconds.
Overshoot is negligible, and sensitive components (e.g., the 42 V-rated
LP2951 LDO) remain protected.

The MMBT5401 PNP transistors used to detect over-voltage and
over-current events and drive the MOSFET gate are rated for 150 V
collector-emitter voltage and 600 mA collector current. These ratings
provide ample margin for the application and ensure fast and reliable
MOSFET turn-off during surge events.

The MOSFET does not conduct during the surge peak due to early turn-off,
and hence does not dissipate significant power during the load dump. The
calculated MOSFET temperature remains close to ambient.

Failure modes would typically require either:

- a surge above \~180 V sustained for \>100 ms, exceeding the SM8S36CA
  energy capacity;
- extended clamping that pushes junction temperature above 175 °C; or
- a fault disabling the over-voltage detection transistor, delaying
  MOSFET shutoff.

None of these conditions are expected in the defined operating
environment, and the design includes sufficient margin to survive
realistic automotive or marine transients.

The combined protection system performs robustly during surge and fault
conditions, ensuring continued safe operation of the downstream
regulation and logic circuitry.

*Sensitivity Analysis -- Surge Voltage Tolerance*

To evaluate the robustness of the protection scheme under more severe
conditions, time-series simulations were performed for ISO 7637-2 load
dump pulses with peak voltages of 150 V, 175 V, 200 V, 225 V, and 250 V,
each decaying exponentially over 400 ms. Both the TVS (SM8S36CA) and the
Schottky diode (SS34) were evaluated. While both were found to operate
within their respective SOA at or below 175 V, simulations show that
above this level the TVS junction temperature exceeds 175 °C and
cumulative energy approaches the device's failure threshold. The results
confirm the selected components are suitable for ISO 7637-2 Pulse 5b (up
to 150 V), but operation beyond 175 V is not guaranteed without risk of
failure.

*Short-Circuit Protection (Current Limiter)*

To evaluate the behaviour of the surge stopper circuit under a
downstream short-circuit condition, a simulation was performed assuming
the load is abruptly shorted to ground while the input remains at
13.5 V. The current through the MOSFET initially spikes to approximately
10 A, but is rapidly clamped by the over-current detection circuit. This
spike lasts for less than 5 µs before the current stabilises at
approximately 0.96 A --- the threshold set by the 0.68 Ω current sense
resistor and the V_BE turn-on voltage of the PNP sense transistor.

During the initial 5 µs, the MOSFET momentarily dissipates up to 67 W.
Thereafter, steady-state dissipation is \~13 W, and junction temperature
stabilises at 107 °C assuming continuous operation and 40 °C ambient.
This confirms that the MOSFET (IRFR5410TR, rated for 40 W) operates
safely under permanent short-circuit conditions. No thermal runaway or
SOA violation is observed.

The current-limiting function of the protection circuit provides robust
defence against hard short-circuits on the output. No fuses are
required. The circuit self-recovers when the fault is cleared, ensuring
high availability and fault resilience in the target environment.

### EMC

The MDD400 is designed to meet both conducted and radiated
electromagnetic emissions requirements for CE (EN 55032 Class B[^17])
and FCC Part 15 compliance, while ensuring robustness against
electromagnetic immunity threats in line with ISO 11452-2[^18] and
ISO 7637-2[^18]. To this end, a combination of discrete filtering
components and PCB layout strategies are employed to suppress emissions
and protect sensitive circuitry.

#### Conducted Emissions

The primary 12 V input is filtered using a multi-stage EMI suppression
network consisting of:

- a π-filter topology with 22 µF ceramic input capacitors, 10 nF
  mid-filter capacitor, and additional 22 µF output capacitors;
- a high-performance shielded common-mode choke (SMCM7D60-132T) rated
  for 1.3 A;
- a 100m Ω sense resistor for diagnostic current monitoring; and
- a 600 Ω @ 100 MHz ferrite bead (FB3) to attenuate high-frequency
  common-mode noise to/from the switching regulator domain.

This network effectively attenuates conducted emissions above 1 MHz and
isolates switch-mode regulator noise from reaching the vessel\'s 12 V
supply lines. The design target was to suppress switching harmonics to
\< 100 mV peak-to-peak, as observed at the 12 V input under full load.

#### Radiated Emissions

Careful segregation of analog, digital, and high-current switching
grounds helps reduce loop areas and suppress radiated emissions. Key
measures include:

- low-inductance return paths using filled copper pours;
- edge-stitched ground planes isolating external connector regions;
- strategic placement of high-frequency capacitors near connector pins
  (e.g., 100 pF across CAN_H/L); and
- use of differential layout for CAN and legacy serial lines.

#### CANBUS Interface Filtering

The CAN interface is isolated and filtered using:

- 15 pF capacitors from each CAN line to chassis ground (NET-C);
- a 100 pF differential capacitor between CAN_H and CAN_L;
- a high-isolation common-mode choke (ACT45B-510-2P-TL003);
- an NUP2105L TVS array for ESD and transient suppression.

This filtering approach is consistent with the recommendations of ISO
11898-2[^19] and helps prevent both emissions and susceptibility to
EMI propagating through the NMEA 2000 network.

#### Legacy Serial Port Filtering

The optional 12 V legacy serial interface is also filtered using:

- 100 µH inductors on power and signal lines;
- 100 pF shunt capacitors for high-frequency filtering; and
- a SMF15CA TVS diode for signal line ESD and surge protection.

Combined with layout isolation from the CAN domain, this ensures that
emissions from external devices do not couple into the main PCB
circuitry.

#### Grounding and Isolation Strategy

The MDD400 employs separate digital (GND) and connector/chassis (NET-C)
ground domains. These are joined only at carefully controlled locations,
typically through the shield of common-mode chokes or designated
net-ties. This strategy minimizes ground bounce, avoids ground loops,
and enhances immunity to conducted and radiated transients.

By implementing these design strategies, the MDD400 is able to comply
with applicable EMC regulations while maintaining reliable operation in
electrically noisy marine and automotive environments.

#### Wireless Subsystem (Wi-Fi and Bluetooth)

The MDD400 incorporates the Espressif ESP32-S3 microcontroller, which
includes integrated Wi-Fi and Bluetooth/BLE radios. The module carries
CE and FCC modular certification, having been tested to comply with FCC
Part 15 Subparts C and E, EN 300 328 and EN 301 489 under the Radio
Equipment Directive (RED)[^16]. Provided the integration guidelines
(antenna layout, decoupling, trace clearance) are followed --- as they
are in the MDD400 --- no further radiated emissions testing is required
at the system level.

## Power Supplies

### 12 V Power Domain

The MDD400 is supplied from a nominal 12 V input, which serves as the
master power domain for the entire system. This 12 V rail is filtered,
protected against load-dump and ESD events, and regulated into three
downstream voltage domains:

- 5 V SMPS: used primarily for the LCD backlight and as the intermediate
  supply for the 3.3 V LDO;
- 3.3 V LDO: supplies the ESP32 MCU and other digital circuitry;
- 8 V LDO: powers the optional analog wind transducer.

Protection features include:

- An over-voltage cutoff at \~18.5 V, implemented by a discrete surge
  stopper circuit;
- Input current limiting at \~960 mA during short-circuit or overload
  conditions.

Power consumption was assessed under three scenarios:

- Day -- daytime use with the display backlight at 100% and wireless
  transmitters (Wi-Fi and Bluetooth) off;
- Night -- nighttime use with display backlight reduced to 1% and
  wireless transmitters off;
- Peak -- full daytime use with display backlight at 100% and
  Wi-Fi/Bluetooth active.

*Table 2.4* summarises the typical and peak 12 V domain power
consumption across these three operating conditions.

  -----------------------------------------------------------------------
  **Domain**                   **Night**       **Day**        **Peak**
  -------------------------- -------------- -------------- --------------
  5 V SMPS (LCD only)           \~92 mA        \~245mA        \~245 mA

  3.3 V LDO (digital domain)    \~329 mA       \~328mA        \~542 mA

  8 V LDO (only with wind       \~16 mA        \~16 mA        \~18 mA
  transducer)                                              

  **Total current @ 12 V**      \~208mA        \~277 mA       \~376 mA

  **Power**                     \~2.5 W        \~3.3 W        \~4.5 W
  -----------------------------------------------------------------------

  : Table 2.4 Power Summary across Domains

\*Backlight current at 1% brightness estimated to be \~20 mA, based on
display datasheet and linear PWM scaling.

Based on these estimates, the MDD400 draws \~85 mA under night-time use
and up to \~317 mA under peak conditions. This corresponds to a Load
Equivalency Number (LEN) of 2--7, well within the NMEA 2000 maximum
permitted value of LEN = 20 \[20\].

The RV-C specification does not impose explicit power consumption limits
or standardized power budgeting mechanisms akin to the NMEA2000
specification's LEN, so there\'s no inherent protocol-level enforcement
to prevent excessive power draw by individual devices. System designers
and integrators bear the responsibility of ensuring that the cumulative
power consumption of RV-C devices does not exceed the capabilities of
the RV\'s power distribution system.

In practice, this necessitates careful planning and consideration during
the design and integration phases. Manufacturers and installers must
assess the power requirements of each RV-C device and ensure that the
total load remains within safe and functional limits. This approach
helps maintain system stability and prevents potential issues arising
from power overconsumption on the network.

If you\'re integrating devices like the MDD400 into an RV-C network,
it\'s advisable to:

- review the power consumption specifications of each device.
- ensure that the RV\'s power distribution system can handle the
  cumulative load.
- consult the RV-C Layer document for any updates or recommendations
  regarding power management.

The design ensures compatibility with marine and RV networks and
prioritises energy efficiency---an important consideration for
solar-powered or battery-limited systems such as sailboats.

### Primary Power Domain (5.0 V)

The 5 V rail is derived from the filtered 12 V input using a buck-mode
switching regulator (TPS54560B-Q1[^6]). It provides up to 5 A peak
current and serves as the intermediate supply for the 3.3 V LDO as well
as directly powering the serial LCD display. The regulator offers:

- wide input range up to 60 V;
- integrated high-side MOSFET;
- thermal shutdown and current limit protection; and
- adjustable soft-start and switching frequency.

The switching frequency is set to 1.25 MHz. The output is filtered using
a 22 µH power inductor and a 47 µF low-ESR ceramic capacitor, with
additional bulk capacitance as required. A 600 Ω @ 100 MHz ferrite bead
(FB3) on the output further suppresses high-frequency noise.

The SMPS layout closely follows Texas Instruments' guidelines, with a
compact switching loop, tight input/output capacitor placement, and
careful separation of power and analog grounds. The SMPS section is
isolated by local copper pours, connected to the global ground plane
through a high-frequency ferrite.

Display power is gated by a P-channel MOSFET controlled via \[DISP_EN\].
This allows firmware to shut down the 5 V rail to the display, reducing
standby power or resetting the DGUS display controller if required.

### Digital Logic Domain (3.3 V)

The 3.3 V digital logic domain is powered by an AMS1117-3.3 \[7\]
low-dropout (LDO) linear regulator, using the 5 V rail as its input.
This domain powers the ESP32-S3 microcontroller, CAN transceiver, I²C
sensors, and analog signal conditioning stages.

Capacitive filtering on the LDO output includes:

- 10 µF local bulk capacitance;
- 100 nF decoupling capacitors placed near all major loads; and
- five 10 µF + 100 nF RC pairs at the ESP32, CAN transceiver, and op-amp
  stages.

The AMS1117 features internal current limiting and thermal shutdown.
Under typical operating conditions, the 3.3 V rail draws approximately
405 mA, with short-term peaks up to 640 mA. These values are distributed
across the subsystems as shown in *Table 2*.

Thermal dissipation is mitigated through extensive copper pours on all
four PCB layers, all tied to the LDO output pin (Pin 2 / Tab). A 3×3 via
array connects the top and bottom layers, and a soldermask opening on
the bottom layer improves convective cooling. This configuration ensures
safe junction temperatures under all expected load conditions. Under
peak load conditions of \~640 mA, with a 5 V input and 3.3 V output, the
AMS1117 dissipates approximately 1.1 W. Based on a conservative thermal
resistance estimate of \~30 °C/W with good copper heatsinking, the
resulting temperature rise is under 35 °C. Given a 40 °C ambient
environment, the regulator operates well below its 125 °C junction
temperature limit. These results confirm that the AMS1117 is adequately
specified for both average and peak operating conditions in the MDD400.

  -----------------------------------------------------------------------
  **Load Component**                      **Typical      **Peak Current**
                                          Current**      
  ----------------------------------- ------------------ ----------------
  ESP32-S3                                  250 mA           450 mA\*

  Ambient light sensor (OPT3004)            0.2 mA            0.2 mA

  Dual op-amps (TLV9002IDR ×2)              2.6 mA             4 mA

  Comparator (LM393DR)                       1 mA             1.5 mA

  CAN transceiver (SN65HVD234)              74 mA             85 mA

  Pull-up loads                             \~1 mA            \~1 mA

  **Total**                              **\~329 mA**      **\~552 mA**
  -----------------------------------------------------------------------

  : Table 2: Digital Domain (3.3v) Loads

\*Peak current estimate reflects ESP32-S3 operation with active Wi-Fi
transmission at high data rates, based on Espressif datasheet
specifications.

### Analog Sensor Domain (8.0 V)

#### The 8 V supply is provided using a linear LDO (LP2951-50DR[^22]), supplied from the unregulated, protected 12 V rail. The regulator can be disabled if no wind transducer is connected.

To protect this output against miswiring (such as direct short to
ground), a current-limiting circuit is implemented using discrete
components, followed by a voltage monitor that informs the
microcontroller of fault conditions.

#### Load

The optional 8 V analog rail is dedicated to powering legacy masthead
wind transducers, including popular transducers from Raymarine /Autohelm
and Navico (B&G, Simrad). We studied several generations of these
transducers and found them to present very similar electrical loads. We
briefly discuss the Raymarine E22078/9 and B&G 213 transducers below as
a typical examples.
- *Raymarine E22078/9* - The primary load for Raymarine sensors is a
  Melexis Sentron 2SA-10 dual-axis Hall-effect sensor, which draws a
  steady supply current of approximately 16 mA as per its datasheet
  [^26]. In addition, the transducer includes two TL914 dual op-amps
  that buffer the X/Y vane signals and provide local power conditioning
  for the sensor. While these op-amps and associated passive components
  contribute additional quiescent current, the total consumption of the
  wind transducer is estimated to remain below 25 mA in normal
  operation. The anemometer circuit, which uses an opto-interrupter with
  a series 560 Ω resistor, contributes transient pulses but negligible
  average current. Combined, the entire wind transducer system is well
  within the 100 mA output rating of the LP2951-50 LDO.
- *B&G 213 Masthead Unit* -- The B&G 213 transducer operates nominally
  at 6.5 V and has been verified to tolerate input voltages up to 8 V.
  Diagnostic documentation indicates the use of analog vane signals with
  phase-shifted sinusoidal outputs (Red, Green, Blue) and a pulse-type
  wind speed output on the Violet line. Under normal operation, the B&G
  213 unit draws significantly less than 100 mA, with total current
  estimated around 25--30 mA, consistent with its analog signal
  architecture and passive sensing elements. Compatibility testing
  confirmed stable operation of the unit at 8.0 V, with no signal
  distortion or thermal issues observed.

#### Design

The LP2951 uses a resistor divider on the feedback pin (pins 6 and 7) to
adjust the output to 8.0 V. It features internal current limiting,
thermal shutdown, and a precision reference. The shutdown pin (pin 3) is
controlled via \[WIND_EN\], allowing the 8 V rail to be disabled in
firmware when the wind sensor is not in use. The regulator input is
protected using a 10 Ω series resistor (R68) to limit inrush current and
short-circuit stress and a 600 Ω @ 100 MHz ferrite bead (FB7) is placed
on the input to attenuate high-frequency conducted noise.

The output includes a low-leakage BAT54 Schottky diode (D1) to prevent
reverse current flow, and an additional ferrite bead (FB1) to improve
EMI suppression at the analog interface connector. Output filtering
comprises a 10 µF bulk capacitor and a 100 pF high-frequency bypass
capacitor, along with a feedback RC network (R17/R18 and C48) for loop
stability.

The LP2951's dropout voltage of less than 0.6 V at 100 mA ensures
reliable regulation even under low input conditions, with wide tolerance
to input transients thanks to the upstream protection network.

#### Analysis

Thermal analysis shows that, under maximum expected load of 50 mA, power
dissipation is approximately 0.24 W (for a 4.8 V drop at 50 mA),
resulting in a temperature rise of less than 15 °C on the PCB copper
pour. The regulator remains well within its 125 °C junction temperature
rating, even in high ambient conditions.

#### Current Limiting

The 8 V output is protected by a discrete linear current-limiting
circuit. This design uses a P-channel MOSFET as a high-side pass
element, driven by an NPN transistor that monitors the load current via
a 12 Ω shunt resistor. When the output current exceeds 50 mA, the
circuit enters a controlled current-limiting mode to protect both the
device and external wiring from overheating or damage due to miswiring
or short circuits.

In normal operation, the gate of the P-MOSFET is pulled down to ground
through a 470 Ω resistor. With the source at 8 V and the gate at 0 V,
the gate-source voltage is --8 V, ensuring the MOSFET is fully enhanced
and offers minimal resistance to the load. A 7.5 V Zener diode between
gate and source limits the maximum gate-source voltage to a safe level
during power-up and limiting conditions.

Current flowing to the load develops a voltage across the 12 Ω shunt
resistor. When the load current exceeds approximately 50 mA, the
resulting voltage (\~0.6 V) turns on the NPN transistor, which begins
pulling the gate of the MOSFET upward via a 2.2 kΩ resistor. As the gate
voltage rises toward the source, the MOSFET\'s conduction decreases,
causing it to enter its linear region and limit the current supplied to
the load. This analog feedback loop maintains the output current near
the limiting threshold until the fault is removed.

A small 470 pF capacitor is connected in parallel with the sense
resistor to speed up the response of the current limiter to fast
transients, such as capacitive inrush or sudden short circuits. This
ensures the transistor turns on promptly and the MOSFET begins
throttling before significant energy is delivered to the fault. The
discrete design avoids the need for sacrificial or resettable fuses, and
integrates smoothly with the downstream voltage-monitoring comparator
that informs the microcontroller of persistent faults.

#### Undervoltage Monitoring

The 8 V power output to the wind transducer is monitored by a
comparator-based circuit that allows the microcontroller to detect fault
conditions such as output undervoltage, short circuits, or regulator
dropout. This enables firmware to take appropriate recovery actions and
provide user feedback in the event of wiring errors or external faults.

The monitoring circuit is built around a low-power comparator with
open-drain output. The inverting input of the comparator is connected
directly to the 8 V output through a 12 kΩ resistor and is filtered by a
1 nF capacitor to ground. This configuration allows the inverting input
to closely track the output voltage while rejecting high-frequency
noise.

The non-inverting input receives a fixed reference voltage derived from
the 12 V protected supply rail via a resistive divider consisting of
22 kΩ and 10 kΩ resistors. This divider establishes a threshold of
approximately 3.75 V.

Under normal operating conditions, the output voltage is near 8 V, and
the inverting input is well above the 3.75 V threshold. In this state,
the comparator output remains low, pulled down via its open-drain output
stage. If the 8 V output drops significantly --- for example, due to a
short circuit, overload, or MOSFET limiting action --- the inverting
input falls below the reference voltage. This causes the comparator to
release its output, which is then pulled high via a 10 kΩ resistor. This
rising edge is detected by the microcontroller as a fault condition.

The comparator output (8V_MONITOR) may be polled in firmware or used as
an interrupt source. It provides a simple yet effective digital signal
to indicate output health without the need for analog-to-digital
conversion. Combined with the upstream current-limiting circuit, this
monitor provides robust protection against user wiring errors and
short-circuit events.

# Communications SUBSYSTEM

## CANBUS Interface

The MDD400 connects to the NMEA 2000 network via a standard 5-pin
DeviceNet A-coded male connector. The CAN interface is isolated and
filtered with ESD and surge protection devices to ensure compliance with
marine EMC standards. A SN65HVD234DR[^12] CAN transceiver interfaces
the differential CANBUS signal to the ESP32\'s TWAI® pins. The
SN65HVD234DR is a 3.3 V high-speed CAN transceiver rated for data rates
up to 1 Mbps. It incorporates several features that improve bus
reliability and robustness in harsh environments, including slope
control for reduced EMI, a dominant state timeout to prevent bus lockup,
and a low-power standby mode. The device is fully compliant with ISO
11898-2 [^19] and is well suited for use in marine and automotive
environments where noise immunity is critical.

### CANBUS Signal Conditioning

The CAN_H and CAN_L signals pass through:

- 15 pF ceramic capacitors to local ground (NET-C);
- a 100 pF differential capacitor across the lines;
- a common-mode choke (Murata ACT45B-510-2P-TL003 [^23]);
- an NUP2105LT1G dual TVS array [^24];
- and an SN65HVD234DR CAN transceiver [^12].

These components form a compact, low-loss CAN filter network designed in
accordance with Texas Instruments application notes [^25], [^26]. The
series capacitors (C23, C24, C18, C19) provide common-mode noise
shunting and ESD suppression, while the 100 pF differential capacitor
(C29) improves high-frequency noise immunity between CAN_H and CAN_L.
The ACT45B common-mode choke attenuates high-frequency interference
without significantly degrading the differential signal.

The short, direct PCB trace routing between the connector, filter
components, and transceiver minimises parasitic inductance and avoids
unnecessary layer transitions. The CANH and CANL signals are routed as a
tightly coupled differential pair, preserving signal symmetry and
maintaining consistent impedance. These layout strategies reduce
radiated and conducted emissions and help ensure compliance with CISPR
25 [^17] and ISO 11452-2 [^18] in marine and automotive
installations.

## Power Supply

The SN65HVD234 transceiver is powered from the 3.3 V digital supply rail
shared with the ESP32. A three-stage bypass network is implemented at
the VCC pin to ensure power integrity across a wide frequency range,
consistent with the datasheet:

- a 10 µF ceramic capacitor provides low-frequency bulk decoupling and
  stabilizes the supply during slower load changes;
- a 100 nF ceramic capacitor is placed close to the VCC pin for general
  high-frequency bypassing; and
- a 100 pF ceramic capacitor suppresses high frequency noise, e.g. fast
  transients caused by CAN signal switching.

### TTL I/O

The SN65HVD234 transceiver is powered from the 3.3 V digital supply rail
shared with the ESP32. Logic-level CAN communication is implemented
through the TX and RX pins:

- \[CAN_TX\] connects directly to the transceiver's D pin. A 10 kΩ
  pull-up resistor (R26) is used to ensure a defined idle state and
  limit noise susceptibility.
- \[CAN_RX\] is connected to the transceiver's R pin via a 68 Ω series
  resistor (R25), which limits inrush current, dampens reflections, and
  protects the ESP32 input from voltage spikes or overshoot.

Neither \[CAN_TX\] nor \[CAN_RX\] are strapping pins on the ESP32-S3,
ensuring reliable bus behaviour during device flashing, reset or
startup.

### Slope Control

The SN65HVD234 transceiver features a slope control mechanism on pin 5
(Rs), allowing designers to reduce the signal edge rate to suppress EMI.
The slew rate is controlled by an external resistor to ground, and in
the MDD400 a 10 kΩ pull-down resistor (R27) is fitted, resulting in a
slew rate of approximately 15 V/µs.

Although the NMEA 2000 protocol mandates a data rate of 250 kbps, this
value does not require a proportional edge rate. In differential
signalling, reliable communication depends not only on bit rate but also
on timing margins, signal rise/fall symmetry, and the receiver\'s
ability to tolerate slower transitions. A slew rate of 15 V/µs is
sufficient to support 250 kbps signalling over short drop cables (e.g.
1 m), such as those used to connect the MDD400 to the backbone. In
practice, the edge rate limits the effective signalling bandwidth---not
the fundamental data rate---so this setting provides ample timing margin
without compromising protocol compliance.

Using a 10 kΩ pull-down offers a well-balanced trade-off: it
substantially reduces high-frequency emissions (which scale with dV/dt)
while remaining compatible with the stub length and impedance
environment of a typical NMEA 2000 network. It also aligns with guidance
provided by Texas Instruments in \[25\], which highlights 10 kΩ as an
effective value for slope control in industrial and automotive CAN
installations. The use of a resistor instead of an Rs capacitor
simplifies the PCB layout and guarantees stable performance over
temperature and component tolerances.

### Signal Integrity Simulation

A signal integrity simulation was conducted, assuming that the MDD400 is
intended to connect to the NMEA 2000 network using a standard 5-pin
DeviceNet A-coded male connector, with power and CAN signals provided
via a short (1 m) drop cable. The NMEA 2000 backbone is assumed to
comply with the NMEA 2000 physical layer specification \[20\], including
termination via 120 Ω resistors at the bus extremities.

\[Insert Figure: Signal Integrity Simulation of CAN_H and CAN_L\]

## Legacy Serial Interface

The MDD400 supports an optional legacy serial interface designed to
receive and/or transmit data compatible with SeaTalk I (single-wire, 12
V open-drain) and NMEA 0183 (12 V single-ended, receive-only). Given the
12 V signaling levels and the lack of galvanic isolation in typical
legacy marine installations, the interface was engineered to maintain
signal integrity and electromagnetic compatibility (EMC) through robust
input filtering, carefully managed ground domains, and multi-stage
protection.

![](media/media/image3.png){width="6.5in" height="4.329861111111111in"}

The legacy interface accepts a single bidirectional signal line
(ST_SIG), which is filtered and protected before being interfaced with
the internal logic domain. SeaTalk operation uses a half-duplex scheme,
sharing the line for both transmission and reception. NMEA 0183
operation is receive-only.

### Interface Conditioning and Power

Incoming power and signal lines are routed through a multi-stage filter
network:

- A common-mode choke (SMCM7060-132T) suppresses high-frequency noise;
- Shunt capacitors (100 pF) to both digital and chassis ground domains
  provide RF filtering;
- A bi-directional TVS diode (P6SMB15CA) clamps voltage spikes up to ±15
  V;
- Additional series resistance and diode clamping stages limit current
  and prevent latch-up.

This configuration offers substantial protection against ESD, conducted
transients, and radiated EMI, satisfying CE and EN 55035 immunity
requirements for the intended use case.

Internal signal buffering is provided by a two-stage transistor-based
receiver. This stage isolates the MCU RX pin from the external signal
domain and incorporates a voltage divider to safely shift the 12 V logic
signal down to 3.3 V logic levels. The receiver is continuously active
and handles both NMEA 0183 and SeaTalk receive functions.

Transmission is handled by a discrete open-collector driver controlled
by the MCU TX pin and gated by a dedicated ST_EN signal. This stage
mimics the behavior of legacy SeaTalk talkers by pulling the line low
during a logic \'0\' and tri-stating otherwise. Series resistors and RC
gate control limit EMI during transitions. An RC gate filter provides
slew-rate limiting without affecting low-speed signaling (SeaTalk
operates at 4800 bps).

All circuits are powered from the regulated 5 V domain (VCC), which is
isolated from the external 12 V input by a pi filter and diode clamp.
The entire legacy port shares a distinct ground domain (NET-C), which is
joined to the main logic ground (GNDREF) via a common-mode inductor and
local filtering.

If pre-compliance EMC testing indicates the SeaTalk interface as a
source of excessive emissions or susceptibility, an alternative
implementation using opto-isolators may be considered. This would allow
complete galvanic isolation between the SeaTalk signal and the MDD400
logic domain, simplifying signal reference handling and improving
immunity to ground loops or cable-borne transients. This approach would
require powering the opto-isolated input side from the SeaTalk 12 V line
or a derived source, and is best suited to receive-only applications
such as NMEA 0183 listener modes.

### Circuit Description

#### Receiver

The input signal from the external ST_SIG line passes through diode D6A
(1N4148) for reverse polarity protection and current limiting via R51.
The signal is then applied to a pair of transistors (Q5A and Q5B)
forming a differential receiver. These are biased by R47, R48, and R49
to provide signal translation and buffering.

The output of this stage is fed to \[U1_RX\], as 3.3 V UART-level serial
data. This path is shared between NMEA 0183 and SeaTalk I operation. In
both modes, the receiver operates continuously to capture serial input.

#### Transmitter

For SeaTalk I, which uses a single bidirectional wire, the MDD400 must
also drive the ST_SIG line during transmission.

The transmit side employs Q6 (BC817) and Q8A (IMZ1A) as open-collector
drivers, selectively enabled by Q7B and Q7A under control of the ST_EN
signal. This allows the MDD400 to pull the signal line low while
maintaining high impedance when not transmitting. A passive pull-up
(R64) to +12 V ensures correct idle line voltage in the absence of an
active transmitter.

\[U1_TX\] drives the signal logic, with R50 and R55 providing base
current limiting and edge shaping.

### SeaTalk I Operation (Single Wire, RX/TX)

SeaTalk I is a single-wire bus using 12 V signaling, where idle = 12 V,
logic 0 = pulled to 0 V. It requires careful coordination between
transmit and receive functions. The MDD400 handles this using a
half-duplex scheme:

- when not transmitting, the ST_TX line is tri-stated, and the receiver
  monitors incoming traffic on ST_SIG;
- to transmit, ST_EN is asserted to activate the driver circuitry,
  pulling ST_SIG low as needed;
- an MCU-controlled TX driver sinks current during transmission and
  releases the line for receive or idle;
- after transmission, the output drivers are immediately disabled to
  avoid contention with other devices on the bus; and
- The RX stage remains active continuously and is tolerant of slow
  signal edges typical of long cable runs.

Timing and contention avoidance are handled in firmware. The circuit
allows for reliable operation, even on long or noisy SeaTalk I networks.

### 3.2.4 NMEA 0183 Operation (RX Only)

For NMEA 0183 sources, the MDD400 operates in receive-only mode. The
external talker is typically a GPS, depth sounder, or wind instrument.
Although the NMEA standard allows for differential signaling (RS-422),
most talkers in the marine environment operate in single-ended mode, and
are electrically compatible with this circuit. The circuit design is
also compatible with RS-422 (differential) data.

Only the receiver portion of the interface is used in this mode. The
isolated, level-shifted signal is passed to \[U1_RX\]. No transmission
is attempted, and the ST_EN signal remains low to ensure the transmitter
remains disabled.

This configuration ensures the MDD400 is compatible with any standard
NMEA 0183 talker without introducing noise or signal conflicts.

### Physical Connector

The physical interface for legacy serial signals is provided via a 3-pin
header:

- Pin 1 (RED): 12 V (power)
- Pin 2 (BLACK): GND
- Pin 3 (YELLOW): SIG (SeaTalk I / NMEA 0183 signal line)

This layout allows for simple three-wire connectivity using standard
SeaTalk I connector.

#### Power Isolation

In production, the SeaTalk +12 V pin is intentionally left unconnected
to the MDD400 internal power supply. This avoids introducing a second
power source and the associated risks of conflicting voltage domains or
ground loops. As a result, the MDD400 must be powered exclusively from
the NMEA 2000 backbone, and any SeaTalk devices must receive power
independently from the SeaTalk bus.

This isolation is implemented by omitting the polarity protection diode
on the SeaTalk power input. For advanced configurations, populating this
diode enables power input from the SeaTalk bus. Additionally, a normally
open solder jumper labeled ST_12V is provided to allow bridging the
SeaTalk and NMEA 2000 power rails. This option is intended for edge
cases, such as powering a single connected SeaTalk device that is not
attached to a live SeaTalk bus. Use of this jumper should be avoided in
typical installations to maintain electrical isolation and CE-compliant
power domain separation.

#### EMC, ESD and Ground

The legacy port is exposed via a 3-pin header (12 V, GND, SIG). In this
implementation, the +12 V line is left unconnected, and the interface is
powered entirely from the internal 5 V rail. The GND pin (SeaTalk
shield) is connected to GNDREF through a 1 µH inductor, which provides a
low-impedance signal reference path while attenuating high-frequency
noise.

Although the original SeaTalk protocol uses GND as a signal return and
implicit shield, this arrangement preserves CE compliance by preventing
direct coupling of noisy external grounds into the device ground plane.
The use of a separate shield pin was considered, but real-world
installations route signal returns through the GND wire, making this
unnecessary.

The input filter and grounding strategy ensure that EMC performance
meets CE and FCC Class B requirements for conducted and radiated
emissions. Immunity to electrostatic discharge, EFT, and surge is
provided by a combination of TVS clamping, series impedance, and
low-inductance layout.

In total, there are six possible wiring permutations of the three legacy
interface pins (12V, GND, SIG). These are evaluated in the *Table 4*:

  ----------------------------------------------------------------------------------------------
  **Wiring       **ST_SIG**   **12V_IN**   **GND**  **Outcome**                  **Protected?**
  Order**                                                                       
  ------------- ------------ ------------ --------- --------------------------- ----------------
  SIG, 12V, GND    ST_SIG        12 V        GND    ✅ Correct connection ---          ✅
                                                    normal operation            

  12V, SIG, GND     12 V        ST_SIG       GND    ST_SIG pulled high --- D6A         ✅
                                                    blocks current, input       
                                                    already expects 12 V        

  SIG, GND, 12V    ST_SIG        GND        12 V    GND applied to 12V_IN ---          ✅
                                                    D8 blocks reverse current   

  GND, 12V, SIG     GND          12 V      ST_SIG   GND on ST_SIG --- valid            ✅
                                                    electrical state (LOW), no  
                                                    damage                      

  12V, GND, SIG     12 V         GND       ST_SIG   Same as #2 --- signal input        ✅
                                                    sees 12 V, safely blocked   
                                                    by D6A                      

  GND, SIG, 12V     GND         ST_SIG      12 V    GND to ST_SIG --- logic LOW        ✅
                                                    input, 12 V on GND blocked  
                                                    by D8                       
  ----------------------------------------------------------------------------------------------

  : Table 4: Legacy Connector Wiring Permutations

All six possible wiring permutations are electrically safe. There are no
failure modes resulting from any pin swap of the 3-pin legacy connector.
While incorrect wiring may prevent the interface from functioning (e.g.,
no data received), no permanent damage will occur to the MDD400 or
connected devices. This level of fault tolerance is particularly
valuable for field installations and testing scenarios where connector
orientation or labeling may not always be foolproof.

# Sensors

## Power Sensor

The MDD400 continuously monitors its own supply voltage and current draw
to provide diagnostic data, support fault detection, and enable
intelligent power management. These measurements are digitized via the
ESP32-S3's internal ADCs and are sampled regularly by firmware. This
section describes the hardware circuits used for voltage and current
sensing.

### Voltage Sensing

The input voltage is sensed downstream of the active protection circuit,
at the output of Q13 (labelled V_PROTECTED), and represents the voltage
seen by all internal circuitry. A passive voltage divider consisting of
R52 (22 kΩ) and R57 (4.7 kΩ) scales the protected voltage to within the
0--3.3 V input range of the ESP32-S3 ADC. This scaled voltage is then
buffered by an op-amp (U8A), configured as a unity-gain follower using a
TLV9002IDR. The buffer ensures a low-impedance, noise-free signal
suitable for accurate ADC conversion and is connected to \[VSS_ADC\],
which is configured as an ADC input.

The voltage divider ratio is ​≈0.176. Given a 3.3 V ADC input range, the
corresponding maximum measurable input voltage is ​≈18.75 V.

With a 12-bit ADC resolution, the measured voltage can be calculated by
multiplying the ADC reading by a factor of 0.00458.

### Current Sensing

The input current is measured using a low-side 100 mΩ shunt resistor
placed in the return path of the main input filter stage. The voltage
developed across this resistor is proportional to the load current and
is used as the input to a non-inverting amplifier built around a
TLV9002IDR op-amp (U8B).

The amplifier uses a 10 kΩ input resistor (R56), a 150 kΩ feedback
resistor (R54), and a 3.3 kΩ resistor to ground (R58), producing a gain
of approximately 47. With the 100 mΩ shunt resistor the current
measurement range is 0 -- 715mA: double the normal operating peak
current of the MDD400, but below the upper limit of the protection
circuit. This ensures that any overcurrent condition results in a
distinct and easily detectable ADC output, simplifying firmware-based
fault detection.

The amplified signal is routed to (CURRENT_ADC) for sampling by the
ESP32-S3's ADC.

This design allows accurate current measurement without introducing
significant voltage drop or power loss in the ground return path. The
amplified signal is suitable for monitoring both steady-state load and
transient inrush currents.

With a 12-bit ADC resolution, the measured current can be calculated by
multiplying the ADC reading by a factor of 0.0001734.

## Temperature Sensor

Temperature monitoring is a key diagnostic feature of the MDD400,
providing insights into internal thermal conditions that may affect
reliability, performance, and user experience. The design includes two
complementary temperature sensors: the internal ESP32-S3 junction sensor
and an external high-accuracy I²C temperature sensor (TMP112) mounted
near the display.

Together, the ESP32-S3's internal sensor and the external TMP112 provide
robust and layered visibility into the thermal state of the MDD400,
improving resilience and field reliability.

### Internal Microcontroller Temperature Sensor

The ESP32-S3 microcontroller includes an integrated temperature sensor,
which is sampled periodically by firmware. This sensor provides an
estimate of the chip's internal junction temperature and is useful for
monitoring system-level heating caused by sustained processor load,
ambient temperature rise, or enclosure heat buildup.

While not calibrated for precision use, this internal sensor allows
early detection of abnormal heating, and supports thermal diagnostics
across a typical range of --20 °C to +125 °C. Measured values are
exposed via the system's diagnostics interface and may be used in
conjunction with voltage and current data to identify thermal trends.

However, due to its location within the silicon die, this sensor does
not reflect the temperature of nearby components --- particularly those
affected by external heat sources such as direct sunlight.

### External Display Temperature Sensor

To provide more meaningful thermal data near the display panel, a
dedicated TMP112AIDRLR temperature sensor is mounted on the main board,
in close proximity to the rear of the capacitive touch LCD. This sensor
is connected to the ESP32-S3 via the I²C bus pins \[SCL\] and \[SDA\].
The TMP112 device address is configured via the ADD0 pin to 0x48, the
default address when ADD0 is tied to GND.

The TMP112 supports 12-bit resolution (0.0625 °C per bit) with typical
accuracy of ±0.5 °C across the range --40 °C to +125 °C. It is powered
from the regulated logic supply (VCC), and includes 100 pF and 1 µF
local bypass capacitors (C55 and C56) for stability. A 10 kΩ pull-up
resistor (R38) is fitted on the ALERT line, allowing firmware to
configure an interrupt for temperature threshold crossing if needed.

This sensor provides a reliable indicator of display-local temperature
--- particularly important in marine environments where direct sun
exposure can rapidly elevate surface temperatures beyond the LCD's rated
operating range. The DWIN DMG48480F040_01WTC display does not
incorporate an internal temperature sensor, so external monitoring is
required. When high temperature is detected, firmware may respond by
dimming the backlight, issuing a warning, logging a diagnostic event or
turning off the display by pulling \[DISP_EN\] low.

## Ambient Light Sensor

The MDD400 incorporates an ambient light sensor to enable automatic
backlight brightness control and improve visibility in changing lighting
conditions. This functionality is particularly valuable in marine
environments, where ambient light can vary widely---from direct sunlight
to nighttime operation. Automatic adjustment reduces power consumption,
minimizes glare, and extends the useful lifetime of the display.

### OPT3004 Digital Ambient Light Sensor

The system uses the OPT3004DNPR, a low-power digital ambient light
sensor with high dynamic range and spectral response closely matching
the human eye. The sensor communicates with the ESP32-S3 via I²C and is
connected to the same bus as the TMP112 temperature sensor (\[SCL\] and
\[SDA\] pins). The OPT3004 address is configured via the ADDR pin
(connected to GND), setting its I²C address to 0x44.

The OPT3004 provides a 16-bit lux measurement over a dynamic range of
0.01 lux to 83,000 lux, automatically scaling via its built-in
exponent/mantissa format. This range is ideal for both indoor/dim
environments and direct sunlight detection. The sensor includes an
interrupt output (INT), which is not used in the current design but is
brought out to a test point for future expansion.

The device is powered from the 3.3 V logic supply (VCC) and is locally
decoupled with 100 pF and 1 µF capacitors (C7 and C8). A 10 kΩ pull-up
resistor (R9) is used on the I²C lines. The sensor is positioned close
to the front panel of the device to ensure accurate readings of incident
light on the display surface.

### Firmware Use

The ESP32-S3 periodically polls the OPT3004 and uses the reported lux
value to adjust the backlight brightness of the LCD panel. The lux value
is scaled to a target brightness level using a configurable mapping
curve, which may include hysteresis or smoothing to avoid flicker during
rapid ambient light transitions.

In low-light conditions, the firmware reduces the backlight intensity to
minimize power consumption and glare. In bright conditions, full
brightness is applied to maintain readability. The ambient light value
is also recorded in system diagnostics and may be used to correlate with
temperature trends or display behavior.

The use of a dedicated ambient light sensor improves user experience and
provides adaptive behavior in real-world conditions where lighting
varies significantly throughout the day.

## Wind Transducer Interface

This analog interface was designed to maximize compatibility with legacy
analog wind transducers that output analog angle and speed pulse
signals.

The architecture leverages single-supply op-amps and logic-level
conditioning to integrate cleanly with the ESP32-S3's internal
peripherals. Together with a regulated 8 V analog supply (Section
2.2.3), the MDD400 supports legacy transducers with minimal software
overhead and high confidence in signal fidelity.

### Circuit DESIGN

#### Transducer Power Supply

The transducer is powered from a regulated 8 V rail as described in
*Section 2.2.3*. Combined, the entire wind transducer system is well
within the 100 mA output rating of the 8 V /100 mA regulated power
supplied by this design.

#### Electromagnetic Interference Suppression

All transducer inputs include LC filtering (10 µH series inductors with
47 nF or 100 nF capacitors) to attenuate RF interference, with
particular care given to the high-impedance analog X/Y signals. Analog
ground routing and component layout were optimized to minimize loop area
and ensure stability under variable load conditions on the 8 V rail.

#### Wind Angle Signal Conditioning

The direction sensing circuit includes two independent analog channels
that receive and condition voltage signals representing wind direction:

Two analog wind angle signals from the transducer are routed through LC
low-pass filters (L5/C11 and L1/C1, respectively) to suppress
high-frequency interference. Each signal then passes through a resistive
divider (e.g. R21/R22 for X) and a DC blocking capacitor (C21/C2),
removing the transducer\'s DC bias and allowing the signal to be
re-biased around a local reference.

Each AC-coupled signal is biased to mid-rail via a resistor divider
(R23/R24 or R15/R14) that establishes a 2.5 V reference from the VCC
rail (typically 3.3 V). The resulting centered signals are fed into
single-supply rail-to-rail operational amplifiers (TLV9002) configured
as non-inverting buffers. These op-amps provide low-impedance drive and
isolation for the downstream analog-to-digital converters.

The processed outputs are connected to dedicated ADC-capable
\[WIND_X_ADC\] and \[WIND_Y_ADC\]. With appropriate sampling and
arctangent computation, these signals yield a continuous wind direction
angle from 0° to 360°.

#### Wind Speed Signal Conditioning

The supported transducers generate a pulse train on the wind speed
signal line via an opto-interrupter, hall-effect sensor or
open-collector transistor. This signal typically pulls the speed line to
0 V on every pulse and switches state twice per anemometer cup rotation.

The anemometer output (WIND_SPD) is a passive open-collector transistor
pulsed to ground inside the transducer. This signal is pulled up to the
8 V supply via R5 and further attenuated by R6/R8 before reaching the
comparator input.

The comparator (LM393) converts the analog pulse into a 3.3 V
logic-compatible TTL signal. The reference voltage for comparison is
derived via a simple resistive divider (R4/R7) from the 8 V rail and
decoupled by C3. The hysteresis resistor (R9) introduces positive
feedback to improve noise immunity and edge clarity.

The TTL output is connected to the \[WIND_SPEED_TTL\] pin, configured as
an interrupt-capable edge detector. Each falling edge represents a known
angular displacement of the anemometer, allowing firmware to compute
wind speed as a function of pulse frequency. Calibration to wind speed
is performed by the firmware and is user configurable.

This circuit is designed to work reliably with both Raymarine and B&G
anemometers, as both use fundamentally similar open-collector pulse
generation mechanisms.

### Compatible Wind Transducers

The wind transducer interface is compatible with a wide range of legacy
masthead wind transducers, including popular masthead transducers from
Raymarine /Autohelm and Navico (B&G, Simrad) that output analog wind
direction and pulse-based wind speed signals. While they differ in how
they encode wind angle, these transducers provide a similar
open-collector pulse signal for wind speed.

We studied several generations of these transducers and found them to
present very similar electrical interfaces. The shared signal
conditioning circuitry enables clean digital interfacing with the
ESP32-S3 MCU.

[*The interface circuit is NOT compatible with Raymarine RotaVecta™
transducers*.]{.underline}

#### Raymarine ST60-style Masthead Wind Transducer

For wind speed, the Raymarine transducer provides a pulse signal (Yellow
wire) generated by an opto-interrupter. This open-collector signal is
fully compatible with the WIND_SPEED comparator circuit, requiring no
modification.

For wind angle, the Raymarine transducer outputs analog sine and cosine
signals representing wind angle. These form a resolver-like system. The
two channels (Blue and Green wires) vary in voltage as the vane rotates
and are biased around half the transducer's supply voltage (\~4 V on an
8 V rail). The signals are processed through the shared analog
conditioning circuit and sampled by the ESP32-S3.

In firmware, wind angle is derived using:

> *θ=atan2(Y,X)*

We briefly discuss the circuit design of the later Raymarine
E22078/E22079, noting that the earlier ST60/50 and Autohelm transducers
are electrically and pin compatible.

The *Raymarine E22078/9* uses a Melexis Sentron 2SA-10 dual-axis
Hall-effect sensor, which draws a steady supply current of approximately
16 mA as per its datasheet [^26]. In addition, the transducer
includes two TL914 dual op-amps that buffer the X/Y vane signals and
provide local power conditioning for the sensor. While these op-amps and
associated passive components contribute additional quiescent current,
the total consumption of the wind transducer is estimated to remain
below 25 mA in normal operation. The anemometer circuit, which uses an
opto-interrupter with a series 560 Ω resistor, contributes transient
pulses but negligible average current. Combined, the entire wind
transducer system is well within the 100 mA output rating of the 8 V
regulated power supply.

Earlier ST60/50 and Autohelm transducers are electrically and pin
compatible with the later E22078/9. They are much simpler devices,
employing Hall-effect sensors from Honeywell for both the sine/cosine
and speed sensors. These early transducers draw less power than the
E22078/E22079 models.

#### B&G Wind Transducers

The B&G masthead transducer uses three phase-shifted analog outputs
(Red, Green, Blue), spaced 120° apart. These form a synchro-like system.
The MDD400 requires only two of these signals to compute angle and
typically uses the Red and Blue wires, connected to the WIND_X and
WIND_Y channels. These pass through the same analog signal chain as
described above.

In firmware, a modified trigonometric transform is used to calculate
wind direction:

> *θ=atan2(VB,VG)+offset*

Where VB​ and VG​ are the voltages sampled from the Blue and Green
channels respectively, and the offset compensates for phase alignment.

The B&G anemometer uses a similar open-collector switching circuit to
Raymarine for wind speed, producing a 2-pulse-per-rotation
open-collector output. This signal is fully compatible with the
comparator-based speed sensing circuit and requires no additional
conditioning.

The B&G 213 transducer operates nominally at 6.5 V and has been verified
to tolerate input voltages up to 8 V. Diagnostic documentation indicates
the use of analog vane signals with phase-shifted sinusoidal outputs
(Red, Green, Blue) and a pulse-type wind speed output on the Violet
line. The angle transducers employ magnetic coupling of the wind vane
shaft to an inductive antenna.

Under normal operation, the B&G 213 unit draws an estimated total
current of 25 to 30 mA, consistent with its analog signal architecture
and passive sensing elements. Compatibility testing confirmed stable
operation of the unit at 8.0 V, with no signal distortion or thermal
issues observed. ---

Since the MDD400 uses a Raymarine-compatible input layout, wiring B&G
transducers requires matching B&G colors to expected X/Y/Speed inputs.
Only two of the three angle phase outputs (typically GREEN and BLUE) are
required to compute wind angle via firmware.

  --------------------------------------------------------------------------
  B&G Wire Function         Connect to MDD400  MDD400 Label   Signal Path
                                   Pin                      
  -------- ---------------- ------------------ ------------ ----------------
  Red      Wind angle              ---             ---            ---
           (Phase R)                                        

  Green    Wind angle             GREEN             Y        → WIND_Y (ADC)
           (Phase G)                                        

  Blue     Wind angle              BLUE             X        → WIND_X (ADC)
           (Phase B)                                        

  Violet   Wind speed pulse       YELLOW           SPD      → WIND_SPEED_TTL

  Black    0V / Ground            SHIELD           GND           GNDREF

  Orange   +6.5V Supply            RED             +8V         → 8 V LDO
           voltage                                             Regulator
  --------------------------------------------------------------------------

  : Table 3: B&G Wind Transducer Wiring Matrix (post March 1996 devices)

Only two of the three angle outputs are required. Raymarine-compatible
wiring expects BLUE = X and GREEN = Y, which matches the most
straightforward firmware mapping for B&G systems. B&G transducer models
manufactured pre-March 1996 present a variety of colour -- signal
configurations. Please refer to the B&G service documentation[^28]
when connecting these older transducers.

The transducer interface presents a high impedance on all signal lines,
while the 8 V power line is polarity and short circuit protected.
Incorrect wiring will result in no

Special Considerations:

- The B&G units were originally powered from a nominal 6.5 V rail but
  have been verified to operate reliably at 8 V with current draw well
  under 100 mA.
- Ensure polarity is observed when connecting legacy B&G cables to the
  MDD400 breakout --- especially for older installations with
  undocumented color assignments.
- If needed, an inline adapter cable can be fabricated to convert
  between B&G 7-pin or 8-pin DIN connectors and the MDD400 connector
  block.

This matrix allows technicians or DIY users to connect legacy B&G
transducers to the MDD400 without modification, ensuring backward
compatibility across a wide range of vessels.

# USER Interface

## Overview and HMI Elements

The MDD400 features a minimalist yet powerful human-machine interface
designed for intuitive operation in marine and RV environments. The
interface comprises a high-resolution capacitive touch display as the
sole means of user input and output. There are no physical buttons or
rotary controls, ensuring a sealed, low-maintenance front panel with
IP-rated ingress protection.

User interaction is structured around a simple swipe and tap paradigm:

- Swipe left/right: Navigate between data pages.
- Swipe down: Access the control panel for brightness, data source
  selection, and other system-wide settings.
- Swipe up: Reveal per-page options and configuration overlays.
- Tap on-screen labels: Toggle display modes such as AWS/TWS,
  magnetic/true heading, or knots/Beaufort.

This interface prioritizes clarity, ease of use, and visibility under
all lighting conditions, with on-screen brightness control and automatic
timeout for the touch layer after inactivity.

## Power Supply

The display module is powered from the regulated 5 V supply rail,
controlled by a dedicated power switch circuit to allow selective
shutdown. This circuit uses a P-channel MOSFET (AO3407) gated by a BJT
(S8050) controlled via the \[DISP_EN\] pin. When \[DISP_EN\] is driven
high, the P-MOSFET turns on, supplying 5 V (VSS) to the display module.

Decoupling is provided by a 100 µF/50 V and a 10 µF/25 V capacitor in
parallel near the display connector (C25 and C21). This provides
adequate bulk capacitance and transient suppression for the display\'s
inrush and dynamic load.

The display consumes up to 245 mA at 5 V when the backlight is fully
illuminated, and as little as 75 mA with the backlight off, as verified
in Section 2.4 of the design report and the DWIN datasheet.

## Touch Display

### Characteristics

The MDD400 uses a DWIN DMG48480F040_01WTC capacitive LCD module. Key
characteristics include:

- Panel type: 4.0\" IPS TFT with 262K colors and 480×480 resolution.
- Viewing angle: 85° in all directions.
- Brightness: 250 nits (typical) with PWM dimming control from 0--100%.
- Backlight control: Brightness is dynamically adjusted based on ambient
  light conditions using the MDD400's onboard light sensor.
- Touch: 1-point capacitive touch (G+G structure), supporting continuous
  sliding gestures.
- Backlight life: \>10,000 hours at full brightness.
- Touch life: \>1,000,000 touches with 6H surface hardness.
- Power consumption: \<2 W maximum.

### Communication

The display communicates over UART2, using TTL signal levels:

- TX (MCU → Display): \[U2_TX\] pin; and
- RX (Display → MCU): \[U2_RX\] pin.

The interface operates using the DGUS II protocol, which abstracts
screen logic into memory pages, variables, and commands. This approach
minimizes MCU load and ensures responsive screen updates even on
lower-speed links.

Although the display supports a wide range of baud rates (up to
3.2 Mbps), initial firmware defaulted to 115200 bps for compatibility.
However, testing confirmed that reliable, error-free communication is
maintained at 460800 bps, even in electrically noisy environments. This
baud rate is now used in production, significantly improving screen
responsiveness during page transitions and configuration updates.

The interface uses the standard 8N1 format (8 data bits, no parity, 1
stop bit), consistent with DGUS II system defaults.

Practical testing confirms that the DWIN DMG48480F040_01WTC display can
reliably sustain sprite and GUI element updates at 30 frames per second
when communicating at 460800 bps via UART2. This performance is enabled
by the DGUS II protocol's use of preloaded assets and indexed object
control, rather than full bitmap transmission. While large image
transfers are constrained by UART bandwidth, command-level
updates---such as repositioning, toggling, or redrawing preloaded
objects---exhibit no perceptible lag at 30 FPS under typical usage
scenarios.

## Touch Screen Operation

The MDD400 uses a capacitive touch screen that supports single-point
gestures such as swipes and taps. Touch inputs are processed by the
internal controller of the DWIN display, using mutual capacitance
sensing to detect changes in the local electrostatic field when a
conductive object, such as a human finger, approaches the panel surface.

### Timeout

To conserve power and improve durability, the touch interface
automatically disables after a configurable period of user inactivity.
The default timeout is 15 s, after which the touchscreen is disabled
until the next touch. This timeout can be adjusted in firmware.

### Wet-Weather Usability

Capacitive touch screens are typically vulnerable to false inputs when
wet, as water droplets can interfere with the electrostatic field used
to detect touch. Early MDD400 prototypes mitigated this by requiring a
physical button press to activate the touchscreen. However, real-world
testing during long-term marine deployment showed this precaution to be
unnecessary. In testing, the touch interface remains fully usable in wet
conditions, including during rain or spray events. This robustness is
attributed to several factors:

- the display uses mutual-capacitance sensing, which is less susceptible
  to false inputs from stray conductive paths such as water films;
- the housing is constructed from non-conductive material and affixed
  using 3M 300LSE adhesive, providing full electrical isolation from the
  vessel;
- the housing is mounted to a GRP hull, offering no low-impedance return
  path to earth; and
- users are generally electrically isolated (e.g., by shoes or
  non-conductive flooring), reducing the coupling between finger, water,
  and system ground.

Together, these factors form a floating capacitive system with limited
return paths, reducing the influence of water and parasitic capacitance.

### Grounding Considerations on Metal-Hulled Vessels

On metal vessels, the hull and structure may provide a conductive path
to earth. If the display enclosure is bonded---intentionally or
inadvertently---to a grounded surface, the capacitive behaviour of the
touch interface may change. In particular:

- water films may couple more effectively to system ground, increasing
  the likelihood of false inputs; and
- users in contact with grounded metal may present a stronger capacitive
  target, potentially altering sensitivity.

To maintain performance in these installations, the following measures
are recommended:

- ensure mechanical isolation between the enclosure and any conductive
  mounting surfaces using non-conductive spacers or gaskets;
- avoid bonding the display ground to hull or battery ground unless
  specifically required by EMC or safety considerations; and
- maintain the current floating configuration of the touchscreen ground
  unless testing indicates a need for tighter control.

### Further Testing

Additional testing is planned to verify touchscreen reliability on
metal-hulled vessels and in conductive mounting environments.
Recommended tests include:

- operating the touchscreen under simulated rain or spray conditions
  while bonded to a grounded metal plate;
- comparing touch sensitivity and false input rate with the user
  isolated vs. grounded; and
- verifying whether localized grounding (e.g. display GND tied to
  chassis) affects performance in wet conditions.

These tests will guide design guidelines for future installation
scenarios and ensure consistent behavior across vessel types.

## Audio Alerts

A magnetic buzzer is driven by a PWM input on the \[AUDIO_PWM\] pin,
allowing the firmware to combine tones from the display and system
alerts.

The MDD400 display also includes an integrated audio output signal
(labelled DISP_AUDIO) that is routed to the system buzzer/speaker
driver.

The two audio signals are buffered by a BJT (Q1) and used to drive a
P-MOSFET (Q2), which controls current through the magnetic buzzer (BZ1).
An R-C filter (18 Ω / 470nF) creates a high pass filter with a cutoff
frequency of 8.8kHz. This smooths the tone, slightly reduces volume, and
rolls off the high-frequency buzz, giving a rounder, more pleasant beep,
especially at \~2--3 kHz.

This circuit supports:

- system error or warning tones triggered by firmware;
- acknowledgement or status tones from the DGUS display (e.g., on touch
  events); and
- PWM-controlled modulation for generating tones of varying pitch and
  duration.

The buzzer (MLT-8530) is a surface-mount transducer capable of \>80 dB
sound pressure at 5 V. Its compact size and efficient drive circuit
allow it to operate reliably across the full temperature and humidity
range specified for the device.

# Expansion Connectors

Expansion port connectors are not populated on consumer versions of the
MDD400. Only the MDD400-DEV version gives makers and the open-source
community access these connectors.

These connectors expose the microcontroller pins and no protection is
provided to ensure the maximum utility. The \[SDA\], \[SCL\], \[EN\] and
\[BOOT\] pins are pulled up to Vcc by 10k Ω resistors. All other pins
are not pulled up or down to maximise utility.

## ESP-PROG

Describe the ESP-PROG here

### Flash Programmer

Used in production for flashing firmware

Is a through-hole part. In production a dedicated programmer with pogo
pins is used to interface to the same footprint

### JTAG Debugging Port

The JTAG connector (1.27mm pitch, 2x5 pins) is compatible with the
ESP-PROG cable.

It is only populated tin the MDD400-DEV version.

The connector can be used for expanding four MCU pins to off-PCB
functions. The connector provides GND and 5v. In addition, 3.3v can also
be provided (on pin 10 of the connector) by closing the adjacent solder
jumper.

## I2C

Has a 4 pin, 2.54mm pitch male header, compatible with DuPont
cable/connectors. Exposes GND, 3v3, \[SDA\] and \[SCL\]

## One-Wire

The \[1-WIRE\] pin, GND and 5V is connected to this 3-pin, 2.54mm pitch
male header compatible with DuPont cable/connectors. Provides an
interface for industry standard DS18B20 one-wire temperature sensors.

# Processor

## Description

## flash storage partitioning

## GPIO Mapping

## WiFi

## Bluetooth / BLE

# Physical / Mechanical

## PCB Layout and Thermal Design

### Functional Layout

### Board Stackup

### Earth Planes

### Thermal Design

## Mechanical

### Connectors

### Dimensions

### Fasteners

# Appendices

## ESP32 GPIO Allocation

## Validation and Test Plan

## Specifications

### MDD400-N2K

### MDD400-LST

### MDD400-WST

### MDD400-DEV

## Bill of Materials

## Change Log
