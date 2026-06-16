---
tags:
  - lang/solidity
  - sector/dex
  - sector/launchpad
  - sector/perpetuals
  - sector/staking
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/reward-theft
protocol: "[[GTE]]"
auditors:
  - "[[newspacexyz]]"
report: "https://code4rena.com/reports/2025-08-gte-perps-and-launchpad"
genome:
  - "[[missing]]"
  - "[[direct-drain]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# [H-06] Donations to `Distributor` with arbitrary `quoteToken` can be used to drain all quote rewards from distributor

- id: 64854
- impact: HIGH
- protocol: [[GTE]]
- reporter: newspacexyz (Code4rena)
- source: https://code4rena.com/reports/2025-08-gte-perps-and-launchpad

## Summary


The Distributor contract in the code has a bug that allows an attacker to steal quote tokens. This happens when the attacker provides their own contract address as the "token1" parameter and sets the "amount1" parameter to a specific value. This causes an increase in the storage variable for the amount of quote rewards, but the attacker does not actually contribute any reward tokens. This can result in a permanent loss of user funds and make the system unusable for users with non-zero staking balances. To fix this, the code should validate that both the launch asset and quote asset are legitimate before adding rewards.

## Details



`launchpad/Distributor.sol` [# L106-L132](https://github.com/code-423n4/2025-08-gte-perps/blob/f43e1eedb65e7e0327cfaf4d7608a37d85d2fae7/contracts/launchpad/Distributor.sol# L106-L132)

`Distributor::addRewards` fails to validate that the provided `quoteAsset` is a legitimate token. Consider the case where an attacker provides a legitimate launch token as the `token0` parameter, `token1` is a malicious contract and `amount0` is zero:
```

function addRewards(address token0, address token1, uint128 amount0, uint128 amount1) external {
        (address launchAsset, address quoteAsset, uint128 launchAssetAmount, uint128 quoteAssetAmount) =
            (token0, token1, amount0, amount1);
        RewardPoolData storage rs = RewardsTrackerStorage.getRewardPool(token0);

        if (rs.quoteAsset == address(0)) {
            // [...]
        }

        if (rs.totalShares == 0) revert NoSharesToIncentivize();

        if (launchAssetAmount > 0) {
            // [...]
        }

        if (quoteAssetAmount > 0) {
            rs.addQuoteRewards(launchAsset, quoteAsset, quoteAssetAmount);
            _increaseTotalPending(quoteAsset, quoteAssetAmount);
            quoteAsset.safeTransferFrom(msg.sender, address(this), uint256(quoteAssetAmount));
        }
```

The attacker can provide their own contract address for `token1` as long as it implements a `transferFrom` function. The `amount1` parameter they choose will cause an increase to the storage variable for the amount of quote rewards, but they will not contribute any actual reward tokens to the contract. Consequently, assuming the attacker holds some non-zero staking balance, they can then drain all the available quote tokens in the contract as the quote token rewards per share have been drastically over-inflated.

Impact: permanent loss of user funds as firstly they lose out on rewards. Secondly, the system becomes bricked for users which currently hold non-zero staking balances: they cannot transfer their tokens out due to the fact that `LaunchToken` triggers a reward distribution to the `from` account on transfers. This will fail now that there are insufficient quote tokens in the contract.

### Recommended mitigation steps

Validate both the launch asset and quote asset are legitimate within `addRewards`.

[View detailed Proof of Concept](https://code4rena.com/audits/2025-08-gte-perps-and-launchpad/submissions/F-4)

---
