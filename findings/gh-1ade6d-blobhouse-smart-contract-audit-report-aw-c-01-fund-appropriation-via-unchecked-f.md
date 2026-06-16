---
tags:
  - blockchain/evm
  - lang/solidity
  - sector/gaming
  - sector/lending
  - sector/options
  - platform/auditware
  - severity/high
  - vuln/dos/griefing
  - fix/use-reentrancy-guard
  - novelty/variant
protocol: "[[Blobhouse]]"
auditors:
  - "[[Auditware]]"
genome:
  - "[[griefing]]"
  - "[[direct-drain]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[reentrancy-guard]]"
---
# **AW-C-01: Fund Appropriation via Unchecked Forfeit Winner** {#aw-c-01:-fund-appropriation-via-unchecked-forfeit-winner}

**Severity:** *Critical*								**Status:** *Resolved*

**Retest:**  
During the retest, this issue was found to be mitigated by the new revealIndividual() function ([/src/Arena.sol\#L130](https://github.com/numbergroup/blobhouse-contracts/blob/1457a8a00221a10a8cf32b1a8a585133720ff6d2/src/Arena.sol#L130)), which allows players to individually reveal. The revealed flag is then checked in the forfeit function to ensure that an honest player cannot be griefed, any attacker that withholds their reveal will be the only allowed loser of a forfeit.

**Locations:**

* [src/Arena.sol\#L199-L221](https://github.com/numbergroup/blobhouse-contracts/blob/bd91d53c8f26590cee10092c4c3ef7bb02c4c3b4/src/Arena.sol#L199-L221) 

**Description:**  
The **forfeitUnrevealed** function lacks proper validation of the game winner when the opponent’s commit has been revealed, allowing a player that would normally lose to claim the funds via forfeit of the opponent. The losing player can delay their commit reveal until the game window passes to DOS finalization within the reveal deadline, then call the **fortfeitUnrevealed** function, declaring themselves the winner. There is no validation that the declared loser has not indeed revealed in time and should thus be subject to forfeit.

The forfeit mechanism allows either player to call **forfeitUnrevealed**, specifying themselves as the winner, as long as they provide their valid commit proof.

function forfeitUnrevealed(address winner, address loser, WeaponType\[3\] calldata winnerWeapons, bytes32 winnerSalt)  
   external  
   nonReentrant  
{  
   // MISSING: Validation that declared loser has not revealed  
   \_validateCommit(winner, winnerWeapons, winnerSalt, entryW.commitHash);  
   \_distributePayout(winner, pot);  
}

While the **\_validateCommit** function provides validation by including the player address, contract address, and chain ID in the commit hash verification, preventing attackers from guessing or brute-forcing secrets to directly impersonate winners, when legitimate players attempt to finalize games by revealing their moves, their opponent could refuse to finalize the game, allowing them to claim the funds via forfeit.  

**Recommendation:**

* Allow players to independently reveal their commits on-chain, so that a check that the declared loser of the forfeit function has not submitted their commit reveal could be added:  
  // MISSING: Validation that declared loser has not revealed  
  if (entryL.revealed) revert("LoserAlreadyRevealed");  
    
* Alternative solution: Implement a challenge period where the declared "loser" can dispute illegitimate forfeits
