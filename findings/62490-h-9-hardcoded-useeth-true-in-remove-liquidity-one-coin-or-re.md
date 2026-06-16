---
tags:
  - lang/solidity
  - lang/vyper
  - sector/dex
  - sector/staking
  - sector/staking-pool
  - sector/token
  - sector/vault
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[Notional]]"
auditors:
  - "[[elolpuer]]"
  - "[[xiaoming90]]"
report: "https://github.com/sherlock-audit/2025-06-notional-exponent-judging"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[reentrancy-guard]]"
---
# H-9: Hardcoded `useEth = true` in `remove_liquidity_one_coin` or `remove_liquidity` lead to stuck fund

- id: 62490
- impact: HIGH
- protocol: [[Notional]] Exponent
- reporter: elolpuer (Sherlock)
- source: N/A

## Summary


This bug report is about a problem found by two users, elolpuer and xiaoming90, in a code repository on GitHub. The bug affects a feature called Curve V2 pool, which is used for trading cryptocurrency. The bug can cause a loss of assets for users. The root cause of the bug is a mistake in the code, which causes the wrong type of cryptocurrency to be used when exiting the pool. This leads to the loss of assets for users. The bug can be fixed by updating the code to use the correct type of cryptocurrency when exiting the pool.

## Details


Source: https://github.com/sherlock-audit/2025-06-notional-exponent-judging/issues/691 

## Found by 
elolpuer, xiaoming90

### Summary

-

### Root Cause

-

### Internal Pre-conditions

-

### External Pre-conditions

-

### Attack Path

Assume the Curve V2 pool with two-token setup. The following are some of the Curve pools that fit into this example.

https://www.curve.finance/dex/ethereum/pools/teth/deposit/ (t/ETH)

- LP Token - https://etherscan.io/address/0x752ebeb79963cf0732e9c0fec72a49fd1defaeac

- Coin 0 - 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 (WETH)
- Coin 1 - 0xCdF7028ceAB81fA0C6971208e83fa7872994beE5 (T)

https://www.curve.finance/dex/ethereum/pools/cvxeth/deposit/ (cvxeth) 

- LP Token - https://etherscan.io/address/0xb576491f1e6e5e62f1d8f26062ee822b40b0e0d4
- Coin 0 - 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 (WETH)
- Coin 1 - 0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B (CVX)

Curve Pool's Coin 0 is WETH, and thus `ETH_INDEX` is set to 0 during deployment. I have checked the source code and confirmed that `ETH_INDEX` is 0. Readers can access the LP token's etherscan link above to view the source code and see that the `ETH_INDEX` is set to 0.

Note that the Yield Strategy vault's `TOKEN_1` is equal to Curve Pool's Coin 0 and is set to WETH.

Assume that the Yield Strategy (YS) vault's asset is WETH, and we will enter the pool on a single-sided basis, with all deposited assets being in WETH.

The `msgValue` at Line 237 will be zero as `TOKEN_1` is in WETH and not Native ETH (0x0). Thus, the condition `0 < msgValue` will be evaluated to `false`.

As a result, no native ETH will be forwarded to the Curve Pool. Instead, the Curve pool will pull the WETH from the YS vault later. In this case, the `use_eth` parameter will be set to `false`, which makes sense because we are entering the pool with WETH and not Native ETH.

https://github.com/sherlock-audit/2025-06-notional-exponent/blob/main/notional-v4/src/single-sided-lp/CurveConvex2Token.sol#L219

```solidity
File: CurveConvex2Token.sol
219:     function _enterPool(
220:         uint256[] memory _amounts, uint256 minPoolClaim, uint256 msgValue
221:     ) internal returns (uint256) {
..SNIP..
235:         } else if (CURVE_INTERFACE == CurveInterface.V2) {
236:             return ICurve2TokenPoolV2(CURVE_POOL).add_liquidity{value: msgValue}(
237:                 amounts, minPoolClaim, 0 < msgValue // use_eth = true if msgValue > 0
238:             );
239:         }
```

