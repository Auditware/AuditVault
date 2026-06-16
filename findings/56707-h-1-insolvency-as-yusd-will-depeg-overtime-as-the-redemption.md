---
tags:
  - lang/solidity
  - sector/insurance
  - sector/lending
  - platform/sherlock
  - has/github
  - severity/high
protocol: "[[Aegis.Im YUSD]]"
auditors:
  - w33kEd
report: "https://github.com/sherlock-audit/2025-04-aegis-op-grant-judging"
genome:
  - "[[fee-accounting]]"
  - "[[fee-calculation]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# H-1: Insolvency as `YUSD` will depeg overtime as the redemption fees are disbursed with no collaterals backing them.

- id: 56707
- impact: HIGH
- protocol: Aegis.im YUSD
- reporter: w33kEd (Sherlock)
- source: N/A

## Summary


The bug report is about a potential issue with the Aegis protocol, specifically with the `YUSD` token. The concern is that over time, the value of `YUSD` may decrease and become insolvent due to the redemption fees not being backed by enough collateral. This could happen because the code sends the entire collateral amount to the user and then takes a fee out of the `YUSD` amount, which is not backed by collateral. This could lead to negative yield for the protocol and cause the price of `YUSD` to crash. The severity of this issue is considered high as it could make the protocol insolvent. To mitigate this, the code should be changed to only send the equivalent value of `YUSD` to be burnt to the user, rather than the entire collateral amount. This would ensure that the fees are backed by enough collateral.

## Details

Source: https://github.com/sherlock-audit/2025-04-aegis-op-grant-judging/issues/1 

## Found by 
0xNForcer, 0xapple, 0xaxaxa, 0xeix, 0xpiken, 0xrex, Asher, Fade, FalseGenius, Kvar, QuillAudits\_Team, Ryonen, aslanbek, asui, bigbear1229, farman1094, gesha17, gkrastenov, harry, hildingr, iamandreiski, irorochadere, itsgreg, mahdifa, mgnfy.view, molaratai, moray5554, onthehunt, phoenixv110, s0x0mtee, shealtielanz, silver\_eth, t0x1c, turvec, vinica\_boy, w33kEd, x0x0




## Summary
On the call to `approveRedeemRequest()` the collateral amount which was used initially to get the `yusdAmount` in the `mint()` function, is calculated via the `_calculateRedeemMinCollateralAmount()`.

Here's a run down, please take a good gander.
```solidity

File: AegisMinting.sol

 function approveRedeemRequest(string calldata requestId, uint256 amount) external nonReentrant onlyRole(FUNDS_MANAGER_ROLE) whenRedeemUnpaused {
    RedeemRequest storage request = _redeemRequests[keccak256(abi.encode(requestId))];
    if (request.timestamp == 0 || request.status != RedeemRequestStatus.PENDING) {
      revert InvalidRedeemRequest();
    }
    if (amount == 0 || amount > request.order.collateralAmount) {
      revert InvalidAmount();
    }

    uint256 collateralAmount = _calculateRedeemMinCollateralAmount(request.order.collateralAsset, amount, request.order.yusdAmount);
//code snip ... some checks.
    uint256 availableAssetFunds = _untrackedAvailableAssetBalance(request.order.collateralAsset);
    if (availableAssetFunds < collateralAmount) {
      revert NotEnoughFunds();
    }

    // Take a fee, if it's applicable
    // @audit  fee amount is taken without accounting for the collateral backing thereby leading to a depegging of the YUSD
    (uint256 burnAmount, uint256 fee) = _calculateInsuranceFundFeeFromAmount(request.order.yusdAmount, redeemFeeBP);
    if (fee > 0) {
      yusd.safeTransfer(insuranceFundAddress, fee);
    }

    request.status = RedeemRequestStatus.APPROVED;
    totalRedeemLockedYUSD -= request.order.yusdAmount;
   //@audit transfers the entire collateral amount to the user.
    IERC20(request.order.collateralAsset).safeTransfer(request.order.userWallet, collateralAmount);
    yusd.burn(burnAmount);

    emit ApproveRedeemRequest(requestId, _msgSender(), request.order.userWallet, request.order.collateralAsset, collateralAmount, burnAmount, fee);
  }

```
The issue is simply, it sends the entire collateral amount backing the given `yusdAmount` to the user, the takes a fee out of the `yusdAmount` and burns the rest, but given fees left aren't backed by any collateral the fee are worthless but would still be redeemable for any of the collateral assets in the contract thereby causing negative yield for the protocol.
As fees accumulate, as seen in the code the fees can even rise to 50% it faster the higher the redemption fees are and are accumulated.


## Severity  Justification.
- While this might at first  not seem like a big deal anyone understanding the dynamics of the protocol would see that over time, the stables backing the `YUSD` will be depeleted causing the price of `YUSD` to crash make the contracts insolvent.


## Mitigation

The collateral amount to be sent back to the user should be the equivalence in value of the the `yusd` to be burnt on the call to  `approveRedeemRequest()`
 The code snippet should be changed as follows.
 ```diff
 function approveRedeemRequest(string calldata requestId, uint256 amount) external nonReentrant onlyRole(FUNDS_MANAGER_ROLE) whenRedeemUnpaused {
    RedeemRequest storage request = _redeemRequests[keccak256(abi.encode(requestId))];
    if (request.timestamp == 0 || request.status != RedeemRequestStatus.PENDING) {
      revert InvalidRedeemRequest();
    }
    if (amount == 0 || amount > request.order.collateralAmount) {
      revert InvalidAmount();
    }
++   // Take a fee, if it's applicable
++  (uint256 burnAmount, uint256 fee) = _calculateInsuranceFundFeeFromAmount(request.order.yusdAmount, redeemFeeBP);
++  if (fee > 0) {
++  yusd.safeTransfer(insuranceFundAddress, fee);
++    }

--  uint256 collateralAmount = _calculateRedeemMinCollateralAmount(request.order.collateralAsset, amount, request.order.yusdAmount);
++  uint256 collateralAmount = _calculateRedeemMinCollateralAmount(request.order.collateralAsset, amount, burnAmount);
    /*
     * Reject if:
     * - asset is no longer supported
     * - smallest amount is less than order minAmount
     * - order expired
     */
    if (
      !_supportedAssets.contains(request.order.collateralAsset) ||
      collateralAmount < request.order.slippageAdjustedAmount ||
      request.order.expiry < block.timestamp
    ) {
      _rejectRedeemRequest(requestId, request);
      return;
    }

    uint256 availableAssetFunds = _untrackedAvailableAssetBalance(request.order.collateralAsset);
    if (availableAssetFunds < collateralAmount) {
      revert NotEnoughFunds();
    }

--  // Take a fee, if it's applicable
--  (uint256 burnAmount, uint256 fee) = _calculateInsuranceFundFeeFromAmount(request.order.yusdAmount, redeemFeeBP);
--  if (fee > 0) {
--    yusd.safeTransfer(insuranceFundAddress, fee);
--  }

    request.status = RedeemRequestStatus.APPROVED;
    totalRedeemLockedYUSD -= request.order.yusdAmount;

    IERC20(request.order.collateralAsset).safeTransfer(request.order.userWallet, collateralAmount);
    yusd.burn(burnAmount);

    emit ApproveRedeemRequest(requestId, _msgSender(), request.order.userWallet, request.order.collateralAsset, collateralAmount, burnAmount, fee);
  }
 ```
