---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/token
protocol: "[[Superform]]"
auditors:
  - "[[MiloTruck]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Superform-v2-periphery-Spearbit-Security-Review-June-2025.pdf"
genome:
  - "[[state-update]]"
  - "[[permanent]]"
  - "[[integer-bounds]]"
---
# Controller and receiver cannot redeem shares after depositing fund to if receiver address differs

- id: 63077
- impact: HIGH
- protocol: [[Superform]] v2 Periphery
- reporter: MiloTruck (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Superform-v2-periphery-Spearbit-Security-Review-June-2025.pdf

## Summary


This bug report describes a high-risk security issue in the SuperVaultStrategy contract. The problem occurs when ERC20 shares are minted to the receiver, but the `SuperVaultStrategy.state` is created for the controller instead. This means that both the receiver and controller are unable to redeem shares. The code snippet provided shows that the transaction reverts when the code subtracts `accumulatorShares` when the strategists fulfill the receiver's redeem request. Additionally, the controller is unable to create a redeem request because they have no shares to transfer to the escrow address. The recommendation is for the controller to only pay for the assets, while the receiver should receive both the ERC20 shares and the corresponding state with the cost basis. The suggested code snippet to fix this issue is to use the receiver instead of the controller in the `_handleDeposit` function.

## Details

## Security Issue Report

**Severity:** High Risk  
**Context:** SuperVaultStrategy.sol#L108-L121  

## Description
The ERC20 shares are minted to the receiver, but the `SuperVaultStrategy.state` is created (with relevant `accumulatorShares` and cost basis for shares) for the controller. 

```solidity
strategy.handleOperation(msg.sender, receiver, assets, shares, ISuperVaultStrategy.Operation.Deposit);
_mint(receiver, shares);
```

As a result, both the receiver and controller cannot redeem shares because:

- The transaction reverts when the code subtracts `accumulatorShares` when the strategists fulfill the receiver's redeem request. 

### Code Snippet
```solidity
function _calculateCostBasis(
    SuperVaultState storage state,
    uint256 requestedShares
) private returns (uint256 costBasis) {
    if (requestedShares > state.accumulatorShares) revert INSUFFICIENT_SHARES();
    // Calculate cost basis proportionally
    costBasis = requestedShares.mulDiv(state.accumulatorCostBasis, state.accumulatorShares, Math.Rounding.Floor);
    // Update user's accumulator state
    state.accumulatorShares -= requestedShares;
    state.accumulatorCostBasis -= costBasis;
    return costBasis;
}
```

- The controller cannot create a redeem request because the controller has no shares to transfer to the escrow address.

## Recommendation
The controller (`msg.sender`) should only pay for the assets, while the receiver of both ERC20 shares and the corresponding state with the cost basis should be for the receiver.

```solidity
// use receiver
_handleDeposit(receiver, assets, shares);
```
