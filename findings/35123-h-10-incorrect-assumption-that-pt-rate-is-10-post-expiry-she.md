---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/dex
  - sector/lending
  - sector/oracle
  - sector/restaking
  - sector/staking
protocol: "[[Notional]]"
auditors:
  - "[[lemonmon]]"
  - "[[xiaoming90]]"
report: "https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging"
genome:
  - "[[reward-calculation]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# H-10: Incorrect assumption that PT rate is 1.0 post-expiry

- id: 35123
- impact: HIGH
- protocol: [[Notional]] Leveraged Vaults: Pendle PT and Vault Incentives
- reporter: lemonmon (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue with the PT rate being incorrectly assumed to be 1.0 after the expiry date. This leads to the price being inflated and allows malicious users to borrow more than the actual collateral value, resulting in stolen assets from the protocol. The bug is caused by incorrect configuration files and code assumptions. The report recommends ensuring the correct PT rate is used post-expiry. 

## Details

Source: https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging/issues/69 

## Found by 
lemonmon, xiaoming90
## Summary

PT rate will be hardcoded to 1.0 post-expiry, which is incorrect. The price returned from the Notional's `PendlePTOracle` contract will be inflated. As a result, the account's collateral will be overinflated, allowing malicious users to borrow significantly more than the actual collateral value, stealing assets from the protocol.

## Vulnerability Detail

The following are the configuration files for the PT weETH 27JUN2024 taken from the test files of the audit contest's repository. 

For PT weETH 27JUN2024, note that the `useSyOracleRate` is set to `True`, as per Line 59 below.

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/tests/Staking/PendlePTTests.yml#L51

```solidity
File: PendlePTTests.yml
51:   - stakeSymbol: weETH
52:     forkBlock: 221089505
53:     expiry: 27JUN2024
54:     primaryBorrowCurrency: ETH
55:     contractName: PendlePTGeneric
56:     oracles: [ETH]
57:     marketAddress: "0x952083cde7aaa11AB8449057F7de23A970AA8472"
58:     ptAddress: "0x1c27Ad8a19Ba026ADaBD615F6Bc77158130cfBE4"
59:     useSyOracleRate: 'true'
60:     tradeOnEntry: true
61:     primaryDex: UniswapV3
```

For PT weETH 27JUN2024, note that the `useSyOracleRate` is set to `True`, as per Line 118 below.

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/tests/generated/arbitrum/PendlePT_weETH_ETH.t.sol#L115

```solidity
 File: PendlePT_weETH_ETH.t.sol
115:         marketAddress = 0x952083cde7aaa11AB8449057F7de23A970AA8472;
116:         ptAddress = 0x1c27Ad8a19Ba026ADaBD615F6Bc77158130cfBE4;
117:         twapDuration = 15 minutes; // recommended 15 - 30 min
118:         useSyOracleRate = true;
119:         baseToUSDOracle = 0x9414609789C179e1295E9a0559d629bF832b3c04;
120:         
121:         tokenInSy = 0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe;
122:         borrowToken = 0x0000000000000000000000000000000000000000;
123:         tokenOutSy = 0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe;
124:         redemptionToken = 0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe;
```

In this case, the `useSyOracleRate` is set to `True` in the `PendlePTOracle` contract.

In Line 115 below, the PT rate will be hardcoded to 1.0 post-expiry. Per the comment at Lines 113-114, it assumes that 1 unit of PT is worth 1 unit of the underlying SY at expiration. However, this assumption is incorrect.

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/oracles/PendlePTOracle.sol#L113

```solidity
File: PendlePTOracle.sol
092:     function _calculateBaseToQuote() internal view returns (
..SNIP..
113:         // Past expiration, hardcode the PT oracle price to 1. It is no longer tradable and
114:         // is worth 1 unit of the underlying SY at expiration.
115:         int256 ptRate = expiry <= block.timestamp ? ptDecimals : _getPTRate();
116: 
117:         answer = (ptRate * baseToUSD * rateDecimals) /
118:             (baseToUSDDecimals * ptDecimals);
119:     }
```

Per the [Pendle documentation](https://docs.pendle.finance/ProtocolMechanics/YieldTokenization/PT7):

> In the case of reward-bearing assets, it’s particularly important to note that PT is redeemable 1:1 for the accounting asset, *NOT* the **underlying asset.
>
> For example, the value of Renzo ezETH increases overtime relative to ETH as staking and restaking rewards are accrued. For every 1 PT-ezETH you own, you’ll be able to redeem 1 ETH worth of ezETH upon maturity, *NOT* 1 ezETH which has a higher value**.**

Using PT weETH 27JUN2024, which is used within the ether.fi vault as an example:

- Underlying assets = [weETH](https://arbiscan.io/address/0x35751007a407ca6feffe80b3cb397736d2cf4dbe) (Wrapped eETH)
- SY = [SY weETH](https://arbiscan.io/address/0xa6c895eb332e91c5b3d00b7baeeaae478cc502da)
- PT = [PT weETH 27JUN2024](https://arbiscan.io/address/0x1c27ad8a19ba026adabd615f6bc77158130cfbe4)
- Market = https://arbiscan.io/address/0x952083cde7aaa11AB8449057F7de23A970AA8472 (isExpired = true)
- Accounting assets = eETH = ETH

Per the [Pendle's eETH market page](https://app.pendle.finance/trade/markets/0xf9f9779d8ff604732eba9ad345e6a27ef5c2a9d6/swap?view=pt&chain=arbitrum&py=output), it has stated that 1 PT eETH is equal to 1 eETH (also equal to 1 ETH) at maturity.

<img width="458" alt="image-2024070193926709 PM" src="https://github.com/sherlock-audit/2024-06-leveraged-vaults-xiaoming9090/assets/102820284/398f979c-3936-4a03-a970-281c53981e39">

However, as noted earlier, the code assumes that one unit of PT is worth one unit of weETH instead of one unit of PT being worth one unit of eETH, which is incorrect.

On 1 July, the price of weETH was 3590 USD, while the price of eETH was 3438 USD. This is a difference of 152 USD.

As a result, the price returned from the Notional's `PendlePTOracle` contract will be inflated.

#### Additional Information

The PT weETH 27JUN2024 has already expired as of 1 July 2024.

Let's verify if the PT rate is 1.0 after maturity by inspecting the rate returned from Pendle [PT Oracle](https://arbiscan.io/address/0x9a9Fa8338dd5E5B2188006f1Cd2Ef26d921650C2)'s `getPtToSyRate` function.

<img width="318" alt="image-2024070195459431 PM" src="https://github.com/sherlock-audit/2024-06-leveraged-vaults-xiaoming9090/assets/102820284/630d7ca4-f9b3-433f-a44c-70c41fa65c38">

As shown above, the PT rate at maturity is `0.9598002817` instead of `1.0`. Thus, it is incorrect to assume that the PT rate is 1.0 post-expiry.

## Impact

The price returned from the Notional's `PendlePTOracle` contract will be inflated. As a result, the account's collateral will be overinflated, allowing malicious users to borrow significantly more than the actual collateral value, stealing assets from the protocol.

## Code Snippet

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/oracles/PendlePTOracle.sol#L113

## Tool used

Manual Review

## Recommendation

Ensure that the correct PT rate is used post-expiry.
