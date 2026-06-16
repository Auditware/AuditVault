---
tags:
  - lang/solidity
  - platform/halborn
  - has/github
  - has/poc
  - severity/high
  - sector/oracle
protocol: "[[NLX]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/coredao/nlx"
genome:
  - "[[fee-calculation]]"
  - "[[direct-drain]]"
  - "[[pyth-oracle-completeness]]"
---
# Non-refunded excess fee in \_setPricesFromPriceFeed Function

- id: 50881
- impact: HIGH
- protocol: [[NLX]]
- reporter: Halborn
- source: https://www.halborn.com/audits/coredao/nlx

## Summary


The `_setPricesFromPriceFeeds` function in the smart contract does not refund the excess fee to the sender if the amount sent exceeds the actual update fee required by the Pyth network. This means that the sender may lose the excess amount they sent. To solve this issue, the CoreDAO team has added a refund mechanism within the function to return any excess amount back to the sender. This can be seen in the remediation hash <https://github.com/NLX-Protocol/nlx-synthetics/commit/c3853446a41e2e963e087f1c55ac935bfaeaa1a3>. 

## Details

##### Description

The `_setPricesFromPriceFeeds` function in the smart contract does not refund the excess fee to the sender if the amount sent (`msg.value`) exceeds the actual update fee (`updateFee`) required by the `pyth` price feed update.

  

The function `_setPricesFromPriceFeeds` is designed to update price feeds using an external oracle (Pyth network). The function retrieves the update fee using `pyth.getUpdateFee(pythUpdateData)` and checks if the `msg.value` provided by the sender covers this fee with the requirement `require(updateFee <= msg.value, "not enough funds to update price feeds");`. However, if `msg.value` exceeds `updateFee`, the surplus is not refunded back to the sender, effectively causing the sender to lose the excess amount.

  

```

    // @dev set prices using external price feeds to save costs for tokens with stable prices
    // @param dataStore DataStore
    // @param eventEmitter EventEmitter
    // @param tokens the tokens to set the prices using the price feeds for
    function _setPricesFromPriceFeeds(DataStore dataStore, EventEmitter eventEmitter, address[] memory tokens, bytes[] memory pythUpdateData) internal {
        uint updateFee = pyth.getUpdateFee(pythUpdateData);
        require(updateFee <= msg.value, "not enough funds to update price feeds");

        pyth.updatePriceFeeds{value: updateFee}(pythUpdateData);
...
}
```

##### Proof of Concept

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "ds-test/test.sol";
import "../src/PriceFeedUpdater.sol";
import "../src/Pyth.sol";
import "../src/EventEmitter.sol";

contract PriceFeedUpdaterTest is DSTest {
    PriceFeedUpdater updater;
    Pyth pyth;
    EventEmitter eventEmitter;
    address[] tokens;

    function setUp() public {
        pyth = new Pyth();
        eventEmitter = new EventEmitter();
        updater = new PriceFeedUpdater(address(pyth), address(eventEmitter));
    }

    function testExcessFeeRefund() public {
        uint sentAmount = 0.02 ether;
        uint updateFee = 0.01 ether;

        uint balanceBefore = address(this).balance;
        updater._setPricesFromPriceFeeds{value: sentAmount}(tokens, new bytes(0));
        uint balanceAfter = address(this).balance;

        assertEq(balanceBefore - balanceAfter, updateFee, "Excess fee was not refunded");
    }
}
St
```

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:N/A:M/D:N/Y:C/R:N/S:C (10.0)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:N/A:M/D:N/Y:C/R:N/S:C)

##### Recommendation

Implement a refund mechanism within the `_setPricesFromPriceFeeds` function to return any excess amount over the `updateFee` back to the sender.

  

### Remediation Plan

**SOLVED :** The **CoreDAO team** solved the issue by adding refund logic on the contracts.

##### Remediation Hash

<https://github.com/NLX-Protocol/nlx-synthetics/commit/c3853446a41e2e963e087f1c55ac935bfaeaa1a3>
