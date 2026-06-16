---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - novelty/variant
  - sector/dns
protocol: "[[Zero Name Service (ZNS)]]"
auditors:
  - "[[Jennifer Wu]]"
report: "https://certificate.quantstamp.com/full/zero-name-service-zns/4ec9b4dd-2c6b-4ce8-ad3f-c4f4246e0140/index.html"
genome:
  - "[[fee-manipulation]]"
  - "[[fee-theft]]"
  - "[[variant]]"
  - "[[access-roles]]"
---
# Potential Domain and Subdomain Impersonation Due to Absence of String Validation

- id: 59367
- impact: HIGH
- protocol: Zero Name Service (ZNS)
- reporter: Jennifer Wu (Quantstamp)
- source: https://certificate.quantstamp.com/full/zero-name-service-zns/4ec9b4dd-2c6b-4ce8-ad3f-c4f4246e0140/index.html

## Summary


This bug report discusses an issue with the `ZNSRootRegistrar` and `ZNSSubRegistrar` contracts. These contracts do not properly validate domain names, which could lead to potential impersonation by attackers. The report recommends implementing a validation process to prevent users from bypassing the intended registration process and impersonating domains or subdomains. 

## Details

**Update**
The client fixed the issue in `5b97484533cdfee1aca8ebf90090357e77d9e5bd` by using `StringUtils.validate()`, a newly implemented function. This function ensures that strings in the `registerRootDomain()` and `registerSubdomain()` functions strictly contain only lowercase letters (a-z), numerals (0-9), or hyphens.

**File(s) affected:**`ZNSRootRegistrar.sol`, `ZNSSubRegistrar.sol`

**Description:** The `ZNSRootRegistrar.registerRootDomain()` function does not validate if the provided name contains a dot. Consequently, if a user has registered a domain like `0://wilder`, another user could register `0://wilder.fundme`, which might mislead users into believing it is a legitimate subdomain of the original domain. This impersonation risk arises because the genuine subdomain registration logic resides solely in the `ZNSSubRegistrar.sol` contract.

Furthermore, this oversight in validation extends to the `ZNSSubRegistrar.registerSubdomain()` function. An attacker can register multi-level subdomains all at once. As an example, given the registered domain `0://wilder`, an attacker could directly register a third-level subdomain like `0://wilder.2ld.3ld.4ld` without sequentially registering `0://wilder.2ld` and `0://wilder.2ld.3ld`.

**Recommendation:** Ensure the string validation process verifies that the input domain or subdomain name does not contain any dots. This would prevent users from bypassing the intended hierarchical registration process and deter potential domain or subdomain impersonation.
