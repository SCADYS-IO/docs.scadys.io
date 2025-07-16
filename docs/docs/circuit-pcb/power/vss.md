# Unregulated 12 V Domain (V<sub>SS</sub>)

The V<sub>SS</sub> rail is the primary power input to the MDD400 and the source for all internal supply domains. It accepts power from a nominal 12 V bus — typically shared with NMEA 2000 or legacy serial networks — and provides protected, filtered, and conditioned power to all downstream regulators. 

This section only notes loads supplied by the V<sub>SS</sub> domain. The 12 V circuit implementation is fully described in [Power Conditioning](power_conditioning/index.md).

The 12 V V<SUB>SS</SUB> domain supplies two downstream voltage domains:

* *Regulated Primary Power Domain (V<SUB>PP</SUB>)*: used for the LCD display and as the intermediate supply for the 3.3 V LDO and Isolated 5 V LDO;
* *Analog Sensor Domain (V<SUB>AS</SUB>)*: powers the optional analog wind transducer;

Power consumption was assessed under three scenarios:

* *Night* – nighttime use with display backlight reduced to 1% and wireless transmitters off;
* *Typical* – daytime use with the display backlight at 100% and wireless transmitters off;
* *Peak* – full daytime use with display backlight at 100% and Wi-Fi/Bluetooth active.


<table border="1" cellpadding="6" cellspacing="0">
  <thead>
    <tr>
      <th style="text-align: left">Domain</th>
      <th style="text-align: center">Night</th>
      <th style="text-align: center">Day</th>
      <th style="text-align: center">Peak</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: left">(V<SUB>PP</SUB>) (5 V)</td>
      <td style="text-align: center">190 mA</td>
      <td style="text-align: center">343 mA</td>
      <td style="text-align: center">529 mA</td>
    </tr>    
    <tr>
      <td style="text-align: left">V<SUB>AS</SUB> (8.0 V)<SUP>*</SUP></td>
      <td style="text-align: center">16 mA</td>
      <td style="text-align: center">16 mA</td>
      <td style="text-align: center">18 mA</td>
    </tr>
    <tr>
      <td style="text-align: left"><strong><em>Total current @ 12 V</em></strong></td>
      <td style="text-align: center"><strong><em>~100 mA</em></strong></td>
      <td style="text-align: center"><strong><em>~175 mA</em></strong></td>
      <td style="text-align: center"><strong><em>~260 mA</em></strong></td>
    </tr>
    <tr>
      <td style="text-align: left"><strong><em>Power</em></strong></td>
      <td style="text-align: center"><strong><em>∼1.25 W</em></strong></td>
      <td style="text-align: center"><strong><em>∼2.07 W</em></strong></td>
      <td style="text-align: center"><strong><em>∼3.11 W</em></strong></td>
    </tr>
    <tr>
      <td style="text-align: left"><strong><em>Load Equivalency Number (LEN)</em></strong></td>
      <td style="text-align: center"><strong><em>3</em></strong></td>
      <td style="text-align: center"><strong><em>4</em></strong></td>
      <td style="text-align: center"><strong><em>6</em></strong></td>
    </tr>
  </tbody>
</table>
<sub>\* Selected models only.</sub>

Based on these estimates, the MDD400 draws approximately 100 mA under night-time use and up to 260 mA under peak daytime conditions. This corresponds to a Load Equivalency Number (LEN) of 3 – 6, well within the [NMEA 2000](https://www.nmea.org/nmea-2000.html) maximum permitted value of LEN = 20 for devices directly powered from the backbone.

The RV-C specification does not impose explicit power consumption limits or standardized budgeting mechanisms akin to the NMEA 2000 LEN system. Instead, system designers and integrators must ensure that the cumulative load of RV-C devices remains within the capabilities of the RV’s power distribution system.
