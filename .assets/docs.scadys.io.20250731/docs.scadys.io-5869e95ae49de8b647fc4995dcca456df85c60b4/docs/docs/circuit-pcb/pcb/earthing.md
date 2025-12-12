# Earthing

The MDD400 follows the NMEA 2000 recommendation for shield handling: the shield connection on the NMEA 2000 connector is left unconnected (floating) within the device. This approach avoids introducing ground loops and accommodates the fact that the enclosure is constructed entirely from PMMA, with no conductive chassis components available for bonding or shielding.

Each isolated domain on the PCB has its own dedicated ground plane, as shown in the layout and ground plane figures. These include NET-C (NMEA 2000 ground), GNDC (filtered CAN ground), GNDSMPS (local converter ground), GNDST (legacy serial interface ground), and GNDREF (digital logic ground). No galvanic or capacitive connections exist between these planes except where intentional domain bridging is implemented using ferrite beads and filter capacitors.

The ground arrangement, combined with floating shield handling, ensures that common-mode disturbances or externally coupled EMI do not propagate across the isolation boundaries. This design supports EMC compliance and safe operation in marine installations, where differential voltages between system grounds are common.

![MDD400 Ground Planes](../../assets/images/mdd400_ground_planes.png)
