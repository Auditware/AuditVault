---
tags:
  - lang/solidity
  - sector/algo-stable
  - sector/cdp
  - sector/governance
  - sector/lending
  - sector/nft
  - sector/nft-lending
  - sector/oracle
  - sector/uncollat-lending
  - platform/codehawks
  - has/poc
  - severity/high
  - vuln/logic/liquidation-logic
  - fix/use-reentrancy-guard
  - novelty/variant
  - misassumption/math-is-safe
  - fix/redesign-logic
protocol: "[[Unknown]]"
auditors:
  - "[[s4muraii77]]"
genome:
  - "[[liquidation-logic]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[reward-accounting]]"
  - "[[debt-accrual-update]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
---
# Any attempt to liquidate a user will fail, because StabilityPool does not hold crvUSD during operational lifecycle

- id: 57187
- impact: HIGH
- protocol: Core Contracts
- reporter: s4muraii77 (Codehawks)
- source: N/A

## Summary


The report states that there is a bug in the StabilityPool contract where any attempt to liquidate a user will fail. This is because the contract does not hold the required amount of crvUSD during its operational lifecycle. This can lead to bad debt for the protocol and break solvency invariants. The severity of this bug is considered high or critical. A suggested mitigation is to ensure that the contract holds enough crvUSD or allow it to pull funds from the reserveRTokenAddress. The report also includes a PoC that demonstrates the bug and provides instructions for setting it up. 

## Details

## Description

In `StabilityPool::liquidateBorrower` the function checks for `crvUSDToken.balanceOf(address(this))` but since the contract during is lifecycle never receives `crvUSD` any attempt to liquidate a borrower will fail with `InsufficientBalance()`.



## Vulnerable Code

`StabilityPool::liquidateBorrower`:

```Solidity
function liquidateBorrower(address userAddress) external onlyManagerOrOwner nonReentrant whenNotPaused {
        _update();
        uint256 userDebt = lendingPool.getUserDebt(userAddress);
        uint256 scaledUserDebt = WadRayMath.rayMul(userDebt, lendingPool.getNormalizedDebt());
        if (userDebt == 0) revert InvalidAmount();
@>      uint256 crvUSDBalance = crvUSDToken.balanceOf(address(this));
@>      if (crvUSDBalance < scaledUserDebt) revert InsufficientBalance();
        bool approveSuccess = crvUSDToken.approve(address(lendingPool), scaledUserDebt);
        if (!approveSuccess) revert ApprovalFailed();
        lendingPool.updateState();
        lendingPool.finalizeLiquidation(userAddress);
        emit BorrowerLiquidated(userAddress, scaledUserDebt);
}
```

Clearly shown in the code above we can see at the highlighted marks, that `StabilityPool::liquidateBorrower` will check the current balance of `crvUSD` within `StabilityPool` and revert with `InsufficientBalance()` if the `crvUSDBalance < scaledUserDebt`. The issue arising is, that during the operational lifecycle of this contract, the `StabilityPool` will never receive any `crvUSD`.
As reference, places where crvUSD enters the contract are:

1. `LendingPool::deposit`: The contract receives crvUSD and deposits it into `address reserveRTokenAddress;`
2. `LendingPool::_repay`: The contract receives crvUSD and deposits it into `address reserveRTokenAddress;`
3. `RAACNFT::mint`: Receives crvUSD and keeps it within the contract

And lastly `LendingPool::rebalanceLiquidity` which simply transfers `crvUSD` to and from the Curve Vault.

Therefore any attempt to liquidate undercollateralized users will fail with `InsufficientBalance()`.



## PoC

Since the PoC is a foundry test I have added a Makefile at the end of this report to simplify installation for your convenience. Otherwise if console commands would be prefered:

First run: `npm install --save-dev @nomicfoundation/hardhat-foundry`

Second add: `require("@nomicfoundation/hardhat-foundry");` on top of the `Hardhat.Config` file in the projects root directory.

Third run: `npx hardhat init-foundry`

And lastly, you will encounter one of the mock contracts throwing an error during compilation, this error can be circumvented by commenting out the code in entirety (`ReserveLibraryMocks.sol`).

And the test should be good to go:

`./test/invariant/foundry/stabilityPool/HandlerStabilityPool.t.sol`

