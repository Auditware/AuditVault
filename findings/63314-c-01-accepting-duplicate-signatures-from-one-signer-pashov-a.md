---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - sector/staking
protocol: "[[SXT]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/SXT-security-review_2025-03-31.md"
genome:
  - "[[broken-logic]]"
  - "[[role-bypass]]"
  - "[[bridge-validator-threshold]]"
  - "[[permit-fork-replay]]"
---
# [C-01] Accepting duplicate signatures from one signer

- id: 63314
- impact: HIGH
- protocol: SXT_2025-03-31
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[SXT]]-security-review_2025-03-31.md

## Summary


The `validateMessage` function in the `SubstrateSignatureValidator` has a bug that allows for duplicate signatures from the same attestor to be counted towards the threshold. This means that a valid signature can be submitted multiple times, inflating the count of valid signatures. To fix this, a memory array should be implemented inside the loop to check if the signer has already been counted.

## Details


## Severity

**Impact:** High

**Likelihood:** High

## Description

The `validateMessage` function in `SubstrateSignatureValidator` is designed to verify that a message has been signed by a threshold of attestors. However, the function does not account for duplicate signatures from the same attestor. It simply counts how many times a signature maps to a known attestor, regardless of whether the signer has already been counted. Since the function lacks deduplication logic, it is possible to replay the same valid signature multiple times to artificially inflate the count of valid signatures.

```solidity
        for (uint256 i = 0; i < signaturesLength; ++i) {
            address recoveredAddress = ecrecover(message, v[i], r[i], s[i]);

            while (attestorIndex < attestorsLength && _attestors[attestorIndex] < recoveredAddress) {
                ++attestorIndex;
            }

            if (attestorIndex < attestorsLength && _attestors[attestorIndex] == recoveredAddress) {
                ++validSignaturesCount;
            }

            if (validSignaturesCount == _threshold) return true;
        }
```

The result is that if a signature from a valid attestor is submitted multiple times (i.e., same v, r, and s), it will be counted multiple times toward meeting the threshold but in reality the rest of attestors would not have signed it.

For a quick PoC, modify the following functions of `SubstrateSignatureValidatorTest` and run `forge test --mt testValidateMessage`. As we can see, the threshold is `2` but only the first attestor has signed and his signature is repeated two times in order to meet the threshold. 
```solidity
    function setUp() public {
        message = keccak256("test");

        attestors = new address[](2);
        attestors[0] = ecrecover(message, 27, bytes32(uint256(0x1)), bytes32(uint256(0x3)));
        attestors[1] = ecrecover(message, 27, bytes32(uint256(0x2)), bytes32(uint256(0x4)));

        validator = new SubstrateSignatureValidator(attestors, 2);
    }

    function testValidateMessage() public view {
        bytes32[] memory r = new bytes32[](2);
        r[0] = bytes32(uint256(0x1));
        r[1] = bytes32(uint256(0x1));

        bytes32[] memory s = new bytes32[](2);
        s[0] = bytes32(uint256(0x3));
        s[1] = bytes32(uint256(0x3));

        uint8[] memory v = new uint8[](2);
        v[0] = 27;
        v[1] = 27;

        assertEq(validator.validateMessage(message, r, s, v), true);
    }
```

## Recommendations

Consider implementing a memory array inside the loop in `validateMessage` and check if the recovered signer has already been checked against the signature.
