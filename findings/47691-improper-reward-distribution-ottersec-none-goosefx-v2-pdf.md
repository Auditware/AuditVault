---
tags:
  - lang/solidity
  - sector/dex
  - platform/ottersec
  - has/poc
  - severity/high
  - vuln/logic/reward-calculation
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[GooseFX V2]]"
auditors:
  - "[[OtterSec]]"
report: "https://www.goosefx.io/"
genome:
  - "[[reward-calculation]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[reward-accounting]]"
---
# Improper Reward Distribution

- id: 47691
- impact: HIGH
- protocol: [[GooseFX V2]]
- reporter: OtterSec
- source: https://www.goosefx.io/

## Summary


The current implementation of SSLPool rewards allows an attacker to manipulate the total deposits and unfairly distribute rewards. This can be done by withdrawing tokens before creating a claim, resulting in users not receiving rewards proportional to their contributions. A proof of concept shows how an attacker can withdraw tokens and receive a larger share of the rewards. To fix this issue, the total accumulated rewards should be replaced with a reward per share, and the user's share should be calculated based on their deposits at the time of the claim. This issue has been fixed in the f1813b6 patch.

## Details

## SSLPool Rewards Vulnerability

In the current implementation, as a direct token amount, SSLPool rewards store the total accumulated rewards (`total_accumulated_lp_reward`). During the claims process, rewards are divided by the total deposits at the time of the claim. This may enable an attacker to manipulate the total deposits by withdrawing tokens before creating a claim, unfairly distributing rewards, as users will not receive rewards proportional to their actual contributions.

## Proof of Concept

An example attack scenario:
1. User A deposits 1000 tokens, and the attacker creates two accounts, B and C, each depositing 1000 tokens.
2. Due to the execution of swaps, a reward amounting to 150 is collected. The correct way of distributing this reward should be (50 each for A, B, C).
3. Attacker withdraws 1000 tokens from account B, reducing total deposits to 2000.
4. The reward for B: \( 150 \times \left( \frac{1000}{3000} \right) = 50 \).
5. Now, the attacker withdraws 1000 tokens from account C.
6. The reward for C: \( 150 \times \left( \frac{1000}{2000} \right) = 75 \).

## Remediation

Instead of storing the total accumulated rewards, store the reward per share. On each addition of rewards to the fee vault, increment the reward per share. During reward claims, calculate the user’s share based on the reward per share and the user’s deposits at that specific moment.

## Patch

Fixed in commit `f1813b6`.
