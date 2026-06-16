---
tags:
  - lang/solidity
  - sector/bridge
  - platform/cantina
  - has/poc
  - severity/high
  - vuln/dependency/unchecked-return-value
  - vuln/dos/unbounded-loop
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - fix/add-check
protocol: "[[Coinbase]]"
auditors:
  - "[[Zach Obront]]"
report: "https://cdn.cantina.xyz/reports/cantina_coinbase_july2023.pdf"
genome:
  - "[[unchecked-return-value]]"
  - "[[unbounded-loop]]"
  - "[[known-pattern]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
  - "[[extcall-return-validation]]"
---
# Vault 's totalProcessed count can be inaccurately increased by any user 

- id: 54655
- impact: HIGH
- protocol: [[Coinbase]]
- reporter: Zach Obront (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_coinbase_july2023.pdf

## Summary


This bug report discusses an issue with the `withdraw()` function in the `FeeVault.sol` contract. The function is used by three different fee vaults and is responsible for sending funds to a designated recipient. However, there is a problem with the code that allows a malicious user to exploit it and prevent the funds from being sent while still incrementing the `totalProcessed` variable. This is due to the fact that the function does not check the return value of the `SafeCall.send()` function, which can fail if it runs out of gas. The report suggests adding a check for the return value to prevent this issue from occurring.

## Details

## FeeVault Withdrawal Function Analysis

## Context
- **FeeVault.sol**: Lines 105-106
- **SafeCall.sol**: Lines 12-30

## Description
Each of the 3 fee vaults inherits the `withdraw()` function from `FeeVault.sol`:

```solidity
function withdraw() external {
    require(
        address(this).balance >= MIN_WITHDRAWAL_AMOUNT,
        "FeeVault: withdrawal amount must be greater than minimum withdrawal amount"
    );
    uint256 value = address(this).balance;
    totalProcessed += value;
    emit Withdrawal(value, RECIPIENT, msg.sender);
    emit Withdrawal(value, RECIPIENT, msg.sender, WITHDRAWAL_NETWORK);
    if (WITHDRAWAL_NETWORK == WithdrawalNetwork.L2) {
        SafeCall.send(RECIPIENT, gasleft(), value);
    } else {
        L2StandardBridge(payable(Predeploys.L2_STANDARD_BRIDGE)).bridgeETHTo{ value: value }(
            RECIPIENT,
            WITHDRAWAL_MIN_GAS,
            bytes("")
        );
    }
}
```

In the event that this function does not revert, `totalProcessed` is incremented by the total balance of the contract, under the assumption that these funds are processed and sent out to `RECIPIENT`. However, this is not necessarily the case.

### L2 Withdrawal Network
If `WITHDRAWAL_NETWORK == L2`, we send the funds using `SafeCall.send()`. As per the SafeCall library, this function does not revert if the transaction does not succeed. Instead, it returns `false`.

```solidity
function send(
    address _target,
    uint256 _gas,
    uint256 _value
) internal returns (bool) {
    bool _success;
    assembly {
        _success := call(
            _gas, // gas
            _target, // recipient
            _value, // ether value
            0, // inloc
            0, // inlen
            0, // outloc
            0 // outlen
        )
    }
    return _success;
}
```

Since this return value is not checked, the `withdraw()` function will not revert if the `send()` runs out of gas. This is a problem in a permissionless function, as it allows a malicious user to send a specific amount of gas to ensure it runs out mid-call. Consequently, `totalProcessed` is incremented, and the `Withdrawal` event is emitted, but no funds are sent.

## Proof of Concept
The following test deploys a mock Receiver (which implements the `receive()` function from `FeeDisburser.sol`, to correctly estimate gas), as well as a `BaseFeeVault`. The test demonstrates that when the amount of gas passed is set to a specific value, `totalProcessed` increases by the full balance of the contract, while the funds are not transferred:

```solidity
contract FeeVaultTest is Test {
    BaseFeeVault feeVault;
    Receiver recipient;
    
    function setUp() public {
        recipient = new Receiver();
        feeVault = new BaseFeeVault(address(recipient), 2 ether, FeeVault.WithdrawalNetwork.L2);
        recipient.setVaults(address(1), address(feeVault), address(2));
    }
    
    function testZach__FeeVaultOutOfGasAttack() public {
        vm.deal(address(feeVault), 10 ether);
        console.log("Starting Total Processed: ", feeVault.totalProcessed());
        console.log("Starting Vault Balance: ", address(feeVault).balance);
        console.log("Starting Recipient Balance: ", address(recipient).balance);
        feeVault.withdraw{gas: 55_000}();
        console.log("********");
        console.log("Ending Total Processed: ", feeVault.totalProcessed());
        console.log("Ending Vault Balance: ", address(feeVault).balance);
        console.log("Ending Recipient Balance: ", address(recipient).balance);
    }
}
```

### Logs
```
Starting Total Processed: 0
Starting Vault Balance: 10000000000000000000
Starting Recipient Balance: 0
********
Ending Total Processed: 10000000000000000000
Ending Vault Balance: 10000000000000000000
Ending Recipient Balance: 0
```

## Recommendation
Consider applying the following change:

```solidity
if (WITHDRAWAL_NETWORK == WithdrawalNetwork.L2) {
    bool success = SafeCall.send(RECIPIENT, gasleft(), value);
    require(success);
} else {
    ...
}
```
