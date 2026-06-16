---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - platform/hexens
  - has/github
  - severity/high
  - impact/data-corruption/price-manipulation
  - impact/loss-of-funds/direct-drain
  - impact/mev/sandwich
  - trigger/price-manipulation
  - trigger/sandwich-attack
protocol: "[[Tokemak]]"
auditors:
  - "[[Hexens]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2024-07-22-Tokemak.md"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[direct-drain]]"
  - "[[sandwich]]"
  - "[[trigger/price-manipulation]]"
  - "[[defi/sandwich-attack]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-manipulation-resistance]]"
---
# [TOKE-28] Positive price movements of vault assets can be directly stolen through withdraw

- id: 53521
- impact: HIGH
- protocol: [[Tokemak]]
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2024-07-22-Tokemak.md

## Summary


In this bug report, it is described how an attacker can manipulate the price of assets in an Autopool, resulting in them being able to steal a large portion of the pool's assets. This is possible because the pool's debt value is not updated when asset prices change, allowing the attacker to take advantage of the price difference. The report recommends implementing off-chain monitoring and frequent debt reporting to limit the damage, as well as potentially making withdrawals asynchronous. The bug has been fixed.

## Details

**Severity:** High

**Description:**

Assume there is 1 Autopool with 2 Destination Vaults with assets A and B respectively, each priced 1:1 with ETH. The Autopool holds 100 dvA shares and 900 dvB shares. The attacker holds 100 Autopool shares out of a total supply of 1000 shares.

So currently, we have:

Total assets = 1000 ETH (100 dvA + 900 dvB)

Total supply = 1000 ETH

Share rate = 1.0

(min/max) debt value = 1000 ETH

Now assume that asset A doubles in price, so 1 A is now worth 2 ETH. But the function `updateDebtReport` has not been called yet, so the positive price movement is not yet synced back to the Autopool’s debt value. If it would have been synced, the total asset would be 1100 ETH and the share rate would be 1.1.

The attacker can now call `withdraw(100 ETH)` for the 100 Autopool shares they have. Because the cached debt value for this Destination Vault is still 1 ETH per share, the Autopool will liquidate all 100 dvA shares it holds. Normally, the `withdawBaseAsset` would give it back 200 ETH and handle the surplus by giving 100 ETH to the user and adding the extra 100 ETH to idle.

However, the Destination Vaults use the swapper contracts, such as the `UniV3Swap` adapter, with an `minAmountOut` of 0. This means that there is no protection against any slippage from unintended price impact or forced price manipulation. 

The latter is exactly what the attacker will be able to do. By manipulating the active tick in the Uniswap V3 pool, the price changes and the Destination Vault would be swapping for a price that is controlled by the attacker.

The attacker can manipulate the price back to the original 1 ETH and so the Destination Vault will return 100 ETH in `withdrawBaseAsset`, which the Autopool simply expected. 

The user would receive their 100 ETH for their 100 shares at a 1.0 share rate, but a large chunk of the 100 ETH value (actually 50 A assets) would also be pocketed by the attacker after restoring the original active tick in the Uniswap V3 pool.

The attacker should’ve only been able to get a 1.1 share are at most for their 100 Autopool shares, but by sandwiching the Destination Vault’s swap and forcing slippage of the unsynced positive price movement, they are able to steal almost all of it.

At the end, the state is:

Total assets = 900 ETH (900 dvB)

Total supply = 900 ETH

Share rate = 1.0

(min/max) debt value = 900 ETH

If someone were to deposit 100 ETH again, the old position would not be attainable because asset A is now worth 2 ETH and so it would be deployed as Total Assets = 1000 ETH (50 dvA + 900 dvB). Therefore 50 A (= 100 ETH value) got skimmed by the attacker.

```
    function withdraw(
        uint256 assets,
        uint256 applicableTotalAssets,
        IAutopool.AssetBreakdown storage assetBreakdown,
        StructuredLinkedList.List storage withdrawalQueue,
        mapping(address => AutopoolDebt.DestinationInfo) storage destinationInfo
    ) public returns (uint256 actualAssets, uint256 actualShares, uint256 debtBurned) {
        [..]
    }
```

**Remediation:**  We recommend to have sufficient off-chain monitoring of the Autopool’s cached price against real prices and frequently issue debt reporting in case of large price movements.

This will still not fully remediate the issue, but could limit the damage.

One solution could be to calculate a `minAmountOut` for the DestinationVault’s swaps so that the damage is further limited. This could limit user that want to perform an emergency withdraw, however it might be the necessary evil.

Another solution could be to make withdrawals asynchronous. In other words, have users create withdrawal requests where Tokemak would have to execute these (e.g. destination vault withdraw and swaps), after which the user can claim their withdrawal.

**Status:**  Fixed


- - -
