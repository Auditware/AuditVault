---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/lending
  - sector/nft
  - sector/staking
protocol: "[[Tapioca DAO]]"
auditors:
  - "[[Ack]]"
report: "https://code4rena.com/reports/2023-07-tapioca"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[vote-delegation-loop]]"
---
# [H-42] Attacker can steal victim's oTAP position contents via `MagnetarMarketModule#_exitPositionAndRemoveCollateral()`

- id: 27532
- impact: HIGH
- protocol: [[Tapioca DAO]]
- reporter: Ack (Code4rena)
- source: https://code4rena.com/reports/2023-07-tapioca

## Summary


This bug report is about a vulnerability in Magnetar that can be exploited to steal twAML-locked oTAP positions. It occurs when a user grants Magnetar approval to control their oTAP positions and then someone calls `_exitPositionAndRemoveCollateral()` with their own set of target addresses. This function is complex and includes multiple "if" clauses for each task the caller would like to perform. 

The attack is as follows: the victim grants Magnetar approval, then the attacker calls `_exitPositionAndRemoveCollateral()` with `removeAndRepayData.exitData.exit = true` and `removeAndRepayData.unlockData.unlock = true` and the user to steal from. This transfers the oTAP position to Magnetar and exits the position. Then the attacker calls `_exitPositionAndRemoveCollateral()` again with `removeAndRepayData.exitData.exit = false`, `removeAndRepayData.unlockData.unlock = true`, the attacker's address for receiving the unlocked shares, and the tokenId to exit and steal. This unlocks the shares to the attacker's address. 

The impact of this vulnerability is high, as it results in the theft of funds. Unfortunately, a coded proof of concept is difficult and time consuming, as the Magnetar tests do not cover the case where someone wishes to exit their oTAP position, and the periphery testing infrastructure does not include helper functions for the oTAP workflows. 

To mitigate this vulnerability, it is recommended to not allow arbitrary address input in these complex, multi-use functions, to consider breaking this into multiple standalone functions, and to require user == msg.sender.

## Details


NOTE: This vulnerability relies on the team implementing an `onERC721Received()` function in Magnetar. As is currently written, attempts to exit oTAP positions via Magnetar will always revert as Magnetar cannot receive ERC721s, despite this being the clear intention of the function. This code path was not covered in the tests. Once implemented, however, an attack vector to steal twAML-locked oTAP positions opens.

Also, this is a similar but distinct attack vector from #933.

`MagnetarMarketModule#_exitPositionAndRemoveCollateral()` is a complex function used to perform any combination of: exiting an oTAP position, unlocking a locked tOLP position, removing assets and collateral from Singularity/bigBang, and repaying loans. The function achieves this by employing separate "if" clauses for each task that the caller would like to perform. These clauses are entered based on flags the caller provides in the argument struct `removeAndRepayData`.

Along with the set of operations to perform, the caller also provides:

*   address `user` to operate on
*   address externalData.bigBang
*   address externalData.singularity
*   address yieldbox (obtained by calling the user-provided `ISingularity(externalData.singularity).yieldBox()`)

As the caller has full control of all of these parameters, he can execute attacks to steal assets that have been approved to Magnetar.

### Impact

High - Theft of funds

### Proof of concept

Unfortunately the Magnetar tests do not cover the case where we wish to exit our oTAP position, and the periphery testing infrastructure does not include helper functions for the oTAP workflows (at least that I was able to find). This makes a coded PoC difficult and time consuming. Please consider the following walkthrough and reach out if a coded example is necessary.

In this case, we're going to assume that a victim wants to use this function as-designed to exit his twAML-locked oTAP position. In order to do so he needs to grant approval in  for Magnetar to transfer his position.

Once approved, anyone can call `_exitPositionAndRemoveCollateral()` with his own set of target addresses (some valid Tapioca addresses, some attacker-owned contracts) and the approver as `user`.

The attack is as follows:

1.  Victim approves Magnetar to control his oTAP positions
2.  Attacker first calls `_exitPositionAndRemoveCollateral()`, with:
    *   `removeAndRepayData.exitData.exit = true`
    *   `removeAndRepayData.unlockData.unlock = true`
    *   The `user` to steal from
    *   the `tokenId` to exit + steal
    *   removeAndRepayData.unlockData.target = an attacker-controlled contract that just passes when called with `.unlock()`
