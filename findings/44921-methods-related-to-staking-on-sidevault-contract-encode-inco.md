---
tags:
  - blockchain/evm
  - blockchain/evm/base
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/staking
  - sector/vault
protocol: "[[Tradable]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-09-01-Tradable.md"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[reward-accounting]]"
---
# Methods related to Staking on SideVault Contract encode incorrect staking/withdrawal methods for Base chain

- id: 44921
- impact: HIGH
- protocol: [[Tradable]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-09-01-Tradable.md

## Summary


The bug report describes an issue where two methods in the Contract TradableSideVault are encoding the wrong destination base chain contract address and method, causing them to fail. This results in users not being able to stake or withdraw their funds. The report recommends updating the encoding to use the correct destination address or method on the staking vault contract.

## Details

**Severity**: High

**Status**: Resolved

**Description**

In Contract TradableSideVault, method stakingAccountDepositForUser(...) and method stakingAccountDeposit encodes the keyword, destination base chain contract address, and the destination method along with the parameters. The destination base chain contract is the staking vault address. 

```solidity
// message being sent
bytes memory payload = abi.encode(
"md",
dstBaseStakingVault,
abi.encodeWithSignature(
"marginAccountDeposit(address,(address,uint8,bool),uint256)",
msg.sender,
getAcceptedTokenInfo(token),
amount
)
);
```
Whereas it is encoding method `marginAccountDeposit` which is not implemented in the Staking Vault contract. This will fail to stake for the user.  

Similarly, method withdrawalRequest and method withdrawalRequestForUser encodes the data in the above-mentioned logic but here the destination base chain contract could be the staking vault address (dstBaseStakingVault) based on withdrawal type.

```solidity
// creates messages using user data and send to base chain
address destinationVault = withdrawalType == WithdrawalType.Stake
? dstBaseStakingVault
: dstBaseMarginVault;
bytes memory payload = abi.encode(
"mw",
destinationVault,
abi.encodeWithSignature(
"marginAccountWithdrawal(address,(address,uint8,bool),uint256,address)", 
msg.sender,
getAcceptedTokenInfo(token),
amount,
address(this)
)
);
```
Whereas the method encoded is marginAccountWithdrawal which is again not implemented in the staking vault contract. This will fail withdrawal for users.


**Recommendation**: 

Update the encoding to use either the correct destination base chain address or the correct method on the staking vault contract.
