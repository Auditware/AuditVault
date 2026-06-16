---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/staking
protocol: "[[FCHAIN Validator And Staking]]"
auditors:
  - OpenZeppelin
report: "https://blog.openzeppelin.com/fchain-validator-and-staking-contracts-audit"
genome:
  - "[[bridge-message-validation]]"
  - "[[bridge-sender-auth]]"
  - "[[bridge/missing-validation]]"
  - "[[privilege-escalation/role-bypass]]"
  - "[[known-pattern]]"
  - "[[cross-chain-message]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# Insufficient Checks on Warp Messages

- id: 55347
- impact: HIGH
- protocol: FCHAIN Validator and Staking Contracts Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/fchain-validator-and-staking-contracts-audit

## Summary


The bug report describes an issue with two functions, `completeValidatorChange` and `completeDelegatorRegistration`, in the `StakeManager.sol` file of the `fchain-contracts` repository. These functions use Warp messages to validate logic, but the messages are not sufficiently checked. This allows for manipulation of the messages and can lead to unauthorized changes in validators and delegators, potentially affecting rewards. The report suggests recording and comparing nonces to prevent these issues. The bug has been resolved in a pull request.

## Details

Within the [`completeValidatorChange`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L755) and [`completeDelegatorRegistration`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L276) functions, Warp messages are ingested and utilized to validate logic. However, these Warp messages are insufficiently checked.

In [`completeValidatorChange`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L755), any value can be specified for [`oldNonceTarget` and `newNonceTarget`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L759-L760), but these values are [only used once](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L772-L778), for checks against [`oldNonceMessage` and `newNonceMessage`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L763-L770). Because of this, any message indices can be specified, allowing the function to easily execute without having the expected Warp messages. This may allow some delegator to quickly change their validator without having the approval of the P-chain. This can also be leveraged to trigger changes for validators that the caller does not control, potentially affecting other users' rewards.

In [`completeDelegatorRegistration`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L276), the only value in the Warp message that is used is the [`validationID`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L280-L282). Thus, any incorrect message with that same `validationID` may be used to make the function execute successfully. This may allow any delegator to register with a validator without having the approval of the P-chain.

In both cases, the amount of rewards accrued by this delegator can be easily manipulated. Thus, consider recording nonces for validator changes within [`initiateValidatorChange`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L694) and using these in `completeValidatorChange` to ensure that the messages used are newer than the initial request. This may also be used to prevent users from changing the validator of delegators that they do not know. Similarly, consider storing the [`nonce`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L255) obtained in `initializeDelegatorRegistration` and recording the `nonce` obtained from the Warp message [parsed in `completeDelegatorRegistration`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L280-L282). These values should be compared with each other to ensure that the P-Chain Warp message is newer than the request to initialize delegation.

***Update:** Resolved in [pull request #45](https://github.com/0xFFoundation/fchain-contracts/pull/45).*
