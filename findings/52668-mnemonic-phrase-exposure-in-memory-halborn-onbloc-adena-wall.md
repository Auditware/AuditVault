---
tags:
  - severity/high
  - has/github
  - has/poc
  - sector/wallet
protocol: "[[Adena Wallet Chrome Extension]]"
auditors:
  - Halborn
report: "https://www.halborn.com/audits/onbloc/adena-wallet-chrome-extension"
genome:
  - "[[access-roles]]"
  - "[[secret-exposure]]"
  - "[[ownership-takeover]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-access-control]]"
  - "[[misassumption/offchain-is-trusted]]"
  - "[[blast-radius/single-user]]"
---
# MNEMONIC PHRASE EXPOSURE IN MEMORY

- id: 52668
- impact: HIGH
- protocol: Adena Wallet Chrome Extension
- reporter: Halborn
- source: https://www.halborn.com/audits/onbloc/adena-wallet-chrome-extension

## Summary


This bug report discusses a vulnerability found in a wallet web extension where the mnemonic phrase and user password are kept unencrypted in memory, even when the wallet is locked. This makes the wallet vulnerable to a potential attack (CVE-2022-32969) where an attacker with access to the user's machine could steal the sensitive information. The report provides evidence of this vulnerability and rates its impact as a 5 out of 10 and likelihood as a 3 out of 10. To mitigate this vulnerability, the team recommends strategies such as storing the entropy on disk instead of the mnemonic, utilizing obfuscated variables, and ensuring that the mnemonic is completely cleared from memory when the wallet is locked. The team also suggests displaying the mnemonic using an HTML5 canvas and limiting the ability for users to copy it from the extension. The bug has been solved by the Onbloc team.

## Details

##### Description

The mnemonic phrase of the wallet is kept unencrypted in memory, even the wallet was locked. As a result, an attacker with access to the user’s machine could exfiltrate the mnemonic phrase. This makes the wallet web extension vulnerable to Demonic (CVE-2022-32969). The user password in cleartext was also found.

It is important to recognize that the mnemonic risk extends beyond the application state; it could also be leaked into memory when the browser displays the mnemonic in clear text and as long as the process running.

##### Proof of Concept

Observe, for example, the following lines in <https://github.com/onbloc/adena-wallet/blob/38f089a900311ec773a3c6c6ae5807ef6db2bebb/packages/adena-module/src/wallet/keyring/hd-wallet-keyring.ts>:

```
export class HDWalletKeyring implements Keyring {
  public readonly id: string;
  public readonly type: KeyringType = 'HD_WALLET';
  public readonly seed: Uint8Array;
  public readonly mnemonic: string;

  constructor({ id, mnemonic, seed }: KeyringData) {
    if (!mnemonic || !seed) {
      throw new Error('Invalid parameter values');
    }
    this.id = id || uuidv4();
    this.mnemonic = mnemonic;
    this.seed = Uint8Array.from(seed);
  }
```

In this example, the mnemonic phrase may be maintained in cleart text in the memory.

Observe, for example, the following lines in <https://github.com/onbloc/adena-wallet/blob/38f089a900311ec773a3c6c6ae5807ef6db2bebb/packages/adena-extension/src/repositories/wallet/wallet.ts>:

```
  public getWalletPassword = async (): Promise<string> => {
    const encryptedKey = await this.sessionStorage.get('ENCRYPTED_KEY');
    const encryptedPassword = await this.sessionStorage.get('ENCRYPTED_PASSWORD');

    if (encryptedKey === '' || encryptedPassword === '') {
      throw new WalletError('NOT_FOUND_PASSWORD');
    }

    try {
      const password = decryptPassword(encryptedKey, encryptedPassword);
      this.updateStoragePassword(password);
      return password;
    } catch (e) {
      throw new WalletError('NOT_FOUND_PASSWORD');
    }
  };
```

In this example, the user password may be maintained in cleart text in the memory.

In the following images, evidences of this situation can be seen when the wallet is in locked state:

![Demonic attack retrieving the mnemonic from memory, while the wallet is locked](https://halbornmainframe.com/proxy/audits/images/67926134c1f69dd5c64c55d2)  
![User password in cleartext in memory, while the wallet is locked](https://halbornmainframe.com/proxy/audits/images/6792618aad9d21dc952b8013)  
![Retrieving the mnemonic from memory, while the wallet is locked](https://halbornmainframe.com/proxy/audits/images/679261b6c1f69dd5c64c5845)

##### Score

Impact: 5  
Likelihood: 3

##### Recommendation

The identified vulnerability arises from the application's handling of sensitive data in plain text. To mitigate this, the team recommends the following strategies:

- Opt for storing the entropy on disk rather than the mnemonic itself. When the mnemonic is necessary in the code, consider breaking it into multiple variables. Alternatively, obfuscate the original phrase and subsequently dereference the variable holding the original phrase.

- For instances requiring mnemonic phrase handling, utilize the obfuscated variable with a function designed to reconstruct the original mnemonic phrase exactly at the point of need.

- Ensure that when the wallet is in a locked state, the mnemonic phrase is completely cleared from memory.

For the display and handling of the mnemonic phrase during wallet creation and when revealed to a logged-in user:

- Display the mnemonic phrase using an HTML5 canvas. This technique helps prevent users from copying the phrase, reducing the risk of it being unintentionally stored in memory via the clipboard.

- Limit the ability for users to copy the entire mnemonic from the extension. This approach is essential in minimizing the potential for the mnemonic to be accidentally leaked through the clipboard, thereby enhancing the security of the sensitive information.

Implementing these recommendations would significantly enhance the security of mnemonic phrase handling, reducing the risks associated with its exposure or misuse.

##### Remediation

**SOLVED:** The **Onbloc team** solved this finding.

##### Remediation Hash

<https://github.com/onbloc/adena-wallet/pull/704>
