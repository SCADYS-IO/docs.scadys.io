# CAN / `DIGITAL` Domain Power Isolation

To provide galvanic isolation between the CAN domain and the `DIGITAL` Domain, a 5 V to 5 V transformer-based power isolation stage is implemented. The CAN side of the circuit is powered by a 5.53 V regulated supply derived from the NMEA 2000 NET-S line. This supply is isolated and stepped across to the digital side using a push-pull transformer driver topology.

The [SN6505B](https://www.ti.com/lit/ds/symlink/sn6505a.pdf) transformer driver generates a 410 kHz differential square wave, which is coupled through a [Würth 760390012](https://www.we-online.com/components/products/datasheet/760390012.pdf) 1:1 isolation transformer. The secondary is configured as a centre-tapped full-wave rectifier using a [PMEG4005CT](https://lcsc.com/datasheet/lcsc_datasheet_2410010202_Nexperia-PMEG4005CT-215_C552889.pdf) dual Schottky diode, followed by filtering and transient protection. The resulting output voltage, VSS, ranges from approximately 5.24 V at minimum load to 5.10 V at peak load, with minimal ripple.

This isolated rail supplies all components within the `DIGITAL` Domain, including the LCD display and audio buzzer. A PESD15VL1BA low-capacitance TVS diode provides surge and ESD protection at the rectifier output, and RC snubbers across each rectifier diode suppress ringing and reduce EMI. VSS is monitored and regulated upstream, and no post-regulation is required on the isolated side.

![Isolated 5 V Supply Schematic](../../assets/images/vss_isolator.png)
