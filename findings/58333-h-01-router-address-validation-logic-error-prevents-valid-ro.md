---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/dex
  - sector/governance
  - platform/code4rena
protocol: "[[Audit 507]]"
auditors:
  - AvantGard
report: "https://code4rena.com/reports/2025-05-blackhole"
genome:
  - "[[access-roles]]"
  - "[[proxy-initialization]]"
  - "[[logic/wrong-condition]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[known-pattern]]"
  - "[[privileged-tx]]"
  - "[[add-check]]"
  - "[[blast-radius/single-pool]]"
---
# [H-01] Router address validation logic error prevents valid router assignment

- id: 58333
- impact: HIGH
- protocol: Audit 507
- reporter: AvantGard (Code4rena)
- source: https://code4rena.com/reports/2025-05-blackhole

## Summary


This bug report discusses a logical flaw in the `setRouter` function within the `GenesisPoolManager` contract. The function is intended to allow the contract owner to modify the address of the `router` contract, which is crucial for interacting with the decentralized exchange during the launch of a `GenesisPool`. However, the current condition in the `require` statement only allows the owner to set the `router` address to `address(0)`, which is a problem as it does not permit updating it to a new, functional router address. This can lead to several adverse consequences, including the inability to update the router to a functional address, potential blocking of new pool launches, and a dependency on correct initial configuration. The severity of this bug is high as it directly impacts a core functionality of the system. The recommended mitigation step is to correct the condition in the `require` statement to allow setting a non-null router address. A proof of concept is provided to demonstrate the flawed logic and its consequences. The bug has been mitigated in the latest version of the contract. 

## Details



<https://github.com/code-423n4/2025-05-blackhole/blob/92fff849d3b266e609e6d63478c4164d9f608e91/contracts/GenesisPoolManager.sol# L314>

### Finding description

The `setRouter(address _router)` function within the `GenesisPoolManager` contract is intended to allow the contract owner (`owner`) to modify the address of the `router` contract. This router is crucial for interacting with the decentralized exchange (DEX) when adding liquidity during the launch of a `GenesisPool`. However, the function contains a logical flaw in its `require` statement:
```

function setRouter (address _router) external onlyOwner {
    require(_router == address(0), "ZA"); // <<< LOGICAL ERROR HERE
    router = _router;
}
```

The line `require(_router == address(0), "ZA");` currently mandates that the `_router` address provided as an argument *must be* the zero address (`address(0)`). If any other address (i.e., a valid, non-zero router address) is supplied, the condition `_router == address(0)` will evaluate to false, and the transaction will revert with the error message “ZA” (presumably “Zero Address”).

This means the `setRouter` function’s behavior is inverted from what its name and intended purpose imply:

* **Current Behavior:** It only allows the `owner` to set the `router` state variable to `address(0)`. It does not permit updating it to a new, functional router address.
* **Expected Behavior (based on name and usage):** It should allow the `owner` to set the `router` state variable to a new, valid, non-zero router address, likely with a check ensuring `_router` is not `address(0)` (i.e., `require(_router != address(0), "ZA");`).

### Root Cause

The root cause of the issue is an incorrect condition in the `require` statement. The developer likely intended either to ensure a non-null router address was not being set (if such a check was desired for some specific reason, though unlikely for a setter) or, probably, to ensure a non-null address *was* being set. Instead, the implemented condition only permits setting a null address.

### Impact

The impact of this logical error is significant and can lead to several adverse consequences:

1. **Inability to update the router to a functional address:**

   * If the `router` address is initially set during the `GenesisPoolManager` contract’s initialization (via the `initialize` function) and subsequently needs to be changed (e.g., due to a DEX router upgrade, an error in the initial configuration, or the deployment of a new router version), the current `setRouter` function will prevent this update to a functional address. The `owner` would only be able to “clear” the router address by setting it to `address(0)`.
2. **Potential blocking of new pool launches (`_launchPool`):**

   * The internal `_launchPool` function in `GenesisPoolManager` is responsible for finalizing a `GenesisPool`’s process and adding liquidity. This function calls `IGenesisPool(_genesisPool).launch(router, MATURITY_TIME)`, passing the `router` address stored in `GenesisPoolManager`.
   * If the `router` address in `GenesisPoolManager` is `address(0)` (either because it was mistakenly set that way initially or because the `owner` used `setRouter` to “clear” it), the call to `IGenesisPool.launch` will attempt to interact with an `IRouter(address(0))`.
   * Function calls to `address(0)` typically fail or behave unpredictably (depending on low-level Solidity/EVM implementation details, but practically, they will fail when trying to execute non-existent code or decode empty return data). This will cause the `GenesisPool`’s `launch` function to fail, and consequently, the `GenesisPoolManager`’s `_launchPool` function will also fail.
   * As a result, no new `GenesisPool` reaching the launch stage can be successfully launched if the router address is `address(0)`. Funds intended for liquidity (both `nativeToken` and `fundingToken`) could become locked in the `GenesisPool` contract indefinitely, or until an alternative solution is implemented (if possible via governance or contract upgradeability).
