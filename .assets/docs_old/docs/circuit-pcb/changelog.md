<!-- MDD400_Hardware/pcb -->

## 2.6 AI Design Review 
*Version date: 2025/07/14*

- Added R-C filter to buzzer.
- Changed copyright notice on PCB.
- Removed QR code.
- Removed all component references from silk screen.
- Added gate stopper resistor for power protection MOSFET.
- Added hysteresis on both current and voltage sense circuits.
- Added additional filtering ferrites.
- Added additional filter cap on SMPS output.
- Reviewed SMPS design and optimized for 12V operation.
- Isolated Seatalk ground plane.
- Isolated wind transducer ground plane.
- Changed diodes on SeaTalk circuit from `UMN10` to `BAT54`.
- Added jumper/resistor to enable wind SMPS to be set to 8.0v or 6.5v.
- Added diode-bypass jumper resistor for Seatalk power.
- Added Vcc copper pour on top and bottom layers.
- Moved `ST_RX` to `GPIO1`.
- Changed `ST_TX` to `GPIO2`.
- Changed `ST_EN` to `GPIO38`.
- Changed `CURRENT_ADC` to `GPIO5`.
- Changed `VSS_ADC` to `GPIO6`.
- Changed `LED_PWM` to `GPIO_15`.
- Changed `DISP_EN` to `GPIO16` and added pulldown resistor.
- Added `TMP112` temperature sensor.
- Added `JTAG` expansion header.
- Added `I2C` expansion header.
- Added `1-WIRE` expansion header.
- Added `GPIO7` test-point.
- Added R-C filter with 8.8kHz cuttof to buzzer output.
- Changed `Vss` ADC buffer for 18.5v full-scale range.
- Changed current sense ADC buffer for 800mA full-scale range.
- Full design review.
- Detail changes to power protection and filtering circuit.
- Added `50mA` current limiter to wind transducer power.
- Added short-circuit sensor to wind-transducer power.

## 2.5 OPT3004 ALS 
*Version date: 2025/05/13*

- Changed light sensor to Texas Instruments `OPT3004`.
- Added vias at all signal layer transitions.
- Add Vcc copper pour to layers 1 and 4.
- Changed footprint on `IMX1` and `IMZ1` transistors, re-worked PCB.
- Replaced load-dump / over-voltage IC with 6.6kW TVS diode.
- Replaced 3.3v LDO with `AMS1117-3.3`.
- Replaced 8.0v LDO with `LP2951`.
- Moved 8v power supply to wind transducer circuit.


## 2.4 ESP32-S3 
*Version date: 2025/05/04*

- Fixed footprint of 8v LDO.
- CHANGED 8v LDO to `TPSB61` adjustable LDO with EN feature.
- REMOVED `W25Q64` external FLASH chip.
- Change to `ESP32-S3-WROOM2-n32r8` processor.
- Removed `ADS115-`4 ADC.
- Removed `TMP112` temperature sensor.
- Moved buzzer.
- Added enable line to GPIO to allow 8V / Wind circuit to be turned off.
- Updated the SeaTalk circuit to be consistent with latest ST70 design.
- Added facility to turn off the SeaTalk circuit via GPIO.
- Added OpAmp buffers to the wind  x and y circuits.

## 2.3 Display FPC on Bottom 
*Version date: 2025/04/09*

- Connected WIND_X to `GPIO34`.
- Connected WIND_Y to `GPIO35`.
- Connected WIND_SPD to `GPIO36`.
- Connected SEATALK_RX to `GPIO39`.
- Flipped position of buzzer to top of board.
- Moved Display FPC connector.
- Changed `N2KRX` pin to `GPIO13`.
- Changed BUZZER_PWM pin tp `GPIO14`.
- Added `ADS1115` ADC to handle wind and `V_SENSE`.
- Change `LED_PWM` pin to `GPIO27`.
- Replaced 8V SMPS with LDO.
- Revised SeaTalk interface to match latest.
- Revised anemometer input to use `LM392` comparator.


## 2.2 SeaTalk and Wind 
*Version date: 2025/03/13*

- Moved `APDS9306` inboard to 42.5mm from center.
- Fixed 5v connection to display.
- Added SeaTalk TX circuit.
- Added wind transducer circuit.
- Added 8v SMPS circuit for wind transducer.
- Set the current limit for wind 8v SMPS to 1A.
- Added wind transducer circuit.
- Added Seatalk TX circuit


## 2.1 NO Button 
*Version date: 2025/02/17*

- Changed (reduced* size of edge cutout for display FPC to match latest.
- Changed SMPS controller to `TPS54560DDAR`.
- Removed button switch and Schmidtt trigger circuit.
- Moved logo out from under FPC.
- Changed FPC connector to flip type.
- Removed DNP components after testing.
- Increased font size on board file number.
- Removed UVLO resistors.
- Changed temperature sensor to `TMP112AIDRLR`.

## 2.0 Single Button 
*Version date: 2024/11/23*

- Changed to single button.
- Added SeaTalk RX port.
- Added NMEA0183 RX port.
- Changed N2K connector to DeviceNet.
- New SMPS design with `TPS54560B-Q1`.
- New power protection and filter design.
- New CANBUS input filter and protection.
- New `SN65HVD234DR` CANBUS transceiver.
- New `TMP102` temperature sensor.
- Changed ambient light sensor to `APDS-9306-065`

## 1.1 Field Trials Prototype 
*Version date: 2023/05/14*

- Proof-of-concept prototype for field trials

## 1.0 Proof of concept 
*Version date: 2023/03/29*

- Proof of concept