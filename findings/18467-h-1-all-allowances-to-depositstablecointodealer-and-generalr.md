---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/dex
  - sector/stable
  - sector/token
protocol: "[[JOJO Exchange]]"
auditors:
  - "[[dingo]]"
report: "https://github.com/sherlock-audit/2023-04-jojo-judging"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
---
# H-1: All allowances to DepositStableCoinToDealer and GeneralRepay can be stolen due to unsafe call

- id: 18467
- impact: HIGH
- protocol: [[JOJO Exchange]]
- reporter: dingo (Sherlock)
- source: N/A

## Summary


This bug report is about two helper contracts, DepositStableCoinToDealer.sol and GeneralRepay.sol, which allow a user to swap and enter JOJODealer and JUSDBank respectively. The issue is that the call is unsafe allowing the contract to call the token contracts directly and transfer tokens from anyone who has approved the contract. This means that anyone who has approved the contract can have their tokens stolen. 

The vulnerability lies in the code snippet which allows the contract to call the token contracts without any protection. An attacker can take advantage of this by seeing the approval of a user, and then calling the depositStableCoin with themselves as the receiver, thus transferring all of the user's tokens to themselves.

The impact of this bug would be that all allowances can be stolen. This was found through manual review.

The bug was fixed by implementing contract whitelists, so that only whitelisted contracts can be called. This was confirmed by 0x52 and IAm0x52.

## Details

Source: https://github.com/sherlock-audit/2023-04-jojo-judging/issues/428 

## Found by 
0x52, 0xkazim, ArbitraryExecution, Bauer, BowTiedOriole, GalloDaSballo, Inspex, Jigsaw, MalfurionWhitehat, XDZIBEC, ctf\_sec, dingo, jprod15, lil.eth, tvdung94, yy
## Summary

DepositStableCoinToDealer.sol and GeneralRepay.sol are helper contracts that allow a user to swap and enter JOJODealer and JUSDBank respectively. The issue is that the call is unsafe allowing the contract to call the token contracts directly and transfer tokens from anyone who has approved the contract.

## Vulnerability Detail

https://github.com/sherlock-audit/2023-04-jojo/blob/main/smart-contract-EVM/contracts/stableCoin/DepositStableCoinToDealer.sol#L30-L44

        IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);
        (address approveTarget, address swapTarget, bytes memory data) = abi
        .decode(param, (address, address, bytes));
        // if usdt
        IERC20(asset).approve(approveTarget, 0);
        IERC20(asset).approve(approveTarget, amount);
        (bool success, ) = swapTarget.call(data);
        if (success == false) {
            assembly {
                let ptr := mload(0x40)
                let size := returndatasize()
                returndatacopy(ptr, 0, size)
                revert(ptr, size)
            }
        }

We can see above that the call is totally unprotected allowing a user to make any call to any contract. This can be abused by calling the token contract and using the allowances of others. The attack would go as follows:

1. User A approves the contract for 100 USDT
2. User B sees this approval and calls depositStableCoin with the swap target as the USDT contract with themselves as the receiver
3. This transfers all of user A USDT to them

## Impact

All allowances can be stolen

## Code Snippet

https://github.com/sherlock-audit/2023-04-jojo/blob/main/smart-contract-EVM/contracts/stableCoin/DepositStableCoinToDealer.sol#L23C14-L50

## Tool used

Manual Review

## Recommendation

Only allow users to call certain whitelisted contracts.



## Discussion

**JoscelynFarr**

fix link:
https://github.com/JOJOexchange/JUSDV1/commit/5770d15edac41c78d9726f02e988aa8e14601f3e
https://github.com/JOJOexchange/smart-contract-EVM/commit/94ea554ec1c563e945bd388051f6438826818b47

**IAm0x52**

Fixes look good. GeneralRepay and DepositStableCoinToDealer now implement contract whitelists