```Solidity
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;
import {Test, console} from "forge-std/Test.sol";
import {StabilityPool} from "../../../../contracts/core/pools/StabilityPool/StabilityPool.sol";
import {LendingPool} from "../../../../contracts/core/pools/LendingPool/LendingPool.sol";
import {CrvUSDToken} from "../../../../contracts/mocks/core/tokens/crvUSDToken.sol";
import {RAACHousePrices} from "../../../../contracts/core/oracles/RAACHousePriceOracle.sol";
import {RAACNFT} from "../../../../contracts/core/tokens/RAACNFT.sol";
import {RToken} from "../../../../contracts/core/tokens/RToken.sol";
import {DebtToken} from "../../../../contracts/core/tokens/DebtToken.sol";
import {DEToken} from "../../../../contracts/core/tokens/DEToken.sol";
import {RAACToken} from "../../../../contracts/core/tokens/RAACToken.sol";
import {RAACMinter} from "../../../../contracts/core/minters/RAACMinter/RAACMinter.sol";

contract HandlerStabilityPool is Test {
    StabilityPool public stabilityPool;
    LendingPool public lendingPool;
    CrvUSDToken public crvusd;
    RAACHousePrices public raacHousePrices;
    RAACNFT public raacNFT;
    RToken public rToken;
    DebtToken public debtToken;
    DEToken public deToken;
    RAACToken public raacToken;
    RAACMinter public raacMinter;
    // Test Specifics
    address public owner;
    address oracle;
    address public user1;
    address public user2;
    address public user3;
    address[] public users;
    uint256 constant STARTING_TIME = 1641070800;
    uint256 public currentBlockTimestamp;
    uint256 public warptime = 7210;
    uint256 public counter = 1;
    uint256 public currentBlockNumber = 10;
    /// Shadow Variables
    struct UserBalances {
        uint256 expectedCrvUsdBalance;
        uint256 actualCrvUsdBalance;
        uint256 expectedRTokenBalance;
        uint256 actualRTokenBalance;
        uint256 expectedDETokenBalance;
        uint256 actualDETokenBalance;
        uint256 raacTokenUserExpected;
    }
    address internal user;
    mapping(address user => UserBalances) public userBalances;
    constructor() {
        vm.warp(STARTING_TIME);
        vm.roll(currentBlockNumber);
        owner = address(this);
        oracle = makeAddr("oracle");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        user3 = makeAddr("user3");
        users.push(user1);
        users.push(user2);
        users.push(user3); 
        uint256 initialPrimeRate = 0.1e27;
        raacHousePrices = new RAACHousePrices(owner);
        vm.prank(owner);
        raacHousePrices.setOracle(oracle);
        crvusd = new CrvUSDToken(owner);
        raacNFT = new RAACNFT(address(crvusd), address(raacHousePrices), owner);
        rToken = new RToken("RToken", "RToken", owner, address(crvusd));
        debtToken = new DebtToken("DebtToken", "DT", owner);
        deToken = new DEToken("DEToken", "DEToken", owner, address(rToken));
        vm.prank(owner);
        crvusd.setMinter(owner);
        vm.prank(owner);
        lendingPool = new LendingPool(
                            address(crvusd),
                            address(rToken),
                            address(debtToken),
                            address(raacNFT),
                            address(raacHousePrices),
                            initialPrimeRate
                        );
        rToken.setReservePool(address(lendingPool));
        debtToken.setReservePool(address(lendingPool));
        rToken.transferOwnership(address(lendingPool));
        debtToken.transferOwnership(address(lendingPool));
        stabilityPool = new StabilityPool(address(owner));
        deToken.setStabilityPool(address(stabilityPool));
        raacToken = new RAACToken(owner, 0, 0);
        raacMinter = new RAACMinter(address(raacToken), address(stabilityPool), address(lendingPool), owner);
        stabilityPool.initialize(address(rToken), address(deToken), address(raacToken), address(raacMinter), address(crvusd), address(lendingPool));
        vm.prank(owner);
        raacToken.setMinter(address(raacMinter));
        crvusd.mint(user1, type(uint128).max);
        crvusd.mint(user2, type(uint128).max);
        crvusd.mint(user3, type(uint128).max);
    }
	/// Ranomize actors
    modifier useActor(uint256 userId) {
        user = users[bound(userId, 0, users.length - 1)];
        vm.startPrank(user);
        _;
        vm.stopPrank();
    }
    /// Move Blocks to ensure rewards can and will be accumulated
    modifier passesTime() {
        currentBlockNumber = counter * warptime;
        counter = counter + 1;
        vm.roll(currentBlockNumber);
        _;
    }

////////////////////////////////////////////////////////////////////////////////
////////////////////////// Lending Pool Basics /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

    function deposit(uint256 userId, uint256 amount) public useActor(userId) {
        amount = bound(amount, 1, type(uint48).max);
        crvusd.approve(address(lendingPool), amount);
        lendingPool.deposit(amount);
    }
    
    function withdraw(uint256 userId, uint256 amount) public useActor(userId) {
        amount = bound(amount, 1, type(uint48).max);
        rToken.approve(address(lendingPool), amount);
        lendingPool.withdraw(amount);
    }
    ////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Stability Pool  ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

    function stabilityDeposit(uint256 userId, uint256 amount) public useActor(userId) passesTime {
        if(rToken.balanceOf(user) == 0) {
            return;
        }
        amount = bound(amount, 1, rToken.balanceOf(user));
        rToken.approve(address(stabilityPool), amount);
        stabilityPool.deposit(amount);
    }

    function stabilityWithdrawWithRewards(uint256 userId, uint256 amount) public useActor(userId) passesTime {
        if(userBalances[user].expectedDETokenBalance == 0) {
            return;
        }
        if(userBalances[user].expectedDETokenBalance < amount) {
            vm.expectRevert();
            stabilityPool.withdraw(amount);
        } else {
            amount = bound(amount, 1, userBalances[user].expectedDETokenBalance);
            stabilityPool.withdraw(amount);
        }
    }
}
```

