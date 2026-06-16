---
tags:
  - lang/solidity
  - platform/halborn
  - has/poc
  - severity/high
  - sector/staking
  - sector/token
protocol: "[[Pepper]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/pepper/pepper"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[reward-accounting]]"
---
# Minting Limit Calculation May Prevent Legitimate Claims

- id: 52222
- impact: HIGH
- protocol: [[Pepper]]
- reporter: Halborn
- source: https://www.halborn.com/audits/pepper/pepper

## Summary


This report describes a bug in the Pepper contract's `mint` function, which is supposed to limit minting to 40% of the total supply. However, the current implementation does not differentiate between tokens minted through this function and other means, causing unexpected reverts once the total supply reaches 40% of the maximum supply. This could disrupt planned airdrops and prevent users from receiving their entitled tokens. The report suggests implementing a separate tracker for minting through the `MINTER_ROLE` to properly enforce the 40% limit. The Pepper team has since implemented this solution to address the issue.

## Details

##### Description

In the Pepper contract, the `mint` function implements a cap on minting that is intended to limit mints to 40% of the total supply.

```
function mint(address to, uint256 amount) public {
    require(hasRole(MINTER_ROLE, msg.sender), "Must have minter role to mint");
    uint256 _amount = totalSupply() + amount;
    require(_amount <= MINT_LIMIT, "Minting exceeds 40% of total supply");
    require(_amount <= MAX_SUPPLY, "Max supply reached");

    _mint(to, amount);
}
```

The issue lies in using the total supply to calculate the minting limit. This approach doesn't distinguish between tokens minted through the `mint` function and those minted through other means, such as claims. As a result, once the total supply reaches 40% of `MAX_SUPPLY`, the minting operations through `mint` function will revert.

This can lead to a scenario where the `PepperAirdrop::mintPepper` function, which relies on this `mint` function, starts to revert unexpectedly. This could disrupt planned airdrops and prevent users from receiving their entitled tokens.

##### Proof of Concept

Add the following function to `Pepper.t.sol`

```
 function test_ClaimRevert_PoC() public {
        uint256 amount = pepper.MINT_LIMIT() / 250;
        address user1 = vm.addr(1);
        // give 3000 CHZ to user
        vm.deal(user1, amount);

        // user stakes on validator 2
        vm.prank(user1);
        stakingPool.stake{value: amount}(vm.addr(6));

        //claim
        vm.prank(user1);
        pepper.claim();

        //Mocking a call from PepperAirdrop to mint 500 Pepper to a user
        vm.expectRevert("Minting exceeds 40% of total supply");
        pepper.mint(user1, 500e18);
    }
```

Run with `forge test --mt "test_ClaimRevert_PoC" -vvvv`

##### BVSS

[AO:A/AC:L/AX:L/R:N/S:U/C:N/A:H/I:N/D:N/Y:L (8.1)](/bvss?q=AO:A/AC:L/AX:L/R:N/S:U/C:N/A:H/I:N/D:N/Y:L)

##### Recommendation

To address this issue, implement a separate tracker for mints performed by accounts with the `MINTER_ROLE`. This allows for proper enforcement of the 40% limit on controlled mints while allowing claims to proceed normally. Here's a revised implementation:

```
// Add this state variable
uint256 public minterRoleMintedAmount;

function mint(address to, uint256 amount) public {
    require(hasRole(MINTER_ROLE, msg.sender), "Must have minter role to mint");
    
    uint256 newMinterRoleMintedAmount = minterRoleMintedAmount + amount;
    require(newMinterRoleMintedAmount <= MINT_LIMIT, "Minting exceeds 40% of total supply for minter role");
    
    uint256 newTotalSupply = totalSupply() + amount;
    require(newTotalSupply <= MAX_SUPPLY, "Max supply reached");
    
    minterRoleMintedAmount = newMinterRoleMintedAmount;
    _mint(to, amount);
}
```

##### Remediation

**SOLVED**: The suggested mitigation was implemented by the **Pepper team.**

##### Remediation Hash

bccbd7a5747d4ef6586581ec93ac77e0d8a4de45
