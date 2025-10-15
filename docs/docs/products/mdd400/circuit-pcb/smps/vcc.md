# *VCC* DC-DC Converter (3.3 V)

The `VCC` domain supplies 3.3 V regulated power to all the MDD400 digital subsystems, including:

* the [ESP32-S3](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_datasheet_en.pdf);
* the [OPT3004](https://www.ti.com/lit/ds/symlink/opt3004.pdf) ambient light sensor;
* the [TMP112](https://www.ti.com/lit/ds/symlink/tmp112.pdf) temperature sensor;
* the logic side of the [ISO1042](https://www.ti.com/lit/ds/symlink/iso1042.pdf) CAN transceiver; and
* the [ISO1541](https://www.ti.com/lit/ds/symlink/iso1541.pdf) I²C isolator.

Typical current draw is ~90 mA, with headroom for full-load peaks during burst activity from the ESP32.

{% include-markdown "products/assets/pages/power/vcc3v3.md" %}

