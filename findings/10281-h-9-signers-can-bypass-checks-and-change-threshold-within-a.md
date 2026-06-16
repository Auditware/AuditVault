---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - vuln/access-control/missing-signer
  - novelty/variant
  - misassumption/admin-is-honest
  - sector/staking
protocol: "[[Hats Protocol]]"
auditors:
  - "[[obront]]"
  - "[[cducrest-brainbot]]"
report: https://github.com/sherlock-audit/2023-02-hats-judging
genome:
  - "[[missing-signer]]"
  - "[[variant]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
  - "[[account-signer]]"
---
# H-9: Signers can bypass checks and change threshold within a transaction

- id: 10281
- impact: HIGH
- protocol: Hats
- reporter: obront (Sherlock)
- source: N/A

## Summary


An issue was found in the `checkAfterExecution()` function, which is intended to uphold important invariants after each signer transaction is completed. This is meant to prevent signers from changing the threshold of the vault, but the parameters used by the check can be changed midflight so that this crucial restriction is violated. This means that signers can change the threshold of the vault, giving themselves increased control over future transactions and breaking an important trust assumption of the protocol. The issue was found by obront and cducrest-brainbot, and the code snippets can be found in the source link. The recommended solution is to save the safe's current threshold in `checkTransaction()` before the transaction has executed, and compare the value after the transaction to that value from storage. This is still possible if the safe is able to tamper with hat status or wearer eligibility and then reduce the threshold, but the assumption is that the safe itself does not have authority over the `signersHat(s)`.

## Details

Source: https://github.com/sherlock-audit/2023-02-hats-judging/issues/52 

## Found by 
obront, cducrest-brainbot

## Summary

The `checkAfterExecution()` function has checks to ensure that the safe's threshold isn't changed by a transaction executed by signers. However, the parameters used by the check can be changed midflight so that this crucial restriction is violated.

## Vulnerability Detail

The `checkAfterExecution()` is intended to uphold important invariants after each signer transaction is completed. This is intended to restrict certain dangerous signer behaviors. From the docs:

> /// @notice Post-flight check to prevent `safe` signers from removing this contract guard, changing any modules, or changing the threshold

However, the restriction that the signers cannot change the threshold can be violated.

To see how this is possible, let's check how this invariant is upheld. The following check is performed within the function:
```solidity
if (safe.getThreshold() != _getCorrectThreshold()) {
    revert SignersCannotChangeThreshold();
}
```
If we look up `_getCorrectThreshold()`, we see the following:
```solidity
function _getCorrectThreshold() internal view returns (uint256 _threshold) {
    uint256 count = _countValidSigners(safe.getOwners());
    uint256 min = minThreshold;
    uint256 max = targetThreshold;
    if (count < min) _threshold = min;
    else if (count > max) _threshold = max;
    else _threshold = count;
}
```
As we can see, this means that the safe's threshold after the transaction must equal the valid signers, bounded by the `minThreshold` and `maxThreshold`.

However, this check does not ensure that the value returned by `_getCorrectThreshold()` is the same before and after the transaction. As a result, as long as the number of owners is also changed in the transaction, the condition can be upheld.

To illustrate, let's look at an example:
- Before the transaction, there are 8 owners on the vault, all signers. targetThreshold == 10 and minThreshold == 2, so the safe's threshold is 8 and everything is good.
- The transaction calls `removeOwner()`, removing an owner from the safe and adjusting the threshold down to 7.
- After the transaction, there will be 7 owners on the vault, all signers, the safe's threshold will be 7, and the check will pass.

This simple example focuses on using `removeOwner()` once to decrease the threshold. However, it is also possible to use the safe's multicall functionality to call `removeOwner()` multiple times, changing the threshold more dramatically.

## Impact

Signers can change the threshold of the vault, giving themselves increased control over future transactions and breaking an important trust assumption of the protocol.

## Code Snippet

https://github.com/Hats-Protocol/hats-zodiac/blob/9455cc0957762f5dbbd8e62063d970199109b977/src/HatsSignerGateBase.sol#L517-L519

https://github.com/Hats-Protocol/hats-zodiac/blob/9455cc0957762f5dbbd8e62063d970199109b977/src/HatsSignerGateBase.sol#L533-L540

https://github.com/Hats-Protocol/safe-contracts/blob/c36bcab46578a442862d043e12a83fec41143dec/contracts/base/OwnerManager.sol#L70-L86

## Tool used

Manual Review

## Recommendation

Save the safe's current threshold in `checkTransaction()` before the transaction has executed, and compare the value after the transaction to that value from storage.

## Discussion

**spengrah**

In one sense, this is sort of ok since we're still always ensuring that the threshold is "correct" based on the number of valid signers on the safe, and changing the threshold doesn't allow . If a valid signer is removed by a safe tx, they can re-claim and then everything is back to the way it was.

But in another sense, it does make it fairly difficult to conceptualize the system, and it would also be ideal to successfully follow the documentation 😉. In all, I think this is more of a medium severity.

The suggested solution should work, but likely isn't needed if we're also storing/comparing the full owner array in order to address #118 and #70.

cc @zobront  

**spengrah**

Withdrawing the severity dispute since it would be quite painful if the signers continuously replaced existing signers to reach max signers, which could prevent replaced signers from reclaiming.

**spengrah**

https://github.com/Hats-Protocol/hats-zodiac/pull/5

**zobront**

@spengrah I believe this is still possible, if the safe is able to tamper with hat status or wearer eligibility and then reduce the threshold.

If this seems ok to you, then make sure to change the wording if your documentation and comments to not imply this isn't possible. If it's not ok with you, then I'd recommend implementing the recommended fix from this issue.

**spengrah**

@zobront ah ok, I see what you're saying. This is definitely something that should be documented more clearly: an assumption is that the safe itself (controlled by the signers) does not have authority over the `signersHat(s)`, ie is neither an admin, eligibility module, or toggle module. It wouldn't make sense for this to be the case and still expect the signers to not be able to control their own hat(s).

So, this is ok, and I'll push a documentation/comments update.
