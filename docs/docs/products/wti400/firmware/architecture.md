# Architecture

WTI400 firmware is structured around clear separation between signal acquisition, wind-state estimation, protocol transport, and device management services.

## Functional Layers

1. Hardware abstraction and drivers
2. Wind acquisition and normalization
3. Stabilization and derived measurement processing
4. Protocol encoding and transport (NMEA 2000 / legacy pathways)
5. Device services (status, diagnostics, and configuration)

## Key Responsibilities

* read and validate wind pulse and analog channel data;
* apply calibration and motion-aware filtering inputs from the onboard 6-axis sensor;
* publish normalized outputs to the selected communication channels;
* report health and fault conditions for installation and maintenance.

## Design Intent

The architecture prioritizes deterministic behavior, compatibility with legacy transducer characteristics, and maintainable component boundaries for migration and long-term support.

