---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - sector/liquid-staking
  - sector/oracle
  - sector/staking
  - sector/staking-pool
  - sector/vault
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/oracle/spot-price
  - impact/data-corruption/price-manipulation
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
  - fix/use-twap
  - novelty/known-pattern
  - misassumption/oracle-is-reliable
  - misassumption/price-cannot-be-manipulated
protocol: "[[stETH]]"
auditors:
  - "[[0rpse]]"
  - "[[0x73696d616f]]"
  - "[[0xAsen]]"
  - "[[0xCrypt0nite]]"
  - "[[0xDaniel_eth]]"
  - "[[0xDemon]]"
  - "[[0xDgiin]]"
  - "[[0xHexed]]"
  - "[[0xMosh]]"
  - "[[0xYjs]]"
  - "[[0xbzbee42]]"
  - "[[0xeix]]"
  - "[[0xlucky]]"
  - "[[0xpetern]]"
  - "[[0xsh]]"
  - "[[0xxAristos]]"
  - "[[Abba.eth]]"
  - "[[Albert_Mei]]"
  - "[[Bobai23]]"
  - "[[BoyD]]"
  - "[[CasinoCompiler]]"
  - "[[Cybrid]]"
  - "[[Drynooo]]"
  - "[[HeckerTrieuTien]]"
  - "[[JohnTPark24]]"
  - "[[MaratCerby]]"
  - "[[Pataroff]]"
  - "[[Protokol]]"
  - "[[R4Y4N3]]"
  - "[[Saad]]"
  - "[[Siiiisivan]]"
  - "[[Sir_Shades]]"
  - "[[SuperDevFavour]]"
  - "[[Theseersec]]"
  - "[[Wojack]]"
  - "[[Xmanuel]]"
  - "[[ZeronautX]]"
  - "[[asotu3]]"
  - "[[axelot]]"
  - "[[befree3x]]"
  - "[[blockace]]"
  - "[[boredpukar]]"
  - "[[coin2own]]"
  - "[[cyberEth]]"
  - "[[d33p]]"
  - "[[dani3l526]]"
  - "[[dantehrani]]"
  - "[[deadmanwalking]]"
  - "[[destiny_rs]]"
  - "[[dobrevaleri]]"
  - "[[eierina]]"
  - "[[ezsia]]"
  - "[[farismaulana]]"
  - "[[fullstop]]"
  - "[[gkrastenov]]"
  - "[[h2134]]"
  - "[[hy]]"
  - "[[iamephraim]]"
  - "[[insecureMary]]"
  - "[[ivxylo]]"
  - "[[jayjoshix]]"
  - "[[joshuam33]]"
  - "[[ke1caM]]"
  - "[[khaye26]]"
  - "[[kimnoic]]"
  - "[[kowolski]]"
  - "[[lucky-gru]]"
  - "[[makeWeb3safe]]"
  - "[[maxim371]]"
  - "[[ni8mare]]"
  - "[[peazzycole]]"
  - "[[s4bot3ur]]"
  - "[[securewei]]"
  - "[[theholymarvycodes]]"
  - "[[tobi0x18]]"
  - "[[typicalHuman]]"
  - "[[ubl4nk]]"
  - "[[vangrim]]"
  - "[[xKeywordx]]"
  - "[[zcai]]"
report: "https://github.com/sherlock-audit/2025-11-stnxm-by-easedefi-judging"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[use-twap]]"
  - "[[known-pattern]]"
  - "[[account-ownership]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[timestamp-dependence]]"
---
# H-1: Attacker can profit by manipulating Uniswap liquidity.

