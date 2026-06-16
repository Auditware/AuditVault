---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - severity/high
  - sector/account
protocol: "[[Mass]]"
auditors:
  - "[[Richie Humphrey]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2023-06-nestedfinance-tetrishyvm-securityreview.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[account-ownership]]"
---
# Trusted forwarder can take over the WalletFactory contract

- id: 29657
- impact: HIGH
- protocol: [[Mass]] - PRs review
- reporter: Richie Humphrey (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2023-06-nestedfinance-tetrishyvm-securityreview.pdf

## Summary


This bug report discusses a high difficulty bug related to data validation in the WalletFactory contract. The contract allows for the use of a trusted forwarder to create wallets on behalf of other accounts, but with the introduction of a new update, this forwarder can now call the upgrade function and set any value for the message sender. This means that the forwarder can control all owner-specific operations, such as upgrading the contract or changing the owner. This could lead to a potential exploit where an attacker gains access to the wallet factory and steals assets. The report recommends preventing the trusted forwarder from having access to owner privileges and documenting and testing the access controls of the wallet factory.

## Details

## Diﬃculty: High

## Type: Data Validation

### Description

The WalletFactory contract implements ERC-2771, which enables the use of a trusted forwarder to create wallets on behalf of other accounts. With the introduction of PR #110, the contract is also upgradeable. Therefore, the trusted forwarder contract can call the upgrade function on the WalletFactory contract by submitting the owner address as the value of `msg.sender`.

PR #110 adds an override of the `_msgSender` function to the WalletFactory contract, which now uses the ERC-2771 context contract; this function allows the trusted forwarder to set any value for the message sender:

```solidity
/// @dev Provides information about the current execution context
function _msgSender() internal view virtual override(ERC2771Context, Context) returns (address) {
    return ERC2771Context._msgSender();
}
```
*Figure 1.1: WalletFactory.sol#L306-L317*

The `onlyOwner` modifier relies on `_msgSender`:

```solidity
/**
* @dev Throws if called by any account other than the owner.
*/
modifier onlyOwner() {
    _checkOwner();
    _;
}
```

```solidity
/**
* @dev Throws if the sender is not the owner.
*/
function _checkOwner() internal view virtual {
    require(owner() == _msgSender(), "Ownable: caller is not the owner");
}
```
*Figure 1.2: OZ/access/Ownable.sol#L42-L64*

Among others, `onlyOwner` is used as an access control of the upgrade function:

```solidity
function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner {
    if (newImplementation.code.length == 0) {
        revert AddressNotContract(newImplementation);
    }
}
```
*Figure 1.3: OZ/access/Ownable.sol#L50-L52*

As a result, the trusted forwarder can control all of the owner-specific operations, including the following:

- Upgrading the contract
- Changing the contract’s owner

Appendix B contains a test case to trigger this issue.

### Exploit Scenario

Bob is a trusted forwarder. Therefore, he expects that his account has only additional rights regarding the creation of new wallets, so he does not properly protect his access. Eve manages to compromise Bob’s account and gains access to ownership of the wallet factory. Eve uses her new access to upgrade the wallet factory to a malicious contract that generates malicious wallets. Alice unknowingly generates a new malicious wallet and puts $10 million worth of assets into it. Eve steals the assets.

### Recommendations

- **Short term:** Prevent the trusted forwarder from having access to owner privileges except where this behavior is expected and documented.
- **Long term:** Document and test the access controls of the wallet factory; ensure that the documentation highlights the access control expectations for the trusted forwarder.
