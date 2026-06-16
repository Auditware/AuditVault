---
tags:
  - severity/high
  - has/poc
  - sector/wallet
protocol: "[[Adena Wallet Chrome Extension]]"
auditors:
  - Halborn
report: "https://www.halborn.com/audits/onbloc/adena-wallet-chrome-extension"
genome:
  - "[[weak-randomness]]"
  - "[[secret-exposure]]"
  - "[[ownership-takeover]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-nonce]]"
  - "[[misassumption/offchain-is-trusted]]"
  - "[[blast-radius/single-user]]"
---
# REUSE OF STATIC ENCRYPTION KEY

- id: 52669
- impact: HIGH
- protocol: Adena Wallet Chrome Extension
- reporter: Halborn
- source: https://www.halborn.com/audits/onbloc/adena-wallet-chrome-extension

## Summary


The report details a security vulnerability in a code that is used to encrypt passwords for a wallet. The issue is that a hardcoded encryption key is used to encrypt a dynamically generated UUID, which is then used to encrypt the wallet password. This means that anyone with access to the source code can obtain the key and decrypt the password. Additionally, the use of a UUID as the key is not secure. The report recommends avoiding static keys and using stronger encryption methods. The issue has been solved by the Onbloc team.

## Details

##### Description

The use of a hardcoded static encryption key to encrypt a dynamically generated UUID, which is then used to encrypt the wallet password, has been detected.

##### Proof of Concept

```
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

// Static cipher key used for encrypting the cryptographic key
const ENCRYPT_CIPHER_KEY = 'r3v4';

export const encryptSha256Password = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};

// Encrypts a password with a dynamically generated key and returns the encrypted key and password
export const encryptPassword = (
  password: string,
): { encryptedKey: string; encryptedPassword: string } => {
  const cryptKey = uuidv4();
  const adenaKey = ENCRYPT_CIPHER_KEY;
  const encryptedKey = CryptoJS.AES.encrypt(cryptKey, adenaKey).toString();
  const encryptedPassword = CryptoJS.AES.encrypt(password, cryptKey).toString();
  return {
    encryptedKey,
    encryptedPassword,
  };
};

// Decrypts a password using the encrypted key and password
export const decryptPassword = (encryptedKey: string, encryptedPassword: string): string => {
  const adenaKey = ENCRYPT_CIPHER_KEY;
  const key = CryptoJS.AES.decrypt(encryptedKey, adenaKey).toString(CryptoJS.enc.Utf8);
  if (key === '') {
    throw new Error('CipherKey Decryption Failed');
  }
  const password = CryptoJS.AES.decrypt(encryptedPassword, key).toString(CryptoJS.enc.Utf8);
  if (password === '') {
    throw new Error('Password Decryption Failed');
  }
  return password;
};
```

  

The constant key (`r3v4`) used to encrypt the dynamically generated UUID is hardcoded. Anyone with access to the source code (which is public) can obtain the cipher key that allows to decrypt the UUID. The encrypted password and encrypted key is then stored in the web extension session storage. If a malicious actor is able to access the session storage of the web extension, they can retrieve both the encrypted password and the encrypted key. With the static cipher key `r3v4`, they can decrypt the UUID and then use that to decrypt the password, ultimately gaining access to the user's wallet password in plaintext:

![Decrypting the user password](https://halbornmainframe.com/proxy/audits/images/6790ef7dc1f69dd5c648f4e5)

Additionally, using a UUID as the key for AES encryption is not cryptographically secure. While UUIDs are unique, they are not generated with cryptographic secure randomness. A better practice would be to use a secure random key generation method (e.g., using the Web Crypto API's `crypto.getRandomValues()`) for cryptographic keys.

##### Score

Impact: 5  
Likelihood: 3

##### Recommendation

Avoid static keys when possible. Storing sensitive data like keys or passwords in session storage is risky, using only in-memory storage can be considered. Also consider using a stronger encryption scheme, such as AES-GCM, instead of AES-CBC (the default for `CryptoJS.AES`).

##### Remediation

**SOLVED:** The **Onbloc team** solved this finding.

##### Remediation Hash

5a20b3900f9d5d2637e465f0006faab7f2d99171
