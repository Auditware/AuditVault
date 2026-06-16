---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
  - sector/governance
  - sector/stable
protocol: "[[Maia DAO Ecosystem]]"
auditors:
  - "[[xuwinnie]]"
report: "https://code4rena.com/reports/2023-05-maia"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
---
# [H-09] `RootBridgeAgent->CheckParamsLib#checkParams` does not check that `_dParams.token` is underlying of `_dParams.hToken`

- id: 26043
- impact: HIGH
- protocol: [[Maia DAO Ecosystem]]
- reporter: xuwinnie (Code4rena)
- source: https://code4rena.com/reports/2023-05-maia

## Summary


This bug report describes a vulnerability in the RootBridgeAgent protocol that allows malicious users to make a deposit of a high value token (e.g. hEther) and a relatively lower value token (e.g. USDC). The malicious user is able to do this by exploiting a flaw in the `checkParams` function in the `RootBridgeAgent` contract. This function only checks to see if the token is recognized by `rootport` as an underlying token by checking that the registered local token for `_dParams.token` is a non zero address. It fails to check if the registered local token for `_dParams.token` is equal to `_dParams.hToken`. 

The attack scenario begins when the malicious user calls `BranchBridgeAgent#callOutAndBridge` with the `DepositInput` (`_dParams`) containing the hToken (address of local hEther) and token (address of USDC). The `BranchPort#bridgeOut` transfers 10 USDC from the user to `BranchPort`, and the `anyCall` call is made to `RootBridgeAgent`. The `RootBridgeAgent#bridgeIn` calls `CheckParamsLib.checkParams` which verifies that `_dParams.amount(0)` is less than or equal to `_dParams.deposit` (10). It also verifies that `_dParams.hToken` (hEther) is a valid `localToken` and that `_dParams.token` (USDC) is a valid underlying token (i.e. its local token is non zero). The `RootBridgeAgent#bridgeIn` calls `RootPort#bridgeToRoot` which mints 10 global hEther to the user. As a result, with just 10 USDC, the user has been able to get 10 ether (18000USDC) worth of funds on the root chain.

The recommended mitigation steps for this vulnerability include adding a check to the `checkParams` function to verify that the registered local token for `_dParams.token` is equal to `_dParams.hToken`. Additionally, some sanity checks may be done on `DepositInput(_dParams)` in `BranchBridgeAgent`. This bug was confirmed by 0x

## Details


A malicious user would make a deposit specifying a `hToken` of a high value (say hEther), and a `depositToken` of relatively lower value (say USDC). For that user, `RootBridgeAgent` would increment their `hToken` balance by the amount of `depositTokens` they sent.

### Proof of Concept

Here is the `checkParams` function:

```solidity
function checkParams(address _localPortAddress, DepositParams memory _dParams, uint24 _fromChain)
        internal
        view
        returns (bool)
    {
        if (
            (_dParams.amount < _dParams.deposit) //Deposit can't be greater than amount.
                || (_dParams.amount > 0 && !IPort(_localPortAddress).isLocalToken(_dParams.hToken, _fromChain)) //Check local exists.
                || (_dParams.deposit > 0 && !IPort(_localPortAddress).isUnderlyingToken(_dParams.token, _fromChain)) //Check underlying exists.
        ) {
            return false;
        }
        return true;
    }
```

The function performs 3 checks:

1. The `_dParams.amount` must be less than or equal to `_dParams.deposit`.
2. If `_dParams.amount > 0`, `_dParams.hToken` must be a valid `localToken`.
3. If `_dParams.deposit > 0`, `_dParams.token` must be a valid underlying token.

The problem is that the check only requires `getLocalTokenFromUnder[_dParams.token]`!=`address(0)`, but does not check that `getLocalTokenFromUnder[_dParams.token]`==`_dParams.hToken`:

```solidity
    function isUnderlyingToken(
        address _underlyingToken,
        uint24 _fromChain
    ) external view returns (bool) {
        return
            getLocalTokenFromUnder[_underlyingToken][_fromChain] != address(0);
    }
```

The `checkParams` function is used in the `RootBridgeAgent#bridgeIn` function. This allows a user to call `BranchBridgeAgent#callOutAndBridge` with a `hToken` and `token` that are not related.

### ATTACK SCENARIO

- The current price of Ether is 1800USDC.
- `RootBridgeAgent` is deployed on Arbitrum.
- `BranchBridgeAgent` for the Ethereum mainnet has two local tokens recorded in `RootBridgeAgent`:
    - hEther (whose underlying is Ether).
    - hUSDC (whose underlying is USDC).
- Alice calls `BranchBridgeAgent#callOutAndBridge` on Ethereum with the following as `DepositInput`(`_dParams`):
    - hToken (address of local hEther).
    - token (address of USDC).
    - amount (0).
    - deposit (10).
    - `toChain` (42161).
- `BranchPort#bridgeOut` transfers 10 USDC from the user to `BranchPort`, and the `anyCall` call is made to `RootBridgeAgent`.
- `RootBridgeAgent#bridgeIn` is called, which calls `CheckParamsLib.checkParams`.
    - `checkParams` verifies that `_dParams.amount(0)` is less than or equal to `_dParams.deposit` (10).
    - Verifies that `_dParams.hToken` (hEther) is a valid `localToken`.
    - Verifies that `_dParams.token` (USDC) is a valid underlying token (i.e. its local token is non zero).
- `RootBridgeAgent#bridgeIn` calls `RootPort#bridgeToRoot` which mints 10 global hEther to the user `if (_deposit > 0) mint(_recipient, _hToken, _deposit, _fromChainId);`.
- With just 10 USDC, the user has been able to get 10 ether (18000USDC) worth of funds on the root chain.

Execution flow:
`BranchBridgeAgent#callOutAndBridge` -> `BranchBridgeAgent#_callOutAndBridge` -> `BranchBridgeAgent#_depositAndCall` -> `BranchBridgeAgent#_performCall` -> `RootBridgeAgent#anyExecute` -> `RootBridgeAgentExecutor#executeWithDeposit` -> `RootBridgeAgentExecutor#_bridgeIn` -> `RootBridgeAgent#bridgeIn`.

### Recommended Mitigation Steps

Currently, the protocol only checks to see if the token is recognized by `rootport` as an underlying token by checking that the registered local token for `_dParams.token` is a non zero address.

Instead of that, it would be more effective to check that the registered local token for `_dParams.token` is equal to `_dParams.hToken`. Some sanity checks may also be done on `DepositInput(_dParams)` in `BranchBridgeAgent`. Although, this is not necessary.

### Assessed type

Invalid Validation

**[0xBugsy (Maia) confirmed](https://github.com/code-423n4/2023-05-maia-findings/issues/687#issuecomment-1650307510)**

**[0xLightt (Maia) commented](https://github.com/code-423n4/2023-05-maia-findings/issues/687#issuecomment-1708811384):**
> Addressed [here](https://github.com/Maia-DAO/eco-c4-contest/tree/687).

***
