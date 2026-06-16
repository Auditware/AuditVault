---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/lending
  - sector/options
  - sector/staking
  - sector/token
protocol: "[[Tapioca DAO]]"
auditors:
  - "[[carrotsmuggler]]"
report: "https://code4rena.com/reports/2024-02-tapioca"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[account-ownership]]"
  - "[[vote-delegation-loop]]"
---
# [H-02] Missing check on helper contract allows arbitrary actions and theft of assets

- id: 32313
- impact: HIGH
- protocol: [[Tapioca DAO]]
- reporter: carrotsmuggler (Code4rena)
- source: https://code4rena.com/reports/2024-02-tapioca

## Summary


The `MagnetarOptionModule` contract has a function called `exitPositionAndRemoveCollateral` which allows users to do a series of operations. However, there is a bug where a variable called `data.externalData` is not properly checked against a whitelist. This means that a malicious user could pass in a fake contract address and execute arbitrary actions on any user's account. This could lead to theft of funds or borrowing of tokens without permission. The recommended solution is to check the `marketHelper` contract against a whitelist to prevent this exploit. This issue is considered high severity and has not been fixed yet. 

## Details


The `MagnetarOptionModule` contract implements the `exitPositionAndRemoveCollateral` function which allows users to do a series of operations which is irrelevant to the issue. The user passes in the variable `data`, and later, `data.externalData` is used to extract out relevant contract addresses. These are then checked against a whitelist.

```solidity
if (data.externalData.bigBang != address(0)) {
    if (!cluster.isWhitelisted(0, data.externalData.bigBang)) {
        revert Magnetar_TargetNotWhitelisted(data.externalData.bigBang);
    }
}
if (data.externalData.singularity != address(0)) {
    if (!cluster.isWhitelisted(0, data.externalData.singularity)) {
        revert Magnetar_TargetNotWhitelisted(data.externalData.singularity);
    }
}
```

The main issue is that the `data.externalData` also has a `marketHelper` field which is not checked against a whitelist and ends up being used.

```solidity
(Module[] memory modules, bytes[] memory calls) = IMarketHelper(data.externalData.marketHelper).repay(
    address(this), data.user, false, data.removeAndRepayData.repayAmount
);
(bool[] memory successes, bytes[] memory results) = bigBang_.execute(modules, calls, true);
```

The helper contracts are used to construct the calldata for market operations. In the above snippet, the helper contract is passed in some data, and it is expected to create a calldata out of the passed in data. The expected output is the repay module and a `call` value which when executed, will repay for the `data.user`'s account.

However, since the `marketHelper` contract is never checked against a whitelist, malicious user can pass in any address in that place. So the above call can return any data payload, and the `bigBang_.execute` will execute it without any checks. This means the malicious helper contract can return a `borrow` payload of some random user, and the contract will end up borrowing USDO against that user's position. The Magnetar contract is assumed to have approval for market operations, and thus the Magnetar's approval is essentially exploited by the attacker to perform arbitrary actions on any user's account.

This can be used by any user to steal collateral from other user's bigbang position, or borrow out usdo tokens on their position. Since this is direct theft, this is a high severity issue.

### Proof of Concept

The absence of checks is evident from the code snippet. Assuming `marketHelper` contract is malicious, we see that is used in 2 places to create payloads, which must also be deemed malicious.

```solidity
(Module[] memory modules, bytes[] memory calls) = IMarketHelper(data.externalData.marketHelper).repay(
    address(this), data.user, false, data.removeAndRepayData.repayAmount
);
```

```solidity
(Module[] memory modules, bytes[] memory calls) = IMarketHelper(data.externalData.marketHelper)
    .removeCollateral(data.user, removeCollateralTo, collateralShare);
```

These are then executed, and the Magnetar is assumed to have approvals from users, so these are obviously malicious interactions.

In the other module contracts, the `marketHelper` is checked against a whitelist, but not in this module. This is a clear oversight. Below is the example from the `MagnetarMintCommonModule`:

```solidity
if (!cluster.isWhitelisted(0, marketHelper)) {
    revert Magnetar_TargetNotWhitelisted(marketHelper);
}
```

### Recommended Mitigation Steps

Check the helper contract against a whitelist.

