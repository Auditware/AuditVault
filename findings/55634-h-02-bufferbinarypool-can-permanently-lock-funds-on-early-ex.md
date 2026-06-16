---
tags:
  - lang/solidity
  - sector/options
  - sector/perpetuals
  - sector/stable
  - platform/0x52
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[Buffer]]"
auditors:
  - "[[@IAm0x52]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/0x52/2023-07-26-Buffer-v2.5.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# [H-02] BufferBinaryPool can permanently lock funds on early exercise

- id: 55634
- impact: HIGH
- protocol: [[Buffer]]
- reporter: @IAm0x52 (0x52)
- source: https://github.com/solodit/solodit_content/blob/main/reports/0x52/2023-07-26-Buffer-v2.5.md

## Summary


The bug report discusses an issue with the Buffer Protocol v2.5, specifically in the BufferBinaryOptions and BufferBinaryPool contracts. When exercising an option early, it is possible to receive a partial payout instead of the full locked amount, which can result in the remaining fees being permanently locked in the BufferBinaryPool contract. The report recommends that the BufferBinaryPool#send function should always unlock the entire option amount, not just the amount sent. The bug has been mitigated in a recent pull request, which ensures that upon exercise, the locked amount is redeemed to the option contract and any remaining profit is sent to the user.

## Details

**Details**

[BufferBinaryOptions.sol#L380-L395](https://github.com/Buffer-Finance/Buffer-Protocol-v2_5/blob/84b6060b4447b2550de595202e8820c7f515988b/contracts/core/BufferBinaryOptions.sol#L380-L395)

        if (option.expiration > closingTime) {
            profit =
                (option.lockedAmount *
                    OptionMath.blackScholesPriceBinary(
                        config.iv(),
                        option.strike,
                        closingPrice,
                        option.expiration - closingTime,
                        true,
                        isAbove
                    )) /
                1e8;
        } else {
            profit = option.lockedAmount;
        }
        pool.send(optionID, user, profit);

When exercising an option early, it is possible to receive a partial payout depending on the factors such as when the contract is unlocked and the current asset price. This will cause the contract to send only a portion of the locked amount.

[BufferBinaryPool.sol#L200-L207](https://github.com/Buffer-Finance/Buffer-Protocol-v2_5/blob/84b6060b4447b2550de595202e8820c7f515988b/contracts/core/BufferBinaryPool.sol#L200-L207)

        uint256 transferTokenXAmount = tokenXAmount > ll.amount
            ? ll.amount
            : tokenXAmount;


        ll.locked = false;
        lockedPremium = lockedPremium - ll.premium;
        lockedAmount = lockedAmount - transferTokenXAmount;
        tokenX.safeTransfer(to, transferTokenXAmount);

This is problematic since the amount of tokens sent is also the amount unlocked. This will leave the remainder of the fees perpetually locked in the BufferBinaryPool contract.

Example:
A user opens an option that locks 100 USDC. After some time they decide to exercise early. Due to current pricing factors their option is exercised for only 50 USDC. This unlocks 50 USDC leaving the other 50 USDC permanently locked, which means they can never be withdrawn by LPs

**Lines of Code**

[BufferBinaryPool.sol#L191-L212](https://github.com/Buffer-Finance/Buffer-Protocol-v2_5/blob/84b6060b4447b2550de595202e8820c7f515988b/contracts/core/BufferBinaryPool.sol#L191-L212)

**Recommendation**

BufferBinaryPool#send should always unlock the entire option amount not just the amount sent.

**Remediation**

Mitigated [here](https://github.com/Buffer-Finance/Buffer-Protocol-v2_5/pull/7). Upon exercise `option.lockedAmount` is redeemed to the option contract. `profit` is sent to the user and the remainder (if any) is sent back to the pool.
