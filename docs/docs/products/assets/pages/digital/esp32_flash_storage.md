The ESP32-S3 module in the MDD400 includes 16 MB of external QSPI flash. Flash is divided into multiple regions as shown in the partition table.

{% include-markdown "../../html/table_2_partition_table.html" %}

### Application Regions

Two 5 MB OTA slots are defined (`app0` and `app1`), allowing firmware to be updated via Bluetooth or serial without overwriting the running image. OTA updates are managed by the ESP-IDF OTA subsystem using a dual-bank approach.

### Non-volatile Data

The `nvs` partition stores key-value pairs for configuration and calibration data, while `otadata` tracks OTA image states.

### SPIFFS Usage

The `spiffs` partition is used as a general-purpose filesystem. During OTA update via BLE, this region serves as a temporary staging area for update payloads, including display image resources and configuration files, which the firmware subsequently writes to the DWIN display over UART.

In normal operation, the SPIFFS partition stores history and diagnostic data, including time-series records of incoming NMEA data. These may include environmental trends, fault logs, or usage statistics.

Partitioning and access control within the SPIFFS area is not yet finalised. One approach could involve prefix-based file organisation (e.g. `/ota/`, `/hist/`, `/diag/`), or maintaining a metadata index to track file type and source.

### Core Dumps

The `coredump` partition is reserved for post-crash diagnostics, allowing firmware to write a memory snapshot for later retrieval via serial or BLE tools.