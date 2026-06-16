---
tags:
  - lang/solidity
  - sector/lending
  - sector/staking
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/reentrancy/single-function
  - impact/loss-of-funds/locked-funds
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - fix/use-reentrancy-guard
  - trigger/reentrancy-callback
protocol: "[[Recall]]"
auditors:
  - "[[Code4rena]]"
report: "https://code4rena.com/reports/2025-02-recall"
genome:
  - "[[single-function]]"
  - "[[locked-funds]]"
  - "[[known-pattern]]"
  - "[[bridge-validator-threshold]]"
  - "[[reentrancy-guard]]"
---
# [H-06] Reentrancy in function `leave()` leads to halting of bottom up checkpoints

- id: 65093
- impact: HIGH
- protocol: 
- reporter: 
- source: https://code4rena.com/reports/2025-02-[[Recall]]

## Summary


This bug report discusses a vulnerability in the SubnetActorManagerFacet contract that could be exploited by an attacker to halt top-down checkpoints in a not-yet bootstrapped subnet. The report explains how the stake and unstake operations work in both pre-bootstrap and bootstrapped subnets, and how the vulnerability can be exploited by reentrancy. The report also outlines the steps an attacker could take to exploit this vulnerability, including using a malicious smart contract to join the subnet, stake a small amount of funds, and then call the leave() function to hijack the execution flow and transfer all funds to the GatewayManagerFacet contract. This would leave the SubnetActorManagerFacet contract with zero funds and prevent top-down checkpoints from occurring. 

## Details



<https://github.com/code-423n4/2025-02-recall/blob/ab5f90b9b0322016ecce6dd71c528a935544bec5/contracts/contracts/subnet/SubnetActorManagerFacet.sol# L269>

### Prerequisite Knowledge

**How `stake` & `unstake` operations work in a not yet bootstrapped subnet:**

1. In a pre-bootstrap subnet, when a validator joins the subnet using the function `SubnetActorManagerFacet::stake()` and then decides to add more stake by calling the function `SubnetActorManagerFacet::stake()`, the function will do the following:
2. It’ll conduct some validations like check if `msg.sender` has already joined the subnet as a validator, lock the funds he deposited in the contract by calling the function `lock()`

   
```

       function stake(uint256 amount) external payable whenNotPaused notKilled {
           ..........

       --> s.collateralSource.lock(amount);

           if (!s.bootstrapped) {
               LibStaking.depositWithConfirm(msg.sender, amount);
               LibSubnetActor.bootstrapSubnetIfNeeded();
           } else {
               LibStaking.deposit(msg.sender, amount);
           }
       }
   
```

3. It’ll check if the subnet is bootstrapped. In this case, it isn’t, so it will call the functions `depositWithConfirm()`. The function `depositWithConfirm` will do the following:

   1. It’ll call the functions `depositRequest()` and `confirmDeposit()` which will simply increase the `totalCollateral` associated with the validator then increase the `totalConfirmedCollateral` of the validator and then the validator set gets reshuffled when `increaseReshuffle()` is called by `confirmDeposit()`.
   2. Then bootstrap the subnet only if the requirements are met by calling the function `SubnetActorManagerFacet::bootstrapSubnetIfNeeded()` (there needs to be a minimum amount of active validators and a staking threshold that needs to be met before a subnet can be bootstrapped)
4. When a subnet becomes eligible for bootstrapping and the `bootstrapSubnetIfNeeded()` function is called, the funds in the `SubnetActorManagerFacet` will be transferred to the `GatewayManagerFacet` contract.

**How `stake` & `unstake` operations work in a bootstrapped subnet:**

1. When a subnet is already bootstrapped and a validator adds new stake by calling the function `SubnetActorManagerFacet::stake()`, the function will lock the funds as usual but then it will call the function `deposit()` instead of calling `depositWithConfirm()`. This is because the child bootstrapped subnet needs to be aware of that change in power before the parent confirms that power change. When the function `deposit()` is called, it will do the following:

   1. It’ll create a “deposit request” which will be stored and will later be transferred to the child bootstrapped subnet via a Top-down checkpoint.
   2. It’ll increase the total `totalCollateral` associated with the validator but it will NOT increase the `totalConfirmedCollateral` associated with the validator yet.

   
```

   /// @notice Deposit the collateral
   function deposit(address validator, uint256 amount) internal {
       SubnetActorStorage storage s = LibSubnetActorStorage.appStorage();

       s.changeSet.depositRequest(validator, amount);
       s.validatorSet.recordDeposit(validator, amount);
   }
   
```


