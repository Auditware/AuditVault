---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/null-pointer-dereference
  - env/web
substate: "informative"
weakness: "NULL Pointer Dereference"
enriched: true
date: 2023-09-20
submitted: 2023-09-19T09:41:20.922Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/curl|curl]]"
reporter: "s0urc3_"
source: "https://hackerone.com/reports/2171309"
title: "NULL Pointer dereference in idn.c"
---
# NULL Pointer dereference in idn.c

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 9 | **Program:** curl | **Disclosed:** 2023-09-20

- Report: [https://hackerone.com/reports/2171309](https://hackerone.com/reports/2171309)
- CWE: NULL Pointer Dereference
- Submitted: 2023-09-19T09:41:20.922Z

## Timeline

- **Report Filed**
- **2023-09-19** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2023-09-19** @bagder: This report accurately identifies a possible null pointer dereference when curl is built with libidn2, but at runtime it fails to load a new enough version and `idn2_check_version()` returns NULL.

This causes a crash/segfault:
~~~
Program received signal SIGSEGV, Segmentation fault.
0x0000555555605acf in Curl_idnconvert_hostname (host=0x5555556d58f8) at idn.c:267
267           if(!*decoded) {
(gdb) p decoded
$1 = 0x0
~~~

However, I cannot see how this can be turned into a security problem. The proposed impacts listed above are simply not relevant to this case.
- **2023-09-19** @s0urc3_: Hi @bagder 
Thanks for your fast answer. 

Imho it can be leverage to DoS a service or cause a crash. The RCE, even if is less likely to happen, could be possible in a more complex attack.  All that said, this vulnerability stays  a very nice exploit primitive for an attacker to use.

On my side this represent a clear security vulnerability.
- **2023-09-19** @bagder: > Imho it can be leverage to DoS a service or cause a crash

How?  That function will either work or return NULL (if curl is given an IDN name), an attacker cannot otherwise make that happen.

> The RCE, even if is less likely to happen, could be possible in a more complex attack

This is not an RCE and it cannot become one.

> All that said, this vulnerability stays  a very nice exploit primitive for an attacker to use.

Please elaborate on how an attacker can use this.
- **2023-09-19** @s0urc3_: Hi @bagder 
I'm not focusing on developing exploits. I am focused on reading code and trying to find pattern that are problematic. 

Imho this issue is more than valid and should be treated as such. You can re-evaluate the impact/severity to High instead of Critical if you truly doubt the exploitability. For me, if it causes crashes it can definitely be used in an harmful manner. It's also a valid exploit primitive. 

If you want to understand more deeply how it can be exploited here is some leads:
- https://0x00sec.org/t/kernel-exploitation-dereferencing-a-null-pointer/3850
- https://www.abatchy.com/2018/01/kernel-exploitation-6
- https://access.redhat.com/articles/20484

Regards
- **2023-09-19** @bagder: > if it causes crashes it can definitely be used in an harmful manner

You cannot just repeat a totally weak and lame argument and think that I will treat it differently the second time.

A NULL pointer dereference *could* be a security problem in the general case, but there needs to be a set of criteria to meet first for that to become true and you have not explained how those are met in this case and I have not seen how they can be met.

This crash happens only on a somewhat broken/misconfigured system config, which no attacker can trigger without pretty much owning the machine where curl runs. And if they do that, they can already do much more fun things than just causing a mere segfault.

So again: if you can explain to me how you convert this flaw into a security issue then I am very interested in learning. If not, then it is not a security problem. And please be specific, I don't need to read about how general null pointer dereferences can be used. I'm asking about *this specific* flaw.
- **2023-09-19** @s0urc3_: I want to clarify that I'm not responsible for setting the rules here. However, it's clear that I have identified a valid bug in your system, which qualifies for your bug bounty program. According to the Common Weakness Enumeration (CWE), this vulnerability is categorized as high risk.

You've already demonstrated that it can lead to system crashes, which is a significant concern. I'm not inclined to spend extensive time developing an exploit for educational purposes. Instead, I encourage you to proceed with the process for a payout as outlined in the bug bounty program guidelines. 

Cheers.
- **2023-09-19** @bagder: Sorry, that is not how this works. You have identified a **bug**. Not a security problem. There is a CWE for the cases when it indeed is a problem. I will leave this open for a while longer in case you or someone else in the team figures out a detail or two that changes the assessment.
- **2023-09-19** @s0urc3_: Ok, leave it open. I'll work on an exploit.
- **2023-09-19** @bagder: It would be enough with an explanation on how said exploit would work.
- **2023-09-19** @s0urc3_: Okay. I'm working on it. Could you tell me in which conditions did you produced/how to reproduce this crash?

This report accurately identifies a possible null pointer dereference when curl is built with libidn2, but at runtime it fails to load a new enough version and idn2_check_version() returns NULL.
This causes a crash/segfault:
```
Code 189 BytesWrap lines Copy Download
Program received signal SIGSEGV, Segmentation fault.
0x0000555555605acf in Curl_idnconvert_hostname (host=0x5555556d58f8) at idn.c:267
267           if(!*decoded) {
(gdb) p decoded
$1 = 0x0
```
- **2023-09-19** @bagder: > Could you tell me in which conditions did you produced/how to reproduce this crash?

~~~diff
diff --git a/lib/idn.c b/lib/idn.c
index 1f31a9546..8bd01252b 100644
--- a/lib/idn.c
+++ b/lib/idn.c
@@ -155,11 +155,11 @@ bool Curl_is_ASCII_name(const char *hostname)
 static CURLcode idn_decode(const char *input, char **output)
 {
   char *decoded = NULL;
   CURLcode result = CURLE_OK;
 #ifdef USE_LIBIDN2
-  if(idn2_check_version(IDN2_VERSION)) {
+  if(idn2_check_version("99999")) {
     int flags = IDN2_NFC_INPUT
 #if IDN2_VERSION_NUMBER >= 0x00140000
       /* IDN2_NFC_INPUT: Normalize input string using normalization form C.
          IDN2_NONTRANSITIONAL: Perform Unicode TR46 non-transitional
          processing. */
- **2023-09-19** @dgustafsson: While I await the exploit for final judgment, I agree with @bagder that there is no vulnerability in the material presented thus far.
- **2023-09-20** @s0urc3_: Hi, sorry for the delay I had to deep dive into advanced exploits techniques to understand exactly how it could or not be exploited. Here is what I concluded:

{F2712922}

This exploit would be very hard to craft since it would require some sort of EIP control to make the CPU execute a ROP chain then obtaining a shellcode or an LPE. This scenario is very unlikely, I'm not saying it's not exploitable but it would be very hard to actually execute it.

Knowing that difficulty and very unlikely exploitation I agree with your decision to close it as informative or non-applicable.

Cheers
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
