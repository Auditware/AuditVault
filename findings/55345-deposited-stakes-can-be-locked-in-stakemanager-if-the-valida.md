---
tags:
  - lang/solidity
  - sector/staking
  - has/github
  - severity/high
protocol: "[[FCHAIN Validator And Staking]]"
auditors:
  - OpenZeppelin
report: "https://blog.openzeppelin.com/fchain-validator-and-staking-contracts-audit"
genome:
  - "[[dos-resistance]]"
  - "[[variant]]"
---
# Deposited Stakes Can Be Locked in StakeManager if the Validator Is Inactive

- id: 55345
- impact: HIGH
- protocol: FCHAIN Validator and Staking Contracts Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/fchain-validator-and-staking-contracts-audit

## Summary


The initializeDeposit function in the StakeManager contract allows validators and delegators to deposit resources for validating nodes. However, the function does not check if the validator is active before accepting the deposit, leading to locked stakes and the inability to withdraw them. This bug has been fixed in a recent update, which also introduced a cancelDeposit function to allow users to withdraw their deposited stakes if the validator becomes inactive before the deposit is complete.

## Details

The [`initializeDeposit` function](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L303) is designed to accept licenses and staking amounts as stakes for a validating node within the system. This function can be called by the validators to increase their own weight or by delegators to increase the weight of their delegated validator. However, the function does not validate the active status of a validator before proceeding with the deposit, allowing the stakers to inadvertently deposit resources into validators that are inactive. The function then [locks](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L314) the deposited licenses and value within the `StakeManager` contract, [adds the newly added weight to the validator's existing weight](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L316-L317), and [sends the corresponding set weight message to the P-Chain](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L319-L320). It also [creates an entry](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L322-L323) in the `pendingDeposits` mapping such that when `completeDeposit` function is called, these [stakes are added](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L350-L356) to the `nextEpochDeposit` mapping, which is [processed](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L984-L991) when the staker's balances are updated.

Given that the validator is already inactive, the P-Chain will reject the message to add weight and there will be no corresponding `messageIndex` available to call the [`completeDeposit` function](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L328). Therefore, `pendingDeposits` are never counted as part of the staker's balances. Furthermore, given that the locked stakes are not a part of staker's balance, the staker will not be able to withdraw these stakes due to the [revert](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L395-L402) in the `createWithdrawalRequest` function, thereby locking these stakes inevitably within the `StakeManager` contract.

Consider checking that the validator is active in the `initializeDeposit` function before accepting deposits.

***Update:** Resolved in [pull request #46](https://github.com/0xFFoundation/fchain-contracts/pull/46). The `initializeDeposit` function correctly checks if the validator is active before accepting stakes. Additionally, a `cancelDeposit` function has been introduced that allows users to withdraw any deposited stakes if the validator becomes inactive before the deposit is complete.*
