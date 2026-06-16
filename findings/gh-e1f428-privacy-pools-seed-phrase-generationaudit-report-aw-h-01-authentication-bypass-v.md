---
tags:
  - severity/high
protocol: "[[Privacy Pools Seed Phrase Generationaudit Report]]"
auditors:
  - "[[Auditware]]"
genome:
  - "[[spending-key-auth]]"
  - "[[permit-fork-replay]]"
  - "[[access-control/secret-exposure]]"
  - "[[privilege-escalation/ownership-takeover]]"
  - "[[known-pattern]]"
  - "[[trigger/offchain]]"
  - "[[add-nonce]]"
  - "[[misassumption/offchain-is-trusted]]"
  - "[[precondition/user-interaction]]"
  - "[[blast-radius/single-user]]"
  - sector/gaming
---
# **AW-H-01: Authentication Bypass via Insecure EIP-712 Implementation in Seed Derivation** {#aw-h-01:-authentication-bypass-via-insecure-eip-712-implementation-in-seed-derivation}

**Severity:** *High*									**Status:** *Acknowledged*

**Code:**

* [dev/src/utils/walletSeed.ts\#L97-L115](https://github.com/0xbow-io/privacy-pools-website/blob/dev/src/utils/walletSeed.ts#L97-L115) 

**Note:**  
Following discussions with the protocol team regarding the identified security concerns and user experience considerations, the team has decided to accept the acknowledged risks as part of their operational model. Users will be required to assume these risks, with the protocol committing to implement comprehensive warning systems and educational materials to ensure full user awareness. The team noted that a safer passphrase-based alternative is already available to provide users with more secure interaction options.

**Description:**  
The Privacy Pools seed derivation system uses EIP-712 signatures as the primary authentication mechanism for generating BIP39 mnemonic phrases.

The current implementation creates EIP-712 typed data with a minimal domain containing only **name** and **version**, lacking **chainId** and **verifyingContract**.

// Build the EIP-712 typed data for seed derivation, committing to keccak256(address).  
export function buildSeedDerivationTypedData(address: string) {  
 const addrBytes \= toBytes(address as \`0x${string}\`);  
 const addressHash \= keccak256(addrBytes);  
 const domain \= { name: 'Privacy Pools', version: '1' } as const;  
 const types \= {  
   DeriveSeed: \[  
     { name: 'action', type: 'string' },  
     { name: 'context', type: 'string' },  
     { name: 'addressHash', type: 'bytes32' },  
   \],  
 } as const;  
 const message \= {  
   action: 'Derive Account Seed',  
   context: 'privacy-pools/wallet-seed:v1',  
   addressHash: addressHash as \`0x${string}\`,  
 } as const;  
 return { domain, types, message, primaryType: 'DeriveSeed' as const };  
}

Signatures are verified entirely in the frontend using JavaScript cryptography, with no server-side validation or replay protection.

The system is vulnerable to domain impersonation attacks where attackers can create fake applications with identical EIP-712 domains (name, version, chainId and verifyingContract), collect user signatures, and derive the same seed phrases.

The HKDF salt (user address) provides user separation but no security against this kind of signature theft. Without expiration or server-side validation, stolen signatures remain valid indefinitely.

Successful exploitation may result in complete compromise of user privacy accounts, fund theft, and permanent transaction linkability.

Although users are expected to remain vigilant and not fall for phishing sites requesting for their wallet, it’s on the protocol side to ensure their users authentication is secured and not replayable in those cases.

This issue’s severity is **High**, and not Critical due to the fact that a user must first fall for a phishing site before becoming vulnerable. However, it must still be thought of thoroughly.

**Recommendations:**

* During the audit we have not managed to find a way to secure EIP-712 against mentioned replay attacks, and on the [EIP-712 page itself](https://eips.ethereum.org/EIPS/eip-712#replay-attacks) no explicit protection is natively suggested by the protocol, even though the risks are mentioned. Instead, we recommend using a solution like [EIP-4361 (SIWE)](https://docs.login.xyz/general-information/siwe-overview/eip-4361) that provides built-in protection against domain impersonation, replay attacks, and requires server-side validation.  
* If the protocol can’t transition to an EIP-4361 or similar approach, due to business requirements towards deterministic mnemonic generation, they must be aware of the risks associated with this decision and attempt to implement as much as possible from the following:  
  * Origin domain check (e.g. if the attacker will create a fake domain, the signature containing it won’t match expected one)  
  * Clear expiration & timing controls  
  * If possible \- nonce-based replay protection \- nonce must be freshly generated for each sign-in, server tracks used nonces and rejects duplicates, attacker can't reuse a stolen signature with the same nonce  
  * Even within EIP-712 (which is not recommended at this case) there are fields to slightly make an attacker harder (although still possible) like **chainId**, **verifyingContract** and **salt** that can be added to the domain fields.

# **AW-L-01: Insufficient Client-Side Hardening** {#aw-l-01:-insufficient-client-side-hardening}

**Severity:** *Low*									**Status:** *Unmitigated*

**Code:**

* [dev/src/containers/SeedPhraseForm.tsx\#L171-L200](https://github.com/0xbow-io/privacy-pools-website/blob/dev/src/containers/SeedPhraseForm.tsx#L171-L200) 

* [dev/next.config.mjs\#L32-L53](https://github.com/0xbow-io/privacy-pools-website/blob/dev/next.config.mjs#L32-L53) 

**Description:**  
During the audit of the **SeedPhraseForm.tsx** file we’ve come upon several missing client-side hardening features, to protect against threat vectors aiming to steal user’s derived signature or browsing session. The following deficiencies were identified:

* Authentication data is saved to localStorage without an expiration  
* CSP is implemented, but still allows execution of arbitrary scripts  
* Not all other recommended HTTP headers are configured  
* Authentication data is logged to the console

In case of a compromised CDN (e.g. supply chain attack), user downloading malicious browser extension, or similar, this allows potential threat actors to leak signature generation context or act on behalf of the user.

**Recommendations:**

* Add localStorage expiration for authentication data:  
  / Add utility function for expiring localStorage  
  const setStorageWithExpiration \= (key: string, value: string, hours: number) \=\> {  
   const item \= {  
     value,  
     expiration: Date.now() \+ (hours \* 60 \* 60 \* 1000)  
   };  
   localStorage.setItem(key, JSON.stringify(item));  
  };  
    
  // Use in wallet authentication flow with 2-hour expiration  
  setStorageWithExpiration(\`wallet-auth-${address}\`, authData, 2);  
    
* Strengthen CSP to prevent arbitrary script execution (suggestions only, fit your usecase):  
  // next.config.mjs \- Enhance existing CSP  
  'Content-Security-Policy': \[  
   "frame-ancestors 'self' https://app.safe.global https://\*.safe.global",  
   "script-src 'self' 'nonce-\[RANDOM\]' https://cdn.jsdelivr.net", // Whitelist specific CDNs only  
   "object-src 'none'",  
   "base-uri 'self'"  
  \].join('; ')  