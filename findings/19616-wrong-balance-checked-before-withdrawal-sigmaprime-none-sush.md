---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Sushi]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/sushi/sushi-swap-stable-pool/review.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
---
# Wrong Balance Checked Before Withdrawal

- id: 19616
- impact: HIGH
- protocol: [[Sushi]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/sushi/sushi-swap-stable-pool/review.pdf

## Summary


This bug report is about an action called ACTION_DST_WITHDRAW_FROM_BENTOBOX. This action is used to withdraw tokens from BentoBox. The bug is that if the amount argument is zero, then the token balance of address(this) is assigned to amount instead of the BentoBox balance. This means that tokens could be left in BentoBox under ownership of the SushiXSwap contract, which would allow anyone to withdraw them. To prevent this, if both amount and shares arguments are zero, the BentoBox balance should be checked using bentoBox.balanceOf(token,address(this)) and assigned to shares.

## Details

## Description

Within the action `ACTION_DST_WITHDRAW_FROM_BENTOBOX`, if the `amount` argument is zero, then the token balance of `address(this)` is assigned to `amount`. However, as this action is for withdrawing from BentoBox, the token balance of `address(this)` refers to the SushiXSwap contract’s balance, which is not the desired value to assign. It is the BentoBox balance that is needed.

This will only have an impact if both `amount` and `shares` are zero. If this happens, the value of `amount` remains zero and no tokens are transferred out from BentoBox. As a result, tokens could be left in BentoBox under ownership of the SushiXSwap contract, which would allow anyone to withdraw them. Note that, in this instance, the checks in `sgReceive()` would provide no protection as the payload transactions would all execute successfully.

## Recommendations

If both `amount` and `shares` arguments are zero, check the BentoBox balance using `bentoBox.balanceOf(token, address(this))` and assign it to `shares`.
