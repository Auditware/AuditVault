---
tags:
  - lang/solidity
  - sector/multisig
  - platform/sherlock
  - has/github
  - severity/high
  - vuln/access-control/missing-signer
  - novelty/variant
  - misassumption/admin-is-honest
  - fix/add-access-control
protocol: "[[Hats Protocol]]"
auditors:
  - "[[roguereddwarf]]"
  - "[[cducrest-brainbot]]"
  - "[[GimelSec]]"
report: https://github.com/sherlock-audit/2023-02-hats-judging
genome:
  - "[[missing-signer]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[access-roles]]"
  - "[[account-signer]]"
  - "[[dos-resistance]]"
---
# H-8: HatsSignerGate + MultiHatsSignerGate: more than maxSignatures can be claimed which leads to DOS in reconcileSignerCount

- id: 10280
- impact: HIGH
- protocol: Hats
- reporter: cducrest-brainbot (Sherlock)
- source: N/A

## Summary


This bug report concerns two functions, `HatsSignerGate.claimSigner` and `MultiHatsSignerGate.claimSigner` which allow users to become signers. These functions must not allow more valid signers than the `maxSigners` value, as this leads to a denial-of-service (DOS) attack in `HatsSignerGateBase.reconcileSignerCount`.

Think of this scenario: the `maxSignatures` value is set to 10 and there are 10 valid signers. Then, a transaction is executed that adds an 11th owner, but still leaves 10 valid signers. One of the 10 signers is no longer a wearer of the hat, so `reconcileSignerCount` is called. This leaves 9 valid signers and 11 owners. Then, the signer who was no longer a wearer of the hat wears it again, but `reconcileSignerCount` is not called. This means there are 11 owners and 10 valid signers. 

When a new signer calls `claimSigner`, all checks will pass and he will be swapped for the owner that is not a valid signer. This means there are now 11 owners and 11 valid signers. When `reconcileSignerCount` is called, the code causes a revert, as 11 is greater than 10. This means one of the valid signers has to give up their signer hat in order for the HSG to become operable again, which is wrong.

