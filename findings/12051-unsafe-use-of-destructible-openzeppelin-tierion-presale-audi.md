---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/token
protocol: "[[Tierion]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/tierion-presale-audit-ec14b91c3140/"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# Unsafe use of Destructible

- id: 12051
- impact: HIGH
- protocol: [[Tierion]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/tierion-presale-audit-ec14b91c3140/

## Summary


This bug report discusses the use of the contract [`Destructible`](https://github.com/OpenZeppelin/zeppelin-solidity/blob/v1.1.0/contracts/lifecycle/Destructible.sol), which allows the owner to destroy the contract and forward the funds to an address. It is noted that the same purpose can be achieved via the contract’s own `withdraw` function, however, `Destructible`’s `destroy` can be called at any moment, including when the contract is paused.

The main issue with using `Destructible` is that it removes the smart contract’s code from its address, meaning that any transactions sent to the address after destruction will no longer be interpreted as function calls, but as simple ETH transfers. This means that any Ether sent to a destroyed contract is lost forever. It is strongly recommended against making any contract whose purpose is to receive payments an instance of `Destructible`.

The recommendation was followed, and the contract is no longer `Destructible`. This means that the contract is no longer vulnerable to the potential loss of Ether.

## Details

As seen in line 7, the contract is [`Destructible`](https://github.com/OpenZeppelin/zeppelin-solidity/blob/v1.1.0/contracts/lifecycle/Destructible.sol): the owner can destroy it at any moment, forwarding the funds to an address. It should be first noted that similar functionality is provided by the contract’s own `withdraw` function, insofar as all of the contract’s funds can be forwarded to the owner. There are two problems with this.


Unlike `withdraw`, `Destructible`’s `destroy` can be called *at any moment*, including when the contract is paused. It seems wrong that there is a deliberate restriction on when `withdraw` can be called, while the same purpose can be achieved via `destroy` at any time.


Withdrawing a contract’s balance, however, is not `destroy`’s *raison d’être*. It is removing the smart contract’s code from its address. A huge implication of this is that after a contract is destroyed, transactions sent to the address will no longer be interpreted as function calls, but as simple ETH transfers. **Ether sent to a destroyed contract is effectively lost forever.** We strongly recommend against making any contract whose purpose is to receive payments an instance of`Destructible`. Someone could send a payment after destruction without knowing their payment won’t be received and their money would be lost.


Consider not inheriting from `Destructible`, and using the contract’s `withdraw` function for withdrawal.


**UPDATE:** *Our recommendation was followed and the contract is no longer `Destructible`. In this way the contract is no longer vulnerable to the potential loss of Ether described above.*
