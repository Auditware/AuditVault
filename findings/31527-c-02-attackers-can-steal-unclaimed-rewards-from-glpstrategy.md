---
tags:
  - lang/solidity
  - sector/governance
  - platform/pashov
  - has/github
  - severity/high
  - vuln/arithmetic/rounding-direction
  - impact/loss-of-funds/reward-theft
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Tapioca DAO]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov Audit Group/2024-02-01-TapiocaDAO.md"
genome:
  - "[[rounding-direction]]"
  - "[[reward-theft]]"
  - "[[variant]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
---
# [C-02] Attackers can steal unclaimed rewards from `GlpStrategy` because the accounted balance does not include unclaimed rewards

- id: 31527
- impact: HIGH
- protocol: Tapiocadao
- reporter: Pashov Audit Group
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov Audit Group/2024-02-01-TapiocaDAO.md

## Summary


This bug report discusses a vulnerability in the YieldBox contract that allows users to steal unclaimed rewards. This can happen because the contract does not accurately account for pending rewards that are still in the GMX contract. This allows an attacker to deposit assets and obtain more shares than they should, resulting in a greater portion of unclaimed rewards when they withdraw their shares. To fix this issue, the `_currentBalance` method should be updated to include the actual pending rewards from GMX. This can be done by querying the appropriate methods on the GMX contract.

## Details

**Severity**

**Impact:** High, since users can steal unclaimed rewards

**Likelihood:** High, since this can be performed by any user and the only requirement is that there are some unclaimed rewards. The higher the number of unclaimed rewards and the larger the deposit of the user, the higher the impact. A strategy with less frequent deposits is more likely to suffer from this attack.

**Description**

When a user wants to withdraw assets they have deposited into a YieldBox, the following logic is used in the YieldBox contract:

```solidity
        uint256 totalAmount = _tokenBalanceOf(asset);
        if (share == 0) {
            // value of the share paid could be lower than the amount paid due to rounding, in that case, add a share (Always round up)
            share = amount._toShares(totalSupply[assetId], totalAmount, true);
        } else {
            // amount may be lower than the value of share due to rounding, that's ok
            amount = share._toAmount(totalSupply[assetId], totalAmount, false);
        }

        _burn(from, assetId, share);

        // Interactions
        asset.strategy.withdraw(to, amount);

```

Here we're mapping the shares owned by the user to their share of the assets in the strategy, and then burning the shares and withdrawing the corresponding number of assets from the strategy. The `deposit` flow uses a similar pattern. The `_tokenBalanceOf` method calls into the strategy, which in the `GlpStrategy` case looks like:

```solidity
function _currentBalance() internal view override returns (uint256 amount) {
        amount = sGLP.balanceOf(address(this));
        amount += pendingRewards();
    }

```

So the asset balance of the strategy is the sum of the GLP balance in the strategy and the pending rewards of the strategy, where the pending WETH rewards are exchanged to GLP based on the current exchange rate.

However, these "pending rewards" are actually not technically pending rewards since they have already been harvested from GMX, they just haven't been converted into GLP yet. As a result, the asset <-> share conversion logic in the YieldBox isn't taking into account the actual pending rewards that are still in GMX waiting to be claimed. This is a problem since it allows an attacker to steal a non-proportional amount of the unclaimed rewards for themselves by:

1. Depositing assets when there are unclaimed rewards. Since the unclaimed rewards are not accounted for, they will obtain more shares than they should. During the deposit process, the unclaimed rewards are harvested so the accounted balance will increase, but this is after the shares have been minted.
2. Now when the attacker withdraws their shares, they obtain a portion of the previously unclaimed rewards. To obtain a greater portion of the unclaimed rewards the attacker should make as large a deposit as possible vs the existing assets in the strategy.

Since this all happens atomically, the attacker could use flashloans to steal a significant portion of unclaimed rewards from the strategy.

**Recommendations**

The `_currentBalance` method should be updated to include actual pending rewards that are still locked in GMX. This would involve querying the appropriate methods on the GMX contracts.
