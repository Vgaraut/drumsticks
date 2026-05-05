# 10 — Catalog Policy

## Decision

Do not build a branded instrument/cymbal catalog in MVP.

Use generic instrument types and editable user labels.

## Why

Real drum/cymbal brand names, logos, and model names can create legal, licensing, and maintenance problems.

They also do not prove the core product value.

The core value is:

```text
write drum part -> hear it -> export it
```

not:

```text
browse official Zildjian/Sabian/Meinl/Paiste/DW/Ludwig catalog
```

## MVP catalog

Allowed generic types:

- Kick
- Snare
- Closed Hi-Hat
- Open Hi-Hat
- Crash
- Ride
- Rack Tom
- Floor Tom
- Clap
- Perc

## Editable names

Users may rename instruments in their own projects.

Example:

- `Snare` -> `My brass snare`
- `Crash` -> `Dark crash 18`

Avoid showing official brand logos or suggesting real model names as system-provided catalog items.

## Sound packs

Recommended later monetization:

- Basic Kit
- Rock Kit
- Metal Kit
- Jazz Kit
- Vintage Kit
- Electronic Kit

These are generic and safer than official branded catalogs.

## User sample import

Strong later feature:

- user uploads own kick/snare/hat samples;
- maps samples to kit elements;
- project stores references to uploaded samples.

This gives users customization without official brand licensing.

## Branded catalog later

Only consider official branded catalogs after traction.

Requirements:

- licensing agreement;
- approved logos and names;
- approved sample rights;
- update process;
- clear monetization.

## Agent rule

Do not add brand logos, official-looking brand entries, or scraped product catalogs unless the task explicitly says there is a license and provides approved assets.
