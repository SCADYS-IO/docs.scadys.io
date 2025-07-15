# Digital Logic 3.3 Volt Domain (V<SUB>CC</SUB>)

## Digital Domain (3.3 V) Loads

The following loads are powered from the 3.3 Volt digital power rail (V<SUB>cc</SUB>):

<table border="1" cellpadding="6" cellspacing="0" style="width: 100%">
  <thead>
    <tr>
      <th>Load Component</th>
      <th>Typical Current</th>
      <th>Peak Current</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>ESP32-S3</td>
      <td>250 mA</td>
      <td>450 mA<SUP>*</SUP></td>
    </tr>
    <tr>
      <td>Ambient light sensor (OPT3004)</td>
      <td>0.2 mA</td>
      <td>0.2 mA</td>
    </tr>
    <tr>
      <td>Dual op-amps (TLV9002IDR ×2)</td>
      <td>2.6 mA</td>
      <td>4 mA</td>
    </tr>
    <tr>
      <td>Comparator (LM393DR)</td>
      <td>1 mA</td>
      <td>1.5 mA</td>
    </tr>
    <tr>
      <td>CAN transceiver (SN65HVD234)</td>
      <td>74 mA</td>
      <td>85 mA</td>
    </tr>
    <tr>
      <td>Pull-up loads</td>
      <td>1 mA</td>
      <td>1 mA</td>
    </tr>
    <tr>
      <td><strong>Total</strong></td>
      <td><strong>329 mA</strong></td>
      <td><strong>552 mA</strong></td>
    </tr>
  </tbody>
</table>

<sub>\*Peak current estimate reflects [ESP32-S3](https://www.espressif.com/en/products/socs/esp32-s3/resources) operation with active Wi-Fi transmission at high data rates, based on Espressif datasheet specifications.</sub>

## Regulator

The 3.3 V digital logic domain is powered by a [Texas Instruments LM1117-3.3](https://www.ti.com/lit/ds/symlink/lm1117.pdf) low-dropout (LDO) linear regulator, using the 5 V rail as its input (designated V<sub>PP</sub>). This domain powers the [ESP32-S3](https://www.espressif.com/en/products/socs/esp32-s3/resources) microcontroller, CAN transceiver, I²C sensors, and analog signal conditioning stages.

![VCC Regulator Schematic](../../assets/images/vcc_regulator_sch.png)

Capacitive filtering on the LDO output includes:

* 10 µF local bulk capacitance near the LDO;
* 100 nF decoupling capacitors placed near all major loads; and
* five 10 µF + 100 nF RC pairs at the ESP32, CAN transceiver, and op-amp stages.

The LM1117 features internal current limiting and thermal shutdown. Under typical operating conditions, the 3.3 V rail draws approximately 329 mA, with short-term peaks up to 552–640 mA. These values are distributed across the subsystems as shown in Table 2.

## Performance and Thermal Considerations

With a regulated input of approximately 5.0 V (following a diode drop from the 5.33 V SMPS rail), the LM1117 provides sufficient headroom above its typical dropout voltage of 1.1 V. At peak current levels up to 640 mA, the dropout remains below the available headroom, ensuring stable regulation.

Thermal dissipation is mitigated through extensive copper pours on the top and bottom PCB layers, all tied to the LDO output pin (Pin 2 / Tab). A 3×3 via array connects the thermal pad to the bottom layer, and a soldermask opening improves convective cooling. This layout results in the following thermal performance:

* **At 552 mA load**: 0.938 W dissipation → \~30 °C rise → **Junction temp: \~70 °C**
* **At 640 mA load**: 1.088 W dissipation → \~35 °C rise → **Junction temp: \~75 °C**

Given a 40 °C ambient environment, the regulator operates well below its 125 °C junction temperature limit with ample margin. These results confirm that the LM1117 is appropriately specified for both average and peak operating conditions in the MDD400.
