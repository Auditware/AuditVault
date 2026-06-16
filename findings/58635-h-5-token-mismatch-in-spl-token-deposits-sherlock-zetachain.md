---
tags:
  - severity/high
  - has/github
  - lang/rust
  - lang/anchor
  - sector/bridge
  - sector/stable
  - sector/options
  - sector/algo-stable
  - platform/sherlock
protocol: "[[ZetaChain Cross Chain]]"
auditors:
  - g
report: "https://github.com/sherlock-audit/2025-04-zetachain-cross-chain-judging"
genome:
  - "[[account-ownership]]"
  - "[[token-approval-flow]]"
  - "[[input-validation/missing]]"
  - "[[loss-of-funds/direct-drain]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/single-user]]"
---
# H-5: Token Mismatch in SPL Token Deposits

- id: 58635
- impact: HIGH
- protocol: ZetaChain Cross-Chain
- reporter: g (Sherlock)
- source: N/A

## Summary


This bug report discusses a critical vulnerability found in the Gateway Solana program. The program requires a whitelist entry account for the token being deposited, but it does not verify that the token being transferred from the user's account matches the whitelisted token specified in the transaction context. This allows an attacker to deposit a non-whitelisted token while claiming it's a different, whitelisted token. The ZetaChain node, which processes these deposits, will incorrectly identify the deposited token based on the mint address in the transaction context rather than the actual token being transferred, potentially leading to incorrect cross-chain asset transfers and economic damage. The root cause of this issue is that the `handle_spl` function does not verify that the token in the user's account matches the mint address specified in the transaction context. The issue has been fixed by the protocol team in a recent PR.

## Details


Source: https://github.com/sherlock-audit/2025-04-zetachain-cross-chain-judging/issues/421 

## Found by 
0xkmr\_, OhmOudits, adeolu, berndartmueller, chinepun, g, mahdiRostami

### Summary

The Gateway Solana program contains a critical vulnerability in its `handle_spl` function within the deposit.rs file. While the program requires a whitelist entry account for the SPL token being deposited, it does not verify that the token being transferred from the user's account actually matches the whitelisted token specified in the transaction context. This mismatch allows an attacker to deposit a non-whitelisted token while claiming it's a different, whitelisted token. The ZetaChain node, which processes these deposits, will incorrectly identify the deposited token based on the mint address in the transaction context rather than the actual token being transferred, potentially leading to incorrect cross-chain asset transfers and economic damage.


snippet of the DepositSplToken context below 

https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/protocol-contracts-solana/programs/gateway/src/contexts.rs#L76C1-L89C1
```rust 
#[derive(Accounts)]
pub struct DepositSplToken<'info> {
    /// The account of the signer making the deposit.
    #[account(mut)]
    pub signer: Signer<'info>,

    /// Gateway PDA.
    #[account(mut, seeds = [b"meta"], bump)]
    pub pda: Account<'info, Pda>,

    /// The whitelist entry account for the SPL token.
    #[account(seeds = [b"whitelist", mint_account.key().as_ref()], bump)]
    pub whitelist_entry: Account<'info, WhitelistEntry>,

    /// The mint account of the SPL token being deposited.
    pub mint_account: Account<'info, Mint>,

    /// The token program.
    pub token_program: Program<'info, Token>,

    /// The source token account owned by the signer.
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,

    /// The destination token account owned by the PDA.
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,

    /// The system program.
    pub system_program: Program<'info, System>,
}
```

`mint_account` which is used in the `whitelist_entry` can be different from the token_program and to.mint or from.mint account. 

### Root Cause

The deposit process for SPL tokens involves multiple components that interact as follows:

1. The process begins when a user calls the `deposit_spl_token` function in lib.rs:

https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/protocol-contracts-solana/programs/gateway/src/lib.rs#L236-L242
```rust
pub fn deposit_spl_token(
    ctx: Context<DepositSplToken>,
    amount: u64,
    receiver: [u8; 20],
    revert_options: Option<RevertOptions>,
) -> Result<()> {
    instructions::deposit::handle_spl(ctx, amount, receiver, revert_options, DEPOSIT_FEE)
}
```

2. This function calls `handle_spl` in deposit.rs, which performs the actual deposit operation:

https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/protocol-contracts-solana/programs/gateway/src/instructions/deposit.rs#L68-L77
```rust
pub fn handle_spl(
    ctx: Context<DepositSplToken>,
    amount: u64,
    receiver: [u8; 20],
    revert_options: Option<RevertOptions>,
    deposit_fee: u64,
) -> Result<()> {
    verify_payload_size(None, &revert_options)?;
    let token = &ctx.accounts.token_program; //@audit no check for if token is whitelisted, or is for same one represented by ctx.accounts.mint_account
    //this disparity can affect the final messaqge emitted, and can affect node processing. i.e if two whitelisted tokens usdc and weth, attacker can ust mint_account for weth and send in 10 usdc
    //msg willl emit weth as mint_account and node will process deposit on the other side as weth deposit
    let from = &ctx.accounts.from;
    
    // ... rest of the function ...
}
```

