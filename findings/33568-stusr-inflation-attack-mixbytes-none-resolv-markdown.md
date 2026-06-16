---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - trigger/first-deposit
  - precondition/specific-token-type
  - sector/token
protocol: "[[Resolv]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Resolv/README.md#1-stusr-inflation-attack"
genome:
  - "[[precision-loss]]"
  - "[[direct-drain]]"
  - "[[first-deposit]]"
  - "[[specific-token-type]]"
  - "[[dos-resistance]]"
---
# StUSR Inflation Attack

- id: 33568
- impact: HIGH
- protocol: [[Resolv]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Resolv/README.md#1-stusr-inflation-attack

## Summary


The bug report describes a vulnerability in the StUSR pool, which could lead to the loss of funds for early depositors and benefit a hacker. The pool has two protection measures in place, but they are not enough to prevent a profitable attack. The report provides an example of how a hacker could exploit this vulnerability and outlines the state of the contract at each step. The recommendation is to use 1000 virtual shares to prevent this type of attack. 

## Details

##### Description
* https://github.com/resolv-im/resolv-contracts/blob/a36e73c4be0b5f233de6bfc8d2c276136bf67573/contracts/ERC20RebasingUpgradeable.sol#L386-L398

The empty StUSR pool is vulnerable to an Inflation Attack despite having some protective measures, which can lead to the loss of funds for early depositors to the benefit of a hacker, as well as causing a DOS (Denial of Service).

StUSR has two protection mechanisms against an Inflation Attack:
1. A depositor cannot receive 0 shares.
2. The exchange rate is calculated with 1 virtual share and 1 virtual asset.

In practice, 1 virtual share is not sufficient to protect against a profitable attack.

**Example of an attack:**

1. Before an attack, the pool has 0 shares and 0 assets.
2. The hacker mints 1000 wei shares. Now the pool has 1000 wei shares plus 1 virtual share.
3. The hacker directly transfers `1,001,000 USR - 1001 wei` into the StUSR pool. At this point, the hacker holds 1000 shares worth 1000 USR each, while losing 1000 USR to the pool's 1 virtual share.
4. The first victim deposits 1999 USR and receives `shares = 1999e18 * 1001 / 1001000e18 = 1 wei`. The value of 1 share is now approximately 1001 USR. The victim loses about 1000 USR, which is distributed to the pool. Since the hacker owns 99.8% of the pool, most of the profit goes to the hacker. At this point, the hacker has almost recovered the cost of the attack.
5. The second victim deposits 1999 USR and receives `shares = 1999e18 * (1001 + 1) / (1002999e18 + 1) = 1 wei`. The value of 1 share is now approximately 1002 USR. Again, the victim loses about 1000 USR, mostly to the hacker's benefit. At this point, the hacker is in profit.

State of the contract for each step:
| Step | `totalShares()+1` | `_totalUnderlyingTokens()+1` | 1 wei share value | Hacker's total profit (approx.)|
|---|---|---|---|---|
| 1 | 0 | 0 |  |  |
| 2 | 1000 + 1 | 1000 + 1 | 1 wei | 0 |
| 3 | 1000 + 1 | 1,001,000e18 | 1000 USR | -1000 USD |
| 4 | 1001 + 1 | 1,002,999e18 | ~1001 USR | 0 |
| 5 | 1002 + 1 | 1,004,998e18 | ~1002 USR | +1000 USD |

##### Recommendation
We recommend using 1000 virtual shares.
