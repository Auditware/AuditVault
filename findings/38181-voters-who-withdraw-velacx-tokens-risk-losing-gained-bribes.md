---
tags:
  - lang/solidity
  - sector/governance
  - platform/immunefi
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/frozen-funds
  - novelty/variant
protocol: "[[Alchemix]]"
auditors:
  - "[[xBentley]]"
genome:
  - "[[frozen-funds]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[account-ownership]]"
  - "[[dos-resistance]]"
---
# Voters who withdraw veLACX tokens risk losing gained bribes rewards

- id: 38181
- impact: HIGH
- protocol: [[Alchemix]]
- reporter: xBentley (Immunefi)
- source: N/A

## Summary


This bug report is about a problem with a smart contract on GitHub. The contract in question is called Voter.sol and it has a vulnerability that could lead to permanent loss of rewards for voters. The issue occurs when voters withdraw their veLACX tokens without first claiming their bribe rewards. This is because the withdraw function does not automatically send the rewards. The vulnerability lies in the fact that the withdraw function burns the token, making it impossible for the owner to claim any bribe rewards. This could result in the permanent loss of rewards for veLACX token owners. A proof of concept has been provided to demonstrate this issue.

## Details

Report type: Smart Contract


Target: https://github.com/alchemix-finance/alchemix-v2-dao/blob/main/src/Voter.sol

Impacts:
- Permanent freezing of unclaimed yield

## Description
## Brief/Intro
Voters who withdraw their veLACX tokens without first claiming bribe rewards will permanently lose their rewards since the withdraw function does not automatically send the rewards.

## Vulnerability Details
When withdrawing veLACX tokens, token owners have to complete at least 3 steps:

(i) Call src/Voter.sol::reset(uint256 _tokenId) if they've voted
(ii) Call src/VoterEscrow.sol::startCooldown(uint256 _tokenId)
(iii) Wait for cooldown period to end
(iv) Call src/VoterEscrow.sol::withdraw(uint256 _tokenId)

The withdraw function burns the tokenId effectively handing over ownership to the address(0) as can be seen from this function:

```solidity
/**
     * @notice Remove a token from a given address
     * @dev Throws if `_from` is not the current owner.
     */
    function _removeTokenFrom(address _from, uint256 _tokenId) internal {
        // Throws if `_from` is not the current owner
        require(idToOwner[_tokenId] == _from);
        // Change the owner
        idToOwner[_tokenId] = address(0);
        // Update owner token index tracking
        _removeTokenFromOwnerList(_from, _tokenId);
        // Change count tracking
        ownerToTokenCount[_from] -= 1;
    }
```

Once this is set, it becomes impossible for the owner of the token to claim any bribe rewards since  src/Voter.sol::claimBribes requires that the caller be owner or a permitted account:

```solidity
/// @inheritdoc IVoter
    function claimBribes(address[] memory _bribes, address[][] memory _tokens, uint256 _tokenId) external {
        require(IVotingEscrow(veALCX).isApprovedOrOwner(msg.sender, _tokenId));

        for (uint256 i = 0; i < _bribes.length; i++) {
            IBribe(_bribes[i]).getRewardForOwner(_tokenId, _tokens[i]);
        }
    }
```
Therefore, calling withdraw in order to close the token position before claiming bribe rewards will therefore permanently lock the rewards. 

## Impact Details
veALCX token owners risk permanently locking bribe rewards.

## References
https://github.com/alchemix-finance/alchemix-v2-dao/blob/f1007439ad3a32e412468c4c42f62f676822dc1f/src/VotingEscrow.sol#L851



## Proof of Concept
Add this test to src/test/VotingEscrow.t.sol:

```solidity
// Withdraw enabled after lock expires
    function testWithdrawLostBribeRewards() public {
        hevm.prank(admin);
        
        uint256 tokenId = veALCX.createLock(TOKEN_1, THREE_WEEKS, false);

        address bribeAddress = voter.bribes(address(sushiGauge));

        // Add BAL bribes to sushiGauge
        createThirdPartyBribe(bribeAddress, bal, TOKEN_100K);

        uint256 balanceStart = IERC20(bal).balanceOf(bribeAddress);

        address[] memory pools = new address[](1);
        pools[0] = sushiPoolAddress;
        uint256[] memory weights = new uint256[](1);
        weights[0] = 5000;

        address[] memory bribes = new address[](1);
        bribes[0] = address(bribeAddress);
        address[][] memory tokens = new address[][](2);
        tokens[0] = new address[](1);
        tokens[0][0] = bal;
        hevm.startPrank(admin);
        voter.vote(tokenId, pools, weights, 0);
        
        uint256 earnedBribes1 = IBribe(bribeAddress).earned(bal, tokenId);
        console.log(earnedBribes1);
        console.log(IERC20(bal).balanceOf(admin));
        hevm.warp(newEpoch());
        voter.distribute();
        voter.reset(tokenId);
        veALCX.startCooldown(tokenId);

        hevm.warp(newEpoch());

        veALCX.withdraw(tokenId);
        earnedBribes1 = IBribe(bribeAddress).earned(bal, tokenId);
        assertGt(earnedBribes1,0);
        assertEq(IERC20(bal).balanceOf(admin),0);
        hevm.expectRevert();
        voter.claimBribes(bribes, tokens,tokenId);
    }
```
