---
tags:
  - lang/solidity
  - sector/token
  - sector/zk
  - platform/sigmaprime
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[Taiko]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/reports/taiko/review.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# Prover Payment In ERC20 Tokens Always Reverts

- id: 36001
- impact: HIGH
- protocol: [[Taiko]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/reports/taiko/review.pdf

## Summary


The bug report discusses an issue with AssignmentHooks, which are used to pay a prover's fee in a specific asset. The bug occurs when a prover chooses to be paid in an ERC20 token, as the code logic is incorrect and causes the transaction to revert. This is due to a mistake in line 116, where the sender is specified as msg.sender instead of the proposer. This results in the function reverting and causing the parent function to also revert. The report recommends correcting this mistake by changing the msg.sender to the proposer. The bug has been resolved in PR #15486, which updates the code to correctly transfer funds from the block proposer to the assigned prover.

## Details

## Description

AssignmentHooks are used to pay a prover’s fee via calling `onProposedBlock()` and transferring the specified asset from the proposer. A proposer can choose to be paid in ETH or any ERC20 token; if a prover chooses payment in an ERC20 token, then incorrect code logic causes the transaction to revert.

This revert occurs because line [116] specifies the `transferFrom()` sender as `msg.sender`, which will always be `TaikoL1.sol` due to the `onlyFromNamed("taiko")` modifier on the `onProposedBlock()` function. The intended sender is the proposer, and as a result, there will not be a balance of the ERC20 token nor approval for the transfer available at `TaikoL1.sol`, leading to the function reverting. This then forces the `TaikoL1.proposeBlock()` parent function to also revert.

```solidity
94 if (assignment.feeToken == address(0)) {
95 if (msg.value < proverFee + input.tip) {
96 revert HOOK_ASSIGNMENT_INSUFFICIENT_FEE();
97 }
98 
99 unchecked {
100 refund = msg.value - proverFee - input.tip;
101 }
102 
103 // Paying Ether
104 blk.assignedProver.sendEther(proverFee, MAX_GAS_PAYING_PROVER);
105 } else {
106 if (msg.value < input.tip) {
107 revert HOOK_ASSIGNMENT_INSUFFICIENT_FEE();
108 }
109 unchecked {
110 refund = msg.value - input.tip;
111 }
112 // Paying ERC20 tokens
113 IERC20(assignment.feeToken).transferFrom(msg.sender, blk.assignedProver, proverFee);
114 }
```

## Recommendations

Correcting the `msg.sender` on line [116] to instead be the proposer will fix this issue.

## Resolution

ERC20 payments have been updated to correctly transfer funds from the block proposer to the assigned prover. This can be seen in PR #15486.
