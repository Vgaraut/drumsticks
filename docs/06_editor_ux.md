# 06 — Editor UX

## UX principle

The user must hear an idea faster than they would open a DAW and configure a drum instrument.

## Primary screen

Recommended layout:

```text
Top bar:
  project title | tempo | play/stop | loop | export

Left:
  kit / instrument rows

Center:
  grid editor

Right:
  selected hit / AI assist / export panel
```

## Grid

MVP grid:

- 4/4;
- 16 steps per bar;
- vertical rows are instruments;
- horizontal columns are subdivisions;
- bar lines every 16 steps;
- beat emphasis every 4 steps.

Example:

```text
        1 e & a 2 e & a 3 e & a 4 e & a
Kick    x       x         x
Snare           x                 x
Hat     x x x x x x x x x x x x x x x x
```

## Hit editing

Click behavior:

- empty cell -> add normal hit;
- active cell -> remove hit.

Velocity behavior:

- shortcut/cycle later: soft -> normal -> accent -> off;
- MVP can use side panel or right-click.

Velocity presets:

```text
soft: 55
normal: 90
accent: 120
```

## Selection

MVP selection:

- select one or more bars;
- selected range is used for loop and AI patching.

## Keyboard shortcuts

First useful shortcuts:

- Space: play/stop.
- L: toggle loop.
- Cmd/Ctrl+C: copy selected bar.
- Cmd/Ctrl+V: paste selected bar.
- Delete/Backspace: clear selected hits/bar.

## Kit view

MVP kit view can be simple:

- instrument list;
- optional 2D top-view later.

Do not spend too much time drawing beautiful drums before grid and playback work.

## Error UX

Show clear messages for:

- missing sample;
- invalid project;
- export failure;
- AI patch rejected;
- playback cannot start because browser audio context needs a user gesture.

## MVP polish checklist

- Hits are easy to see.
- Current playback step is visible.
- Tempo input is obvious.
- Play/stop never gets stuck.
- Export button gives immediate feedback.
- AI preview can be discarded safely.
