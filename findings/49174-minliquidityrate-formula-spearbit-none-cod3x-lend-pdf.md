---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/lending
protocol: "[[Cod3x]]"
auditors:
  - "[[Saw-mon and Natalie]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Cod3x-Spearbit-Security-Review-December-2024.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[cross-contract-state-consistency]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# minLiquidityRate formula

- id: 49174
- impact: HIGH
- protocol: [[Cod3x]] lend
- reporter: Saw-mon and Natalie (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Cod3x-Spearbit-Security-Review-December-2024.pdf

## Summary


This bug report discusses a high-risk issue in the MiniPoolDefaultReserveInterestRate.sol and MiniPoolPiReserveInterestRateStrategy.sol files. The problem occurs when there is not enough liquidity in the Mproxy during a mini pool borrow. This leads to incorrect calculations and debt being minted for the user in the Mproxy. The report recommends defining constraints to ensure that the mini pool's minted lending shares can repay the borrowed loans in the lending pool. It also suggests enforcing certain invariants to prevent this issue from occurring. The bug has been addressed in a pull request.

## Details

## Severity: High Risk

## Context
- MiniPoolDefaultReserveInterestRate.sol#L227-L254
- MiniPoolPiReserveInterestRateStrategy.sol#L197-L224

## Description/Recommendation
When the Mproxy does not have enough liquidity during a mini pool borrow, the following happens:

1. The mini pool PM borrows an unbacked amount from the reserve in the lending pool PL.
2. PM deposits backs into PL to get a wrapped token and take advantage of interest accrual.
3. Deposit that wrapped token into the corresponding reserve in PM to get a double-wrapped token.
4. Borrow to the user.

During this process the following amount of debt will be minted for the user in the Mproxy (idTB,U):
- \( A_B = a \cdot \text{ray}^{t_0, MP}_{B, Twrapper} \cdot A_U \)

and the following amount of lending share will be minted in Mproxy (idTA,U) for PM:
- \( A_L = a \cdot \text{ray}^{t_0, MP}_{L, Twrapper} \cdot A_U \)

The following debt position will be minted for PM in the reserve (U, true) of the PL:
- \( (a \cdot \text{ray}^{t_0, LP}_{L,U}) \cdot \text{ray}^{t_0, LP}_{B,U} \)

where \( t_0 \) is the time the borrow was called on the mini pool. Now assume from that time to time \( t_n \):
- The set of interactions with the lending pool is \( J \).
- The set of interactions with the mini pool is \( K \).

Then at time \( t_n \), the mini pool PM needs to pay back the lending pool the following amount:
- \( A_0 = (a \cdot \text{ray}^{t_0, LP}_{L,U}) \cdot \sum_{j \in J}(1 \cdot \text{ray} + r_{t_j, LP}^{B,U}) \cdot t_j \)

The amount owed by the user, when calculated in the main underlying asset with all the mini pool borrow interest and lending pool deposit interest, becomes:
- \( A_1 = \left( \sum_{k \in K}(1 \cdot \text{ray} + r_{t_k, MP}^{B, Twrapper} \cdot A_U) \cdot t_k \right) \cdot (a \cdot \text{ray}^{t_0, LP}_{L,U}) \cdot \sum_{j \in J}(1 \cdot \text{ray} + r_{t_j, LP}^{L,U}) \)

Note that \( \text{ray} \) is not associative, and swapping the order of components can introduce tiny errors, so we have:
- \( A_1 \approx (a \cdot \text{ray}^{t_0, LP}_{L,U}) \cdot \sum_{j \in J}(1 \cdot \text{ray} + r_{t_j, LP}^{L,U}) \cdot \sum_{k \in K}(1 \cdot \text{ray} + r_{t_k, MP}^{B, Twrapper} \cdot A_U) \cdot t_k \)

The amount of the main underlying assets owed to the mini pool from its share in Mproxy (idTA,U) at time \( t_n \) would be:
- \( A_2 = \left( \sum_{k \in K}(1 \cdot \text{ray} + r_{t_k, MP}^{L, TA,U}) \right) \cdot (a \cdot \text{ray}^{t_0, LP}_{L,U}) \cdot \sum_{j \in J}(1 \cdot \text{ray} + r_{t_j, LP}^{L,U}) \)

Which is roughly:
- \( A_2 \approx (a \cdot \text{ray}^{t_0, LP}_{L,U}) \cdot \sum_{j \in J}(1 \cdot \text{ray} + r_{t_j, LP}^{L,U}) \cdot \sum_{k \in K}(1 \cdot \text{ray} + r_{t_k, MP}^{L, TA,U}) \)

Note that all \( A_0, A_1, A_2 \) have the common \( a \cdot \text{ray}^{t_0, LP}_{L,U} \) factor (roughly). One might think that \( A_0 \) should be able to be repaid by a mix of \( A_1 \) and \( A_2 \), but we might not be able to always assume that the user would repay its debt on time or at all, so we might just want to define the following constraints:
- \( A_0 \leq A_2 \)

or going a little further:
- \( A_0 \leq A_2 \leq A_1 \)

The first inequality would give us:
- \( \sum_{j \in J}(1 \cdot \text{ray} + r_{t_j, LP}^{B,U}) \cdot t_j \cdot (1 \cdot \text{ray} + r_{t_j, LP}^{L,U}) \leq \sum_{k \in K}(1 \cdot \text{ray} + r_{t_k, MP}^{L, TA,U}) \)

This is the more general inequality (and the division is ray division) than the one enforced in the codebase. In the codebase, \( J \) and \( K \) coincide and have only one element, and \( t_j = t_k \) is the 5-day delta time margin normalized, and the rates are also normalized with respect to SECONDS_PER_YEAR.

So if there are many interactions with the lending pool corresponding to the reserve in the question compared to the one in the mini pool, the mini pool's minted lending shares in itself might not be able to repay the borrowed loans in the lending pool.

For simplicity's sake in the equations below, assume we are analyzing the case where \( J = K \) and we only have one \( t = t_j \) and \( r_{L} = r_{t_j, LP}^{L,U} \), \( r_{B} = r_{t_j, LP}^{B,U} \), then define:
- \( f(t) = g(t, r_L, r_B) = \frac{(1 + r_B)^t - (1 + r_L^t)}{t + r_L t^2} \approx (r_B - r_L) + (t - \frac{1}{2}) r_B^2 + (t - \frac{2}{3}) r_B^3 \)
- \( f(0) = \log(1 + r_B) - r_L \approx (r_B - \frac{r_B^2}{2} + \frac{r_B^3}{3}) - r_L \cdot (r_B - r_L) \)
- \( f(1) \approx r_B - r_L \)

### A few notes:
1. The expressions above are normalized with respect to the Ray precision.
2. Binomial approximation is used up to 4 terms according to the codebase.
3. At \( t = 0 \), the inequality holds since both sides would be 1 ray, so we don't have to analyze \( f(0) \) that much.

One can show that on the interval \([1, 1)\), the function \( f(t) \) is increasing (please double check). A desired property to prove is that \( f(t) \) is an increasing function in the positive domain or at least in the domain from 0 up to the DELTA_TIME_MARGIN \( t_m \). This would give us a guarantee that \( f(t_m) \) is the maximum value in the domain \([0, t_m]\). Based on the above, one needs to take the maximum of \( f(0) \) and \( f(t_m) \) to find the maximum in the set \([0, t_m] \setminus \mathbb{Z}\), let's call this value \( f_{max} \). 

If we prove or guarantee the following two invariants we can prove that \( A_0 \leq A_2 \):
1. \( J \subseteq K \): This still needs to be enforced by making sure whenever the interest rates in the reserve (U, true) are updated in the lending pool, the corresponding tranched reserves' interest rates are updated in all the mini pools using that \( T\text{wrapper}, A_U \). Although this might be a costly operation.
2. \( f_{max} \leq r_{t_k, MP}^{L, TA,U} \): This has been partially checked in the code in this context although \( \text{minLiquidityRate} \) is not compared against \( f(0) \).
3. The interactions with the lending pool are not more than DELTA_TIME_MARGIN far apart. We need to ensure for all \( j, t_j \leq t_m \).

### Footnote
The second inequality \( A_2 \leq A_1 \) gives us:
- \( \sum_{k \in K}(1 \cdot \text{ray} + r_{t_k, MP}^{L, TA,U}) \leq \sum_{k \in K}(1 \cdot \text{ray} + r_{t_k, MP}^{B, Twrapper} \cdot A_U) \cdot t_k \)

Where roughly assuming \( r_{t_k, MP}^{L, TA,U} \leq r_{t_k, MP}^{B, Twrapper} \cdot A_U \) should prove the above. The IRM implementations already follow this invariant when picking \( \text{currentLiquidityRate} \) and \( \text{currentVariableBorrowRate} \).

### Cod3x
Addressed in PR 31.
