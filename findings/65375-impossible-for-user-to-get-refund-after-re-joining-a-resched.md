---
tags:
  - lang/solidity
  - sector/gaming
  - sector/nft
  - sector/stable
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/frozen-funds
  - novelty/variant
protocol: "[[Majority Protocol]]"
auditors:
  - "[[Dacian]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-27-cyfrin-majority-protocol-v2.0.md"
genome:
  - "[[frozen-funds]]"
  - "[[variant]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
  - "[[timestamp-dependence]]"
---
# Impossible for user to get refund after re-joining a rescheduled game which is subsequently cancelled

- id: 65375
- impact: HIGH
- protocol: [[Majority Protocol]]
- reporter: Dacian (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-27-cyfrin-majority-protocol-v2.0.md

## Summary


This bug report discusses an issue where a user is unable to receive a refund after re-joining a rescheduled game which is subsequently cancelled. The user's fee for joining the game becomes permanently locked in the `SessionManager` contract. The report includes a proof of concept code and a recommended mitigation solution. The bug has been fixed by the Majestic Games team in a recent commit and verified by the Cyfrin team.

## Details

**Description:** Impossible for user to get refund after re-joining a rescheduled game which is subsequently cancelled.

**Impact:** The user's fee for joining the game is permanently locked inside the immutable `SessionManager` contract.

**Proof of Concept:** Add the PoC to `SessionManagerLeaveGame.t.sol`:
```solidity
function test_gameRescheduled_Leave_JoinAgain_GameCancelled_UserRefundReverts() public {
    // create a game
    uint256 timeAfterRescheduling = sessionManager.minimumRescheduleTime();
    _createGame();
    uint256 rescheduleDelta = type(uint256).max - sessionManager.getStartTime(1);

    // user joins the game
    uint256 gameId = 1;
    uint256 gameFee = 10 ether;
    address user = contestants[0];
    uint256 startTime = sessionManager.getStartTime(gameId);
    vm.startPrank(user);
    TestUSDC(usdc).approve(address(sessionManager), gameFee);
    sessionManager.joinGame(gameId);
    vm.stopPrank();

    // game gets rescheduled
    sessionManager.rescheduleGame(1, startTime + rescheduleDelta);
    vm.warp(block.timestamp + timeAfterRescheduling);

    // user leaves rescheduled game
    vm.prank(user);
    sessionManager.leaveRescheduledGame(gameId);

    // user got refunded the game fee
    assertEq(TestUSDC(usdc).balanceOf(user), gameFee);
    assertEq(TestUSDC(usdc).balanceOf(address(sessionManager)), 0 ether);

    // user decides to re-join the game
    vm.startPrank(user);
    TestUSDC(usdc).approve(address(sessionManager), gameFee);
    sessionManager.joinGame(gameId);
    vm.stopPrank();

    // user decides to leave again; impossible
    vm.expectRevert(); // AlreadyRefunded(0xd52E4d00E363cB91d9051fBFDC80c292a1da630B, 1)]
    vm.prank(user);
    sessionManager.leaveRescheduledGame(gameId);

    // game is cancelled
    sessionManager.cancelGame(gameId);

    // impossible for user to get a refund!
    vm.expectRevert(); // AlreadyRefunded(0xd52E4d00E363cB91d9051fBFDC80c292a1da630B, 1)]
    vm.prank(user);
    sessionManager.refundCancelledGame(gameId);

    // user's game fee is permanently stuck in the session manager contract!
    assertEq(TestUSDC(usdc).balanceOf(user), 0);
    assertEq(TestUSDC(usdc).balanceOf(address(sessionManager)), gameFee);
}
```

**Recommended Mitigation:** In `DepositManager::_payEntryFee` add this:
```solidity
// reset user refunded status when joining the game; this allows
// users to get refunded if they rejoin a game which later gets cancelled
if(hasRefunded[gameId][player]) hasRefunded[gameId][player] = false;
```

**Majestic Games:**
Fixed in commit [3ac5654](https://github.com/Engage-Protocol/engage-protocol/commit/3ac565495df69ba8936be9d3d91a77eeb639b366) by not allowing users who have been refunded to rejoin the same game.

**Cyfrin:** Verified.
