---
tags:
  - lang/solidity
  - sector/token
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/division-before-multiply
  - vuln/arithmetic/precision-loss
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Remora]]"
auditors:
  - "[[0xStalin]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-22-cyfrin-remora-dynamic-tokens-v2.1.md"
genome:
  - "[[division-before-multiply]]"
  - "[[precision-loss]]"
  - "[[indirect-loss]]"
  - "[[variant]]"
  - "[[integer-bounds]]"
---
# Divide before multiply loses precision in `FiveFiftyRule::_updateEntityAllowance` and leads to caps being exceeded

- id: 63780
- impact: HIGH
- protocol: [[Remora]] Dynamic Tokens
- reporter: 0xStalin (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-22-cyfrin-remora-dynamic-tokens-v2.1.md

## Summary


This report describes a bug in the `_updateEntityAllowance` function that can lead to a remaining allowance that is too high. This happens because the function calculates the amount by which the allowance should be reduced incorrectly. The impact of this bug is that when `add == true`, the new allowance will be significantly lower than it should be, which can be frustrating for investors. When `add == false`, the new allowance can be significantly higher than it should be, which means that investors who buy tokens and are part of an entity can exceed their cap. A proof of concept has been provided to demonstrate this bug. The recommended mitigation is to change the order of operators in the function. This bug has been fixed in the Remora project.

## Details

**Description:** The function `_updateEntityAllowance` contains
```solidity
(REMORA_PERCENT_DENOMINATOR / aData.equity) * amount
```

This should be `REMOTE_PERCENT_DENOMINATOR * amount / aData.equity` otherwise precision loss occurs.

Since `_updateEntityAllowance` is used to calculate the amount by which the allowance should be reduced by when `add == false` this issue actually results in a remaining allowance that is too high.

**Impact:** When `add == true` the new allowance will be significantly lower than it should be, which will just be frustrating to investors.
When `add == false` the new allowance can be significantly higher than it should be, which means that investors that individually buy tokens _and_ are part of an entity can exceed their cap.

**Proof of Concept:**
1. First fix the bug in `canTransfer` because it obscures this bug

```diff
@@ -505,16 +505,16 @@ contract FiveFiftyRule is UUPSUpgradeable, AccessManagedUpgradeable {
         // to side changes
         if (to != address(0)) {
             IndividualData storage iTo = individualData[to];
-
+
             if (iTo.isEntity) { // if entity
-                if (entityData[to].allowance <= amount) {
-                    entityData[to].allowance -= SafeCast.toUint64(amount);
+                if (entityData[to].allowance >= amount) {
+                    entityData[to].allowance -= SafeCast.toUint64(amount);

                     iTo.lastBalance += SafeCast.toUint64(amount);
                     emit FiveFiftyApproved(from, to, amount);
                     return true;
                 } else revert ();
```

2. Now add the file below and run the test. In the console output you will see:

```
*** INVARIANT VIOLATED ***
  exposure:   1200001000000
  cap amount: 1000000000000
```

The file's source code is:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "forge-std/console2.sol";
import {RemoraTestBase} from "../RemoraTestBase.sol";
import {FiveFiftyRule} from "../../../contracts/Compliance/FiveFiftyRule.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {SafeCast} from "@openzeppelin/contracts/utils/math/SafeCast.sol";


contract FiveFiftyRule_RoundingPoC is RemoraTestBase {
    FiveFiftyRule internal fiveFiftyRule;

    // helpers (same as your math discussion)
    uint256 constant DENOM = 1_000_000;

    function setUp() public override {
        RemoraTestBase.setUp();

        // Deploy rule and initialize
        fiveFiftyRule = FiveFiftyRule(address(new ERC1967Proxy(address(new FiveFiftyRule()), "")));
        fiveFiftyRule.initialize(address(accessMgrProxy), 0);

        // Allow our test to call restricted functions on fiveFiftyRule and child
        bytes4[] memory sel = new bytes4[](1);
        sel[0] = FiveFiftyRule.addToken.selector;
        accessMgrProxy.setTargetFunctionRole(address(fiveFiftyRule), sel, ADMIN_TOKEN_ID);
        accessMgrProxy.grantRole(ADMIN_TOKEN_ID, address(this), 0);

        bytes4[] memory cs = new bytes4[](2);
        cs[0] = bytes4(keccak256("setFiveFiftyCompliance(address)"));
        cs[1] = bytes4(keccak256("setLockUpTime(uint32)"));
        accessMgrProxy.setTargetFunctionRole(address(d_childTokenProxy), cs, ADMIN_TOKEN_ID);

        // Wire fiveFiftyRule to domestic child; remove lockup
        d_childTokenProxy.setFiveFiftyCompliance(address(fiveFiftyRule));
        d_childTokenProxy.setLockUpTime(0);
    }

    function test_RoundingDown_Allows_ExtraEntityToken_ExceedingLookThroughCap() public {
        // --------------------
---
---
        // Parameters we use for the PoC
        // --------------------
---
---
        // Total supply: large, so we can transfer a very large amount to the catalyst without violating the cap.
        // We'll target a 50% cap for the catalyst (to leave room for a huge direct transfer).
        uint64 totalSupply = 10_000_000;
        uint32 capPercent = 100_000;
        uint64 capAmountMicros = totalSupply * capPercent;

        uint64 equityMu = 333_334;
        uint256 ENTITY_BAL = 1_500_000;
        uint256 CATALYST_BAL = 700_000;

        centralTokenProxy.mint(address(this), totalSupply);
        fiveFiftyRule.addToken(address(centralTokenProxy));

        // Choose a catalyst (a domestic user) and an entity address
        address entity = getDomesticUser(0);
        address catalyst = getDomesticUser(1);
        address otherInvestor = getDomesticUser(2); // will never directly own any tokens in this example
        address[] memory investors = new address[](2);
        investors[0] = catalyst;
        investors[1] = otherInvestor;

        bytes4[] memory psel = new bytes4[](1);
        psel[0] = bytes4(keccak256("setMaxPercentIndividual(address,uint32)"));
        accessMgrProxy.setTargetFunctionRole(address(fiveFiftyRule), psel, ADMIN_TOKEN_ID);
        fiveFiftyRule.setMaxPercentIndividual(catalyst, capPercent);


        bytes4[] memory esel = new bytes4[](2);
        esel[0] = bytes4(keccak256("createEntity(address,address,uint64,uint64,address[])"));
        esel[1] = bytes4(keccak256("setCatalyst(bool,address,address,uint64,uint64)"));
        accessMgrProxy.setTargetFunctionRole(address(fiveFiftyRule), esel, ADMIN_TOKEN_ID);


        uint64 calculatedAllowance = SafeCast.toUint64(totalSupply * 1e6 * capPercent / equityMu);
        console2.log("calculatedAllowance: %s", calculatedAllowance);

        // Check that allowance is correct
        uint256 userProportion = calculatedAllowance * equityMu / 1e6;
        assertEq(userProportion, capAmountMicros - 1);

        uint256 exposure = uint256(ENTITY_BAL)* 1e6 * equityMu / 1e6 + CATALYST_BAL * 1e6;

        console2.log("\n\n*** INVARIANT VIOLATED ***");
        console2.log("exposure:   %s", exposure);
        console2.log("cap amount: %s\n\n", capAmountMicros);
        assertGe(exposure, capAmountMicros);



        fiveFiftyRule.createEntity(entity, catalyst, equityMu, calculatedAllowance, investors);
        centralTokenProxy.dynamicTransfer(entity, ENTITY_BAL);
        logEntity("0", entity);
        logIndividual("entity 0", entity);
        logIndividual("catalyst 0", catalyst);

        centralTokenProxy.dynamicTransfer(catalyst, CATALYST_BAL);
        logEntity("1", entity);
        logIndividual("entity 1", entity);
        logIndividual("catalyst 1", catalyst);

    }

    function logEntity(string memory s, address entity) internal view {
        FiveFiftyRule.EntityData memory ed = fiveFiftyRule.testing_entityData(entity);
        console2.log("---  EntityData %s ---", s );
        console2.log("catalyst:     %s", ed.catalyst);
        console2.log("equity:       %s", ed.equity);
        console2.log("allowance:    %s", ed.allowance);
    }

    function logIndividual(string memory s, address individual) internal view {
        FiveFiftyRule.IndividualData memory id = fiveFiftyRule.testing_individualData(individual);
        console2.log("---  IndividualData %s ---", s);
        console2.log("isEntity:         %s", id.isEntity);
        console2.log("numCatalyst:      %s", id.numCatalyst);
        console2.log("groupId:          %s", id.groupId);
        console2.log("customMaximum:    %s", id.customMaximum);
        console2.log("lastBalance:      %s", id.lastBalance);

    }
}
```

**Recommended Mitigation:** Change the order of operators to `REMOTE_PERCENT_DENOMINATOR * amount / aData.equity`

**Remora:** Fixed at commit [de9a89a](https://github.com/remora-projects/remora-dynamic-tokens/commit/de9a89a5eca6a5c9089bc07904662b8a64556dea)

**Cyfrin:** Verified. Update order of operations, now, first multiply then divide.
