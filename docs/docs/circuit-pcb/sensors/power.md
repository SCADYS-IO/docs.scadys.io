# Power

## Power Sensor

The MDD400 continuously monitors its own supply voltage and current draw to provide diagnostic data, support fault detection, and enable intelligent power management. These measurements are digitized via the ESP32-S3's internal ADCs and are sampled regularly by firmware. This section describes the hardware circuits used for voltage and current sensing.

## Voltage Sensing

The input voltage is sensed downstream of the active protection circuit, at the output of Q13 (labelled V_PROTECTED), and represents the voltage seen by all internal circuitry. A passive voltage divider consisting of R52 (22 kΩ) and R57 (4.7 kΩ) scales the protected voltage to within the 0--3.3 V input range of the ESP32-S3 ADC. This scaled voltage is then buffered by an op-amp (U8A), configured as a unity-gain follower using a TLV9002IDR. The buffer ensures a low-impedance, noise-free signal suitable for accurate ADC conversion and is connected to \[VSS_ADC\], which is configured as an ADC input.

The voltage divider ratio is ​≈0.176. Given a 3.3 V ADC input range, the corresponding maximum measurable input voltage is ​≈18.75 V.

With a 12-bit ADC resolution, the measured voltage can be calculated by multiplying the ADC reading by a factor of 0.00458.

## Current Sensing

The input current is measured using a low-side 100 mΩ shunt resistor placed in the return path of the main input filter stage. The voltage developed across this resistor is proportional to the load current and is used as the input to a non-inverting amplifier built around a TLV9002IDR op-amp (U8B).

The amplifier uses a 10 kΩ input resistor (R56), a 150 kΩ feedback resistor (R54), and a 3.3 kΩ resistor to ground (R58), producing a gain of approximately 47. With the 100 mΩ shunt resistor the current measurement range is 0 - 715mA: double the normal operating peak current of the MDD400, but below the upper limit of the protection circuit. This ensures that any overcurrent condition results in a distinct and easily detectable ADC output, simplifying firmware-based fault detection.

The amplified signal is routed to (CURRENT_ADC) for sampling by the ESP32-S3's ADC.

This design allows accurate current measurement without introducing significant voltage drop or power loss in the ground return path. The amplified signal is suitable for monitoring both steady-state load and transient inrush currents.

With a 12-bit ADC resolution, the measured current can be calculated by multiplying the ADC reading by a factor of 0.0001734.