3.  Magnetar transfers the oTAP position to itself and exits the position. It retains the yieldbox shares at the end of the call
4.  Attacker calls `_exitPositionAndRemoveCollateral()`, with:
    *   removeAndRepayData.exitData.exit = false
    *   removeAndRepayData.unlockData.unlock = true
    *   The `user` is the attacker's address for receiving the unlocked shares
    *   the tokenId to exit + steal
    *   removeAndRepayData.unlockData.target = the real tOLP contract

(The attacker could have alternately used a similar bigBang attacker contract approach for removing the yieldbox shares in step 4 as in #933 )

<details>

```solidity
function _exitPositionAndRemoveCollateral( // @audit called via delegatecall from core MagnetarV2 w/o any agument validation 
    address user,
    ICommonData.ICommonExternalContracts calldata externalData,
    IUSDOBase.IRemoveAndRepay calldata removeAndRepayData
) private {
    IMarket bigBang = IMarket(externalData.bigBang); // @audit all 3 of these can be attacker controlled
    ISingularity singularity = ISingularity(externalData.singularity);
    IYieldBoxBase yieldBox = IYieldBoxBase(singularity.yieldBox()); 

    uint256 tOLPId = 0;
    if (removeAndRepayData.exitData.exit) { // @audit true, enter this block
        require(
            removeAndRepayData.exitData.oTAPTokenID > 0, // @audit oTAP ID we want to unlock+steal 
            "Magnetar: oTAPTokenID 0"
        );

        address oTapAddress = ITapiocaOptionsBroker(
            removeAndRepayData.exitData.target // @audit target here is attacker-controlled, but retrieve the real oTAP address
        ).oTAP();
        (, ITapiocaOptions.TapOption memory oTAPPosition) = ITapiocaOptions( // @audit get the oTAP postion we're exiting
            oTapAddress
        ).attributes(removeAndRepayData.exitData.oTAPTokenID);

        tOLPId = oTAPPosition.tOLP;

        address ownerOfTapTokenId = IERC721(oTapAddress).ownerOf(
            removeAndRepayData.exitData.oTAPTokenID
        );
        require(
            ownerOfTapTokenId == user || ownerOfTapTokenId == address(this), // @audit owner is user, passes
            "Magnetar: oTAPTokenID owner mismatch"
        );
        if (ownerOfTapTokenId == user) { // @audit true
            IERC721(oTapAddress).safeTransferFrom( // @audit transfer the token here 
                user,
                address(this),
                removeAndRepayData.exitData.oTAPTokenID,
                "0x"
            );
        }
        ITapiocaOptionsBroker(removeAndRepayData.exitData.target) // @audit address is 
            .exitPosition(removeAndRepayData.exitData.oTAPTokenID);

        if (!removeAndRepayData.unlockData.unlock) { // @audit unlock = true, skip this
            IERC721(oTapAddress).safeTransferFrom(
                address(this),
                user,
                removeAndRepayData.exitData.oTAPTokenID,
                "0x"
            );
        }
    }

    // performs a tOLP.unlock operation
    if (removeAndRepayData.unlockData.unlock) { 
        if (removeAndRepayData.unlockData.tokenId != 0) {
            if (tOLPId != 0) {
                require(
                    tOLPId == removeAndRepayData.unlockData.tokenId,
                    "Magnetar: tOLPId mismatch"
                );
            }
            tOLPId = removeAndRepayData.unlockData.tokenId;
        }
        // @audit .target here is attacker controlled  - just pass first time!
        //        Second time, the attacker specifies the real tOLP contract and themselves as "user" to have the tokens unlocked to their address
        ITapiocaOptionLiquidityProvision(
            removeAndRepayData.unlockData.target 
        ).unlock(tOLPId, externalData.singularity, user);
    }
```

</details>

### Recommended Mitigation Steps

*   Do not allow arbitrary address input in these complex, multi-use functions.
*   Consider breaking this into multiple standalone functions
*   Require user == msg.sender

**[ > 0xRektora (Tapioca) confirmed](https://github.com/code-423n4/2023-07-tapioca-findings/issues/936#issuecomment-1701318846)**

***
