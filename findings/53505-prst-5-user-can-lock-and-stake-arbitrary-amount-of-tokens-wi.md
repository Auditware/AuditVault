---
tags:
  - lang/rust
  - lang/solidity
  - platform/hexens
  - has/github
  - severity/high
  - sector/staking
  - sector/streaming
protocol: "[[Persistence]]"
auditors:
  - "[[Hexens]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2024-01-12-Persistence.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[account-ownership]]"
  - "[[reward-accounting]]"
---
# [PRST-5] User can lock and stake arbitrary amount of tokens without paying

- id: 53505
- impact: HIGH
- protocol: [[Persistence]]
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2024-01-12-Persistence.md

## Summary


This bug report describes a critical issue in the `superfluid_lp/src/contract.rs` contract where users can lock and stake native tokens. The locking function has a faulty check that allows users to bypass payment and lock any amount of tokens without actually paying for them. This can lead to a scenario where a user locks tokens from another user and uses them to stake without their consent. The suggested solution is to add a check that enforces the user to send the required tokens with the transaction. This bug has been fixed.

## Details

**Severity:** Critical

**Path:** superfluid_lp/src/contract.rs

**Description:**

In the `superfluid_lp/src/contract.rs` contract the user has the ability to lock and stake native tokens. While staking the user has the following methods of paying for the staking:

Send the actual tokens with the transaction when staking

Use their locked up tokens as payment, which will be transferred from the contract

The locking function has a faulty amount check `superfluid_lp/src/contract.rs:L95-109`:

```
            match &asset.info {
                AssetInfo::NativeToken { denom } => {
                    for coin in info.funds.iter() {
                        if coin.denom == *denom {
                            // validate that the amount sent is exactly equal to the amount that is expected to be locked.
                            if coin.amount != asset.amount {
                                return Err(ContractError::InvalidAmount);
                            }
                        }
                    }
                }
                AssetInfo::Token { contract_addr: _ } => {
                    return Err(ContractError::UnsupportedAssetType);
                }
            }
```
The issue lies in the for loop part. If the user doesn’t supply any tokens while calling the function, the `coin.amount` check will never happen and because the function doesn’t check if the user has sent some tokens, the user locked amount will be incremented by the value that was supplied to the lock function. Even in the case where there was a requirement which enforced that the user has sent some tokens, the user could supply another native token and once again bypass the check.

Because of this the user can lockup any amount of tokens and later stake using other user's tokens without actually paying them which can lead to the following scenario:

Alice locks up 100 native tokens inside of the contract to be later used in staking.

Bob seeing as Alice has locked up native tokens without staking decides to abuse the invalid check and locks up 100 native tokens without actually paying those.

Bob immediately after falsely locking the tokens, instantly joins the pool using his fake locked tokens and the contract transfers the locked tokens of Alice but from the name of Bob.

```
ExecuteMsg::LockLstAsset { asset} => {

            let user = info.sender.clone();

            // validate that the asset is allowed to be locked.
            let config = CONFIG.load(deps.storage)?;
            let mut allowed = false;
            for allowed_asset in config.allowed_lockable_tokens {
                if allowed_asset == asset.info {
                    allowed = true;
                    break;
                }
            }

            if !allowed {
                return Err(ContractError::AssetNotAllowedToBeLocked);
            }

            let mut locked_amount: Uint128 = LOCK_AMOUNT
                .may_load(deps.storage, (&user, &asset.info.to_string()))?
                .unwrap_or_default();
       
            // confirm that this asset was sent along with the message. We only support native assets.
            match &asset.info {
                AssetInfo::NativeToken { denom } => {
                    for coin in info.funds.iter() {
                        if coin.denom == *denom {
                            // validate that the amount sent is exactly equal to the amount that is expected to be locked.
                            if coin.amount != asset.amount {
                                return Err(ContractError::InvalidAmount);
                            }
                        }
                    }
                }
                AssetInfo::Token { contract_addr: _ } => {
                    return Err(ContractError::UnsupportedAssetType);
                }
            }

             // add the amount to the locked amount
            locked_amount = locked_amount + asset.amount;

            // update locked amount
            LOCK_AMOUNT.save(deps.storage, (&user, &asset.info.to_string()), &locked_amount)?;
            Ok(Response::default())
        }
```

**Remediation:**  Add a check which enforces that the user sends the required token with the transaction.

**Status:**  Fixed


- - -
