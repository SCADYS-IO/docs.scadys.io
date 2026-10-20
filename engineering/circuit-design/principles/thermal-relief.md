---
sidebar_position: 8
title: Thermal Relief on Through-Hole Pads
sidebar_label: Thermal relief
---

# Thermal Relief on Through-Hole Pads

A through-hole pad joined solidly to a copper pour conducts heat away faster than a soldering iron can supply it. The joint never reaches the solder's melting point, or it forms cold. Every through-hole pad that is soldered by hand and connects to a pour therefore uses thermal relief.

## What thermal relief is

A thermal-relief connection joins the pad to the pour through a few narrow spokes rather than all the way round. The spokes carry the pad's current but conduct far less heat, so an iron can bring the pad and its lead to temperature.

## Where it applies

- *Every hand-soldered through-hole pad on a pour*, on every layer that the pad connects to. A connector's ground and supply pins are the usual case.
- *Ground pins in particular.* On a board where every ground pour connects pads solidly, a single connector ground pin is thermally joined to the whole ground plane on all four layers.

On the MDD500 V0.1, the NMEA 2000 connector J6 could not be soldered with an iron for that reason. Its ground pin sank into the ground plane, and its supply pin was fed by wide copper, so it was soldered with hot air. The V0.2 board gives the J6 pads thermal relief by a pad-level override.

## Where it does not apply

- *Surface-mount pads that carry heat away on purpose*, such as an exposed thermal pad under a regulator or a switcher's return connection, stay solid. A pad-level override applies relief to the through-hole pads only, so the pour's solid connection elsewhere is untouched.
- *A through-hole pad that must carry a current the spokes cannot*, which is a design decision recorded against that pad, with spoke count and width sized for the current.