3. **Dependency on correct initial configuration:**

   * The system becomes overly reliant on the `router` address being perfectly configured during the `initialize` call. If there’s a typo or an incorrect address is provided, there is no way to correct it via `setRouter` unless the contract is upgradeable and the `setRouter` logic itself is updated.
4. **Misleading functionality:**

   * The function name `setRouter` is misleading, as it doesn’t “set” a functional router but rather only “clears” it (sets it to `address(0)`). This can lead to administrative errors and confusion.

### Severity

High. Although the function is only accessible by the `owner`, its malfunction directly impacts a core functionality of the system (pool launching and liquidity provision). If the router needs to be changed or is misconfigured, this vulnerability can halt a critical part of the protocol.

### Recommended mitigation steps

The condition in the `setRouter` function must be corrected to allow setting a non-null router address. The more common and expected logic would be:
```

function setRouter (address _router) external onlyOwner {
    require(_router != address(0), "ZA"); // CORRECTION: Ensure the new router is not the zero address.
    router = _router;
}
```

This correction would enable the `owner` to update the `router` address to a new, valid address, ensuring the operational continuity and flexibility of the `GenesisPoolManager`.

### Proof of Concept

1. Deploy a mock `GenesisPoolManager`.
2. Deploy mock contracts for `IRouter` (just to have distinct addresses).
3. Show that the `owner` *cannot* set a new, non-zero router address.
4. Show that the `owner` *can* set the router address to `address(0)`.
5. Illustrate (conceptually, as a full launch is complex) how a zero router address would break the `_launchPool` (or rather, the `launch` function it calls).
```

// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";

// Minimal IRouter interface needed for the PoC
interface IRouter {
    function someRouterFunction() external pure returns (bool);
}

// Minimal IGenesisPool interface needed for the PoC
interface IGenesisPool {
    function launch(address router, uint256 maturityTime) external;
    function getGenesisInfo() external view returns (IGenesisPoolBase.GenesisInfo memory);
    function getLiquidityPoolInfo() external view returns (IGenesisPoolBase.LiquidityPool memory);
}

// Minimal IGenesisPoolBase (for structs)
interface IGenesisPoolBase {
    struct GenesisInfo {
        address tokenOwner;
        address nativeToken;
        address fundingToken;
        bool stable;
        uint256 startTime;
        uint256 duration;
        uint256 threshold; // 10000 = 100%
        uint256 startPrice;
        uint256 supplyPercent;
        uint256 maturityTime;
    }

    struct LiquidityPool {
        address pairAddress;
        address gaugeAddress;
        address internal_bribe;
        address external_bribe;
    }
}

// Minimal IGauge interface needed for the PoC
interface IGauge {
    function setGenesisPool(address _genesisPool) external;
}

// Minimal IBaseV1Factory interface needed for the PoC
interface IBaseV1Factory {
    function setGenesisStatus(address _pair, bool status) external;
}

// --- Mock Contracts 
---

// A very simple mock router
contract MockRouter is IRouter {
    bool public wasCalled = false;
    function someRouterFunction() external pure override returns (bool) {
        return true;
    }
    // Dummy addLiquidity to avoid reverts when called by MockGenesisPool
    function addLiquidity(address, address, bool, uint256, uint256, uint256, uint256, address, uint256) external returns (uint256, uint256, uint256) {
        wasCalled = true;
        return (1,1,1);
    }
}

// A very simple mock GenesisPool
contract MockGenesisPool is IGenesisPool, IGenesisPoolBase {
    address public currentRouter;
    bool public launchCalled = false;
    GenesisInfo public genesisInfo; // To satisfy getGenesisInfo
    LiquidityPool public liquidityPoolInfo; // To satisfy getLiquidityPoolInfo

    function launch(address _router, uint256 /*maturityTime*/) external override {
        launchCalled = true;
        currentRouter = _router;
        if (_router == address(0)) {
            revert("Router is address(0)"); // Simulate failure if router is zero
        }
        // Simulate interaction with the router
        IRouter(_router).addLiquidity(address(0), address(0), false, 0,0,0,0, address(0),0);
    }
    function getGenesisInfo() external view override returns (GenesisInfo memory) { return genesisInfo; }
    function getLiquidityPoolInfo() external view override returns (LiquidityPool memory) { return liquidityPoolInfo; }
}

// A simplified GenesisPoolManager containing the vulnerable function
// and a conceptual _launchPool
contract SimplifiedGenesisPoolManager {
    address public owner;
    address public router; // The vulnerable state variable
    IBaseV1Factory public pairFactory; // Added for _launchPool
    uint256 public MATURITY_TIME;     // Added for _launchPool

    event RouterSet(address newRouter);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _initialRouter, address _pairFactory) {
        owner = msg.sender;
        router = _initialRouter;
        pairFactory = IBaseV1Factory(_pairFactory);
        MATURITY_TIME = 1 weeks;
    }

    // The vulnerable function
    function setRouter(address _router) external onlyOwner {
        require(_router == address(0), "ZA"); // The logical error
        router = _router;
        emit RouterSet(_router);
    }

    // Conceptual launch pool function to demonstrate impact
    // In a real scenario, _genesisPool would be a parameter or fetched
    function _launchPool(IGenesisPool _genesisPool) internal {
        // Simplified steps from the actual GenesisPoolManager._launchPool
        // Assume liquidityPoolInfo.pairAddress and liquidityPoolInfo.gaugeAddress are set on _genesisPool
        // IBaseV1Factory(pairFactory).setGenesisStatus(IGenesisPool(_genesisPool).getLiquidityPoolInfo().pairAddress, false); // Simplified
        // IGauge(IGenesisPool(_genesisPool).getLiquidityPoolInfo().gaugeAddress).setGenesisPool(address(_genesisPool)); // Simplified

        _genesisPool.launch(router, MATURITY_TIME); // This will use the (potentially zero) router
    }

    // Public wrapper for testing _launchPool
    function testLaunch(IGenesisPool _genesisPool) external onlyOwner {
        _launchPool(_genesisPool);
    }

    function getRouter() external view returns (address) {
        return router;
    }
}

// Mock for IBaseV1Factory
contract MockPairFactory is IBaseV1Factory {
    function setGenesisStatus(address _pair, bool status) external {}
    // Dummy implementations for other functions if needed by compiler for interface
    function isPair(address pair) external view returns (bool) { return false; }
    function getPair(address tokenA, address token, bool stable) external view returns (address) { return address(0); }
    function createPair(address tokenA, address tokenB, bool stable) external returns (address pair) { return address(0); }
    function setGenesisPool(address _genesisPool) external {}
}

// --- Test Contract 
---
contract GenesisPoolManagerRouterTest is Test {
    SimplifiedGenesisPoolManager internal manager;
    MockRouter internal initialRouter;
    MockRouter internal newValidRouter;
    MockGenesisPool internal mockPool;
    MockPairFactory internal mockPairFactory;

address internal owner;
    address internal nonOwner;

    function setUp() public {
        owner = address(this); // Test contract itself is the owner
        nonOwner = address(0xBAD);

        initialRouter = new MockRouter();
        newValidRouter = new MockRouter();
        mockPool = new MockGenesisPool();
        mockPairFactory = new MockPairFactory();

        manager = new SimplifiedGenesisPoolManager(address(initialRouter), address(mockPairFactory));

        // Sanity check initial router
        assertEq(manager.getRouter(), address(initialRouter), "Initial router not set correctly");
    }

    function test_ownerCannotSetValidNewRouter() public {
        vm.prank(owner);
        vm.expectRevert("ZA"); // Expect ZA (Zero Address) error due to the faulty require
        manager.setRouter(address(newValidRouter));

        // Router should remain unchanged
        assertEq(manager.getRouter(), address(initialRouter), "Router was changed when it shouldn't have been");
    }

    function test_ownerCanSetRouterToZeroAddress() public {
        vm.prank(owner);
        manager.setRouter(address(0)); // This call will succeed

        assertEq(manager.getRouter(), address(0), "Router was not set to address(0)");
    }

    function test_nonOwnerCannotCallSetRouter() public {
        vm.prank(nonOwner);
        vm.expectRevert("Not owner");
        manager.setRouter(address(newValidRouter));

        vm.prank(nonOwner);
        vm.expectRevert("Not owner");
        manager.setRouter(address(0));
    }

    function test_launchFailsIfRouterIsZero() public {
        // First, owner sets router to address(0)
        vm.prank(owner);
        manager.setRouter(address(0));
        assertEq(manager.getRouter(), address(0), "Router setup for test failed");

        // Now, owner tries to launch a pool
        vm.prank(owner);
        // The mockPool's launch function will revert if router is address(0)
        // Also, the call to IRouter(address(0)).addLiquidity would revert.
        vm.expectRevert("Router is address(0)");
        manager.testLaunch(mockPool);

        assertFalse(mockPool.launchCalled(), "Launch should not have been successfully called on pool due to revert");
    }

    function test_launchSucceedsIfRouterIsValid() public {
        // Ensure router is the initial, valid one
        assertEq(manager.getRouter(), address(initialRouter), "Initial router setup for test failed");

        // Owner tries to launch a pool
        vm.prank(owner);
        manager.testLaunch(mockPool); // This should succeed

        assertTrue(mockPool.launchCalled(), "Launch was not called on pool");
        assertEq(mockPool.currentRouter(), address(initialRouter), "Pool was launched with incorrect router");
        assertTrue(initialRouter.wasCalled(), "Router's addLiquidity was not called");
    }
}
```

