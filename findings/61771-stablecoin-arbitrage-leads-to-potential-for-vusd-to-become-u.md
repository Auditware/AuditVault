---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/lending
  - sector/oracle
  - sector/stable
  - sector/uncollat-lending
protocol: "[[VUSD]]"
auditors:
  - "[[Paul Clemson]]"
report: "https://certificate.quantstamp.com/full/vusd-stablecoin/f4e8fad4-3c79-4e7b-b0f3-260ef5f0acf6/index.html"
genome:
  - "[[missing-circuit-breaker]]"
  - "[[indirect-loss]]"
  - "[[liquidation-underwater]]"
  - "[[frontrun-exposure]]"
  - "[[oracle-freshness]]"
---
# Stablecoin Arbitrage Leads to Potential for [[VUSD]] to Become Undercollateralized

- id: 61771
- impact: HIGH
- protocol: vusd-stablecoin
- reporter: Paul Clemson (Quantstamp)
- source: https://certificate.quantstamp.com/full/vusd-stablecoin/f4e8fad4-3c79-4e7b-b0f3-260ef5f0acf6/index.html

## Summary


The client has marked a bug as "Fixed" in the codebase. The bug affects the `Redeemer.sol` and `Minter.sol` files and relates to the core principle that the VUSD token should always be backed by at least an equal value of stablecoins in the treasury. However, a scenario has been identified where an arbitrageur can exploit a slight price deviation in one stablecoin to mint more VUSD and then redeem it for another stablecoin, causing the protocol to become undercollateralized over time. A test has been added to the codebase to highlight this issue. The recommendation is to lower the default price tolerance and set a non-zero default minting fee to prevent this exploit from occurring.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `655b2efc2704480b32a13a2a52886a71520eb8ea`.

**File(s) affected:**`Redeemer.sol, Minter.sol`

**Description:** The core invariant of the protocol is that the VUSD token should always be backed at least 1:1 by the stablecoins held in its treasury. However because VUSD tokens are minted to users based on the oracle price of the stablecoin being deposited, there is an opportunity for arbitrageurs to mint more VUSD with stablecoins that have temporarily deviated slightly above one dollar. They can then immediately redeem this VUSD for another of the whitelisted stablecoins that price has not deviated from one dollar.

This scenario allows the arbitrageur to make a small profit, but more importantly means that when the deviated price of the first stable coin returns to one dollar the protocol will now be slightly undercollateralized. Over time this could be repeated whenever such a price deviation occurs to slowly force the protocol to become more and more undercollateralized.

**Exploit Scenario:**

 Consider the following scenario:

1.   There is $250k VUSD minted back by 150k USDT/100k USDC in the treasury
2.   The price of USDC deviates to $1.007 (within the default accepted `priceTolerance`)
3.   A user deposits $100k USDC getting back 100,700 VUSD token
4.   The user then immediately redeems these for USDT, receiving ~ 100,400 USDT after paying the `redeemFee`
5.   The price of USDC returns back to $1
6.   The protocol treasury only has 200k USDC and 49,600 USDT despite there still being 250k VUSD in circulation

Adding the following test to the codebase's foundry test suite highlights this:

```
function test_TreasuryUndercollat() public {
        // 100k minted in USDC, 150k minted in USDT
        address whale = makeAddr("whale");
        deal(USDC, whale, 100_000e6);
        deal(USDT, whale, 150_000e6);

        vm.startPrank(whale);

        address treasury = minter.treasury();

        IERC20(USDC).approve(address(minter), 100_000e6);
        IUSDT(USDT).approve(address(minter), 150_000e6);

        minter.mint(USDC, 100_000e6);
        minter.mint(USDT, 150_000e6);
        uint256 treasuryCUSDCBalSt = IcToken(cUSDC).balanceOfUnderlying(treasury) * 10**12;
        uint256 treasuryCUSDTBalSt = IcToken(cUSDT).balanceOfUnderlying(treasury) * 10**12;

        console2.log("Treasury Bal Stt", treasuryCUSDCBalSt + treasuryCUSDTBalSt);
        vm.stopPrank();

        // USDC price adjusted $1.007
        usdcOracle.setPrice(1e8 + 7e5);

        // Alice mints with USDC
        deal(USDC, alice, 100_000e6);
        vm.startPrank(alice);
        IERC20(USDC).approve(address(minter), 100_000e6);
        minter.mint(USDC, 100_000e6);

        // Alice redeems USDT
        uint256 aliceBalance = IERC20(vusd).balanceOf(alice);
        IERC20(vusd).approve(address(redeemer), aliceBalance);
        redeemer.redeem(USDT, aliceBalance);

        // USDC price moves back to $1.00
        usdcOracle.setPrice(1e8);

        uint256 vusdSupply = IERC20(vusd).totalSupply();

        // Get CTokenAmounts
        uint256 treasuryCUSDCBal = IcToken(cUSDC).balanceOfUnderlying(treasury) * 10**12;
        uint256 treasuryCUSDTBal = IcToken(cUSDT).balanceOfUnderlying(treasury) * 10**12;
        console2.log("Treasury Bal End", treasuryCUSDCBal + treasuryCUSDTBal);

        assert(treasuryCUSDCBal + treasuryCUSDTBal < vusdSupply);
    }
```

**Recommendation:** Consider lowering the default `priceTolerance`and setting a non-zero default `mintingFee` to ensuring that `mintingFee + redeemFee >= priceTolerance`. This will make it significantly harder for any potential arbitrage to undercollateralize the treasury.
