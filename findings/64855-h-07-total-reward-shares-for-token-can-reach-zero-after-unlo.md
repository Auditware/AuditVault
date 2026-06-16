---
tags:
  - lang/solidity
  - sector/dex
  - sector/launchpad
  - sector/perpetuals
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/wrong-condition
  - novelty/variant
  - fix/add-check
protocol: "[[GTE]]"
auditors:
  - "[[0xvd]]"
report: "https://code4rena.com/reports/2025-08-gte-perps-and-launchpad"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[variant]]"
  - "[[reward-accounting]]"
---
# [H-07] Total reward shares for token can reach zero after unlocking, causing `GTELaunchpadV2Pair` to be bricked

- id: 64855
- impact: HIGH
- protocol: [[GTE]]
- reporter: 0xvd (Code4rena)
- source: https://code4rena.com/reports/2025-08-gte-perps-and-launchpad

## Summary


The bug report discusses an issue with the `Distributor` contract in the `launchpad` folder of the code. The problem is that if all original stakers transfer out their tokens, the `totalShares` variable for each launch token will eventually reach zero. If this happens after the token has been unlocked, the rewards program will continue to distribute rewards from the `GTELaunchpadV2Pair` to the `Distributor` even though there are no more shares left. This can cause the pair contract to become unresponsive and unable to be used for swaps or adding/removing liquidity. To fix this issue, the condition on line 147 of the `LaunchToken.sol` file should be changed to prevent the rewards program from continuing post-unlocking if all stakers have transferred their tokens out. 

## Details



`launchpad/Distributor.sol` [# L119](https://github.com/code-423n4/2025-08-gte-perps/blob/f43e1eedb65e7e0327cfaf4d7608a37d85d2fae7/contracts/launchpad/Distributor.sol# L119)

The `totalShares` variable stored for each launch token on the `Distributor` will eventually reach zero once all of the original stakers transfer out their tokens. If this happens once the token has been unlocked, then the rewards program which distributes rewards from the `GTELaunchpadV2Pair` to the `Distributor` continues regardless. We can see this is the case as the rewards program only ends if the total shares reaches zero prior to unlocking on LaunchToken.sol:147:
```

if (totalFeeShare == 0 && !unlocked) _endRewards();
```

Consider the case where `totalShares` goes to zero and any function which calls `_update` on the pair is executed. If there is any non-zero amount of accumulated launch pad fees (and some time has elapsed since the previous call), then the `GTELaunchpadV2Pair` will attempt to distribute the fees by calling `Distributor::addRewards`. Distributor.sol:119 will cause a revert as `totalShares` is zero:
```

        if (rs.totalShares == 0) revert NoSharesToIncentivize();
```

Now the pair contract is bricked and cannot be used for swaps or adding/removing liquidity.

### Recommended mitigation steps

It appears the condition on LaunchToken.sol:147 may have been coded accidentally with the wrong condition. It would make sense to change it to:
```

if (totalFeeShare == 0 && unlocked) _endRewards();
```

This way the rewards program will end post-unlocking if all stakers transfer their tokens out, preventing `Distributor::addRewards` being called by the pair.

[View detailed Proof of Concept](https://code4rena.com/audits/2025-08-gte-perps-and-launchpad/submissions/F-5)

---
