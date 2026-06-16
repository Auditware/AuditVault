---
tags:
  - lang/solidity
  - sector/lending
  - sector/perpetuals
  - sector/vault
  - platform/shieldify
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - fix/use-reentrancy-guard
  - novelty/variant
protocol: "[[Pear]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Pear-Vault-Security-Review.md"
genome:
  - "[[liquidation-logic]]"
  - "[[direct-drain]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
---
# [H-01] Forced Premature Position Liquidation Through Withdrawal Request Manipulation

- id: 65287
- impact: HIGH
- protocol: [[Pear]] Vault
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Pear-Vault-Security-Review.md

## Summary


This bug report is about a critical vulnerability in a withdrawal queue system that can be exploited by any user to force the backend system to close all trading positions. This can happen even if the user only owns a small fraction of the vault's total value. The vulnerability exists because the system only checks the number of shares owned by the user, but not the value of those shares compared to the vault's liquid capital. This means that an attacker can request a withdrawal for an amount that exceeds the vault's liquid balance, forcing the system to close trading positions to fulfill the withdrawal. This can result in losses for the vault. The affected code is located in the "PearVault.sol" file. The impact of this vulnerability is reduced effectiveness of trading strategies. The recommendation is to only allow users to request withdrawals for their own shares. The team has fixed the issue.

## Details


## Severity

High Risk

## Description
A critical vulnerability exists in the withdrawal queue system that allows any user to force the backend system to liquidate all trading positions (both spot and perpetual) by requesting withdrawals for amounts equal to or exceeding the entire vault's Total Value Locked (TVL), even when they only own a small fraction of the vault shares.

### Vulnerability Details
The `requestWithdrawal()` function only validates that the user has sufficient shares, but does not validate whether the asset value of those shares is reasonable compared to the vault's liquid capital:
```solidity
function requestWithdrawal(uint256 shares) external override nonReentrant validAmount(shares) {
    if (shares == 0) revert InvalidAmount();
    if (balanceOf(msg.sender) < shares) revert InsufficientBalance();  // ❌ Only checks shares
    if (status != VaultStatus.Active) revert VaultNotActive();

    uint256 withdrawalId = nextWithdrawalId++;
    
    withdrawalQueue[withdrawalId] = WithdrawalRequest({
        user: msg.sender,
        shares: shares,
        timestamp: block.timestamp,
        executed: false
    });

    userWithdrawalIds[msg.sender].push(withdrawalId);
    totalPendingShares += shares;  // ❌ Can represent more assets than vault liquidity
    
    emit WithdrawalQueued(msg.sender, withdrawalId, shares, block.timestamp);
}
```

The Problem: Asset Value vs Share Count
The vault's capital is distributed across multiple locations:

- Vault contract balance (liquid)
- Agent wallet balance (liquid)
- Perpetual positions on Hyperliquid (illiquid - requires position closure)
- Spot balances on Hyperliquid (semi-liquid)
- Felix vault deposits (semi-liquid)

When calculating `totalAssets()`:
```solidity
function totalAssets() public view override returns (uint256) {
    uint256 vaultAssetBalance = vaultToken().balanceOf(address(this));
    uint256 agentWalletBalance = IERC20(vaultConfig.assetToken).balanceOf(agent);
    
    if (totalSupply() == 0) {
        return vaultAssetBalance;
    }

    uint256 agentPerpValue = HyperliquidHelper.getAgentPerpValue(agent);      // ❌ Illiquid
    uint256 agentAssetSpot = HyperliquidHelper.getAgentSpotBalance(...) / 100; // ❌ Semi-liquid
    uint256 felixBalance = ...; // ❌ Semi-liquid

    return vaultAssetBalance + agentWalletBalance + agentPerpValue + agentAssetSpot + felixBalance;
}
```

**The Attack Vector:**

Let's say:
- Total vault TVL: $1,000,000
- Vault liquid balance: $50,000 (5%)
- Active trading positions: $950,000 (95% - in perp/spot positions)
- Attacker owns: 10% of shares = $100,000 worth

**Attack Execution:**

1. Attacker calls `requestWithdrawal()` for their entire 10% share balance and then calls 10 more times.
2. Backend monitoring system sees withdrawal request for $100,0000
3. Backend calculates: Liquid balance ($50,000) < Withdrawal amount ($100,0000)
4. Backend is **forced to close trading positions** worth $50,000+ to fulfill withdrawal
5. **Even if positions are currently at a loss**, they must be closed
6. Vault realizes losses that could have been recovered if positions were held

## Location of Affected Code

File: [src/PearVault.sol](https://github.com/pear-protocol/pear-vault-smartcontracts/blob/f681d7cc31ba76d521038f65e0e060849de55345/src/PearVault.sol)

## Impact
Trading strategy effectiveness is reduced by forced liquidity maintenance.

## Recommendation
Only allow them to request withdrawal for their shares.

## Team Response

Fixed.
