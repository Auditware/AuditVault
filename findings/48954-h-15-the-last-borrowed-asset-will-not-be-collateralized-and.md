---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/lending
  - sector/stable
  - sector/uncollat-lending
protocol: "[[Rubicon]]"
auditors:
  - "[[cccz]]"
report: "https://code4rena.com/reports/2023-04-rubicon"
genome:
  - "[[liquidation-logic]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
---
# [H-15] The last borrowed asset will not be collateralized and the user may be liquidated due to insufficient collateral

- id: 48954
- impact: HIGH
- protocol: [[Rubicon]]
- reporter: cccz (Code4rena)
- source: https://code4rena.com/reports/2023-04-rubicon

## Summary


The bug report describes an issue in a code that is used to open leveraged positions. The code uses a recursive borrowing loop, but the last borrowed asset is not collateralized. This means that if the price of the asset drops, the user may be liquidated. The report includes a proof of concept and recommends a mitigation step to collateralize the remaining assets in the contract. The tool used for testing is Hardhat. The bug has been confirmed by the Rubicon team and they have provided a solution to fix it. 

## Details


All leveraged positions are opened by simple recursive borrowing loop (supply collateral → borrow → swap → repeat).
The issue here is that the last borrowed asset will not be collateralized.

```solidity
    function _borrowLoop(
        address _asset,
        address _quote,
        address _bathTokenAsset,
        address _bathTokenQuote,
        uint256 _amount,
        uint256 _toBorrow
    ) internal returns (uint256 _bathTokenAmount) {
        // supply collateral
        _bathTokenAmount = _supply(_asset, _bathTokenAsset, _amount);

        // calculate how much is needed to borrow from _maxBorrow amount
        //_toBorrow = (_maxBorrow(_bathTokenQuote).mul(_toBorrow)).div(WAD);
        _toBorrow = wmul(_maxBorrow(_bathTokenQuote), _toBorrow);

        // swap borrowed quote tokens to asset tokens
        _borrow(_bathTokenQuote, _toBorrow);
        _rubiconSwap(_asset, _quote, _toBorrow, true);
    }
...
            // increase bathToken amount in order to save it in positions map
            vars.currentBathTokenAmount += _borrowLoop(
                asset,
                quote,
                bathTokenAsset,
                bathTokenQuote,
                vars.currentAssetBalance,
                vars.toBorrow
            );
        }
```

Consider the WBTC collateralization rate is 0.7.

Alice uses 1e8 WBTC and 1.7x leverage to long WBTC

In `_borrowLoop`, 1e8 WBTC is collateralized and borrowed to USDC, and 0.7e8 WBTC is purchased using USDC, and the 0.7e8 WBTC is uncollateralized. At this point, the user's collateral is 1e8 WBTC and the borrowed USDC is worth 0.7e8 WBTC. If the price of WBTC drops slightly, the user will be liquidated.

The POC below indicates the purchased WBTC is not collateralized:

```
    describe("Long positions 📈", function () {
      it("POC1", async function () {
        const { owner, testCoin, testStableCoin, Position } = await loadFixture(
          deployPoolsUtilityFixture
        );
        const TEST_AMOUNT_1 = parseUnits("1");
        const x1_7 = parseUnits("1.7");

        await Position.connect(owner).buyAllAmountWithLeverage(
          testCoin.address,
          testStableCoin.address,
          TEST_AMOUNT_1,
          x1_7
        );

        const position = await Position.positions(1);

        console.log("borrowedAmount1 : %s",position[2]);
        console.log("testCoin balance in position : %s",await testCoin.balanceOf(Position.address));
      });
```

```
  Leverage positions Test
    Pools Utility Test
      Long positions 📈
borrowedAmount1 : 630000
testCoin balance in position : 692923770693000000
```

### Proof of Concept

<https://github.com/code-423n4/2023-04-rubicon/blob/511636d889742296a54392875a35e4c0c4727bb7/contracts/utilities/poolsUtility/Position.sol#L251-L269> <br><https://github.com/code-423n4/2023-04-rubicon/blob/511636d889742296a54392875a35e4c0c4727bb7/contracts/utilities/poolsUtility/Position.sol#L183-L192>

### Tools Used

Hardhat

### Recommended Mitigation Steps

When the loop in `openPosition` ends, collateralize the remaining assets in the contract.

```diff
            vars.currentBathTokenAmount += _borrowLoop(
                asset,
                quote,
                bathTokenAsset,
                bathTokenQuote,
                vars.currentAssetBalance,
                vars.toBorrow
            );
        }
+       vars.currentBathTokenAmount += _supply(asset, bathTokenAsset, IERC20(asset).balanceOf(address(this));
        /// @dev save total borrow amount of this current position
        vars.borrowedAmount = (borrowBalance(bathTokenQuote)).sub(
            vars.borrowedAmount
        );
```

**[daoio (Rubicon) confirmed](https://github.com/code-423n4/2023-04-rubicon-findings/issues/423#issuecomment-1547174044)**

***
