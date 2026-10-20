---
sidebar_position: 3
title: Sensors
---

# Sensors

This module checks the sensors on the board's I²C or SPI buses, including light, temperature and power-monitor parts and an inertial measurement unit. Each sensor is first identified, then read against an independent reference.

## The bus

- *Scan.* A bus scan finds exactly the expected addresses, and no others. A missing address and an extra address are both failures.
- *Rise time.* The clock and data lines are captured on the scope at the bus speed in use, and their rise times are compared with the bus standard's limits. Slow edges mean the pull-ups are too weak for the bus capacitance, and the pull-up value is changed.
- *A dead bus.* If the scan finds nothing and the driver reports timeouts, both bus lines are read unpowered. Each should read the pull-up resistance into the supply rail. A line that reads open from the processor pin to the pull-up has an open joint at the processor.

## Identity

Each sensor's identity register is read and compared with its datasheet. Where a sensor has no identity register, a register with a documented reset value is read before firmware writes it. A temperature sensor's configuration register, for example, reads its datasheet reset value at power-up.

## Readings against a reference

- *Power monitor.* The bus voltage it reports agrees with a meter on the same node, within the monitor's resolution, and its current agrees with the supply's readout.
- *Temperature.* The reading is close to room temperature on a cold board and rises as the board warms.
- *Ambient light.* With the board in a dark room, the backlight is swept from off to full. The light reading must move by less than 10 %, which shows the sensor is not seeing the backlight. The sensor is also checked in the assembled housing, because a sensor that answers correctly on the bench reads darkness if the housing or cover print hides it from the window.

## Inertial measurement unit

- *Identity.* The IMU answers at its address and its identity register reads its datasheet value.
- *Register write.* A configuration register is written and read back.
- *At rest.* A burst of samples shows all six axes active, with one accelerometer axis near 1 g and the others near zero.
- *Orientation.* The board is tilted by known angles, such as level, a heel to port and a bow-down pitch, and the computed roll and pitch are compared with the angles applied. The axis map that turns the chip's axes into the vessel's axes is product configuration, and this check is what validates it.
- *Supply noise.* The ripple on the IMU's supply pin is captured on the scope and compared with the limit in its datasheet.
