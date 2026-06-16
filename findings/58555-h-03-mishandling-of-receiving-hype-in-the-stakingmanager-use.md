---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/oracle
  - sector/staking
  - sector/token
  - platform/code4rena
protocol: "[[Kinetiq]]"
auditors:
  - FalseGenius
report: "https://code4rena.com/reports/2025-04-kinetiq"
genome:
  - "[[reward-accounting]]"
  - "[[logic/state-update]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-03] Mishandling of receiving HYPE in the StakingManager, user can’t confirm withdrawal and inflate the exchange ratio

- id: 58555
- impact: HIGH
- protocol: Kinetiq
- reporter: FalseGenius (Code4rena)
- source: https://code4rena.com/reports/2025-04-kinetiq

## Summary


The bug report describes an issue with the `StakingManager` in the `Kinetiq` project. The problem occurs when the `HYPE` token is withdrawn from a validator and sent to the `StakingManager`. This triggers the `stake()` function to be called and causes the `HYPE` to be staked back and inflate the exchange ratio. This happens because of the implementation of the `receive()` function in the `StakingManager`. The bug can have two impacts depending on the `targetBuffer` value. The recommended solution is to modify the `receive()` function. A proof of concept test has been provided to replicate the issue. The team behind `Kinetiq` has acknowledged the bug.

## Details



<https://github.com/code-423n4/2025-04-kinetiq/blob/7f29c917c09341672e73be2f7917edf920ea2adb/src/StakingManager.sol# L208-L211>

### Finding description and impact

Mishandling of receiving `HYPE` in the `StakingManager` , user can’t confirm withdrawal and inflate the exchange ratio.

