---
tags:
  - lang/solidity
  - sector/perpetuals
  - sector/stable
  - sector/vault
  - platform/quantstamp
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
protocol: "[[Dipcoin]]"
auditors:
  - "[[Hamed Mohammadi]]"
report: "https://certificate.quantstamp.com/full/dipcoin-vault/287cb76f-d531-451c-b1ae-306a570c4ff3/index.html"
genome:
  - "[[precision-loss]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
---
# Vaults Susceptible to Inflation Attacks

- id: 64774
- impact: HIGH
- protocol: [[Dipcoin]] Vault
- reporter: Hamed Mohammadi (Quantstamp)
- source: https://certificate.quantstamp.com/full/dipcoin-vault/287cb76f-d531-451c-b1ae-306a570c4ff3/index.html

## Summary


The client has marked a bug as "Fixed" in the code. The bug was found in the `Vault.move` file and it could potentially allow a malicious user to artificially inflate the value of a vault and drain its funds. This could happen if the attacker donated a large amount of funds to the vault and then convinced another user to deposit funds, resulting in the second user losing money. The client has recommended implementing two strategies to prevent this from happening: virtual shares and decimal offset. These strategies would make it more difficult and expensive for an attacker to manipulate the vault's value. 

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `ab4b8c92315ae3ab4c2ac35efd7c968d756f2c53`, `54cfac7a02988ba86734d12207a321b748cd5128`, and `2db007f5585f8b73a46e000a630b17c097f76e8d`. The client provided the following explanation:

> We have a protocol-level MIN_DEPOSIT_AMOUNT limit, which is currently set at 10 USDC, and this can prevent the issue.

**File(s) affected:**`Vault.move`

**Description:** The vault share price is calculated by dividing the sum of all vault assets across different perpetuals, along with the vault balance in the `Bank` module, by `vault.total_shares`. Since funds can be donated to the vault via various `Bank` functions, a malicious actor could artificially inflate the vault’s assets, increasing their share value and potentially draining the vault.

**Exploit Scenario:**

1.   Creator creates a vault with 1 MIST deposit (shares=1). 
2.   Creator frontruns victim's transfer to transfer 10,000 USDC to the vault's bank account. 
3.   Share price becomes ~10,000 USDC per share unit. 
4.   Victim deposits 15,000 USDC. 
5.   Victim receives `15,000 / 10,000 = 1` share unit. 
6.   Victim's position value is 10,000 USDC. 
7.   Victim loses 5,000 USDC (33% loss). 
8.   Creator withdraws their 1 share. Since they are the creator, they pay no profit sharing fees and capture the full value of the donation + the victim's loss.

**Recommendation:** Implement a robust defense by combining two strategies as described in [OpenZeppelin ERC-4626](https://docs.openzeppelin.com/contracts/5.x/erc4626):

1.   **Virtual Shares (Offsetting the Denominator)**: Add a virtual offset to the share supply calculation to dampen the effect of early donations. 
2.   **Decimal Offset (Increasing Precision)**: Increase the internal precision of shares (e.g., to 1e18 or higher) relative to the asset's decimals. 

This reduces the impact of rounding errors. If shares have 9 extra decimals of precision, a 1 MIST donation only inflates the price by a tiny fraction, making the attack prohibitively expensive. Implementing both provides the strongest defense against rounding losses and inflation attacks.
