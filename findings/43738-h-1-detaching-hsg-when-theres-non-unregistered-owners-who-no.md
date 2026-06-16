---
tags:
  - lang/solidity
  - sector/governance
  - sector/multisig
  - platform/sherlock
  - has/github
  - severity/high
  - impact/mev/frontrun
protocol: "[[Hats Protocol]]"
auditors:
  - "[[bughuntoor]]"
report: "https://github.com/sherlock-audit/2024-11-hats-protocol-judging"
genome:
  - "[[missing-owner-check]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
  - "[[quorum-supply-drift]]"
---
# H-1: Detaching HSG when there's non-unregistered owners who no longer own the hat would give them control over the multi-sig

- id: 43738
- impact: HIGH
- protocol: [[Hats Protocol]]
- reporter: bughuntoor (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with the Hats Protocol, specifically with the function `detachHSG()`. This function does not properly check if there are any owners of a Safe who no longer have the necessary hat, which can lead to those owners retaining control over the Safe even after detaching from the Hats Signer Gate (HSG). This can be exploited by an attacker who has admin rights over a signer hat with a set max supply of 1. By front-running the `detachHSG()` call, the attacker can transfer the hat and add it as a signer, giving multiple wallets owner rights within the Safe. This allows the attacker to gain full control over the Safe or prevent the DAO from executing any actions on their own. To mitigate this issue, the report suggests looping through all Safe owners upon detaching HSG and unregistering any owners who no longer have the necessary hat. The source code for the affected function can be found at the provided link. The report was found by user bughuntoor and has been acknowledged by the protocol team.

## Details

Source: https://github.com/sherlock-audit/2024-11-hats-protocol-judging/issues/4 

The protocol has acknowledged this issue.

## Found by 
bughuntoor
### Summary
After a user no longer owns a hat, although they are no longer treated as a valid signer, they remain an `owner` within the Safe, until `removeSigner` is called 

```solidity
  function detachHSG() public {
    _checkUnlocked();
    _checkOwner();
    ISafe s = safe; // save SLOAD

    // first remove as guard, then as module
    s.execRemoveHSGAsGuard();
    s.execDisableHSGAsOnlyModule();
    emit Detached();
  }
```

When HSG is detached, it does not check if there's any Safe owners who no longer wear the necessary hat. For this reason, if there's such owners, they'll remain rights within the multi-sig. Depending on their number, they might be able to overturn the multisig, or at least disallow them to reach quorum.

However, this attack can further be weaponized if one of the signer hats has admin rights over another signer hat. If the said admin hat wants to overturn the multisig and gain full access of it upon detaching, they can simply front-run the `detachHSG` call and do a loop of 1) transferring the lower hat to a new address 2) claiming it as a signer. Then, when  the `detachHSG` executes, all of these addresses that the attacker had looped through would be owners of the safe and in most cases that should be enough to fully overturn the multi-sig and claim full custody of it.


### Root Cause
`detachHSG` does not check if there are Safe owners who no longer wear the necessary hat.

### Attack Path
1. DAO plans to detach from HSG
2. There exists a user who has admin hat over a signer hat which has a set max supply of 1.
3. DAO calls detach from HSG
4. The admin hat owner front-runs the tx and does a loop of transferring the hat and adding it as a signer. This gives a lot of wallets `owner` rights within the Safe, which would otherwise be worthless if HSG remains active
5.  The DAO gets detached and all of the wallets the admin hat owner had looped through now are owners within the Safe
6.  This would usually give full custody to the attacker, or at the very least guarantee the DAO is not able to execute anything on their own.

### Impact
Attacker can gain full custody over a Safe upon HSG detachment 

### Affected Code
https://github.com/sherlock-audit/2024-11-hats-protocol/blob/main/hats-zodiac/src/HatsSignerGate.sol#L341

### Mitigation
Upon detaching HSG, loop through all Safe owners and in case a wallet does not wear the necessary hat, unregister them as a signer.
