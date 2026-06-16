---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/infra
protocol: "[[NetMind]]"
auditors:
  - "[[Jennifer Wu]]"
report: "https://certificate.quantstamp.com/full/net-mind/e7dfdc3c-7589-4fc8-b3d8-4872c783a735/index.html"
genome:
  - "[[signature-replay]]"
  - "[[direct-drain]]"
  - "[[permit-fork-replay]]"
---
# Signature Replay

- id: 59205
- impact: HIGH
- protocol: [[NetMind]]
- reporter: Jennifer Wu (Quantstamp)
- source: https://certificate.quantstamp.com/full/net-mind/e7dfdc3c-7589-4fc8-b3d8-4872c783a735/index.html

## Summary


The report discusses an issue in the `Payment.sol` file where the functions `distribute()` and `agentDistribute()` can be replayed multiple times without authorization. This means that someone can use the same transaction data to transfer funds repeatedly until the payment has no more funds or expires. The report recommends adding a unique number to each payment and including it in the transaction data to prevent this from happening.

## Details

**Update**
The client fixed the issue in commit `ca190112e3f1651680f8330f808100b95b11b239`. The functions `distribute()`, `agentDistribute()`, and `refund()` now all mark a digest as used. As these actions are processed, it is enforced that the hash of the parameters (e.g., `paymentId`, `amt`, etc.) has not been seen before, preventing the possibility of signatures being used more than once.

**File(s) affected:**`Payment.sol`

**Description:** The functions `distribute()` and `agentDistribute()` are susceptible to signature replay since a nonce is not included in the digest. After either function is called, anyone can reuse the calldata, which consists of the authorized account signatures, to replay the distribute transaction. The transaction can be replayed continuously until the payment has no remaining funds or the `expir` time is reached.

**Exploit Scenario:**

1.   Bob calls `payment()` and deposits 10 NMT into the `Payment` contract.
2.   Bob is charged two NMT for GPU fees and one NMT for platform fees.
3.   The distribution digest is created using the payment ID, GPU provider's address, GPU fee amount, platform fee amount, and the digest expiration time.
4.   Authorized accounts sign the distribution digest.
5.   The signatures are collected and `distribute()` is called. Two NMT are transferred to the GPU provider, and one NMT is transferred to the `feeTo` address. Bob's payment `distributed` amount is now three NMT.
6.   Before the `expir` time is reached, a malicious actor finds the distribution transaction and replays the transaction with the same calldata. Again, three NMT of Bob's payment is transferred between the GPU provider and the `feeTo` address. Bob's payment `distributed` amount is now six NMT.
7.   The malicious actor replays the transaction again. Bob's payment `distributed` amount is now nine NMT. 
8.   The transaction cannot be replayed again as Bob's payment only has one NMT remaining.

**Recommendation:** Implement a nonce per `paymentId`, include it in the distribution digest, and increment the nonce when executing the distribution.
