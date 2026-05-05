# 00 — Idea Validation

## Verdict

The idea is valid if scoped narrowly:

> A standalone drum-writing workspace where a drummer builds a kit, writes a groove in a grid editor, hears it immediately, exports MIDI/PDF, and optionally uses AI to patch selected bars.

The idea becomes risky if positioned as:

- a full DAW;
- a VST-first product;
- a catalog of branded drums/cymbals;
- an AI composer that replaces the drummer;
- a professional notation suite competing head-on with Sibelius, Dorico, Finale replacements, Guitar Pro, or MuseScore.

## Market signal

There is clear market signal because adjacent products already exist:

- Drum Notes / Drumap: mobile drum notation and beat creator with public claims of 200k+ users and 400k+ scores.
- Groove Scribe: browser-based drum groove creator with listen/share/print/download flows.
- Aered: drum-specific sheet music editor.
- Guitar Pro: general-purpose notation/playback/export tool with drum support.
- Soundslice: notation/practice product with custom percussion maps and playback.

This means the problem is not imaginary. The opportunity is not “nobody has ever done this.” The opportunity is: existing tools are fragmented, old-looking, notation-heavy, or not optimized for a modern kit-first web workflow.

## Core wedge

The wedge is not “better notation.”

The wedge is:

```text
custom kit -> grid writing -> instant playback -> export -> AI patch assist
```

This is closer to a lightweight working notebook for drummers than to a traditional score editor.

## Target users

Primary:

- drummers writing parts for practice or bands;
- drum teachers preparing exercises;
- self-taught drummers who do not want a heavy notation tool.

Secondary:

- producers sketching grooves before moving MIDI into a DAW;
- content creators making short drum exercises;
- bands sharing drum parts with a drummer.

## Why AI matters but should not be the product

AI should operate as an assistant:

- add a fill;
- simplify;
- make heavier;
- humanize velocity;
- add ghost notes;
- adapt to a kit.

AI should not be the main author. The drummer should remain in control.

## MVP success criteria

The MVP is successful if a drummer can:

1. create a kit;
2. click a groove into a 16-step grid;
3. press play and hear it without latency problems;
4. export MIDI;
5. export a readable printable PDF/grid;
6. apply or reject an AI-generated patch to selected bars.

## Biggest risks

1. Editor UX feels worse than writing in an existing tool.
2. Playback timing feels sloppy.
3. Export is not useful enough for DAW workflows.
4. AI edits are unpredictable or destructive.
5. The product tries to do too much before the core workflow is good.

## Decision

Proceed with a scoped MVP.

Do not build VST, audio transcription, branded catalog, real-time collaboration, or full professional engraving in the first version.
