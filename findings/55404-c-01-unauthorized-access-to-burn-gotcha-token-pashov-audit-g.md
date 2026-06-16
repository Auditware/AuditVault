---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/staking
protocol: "[[OnchainHeroes]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/OnchainHeroes-security-review_2025-01-13.md"
genome:
  - "[[access-roles]]"
  - "[[access-control/missing-auth]]"
  - "[[loss-of-funds/direct-drain]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-access-control]]"
  - "[[precondition/always]]"
  - "[[blast-radius/single-user]]"
---
# [C-01] Unauthorized access to burn Gotcha token

- id: 55404
- impact: HIGH
- protocol: OnchainHeroes_2025-01-13
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/OnchainHeroes-security-review_2025-01-13.md

## Summary


This bug report found a problem with two functions in the GachaToken code, `burnFrom` and `burn`. The problem allows an attacker to set the `by` input as a zero address or any approved address, which can then be used to burn tokens. The report suggests deleting the `burnFrom` function and modifying the `burn` function to prevent this issue.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

Two functions are affected here: `burnFrom` and `brun`

- `burnFrom`: `GachaToken::burnFrom` has four inputs, `address by, address from, uint256 id, uint256 amount`, here is a description for `address by`:

```
        // - If `by` is not the zero address, it must be either `from`,
        //   or approved to manage the tokens of `from`.
```

An attacker could set `by` as zero or any approved address and burn tokens.

- `burn`: this function calls `_burn` function, in `_burn`:

```solidity
    function _burn(address from, uint256 id, uint256 amount) internal virtual {
        _burn(address(0), from, id, amount);
    }
```

It sets `by` as a zero address (just like the above attack path).

Here is the POC for setting `by` as a zero address.

**POC:**

```solidity
    function testBurn_gotcha_token() public {
        vm.prank(address(endgame));
        gachaToken.mint(owner, 1, 100);
        assertEq(gachaToken.balanceOf(owner, 1), 100);

        vm.prank(user1);
        // gachaToken.burnFrom(by, from, id, amount);
        //@audit by setting `by` as 0, it should be able to burn from any address
        gachaToken.burnFrom(address(0), owner, 1, 100);
        assertEq(gachaToken.balanceOf(owner, 1), 0);
    }
```

## Recommendations

1. Delete `burnFrom`.
2. Modify `burn` as follows:

```solidity
    function burn(address from, uint256 id, uint256 amount) external {
        _burn(msg.sender, from, id, amount);
    }
```
