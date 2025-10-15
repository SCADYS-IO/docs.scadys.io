# *VCC* DC-DC Converter (3.3 V)

The `VCC` domain supplies 3.3 V regulated power to the WTI400's digital subsystems, including:

* the [ESP32-S3](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_datasheet_en.pdf);
* the [ADC buffer amplifiers](https://www.ti.com/lit/ds/symlink/tlv9002.pdf);
* the [wind-speed pulse conditioning circuit](https://assets.nexperia.com/documents/data-sheet/74LVC1G17.pdf);
* the [inertial measurement unit](https://www.st.com/content/ccc/resource/technical/document/datasheet/ee/23/a0/dc/1d/68/45/52/DM00237456.pdf/files/DM00237456.pdf/jcr:content/translations/en.DM00237456.pdf);
* [indicator LEDs](https://www.lcsc.com/datasheet/C2843813.pdf); and
* the logic side of the [ISO1042](https://www.ti.com/lit/ds/symlink/iso1042.pdf) CAN transceiver.

Typical current draw is ~90 mA, with headroom for full-load peaks during burst activity from the ESP32.

{% include-markdown "products/assets/pages/power/vcc3v3.md" %}