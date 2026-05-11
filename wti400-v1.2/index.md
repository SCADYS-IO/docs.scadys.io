---
title: WTI400 Overview
hw_version: v1.2
hw_status: in-service
hw_status_label: "In service — installed on test vessel"
---

:::note[Hardware version]

WTI400 **v1.2** — In service — installed on test vessel

:::

## Overview

The WTI400 is a marine wind transducer interface for NMEA 2000 networks. It connects directly to a standard analog wind transducer (Raymarine E22078/ST60 or B&G 213) and outputs calibrated True Wind Speed and True Wind Angle as NMEA 2000 PGN 130306 messages on the vessel CAN bus. An onboard LSM6DSLTR 6DoF IMU provides heel, pitch, and motion data for dynamic wind correction.

The WTI400 is powered from the NMEA 2000 backbone (9–16 V DC) via a standard M12 5-pin connector and draws less than 150 mA under normal operating conditions. It supports both 8 V (Raymarine) and 6.5 V (B&G) transducer supply rails, selectable via an on-board jumper. A legacy serial interface (e.g. SeaTalk™) allows the WTI400 to receive raw wind data from older transducers and echo processed data back to legacy chart plotters over the same bus.

---

## Version History

| Version | Status | Summary |
|---------|--------|---------|
| v1.2 | In service | First fabricated revision currently installed on test vessel. It replaces the MLI400 proof-of-concept unit that served on-board the test vessel during a global circumnavigation. Full nine-subsystem design: CAN bus power, CAN transceiver, wind interface, ESP32-S3 module, motion sensor, legacy serial RX/TX, button/LED, and power supplies. |
