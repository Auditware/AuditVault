---
tags:
  - blockchain/solana
  - lang/rust
  - platform/pashov
  - severity/high
  - vuln/dos/frozen-funds
  - impact/dos/permanent
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/locked-funds
  - impact/mev/frontrun
  - novelty/known-pattern
  - sector/dex
  - check/same-token-swap-protection
  - check/token-dust-handling
protocol: "[[Stixswapsolana]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
  - "[[frontrun]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[initializer-auth]]"
  - "[[integer-bounds]]"
  - "[[missing-close-constraint]]"
  - "[[pda-derivation]]"
  - "[[same-token-swap-protection]]"
  - "[[token-dust-handling]]"
---
[H-04]
Permanent DOS and loss of funds due
to unhandled token dust
High
Resolved
[M-01]
Whitelisted taker can DoS attack
other whitelisted takers
Medium
Resolved
[M-02]
Same token swap protection missing
Medium
Resolved
[L-01]
Frontrunning the initialization of
admin_config
Low
Resolved
[L-02]
Missing fee address validation in
update function
Low
Resolved
[L-03]
Missing minimum trade size
protection
Low
Acknowledged
[L-04]
State inconsistency due to Solana
rollback
Low
Resolved
7

[L-05]
offer_id is not utilized in create_offer
Low
Resolved
[L-06]
Missing validation for an expected
amount greater than zero
Low
Resolved
[L-07]
Missing Update of Offer Statistics in
take_offer
Low
Resolved
[L-08]
cancel_offer requires the maker as a
signer, preventing post-expiration
cancellations
Low
Acknowledged
[L-09]
Division overflow may result in
trading at the price of quote 0
Low
Resolved
[L-10]
Expiring offers without closing the
offer PDA causes DoS
Low
Acknowledged
[L-11]
Unreliable event logging due to
Solana log truncation
Low
Resolved
8

8. Findings
8.1. Critical Findings
[C-01] Premature closure of offer and
whitelist accounts
Severity
Impact: High
Likelihood: High
Description
In the take_offer  function, the close  constraint is applied to the offer  and
whitelist  PDAs, as shown below:
#[account(
    mut,
  
         constraint = offer.status == OfferStatus::Ongoing @ SwapError::InvalidOfferSt
    seeds = [b"offer", offer.maker.as_ref()],
    bump,
    close = maker 
)]
pub offer: Account<'info, Offer>,
#[account(
    mut,
    seeds = [b"whitelist", offer.maker.as_ref()],
    bump,
    constraint = whitelist.takers.contains(&taker.key
      ()) @ SwapError::TakerNotWhitelisted,
    close = maker
)]
pub whitelist: Account<'info, Whitelist>,
This results in the premature closure of both PDAs, even in cases of partial
fulfillment of the offer. For example, if an offer specifies 100 tokens and the
taker only accepts 2 tokens, the remaining 98 tokens will be permanently
locked in the vault since the offer  and whitelist  accounts are closed,
wiping their data and leaving the funds inaccessible.
9

Impact
Loss of data related to the offer and whitelist due to closure.
Permanent loss of remaining tokens in the vault, leading to a critical loss of
user funds.
Recommendations
1. 
Remove the close  constraint from both the offer  and whitelist
accounts in the take_offer  function.
2. 
Introduce a completed  flag in the offer  and whitelist  accounts to
indicate whether the offer has been fully fulfilled. For example:
offer.completed = true;
3. 
Modify the logic to only allow the accounts to be closed when the offer is
fully taken:
if offer.remaining_amount == 0 {  
    // Allow closure  
    token::close_account(ctx.accounts.into_offer_close_context())?;  
}
This approach preserves the data and ensures proper handling of partial
fulfillments, protecting the remaining funds and maintaining the integrity of
the offer process.
[C-02] ATA initialization causes permanent
DoS
Severity
Impact: High
Likelihood: High
Description
10

In the create_offer  function, the code uses init  to initialize an Associated
Token Account (ATA) for the Offer PDA to act as a vault for the input token
amount:
#[account(  
    init,  
    payer = maker,  
    associated_token::mint = input_token_mint,  
    associated_token::authority = offer,  
    associated_token::token_program = token_program  
)]  
pub vault_token_account: InterfaceAccount<'info, TokenAccount>,
However, an ATA can be created by anyone outside this program using tools
like the CLI. Since the init  constraint requires the ATA to be uninitialized, if
the ATA is preemptively created outside the program, this instruction will
always fail. This leads to a permanent Denial-of-Service (DoS) condition,
preventing the maker from trading tokens.
Additionally, this can result in a loss of protocol fees, as the protocol cannot
proceed with the offer creation.
Recommendations
Use the init_if_needed  constraint instead of init .
Implement and create idempotent instruction to handle pre-existing ATAs
gracefully. This ensures that the program can proceed even if the ATA was
created outside the program.
[C-03] TokenAccounts#fee_wallet lacks
constraints
Severity
Impact: High
Likelihood: High
Description
take_offer#TokenAccounts#fee_wallet  lacks constraints,taker can pay fee to
any account.
11

#[account(
        mut,
        associated_token::mint = input_token_mint,
@>        associated_token::authority = fee_wallet,
        associated_token::token_program = token_program,
    )]
    pub taker_fee_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = output_token_mint,
