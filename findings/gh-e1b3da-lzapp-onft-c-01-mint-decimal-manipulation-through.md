---
tags:
  - blockchain/evm
  - lang/solidity
  - sector/bridge
  - platform/pashov
  - severity/high
  - vuln/pda/reinitialization
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/initialize-proxy
protocol: "[[LayerZero]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[reinitialization]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[initializer-auth]]"
  - "[[pda-derivation]]"
---
[C-01] Mint decimal manipulation through
MintCloseAuthority
leads
to inflation of ld2sd_rate
Severity
Critical Risk
Description
The ld2sd_rate (local-to-shareddecimalrate)canbemanipulatedbytheinitializerthroughtheex-
ploitation of the MintCloseAuthority extension in the Solana program. This manipulation is pos-
sible because the initializer has control over the mint’s decimal value, which can be changed after
the mint’s creation, leading to critical discrepancies in token accounting and potential financial ex-
ploits.
The process to execute this exploit is as follows:
1. The admin creates a mint with an initial decimal value of 18 using the
MintCloseAuthority
extension, assigning the close authority to an address they control.
2. The admin uses the mint in the
InitONFT
resulting in 1e12 as a value of the
ld2sd_rate
(assuming 6 shared decimals).
3. With the mint supply still at 0, the admin then uses the close authority to close the mint ac-
count.
4. After the mint is closed, the admin can reinitialize a new mint at the same address, but this time
with a reduced decimal value, such as 6.
This manipulation of decimal values causes the
ld2sd_rate
to become inflated, as the program
(ONFT) will still treat the mint as though it has 18 decimals while it actually operates with only 6 dec-
imals. This mismatch leads to erroneous token calculations and can be used for various financial
exploits.
Example Exploits:
• Legitimate transfers treated as dust:
Assume a token with a value of $1, where 1 token equals 1e6 units (decimal of 6). An admin or
attacker can send 100,000 tokens (with a total value of $1,000,000). Using the manipulated
ld2sd_rate ,theprogramwithaninflatedrateof 1e12 ,causingthewholeamount 1e11 (100
billion units) to dust due to remove_dust , meaning the tokens will not be sent as intended.
• Cross-chain Manipulation:
The attacker can initialize another ONFT_config with a different token escrow account, using
themanipulated ld2sd_rate totransfertokensfromanotherchain(e.g.,Ethereum)toSolana.
TheinflatedrateonSolanacausestheamountreceivedtobemuchhigherthanintended.Once
the tokens are transferred, the attacker switches the peer to the new ONFT_config using the
correct(lower)rateandtransfersthetokensbacktotheoriginalchain,gaininganarbitrage-like
advantage due to the discrepancy in the rates between the ONFT_config accounts.
6

pub struct InitAdapterONft <'info> {
#[account(mut)]
pub payer: Signer <'info>,
#[account(
init,
payer = payer,
space = 8 + ONftConfig::INIT_SPACE ,
seeds = [ONft_SEED , token_escrow.key().as_ref()],
bump
)]
pub ONft_config: Account <'info, ONftConfig >,
#[account(
init,
payer = payer,
space = 8 + LzReceiveTypesAccounts::INIT_SPACE ,
seeds = [LZ_RECEIVE_TYPES_SEED , &ONft_config.key().as_ref()],
bump
)]
pub lz_receive_types_accounts: Account <'info, LzReceiveTypesAccounts
>,
#[account(mint::token_program = token_program)]
pub token_mint: InterfaceAccount <'info, Mint>,
#[account(
init,
payer = payer,
token::authority = ONft_config ,
token::mint = token_mint ,
token::token_program = token_program ,
)]
pub token_escrow: InterfaceAccount <'info, TokenAccount >,
pub token_program: Interface <'info, TokenInterface >,
pub system_program: Program <'info, System >,
}
7

impl InitAdapterONft <_> {
pub fn apply(ctx: &mut Context <InitAdapterONft >, params: &
InitAdapterONftParams) -> Result <()> {
ctx.accounts.ONft_config.bump = ctx.bumps.ONft_config;
ctx.accounts.ONft_config.token_mint = ctx.accounts.token_mint.key
();
ctx.accounts.ONft_config.ext = ONftConfigExt::Adapter(ctx.
accounts.token_escrow.key());
ctx.accounts.ONft_config.token_program = ctx.accounts.
token_program.key();
ctx.accounts.lz_receive_types_accounts.ONft_config = ctx.accounts
.ONft_config.key();
ctx.accounts.lz_receive_types_accounts.token_mint = ctx.accounts.
token_mint.key();
let oapp_signer = ctx.accounts.ONft_config.key();
ctx.accounts.ONft_config.init(
params.endpoint_program ,
params.admin,
params.shared_decimals ,
