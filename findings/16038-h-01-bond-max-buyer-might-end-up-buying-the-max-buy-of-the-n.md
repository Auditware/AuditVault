---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/dex
protocol: "[[Mute.Io]]"
auditors:
  - "[[0xA5DF]]"
report: "https://code4rena.com/reports/2023-03-mute"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[dos-resistance]]"
---
# [H-01] Bond max-buyer might end up buying the max buy of the next epoch

- id: 16038
- impact: HIGH
- protocol: [[Mute.Io]]
- reporter: 0xA5DF (Code4rena)
- source: https://code4rena.com/reports/2023-03-mute

## Summary


This bug report is about the `MuteBond.deposit()` function in the MuteBond smart contract. It describes a scenario where a user intends to purchase the remaining amount of current epoch, but till the transaction is included in the blockchain, a new epoch starts (either by an innocent user or by an attacker) and the user ends up buying the entire amount of the next epoch. The impact of this bug is that the user ends up buying a much higher amount than intended, and for a lower price than intended (i.e. less payout for the buyer).

The bug report also includes a proof of concept which shows how `maxPurchaseAmount()` increases when a new era starts. The code snippet provided shows that when a user sets `max_buy` to true the value used is the `maxPurchaseAmount()`.

The recommended mitigation steps for this bug are to require the user to specify the epoch number when doing a 'max buy', and revert if it doesn't match the current epoch. It might be a good idea to refactor the code to two external functions for normal buy and max buy, where they both share an internal function to make the actual deposit.

## Details


The `MuteBond.deposit()` function allows users to specify the amount of value they want to purchase bonds for or to set `max_buy` to true.
If `max_buy` is set to true the amount specified in the `value` parameter is ignored and instead the maximum amount available for purchase in the current epoch is used.
This can lead to a scenario where a user intends to purchase the remaining amount of current epoch, but till the tx is included in the blockchain a new epoch starts (either by an innocent user or by an attacker) and the user ends up buying the entire amount of the next epoch.

### Impact

A. The user ends up buying a much higher amount than intended<br>
B. The user ends up buying it for a lower price than intended (i.e. less payout for the buyer)

### Proof of Concept

The PoC below shows how `maxPurchaseAmount()` increases when a new era starts.

File: `test/bonds.ts`

```solidity
  it('Max buy PoC', async function () {

    // buy 99% of amount available for purchase in current epoch
    let maxValue = await bondContract.maxPurchaseAmount();
    let depositValue = maxValue.mul(99).div(100);
    await bondContract.connect(buyer1).deposit(depositValue, buyer1.address, false);
    
    // The amount available when the victim sends out the tx
    var expectedDeposit = await bondContract.maxPurchaseAmount()

    await bondContract.connect(buyer1).deposit('0', buyer1.address, true);

    // The amount available when the victims's tx is included in the blockchain
    var actualDeposit = await bondContract.maxPurchaseAmount();    

    // expected deposit = 1 wad
    // actual deposit = 100 wad
    console.log({expectedDeposit, actualDeposit});
  })
```

[The following snippet](https://github.com/code-423n4/2023-03-mute/blob/4d8b13add2907b17ac14627cfa04e0c3cc9a2bed/contracts/bonds/MuteBond.sol#L156-L159) shows that when a user sets `max_buy` to true the value used is the `maxPurchaseAmount()`

```solidity
        if(max_buy == true){
          value = maxPurchaseAmount();
          payout = maxDeposit();
        } else {
```

### Recommended Mitigation Steps

Require the user to specify the epoch number when doing a 'max buy', and revert if it doesn't match the current epoch (it might be a good idea to refactor the code to 2 external functions for normal buy and max buy, where they both share an internal function to make the actual deposit).

Side note: this is similar to another bug I've reported regarding getting a lower price than expected, however the root cause, impact, and mitigation are different and therefore I've reported this separately.

**[mattt21 (Mute Switch) confirmed](https://github.com/code-423n4/2023-03-mute-findings/issues/25#issuecomment-1499248207)**



***
