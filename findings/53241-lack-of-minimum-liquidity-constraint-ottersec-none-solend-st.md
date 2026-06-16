---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/token
protocol: "[[Solend Steamm]]"
auditors:
  - "[[Michał Bochnak]]"
report: "https://save.finance/"
genome:
  - "[[rounding-direction]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# Lack of Minimum Liquidity Constraint

- id: 53241
- impact: HIGH
- protocol: [[Solend Steamm]]
- reporter: Michał Bochnak (OtterSec)
- source: https://save.finance/

## Summary


The report states that there is a bug in the bank module where there is no minimum requirement for liquidity, which can make it vulnerable to attacks that manipulate the value of bToken. This can result in a loss for users who deposit. The suggested solution is to enforce a minimum liquidity requirement in the bank module to prevent these attacks. This bug has been fixed in version 6e17d4f.

## Details

## Bank Module Liquidity Concerns

The bank module does not have any constraints on the minimum amount of liquidity that should be present at all times. Insufficient minimum liquidity may expose it to inflation attacks, enabling malicious actors to manipulate the value of bToken. 

For example, if the value of bToken exceeds a 1:1 ratio, burning bToken and increasing the amount of the underlying token can trigger zero mint when a user deposits, causing a loss for the user.

## Remediation

Enforce a minimum liquidity requirement in the bank to prevent inflation attacks.

## Patch

Resolved in `6e17d4f`.
