---
tags:
  - lang/solidity
  - platform/consensys
  - has/github
  - severity/high
  - sector/infra
protocol: "[[OmiseGo MoreVP]]"
auditors:
  - "[[Daniel Luca]]"
report: "https://consensys.net/diligence/audits/2020/01/omisego-morevp/"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[bridge-merkle-proof]]"
  - "[[circuit-input-range-check]]"
---
# Merkle.checkMembership allows existence proofs for the same leaf in multiple locations in the tree ✓ Addressed

- id: 13851
- impact: HIGH
- protocol: [[OmiseGo MoreVP]]
- reporter: Daniel Luca (ConsenSys)
- source: https://consensys.net/diligence/audits/2020/01/omisego-morevp/

## Summary


A bug was discovered in the `checkMembership` function used by several contracts to prove that transactions exist in the child chain. This function uses a `leaf`, an `index`, and a `proof` to construct a hypothetical root hash which is then compared to the passed in `rootHash` parameter. The bug was that because the function makes no requirements on the height of the tree or the size of the proof relative to the provided `index`, it is possible to pass in invalid values for `index` that prove a leaf’s existence in multiple locations in the tree. 

This was addressed in [omisego/plasma-contracts#533](https://github.com/omisego/plasma-contracts/pull/533) by including a check in `PosLib` that restricts transaction indices to between `0` and `2**16 - 1` inclusive. A subsequent change in [omisego/plasma-contracts#547](https://github.com/omisego/plasma-contracts/pull/547) ensured the passed-in index satisfied the recommended criterion.

The bug could be used to double exit deposit transactions, as the output id calculation is different for standard transactions and deposit transactions. By using the behavior described in this issue in conjunction with methods discussed in [issue 5.8](#recommendation-add-a-tree-height-limit-check-to-merklesol) and <https://github.com/ConsenSys/omisego-morevp-audit-2019-10/issues/20,> it was possible to exit deposit transactions twice using indices `0` and `2**16`.

The recommended solution was to use the length of the proof to determine the maximum allowed index, and ensure range checks on transaction position decoding are sufficiently restrictive. This bug was reported in the plasma-contracts repo: <https://github.com/omisego/plasma-contracts/issues/546>.

## Details

#### Resolution



This was addressed in [omisego/plasma-contracts#533](https://github.com/omisego/plasma-contracts/pull/533) by including a check in `PosLib` that restricts transaction indices to between `0` and `2**16 - 1` inclusive. A subsequent change in [omisego/plasma-contracts#547](https://github.com/omisego/plasma-contracts/pull/547) ensured the passed-in index satisfied the recommended criterion.


#### Description


`checkMembership` is used by several contracts to prove that transactions exist in the child chain. The function uses a `leaf`, an `index`, and a `proof` to construct a hypothetical root hash. This constructed hash is compared to the passed in `rootHash` parameter. If the two are equivalent, the proof is considered valid.


The proof is performed iteratively, and uses a pseudo-index (`j`) to determine whether the next proof element represents a “left branch” or “right branch”:


**code/plasma\_framework/contracts/src/utils/Merkle.sol:L28-L41**



```
uint256 j = index;
// Note: We're skipping the first 32 bytes of `proof`, which holds the size of the dynamically sized `bytes`
for (uint256 i = 32; i <= proof.length; i += 32) {
    // solhint-disable-next-line no-inline-assembly
    assembly {
        proofElement := mload(add(proof, i))
    }
    if (j % 2 == 0) {
        computedHash = keccak256(abi.encodePacked(NODE\_SALT, computedHash, proofElement));
    } else {
        computedHash = keccak256(abi.encodePacked(NODE\_SALT, proofElement, computedHash));
    }
    j = j / 2;
}

```
If `j` is even, the computed hash is placed before the next proof element. If `j` is odd, the computed hash is placed after the next proof element. After each iteration, j is decremented by `j = j / 2`.


Because `checkMembership` makes no requirements on the height of the tree or the size of the proof relative to the provided `index`, it is possible to pass in invalid values for `index` that prove a leaf’s existence in multiple locations in the tree.


#### Examples


By modifying existing tests, we showed that for a tree with 3 leaves, leaf 2 can be proven to exist at indices 2, 6, and 10 using the same proof each time. The modified test can be found here: <https://gist.github.com/wadeAlexC/01b60099282a026f8dc1ac85d83489fd#file-merkle-test-js-L40-L67>



```
it('should accidentally allow different indices to use the same proof', async () => {
  const rootHash = this.merkleTree.root;
  const proof = this.merkleTree.getInclusionProof(leaves[2]);

  const result = await this.merkleContract.checkMembership(
    leaves[2],
    2,
    rootHash,
    proof,
  );
  expect(result).to.be.true;

  const nextResult = await this.merkleContract.checkMembership(
    leaves[2],
    6,
    rootHash,
    proof,
  );
  expect(nextResult).to.be.true;

  const nextNextResult = await this.merkleContract.checkMembership(
    leaves[2],
    10,
    rootHash,
    proof,
  );
  expect(nextNextResult).to.be.true;
});

```
#### Conclusion


Exit processing is meant to bypass exits processed more than once. This is implemented using an “output id” system, where each exited output should correspond to a unique id that gets flagged in the `ExitGameController` contract as it’s exited. Before an exit is processed, its output id is calculated and checked against `ExitGameController`. If the output has already been exited, the exit being processed is deleted and skipped. Crucially, output id is calculated differently for standard transactions and deposit transactions: deposit output ids factor in the transaction index.


By using the behavior described in this issue in conjunction with methods discussed in [issue 5.8](#recommendation-add-a-tree-height-limit-check-to-merklesol) and <https://github.com/ConsenSys/omisego-morevp-audit-2019-10/issues/20,> we showed that deposit transactions can be exited twice using indices `0` and `2**16`. Because of the distinct output id calculation, these exits have different output ids and can be processed twice, allowing users to exit double their deposited amount.


A modified `StandardExit.load.test.js` shows that exits are successfully enqueued with a transaction index of `65536`: <https://gist.github.com/wadeAlexC/4ad459b7510e512bc9556e7c919e0965#file-standardexit-load-test-js-L55>


#### Recommendation


Use the length of the proof to determine the maximum allowed index. The passed-in index should satisfy the following criterion: `index < 2**(proof.length/32)`. Additionally, ensure range checks on transaction position decoding are sufficiently restrictive (see <https://github.com/ConsenSys/omisego-morevp-audit-2019-10/issues/20)>.


Corresponding issue in plasma-contracts repo: <https://github.com/omisego/plasma-contracts/issues/546>
