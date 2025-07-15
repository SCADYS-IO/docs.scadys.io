
# Unregulated 12 Volt Domain (V<SUB>SS</SUB>)

The MDD400 is supplied from a nominal 12 V input, which serves as the master power domain for the entire system. This 12 V rail is filtered, protected against load-dump and ESD events, and regulated into three downstream voltage domains:

- 5 V SMPS: used primarily for the LCD backlight and as the intermediate supply for the 3.3 V LDO;
- 3.3 V LDO: supplies the ESP32 MCU and other digital circuitry;
- 8 V LDO: powers the optional analog wind transducer.

Protection features include:

- An over-voltage cutoff at ~18.5 V, implemented by a discrete surge stopper circuit;
- Input current limiting at ~960 mA during short-circuit or overload conditions.

Power consumption was assessed under three scenarios:

- Day – daytime use with the display backlight at 100% and wireless transmitters (Wi-Fi and Bluetooth) off;
- Night – nighttime use with display backlight reduced to 1% and wireless transmitters off;
- Peak – full daytime use with display backlight at 100% and Wi-Fi/Bluetooth active.

The table below summarises the typical and peak 12 V domain power consumption across these three operating conditions.

*Power Summary across Domains*
<table border="1" cellpadding="6" cellspacing="0">
  <thead>
    <tr>
      <th>Domain</th>
      <th>Night</th>
      <th>Day</th>
      <th>Peak</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>5 V SMPS (LCD only)</td>
      <td>92 mA</td>
      <td>245 mA</td>
      <td>245 mA</td>
    </tr>
    <tr>
      <td>3.3 V LDO (digital domain)</td>
      <td>329 mA</td>
      <td>328 mA</td>
      <td>542 mA</td>
    </tr>
    <tr>
      <td>8 V LDO (only with wind transducer)</td>
      <td>16 mA</td>
      <td>16 mA</td>
      <td>18 mA</td>
    </tr>
    <tr>
      <td><strong>Total current @ 12 V</strong></td>
      <td><strong>208 mA</strong></td>
      <td><strong>277 mA</strong></td>
      <td><strong>376 mA</strong></td>
    </tr>
    <tr>
      <td><strong>Power</strong></td>
      <td><strong>~2.5 W</strong></td>
      <td><strong>~3.3 W</strong></td>
      <td><strong>~4.5 W</strong></td>
    </tr>
  </tbody>
</table>

Based on these estimates, the MDD400 draws ~85 mA under night-time use and up to ~317 mA under peak conditions. This corresponds to a Load Equivalency Number (LEN) of 2–7, well within the [NMEA 2000](https://www.nmea.org/nmea-2000.html) maximum permitted value of LEN = 20. 

The RV-C specification does not impose explicit power consumption limits or standardized power budgeting mechanisms akin to the NMEA2000 specification’s LEN, so there's no inherent protocol-level enforcement to prevent excessive power draw by individual devices. System designers and integrators bear the responsibility of ensuring that the cumulative power consumption of RV-C devices does not exceed the capabilities of the RV's power distribution system.

In practice, this necessitates careful planning and consideration during the design and integration phases. Manufacturers and installers must assess the power requirements of each RV-C device and ensure that the total load remains within safe and functional limits. This approach helps maintain system stability and prevents potential issues arising from power overconsumption on the network.

If you're integrating devices like the MDD400 into an RV-C network, it's advisable to:

- review the power consumption specifications of each device.
- ensure that the RV's power distribution system can handle the cumulative load.
- consult the RV-C Layer document for any updates or recommendations regarding power management.

The design ensures compatibility with marine and RV networks and prioritises energy efficiency—an important consideration for solar-powered or battery-limited systems such as sailboats.
