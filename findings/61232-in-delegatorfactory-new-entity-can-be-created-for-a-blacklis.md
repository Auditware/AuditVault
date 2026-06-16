---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/staking
  - sector/governance
  - platform/cyfrin
protocol: "[[Suzaku Core]]"
auditors:
  - 0kage
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-07-cyfrin-suzaku-core-v2.0.md"
genome:
  - "[[access-roles]]"
  - "[[proxy-initialization]]"
  - "[[access-control/broken-logic]]"
  - "[[privilege-escalation/role-bypass]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/single-user]]"
---
# In `DelegatorFactory` new entity can be created for a blacklisted implementation

- id: 61232
- impact: HIGH
- protocol: Suzaku Core
- reporter: 0kage (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-07-cyfrin-suzaku-core-v2.0.md

## Summary


The current implementation of `DelegatorFactory::create` does not check for blacklisted contract types, which could lead to the deployment of unsafe or restricted contracts. This poses a security and consistency risk. A proof of concept has been provided in `DelegatorFactoryTest.t.sol` to demonstrate this issue. The recommended mitigation is to add a check for blacklisted types in the `create` function. This issue has been fixed in the commit [292d5b7](https://github.com/suzaku-network/suzaku-core/pull/155/commits/292d5b71ac3a377351d66f239405c4d38af53830). It has been verified by Cyfrin.

## Details

**Description:** The current implementation of `DelegatorFactory::create` fails to verify whether the specified implementation type has been explicitly blacklisted. This creates a security and consistency risk where blacklisted contract types can still be deployed, potentially bypassing governance or security restrictions.

**Impact:** The lack of a blacklist check in the create function allows the creation of contracts based on implementation types that may have been deemed unsafe, deprecated, or otherwise restricted.

**Proof of Concept:** Create a new test class `DelegatorFactoryTest.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: Copyright 2024 ADDPHO

pragma solidity 0.8.25;

import {Test, console2} from "forge-std/Test.sol";
import {DelegatorFactory} from "../src/contracts/DelegatorFactory.sol";
import {IDelegatorFactory} from "../src/interfaces/IDelegatorFactory.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {IEntity} from "../../src/interfaces/common/IEntity.sol";
import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract DelegatorFactoryTest is Test {
    address owner;
    address operator1;
    address operator2;

    DelegatorFactory factory;
    MockEntity mockImpl;

    function setUp() public {
        owner = address(this);
        operator1 = makeAddr("operator1");
        operator2 = makeAddr("operator2");

        factory = new DelegatorFactory(owner);

        // Deploy a mock implementation that conforms to IEntity
        mockImpl = new MockEntity(address(factory), 0);

        // Whitelist the implementation
        factory.whitelist(address(mockImpl));
    }

    function testCreateBeforeBlacklist() public {
        bytes memory initData = abi.encode("test");

        address created = factory.create(0, initData);

        assertTrue(factory.isEntity(created), "Entity should be created and registered");
    }

    function testCreateFailsAfterBlacklist() public {
        bytes memory initData = abi.encode("test");

        factory.blacklist(0);

        factory.create(0, initData); //@note no revert although blacklisted
    }
}

contract MockEntity is IEntity, ERC165 {
    address public immutable FACTORY;
    uint64 public immutable TYPE;

    string public data;

    constructor(address factory_, uint64 type_) {
        FACTORY = factory_;
        TYPE = type_;
    }

    function initialize(
        bytes calldata initData
    ) external {
        data = abi.decode(initData, (string));
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IEntity).interfaceId || super.supportsInterface(interfaceId);
    }
}

```

**Recommended Mitigation:** Consider adding the following check to the `DelagatorFactory::create`

```diff solidity
function create(uint64 type_, bytes calldata data) external returns (address entity_) {
++    if (blacklisted[type_]) {
++       revert DelagatorFactory__TypeBlacklisted();
++    }
        entity_ = implementation(type_).cloneDeterministic(keccak256(abi.encode(totalEntities(), type_, data)));

        _addDelegatorEntity(entity_);

        IEntity(entity_).initialize(data);
    }
```

**Suzaku:**
Fixed in commit [292d5b7](https://github.com/suzaku-network/suzaku-core/pull/155/commits/292d5b71ac3a377351d66f239405c4d38af53830).

**Cyfrin:** Verified.
