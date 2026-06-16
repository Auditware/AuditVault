---
tags:
  - lang/solidity
  - sector/oracle
  - platform/ottersec
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Switchboard]]"
auditors:
  - "[[Woosun Song]]"
report: "https://switchboard.xyz/"
genome:
  - "[[reward-calculation]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
---
# Reward Manipulation

- id: 47980
- impact: HIGH
- protocol: Switchboard_evm
- reporter: Woosun Song (OtterSec)
- source: https://[[Switchboard]].xyz/

## Summary


The report discusses a bug in a contract that allows an attacker to steal funds from the diamond by increasing the rewards after updating an enclave. The vulnerability arises from the possibility of increasing the reward amount between reward provision and reward distribution. The report provides a proof of concept scenario where an attacker can exploit the vulnerability to withdraw the entire Ether balance from the contract. The bug has been fixed in the latest updates of the contract. To prevent such attacks in the future, the contract has been patched to prevent reward payouts if the reward amount is larger than the enclave balance.

## Details

## Vulnerability Description

An attacker may steal funds from the diamond by increasing rewards after updating an enclave before using it for validation. The reward is taken in `updateEnclave`, which posts the enclave’s cid.

## Code Snippet

```solidity
function updateEnclave(
    address enclaveId, // enclave id
    bytes calldata cid
) external payable guarded(1) {
    /* ... */
    // we pay the verifier queue's reward to verify the enclave
    uint256 verifierReward = queue.reward;
    if (msg.value < verifierReward) {
        revert ErrorLib.InsufficientBalance();
    }
    // Add balance to enclave
    EnclaveLib.fundEnclave(enclaveId, msg.value);
    /* ... */
}
```

The reward provided in `updateEnclave` is distributed upon failing or verifying an enclave. For instance, in `failEnclave`, a verifier enclave marks the subject enclave as failed and gives rewards to the verifier enclave’s owner.

## Code Snippet

```solidity
function failEnclave(
    address verifierId, // caller's enclave address
    address enclaveId, // enclave address to be verified
    uint256 enclaveIdx
) external guarded(1) {
    /* ... */
    // write enclave failure
    EnclaveLib.setEnclaveFailure(enclaveId);
    // do payout
    if (queue.reward > 0) {
        emit EnclavePayoutEvent(verifierId, enclaveId, queue.reward);
        payable(msg.sender).transfer(queue.reward);
    }
}
```

## Vulnerability Analysis

The vulnerability arises from the possibility of increasing the reward amount between reward provision and reward distribution.

### Proof of Concept

For the proof of concept, consider a scenario where an attacker executes the following steps:

1. The attacker creates an `AttestationQueue` with zero rewards.
2. The attacker creates an enclave and invokes `updateEnclave` and `forceOverrideVerify`, making it available as a verifier enclave. Because the attestation queue reward is zero, no funds are required to call `updateEnclave`.
3. The attacker increases the reward amount by calling `setAttestationQueueConfig`. The new reward amount is equal to the Ether balance of the diamond.
4. The attacker utilizes the verifier enclave to call `failEnclave` on itself. The attacker, who owns the verifier enclave, will be able to withdraw the `queue.reward` amount from the diamond, equal to its entire Ether balance.

This method allows the attacker to extract Ether from the contract.

## Remediation

Prevent reward payouts in `failEnclave` and `validateEnclave` if the reward amount is larger than the enclave balance.

## Patch

Fixed in commits `a58f237` and `a937a28`.
