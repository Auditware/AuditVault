---
tags:
  - lang/solidity
  - sector/lending
  - platform/sherlock
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Teller]]"
auditors:
  - "[[Bauer]]"
report: "https://github.com/sherlock-audit/2023-03-teller-judging"
genome:
  - "[[missing-owner-check]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# H-5: Malicious user can abuse UpdateCommitment to create commitments for other users

- id: 18517
- impact: HIGH
- protocol: [[Teller]]
- reporter: Bauer (Sherlock)
- source: N/A

## Summary


This bug report is about a vulnerability in the UpdateCommitment function of the LenderCommitmentForwarder.sol contract. This vulnerability allows malicious users to create a commitment for another user and steal their funds. The issue was found by 0x52, 0xbepresent, Bauer, J4de, dingo, and immeas. 

The issue was that UpdateCommitment checks that the original lender is msg.sender but never validates that the original lender == new lender. This allows malicious users to effectively create a commitment for another user, allowing them to drain funds from them. The code snippet of the affected area can be found at LenderCommitmentForwarder.sol#L208-L233.

The impact of this vulnerability is that UpdateCommitment can be used to create a malicious commitment for another user and steal their funds. The tool used to find this vulnerability was manual review. The recommendation to fix this vulnerability was to check that the update lender is the same the original lender. The fix was implemented by ethereumdegen and was later verified by IAm0x52. The code fix can be found at https://github.com/teller-protocol/teller-protocol-v2/pull/67.

## Details

Source: https://github.com/sherlock-audit/2023-03-teller-judging/issues/260 

## Found by 
0x52, 0xbepresent, Bauer, J4de, dingo, immeas
## Summary

UpdateCommitment checks that the original lender is msg.sender but never validates that the original lender == new lender. This allows malicious users to effectively create a commitment for another user, allowing them to drain funds from them.

## Vulnerability Detail

[LenderCommitmentForwarder.sol#L208-L224](https://github.com/sherlock-audit/2023-03-teller/blob/main/teller-protocol-v2/packages/contracts/contracts/LenderCommitmentForwarder.sol#L208-L224)

    function updateCommitment(
        uint256 _commitmentId,
        Commitment calldata _commitment
    ) public commitmentLender(_commitmentId) { <- @audit-info checks that lender is msg.sender
        require(
            _commitment.principalTokenAddress ==
                commitments[_commitmentId].principalTokenAddress,
            "Principal token address cannot be updated."
        );
        require(
            _commitment.marketId == commitments[_commitmentId].marketId,
            "Market Id cannot be updated."
        );

        commitments[_commitmentId] = _commitment; <- @audit-issue never checks _commitment.lender

        validateCommitment(commitments[_commitmentId]);

UpdateCommitment is intended to allow users to update their commitment but due to lack of verification of _commitment.lender, a malicious user create a commitment then update it to a new lender. By using bad loan parameters they can steal funds from the attacker user.

## Impact

UpdateCommitment can be used to create a malicious commitment for another user and steal their funds

## Code Snippet

[LenderCommitmentForwarder.sol#L208-L233](https://github.com/sherlock-audit/2023-03-teller/blob/main/teller-protocol-v2/packages/contracts/contracts/LenderCommitmentForwarder.sol#L208-L233)

## Tool used

Manual Review

## Recommendation

Check that the update lender is the same the original lender



## Discussion

**ethereumdegen**

Thank you for this feedback.  This is a high severity issue as it could be used to unexpectedly steal tokens that another use had previously approved to the contract.  Will fix. 

**passabilities**

https://github.com/teller-protocol/teller-protocol-v2/pull/67

**IAm0x52**

Fix looks good. _commitment.lender (updated lender) is now required to be msg.sender
