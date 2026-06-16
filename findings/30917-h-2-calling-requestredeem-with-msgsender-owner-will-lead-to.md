---
tags:
  - lang/solidity
  - sector/staking
  - sector/token
  - platform/sherlock
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - novelty/variant
protocol: "[[Amphor]]"
auditors:
  - "[[fugazzi]]"
report: "https://github.com/sherlock-audit/2024-03-amphor-judging"
genome:
  - "[[frozen-funds]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[vote-delegation-loop]]"
---
# H-2: Calling `requestRedeem` with `_msgSender() != owner`  will lead to user's shares being locked in the vault forever

- id: 30917
- impact: HIGH
- protocol: [[Amphor]]
- reporter: fugazzi (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found in the `requestRedeem` function of the `AsyncSynthVault.sol` contract. This function can be called by a user on behalf of another user, but this action results in a loss of balance. The issue lies in a discrepancy in the `_createRedeemRequest` function, which fails to update the `lastRedeemRequestId` for the user eligible to claim the shares. As a result, the shares become permanently locked in the vault, making them unclaimable by either the user or the original owner. To fix this issue, the code needs to be modified and the protocol team has already addressed it in a recent commit. 

## Details

Source: https://github.com/sherlock-audit/2024-03-amphor-judging/issues/85 

## Found by 
Afriaudit, DMoore, Varun\_05, den\_sosnovskyi, fugazzi, sammy, zzykxx
## Summary
The [`requestRedeem`](https://github.com/sherlock-audit/2024-03-amphor/blob/main/asynchronous-vault/src/AsyncSynthVault.sol#L477) function in `AsyncSynthVault.sol` can be invoked by a user on behalf of another user, referred to as 'owner', provided that the user has been granted sufficient allowance by the 'owner'. However, this action results in a complete loss of balance.


## Vulnerability Detail
The [`_createRedeemRequest`](https://github.com/sherlock-audit/2024-03-amphor/blob/main/asynchronous-vault/src/AsyncSynthVault.sol#L721) function contains a discrepancy; it fails to update the `lastRedeemRequestId` for the user eligible to claim the shares upon maturity. Instead, it updates this identifier for the 'owner' who delegated their shares to the user. As a result, the shares become permanently locked in the vault, rendering them unclaimable by either the 'owner' or the user.

This issue unfolds as follows:

1. The 'owner' deposits tokens into the vault, receiving vault shares in return.
2. The 'owner' then delegates the allowance of all their vault shares to another user.
3. When `epochId == 1`, this user executes The [`requestRedeem`](https://github.com/sherlock-audit/2024-03-amphor/blob/main/asynchronous-vault/src/AsyncSynthVault.sol#L477) , specifying the 'owner''s address as `owner`, the user's address as `receiver`, and the 'owner''s share balance as `shares`.
4. The internal function `_createRedeemRequest` is invoked, incrementing `epochs[epochId].redeemRequestBalance[receiver]` by the amount of `shares`, and setting `lastRedeemRequestId[owner] = epochId`.
5. At `epochId == 2`, the user calls [`claimRedeem`](https://github.com/sherlock-audit/2024-03-amphor/blob/main/asynchronous-vault/src/AsyncSynthVault.sol#L521), which in turn calls the internal function [`_claimRedeem`](https://github.com/sherlock-audit/2024-03-amphor/blob/main/asynchronous-vault/src/AsyncSynthVault.sol#L758), with `owner` set to `_msgSender()` (i.e., the user's address) and `receiver` also set to the user's address.
6. In this scenario, `lastRequestId` remains zero because `lastRedeemRequestId[owner] == 0` (here, `owner` refers to the user's address). Consequently, `epochs[lastRequestId].redeemRequestBalance[owner]` is also zero. Therefore, no shares are minted to the user.


Proof of Code : 

The following test demonstrates the claim made above : 

```solidity
function test_poc() external {
        // set token balances
        deal(vaultTested.asset(), user1.addr, 20); // owner

        vm.startPrank(user1.addr);
        IERC20Metadata(vaultTested.asset()).approve(address(vaultTested), 20);
        // owner deposits tokens when vault is open and receives vault shares
        vaultTested.deposit(20, user1.addr);
        // owner delegates shares balance to user
        IERC20Metadata(address(vaultTested)).approve(
            user2.addr,
            vaultTested.balanceOf(user1.addr)
        );
        vm.stopPrank();

        // vault is closed
        vm.prank(vaultTested.owner());
        vaultTested.close();

        // epoch = 1
        vm.startPrank(user2.addr);
        // user requests a redeem on behlaf of owner
        vaultTested.requestRedeem(
            vaultTested.balanceOf(user1.addr),
            user2.addr,
            user1.addr,
            ""
        );
        // user checks the pending redeem request amount
        assertEq(vaultTested.pendingRedeemRequest(user2.addr), 20);
        vm.stopPrank();

        vm.startPrank(vaultTested.owner());
        IERC20Metadata(vaultTested.asset()).approve(
            address(vaultTested),
            type(uint256).max
        );
        vaultTested.settle(23); // an epoch goes by
        vm.stopPrank();

        // epoch = 2

        vm.startPrank(user2.addr);
        // user tries to claim the redeem
        vaultTested.claimRedeem(user2.addr);
        assertEq(IERC20Metadata(vaultTested.asset()).balanceOf(user2.addr), 0);
        // however, token balance of user is still empty
        vm.stopPrank();

        vm.startPrank(user1.addr);
        // owner also tries to claim the redeem
        vaultTested.claimRedeem(user1.addr);
        assertEq(IERC20Metadata(vaultTested.asset()).balanceOf(user1.addr), 0);
        // however, token balance of owner is still empty
        vm.stopPrank();

        // all the balances of owner and user are zero, indicating loss of funds
        assertEq(vaultTested.balanceOf(user1.addr), 0);
        assertEq(IERC20Metadata(vaultTested.asset()).balanceOf(user1.addr), 0);
        assertEq(vaultTested.balanceOf(user2.addr), 0);
        assertEq(IERC20Metadata(vaultTested.asset()).balanceOf(user2.addr), 0);
    }
```
To run the test : 
1. Copy the above code and paste it into `TestClaimDeposit.t.sol`
2. Run `forge test --match-test test_poc --ffi`

## Impact
The shares are locked in the vault forever with no method for recovery by the user or the 'owner'. 

## Code Snippet

## Tool used

Manual Review
Foundry

## Recommendation
Modify [`_createRedeemRequest`](https://github.com/sherlock-audit/2024-03-amphor/blob/main/asynchronous-vault/src/AsyncSynthVault.sol#L721) as follows : 
```diff
-        lastRedeemRequestId[owner] = epochId;
+       lastRedeemRequestid[receiver] = epochId;

```



## Discussion

**sherlock-admin3**

1 comment(s) were left on this issue during the judging contest.

**takarez** commented:
>  invalid



**sherlock-admin4**

The protocol team fixed this issue in PR/commit https://github.com/AmphorProtocol/asynchronous-vault/pull/103.
