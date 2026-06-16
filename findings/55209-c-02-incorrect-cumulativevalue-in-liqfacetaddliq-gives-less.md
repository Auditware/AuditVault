---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Burve]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Burve-security-review_2025-01-29.md"
genome:
  - "[[precision-loss]]"
  - "[[reward-theft]]"
  - "[[integer-bounds]]"
---
# [C-02] Incorrect `cumulativeValue` in `LiqFacet::addLiq` gives less shares to users

- id: 55209
- impact: HIGH
- protocol: Burve_2025-01-29
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Burve]]-security-review_2025-01-29.md

## Summary


The bug report describes an issue that occurs when adding liquidity to a token. The severity and likelihood of the issue are both high. The report explains that the code used to calculate the shares given to the user after adding liquidity is incorrect. This is because the total value of all tokens, including the deposit made by the user, is being used to calculate the shares. This results in the user receiving fewer shares than they should, which means they will receive less of their deposit when they withdraw. The report recommends modifying the code to use the correct value for `cumulativeValue` and removing a check in the code.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

Upon adding liquidity, we compute the shares to give to the user using the following code:

```solidity

uint256 addedBalance = tokenBalance - preBalance[idx];

uint256 cumulativeValue = tokenBalance;

        TokenRegistry storage tokenReg = Store.tokenRegistry();

        for (uint256 i = 0; i < n; ++i) {

            if (i == idx) {

                continue;

            } else if (preBalance[i] != 0) {

                address otherToken = tokenReg.tokens[i];

                Edge storage e = Store.edge(token, otherToken);

                uint256 priceX128 = (token < otherToken) ? e.getInvPriceX128(tokenBalance, preBalance[i]) : e.getPriceX128(preBalance[i], tokenBalance);

                cumulativeValue += FullMath.mulX128(preBalance[i], priceX128, true);

            }

        }

        shares = AssetLib.add(recipient, cid, addedBalance, cumulativeValue);

```

It computes the total value of all tokens in terms of the token we are adding liquidity in and store that in `cumulativeValue`. We then use the following formula for the shares where `num` is the `addedBalance` inpu, `denom` is the `cumulativeValue` input and `total` is the total amount of shares:

```solidity

shares = FullMath.mulDiv(num, total, denom);

```

It simply downscale the total amount of shares based on the provided value by the user and the total value. The issue is that `cumulativeValue` includes the deposit by the user which results in him receiving less shares as the total value is bigger.

Let’s imagine the following scenario:

1. The `preBalance` of the token deposited is 10 and the added balance is also 10, thus `tokenBalance` is 20

2. We wrongly set `cumulativeValue` to `tokenBalance` or 20

3. We imagine that cumulative value is increased twice by 10 in the loop, to a total of 40

4. The shares for the user will be `10 * 100 / 40 = 25` (assuming total shares are 100), the total shares go to 125 and the user shares are 25

5. If a user withdraws, he will be able to get `25 / 125 = 0.2` of the total value which we computed to be 40, thus 8 (2 less than what he deposited, he should get the same)

This is because `cumulativeValue` should be initialized with the value of `preBalance[idx]`, that way the formula for the user shares will be `10 * 100 / 30 = 0.33` (30 comes from 10 tokens from the `preBalance[idx]` and 2 \* 10 from the other tokens). Now, when the user withdraws, he will be able to get `33 / 133 = 0,2481203008` of the 40 assets which is ~10.

## Recommendations

Modify `LiqFacet::addLiq` as follows:

```diff

-        uint256 cumulativeValue = tokenBalance;

+        uint256 cumulativeValue = preBalance[idx];

```

Remove the following check in `AssetLib::add`:

```solidity

require(num == denom, “NDE”);

```
