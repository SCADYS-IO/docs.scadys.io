# Configuration

WTI400 firmware configuration is split into build-time and runtime scopes so hardware-specific options can remain version-controlled while installation tuning stays field-adjustable.

## Build-Time Configuration

Build-time options define:

* target hardware profile and pin mapping assumptions;
* protocol feature enablement;
* diagnostic and logging level defaults.

## Runtime Configuration

Runtime settings cover:

* transducer compatibility profile selection;
* calibration and scaling parameters;
* filtering and stabilization tuning;
* network identity and interface behavior.

## Configuration Management

Configuration strategy is designed to preserve reproducibility between builds while allowing controlled commissioning updates in the field.
