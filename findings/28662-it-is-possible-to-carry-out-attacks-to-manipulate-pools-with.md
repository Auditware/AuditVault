---
tags:
  - lang/solidity
  - sector/insurance
  - sector/lending
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/access-control/tx-origin
  - impact/loss-of-funds/direct-drain
  - trigger/flash-loan
  - precondition/flash-loan-available
  - novelty/known-pattern
protocol: "[[Cover Protocol]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Cover%20Protocol/Cover%20Protocol%20Peripheral/README.md#1-it-is-possible-to-carry-out-attacks-to-manipulate-pools-within-one-transaction-using-a-flash-loan"
genome:
  - "[[tx-origin]]"
  - "[[direct-drain]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[account-signer]]"
  - "[[flashloan-callback-auth]]"
---
# It is possible to carry out attacks to manipulate pools within one transaction using a flash loan

- id: 28662
- impact: HIGH
- protocol: [[Cover Protocol]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Cover%20Protocol/Cover%20Protocol%20Peripheral/README.md#1-it-is-possible-to-carry-out-attacks-to-manipulate-pools-within-one-transaction-using-a-flash-loan

## Summary


This bug report is about a vulnerability in contracts CoverRouter.sol and Rollover.sol. These contracts allow users to exchange tokens and add and remove liquidity. An attacker can exploit this vulnerability by taking a flash loan and performing multiple liquidity manipulations within a single transaction. This can lead to a loss of funds for other users. 

To protect against token manipulation with flash loans, it is recommended to add the following code to the contracts: 

```solidity
mapping(address => uint256) private _lastSwapBlock;

function some() external {
   _preventSameTxOrigin();
   ....
   some logic
   ...
 }

function _preventSameTxOrigin() private {
   require(block.number > _lastSwapBlock[tx.origin], "SAME_TX_ORIGIN");
   _lastSwapBlock[tx.origin] = block.number;
 }
```

This code will prevent an attacker from performing multiple liquidity manipulations within a single transaction. This will help protect other users from potential losses of funds.

## Details

##### Description
In contracts https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/CoverRouter.sol and https://github.com/CoverProtocol/cover-peripheral/tree/d5b37e34d47abec3252cdabd46e55e34a72421d4/contracts/Rollover.sol, any user can exchange tokens with a contract. Any user can add and remove liquidity. An attacker can take a flash loan and perform multiple liquidity manipulations within a single transaction. These manipulations can lead to a loss of funds for other users.

##### Recommendation
It is recommended to add protection against token manipulation with flash loans.
Here's some sample code:

```solidity
mapping(address => uint256) private _lastSwapBlock;

function some() external {
   _preventSameTxOrigin();
   ....
   some logic
   ...
 }

function _preventSameTxOrigin() private {
   require(block.number > _lastSwapBlock[tx.origin], "SAME_TX_ORIGIN");
   _lastSwapBlock[tx.origin] = block.number;
 }
```
