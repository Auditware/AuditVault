---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - has/github
  - severity/high
protocol: "[[Subsquid]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Subsquid-security-review.md"
genome:
  - "[[access-roles]]"
  - "[[mev/frontrun]]"
---
# [H-04] Lack of access control on tSQD's `registerTokenOnL2`

- id: 58248
- impact: HIGH
- protocol: Subsquid
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Subsquid-security-review.md

## Summary


This bug report highlights a potential issue in the tSQD system, where an attacker could change the address of the L2 token and cause problems with the bridge token. This could have a high impact and is likely to occur. The `registerTokenOnL2` function is currently not restricted, allowing an attacker to front-run and input an incorrect address for the L2 token. This would result in the bridge token being broken and unable to be changed within the gateway. The recommendation is to use the Ownable functionality and restrict the `registerTokenOnL2` function to only be called by the owner/admin, as suggested by the design of the Arbitrum bridge token.

## Details

## Severity

**Impact**: High, malicious attacker can set L2 custom address to different address to break the bridge token.

**Likelihood**: Medium, attacker can front-ran the `registerTokenOnL2` to break the bridge token.

## Description

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

## Recommendations

Use the Ownable functionality inside tSQD and restrict `registerTokenOnL2` so that it can only be called by the owner/admin, as suggested by the Arbitrum bridge token design.
