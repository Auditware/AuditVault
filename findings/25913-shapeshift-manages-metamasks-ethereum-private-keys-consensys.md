---
tags:
  - lang/solidity
  - sector/wallet
  - platform/consensys
  - severity/high
  - precondition/insider
protocol: "[[MetaMask]]"
auditors:
  - "[[Valentin Quelquejay]]"
report: "https://consensys.net/diligence/audits/2023/07/metamask/partner-snaps-shapeshift-snap/"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[insider]]"
  - "[[access-roles]]"
---
# ShapeShift Manages MetaMasks Ethereum Private Keys

- id: 25913
- impact: HIGH
- protocol: MetaMask/Partner Snaps - Shapeshift Snap
- reporter: Valentin Quelquejay (ConsenSys)
- source: https://consensys.net/diligence/audits/2023/07/metamask/partner-snaps-shapeshift-snap/

## Summary


The Snap Outline in this bug report mentions that the ShapeShift snap requests access to the BIP32 entropy for the Ethereum private keys, which would allow the ShapeShift snap to manage MetaMasks Ethereum keys directly. This could undermine the security controls put in place by the MetaMask team. For reference, the report mentions three issues (#4.4, #4.1 and #4.9). 

The report recommends using the Metamask provider exposed via the `endowment:ethereum-provider` RPC endpoint instead of managing the Ethereum keys and low-level operations directly. This would avoid bypassing MetaMask security controls and fall back to proven and battle-tested user confirmation dialogs instead. Moreover, the report also suggests asking the MM team to provide a more robust account management API that is not based on giving full low-level account access to Snaps. This would enable Snaps to perform signing operations with control over cryptographic parameters without accessing the root entropy, which would significantly decrease the risks for the end-user.

## Details

#### Description


As the Snap Outline in this report mentions, the ShapeShift snap requests access to the BIP32 entropy for the Ethereum private keys. This effectively allows the ShapeShift snap to manage MetaMasks Ethereum keys directly, which comes with great responsibility. To avoid undermining established security controls put in place by the MetaMask team, the snap would have to replicate the same security functionality not to degrade the security posture of MetaMask altogether.


For reference, please take a look at [issue 4.4](#rpc-eth_getaddress-undermines-metamask-security-features-by-exposing-all-accounts-wo-explicit-user-consent), [issue 4.1](#rpc-eth_signmessage-allows-linked-dapps-to-sign-messages-with-any-wallet-account-and-wo-explicit-user-consent) , [issue 4.9](#rpc-_signtransaction-endpoints-should-display-human-readable-transaction-data) .


#### Recommendation


We recommend using the Metamask provider exposed via the `endowment:ethereum-provider` RPC endpoint to perform Ethereum operations instead of managing the Ethereum keys and low-level operations directly. This avoids bypassing MetaMask security controls but falling back to proven and battle-tested user confirmation dialogs instead.


Moreover, we also asked the MM team to provide a more robust account management API that is not based on giving full low-level account access to Snaps. This would enable Snaps to perform signing operations with control over cryptographic parameters (e.g., BIP-44 derivation path) without accessing the root entropy. This will significantly decrease the risks for the end-user.
