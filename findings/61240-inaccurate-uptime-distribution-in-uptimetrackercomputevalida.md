---
tags:
  - lang/solidity
  - sector/lending
  - sector/oracle
  - sector/staking
  - platform/cyfrin
  - has/github
  - severity/high
protocol: "[[Suzaku Core]]"
auditors:
  - 0kage
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-07-cyfrin-suzaku-core-v2.0.md"
genome:
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# Inaccurate uptime distribution in `UptimeTracker::computeValidatorUptime` leads to reward discrepancies

- id: 61240
- impact: HIGH
- protocol: Suzaku Core
- reporter: 0kage (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-07-cyfrin-suzaku-core-v2.0.md

## Summary


The `UptimeTracker::computeValidatorUptime` function has a flaw where it does not check if a validator was actually active during each epoch when calculating their uptime. This can result in incorrect uptime attribution and lead to financial loss for validators, unfair reward distribution, and reduced trust in the system. A proof of concept has been provided to demonstrate this vulnerability. To mitigate this issue, it is recommended to refine the uptime attribution logic, implement epoch-specific uptime tracking, and integrate with external sources for validator activity data. By implementing these measures, the platform can ensure accurate uptime tracking and maintain trust among validators and users.

## Details

**Description:** The `UptimeTracker::computeValidatorUptime` function calculates a validator's uptime by evenly distributing the total recorded uptime across all epochs between the last checkpoint and the current epoch. However, it does not verify whether the validator was actually active during each of those epochs. As a result, uptime may be incorrectly attributed to epochs where the validator was offline or inactive.

This flaw becomes significant when the uptime data is used by the `Rewards` contract to determine validator rewards. Since reward values can differ substantially between epochs, attributing uptime to the wrong epochs can misrepresent a validator's actual contribution. For instance, if a validator was active for 4 hours in epoch 2 (which has a higher reward rate) but the uptime is split equally between epoch 1 (lower rewards) and epoch 2, the validator’s reward calculation will not reflect their true activity, leading to inaccurate reward distribution.

**Impact:**
- **Financial Loss for Validators:** Validators may receive fewer rewards than they deserve if their uptime is credited to epochs with lower reward rates instead of the epochs where they were genuinely active.
- **Unfair Reward Distribution:** The system could inadvertently reward validators for epochs in which they were not active, potentially encouraging exploitative behavior or penalizing honest participants.
- **Reduced System Integrity:** Inaccurate uptime tracking erodes trust in the reward mechanism, as validators and users may question the fairness and reliability of the platform.

**Proof of Concept:**
1. Add the following lines to the `MockWarpMessenger.sol` file:
```diff
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.25;

import {
    IWarpMessenger,
    WarpMessage,
    WarpBlockHash
} from "@avalabs/subnet-evm-contracts@1.2.0/contracts/interfaces/IWarpMessenger.sol";
import {ValidatorMessages} from "@avalabs/icm-contracts/validator-manager/ValidatorMessages.sol";

contract MockWarpMessenger is IWarpMessenger {
    // Constants for uptime values from tests
    uint64 constant TWO_HOURS = 2 * 60 * 60;
    uint64 constant THREE_HOURS = 3 * 60 * 60;
    uint64 constant ONE_HOUR = 1 * 60 * 60;
    uint64 constant FOUR_HOURS = 4 * 60 * 60;
    uint64 constant FIVE_HOURS = 5 * 60 * 60;
    uint64 constant SEVEN_HOURS = 7 * 60 * 60;
    uint64 constant SIX_HOURS = 6 * 60 * 60;
    uint64 constant TWELVE_HOURS = 12 * 60 * 60;
    uint64 constant ZERO_HOURS = 0;

    // Hardcoded full node IDs based on previous test traces/deterministic generation
    // These values MUST match what operatorNodes would be in UptimeTrackerTest.setUp()
    // from your MockAvalancheL1Middleware.
    // If MockAvalancheL1Middleware changes its node generation, these must be updated.
    bytes32 constant OP_NODE_0_FULL = 0xe917244df122a1996142a1cd6c7269c136c20f47acd1ff079ee7247cae2f45c5;
    bytes32 constant OP_NODE_1_FULL = 0x69e183f32216866f48b0c092f70d99378e18023f7185e52eeee2f5bbd5255293;
    bytes32 constant OP_NODE_2_FULL = 0xfcc09d5775472c6fa988b216f5ce189894c14e093527f732b9b65da0880b5f81;

    // Constructor is now empty as we are not storing operatorNodes passed from test.
    // constructor() {} // Can be omitted for an empty constructor

    function getDerivedValidationID(bytes32 fullNodeID) internal pure returns (bytes32) {
        // Corrected conversion: bytes32 -> uint256 -> uint160 -> uint256 -> bytes32
        return bytes32(uint256(uint160(uint256(fullNodeID))));
    }

    function getVerifiedWarpMessage(
        uint32 messageIndex
    ) external view override returns (WarpMessage memory, bool) {
        // The 'require' for _operatorNodes.length is removed.

        bytes32 derivedNode0ID = getDerivedValidationID(OP_NODE_0_FULL);
        bytes32 derivedNode1ID = getDerivedValidationID(OP_NODE_1_FULL);
        bytes32 derivedNode2ID = getDerivedValidationID(OP_NODE_2_FULL);
        bytes memory payload;

        // test_ComputeValidatorUptime & test_ValidatorUptimeEvent
        if (messageIndex == 0) {
            payload = ValidatorMessages.packValidationUptimeMessage(derivedNode0ID, TWO_HOURS);
        } else if (messageIndex == 1) {
            payload = ValidatorMessages.packValidationUptimeMessage(derivedNode0ID, THREE_HOURS);
        }
        // test_ComputeOperatorUptime - first epoch (0) & test_OperatorUptimeEvent
        else if (messageIndex == 2) {
            payload = ValidatorMessages.packValidationUptimeMessage(derivedNode0ID, TWO_HOURS);
        } else if (messageIndex == 3) {
            payload = ValidatorMessages.packValidationUptimeMessage(derivedNode1ID, THREE_HOURS);
        } else if (messageIndex == 4) {
            payload = ValidatorMessages.packValidationUptimeMessage(derivedNode2ID, ONE_HOUR);
        }
        // test_ComputeOperatorUptime - second epoch (1)
        else if (messageIndex == 5) {
            payload = ValidatorMessages.packValidationUptimeMessage(derivedNode0ID, FOUR_HOURS);
        } else if (messageIndex == 6) {
            payload = ValidatorMessages.packValidationUptimeMessage(derivedNode1ID, FOUR_HOURS);
        } else if (messageIndex == 7) {
            payload = ValidatorMessages.packValidationUptimeMessage(derivedNode2ID, FOUR_HOURS);
        }
        // test_ComputeOperatorUptime - third epoch (2)
        else if (messageIndex == 8) {
            payload = ValidatorMessages.packValidationUptimeMessage(derivedNode0ID, FIVE_HOURS);
        } else if (messageIndex == 9) {
            payload = ValidatorMessages.packValidationUptimeMessage(derivedNode1ID, SEVEN_HOURS);
        } else if (messageIndex == 10) {
            payload = ValidatorMessages.packValidationUptimeMessage(derivedNode2ID, SIX_HOURS);
        }
        // test_EdgeCases
        else if (messageIndex == 11) {
            payload = ValidatorMessages.packValidationUptimeMessage(derivedNode0ID, FOUR_HOURS); // EPOCH_DURATION
        } else if (messageIndex == 12) {
            payload = ValidatorMessages.packValidationUptimeMessage(derivedNode1ID, ZERO_HOURS);
        } else if (messageIndex == 13) {
            payload = ValidatorMessages.packValidationUptimeMessage(derivedNode0ID, TWELVE_HOURS); // 3 * EPOCH_DURATION
+        } else if (messageIndex == 14) {
+            payload = ValidatorMessages.packValidationUptimeMessage(derivedNode0ID, ZERO_HOURS);
+        } else if (messageIndex == 15) {
+            payload = ValidatorMessages.packValidationUptimeMessage(derivedNode2ID, ZERO_HOURS);
+        } else if (messageIndex == 16) {
+            payload = ValidatorMessages.packValidationUptimeMessage(derivedNode0ID, FOUR_HOURS);
+        } else if (messageIndex == 17) {
+            payload = ValidatorMessages.packValidationUptimeMessage(derivedNode2ID, FOUR_HOURS);
        } else {
            return (WarpMessage({sourceChainID: bytes32(uint256(1)), originSenderAddress: address(0), payload: new bytes(0)}), false);
        }

        return (
            WarpMessage({
                sourceChainID: bytes32(uint256(1)),
                originSenderAddress: address(0),
                payload: payload
            }),
            true
        );
    }

    function sendWarpMessage(
        bytes memory // message
    ) external pure override returns (bytes32) { // messageID
        return bytes32(0);
    }

    function getBlockchainID() external pure override returns (bytes32) {
        return bytes32(uint256(1));
    }

    function getVerifiedWarpBlockHash(
        uint32 // messageIndex
    ) external pure override returns (WarpBlockHash memory warpBlockHash, bool valid) {
        warpBlockHash = WarpBlockHash({sourceChainID: bytes32(uint256(1)), blockHash: bytes32(0)});
        valid = true;
    }
}
```

2. Update the `UptimeTrackerTest.t.sol` file:
```diff
// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: Copyright 2024 ADDPHO
pragma solidity 0.8.25;

import {Test} from "forge-std/Test.sol";
import {console2} from "forge-std/console2.sol";
import {UptimeTracker} from "../../src/contracts/rewards/UptimeTracker.sol";
import {IUptimeTracker, LastUptimeCheckpoint} from "../../src/interfaces/rewards/IUptimeTracker.sol";
import {ValidatorMessages} from "@avalabs/icm-contracts/validator-manager/ValidatorMessages.sol";
import {MockAvalancheL1Middleware} from "../mocks/MockAvalancheL1Middleware.sol";
import {MockBalancerValidatorManager} from "../mocks/MockBalancerValidatorManager2.sol";
import {MockWarpMessenger} from "../mocks/MockWarpMessenger.sol";
import {WarpMessage, IWarpMessenger} from "@avalabs/subnet-evm-contracts@1.2.0/contracts/interfaces/IWarpMessenger.sol";
import {Rewards} from "../../src/contracts/rewards/Rewards.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";

contract UptimeTrackerTest is Test {
    UptimeTracker public uptimeTracker;
    MockBalancerValidatorManager public validatorManager;
    MockAvalancheL1Middleware public middleware;
    MockWarpMessenger public warpMessenger;
+    Rewards public rewards;
+    ERC20Mock public rewardsToken;

    address public operator;
    bytes32[] public operatorNodes;
    uint48 constant EPOCH_DURATION = 4 hours;
    address constant WARP_MESSENGER_ADDR = 0x0200000000000000000000000000000000000005;
    bytes32 constant L1_CHAIN_ID = bytes32(uint256(1));
+    address constant ADMIN = address(0x1);
+    address constant REWARDS_DISTRIBUTOR = address(0x2);

    event ValidatorUptimeComputed(bytes32 indexed validationID, uint48 indexed firstEpoch, uint256 uptimeSecondsAdded, uint256 numberOfEpochs);
    event OperatorUptimeComputed(address indexed operator, uint48 indexed epoch, uint256 uptime);

    function getDerivedValidationID(bytes32 fullNodeID) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(uint256(fullNodeID))));
    }

    function setUp() public {
        uint256[] memory nodesPerOperator = new uint256[](1);
        nodesPerOperator[0] = 3;

        validatorManager = new MockBalancerValidatorManager();
        middleware = new MockAvalancheL1Middleware(1, nodesPerOperator, address(validatorManager), address(0));
        uptimeTracker = new UptimeTracker(payable(address(middleware)), L1_CHAIN_ID);

        operator = middleware.getAllOperators()[0];
        operatorNodes = middleware.getActiveNodesForEpoch(operator, 0);

        warpMessenger = new MockWarpMessenger();
        vm.etch(WARP_MESSENGER_ADDR, address(warpMessenger).code);

+        rewards = new Rewards();
+        rewards.initialize(
+            ADMIN,
+            ADMIN,
+            payable(address(middleware)),
+            address(uptimeTracker),
+            1000, // protocolFee
+            2000, // operatorFee
+            1000, // curatorFee
+            11_520 // minRequiredUptime
+        );
+        vm.prank(ADMIN);
+        rewards.setRewardsDistributorRole(REWARDS_DISTRIBUTOR);

+        rewardsToken = new ERC20Mock();
+        rewardsToken.mint(REWARDS_DISTRIBUTOR, 1_000_000 * 10**18);
+        vm.prank(REWARDS_DISTRIBUTOR);
+        rewardsToken.approve(address(rewards), 1_000_000 * 10**18);
    }

	...
}
```

3. Add the following test to the `UptimeTrackerTest.t.sol` file:
```solidity
function test_IncorrectUptimeDistributionWithRewards() public {
	bytes32 derivedNode1ID = getDerivedValidationID(operatorNodes[1]);

	// Warp to epoch 1
	vm.warp(EPOCH_DURATION + 1);
	uptimeTracker.computeValidatorUptime(14); // uptime = 0 hours, node 0
	uptimeTracker.computeValidatorUptime(12); // uptime = 0 hours, node 1
	uptimeTracker.computeValidatorUptime(15); // uptime = 0 hours, node 2

	// Warp to epoch 3
	vm.warp(3 * EPOCH_DURATION + 1);
	uptimeTracker.computeValidatorUptime(16); // uptime = 4 hours, node 0
	uptimeTracker.computeValidatorUptime(6); // uptime = 4 hours, node 1
	uptimeTracker.computeValidatorUptime(17); // uptime = 4 hours, node 2

	// Check uptime distribution
	uint256 uptimeEpoch1 = uptimeTracker.validatorUptimePerEpoch(1, derivedNode1ID);
	uint256 uptimeEpoch2 = uptimeTracker.validatorUptimePerEpoch(2, derivedNode1ID);
	assertEq(uptimeEpoch1, 2 * 3600, "Epoch 1 uptime should be 2 hours");
	assertEq(uptimeEpoch2, 2 * 3600, "Epoch 2 uptime should be 2 hours");

	// Set different rewards for epochs 1 and 2
	uint48 startEpoch = 1;
	uint256 rewardsAmountEpoch1 = 10000 * 10**18;
	uint256 rewardsAmountEpoch2 = 20000 * 10**18;

	vm.startPrank(REWARDS_DISTRIBUTOR);
	rewards.setRewardsAmountForEpochs(startEpoch, 1, address(rewardsToken), rewardsAmountEpoch1);
	rewards.setRewardsAmountForEpochs(startEpoch + 1, 1, address(rewardsToken), rewardsAmountEpoch2);

	// Compute operator uptime
	uptimeTracker.computeOperatorUptimeAt(operator, 1);
	uptimeTracker.computeOperatorUptimeAt(operator, 2);

	// Distribute rewards
	vm.warp(5 * EPOCH_DURATION + 1);
	rewards.distributeRewards(1, 10);
	rewards.distributeRewards(2, 10);
	vm.stopPrank();

	// Set stakes for simplicity (assume operator has full stake)
	uint256 totalStake = 1000 * 10**18;
	middleware.setTotalStakeCache(1, 1, totalStake);
	middleware.setTotalStakeCache(2, 1, totalStake);
	middleware.setOperatorStake(1, operator, 1, totalStake);
	middleware.setOperatorStake(2, operator, 1, totalStake);

	vm.prank(ADMIN);
	rewards.setRewardsShareForAssetClass(1, 10000); // 100%
	vm.stopPrank();

	// Calculate expected rewards (active only in epoch 2)
	uint256 expectedUptimeEpoch1 = 0;
	uint256 expectedUptimeEpoch2 = 4 * 3600;
	uint256 totalUptimePerEpoch = 4 * 3600;
	uint256 expectedRewardsEpoch1 = (expectedUptimeEpoch1 * rewardsAmountEpoch1) / totalUptimePerEpoch;
	uint256 expectedRewardsEpoch2 = (expectedUptimeEpoch2 * rewardsAmountEpoch2) / totalUptimePerEpoch;
	uint256 totalExpectedRewards = expectedRewardsEpoch1 + expectedRewardsEpoch2;

	// Calculate actual rewards
	uint256 actualUptimeEpoch1 = uptimeEpoch1;
	uint256 actualUptimeEpoch2 = uptimeEpoch2;
	uint256 totalActualUptimePerEpoch = actualUptimeEpoch1 + actualUptimeEpoch2;
	uint256 actualRewardsEpoch1 = (actualUptimeEpoch1 * rewardsAmountEpoch1) / totalActualUptimePerEpoch;
	uint256 actualRewardsEpoch2 = (actualUptimeEpoch2 * rewardsAmountEpoch2) / totalActualUptimePerEpoch;
	uint256 totalActualRewards = actualRewardsEpoch1 + actualRewardsEpoch2;

	// Assert the discrepancy
	assertEq(totalActualUptimePerEpoch, totalUptimePerEpoch, "Total uptime in both cases is the same");
	assertLt(totalActualRewards, totalExpectedRewards, "Validator receives fewer rewards due to incorrect uptime distribution");
}
```

**Recommended Mitigation:** To resolve this vulnerability and ensure accurate uptime tracking and reward distribution, the following measures are recommended:

1. **Refine Uptime Attribution Logic:**
   Update the `computeValidatorUptime` function to attribute uptime only to epochs where the validator was confirmed active. This could involve cross-referencing validator activity logs or status flags to validate participation in each epoch.

2. **Implement Epoch-Specific Uptime Tracking:**
   Modify the contract to record and calculate uptime individually for each epoch, based on the validator’s actual activity during that period. While this may require more detailed data storage, it ensures precision in uptime attribution.

3. **Integrate with Validator Activity Data:**
   If possible, connect the contract to external sources (e.g., oracles or on-chain activity records) that provide real-time or historical data on validator status. This would enable the system to accurately determine when a validator was active.

By applying these mitigations, the platform can achieve accurate uptime tracking, ensure fair reward distribution, and maintain trust among validators and users.

**Suzaku:**
Acknowledged.

**Cyfrin:** Acknowledged.

\clearpage
