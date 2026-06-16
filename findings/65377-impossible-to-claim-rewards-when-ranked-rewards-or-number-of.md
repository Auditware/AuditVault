---
tags:
  - lang/solidity
  - sector/gaming
  - sector/nft
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
  - "[[permanent]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[reward-accounting]]"
---
# Impossible to claim rewards when ranked rewards or number of winners are not set, resulting in permanently locked tokens once game has concluded

- id: 65377
- impact: HIGH
- protocol: [[Majority Protocol]]
- reporter: Dacian (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-27-cyfrin-majority-protocol-v2.0.md

## Summary


The bug report describes an issue with the `FixedRanksReward` and `ProportionalToXPReward` functions in the `SessionManager` contract. These functions enforce that rewards can only be set when the game is in the `Created` state. However, the `startAndRevealGameQuestion` function can start the game without setting these rewards, leading to a situation where players cannot claim their rewards once the game is concluded. A Proof of Concept is provided to demonstrate this issue and a recommended mitigation is suggested to prevent it from happening in the future. The bug has been fixed in the Majority Games contract.

## Details

**Description:** `FixedRanksReward::setRankedRewards` enforces that ranked rewards can only be set when the game is in the `Created` state:
```solidity
    function setRankedRewards(uint256 sessionId, uint256[] calldata _rankedRewards) external {
        require(sessionManager.getSessionState(sessionId) == SessionState.Created, NotCreated(sessionId));
```

The same is also true for `ProportionalToXPReward::setNumberOfWinners`.

But `SessionManager::startAndRevealGameQuestion` will happily start the game without ranked rewards / number of winners being set, and the game will progress all the way to the final `Concluded` state, giving the appearance that everything is OK.

**Impact:** Once the game has concluded, when the winners try to claim their rewards this will revert with `RankedRewardsNotSet` or `NumberOfWinnersMismatch`. There is no way to claim the rewards and because the game is in the `Concluded` state it can't be cancelled - the tokens are permanently locked in the contract.

**Proof of Concept:** Add the PoC to `SessionManagerEndGame.t.sol`:
```solidity
function test_setRankedRewardsNotCalled_gameStarted_gameConcludes_cantClaimRewards() public {
    _createGame();

    _startGame();
    _revealQuestion();
    _warpToEndTime();
    sessionManager.endGame(1);
    _concludeGame();

    vm.expectRevert(); // RankedRewardsNotSet(1)
    vm.prank(contestants[0]);
    sessionManager.claimRewards(1, 0);
}
```

**Recommended Mitigation:** Don't allow the game to be started unless ranked rewards / number of winners have been set. Ideally:
* the `IRewardStrategy` interface would have an external function `rewardsConfigured` which returns `true` if its rewards mechanism has been configured and `false` otherwise
* `FixedRanksReward` and `ProportionalToXPReward` would both implement `rewardsConfigured` checking whether their internal reward implementations have been correctly configured
* `SessionManager::startAndRevealGameQuestion` would call `rewardsConfigured` on its reward strategy and revert if it returned `false`

**Majority Games:**
Fixed in commits [a2e353e](https://github.com/Engage-Protocol/engage-protocol/commit/a2e353e664f7707d49a3ca9ca2bea792d731711c), [96d5fbe](https://github.com/Engage-Protocol/engage-protocol/commit/96d5fbe3132bbbecb509c8ca90cc785587da5e61).

**Cyfrin:** Verified.
