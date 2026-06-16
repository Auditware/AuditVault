---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/dex
protocol: "[[Hop Aggregator]]"
auditors:
  - "[[Akash Gurugunti]]"
report: "https://hop.ag/fun"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[integer-bounds]]"
---
# Flawed Version Validation Check

- id: 46946
- impact: HIGH
- protocol: [[Hop Aggregator]]
- reporter: Akash Gurugunti (OtterSec)
- source: https://hop.ag/fun

## Summary


The report states that there is a problem with the function "enforce_config_version" in the "meme" library. The function is supposed to check the version of a configuration, but it is currently not doing so because it is comparing the version to itself. This means that the check will always pass, making it meaningless. This could lead to outdated or incompatible configurations being used. To fix this, the function needs to be rewritten to compare the version to a valid threshold. This issue has been addressed in a recent patch.

## Details

## Logical Flaw in `meme::enforce_config_version`

There is a logical flaw in `meme::enforce_config_version`. The current function does not enforce any version check because it compares `config.version` with itself. Consequently, this expression will always evaluate to `true` for any configuration value. As a result, this renders the check meaningless, as it does not enforce any actual version comparison.

> _contracts/hopfun/sources/meme.move rust_
> 
> ```rust
> fun enforce_config_version(config: &MemeConfig) {
> assert!(config.version >= config.version, EBadVersion);
> }
> ```

Since the function is supposed to enforce a version check, its current behavior will allow outdated or incompatible configurations to be utilized.

## Remediation

Rewrite the version check to compare `config.version` to a valid threshold to ensure that only configurations meeting the required version are accepted.

## Patch

Fixed in commit `0923bc9`.
