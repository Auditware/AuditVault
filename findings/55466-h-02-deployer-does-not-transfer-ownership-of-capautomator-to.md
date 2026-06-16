---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/lending
protocol: "[[HypurrFi]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/HypurrFi-security-review_2025-02-12.md"
genome:
  - "[[initializer-auth]]"
  - "[[ownership-transfer]]"
  - "[[insider]]"
---
# [H-02] Deployer does not transfer ownership of `CapAutomator` to admin

- id: 55466
- impact: HIGH
- protocol: HypurrFi_2025-02-12
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/HypurrFi-security-review_2025-02-12.md

## Summary


The report describes a bug in the function `DeployCapAutomator.run` that results in the ownership of `CapAutomator` being assigned to the wrong user. This can have a medium impact and is highly likely to occur. The function should be updated to transfer ownership to the designated `admin` after deployment.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The function `DeployCapAutomator.run` deploys an instance of `CapAutomator`, assigning `msg.sender` (the `deployer`) as the initial owner. But it does not transfer the ownership to the designated `admin`.

```solidity
    function run() external {
        --snip--
        poolAddressesProvider = IPoolAddressesProvider(deployedContracts.readAddress(".poolAddressesProvider"));

        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        capAutomator = new CapAutomator(address(poolAddressesProvider));

        vm.stopBroadcast();
        --snip--
    }
```

```solidity
contract CapAutomator is ICapAutomator, Ownable {
    --snip--
    constructor(address poolAddressesProvider) Ownable(msg.sender) {
        pool             = IPool(IPoolAddressesProvider(poolAddressesProvider).getPool());
        poolConfigurator = IPoolConfigurator(IPoolAddressesProvider(poolAddressesProvider).getPoolConfigurator());
    }
```

## Recommendations

Transfer ownership of `capAutomator` to `admin` after deployment.
