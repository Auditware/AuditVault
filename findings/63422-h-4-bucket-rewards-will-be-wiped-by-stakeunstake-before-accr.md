---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/staking
protocol: "[[Super DCA]]"
auditors:
  - "[[0x00T1]]"
  - "[[0xAadi]]"
  - "[[0xAdwa]]"
  - "[[0xB4nkz]]"
  - "[[0xCrypt0nite]]"
  - "[[0xCuru]]"
  - "[[0xDemon]]"
  - "[[0xDjango]]"
  - "[[0xHexed]]"
  - "[[0xImmortan]]"
  - "[[0xaxaxa]]"
  - "[[0xleo]]"
  - "[[0xlookman]]"
  - "[[0xpetern]]"
  - "[[0xsolisec]]"
  - "[[0xv1bh4]]"
  - "[[0xzen]]"
  - "[[33audits]]"
  - "[[4Nescient]]"
  - "[[8olidity]]"
  - "[[Aamirusmani1552]]"
  - "[[Al-Qa-qa]]"
  - "[[Almanax]]"
  - "[[Arav]]"
  - "[[Artur]]"
  - "[[BADROBINX]]"
  - "[[BengalCatBalu]]"
  - "[[Bobai23]]"
  - "[[Boy2000]]"
  - "[[BoyD]]"
  - "[[Chonkov]]"
  - "[[CodexBugmeNot]]"
  - "[[DemiGods]]"
  - "[[DuoSec]]"
  - "[[FonDevs]]"
  - "[[HeckerTrieuTien]]"
  - "[[Hunter]]"
  - "[[Hurricane]]"
  - "[[Icon_0x]]"
  - "[[Ironsidesec]]"
  - "[[IzuMan]]"
  - "[[JeRRy0422]]"
  - "[[JohnTPark24]]"
  - "[[JohnWeb3]]"
  - "[[Josh4324]]"
  - "[[JuggerNaut]]"
  - "[[KiroBrejka]]"
  - "[[LonWof-Demon]]"
  - "[[MysteryAuditor]]"
  - "[[NHristov]]"
  - "[[Orhukl]]"
  - "[[OxSath404]]"
  - "[[Phaethon]]"
  - "[[R]]"
  - "[[Ragnarok]]"
  - "[[Razkky]]"
  - "[[SMB62]]"
  - "[[SOPROBRO]]"
  - "[[S_722]]"
  - "[[Sa1ntRobi]]"
  - "[[ScarletFir]]"
  - "[[Siiiisivan]]"
  - "[[SuperDevFavour]]"
  - "[[Whiterabbit]]"
  - "[[WillyCode20]]"
  - "[[Y4nhu1]]"
  - "[[Yaneca_b]]"
  - "[[ZeroEx]]"
  - "[[Ziusz]]"
  - "[[alexbabits]]"
  - "[[algiz]]"
  - "[[aman]]"
  - "[[ami]]"
  - "[[axelot]]"
  - "[[bam0x7]]"
  - "[[bbl4de]]"
  - "[[cholakovvv]]"
  - "[[dani3l526]]"
  - "[[deadmanwalking]]"
  - "[[denys_sosnovskyi]]"
  - "[[derastephh]]"
  - "[[djshaneden]]"
  - "[[drdee]]"
  - "[[farman1094]]"
  - "[[fullstop]]"
  - "[[futureHack]]"
  - "[[gneiss]]"
  - "[[grigorovv17]]"
  - "[[harry]]"
  - "[[heavyw8t]]"
  - "[[hjo]]"
  - "[[illoy_sci]]"
  - "[[itsRavin]]"
  - "[[ivanalexandur]]"
  - "[[jah]]"
  - "[[jayjoshix]]"
  - "[[jo13]]"
  - "[[kangaroo]]"
  - "[[kazan]]"
  - "[[ke1caM]]"
  - "[[kimnoic]]"
  - "[[kimonic]]"
  - "[[maigadoh]]"
  - "[[makeWeb3safe]]"
  - "[[marcosecure0x]]"
  - "[[merlin]]"
  - "[[mingzoox]]"
  - "[[ni8mare]]"
  - "[[nonso72]]"
  - "[[oct0pwn]]"
  - "[[omeiza]]"
  - "[[oot2k]]"
  - "[[patitonar]]"
  - "[[peazzycole]]"
  - "[[pindarev]]"
  - "[[pollersan]]"
  - "[[prosper]]"
  - "[[proxima_centuri]]"
  - "[[pv]]"
  - "[[r1ver]]"
  - "[[rashmor]]"
  - "[[resosiloris]]"
  - "[[rsam_eth]]"
  - "[[sedare]]"
  - "[[shiazinho]]"
  - "[[shieldrey]]"
  - "[[silver_eth]]"
  - "[[slavina]]"
  - "[[softdev0323]]"
  - "[[soloking]]"
  - "[[sourav_DEV]]"
  - "[[surenyan-oks]]"
  - "[[taticuvostru]]"
  - "[[techOptimizor]]"
  - "[[theholymarvycodes]]"
  - "[[thekmj]]"
  - "[[theweb3mechanic]]"
  - "[[tinnohofficial]]"
  - "[[tobi0x18]]"
  - "[[typicalHuman]]"
  - "[[ubl4nk]]"
  - "[[udo]]"
  - "[[v10g1]]"
  - "[[v_2110]]"
  - "[[vinica_boy]]"
  - "[[vivekd]]"
  - "[[volleyking]]"
  - "[[whitehair0330]]"
  - "[[wickie]]"
  - "[[x0t0wt1w]]"
  - "[[xxiv]]"
  - "[[yeahChibyke]]"
  - "[[zcai]]"
