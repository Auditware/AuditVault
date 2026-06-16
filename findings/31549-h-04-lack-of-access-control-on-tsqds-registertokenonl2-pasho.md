---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - platform/pashov
  - has/github
  - severity/high
  - impact/mev/frontrun
protocol: "[[Subsquid]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Subsquid-security-review.md"
genome:
  - "[[missing-modifier]]"
  - "[[frontrun]]"
  - "[[access-roles]]"
  - "[[frontrun-exposure]]"
---
# [H-04] Lack of access control on tSQD's `registerTokenOnL2`

- id: 31549
- impact: HIGH
- protocol: [[Subsquid]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Subsquid-security-review.md

## Summary


This bug report discusses a high severity issue in the tSQD program, which allows an attacker to manipulate the bridge token between Ethereum and Arbitrum. This can be done by using the `registerTokenOnL2` function, which is currently not restricted and can be accessed by anyone. The attacker can front-run this function and change the L2 token address, causing the bridge token to break. The report recommends implementing the Ownable functionality and restricting access to the `registerTokenOnL2` function to only the owner or administrator, as suggested by the design of the Arbitrum bridge token. 

## Details

**Severity**

**Impact**: High, malicious attacker can set L2 custom address to different address to break the bridge token.

**Likelihood**: Medium, attacker can front-ran the `registerTokenOnL2` to break the bridge token.

**Description**

tSQD is designed so that it can be bridged from Ethereum (L1) to Arbitrum (L2) via Arbitrum’s generic-custom gateway.
However, the `registerTokenOnL2` function, which sets the L2 token address via `gateway.registerTokenToL2`, is not currently restricted.

```solidity
  function registerTokenOnL2(
    address l2CustomTokenAddress,
    uint256 maxSubmissionCostForCustomGateway,
    uint256 maxSubmissionCostForRouter,
    uint256 maxGasForCustomGateway,
    uint256 maxGasForRouter,
    uint256 gasPriceBid,
    uint256 valueForGateway,
    uint256 valueForRouter,
    address creditBackAddress
  ) public payable {
    require(!shouldRegisterGateway, "ALREADY_REGISTERED");
    shouldRegisterGateway = true;

    gateway.registerTokenToL2{value: valueForGateway}(
      l2CustomTokenAddress, maxGasForCustomGateway, gasPriceBid, maxSubmissionCostForCustomGateway, creditBackAddress
    );

    router.setGateway{value: valueForRouter}(
      address(gateway), maxGasForRouter, gasPriceBid, maxSubmissionCostForRouter, creditBackAddress
    );

    shouldRegisterGateway = false;
  }
```

An attacker can front-run the `registerTokenOnL2` and put an incorrect address for `l2CustomTokenAddress` to break the bridge token. Once it is called, the L2 token cannot be changed inside the gateway.

**Recommendations**

Use the Ownable functionality inside tSQD and restrict `registerTokenOnL2` so that it can only be called by the owner/admin, as suggested by the Arbitrum bridge token design.
