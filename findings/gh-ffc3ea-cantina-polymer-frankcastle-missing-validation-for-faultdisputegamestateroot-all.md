---
tags:
  - blockchain/evm
  - lang/solidity
  - platform/cantina
  - severity/high
  - novelty/variant
  - sector/zk
protocol: "[[Polymer]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[missing]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
3.1.3
Missing Validation for faultDisputeGameStateRoot Allows invalid Finality
Severity: High Risk
Context: OPStackCannonProver.sol#L212, OPStackCannonProver.sol#L229
Description: The faultDisputeGameStateRoot is not validated against any trusted parameters such as
the _l1WorldStateRoot. Currently, only the rlpEncodedFaultDisputeGameData is validated. As a result, an
attacker can pass any arbitrary, malicious, or invalid faultDisputeGameStateRoot in the proof process.
This unvalidated root is used in the following locations:
// Verify game status storage proof
ProverHelpers.proveStorageBytes32(
abi.encodePacked(_faultDisputeGameStatusSlot),
faultDisputeGameStatusStorage,
_faultDisputeGameProofData.faultDisputeGameStatusStorageProof,
bytes32(_faultDisputeGameProofData.faultDisputeGameStateRoot)
);
// Prove that the FaultDispute game has been settled
ProverHelpers.proveStorageBytes32(
abi.encodePacked(_faultDisputeGameRootClaimSlot),
_rootClaim,
_faultDisputeGameProofData.faultDisputeGameRootClaimStorageProof,
bytes32(_faultDisputeGameProofData.faultDisputeGameStateRoot)
);
Without verifying that the faultDisputeGameStateRoot is derived from or included in the trusted rlpEncod-
edFaultDisputeGameData, the process can falsely conclude that a Fault Dispute Game has been resolved-
even when it has not. This breaks the resolution constraint.
Impact: This allows an attacker to ﬁnalize a fraudulent or disputed L2 state, effectively bypassing the
ﬁnality rules. Disputed games may be prematurely accepted as successful or failed, allowing invalid state
transitions to be considered ﬁnalized.
Recommendation: Introduce a validation step that ensures the faultDisputeGameStateRoot is veriﬁ-
ably included in or derived from the rlpEncodedFaultDisputeGameData. This guards against tampering
or spooﬁng and ensures only legitimate state roots are accepted during the proof process.
Polymer: Fixed in PR 147.
Cantina Managed: Fix veriﬁed.
5

3.1.4
NativeProver allows proofs of stale L2 states leading to potential false positives and nega-
tives
Severity: High Risk
Context: (No context ﬁles were provided by the reviewer)
Description: It is assumed that proofs of the NativeProver contract from the fallback path always prove
the latest state on the counterparty L2 chain, since they require a recent view of the L1 block hash on the
local L2. However, this assumption is incorrect. In practice, all previously settled L2 states are retained
on L1 (for both OP Stack Cannon and Bedrock), and proofs can be constructed for any of these historical
states. This leads to two main issues:
1. False Positives: A user can prove that a state S exists on chain A (counterparty) to chain B (local), even
if S is no longer current. By using a proof referencing an older L2 output or dispute game factory
proxy (which still exists on the most recent L1 block), the user can convince chain B that S exists,
even though it has been updated to S' in a more recent block.
2. False Negatives: If a state changes multiple times between L1 settlements (e.g., S →S' →S), and S'
does not exist in any block that was settled on L1, it cannot be proven at all. This means some valid
states may be unprovable if they do not coincide with a settled output.
This behavior can be problematic for DApps or protocols that assume a proven state is always the latest
or canonical state.
Recommendation: It is recommended to implemented the following mitigation measures:
• Acknowledge and document the limitation: Clearly document that the protocol only proves existence
of a state at some point in the past, not necessarily the latest state. DApp developers should be
advised to only rely on states that are monotonic or irrevocable, or to locally track and reject stale
states.
• Return proven block number: Update the affected methods to return the block number associated
with the proven state. This allows DApps to check the recency of the proof and enforce their own
freshness/staleness policies.
Disclaimer: This protocol-level limitation / potential vulnerability was discovered by the Polymer team and in-
cluded in the report for the sake of completeness..
Polymer: Fixed in PR 148.
Cantina Managed: Fix veriﬁed.
3.2
Medium Risk
3.2.1
Possible revocation of Irrevocable Roles in Registry.sol
Severity: Medium Risk
Context: Registry.sol#L95-L101
Description: The Registry contract allows revoking roles for irrevocable chain IDs because it does not
override the revokeRole function from OpenZeppelin's AccessControl library to enforce irrevocability.
This creates a vulnerability where an admin can revoke an irrevocable role, potentially leaving an irre-
vocable chain without any grantees. Such a scenario could enable a DoS by preventing conﬁguration
updates for that chain, as no grantee would be authorized to manage it.
function grantChainIDIrrevocable(address _grantee, uint256 _chainID) external onlyOwner isRevocable(_chainID) {
return _grantChainIDIrrevocable(_grantee, _chainID);
}
function _grantChainIDIrrevocable(address _grantee, uint256 _chainID) internal isRevocable(_chainID) {
BitMaps.set(_irrevocableChainIDBitmap, _chainID);
bytes32 role = _getChainRole(_chainID);
_grantRole(role, _grantee);
emit NewIrrevocableGrantee(_chainID, _grantee);
}
The Registry contract uses a BitMaps.BitMap (_irrevocableChainIDBitmap) to mark chain IDs as irrevo-
cable, preventing further grants or modiﬁcations via the isRevocable modiﬁer. However, the revokeRole
6

function inherited from AccessControl does not check _irrevocableChainIDBitmap, allowing an admin
(DEFAULT_ADMIN_ROLE) to revoke roles for irrevocable chain IDs.
function revokeRole(
bytes32 role,
address account
) public virtual override onlyRole(getRoleAdmin(role)) {
_revokeRole(role, account);
}
Recommendation: To mitigate this, the revokeRole function should be overridden to only permit revo-
cation for revocable roles on revocable chain IDs, ensuring that irrevocable roles remain protected and
