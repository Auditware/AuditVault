---
tags:
  - lang/solidity
  - lang/vyper
  - sector/token
  - platform/0x52
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/sandwich
  - trigger/sandwich-attack
protocol: "[[Adapterfi]]"
auditors:
  - "[[@IAm0x52]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/0x52/2024-05-03-AdapterFi.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[sandwich]]"
  - "[[defi/sandwich-attack]]"
  - "[[frontrun-exposure]]"
---
# [H-02] Failure to pass \_withdraw_only to \_getBalanceTXs allows any withdrawing user to drain vault assets through sandwich attack

- id: 55660
- impact: HIGH
- protocol: [[Adapterfi]]
- reporter: @IAm0x52 (0x52)
- source: https://github.com/solodit/solodit_content/blob/main/reports/0x52/2024-05-03-AdapterFi.md

## Summary


The bug report is about a typographical error in the code for a smart contract called AdapterVault. This error causes a function called \_balanceAdapter to not pass a necessary variable, \_withdraw_only, to another function called \_getBalanceTxs. This means that anyone can freely withdraw assets from the contract without proper checks, which is a serious security issue. The report recommends passing \_withdraw_only to \_getBalanceTxs as intended and the bug has been fixed.

## Details

**Details**

[AdapterVault.vy#L1045-L1060](https://github.com/adapter-fi/AdapterVault/blob/3c2895a69ad5eb2c4be16d454f63a6f2f074f351/contracts/AdapterVault.vy#L1045-L1060)

    def _balanceAdapters( _target_asset_balance: uint256, pregen_info: DynArray[Bytes[4096], MAX_ADAPTERS], _withdraw_only : bool = False, _max_txs: uint8 = MAX_BALTX_DEPOSIT ):
        # Make sure we have enough assets to send to _receiver.
        txs: BalanceTX[MAX_ADAPTERS] = empty(BalanceTX[MAX_ADAPTERS])
        blocked_adapters: address[MAX_ADAPTERS] = empty(address[MAX_ADAPTERS])


        # If there are no adapters then nothing to do.
        if len(self.adapters) == 0: return


        # Setup current state of vault & adapters & strategy.
        d4626_assets: uint256 = 0
        adapter_states: BalanceAdapter[MAX_ADAPTERS] = empty(BalanceAdapter[MAX_ADAPTERS])
        total_assets: uint256 = 0
        total_ratios: uint256 = 0
        d4626_assets, adapter_states, total_assets, total_ratios = self._getCurrentBalances()


        txs, blocked_adapters = self._getBalanceTxs(_target_asset_balance, _max_txs, self.min_proposer_payout, total_assets, total_ratios, adapter_states )

A typographical error in \_balanceAdapter fails to pass \_withdraw_only to \_getBalanceTxs.

[AdapterVault.vy#L1032-L1034](https://github.com/adapter-fi/AdapterVault/blob/3c2895a69ad5eb2c4be16d454f63a6f2f074f351/contracts/AdapterVault.vy#L1032-L1034)

    def _getBalanceTxs( _target_asset_balance: uint256, _max_txs: uint8, _min_proposer_payout: uint256, _total_assets: uint256, _total_ratios: uint256, _adapter_states: BalanceAdapter[MAX_ADAPTERS], _withdraw_only : bool = False) -> (BalanceTX[MAX_ADAPTERS], address[MAX_ADAPTERS]):
        current_local_asset_balance : uint256 = ERC20(asset).balanceOf(self)
        return FundsAllocator(self.funds_allocator).getBalanceTxs( current_local_asset_balance, _target_asset_balance, _max_txs, _min_proposer_payout, _total_assets, _total_ratios, _adapter_states, _withdraw_only)

This is problematic as the default value is FALSE. This means that anyone withdrawing can freely rebalance the vault. As describe in H-01 as pregen_info must be trusted making this highly dangerous and allowing anyone to drain assets from an imbalanced vault.

**Lines of Code**

[AdapterVault.vy#L1045-L1098](https://github.com/adapter-fi/AdapterVault/blob/3c2895a69ad5eb2c4be16d454f63a6f2f074f351/contracts/AdapterVault.vy#L1045-L1098)

**Recommendation**

Pass \_withdraw_only to \_getBalanceTxs as intended

**Remediation**

Fixed as recommended
