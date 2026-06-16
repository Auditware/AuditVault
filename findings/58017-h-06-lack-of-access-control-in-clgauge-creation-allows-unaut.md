---
tags:
  - lang/solidity
  - sector/governance
  - sector/nft
  - has/github
  - severity/high
protocol: "[[KittenSwap]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-05-07.md"
genome:
  - "[[access-roles]]"
  - "[[mev/frontrun]]"
  - "[[add-access-control]]"
---
# [H-06] Lack of access control in `CLGauge` creation allows unauthorized `Pools`

- id: 58017
- impact: HIGH
- protocol: KittenSwap_2025-05-07
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-05-07.md

## Summary


The report describes a vulnerability in a function called `CLGaugeFactory.createGauge`, which can be exploited by anyone. This can result in a front-running attack, where an attacker can monitor legitimate transactions and execute their own transaction before the original one is processed. This can disrupt the protocol's governance and reward distribution mechanisms. The report recommends adding access control to restrict the function to only be called by the voter contract.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The `CLGaugeFactory.createGauge` function can be called by anyone, which creates a front-running vulnerability. An attacker can monitor the mempool for legitimate `Voter.createCLGauge` transactions and front-run them, calling `CLGaugeFactory.createGauge` with the same pool address before the transaction from Voter contract is processed.

```solidity
    function createGauge(
        address _pool,
        address _internal_bribe,
        address _kitten,
        bool _isPool
    ) external returns (address) {
        CLGauge newGauge = CLGauge(
            address(
                new ERC1967Proxy(
                    implementation,
                    abi.encodeCall(
                        CLGauge.initialize,
                        (
                            _pool,
                            _internal_bribe,
                            _kitten,
                            ve,
                            voter,
                            nfp,
                            _isPool
                        )
                    )
                )
            )
        );

        ICLPool(_pool).setGaugeAndPositionManager(address(newGauge), nfp);

        ...
    }

```

This function calls `ICLPool(_pool).setGaugeAndPositionManager(address(newGauge), nfp)`, which can only be called once per pool due to the following check in the CLPool.setGaugeAndPositionManager function:

```solidity
    function setGaugeAndPositionManager(
        address _gauge,
        address _nft
    ) external override lock onlyGaugeFactory {
        require(gauge == address(0)); // @audit Can only be called once
        gauge = _gauge;
        nft = _nft;
    }
```

The problem arises when the legitimate `Voter.createCLGauge` function is called later, which attempts to create a gauge through the same factory. The function will revert.

```solidity
    function createCLGauge(
        address _poolFactory,
        address _pool
    ) external returns (address) {
        // ...
        address _gauge = ICLGaugeFactory(gaugefactory).createGauge(
            _pool,
            _internal_bribe,
            base,
            isPool
        );
        // ...
    }
```

This effectively creates a denial of service for the intended gauge creation process, disrupting the protocol's governance and reward distribution mechanisms.

## Recommendations

Add access control to restrict the `createGauge` function to only be callable by the voter contract:

```diff
    function createGauge(
        address _pool,
        address _internal_bribe,
        address _kitten,
        bool _isPool
    ) external returns (address) {
+       require(msg.sender == voter, "Only voter can create gauge");
        CLGauge newGauge = CLGauge(
            address(
                new ERC1967Proxy(
                    implementation,
                    abi.encodeCall(
                        CLGauge.initialize,
                        (
                            _pool,
                            _internal_bribe,
                            _kitten,
                            ve,
                            voter,
                            nfp,
                            _isPool
                        )
                    )
                )
            )
        );

        ...
    }
```
