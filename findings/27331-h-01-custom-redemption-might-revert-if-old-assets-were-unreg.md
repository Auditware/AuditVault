---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - sector/stable
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - trigger/governance-vote
protocol: "[[Reserve]]"
auditors:
  - "[[0xA5DF]]"
report: "https://code4rena.com/reports/2023-06-reserve"
genome:
  - "[[griefing]]"
  - "[[direct-drain]]"
  - "[[governance-vote]]"
  - "[[dos-resistance]]"
---
# [H-01] Custom redemption might revert if old assets were unregistered

- id: 27331
- impact: HIGH
- protocol: [[Reserve]]
- reporter: 0xA5DF (Code4rena)
- source: https://code4rena.com/reports/2023-06-reserve

## Summary


A bug was reported in the `quoteCustomRedemption()` function of the Reserve Protocol. This function works under the assumption that the maximum size of the `erc20sAll` array should be `assetRegistry.size()`, however there can be cases where an asset was unregistered but still exists in an old basket, making the size of the old basket greater than `assetRegistry.size()`. This can cause the function to revert with an index out of bounds error, preventing users from using `redeemCustom` when needed. 

This bug was considered high severity, as not being able to redeem can result in a depeg or in governance becoming malicious and stealing RToken collateral. To demonstrate the issue, a scenario was presented where a user wants to redeem using the old basket, but custom redemption reverts.

To mitigate the issue, it was suggested that the user should be allowed to specify the length of the array `erc20sAll` to avoid the revert. An alternative mitigation was also suggested, which was to move a certain line of code and cache the assets as `assetsAll` for re-use. However, this had the side-effect of making the ERC20 return list never include unregistered ERC20s. 

Reserve ultimately mitigated the issue by fixing `redeemCustom`. The mitigation was confirmed by reports from three different sources.

## Details


`quoteCustomRedemption()` works under the assumption that the maximum size of the `erc20sAll` should be `assetRegistry.size()`, however there can be cases where an asset was unregistered but still exists in an old basket, making the size of the old basket greater than `assetRegistry.size()`. In that case the function will revert with an index out of bounds error.

### Impact

Users might not be able to use `redeemCustom` when needed.

I think this should be considered high severity, since being able to redeem the token at all time is an essential feature for the protocol that's allowed also while frozen.
Not being able to redeem can result in a depeg or in governance becoming malicious and stealing RToken collateral.

### Proof of Concept

Consider the following scenario:

*   RToken deployed with 0.9 USDC, 0.05 USDT, 0.05 DAI
*   Governance passed a vote to change it to 0.9 DAI and 0.1 USDC and un-register USDT
*   Trading is paused before execution, so the basket switch occurs but the re-balance can't be executed. Meaning the actual assets that the backing manager holds are in accordance with the old basket
*   A user wants to redeem using the old basket, but custom redemption reverts

As for the revert:

*   `erc20sAll` is created [here](https://github.com/reserve-protocol/protocol/blob/c4ec2473bbcb4831d62af55d275368e73e16b984/contracts/p1/BasketHandler.sol#L391-L392) with the length of `assetRegistry.size()`, which is 2 in our case.
*   Then in [this loop](https://github.com/reserve-protocol/protocol/blob/c4ec2473bbcb4831d62af55d275368e73e16b984/contracts/p1/BasketHandler.sol#L397-L428) the function tries to push 3 assets into `erc20sAll` which will result in an index-out-of-bonds error

(the function doesn't include in the final results assets that aren't registered, but it does push them too into `erc20sAll`)

### Recommended Mitigation Steps

Allow the user to specify the length of the array `erc20sAll` to avoid this revert

**[0xean (judge) commented](https://github.com/code-423n4/2023-06-reserve-findings/issues/4#issuecomment-1586269794):**
 > I believe this to be a stretch for high severity. It has several pre-conditions to end up in the proposed state and I do believe it would be entirely possible for governance to change back to the original state (USDC, USDT, DAI), so assets wouldn't be lost and the impact would more be along the lines of a temporary denial of service.
> 
> Look forward to warden and sponsor comments. 

**[tbrent (Reserve) confirmed and commented](https://github.com/code-423n4/2023-06-reserve-findings/issues/4#issuecomment-1587948710):**
 > @0xA5DF - nice find! Thoughts on an alternative mitigation?
> - Could move L438 to just after L417, so that `erc20sAll` never includes unregistered ERC20s
> - Would probably have to cache the assets as `assetsAll` for re-use around L438
> - Has side-effect of making the ERC20 return list never include unregistered ERC20s. Current implementation can return a 0 value for an unregistered ERC20. This is properly handled by the RToken contract, but still, nice-to-have.

**[0xA5DF (warden) commented](https://github.com/code-423n4/2023-06-reserve-findings/issues/4#issuecomment-1587988163):**
 > Hey @tbrent -<br>
> That can work as well, the only downside I can think of is that in case there's an asset that's not registered and is repeated across different baskets - the `toAsset()` would be called multiple times for that asset (while under the current implementation and under the mitigation I've suggested it'll be called only once), this would cost about 300 gas units per additional call (100 for the call, 2 `sload`s to a warm slot inside the call itself)

**[tbrent (Reserve) commented](https://github.com/code-423n4/2023-06-reserve-findings/issues/4#issuecomment-1588023172):**
> @0xA5DF - Noted, good point.

**[tbrent (Reserve) confirmed](https://github.com/code-423n4/2023-06-reserve-findings/issues/4#issuecomment-1620824425)**

**[0xean (judge) commented](https://github.com/code-423n4/2023-06-reserve-findings/issues/4#issuecomment-1632948695):**
 > @tbrent - do you care to comment on your thoughts on severity? I am leaning towards M on this, but it sounds like you believe it is correct as labeled (high). 

**[tbrent (Reserve) commented](https://github.com/code-423n4/2023-06-reserve-findings/issues/4#issuecomment-1632984393):**
 > @0xean - Correct, I think high is appropriate. 

**[Reserve mitigated](https://github.com/code-423n4/2023-08-reserve-mitigation#individual-prs):**
> Fix `redeemCustom`.<br>
> PR: https://github.com/reserve-protocol/protocol/pull/857

**Status:** Mitigation confirmed. Full details in reports from [ronnyx2017](https://github.com/code-423n4/2023-08-reserve-mitigation-findings/issues/7), [0xA5DF](https://github.com/code-423n4/2023-08-reserve-mitigation-findings/issues/30), and [rvierdiiev](https://github.com/code-423n4/2023-08-reserve-mitigation-findings/issues/3) - and also shared below in the [Mitigation Review](#mitigation-review) section.



***
