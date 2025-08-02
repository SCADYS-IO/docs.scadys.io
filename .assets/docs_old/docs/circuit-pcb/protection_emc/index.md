# Power Supply Protection And Filtering

The electrical environment aboard small vessels shares many characteristics with automotive systems, but with greater variation and typically less standardisation. Marine electrical systems may incorporate multiple battery banks — often with separate cranking and house systems — and are increasingly adopting lithium chemistries such as LiFePO₄. It is not uncommon for vessels to include 24 V or 48 V subsystems or to operate some loads from inverter-generated AC power.

Despite this variability, the communication and sensor networks relevant to the MDD400 are standardised to operate from nominal 12 V supplies. The [NMEA 2000](https://www.nmea.org/nmea-2000.html) backbone, as well as legacy protocols such as SeaTalk and NMEA 0183, are all 12 V-based. These systems are generally unregulated, powered by user-installed cabling, and often exposed to transients caused by inductive loads, battery switching, or alternator events. The MDD400 must tolerate these conditions while maintaining safe operation of downstream circuitry.

Designing for this environment requires careful attention to both transient suppression and steady-state fault protection. The MDD400 input protection circuit is modelled on best practices from automotive design, particularly those outlined in <a href="https://www.iso.org/standard/50925.html">ISO 7637-2</a>. While this standard is not mandatory in marine applications, it provides a useful baseline for evaluating and simulating real-world transient events.

The MDD400’s power input protection strategy is defined by the design criteria in the table below, reflecting expected conditions on small vessel 12 V systems. These criteria guided the selection and simulation of each protection stage. A coordinated arrangement of clamping, filtering, and current-limiting components has been implemented to ensure protection against common-mode and differential transients, with staged elements that absorb and suppress voltage and current surges without nuisance tripping under normal high charging voltages (up to 14.8 V). The protection stages also account for both the high peak voltages and energy content associated with load dump conditions.

<table border="1" cellpadding="6" cellspacing="0">
  <thead>
    <tr>
      <th>Protection Function</th>
      <th>Design Criteria</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Reverse Polarity</td>
      <td>Survive continuous reverse connection of ±12 V<BR/>No damage; automatic recovery</td>
    </tr>
    <tr>
      <td>Load Dump and Surge Clamping</td>
      <td>Survive <a href="https://www.iso.org/standard/50925.html">ISO 7637-2</a> Pulse 5b (150 V, 400 ms exponential decay)<BR/>Limit to &lt; 60 V at the switching node</td>
    </tr>
    <tr>
      <td>ESD Protection</td>
      <td>Tolerate ±15 kV air discharge per <a href="https://webstore.iec.ch/en/publication/68954">IEC 61000-4-2</a></td>
    </tr>
    <tr>
      <td>Over-voltage Limiting</td>
      <td>Disconnect load above 18.5 V<BR/>Reconnect below 18.5 V without latch-up</td>
    </tr>
    <tr>
      <td>Current Limiting</td>
      <td>Limit current to ~1.0 A<BR/>Tolerate sustained overloads without damage</td>
    </tr>
    <tr>
      <td>EMC Filtering</td>
      <td>Suppress conducted emissions above 1 MHz; limit conducted noise to &lt; 100 mV p-p<BR/>Contain radiated emissions to meet <a href="https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15">FCC Part 15</a> and <a href="https://webstore.iec.ch/publication/24377">EN 55032 Class B</a> limits</td>
    </tr>
  </tbody>
</table>

These functions are implemented discretely to reduce cost, improve component availability, and allow field observability. Where appropriate, the design includes thermal protection and is engineered to fail safe under fault conditions.

The sections that follow describe each function in detail.


- [Overview](index.md);
- [Reverse Polarity Protection and Shield](polarity_shield.md);
- [ESD and Load Dump Protection](esd_load_dump.md);
- [Over-voltage and Current Limiting](over_voltage.md);
- [CAN / `DIGITAL` Domain Power Isolation](can_digital_isolation.md); and
- [EMC](emc.md).

Additional failure mode and stress analysis is provided in the [Analysis and Failure Modes](analysis_failure_mode.md) section.
