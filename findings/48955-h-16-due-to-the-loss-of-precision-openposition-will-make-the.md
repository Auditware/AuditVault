---
tags:
  - lang/solidity
  - sector/lending
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/precision-loss
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Rubicon]]"
auditors:
  - "[[cccz]]"
report: "https://code4rena.com/reports/2023-04-rubicon"
genome:
  - "[[precision-loss]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
---
# [H-16] Due to the loss of precision, `openPosition` will make the user's leverage higher than expected

- id: 48955
- impact: HIGH
- protocol: [[Rubicon]]
- reporter: cccz (Code4rena)
- source: https://code4rena.com/reports/2023-04-rubicon

## Summary


Summary:

The `openPosition` function in the Position contract uses the `_borrowLimit` function to calculate the desired amount of borrowing for a user's leveraged position. However, due to rounding in the calculations, the actual leverage and borrowed amount may be higher than expected. This can lead to a higher risk of liquidation for the user. The severity of this bug is disputed, but it is recommended to make the precision of the `leverage` parameter less precise to avoid this issue. 

## Details


`openPosition` creates a leveraged position for the user based on `initMargin` and leverage, and in `_borrowLimit`, it calculates the number of borrowing loops needed to reach the desired amount.

```solidity
        (vars.limit, vars.lastBorrow) = _borrowLimit(
            bathTokenAsset,
            asset,
            initMargin,
            leverage
        );
```

For example, if `initMargin` = 1e18 and leverage = 2, then `_desiredAmount` = 2e18. If the collateral factor is 0.7, the user's position after the first borrowing is 1e18 + 1e18 &ast; 0.7 = 1.7e18, and the user's position after the second borrowing is 1e18 + 1e18 &ast; 0.7 + 1e18 &ast; 0.7 &ast; 0.7 = 2.19e18.

```solidity
        uint256 _desiredAmount = wmul(_assetAmount, _leverage);

        // check if collateral was already supplied
        uint256 _minted = IERC20(_bathToken).balanceOf(address(this));
	// how much is borrowed on a current loop
        uint256 _loopBorrowed;

        while (_assetAmount <= _desiredAmount) {
            if (_limit == 0) {
		// if collateral already provided
                if (_minted != 0) {
                    uint256 _max = _maxBorrow(_bathToken);

		    // take into account previous collateral
                    _loopBorrowed = wmul(_assetAmount, _collateralFactor).add(
                        _max
                    );
                } else {
                    _loopBorrowed = wmul(_assetAmount, _collateralFactor);
                }
            } else {
                _loopBorrowed = wmul(_loopBorrowed, _collateralFactor);
            }

            // here _assetAmount refers to the
            // TOTAL asset amount in the position
            _assetAmount += _loopBorrowed;
```

For the excess of 0.19e18, `_lastBorrow` is used as the percentage of the last borrow. It should be noted that when `_lastBorrow` = 0, it means that the percentage of this borrowing is 100%.

```solidity
            if (_assetAmount > _desiredAmount) {
                // in case we've borrowed more than needed
                // return excess and calculate how much is
                // needed to borrow on the last loop
                // to not overflow _desiredAmount
                uint256 _borrowDelta = _desiredAmount.sub(
                    _assetAmount.sub(_loopBorrowed)
                );
                _lastBorrow = _borrowDelta.mul(WAD).div(_loopBorrowed);

                _limit++;
                break;
            } else if (_assetAmount == _desiredAmount) {
                // 1x short or perfect matching
                _limit++;
                break;
            } else {
                // default case
                _limit++;
            }
...
            if (i.add(1) == vars.limit && vars.lastBorrow != 0) {
                vars.toBorrow = vars.lastBorrow;
            } else {
                // otherwise borrow max amount available to borrow - 100% from _maxBorrow
                vars.toBorrow = WAD;
            }
```

Although the long leverage must be greater than 1e18, the user can make the long leverage = 1e18+1 to make the long leverage small. But in this case, the loss of precision in the calculation will cause the user to have a higher leverage than expected.

```solidity
    function _leverageCheck(uint256 _leverage, bool _long) internal pure {
        uint256 _wad = WAD;
        uint256 _leverageMax = WAD.mul(3);

        _long // long can't be with 1x leverage
            ? require(
                _leverage > _wad && _leverage <= _leverageMax,
                "_leverageCheck{Long}: INVLAID LEVERAGE"
            )
            : require(
                _leverage >= _wad && _leverage <= _leverageMax,
                "_leverageCheck{Short}: INVLAID LEVERAGE"
            );
    }
```

Consider the following scenario:

The collateral factor of WBTC is 0.7. Alice provides 4e8 WBTC and 1e18+1 long leverage to call the `buyAllAmountWithLeverage` function.
Since wmul is rounded rather than rounded up, the `_desiredAmount` calculated in `_borrowLimit` is equal to wmul(4e8,1e18+1) = 4e8.