Note that `use_eth` is `false`. The condition at Line 959 will be `true` and the Curve Pool will pull WETH from YS vault. Then, in Line 962, it will unwrap the WETH to Native ETH balance and proceed with the rest of the calculations.

```solidity
File: v2 (0.3.1).py
920: @payable
921: @external
922: @nonreentrant('lock')
923: def add_liquidity(amounts: uint256[N_COINS], min_mint_amount: uint256,
924:                   use_eth: bool = False, receiver: address = msg.sender) -> uint256:
..SNIP..
954:     for i in range(N_COINS):
955:         if use_eth and i == ETH_INDEX:
956:             assert msg.value == amounts[i]  # dev: incorrect eth amount
957:         if amounts[i] > 0:
958:             coin: address = _coins[i]
959:             if (not use_eth) or (i != ETH_INDEX):
960:                 assert ERC20(coin).transferFrom(msg.sender, self, amounts[i])
961:                 if i == ETH_INDEX:
962:                     WETH(coin).withdraw(amounts[i])
963:             amountsp[i] = xp[i] - xp_old[i]
```

The problem here is that when exiting the pool either via `remove_liquidity_one_coin` or `remove_liquidity` function, the `useEth` parameter is hardcoded to `true`, as shown below.

https://github.com/sherlock-audit/2025-06-notional-exponent/blob/main/notional-v4/src/single-sided-lp/CurveConvex2Token.sol#L244

```solidity
File: CurveConvex2Token.sol
244:     function _exitPool(
245:         uint256 poolClaim, uint256[] memory _minAmounts, bool isSingleSided
246:     ) internal returns (uint256[] memory exitBalances) {
247:         if (isSingleSided) {
248:             exitBalances = new uint256[](_NUM_TOKENS);
..SNIP..
255:                 exitBalances[_PRIMARY_INDEX] = ICurve2TokenPoolV2(CURVE_POOL).remove_liquidity_one_coin(
256:                     // Last two parameters are useEth = true and receiver = this contract
257:                     poolClaim, _PRIMARY_INDEX, _minAmounts[_PRIMARY_INDEX], true, address(this)
258:                 );
259:             }
..SNIP..
279:                 // Remove liquidity on CurveV2 does not return the exit amounts so we have to measure
280:                 // them before and after.
281:                 ICurve2TokenPoolV2(CURVE_POOL).remove_liquidity(
282:                     // Last two parameters are useEth = true and receiver = this contract
283:                     poolClaim, minAmounts, true, address(this)
284:                 );
```

Since `use_eth` is true, in Line 1043 below, it will transfer Native ETH to YS when exiting the pool.

```solidity
File: v2 (0.3.1).py
1024: @external
1025: @nonreentrant('lock')
1026: def remove_liquidity(_amount: uint256, min_amounts: uint256[N_COINS],
1027:                      use_eth: bool = False, receiver: address = msg.sender):
..SNIP..
1037:     for i in range(N_COINS):
1038:         d_balance: uint256 = balances[i] * amount / total_supply
1039:         assert d_balance >= min_amounts[i]
1040:         self.balances[i] = balances[i] - d_balance
1041:         balances[i] = d_balance  # now it's the amounts going out
1042:         if use_eth and i == ETH_INDEX:
1043:             raw_call(receiver, b"", value=d_balance)
```

After exiting the pool, native ETH will reside in the YS vault, and the logic at Lines 205-211 will be executed. The first condition (`ASSET == address(WETH)`) will evaluate to `true` in Line 205 below. However, the subsequent conditions `TOKEN_1 == ETH_ADDRESS` and `TOKEN_2 == ETH_ADDRESS` both evaluate to `false` as neither `TOKEN_1` nor `TOKEN_2` is equal to `ETH_ADDRESS`(0x0). Note that `TOKEN_1` is equal to WETH and not Native ETH (0x0) in this scenario.

In this case, the Native ETH residing in the YS will not be wrapped back to WETH.

