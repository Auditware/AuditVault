---
tags:
  - lang/solidity
  - sector/oracle
  - sector/stable
  - sector/staking-pool
  - platform/pashov
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - vuln/logic/fee-calculation
  - impact/loss-of-funds/locked-funds
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[MCP]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/MCP-security-review_2025-08-07.md"
genome:
  - "[[frozen-funds]]"
  - "[[fee-calculation]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[fee-accounting]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# [H-01] `claimReward()` can DOS by iterating predictions blocking funds

- id: 62470
- impact: HIGH
- protocol: MCP_2025-08-07
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[MCP]]-security-review_2025-08-07.md

## Summary


This report discusses a bug in a code that allows users to create an unlimited number of predictions for a specific market and round. This can cause the transaction to exceed the block’s maximum gas limit and result in a denial-of-service (DoS) attack, permanently locking funds in the contract. The report recommends setting a maximum limit on the number of predictions allowed per round to prevent this issue.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium

## Description
Users can create an unlimited number of predictions for a specific market and round using `predict()`.
```solidity
function predict(uint256 marketId, bool isBullish) external roundActive(marketId) {
        uint256 roundId = currentRoundId[marketId];
        Round memory round = marketRounds[marketId][roundId];

        // Predictions close 1 hour before round ends to prevent last-minute manipulation
        require(block.timestamp < round.startTime + 23 hours, "Prediction closed (last hour)");

        // Transfer 5 USDC fee from user to contract
        require(IERC20(markets[marketId].token).transferFrom(
            msg.sender,
            address(this),
            PREDICTION_FEE
        ), "Payment failed");

        // Store the prediction
        predictions[marketId][roundId].push(Prediction({
            user: msg.sender,
            isBullish: isBullish,
            amount: PREDICTION_FEE 
        }));
        emit PredictionMade(marketId, roundId, msg.sender, isBullish, PREDICTION_FEE);
    }
```
The `predictions` array can grow indefinitely because it is unbounded. When `claimReward()` is called, the entire `predictions` array is checked.
```solidity
function claimReward(uint256 marketId, uint256 roundId) external {
        
        Round memory round = marketRounds[marketId][roundId];
        require(round.ended, "Round not ended");
        require(!hasClaimed[marketId][roundId][msg.sender], "Already claimed");

        Prediction[] memory preds = predictions[marketId][roundId];
        
        // Determine winning direction (bullish if end price > start price)
        bool isBullWinning = round.endPrice > round.startPrice;

        // Calculate reward pool (total - 5% fee)
        uint256 totalPool = preds.length * PREDICTION_FEE; 
        uint256 fee = (totalPool * 5) / 100;
        uint256 rewardPool = totalPool - fee;

        // Calculate user's share of winning predictions
        uint256 totalWinningAmount = 0;
        uint256 userWinningAmount = 0;

        for (uint256 i = 0; i < preds.length; i++) {
            if (preds[i].isBullish == isBullWinning) {
                totalWinningAmount += preds[i].amount;
                if (preds[i].user == msg.sender) {
                    userWinningAmount += preds[i].amount;
                }
            }
        }

       ///code...
    }
```
This could cause the transaction to exceed the block’s maximum gas limit and revert, resulting in a denial-of-service (DoS) that permanently locks funds in the contract.

This scenario is likely because the amount is fixed at 5 USDC in `PREDICTION_FEE`. For example, if a user wants to predict 10,000 USDC, 2,000 entries would be added to the `predictions` array.

## Recommendations
To solve the issue, set a maximum limit on the number of predictions allowed per round.
