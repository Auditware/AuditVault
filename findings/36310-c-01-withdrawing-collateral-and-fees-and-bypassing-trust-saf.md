---
tags:
  - lang/solidity
  - sector/lending
  - sector/multisig
  - platform/pashov
  - has/github
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Catalyst]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Catalyst-security-review-april.md"
genome:
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[role-bypass]]"
  - "[[fee-accounting]]"
---
# [C-01] Withdrawing collateral and fees and bypassing trust safety mechanism

- id: 36310
- impact: HIGH
- protocol: [[Catalyst]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Catalyst-security-review-april.md

## Summary

This bug report discusses a vulnerability in a project specification that could potentially allow a malicious actor to withdraw tokens without proper approval. The current implementation only verifies the codehash of the beneficiary's Safe contract, but not the legitimacy of the contract itself. This could allow a fraudulent Safe contract to be deployed and used to bypass security checks. To mitigate this vulnerability, it is recommended to validate the authenticity of the singleton contract by reading its slot 0 and verifying it offchain.

## Details

**Severity**

**Impact:** High

**Likelihood:** High

**Description**

From the project specification:

        Each project has a dedicated beneficiary address associated with it that enjoys very special rights during the next states and hence is enforced to be a (Safe) multisignature wallet with two signatories and a 2/2 threshold:
        sourcer: the user who creates the project, a medium-high trust party, as defined by on the market spawn parameters
        protocolTrustee: a protocol-controlled wallet, and high trust party (molecule), set on the configured IPSeedTrust contract.

The IPSeedTrust contract is designed to ensure that both the sourcer and the protocol trustee are required to sign off on token withdrawal transactions (e.g., `claimCollateral` and `projectSucceeded`) by verifying that the `protocolTrustee` is an owner and the threshold is set to 2.

```solidity
  function checkIfBeneficiaryIsATrustedSafe(address beneficiary) public view {
    if (protocolTrustee == address(0)) {
      return; //when no trustee is configured, we're not checking for Safe accounts
    }
    IOwnerManager ownerManager = IOwnerManager(beneficiary);

    if (
      beneficiary.codehash != SAFE_PROXY_130_CODEHASH || ownerManager.getThreshold() != 2 // @audit check codehash = SAFE_PROXY_130_CODEHASH not ensure the Gnosis Safe is trusted.
        || ownerManager.getOwners().length != 2 || !ownerManager.isOwner(protocolTrustee)
    ) {
      revert BeneficiaryIsNotTrustful();
    }
  }
```

However, the current implementation only verifies the beneficiary's codehash against the Safe Proxy contract v1.3.0's codehash. It does not confirm whether the Safe singleton itself is the legitimate v1.3.0 contract. This oversight allows a malicious actor to deploy a Safe contract with a fraudulent singleton, circumventing the intended security checks. Consequently, the malicious actor can assume control over the beneficiary safe and execute token withdrawal transactions without protocol trustee approval.

For instance, a malicious singleton might simulate a `protocolTrustee` ownership status, misleading the `isOwner` check to always return true for the `protocolTrustee` under the guise of meeting the two-signatory requirement.

```solidity
contract MaliciousGnosisSafe is GnosisSafe {
    address public fakeOwner;
    address public realOwner;

    function setReturnOwner(address _fakeOwner, address _realOwner) public {
        fakeOwner = _fakeOwner;
        realOwner = _realOwner;
    }

    function getOwners() public view override returns (address[] memory) {
        address[] memory array = new address[](2);
        array[0] = fakeOwner;
        array[1] = realOwner;
        return array;
    }

    function getThreshold() public view override returns (uint256) {
        return 2;
    }

    function isOwner(address owner) public view override returns (bool) {
        if (owner == fakeOwner) {
            return true;
        } else {
            return super.isOwner(owner);
        }
    }
}
```

Setup and POC:

- Put the POC file MaliciousGenosisSafe.t.sol in test/MaliciousGenosisSafe.t.sol
  https://gist.github.com/thangtranth/701abaf86864510967fbacc7dbe79eba

- Put the GnosisSafe.sol (MaliciousGnosisSafe singleton) in test/helpers/GnosisSafe.sol
  https://gist.github.com/thangtranth/4fba8229778254d59c18a2e740239ad8

- Put the ISafeProxyFactory.sol in test/helpers/ISafeProxyFactory.sol
  https://gist.github.com/thangtranth/20edd2cbbcb7afb73dd0a6c13a771448

Run `forge test -vvvvv --match-path test/MaliciousGenosisSafe.t.sol --match-test testPOC`

**Recommendations**

To mitigate this vulnerability, ensure the validation of the singleton's authenticity:

- Reading the slot 0 of the proxy and verify offchain, warning users if the singleton is not in the allowed list.
- In contract:

```diff
+  interface ISafe {
+     function getStorageAt(uint256, uint256) external view returns (bytes memory);
+  }

+  address SAFE_SINGLETON_CONTRACT = 0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552;

  function checkIfBeneficiaryIsATrustedSafe(address beneficiary) public view {
    if (protocolTrustee == address(0)) {
      return; //when no trustee is configured, we're not checking for Safe accounts
    }
    IOwnerManager ownerManager = IOwnerManager(beneficiary);

+   bytes memory data = ISafe(beneficiary).getStorageAt(0, 1);
+   address singletonAddress;
+
+   assembly {
+        singletonAddress := mload(add(data, 32))
+   }

-   if (
+   if ( singletonAddress != SAFE_SINGLETON_CONTRACT ||
      beneficiary.codehash != SAFE_PROXY_130_CODEHASH || ownerManager.getThreshold() != 2
        || ownerManager.getOwners().length != 2 || !ownerManager.isOwner(protocolTrustee)
    ) {
      revert BeneficiaryIsNotTrustful();
    }
  }
```
