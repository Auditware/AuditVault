---
tags:
  - lang/solidity
  - sector/token
  - platform/spearbit
  - has/github
  - severity/high
  - vuln/logic/fee-calculation
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Superform]]"
auditors:
  - "[[MiloTruck]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Superform-v2-periphery-Spearbit-Security-Review-June-2025.pdf"
genome:
  - "[[fee-calculation]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
---
# Malicious actor can overwrite other's user state via 1 wei vault share transfer to steal fund

- id: 63075
- impact: HIGH
- protocol: [[Superform]] v2 Periphery
- reporter: MiloTruck (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Superform-v2-periphery-Spearbit-Security-Review-June-2025.pdf

## Summary


This bug report discusses a critical risk in the code for the SuperVault contract. The issue occurs when transferring shares between two accounts, as the code copies the entire state from one account to the other. This state includes important information such as redeem requests and share prices. This allows for potential exploits where users can clone and double withdraw funds or overwrite another user's state, resulting in loss of funds. 

The recommendation is to separate the SuperVault state into two parts: SuperVaultSharesState and SuperVaultRedeemState. The first state will track the average cost basis for a user's total shares, while the second state will handle redeem requests. This will ensure that transferring shares only affects the first state and does not overwrite any important information. 

## Details

## Critical Risk Assessment

## Severity
**Critical Risk**

## Context
`SuperVault.sol#L509-L515`

## Description
When transferring SuperVault shares, the code copies the entire state from the "from" account to the "to" account.

```solidity
// called like this in _update
ISuperVaultStrategy.SuperVaultState memory state = strategy.getSuperVaultState(from);
strategy.updateSuperVaultState(to, state);
```

The state contains redeem information and share price data.

```solidity
struct SuperVaultState {
    uint256 pendingRedeemRequest; // Shares requested
    uint256 maxWithdraw; // Assets claimable after fulfillment
    uint256 averageRequestPPS; // Average PPS at the time of redeem request
    // Accumulators needed for fee calculation on redeem
    uint256 accumulatorShares;
    uint256 accumulatorCostBasis;
    uint256 averageWithdrawPrice; // Average price for claimable assets
}
```

Then the code allows the exploits below.

### Scenario 1:
1. Alice creates account 1 and account 2.
2. Alice has a fulfilled claim request; Alice deposits some assets to get 1 unit of share in account 1.
3. Alice transfers the share to account 2 to clone the fulfillment request and double withdraw.

### Scenario 2:
1. Bob has a fulfillment state.
2. Alice deposits some assets to get 1 unit of shares.
3. Alice transfers the share to Bob, and Bob's state gets his entire state overwritten.

Both scenarios lead to loss of funds.

## Recommendation
Consider separating the `SuperVaultState` into:

1. **SuperVaultSharesState**: Keep track of the average cost basis for a user's total shares. The code can track the `accumulatorCostBasis`. To compute averages correctly, the code also needs to store the baseline (`accumulatorShares`).
   
2. **SuperVaultRedeemState**: A `requestRedeem` call can convert the ERC20 shares at the user's current cost basis into a state that gets modified via cancel/fulfill/claim (converted to `pendingRedeemShares`, `pendingCostBasis`).

Transferring shares should only affect the first state, updating the cost basis of the receiver as the average of their old position and the transferred shares at the `avgCostBasisPerShare` of the "from".

Reduce the `SuperVaultSharesState` of the "from" account by the transferred shares while keeping the cost basis per share the same.