https://github.com/sherlock-audit/2025-06-notional-exponent/blob/main/notional-v4/src/single-sided-lp/CurveConvex2Token.sol#L205

```solidity
File: CurveConvex2Token.sol
198:     function unstakeAndExitPool(
199:         uint256 poolClaim, uint256[] memory _minAmounts, bool isSingleSided
200:     ) external returns (uint256[] memory exitBalances) {
201:         _unstakeLpTokens(poolClaim);
202: 
203:         exitBalances = _exitPool(poolClaim, _minAmounts, isSingleSided);
204: 
205:         if (ASSET == address(WETH)) {
206:             if (TOKEN_1 == ETH_ADDRESS) {
207:                 WETH.deposit{value: exitBalances[0]}();
208:             } else if (TOKEN_2 == ETH_ADDRESS) {
209:                 WETH.deposit{value: exitBalances[1]}();
210:             }
211:         }
212:     }
```

Note that if it is a single-side exit, the `_executeRedemptionTrades()` will not be executed. If it is a proportional exit, the `_executeRedemptionTrades()` function will be executed, the condition at Line 229 (`address(tokens[i]) == address(asset) -> (WETH == WETH) -> True`) will be `True` and the `finalPrimaryBalance` will be set to the exit balance, and the for-loop will continue without swapping any assets.

Either way, the Native ETH remains in the YS vault.

https://github.com/sherlock-audit/2025-06-notional-exponent/blob/main/notional-v4/src/single-sided-lp/AbstractSingleSidedLP.sol#L229

```solidity
File: AbstractSingleSidedLP.sol
223:     function _executeRedemptionTrades(
224:         ERC20[] memory tokens,
225:         uint256[] memory exitBalances,
226:         TradeParams[] memory redemptionTrades
227:     ) internal returns (uint256 finalPrimaryBalance) {
228:         for (uint256 i; i < exitBalances.length; i++) {
229:             if (address(tokens[i]) == address(asset)) {
230:                 finalPrimaryBalance += exitBalances[i];
231:                 continue;
232:             }
```

Since the rest of the protocol works only with WETH, but not Native ETH. Many of the protocol's logic will be broken.

One instance is that the `_burnShares` will check the before and after balance of WETH to compute how many WETH asset to return to the user. Since we only have Native ETH here, but not WETH, the `assetsWithdrawn` will be zero, and users will receive nothing in return during withdrawal/redemption.

https://github.com/sherlock-audit/2025-06-notional-exponent/blob/main/notional-v4/src/AbstractYieldStrategy.sol#L416

```solidity
File: AbstractYieldStrategy.sol
416:     function _burnShares(
417:         uint256 sharesToBurn,
418:         uint256 /* sharesHeld */,
419:         bytes memory redeemData,
420:         address sharesOwner
421:     ) internal virtual returns (uint256 assetsWithdrawn) {
422:         if (sharesToBurn == 0) return 0;
423:         bool isEscrowed = _isWithdrawRequestPending(sharesOwner);
424: 
425:         uint256 initialAssetBalance = TokenUtils.tokenBalance(asset);
426: 
427:         // First accrue fees on the yield token
428:         _accrueFees();
429:         _redeemShares(sharesToBurn, sharesOwner, isEscrowed, redeemData);
430:         if (isEscrowed) s_escrowedShares -= sharesToBurn;
431: 
432:         uint256 finalAssetBalance = TokenUtils.tokenBalance(asset);
433:         assetsWithdrawn = finalAssetBalance - initialAssetBalance;
```

### Impact

High. Loss of assets as shown in above scenario.


### PoC

_No response_

### Mitigation

For exiting pool code, update the code to only set `useEth` to `True` if `TOKEN_1` or `TOKEN_2` is equal to `ETH_ADDRESS`(0x0). Otherwise, `useEth` should be `False`.

In this scenario, `useEth` should be `false` when exiting the pool. If it is set to `false` in the first place, WETH will be forwarded to the YS vault, and everything will work as expected without error.
