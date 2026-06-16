---
tags:
  - lang/solidity
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
  - "[[precision-loss]]"
  - "[[specific-token-type]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# OUSD allows users to transfer more tokens than expected

- id: 18213
- impact: HIGH
- protocol: [[Origin Dollar]]
- reporter: Dominik Teiml (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf

## Summary


This bug report is about a data validation issue in the OUSD contract. Under certain circumstances, the OUSD contract allows users to transfer more tokens than they have in their balance. A user or external contract trying to transfer one token more than its balance will expect the transfer to fail, but after executing a sequence of transactions, the user will be allowed to transfer one token more than its balance. This issue seems to be caused by a rounding issue when the creditsDeducted is calculated and subtracted. 

The recommended short-term solution is to make sure the balance is correctly checked before performing all the arithmetic operations, which will make sure the transfer does not exceed the expected amount. The long-term solution is to use Echidna to write properties that ensure ERC20 transfers are transferring the expected amount.

## Details

## Data Validation

**Type:** Data Validation  
**Target:** OUSD.sol

**Difficulty:** Medium

## Description

Under certain circumstances, the OUSD contract allows users to transfer more tokens than the ones they have in their balance. A user or external contract trying to transfer one token more than its balance will expect that transfer to revert or the transfer to return false. However, after executing the following sequence of transactions, `user1` will be allowed to transfer one token more than its current balance.

```plaintext
initialize("", "", vault)
mint(user1, 333333333333333333333333333333333333333333333333333333)
mint(user2, 333333333333333333333333333333333333333333333333333333)
mint(user3, 333333333333333333333333333333333333333333333333333333)
changeSupply(15)
mint(user1, 16)
```

*Figure 22.1: Sequence of transactions to break a system invariant*

This issue seems to be caused by a rounding issue when the `creditsDeducted` is calculated and subtracted:

```solidity
function _executeTransfer (
    address _from,
    address _to,
    uint256 _value
) internal {
    bool isNonRebasingTo = _isNonRebasingAccount(_to);
    bool isNonRebasingFrom = _isNonRebasingAccount(_from);
    // Credits deducted and credited might be different due to the
    // differing creditsPerToken used by each account
    uint256 creditsCredited = _value.mulTruncate(_creditsPerToken(_to));
    uint256 creditsDeducted = _value.mulTruncate(_creditsPerToken(_from));
    _creditBalances[_from] = _creditBalances[_from].sub(
        creditsDeducted,
        "Transfer amount exceeds balance"
    );
    _creditBalances[_to] = _creditBalances[_to].add(creditsCredited);
}
```
*Figure 22.2: OUSD.sol#L154-L171*

## Exploit Scenario

Eve interacts with the OUSD token, trying to transfer more tokens than she has. Instead of failing, the transaction succeeds, allowing it to credit more tokens than expected to another account.

## Recommendation

**Short term:** Make sure the balance is correctly checked before performing all the arithmetic operations. This will ensure it does not allow transferring more than expected.  

**Long term:** Use Echidna to write properties that ensure ERC20 transfers are transferring the expected amount.
