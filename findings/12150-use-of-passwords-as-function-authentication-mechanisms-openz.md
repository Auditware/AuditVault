---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/governance
protocol: "[[SuperDAO]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/draft-superdao-promissory-token-audit-2409e0fe776c/"
genome:
  - "[[missing-signer]]"
  - "[[role-bypass]]"
  - "[[bridge-sender-auth]]"
---
# Use of passwords as function authentication mechanisms

- id: 12150
- impact: HIGH
- protocol: [[SuperDAO]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/draft-superdao-promissory-token-audit-2409e0fe776c/

## Summary


This bug report is about an authentication mechanism used in a blockchain. It states that the use of `founderHash`, `privatePhrase` and `_oneTimesharedPhrase` as an authentication mechanism does not add any security. This is because these variables can be read by anyone from the blockchain, and anyone can check the transaction data to recover the parameter values. Therefore, the checks using these variables are useless and can be removed with an equivalent result.

The bug report suggests switching to `msg.sender`-based authentication as used in a certain github repository. This authentication mechanism is based on the sender of a message, which is more secure than the existing one.

Overall, this bug report is about an authentication mechanism used in a blockchain that is not secure. It suggests switching to `msg.sender`-based authentication as an alternative, which is more secure.

## Details

The use of `founderHash`, `privatePhrase` and `_oneTimesharedPhrase` as an authentication mechanism does not add any security. Even non-public variables can be read by anyone from the blockchain, and anyone can check transaction data to recover parameter values. Checks using `founderHash`, `privatePhrase` and `_oneTimesharedPhrase` are useless and can thus be removed with an equivalent result.


Consider switching to `msg.sender`-based authentication as used [here](https://github.com/Superdao-DAO/Superdao-Seed-Stage1/blob/c20d6d45d911f59003122d97df701848cf597cab/contracts/PromissoryToken.sol#L101).
