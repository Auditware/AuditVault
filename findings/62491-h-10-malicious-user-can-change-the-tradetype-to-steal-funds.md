---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - sector/stable
  - sector/staking
  - sector/token
  - sector/vault
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Notional]]"
auditors:
  - "[[mstpr-brainbot]]"
  - "[[xiaoming90]]"
report: "https://github.com/sherlock-audit/2025-06-notional-exponent-judging"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# H-10: Malicious user can change the `TradeType` to steal funds from the vault or withdraw request manager

- id: 62491
- impact: HIGH
- protocol: [[Notional]] Exponent
- reporter: mstpr-brainbot (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability found in the Notional Exponent protocol. The vulnerability allows malicious users to exploit the protocol and steal funds from the Yield Strategy vault. The root cause of the issue is a flaw in the `_executeRedemptionTrades` function, where the `t.tradeType` can be set to any value by the caller. This allows the user to set it to `TradeType.EXACT_OUT_SINGLE` and receive an arbitrary amount of tokens instead of the expected amount. The same issue is also found in the `AbstractWithdrawRequestManager._preStakingTrade()` function. The impact of this vulnerability is high and can be mitigated by hardcoding the trade type to `TradeType.EXACT_IN_SINGLE` in both functions. The protocol team has fixed this issue in the latest PRs/commits.

## Details


Source: https://github.com/sherlock-audit/2025-06-notional-exponent-judging/issues/715 

## Found by 
mstpr-brainbot, xiaoming90

### Summary

-

### Root Cause

-

### Internal Pre-conditions

-

### External Pre-conditions

-

### Attack Path

**Instance 1 - Yield Strategy Vault**

Assume the following:

- The asset token of a yield strategy vault is WBTC
- The yield token of the vault is the LP token of a Curve Pool (DAI/WBTC)
- 1 WBTC is worth 100,000 DAI
- WBTC's decimals is 8. DAI's decimals is 18.

When redeeming the LP token, the vault received back 10,000 DAI and 1 WBTC. The intention of the `_executeRedemptionTrades` function is to swap all non-asset token (DAI in this example) to asset token (WBTC), as per the comment at Line 235 below.

Thus, the `t.tradeType` must always be set to `TradeType.EXACT_IN_SINGLE` so that exact amount of 10,000 DAI (10000e18) will be swapped for arbitrary amount of WBTC (asset token). In this case, it should receive 0.1 WBTC after swapping in 10,000 DAI.

> [!NOTE]
>
> The `t.minPurchaseAmount` should also be set to the maximum value possible, so that maximum allowance will be granted to the external DEX protocol to pull tokens from Notional. Refer to [here](https://github.com/sherlock-audit/2023-02-notional/blob/b33adfbe2d47ab602b4d626bb73ebd78bf7d5622/leveraged-vaults/contracts/trading/TradingUtils.sol#L118). In EXACT_OUT trades, approval will be given based on `trade.limit` value.

> [!NOTE]
>
> This attack will work for any trading adapters, as demonstrated in the scenario below. However, if one needs maximum flexibility and control in crafting the exploit, such as the ability to set `trade.amount` to an arbitrary value instead of being restricted to `exitBalances[i]` (10000e18), they can consider using the 0x's [ZeroExAdaptor](https://github.com/sherlock-audit/2023-02-notional/blob/main/leveraged-vaults/contracts/trading/adapters/ZeroExAdapter.sol) because it allows users to define arbitrary execution data, and there is no check against the execution data internally.

https://github.com/sherlock-audit/2025-06-notional-exponent/blob/main/notional-v4/src/single-sided-lp/AbstractSingleSidedLP.sol#L223

```solidity
File: AbstractSingleSidedLP.sol
222:     /// @dev Trades the amount of secondary tokens into the primary token after exiting a pool.
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
233: 
234:             TradeParams memory t = redemptionTrades[i];
235:             // Always sell the entire exit balance to the primary token
236:             if (exitBalances[i] > 0) {
237:                 Trade memory trade = Trade({
238:                     tradeType: t.tradeType,
239:                     sellToken: address(tokens[i]), // @audit DAI
240:                     buyToken: address(asset), // @audit WBTC
241:                     amount: exitBalances[i], // @audit 10,000 DAI => 10000e18
242:                     limit: t.minPurchaseAmount,
243:                     deadline: block.timestamp,
244:                     exchangeData: t.exchangeData
245:                 });
246:                 (/* */, uint256 amountBought) = _executeTrade(trade, t.dexId);
247: 
248:                 finalPrimaryBalance += amountBought;
249:             }
250:         }
```

However, the issue here is that the `t.tradeType` can be set to any value by the caller or user. Thus, instead of setting it to `TradeType.EXACT_IN_SINGLE`, a malicious user can set it to `TradeType.EXACT_OUT_SINGLE`.

If the trade data is set to `TradeType.EXACT_OUT_SINGLE` as follows:

```solidity
Trade memory trade = Trade({
    tradeType: TradeType.EXACT_OUT_SINGLE,
    sellToken: DAI,
    buyToken: WBTC,
    amount: 10000e18, // 10,000 DAI
    limit: t.minPurchaseAmount,
    deadline: block.timestamp,
    exchangeData: t.exchangeData
});
```

This means that the trade will swap in an arbitrary amount of DAI for the exact amount of 10000e18 WBTC (= 1.0e14 WBTC token)

It is possible that there is an excess balance of DAI residing on the Yield Strategy vault due to several reasons (e.g., reward token happens to be DAI). In this case, the DAI tokens residing on the Yield Strategy vault will be swapped to 1.0e14 WBTC tokens.

To recap, if `TradeType.EXACT_IN_SINGLE` is used, the 0.1 WBTC will be received. If `TradeType.EXACT_OUT_SINGLE` is used, 1.0e14 WBTC will be received.

Thus, by changing the `TradeType`, the user could potentially obtain much more assets than expected and steal funds from the vault.

Following is an extract from the [Contest's README](https://github.com/sherlock-audit/2025-06-notional-exponent-xiaoming9090/tree/main?tab=readme-ov-file#q-please-discuss-any-design-choices-you-made). The protocol is designed to be extendable and intended to work with different pools and tokens. Thus, the above example is just one possible instance, and many other combinations are possible due to the different lending platforms, pool, tokens, reward tokens being supported by the protocol.

> Q: Please discuss any design choices you made.
>
> Notional Exponent is designed to be extendable to new yield strategies and opportunities as well as new lending platforms. 

**Instance 2 - Withdraw Request Manager**

The similar issue is also found in the `AbstractWithdrawRequestManager._preStakingTrade()` function, where the trade type can be arbitrarily defined by the caller in Line 277. The exploit method closely resembles the one described in the previous instance.

https://github.com/sherlock-audit/2025-06-notional-exponent/blob/main/notional-v4/src/withdraws/AbstractWithdrawRequestManager.sol#L268

```solidity
File: AbstractWithdrawRequestManager.sol
268:     function _preStakingTrade(address depositToken, uint256 depositAmount, bytes calldata data) internal returns (uint256 amountBought, bytes memory stakeData) {
269:         if (depositToken == STAKING_TOKEN) {
270:             amountBought = depositAmount;
271:             stakeData = data;
272:         } else {
273:             StakingTradeParams memory params = abi.decode(data, (StakingTradeParams));
274:             stakeData = params.stakeData;
275: 
276:             (/* */, amountBought) = _executeTrade(Trade({
277:                 tradeType: params.tradeType,
278:                 sellToken: depositToken,
279:                 buyToken: STAKING_TOKEN,
280:                 amount: depositAmount,
```

Assume that

- `depositToken` is not equal to the `STAKING_TOKEN`
- Yield Strategy vault's assets token is USDC. 
- `WITHDRAW_TOKEN` is USDC

After the WR is finalized, the withdraw token (USDC) will reside in WRM if someone calls `finalizeRequestManual`.

In this case, when a trade is executed, `sellToken=depositToken=USDC` and `buyToken=StakingToken`. Thus, malicious users can use the same exploit (setting trading type to EXACT_OUT) mentioned earlier to steal USDC funds on WRM to purchase more staking tokens than expected, which will, in turn, generate more yield tokens/collateral shares under their account.

### Impact

High. Malicious users can exploit this to steal funds from the vault.


### PoC

_No response_

### Mitigation

The fix is straightforward. Simply hardcoded the trade type to `TradeType.EXACT_IN_SINGLE` to prevent this exploit. This will ensure that an exact amount of tokens is swapped in exchange for an arbitrary amount of desired tokens, and not the other way round.

```diff
/// @dev Trades the amount of secondary tokens into the primary token after exiting a pool.
function _executeRedemptionTrades(
    ERC20[] memory tokens,
    uint256[] memory exitBalances,
    TradeParams[] memory redemptionTrades
) internal returns (uint256 finalPrimaryBalance) {
    for (uint256 i; i < exitBalances.length; i++) {
        if (address(tokens[i]) == address(asset)) {
            finalPrimaryBalance += exitBalances[i];
            continue;
        }

        TradeParams memory t = redemptionTrades[i];
        // Always sell the entire exit balance to the primary token
        if (exitBalances[i] > 0) {
            Trade memory trade = Trade({
-               tradeType: t.tradeType,
+               tradeType: TradeType.EXACT_IN_SINGLE,
                sellToken: address(tokens[i]),
                buyToken: address(asset),
                amount: exitBalances[i],
                limit: t.minPurchaseAmount,
                deadline: block.timestamp,
                exchangeData: t.exchangeData
            });
            (/* */, uint256 amountBought) = _executeTrade(trade, t.dexId);

            finalPrimaryBalance += amountBought;
        }
    }
}
```

```diff
function _preStakingTrade(address depositToken, uint256 depositAmount, bytes calldata data) internal returns (uint256 amountBought, bytes memory stakeData) {
    if (depositToken == STAKING_TOKEN) {
        amountBought = depositAmount;
        stakeData = data;
    } else {
        StakingTradeParams memory params = abi.decode(data, (StakingTradeParams));
        stakeData = params.stakeData;

        (/* */, amountBought) = _executeTrade(Trade({
-           tradeType: params.tradeType,
+           tradeType: TradeType.EXACT_IN_SINGLE,
            sellToken: depositToken,
            buyToken: STAKING_TOKEN,
            amount: depositAmount,
            exchangeData: params.exchangeData,
            limit: params.minPurchaseAmount,
            deadline: block.timestamp
        }), params.dexId);
    }
}
```

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/notional-finance/notional-v4/pull/18
