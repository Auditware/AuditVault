---
tags:
  - lang/solidity
  - sector/bridge
  - sector/token
  - platform/halborn
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Chiliz]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/chiliz/bridge-updates-smart-contract-security-assessment"
genome:
  - "[[fee-calculation]]"
  - "[[direct-drain]]"
  - "[[bridge-message-validation]]"
---
# LACK OF REFUND MECHANISM FOR OVERPAYMENT

- id: 50982
- impact: HIGH
- protocol: Bridge Updates
- reporter: Halborn
- source: https://www.halborn.com/audits/chiliz/bridge-updates-smart-contract-security-assessment

## Summary


The `ERC20Handler` contract does not have a mechanism to refund users who accidentally send more tokens than required. This can result in a loss of funds for the user and may also make the contract vulnerable to attacks. The code location of the issue is in the `deposit` function of `Bridge.sol` and the impact and likelihood of the issue are rated as 5 and 3 respectively. The Chiliz team has solved the issue by adding a refund mechanism in the related handler, with the commit ID being 369bb8ba9926ad704e8aebd2692f03d9f343021e.

## Details

##### Description

`ERC20Handler` contract handles `ERC20` deposits and deposit executions. In the given code, the deposit function allows users to deposit native tokens, but it does not include any mechanism for refunding the user if they accidentally send more tokens than required when interacting with `ERC20Handler`. If a user accidentally sends more native tokens than required, they will lose their excess funds without any way to recover them. This can lead to user dissatisfaction and a loss of trust in the contract. Additionally, the contract may be at risk of attack from users who deliberately attempt to overpay in order to steal the excess funds.

Code Location
-------
---
---

[Bridge.sol#L308](https://gitlab.mediarex.com/mediarex/blockchain/bridge-contracts/-/blob/094856fd48bb4627842c72e914df09fe9689ad81/contracts/Bridge.sol#L308)

```
    function deposit(uint8 destinationChainID, bytes32 resourceID, bytes calldata data) external payable whenNotPaused {
        require(msg.value >= _fee, "invalid value");

        address handler = _resourceIDToHandlerAddress[resourceID];
        require(handler != address(0), "resourceID not mapped to handler");

        uint64 depositNonce = ++_depositCounts[destinationChainID];
        _depositRecords[depositNonce][destinationChainID] = data;

        IDepositExecute depositHandler = IDepositExecute(handler);
        if (msg.value > 0) {
            uint256 valueToSend = msg.value - _fee;
            if (valueToSend > 0) {
                payable(handler).transfer(valueToSend);    
            }
        }
        depositHandler.deposit(resourceID, destinationChainID, depositNonce, msg.sender, data);

        emit Deposit(destinationChainID, resourceID, depositNonce);
    }


```

```
   function testRefund() public {
        bytes memory test = "";
        bytes32 tokenResource = keccak256(abi.encodePacked("ERC20"));
        bridge.deposit{value: 5e2}(111, tokenResource, test);
   }

```

##### Score

Impact: 5  
Likelihood: 3

##### Recommendation

**SOLVED**: The `Chiliz team` solved the issue by adding a refund mechanism in the related handler.

`Commit ID:` [369bb8ba9926ad704e8aebd2692f03d9f343021e](https://gitlab.mediarex.com/mediarex/blockchain/bridge-contracts/-/commit/369bb8ba9926ad704e8aebd2692f03d9f343021e)
