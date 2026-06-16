---
tags:
  - lang/solidity
  - sector/farm
  - sector/liquid-staking
  - sector/staking
  - sector/staking-pool
  - platform/halborn
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Entangle Trillion]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/entangle-labs/entangle-trillion"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# Unsafe Casting Leads To Overflow/Underflow

- id: 51368
- impact: HIGH
- protocol: [[Entangle Trillion]]
- reporter: Halborn
- source: https://www.halborn.com/audits/entangle-labs/entangle-trillion

## Summary


The smart contract in question has functions called `reinvest` and `withdraw` that convert between different types of numbers without checking if the conversion is safe. This could lead to vulnerabilities, such as incorrect values or negative values. The report gives an example of how this could happen in the `reinvest` function. The team recommends using a library called `SafeCast` to safely convert between types. The team has already implemented this solution in their codebase.

## Details

##### Description

The smart contract contains functions such as `reinvest` and `withdraw` that perform conversions between `int128`, `int256`, and `uint256` without validating that these conversions are safe. Here's a step-by-step breakdown of how this could lead to vulnerabilities, using the `reinvest` function as an example:

  

* In the `reinvest` function, there's a line where a `uint256` variable `amounts[i]` is converted to `int128` for a function call:

  ```
  run3(
      ..., 
      EXACTLY, int128(int256(amounts[0])),
      ...
  );
  ```

  `run3( ..., EXACTLY, int128(int256(amounts[0])), ... );`
* Given `uint256` can store values much larger than what `int128` can hold, this conversion is unsafe without checks.
* Assume a scenario where `amounts[0]` holds a value greater than `2**127 - 1` (the maximum positive value `int128` can represent).
* The direct casting to `int128` would result in an overflow, leading to an incorrect, potentially negative value.

##### Proof of Concept

```
    it("Deposit -> wihdrawLP (tweaked)", async () => {
        /*  
            comment out balance manager part until it is deployed
        */
        const { amountUsdc, amountToken } = await fundProtoChef()
        const LP = new ethers.Contract(VelocoreConfig.Pools[0].LPTokenAddress, ERC20_ABI, depositorCompounder);

        await VelocoreChef.connect(depositorCompounder).deposit(poolId, [amountUsdc, amountToken])

        const lpAmountAfterDeposit = await MasterChef.getLpTokenTotalBalance(SID);
        // console.log(lpAmountAfterDeposit)
        // console.log(ethers.utils.formatEther(lpAmountAfterDeposit))
        expect(lpAmountAfterDeposit).to.be.gt(0);

        await MasterChef.connect(depositorCompounder).withdrawLP(SID, 115792089237316195423570985008687907853269984665640564039457584007913129639935 , depositorCompounder.address)
        const balanceAfterWithdraw = await MasterChef.getLpTokenTotalBalance(SID)
        expect(balanceAfterWithdraw).to.be.equal(0);

        const depositorLPBalance = await LP.balanceOf(depositorCompounder.address)
        expect(depositorLPBalance).to.equal(lpAmountAfterDeposit)

    });
```

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:N/A:N/D:C/Y:N/R:N/S:C (10.0)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:N/A:N/D:C/Y:N/R:N/S:C)

##### Recommendation

Implement or use an existing library designed for safe type conversions, such as OpenZeppelin's `SafeCast`.

  

**Remediation Plan:** The Entangle team solved the issue by using **SafeCast** on the codebase.

##### Remediation Hash

<https://github.com/Entangle-Protocol/entangle-lsd-protocol/commit/5166bd961d55bf9b27c23ef895231263eb771814>
