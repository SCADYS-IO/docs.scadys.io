# Audio Transducer

The MDD400 has a small onboard magnetic audio transducer for audible notifications mounted on the top side of the PCB.  It is driven via PWM on the ESP32's [`AUDIO_PWM`](../../quick_reference.md) pin.  A small orifice in the enclosure with a millivent aligns with the transducer location to allow sound emission and pressure relief.

!!! note
    Refer to the [MDD400 quick reference](../../quick_reference.md) for GPIO assignments, flash partitioning, I2C bus address assignments, board stackup and connector details.

{% include-markdown "products/assets/pages/digital/buzzer.md" %}