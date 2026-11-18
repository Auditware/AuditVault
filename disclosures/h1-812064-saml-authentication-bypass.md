---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - vuln/authentication-bypass
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2020-06-18
submitted: 2020-03-06T10:09:08.702Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "tomp1"
source: "https://hackerone.com/reports/812064"
title: "SAML authentication bypass"
---
# SAML authentication bypass

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Rocket.Chat | **Disclosed:** 2020-06-18

- Report: [https://hackerone.com/reports/812064](https://hackerone.com/reports/812064)
- CWE: Improper Authentication - Generic
- Submitted: 2020-03-06T10:09:08.702Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

When using SAML authentication, responses are not checked properly. This allows attacker to inject/modify any assertions in the SAML response and thus, for example, authenticate as administrator.

## Description

Following code snippets are from *app/meteor-accounts-saml/server/saml_utils.js*
When checking the signature, the first Signature element which is found in the whole response XML is used:

`316 const signature = xmlCrypto.xpath(doc, '//*[local-name(.)=\'Signature\' and namespace-uri(.)=\'http://www.w3.org/2000/09/xmldsig#\']')[0];`

 After the XML signature has been verified, the code proceeds to use the first Response element found in the whole XML to get assertions and attributes. 

`516 const response = doc.getElementsByTagNameNS('urn:oasis:names:tc:SAML:2.0:protocol', 'Response')[0];`

**However there is no check that the signature that was checked relates to the response element that is being used.** Thus attacker can take a valid SAML response, with some valid signature, and add Response element, that has no signatures, in the beginning of the XML. The code finds the original signature and validates that, but proceeds to use the malicious Response element, which is found first in the document.

Also the validating the status from the response happens before signature validation

`501 const statusValidateObj = self.validateStatus(doc);`

## Releases Affected:

Tested on 3.0.3 but appears to affect all versions based on the history of saml_utils.js file.

## Steps To Reproduce (from initial installation to vulnerability):

  1. Configure the application to use SAML authentication
  1. When logging in, intercept the POST request with a proxy tool
  1. Use the attached `samlbypasspoc.py` file to create a new value for the parameter `SAMLResponse`. Run the script in python3 with the URL encoded SAMLResponse as argument.
  1. Replace the parameter value with the one given by the POC script and forward the request

This requires altering the POC to suite the configuration. Beginning from the line 25, you can alter the response elements as needed to desired values. 

In the sample POC file, attributes `OrganizationName` and `Email` and the element `NameID` are changed. In the setup I tested this resulted in login as a newly created admin.

## Supporting Material/References:

  * samlbypasspoc.py

## Suggested mitigation

  * Refactor the code so that the same elements (references) are used when checking the signature and when reading the attributes
  * Do not use hard coded indexes when selecting the elements

## Impact

SAML authentication can be bypassed and attacker can log in as any user (e.g. admin user)

## Timeline

- **Report Filed**
- **2020-03-06** @markus-rocketchat: Hi @tomp1 

thanks for your report. We appreciate your help to make Rocket.Chat more secure!

Before I triage it though, I want to clarify some assumptions for this exploit to work, because they will impact the triage.

Do I understand right that to make this attack work, you need at least:
(SAML authentication enabled, obviously)
1. SSL not being used AND
2. knowledge about parameters you want to exploit with the modified assertion, e.g. the admins email

About step 2, this would be knowledge you could not generate with this exploit alone, so you would need pre-knowledge. 
Overall this does not seem to be an exploit you could randomly pull off on an RC instance without prior knowledge, so I´d set its severity to medium.

Please share your thoughts, or what prerequisites are needed in your opinion for this exploit to work
- **2020-03-06** @tomp1: Hi!
Thanks for the reply.

1. TLS doesn't help here. Obivously you (the attacker) can MitM your own traffic, even if the site uses or forces HTTPS with HSTS. This is how security testing can be done. You configure your proxy software's (e.g. Burpsuite) CA to you browser and then you can intercept the traffic. 

So a short answer: Attack works regardless if TLS is used or not.

2\. This depends on how this is configured and how assertions are used. In the use case I was testing login happens with SAML and if  the user id in the assertion was not known, a user was created. Further, role was mapped from OrganizationName attribute. In this case, no knowledge of admin user email addresses are needed. You can create a completely new user if you do not know the admin email/username. 
You are correct that in some cases pre-knowledge might be needed (e.g. if assertion is encrypted). When assessing the severity however, we should look at the worst case. 

I disagree that this would not be an exploit that could be easily pulled off without pre-knowledge in most use cases. All you need to do is look at the SAML response structure (if not encrypted) and read/debug the source code of the application to create an exploit in most cases. For example the use case I was testing (not developed by me) did not require pre-knowledge.
- **2020-03-06** @tomp1: Just to add on to the suggested mitigation. Using some SAML processing library would be recommended instead of doing it yourself. There are many things that can go wrong with SAML processing and it needs to be done carefully. 

For examples see:
<https://duo.com/blog/duo-finds-saml-vulnerabilities-affecting-multiple-implementations>
<https://www.usenix.org/system/files/conference/usenixsecurity12/sec12-final91.pdf>
- **Report Triaged**
- **2020-03-19** @tomp1: Hello!
Any update on this? I see you have some commit in github trying to fix the issue: <https://github.com/RocketChat/Rocket.Chat/commit/1d0970aaf623ad6da2d8b26de86007670e03d60c>

With a quick glance, **this doesn't fix the issue at all.** You are still assuming the order of the elements, and the attacker can change the that. So for example a working bypass could be as follows: 

<evil response>
      <signature with reference "x">
      <evil assertion>
</evil response>
<original response with reference "x">
     <ogirinal assertion>
</original response>

This would pass the signature test and evil assertion would be used.  In your fix you validate against the whole XML but select the first response and signature element. Again no checking of what is validated and what is used. **The issue persists.**

Further more: In SAML you can also sign assertions. If IdP uses this method, again it is easy to bypass with your code. Also you sill validate the status **before** the signature.

In a nut shell: I still **STRONGLY** suggest you take into use some established SAML processing library. Parsing the XML yourself is just too risky. Please read the papers I linked above.
- **2020-03-19** @markus-rocketchat: Hi @tomp1 

thank you very much for your proactive approach and tips. This is truly awesome.

You really have an indepth knowledge of this and for us, SAML is sometimes still a bit of a learning curve. Would you be interested to chat with me and the developers on our open Rocket.Chat server on this topic? This could be faster/more interactive and prevent us from going in the wrong direction.

https://open.rocket.chat

If you are, please feel free to contact me there under my username there markus.kirsch and we can get the conversation going. This will not be to your disadvantage :)

