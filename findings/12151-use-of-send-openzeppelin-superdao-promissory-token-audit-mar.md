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
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[access-roles]]"
---
# Use of send

- id: 12151
- impact: HIGH
- protocol: [[SuperDAO]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/draft-superdao-promissory-token-audit-2409e0fe776c/

## Summary


The bug report is about the use of the `send` function in the PromissoryToken.sol contract. When there is more than one destination in a withdrawal proposal, one of the destination addresses can prevent all others from getting the funds. If one of the destination addresses throws in the fallback function, the whole `approveWithdraw`function call will fail, causing all payments to fail. This gives control to any malicious payee to block payments to all other payees.

The report states that the use of `send` is always risky and should be analyzed in detail. It recommends that the return value of the `send` function should always be checked, that the `send` function should be called at the end of the function, and that pull payments should be favored over push payments.

The bug report is important because it highlights the risks of using the `send` function and provides recommendations on how to mitigate these risks. It is important for beginners to be aware of the potential security risks associated with the `send` function and to follow best practices when using it.

## Details

Use of `send` is always risky and should be analyzed in detail. One occurrence found in [line 291 of PromissoryToken.sol](https://github.com/Superdao-DAO/Superdao-Seed-Stage1/blob/c20d6d45d911f59003122d97df701848cf597cab/contracts/PromissoryToken.sol#L291).  

– [Always check send return value](https://medium.com/zeppelin-blog/onward-with-ethereum-smart-contract-security-97a827e47702#c528): OK.  

– [Consider calling send at the end of the function](https://medium.com/zeppelin-blog/onward-with-ethereum-smart-contract-security-97a827e47702#3d17): OK.  

– [Favor pull payments over push payments](https://medium.com/zeppelin-blog/onward-with-ethereum-smart-contract-security-97a827e47702#fa61): Severe problem.


If there is more than one destination in a withdrawal proposal, one of the destination addresses can prevent all others from getting the funds. If one of the destination addresses throws in the fallback function, the whole `approveWithdraw`function call will fail, causing all payments to fail. This gives control to any malicious payee to block payments to all other payees.


For more info on this problem, [see this note](https://github.com/ConsenSys/Ethereum-Development-Best-Practices/wiki/Fallback-functions-and-the-fundamental-limitations-of-using-send%28%29-in-Ethereum-&-Solidity#abuse).
