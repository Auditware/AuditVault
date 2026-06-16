---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/nft
protocol: "[[Phi]]"
auditors:
  - "[[unnamed]]"
report: "https://code4rena.com/reports/2024-08-phi"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# [H-05] Exposed `_removeCredIdPerAddress` & `_addCredIdPerAddress` allows anyone to cause issues to current holders as well as upcoming ones

- id: 41091
- impact: HIGH
- protocol: [[Phi]]
- reporter: unnamed (Code4rena)
- source: https://code4rena.com/reports/2024-08-phi

## Summary


The bug report highlights a vulnerability in the `_addCredIdPerAddress` and `_removeCredIdPerAddress` functions. The functions allow anyone to interrupt users who are attempting to hold or sell cred shares. This can be exploited in several ways, such as creating non-existent credIds, forcing block gas limits, and causing transactions to fail. The recommended mitigation is to make these functions internal rather than public. The assessed type of this bug is a DoS (Denial of Service) attack.

## Details


The `_addCredIdPerAddress` and `_removeCredIdPerAddress` allows anyone to interrupt users who are attempting to hold cred shares & sell already held cred shares.

### Proof of Concept

Anyone can force several scenarios some of such as making the following:

- `_credIdsPerAddress` huge with non-existent `credIds` that then lead to issues.
- Forcing a block gas limit for chains whose gas fees are cheap such as Base, Avax C-Chain, etc.
- Repeatedly forcing new cred share holders' transactions to fail with a combination of removing the `credIds` then adding them right after.
- They can re-order the `credId` indexes forcing the function to revert when trying to remove cred ID's per addresses:

```solidity
// Get the index of the credId to remove
        uint256 indexToRemove = _credIdsPerAddressCredIdIndex[sender_][credId_];
        // Check if the index is valid
        if (indexToRemove >= _credIdsPerAddress[sender_].length) revert IndexOutofBounds();

        // Verify that the credId at the index matches the one we want to remove
        uint256 credIdToRemove = _credIdsPerAddress[sender_][indexToRemove];
        if (credId_ != credIdToRemove) revert WrongCredId();
```

```solidity
function _addCredIdPerAddress(uint256 credId_, address sender_) public {
        // Add the new credId to the array
        _credIdsPerAddress[sender_].push(credId_);
        // Store the index of the new credId
        _credIdsPerAddressCredIdIndex[sender_][credId_] = _credIdsPerAddressArrLength[sender_];
        // Increment the array length counter
        _credIdsPerAddressArrLength[sender_]++;
    }

    // Function to remove a credId from the address's list
    function _removeCredIdPerAddress(uint256 credId_, address sender_) public {
        // Check if the array is empty
        if (_credIdsPerAddress[sender_].length == 0) revert EmptyArray();

        // Get the index of the credId to remove
        uint256 indexToRemove = _credIdsPerAddressCredIdIndex[sender_][credId_];
        // Check if the index is valid
        if (indexToRemove >= _credIdsPerAddress[sender_].length) revert IndexOutofBounds();

        // Verify that the credId at the index matches the one we want to remove
        uint256 credIdToRemove = _credIdsPerAddress[sender_][indexToRemove];
        if (credId_ != credIdToRemove) revert WrongCredId();

        // Get the last element in the array
        uint256 lastIndex = _credIdsPerAddress[sender_].length - 1;
        uint256 lastCredId = _credIdsPerAddress[sender_][lastIndex];
        // Move the last element to the position of the element we're removing
        _credIdsPerAddress[sender_][indexToRemove] = lastCredId;

        // Update the index of the moved element, if it's not the one we're removing
        if (indexToRemove < lastIndex) {
            _credIdsPerAddressCredIdIndex[sender_][lastCredId] = indexToRemove;
        }

        // Remove the last element (which is now a duplicate)
        _credIdsPerAddress[sender_].pop();

        // Remove the index mapping for the removed credId
        delete _credIdsPerAddressCredIdIndex[sender_][credIdToRemove];

        // Decrement the array length counter, if it's greater than 0
        if (_credIdsPerAddressArrLength[sender_] > 0) {
            _credIdsPerAddressArrLength[sender_]--;
        }
    }
```

### Recommended Mitigation Steps

Make both functions internal rather than public.

### Assessed type

DoS

**[ZaK3939 (Phi) confirmed](https://github.com/code-423n4/2024-08-phi-findings/issues/51#event-14165377246)**


**[0xDjango (judge) increased severity to High](https://github.com/code-423n4/2024-08-phi-findings/issues/51#issuecomment-2338867473)**

***
