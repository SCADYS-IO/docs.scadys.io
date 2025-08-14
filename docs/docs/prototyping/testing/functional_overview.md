# Functional Testing

This section summarises functional test strategies and acceptance criteria applicable across SCADYS.io NMEA 2000 products.
It serves as a **common baseline**, with per-product pages under **Products/** detailing product-specific tests.

---

## Purpose

Functional testing ensures that each prototype performs its intended functions under normal, worst-case, and stress conditions before moving to environmental or compliance testing.
It verifies that **all hardware domains, firmware features, and interfaces** behave correctly and remain stable under operational load.

---

## Test Strategy

The following principles apply to all SCADYS.io NMEA 2000 products:

1. **Define operating modes** – Identify idle, typical, worst-case EMI, and stress conditions (e.g., max display brightness, peak bus activity, all outputs active).
2. **Exercise all domains** – Include power supplies, communications, user interfaces, and sensors.
3. **Replicate worst-case user scenarios** – Stress features likely to generate EMI, draw maximum current, or provoke faults.
4. **Record evidence** – Maintain photos, quantitative measurements, and a written log of observations.
5. **Iterate early** – Identify and fix functional bugs before environmental and EMC testing.

---

## Example Test Areas

| Area                        | Test Type                                       | Objective                                             | Acceptance Criteria                           |
| --------------------------- | ----------------------------------------------- | ----------------------------------------------------- | --------------------------------------------- |
| **Power Integrity**         | Voltage & ripple measurement                    | Confirm stable supply rails under all modes           | No excessive ripple (>100 mVpp DC–few MHz)    |
| **Communications**          | Bus traffic tests (NMEA 2000, serial, I²C, SPI) | Verify reliable message exchange under load           | 0% packet/frame error rate                    |
| **User Interface**          | Display, buttons, LEDs, buzzer                  | Confirm responsiveness and correct status indications | No missed inputs; correct feedback timing     |
| **Peripheral I/O**          | Sensor and actuator operation                   | Verify accuracy, latency, and control response        | Within design tolerance                       |
| **Environmental Operation** | Temp/humidity functional check                  | Ensure correct operation at specified limits          | Passes all functional tests at extremes       |
| **Fault Handling**          | Simulated brown-outs, comms loss                | Confirm safe recovery and logging                     | No lock-up; state recovery within design time |

---

## Operating Modes (Generic Template)

Adapt per product:

* **Mode A – Idle:** Minimal activity, UI active at low brightness.
* **Mode B – Typical:** Average bus load, UI in normal display mode.
* **Mode C – Worst-case EMI:** Max display brightness, max comms activity, all outputs active.
* **Mode D – Stress Profile:** Rapid state changes, load transients, high CPU/network utilisation.
* **Mode E – Power Cycling:** On/off sequences including brown-out conditions.

---

## Acceptance Gates

A typical gate sequence:

* **G0** → **G1**: Documentation complete; stress firmware ready → Power integrity verified.
* **G1** → **G2**: PI verified → All functional subsystems tested in worst-case mode.
* **G2** → **G3**: Functional pass → Environmental and pre-compliance testing may commence.

---

## Notes

* Many functional tests overlap with **pre-compliance EMC** preparation (e.g., worst-case mode definition, load testing).
* Where applicable, follow the relevant **Compliance Test Strategy** and **Practical Compliance Test Plan** for the product under test.
* Maintain per-product functional test pages under **Products/** to capture product-specific requirements.

---

**Templates**

* [Compliance Test Strategy Template](../../assets/markdown/test_strategy_template.md)
* [Practical Compliance Test Plan Template](../../assets/markdown/compliance_test_plan_template.md)
