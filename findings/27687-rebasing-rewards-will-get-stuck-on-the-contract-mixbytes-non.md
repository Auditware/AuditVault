---
tags:
  - lang/solidity
  - lang/vyper
  - sector/dex
  - sector/liquid-staking
  - sector/token
  - platform/mixbytes
  - has/github
  - severity/high
  - precondition/specific-token-type
protocol: "[[Curve Finance]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Curve%20Finance/StableSwapNG/README.md#1-rebasing-rewards-will-get-stuck-on-the-contract"
genome:
  - "[[frozen-funds]]"
  - "[[specific-token-type]]"
  - "[[reward-theft]]"
  - "[[fot-slippage]]"
---
# Rebasing rewards will get stuck on the contract

- id: 27687
- impact: HIGH
- protocol: [[Curve Finance]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Curve%20Finance/StableSwapNG/README.md#1-rebasing-rewards-will-get-stuck-on-the-contract

## Summary


This bug report concerns the stored_balances feature of the CurveStableSwapNG and CurveStableSwapMetaNG contracts. This issue causes tokens with accrued rewards to not be able to be removed from the contracts, leading to users' tokens becoming stuck and unable to be retrieved. This is classified as a critical issue, as the contracts do not allow upgrades.

The recommended solution is to update the stored_balances feature so that it will account for possible token balance rebases. This should ensure that users are able to retrieve their tokens from the contracts.

## Details

##### Description
The main problem here is that `stored_balances` does not account for rewards for rebaseable tokens (e.g. stETH):
https://github.com/curvefi/stableswap-ng/blob/8c78731ed43c22e6bcdcb5d39b0a7d02f8cb0386/contracts/main/CurveStableSwapNG.vy#L380
https://github.com/curvefi/stableswap-ng/blob/8c78731ed43c22e6bcdcb5d39b0a7d02f8cb0386/contracts/main/CurveStableSwapMetaNG.vy#L440
This leads to the situation where deposited tokens with accrued rewards cannot be removed from the contract because of the revert on the lines pointed above. The test scenario was sent to the client during the audit. This finding is classified as critical because pools' contracts do not allow upgrades, which means that users' tokens will get stuck on the contract and there will be no possibility to retrieve them.

##### Recommendation
We recommend updating work with the `stored_balances` so that it will account for possible token balance rebases.


***
