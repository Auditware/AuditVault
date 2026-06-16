---
tags:
  - lang/solidity
  - sector/rwa
  - sector/token
  - platform/spearbit
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Centrifuge]]"
auditors:
  - "[[Devtooligan]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Centrifuge-Spearbit-Security-Review-July-2024.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[variant]]"
  - "[[role-bypass]]"
  - "[[account-ownership]]"
---
# [[Centrifuge]] router can perform untrusted actions on behalf of open vaults

- id: 35789
- impact: HIGH
- protocol: Centrifuge
- reporter: Devtooligan (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Centrifuge-Spearbit-Security-Review-July-2024.pdf

## Summary


The Centrifuge router has a critical bug that allows anyone to request deposits and redemptions on behalf of an owner, even if they are not authorized to do so. This is because the router is added as an endorsed operator, but there is no validation on the vault side. To fix this, the code needs to be updated to only allow the asset owner to access these actions. This bug has been fixed in the latest version of Centrifuge and Spearbit.

## Details

## Severity: Critical Risk

## Context
(No context files were provided by the reviewer)

## Description
The Centrifuge router enables several features such as multicall actions, permissionlessly claiming, ERC20 wrapping, and locking requests. In order to allow the router contract to perform certain actions to the vault, it must first be added as an endorsed operator. The `open()` function must be called to enable vault interactions and left as such to allow for permissionlessly claiming.

```solidity
function open(address vault) public protected {
    IERC7540Vault(vault).setEndorsedOperator(_initiator(), true);
}
```

However, there are some serious concerns with this because if a user has an approval for the vault, anyone can `requestDeposit()` on behalf of this owner and pass a controller parameter for which they control. There is no validation on the vault side because `isOperator[owner][msg.sender]` holds true as the caller is the router itself. The same applies to `requestRedeem()`, allowing tranch tokens to be redeemed unwillingly in which the controller is any arbitrary account.

```solidity
function requestDeposit(address vault, uint256 amount, address controller, address owner, uint256 topUpAmount) 
    external 
    payable 
    protected 
{
    (address asset,) = poolManager.getVaultAsset(vault);
    if (owner == address(this)) {
        _approveMax(asset, vault);
    }
    _pay(topUpAmount);
    IERC7540Vault(vault).requestDeposit(amount, controller, owner);
}
```

## Recommendation
To prevent attackers from spoofing deposits/redemptions through the router contract, require `owner == _initiator() || owner == address(this)`, which will ensure that only the asset owner has access to these actions.

It's worth documenting the expected uses of `open()` enabling interactions with the vault so users only use it where necessary.

**Centrifuge:** Fixed in commit 3b21650d.  
**Spearbit:** Fixed.