report: "https://github.com/sherlock-audit/2025-09-super-dca-judging"
genome:
  - "[[state-update]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# H-4: Bucket rewards will be wiped by stake/unstake before accrueRewards, lastRewardIndex resets without settling rewards, accrueRewards delta becomes 0

- id: 63422
- impact: HIGH
- protocol: [[Super DCA]] Liquidity Network
- reporter: 0xpetern (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability found in the SuperDCAStaking contract, which can result in a loss of accrued rewards for stakers. The root cause of the issue is that the contract resets the lastRewardIndex in stake/unstake without settling pending rewards, which can be exploited by calling stake/unstake right before accrueReward. This will cause the delta to be set to zero, resulting in a loss of rewards for users. The impact of this bug is considered high, as it can lead to a complete loss of rewards for stakers. The report also includes a PoC (proof of concept) test to demonstrate the issue and suggests a mitigation to fix the bug. The protocol team has already fixed this issue in the SuperDCAStaking contract.

## Details


Source: https://github.com/sherlock-audit/2025-09-super-dca-judging/issues/1065 

## Found by 
0x00T1, 0xAadi, 0xAdwa, 0xB4nkz, 0xCrypt0nite, 0xCuru, 0xDemon, 0xDjango, 0xHexed, 0xImmortan, 0xaxaxa, 0xleo, 0xlookman, 0xpetern, 0xsolisec, 0xv1bh4, 0xzen, 33audits, 4Nescient, 8olidity, Aamirusmani1552, Al-Qa-qa, Almanax, Arav, Artur, BADROBINX, BengalCatBalu, Bobai23, Boy2000, BoyD, Chonkov, CodexBugmeNot, DemiGods, DuoSec, FonDevs, HeckerTrieuTien, Hunter, Hurricane, Icon\_0x, Ironsidesec, IzuMan, JeRRy0422, JohnTPark24, JohnWeb3, Josh4324, JuggerNaut, KiroBrejka, LonWof-Demon, MysteryAuditor, NHristov, Orhukl, OxSath404, Phaethon, R, Ragnarok, Razkky, SMB62, SOPROBRO, S\_722, Sa1ntRobi, ScarletFir, Siiiisivan, SuperDevFavour, Whiterabbit, WillyCode20, Y4nhu1, Yaneca\_b, ZeroEx, Ziusz, alexbabits, algiz, aman, ami, axelot, bam0x7, bbl4de, cholakovvv, dani3l526, deadmanwalking, denys\_sosnovskyi, derastephh, djshaneden, drdee, farman1094, fullstop, futureHack, gneiss, grigorovv17, harry, heavyw8t, hjo, illoy\_sci, itsRavin, ivanalexandur, jah, jayjoshix, jo13, kangaroo, kazan, ke1caM, kimnoic, kimonic, maigadoh, makeWeb3safe, marcosecure0x, merlin, mingzoox, ni8mare, nonso72, oct0pwn, omeiza, oot2k, patitonar, peazzycole, pindarev, pollersan, prosper, proxima\_centuri, pv, r1ver, rashmor, resosiloris, rsam\_eth, sedare, shiazinho, shieldrey, silver\_eth, slavina, softdev0323, soloking, sourav\_DEV, surenyan-oks, taticuvostru, techOptimizor, theholymarvycodes, thekmj, theweb3mechanic, tinnohofficial, tobi0x18, typicalHuman, ubl4nk, udo, v10g1, v\_2110, vinica\_boy, vivekd, volleyking, whitehair0330, wickie, x0t0wt1w, xxiv, yeahChibyke, zcai

### Summary

The contract resets a token bucket’s lastRewardIndex in stake / unstake without first settling pending rewards, this will cause a complete loss of accrued rewards for stakers as any user can call stake/unstake right before accrueReward and this will zero the bucket’s delta.

### Root Cause

Inside SuperDCAStaking::[accrueReward](https://github.com/sherlock-audit/2025-09-super-dca/blob/main/super-dca-gauge/src/SuperDCAStaking.sol#L284) we subtract the info.lastRewardIndex from rewardIndex, however inside stake/unstake we set lastRewardIndex == rewardIndex:

```solidity
    function unstake(address token, uint256 amount) external override {
        // Validate amount is non-zero and available
        if (amount == 0) revert SuperDCAStaking__ZeroAmount();

        // Check both token bucket and user balances are sufficient
        TokenRewardInfo storage info = tokenRewardInfoOf[token];
        if (info.stakedAmount < amount) revert SuperDCAStaking__InsufficientBalance();
        if (userStakes[msg.sender][token] < amount) revert SuperDCAStaking__InsufficientBalance();

        // Update global reward index to current time
        _updateRewardIndex();

        // Update token bucket accounting and user stakes
        info.stakedAmount -= amount;
    @>    info.lastRewardIndex = rewardIndex;

        totalStakedAmount -= amount;
        userStakes[msg.sender][token] -= amount;

        // Remove token from user's set if balance reaches zero
        if (userStakes[msg.sender][token] == 0) {
            userTokenSet[msg.sender].remove(token);
        }

        // Transfer SuperDCA tokens back to user
        IERC20(DCA_TOKEN).transfer(msg.sender, amount);
        emit Unstaked(token, msg.sender, amount);
    }


```

If stake/unstake were to be called just before accrueRewards the system "forgets" about past rewards and can make the accrueRewards return zero leading to 100% lost rewards for users.

### Internal Pre-conditions

Somebody called stake unstake before the hook _beforeAddLiquidity calls _handleDistributionAndSettlement

### External Pre-conditions

-

### Attack Path

1. Lets say lastIndex is 50, Index now will be 100, user or attacker calls stake/unstake just before _beforeAddLiquidity is triggered.
2. lastIndex becomes 100
3. _beforeAddLiquidity calls into accrueReward, because delta is `uint256 delta = rewardIndex - info.lastRewardIndex;` and stake/unstake was called before than, delta results is a small number or even 0 so basically no rewards




### Impact

High, the system forgets about past rewards, users will lose up to 100% of their rewards.

### PoC

Inside SuperDCAStaking.t.sol::TokenRewardInfos, copy paste this test:

```solidity
    function test_PoC_UnstakeBeforeAccrue_WipesBucketDelta() public {
        // Set up a single bucket stake
        vm.prank(user);
        staking.stake(tokenA, 100e18);

        // Let rewards accrue
        uint256 start = staking.lastMinted();
        uint256 secs = 100;
        vm.warp(start + secs);

        //what should be paid 
        uint256 expectedMint = secs * rate;
        assertGt(expectedMint, 0, "sanity");

        // Unstake before accrue resets bucket lastRewardIndex and wipes  delta
        vm.prank(user);
        staking.unstake(tokenA, 1);

        // Accrue now => pays 0 due to wiped delta
        vm.prank(gauge);
        uint256 paid = staking.accrueReward(tokenA);
        assertEq(paid, 0, "pending bucket rewards wiped by unstake reset");
    }
```

Run with `forge test --match-test test_PoC_UnstakeBeforeAccrue_WipesBucketDelta -vvvv`

Console.logs:
```solidity
   └─ ← [Return] 0
    ├─ [0] VM::assertEq(0, 0, "pending bucket rewards wiped by unstake reset") [staticcall]
    │   └─ ← [Return]
    └─ ← [Stop]
```

### Mitigation

Make the contract remember the passed rewards even after stake unstake has been called 

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/Super-DCA-Tech/super-dca-gauge/pull/41
