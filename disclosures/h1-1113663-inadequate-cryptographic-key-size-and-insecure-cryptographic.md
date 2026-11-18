---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/use-of-a-broken-or-risky-cryptographic-algorithm
  - env/web
substate: "not-applicable"
weakness: "Use of a Broken or Risky Cryptographic Algorithm"
enriched: true
body: true
date: 2021-03-08
submitted: 2021-03-01T09:37:07.101Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/curl|curl]]"
reporter: "sanchitcfc"
source: "https://hackerone.com/reports/1113663"
title: "Inadequate Cryptographic Key Size and Insecure Cryptographic Mode.  File Name :- curl_ntlm_core.c"
---
# Inadequate Cryptographic Key Size and Insecure Cryptographic Mode.  File Name :- curl_ntlm_core.c

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 1 | **Program:** curl | **Disclosed:** 2021-03-08

- Report: [https://hackerone.com/reports/1113663](https://hackerone.com/reports/1113663)
- CWE: Use of a Broken or Risky Cryptographic Algorithm
- Submitted: 2021-03-01T09:37:07.101Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The application is generating cryptographic keys or key pairs using a short and inadequate length.
This application is using the ECB (Electronic Codebook) mode of operation to perform encryption, which is considered semantically insecure.

Vulnerable File name :- curl_ntlm_core.c
Vulnerable line no. 274 :- err = CCCrypt(kCCEncrypt, kCCAlgorithmDES, kCCOptionECBMode, key,

## Impact

If a message with identical blocks is encrypted, an attacker get a certain advantage to have information on plaintext, by only observing CipherText.

## Timeline

- **Report Filed**
- **2021-03-01** @dgustafsson: Thanks for the report, we will investigate and get back to you.
- **2021-03-01** @sanchitcfc: Sure, thanks
- **2021-03-01** @bagder: NTLM implies using DES. curl cannot magically switch off DES as then it can't do NTLM. I don't see how this is a choice for curl to make, as long as we support NTLM...
- **2021-03-01** @sanchitcfc: Initialize the generator with a bigger key. RSA/DSA: must be at least 2048 bits long. Blowfish, DES and other symmetric encryption algorithms: at least 128 bits long.
- **2021-03-01** @sanchitcfc: Use the cryptographic algorithm in Galois/Counter Mode (GCM) with no padding. In Java, if you are using simply Cipher.getInstance("AES"), beware it defaults to the ECB mode, which is semantically insecure.
- **2021-03-01** @sanchitcfc: I hope this helps.
- **2021-03-01** @bagder: DES has a fixed key size, and NTLM too. It's not a choice we can make!
- **2021-03-01** @sanchitcfc: From what I read online, there are some ways to make it more secure.  By increasing the key size or changing it to 256 bits AES.
The DES keys are 64-bit, 128-bit, and 192-bit keys that use the DES algorithm to perform the cryptographic function. A 64-bit key is referred to as a single-length key. A 128-bit key is referred to as a double-length key. Triple-length keys are 192-bits in length. Only DATA keys can be triple-length. (From IBM Official site)
I am attaching some links that can help you out :-
https://www.ibm.com/support/knowledgecenter/en/SSLTBW_2.3.0/com.ibm.zos.v2r3.csfb400/des_keys.htm
https://www.researchgate.net/publication/337108251_Expanded_128-bit_Data_Encryption_Standard
https://www.researchgate.net/post/Can_we_use_large_key_and_block_size_in_block_ciphers_for_increasing_the_security_level
https://www.irjet.net/archives/V2/i4/Irjet-v2i4170.pdf
- **2021-03-01** @dgustafsson: It's true that DES supports two modes of operation, CBC and ECB, both with the same fixed keysize and blocksize. Using DES-CBC does improve on the security of DES, but only by a hair making amusingly easy to crack whereas ECB is comicly easy. Both can be cracked in well under a day using commodity tools.

That being said, reading up on the NTLM specs for the LM Hash makes it pretty clear that the algorithm **require** the use of DES-ECB. As @bagder also points out upthread: there is no option to use another cipher than DES and there is no other keysize  or blocksize in DES.

This is not a security problem with curl, it's an imperfect authentication protocol which curl implements according to its spec. Unless there is additional information supplied with supports the claim that this is a problem with the **curl implementation of NTLM**  this will be closed as n/a.
- **2021-03-01** @sanchitcfc: Okay, so can't Curl just use 128 bits key DES? TO make it more secure?
Was just looking to be rewarded something for my hardwork and time going through tons of data.
- **2021-03-01** @dgustafsson: If you went through tons of data, surely you came across the DES entry on Wikipedia as part of that research? DES has a fixed key size of 56 bits, there is no such thing as 128 bit DES.
- **2021-03-01** @sanchitcfc: Ohh, so what does this mean exactly?
The DES keys are 64-bit, 128-bit, and 192-bit keys that use the DES algorithm to perform the cryptographic function. A 64-bit key is referred to as a single-length key. A 128-bit key is referred to as a double-length key. Triple-length keys are 192-bits in length. Only DATA keys can be triple-length.
I found this content from the IBM website.
Also, found this solution :-
Initialize the generator with a bigger key. RSA/DSA: must be at least 2048 bits long. Blowfish, DES and other symmetric encryption algorithms: at least 128 bits long.
On syhunt, which is a vulnerability scanner. Under the solution for these type of issues.
- **2021-03-01** @dgustafsson: Interesting, I would like to read more about this. Please provide a link to the information you are quoting from.
- **2021-03-01** @sanchitcfc: https://www.ibm.com/support/knowledgecenter/en/SSLTBW_2.3.0/com.ibm.zos.v2r3.csfb400/des_keys.htm

For the IBM site.
- **2021-03-01** @sanchitcfc: Also, I have provided some other links previously in the chat of some forum where people are talking about increasing the key size. Please go through those links as well.
- **2021-03-01** @sanchitcfc: This is a snapshot from the syhunt premium tool, of which I have access to and used it as one of the tool to scan the source code. The solution in this premium tool also states : -  Initialize the generator with a bigger key. RSA/DSA: must be at least 2048 bits long. Blowfish, DES and other symmetric encryption algorithms: at least 128 bits long.
So, I guess it means there are ways available to patch this vulnerability by increasing the DES key to 128 bits.
- **2021-03-01** @sanchitcfc: https://www.researchgate.net/publication/337108251_Expanded_128-bit_Data_Encryption_Standard
https://www.researchgate.net/post/Can_we_use_large_key_and_block_size_in_block_ciphers_for_increasing_the_security_level
https://www.irjet.net/archives/V2/i4/Irjet-v2i4170.pdf
Some additional links.
- **2021-03-01** @dgustafsson: The IBM website you link to is, rather sloppily I would argue, referring to 3DES as DES. There is some merit to this as 3DES is the DES s-box three times, but that doesn't mean that the two are interchangeable in a symmetric crypto.

Please address the elephant in the room here before sending more links and namedropping ciphers which are better than DES: the LM Hash in NTLM is specified to use DES-ECB. If you need a refresher on how it's computed and used I recommend this paper: http://www.uninformed.org/?v=3&a=2&t=pdf. Please tell us how we can make curl NTLM compliant and compatible by changing from DES in the LM Hash step.
- **2021-03-01** @sanchitcfc: Ok, since you are cyber security expert with Curl and me being a freelancer, I can say that you have much more knowledge and experience in this field as compared to me. I dont want to argue and respect your knowledge. I shared the information I had from different websites and the syhunt premium tool. I cant exactly tell you the steps you need to take to patch this vulnerability. Still, if you feel that I was of any help and value my work, then please reward me something for my work. If not, then no worries, it was a great experience and learnt a lot of things.
Thanks.
- **2021-03-02** @bagder: I would never claim to be a "cyber security expert".

NTLM uses DES this way and there's no alternative cipher or key lengths to be specified while maintaining compatibility. Yes, that makes NTLM weak but I don't think anyone claims anything else and in curl we support this legacy (and weird) authentication mechanism because it is still fairly widely used in the world and as a feature in curl.

When we follow and implement a protocol someone else has designed and we need to do it this way to interoperate, then I claim it is not a vulnerability specifically in curl.
- **2021-03-02** @sanchitcfc: Ok, I understand. If you feel my work should be awarded for my time and efforts then that would be great for me. If not, I really appreciate your time and got to learn something.
- **Report Not Applicable**
- **Agreed On Going Public**
- **2021-03-03** @sanchitcfc: Ok
- **Manually Disclosed**
