---
tags:
  - severity/high
  - has/github
  - has/poc
  - sector/wallet
protocol: "[[SSP Wallet, Relay And Key]]"
auditors:
  - Halborn
report: "https://www.halborn.com/audits/influx-technologies/ssp-wallet-relay-and-key"
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
# HAL-04 - iOS - INSECURE STORAGE OF PIN

- id: 52586
- impact: HIGH
- protocol: SSP Wallet, Relay and Key
- reporter: Halborn
- source: https://www.halborn.com/audits/influx-technologies/ssp-wallet-relay-and-key

## Summary

This bug report describes a vulnerability in the SSP-Key iOS application where a sensitive PIN is stored in plaintext within the iOS Keychain. This means that if an attacker gains access to the device or Keychain, they can easily extract the PIN and use it for unauthorized access or decryption of other sensitive data. The accessibility level of the Keychain also makes it easier for an attacker to exploit this vulnerability. The report recommends using a secure cryptographic hashing algorithm to store a salted and hashed version of the PIN, and setting the Keychain accessibility level to only allow access when the device is unlocked with a secure passcode. The InFlux Technologies team has addressed this issue by changing the accessibility level to only allow access when the device is unlocked, balancing security with user experience.

## Details

##### Description

The SSP-Key iOS application stores a sensitive PIN (`ssp_key_pw`) in **plaintext** within the iOS Keychain. This practice introduces a severe security vulnerability because plaintext storage of authentication data leaves it exposed to direct access if the Keychain is compromised. Since the PIN is neither hashed nor encrypted, an attacker with access to the device or Keychain can extract the PIN in its original form and use it for unauthorized access, impersonation, or decryption of other sensitive data. The accessibility level of `WhenUnlocked` further exacerbates the issue by allowing access to the PIN whenever the device is unlocked, increasing the risk of exploitation.

##### Proof of Concept

![password.jpg](https://halbornmainframe.com/proxy/audits/images/6777dcbaadabd5e3b407e549)

##### Score

Impact: 5  
Likelihood: 3

##### Recommendation

Sensitive authentication data, such as PINs, should never be stored in plaintext. Instead, use a secure, industry-standard cryptographic hashing algorithm to store a salted and hashed version of the PIN. This ensures that even if the Keychain is compromised, the PIN cannot be directly recovered or misused. Additionally, set the Keychain accessibility level to `kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly` to ensure data is only accessible when the device is unlocked with a secure passcode, adding another layer of protection.

##### Remediation

**SOLVED:** The **InFlux Technologies team** addressed the issue by opting for `kSecAttrAccessibleWhenUnlockedThisDeviceOnly`, ensuring accessibility when the device is unlocked while balancing user experience with security.

##### Remediation Hash

<https://github.com/RunOnFlux/ssp-key/pull/76>
