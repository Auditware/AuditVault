---
tags:
  - lang/solidity
  - sector/farm
  - sector/token
  - has/github
  - has/poc
  - severity/high
protocol: "[[KittenSwap]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-06-12.md"
genome:
  - "[[access-roles]]"
  - "[[specific-token-type]]"
---
# [C-02] Lack of `lastMintedPeriod` update allows unlimited minting of Kitten

- id: 58066
- impact: HIGH
- protocol: KittenSwap_2025-06-12
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-06-12.md

## Summary


The `Minter.updatePeriod()` function is not working properly, which is causing an unlimited supply of Kitten tokens. This is because the `lastMintedPeriod` variable is not being updated, allowing for infinite minting of tokens. To test this bug, you can add code to the `TestVoter.t.sol` file and run a test. To fix this issue, the `lastMintedPeriod` variable should be updated in the `Minter.updatePeriod()` function. 

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
