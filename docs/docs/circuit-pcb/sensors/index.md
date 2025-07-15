# Sensors

The MDD400 incorporates multiple sensors to monitor operating conditions and interface with the marine environment. Each sensor is integrated with supporting hardware circuits and firmware logic to ensure reliable measurement and reporting under varied conditions.

* *[Power](power.md)*: Voltage and current sensors track the MDD400's own power usage. These signals are routed through conditioning circuits and digitized via the ESP32-S3's ADC for diagnostics and fault detection.

* *[Temperature](temperature.md)*: The system includes both an internal ESP32 junction temperature sensor and an external TMP112 near the display. This arrangement supports thermal diagnostics and allows mitigation of conditions such as LCD overheating due to sun exposure.

* *[Ambient Light](ambient_light.md)*: A digital ambient light sensor (OPT3004) measures incident light on the display surface to enable automatic backlight brightness adjustment. This reduces power consumption and improves readability.

* *[Wind Transducer](wind.md)*: The analog wind interface supports legacy masthead transducers from Raymarine and B\&G. It includes angle and speed signal conditioning, power regulation, noise filtering, and compatibility mappings to simplify integration with common 6- and 7-wire sensor types.

Each sensor type contributes to a specific operational domain—either internal diagnostics or external environmental sensing. The following sections provide full hardware descriptions, signal paths, and implementation notes for each sensor.
