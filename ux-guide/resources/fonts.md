---
sidebar_position: 3
title: Fonts
---

# Fonts

The fonts and their licences are in `ux/fonts/`. Both families are under the SIL Open Font License 1.1, which permits embedding them in product firmware.

## The families

| Family | File | Weights | Licence | Role |
|---|---|---|---|---|
| Noto Sans | `noto-sans/NotoSans[wdth,wght].ttf` | Variable, 100 to 900, width 62.5 to 100 | `noto-sans/OFL.txt` | Black, 900, for large data values |
| B612 | `b612/B612-Regular.ttf` and `b612/B612-Bold.ttf` | 400 and 700 | `b612/OFL.txt` | Bold for dial numbers, labels and units |
| B612 SCADYS Heavy | `b612/heavy-trials/B612SCADYSHeavy-H20.ttf`, with H35 and H50 | Three trial weights above Bold | `b612/heavy-trials/OFL.txt` | H20 for the heavy value roles not yet re-judged |

- *Source.* `ux/fonts/README.md`. [Typography](../foundations/typography.md).

## Install the fonts for all users

On Windows, install the font files for all users, in `C:\Windows\Fonts`. A font installed for one user only is not seen by some design applications.

- *Source.* `ux/design/LEARNINGS.md`, entry 32.

## Select the Black weight by name

Noto Sans is a variable font. In a drawing, select its weight by the named instance, such as Noto Sans Black. In a script using PIL, set the axes in the font's own order, weight then width, as `set_variation_by_axes([900, 100])`. The reverse order silently gives the thinnest weight.

- *Source.* `ux/design/LEARNINGS.md`, entry 42. VectorCraft runbook, how the canvas behaves.

## Build B612 SCADYS Heavy from B612 Bold

The heavier B612 is made by thickening the Bold outlines with FreeType emboldening, widening each advance by the amount added and keeping every digit at one width. The build script is `b612/tools/b612_heavy.py`. The derivative keeps the OFL and its own name.

- *Source.* `ux/fonts/README.md`, heavier B612.

## Cut static fonts for the firmware

The firmware takes static fonts, not the variable file. Static Black and Bold instances are cut from Noto Sans with `fontTools.varLib.instancer`, then converted to LVGL fonts holding only the glyphs and sizes each product needs. The OFL text ships with every product that embeds a font.

- *Source.* `ux/fonts/README.md`, firmware use.

## References

1. Google, [*Noto Sans*](https://fonts.google.com/noto/specimen/Noto+Sans), Google Fonts.
2. PolarSys, [*B612 font family*](https://github.com/polarsys/b612), GitHub.
3. SIL International, [*SIL Open Font License 1.1*](https://openfontlicense.org/open-font-license-official-text/), 2007.
