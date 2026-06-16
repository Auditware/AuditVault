---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/token
protocol: "[[Shido]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-05-28-Shido.md"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Insufficient Src Validation allows Malicious Users To Steal WSHIDO From Users With Zero Allowance

- id: 35628
- impact: HIGH
- protocol: [[Shido]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-05-28-Shido.md

## Summary


The WSHIDO token, which allows users to wrap SHIDO for use in the ecosystem, has a critical bug that has been resolved. In the `transferFrom` function, there is a check to ensure that if the source address is not the same as the sender and the allowance is not zero, it will deduct from the allowance. However, the bug allows for free token transfers from users with zero allowance because there is no condition for this check. It is recommended that the `transferFrom` function is updated to account for this and deduct amounts accordingly.

## Details

**Severity**: Critical

**Status**: Resolved

**Description**

The WSHIDO token is forked from the WETH contract on the Ethereum Mainnet and is intended to allow users to wrap SHIDO to be used in the ecosystem. In the `transferFrom` function, there is a check which ensures that if src address is not equal to the `msg.sender` and the allowance is not equal to zero, deduct from allowance. After this check with no conditions, deduct from the src address and add to the dst address which both variables are user supplied and is where the issue lies. As a result, free token transfers can be made from users with zero allowance.

**Recommendation**: 

It’s recommended that the `transferFrom` method for the WSHIDO contract is refactored to include logic to account for the src address being the `msg.sender` and deduct amounts accordingly.
