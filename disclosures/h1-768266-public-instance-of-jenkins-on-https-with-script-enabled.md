---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - stack/java
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2020-01-31
submitted: 2020-01-04T21:46:01.280Z
bounty_usd: null
votes: 118
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "niteshsurana"
source: "https://hackerone.com/reports/768266"
title: "Public instance of Jenkins on https://██████████/ with /script enabled"
---
# Public instance of Jenkins on https://██████████/ with /script enabled

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 118 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-01-31

- Report: [https://hackerone.com/reports/768266](https://hackerone.com/reports/768266)
- CWE: Code Injection
- Submitted: 2020-01-04T21:46:01.280Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
An Amazon instance was found on https://█████/ running Jenkins. On analysing the SSL certificate, I reported here to the DoD.

**Description:**
On checking the SSL certificate, the details show:

```
Issued to and Issued By records:

CN: █████
Organization(O): █████████
Organizational Unit (OU): ███
```
Here, this instance is already authenticated and this does not require a password to login. The major impact of this vulnerability is, an attacker can exploit and gain access to critical internals of the server as `/script` is enabled.

Through `/script`, an attacker can run remote commands on the server through the Java programming language.

## Impact

Unauthenticated instances of Jenkins with `/script` enabled can lead to an attacker running remote command on the instance.

## Step-by-step Reproduction Instructions

1. Go to https://███/script/
  1.1 Check the SSL certificate for proof.

2. In the textbox that comes up, enter the following code:

```bash
"ls /".execute().text
```

3. The Response is

```
Result: bin
boot
dev
etc
home
lib
lib64
media
mnt
opt
proc
root
run
sbin
srv
sys
tmp
usr
var
```

After verifying this issue, I looked up `██████████` and `█████`. That's how I confirmed that this instance was of critical importance.

## Product, Version, and Configuration (If applicable)

Jenkins

## Suggested Mitigation/Remediation Actions:

Mitigation for this, as per my understanding would be to add a 2FA authentication if this instance is in use. If this instance is not in use, please shut down the instance.

P.S: I've also attached a PoC video of the same for clarity and reference. I am reporting this issue to the US DOD as ██████████ would be more logical to be associated with the DOD. If this bug is not acknowledged here, please forward this report to the authority that handles the US ███████.

## Impact

On a Jenkins instance with `/script` enabled, an attacker can remote commands on the server and this can later lead to critical information leakage, lateral movement and other catastrophic events as the instance can be manipulated by the skills of the attacker.

Such instances should be closed when not in use and authentication mechanisms should be properly enforced.

## Timeline

- **Report Filed**
- **2020-01-04** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **2020-01-07** @agent-l8: @niteshsurana I do see where you said you didnt need a login, we are trying to replicate now. Please let us know if you have further information.
- **Report New**
- **Report Triaged**
- **Report Severity Updated**
- **2020-01-07** @agent-l8: @niteshsurana at this time, as we were not able to reproduce this at all, there is no severity linked with this finding. That said, we pushed it through (and you should still get points), mainly as an informational to the system owner to ensure that they have control and have locked things down. Thanks again for the report and we will keep you updated as we are able.
- **2020-01-07** @niteshsurana: Absolutely appreciate your quick response on the issue and looking forward to report vulnerabilities as I find.

Thanks for the feedback!
- **Report Severity Updated**
- **2020-01-07** @niteshsurana: Hi @ag3nt-j1 ,

Apologies for being afk, I totally forgot about one erroneous thing that I noticed then. The output of "ps aux" on the server showed a weird output:

```bash
"ps aux".execute().text
```

Response: Please check the attachment labelled weird_output.png

Now, from the output we see that this server was being used by a botnet to mine Monero Cryptocurrency coin. I found that this is a botnet by looking up the `user id` field online. Here are the links supporting my claim:

[Google Results](https://www.google.com/search?q=%2246sfbbM3XSjBo54d5a8PYUU5yQ31x6Rpv6tBhe22Cd7VYeJUyFUhzBF5rTf1oTB1d8MqgHxX5RbbEEKZd8fBAAmcFfv9Y5c%22)

https://www.codetd.com/en/article/8405207

https://blog.verysu.com/mobile/article/398

[Pastebin link of the script](https://pastebin.com/rsdzW7C7)

Various articles all pointing towards the fact that this is a botnet, mining monero cryptocurrency on servers that have RCE vulnerability. I am not sure how big a finding this is, but this will surely help the owner of this instance understand about what happened on the instance.
- **2020-01-08** @agent-r5: Good morning niteshsurana,
We do not see the attachment weird_output.png. Would you please repost it?
- **2020-01-08** @niteshsurana: Apologies for the above error.
- **Report Severity Updated**
- **2020-01-14** @niteshsurana: Hi, 

The issue is reproducable. Please check.
- **Report Resolved**
- **2020-01-21** @niteshsurana: Woah! That was really quick!

Glad that I actually reported a security issue on the DoD. Feels GREAT! Also, can I go ahead and mention this on my LinkedIn profile

the fact that I got acknowledged by the US Department of Defense?
- **2020-01-21** @agent-r5: So we can add this report to the queue for disclosure. Please toggle the request on your side so we can track it. A note once it goes through the disclosure process you can link the redacted report directly on your linkdin for your mention. Normally we also put something out on twitter.
- **2020-01-21** @niteshsurana: Okay. So how do I toggle a disclosure request ?
- **2020-01-21** @agent-r5: picture is easier than words.
- **Agreed On Going Public**
- **2020-01-21** @agent-r5: No worries. Thank you for supporting the DOD VDP. As a note disclosure may take awhile.
- **2020-01-21** @niteshsurana: I'll be patient enough. Thanks!
- **Agreed On Going Public**
- **Report Became Public**
- **2020-01-31** @niteshsurana: Thanks a lot! :')
- **2020-02-11** @niteshsurana: Hi @ag3nt-j1 , I have a query. Can I go ahead and publish a blog on how I found the instance? It would be better if I could share an initial draft with you and post approval, would publish it.
- **2020-02-11** @agent-r5: lets go with pre approval route. Send it to VDP-Questions@dc3.mil when ready. Guidelines basically do not tell anything specific which system it was. Similar to how we redacted it on hackerone.
- **2020-02-11** @niteshsurana: Thanks. I'll be sharing right away and only after an approval, I'll proceed with the blog.
