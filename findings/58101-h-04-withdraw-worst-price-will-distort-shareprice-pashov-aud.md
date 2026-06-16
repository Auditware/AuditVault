---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[Astrolab]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Astrolab-security-review.md"
genome:
  - "[[oracle-freshness]]"
  - "[[stale-price]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[oracle-is-reliable]]"
---
# [H-04] `withdraw()` worst price will distort `sharePrice()`

- id: 58101
- impact: HIGH
- protocol: Astrolab
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Astrolab-security-review.md

## Summary


A bug has been identified in the code of As4626.sol. The bug causes the withdrawal price to be different from the expected price, which can result in long term value loss. This is due to the usage of the worst price in the `_withdraw()` function, which does not take into account the actual withdraw price. This can happen when there is an existing request for withdrawal. The `sharePrice()` function, which calculates the price, also uses the `last.sharePrice` value, which is not updated correctly. This can lead to a discrepancy in the price, resulting in a potential loss of 3.7%. To fix this bug, it is recommended to update the `last.sharePrice` after every `deposit()` and `withdraw()` function.

## Details

## Severity

**Impact:** High, because inaccurate price will cause long term value leaking, and can not be fixed

**Likelihood:** Medium, because every time `withdraw()` with existing request will bring in error into the system

## Description

The worst price is used in `_withdraw()`, which means the actual withdraw price is different from `last.sharePrice`.

```solidity
File: src\abstract\As4626.sol
149:     function _withdraw() internal nonReentrant returns (uint256) {
159:         last.sharePrice = sharePrice();

161:         uint256 price = (claimable >= _shares)
162:             ? AsMaths.min(last.sharePrice, request.sharePrice) // worst of if pre-existing request
163:             : last.sharePrice; // current price
```

`last.sharePrice` is only updated in the following cases, none of them take the real withdraw price into consideration.``

```solidity
File: src\abstract\As4626.sol
84:     function _deposit() internal nonReentrant returns (uint256) {
93:         last.sharePrice = sharePrice();

149:     function _withdraw() internal nonReentrant returns (uint256) {
159:         last.sharePrice = sharePrice();

512:     function requestRedeem() public nonReentrant {
523:         last.sharePrice = sharePrice();

577:     function cancelRedeemRequest() external nonReentrant {
590:         last.sharePrice = sharePrice();
```

Let's look at how `sharePrice()` is calculated:
First it calls `totalAccountedAssets()`, and in `totalAccountedAssets()` the `last.sharePrice` is directly used, seems the assumption is: `last.sharePrice` remain constant with each `deposit()/withdraw()`. However it does not hold since the worst price usage.

```solidity
File: src\abstract\As4626Abstract.sol
175:     function sharePrice() public view virtual returns (uint256) {
176:         uint256 supply = totalAccountedSupply();
177:         return
178:             supply == 0
179:                 ? weiPerShare
180:  @>>>>          : totalAccountedAssets().mulDiv( // eg. e6
181:                     weiPerShare ** 2, // 1e8*2
182:                     supply * weiPerAsset
183:                 ); // eg. (1e6+1e8+1e8)-(1e8+1e6)
184:     }

154:     function totalAccountedAssets() public view returns (uint256) {
155:         return
156:             totalAssets() -
157:             req.totalClaimableRedemption.mulDiv(
158:  @>>>>          last.sharePrice * weiPerAsset,
159:                 weiPerShare ** 2
160:             ); // eg. (1e8+1e8+1e6)-(1e8+1e8) = 1e6
161:     }
```

To summarize, when `request.sharePrice < sharePrice()`, the withdrawal will processed at a lower price than current, in which case the discrepancy would incur an effective `sharePrice` increase that would not be factored-in `last.sharePrice`.

Let's see some number example:

- at first, total share is 100, total asset 500, sharePrice is 5.
- some user with 20 shares request withdraw at price 5. totalClaimableRedemption is 40 (total 20% on hold).
- after a long time, total asset becomes 1000, sharePrice is 10, and liquidity is enough.
- Alice calls withdraw() at price 5 (due to worst price in \_withdraw()), total asset becomes 80 (60 + 20 in totalClaimableRedemption).

Now total asset is 1000 - 20 \* 5 = 900. But last.sharePrice remains 10, due to As4626.sol#159 (last.sharePrice = sharePrice()). The actual price should be 900 / 80 = 11.25.

The next time totalAccountedAssets() will return 900 - 20 \* 10 = 700, sharePrice() will return 700 / 60 = 11.67, around 3.7% difference (11.67~11.25).

So if some user tries to deposit a bit amount, 3.7% slippage will be the loss.

```solidity
File: src\abstract\As4626Abstract.sol
154:     function totalAccountedAssets() public view returns (uint256) {
155:         return
156:             totalAssets() -
157:             req.totalClaimableRedemption.mulDiv(
158:                 last.sharePrice * weiPerAsset,
159:                 weiPerShare ** 2
160:             ); // eg. (1e8+1e8+1e6)-(1e8+1e8) = 1e6
161:     }
```

I believe in normal situations, if the last.sharePrice and request.sharePrice are relatively close, the sharePrice will only diff slightly.

## Recommendations

One possible mitigation is to update the `last.sharePrice` after `deposit()/withdraw()`.
