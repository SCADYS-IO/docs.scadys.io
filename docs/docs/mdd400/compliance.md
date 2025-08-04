# Compliance


## Applicable Standards and Certifications

NMEA 2000
FCC
CE
CISPR 25
etc. etc.


## Design Criteria

Insert other criteria here

### Thermal Conditions

Analysis is based on the following assumptions:

* ambient air temperature up to 60 °C for typical operating conditions in enclosed marine installations;
* a design test ambient of 85 °C to represent worst-case thermal exposure in direct sunlight (per [IEC 60068-2-2](https://webstore.iec.ch/en/publication/62437) and [JESD51-2](https://www.jedec.org/document_search?search_api_views_fulltext=JESD51-2) environmental stress standards);
* temperature rise due to self-heating derived from individual power dissipation and copper connectivity;
* component thermal derating per JEDEC guidelines, notably [JESD51-2](https://www.jedec.org/document_search?search_api_views_fulltext=JESD51-2) and JESD51-7;
* thermal performance referenced to 1 oz copper and 1.6 mm PCB thickness unless otherwise specified.

The 85 °C ambient test condition is used for thermal characterisation and certification, simulating surface heating of a black enclosure exposed to solar radiation. Temperature monitoring via the onboard sensor allows the firmware to implement protective thermal management strategies under such conditions.