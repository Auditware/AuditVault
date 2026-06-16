---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[API3]]"
auditors:
  - "[[Simone Monica]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/API3.pdf"
genome:
  - "[[proxy-storage-collision]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Publish-subscribe protocol users are vulnerable to a denial of service

- id: 17619
- impact: HIGH
- protocol: [[API3]]
- reporter: Simone Monica (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/API3.pdf

## Summary


This bug report is about an undefined behavior in the airnode-protocol-v1/contracts/protocol/StorageUtils.sol file. The API3 system implements a publish-subscribe protocol through which a requester can receive a callback from an API when specified conditions are met. These conditions can be hard-coded when the Airnode is configured or stored on-chain. When they are stored on-chain, the user can call storeSubscription to establish other conditions for the callback. The arguments are then used in abi.encodePacked, which could result in a subscriptionId collision.

The Solidity documentation includes a warning that if abi.encodePacked is used with more than one dynamic type, it is easy to craft collisions in the hash value by moving parts of one argument to the other. This exploit scenario is demonstrated with Alice and Eve, where Eve moves the last byte of the parameters argument to the beginning of the conditions argument. As a result, the Airnode will no longer report API results to Alice’s smart contract.

The short term recommendation is to use abi.encode instead of abi.encodePacked. The long term recommendation is to carefully review the Solidity documentation, particularly the “Warning” sections regarding the pitfalls of abi.encodePacked.

## Details

## API3 Security Assessment

**Difficulty:** Low  
**Type:** Undefined Behavior  

## Target
`airnode-protocol-v1/contracts/protocol/StorageUtils.sol`

## Description
The API3 system implements a publish-subscribe protocol through which a requester can receive a callback from an API when specified conditions are met. These conditions can be hard-coded when the Airnode is configured or stored on-chain. When they are stored on-chain, the user can call `storeSubscription` to establish other conditions for the callback (by specifying `parameters` and `conditions` arguments of type `bytes`). The arguments are then used in `abi.encodePacked`, which could result in a `subscriptionId` collision.

### Function
```solidity
function storeSubscription(
    [...],
    bytes calldata parameters,
    bytes calldata conditions,
    [...]
) external override returns (bytes32 subscriptionId) {
    [...]
    subscriptionId = keccak256(
        abi.encodePacked(
            chainId,
            airnode,
            templateId,
            parameters,
            conditions,
            relayer,
            sponsor,
            requester,
            fulfillFunctionId
        )
    );
    subscriptions[subscriptionId] = Subscription({
        chainId: chainId,
        airnode: airnode,
        templateId: templateId,
        parameters: parameters,
        conditions: conditions,
        relayer: relayer,
        sponsor: sponsor,
        requester: requester,
        fulfillFunctionId: fulfillFunctionId
    });
}
```
*Figure 1.1: `StorageUtils.sol#L135-L158`*

The Solidity documentation includes the following warning:

> If you use `keccak256(abi.encodePacked(a, b))` and both `a` and `b` are dynamic types, it is easy to craft collisions in the hash value by moving parts of `a` into `b` and vice-versa. More specifically, `abi.encodePacked("a", "bc") == abi.encodePacked("ab", "c")`. If you use `abi.encodePacked` for signatures, authentication or data integrity, make sure to always use the same types and check that at most one of them is dynamic. Unless there is a compelling reason, `abi.encode` should be preferred.

*Figure 1.2: The Solidity documentation details the risk of a collision caused by the use of `abi.encodePacked` with more than one dynamic type.*

## Exploit Scenario
Alice calls `storeSubscription` to set the conditions for a callback from a specific API to her smart contract. Eve, the owner of a competitor protocol, calls `storeSubscription` with the same arguments as Alice but moves the last byte of the `parameters` argument to the beginning of the `conditions` argument. As a result, the Airnode will no longer report API results to Alice’s smart contract.

## Recommendations
- **Short term:** Use `abi.encode` instead of `abi.encodePacked`.
- **Long term:** Carefully review the [Solidity documentation](https://docs.soliditylang.org/) , particularly the “Warning” sections regarding the pitfalls of `abi.encodePacked`.
