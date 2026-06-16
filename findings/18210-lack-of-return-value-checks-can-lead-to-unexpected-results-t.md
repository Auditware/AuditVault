---
tags:
  - lang/solidity
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/token
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - precondition/specific-token-type
protocol: "[[Origin]]"
auditors:
  - "[[Dominik Teiml]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[specific-token-type]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
  - "[[liquidation-underwater]]"
  - "[[proposal-state-check]]"
  - "[[timelock-timestamp-bypass]]"
---
# Lack of return value checks can lead to unexpected results

- id: 18210
- impact: HIGH
- protocol: [[Origin Dollar]]
- reporter: Dominik Teiml (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf

## Summary


This bug report is about a Denial of Service vulnerability in several contracts. The difficulty level is medium. The vulnerability is caused by the lack of return value checks in several functions. These functions are CompoundStrategy.liquidate(), InitializableAbstractStrategy.transferToken(), VaultAdmin.transferToken(), VaultAdmin._harvest(), Governor._queueOrRevert(), Governor.execute(), Governor.__queueSetTimelockPendingAdmin(), Governor.__executeSetTimelockPendingAdmin(), VaultCore._redeem(), VaultCore._allocate(), and VaultCore.rebase(). The exploit scenario is that if the VaultCore._redeem() function calls CompoundStrategy.withdraw() and there are no tokens to redeem, the return value will be zero, but this will not be checked and the code will continue to burn the OUSD of the user. 

The recommendation is to check the return value of the mentioned functions in the short term and to subscribe to crytic.io to catch missing return checks in the long term, as Crytic can automatically identify this bug type.

## Details

## Type: Denial of Service
## Target: Several Contracts

### Difficulty: Medium

### Description
Several function calls do not check the return value. Without a return value check, the code is error-prone, which may lead to unexpected results. The functions missing the return value check include:

- **CompoundStrategy.liquidate()** (strategies/CompoundStrategy.sol#73-87) ignores return value by `cToken.redeem(cToken.balanceOf(address(this)))` (strategies/CompoundStrategy.sol#78)
- **InitializableAbstractStrategy.transferToken(address,uint256)** (utils/InitializableAbstractStrategy.sol#190-195) ignores return value by `IERC20(_asset).transfer(governor(),_amount)` (utils/InitializableAbstractStrategy.sol#194)
- **VaultAdmin.transferToken(address,uint256)** (vault/VaultAdmin.sol#235-240) ignores return value by `IERC20(_asset).transfer(governor(),_amount)` (vault/VaultAdmin.sol#239)
- **VaultAdmin._harvest(address)** (vault/VaultAdmin.sol#266-298) ignores return value by `IUniswapV2Router(uniswapAddr).swapExactTokensForTokens(rewardTokenAmount,uint256(0),path,address(this),now.add(1800))` (vault/VaultAdmin.sol#288-294)
- **Governor._queueOrRevert(address,uint256,string,bytes,uint256)** (governance/Governor.sol#157-171) ignores return value by `timelock.queueTransaction(target,value,signature,data,eta)` (governance/Governor.sol#170)
- **Governor.execute(uint256)** (governance/Governor.sol#173-190) ignores return value by `timelock.executeTransaction.value(proposal.values[i])(proposal.targets[i],proposal.values[i],proposal.signatures[i],proposal.calldatas[i],proposal.eta)` (governance/Governor.sol#181-187)
- **Governor.__queueSetTimelockPendingAdmin(address,uint256)** (governance/Governor.sol#214-229) ignores return value by `timelock.queueTransaction(address(timelock),0,setPendingAdmin(address),abi.encode(newPendingAdmin),eta)` (governance/Governor.sol#222-228)
- **Governor.__executeSetTimelockPendingAdmin(address,uint256)** (governance/Governor.sol#231-246) ignores return value by `timelock.executeTransaction(address(timelock),0,setPendingAdmin(address),abi.encode(newPendingAdmin),eta)` (governance/Governor.sol#239-245)
- **VaultCore._redeem(uint256)** (vault/VaultCore.sol#140-182) ignores return value by `strategy.withdraw(msg.sender,allAssets[i],outputs[i])` (vault/VaultCore.sol#163)
- **VaultCore._allocate()** (vault/VaultCore.sol#207-290) ignores return value by `strategy.deposit(address(asset),allocateAmount)` (vault/VaultCore.sol#261)
- **VaultCore.rebase(bool)** (vault/VaultCore.sol#304-315) ignores return value by `oUSD.changeSupply(newTotalSupply)` (vault/VaultCore.sol#310)

### Exploit Scenario
The `VaultCore._redeem` function calls `CompoundStrategy.withdraw`. For some reason, there are no tokens to redeem and zero is returned. Inside `VaultCore._redeem` the return value is not checked and the code will continue to burn the OUSD of the user.

### Recommendation
Short term, check the return value of all calls mentioned above. Long term, subscribe to [crytic.io](https://crytic.io) to catch missing return checks. Crytic identifies this bug type automatically.
