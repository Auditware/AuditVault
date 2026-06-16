---
tags:
  - lang/solidity
  - sector/bridge
  - sector/governance
  - sector/oracle
  - sector/staking
  - platform/spearbit
  - has/github
  - severity/high
  - vuln/bridge/replay
  - vuln/oracle/stale-price
  - novelty/known-pattern
  - misassumption/bridge-is-secure
  - misassumption/oracle-is-reliable
  - misassumption/signature-is-unique
  - fix/add-check
  - fix/add-nonce
  - trigger/cross-chain-message
protocol: "[[Superform]]"
auditors:
  - "[[MiloTruck]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Superform-v2-periphery-Spearbit-Security-Review-June-2025.pdf"
genome:
  - "[[replay]]"
  - "[[stale-price]]"
  - "[[defi/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[bridge-message-validation]]"
  - "[[oracle-freshness]]"
  - "[[permit-fork-replay]]"
---
# Lack of replay protection in PPS oracle

- id: 63079
- impact: HIGH
- protocol: [[Superform]] v2 Periphery
- reporter: MiloTruck (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Superform-v2-periphery-Spearbit-Security-Review-June-2025.pdf

## Summary


This bug report highlights a security vulnerability in the `ECDSAPPSOracle` signature schema. The lack of a nonce in the schema makes it susceptible to replay attacks, which can disrupt the share accounting in `SuperVault` and `SuperVaultStrategy`. The report recommends updating the message hash computation and utilizing `_domainSeparatorV4()` before signing to include `block.chainid` and `address(this)` in the signature schema. This will help mitigate the vulnerability.

## Details

## Security Analysis Report

## Severity: High Risk

### Context
`ECDSAPPSOracle.sol#L127-L147`

### Description
The `ECDSAPPSOracle` signature schema does not include a nonce, which makes it vulnerable to replay attacks once enough validators (more than the `quorumRequirement`) sign the price update. A malicious user can exploit this by pushing an outdated PPS price, thereby disrupting the share accounting in both `SuperVault` and `SuperVaultStrategy` through signature replay.

- Create message hash with all parameters:
  - If any are incorrect, the message hash will differ, and the derived signer address will be incorrect, resulting in a revert.

```solidity
bytes32 messageHash = keccak256(abi.encodePacked(strategy, pps, ppsStdev, validatorSet, totalValidators, timestamp));
bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
```

Additionally, the signature schema lacks `block.chainid` and `address(this)`. If the strategy address is deployed across two blockchains, a malicious user can again push the outdated PPS price and break the share accounting in `SuperVault` and `SuperVaultStrategy` via a cross-chain signature replay.

### Recommendation
To mitigate this vulnerability, update the message hash computation as follows:

```solidity
// Existing code
bytes32 messageHash = keccak256(abi.encodePacked(strategy, pps, ppsStdev, validatorSet, totalValidators, timestamp));

// Recommended update
bytes32 messageHash = keccak256(abi.encodePacked(strategy, pps, ppsStdev, validatorSet, totalValidators, timestamp, nonces++));
```

Before signing, utilize `_domainSeparatorV4()` to include `block.chainid` and `address(this)` in the signature schema.
