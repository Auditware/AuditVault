---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/staking
  - sector/gaming
  - sector/staking-pool
protocol: "[[Coinflip]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Coinflip-security-review_2025-02-19.md"
genome:
  - "[[fee-accounting]]"
  - "[[reward-accounting]]"
  - "[[arithmetic/precision-loss]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# [C-01] Pending payouts excluded from total balance cause incorrect share calculations

- id: 55502
- impact: HIGH
- protocol: Coinflip_2025-02-19
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Coinflip-security-review_2025-02-19.md

## Summary


This bug report discusses a problem with the staking protocol that can lead to overestimation of the staking balance. This occurs when a payout fails to transfer after a game is completed, causing the amount to be stored in a separate account. However, the protocol continues to include this amount in its balance calculations, leading to an inflated balance. This can have a cascading effect on the pool, causing shares to become worthless and new deposits to be immediately devalued. The report recommends introducing a variable to track pending payouts and properly accounting for them in all balance calculations. It also suggests adjusting the use of the "lockedLiquidity" variable, which represents the reserve for ongoing games, in order to prevent underestimation of shares.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

After each game completes, the protocol attempts to transfer the winner's payout through `Staking.transferPayout()`. If this transfer fails, the amount is stored in `pendingPayouts` to be claimed later. However, the contract continues to include these pending payouts in its balance calculations, which causes overestimation of the staking balance using in the calculation.

```solidity
function transferPayout(address token, address recipient, uint256 amount) external {
    --- SNIPPED 
---
    if (!callSucceeded) {
@<>     pendingPayouts[token][recipient] += amount;
        emit TransferFailed(token, recipient, amount);
        return false;
    }
    --- SNIPPED 
---
}
```

The problem is from how the contract calculates total balance. It simply uses `IERC20(token).balanceOf(address(this))` without subtracting `pendingPayouts`. This inflated balance affects several critical functions: `totalOwed()`, `lockLiquidity()`, `finalizeStake()`, and `finalizeUnstake()`.

Consider the following scenario:

1. Initial setup:

   - Alice has staked 1000 tokens (1000 shares)
   - Someone starts a game:
     - `betAmount`: 100 tokens
     - `netPayout`: 200 tokens (2:1 odds)
     - Protocol locks 200 tokens

2. The game ends, but winner's payout of 200 tokens fails to transfer:
   - Staking contract adds 200 tokens to `pendingPayouts`
   - Pool now holds 1100 tokens (original 1000 + 100 from `betAmount`)
   - 200 tokens remain locked

Now, let's analyze the apparent token owned to Alice:

- Alice's shares represent 1100 tokens (1000 shares × 1100 / 1000), but this does not account for the loss that has occurred (Alice's shares still appear to be worth 1:1)
- Winner is owed 200 tokens
- Total owed tokens: 1300 tokens, but the protocol only has 1100 tokens

For comparison, if the payout had gone through normally:

- Pool would have 900 tokens (1000 - 200(`netPayout`)+ 100(`betAmount`))
- Alice's shares would correctly represent 900 tokens for maximum owed (1000 shares × 900 / 1000)

3. This has a cascading impact on the pool:
   - Alice withdraws 900 tokens, due to liquidity locks, but the incorrect calculation still propagates the effect.
   - Alice burns 900 shares, leaving 100 shares, which resulting in token balance of 200 (1100 - 900)
   - The winner claims their 200 tokens, depleting the token balance
   - As a result, the remaining 100 shares are no longer backed by any token balance

This leaves the pool in an loss state, as shares become worthless, and any new deposits would be immediately devalued. Furthermore, Alice could request to unstake her remaining shares and wait for new deposits, essentially stealing some of their stake.

## Recommendation

Introduce a variable to track the total pending payout for each user and properly account for pending payouts in all balance calculations and validations.

Moreover, the `lockedLiquidity` is not properly used in calculations as it also represents the on-going game reserve, which has not been finalized as a loss or win. This can create an underestimate for the shares, even though the game is expected to be finalized quickly, so the `lockedLiquidity` might be treated as being equal to the sum of the pending payouts. There is also a case where the unstake is calculated during on-going games.