```

   /// @notice Perform upsert operation to the deposit changes
   function depositRequest(StakingChangeLog storage changes, address validator, uint256 amount) internal {
       bytes memory payload = abi.encode(amount);

       uint64 configurationNumber = recordChange({
           changes: changes,
           validator: validator,
           op: StakingOperation.Deposit,
           payload: payload
       });

       emit NewStakingChangeRequest({
           op: StakingOperation.Deposit,
           validator: validator,
           payload: payload,
           configurationNumber: configurationNumber
       });
   }
   
```

2. When a top -> down checkpoint takes place, we’ll arrive at the child subnet which will need to confirm the deposit request made in the parent before the parent confirms the deposit. This function `LibValidatorTracking::confirmChange()`, in the child subnet gateway actor will be executed and it will simply confirm the deposit of the validator and reshuffle the list of validators (`increaseReshuffle` will be called by `confirmDeposit`):
```

    /// @notice Confirm the changes in for a finality commitment
    function confirmChange(ParentValidatorsTracker storage self, uint64 configurationNumber) internal {
        .............

        for (uint64 i = start; i <= configurationNumber; ) {
            StakingChange storage change = self.changes.getChange(i);
            address validator = change.validator;

            if (change.op == StakingOperation.SetMetadata) {
                .......
            } else if (change.op == StakingOperation.SetFederatedPower) {
                .......
            } else {
                uint256 amount = abi.decode(change.payload, (uint256));

                if (change.op == StakingOperation.Withdraw) {
                    self.validators.confirmWithdraw(validator, amount);
                } else {
               ---> self.validators.confirmDeposit(validator, amount);
                }
            }
            ............
    }
```

3. A bottom -> top checkpoint will take place, and we will arrive at the parent subnet again. The following function will be called in the parent `LibStaking::confirmChange()`. This function will then confirm the deposit in the parent after the child subnet has already confirmed it.

   
```

   /// @notice Confirm the changes in bottom up checkpoint submission, only call this in bottom up checkpoint execution.
   function confirmChange(uint64 configurationNumber) internal {
       SubnetActorStorage storage s = LibSubnetActorStorage.appStorage();
       StakingChangeLog storage changeSet = s.changeSet;

       ........................

       uint64 start = changeSet.startConfigurationNumber;
       for (uint64 i = start; i <= configurationNumber; ) {
           StakingChange storage change = changeSet.getChange(i);
           address validator = change.validator;

           .................
           } else {
               uint256 amount = abi.decode(change.payload, (uint256));
               address gateway = s.ipcGatewayAddr;

               if (change.op == StakingOperation.Withdraw) {
                   s.validatorSet.confirmWithdraw(validator, amount);
                   s.releaseQueue.addNewRelease(validator, amount);
                   IGateway(gateway).releaseStake(amount);
               } else if (change.op == StakingOperation.Deposit) {
           ------> s.validatorSet.confirmDeposit(validator, amount);
           ------> uint256 msgValue = s.collateralSource.makeAvailable(gateway, amount);
           ------> IGateway(gateway).addStake{value: msgValue}(amount);
               } else {
                   revert("Unknown staking operation");
               }
           }
           ........................
       }
   }
   
```

   It will do the following:

   1. It’ll confirm the deposit by calling `confirmDeposit()`.
   2. It’ll then call `makeAvailable()` to allow for the funds deposited by validator to be moved to the GatewayManagerFacet contract. You can think of `makeAvailable()` as of ERC20’s `increaseAllowance()` function.
   3. It’ll move the funds deposited by the validator to the gateway and call the function `addStake()`:

   
```

   /// @notice addStake - add collateral for an existing subnet
   function addStake(uint256 amount) external payable {
       if (amount == 0) {
           revert NotEnoughFunds();
       }

       // The fund flow for stake is from Validator -> SubnetActor -> Gateway.
       // Because msg.sender is actually the subnet actor, this method sends the fund from
       // the subnet actor caller the gateway.
       SubnetActorGetterFacet(msg.sender).collateralSource().lock(amount);

       (bool registered, Subnet storage subnet) = LibGateway.getSubnet(msg.sender);
       if (!registered) {
           revert NotRegisteredSubnet();
       }

       subnet.stake += amount;
   }
   
```

