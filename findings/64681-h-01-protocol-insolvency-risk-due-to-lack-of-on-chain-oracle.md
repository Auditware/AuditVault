---
tags:
  - lang/solidity
  - sector/lending
  - sector/oracle
  - sector/rwa
  - sector/stable
  - sector/uncollat-lending
  - platform/shieldify
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/liquidation-logic
  - fix/use-reentrancy-guard
  - novelty/variant
  - misassumption/math-is-safe
  - fix/redesign-logic
protocol: "[[Shiny]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Shiny-Security-Review.md"
genome:
  - "[[liquidation-logic]]"
  - "[[liquidation-manipulation]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[debt-accrual-update]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
  - "[[treasury-multisig]]"
---
# [H-01] Protocol Insolvency Risk Due to Lack of On-Chain Oracle

- id: 64681
- impact: HIGH
- protocol: [[Shiny]]
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Shiny-Security-Review.md

## Summary


The bug report identifies a high-risk issue in a protocol that could lead to insolvency and bad debt. The protocol relies on an off-chain `backendSigner` to determine the loan amount without any on-chain verification, which can result in undercollateralization. Additionally, liquidation is only possible after a time-based deadline, which could lead to losses in volatile markets. The affected code is located in the `Pawn.sol` file. The impact of this bug includes protocol insolvency, systemic bad debt, and limited mitigation options. A proof of concept is presented, and recommendations are made to address the issue, including enforcing on-chain verification of collateral value, implementing health-factor-based liquidation, or reducing trust in the backend signer. The team has acknowledged the report.

## Details


## Severity

High Risk

## Description

The protocol’s solvency relies on an off-chain `backendSigner` to determine the loan principal (`offerAmount`) without any on-chain verification of collateral value or an on-chain “unhealthy position” liquidation path. As a result, the protocol can become undercollateralized during the loan term (or even at origination if the signed offer is incorrect), while liquidation is only possible after a time-based deadline.

In volatile markets, this design can systematically create bad debt and drain protocol reserves.

### Technical Details

1. `offerAmount` is trusted without on-chain valuation checks

`Pawn.pawn()` accepts `offerAmount` from a signature and stores it as the pawn principal. There is no on-chain mechanism to validate that the loan-to-value (LTV) is within safe limits at the time of origination. Protocol takes care of it off-chain.

File: [Pawn.sol](https://github.com/ShinyUrban/SmartContracts/blob/f49b5db73b297552666783ed587cf0818ef86b75/Pawn.sol)

```solidity
function pawn(uint256 tokenId, uint8 durationDays, uint256 offerAmount, uint256 validUntil, bytes calldata pawnSignature, bytes calldata treasurySignature) external nonReentrant whenNotPaused {
    // code
    (bytes32 digest, uint256 currentNonce) = _validatePawnSignature(
        tokenId,
        offerAmount,
        validUntil,
        pawnSignature
    );
    // code
    pawns[tokenId] = Pawn({
        borrower: msg.sender,
        amount: offerAmount,
        deadline: deadline,
        feeBasisPoints: fee,
        active: true
    });
    // code
}
```

2. Liquidation is strictly time-based (no health-factor liquidation)

`Pawn.liquidate()` can only be executed after the pawn deadline. Even if the collateral value collapses during the term, the protocol cannot liquidate early to preserve solvency.

```solidity
function liquidate(uint256 tokenId) external nonReentrant whenNotPaused onlyRole(MANAGER_ROLE) {
    Pawn memory pawning = pawns[tokenId];
    if (!pawning.active) revert TokenNotPawned();

    // Liquidation is only possible after the time-based deadline
    if (block.timestamp < pawning.deadline) revert DeadlineNotPassed();

    pawns[tokenId].active = false;

    IERC721Burnable(address(nftToken)).burn(tokenId);
    emit TokenLiquidated(tokenId, msg.sender);
}
```

## Location of Affected Code

File: [Pawn.sol](https://github.com/ShinyUrban/SmartContracts/blob/f49b5db73b297552666783ed587cf0818ef86b75/Pawn.sol)

## Impact

If the collateral value drops below the loan principal during the loan term, rational borrowers are incentivized to default. The protocol then realizes a loss equal to:

`Bad Debt = (Principal + Accrued Fees) - Collateral Value at recovery`

Practical consequences:

- **Protocol insolvency / reserve depletion:** USDC can be paid out against collateral that later becomes insufficient.
- **Systemic bad debt:** The issue is not limited to one position; it is a structural failure mode whenever the signed `offerAmount` exceeds safe LTV or market prices fall during the term.
- **Limited mitigation after the fact:** Because liquidation burns the token (claiming the underlying asset), the protocol is effectively forced to “take delivery” at an unfavourable valuation, crystallising losses.

## Proof of Concept

1. An RWA token represents a physical gold bar worth 2,000 USDC.
2. The backend signs a loan offer for 1,800 USDC (90% LTV) due to error, stale pricing, or sudden market movement.
3. The next day, gold drops 20% and the collateral value becomes 1,600 USDC.
4. The protocol cannot liquidate because `block.timestamp < deadline`.
5. The borrower rationally defaults because repayment exceeds collateral value.
6. At `deadline`, the protocol liquidates and ends up recovering an asset worth ~1,600 USDC after having lent 1,800 USDC (excluding fees).
7. Net loss is ~200 USDC (plus any additional loss due to fees/realization costs).

## Recommendations

### A) Enforce origination LTV on-chain

Integrate an on-chain pricing source for the underlying collateral and enforce a maximum LTV at pawn creation.

```solidity
uint256 collateralValue = oracle.getPrice(tokenId); // must define units + decimals
require(offerAmount <= (collateralValue * MAX_LTV_BPS) / 10_000, "LTV too high");
```

Minimum requirements for a robust Oracle integration:

- Staleness checks (e.g., revert if price is older than a configured threshold).
- Consistent units/decimals normalization.
- Clear fallback behavior when the oracle is unavailable.

### B) Add health-factor-based liquidation during the term

Implement a liquidation condition that triggers when the position becomes undercollateralized (e.g., collateral value falls below a liquidation threshold). This can allow liquidation before the `deadline` and materially reduce bad debt.

### C) If an oracle is not feasible, reduce trust in the backend signer

If on-chain pricing is not currently possible, consider compensating controls (still weaker than an oracle), such as:

- Very conservative LTV caps hard-coded on-chain per asset class.
- Shorter maximum loan durations.
- Emergency controls to halt new pawns when pricing is uncertain.

## Team Response

Acknowledged.
