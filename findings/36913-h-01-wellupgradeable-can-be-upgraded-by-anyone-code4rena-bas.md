---
tags:
  - lang/solidity
  - sector/staking
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/dependency/upgradeable-contract
  - novelty/variant
  - misassumption/external-call-is-safe
  - fix/upgrade-dependency
protocol: "[[Basin]]"
auditors:
  - "[[0xvd]]"
report: "https://code4rena.com/reports/2024-07-basin"
genome:
  - "[[upgradeable-contract]]"
  - "[[variant]]"
  - "[[admin-takeover]]"
  - "[[access-roles]]"
  - "[[upgrade-safety]]"
  - "[[vote-delegation-loop]]"
---
# [H-01] `WellUpgradeable` can be upgraded by anyone

- id: 36913
- impact: HIGH
- protocol: [[Basin]]
- reporter: 0xvd (Code4rena)
- source: https://code4rena.com/reports/2024-07-basin

## Summary


The `WellUpgradeable` contract, which is an upgraded version of the `Well` contract, has a bug that can allow unauthorized users to upgrade the contract to a potentially malicious implementation. This is due to the lack of an `onlyOwner` modifier in the `_authorizeUpgrade` function, which is required to restrict access and prevent unauthorized upgrades. A proof of concept test has been provided to demonstrate the issue, and it is recommended that the `onlyOwner` modifier be added to the function to mitigate this vulnerability. This bug falls under the category of access control and has been confirmed by multiple sources. This is considered a critical security issue as it can lead to total fund loss for all wells deployed in the system.

## Details


`WellUpgradeable` is an upgradeable version of the `Well` contract, inheriting from OpenZeppelin's `UUPSUpgradeable` and `OwnableUpgradeable` contracts. According to OpenZeppelin’s documentation for `UUPSUpgradeable.sol` ([here](https://docs.openzeppelin.com/contracts/4.x/api/proxy#UUPSUpgradeable:\~:text=The%20\_authorizeUpgrade%20function%20must%20be%20overridden%20to%20include%20access%20restriction%20to%20the%20upgrade%20mechanism.) and [here](https://docs.openzeppelin.com/contracts/4.x/api/proxy#UUPSUpgradeable-\_authorizeUpgrade-address-)), the internal `_authorizeUpgrade` function must be overridden to include access restriction, typically using the `onlyOwner` modifier. This must be done to prevent unauthorized users from upgrading the contract to a potentially malicious implementation.

However, in the current implementation the `_authorizeUpgrade` function is overridden with custom logic but lacks the `onlyOwner` modifier. As a result, the `upgradeTo` and `upgradeToAndCall` methods can be invoked by any address, allowing anyone to upgrade the contract, leading to the deployment of malicious code and compromise the integrity of the contract.

### Proof of concept

The following test demonstrates that `WellUpgradeable` can be upgraded by any address, not just the owner. It is based on `testUpgradeToNewImplementation` with the difference that a new user address is created and used to call the `upgradeTo` function, successfully upgrading the contract and exposing the lack of access control.

Paste the following test into `WellUpgradeable.t.sol`:

```solidity
function testUpgradeToNewImplementationNotOwner() public {
        IERC20[] memory tokens = new IERC20[](2);
        tokens[0] = new MockToken("BEAN", "BEAN", 6);
        tokens[1] = new MockToken("WETH", "WETH", 18);
        Call memory wellFunction = Call(wellFunctionAddress, abi.encode("2"));
        Call[] memory pumps = new Call[](1);
        pumps[0] = Call(mockPumpAddress, abi.encode("2"));
        // create new mock Well Implementation:
        address wellImpl = address(new MockWellUpgradeable());
        WellUpgradeable well2 =
            encodeAndBoreWellUpgradeable(aquifer, wellImpl, tokens, wellFunction, pumps, bytes32(abi.encode("2")));
        vm.label(address(well2), "upgradeableWell2");
        
        address user = makeAddr("user");
        vm.startPrank(user);
        WellUpgradeable proxy = WellUpgradeable(payable(proxyAddress));
        proxy.upgradeTo(address(well2));

        // verify proxy was upgraded.
        assertEq(address(well2), MockWellUpgradeable(proxyAddress).getImplementation());
        vm.stopPrank();
    }
```

### Recommended mitigation steps

Add the `onlyOwner` modifier to the `_authorizeUpgrade` function in `WellUpgradeable.sol` to restrict upgrade permissions:

```diff
+   function _authorizeUpgrade(address newImplmentation) internal view override onlyOwner {
        // verify the function is called through a delegatecall.
        require(address(this) != ___self, "Function must be called through delegatecall");

        // verify the function is called through an active proxy bored by an aquifer.
        address aquifer = aquifer();
        address activeProxy = IAquifer(aquifer).wellImplementation(_getImplementation());
        require(activeProxy == ___self, "Function must be called through active proxy bored by an aquifer");

        // verify the new implementation is a well bored by an aquifier.
        require(
            IAquifer(aquifer).wellImplementation(newImplmentation) != address(0),
            "New implementation must be a well implementation"
        );

        // verify the new impelmentation is a valid ERC-1967 impelmentation.
        require(
            UUPSUpgradeable(newImplmentation).proxiableUUID() == _IMPLEMENTATION_SLOT,
            "New implementation must be a valid ERC-1967 implementation"
        );
    }
```

### Assessed type

Access Control

**[nickkatsios (Basin) confirmed and commented via duplicate Issue #18](https://github.com/code-423n4/2024-07-basin-findings/issues/18#issuecomment-2286393570):**
> The modifier was mistakenly omitted here and should definitely be added.

**[0xsomeone (judge) commented](https://github.com/code-423n4/2024-07-basin-findings/issues/52#issuecomment-2302069557):**
 > The Warden and its duplicates have properly identified that the upgrade methodology of a `WellUpgradeable` is insecure, permitting any contract to be upgraded to an arbitrary implementation. Specifically, the upgrade authorization mechanism will ensure that:
> 
> - The call was routed through the proxy.
> - The new implementation complies with the EIP-1967 standard.
> - The new implementation has been registered in the Aquifier.
> 
> Given that well registration on the Aquifier is unrestricted as [seen here](https://github.com/code-423n4/2024-07-basin/blob/7d5aacbb144d0ba0bc358dfde6e0cc913d25310e/src/Aquifer.sol#L26-L89), it is possible to practically upgrade any well to any implementation.
> 
> I believe a high-risk assessment is valid as this represents a critical security issue that can directly lead to total fund loss for all wells deployed in the system.

***