4. The funds now will stay in the gateway contract and then the `stake` uint256 state associated with the child subnet will be increased by the amount of funds the depositor has deposited.

### Finding description and impact

The function `SubnetActorManagerFacet::leave()` suffers from a reentrancy vulnerability which if exploited in a not-yet bootstrapped subnet, will halt top -> down checkpoints to the child subnet. Attack will be explained in great detail below:
```

    /// @notice method that allows a validator to leave the subnet.
    function leave() external nonReentrant whenNotPaused notKilled {
        ......................

        if (!s.bootstrapped) {
            // check if the validator had some initial balance and return it if not bootstrapped
            uint256 genesisBalance = s.genesisBalance[msg.sender];
            if (genesisBalance != 0) {
                delete s.genesisBalance[msg.sender];
                s.genesisCircSupply -= genesisBalance;
                LibSubnetActor.rmAddressFromBalanceKey(msg.sender);
         -----> s.collateralSource.transferFunds(payable(msg.sender), genesisBalance);
            }

            // interaction must be performed after checks and changes
            LibStaking.withdrawWithConfirm(msg.sender, amount);
            s.collateralSource.transferFunds(payable(msg.sender), amount);
            return;
        }
        LibStaking.withdraw(msg.sender, amount);
    }
```

The vulnerability exists in the highlighted line and it can be exploited if the function `collateralSource` (or its correction `supplySource`) is native ETH.

### Exploitation: Halting bottom -> top checkpoints for subnet by exploiting the reentrancy

1. Suppose we have a subnet that is not yet bootstrapped, the active validator count threshold has been met but the minimum staking threshold has yet to be met (the moment it’s met, the subnet will become bootstrapped). Suppose that currently there are currently 40 ETH staked and the minimum threshold is 50 ETH, so 10 more ETH need to be staked for the subnet to become bootstrapped.
2. The attacker, through a malicious smart contract will join the subnet by calling the function `join()` and stake amount of ETH that is quite minimal (10 gwei for ex) or stakes the minimum amount enforced by the validator gater and then deposit a very small amount of ETH like 1 wei of supply source funds using the function `preFund()`. `preFund()` will then increase the `genesisBalance` associated with the malicious smart contract address.
```

    /// @notice method to add some initial balance into a subnet that hasn't yet bootstrapped.
    /// @dev This balance is added to user addresses in genesis, and becomes part of the genesis
    /// circulating supply.
    function preFund(uint256 amount) external payable {
        if (amount == 0) {
            revert NotEnoughFunds();
        }

        if (s.bootstrapped) {
            revert SubnetAlreadyBootstrapped();
        }

        s.supplySource.lock(amount);

        if (s.genesisBalance[msg.sender] == 0) {
            s.genesisBalanceKeys.push(msg.sender);
        }

        s.genesisBalance[msg.sender] += amount;
        s.genesisCircSupply += amount;
    }
```

3. The attacker, through another wallet he owns, will join the subnet and stake a little under what it takes to get the subnet to be bootstrapped by calling the `join()` function. So if 10 ETH is left until requirement is met, the attacker will stake `~9.99999` ETH.
4. The attacker, through the malicious smart contract he used in step 2 will call the function `leave()`.
```

    /// @notice method that allows a validator to leave the subnet.
    function leave() external nonReentrant whenNotPaused notKilled {
        ......................

        if (!s.bootstrapped) {
            // check if the validator had some initial balance and return it if not bootstrapped
            uint256 genesisBalance = s.genesisBalance[msg.sender];
            if (genesisBalance != 0) {
                delete s.genesisBalance[msg.sender];
                s.genesisCircSupply -= genesisBalance;
                LibSubnetActor.rmAddressFromBalanceKey(msg.sender);
         -----> s.collateralSource.transferFunds(payable(msg.sender), genesisBalance);
            }

            // interaction must be performed after checks and changes
            LibStaking.withdrawWithConfirm(msg.sender, amount);
            s.collateralSource.transferFunds(payable(msg.sender), amount);
            return;
        }
        LibStaking.withdraw(msg.sender, amount);
    }
```


```

    /// @notice Transfers the specified amount out of our treasury to the recipient address.
    function transferFunds(
        Asset memory asset,
        address payable recipient,
        uint256 value
    ) internal returns (bool success, bytes memory ret) {
        if (asset.kind == AssetKind.Native) {
            success = sendValue(payable(recipient), value);
            return (success, EMPTY_BYTES);
        } else if (asset.kind == AssetKind.ERC20) {
            return ierc20Transfer(asset, recipient, value);
        }
    }
```


