# _CAN_ Domain

The MDD400 connects to the NMEA 2000 network via a [standard 5-pin A-coded male DeviceNet connector](https://www.maretron.com/wp-content/phpkbv95/article.php?id=443), following the physical layer defined by the NMEA 2000 micro connector specification.

![NMEA 2000 Connector Pins](../../assets/images/n2k_connector.png)

The five pins are assigned as follows:

* **Pin 1 – `SHLD`**: Connected to the cable shield (drain wire). This pin is *not* connected internally on the MDD400 device; it is left unconnected (floating) to comply with NMEA 2000 and CANBUS best practices, which require the shield to be bonded to vessel ground at a single point—typically where power is injected into the backbone.
* **Pin 2 – `NET-S`**: Power supply positive (+12 V nominal), typically fused and supplied by the NMEA 2000 backbone.
* **Pin 3 – `NET-C`**: Power supply common (0 V), forming the ground reference for the CAN transceiver and device power input.
* **Pin 4 – `NET-H`**: CAN high, the dominant high-level differential signal on the CANBUS.
* **Pin 5 – `NET-L`**: CAN low, the dominant low-level differential signal on the CANBUS.

The connector is sealed and keyed to ensure correct mating orientation and environmental protection. The MDD400 device incorporates onboard ESD protection, surge suppression, and filtering for all connector lines, as described in subsequent sections. 

## References

1.  Maretron, [*How do I check the health of my NMEA 2000 cabling before powering my network?*](https://www.maretron.com/wp-content/phpkbv95/article.php?id=443)