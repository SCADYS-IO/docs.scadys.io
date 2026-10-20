---
sidebar_position: 3
title: Conducted Emissions
---

# Conducted Emissions

The conducted scan measures the noise the board puts back onto its supply, from 150 kHz to 30 MHz. On a marine instrument the supply is the NMEA 2000 bus, so this noise reaches every other device on the network.

## The chain

The battery feeds the CANBench Duo LISN, and the board under test connects to the LISN's output. Each supply line has its own LISN port, LISN+ and LISN-. Each port is a 50 Ω, ground-referenced, AC-coupled output with about 10 dB of attenuation, a 9 kHz high-pass filter and diode, TVS and ESD protection. For common-mode and differential-mode separation, both LISN ports feed the CANBench TrueZ, which gives a common-mode output and a differential-mode output.

## Every unused port is terminated

Every RF port that is not connected to the analyser carries a 50 Ω terminator: LISN+, LISN-, the TrueZ common-mode output and the TrueZ differential-mode output. An open port breaks the network's impedance, causes peaks and nulls in the trace and corrupts the common-mode and differential-mode separation.

## Analyser settings

| Setting | Value |
|---|---|
| Start | 150 kHz |
| Stop | 30 MHz |
| Detector | Peak |
| LNA | Off |
| Attenuation | 10 dB, set manually |
| Vertical scale | Fixed, for example -60 dBm to -100 dBm |

The LISN port already attenuates about 10 dB, so the displayed level is about 10 dB below the level at the tap. That correction is applied by hand when levels are compared. Absolute calibrated levels are not pursued in a pre-scan.

The tinySA compensates its attenuator internally, so a real signal reads the same at 0 dB, 10 dB and 20 dB of attenuation. Stepping the attenuator is therefore the overload test: if the whole trace shifts uniformly, the reading is valid. Attenuation is used for front-end margin, not to move the trace. With a terminator on the input, the noise floor reads about -85 dBm at 10 dB of attenuation.

## Procedure

1. *Noise floor.* A 50 Ω terminator on the analyser input confirms the floor.
2. *Board off.* The analyser connects to LISN+, LISN- is terminated, and the board is connected but switched off. This trace is the baseline.
3. *Mode A.* The board runs its standard build. LISN+ is recorded, then LISN- with LISN+ terminated.
4. *Overload check.* The attenuator is stepped, and the trace must shift uniformly.
5. *Common mode and differential mode.* The TrueZ is fed from both LISN ports, and its common-mode output is recorded with the differential-mode output terminated, then the reverse.
6. *Mode C.* Steps 3 to 5 are repeated with the stress build running.
7. *Benchmark.* Steps 2 to 6 are repeated on the benchmark display through the same LISN, at its brightest and busiest setting, as [Benchmark comparison](./benchmark-comparison.md) describes.

A signal of similar amplitude on LISN+ and LISN-, strong on the common-mode output and absent on the differential-mode output, is common-mode noise. Common-mode noise usually comes from displacement current across a barrier, such as an isolated converter, or from a cable acting as an antenna, and its fix differs from the fix for differential-mode noise.

## Keep the geometry fixed

Common-mode readings below about -85 dBm pick up nearby computers and chargers. The board sits 1 m to 2 m from other equipment, nothing moves between traces, and a reading is confirmed as the board's own by switching the board off and on without moving anything.

## Labelling the peaks

Every peak is labelled against the board's known-emitter list, as [Live fixes and recording findings](./live-fixes-and-findings.md) describes. On the conducted scan the converters dominate, so harmonics of each converter's switching frequency, and beats between converters, are looked for specifically.
