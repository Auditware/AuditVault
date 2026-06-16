---
tags:
  - lang/solidity
  - sector/governance
  - sector/token
  - sector/zk
  - platform/sigmaprime
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - novelty/variant
protocol: "[[Taiko]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/reports/taiko/review.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# AssignmentHooks May Drain Prover TKO When Calling proposeBlock()

- id: 35999
- impact: HIGH
- protocol: [[Taiko]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/reports/taiko/review.pdf

## Summary


This bug report describes a vulnerability in the TaikoL1 contract, which allows a malicious user to repeatedly call the AssignmentHook.onProposedBlock() function and drain all the TKO funds from the assigned prover. This is possible because there is no check to prevent the same assignment hook from being called multiple times for a single block proposal. This can be considered a grieﬁng attack, as the attacker does not gain funds but causes the prover to lose more funds than the cost to the attacker. To mitigate this vulnerability, the report recommends comparing assignment hook addresses and enforcing a strict equality on the amount of TKO tokens transferred to TaikoL1. The issue has been resolved by preventing multiple calls to the same hook and enforcing the strict equality check. 

## Details

## Description

AssignmentHooks are used to transfer the livenessBond from the assigned prover by calling `AssignmentHook.onProposedBlock()`. However, there is nothing to prevent calling the same assignment hook repeatedly for a single block proposal. As a result, it is possible to drain the entire approval of TKO funds from the assigned prover.

The issue occurs because each ProverAssignment contains a signature that is used to confirm the prover's acceptance of a block; however, nothing is done to invalidate future uses of the same signature, allowing the signature to be repeatedly used for a single proposal.

Each time the `assignmentHook` is called, the signature is validated, and TKO tokens are transferred from the prover to the `TaikoL1` contract. There is an inequality on line [257] in the following snippet, which allows more TKO than required to be transferred from the hooks.

```solidity
235 IERC20 tko = IERC20(resolver.resolve("taiko_token", false));
uint256 tkoBalance = tko.balanceOf(address(this));
237
// Run all hooks.
239 // Note that address(this).balance has been updated with msg.value,
// prior to any code in this function has been executed.
241 for (uint256 i; i < params.hookCalls.length; ++i) {
// When a hook is called, all ether in this contract will be sent to the hook.
243 // If the ether sent to the hook is not used entirely, the hook shall send the Ether
// back to this contract for the next hook to use.
245 // Proposers shall choose to use extra hooks wisely.
IHook(params.hookCalls[i].hook).onBlockProposed{ value: address(this).balance }(
247 blk, meta, params.hookCalls[i].data
);
249 }
// Refund Ether
251 if (address(this).balance != 0) {
msg.sender.sendEther(address(this).balance);
253 }
255 // Check that after hooks, the Taiko Token balance of this contract
// has increased by at least config.livenessBond
257 if (tko.balanceOf(address(this)) < tkoBalance + config.livenessBond) { //@audit inequality allows excess transfer
revert L1_LIVENESS_BOND_NOT_RECEIVED();
259 }
```

The malicious proposer is required to pay the prover’s ETH/ERC20 fee each time they call `assignmentHook.onProposedBlock()`. Hence, this attack can be considered a griefing attack since the attacker does not gain funds but will cause the prover to lose more funds than the cost to the attacker. This assumes the liveness bond is significantly more than the prover fee.

## Recommendations

The vulnerability should be mitigated in multiple ways:

- Compare assignmentHook addresses in `proposeBlock()` and revert if any are the same.
- Make the balance transfer check a strict equality on line [257]; the call should only succeed if exactly the `livenessBond` is received by `TaikoL1`.
- Include a nonce in each prover signature and increment it after each signature check in `AssignmentHook.onBlockProposal()` to prevent signature reuse.

## Resolution

A resolution has been implemented in two parts:

1. Prevent a hook from being called multiple times in `LibProposing`. This can be seen in PR #15492.
2. Enforce a strict equality on the amount of TKO tokens sent to `TaikoL1`, stopping the potential for over-payments in a prover assignment. This can be seen in PR #15486.
