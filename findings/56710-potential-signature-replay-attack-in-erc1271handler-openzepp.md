---
tags:
  - blockchain/evm
  - blockchain/evm/zksync
  - lang/solidity
  - sector/account
  - sector/bridge
  - sector/governance
  - sector/insurance
  - sector/staking
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/bridge/replay
  - novelty/variant
  - misassumption/bridge-is-secure
  - misassumption/signature-is-unique
  - fix/add-nonce
  - trigger/cross-chain-message
protocol: "[[SSO Account]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/sso-account-oidc-recovery-solidity-audit"
genome:
  - "[[replay]]"
  - "[[variant]]"
  - "[[role-bypass]]"
  - "[[account-ownership]]"
  - "[[bridge-message-validation]]"
  - "[[permit-fork-replay]]"
---
# Potential Signature Replay Attack in ERC1271Handler

- id: 56710
- impact: HIGH
- protocol: [[SSO Account]] OIDC Recovery Solidity Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/sso-account-oidc-recovery-solidity-audit

## Summary


The bug report discusses an issue with the `isValidSignature` function in the `ERC1271Handler` contract. This function is used to verify signatures and ensure that a contract can execute certain actions based on the provided inputs. However, there are insufficient checks in place, which could allow an attacker to reuse a historical transaction hash and signature to execute actions on behalf of an account. Additionally, a recent change to the validation method has removed important security measures, making the contract vulnerable to cross-chain attacks and signature reuse across different accounts. To fix this issue, the report suggests implementing a defensive rehashing scheme proposed in ERC7739 and protecting alternative validation methods from signature replay attacks. The issue has been resolved in a recent update, but the fix relies on a third-party contract that has not been independently reviewed by the team. 

## Details

The `isValidSignature` function is commonly used to verify signatures in scenarios where an external account is not required to initiate a call. It ensures that the contract allows the execution of some logic based on the check of provided inputs.

In the [`isValidSignature` function](https://github.com/matter-labs/zksync-sso-clave-contracts/blob/ed21d09add8da99d9c82d0f7c30659625c6636e6/src/handlers/ERC1271Handler.sol#L25) of the `ERC1271Handler` contract, insufficient checks may allow nearly any action if the contract calling `isValidSignature` does not fully validate the provided data or hash. For [EOA signatures](https://github.com/matter-labs/zksync-sso-clave-contracts/blob/ed21d09add8da99d9c82d0f7c30659625c6636e6/src/handlers/ERC1271Handler.sol#L26-L30) (65-byte signatures), there are no restrictions on how the hash is constructed, and the function only confirms the signature’s validity and its association with a `k1owner`. An attacker could reuse a historical transaction hash and signature and execute actions on behalf of the account. Additionally, EIP712 logic [was removed](https://github.com/matter-labs/zksync-sso-clave-contracts/pull/391/files#diff-0ccc238950d01904211315cbce3cbf00b0c0f9638eed008de404ad766def9a2dL41) in the alternative validation method, permitting cross-chain attacks and the reuse of signatures across different accounts. Previously, [`_hashTypedDataV4`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/21c8312b022f495ebe3621d5daeed20552b43ff9/contracts/utils/cryptography/EIP712.sol#L109) included the chain ID and the verifier contract in the hash, safeguarding against such misuse.

Consider implementing the approach described in [ERC7739](https://eips.ethereum.org/EIPS/eip-7739), which proposes a defensive rehashing scheme specifically designed to address ERC1271 signature replay vulnerabilities-particularly across multiple smart accounts managed by the same EOA. This approach employs nested EIP-712 typed structures to maintain readability while effectively preventing signature replays. Additionally, consider protecting alternative validation methods, such as those using a validator, from signature replay attacks.

***Update:** Resolved in [pull request #439](https://github.com/matter-labs/zksync-sso-clave-contracts/pull/439) and commit [19747f1c](https://github.com/matter-labs/zksync-sso-clave-contracts/pull/439/commits/19747f1c8d3ad65c7c5bb6bcd4e295246b3c57ee). The fix leverages the [ERC1271.sol](https://github.com/Vectorized/solady/commits/4c895b961d45c53a49ed500cfc76868b7ee1328b/src/accounts/ERC1271.sol) contract from the Solady library. Our team did not conduct an independent security review of this dependency and instead relied on the [audit report](https://github.com/Vectorized/solady/blob/main/audits/cantina-spearbit-coinbase-solady-report.pdf) provided in the GitHub repository. However, the integration of the contract was thoroughly reviewed. The Matter Labs team stated:*

> *We implemented ERC7739 to prevent signature replay attacks as well as ensure that the signed contents are fully visible to the user upon signing.*

## Artifacts

- Raw capture: /Users/user/Desktop/crawlee-run/pages_capture.har
- Pages snapshot: /Users/user/Desktop/crawlee-run/all_findings_full.json
