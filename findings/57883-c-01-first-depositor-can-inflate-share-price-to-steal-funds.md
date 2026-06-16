---
tags:
  - lang/solidity
  - sector/token
  - sector/vault
  - platform/shieldify
  - has/github
  - severity/high
protocol: "[[Harmonixfinance Hyperliquid]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/HarmonixFinance-Hyperliquid-Security-Review.md"
genome:
  - "[[frontrun-exposure]]"
  - "[[direct-drain]]"
  - "[[first-deposit]]"
---
# [C-01] First Depositor Can Inflate Share Price to Steal Funds from Subsequent Depositors

- id: 57883
- impact: HIGH
- protocol: Harmonixfinance Hyperliquid
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/HarmonixFinance-Hyperliquid-Security-Review.md

## Summary


This bug report describes a critical risk in the `FundContract` code. The contract is vulnerable to a share inflation attack, where an attacker can artificially increase the value of shares and then exploit it to drain the assets of legitimate users. The issue arises because the contract does not have proper safeguards against inflation attacks. This vulnerability can be found in the `vaults/hyperliquid/fundContract.sol` file. The impact of this attack is that users may receive fewer shares than expected or lose their assets due to rounding errors. To prevent this, it is recommended to mint some shares to the zero address after deploying the contract. The team has fixed the issue.

## Details

## Severity

Critical Risk

## Description

The `FundContract` is susceptible to a share inflation attack due to its improper handling of share issuance during deposits and withdrawals. The attack arises because the contract overrides the ERC-4626Upgradeable `deposit()` function without implementing safeguards against inflation attacks.

An attacker can exploit this by:

- Depositing a minimal amount to receive shares.

- Withdrawing almost all shares, leaving 1 wei share.

- Donating a large amount of assets directly to the `balanceContract`, artificially inflating the NAV (Net Asset Value).

- When `updateNav()` triggers, which recalculates the share price based on the inflated NAV, which increases the share price

```solidity
uint256 nav = IFundNavContract(fundNavContract).getFundNavValue() +
        ERC20(asset()).balanceOf(balanceContract) +
        withdrawPoolAmount -
        excludedTradingFee;

uint256 newPricePerShare = (nav * 10 ** decimals()) / totalSupply();
```

- When a legitimate user deposits, they receive zero/fewer shares than expected due to the inflated price.

- The attacker then withdraws their remaining shares, draining their and the user's amount of assets.
- Even though the contract inherits ERC4626-Upgradeable, the attack is still possible as the functions have been overridden.

## Location of Affected Code

File: [vaults/hyperliquid/fundContract.sol](https://github.com/harmonixfi/core-contracts/blob/f02157aba919dcdd4a1133669361224108c5caef/contracts/vaults/hyperliquid/fundContract.sol)

```solidity
function _updateNav() private {
    // code
    uint256 nav = IFundNavContract(fundNavContract).getFundNavValue() +
                ERC20(asset()).balanceOf(balanceContract) +
                withdrawPoolAmount -
                excludedTradingFee;

            uint256 newPricePerShare = (nav * 10 ** decimals()) / totalSupply();
    // code
}
```

File: [vaults/hyperliquid/fundContract.sol](https://github.com/harmonixfi/core-contracts/blob/f02157aba919dcdd4a1133669361224108c5caef/contracts/vaults/hyperliquid/fundContract.sol)

```solidity
function deposit(
    uint256 _amount,
    address _receiver
) public override nonReentrant returns (uint256) {
    TransferHelper.safeTransferFrom(
        asset(),
        msg.sender,
        address(this),
        _amount
    );

    return _deposit(_amount, _receiver);
}
```

## Impact

This attack has two implications: Implicit minimum Amount and funds lost due to rounding errors
If an attacker is successful in making 1 share worth z assets and a user tries to mint shares using k*z assets, then, - If k<1, then the user gets zero share and they lose all of their tokens to the attacker - If k>1, then users still get some shares, but they lose (k- floor(k)) * z of assets, which get proportionally divided between existing shareholders (including the attacker) due to rounding errors.
This means that, so that users do not lose value, they have to make sure that k is an integer.

## Recommendation

Mint some shares (10\*\*3) to the zero address after deploying the contract.

## Team Response

Fixed.
