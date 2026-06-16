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
# Validators Can Skip createEndRequest and Quickly Re-Register

- id: 55346
- impact: HIGH
- protocol: FCHAIN Validator and Staking Contracts Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/fchain-validator-and-staking-contracts-audit

## Summary


The bug report discusses a discrepancy between the validator sets recorded on the FCHAIN and the P-chain within the ACP-77 specification. It is possible for validators to re-register only on the FCHAIN, which creates this discrepancy. This can occur when a validator is de-registered and then attempts to register again without properly updating their balances. This can result in a mismatch between the validator sets on the two chains. The bug has been resolved in a recent pull request.

## Details

[Within the ACP-77 specification](https://github.com/avalanche-foundation/ACPs/blob/main/ACPs/77-reinventing-subnets/README.md#registerl1validatortx), it is identified that a validator can only be registered once:

> *When it is known that a given validationID is not and never will be registered, the P-Chain must be willing to sign an L1ValidatorRegistrationMessage for the validationID with registered set to false. This could be the case if the expiry time of the message has passed prior to the message being delivered in a RegisterL1ValidatorTx, or if the validator was successfully registered and then later removed*

However, it is possible for validators to re-register only on the FCHAIN, which creates a discrepancy between the validator sets recorded on the FCHAIN and those on the P-chain. This is because once a validator is de-registered, the P-chain is obligated to refuse to register it again.

To do this, a validator must first call [`initializeValidatorRegistration`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L190). Once the [`L1ValidatorRegistrationMessage`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/ValidatorManager.sol#L333-L334) is received from the P-chain, the validator can call [`completeValidatorRegistration`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L218). After this, the validator can quickly call [`initializeEndValidation`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L446) and [`completeEndValidation`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L467), then once again call [`initializeValidatorRegistration`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L190) and [`completeValidatorRegistration`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L218), using the same [`messageIndex`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/ValidatorManager.sol#L333-L334) as the original registration. This must be performed without calling [`_updateBalances`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L1293) for that validator before `initializeEndValidation` is called, as doing so will affect the stake's [`fNodesTokenIDs` mapping](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L455-L457).

Additionally, this must all be done before the [`registrationExpiry` time](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/ValidatorManager.sol#L245) is reached. After this has occurred, the validator's [`isValidationEnded` boolean will be set to `true`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L471). This will have the effect of [preventing that validator's ending permanently](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L459-L461), preventing the [processing of uptime proofs](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L612-L633), and resulting in a mismatch between the validator sets recorded on the P-chain and on the FCHAIN. Note that another property of this vulnerability is validators are able to skip calling [`createEndRequest`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L415) entirely. This is clearly not the intended functionality.

Consider checking `isValidationEnded` [within the validator registration flow](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/ValidatorManager.sol#L259). Also, consider enforcing that in all cases, [`_updateBalances`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L1293) is called at least once before a validator can initialize the ending validation. It may be possible to enforce this by flagging any new validators as "needing balance updates", or by checking the [`startEpoch`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L226) and [`nextEpochDeposit`](https://github.com/0xFFoundation/fchain-contracts/blob/11ffd45bc95747b8d2432a2e8bb120d4a1dc19a2/src/StakeManager.sol#L230) values for that validator.

***Update:** Resolved in [pull request #43](https://github.com/0xFFoundation/fchain-contracts/pull/43).*
