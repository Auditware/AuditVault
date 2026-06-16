---
tags:
  - lang/circom
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/nft
  - sector/stable
  - sector/zk
protocol: "[[Hinkal Protocol]]"
auditors:
  - "[[Shih-Hung Wang]]"
report: "https://certificate.quantstamp.com/full/hinkal-protocol/66b9b783-8b42-4a4e-89ed-3ef2a2df5958/index.html"
genome:
  - "[[missing-check]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[fee-accounting]]"
  - "[[commitment-uniqueness]]"
  - "[[nullifier-uniqueness]]"
---
# The Protocol Can Be Drained Through Commitment Duplication

- id: 60148
- impact: HIGH
- protocol: [[Hinkal Protocol]]
- reporter: Shih-Hung Wang (Quantstamp)
- source: https://certificate.quantstamp.com/full/hinkal-protocol/66b9b783-8b42-4a4e-89ed-3ef2a2df5958/index.html

## Summary


The client has marked a bug as "Fixed" and provided an explanation for the fix. The bug is related to the Hinkal protocol and involves the ability to duplicate commitments, which can lead to draining of the protocol. The bug can be exploited by manipulating the input array to the Circom Verifiers. The report provides a step-by-step exploit scenario and recommends validating the construction of the input array to prevent future occurrences of the bug.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `ce730843c3b97f7894ec503f6c1b1ff8cf698b30`, `95bb18d84159a16a6d34572bb8b0d75dacd23051`, `7a13bf4312082ccd57495bc3d92265876b9feac1`. The client provided the following explanation:

> Validated Dimensions against Circom Data

**File(s) affected:**`Hinkal.sol`, `CircomDataBuilder.sol`, `HinkalHelper.sol`

**Description:** Commitments are intended to be nullified once spent to prevent users from reusing commitments in future transactions. However, it is possible to insert commitments without nullifying previous commitments. This is done by exploiting the construction of the input array to the Circom Verifiers. The duplicated commitments can later be withdrawn. With enough duplicated commitments, the entire protocol can be drained.

**Exploit Scenario:**

1.   Alice deposits 1,000,001 USDC into Hinkal.
2.   Alice generates a valid proof for transferring 1 USDC to Bob. The proof is to be verified with `swapperM1x2x1.circom`. It must be a token transfer as we need `amountChanges[0]` (the net flow of USDC in/out of the contract) to be equal to `0` for the exploit.
3.   Alice submits the valid transaction to `Hinkal.transact()` with the following modifications:
    1.   Assigns `circomData.inputNullifiers` to be an empty array.
    2.   Assigns `circomData.tokenIds` to be an array containing the valid `inputNullifiers`.
    3.   Keeps `dimensions` as intended for the `swapperM1x2x1` circuit. Though `tokenIds` was added, the NFT circuit will not be used. 

4.   The checks in `HinkalHelper.performHinkalChecks()` do not have any requirements for `inputNullifiers` or `tokenIds`, and will all pass.
5.   `inputForCircom` is constructed in `CircomDataBuilder.formInputForCircom()`. Following the function calls, the construction of the `input` array begins in `formBasicInput()`. The `tokenIds` and `inputNullifiers` are appended to the array sequentially. A normal transaction would have empty `tokenIds` and a populated `inputNullifiers`. However, in our input, we have the reverse. **This results in an identical `input` array, but a `circomData` object without `inputNullifiers`.**
6.   `verifyProof()` passes, as the `inputForCircom` will contain valid data for the supplied proof, and `buildVerifierId()` will choose the right verifier given our user-supplied `dimensions` object.
7.   **`insertNullifiers()` will not insert any nullifiers since it is empty.** Alice's previous 1,000,001 USDC commitment will not be nullified. The new commitments will be added with `insertCommitments()`, making Alice entitled to 1,000,000 USDC and Bob to 1 USDC.
8.   `getBalancesForArray()` will not revert, since its child call `Transferer.getNftBalance()` is in a try-catch.
9.   `internalTransact()` does nothing if `amountChanges[0] == 0`, which is the case for transfers. The remaining balance checks should pass as well.
10.   Alice is left with her old commitment of 1,000,001 USDC and a new commitment of 1,000,000 USDC, both of which can be withdrawn the conventional way. She has effectively doubled her wealth and can continue to duplicate commitments and drain the entire protocol.

**Recommendation:** Require that the `circomData` object be properly constructed. Validate `dimensions` against the `circomData` object.