```

    function sendValue(address payable recipient, uint256 value) internal returns (bool) {
        if (address(this).balance < value) {
            revert NotEnoughBalance();
        }
        (bool success, ) = recipient.call{value: value}("");
        return success;
    }
```

5. Since the caller of the `leave()` function (malicious smart contract), has a non-zero `genesisBalance`, the `if genesisBalance != 0` code branch will be executed and the highlighted `transferFunds()` function will be executed which will attempt to transfer the funds to the caller. Since the funds (in this case, `collateralSource`) are of type native ETH, the malicious smart contract will hijack the execution flow.
6. In the hijacked execution flow, the malicious smart contract will do two things:

   1. It’ll stake the amount of ETH left required to meet the minimum threshold (which will be a small amount left, check step 2). Suppose it staked 0.000001 ETH and now the minimum threshold is met and now the subnet will be eligible for bootstrapping.
   2. The function `bootstrapSubnetIfNeeded()` will be called and then the function `registerInGateway()` will be called.

      * What the `registerInGateway()` function will do is that it will transfer all of the genesis (supply source) funds and all of the staked funds to the GatewayManagerFacet. So the SubnetActorManagerFacet contract will now have zero funds.

   
```

   function registerInGateway(uint256 collateral) internal {
       SubnetActorStorage storage s = LibSubnetActorStorage.appStorage();

       uint256 genesisCircSupply = s.genesisCircSupply;

       uint256 msgValue = 0;
       msgValue += s.supplySource.makeAvailable(s.ipcGatewayAddr, genesisCircSupply);
       msgValue += s.collateralSource.makeAvailable(s.ipcGatewayAddr, collateral);

       IGateway(s.ipcGatewayAddr).register{value: msgValue}(genesisCircSupply, collateral);
       }
   
```

   3. Since we are still in the hijacked execution flow of the `SubnetActorManagerFacet::leave()` function and since the function did not yet transfer the staked funds to the caller (malicious smart contract), and since the `SubnetActorManagerFacet` contract has zero funds now, the malicious smart contract will stake `amount` of ETH where `amount` represents the very minimal amount of ETH it staked previously in step 1, by calling the function `stake()`. This step is required to make the function `leave()` not revert when the hijacked execution flow exits and it attempts to transfer staked funds back to the malicious smart contract which is the caller of the `leave()` function. Look at the highlighted lines:

   
```

   /// @notice method that allows a validator to leave the subnet.
   function leave() external nonReentrant whenNotPaused notKilled {

       // remove bootstrap nodes added by this validator
   ---> uint256 amount = LibStaking.totalValidatorCollateral(msg.sender);
       if (amount == 0) {
           revert NotValidator(msg.sender);
       }

       ................

       if (!s.bootstrapped) {
           // check if the validator had some initial balance and return it if not bootstrapped
           uint256 genesisBalance = s.genesisBalance[msg.sender];
           if (genesisBalance != 0) {
               delete s.genesisBalance[msg.sender];
               s.genesisCircSupply -= genesisBalance;
               LibSubnetActor.rmAddressFromBalanceKey(msg.sender);
         ----> s.collateralSource.transferFunds(payable(msg.sender), genesisBalance); // <---- We're here still!
           }

           // interaction must be performed after checks and changes
     ----> LibStaking.withdrawWithConfirm(msg.sender, amount);
     ----> s.collateralSource.transferFunds(payable(msg.sender), amount);
           return;
       }
       LibStaking.withdraw(msg.sender, amount);
   }
   
```

7. The hijacked execution flow exits and the previously staked funds will be transferred back to the attacker successfully. But now there are two main invariants broken:

   1. **Invariant # 1** - Once a subnet is bootstrapped, the `SubnetActorManagerFacet` contract should NOT ever transfer funds back to the caller of `leave()` and `unstake()`. Transferring those funds back to the caller of those functions is the responsibility of the `GatewayManagerFacet` contract, refer to prerequisite knowledge section “How `stake` & `unstake` operations work in a bootstrapped subnet”.
   2. **Invariant # 2** - Confirmations of withdrawals and deposits should never occur after a subnet has been bootstrapped unless the withdrawal/deposit requests are sent down to the child subnet and are confirmed by it firstly! Here, `withdrawWithConfirm()` will be called (after hijacked exec flow exits) despite the subnet being bootstrapped at this point (bootstrapping occurred during reentrancy attack).
