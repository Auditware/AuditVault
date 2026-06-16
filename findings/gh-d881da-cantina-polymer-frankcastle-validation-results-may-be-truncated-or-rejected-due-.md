---
tags:
  - blockchain/evm
  - lang/solidity
  - platform/cantina
  - severity/high
  - sector/bridge
protocol: "[[Polymer]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[missing-check]]"
  - "[[permanent]]"
  - "[[cpi-program-id-validation]]"
---
3.1.1
Validation results may be truncated or rejected due to return data and log size limits
Severity: High Risk
Context: lib.rs#L220-L229
Description: The polymer_prover program returns validation results using set_return_data in the CPI
case, which is strictly limited to 1024 bytes by MAX_RETURN_DATA. If the ValidateEventResult::Valid event
exceeds this size, the Solana runtime will reject the return data with a ReturnDataTooLarge error, causing
the CPI call to fail and preventing the caller from receiving any result. In the non-CPI case, results are
emitted using emit!, which is limited by the LOG_MESSAGES_BYTES_LIMIT of 10kB per transaction, and this
limit is shared with all other logs and events in the transaction.
In both cases, if the ValidateEventResult::Valid event is too large, it is either silently truncated (non-CPI)
or causes an error (CPI), which can result in clients receiving incomplete or unusable validation results.
This is especially problematic for CPI integrations that rely on successful invocation, impeding the main
use case of the program.
Recommendation: It is recommended to store the validation result in a dedicated account instead of
relying on return data or logs. This approach avoids silent truncation, ensures reliable delivery of large
results, and allows clients to fetch the full validation output regardless of transaction log or return data
limits.
Polymer: Fixed in PR 24.
Cantina Managed: Fix veriﬁed.
3.1.2
Missing Veriﬁcation of the L2 World State Root in the proveL2Native and proveSettledState
Functions
Severity: High Risk
Context: OPStackBedrockProver.sol#L142
Description: In the proveL2Native function, the storage slot to be veriﬁed is validated against the L2
world state root, which in turn is expected to be veriﬁed through a call to the Bedrock prover.
However, in the Bedrock prover, the output root is veriﬁed against the oracle account's storage root. The
function responsible for generating this output root receives the L1 world state root instead of the L2
world state root, which results in an incorrect output root and invalid veriﬁcation.
outputRoot = _generateOutputRoot(
_chainConfig.versionNumber, _args._l1WorldStateRoot, _args._l2MessagePasserStateRoot, blockHash
);
function _generateOutputRoot(
uint256 _outputRootVersion,
// Version
bytes32 _worldStateRoot,
// L1 state root (incorrect)
bytes32 _messagePasserStateRoot,
// Message passer root
bytes32 _latestBlockHash
// L2 block hash
) internal pure returns (bytes32) {
return keccak256(abi.encode(_outputRootVersion, _worldStateRoot, _messagePasserStateRoot,
_latestBlockHash));
,→
}
Impact: If _l2WorldStateRoot is not included in the output root computation (due to the incorrect use of
_args._l1WorldStateRoot), the function does not verify that _l2WorldStateRoot matches the state root
recorded in the L2OutputOracle.
This allows an attacker to supply an arbitrary _l2WorldStateRoot that is not checked against the L1-settled
L2 state. Consequently, the trustlessness of the veriﬁcation process is undermined, potentially resulting
in validation against a fake or manipulated L2 state root. This has a high impact as it compromises the
correctness of proofs.
Recommendation: To address this issue and ensure the _l2WorldStateRoot is properly veriﬁed:
4

1. Fix the _generateOutputRoot Call: Update the _proveWorldStateBedrock function to use _args._-
l2WorldStateRoot instead of _args._l1WorldStateRoot:
bytes32 outputRoot = _generateOutputRoot(
_chainConfig.versionNumber,
_args._l2WorldStateRoot,
_args._l2MessagePasserStateRoot,
keccak256(_rlpEncodedL2Header)
);
2. Verify the L2 Header State Root: Extract the state root from _rlpEncodedL2Header (ﬁeld 3) and com-
pare it with _args._l2WorldStateRoot to ensure consistency:
bytes32 l2HeaderStateRoot = bytes32(RLPReader.readBytes(RLPReader.readList(_rlpEncodedL2Header)[3]));
if (l2HeaderStateRoot != _args._l2WorldStateRoot) {
revert InvalidL2StateRoot(l2HeaderStateRoot, _args._l2WorldStateRoot);
}
This step ensures that _l2WorldStateRoot accurately reﬂects the actual L2 block header's state root,
maintaining trust in the veriﬁcation process.
Polymer: Fixed in PR 146.
Cantina Managed: Fix veriﬁed.