Based on the [Hyperliquid docs](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/hypercore-less-than-greater-than-hyperevm-transfers# transferring-hype) :

> HYPE is a special case as the native gas token on the HyperEVM. HYPE is received on the EVM side of a transfer as the native gas token instead of an ERC20 token

The problem arises when `HYPE` withdrawn from a validator on Hypercore is sent to the `StakingManager` (e.g. use call / transfer). It will immediately trigger the `stake()` function to be called and cause the `HYPE` that should have been sent to the user who made the withdrawal to be staked back and inflate the exchange ratio. This happened because of the implementation of `receive()` on the `StakingManager`:
```

receive() external payable {
        // Simply call the stake function
        stake();
    }
```

The first impact can occur if `targetBuffer = 0`, but there is another impact if `targetBuffer != 0` and fully fulfill.

If the buffer is applied, the user who initiated the withdrawal can still confirm the withdrawal but there is another effect that arises, the `HYPE` resulting from the withdrawal is still staked and inflates the exchange ratio for `HYPE` and `KHYPE` because `KHYPE` will be minted to the system address (Core) and the `totalSupply` will increase. The amount of `KHYPE` minted to system address will be locked forever.

Note: This issue could also happen if reward from delegating to validator is sent directly to `StakingManager`.

### Recommended Mitigation Steps

Modify the `receive()` function
```

receive() external payable {
        // Simply call the stake function
        if (msg.sender != systemAddress) {
        stake();
        }
    }
```

### Proof of Concept
```

The schema for the test :
1. Will use targetBuffer = 0  for simplicity
2. User stake 1 HYPE
3. Operator execute L1 deposit operations
4. User queue withdrawal, 1 KHYPE
5. Operator execute L1 withdrawal operations
6. System address (Core) call / transfer HYPE to staking manager and auto staked
7. User can't confirm withdrawal because lack of HYPE balance on the staking manager
```

Add test to `StakingManager.t.sol` and run `forge test --match-test test_misshandlingOfReceivingHYPE -vvv`
```

 function test_misshandlingOfReceivingHYPE() public {

        // Set actor
        address systemAddressForHYPE = makeAddr("systemAddressForHYPE");

        // Set staking amount
        uint256 stakeAmount = 1 ether;

        // fund the system for mocking withdrawal process and the user
        vm.deal(systemAddressForHYPE, 1 ether);
        vm.deal(user, 1 ether);

        // Set up delegation first
        vm.startPrank(manager);
        validatorManager.activateValidator(validator);
        validatorManager.setDelegation(address(stakingManager), validator);
        vm.stopPrank();

        console.log("");
        console.log(" START TEST ... ");
        console.log("");

        // check stakingManager balance
        uint256 initialStakingManagerBalance = address(stakingManager).balance;
        console.log("Staking Manager Initial HYPE Balance:", initialStakingManagerBalance);

        console.log("");
        console.log(" USER STAKE ... ");
        console.log("");

        // User stake
        vm.prank(user);
        stakingManager.stake{value: stakeAmount}();

        uint256 stakingManagerBalanceAfterUserDeposit = address(stakingManager).balance;
        console.log("\\ This value will be zero because HYPE will directly send to system address on core");
        console.log("Staking Manager HYPE Balance After User Deposit:", stakingManagerBalanceAfterUserDeposit);

        console.log("");
        console.log(" OPERATOR EXECUTE L1 DEPOSIT OPERATION ... ");
        console.log("");

        // operator execute L1 operations : delegate HYPE to validator
        vm.prank(operator);
        stakingManager.processL1Operations(0);

        console.log(" USER QUEUE WITHDRAWAL ... ");
        console.log("");

        // User withdraw
        vm.startPrank(user);
        kHYPE.approve(address(stakingManager), stakeAmount);
        stakingManager.queueWithdrawal(stakeAmount);
        vm.stopPrank();

        console.log(" OPERATOR EXECUTE L1 WITHDRAWAL OPERATION ... ");
        console.log("");

        // operator execute L1 operations : undelegated HYPE from validator
        vm.prank(operator);
        stakingManager.processL1Operations(0);

        console.log(" WITHDRAWAL HYPE FROM CORE SEND TO STAKINGMANAGER ... ");
        console.log("");

        // systemAddress send back undelegated HYPE from validator to stakingManager
        vm.prank(systemAddressForHYPE);
        address(stakingManager).call{value : stakeAmount}("");

        uint256 stakingManagerBalanceAfterHYPESentFromCore = address(stakingManager).balance;
        console.log("\\ This value will be zero, HYPE will directly stacked again because receive() initiate stake() function");
        console.log("Staking Manager HYPE Balance After HYPE Sent From Core :", stakingManagerBalanceAfterHYPESentFromCore);

        // warp 7 days
        vm.warp(block.timestamp + 7 days);

        // User want to confirm withdrawal failed because lack of HYPE on stakingManager
        vm.prank(user);
        vm.expectRevert();
        stakingManager.confirmWithdrawal(0);
    }
```

Result:
```

[PASS] test_misshandlingOfReceivingHYPE() (gas: 897229)
Logs:
  Starting setUp
  Minimal implementation deployed at: 0x2e234DAe75C793f67A35089C9d99245E1C58470b
  Deploying proxies...
  PauserRegistry proxy deployed at: 0xF62849F9A0B5Bf2913b396098F7c7019b51A820a
  PauserRegistry admin at: 0x4f81992FCe2E1846dD528eC0102e6eE1f61ed3e2
  StakingManager proxy deployed at: 0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9
  StakingManager admin at: 0x5B0091f49210e7B2A57B03dfE1AB9D08289d9294
  KHYPE proxy deployed at: 0xc7183455a4C133Ae270771860664b6B7ec320bB1
  KHYPE admin at: 0xa38D17ef017A314cCD72b8F199C0e108EF7Ca04c
  ValidatorManager proxy deployed at: 0xa0Cb889707d426A7A386870A03bc70d1b0697598
  ValidatorManager admin at: 0x83B4EEa426B7328eB3bE89cDb558F18BAF6A2Bf7
  OracleManager proxy deployed at: 0x1d1499e622D69689cdf9004d05Ec547d650Ff211
  OracleManager admin at: 0x45C92C2Cd0dF7B2d705EF12CfF77Cb0Bc557Ed22
  StakingAccountant proxy deployed at: 0xA4AD4f68d0b91CFD19687c881e50f3A00242828c
  StakingAccountant admin at: 0xeafCcCE3F73a1ac8690F49acF56C4142183619dd
  Started admin prank
  Creating pausable contracts array
  Setup completed

   START TEST ...

  Staking Manager Initial HYPE Balance: 0

   USER STAKE ...

  \ This value will be zero because HYPE will directly send to system address on core
  Staking Manager HYPE Balance After User Deposit: 0

   OPERATOR EXECUTE L1 DEPOSIT OPERATION ...

   USER QUEUE WITHDRAWAL ...

   OPERATOR EXECUTE L1 WITHDRAWAL OPERATION ...

   WITHDRAWAL HYPE FROM CORE SEND TO STAKINGMANAGER ...

  \ This value will be zero, HYPE will directly stacked again because receive() initiate stake() function
  Staking Manager HYPE Balance After HYPE Sent From Core : 0

Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 8.41ms (1.93ms CPU time)
```

**Kinetiq acknowledged**

---


