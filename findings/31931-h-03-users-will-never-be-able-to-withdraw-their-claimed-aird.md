---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - severity/high
  - sector/token
protocol: "[[Taiko]]"
auditors:
  - "[[pa6kuda]]"
report: "https://code4rena.com/reports/2024-03-taiko"
genome:
  - "[[missing-modifier]]"
  - "[[locked-funds]]"
  - "[[bridge-merkle-proof]]"
  - "[[timestamp-dependence]]"
---
# [H-03] Users will never be able to withdraw their claimed airdrop fully in ERC20Airdrop2.sol contract

- id: 31931
- impact: HIGH
- protocol: [[Taiko]]
- reporter: pa6kuda (Code4rena)
- source: https://code4rena.com/reports/2024-03-taiko

## Summary


The ERC20Airdrop2.sol contract is used for managing a token airdrop for eligible users, but there is an issue with the withdrawal process. Users can claim their tokens within a specific timeframe, but once that window is over, they have to wait for another window to withdraw their tokens. However, there is a strict check in place that makes it difficult for users to time their withdrawals correctly, resulting in them losing some of their eligible tokens. A proof of concept has been provided to demonstrate this issue and a suggested solution is to add a buffer window to the withdrawal process. The bug has been fixed in the code, but it is still listed as a confirmed finding for auditing purposes.

## Details


**Context:**
The ERC20Airdrop2.sol contract is for managing Taiko token airdrop for eligible users, but the withdrawal is not immediate and is subject to a withdrawal window.

Users can claim their tokens within claimStart and claimEnd. Once the claim window is over at claimEnd, they can withdraw their tokens between claimEnd and claimEnd + withdrawalWindow. During this withdrawal period, the tokens unlock linearly i.e. the tokens only become fully withdrawable at claimEnd + withdrawalWindow.

**Issue:**
The issue is that once the tokens for a user are fully unlocked, the [withdraw()](https://github.com/code-423n4/2024-03-taiko/blob/f58384f44dbf4c6535264a472322322705133b11/packages/protocol/contracts/team/airdrop/ERC20Airdrop2.sol#L88) function cannot be called anymore due to the [ongoingWithdrawals modifier](https://github.com/code-423n4/2024-03-taiko/blob/f58384f44dbf4c6535264a472322322705133b11/packages/protocol/contracts/team/airdrop/ERC20Airdrop2.sol#L39) having a strict `claimEnd + withdrawalWindow < block.timestamp` check in its second condition.

**Impact:**
Although the tokens become fully unlocked when block.timestamp = claimEnd + withdrawalWindow, it is extremely difficult or close to impossible for normal users to time this to get their full allocated claim amount. This means that users are always bound to lose certain amount of their eligible claim amount. This lost amount can be small for users who claim closer to claimEnd + withdrawalWindow and higher for those who partially claimed initially or did not claim at all thinking that they would claim once their tokens are fully unlocked.

### Coded POC

How to use this POC:

*   Add the POC to `test/team/airdrop/ERC20Airdrop2.t.sol`
*   Run the POC using `forge test --match-test testAirdropIssue -vvv`
*   The POC demonstrates how alice was only able to claim half her tokens out of her total 100 tokens claimable amount.

```solidity
      function testAirdropIssue() public {
        vm.warp(uint64(block.timestamp + 11));

        vm.prank(Alice, Alice);
        airdrop2.claim(Alice, 100, merkleProof);

        // Roll 5 days after
        vm.roll(block.number + 200);
        vm.warp(claimEnd + 5 days);

        airdrop2.withdraw(Alice);

        console.log("Alice balance:", token.balanceOf(Alice));

        // Roll 6 days after
        vm.roll(block.number + 200);
        vm.warp(claimEnd + 11 days);

        vm.expectRevert(ERC20Airdrop2.WITHDRAWALS_NOT_ONGOING.selector);
        airdrop2.withdraw(Alice);
    }
```

### Logs

```solidity
Logs:
  > MockERC20Airdrop @ 0x0000000000000000000000000000000000000000
    proxy      : 0xF62849F9A0B5Bf2913b396098F7c7019b51A820a
    impl       : 0x2e234DAe75C793f67A35089C9d99245E1C58470b
    owner      : 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496
    msg.sender : 0x1804c8AB1F12E6bbf3894d4083f33e07309d1f38
    this       : 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496
  Alice balance: 50
```

### Recommended Mitigation Steps

In the [modifier ongoingWithdrawals()](https://github.com/code-423n4/2024-03-taiko/blob/f58384f44dbf4c6535264a472322322705133b11/packages/protocol/contracts/team/airdrop/ERC20Airdrop2.sol#L39), consider adding a buffer window in the second condition that gives users enough time to claim the fully unlocked tokens.

```solidity
    uint256 constant bufferWindow = X mins/hours/days;

    modifier ongoingWithdrawals() {
        if (claimEnd > block.timestamp || claimEnd + withdrawalWindow < block.timestamp + bufferWindow) {
            revert WITHDRAWALS_NOT_ONGOING();
        }
        _;
    }
```
**[dantaik (Taiko) commented](https://github.com/code-423n4/2024-03-taiko-findings/issues/245#issuecomment-2033388656):**
 > Fixed in https://github.com/taikoxyz/taiko-mono/pull/16596

**[adaki2004 (Taiko) confirmed and commented](https://github.com/code-423n4/2024-03-taiko-findings/issues/245#issuecomment-2037149300):**
 > It is indeed a bug in the flow, while we removed Airdrop2, it is still a confirmed finding on the repo for auditing.


***
