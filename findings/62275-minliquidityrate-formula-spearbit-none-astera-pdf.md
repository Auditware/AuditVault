---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/lending
protocol: "[[Astera]]"
auditors:
  - "[[Saw-mon and Natalie]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Astera-Spearbit-Security-Review-December-2024.pdf"
genome:
  - "[[price-calculation]]"
  - "[[defi/price-manipulation]]"
  - "[[cross-contract-state-consistency]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# minLiquidityRate formula

- id: 62275
- impact: HIGH
- protocol: [[Astera]]
- reporter: Saw-mon and Natalie (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Astera-Spearbit-Security-Review-December-2024.pdf

## Summary


This bug report discusses a potential issue in the code for the MiniPoolDefaultReserveInterestRate and MiniPoolPiReserveInterestRateStrategy contracts. The issue arises when there is not enough liquidity in the Mproxy during a mini pool borrow. This can result in incorrect calculations and a mismatch between the amount of debt owed by the user and the amount of debt owed by the mini pool. To fix this issue, the report recommends enforcing certain constraints and ensuring that the interactions with the lending pool are not too far apart. The report also mentions that this issue has been partially addressed in the code, but some further checks and updates are needed.

## Details

## Severity: High Risk

## Context
- MiniPoolDefaultReserveInterestRate.sol#L227-L254
- MiniPoolPiReserveInterestRateStrategy.sol#L197-L224

## Description/Recommendation
When the Mproxy does not have enough liquidity during a mini pool borrow, the following happens:

1. The mini pool PM borrows an unbacked amount from the reserve in the lending pool PL.
2. PM deposits back into PL to get a wrapped token and take advantage of interest accrual.
3. Deposits that wrapped token into the corresponding reserve in PM to get a double-wrapped token.
4. Borrows to the user.

During this process, the following amount of debt will be minted for the user in the Mproxy (idTB,U):
- `(a ray it0,MP B,Twrapper A,U)`

And the following amount of lending share will be minted in Mproxy (idTA,U) for PM:
- `a ray it0,MP L,Twrapper A,U`

And the following debt position will be minted for PM in the reserve (U, true) of the PL:
- `(a ray it0,LP L,U) ray it0,LP B,U`

Where `t0` is the time the borrow was called on the mini pool. Now assume from that time to time `tn`:
- The set of interactions with the lending pool is `J`.
- The set of interactions with the mini pool is `K`.

Then at time `tn`, the mini pool PM needs to pay back the lending pool the following amount:
- `A0 = (a ray it0,LP L,U) O ray,J (1ray + r tj ,LP B,U) tj`

And the amount owed by the user when calculated in the main underlying asset with all the mini pool borrow interest and lending pool deposit interest becomes:
- `A1 = ((a O ray,K (1ray + rtk ,MP B,Twrapper A,U) tk) ray it0,LP L,U) O ray,J (1ray + tj r tj ,LP L,U)`

Note that `ray` is not associative, and swapping the order of components can introduce tiny errors, so we have:
- `A1  (a ray it0,LP L,U) O ray,J (1ray + tj r tj ,LP L,U) O ray,K (1ray + rtk ,MP B,Twrapper A,U) tk`

The amount of the main underlying assets owed to the mini pool from its share in Mproxy (idTA,U) at time `tn` would be:
- `A2 = (a O ray,K(1ray + tk rtk ,MP L,TA,U)) ray it0,LP L,U O ray,J(1ray + tj r tj ,LP L,U)`

Which is roughly:
- `A2  (a ray it0,LP L,U) O ray,J (1ray + tj r tj ,LP L,U) O ray,K (1ray + tk rtk ,MP L,TA,U)`

Note that all `A0`, `A1`, `A2` have the common `a ray it0,LP L,U` factor (roughly). One might think that `A0` should be able to be repaid by a mix of `A1` and `A2`, but we might not always assume that the user would repay its debt on time or at all so we might want to define the following constraints:

- `A0  A2`
- or going a little further:
- `A0  A2  A1`

The first inequality would give us:
- `O ray,J (1ray + r tj ,LP B,U) tj (1ray + tj r tj ,LP L,U)  O ray,K (1ray + tk rtk ,MP L,TA,U)`

This is the more general inequality (and the division is aray division) than the one enforced in the codebase. In the codebase, `J` and `K` coincide and have only one element, and `tj = tk` is the 5 day delta time margin normalised and the rates are also normalised with respect to `SECONDS_PER_YEAR`.

And so if there are many interactions with the lending pool corresponding to the reserve in the question compared to the one in the mini pool, the mini pool's minted lending shares in itself might not be able to repay the borrowed loans in the lending pool.

For simplicity's sake in the equations below, assume we are analyzing the case where `J = K` and we only have one `t = tj` and `rL = r tj ,LP L,U`, `rB = r tj ,LP B,U` then define:
- `f(t) = g(t, rL, rB) = (1 + rB)t � (1 + rLt)t + rLt2  (rB � rL) + (t � 1/2)r2 B + (t � 1/2)(t � 2/3)r3 B / (1 + rLt)`

- `f(0) = log(1 + rB) � rL  (rB � r2 B/2 + r3 B/3) � rL  rB � rL`
- `f(1)  rB � rL / (1 + rL)`

### A Few Notes
1. The expressions above are normalized with respect to the Ray precision.
2. Binomial approximation is used up to 4 terms according to the codebase.
3. At `t = 0` the inequality holds since both sides would be `1 ray`, so we don't have to analyze `f(0)` that much.

One can show that on the interval `[1, 1)` the function `f(t)` is increasing (please double check). A desired property to prove is that `f(t)` is an increasing function in the positive domain or at least in the domain from `0` up to the `DELTA_TIME_MARGIN` `tm`. This would give us a guarantee that `f(tm)` is the maximum value in the domain `[0, tm]`. 

Based on the above, one needs to take the maximum of `f(0)` and `f(tm)` to find the maximum in the set `[0, tm] \ Z`, let's call this value `fmax`. If we prove or guarantee the following two invariants, we can prove that `A0  A2`:

1. `J  K`, this still needs to be enforced by making sure whenever the interest rates in the reserve (U, true) are updated in the lending pool, the corresponding tranched reserves' interest rates are updated in all the mini pools using that `T wrapper A,U`. Although this might be a costly operation.
2. `fmax  rtk ,MP L,TA,U`, this has been partially checked in the code in this context although `minLiquidityRate` is not compared against `f(0)`.
3. The interactions with the lending pool are not more than `DELTA_TIME_MARGIN` far apart. We need to ensure for all `j, tj  tm`.

### Footnote
The second inequality `A2  A1` gives us:
- `O ray,K(1ray + tk rtk ,MP L,TA,U)  O ray,K(1ray + rtk ,MP B,Twrapper A,U) tk`

Where roughly assuming `rtk ,MP L,TA,U  rtk ,MP B,T wrapper A,U` should prove the above. The IRM implementations already follow this invariant when picking `currentLiquidityRate` and `currentVariableBorrowRate`.

**Astera**: Addressed in PR 31.
