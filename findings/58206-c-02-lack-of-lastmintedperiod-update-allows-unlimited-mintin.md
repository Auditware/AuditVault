---
tags:
  - lang/solidity
  - sector/dex
  - sector/farm
  - sector/token
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - precondition/specific-token-type
protocol: "[[KittenSwap]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-06-12.md"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[specific-token-type]]"
  - "[[timestamp-dependence]]"
---
# [C-02] Lack of `lastMintedPeriod` update allows unlimited minting of Kitten

- id: 58206
- impact: HIGH
- protocol: KittenSwap_2025-06-12
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[KittenSwap]]-security-review_2025-06-12.md

## Summary


A bug was discovered in the code for the Kitten token, which allows for an unlimited supply of tokens to be minted. This is due to the `Minter.updatePeriod()` function not properly updating the `lastMintedPeriod` variable, which is used to control the number of tokens that can be minted per period. As a result, the condition for minting tokens is always true, allowing for an unlimited amount of tokens to be minted. A proof of concept has been provided to demonstrate this issue. The recommendation is to add a line of code to properly update the `lastMintedPeriod` variable and prevent unlimited minting. 

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

`Minter.updatePeriod()` is meant to mint Kitten tokens for the `RebaseReward` and `Voter` contracts once per period. However, this function misses updating the `lastMintedPeriod` variable. As a result, once the first period has passed, the following condition will always be true:

```solidity
        if (currentPeriod > lastMintedPeriod) {
```

This will allow minting Kitten tokens indefinitely, leading to an unlimited supply of Kitten tokens.

### Proof of concept

Add the following code to the file `TestVoter.t.sol` and run `forge test -f https://rpc.hyperliquid.xyz/evm --mc TestVoter --mt test_audit_unlimitedMinting`.

```solidity
    function test_audit_unlimitedMinting() public {
        test_Vote();
        vm.warp(block.timestamp + 1 weeks);

        uint256 totalSupplyBefore = kitten.totalSupply();
        for (uint256 i; i < 10; i++) {
            minter.updatePeriod();
            uint256 totalSupplyAfter = kitten.totalSupply();
            assertGt(totalSupplyAfter, totalSupplyBefore);
            totalSupplyBefore = totalSupplyAfter;
        }
    }
```

## Recommendations

```diff
            emit Mint(
                msg.sender,
                emissions,
                circulatingSupply(),
                _tailEmissions
            );
+
+           lastMintedPeriod = currentPeriod;

            return true;
```
