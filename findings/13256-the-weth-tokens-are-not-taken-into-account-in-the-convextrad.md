---
tags:
  - lang/solidity
  - sector/governance
  - sector/staking
  - platform/consensys
  - severity/high
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
protocol: "[[Brahma Fi]]"
auditors:
  - "[[George Kobakhidze]]"
report: "https://consensys.net/diligence/audits/2022/05/brahma-fi/"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[oracle-manipulation-resistance]]"
---
# The WETH tokens are not taken into account in the ConvexTradeExecutor.totalFunds function

- id: 13256
- impact: HIGH
- protocol: [[Brahma Fi]]
- reporter:  George Kobakhidze
 (ConsenSys)
- source: https://consensys.net/diligence/audits/2022/05/brahma-fi/

## Summary


The `totalFunds` function of the `ConvexTradeExecutor` contract is used for calculations but does not include the WETH balance. WETH tokens are initially transferred to the contract and the contract stores WETH before withdrawal. Therefore, it is recommended to include the WETH balance into the `totalFunds` function.

## Details

#### Description


The `totalFunds` function of every executor should include all the funds that belong to the contract:


**code/contracts/ConvexTradeExecutor.sol:L21-L23**



```
function totalFunds() public view override returns (uint256, uint256) {
    return ConvexPositionHandler.positionInWantToken();
}

```
The `ConvexTradeExecutor` uses this function for calculations:


**code/contracts/ConvexExecutor/ConvexPositionHandler.sol:L121-L137**



```
function positionInWantToken()
    public
    view
    override
    returns (uint256, uint256)
{
    (
        uint256 stakedLpBalanceInETH,
        uint256 lpBalanceInETH,
        uint256 ethBalance
    ) = \_getTotalBalancesInETH(true);

    return (
        stakedLpBalanceInETH + lpBalanceInETH + ethBalance,
        block.number
    );
}

```
**code/contracts/ConvexExecutor/ConvexPositionHandler.sol:L337-L365**



```
function \_getTotalBalancesInETH(bool useVirtualPrice)
    internal
    view
    returns (
        uint256 stakedLpBalance,
        uint256 lpTokenBalance,
        uint256 ethBalance
    )
{
    uint256 stakedLpBalanceRaw = baseRewardPool.balanceOf(address(this));
    uint256 lpTokenBalanceRaw = lpToken.balanceOf(address(this));

    uint256 totalLpBalance = stakedLpBalanceRaw + lpTokenBalanceRaw;

    // Here, in order to prevent price manipulation attacks via curve pools,
    // When getting total position value -> its calculated based on virtual price
    // During withdrawal -> calc\_withdraw\_one\_coin() is used to get an actual estimate of ETH received if we were to remove liquidity
    // The following checks account for this
    uint256 totalLpBalanceInETH = useVirtualPrice
        ? \_lpTokenValueInETHFromVirtualPrice(totalLpBalance)
        : \_lpTokenValueInETH(totalLpBalance);

    lpTokenBalance = useVirtualPrice
        ? \_lpTokenValueInETHFromVirtualPrice(lpTokenBalanceRaw)
        : \_lpTokenValueInETH(lpTokenBalanceRaw);

    stakedLpBalance = totalLpBalanceInETH - lpTokenBalance;
    ethBalance = address(this).balance;
}

```
This function includes ETH balance, LP balance, and staked balance. But WETH balance is not included here.
WETH tokens are initially transferred to the contract, and before the withdrawal, the contract also stores WETH.


#### Recommendation


Include WETH balance into the `totalFunds`.