$>        associated_token::authority = fee_wallet,
        associated_token::token_program = token_program,
    )]
    pub fee_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    /// CHECK: Fee wallet validated through fee_token_account constraints
@>    pub fee_wallet: AccountInfo<'info>,
link
Recommendations
+     #[account(address = fee_config.fee_address)]    
       pub fee_wallet: AccountInfo<'info>,
12

8.2. High Findings
[H-01] Missing fee calculation on input
token in take_offer
Severity
Impact: High
Likelihood: Medium
Description
According to the documentation:
"A flat fee of 1% is charged to each side of their selected tokens and
sent to a treasury wallet controlled by the protocol."
However, in the take_offer  function, the fee is only charged on the output
token amount, while the input token amount is transferred without any fee
deduction, as shown here:
token_interface::transfer_checked(
    CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        token_interface::TransferChecked {
            from: ctx.accounts.vault_token_account.to_account_info(),
            mint: ctx.accounts.input_token_mint.to_account_info(),
            to: ctx.accounts.taker_receive_token_account.to_account_info(),
            authority: ctx.accounts.offer.to_account_info(),
        },
        &[seeds],
    ),
    token_amount,
    ctx.accounts.input_token_mint.decimals,
)?;
The fee on the output token is calculated and transferred as expected:
13

let fee_amount = expected_payment  
    .checked_mul(offer_fee_percentage)  
    .unwrap()  
    .checked_div(10000)  
    .unwrap();  
token_interface::transfer_checked(
    CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        token_interface::TransferChecked {
            from: ctx.accounts.taker_payment_token_account.to_account_info(),
            mint: ctx.accounts.output_token_mint.to_account_info(),
            to: ctx.accounts.fee_token_account.to_account_info(),
            authority: ctx.accounts.taker.to_account_info(),
        },
    ),
    fee_amount,
    ctx.accounts.output_token_mint.decimals,
)?;
By not charging the fee on the input token, the protocol is losing a significant
portion of its revenue, deviating from the intended fee model.
Impact
loss of funds: The protocol misses out on half of the intended fees (the input
side).
Recommendations
1. 
Charge the fee on the input token amount as well. Modify the code to
calculate and transfer the input token fee:
let input_fee_amount = token_amount  
    .checked_mul(offer_fee_percentage)  
    .unwrap()  
    .checked_div(10000)  
    .unwrap();  
let input_after_fee = token_amount.checked_sub(input_fee_amount).unwrap();  
// Transfer protocol fee for input token  
token_interface::transfer_checked(
    CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        token_interface::TransferChecked {
            from: ctx.accounts.vault_token_account.to_account_info(),
            mint: ctx.accounts.input_token_mint.to_account_info(),
            to: ctx.accounts.fee_token_account.to_account_info(),
            authority: ctx.accounts.offer.to_account_info(),
        },
    ),
    input_fee_amount,
    ctx.accounts.input_token_mint.decimals,
)?;
14

2. 
Ensure both input and output token fees are properly transferred to the
treasury wallet.
This will align the implementation with the protocol’s fee structure, ensuring
no revenue loss and maintaining user trust.
[H-02] Lack of mint validation in
create_offer allows arbitrary tokens
Severity
Impact: Medium
Likelihood: High
Description
The create_offer  function does not enforce any constraints on the
input_token_mint  and output_token_mint  parameters:
/// Input token mint (token being offered)  
pub input_token_mint: InterfaceAccount<'info, Mint>,  
/// Output token mint (token being requested)  
pub output_token_mint: InterfaceAccount<'info, Mint>,  
pub fn create_offer(  
    ctx: Context<CreateOffer>,  
    token_amount: u64,  
    expected_amount: u64,  
    deadline: i64,  
) -> Result<()> {  
    // Validate all inputs  
    let current_time = Clock::get()?.unix_timestamp;  
    require!(deadline > current_time, SwapError::InvalidDeadline);  
    require!(token_amount > 0, SwapError::InvalidAmount);  
    // Initialize offer parameters  
    let offer = &mut ctx.accounts.offer;  
    offer.maker = ctx.accounts.maker.key();  
    offer.input_token_mint = ctx.accounts.input_token_mint.key();  
    offer.output_token_mint = ctx.accounts.output_token_mint.key();  
}
Although the function initializes the mints and transfers tokens, it does not
validate these mints against the mint_whitelist  defined in the
initialize_admin  function:
15

#[account(  
    init,  
    payer = admin,  
    space = 8 + 4 + (32 * 50),  
    seeds = [b"mint_whitelist"],  
    bump  
)]  
pub mint_whitelist: Account<'info, MintWhitelist>,
According to the documentation, tradable tokens must be whitelisted by the
admin through an admin dashboard. Failure to validate mints allows arbitrary
tokens, including those with transfer fees (e.g., tokens implementing the
transfer_fee  extension), to be accepted. These tokens can disrupt the
protocol logic, as the amount received after transfer may be less than specified,
leading to inconsistencies and loss of funds.
Impact
1. Arbitrary tokens can bypass the whitelist, leading to potential abuse.
2. Tokens with transfer fees can break protocol logic and result in incorrect
token amounts.
Recommendations
Validate both input_token_mint  and output_token_mint  against the
mint_whitelist  before proceeding with the offer creation.
Reject any token mints that are not explicitly listed in the whitelist.
