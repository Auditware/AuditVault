---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
  - sector/token
protocol: "[[Kuiper]]"
auditors:
  - "[[Code4rena]]"
report: "https://code4rena.com/reports/2021-12-defiProtocol"
genome:
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[fee-accounting]]"
  - "[[timestamp-dependence]]"
---
# [H-01] Wrong fee calculation after `totalSupply` was 0

- id: 19837
- impact: HIGH
- protocol: [[Kuiper]]
- reporter: Code4rena (Code4rena)
- source: https://code4rena.com/reports/2021-12-defiProtocol

## Summary


This bug report is about a flaw in the `handleFees` function of the Basket contract. If the `startSupply` is 0, the function does not update the `lastFee` variable, which causes extra fee tokens to be minted when the basket is resupplied. This means that users of the basket will lose funds due to the dilution of their tokens' value. 

The bug can be demonstrated by a scenario in which all basket token holders burn their tokens, setting the total supply to 0. After one day, somebody mints basket tokens, and `handleFees` is called upon mint. However, since the `startSupply` is 0, the function will just return and not update `lastFee`. The next block, when somebody else mints a token, `handleFees` will calculate the fees according to the current supply and the time diff between now and `lastFee`. Since `lastFee` wasn't updated in the previous step, the basket will mint fees as if a whole day has passed since the last calculation, when in reality it only needs to calculate the fees for the last block.

The recommended mitigation step is to set `lastFee = block.timestamp` if `startSupply == 0`. This bug was confirmed by frank-beard (Kuiper) and 0xleastwood (judge) commented that malicious publishers can setup baskets as a sort of honeypot to abuse this behaviour.

## Details

_Submitted by kenzo_

`handleFees` does not update `lastFee` if `startSupply == 0`.
This means that wrongly, extra fee tokens would be minted once the basket is resupplied and `handleFees` is called again.

### Impact

Loss of user funds.
The extra minting of fee tokens comes on the expense of the regular basket token owners, which upon withdrawal would get less underlying than their true share, due to the dilution of their tokens' value.

### Proof of Concept

Scenario:

*   All basket token holders are burning their tokens. The last burn would set totalSupply to 0.
*   After 1 day, somebody mints basket tokens.

`handleFees` would be called upon mint, and would just return since totalSupply == 0. Note: It does not update `lastFee`.

    } else if (startSupply == 0) {
                return;

[Basket.sol#L136:#L137](https://github.com/code-423n4/2021-12-defiprotocol/blob/main/contracts/contracts/Basket.sol#L136:#L137)

*   The next block, somebody else mints a token. Now `handleFees` will be called and will calculate the fees according to the current supply and the time diff between now and `lastFee`:

<!---->

    uint256 timeDiff = (block.timestamp - lastFee);

[Basket.sol#L139](https://github.com/code-423n4/2021-12-defiprotocol/blob/main/contracts/contracts/Basket.sol#L139)<br>
But as we saw, `lastFee` wasn't updated in the previous step. `lastFee` is still the time of 1 day before - when the last person burned his tokens and the basket supply was 0.
So now the basket will mint fees as if a whole day has passed since the last calculation, but actually it only needs to calculate the fees for the last block, since only then we had tokens in the basket.

### Recommended Mitigation Steps

Set `lastFee = block.timestamp` if `startSupply == 0`.

**[frank-beard (Kuiper) confirmed](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/58)**

**[0xleastwood (judge) commented](https://github.com/code-423n4/2021-12-defiprotocol-findings/issues/58#issuecomment-1079627201):**
> The issue can be outlined as follows:
>  - A user interacts with the basket and mints some amount of tokens, which sets `lastFee = block.timestamp`.
>  - The same user decides to exit the basket and burn their tokens.
>  - Some amount of time passes and another user enters the basket, but `handleFees()` did not set `lastFee = block.timestamp`. As a result, fees are charged on the user's deposit for the entire time that the basket was inactive for.
> 
> It seems that the basket is severely flawed in calculating fees on partially inactive baskets. This puts users' funds at direct risk of being lost. Malicious publishers can setup baskets as a sort of honeypot to abuse this behaviour.
>
> This was an interesting find! Kudos to the warden.



***
