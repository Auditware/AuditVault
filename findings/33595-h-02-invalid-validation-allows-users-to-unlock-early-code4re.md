---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/nft
protocol: "[[Munchables]]"
auditors:
  - "[[leegh]]"
report: "https://code4rena.com/reports/2024-05-munchables"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[timestamp-dependence]]"
---
# [H-02] Invalid validation allows users to unlock early

- id: 33595
- impact: HIGH
- protocol: [[Munchables]]
- reporter: leegh (Code4rena)
- source: https://code4rena.com/reports/2024-05-munchables

## Summary


The bug report describes a problem with the `setLockDuration` function in the `LockManager.sol` contract. This function allows users to set the duration of their token lock, but it has a flaw that allows them to reduce their lock time or even unlock their tokens instantly. This can be exploited by changing the lock duration multiple times, resulting in an incorrect unlock time. This issue has been confirmed and fixed by the developers, and it has been rated as a high-risk vulnerability. 

## Details


### Lines of code
<https://github.com/code-423n4/2024-05-munchables/blob/main/src/managers/LockManager.sol#L257-L258><br><https://github.com/code-423n4/2024-05-munchables/blob/main/src/managers/LockManager.sol#L265-L267>

### Impact

Invalid validation in the `setLockDuration` function allows users to greatly reduce their unlock time or even unlock instantly.

### Proof of Concept

When a user locks his tokens in the `LockManager.sol` contract, the `unlockTime` is calculated as `block.timestamp + lockDuration`.

```solidity
    function _lock(
        address _tokenContract,
        uint256 _quantity,
        address _tokenOwner,
        address _lockRecipient
    ) private {
        ---SNIP
---

        lockedToken.remainder = remainder;
        lockedToken.quantity += _quantity;
        lockedToken.lastLockTime = uint32(block.timestamp);
>>      lockedToken.unlockTime =
            uint32(block.timestamp) +
            uint32(_lockDuration);
```

The `lockDuration` is a variable that can be configured by a user in the `setLockDuration` function anytime, even during the lock period.

```solidity
    function setLockDuration(uint256 _duration) external notPaused {
        if (_duration > configStorage.getUint(StorageKey.MaxLockDuration))
            revert MaximumLockDurationError();

        playerSettings[msg.sender].lockDuration = uint32(_duration);
        ---SNIP
---
```

The problem arises when existing locks are updated to the new duration.

```solidity
        // update any existing lock
        uint256 configuredTokensLength = configuredTokenContracts.length;
        for (uint256 i; i < configuredTokensLength; i++) {
            address tokenContract = configuredTokenContracts[i];
            if (lockedTokens[msg.sender][tokenContract].quantity > 0) {
                // check they are not setting lock time before current unlocktime
>>              if (
                    uint32(block.timestamp) + uint32(_duration) <
                    lockedTokens[msg.sender][tokenContract].unlockTime
                ) {
                    revert LockDurationReducedError();
                }

                uint32 lastLockTime = lockedTokens[msg.sender][tokenContract]
                    .lastLockTime;
>>              lockedTokens[msg.sender][tokenContract].unlockTime =
                    lastLockTime +
                    uint32(_duration);
            }
        }

        emit LockDuration(msg.sender, _duration);
    }
```

There is an invalid check performed, comparing `block.timestamp + _duration` with the current `unlockTime`. However, in the end, the new `unlockTime` is set as `lastLockTime + _duration`. This allows a user to reduce their lock duration and unlock their tokens earlier than initially intended. Let's consider this scenario:

*   Alice creates a lock for 100 days at day 0, unlockTime = 0 + 100 = 100th day
*   on the 50-th day she calls `setLockDuration(51 days)`
*   the contract compares 50 + 51 > 100 and sets unlockTime = 0 + 51 = 51th day

In this way, Alice can reduce her lock duration while still receiving bonuses as if she had a 100-day lock.

Check this coded POC for `SpeedRun.t.sol`

```solidity
    function test_Early() public {
        uint256 lockAmount = 100e18;

        console.log("Beginning run()");
        deployContracts();

        // register me
        amp.register(MunchablesCommonLib.Realm(3), address(0));
        logSnuggery("Initial snuggery");

        // lock tokens for 86400 seconds
        lm.lock{value: lockAmount}(address(0), lockAmount);
        // 10000 seconds pass, use multiple setDurations to unlock instantly
        vm.warp(10000);
        lm.setLockDuration(76401);
        lm.setLockDuration(66402);
        lm.setLockDuration(56403);
        lm.setLockDuration(46404);
        lm.setLockDuration(36405);
        lm.setLockDuration(26406);
        lm.setLockDuration(16407);
        lm.setLockDuration(6408);
        lm.unlock(address(0), lockAmount);
    }
```

In this test case user locked tokens for 86400 seconds and managed to unlock them after only 10000 seconds. This hack enables attacker to to receive multiple NFT drops with `nftOverlord.addReveal` compared to honest users.

### Recommended Mitigation Steps

```diff
+               uint32 lastLockTime = lockedTokens[msg.sender][tokenContract]
                if (
+                   lastLockTime + uint32(_duration) <
                    lockedTokens[msg.sender][tokenContract].unlockTime
                ) {
                    revert LockDurationReducedError();
                }
```

### Assessed type

Invalid Validation

**[0xinsanity (Munchables) confirmed and commented via duplicate issue #236](https://github.com/code-423n4/2024-05-munchables-findings/issues/236#issuecomment-2140972021):**
> Fixed

**[0xsomeone (judge) increased severity to High and commented](https://github.com/code-423n4/2024-05-munchables-findings/issues/7#issuecomment-2149781726):**
 > The Warden outlines a misbehavior in the adjustment of a user's default lock duration that will retroactively apply to all their pre-existing locks and may incorrectly reduce them due to an invalid security check.
> 
> The present mechanism effectively permits the lock time of an entry to be halved which is considered a significant vulnerability and one that would merit an H-risk rating.
> 
> This submission has been selected as the best as it properly clarifies that each re-adjustment of the lock time can halve the remaining lock time and that it can be repeatedly invoked to continuously reduce the lock time and exploit the system to a significant degree.
> 
> Duplicates that have been penalized by 25% (i.e. awarded 75%) have been done so due to recommending an improper mitigation that would reset locks and render the `lastLockTime` variable useless.

*Note: For full discussion, see [here](https://github.com/code-423n4/2024-05-munchables-findings/issues/7).*

***