8. In step 4, the malicious smart contract, after subnet became bootstrapped, had deposited a minimal amount of ETH by calling the `stake()` function. So a deposit request was created and it will be included in the next Top -> Bottom checkpoint which will be sent to the child subnet.
9. In the child subnet, the checkpoint will get processed and the function `LibValidatorTracking::confirmChange()` will end up getting called and the deposit will be confirmed in the child subnet.
10. In the parent subnet, the function `submitCheckpoint()` will be called to execute the periodic bottom -> up checkpoints. The function `submitCheckpoint()` will then call the function `LibStaking::confirmChange()` which purpose would be to confirm staking & unstaking operation requests in parent subnet after they’ve been confirmed in child subnet in step 9.
11. Now in `LibStaking::confirmChange()` the parent will confirm the deposit but then it will prepare the staked funds to be transferred from the `SubnetActorManager` to be sent to the `GatewayManagerFacet` and then `GatewayManagerFacert::addStake()` will be called which will move the funds to the `GatewayManagerFacet`, but this operation will revert because the `SubnetActorManager` won’t have any funds to transfer. This situation occurred because invariant 1 in step 7 was broken. The funds which were supposed to be moved in this operation were already given back to the attacker:
```

    /// @notice Confirm the changes in bottom up checkpoint submission, only call this in bottom up checkpoint execution.
    function confirmChange(uint64 configurationNumber) internal {
        ..........................

        for (uint64 i = start; i <= configurationNumber; ) {
            ..........................

            } else {
                uint256 amount = abi.decode(change.payload, (uint256));
                address gateway = s.ipcGatewayAddr;

                if (change.op == StakingOperation.Withdraw) {
                    s.validatorSet.confirmWithdraw(validator, amount);
                    s.releaseQueue.addNewRelease(validator, amount);
                    IGateway(gateway).releaseStake(amount);
                } else if (change.op == StakingOperation.Deposit) {
            ------> s.validatorSet.confirmDeposit(validator, amount);
            ------> uint256 msgValue = s.collateralSource.makeAvailable(gateway, amount);
            ------> IGateway(gateway).addStake{value: msgValue}(amount);
                } else {
                    revert("Unknown staking operation");
                }
            }
            ..............
        }
        .................
```


```

    /// @notice addStake - add collateral for an existing subnet
    function addStake(uint256 amount) external payable {
        if (amount == 0) {
            revert NotEnoughFunds();
        }

        // The fund flow for stake is from Validator -> SubnetActor -> Gateway.
        // Because msg.sender is actually the subnet actor, this method sends the fund from
        // the subnet actor caller the gateway.
  ----> SubnetActorGetterFacet(msg.sender).collateralSource().lock(amount);

        (bool registered, Subnet storage subnet) = LibGateway.getSubnet(msg.sender);
        if (!registered) {
            revert NotRegisteredSubnet();
        }

        subnet.stake += amount;
    }
```

12. The function `submitCheckpoint()` will end up reverting as a result which should never happen unless it’s a malicious entity calling the function or as a result of a programming error. This is how bottom -> up checkpointing mechanism is halted.

There is a typo bug in the line `s.collateralSource.transferFunds(payable(msg.sender), genesisBalance);` in the function `leave()` which was reported separately. However, this bug still persists even if that bug was fixed because both `supplySource` and `collateralSource` can be native ETH making this exploitable.

This is a complex bug. I will gladly develop a working PoC for this if needed.

### Recommended mitigation steps

Proposed mitigation is as follows:
```

    if (!s.bootstrapped) {
        // check if the validator had some initial balance and return it if not bootstrapped
        uint256 genesisBalance = s.genesisBalance[msg.sender];
        if (genesisBalance != 0) {
            delete s.genesisBalance[msg.sender];
            s.genesisCircSupply -= genesisBalance;
            LibSubnetActor.rmAddressFromBalanceKey(msg.sender);
            s.collateralSource.transferFunds(payable(msg.sender), genesisBalance);
        }
    }

    uint256 amount = LibStaking.totalValidatorCollateral(msg.sender);
    if (amount == 0) {
        revert NotValidator(msg.sender);
    }

    if (!s.bootstrapped) {
       LibStaking.withdrawWithConfirm(msg.sender, amount);
       s.collateralSource.transferFunds(payable(msg.sender), amount);
    } else {
       LibStaking.withdraw(msg.sender, amount);
    }
```

---
