---
tags:
  - lang/solidity
  - sector/lending
  - sector/vault
  - platform/ottersec
  - has/poc
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Abacus]]"
auditors:
  - "[[Robert Chen]]"
report: "https://abacus.wtf/"
genome:
  - "[[frozen-funds]]"
  - "[[use-reentrancy-guard]]"
  - "[[direct-drain]]"
  - "[[dos-resistance]]"
  - "[[reentrancy-guard]]"
---
# DoS by draining CreditsBonds using clearUnusedBond . . . .

- id: 48699
- impact: HIGH
- protocol: [[Abacus]]
- reporter: Robert Chen (OtterSec)
- source: https://abacus.wtf/

## Summary

The CreditBonds contract is used for purchasing bonds, which are then used for payment while purchasing tickets in the Vault contract. However, there is a bug in the code where the clearUnusedBond function clears both used and unused bonds, allowing an attacker to drain the contract and cause denials of service for future payments. To reproduce the issue, follow the steps outlined in the Proof of Concept section. The fix for this bug is to decrement the used amount from totalCreditPerEpoch in the sendToVault function, and this has been implemented in the code.

## Details

## CreditBonds Contract Overview

The `CreditBonds` contract is used to purchase bonds (equivalent to ether), which are then used for payment while purchasing tickets in the `Vault` contract. By using these bonds, the user gets a personal boost, which is implemented in the `Allocator` contract. 

Bonds are purchased for specific epochs. A user can use their purchased bonds during that epoch only.

## Code Snippet: Bond Function

```solidity
function bond() external payable nonReentrant {
    ...
    userCredit[currentEpoch][msg.sender] += msg.value;
    finalUserCredit[currentEpoch][msg.sender] += msg.value;
    totalCreditPerEpoch[currentEpoch] += msg.value;
    emit EthBonded(msg.sender, currentEpoch, msg.value);
}
```

After the epoch, remaining unused bonds will be sent to the `Allocator` contract as donations.

## Code Snippet: Clear Unused Bond Function

```solidity
function clearUnusedBond(uint256 _epoch) external nonReentrant {
    ...
    require(!epochCleared[_epoch]);
    epochCleared[_epoch] = true;
    uint256 payout = totalCreditPerEpoch[_epoch];
    delete totalCreditPerEpoch[_epoch];
    ...
}
```

The `clearUnusedBond` function uses `totalCreditPerEpoch[_epoch]`, which was not decremented in the `sendToVault` function. In turn, the `sendToVault` function is used to pay for tickets with credit bonds. 

As a result, the `clearUnusedBond` function clears both used and unused bonds. An attacker can abuse this unintended behavior to drain the `CreditBonds` contract, causing denials of service for future payments using credit bonds.

---

© 2022 OtterSec LLC. All Rights Reserved. 

## Proof of Concept

To reproduce the issue, follow the steps below:

**Note:** Balance represents the ether balance of the `CreditBonds` contract.

1. User A purchases a credit bond with 200 ether in epoch-1. (Balance = 200 ETH)
2. User A uses their bond in epoch-2. (Balance = 0 ETH)
3. User B purchases a credit bond with 300 ether in epoch-2. (Balance = 300 ETH)
4. Attacker calls `clearUnusedBond(epoch : 2)` in epoch-3, which clears 200 ETH. (Balance = 100 ETH)
5. User B’s ticket purchase in the Vault will now cause a runtime error, as 300 ETH is not present in the `CreditBonds` contract.

## Remediation

Decrement the used amount from `totalCreditPerEpoch[epoch]` in the `sendToVault` function.

## Code Snippet: Send to Vault Function

```solidity
function sendToVault(
    ...
) external returns(uint256) {
    ...
    if(_caller != _user) {
        ...
        userCredit[currentEpoch - 1][_user] -= payload;
        totalCreditPerEpoch[currentEpoch - 1] -= payload;
        payable(_vault).transfer(payload);
        emit BondsUsed(_user, _vault, payload);
        return payload;
    }
    ...
    userCredit[currentEpoch - 1][_user] -= payload;
    totalCreditPerEpoch[currentEpoch - 1] -= payload;
    payable(_vault).transfer(payload);
    emit BondsUsed(_user, _vault, payload);
    return payload;
}
```

## Patch

The used amount was decremented from `totalCreditPerEpoch[epoch]`. Fixed in commits `8c971a8`, `5ed34c1`.

---

© 2022 OtterSec LLC. All Rights Reserved.
