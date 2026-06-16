---
tags:
  - has/github
  - severity/high
  - lang/solidity
  - sector/lending
protocol: "[[HypurrFi]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/HypurrFi-security-review_2025-02-12.md"
genome:
  - "[[proxy-initialization]]"
  - "[[upgradeable-contract]]"
  - "[[ownership-transfer]]"
  - "[[variant]]"
  - "[[external-call-is-safe]]"
---
# [H-01] `DeployUsdxlUtils` does not transfer ownership of usdxlToken to `admin`

- id: 55465
- impact: HIGH
- protocol: HypurrFi_2025-02-12
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/HypurrFi-security-review_2025-02-12.md

## Summary


The reported bug is of medium severity and has a high likelihood of occurring. The function `_deployUsdxl` in the code deploys a token and sets the deployer as its owner. However, it fails to transfer the ownership to the admin after deployment and configuration. The recommended solution is to transfer the ownership of the token to the admin after deployment and configuration. 

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The `_deployUsdxl` function, deploys usdxlTokenProxy and sets `deployer` as the owner of `usdxlToken`

```solidity
    function _deployUsdxl(address proxyAdmin, IDeployConfigTypes.HypurrDeployRegistry memory deployRegistry) internal {
        --snip--
        // 1. Deploy USDXL token implementation and proxy
        UpgradeableUsdxlToken usdxlTokenImpl = new UpgradeableUsdxlToken();

        bytes memory initParams = abi.encodeWithSignature("initialize(address)", deployer);

        usdxlTokenProxy = address(new TransparentUpgradeableProxy(address(usdxlTokenImpl), proxyAdmin, initParams));

        usdxlToken = IUsdxlToken(usdxlTokenProxy);

        --snip--
     }
```

But it does not transfer the ownership (admin rights) from `deployer` to `admin`

## Recommendations

Transfer ownership of `usdxlToken` to admin after deployment and config
