---
tags:
  - lang/solidity
  - platform/pashov-audit-group
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/liquid-staking
protocol: "[[Pino]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-09-01-Pino.md"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
---
# [C-01] Calling `Curve::withdraw` will likely result in users losing ETH

- id: 27249
- impact: HIGH
- protocol: [[Pino]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-09-01-Pino.md

## Summary


This bug report is about the `Curve::withdraw` method, which is used to remove liquidity from a pool and burn LP tokens to receive the underlying assets. The problem is that when ETH is used as an underlying asset, the `remove_liquidity` method will send back ETH to the caller, but the user has no way to sweep the ETH balance of the contracts. This means that the ETH will be stuck in the contract, and the user can't claim it.

A Proof of Concept unit test is provided in the report, which should be added to the `curve_pool.test.ts` file in its `Remove Liquidity` suite. The test involves depositing ETH, sweeping a pool token, approving the token, permitting the transfer, removing liquidity, and then unwrapping the ETH. When the test is run, the balance of ETH before should be more than the balance after, as the user should have received the ETH amount but was unable to do so. 

The recommendation for this bug is to use the handling as in `withdrawOneCoinI` and `withdrawOneCoinU`, which involves wrapping the ETH balance to `WETH`, which the user can sweep to his wallet. This would allow the user to claim their ETH liquidity.

## Details

**Severity**

**Impact:**
High, as users can lose ETH value

**Likelihood:**
High, as all >75 Curve pools that have ETH are problematic

**Description**

The `Curve::withdraw` method removes liquidity from a pool to burn LP tokens and receive the underlying assets, after which a user can sweep them to his wallet. The problem with this is that some pools use ETH as an underlying asset and the `remove_liquidity` method will send back ETH to the caller. When this is the case the ETH will be stuck in the contract (the `owner` can withdraw it for himself) since the user has no way to sweep the ETH balance of the contracts. This is handled in `withdrawOneCoinI` and `withdrawOneCoinU` but not in `withdraw`.

Below you can see a runnable Proof of Concept unit test, add this to the `curve_pool.test.ts` file in its `Remove Liquidity` suite as a last test to run it:

```javascript
    it('User can not claim his ETH liquidity', async () => {
      const { contract, sign } = await loadFixture(deploy);

      const POOL = '0xdc24316b9ae028f1497c275eb9192a3ea0f67022';
      const POOL_TOKEN = '0x06325440d014e39736583c165c2963ba99faf14e';

      const proxyFee = 5n;
      const ethAmount = 1n * 10n ** 18n;

      const amounts = [ethAmount, 0]; // eth - steth

      const poolToken = await ethers.getContractAt(
        'IERC20',
        POOL_TOKEN,
      );

      const poolTokenBalanceBefore = await poolToken.balanceOf(
        account.address,
      );

      const addTx = await contract.populateTransaction.deposit(
        amounts,
        0,
        POOL,
        proxyFee,
      );
      const sweepTx = await contract.populateTransaction.sweepToken(
        POOL_TOKEN,
        account.address,
      );

      await contract.multicall([addTx.data, sweepTx.data], 0, {
        value: ethAmount + proxyFee,
      });

      const poolTokenBalanceAfter = await poolToken.balanceOf(
        account.address,
      );

      expect(poolTokenBalanceAfter).to.gt(poolTokenBalanceBefore);

      await poolToken.approve(PERMIT2_ADDRESS, constants.MaxUint256);

      const { permit, signature } = await sign(
        {
          amount: poolTokenBalanceAfter,
          token: POOL_TOKEN,
        },
        contract.address,
      );

      const approveTx =
        await contract.populateTransaction.approveToken(POOL_TOKEN, [
          POOL,
        ]);
      const permitTx =
        await contract.populateTransaction.permitTransferFrom(
          permit,
          signature,
        );

      const removeLiquidityTx =
        await contract.populateTransaction.withdraw(
          poolTokenBalanceAfter,
          [0, 0],
          POOL,
        );

      // remove liquidity then try with unwrapping, as if the contract wrapped the received ETH in WETH
      const unwrapTx = await contract.populateTransaction.unwrapWETH9(
        account.address,
      );

      let ethBalanceBefore = await account.getBalance();
      await contract.multicall(
        [
          approveTx.data,
          permitTx.data,
          removeLiquidityTx.data,
          unwrapTx.data,
        ],
        0,
      );

      let ethBalanceAfter = await account.getBalance();
      expect(ethBalanceBefore).to.gt(ethBalanceAfter); // balance before is actually more than current because of paying gas - it should have been ~1 ETH more, because of `ethAmount`
    });
  });
```

**Recommendations**

Use the handling as in `withdrawOneCoinI` and `withdrawOneCoinU`, namely wrapping the ETH balance to `WETH`, which the user can sweep to his wallet.
