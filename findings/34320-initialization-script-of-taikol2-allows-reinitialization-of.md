---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/pda/reinitialization
  - precondition/uninitialized
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/initialize-proxy
  - sector/infra
protocol: "[[Taiko]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/taiko-protocol-audit"
genome:
  - "[[reinitialization]]"
  - "[[data/uninitialized]]"
  - "[[variant]]"
  - "[[admin-takeover]]"
  - "[[initializer-auth]]"
  - "[[pda-derivation]]"
---
# Initialization Script of TaikoL2 Allows Reinitialization of the Rollup - Phase 1

- id: 34320
- impact: HIGH
- protocol: [[Taiko]] Protocol Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/taiko-protocol-audit

## Summary


The `TaikoL2` contract has a bug where a malicious actor can take control of critical functions by manipulating the initialization process. This can allow them to withdraw any token or change the base fee of the rollup contract at will. To fix this, the initialization script should be modified to correctly initialize all variables and a test should be added to ensure the correct storage layout. This issue has been resolved in a recent pull request.

## Details

The `TaikoL2` contract is intended to be initialized by a [script](https://github.com/taikoxyz/taiko-mono/blob/b47fc34cb0e7fe9b7ebd9416b3051a067483b860/packages/protocol/utils/generate_genesis/taikoL2.ts#L499-L516) setting the state variables in the genesis state root directly instead of calling the [`init`](https://github.com/taikoxyz/taiko-mono/blob/b47fc34cb0e7fe9b7ebd9416b3051a067483b860/packages/protocol/contracts/L2/TaikoL2.sol#L71-L98) function. However, this script does not initialize the `_initialized` variable to `1` on the rollup contract. This means that `init` could be called after deployment during the first block by a malicious actor to set itself as the owner of `TaikoL2` or change the address manager, giving it control of critical functions.


Once granted the owner role, a malicious actor could, for example, [withdraw any token](https://github.com/taikoxyz/taiko-mono/blob/b47fc34cb0e7fe9b7ebd9416b3051a067483b860/packages/protocol/contracts/L2/TaikoL2.sol#L163-L178) sent to the `TaikoL2` contract, or change the base fee of the rollup at will by [manipulating the configuration](https://github.com/taikoxyz/taiko-mono/blob/b47fc34cb0e7fe9b7ebd9416b3051a067483b860/packages/protocol/contracts/L2/TaikoL2EIP1559Configurable.sol#L25-L40). An example of malicious usage of this privilege could be to include one transaction setting the base fee to 1 wei at the beginning of its blocks before resetting it to a very high level at the end, allowing this user to have a monopoly over L2 transaction inclusion by pricing out all the other block proposers as well as circumventing any gas limit.


Consider modifying the genesis script to initialize all the variables of the `TaikoL2` contract correctly, as well as adding a test scenario to ensure the storage layouts of the L2 contracts initialized by calling `init` are the same as the ones obtained by running the initialization script. This would also be useful for rollup users to be able to reproduce the genesis state root and ensure that no backdoor was included in the initial state.


Note that the initialization script is out of the scope of this engagement.


***Update:** Resolved in [pull request #16543](https://github.com/taikoxyz/taiko-mono/pull/16543) at commit [37fa853](https://github.com/taikoxyz/taiko-mono/commit/37fa853bd4d560a8ef0301437303f35f0d0c4c92). The deployment script was modified to initialize those variables.*
