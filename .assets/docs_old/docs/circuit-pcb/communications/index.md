# Communications Interfaces

The MDD400 supports a range of wired and wireless communication interfaces for integration with marine networks, legacy systems, and mobile devices. Each interface is engineered for signal integrity, EMC compliance, and reliable operation in harsh environments.

* *[CAN Bus](can_bus.md)*: All models include a galvanically isolated CANBUS interface compliant with NMEA 2000 and RV-C standards. The physical connection uses a 5-pin A-coded DeviceNet connector. The interface includes filtering, ESD suppression, and differential signal routing designed to CISPR 25 and ISO 11452-2 standards.

* *[Serial](serial.md)*: Selected models offer a single-wire interface compatible with NMEA 0183 and SeaTalk® protocols. It features receive-only support for NMEA 0183 and half-duplex operation for SeaTalk. Input protection, signal level shifting, and fault tolerance are implemented for safe and reliable operation.

* *[Wi-Fi](wifi.md)*: While not currently enabled in production firmware, Wi-Fi hardware is present and reserved for future use. Planned support includes SignalK and OneNet protocols, enabling high-throughput IP-based marine data integration.

* *[Bluetooth](bluetooth.md)*: Bluetooth Low Energy (BLE) is used for configuration via a mobile app, firmware updates, and future expansion to support broadcast data. BLE is electrically isolated from other communication interfaces and used exclusively for non-critical functions.

The sections that follow detail the circuit implementation, supported standards, signal conditioning, and firmware integration for each communication interface.
