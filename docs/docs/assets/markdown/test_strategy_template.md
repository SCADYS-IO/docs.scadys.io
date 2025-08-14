# Compliance Test Strategy Template

This template defines the approach to functional, environmental, and EMC testing for SCADYS.io NMEA 2000 products. It should be adapted to the specific product under test.

---

## 1. Purpose

Describe the objective of the test strategy, the scope of testing, and the intended outcomes.

## 2. Test Scope

* Identify all product domains (power, communications, UI, sensors, mechanical).
* Define applicable standards (e.g., EN 60945, FCC Part 15, AS/NZS CISPR 32).
* List in-scope test types: functional, environmental, EMC emissions, EMC immunity, safety.

## 3. Test Approach

* **Functional Testing**: Verify core operation in all intended modes.
* **Pre-compliance EMC**: Use lab and in-house methods to assess emissions/immunity.
* **Environmental Testing**: Simulate temperature, humidity, vibration, ingress.
* **Safety Checks**: Confirm safe operation under fault conditions.

## 4. Test Modes

Document each operating mode:

* Idle
* Typical use
* Worst-case EMI load
* Stress profile
* Power cycling/brown-out recovery

## 5. Acceptance Criteria

* Define quantitative and qualitative pass/fail criteria for each test type.
* Example: Ripple < 100 mVpp, 0% comms error rate, passes ingress test without water ingress.

## 6. Test Sequencing

Outline the order of execution from prototype bring-up to final compliance testing.

## 7. Reporting

* Define how results are documented (e.g., markdown reports, CSV logs, photos).
* Specify storage location (e.g., project repo `assets/test_results/`).

## 8. References

* Link to applicable standards, prior reports, or design documents.
