---
tags:
  - lang/solidity
  - sector/dex
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/bridge/replay
  - novelty/variant
  - misassumption/bridge-is-secure
  - misassumption/signature-is-unique
  - fix/add-nonce
  - trigger/cross-chain-message
protocol: "[[Bebop]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Bebop/README.md#1-eip712-domain_separator-stored-as-immutable"
genome:
  - "[[replay]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
  - "[[bridge-message-validation]]"
  - "[[permit-fork-replay]]"
---
# EIP712 DOMAIN_SEPARATOR stored as immutable

- id: 27801
- impact: HIGH
- protocol: [[Bebop]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Bebop/README.md#1-eip712-domain_separator-stored-as-immutable

## Summary


This bug report is about the vulnerability of replay attacks in the code of EIP712 implementation. EIP712 is a standard for signing messages on the Ethereum blockchain. The code's EIP712 implementation uses cached values (stored as immutable variables) which are independent of the actual chain ID which could be returned by the `CHAINID` EVM opcode. This approach is potentially unsafe as such signatures could be deemed valid in forked networks, thus creating a vulnerability to replay attacks. When combined with unlimited approvals, orders placed on one network could be "replayed" on a forked network without the account owner's consent.

To prevent replay attacks, it is recommended to adhere to the best practices of the EIP712 implementation (refer to OpenZeppelin's EIP712.sol). This would ensure that the signatures are only valid in the intended network and not in any forked networks.

## Details

##### Description
To prevent so-called "replay attacks", EIP712 incorporates the chain ID into the signed data. However, the audited [code's](https://github.com/bebop-dex/bebop-smart-contracts/blob/f42cc5efe7a843bb015aec409aaa08e7643d0ca9/src/contracts/base/BebopSigning.sol#L42) EIP712 implementation uses cached values (stored as immutable variables), independent of the actual chain ID which could be returned by the `CHAINID` EVM opcode. This approach is potentially unsafe as such signatures could be deemed valid in forked networks, thus creating a vulnerability to replay attacks.

When combined with unlimited approvals (refer to Medium.1), orders placed on one network could be "replayed" on a forked network without the account owner's consent.
##### Recommendation
To prevent replay attacks, it is recommended to adhere to the best practices of the EIP712 implementation (refer to OpenZeppelin's EIP712.sol).
