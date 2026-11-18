---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/missing-required-cryptographic-step
  - env/web
  - stack/node
  - trigger/brute-force
substate: "informative"
weakness: "Missing Required Cryptographic Step"
enriched: true
body: true
date: 2025-12-19
submitted: 2025-12-13T16:49:43.115Z
bounty_usd: null
votes: 24
cve: []
program: "[[programs/nodejs|Node.js]]"
reporter: "sideni"
source: "https://hackerone.com/reports/3463949"
title: "Missing AES-GCM Authentication Tag Validation and Improper Deprecation Handling"
---
# Missing AES-GCM Authentication Tag Validation and Improper Deprecation Handling

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 24 | **Program:** Node.js | **Disclosed:** 2025-12-19

- Report: [https://hackerone.com/reports/3463949](https://hackerone.com/reports/3463949)
- CWE: Missing Required Cryptographic Step
- Submitted: 2025-12-13T16:49:43.115Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
In Node.js' crypto module, the `createDecipheriv` states that "the `authTagLength` option defaults to 16 bytes and must be set to a different value if a different length is used." ([here](https://nodejs.org/api/crypto.html#class-decipheriv:~:text=the%20authTagLength%20option%20defaults%20to%2016%20bytes%20and%20must%20be%20set%20to%20a%20different%20value%20if%20a%20different%20length%20is%20used.))
The authentication tag's length is however not validated against that default value and can be truncated down to either 4, 8, 12, 13, 14, or 15 bytes. ([here](https://github.com/nodejs/node/blob/4f24aff94ad9160bceaf9dcc9cf5235a65f01029/deps/ncrypto/ncrypto.h#L407-L409))
This allows an attacker to brute force an authentication tag after modifying a ciphertext and recover the key material to compute more authentication tags offline afterwards.

**Description:**
These authenticated encryption schemes are frequently used to protect some session or some token. An attacker could exploit this flaw by changing a valid ciphertext and by bruteforcing the new authentication tag on the server (with at most 12,884,902,656 requests : `(2**32) * 3 + 2 * 256`) to gain a valid session/token.
This also results in a nonce reuse with AES-GCM which leaks the key needed to compute any further authentication tags (see [this blogpost](https://frereit.de/aes_gcm/)). Note that 12 billion requests are not necessarily needed as one could use the truncated tag to recover the needed key (see [this cryptopals challenge](https://cryptopals.com/sets/8/challenges/64.txt)).

With the key needed to compute arbitrary authentication tags, an attacker can manipulate a ciphertext to decrypt it and to forge a new one.

I understand implicit shorter tag lengths have been deprecated with this [PR](https://github.com/nodejs/node/pull/52345), the deprecation warning however is [only emitted when the tag is actually shorter than 16 bytes](https://github.com/nodejs/node/blob/ebf38d825d20f14a80405be182cfaa568c1eb99f/src/crypto/crypto_cipher.cc#L568C7-L568C25).
For people using the function as documented (i.e. expecting the `authTagLength` option to default to 16 bytes), the warning is never shown unless an attack is on the way.

## Steps To Reproduce:
The following script shows how the default `authTagLength` of 16 bytes is not enforced and allows for implicit shorter tags.
It also shows that the deprecation warning is only shown when an attacker truncates the authentication tag (or when it's explicitly truncated, but that's not the scenario where people are in unknown danger).

```js
const {
    createCipheriv,
    createDecipheriv
} = require('crypto');

const key = 'key0123456789key';
const nonce = '123456789012';

var algo = 'aes-128-gcm';
const cipher = createCipheriv(algo, key, nonce);
const plaintext = 'This is some plaintext';

const ciphertext = cipher.update(plaintext, 'utf8');
cipher.final();
const tag = cipher.getAuthTag();


var decipher = createDecipheriv(algo, key, nonce);
decipher.setAuthTag(tag);
var decryptedPlaintext = decipher.update(ciphertext, null, 'utf8') + decipher.final();

console.log('Decrypted with full tag: ' + decryptedPlaintext);

console.log('---------------------------------');

decipher = createDecipheriv(algo, key, nonce);
// Truncating the authentication tag
decipher.setAuthTag(tag.subarray(0, 4));
decryptedPlaintext = decipher.update(ciphertext, null, 'utf8') + decipher.final();
console.log('Decrypted with truncated tag: ' + decryptedPlaintext);
```

Observe how the deprecation warning message is only shown for the latter and how a truncated authentication tag successfully allowed decryption (even if "the `authTagLength` option defaults to 16 bytes and must be set to a different value if a different length is used.)
{F5115107}

###For code references:
The deprecation warning message is emitted [here](https://github.com/nodejs/node/blob/ebf38d825d20f14a80405be182cfaa568c1eb99f/src/crypto/crypto_cipher.cc#L567-L577).
The auth tag is set with `setAuthTag` in which the tag length taken [here](https://github.com/nodejs/node/blob/ebf38d825d20f14a80405be182cfaa568c1eb99f/src/crypto/crypto_cipher.cc#L542-L546) is set implicitly [here](https://github.com/nodejs/node/blob/ebf38d825d20f14a80405be182cfaa568c1eb99f/src/crypto/crypto_cipher.cc#L579-L582).

## Impact

- Ciphertexts can be modified to decrypt to an arbitrary value
- Ciphertexts can be decrypted by observing parsing differences
    - For example, if the decrypted data is expected to be JSON, it's possible to observe valid/invalid JSON parsing to decrypt the ciphertext just like with padding oracles
- The GCM internal GHASH key can be recovered (to compute more arbitrary authentication tags without need for bruteforce)
    - Requires rotation of the encryption keys

Considering how the `createDecipheriv` function is documented, this completely breaks the integrity and confidentiality of the encryption scheme that people expect from this API.

## Timeline

- **Report Filed**
- **2025-12-14** @tniessen: Thank you for the report @sideni. While I agree that the current behavior is undesirable and that the documentation can be improved, this unfortunately is a known issue and has been publicly discussed at length. See, for example, [nodejs/node#17523](https://github.com/nodejs/node/issues/17523) and, more recently, [nodejs/node#52327](https://github.com/nodejs/node/issues/52327). Misuse of the API was only recently deprecated and will be moved to end-of-life soon.

The current behavior is due to the `node:crypto` module closely mirroring OpenSSL in many regards, including  this one. And, while we have been aware of this issue for a while, we were unable to change the behavior without going through deprecation cycles because some applications rely on the current behavior (i.e., the user application validates the authentication tag length).

Given that this behavior has been publicly documented for at least eight years, I do not see the need to treat this known issue as a vulnerability. I would be happy to propose the move to end-of-life status with the next major release of Node.js. Please let me know in case you disagree, or in case I missed some detail that goes beyond the public discussions of this issue.
- **2025-12-15** @sideni: I had seen the older issue and didn't want to reopen the conversation there, that's why I submitted here (but, I hadn't seen the more recent issue, thanks for sharing @tniessen). As I've been researching about that OpenSSL behavior in many languages (presented this year at NorthSec and I'm close to publishing a blog post on the topic), I thought it would be better to try and get things fixed first.

While I agree this has been publicly discussed in GitHub issues, I doubt it's publicly known to developers. Let's face it, lots of people don't read documentation (which wouldn't help here as it's mistaken) and even less people dig into GitHub issues :/
This issue being known to Node.js maintainers, I don't mind if we don't treat this as a vulnerability.

My concern is with people using the feature as documented without knowing they are at risk.
With how the feature is being deprecated, only those that rely on the current behavior know it's close to stop working.
The others don't even know that they are vulnerable.

Even if this is not handled as a vulnerability, I'd be happy to see a documentation update (with a warning or something) OR if the deprecation warning could be given to anyone not specifying the `authTagLength` option on `createDecipheriv` (instead of only those explicitly truncating or being actively exploited).
I know this is not optimal, but it feels weird to keep folks vulnerable because of a few using a broken behavior :/

I also want to say thanks for being opened to discussing this :)
- **2025-12-15** @tniessen: Thank you for your thoughtful response @sideni. I am going to do the following, unless there are objections (cc @panva_):

1. Close this report as informative. You can then request public disclosure of the report for the sake of transparency and visibility.
2. Create a documentation pull request to warn more visibly about the current behavior. This will be visible in the next regular release of Node.js.
3. Create a pull request moving the current deprecation to end-of-life status. This will take effect in the next major release of Node.js.

Please let us know if this plan sounds reasonable. You would, of course, be welcome to chime in through related public discussions on GitHub as well.
- **2025-12-15** @sideni: That plan sounds good, thanks to you @tniessen!
- **Report Informative**
- **2025-12-16** @tniessen: Documentation PR: https://github.com/nodejs/node/pull/61082
End-of-Life PR: https://github.com/nodejs/node/pull/61084
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
