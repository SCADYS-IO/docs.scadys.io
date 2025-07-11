
# USER Interface

## Overview and HMI Elements

The MDD400 features a minimalist yet powerful human-machine interface designed for intuitive operation in marine and RV environments. The interface comprises a high-resolution capacitive touch display as the sole means of user input and output. There are no physical buttons or rotary controls, ensuring a sealed, low-maintenance front panel with IP-rated ingress protection.

User interaction is structured around a simple swipe and tap paradigm: 

- Swipe left/right: Navigate between data pages.
- Swipe down: Access the control panel for brightness, data source selection, and other system-wide settings.
- Swipe up: Reveal per-page options and configuration overlays.
- Tap on-screen labels: Toggle display modes such as AWS/TWS, magnetic/true heading, or knots/Beaufort.

This interface prioritizes clarity, ease of use, and visibility under all lighting conditions, with on-screen brightness control and automatic timeout for the touch layer after inactivity.

## Power Supply

The display module is powered from the regulated 5 V supply rail, controlled by a dedicated power switch circuit to allow selective shutdown. This circuit uses a P-channel MOSFET (AO3407) gated by a BJT (S8050) controlled via the \[DISP_EN\] pin. When \[DISP_EN\] is driven high, the P-MOSFET turns on, supplying 5 V (VSS) to the display module.

Decoupling is provided by a 100 µF/50 V and a 10 µF/25 V capacitor in parallel near the display connector (C25 and C21). This provides adequate bulk capacitance and transient suppression for the display\'s inrush and dynamic load.

The display consumes up to 245 mA at 5 V when the backlight is fully illuminated, and as little as 75 mA with the backlight off, as verified in Section 2.4 of the design report and the DWIN datasheet.

## Touch Display

### Characteristics

The MDD400 uses a DWIN DMG48480F040_01WTC capacitive LCD module. Key characteristics include:

- Panel type: 4.0\" IPS TFT with 262K colors and 480×480 resolution.
- Viewing angle: 85° in all directions.
- Brightness: 250 nits (typical) with PWM dimming control from 0--100%.
- Backlight control: Brightness is dynamically adjusted based on ambient light conditions using the MDD400's onboard light sensor.
- Touch: 1-point capacitive touch (G+G structure), supporting continuous sliding gestures.
- Backlight life: \>10,000 hours at full brightness.
- Touch life: \>1,000,000 touches with 6H surface hardness.
- Power consumption: \<2 W maximum.

### Communication

The display communicates over UART2, using TTL signal levels:

- TX (MCU → Display): \[U2_TX\] pin; and
- RX (Display → MCU): \[U2_RX\] pin.

The interface operates using the DGUS II protocol, which abstracts screen logic into memory pages, variables, and commands. This approach minimizes MCU load and ensures responsive screen updates even on lower-speed links.

Although the display supports a wide range of baud rates (up to 3.2 Mbps), initial firmware defaulted to 115200 bps for compatibility. However, testing confirmed that reliable, error-free communication is maintained at 460800 bps, even in electrically noisy environments. This baud rate is now used in production, significantly improving screen responsiveness during page transitions and configuration updates.

The interface uses the standard 8N1 format (8 data bits, no parity, 1 stop bit), consistent with DGUS II system defaults.

Practical testing confirms that the DWIN DMG48480F040_01WTC display can reliably sustain sprite and GUI element updates at 30 frames per second when communicating at 460800 bps via UART2. This performance is enabled by the DGUS II protocol's use of preloaded assets and indexed object control, rather than full bitmap transmission. While large image transfers are constrained by UART bandwidth, command-level updates-such as repositioning, toggling, or redrawing preloaded objects-exhibit no perceptible lag at 30 FPS under typical usage scenarios.

## Touch Screen Operation

The MDD400 uses a capacitive touch screen that supports single-point gestures such as swipes and taps. Touch inputs are processed by the internal controller of the DWIN display, using mutual capacitance sensing to detect changes in the local electrostatic field when a conductive object, such as a human finger, approaches the panel surface.

### Timeout

To conserve power and improve durability, the touch interface automatically disables after a configurable period of user inactivity. The default timeout is 15 s, after which the touchscreen is disabled until the next touch. This timeout can be adjusted in firmware.

### Wet-Weather Usability

Capacitive touch screens are typically vulnerable to false inputs when wet, as water droplets can interfere with the electrostatic field used to detect touch. Early MDD400 prototypes mitigated this by requiring a physical button press to activate the touchscreen. However, real-world testing during long-term marine deployment showed this precaution to be unnecessary. In testing, the touch interface remains fully usable in wet conditions, including during rain or spray events. This robustness is attributed to several factors:

- the display uses mutual-capacitance sensing, which is less susceptible to false inputs from stray conductive paths such as water films;
- the housing is constructed from non-conductive material and affixed using 3M 300LSE adhesive, providing full electrical isolation from the vessel;
- the housing is mounted to a GRP hull, offering no low-impedance return path to earth; and
- users are generally electrically isolated (e.g., by shoes or non-conductive flooring), reducing the coupling between finger, water, and system ground.

Together, these factors form a floating capacitive system with limited return paths, reducing the influence of water and parasitic capacitance.

### Grounding Considerations on Metal-Hulled Vessels

On metal vessels, the hull and structure may provide a conductive path to earth. If the display enclosure is bonded-intentionally or inadvertently-to a grounded surface, the capacitive behaviour of the touch interface may change. In particular:

- water films may couple more effectively to system ground, increasing the likelihood of false inputs; and
- users in contact with grounded metal may present a stronger capacitive target, potentially altering sensitivity.

To maintain performance in these installations, the following measures are recommended:

- ensure mechanical isolation between the enclosure and any conductive mounting surfaces using non-conductive spacers or gaskets;
- avoid bonding the display ground to hull or battery ground unless specifically required by EMC or safety considerations; and
- maintain the current floating configuration of the touchscreen ground unless testing indicates a need for tighter control.

### Further Testing

Additional testing is planned to verify touchscreen reliability on metal-hulled vessels and in conductive mounting environments.
Recommended tests include:

- operating the touchscreen under simulated rain or spray conditions while bonded to a grounded metal plate;
- comparing touch sensitivity and false input rate with the user isolated vs. grounded; and
- verifying whether localized grounding (e.g. display GND tied to chassis) affects performance in wet conditions.

These tests will guide design guidelines for future installation scenarios and ensure consistent behavior across vessel types.

## Audio Alerts

A magnetic buzzer is driven by a PWM input on the \[AUDIO_PWM\] pin, allowing the firmware to combine tones from the display and system alerts.

The MDD400 display also includes an integrated audio output signal (labelled DISP_AUDIO) that is routed to the system buzzer/speaker driver.

The two audio signals are buffered by a BJT (Q1) and used to drive a P-MOSFET (Q2), which controls current through the magnetic buzzer (BZ1). An R-C filter (18 Ω / 470nF) creates a high pass filter with a cutoff frequency of 8.8kHz. This smooths the tone, slightly reduces volume, and rolls off the high-frequency buzz, giving a rounder, more pleasant beep, especially at \~2 - 3 kHz.

This circuit supports:

- system error or warning tones triggered by firmware;
- acknowledgement or status tones from the DGUS display (e.g., on touch events); and
- PWM-controlled modulation for generating tones of varying pitch and duration.

The buzzer (MLT-8530) is a surface-mount transducer capable of \>80 dB sound pressure at 5 V. Its compact size and efficient drive circuit allow it to operate reliably across the full temperature and humidity range specified for the device.
