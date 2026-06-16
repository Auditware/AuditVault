---
tags:
  - lang/solidity
  - sector/dex
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Beanstalk]]"
auditors:
  - "[[Hans]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2023-06-16-Beanstalk wells.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[cross-contract-state-consistency]]"
  - "[[fot-slippage]]"
---
# `removeLiquidity` logic is not correct for generalized Well functions other than ConstantProduct

- id: 18433
- impact: HIGH
- protocol: [[Beanstalk]] Wells
- reporter: Hans (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2023-06-16-Beanstalk wells.md

## Summary


This bug report discusses an issue with the protocol intended to provide a generalized framework for constant-function AMM liquidity pools. Currently, only the constant-product type Well function is defined, but the protocol intends to support more general Well functions. The problem is that the current implementation of `Well::removeLiquidity` and `Well::getRemoveLiquidityOut` assumes linearity while getting the output token amount from the LP token amount to withdraw. This holds true for the constant product type, but not for other Well functions. For example, the Numoen protocol uses a quadratic Well function, and the current calculation of `tokenAmountsOut` breaks the Well's invariant. This limits the generalization of the protocol as opposed to its original purpose and could lead to loss of funds for the liquidity providers. 

The recommended mitigation is to add a new function in the `IWellFunction` interface, possibly in the form of `function calcWithdrawFromLp(uint lpTokenToBurn) returns (uint reserve)`, to calculate the output token amount. Beanstalk has implemented this fix by adding a `calcLPTokenUnderlying` function to `IWellFunction`. It returns the amount of each reserve token underlying a given amount of LP tokens and is used to determine how many underlying tokens to send to a user when they remove liquidity using the `removeLiquidity` function. Cyfrin has acknowledged the bug report.

## Details

**Description:** The protocol intends to provide a generalized framework for constant-function AMM liquidity pools where various Well functions can be used. Currently, only the constant-product type Well function is defined, but we understand that more general Well functions are intended to be supported.

The current implementation of `Well::removeLiquidity` and `Well::getRemoveLiquidityOut` assumes linearity while getting the output token amount from the LP token amount to withdraw. This holds well for the constant product type, as seen below. If we denote the total supply of LP tokens as $L$, the reserve values for the two tokens as $x, y$, and the invariant is $L^2=4xy$ for `ConstantProduct2`.
When removing liquidity of amount $l$, the output amounts are calculated as $\Delta x=\frac{l}{L}x, \Delta y=\frac{l}{L}y$. It is straightforward to verify that the invariant still holds after withdrawal, i.e., $(L-l)^2=(x-\Delta x)(y-\Delta y)$.

But in general, this kind of _linearity_ is not guaranteed to hold.

Recently, non-linear (quadratic) function AMMs have been introduced by some new protocols (see [Numoen](https://numoen.gitbook.io/numoen/)). If we use this kind of Well function, the current calculation of `tokenAmountsOut` will break the Well's invariant.

For your information, the Numoen protocol checks the protocol's invariant (the constant function itself) after every transaction.

**Impact:** The current `Well::removeLiquidity` logic assumes a specific condition on the Well function (linearity in some sense). This limits the generalization of the protocol as opposed to its original purpose. Given that this will lead to loss of funds for the liquidity providers for general Well functions, we evaluate the severity to HIGH.

**Proof of Concept:** We wrote a test case with the quadratic Well function used by Numoen.

```solidity
// QuadraticWell.sol

/**
 * SPDX-License-Identifier: MIT
 **/

pragma solidity ^0.8.17;

import "src/interfaces/IWellFunction.sol";
import "src/libraries/LibMath.sol";

contract QuadraticWell is IWellFunction {
    using LibMath for uint;

    uint constant PRECISION = 1e18; //@audit-info assume 1:1 upperbound for this well
    uint constant PRICE_BOUND = 1e18;

    /// @dev s = b_0 - (p_1^2 - b_1/2)^2
    function calcLpTokenSupply(
        uint[] calldata reserves,
        bytes calldata
    ) external override pure returns (uint lpTokenSupply) {
        uint delta = PRICE_BOUND - reserves[1] / 2;
        lpTokenSupply = reserves[0] - delta*delta/PRECISION ;
    }

    /// @dev b_0 = s + (p_1^2 - b_1/2)^2
    /// @dev b_1 = (p_1^2 - (b_0 - s)^(1/2))*2
    function calcReserve(
        uint[] calldata reserves,
        uint j,
        uint lpTokenSupply,
        bytes calldata
    ) external override pure returns (uint reserve) {

        if(j == 0)
        {
            uint delta = PRICE_BOUND*PRICE_BOUND - PRECISION*reserves[1]/2;
            return lpTokenSupply + delta*delta /PRECISION/PRECISION/PRECISION;
        }
        else {
            uint delta = (reserves[0] - lpTokenSupply)*PRECISION;
            return (PRICE_BOUND*PRICE_BOUND - delta.sqrt()*PRECISION)*2/PRECISION;
        }
    }

    function name() external override pure returns (string memory) {
        return "QuadraticWell";
    }

    function symbol() external override pure returns (string memory) {
        return "QW";
    }
}

// NOTE: Put in Exploit.t.sol
function test_exploitQuadraticWellAddRemoveLiquidity() public {
    MockQuadraticWell quadraticWell = new MockQuadraticWell();
    Call memory _wellFunction = Call(address(quadraticWell), "");
    Well well2 = Well(auger.bore("Well2", "WELL2", tokens, _wellFunction, pumps));

    approveMaxTokens(user, address(well2));
    uint[] memory amounts = new uint[](tokens.length);
    changePrank(user);

    // initial status 1:1
    amounts[0] = 1e18;
    amounts[1] = 1e18;
    well2.addLiquidity(amounts, 0, user); // state: [1 ether, 1 ether, 0.75 ether]

    Balances memory userBalances1 = getBalances(user, well2);
    uint[] memory userBalances = new uint[](3);
    userBalances[0] = userBalances1.tokens[0];
    userBalances[1] = userBalances1.tokens[1];
    userBalances[2] = userBalances1.lp;
    Balances memory wellBalances1 = getBalances(address(well2), well2);
    uint[] memory wellBalances = new uint[](3);
    wellBalances[0] = wellBalances1.tokens[0];
    wellBalances[1] = wellBalances1.tokens[1];
    wellBalances[2] = wellBalances1.lpSupply;
    amounts[0] = wellBalances[0];
    amounts[1] = wellBalances[1];

    emit log_named_array("userBalances1", userBalances);
    emit log_named_array("wellBalances1", wellBalances);
    emit log_named_int("invariant", quadraticWell.wellInvariant(wellBalances[2], amounts));

    // addLiquidity
    amounts[0] = 2e18;
    amounts[1] = 1e18;
    well2.addLiquidity(amounts, 0, user); // state: [3 ether, 2 ether, 3 ether]

    Balances memory userBalances2 = getBalances(user, well2);
    userBalances[0] = userBalances2.tokens[0];
    userBalances[1] = userBalances2.tokens[1];
    userBalances[2] = userBalances2.lp;
    Balances memory wellBalances2 = getBalances(address(well2), well2);
    wellBalances[0] = wellBalances2.tokens[0];
    wellBalances[1] = wellBalances2.tokens[1];
    wellBalances[2] = wellBalances2.lpSupply;
    amounts[0] = wellBalances[0];
    amounts[1] = wellBalances[1];

    emit log_named_array("userBalances2", userBalances);
    emit log_named_array("wellBalances2", wellBalances);
    emit log_named_int("invariant", quadraticWell.wellInvariant(wellBalances[2], amounts));

    // removeLiquidity
    amounts[0] = 0;
    amounts[1] = 0;
    well2.removeLiquidity(userBalances[2], amounts, user);

    Balances memory userBalances3 = getBalances(user, well2);
    userBalances[0] = userBalances3.tokens[0];
    userBalances[1] = userBalances3.tokens[1];
    userBalances[2] = userBalances3.lp;
    Balances memory wellBalances3 = getBalances(address(well2), well2);
    wellBalances[0] = wellBalances3.tokens[0];
    wellBalances[1] = wellBalances3.tokens[1];
    wellBalances[2] = wellBalances3.lpSupply;
    amounts[0] = wellBalances[0];
    amounts[1] = wellBalances[1];

    emit log_named_array("userBalances3", userBalances);
    emit log_named_array("wellBalances3", wellBalances);
    emit log_named_int("invariant", quadraticWell.wellInvariant(wellBalances[2], amounts)); // @audit-info well's invariant is broken via normal removeLiquidity
}
```

The output is shown below. We calculated the `invariant` of the Well after transactions, and while it is supposed to stay at zero, it is broken after removing liquidity. Note that the invariant stayed zero on adding liquidity because the protocol explicitly calculates the resulting liquidity token supply using the Well function. However, the output amounts are calculated in a fixed manner when removing liquidity without using the Well function, which breaks the invariant.

```
forge test -vv --match-test test_exploitQuadraticWellAddRemoveLiquidity

[PASS] test_exploitQuadraticWellAddRemoveLiquidity() (gas: 4462244)
Logs:
  userBalances1: [999000000000000000000, 999000000000000000000, 750000000000000000]
  wellBalances1: [1000000000000000000, 1000000000000000000, 750000000000000000]
  invariant: 0
  userBalances2: [997000000000000000000, 998000000000000000000, 3000000000000000000]
  wellBalances2: [3000000000000000000, 2000000000000000000, 3000000000000000000]
  invariant: 0
  userBalances3: [1000000000000000000000, 1000000000000000000000, 0]
  wellBalances3: [0, 0, 0]
  invariant: 1000000000000000000

Test result: ok. 1 passed; 0 failed; finished in 5.14ms
```

**Recommended Mitigation:** We believe it is impossible to cover all kinds of Well functions without adding some additional functions in the interface `IWellFunction`. We recommend adding a new function in the `IWellFunction` interface, possibly in the form of `function calcWithdrawFromLp(uint lpTokenToBurn) returns (uint reserve)`. The output token amount can be calculated using the newly added function.

**Beanstalk:** Added a `calcLPTokenUnderlying` function to `IWellFunction`. It returns the amount of each reserve token underlying a given amount of LP tokens. It is used to determine how many underlying tokens to send to a user when they remove liquidity using the `removeLiquidity` function. Fixed in commit [5271e9a](https://github.com/BeanstalkFarms/Basin/pull/57/commits/5271e9a454d1dd04848c3a7ce85f7d735a5858a0).

**Cyfrin:** Acknowledged.
