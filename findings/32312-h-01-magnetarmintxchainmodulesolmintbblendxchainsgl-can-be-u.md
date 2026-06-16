---
tags:
  - lang/solidity
  - sector/bridge
  - sector/governance
  - sector/lending
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Tapioca DAO]]"
auditors:
  - "[[carrotsmuggler]]"
report: "https://code4rena.com/reports/2024-02-tapioca"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
---
# [H-01] `MagnetarMintXChainModule.sol`:`mintBBLendXChainSGL` can be used to manipulate user positions by abusing whitelist privileges

- id: 32312
- impact: HIGH
- protocol: [[Tapioca DAO]]
- reporter: carrotsmuggler (Code4rena)
- source: https://code4rena.com/reports/2024-02-tapioca

## Summary


The Magnetar functions use a function called `_checkSender` to make sure that only the owner or a trusted address can perform operations on the account. However, this check can be bypassed if a malicious user is able to make a whitelisted contract call the Magnetar functions with their own payload. This can lead to the theft of tokens and manipulation of other user's accounts. The `depositYBLendSGLLockXchainTOLP` function in the `MagnetarAssetXChainModule` contract is particularly vulnerable to this attack as it extracts tokens from the user's account. This can be exploited through a complex function called `mintBBLendXChainSGL` which allows for multiple cross-chain calls. The attacker can manipulate the system by using this function to call the Magnetar contract on a different chain. This can be done by using a special struct called `DepositAndSendForLockingData` which is accepted as an input in the `depositYBLendSGLLockXchainTOLP` function. This allows the attacker to bypass user checks and manipulate other user's market positions. The recommended mitigation steps include making sure that the `data.user` in the `mintBBLendXChainSGL` function is the same as the current `data.user`, and being cautious of any other methods that can trigger cross-chain calls. A fix for this issue has been made in the code. 

## Details


The Magnetar functions use `_checkSender` function to check if the caller should be allowed to perform operations on the account. The function allows operations if the caller is the owner, or if the caller is a whitelisted trusted address.

```solidity
function _checkSender(address _from) internal view {
    if (_from != msg.sender && !cluster.isWhitelisted(0, msg.sender)) {
        revert Magnetar_NotAuthorized(msg.sender, _from);
    }
}
```

However, this means that if a malicious user is able to make a whitelisted contract call magnetar functions with their own payload, they can steal tokens and wreak havoc on other user's accounts!

The function `depositYBLendSGLLockXchainTOLP` in the `MagnetarAssetXChainModule` contract uses a similar check. This function deposits and lends into markets, for the account passed in as `data.user`. Crucially, it also extracts tokens from `data.user` for these operations. So if a malicious user was able to get this function called by a whitelisted contract and pass in a malicious `data.user`, they can cause the target user to lose tokens and manipulate their market positions. This is a high severity issue and the path to attack is demonstrated below.

### Proof of Concept

The entry point is the `MagnetarMintXChainModule` contract's `mintBBLendXChainSGL` function for the attacker. This is a special function, in the sense that this sets up the system for multiple cross chain calls. This function calls the `USDO` function which then does an lzcompose call on another chain to the Magnetar contract again. This is a complex function and the attacker can use this to manipulate the system.

The flow of control of this function is shown below:

```
  flowchart LR
      Caller --mintBBLendXChainSGL--> MA["Magnetar\n(chain A)"];
      MA -- sendPacket() --> USDOA["USDO\n(chain A)"];
      USDOA -- lzSend --> EA["Endpoint\n(chain A)"];
      EB["Endpoint\n(chain B)"] -- lzReceive (1) --> USDOB["USDO\n(chain B)"];
      USDOB -- sendCompose (2) --> EB;
      EB -- lzcompose (3) --> USDOB;
      USDOB --depositYBLendSGLLockXchainTOLP--> MB["Magnetar\n(chain B)"];
      MB --> Markets["Markets\n(chain B)"];
```

As shown in the above diagram, the caller initiates the call to the Magnetar contract. The Magnetar contract then does a cross-chain call via the `USDO` contract. It also sends along a lzcompose message which will be executed on chainB. On chainB, the `USDO` contract receives the call and initiates the lzcompose execution. Due to how the system is designed, this lzcompose message being executed by the `USDO` contract is actually a call to the Magnetar contract on chainB, specifically the `depositYBLendSGLLockXchainTOLP` function.

This can be shown by the fact that on chainA, the Magnetar encodes the lzcompose message into a struct.

```solidity
DepositAndSendForLockingData memory lendData = abi.decode(tapComposeMsg_, (DepositAndSendForLockingData));
lendData.lendAmount = data.mintData.mintAmount;
data.lendSendParams.lzParams.sendParam.composeMsg =
    TapiocaOmnichainEngineCodec.encodeToeComposeMsg(abi.encode(lendData), msgType_, msgIndex_, nextMsg_);
```

Then this same `DepositAndSendForLockingData` struct is accepted as an input on chainB `depositYBLendSGLLockXchainTOLP` function.

```solidity
function depositYBLendSGLLockXchainTOLP(DepositAndSendForLockingData memory data) public payable
```

On chainB, the `data.user` is the target of the operation. Since the caller is the `USDO` contract, which is not the `data.user` value, for this to work, the `USDO` contract must have been whitelisted by the system.

This means the malicious user can send in any `data.user` in their `data.lendSendParams.lzParams.sendParam.composeMsg` field, and the `USDO` contract will execute it on their behalf. No access checks will be performed, since the `USDO` contract is whitelisted. The target just needs to have given allowance to the Magnetar contract itself to perform market operations on their behalf. There are no checks on `DepositAndSendForLockingData.user` field in the `mintBBLendXChainSGL` function on chainA, so the malicious user can send in practically any address they want, and the whitelisted `USDO` contract will carry out the transaction.

This skips a crucial user check and manipulates other user positions; hence, it is a high severity issue.

### Recommended Mitigation Steps

The architecture of this crosschain call is quite vulnerable. Due to the whitelist, any function call that can be done via `USDO` contract is risky since it can override the Magnetar checks. The `mintBBLendXChainSGL` function on chainA should make sure the lzcompose `data.user` is the same as the current `data.user`, but this only blocks a single attack vector. `USDO` contract is crosschain compatible and allows lzcompose message, so any other methods which can be used to trigger such a cross chain call can abuse the whitelist.

**[0xRektora (Tapioca) confirmed via duplicate Issue #124](https://github.com/code-423n4/2024-02-tapioca-findings/issues/124#issuecomment-2016850994)**

**[cryptotechmaker (Tapioca) commented via duplicate Issue #124](https://github.com/code-423n4/2024-02-tapioca-findings/issues/124#issuecomment-2042730931):**
> PR [here](https://github.com/Tapioca-DAO/tapioca-periph/commit/3d38855c34bac2518bdf58e6a78b64b1c0e78438).

***
