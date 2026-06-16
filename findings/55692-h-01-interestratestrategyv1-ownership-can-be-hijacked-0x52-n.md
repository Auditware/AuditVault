---
tags:
  - lang/solidity
  - sector/lending
  - platform/0x52
  - has/github
  - severity/high
  - lang/vyper
protocol: "[[Hyperstable]]"
auditors:
  - "[[@IAm0x52]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/0x52/2025-05-02-Hyperstable.md"
genome:
  - "[[proxy-initialization]]"
  - "[[uninitialized-owner]]"
  - "[[upgradeable-contract]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[external-call-is-safe]]"
  - "[[proxy-is-initialized]]"
---
# [H-01] `InterestRateStrategyV1` ownership can be hijacked

- id: 55692
- impact: HIGH
- protocol: Hyperstable
- reporter: @IAm0x52 (0x52)
- source: https://github.com/solodit/solodit_content/blob/main/reports/0x52/2025-05-02-Hyperstable.md

## Summary


This bug report is about a vulnerability in the Solady `Ownable` contract that can allow for malicious upgrades and potential loss of funds. The issue is caused by not overriding the `_guardInitializeOwner` function in the `InterestRateStrategyV1` contract. To fix this, the function should be overridden to return `true`. This issue has been addressed in a recent update by replacing the Solady `Ownable` contract with the OZ `OwnableUpgradable` contract. 

## Details

**Details**

[Ownable.sol#L84-L85](https://github.com/Vectorized/solady/blob/9298d096feb87de9a8873a704ff98f6892064c65/src/auth/Ownable.sol#L84-L85)

    /// @dev Override to return true to make `_initializeOwner` prevent double-initialization.
    function _guardInitializeOwner() internal pure virtual returns (bool guard) {}

When utilizing Solady's `Ownable` contract with an upgradable contract, `_guardInitializeOwner` must be overridden to return `true` as communicated in the dev comment above. `InterestRateStrategyV1` is upgradable but does not do this, allowing the contract ownership to by hijacked. Consequences of this could be malicious upgrades to apply large amounts of interest to positions to liquidate all positions and the like.

**Lines of Code**

[Ownable.sol#L84-L85](https://github.com/Vectorized/solady/blob/9298d096feb87de9a8873a704ff98f6892064c65/src/auth/Ownable.sol#L84-L85)

**Recommendation**

`_guardInitializeOwner` should be overridden to return `true`.

**Remediation**

Fixed in [edb531f](https://github.com/hyperstable/contracts/commit/edb531f7b48ac805e461c1663994e002fe4a3c44). Solady `Ownable` was replaced with OZ `OwnableUpgradable`.
