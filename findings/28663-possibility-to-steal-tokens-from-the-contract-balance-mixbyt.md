---
tags:
  - lang/solidity
  - sector/insurance
  - sector/token
  - platform/mixbytes
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Cover Protocol]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Cover%20Protocol/Cover%20Protocol%20Peripheral/README.md#2-possibility-to-steal-tokens-from-the-contract-balance"
genome:
  - "[[underflow]]"
  - "[[direct-drain]]"
  - "[[merkle-tree-overflow]]"
---
# Possibility to steal tokens from the contract balance

- id: 28663
- impact: HIGH
- protocol: [[Cover Protocol]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Cover%20Protocol/Cover%20Protocol%20Peripheral/README.md#2-possibility-to-steal-tokens-from-the-contract-balance

## Summary


The bug report describes a vulnerability in the `addCoverAndCreatePools` method of the CoverRouter contract, which is defined at https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/CoverRouter.sol#L128. This method accepts two addresses, `_protocol` and `_collateral`, as arguments and then calls `_addCover` to approve an unlimited amount of `_collateral` tokens for `_protocol`. The problem is that there are no checks of the validity of `_protocol` and `_collateral`, meaning that an attacker can pass malicious addresses and get unlimited approval of `_collateral` tokens.

Additionally, the contract logic should ensure that no tokens remain in the balance of the CoverRouter contract, but this invariant is not fully checked. For example, if `_protocol.addCover` fails and returns false, the transaction will still be executed successfully, leaving the user's funds on the CoverRouter balance.

To fix this vulnerability, the bug report recommends not using unlimited approve and adding specific checks to ensure that the zero balance invariant is maintained.

## Details

##### Description
Method `addCoverAndCreatePools` defined at https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/CoverRouter.sol#L128 accepts `_protocol` and `_collateral` addresses as arguments, then call `_addCover` that makes approve for `_protocol` an unlimited amount of `_collateral` tokens and call `_protocol.addCover`. There are no checks of `_protocol` and `_collateral` validity, so an attacker can pass malicious `_protocol` and get unlimited approval of `_collateral` tokens:
```solidity
if (_token.allowance(address(this), _spender) < _amount) {
  _token.approve(_spender, uint256(-1));
}
```

According to the contract logic in an optimistic flow a contract shouldn't have any tokens in balance, but this invariant not fully checked, e.g. if `_protocol.addCover` at https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/Rollover.sol#L75 fails and returns false, then the transaction will be executed successfully, but the user's funds will be left on the CoverRouter balance.

##### Recommendation
We recommend to not use unlimited approve and add particular checks to keep the zero balance invariant.