**[cryptotechmaker (Tapioca) disagreed with severity and commented](https://github.com/code-423n4/2024-02-tapioca-findings/issues/179#issuecomment-2009630642):**
 > Low/Invalid; even if the market helper is not checked (and I agree it's ok to add that verification) the module which is going to be executed is checked on the BB/SGL side and the action that's being performed also checks the allowances

**[ladboy233 (warden) commented](https://github.com/code-423n4/2024-02-tapioca-findings/issues/179#issuecomment-2046304018):**
> I think the severity is not inflated and the severity is high and the issue clearly leads to theft of fund.
> 
> 1. Magnatar is a like a router contract and help user compose multicall.
> 2. User calls magnetar function -> [delegate calls Option Module](https://github.com/Tapioca-DAO/tapioca-periph/blob/032396f701be935b04a7e5cf3cb40a0136259dbc/contracts/Magnetar/Magnetar.sol#L143).
> 
> ```solidity
>  /// @dev Modules will not return result data.
>             if (_action.id == MagnetarAction.OptionModule) {
>                 _executeModule(MagnetarModule.OptionModule, _action.call);
>                 continue; // skip the rest of the loop
>             }
> ```
> 
> 3. User needs to give a lot of approve for magnetar contract to allow magnetar contract pull fund out of user's account to complete transaction.
> 
> 4. To prevent abuse of allowance, this check is [made in-place](https://github.com/Tapioca-DAO/tapioca-periph/blob/032396f701be935b04a7e5cf3cb40a0136259dbc/contracts/Magnetar/modules/MagnetarOptionModule.sol#L60).
> 
> ```solidity
>    function exitPositionAndRemoveCollateral(ExitPositionAndRemoveCollateralData memory data) public payable {
>         // Check sender
>         _checkSender(data.user);
> ```
> 
> Which calls:
> 
> ```solidity
>  function _checkSender(address _from) internal view {
>         if (_from != msg.sender && !cluster.isWhitelisted(0, msg.sender)) {
>             revert Magnetar_NotAuthorized(msg.sender, _from);
>         }
>     }
> ```
> 
> The from `!= msg.sender` is super important, otherwise.
> 
> If user A gives allowance to magnetar contract, user B can set `data.user` to user A and steal fund from user A directly.
> 
> 5. Lack of validation of market helper allows malicious actor executes arbitrary multicall. See [here](https://github.com/Tapioca-DAO/tapioca-periph/blob/032396f701be935b04a7e5cf3cb40a0136259dbc/contracts/Magnetar/modules/MagnetarOptionModule.sol#L173).
> 
> ```solidity
>  (Module[] memory modules, bytes[] memory calls) = IMarketHelper(data.externalData.marketHelper).repay(
>                 address(this), data.user, false, data.removeAndRepayData.repayAmount
>             );
>             (bool[] memory successes, bytes[] memory results) = bigBang_.execute(modules, calls, true);
> ```
> 
> As for sponsor comments:
> 
> > The module which is going to be executed is checked on the BB/SGL side and the action that's being performed also checks the allowances.
> 
> This is the code in BBCollateral module:
> 
> `bigBang_.execute` multicall to `bigBang` module and one of the module is BBCollateral module:
> 
> ```
>    function removeCollateral(address from, address to, uint256 share)
>         external
>         optionNotPaused(PauseType.RemoveCollateral)
>         solvent(from, false)
>         notSelf(to)
>         allowedBorrow(from, share)
>     {
>         _removeCollateral(from, to, share);
>     }
> ```
> 
> The validation that sponsor mentions is in the modifier:
> 
> ```solidity
>  allowedBorrow(from, share)
> ```
> 
> Which calls:
> 
> ```solidity
>   function _allowedBorrow(address from, uint256 share) internal virtual override {
>         if (from != msg.sender) {
>             // TODO review risk of using this
>             (uint256 pearlmitAllowed,) = penrose.pearlmit().allowance(from, msg.sender, address(yieldBox), collateralId);
>             require(allowanceBorrow[from][msg.sender] >= share || pearlmitAllowed >= share, "Market: not approved");
>             if (allowanceBorrow[from][msg.sender] != type(uint256).max) {
>                 allowanceBorrow[from][msg.sender] -= share;
>             }
>         }
>     }
> ```
> 
> Obviously "from" is not `msg.sender`, but `msg.sender` is the magnetar contract that hold user's allowance.
> 
> 6. Protocol fix the lack of market helper validation in the other part of the codebase, see [here](https://github.com/Tapioca-DAO/TapiocaZ/pull/180/files). The exact same issue should be fixed in Option module as well.
> 
> 7. Other way to abuse pending allowance is marked as high severity [here](https://github.com/code-423n4/2024-02-tapioca-findings/issues/100).
> 
> 8. Abuse this issue is not fixed [here](https://hacken.io/discover/sushi-hack-explained/).
> 
> This type of exploit can occur:
> 
> 1. User approves spending allowance to sushi router.
> 2. Funds sit idle in users wallet.
> 3. Attacker triggers `transferFrom` from victim address to hacker address -> exploit.
> 
> In this case:
> 
> 1. User approves spending allowance to magnetar.
> 2. Funds sit idle in users wallet.
> 3. Attacker bypasses the `_checkSender` and constructs multicall to remove collateral from user's account directly.

**[carrotsmuggler (warden) commented](https://github.com/code-423n4/2024-02-tapioca-findings/issues/179#issuecomment-2047008870):**
 > This should be valid. According to the sponsor, `even if the market helper is not checked the module which is going to be executed is checked on the BB/SGL side`. 
> 
> This is true. However the bigbang/sgl markets do the check on `msg.sender`, which is the magnetar contract itself, which is expected to have allowance from the users. Checks are not done on the initiator of this transaction. This is highlighted [here](https://github.com/Tapioca-DAO/Tapioca-bar/blob/b1a30b07ec1fd2626a0256f0393edac1e5055ebd/contracts/markets/Market.sol#L419-L430) and below.
> 
> ```solidity
> function _allowedBorrow(address from, uint256 share) internal virtual override {
>         if (from != msg.sender) {
>             if (share == 0) revert AllowanceNotValid();
> 
>             // TODO review risk of using this
>             (uint256 pearlmitAllowed,) = penrose.pearlmit().allowance(from, msg.sender, address(yieldBox), collateralId);
>             require(allowanceBorrow[from][msg.sender] >= share || pearlmitAllowed >= share, "Market: not approved");
>             if (allowanceBorrow[from][msg.sender] != type(uint256).max) {
>                 allowanceBorrow[from][msg.sender] -= share;
>             }
>         }
>     }
> ```
> 
> Magnetar is a privileged contract, and this function allows other users to abuse this privilege. This is basically approval hijacking, and so is high severity.

**[0xRektora (Tapioca) commented](https://github.com/code-423n4/2024-02-tapioca-findings/issues/179#issuecomment-2051922427):**
 > @LSDan, this can be approved as a high risk.
> 
> While we switched the model to use "atomic" approvals using Pearlmit, it's better to be safe than sorry. The reviewed code also still has an obsolete `allowanceBorrow` which could help initiate this attack.

**[0xWeiss (Tapioca) confirmed](https://github.com/code-423n4/2024-02-tapioca-findings/issues/179#issuecomment-2125586073)**

***
