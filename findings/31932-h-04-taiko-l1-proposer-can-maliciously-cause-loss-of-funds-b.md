---
tags:
  - lang/solidity
  - sector/governance
  - sector/token
  - sector/zk
  - platform/code4rena
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Taiko]]"
auditors:
  - "[[MrPotatoMagic]]"
report: "https://code4rena.com/reports/2024-03-taiko"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# [H-04] [[Taiko]] L1 - Proposer can maliciously cause loss of funds by forcing someone else to pay prover's fee

- id: 31932
- impact: HIGH
- protocol: Taiko
- reporter: MrPotatoMagic (Code4rena)
- source: https://code4rena.com/reports/2024-03-taiko

## Summary


This bug report discusses an issue in the code for the Taiko project. In the function proposeBlock, there is a block of code that sets the params.coinbase variable to the msg.sender if it is empty. However, during the proposal process, hooks can be called and the onBlockProposed function can be used to pay the assigned prover their fee. In this function, the payee is set to the variable \_meta.coinbase, which can be set by the proposer to any arbitrary address. This can lead to a scenario where a proposer is forced to pay fees for block proposals by other actors. The recommended mitigation step is to ensure that the block proposer will always be the msg.sender. The bug has been confirmed and fixed by the project team.

## Details


<https://github.com/code-423n4/2024-03-taiko/blob/0d081a40e0b9637eddf8e760fabbecc250f23599/packages/protocol/contracts/L1/hooks/AssignmentHook.sol#L113-L116> 

<https://github.com/code-423n4/2024-03-taiko/blob/0d081a40e0b9637eddf8e760fabbecc250f23599/packages/protocol/contracts/L1/libs/LibProposing.sol#L85-L87> 

<https://github.com/code-423n4/2024-03-taiko/blob/0d081a40e0b9637eddf8e760fabbecc250f23599/packages/protocol/contracts/L1/libs/LibProposing.sol#L249-L255>

Proposal of new blocks triggers a call to proposeBlock in the libProposing library. In that function, there is this the following block of code:

            if (params.coinbase == address(0)) {
            params.coinbase = msg.sender;
        }

This sets the params.coinbase variable set by the caller of the function to be the msg.sender if it was empty.

As part of the process of proposal, hooks can be called of type AssignmentHook. An assignment hook's onBlockProposed will be triggered as follows:

                    // When a hook is called, all ether in this contract will be send to the hook.
                // If the ether sent to the hook is not used entirely, the hook shall send the Ether
                // back to this contract for the next hook to use.
                // Proposers shall choose use extra hooks wisely.
                IHook(params.hookCalls[i].hook).onBlockProposed{ value: address(this).balance }(
                    blk, meta_, params.hookCalls[i].data
                );

Notice how the meta data is passed to this function. Part of the function of the onBlockProposed is to pay the assigned prover their fee and the payee should be the current proposer of the block. this is done as follows:

            // The proposer irrevocably pays a fee to the assigned prover, either in
        // Ether or ERC20 tokens.
        if (assignment.feeToken == address(0)) {
            // Paying Ether
            _blk.assignedProver.sendEther(proverFee, MAX_GAS_PAYING_PROVER);
        } else {
            // Paying ERC20 tokens
            IERC20(assignment.feeToken).safeTransferFrom(
                _meta.coinbase, _blk.assignedProver, proverFee
            );
        }

Notice how if the payment is in ERC20 tokens, the payee will be the variable  \_meta.coinbase, and like we showed earlier, this can be set to any arbitrary address by the proposer. This can lead to a scenario as such:

1.  proposer A approves the assignmentHook contract to spend a portion of their tokens, the allowance is set higher than the actual fee they will be paying.
2.  proposer A proposes a block, and a fee is charged and payed to the assigned prover, but there remains allowance that the assignment hook contract can still use.
3.  proposer B proposes a block and sets params.coinbase as the the address of proposer A.
4.  proposer A address will be the payee of the fee for the assigned prover for the block proposed by proposer B.

The scenario above describes how someone can be forced maliciously to pay fees for block proposals by other actors.

### Recommended Mitigation Steps

A simple fix to this to ensure the block proposer will always be the msg.sender, as such:

        if (params.coinbase == address(0 || params.coinbase != msg.sender)) {
            params.coinbase = msg.sender;
        }

**[dantaik (Taiko) confirmed and commented](https://github.com/code-423n4/2024-03-taiko-findings/issues/163#issuecomment-2032257802):**
 > This is a valid bug report. It has been fixed here: https://github.com/taikoxyz/taiko-mono/pull/16327

***
