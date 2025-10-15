The ESP32-S3 module includes two types of RAM:

* *SRAM*: 512 kB internal static RAM, used by default for stack, heap, and program data;
* *PSRAM*: 8 MB of external pseudo-static RAM, accessible via the memory-mapped SPI interface.

The ESP-IDF heap allocator is configured to use both internal and external memory. Internal SRAM provides low-latency access and is prioritized for timing-sensitive operations, while external PSRAM is used for large buffers and dynamic structures.

In the MDD400, PSRAM is reserved primarily for storage of time-series data associated with incoming NMEA traffic. These time series support real-time and historical graphing functions on the LCD display. The PSRAM allows extensive buffering of sampled values across multiple channels without consuming internal SRAM resources.

Additional PSRAM-based buffers may be allocated at runtime for image decoding, OTA staging, or caching depending on future firmware requirements and available heap space.