---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - sector/nft
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/liquidation-logic
  - novelty/variant
  - misassumption/math-is-safe
  - fix/redesign-logic
protocol: "[[Vii]]"
auditors:
  - "[[Giovanni Di Siena]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-15-cyfrin-vii-v2.0.md"
genome:
  - "[[liquidation-logic]]"
  - "[[liquidation-manipulation]]"
  - "[[variant]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
---
# More value can be extracted by liquidations than expected due to incorrect transfer calculations when the violator does not own the total ERC-6909 supply for each `tokenId` enabled as collateral

- id: 61329
- impact: HIGH
- protocol: [[Vii]]
- reporter: Giovanni Di Siena (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-15-cyfrin-vii-v2.0.md

## Summary


This bug report discusses an issue with the `ERC721WrapperBase::transfer` function in the `UniswapV3Wrapper` and `UniswapV4Wrapper` contracts. This function is used to transfer shares of the underlying collateral between users, such as in the case of liquidation. However, there is a problem with the calculation used to determine how much of the collateral needs to be transferred, which results in the liquidator receiving more value than expected. This can happen when the user does not own 100% of the ERC-6909 token supply for a given `tokenId`. Two proof of concept examples are provided to demonstrate this issue. The recommended mitigation is to change the formula in the `normalizedToFull()` function to use the sender's actual balance of the `tokenId` instead of the total supply. This issue has been fixed in the `VII Finance` contract and verified in the `Cyfrin` contract. 

## Details

**Description:** Given that the `UniswapV3Wrapper` and `UniswapV4Wrapper` contracts are not typical EVK vault collateral, it is necessary to have some method for calculating how much of the claim on the underlying collateral needs to be transferred from sender to receiver when a share transfer is execution. In the context of liquidation, this transfer is made from the violator to liquidator; however, note that it is also necessary to implement this functionality for transfers in the usual context.

This is achieved by `ERC721WrapperBase::transfer` which allows the caller to specify the amount to transfer in terms of the underlying collateral value:

```solidity
/// @notice For regular EVK vaults, it transfers the specified amount of vault shares from the sender to the receiver
/// @dev For ERC721WrapperBase, transfers a proportional amount of ERC6909 tokens (calculated as totalSupply(tokenId) * amount / balanceOf(sender)) for each enabled tokenId from the sender to the receiver.
/// @dev no need to check if sender is being liquidated, sender can choose to do this at any time
/// @dev When calculating how many ERC6909 tokens to transfer, rounding is performed in favor of the sender (typically the violator).
/// @dev This means that the sender may end up with a slightly larger amount of ERC6909 tokens than expected, as the rounding is done in their favor.
function transfer(address to, uint256 amount) external callThroughEVC returns (bool) {
    address sender = _msgSender();
    uint256 currentBalance = balanceOf(sender);

    uint256 totalTokenIds = totalTokenIdsEnabledBy(sender);

    for (uint256 i = 0; i < totalTokenIds; ++i) {
        uint256 tokenId = tokenIdOfOwnerByIndex(sender, i);
        _transfer(sender, to, tokenId, normalizedToFull(tokenId, amount, currentBalance)); //this concludes the liquidation. The liquidator can come back to do whatever they want with the ERC6909 tokens
    }
    return true;
}
```

Here, `balanceOf(sender)` returns the sum value of each `tokenId` in `unitOfAccount` terms which is in turn used by `normalizedToFull()` to calculate the proportional amount of each ERC-6909 token enabled as collateral by the sender that should be transferred. These calculations work as intended when a sender owns the total ERC-6909 token supply for a given `tokenId`; however, this breaks if the sender owns less than 100% of a given `tokenId` and results in the corresponding calculations of ERC-6909 tokens to transfer being larger than they should be. This ultimately leads to the liquidator extracting more value in `unitOfAccount` than requested.

The source of this error is in the `normalizedToFull()` function:

```solidity
function normalizedToFull(uint256 tokenId, uint256 amount, uint256 currentBalance) public view returns (uint256) {
    // @audit => multiplying by the total ERC-6909 supply of the specified tokenId is incorrect
    return Math.mulDiv(amount, totalSupply(tokenId), currentBalance);
}
```

Here, the total supply of ERC-6909 tokens of the specified `tokenId` is erroneously used in the multiplication when this should instead be normalized to the actual amount of ERC-6909 tokens owned by the user.

**Impact:** More value can be extracted by liquidations than expected, causing the liquidated accounts to incur larger losses. This can occur by repeated partial liquidation or in the scenario a borrower transfers a portion of their position to a separate account.

**Proof of Concept:** As demonstrated by the below PoCs, the liquidator receives more value than expected when transferring the specified amount of value from a user who doesn't own 100% of the ERC-6909 supply for all `tokenIds` enabled as collateral.

This first PoC demonstrates the scenario when transferring an amount of value from a **user who owns 100% of the ERC-6909 supply for all `tokenIds` enabled as collateral**. Here, the transfer works as expected and the liquidator receives the correct share of each collateral:

```solidity
function test_transferExpectedPoC() public {
    int256 liquidityDelta = -19999;

    LiquidityParams memory params = LiquidityParams({
        tickLower: TickMath.MIN_TICK + 1,
        tickUpper: TickMath.MAX_TICK - 1,
        liquidityDelta: liquidityDelta
    });

    (uint256 tokenId1,,) = boundLiquidityParamsAndMint(params);
    (uint256 tokenId2,,) = boundLiquidityParamsAndMint(params);

    startHoax(borrower);
    wrapper.underlying().approve(address(wrapper), tokenId1);
    wrapper.underlying().approve(address(wrapper), tokenId2);
    wrapper.wrap(tokenId1, borrower);
    wrapper.wrap(tokenId2, borrower);
    wrapper.enableTokenIdAsCollateral(tokenId1);
    wrapper.enableTokenIdAsCollateral(tokenId2);
    address borrower2 = makeAddr("borrower2");

    // @audit-info => borrower owns a 100% of ERC-6909 supply of each tokenId
    uint256 beforeLiquidationBalanceOfBorrower1 = wrapper.balanceOf(borrower);

    address liquidator = makeAddr("liquidator");
    uint256 transferAmount = beforeLiquidationBalanceOfBorrower1 / 2;
    wrapper.transfer(liquidator, transferAmount);

    uint256 finalBalanceOfBorrower1 = wrapper.balanceOf(borrower);

    // @audit-info => liquidated borrower got seized the exact amount of assets requested by the liquidator
    startHoax(liquidator);
    wrapper.enableTokenIdAsCollateral(tokenId1);
    wrapper.enableTokenIdAsCollateral(tokenId2);

    assertApproxEqAbs(wrapper.balanceOf(liquidator), transferAmount, ALLOWED_PRECISION_IN_TESTS);
}
```

However, this second PoC demonstrates the scenario when transferring an amount of value from a **user who doesn't own 100% of the ERC-6909 supply for all `tokenIds` enabled as collateral**. In this case, the transfer does not work as expected and the actual amount of value transferred to the liquidator is more than what was requested:

```solidity
function test_transferUnexpectedPoC() public {
    int256 liquidityDelta = -19999;

    LiquidityParams memory params = LiquidityParams({
        tickLower: TickMath.MIN_TICK + 1,
        tickUpper: TickMath.MAX_TICK - 1,
        liquidityDelta: liquidityDelta
    });

    (uint256 tokenId1,,) = boundLiquidityParamsAndMint(params);
    (uint256 tokenId2,,) = boundLiquidityParamsAndMint(params);

    startHoax(borrower);
    wrapper.underlying().approve(address(wrapper), tokenId1);
    wrapper.underlying().approve(address(wrapper), tokenId2);
    wrapper.wrap(tokenId1, borrower);
    wrapper.wrap(tokenId2, borrower);
    wrapper.enableTokenIdAsCollateral(tokenId1);
    wrapper.enableTokenIdAsCollateral(tokenId2);
    address borrower2 = makeAddr("borrower2");

    // @audit-info => liquidated borrower doesn't own 100% of both tokenIds
    wrapper.transfer(borrower2, tokenId1, wrapper.FULL_AMOUNT() / 2);

    uint256 beforeLiquidationBalanceOfBorrower1 = wrapper.balanceOf(borrower);

    address liquidator = makeAddr("liquidator");
    uint256 transferAmount = beforeLiquidationBalanceOfBorrower1 / 2;
    wrapper.transfer(liquidator, transferAmount);

    uint256 finalBalanceOfBorrower1 = wrapper.balanceOf(borrower);

    startHoax(liquidator);
    wrapper.enableTokenIdAsCollateral(tokenId1);
    wrapper.enableTokenIdAsCollateral(tokenId2);

    // @audit-issue => because liquidated borrower did not have 100% of shares for both tokenIds, the liquidator earned more than requested
    //@audit-issue => liquidated borrower got seized more assets than they should have
    assertApproxEqAbs(wrapper.balanceOf(liquidator), transferAmount, ALLOWED_PRECISION_IN_TESTS);
}
```

**Recommended Mitigation:** On the `normalizedToFull()`, change the formula as follows:
```diff
    function normalizedToFull(uint256 tokenId, uint256 amount, uint256 currentBalance) public view returns (uint256) {
-       return Math.mulDiv(amount, totalSupply(tokenId), currentBalance);
+       return Math.mulDiv(amount, balanceOf(_msgSender(), tokenId), currentBalance);
    }
```

**VII Finance:** Fixed in commit [b7549f2](https://github.com/kankodu/vii-finance-smart-contracts/commit/b7549f2700af133ce98a4d6f19e43c857b5ea78a).

**Cyfrin:** Verified. The sender's actual balance of `tokenId` is now used in normalization instead of the ERC-6909 total supply.

\clearpage