### Explanation of the PoC

1. **`SimplifiedGenesisPoolManager`:**

   * Contains the `owner`, `router` state variable, and the vulnerable `setRouter` function exactly as described.
   * Includes a `constructor` to set the initial owner and router.
   * Includes `_launchPool` and `testLaunch` to simulate the scenario where a zero router would cause a failure.
2. **`MockRouter`:** A simple contract implementing `IRouter`. Its `addLiquidity` function sets a flag `wasCalled` to verify interaction.
3. **`MockGenesisPool`:**

   * Implements a `launch` function.
   * Crucially, `launch` will `revert("Router is address(0)");` if the `_router` argument is `address(0)`, mimicking how a real `launch` would fail if it tried to call `IRouter(address(0)).addLiquidity(...)`.
   * It also attempts to call `IRouter(_router).addLiquidity` to show a successful interaction.
4. **`MockPairFactory`:** A minimal mock for `IBaseV1Factory` to satisfy dependencies in the simplified `_launchPool`.
5. **`GenesisPoolManagerRouterTest` (Test Contract):**

   * **`setUp()`:** Deploys the `SimplifiedGenesisPoolManager`, `MockRouter` instances, `MockGenesisPool`, and sets the test contract as the `owner`.
   * **`test_ownerCannotSetValidNewRouter()`:**

     + The `owner` attempts to call `setRouter` with `newValidRouter` (a non-zero address).
     + `vm.expectRevert("ZA");` asserts that this call reverts with the “ZA” error, proving the `require(_router == address(0), "ZA");` condition is problematic for valid addresses.
   * **`test_ownerCanSetRouterToZeroAddress()`:**

     + The `owner` calls `setRouter` with `address(0)`.
     + This call succeeds, and the test asserts that `manager.getRouter()` is now `address(0)`.
   * **`test_nonOwnerCannotCallSetRouter()`:** Standard access control test.
   * **`test_launchFailsIfRouterIsZero()`:**

     + The `owner` first successfully calls `setRouter(address(0))`.
     + Then, the `owner` calls `manager.testLaunch(mockPool)`.
     + `vm.expectRevert("Router is address(0)");` asserts that this call reverts. The revert comes from `MockGenesisPool.launch()` when it detects the zero address router, demonstrating the downstream failure.
   * **`test_launchSucceedsIfRouterIsValid()`:**

     + Ensures the router is the initial valid one.
     + The `owner` calls `manager.testLaunch(mockPool)`.
     + This call should succeed, `mockPool.launchCalled()` should be true, and `initialRouter.wasCalled()` should be true.

**How to Run (with Foundry):**

1. Save the code above as `test/GenesisPoolManagerRouter.t.sol` (or similar) in your Foundry project.
2. Ensure you have `forge-std` (usually included with `forge init`).
3. Run the tests: `forge test --match-test GenesisPoolManagerRouterTest -vvv` (the `-vvv` provides more verbose output, including console logs if you were to add them).

This PoC clearly demonstrates:

* The `setRouter` function’s flawed logic.
* The `owner`’s inability to set a new, functional router.
* The `owner`’s ability to set the router to `address(0)`.
* The direct consequence of a zero router address leading to failed pool launches.

**[Blackhole mitigated](https://github.com/code-423n4/2025-06-blackhole-mitigation?tab=readme-ov-file# mitigation-of-high--medium-severity-issues)**

**Status:** Mitigation confirmed. Full details in reports from [rayss](https://code4rena.com/audits/2025-06-blackhole-mitigation-review/submissions/S-28), [lonelybones](https://code4rena.com/audits/2025-06-blackhole-mitigation-review/submissions/S-5) and [maxvzuvex](https://code4rena.com/audits/2025-06-blackhole-mitigation-review/submissions/S-16).

---


