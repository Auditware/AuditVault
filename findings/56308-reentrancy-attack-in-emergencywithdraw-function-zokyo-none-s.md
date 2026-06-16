---
tags:
  - lang/solidity
  - sector/bridge
  - platform/zokyo
  - has/github
  - severity/high
  - vuln/reentrancy/single-function
  - impact/loss-of-funds/direct-drain
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - fix/use-reentrancy-guard
  - trigger/reentrancy-callback
protocol: "[[Stargate]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-12-31-Stargate.md"
genome:
  - "[[single-function]]"
  - "[[direct-drain]]"
  - "[[known-pattern]]"
  - "[[reentrancy-guard]]"
---
# Reentrancy attack in emergencyWithdraw function

- id: 56308
- impact: HIGH
- protocol: [[Stargate]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-12-31-Stargate.md

## Summary


The emergencyWithdraw function in the LPStaking.sol contract has a bug that makes it vulnerable to a reentrancy attack. This means that an attacker can repeatedly withdraw tokens before the user's balance is updated to zero, causing a loss of funds. The function also does not check if the contract is in an emergency state before allowing users to withdraw tokens. To fix this, it is recommended to enable/disable the function based on the contract's status and to update the user's balance to zero before sending out tokens. This issue has been fixed in a re-audit.

## Details

**Description**


During the manual audit, we found that the emergencyWithdraw function in the contract
LPStaking.sol is prone to reentrancy attack as the contract makes tokens transfer before
updating the user's balance to zero(0). Also, this function also does not make any checks to
see if the status of the contract is in an emergency before it can be called by users to
withdraw tokens.

**Recommendation**:

Enable/disable the emergencyWithdraw function if the contract is in emergency status. Also for
a fix, we suggest reading and assigning users’ balance in a temporal variable, then resetting
the user’s balance to zero(0) before tokens are sent out using the temporal variable as the
sending amount.

**Re-audit**:
Fixed.
