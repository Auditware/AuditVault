---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - sector/lending
protocol: "[[Term Finance]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/term-finance/term1/review.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# No checks for non-zero output address when using ecrecover()

- id: 26297
- impact: HIGH
- protocol: [[Term Finance]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/term-finance/term1/review.pdf

## Summary


The bug report describes an issue with the authenticate() function in the Term Finance Contracts. The issue is that there are no checks to ensure that the ecrecover() function does not return zero, meaning that any invalid signature would be treated as valid when paired with a zero address. This could be used to authenticate transactions. The recommendation was to perform checks on the return value from ecrecover() and revert if the value is 0. After a retest of the commit e883f0e, the issue has been resolved - the function now reverts with an InvalidSignature error if ecrecover() returns 0.

## Details

## Description
There are no checks to ensure `ecrecover()` does not return zero. As such, any invalid signature would be treated as valid when paired with a zero address. The zero address (stored in `termAuth.user`) and an invalid signature can then be used to authenticate transactions.

## From Authenticator line [100]:
```solidity
82 /// Verifies a signature
/// @param termAuth The `TermAuth` struct containing user address, nonce, and signature
84 /// @return bool A boolean testing whether or not a signature is valid
function authenticate(TermAuth memory termAuth) public returns (bool) {
86     if (usedNonces[termAuth.nonce]) {
        revert NonceAlreadyUsed(termAuth.nonce);
88     }
    usedNonces[termAuth.nonce] = true;
90
    (uint8 v, bytes32 r, bytes32 s) = splitSignature(termAuth.signature);
92
    string memory header = "\x19Ethereum Signed Message:\n32";
94    bytes32 check = keccak256(
        abi.encodePacked(
96            header,
            keccak256(abi.encodePacked(termAuth.nonce, termAuth.user))
98        )
    );
100    return ecrecover(check, v, r, s) == termAuth.user; // SigP: should be checking ecrecover is non-zero
}
```

## Recommendations
Perform checks on the return value from `ecrecover()` and revert if the value is 0.

## Resolution
Based on a retest of commit `e883f0e`, the issue has been resolved - the function now reverts with `InvalidSignature` error if `ecrecover()` returns 0.
