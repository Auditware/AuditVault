---
tags:
  - lang/solidity
  - sector/governance
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - trigger/first-deposit
protocol: "[[Hybra Finance]]"
auditors:
  - "[[testnate]]"
report: "https://code4rena.com/reports/2025-10-hybra-finance"
genome:
  - "[[wrong-order]]"
  - "[[indirect-loss]]"
  - "[[first-deposit]]"
  - "[[fot-slippage]]"
---
# [H-01] Assets deposited before calculating shares amount to mint will cause users to mint less shares

- id: 63707
- impact: HIGH
- protocol: [[Hybra Finance]]
- reporter: testnate (Code4rena)
- source: https://code4rena.com/reports/2025-10-hybra-finance

## Summary


This bug report discusses a problem with the `GovernanceHYBR.sol` contract found in the `2025-10-hybra-finance` repository. The issue occurs in lines 137-144 of the contract, specifically in the `deposit` function. The problem is that the contract first deposits the HYBR tokens into the votingEscrow, which increases the `totalAssets()` value. However, the new `totalAssets()` value is then used to calculate the number of shares to mint for the user, resulting in an incorrect share calculation. This means that users are receiving fewer shares than they should, resulting in a loss of assets. A proof of concept test has been provided to demonstrate this issue. The report recommends that the contract be updated to use the ratio at the time of deposit for share calculation. The bug has been mitigated by the project team and confirmed by external reviewers. 

## Details



`GovernanceHYBR.sol` [# L137-L144](https://github.com/code-423n4/2025-10-hybra-finance/blob/66c42f3c9754f1b38942c69ebc0d3e4c0f8fdeb2/ve33/contracts/GovernanceHYBR.sol# L137-L144)

### Summary
```

        } else {
            // Add to existing veNFT
            IERC20(HYBR).approve(votingEscrow, amount);
            IVotingEscrow(votingEscrow).deposit_for(veTokenId, amount);

            // Extend lock to maximum duration
            _extendLockToMax();
        }

        // Calculate shares to mint based on current totalAssets
        uint256 shares = calculateShares(amount);

        // Mint gHYBR shares
        _mint(recipient, shares);
```

As we can see, the `GovernanceHYBR::deposit` function first deposits the HYBR into the votingEscrow before calculating and minting shares.

This will deposit the tokens first increasing the `totalAssets()` and the new `totalAssets()` will be used in `shares = calculateShares(amount)`

This results in incorrect calculation of shares for the users beause their deposits are treated as rewards and they are minted shares with the new rate and will suffer slippage from their own tokens.

Example:

* Initially Bob has a deposit of 100 gHYBR : 100 HYBR, ie.. 1:1 shares to asset ratio
* Alice also enter with 100 assets(HYBR),
* In an ideal condition, Alice is expected to recieve 100 shares because the ratio is 1:1 at the time of deposit
* but because deposit is done first before calculating shares,
* Alice will get, `shares = 100 * 100 / (100 +100)` i.e. only 50 shares

### Impact

Loss of assets for users by minting less shares.

### Recommended mitigation steps

Make sure that the ratio at the time of deposit must be used to calculate the shares to mint:
```

        IERC20(HYBR).transferFrom(msg.sender, address(this), amount);
+       uint256 shares = calculateShares(amount);

        // Initialize veNFT on first deposit
        if (veTokenId == 0) {
            _initializeVeNFT(amount);
        } else {
            // Add to existing veNFT
            IERC20(HYBR).approve(votingEscrow, amount);
            IVotingEscrow(votingEscrow).deposit_for(veTokenId, amount);

            // Extend lock to maximum duration
            _extendLockToMax();
        }

        // Calculate shares to mint based on current totalAssets
-       uint256 shares = calculateShares(amount);
```

Proof of concept

`forge test --mt test_test_submissionValidity -vvv`
```

    function test_submissionValidity() external {
        address bob = makeAddr("bob");
        address alice = makeAddr("alice");

        vm.startPrank(address(minter));
        hybr.mint(bob, 100e18);
        hybr.mint(alice, 100e18);
        vm.stopPrank();

        // bob mints gHYBR shares at 1:1 ratio
        vm.startPrank(bob);
        hybr.approve(address(gHybr), 100e18);
        gHybr.deposit(100e18, bob);
        uint bobShares = gHybr.balanceOf(bob);
        console.log("Bob shares: ", bobShares);
        uint shareToAssetRatio = gHybr.calculateAssets(1e18);
        vm.stopPrank();

        // Alice mints gHYBR shares at 1:1 ratio but gets less shares due to the incorrect shares calculation
        vm.startPrank(alice);
        hybr.approve(address(gHybr), 100e18);
        gHybr.deposit(100e18, alice);
        uint aliceShares = gHybr.balanceOf(alice);
        console.log("Alice shares: ", aliceShares);
        uint aliceShareToAssetRatio = gHybr.calculateAssets(1e18);
        vm.stopPrank();

        console.log("ratio after Bob deposits                                              : ", shareToAssetRatio);
        console.log("ratio after Alice deposits even when there was no rewards distribution: ", aliceShareToAssetRatio);
    }
```

We can see from the test console that Alice recieves less shares than bob with the same assset amount deposits.

**[Hybra Finance mitigated](https://github.com/code-423n4/2025-11-hybra-finance-mitigation?tab=readme-ov-file# mitigations-of-high--medium-severity-issues):**

> S-321 calculating shares use the pool ratio at the time of deposit
> S-352 check share is zero
> S- 101 too many locks check

**Status:** Mitigation confirmed. Full details in the [mitigation review reports from niffylord, rayss, and ZanyBonzy](https://code4rena.com/audits/2025-11-hybra-finance-mitigation-review/submissions/S-1).

---
