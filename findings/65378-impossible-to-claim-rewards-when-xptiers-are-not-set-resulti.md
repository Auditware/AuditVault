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
  - "[[permanent]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[timestamp-dependence]]"
---
# Impossible to claim rewards when `XPTiers` are not set, resulting in permanently locked tokens once game has concluded

- id: 65378
- impact: HIGH
- protocol: [[Majority Protocol]]
- reporter: Dacian (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-27-cyfrin-majority-protocol-v2.0.md

## Summary


The bug report describes an issue with the code in a game called DefaultSession. The code enforces that the game can only set XP tiers when it is in the "Created" state. However, another function called "startAndRevealGameQuestion" can start the game without setting the XP tiers, causing problems when trying to get results and rewards based on the XP tiers. This bug has been fixed in a recent update.

## Details

**Description:** `DefaultSession::setXPTiers` enforces that XP tiers  can only be set when the game is in the Created state:

```solidity
 function setXPTiers(uint256 gameId, uint256[] memory _xpTiers) external {
        require(
            msg.sender == SessionManager(sessionManager).getCreator(gameId),
            NotGameCreator(SessionManager(sessionManager).getCreator(gameId), msg.sender)
        );
        require(_xpTiers.length >= 2, ArrayLengthMismatch());
        require(SessionManager(sessionManager).getSessionState(gameId) == SessionState.Created, GameNotCreated(gameId)); <--
---
---
        xpTiers[gameId] = _xpTiers;
        emit XpTiersUpdated(gameId, _xpTiers);
    }
```

But `SessionManager::startAndRevealGameQuestion`  will start the game without XP Tier being set, and the game will progress all the way to the final Concluded state. This will affect `SPBinaryPrompt.sol` and `TriviaChoicePrompt.sol` which are using the XP tiers to get the results:
```solidity
function getResult(uint256 gameId, uint256 questionId, address user) public view returns (Result memory) {
        SessionManager sessionManager = SessionManager(revealedQuestions[questionId].sessionManager);
        uint256 score = getScore(questionId, user);
        address sessionStrategy = sessionManager.getSessionStrategy(gameId);
        uint256[] memory xpTiers = ISessionStrategy(sessionStrategy).getXPTiers(gameId); <-
---
---
        if (score > 0) {
            return
                Result({xp: xpTiers[0] / 2 + score * xpTiers[0] / 2 / 10000, time: _getReactionTime(questionId, user)});
        } else {
            return Result({xp: xpTiers[1], time: _getReactionTime(questionId, user)});
        }
    }
```

These xp results are being used by `assertResults` but since the xp are not set the xp for user will be all zero.
```solidity
 function assertResults(
        uint256 sessionId,
        string calldata resultCid,
        address[] calldata proposedWinners,
        uint256[] calldata totalXPs, <--
---
        uint256[] calldata totalTimes
```

When user is going to claim his rewards he end up receiving zero amount because the rewards are base in the xp; note this is valid just for `ProportionalToXpReward` strategy.

**Impact:** Once the game has concluded, when the winners try to claim their rewards they will end up receiving zero amount.

**Proof of Concept:** Run this proof of concept in `test/SessionManagerEndGameTest`
```solidity
 function test_getGameEndTime_notXptiers_set() public {
        _createGame_notSession();

        vm.prank(address(this));
        FixedRanksReward(address(rewardStrategy)).setRankedRewards(1, Solarray.uint256s(10000));

        _startGame();
        _revealQuestion();
        _warpToEndTime();
        sessionManager.endGame(1);
        _concludeGame();
    }

    function _createGame_notSession() internal {
        uint256 _startTime = block.timestamp + 1 days;
        uint256 _endTime = _startTime + sessionManager.maxGameDuration() - 1 seconds;

        uint256 gameId = sessionManager.createGame({
            _startTime: _startTime,
            _endTime: _endTime,
            _ticketPrice: 10 ether,
            _creatorFee: 1000,
            _creatorFeeReceiver: address(this),
            _token: usdc,
            _promptHashes: promptHashes,
            _promptStrategies: promptStrategies,
            _sessionStrategy: sessionStrategy,
            _rewardStrategy: rewardStrategy,
            _verificationRequired: false
        });
    }

```

**Recommended Mitigation:** Same as `H-3`; don't allow the game to be started unless the xp tiers have been set.

**Majority Games:**
Fixed in commit [65727de](https://github.com/Engage-Protocol/engage-protocol/commit/65727de8b15027a8ac8b61b7203be692e60f34cb).

**Cyfrin:** Verified.
