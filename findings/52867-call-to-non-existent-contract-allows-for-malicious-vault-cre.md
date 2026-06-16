---
tags:
  - lang/solidity
  - sector/dex
  - sector/staking
  - sector/token
  - platform/spearbit
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Berachain]]"
auditors:
  - "[[Kaden]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Berachain-Pol-Spearbit-Security-Review-October-2024.pdf"
genome:
  - "[[unchecked-return-value]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
  - "[[reward-accounting]]"
---
# Call to non-existent contract allows for malicious vault creation

- id: 52867
- impact: HIGH
- protocol: [[Berachain Pol]]
- reporter: Kaden (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Berachain-Pol-Spearbit-Security-Review-October-2024.pdf

## Summary


The report describes a bug in the StakingRewards.sol code, which could potentially allow a malicious actor to create a vault and obtain an unfair number of shares. This is due to the fact that the stakingToken is not confirmed to be a contract, and the use of Solady's safeTransfer function, which does not perform a contract check. This could allow the attacker to stake tokens and silently fail, while still updating the totalSupply and account balances. 

The bug can be exploited by anticipating the token address before deployment, which is possible with tokens such as DEX pool pairs. This could also prevent a legitimate staking token from being used. 

The recommendation is to confirm that the token contract exists and revert the vault initialization if it fails. This can be done by checking the token's address code length, similar to how OpenZeppelin does it in their safeTransfer function. 

The bug has been fixed in the Berachain and Spearbit commits, by implementing the auditor's recommendation. For more information, visit the provided link.

## Details

Severity: High Risk
Context: StakingRewards.sol#L84
Description: The stakingToken for new vaults is never confirmed to be a contract. Combined with the use of
Solady's safeTransfer, which does not perform a contract check, a malicious actor may create a vault and obtain
an unfair number of shares.
Scenario:
• stakingToken address is calculated but not deployed.
• A vault is created through the factory.
• The malicious actor may stake any amount of tokens, the transfer attempt via safeTransferFrom will silently
fail but the totalSupply and _accountInfo[account].balance will be both updated.
• Deploy the stakingToken .
• All future stakes will be entitled to a reduced share of both rewards and deposited stakingTokens .
It's important to note that this allows an attacker to withdraw stakingTokens of others without having deposited
any.
The feasibility of anticipating a token address before deployment is simple when considering tokens such as DEX
pool pairs.
Exacerbating this problem, even if the malicious behavior is noticed during the whitelisting process, it would prevent
a legitimate staking token from ever being used.
Recommendation: Confirm token contract exists and revert vault initialization in failure. Example below mirrors
the contract check OpenZeppelin uses in their safeTransfer:
if (address(token).code.length == 0) {
revert NotAContract();
}
For more information see: github.com/kadenzipfel/smart-contract-vulnerabilities.
Berachain: Fixed in commit 534a0eba.
Spearbit: Fixed by implementing the auditor's recommendation.