```solidity
        uint256 _desiredAmount = wmul(_assetAmount, _leverage);

```

After that, since `_borrowDelta` == 0, `_borrowLimit` returns limit == 1 and `_lastBorrow` == 0.

```solidity
            if (_assetAmount > _desiredAmount) {
                // in case we've borrowed more than needed
                // return excess and calculate how much is
                // needed to borrow on the last loop
                // to not overflow _desiredAmount
                uint256 _borrowDelta = _desiredAmount.sub(
                    _assetAmount.sub(_loopBorrowed)
                );
                _lastBorrow = _borrowDelta.mul(WAD).div(_loopBorrowed);

                _limit++;
                break;
```

Then in `openPosition`, since `_lastBorrow` = 0, borrowing will be done so that Alice's position reaches 4e8+4e8 &ast; 0.7 = 6.8 WBTC, at which point Alice's leverage is 1.7e18, much larger than Alice's expectations, too high leverage will increase the risk of Alice is liquidated.

```solidity
            if (i.add(1) == vars.limit && vars.lastBorrow != 0) {
                vars.toBorrow = vars.lastBorrow;
            } else {
                // otherwise borrow max amount available to borrow - 100% from _maxBorrow
                vars.toBorrow = WAD;
            }

            // increase bathToken amount in order to save it in positions map
            vars.currentBathTokenAmount += _borrowLoop(
                asset,
                quote,
                bathTokenAsset,
                bathTokenQuote,
                vars.currentAssetBalance,
                vars.toBorrow
            );
```

### Proof of Concept

The POC and output are as follows. It can be seen that the borrowed amount of 1e18+1 is greater than 1.25e18 and 1.337e18, and the actual leverage of 1e18+1 is 1.7e18.

```
    describe("Long positions 📈", function () {
      it("POC1", async function () {
        const { owner, testCoin, testStableCoin, Position } = await loadFixture(
          deployPoolsUtilityFixture
        );
        const TEST_AMOUNT_0_4 = parseUnits("0.4");
        const x1_1 = parseUnits("1.000000000000000001");

        await Position.connect(owner).buyAllAmountWithLeverage(
          testCoin.address,
          testStableCoin.address,
          TEST_AMOUNT_0_4,
          x1_1
        );

        const position = await Position.positions(1);

        console.log("borrowedAmount1 : %s",position[2]);
      });

      it("POC2", async function () {
        const { owner, testCoin, testStableCoin, Position } = await loadFixture(
          deployPoolsUtilityFixture
        );
        const TEST_AMOUNT_0_4 = parseUnits("0.4");
        await Position.connect(owner).buyAllAmountWithLeverage(
          testCoin.address,
          testStableCoin.address,
          TEST_AMOUNT_0_4,
          x1_25
        );

        const position = await Position.positions(1);

        console.log("borrowedAmount2 : %s",position[2]);

      });
      it("POC3", async function () {
        const { owner, testCoin, testStableCoin, Position } = await loadFixture(
          deployPoolsUtilityFixture
        );
        const TEST_AMOUNT_0_4 = parseUnits("0.4");
        await Position.connect(owner).buyAllAmountWithLeverage(
          testCoin.address,
          testStableCoin.address,
          TEST_AMOUNT_0_4,
          x1_337
        );

        const position = await Position.positions(1);

        console.log("borrowedAmount3 : %s",position[2]);
      });
```

```
borrowedAmount1 : 252000
        ✓ POC1
borrowedAmount2 : 90000
        ✓ POC2
borrowedAmount3 : 121320
        ✓ POC3
```

<https://github.com/code-423n4/2023-04-rubicon/blob/511636d889742296a54392875a35e4c0c4727bb7/contracts/utilities/poolsUtility/Position.sol#L526-L583>

### Tools Used

Hardhat

### Recommended Mitigation Steps

Consider rounding up in `_borrowLimit` when calculating `_desiredAmount`. Or consider not borrowing when `_lastBorrow` = 0 and modifying the logic of the rest of the code.

**[daoio (Rubicon) disagreed with severity and commented](https://github.com/code-423n4/2023-04-rubicon-findings/issues/281#issuecomment-1535866245):**
 > It's true, but leverage values seem too unrealistic to be used in real life (that's why I disagree with severity). Though, this finding reveals irrelevance of such huge precision for `leverage` param `$`=>`$`. Need to make it less precise.

**[HickupHH3 (judge) commented](https://github.com/code-423n4/2023-04-rubicon-findings/issues/281#issuecomment-1565304777):**
 > > but leverage values seem too unrealistic to be used in real life
> 
> No it isn't; the warden showed how using a leverage of 1.000000000000000001x ended up using a borrow amount of `252000`, whereas a leverage of 1.25x and 1.337x borrowed smaller amounts of `90000` and `121320` respectively.

***