The code snippets and the impact of this bug are included in the report. The bug was found by roguereddwarf, cducrest-brainbot, and GimelSec, and was investigated using manual review. The recommendation is to call `reconcileSignerCount` in the `claimSigner` functions so that the scenario described in the report cannot occur. The bug may be a duplicate of other issues (#46, #118 and #170).

## Details

Source: https://github.com/sherlock-audit/2023-02-hats-judging/issues/51 

## Found by 
roguereddwarf, cducrest-brainbot, GimelSec

## Summary
The `HatsSignerGate.claimSigner` and `MultiHatsSignerGate.claimSigner` functions allow users to become signers.

It is important that both functions do not allow that there exist more valid signers than `maxSigners`.

This is because if there are more valid signers than `maxSigners`, any call to `HatsSignerGateBase.reconcileSignerCount` reverts, which means that no transactions can be executed.

The only possibility to resolve this is for a valid signer to give up his signer hat. No signer will voluntarily give up his signer hat. And it is wrong that a signer must give it up. Valid signers that have claimed before `maxSigners` was reached should not be affected by someone trying to become a signer and exceeding `maxSigners`. In other words the situation where one of the signers needs to give up his signer hat should have never occurred in the first place.

## Vulnerability Detail
Think of the following scenario:

1. `maxSignatures=10` and there are 10 valid signers
2. The signers execute a transaction that calls `Safe.addOwnerWithThreshold` such that there are now 11 owners (still there are 10 valid signers)
3. One of the 10 signers is no longer a wearer of the hat and `reconcileSignerCount` is called. So there are now 9 valid signers and 11 owners
4. The signer that was no longer a wearer of the hat in the previous step now wears the hat again. However `reconcileSignerCount` is not called. So there are 11 owners and 10 valid signers. The HSG however still thinks there are 9 valid signers.

When a new signer now calls `claimSigner`, all checks will pass and he will be swapped for the owner that is not a valid signer:
```solidity
        // 9 >= 10 is false
        if (currentSignerCount >= maxSigs) {
            revert MaxSignersReached();
        }

        // msg.sender is a new signer so he is not yet owner
        if (safe.isOwner(msg.sender)) {
            revert SignerAlreadyClaimed(msg.sender);
        }

        // msg.sender is a valid signer, he wears the signer hat
        if (!isValidSigner(msg.sender)) {
            revert NotSignerHatWearer(msg.sender);
        }
```

So there are now 11 owners and 11 valid signers.
This means when `reconcileSignerCount` is called, the following lines cause a revert:
```solidity
    function reconcileSignerCount() public {
        address[] memory owners = safe.getOwners();
        uint256 validSignerCount = _countValidSigners(owners);

        // 11 > 10
        if (validSignerCount > maxSigners) {
            revert MaxSignersReached();
        }
```

## Impact
As mentioned before, we end up in a situation where one of the valid signers has to give up his signer hat in order for the HSG to become operable again.

So one of the valid signers that has rightfully claimed his spot as a signer may lose his privilege to sign transactions.

## Code Snippet
https://github.com/Hats-Protocol/hats-zodiac/blob/9455cc0957762f5dbbd8e62063d970199109b977/src/HatsSignerGate.sol#L36-L69
```solidity
    function claimSigner() public virtual {
        uint256 maxSigs = maxSigners; // save SLOADs
        uint256 currentSignerCount = signerCount;


        if (currentSignerCount >= maxSigs) {
            revert MaxSignersReached();
        }


        if (safe.isOwner(msg.sender)) {
            revert SignerAlreadyClaimed(msg.sender);
        }


        if (!isValidSigner(msg.sender)) {
            revert NotSignerHatWearer(msg.sender);
        }


        /* 
        We check the safe owner count in case there are existing owners who are no longer valid signers. 
        If we're already at maxSigners, we'll replace one of the invalid owners by swapping the signer.
        Otherwise, we'll simply add the new signer.
        */
        address[] memory owners = safe.getOwners();
        uint256 ownerCount = owners.length;


        if (ownerCount >= maxSigs) {
            bool swapped = _swapSigner(owners, ownerCount, maxSigs, currentSignerCount, msg.sender);
            if (!swapped) {
                // if there are no invalid owners, we can't add a new signer, so we revert
                revert NoInvalidSignersToReplace();
            }
        } else {
            _grantSigner(owners, currentSignerCount, msg.sender);
        }
    }
```

https://github.com/Hats-Protocol/hats-zodiac/blob/9455cc0957762f5dbbd8e62063d970199109b977/src/MultiHatsSignerGate.sol#L41-L81
```solidity
    function claimSigner(uint256 _hatId) public {
        uint256 maxSigs = maxSigners; // save SLOADs
        uint256 currentSignerCount = signerCount;


        if (currentSignerCount >= maxSigs) {
            revert MaxSignersReached();
        }


        if (safe.isOwner(msg.sender)) {
            revert SignerAlreadyClaimed(msg.sender);
        }


        if (!isValidSignerHat(_hatId)) {
            revert InvalidSignerHat(_hatId);
        }


        if (!HATS.isWearerOfHat(msg.sender, _hatId)) {
            revert NotSignerHatWearer(msg.sender);
        }


        /* 
        We check the safe owner count in case there are existing owners who are no longer valid signers. 
        If we're already at maxSigners, we'll replace one of the invalid owners by swapping the signer.
        Otherwise, we'll simply add the new signer.
        */
        address[] memory owners = safe.getOwners();
        uint256 ownerCount = owners.length;


        if (ownerCount >= maxSigs) {
            bool swapped = _swapSigner(owners, ownerCount, maxSigs, currentSignerCount, msg.sender);
            if (!swapped) {
                // if there are no invalid owners, we can't add a new signer, so we revert
                revert NoInvalidSignersToReplace();
            }
        } else {
            _grantSigner(owners, currentSignerCount, msg.sender);
        }


        // register the hat used to claim. This will be the hat checked in `checkTransaction()` for this signer
        claimedSignerHats[msg.sender] = _hatId;
    }
```

https://github.com/Hats-Protocol/hats-zodiac/blob/9455cc0957762f5dbbd8e62063d970199109b977/src/HatsSignerGateBase.sol#L183-L217
```solidity
    function reconcileSignerCount() public {
        address[] memory owners = safe.getOwners();
        uint256 validSignerCount = _countValidSigners(owners);


        if (validSignerCount > maxSigners) {
            revert MaxSignersReached();
        }


        // update the signer count accordingly
        signerCount = validSignerCount;


        uint256 currentThreshold = safe.getThreshold();
        uint256 newThreshold;
        uint256 target = targetThreshold; // save SLOADs


        if (validSignerCount <= target && validSignerCount != currentThreshold) {
            newThreshold = validSignerCount;
        } else if (validSignerCount > target && currentThreshold < target) {
            newThreshold = target;
        }
        if (newThreshold > 0) {
            bytes memory data = abi.encodeWithSignature("changeThreshold(uint256)", validSignerCount);


            bool success = safe.execTransactionFromModule(
                address(safe), // to
                0, // value
                data, // data
                Enum.Operation.Call // operation
            );


            if (!success) {
                revert FailedExecChangeThreshold();
            }
        }
    }
```

## Tool used
Manual Review

## Recommendation
The `HatsSignerGate.claimSigner` and `MultiHatsSignerGate.claimSigner` functions should call `reconcileSignerCount` such that they work with the correct amount of signers and the scenario described in this report cannot occur.

```diff
diff --git a/src/HatsSignerGate.sol b/src/HatsSignerGate.sol
index 7a02faa..949d390 100644
--- a/src/HatsSignerGate.sol
+++ b/src/HatsSignerGate.sol
@@ -34,6 +34,8 @@ contract HatsSignerGate is HatsSignerGateBase {
     /// @notice Function to become an owner on the safe if you are wearing the signers hat
     /// @dev Reverts if `maxSigners` has been reached, the caller is either invalid or has already claimed. Swaps caller with existing invalid owner if relevant.
     function claimSigner() public virtual {
+        reconcileSignerCount();
+
         uint256 maxSigs = maxSigners; // save SLOADs
         uint256 currentSignerCount = signerCount;
```

```diff
diff --git a/src/MultiHatsSignerGate.sol b/src/MultiHatsSignerGate.sol
index da74536..57041f6 100644
--- a/src/MultiHatsSignerGate.sol
+++ b/src/MultiHatsSignerGate.sol
@@ -39,6 +39,8 @@ contract MultiHatsSignerGate is HatsSignerGateBase {
     /// @dev Reverts if `maxSigners` has been reached, the caller is either invalid or has already claimed. Swaps caller with existing invalid owner if relevant.
     /// @param _hatId The hat id to claim signer rights for
     function claimSigner(uint256 _hatId) public {
+        reconcileSignerCount();
+        
         uint256 maxSigs = maxSigners; // save SLOADs
         uint256 currentSignerCount = signerCount;
```


## Discussion

**spengrah**

I don't believe this is a duplicate of #46, which deals with number of owners being increased by another module, while the present issue deals with owners being increased by the safe's signers. That means, however, that it be a duplicate of #118 and #170.
