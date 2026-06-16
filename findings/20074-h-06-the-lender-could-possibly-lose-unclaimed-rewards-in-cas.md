---
tags:
  - lang/solidity
  - sector/dex
  - sector/farm
  - sector/lending
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/privilege-escalation/ownership-transfer
protocol: "[[Ajna Protocol]]"
auditors:
  - "[[Koolex]]"
report: "https://code4rena.com/reports/2023-05-ajna"
genome:
  - "[[reward-calculation]]"
  - "[[ownership-transfer]]"
  - "[[reward-accounting]]"
---
# [H-06] The lender could possibly lose unclaimed rewards in case a bucket goes bankrupt

- id: 20074
- impact: HIGH
- protocol: [[Ajna Protocol]]
- reporter: Koolex (Code4rena)
- source: https://code4rena.com/reports/2023-05-ajna

## Summary


A bug has been identified in the PositionManager contract when calling the `PositionManager.memorializePositions` method. This method is responsible for recording the bucket indexes along with their deposit times and LP balances, and transferring LP ownership from the lender to the PositionManager contract. In the case where a bucket has gone bankrupt after a prior memorialization, the previous tracked LP balance is zeroed out, which could lead to the lender losing unclaimed rewards. This is due to the lack of claiming rewards before the LP balance is zeroed out. 

The recommended mitigation step is to check if the lender has already claimed their rewards before zeroing out the previous tracked LP. However, this could lead to coupling the PositionManager and RewardsManager contracts, which is not desired in the reference implementation. An alternative solution could be for third parties to develop additional Position and Rewards Managers that take this recommendation into consideration.

## Details


When the lender calls `PositionManager.memorializePositions` method the following happens:

1.  Records bucket indexes along with its deposit times and lpBalances
2.  Transfers LP ownership from the lender to PositionManager contract.

In point 1, it checks if there is a previous deposit and the bucket went bankrupt after prior memorialization, then it zero out the previous tracked LP. However, the lender could still have unclaimed rewards. In this case, the lender loses the rewards due to the lack of claiming rewards before zeroing out the previous tracked LP balance. If you check claim rewards functionality in RewardsManager, the bucket being not bankrupt is not a requirement. Please note that claiming rewards relies on the tracked LP balance in PositionManager.

### Proof of Concept

*   `PositionManager.memorializePositions` method
    *   check for previous deposits and zero out the previous tracked LP if bucket is bankrupt
    ```
    	// check for previous deposits
    	if (position.depositTime != 0) {
    		// check that bucket didn't go bankrupt after prior memorialization
    		if (_bucketBankruptAfterDeposit(pool, index, position.depositTime)) {
    			// if bucket did go bankrupt, zero out the LP tracked by position manager
    			position.lps = 0;
    		}
    	}

    ```
    <https://github.com/code-423n4/2023-05-ajna/blob/main/ajna-core/src/PositionManager.sol#L192-L199>

*   In RewardsManager, check `claimRewards` and `_claimRewards`  method. there is no a check for bucket's bankruptcy.

    <https://github.com/code-423n4/2023-05-ajna/blob/main/ajna-core/src/RewardsManager.sol#L114>

    <https://github.com/code-423n4/2023-05-ajna/blob/main/ajna-core/src/RewardsManager.sol#L561>

### Recommended Mitigation Steps

On memorializePositions, check if the lender already claimed his/her rewards before zeroing out the previous tracked LP.

**[ith-harvey (Ajna) disputed](https://github.com/code-423n4/2023-05-ajna-findings/issues/329#issuecomment-1608467083)**

**[grandizzy (Ajna) commented](https://github.com/code-423n4/2023-05-ajna-findings/issues/329#issuecomment-1609466700):**
> That is by design and we acknowledge that documentation of bucket bankruptcy can be improved. When a bucket goes bankrupt (which shouldn't happen often but only when there's bad debt in pool to settle) the lender won't lose only their rewards but will also lose all the shares in that bucket / LP (which has higher impact than rewards).<br>
> Also the recommendation of:<br>
> `On memorializePositions, check if the lender already claimed his/her rewards before zeroing out the previous tracked LP.`
> 
> Would imply making position manager contract aware of rewards manager contract and we don't want to couple those 2 in reference implementation. However, additional position and rewards manager could be developed by 3rd parties and could take into consideration this recommendation.



***
