---
tags:
  - lang/solidity
  - sector/perpetuals
  - platform/quantstamp
  - severity/high
  - vuln/dependency/upgradeable-contract
  - fix/add-access-control
  - novelty/variant
  - misassumption/external-call-is-safe
  - fix/upgrade-dependency
protocol: "[[Ithaca Finance]]"
auditors:
  - "[[Mustafa Hasan]]"
report: "https://certificate.quantstamp.com/full/ithaca-finance/8cacdbf3-9f47-4135-854d-1d004abad065/index.html"
genome:
  - "[[upgradeable-contract]]"
  - "[[ownership-takeover]]"
  - "[[add-access-control]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[upgrade-safety]]"
---
# Unprotected Upgrade at `Registry`

- id: 59727
- impact: HIGH
- protocol: [[Ithaca Finance]]
- reporter: Mustafa Hasan (Quantstamp)
- source: https://certificate.quantstamp.com/full/ithaca-finance/8cacdbf3-9f47-4135-854d-1d004abad065/index.html

## Summary


The client has marked a bug as "Fixed" and provided a code address where the issue has been addressed. The affected file is `contracts/registry/Registry.sol` and the bug is related to the method `_authorizeUpgrade()` not having proper access control. This means that anyone can upgrade the contract to any implementation, which could potentially lead to malicious actions. The bug can be reproduced using a specific test script provided in the report. The recommendation is to add access control to the `_authorizeUpgrade()` method, which can be done by following the recommended practice from OpenZeppelin's documentation.

## Details

**Update**
Marked as "Fixed" by the client. This has been properly addressed by following the recommendation. Addressed in: `8777981bafe3c34fcebdf1dcfe1731e97686002b`.

**File(s) affected:**`contracts/registry/Registry.sol`

**Description:** In `Registry.sol`, the method `_authorizeUpgrade()` is not protected by any access control. This means that anyone could upgrade the contract to any implementation.

**Exploit Scenario:** The following test script reproduces the issue:

```
describe('Exploit', () => {
    it('any user can upgrade', async () => {
      const precision = 7;
      const accounts = await ethers.getSigners()

      await accessController
        .connect(admin)
        .grantRole(ADMIN_ROLE, registry.address)
        .then((tx) => tx.wait());

      const newReg = await ethers.getContractFactory("Registry");
      const newReg = await newReg.deploy();

         await registry
        .connect(accounts[3]) // * non admin account
        .upgradeTo(newReg.address)  // * upgrading to same contract just to test it allows it
     });
  });
```

**Recommendation:** We recommend the team to add access control to the `_authorizeUpgrade()` method. The recommended practice is available at oppenzeppelin's [UUPSUpgradeable](https://docs.openzeppelin.com/contracts/4.x/api/proxy#UUPSUpgradeable-_authorizeUpgrade-address-) documentation.
