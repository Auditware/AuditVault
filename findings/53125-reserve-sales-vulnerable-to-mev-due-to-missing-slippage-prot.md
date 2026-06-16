---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - platform/cantina
  - has/poc
  - severity/high
  - impact/data-corruption/price-manipulation
  - impact/mev/frontrun
  - impact/mev/sandwich
  - trigger/price-manipulation
  - trigger/sandwich-attack
protocol: "[[Cork]]"
auditors:
  - "[[Sujith Somraaj]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_cork_december2024.pdf"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[frontrun]]"
  - "[[sandwich]]"
  - "[[trigger/price-manipulation]]"
  - "[[defi/sandwich-attack]]"
  - "[[debt-accrual-update]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[oracle-manipulation-resistance]]"
---
# Reserve sales vulnerable to MEV due to missing slippage protection in _sellDsReserve func- tion 

- id: 53125
- impact: HIGH
- protocol: [[Cork]]
- reporter: Sujith Somraaj (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_cork_december2024.pdf

## Summary


The FlashSwapRouter.sol code has a bug that can be exploited by malicious bots, causing a reduction in profits for liquidity providers and potential attacks on the protocol's reserve sales. This bug can be reproduced using a proof of concept file and can result in a 36% reduction in LP profits. The code has been fixed in a new version.

## Details

## FlashSwapRouter.sol Vulnerability Report

## Context
FlashSwapRouter.sol#L319

## Description
The `_sellDsReserve` function in `FlashSwapRouter.sol` lacks slippage protection when selling DS (Debt Swap) tokens from reserves, exposing protocol liquidity providers to value extraction through MEV sandwich attacks. In `_sellDsReserve`, DS tokens are sold without minimum output amount enforcement:

```solidity
(uint256 profitRa,, bool success) =
__swapDsforRa(assetPair, params.reserveId, params.dsId, params.amountSellFromReserve, 0, _moduleCore);
```

**No slippage check**

Some trades may trigger reserve sales when users swap RA (Redemption Asset) for DS (Debt Swap). Without slippage protection, MEV bots can manipulate the price before these reserve sales execute, reducing profits that should accrue to liquidity providers.

## Impact
- Reduced profits for liquidity providers due to MEV extraction.
- Protocol's reserve sales subject to sandwich attacks.
- Negative impact on protocol sustainability due to reduced LP returns.

## Proof of Concept
Copy the proof of concept file into the test folder and run it using the command:

```
forge test --mt test_e2e -vv
```

This will log the profit for LP with/without the front-running transactions. The following observations were made from the tests:

- Without front-running: LP profit: 0.739498973658705030 RA.
- With front-running: LP profit: 0.472218106264900239 RA.
- Result: ~36% reduction in LP profits.

## Solidity Code Snippet

```solidity
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.24;

import "./AuditTestHelper.sol";
import "forge-std/console.sol";
import {IDsFlashSwapCore} from "contracts/interfaces/IDsFlashSwapRouter.sol";
import {IVault} from "contracts/interfaces/IVault.sol";
import {PoolKey} from "v4-periphery/lib/v4-core/src/types/PoolKey.sol";
import {Currency} from "v4-periphery/lib/v4-core/src/types/Currency.sol";
import {CurrencySettler} from "v4-periphery/lib/v4-core/test/utils/CurrencySettler.sol";
import {IPoolManager} from "v4-periphery/lib/v4-core/src/interfaces/IPoolManager.sol";
import {IHooks} from "v4-periphery/lib/v4-core/src/interfaces/IHooks.sol";
import { BeforeSwapDelta } from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import "forge-std/console.sol";

struct CallbackData {
    bool buyDs;
    address caller;
    // CT or RA amount borrowed
    uint256 borrowed;
    // DS or RA amount provided
    uint256 provided;
    // DS/RA amount attributed to user
    uint256 attributed;
    Id reserveId;
    uint256 dsId;
}
```

### Contract MockUnlocker

```solidity
contract MockUnlocker {
    address hook;
    address manager;
    address ra;

    constructor(address corkHook, address poolManager, address redemptionAsset) {
        hook = corkHook;
        manager = poolManager;
        ra = redemptionAsset;
    }

    function unlockCallback(bytes memory data) external returns (bytes memory) {
        (
            address sender,
            PoolKey memory key,
            IPoolManager.SwapParams memory params,
            bytes memory hookData
        ) = abi.decode(
            data,
            (address, PoolKey, IPoolManager.SwapParams, bytes)
        );
        IPoolManager(manager).swap(key, params, hookData);
    }

    function CorkCall(
        address sender,
        bytes calldata data,
        uint256 paymentAmount,
        address paymentToken,
        address poolManager
    ) external {
        // CurrencySettler.take(Currency.wrap(ra), address(manager), address(this), 1e18, false);
    }
}
```

### Contract FlashSwapRouter

```solidity
contract FlashSwapRouter is TestHelper {
    MockUnlocker public unlocker;

    function setUp() public override {
        super.setUp();
        unlocker = new MockUnlocker(address(corkHook), address(manager), address(ra));
        console.log("unlocker", address(unlocker));
    }

    function test_e2e() public {
        deal(address(ra), user, type(uint256).max);
        deal(address(pa), user, 200e18);
        deal(address(ra), address(router), 200e18);
        deal(address(ra), address(unlocker), type(uint256).max);
        // console.log("----------- WITHOUT FRONT_RUNNING -------------");
        // internal_all(false);
        console.log("----------- WITH FRONT_RUNNING -------------");
        internal_all(true);
    }

    function internal_all(bool withfrontrunning) internal {
        (address ct, address ds) = moduleCore.swapAsset(defaultCurrencyId,
            moduleCore.lastDsId(defaultCurrencyId)); // ...
        vm.startPrank(user);
        // Additional code continues...
    }
}
```

## Recommendation
Consider adding slippage protection to reserve sales.

### Cork
Fixed in PR 280.