Would be great to have a chat with you.

Best
Markus
- **2020-03-26** @hudell: Hi @tomp1,
we will evaluate switching to an established SAML library, but meanwhile, if we refuse any XML with multiple responses or multiple response signatures, will it help with this specific issue?
- **2020-03-27** @tomp1: Hello!
Sorry, I honestly haven't had time to come chat with you to your chat server. Also I don't consider myself as an expert in implementation of SAML, I come at this from a security tester point of view. Hence my recommendation of using something external.

To your other question: I think there would still be problems when assertions are signed instead of responses, which is often the case. So let's take a scenario where IdP signs an assertion inside the response instead of the whole response element.
The problem would again manifest in that the attacker would place two assertion elements inside the response: one that is signed (the original) and the other one is the evil one. Then the XML signature check would be valid but you would use the evil one.

So here the problem would again be that there are no checks that the (assertion) element you take from the response and use is signed. You check that the XML signature is valid, but that only checks that **something** has been signed. It does not guarantee that the element you use is signed.

If you add some kind of checks that would prevent attackers from using these kind of techniques (changing element orders) there still could be other attack vectors, like the one in the first link i posted above. So we get back to my original recommendation of using an external library and keeping that up to date with fixes they make.
- **2020-05-19** @tomp1: Can this be marked as Resolved?
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
