---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/staking
  - sector/vault
  - sector/token
  - platform/spearbit
protocol: "[[InfiniFi Contracts]]"
auditors:
  - R0bert
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/InfiniFi-Spearbit-Security-Review-March-2025.pdf"
genome:
  - "[[token-approval-flow]]"
  - "[[access-roles]]"
  - "[[access-control/broken-logic]]"
  - "[[privilege-escalation/role-bypass]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/single-user]]"
---
# StakedToken holders can circumvent restriction by approving another address to withdraw

- id: 55053
- impact: HIGH
- protocol: infiniFi contracts
- reporter: R0bert (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/InfiniFi-Spearbit-Security-Review-March-2025.pdf

## Summary


The bug report states that there is a high risk bug in the code for StakedTokens. This bug allows someone to bypass the transfer restriction and potentially take advantage of the system. The bug is located in the `_withdraw` function and the `_update` function, where the restriction checks are not properly implemented. This means that someone could exploit the system by pretending to be an address that does not have any StakedTokens and therefore is not restricted. The bug has been tested and a proof of concept has been provided. The recommendation is to fix this bug by validating the owner address as well. The bug has been fixed in a recent commit and has been verified by a third party.

## Details

## Severity: High Risk

## Context
`StakedToken.sol#L139`

## Description
StakedTokens come with transfer restricted functionality. Given that withdraw burns tokens, a path to circumventing the transfer restriction exists.

First, the `_withdraw` function checks that the caller is not restricted but not the owner or receiver. The caller in the exploit scenario may be an address that has no StakedTokens and therefore has not been restricted.

```solidity
function _withdraw(address caller, address receiver, address owner, uint256 assets, uint256 shares)
internal
override
{
    _checkActionRestriction(caller);
    return ERC4626._withdraw(caller, receiver, owner, assets, shares);
}
```

Then on the `_update`, the `_from` restriction check is ignored when minting or burning.

```solidity
function _update(address _from, address _to, uint256 _value) internal override {
    if (_from != address(0) && _to != address(0)) {
        // check action restrictions if the transfer is not a burn nor a mint
        _checkActionRestriction(_from);
    }
    return ERC20._update(_from, _to, _value);
}
```

## Proof of Concept
```solidity
function testRestrictionCircumvention() public {
    address anyAddress = makeAddr("anyAddress");
    vm.startPrank(alice);
    siusd.approve(anyAddress, 1000e18);
    vm.expectRevert(abi.encodeWithSelector(ActionRestriction.ActionRestricted.selector, alice,
    block.timestamp + 1));
    siusd.withdraw(1000e18, alice, alice);
    vm.stopPrank();
    vm.prank(anyAddress);
    siusd.withdraw(1000e18, alice, alice);
    assertEq(siusd.balanceOf(address(alice)), 0e18);
    assertEq(iusd.balanceOf(address(alice)), 1000e18);
}
```

## Recommendation
Ensure the owner address argument is also validated to not be restricted.

## infiniFi
Fixed in commit `913960a9`.

## Spearbit
Fix verified.
