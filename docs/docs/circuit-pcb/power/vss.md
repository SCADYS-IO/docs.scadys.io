# Unregulated 12 Volt Domain (V<SUB>SS</SUB>)

The MDD400 is supplied from a nominal 12 V input, which serves as the master power domain for the entire system. This 12 V rail is filtered, protected against load-dump and ESD events, and regulated into four downstream voltage domains:

* *5 V SMPS*: used primarily for the LCD backlight and as the intermediate supply for the 3.3 V LDO;
* *3.3 V LDO*: supplies the ESP32 MCU and other digital circuitry;
* *Analog sensor LDO (6.5 V / 8 V)*: powers the optional analog wind transducer;
* *Isolated 5 V LDO*: supplies the isolated side of the CAN transceiver.

Protection features include:

* An over-voltage cutoff at ∼18.5 V, implemented by a discrete surge stopper circuit;
* Input current limiting at ∼960 mA during short-circuit or overload conditions.

Power consumption was assessed under three scenarios:

* *Night* – nighttime use with display backlight reduced to 1% and wireless transmitters off;
* *Day* – daytime use with the display backlight at 100% and wireless transmitters off;
* *Peak* – full daytime use with display backlight at 100% and Wi-Fi/Bluetooth active.

### Power Summary across Domains

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
      <td style="text-align: left">Isolated 5 V LDO (CAN transceiver)</td>
      <td style="text-align: center">8 mA</td>
      <td style="text-align: center">8 mA</td>
      <td style="text-align: center">9 mA</td>
    </tr>
    <tr>
      <td style="text-align: left">5 V SMPS (LCD only)</td>
      <td style="text-align: center">92 mA</td>
      <td style="text-align: center">245 mA</td>
      <td style="text-align: center">245 mA</td>
    </tr>
    <tr>
      <td style="text-align: left">3.3 V LDO (digital domain)</td>
      <td style="text-align: center">329 mA</td>
      <td style="text-align: center">328 mA</td>
      <td style="text-align: center">542 mA</td>
    </tr>
    <tr>
      <td style="text-align: left">8 V LDO (only with wind transducer)</td>
      <td style="text-align: center">16 mA</td>
      <td style="text-align: center">16 mA</td>
      <td style="text-align: center">18 mA</td>
    </tr>
    <tr>
      <td style="text-align: left"><strong><em>Total current @ 12 V</em></strong></td>
      <td style="text-align: center"><strong><em>216 mA</em></strong></td>
      <td style="text-align: center"><strong><em>285 mA</em></strong></td>
      <td style="text-align: center"><strong><em>385 mA</em></strong></td>
    </tr>
    <tr>
      <td style="text-align: left"><strong><em>Power</em></strong></td>
      <td style="text-align: center"><strong><em>∼2.5 W</em></strong></td>
      <td style="text-align: center"><strong><em>∼3.3 W</em></strong></td>
      <td style="text-align: center"><strong><em>∼4.5 W</em></strong></td>
    </tr>
  </tbody>
</table>

Based on these estimates, the MDD400 draws approximately *216 mA under night-time use* and up to *385 mA under peak conditions*. This corresponds to a Load Equivalency Number (*LEN*) of *4–9*, well within the [NMEA 2000](https://www.nmea.org/nmea-2000.html) maximum permitted value of *LEN = 20*.

The *RV-C specification* does not impose explicit power consumption limits or standardized budgeting mechanisms akin to the NMEA 2000 LEN system. Instead, system designers and integrators must ensure that the cumulative load of RV-C devices remains within the capabilities of the RV’s power distribution system.

In practice, this means:

* Reviewing the power consumption specifications of each device;
* Ensuring that the RV’s power system can handle the total load;
* Consulting the latest *RV-C Layer documentation* for best practices and updates.

The design of the MDD400 prioritises compatibility with both marine and RV networks while maintaining high energy efficiency — a critical factor for solar-powered or battery-constrained systems such as sailboats.
