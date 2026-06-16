---
tags:
  - lang/solidity
  - sector/staking
  - platform/code4rena
  - has/github
  - severity/high
protocol: "[[Kinetiq]]"
auditors:
  - zhaojohnson
report: "https://code4rena.com/reports/2025-04-kinetiq"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[direct-drain]]"
  - "[[use-reentrancy-guard]]"
---
# [H-02] Users Who Queue Withdrawal Before A Slashing Event Disadvantage Users Who Queue After And Eventually Leads To Loss Of Funds For Them

- id: 58554
- impact: HIGH
- protocol: Kinetiq
- reporter: zhaojohnson (Code4rena)
- source: https://code4rena.com/reports/2025-04-kinetiq

## Summary


This bug report discusses an issue with the StakingAccountant contract in the Kinetiq project. The problem occurs when there is a slashing event, causing a decrease in the amount of HYPE tokens available for withdrawal. This can result in loss of stake for users who have not yet confirmed their withdrawals, as the exchange ratio used for their withdrawals is based on the previous rate before the slashing event. The recommended mitigation is to recalculate the exchange ratio when confirming withdrawals. However, the Kinetiq team has disputed this solution, stating that the exchange rate only adjusts during rewards or slashing and that the slight fluctuation in the rate upon claiming is acceptable.

## Details



<https://github.com/code-423n4/2025-04-kinetiq/blob/7f29c917c09341672e73be2f7917edf920ea2adb/src/StakingAccountant.sol# L214-L216>

### Finding description and impact

Lets take the scenario where the HYPE to KHYPE exchange is `1 KHYPE = 1.5 KHYPE`.

At this point, let’s assume that there are in total `50 KHYPE` tokens queued for withdrawals, that is `75 HYPE` queued for withdrawals while the remaining `20 KHYPE` are still held by their respective holders worth `30 HYPE` in all.

This means that the locked in amount in the queued Withdrawals for each user across all queued withdrawals is `75 HYPE`.

We know this because of the logic in the queueWithdrawal function in the StakingManager below:
```

    uint256 hypeAmount = stakingAccountant.kHYPEToHYPE(postFeeKHYPE);

    // Lock kHYPE tokens
    kHYPE.transferFrom(msg.sender, address(this), kHYPEAmount);

    // Create withdrawal request
    _withdrawalRequests[msg.sender][withdrawalId] = WithdrawalRequest({
        hypeAmount: hypeAmount,
        kHYPEAmount: postFeeKHYPE,
        kHYPEFee: kHYPEFee,
        timestamp: block.timestamp
    });
```

That gives us a total of `70 KHYPE` to `105 HYPE` across the board when calulating the exchange ratio (including rewards).

Now let’s assume for some reason there’s a slashing event and the amount of HYPE in total reduces from `105 KHYPE` to `75 KHYPE`.

Now it leaves us with an exchange ratio of `70 KHYPE` to `75 HYPE` i.e `1 KHYPE = 1.071 HYPE`.

Since the guys who withdrew earlier already have their withdrawal delay processing first locked in with the ratio that was used before the slash, they all successfully confirm their withdrawal first and take the whole `75 HYPE` available, leaving 0 HYPE left for all the remaining `20 KHYPE` holders.

You can see the `confirmWithdrawal` function uses the withdrawalRequest amount `hypeAmount` stored which uses the previous ratio.
```

    function confirmWithdrawal(uint256 withdrawalId) external nonReentrant whenNotPaused {
        // @note - the process confirmation basically makes sure the khype amount to be withdrawn is in the contracts
        // ... it burns it, transfers the fee and makes sure the withdrawal delay has been exceeded, deletes the withdrawal request, updates the totalclaimed and totalqueuedwithdrawals
        // ... it then returns the hype amount to be received by the user
        uint256 amount = _processConfirmation(msg.sender, withdrawalId);
        require(amount > 0, "No valid withdrawal request");

        // @note - makes sure that the contract has the specified amount required to satisfy the withdrawals
        // @note - this is where the issue lies I guess, maybe not here, but if there was a slashing occurence before this confirmation of withdrawal, there could be an issue???
        require(address(this).balance >= amount, "Insufficient contract balance");

        // @note - updates the totalClaimed hype across all SM
        stakingAccountant.recordClaim(amount);

        // Process withdrawal using call instead of transfer
        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
    }
```

This leads to loss of stake for the remaining KHYPE holders even though there was enough to go 1:1.

### Recommended Mitigation Steps

A possible mitigation would be when confirming withdrawals, not to use the hypeAmount stored in the withdrawal request but to recalculate with the new ratio.

**Kinetiq disputed and commented:**

> Exchange rate adjusts only during rewards or slashing. When users queue withdrawals, their assets exit the validator, earning no profits, so the exchange rate remains fixed as when queued, until confirmation. The rate fluctuates slightly upon claiming due to total supply changes, but this is acceptable and not an issue for us.

---