3. The `DepositSplToken` context includes a `whitelist_entry` account that is derived from the mint address:

https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/protocol-contracts-solana/programs/gateway/src/contexts.rs#L76C1-L105
```rust
#[derive(Accounts)]
pub struct DepositSplToken<'info> {
    // ... other fields ...

    /// The whitelist entry account for the SPL token.
    #[account(seeds = [b"whitelist", mint_account.key().as_ref()], bump)]
    pub whitelist_entry: Account<'info, WhitelistEntry>,

    /// The mint account of the SPL token being deposited.
    pub mint_account: Account<'info, Mint>,

    /// The token program.
    pub token_program: Program<'info, Token>,

    /// The source token account owned by the signer.
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    
    // ... other fields ...
}
```

And there is no check in the logic to verify that token_program is the valid one belonging to the mint_account provided and the same for to.mint and from.mint. Full function logic below 

https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/protocol-contracts-solana/programs/gateway/src/instructions/deposit.rs#L68-L119
```rust 
pub fn handle_spl(
    ctx: Context<DepositSplToken>,
    amount: u64,
    receiver: [u8; 20],
    revert_options: Option<RevertOptions>,
    deposit_fee: u64,
) -> Result<()> {
    verify_payload_size(None, &revert_options)?;
    let token = &ctx.accounts.token_program; 
    let from = &ctx.accounts.from;

    let pda = &mut ctx.accounts.pda;
    require!(!pda.deposit_paused, Errors::DepositPaused);
    require!(receiver != [0u8; 20], Errors::EmptyReceiver);

    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.signer.to_account_info().clone(),
            to: pda.to_account_info().clone(),
        },
    );
    system_program::transfer(cpi_context, deposit_fee)?;

    let pda_ata = get_associated_token_address(&ctx.accounts.pda.key(), &from.mint);
    require!(
        pda_ata == ctx.accounts.to.to_account_info().key(), 
        Errors::DepositToAddressMismatch
    );

    let xfer_ctx = CpiContext::new(
        token.to_account_info(),
        anchor_spl::token::Transfer {
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.to.to_account_info(), 
            authority: ctx.accounts.signer.to_account_info(),
        },  
    );
    transfer(xfer_ctx, amount)?;

    msg!(
            "Deposit SPL executed: amount = {}, fee = {}, receiver = {:?}, pda = {}, mint = {}, revert options = {:?}",
            amount,
            deposit_fee,
            receiver,
            ctx.accounts.pda.key(),
            ctx.accounts.mint_account.key(),
            revert_options
        );

    Ok(())
}
```

The logic sets `let token = &ctx.accounts.token_program;`, then fetches the pda_ata via `    let pda_ata = get_associated_token_address(&ctx.accounts.pda.key(), &from.mint);` after which it does a cip_contrxt transfer like below 

https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/protocol-contracts-solana/programs/gateway/src/instructions/deposit.rs#L98-L106
```rust 
    let xfer_ctx = CpiContext::new(
        token.to_account_info(),
        anchor_spl::token::Transfer {
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.to.to_account_info(), 
            authority: ctx.accounts.signer.to_account_info(),
        }, //@audit no freeze authority check too for if pda_ata is frozen before transfer. 
    );
    transfer(xfer_ctx, amount)?;
```
here the token being transferred is `token` or `ctx.accounts.token_program`. the pda_ata of the program is checked to be same as one generated for the from.mint account representing the token. 

token_program, from.mint and to.mint can actually represent the same token while mint_account may not. if token_program, from.mint and to.mint represent same token the token transfer will be sucessfull. if mint_account represents another whitelisted token, the whitelist check will succeed too. 

4. After the deposit is processed, the ZetaChain node observes the transaction and extracts the deposit information:

https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/zetaclient/chains/solana/observer/inbound.go#L224-L251
```go
// In FilterInboundEvents function (node/zetaclient/chains/solana/observer/inbound.go)
deposit, err := solanacontracts.ParseInboundAsDepositSPL(tx, i, txResult.Slot)
if err != nil {
    return nil, errors.Wrap(err, "error ParseInboundAsDepositSPL")
} else if deposit != nil {
    seenDepositSPL = true
    events = append(events, &clienttypes.InboundEvent{
        // ... other fields ...
        CoinType: coin.CoinType_ERC20,
        Asset:    deposit.Asset,  // This is the mint address from the transaction
        // ... other fields ...
    })
}
```

After this, the parsing is done here 

https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/pkg/contracts/solana/inbound.go#L134-L146


https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/pkg/contracts/solana/inbound.go#L149-L173

https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/pkg/contracts/solana/inbound.go#L312-L333

