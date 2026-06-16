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
  - fix/use-reentrancy-guard
protocol: "[[Recall]]"
auditors:
  - "[[ahahaHard1k]]"
report: "https://code4rena.com/reports/2025-02-recall"
genome:
  - "[[frozen-funds]]"
  - "[[use-reentrancy-guard]]"
  - "[[direct-drain]]"
  - "[[reentrancy-guard]]"
---
# [H-05] Incorrect supply fund transferral in function `leave()` can be exploited to drain locked collateral source funds in subnet actor contract

- id: 65092
- impact: HIGH
- protocol: [[Recall]]
- reporter: ahahaHard1k (Code4rena)
- source: https://code4rena.com/reports/2025-02-recall

## Summary


The bug report discusses an issue with the `SubnetActorManagerFacet::leave()` function in the `SubnetActorManagerFacet.sol` contract. This function incorrectly returns funds to the caller if the subnet is already bootstrapped. This can result in an attacker being able to exploit the function and walk away with a large profit. The recommended mitigation step is to change one line of code in the function to fix the issue. 

## Details



<https://github.com/code-423n4/2025-02-recall/blob/ab5f90b9b0322016ecce6dd71c528a935544bec5/contracts/contracts/subnet/SubnetActorManagerFacet.sol# L269>

### Finding description and impact

The function `SubnetActorManagerFacet::leave()` incorrectly returns genesis/supply funds to its caller if the subnet is bootstrapped. Take a look at the highlighted line:
```

    function leave() external nonReentrant whenNotPaused notKilled {
        ....................................

        // slither-disable-next-line unused-return
        s.bootstrapOwners.remove(msg.sender);
        delete s.bootstrapNodes[msg.sender];

        if (!s.bootstrapped) {
            // check if the validator had some initial balance and return it if not bootstrapped
            uint256 genesisBalance = s.genesisBalance[msg.sender];
            if (genesisBalance != 0) {
                delete s.genesisBalance[msg.sender];
                s.genesisCircSupply -= genesisBalance;
                LibSubnetActor.rmAddressFromBalanceKey(msg.sender);
        ------> s.collateralSource.transferFunds(payable(msg.sender), genesisBalance);
            }

            // interaction must be performed after checks and changes
            LibStaking.withdrawWithConfirm(msg.sender, amount);
            s.collateralSource.transferFunds(payable(msg.sender), amount);
            return;
        }
        LibStaking.withdraw(msg.sender, amount);
    }
```

If the subnet is not yet bootstrapped and the caller has already deposited supply/genesis funds through the function `SubnetActorManagerFacet::preFund()`, the function will attempt to return those funds through the call `s.collateralSource.transferFunds(payable(msg.sender), genesisBalance);` but this line is flawed because it’s trying to return collateral/staked funds instead of supply/genesis funds.

The correct way to return those funds would be through the following: `s.supplySource.transferFunds(payable(msg.sender), genesisBalance);`. This aligns with the logic of the function `SubnetActorManagerFacet::preRelease()` which returns the deposited supply funds to the caller correctly:
```

    function preRelease(uint256 amount) external nonReentrant {
        if (amount == 0) {
            revert NotEnoughFunds();
        }

        if (s.bootstrapped) {
            revert SubnetAlreadyBootstrapped();
        }

  ----> s.supplySource.transferFunds(payable(msg.sender), amount);

        if (s.genesisBalance[msg.sender] < amount) {
            revert NotEnoughBalance();
        }

        s.genesisBalance[msg.sender] -= amount;
        s.genesisCircSupply -= amount;

        if (s.genesisBalance[msg.sender] == 0) {
            LibSubnetActor.rmAddressFromBalanceKey(msg.sender);
        }
    }
```

### Exploit / PoC

1. Suppose we have a subnet that is not yet bootstrapped and suppose that it has a `supplySource` of a ERC20 token which is worth `$1` and that the `collateralSource` is native ETH which is worth `$2000`.
2. Attacker deposits 10 `supplySource` ERC20 tokens by calling the function `SubnetActorManagerFacet::preFund()` and then joins the subnet by staking a minimal amount of `collateralSource` (native ETH) by calling `SubnetActorManagerFacet::join()`.
3. Attacker calls `SubnetActorManagerFacet::leave()` to the leave the subnet. The `leave()` function will transfer to the attacker 10 ETH (`collateralSource`) instead of transferring the 10 ERC20 `supplySource` tokens he deposited, and it will give him back the minimal amount of `collateralSource` (native ETH) he staked when he joined.
4. Attacker walks away with a profit of `~$19,990`. The subnet will become unregisterable, and not everybody who has joined the subnet will be able to get his funds back because the `SubnetActorManagerFacet` won’t have enough funds.

### Recommended mitigation steps

In `leave()` simply change the line `s.collateralSource.transferFunds(payable(msg.sender), genesisBalance);` to `s.supplySource.transferFunds(payable(msg.sender), genesisBalance);`.

**Recall confirmed**

---
