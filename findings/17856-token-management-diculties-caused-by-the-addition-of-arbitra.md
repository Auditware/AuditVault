---
tags:
  - lang/solidity
  - sector/token
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - impact/mev/frontrun
  - precondition/specific-token-type
  - fix/use-reentrancy-guard
protocol: "[[DeGate]]"
auditors:
  - "[[Shaun Mirani]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/DeGate.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[frontrun]]"
  - "[[specific-token-type]]"
  - "[[use-reentrancy-guard]]"
  - "[[frontrun-exposure]]"
  - "[[reentrancy-guard]]"
---
# Token management di�culties caused by the addition of arbitrary tokens

- id: 17856
- impact: HIGH
- protocol: [[DeGate]]
- reporter: Shaun Mirani (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/DeGate.pdf

## Summary


A bug has been identified in the ExchangeV3.sol, ExchangeDeposits.sol, and DefaultDepositContract.sol contracts. This bug can cause transfers and balance-change operations involving certain tokens to unexpectedly fail. This is because when a new token is added, the owner of the contract must carefully monitor it and enable a special check with the setCheckBalance function. However, since any user can add any token at any time, it is virtually impossible for the owner to verify which tokens require this check. 

To exploit this bug, Alice could make a deposit of a new deflationary token, the balance of which must be carefully checked. Unless the owner of the contract is able to front-run Alice's transaction to enable checkBalance, her deposit will be processed without the balance check, leading to unexpected behavior.

To address this bug, users should be aware of the limitation or consider disallowing the addition of arbitrary tokens. Additionally, the Token Integration Checklist should be reviewed before deciding which tokens should be added to the protocol.

## Details

## Security Assessment Report

## Difficulty: High

## Type: Configuration

## Target
- `ExchangeV3.sol`
- `ExchangeDeposits.sol`
- `DefaultDepositContract.sol`

## Description
Transfers and balance-change operations involving certain tokens require special verification; if the owner of a contract does not carefully monitor the contract when one such token is added, those operations can unexpectedly fail.

Any user can register a new token explicitly, by using the `registerToken` function (figure 4.1), or implicitly, by making a deposit to a new token address (figure 4.2).

### Function: `registerToken`
```solidity
function registerToken(
    address tokenAddress
) external override nonReentrant returns (uint32) {
}
```
Return state: `registerToken(tokenAddress);`

#### Figure 4.1: The `registerToken` function in `ExchangeV3`

### Function: `deposit`
```solidity
function deposit(
    ExchangeData.State storage S,
    address from,
    address to,
    address tokenAddress,
    uint96 amount, // can be zero
    bytes memory extraData
) internal { // inline call
    require(to != address(0), "ZERO_ADDRESS");
    // Deposits are still possible when the exchange is being shutdown, or even in withdrawal mode.
    // This is fine because the user can easily withdraw the deposited amounts again.
    // We don't want to make all deposits more expensive just to stop that from happening.
    (uint32 tokenID, bool tokenFound) = S.findTokenID(tokenAddress);
    if (!tokenFound) {
        tokenID = S.registerToken(tokenAddress);
    }
}
```

#### Figure 4.2: The `deposit` function in `ExchangeDeposits`

Additionally, some tokens perform custom transfer logic and must be subject to a special check:

### Function: `deposit`
```solidity
function deposit(
    address from,
    address token,
    uint96 amount,
    bytes calldata /*extraData*/
) external override payable onlyExchange ifNotZero(amount) returns (uint96 amountReceived) {
    uint ethToReturn = 0;
    if (isETHInternal(token)) {
        ...
    } else {
        // When checkBalance is enabled for a token we check the balance change
        // on the contract instead of counting on transferFrom to transfer exactly
        // the amount of tokens that is specified in the transferFrom call.
        // This is to support non-standard tokens which do custom transfer logic.
        bool checkBalance = needCheckBalance[token];
        uint balanceBefore = checkBalance ? ERC20(token).balanceOf(address(this)) : 0;
        token.safeTransferFromAndVerify(from, address(this), uint(amount));
        uint balanceAfter = checkBalance ? ERC20(token).balanceOf(address(this)) : amount;
        uint diff = balanceAfter.sub(balanceBefore);
        amountReceived = diff.toUint96();
        ethToReturn = msg.value;
    }
}
```

#### Figure 4.3: The `deposit` function in `DefaultDepositContract`

The owner of the deposit contract should explicitly enable this check by using the `setCheckBalance` function.

### Function: `setCheckBalance`
```solidity
function setCheckBalance(
    address token,
    bool checkBalance
) external onlyOwner {
    require(needCheckBalance[token] != checkBalance, "INVALID_VALUE");
    needCheckBalance[token] = checkBalance;
    emit CheckBalance(token, checkBalance);
}
```

#### Figure 4.4: The `setCheckBalance` function in `DefaultDepositContract`

However, since any user can add any token at any time, it is virtually impossible for an owner to verify which tokens require such a check.

## Exploit Scenario
Alice makes a deposit of a new deflationary token, the balance of which must be carefully checked. Unless the owner of the contract is able to front-run Alice's transaction to enable `checkBalance`, her deposit will be processed without that balance check, leading to unexpected behavior.

## Recommendations
- **Short Term:** Ensure that users are aware of this limitation or consider disallowing the addition of arbitrary tokens.
- **Long Term:** Review our Token Integration Checklist before deciding which tokens should be added to the protocol.