`./test/invariant/foundry/stabilityPool/InvariantStabilityPool.t.sol`

```Solidity
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import {StdInvariant} from "forge-std/StdInvariant.sol";
import {HandlerStabilityPool} from "./HandlerStabilityPool.t.sol"; 

contract InvariantStabilityPool is StdInvariant, Test {
    HandlerStabilityPool handler;
    function setUp() public {
        handler = new HandlerStabilityPool();
        bytes4[] memory selectors = new bytes4[](4);
        selectors[0] = handler.stabilityDeposit.selector;
        selectors[1] = handler.stabilityWithdrawWithRewards.selector;
        selectors[2] = handler.deposit.selector;
        selectors[3] = handler.withdraw.selector;
        targetSelector(
            FuzzSelector({addr: address(handler), selectors: selectors})
        );
        targetContract(address(handler));
    }
    function statefulFuzz_stabilityPool() public view {
        uint256 stabilityPoolCrvBalance = handler.crvusd().balanceOf(address(handler.stabilityPool()));
        // The only assertion we need to make the point
        assertEq(stabilityPoolCrvBalance, 0);
    }
}
```

After Copy & Pasting the 2 files into suggested directory we use `forge test --mt statefulFuzz_stabilityPool` to run it, which produces the following log:

```Solidity
[PASS] statefulFuzz_stabilityPool() (runs: 256, calls: 128000, reverts: 0)
╭----------------------+------------------------------+-------+---------+----------╮
| Contract             | Selector                     | Calls | Reverts | Discards |
+==================================================================================+
| HandlerStabilityPool | deposit                      | 32111 | 0       | 0        |
|----------------------+------------------------------+-------+---------+----------|
| HandlerStabilityPool | stabilityDeposit             | 31787 | 0       | 0        |
|----------------------+------------------------------+-------+---------+----------|
| HandlerStabilityPool | stabilityWithdrawWithRewards | 32230 | 0       | 0        |
|----------------------+------------------------------+-------+---------+----------|
| HandlerStabilityPool | withdraw                     | 31872 | 0       | 0        |
╰----------------------+------------------------------+-------+---------+----------╯
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 39.28s (39.27s CPU time)
```

As we can clearly see, over a total of 128,000 total function calls in this example, the Stability Pool does not hold a single crvUSD token.

**Assumptions**:

2 assumptions within have been made to simplify the setup

1. I neglected the NFT Deposit/Borrow/Repay flow for this PoC since the only function which could effect this is `LendingPool::_repay` but the repay function uses the same destination under the hood, so the same behavior is expected.
2. The assumption has been made that it is obvious that, if there is no crvUSD within `StabilityPool` the `liquidateBorrower` function will fail, therefor proving that `StabilityPool` never holds `crvUSD` within its natural operating lifecycle is sufficient.



## Impact

Failures to liquidate users accrues bad debt for the protocol and therefor directly breaks solvency invariants. Therefore the severity is High (Critical) by default.



## Recommended Mitigation

Ensure to store sufficient `crvUSD` in the contract, or allow `StabilityPool` to pull the funds from `reserveRTokenAddress` where it seems the `crvUSD` is supposed to be stored.



## Appendix

Copy the following import into your `Hardhat.Config` file in the projects root dir:
`require("@nomicfoundation/hardhat-foundry");`

Paste the following into a new file "Makefile" into the projects root directory:

```
.PHONY: install-foundry init-foundry all

  

install-foundry:

    npm install --save-dev @nomicfoundation/hardhat-foundry

  

init-foundry: install-foundry

    npx hardhat init-foundry

  


## Default target that runs everything in sequence

all: install-foundry init-foundry
```

And run `make all`

## Artifacts

- Raw capture: /Users/user/Desktop/crawlee-run/pages_capture.har
- Pages snapshot: /Users/user/Desktop/crawlee-run/all_findings_full.json
