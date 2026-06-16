---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - sector/lending
  - sector/oracle
protocol: "[[Licredity]]"
auditors:
  - "[[immeas]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-09-01-cyfrin-licredity-v2.0.md"
genome:
  - "[[stale-price]]"
  - "[[defi/price-manipulation]]"
  - "[[debt-accrual-update]]"
  - "[[timestamp-dependence]]"
---
# `[[Licredity]]::decreaseDebtShare` bypasses interest accrual

- id: 62350
- impact: HIGH
- protocol: Licredity
- reporter: Immeas (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-09-01-cyfrin-licredity-v2.0.md

## Summary


The report discusses a bug in the Licredity protocol, where borrowers are able to avoid paying accrued interest when repaying their loans through direct calls. This impacts the yield for LPs and protocol revenue, as interest only accrues during specific operations. The bug has been confirmed through a proof of concept test and has been fixed in a recent update to the protocol. The recommended mitigation is to either accrue interest at the start of the `decreaseDebtShare` function or restrict it to only be callable within the `unlock` context. The bug has been verified by Cyfrin and interest is now properly accrued in the `decreaseDebtShare` function. 

## Details

**Description:** A borrower can call [`Licredity::decreaseDebtShare`](https://github.com/Licredity/licredity-v1-core/blob/e8ae10a7d9f27529e39ca277bf56cef01a807817/src/Licredity.sol#L472-L536) to repay their loan. Because this call can only reduce debt, it’s treated as “safe” and allowed outside the [`Licredity::unlock`](https://github.com/Licredity/licredity-v1-core/blob/e8ae10a7d9f27529e39ca277bf56cef01a807817/src/Licredity.sol#L86-L110) flow. However, interest accrues only during [`unlock`](https://github.com/Licredity/licredity-v1-core/blob/e8ae10a7d9f27529e39ca277bf56cef01a807817/src/Licredity.sol#L89-L90), [`swap`](https://github.com/Licredity/licredity-v1-core/blob/e8ae10a7d9f27529e39ca277bf56cef01a807817/src/Licredity.sol#L713), and liquidity [add](https://github.com/Licredity/licredity-v1-core/blob/e8ae10a7d9f27529e39ca277bf56cef01a807817/src/Licredity.sol#L670)/[remove](https://github.com/Licredity/licredity-v1-core/blob/e8ae10a7d9f27529e39ca277bf56cef01a807817/src/Licredity.sol#L698) operations. Therefore calling `decreaseDebtShare` directly therefore uses the last `totalDebtBalance/totalDebtShare` without first accruing interest, so the repayment is computed from a stale state.

**Impact:** Borrowers can avoid paying accrued interest when repaying via direct calls, reducing yield for LPs and protocol revenue. While interest will still accrue when other participants trigger the hook (e.g., borrows/trades/LP actions), repayments executed before such events effectively skip the borrower’s interest share. Even if unintentional and harder to time in an active market, this lowers realized interest, distorts accounting, and reduces net APY.

**Proof of Concept:** Add the following test to `LicredityUnlockPosition.t.sol`:
```solidity
function test_decraseDebtBalance_doesntAccrueInterest() public {
    uint256 positionId = licredityRouter.open();
    licredityRouter.depositFungible{value: 10e8}(positionId, Fungible.wrap(ChainInfo.NATIVE), 10e8);

    uint256 delta = 1e8 * 1e6;

    licredityRouterHelper.addDebt(positionId, delta, address(this));
    uint256 amountBorrowed = licredity.balanceOf(address(this));

    // should cause interest accrual
    oracleMock.setQuotePrice(2 ether);
    vm.warp(block.timestamp + 180 days);

    // decrease debt share call is done directly to licredity
    // avoiding the `unlock` context that accrues interest
    uint256 amountRepaid = licredity.decreaseDebtShare(positionId, delta, false);

    // no interest has been accrued
    assertEq(amountRepaid, amountBorrowed);
}
```

**Recommended Mitigation:** Accrue interest at the start of `decreaseDebtShare` (pull accrual) or require `decreaseDebtShare` to be callable only within the `unlock` context.


**Licredity:** Fixed in [PR#59](https://github.com/Licredity/licredity-v1-core/pull/59/files), commits [`8ca2a35`](https://github.com/Licredity/licredity-v1-core/commit/8ca2a35e2af1db4e0ae2f92c779df96f42d18286), and [`81e54c0`](https://github.com/Licredity/licredity-v1-core/commit/81e54c0e62a5cda990e715061d099b03e9632d04)

**Cyfrin:** Verified. Interest is now accrued in `decreaseDebtShare`.

\clearpage