5. The node extracts the SPL token mint address from the instruction accounts:

https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/pkg/contracts/solana/inbound.go#L329-L338
```go
// In getSignerAndSPLFromDepositSPLAccounts function (node/pkg/contracts/solana/inbound.go)
// the accounts are [signer, pda, whitelist_entry, mint_account, token_program, from, to]
signer := instructionAccounts[0].PublicKey.String()
spl := instructionAccounts[3].PublicKey.String()  // This is the mint_account from the transaction

return signer, spl, nil
```

The issue is that the `handle_spl` function does not verify that the token in the user's `from` account matches the mint address specified in the transaction context. The Anchor framework ensures that a whitelist entry exists for the provided `mint_account`, but there's no check to ensure that the token being transferred has the same mint.


The mint_account is THEN taken as the spl token account and is returned by [getSignerAndSPLFromDepositSPLAccounts](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/pkg/contracts/solana/inbound.go#L338). this is then returned as the asset deposited in [parseAsDepositSPL()](https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/pkg/contracts/solana/inbound.go#L186)


https://github.com/sherlock-audit/2025-04-zetachain-cross-chain/blob/main/node/pkg/contracts/solana/inbound.go#L170-L186
```rust 
	sender, spl, err := getSignerAndSPLFromDepositSPLAccounts(tx, &instruction)
	if err != nil {
		return nil, err
	}


	receiver, err := parseReceiver(inst.Receiver)
	if err != nil {
		return nil, err
	}


	return &Inbound{
		Sender:           sender,
		Receiver:         receiver,
		Amount:           inst.Amount,
		Memo:             []byte{},
		Slot:             slot,
		Asset:            spl, // <-- see here this is mint_account, may not be the token program or from.mint transferred

```

### Internal Pre-conditions


1. The Gateway program has a whitelist mechanism for SPL tokens, implemented through the `whitelist_entry` account in the `DepositSplToken` context.

2. Multiple tokens have been whitelisted in the system (e.g., USDC and WETH).

3. The `handle_spl` function is called with a token program and mint account that should be checked for consistency.

4. The node processes SPL token deposits by extracting the mint address from the transaction context, not from the actual token being transferred.

### External Pre-conditions

none

### Attack Path


1. An attacker identifies two whitelisted tokens in the system, for example, USDC and WETH.

2. The attacker creates a transaction that includes:
   - A legitimate whitelisted token's mint address (e.g., WETH) in the `mint_account` field
   - The corresponding whitelist entry for WETH
   - But actually transfers a different token (e.g., USDC) from their `from` account to the `to` account which is the program pda_ata. already created since USDC is whitelisted 

3. The `handle_spl` function does not verify that the token being transferred matches the mint address specified in the transaction.

4. The transaction is processed successfully, and the log message emits information that a WETH deposit was made, even though USDC was actually transferred.

5. The ZetaChain node observes this transaction and processes it as a WETH deposit based on the mint address in the transaction context.

6. This results in a mismatch between the actual token deposited (USDC) and what the system records and processes (WETH), potentially leading to incorrect asset transfers and accounting.

### Impact

1. **Token Spoofing**: Attackers can deposit one token (e.g., USDC) while making the system believe they deposited another token (e.g., WETH).

2. **Cross-Chain Asset Mismatch**: The ZetaChain node will process the deposit based on the mint address in the transaction, not the actual token being transferred, potentially leading to incorrect asset transfers on the ZetaChain side.

3. **Economic Damage**: If the value of the spoofed token is different from the actual token being transferred, this could lead to economic damage or exploitation of the protocol.

4. **Protocol Inconsistency**: The mismatch between the actual token deposited and what the system records could lead to inconsistencies in the protocol state.



### Mitigation

1. **Implement Token Validation**: Add explicit validation in the `handle_spl` function to ensure the token being deposited matches the mint address specified in the transaction:

```rust
pub fn handle_spl(
    ctx: Context<DepositSplToken>,
    amount: u64,
    receiver: [u8; 20],
    revert_options: Option<RevertOptions>,
    deposit_fee: u64,
) -> Result<()> {
    verify_payload_size(None, &revert_options)?;
    
    // Ensure the token being deposited matches the mint address in the transaction
    require!(
        ctx.accounts.from.mint == ctx.accounts.mint_account.key(),
        Errors::TokenMintMismatch
    );
    
    let token = &ctx.accounts.token_program;
    let from = &ctx.accounts.from;
    
    // ... rest of the function ...
}
```

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/zeta-chain/protocol-contracts-solana/pull/114


**gjaldon**

The mint of the from token account is now [validated](https://github.com/zeta-chain/protocol-contracts-solana/pull/114/files\#diff-e9aa90c11c8df3130c0cc027f1d5fd6f429d44a4c1ec35eaeaa40cc280841fc2R97) against the mint_account in the signed payload.