- id: 64079
- impact: HIGH
- protocol: [[stETH]] by EaseDeFi
- reporter: 0xpetern (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability found in the stNXM-Contracts project, specifically in the `dexBalances()` function. The function uses Uniswap's `slot0()` to read the current spot price, which can be manipulated within a single transaction. This allows an attacker to inflate the DEX balance and reduce virtual shares, causing the exchange rate to spike. As a result, users can withdraw at an inflated rate and profit at the expense of remaining stakers. The root cause of this vulnerability is that the `totalAssets()` function, which is critical to the system, uses the `dexBalance()` function to calculate the amount of wNXM held by the DEX. However, this can be easily manipulated by an attacker using a flash loan. The report also includes a step-by-step explanation of how an attacker can exploit this vulnerability to profit at the expense of remaining stakers. The report suggests a mitigation strategy to replace `slot0()` with a time-weighted average price to prevent such attacks in the future. The protocol team has already fixed this issue in their codebase. 

## Details


Source: https://github.com/sherlock-audit/2025-11-stnxm-by-easedefi-judging/issues/38 

## Found by 
0rpse, 0x73696d616f, 0xAsen, 0xCrypt0nite, 0xDaniel\_eth, 0xDemon, 0xDgiin, 0xHexed, 0xMosh, 0xYjs, 0xbzbee42, 0xeix, 0xlucky, 0xpetern, 0xsh, 0xxAristos, Abba.eth, Albert\_Mei, Bobai23, BoyD, CasinoCompiler, Cybrid, Drynooo, HeckerTrieuTien, JohnTPark24, MaratCerby, Pataroff, Protokol, R4Y4N3, Saad, Siiiisivan, Sir\_Shades, SuperDevFavour, Theseersec, Wojack, Xmanuel, ZeronautX, asotu3, axelot, befree3x, blockace, boredpukar, coin2own, cyberEth, d33p, dani3l526, dantehrani, deadmanwalking, destiny\_rs, dobrevaleri, eierina, ezsia, farismaulana, fullstop, gkrastenov, h2134, hy, iamephraim, insecureMary, ivxylo, jayjoshix, joshuam33, ke1caM, khaye26, kimnoic, kowolski, lucky-gru, makeWeb3safe, maxim371, ni8mare, peazzycole, s4bot3ur, securewei, theholymarvycodes, tobi0x18, typicalHuman, ubl4nk, vangrim, xKeywordx, zcai

### Summary

The [`dexBalances()`](https://github.com/sherlock-audit/2025-11-stnxm-by-easedefi/blob/main/stNXM-Contracts/contracts/core/stNXM.sol#L515
) function uses Uniswap's `slot0()` to read the current spot price, which can be manipulated within a single transaction. An attacker can swap a large amount into the Uniswap pool to inflate the DEX balance in `totalAssets()` and reduce virtual shares in `totalSupply()`, causing the exchange rate to spike. This allows users to withdraw at an inflated rate and profit at the expense of remaining stakers.

### Root Cause

The `totalAssets` function, which is one of the most critical functions in the erc4626 system uses a `dexBalance` function to get the amount of the wNXM held by dex. This is essential because the stNXM is an owner of that liquidity, and it should account for it while calculating the exchange rate. But the problem is that the attacker can easily manipulate a Uniswap pool using a flash loan and inflate the stNXM price. 

```solidity
function dexBalances()
        public
        view
        returns (uint256 assetsAmount, uint256 sharesAmount)
    {
        (uint160 sqrtRatio, , , , , , ) = dex.slot0();

        for (uint256 i = 0; i < dexTokenIds.length; i++) {
            (uint256 posAmount0, uint256 posAmount1) = PositionValue.total(
                nfp,
                dexTokenIds[i],
                sqrtRatio
            );

            if (isToken0) {
                sharesAmount += posAmount0;
                assetsAmount += posAmount1;
            } else {
                sharesAmount += posAmount1;
                assetsAmount += posAmount0;
            }
        }
    }


function totalAssets() public view override returns (uint256) {
        // Add staked NXM, wNXM in the contract, wNXM in the dex and Morpho, subtract the admin fees.

        return stakedNxm() + unstakedNxm() - adminFees;
    }
```

## Flow

### Setup :

- Uniswap V3 pool (0.05% fee): 1,000 stNXM : 1,000 wNXM (1:1 ratio)
- stNXM vault free liquidity: 20,000 wNXM
- Total protocol: ~30,000 wNXM equivalent (including staked/morpho deposits)
- Alice holds: 10,000 stNXM shares

**Step 1: Alice Requests Withdrawal**
- Alice calls redeem(10,000 shares)
- Current exchange rate: ~1.0 wNXM per share
- Expected payout: ~10,000 wNXM
- Withdrawal queued for 2 days

**Step 2: After 2 Days - Alice Constructs Batch Transaction**
Alice creates single transaction with following steps:

2a. Flashloan 10,000 wNXM from Morpho
- Borrowed: 10,000 wNXM
- Fee: 0.05% = 5 wNXM

2b. Swap 10,000 wNXM → stNXM on Uniswap
- Using constant product (x*y=k): 1,000 * 1,000 = 1,000,000
- After swap: stNXM_new * 11,000 = 1,000,000
- stNXM_new = 90.9 stNXM
- Alice receives: 1,000 - 90.9 = 909.1 stNXM
- Swap fee: 0.05% * 10,000 = 5 wNXM

So, pool state after swap:
- Before: 1,000 stNXM : 1,000 wNXM
- After:  90.9 stNXM : 11,000 wNXM

2c. Protocol Metrics Manipulated
Before manipulation:
- totalAssets() = 20,000 (free) + 1,000 (dexWNXM) + ... = ~30,000 wNXM
- totalSupply() = 30,000 - 1,000 (virtual shares) = 29,000 shares
- Exchange rate = 30,000 / 29,000 = 1.034 wNXM/share
- Alice expects: 10,000 * 1.034 = 10,340 wNXM

After manipulation:
- totalAssets() = 20,000 (free) + 11,000 (dexWNXM inflated) + ... = ~40,000 wNXM
- totalSupply() = 30,000 - 90.9 (virtual shares reduced) = 29,909 shares
- Exchange rate = 40,000 / 29,909 = 1.337 wNXM/share
- Alice will receive: 10,000 * 1.337 = 13,370 wNXM

2d. Finalize Withdrawal
- Alice calls withdrawFinalize()
- Receives: 13,370 wNXM (inflated payout)
- Extra extracted: 13,370 - 10,340 = 3,030 wNXM

2e. Reverse Swap - Rebalance Pool
- Alice swaps back: 909.1 stNXM → wNXM
- Receives: ~9,000 wNXM (accounting for fees and slippage)
- Swap fee: ~4.5 wNXM

2f. Repay Flashloan
- Repay: 10,000 + 5 = 10,005 wNXM
- Alice's wNXM balance: 13,370 (withdrawal) + 9,000 (reverse swap) = 22,370 wNXM
- After repayment: 22,370 - 10,005 = 12,365 wNXM

**Step 3: Calculate Profit**
- Alice started with: 10,000 stNXM shares (worth ~10,340 wNXM)
- Alice ends with: 12,365 wNXM
- Net profit: 12,365 - 10,340 = 2,025 wNXM (~$141,750 @ $70/wNXM)
- Attack cost: ~15 wNXM (flashloan + swap fees)
- Remaining stakers lose: 3,030 wNXM in vault value

### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

Check the root cause section.

### Impact

This allows users to withdraw at an inflated rate and profit at the expense of remaining stakers.

### PoC

Paste this in `stNXM.t.sol`

```solidity
function test_ExchangeRateManipulation() public {
        // User deposits and requests withdrawal
        uint256 depositAmt = 1000 ether;
        depositWNXM(depositAmt, wnxmWhale);

        uint256 userShares = stNxm.balanceOf(wnxmWhale);
        withdrawWNXM(userShares, wnxmWhale);

        // Record expected payout before manipulation
        uint256 expectedPayout = stNxm.convertToAssets(userShares);

        // Step 2: Attacker manipulates Uniswap pool with large swap
        uint256 attackAmt = 10_000 ether;

        // Step 3: User finalizes withdrawal at inflated rate
        vm.warp(block.timestamp + 2 days + 1 hours);
         vm.startPrank(wnxmWhale);
        wNxm.approve(address(swapRouter), attackAmt);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: address(wNxm),
                tokenOut: address(stNxm),
                fee: 500,
                recipient: wnxmWhale,
                deadline: block.timestamp + 1000,
                amountIn: attackAmt,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        swapRouter.exactInputSingle(params);
        vm.stopPrank();

        uint256 balanceBefore = wNxm.balanceOf(wnxmWhale);

        vm.prank(wnxmWhale);
        stNxm.withdrawFinalize(wnxmWhale);

        uint256 balanceAfter = wNxm.balanceOf(wnxmWhale);
        uint256 actualPayout = balanceAfter - balanceBefore;
        uint256 profit = actualPayout - expectedPayout;

        console2.log("Expected payout:", expectedPayout / 1e18);
        console2.log("Actual payout:", actualPayout / 1e18);
        console2.log("Profit:", profit / 1e18);

        // Verify vulnerability
        assertGt(
            actualPayout,
            expectedPayout,
            "User should receive inflated payout"
        );
    }
```

### Mitigation
Replace slot0() with time-weighted average price:

```solidity
function dexBalances() public view returns (uint256 assetsAmount, uint256 sharesAmount) {
    // Use TWAP over 30 minutes instead of spot price
    uint32 twapPeriod = 1800; // 30 minutes
    uint160 sqrtRatio = OracleLibrary.getSqrtRatioAtTick(
        OracleLibrary.consult(address(dex), twapPeriod)
    );
    
    for (uint256 i = 0; i < dexTokenIds.length; i++) {
        (uint256 posAmount0, uint256 posAmount1) = PositionValue.total(
            nfp,
            dexTokenIds[i],
            sqrtRatio
        );
        // ... rest of the function
    }
}
```



## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/EaseDeFi/stNXM-Contracts/commit/40630a0d88fdd663803afb73dfb9437ae01707ed
