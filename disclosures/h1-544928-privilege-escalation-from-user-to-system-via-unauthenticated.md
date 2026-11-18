---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - vuln/ssrf
  - vuln/command-injection
  - vuln/code-injection
  - vuln/broken-access-control
  - vuln/privilege-escalation
  - impact/rce
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2019-11-08
submitted: 2019-04-22T00:58:17.010Z
bounty_usd: null
votes: 553
cve: "CVE-2019-15595"
program: "[[programs/ui|Ubiquiti Inc.]]"
reporter: "b0yd"
source: "https://hackerone.com/reports/544928"
title: "Privilege Escalation From user to SYSTEM via unauthenticated command execution "
---
# Privilege Escalation From user to SYSTEM via unauthenticated command execution 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 553 | **Program:** Ubiquiti Inc. | **Disclosed:** 2019-11-08

- Report: [https://hackerone.com/reports/544928](https://hackerone.com/reports/544928)
- CWE: Command Injection - Generic | CVE: CVE-2019-15595
- Submitted: 2019-04-22T00:58:17.010Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The vulnerability, or feature depending how you look at it, is the ability to execute commands using the 
evostream API interface that is exposed on localhost:7440. Since the evostream service is running as SYSTEM a user can use the launchprocess command,  http://docs.evostream.com/2.0/launchProcess.html, to execute any binary with supplied arguments. The only thing that is keeping this "feature" from allowing remote code execution is the fact that it listens on localhost only. However, if it were couple with an SSRF, an attacker could achieve full remote code execution.

## Impact

The ability to run arbitrary commands as SYSTEM from any user.

## Timeline

- **Report Filed**
- **2019-04-22** @h1_analyst_decimo: Thank you for reporting this potential issue, 

Your report is currently being examined by the HackerOne triage team. You will receive further details, or questions, as soon as technically possible. Thanks for your patience.

Cheers,
@still
- **Report Needs More Info**
- **Report New**
- **2019-04-28** @b0yd: UniFi Video Server, the POC also requires the websocket-client python library. I realize rereading the description it may have been confusing that this report is for the UniFi Video Server. The evostream software described in the original disclosure is installed and used by the UniFi Video Server software.
- **Report Triaged**
- **Bounty Awarded**
- **2019-06-24** @b0yd: Have there been any updates on this?
- **2019-07-02** @ubnt-rubens: @b0yd We are currently testing the fix.
- **2019-07-23** @b0yd: UPDATE:  Per my original suspicion, I was able to achieve full RCE by hosting a javascript payload remotely that sends websocket requests to the evostream webserver on localhost. I've attached the javascript POC and a video showing the execution of calc.exe from a webpage. I'll leave it up at https://www.securifera.com/rce0923234.html if you'd like to test it out. As this bug is getting close to being closed out, could you please update the severity score to 9.6 (https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator?vector=AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:H) to reflect its true severity.

FYI, once you have a patch ready to be tested for it, let me know and I'm more than willing to confirm the fix.
- **2019-07-25** @ubnt-rubens: Hello @b0yd,

Could you please test the beta {F539432}?

Thanks
- **2019-07-25** @b0yd: I tested the attached beta and it appears client certificate authentication has been added which secures it against the current POC. At this point an attacker would have to at least get access to the client certificate to connect to the service. If you would like me to investigate further I can but that could require more effort to track down the certificate and see if it's possible for an attacker to use it to get to the next step of verification.
- **2019-07-26** @b0yd: With the confirmation of remote code execution with this bug, does it qualify for a higher bounty as reflected in the Ubiquity program page? Being fairly new to Hackerone, this is more a question in regards to procedure than anything else.
- **2019-07-30** @ubnt-rubens: Hi @b0yd,

The bounty is calculated using the CVSS (the "Severity")  score, the report score is `7.8`.

If you disagree with this score, let me know and please explain how, I'll reevaluate this score.

let us know if you disagree with this
- **2019-07-30** @b0yd: Ok, so originally the bug was categorized and rated as a local privilege escalation vulnerability from user to SYSTEM privileges with the following CVSS score using Hackerone's in report calculator.


Using Hackerone's CVSS v3.0 Calculator - __7.8__

	Attack Vector - Local
	Attack Complexity - Low
	Privileges Required - Low
	User Interaction - None

	Scope - Unchanged
	Confidentiality - High
	Confidentiality - High
	Confidentiality - High

With the confirmation and proof of remote exploitation, attachment F535512, F535513, the vulnerability is now categorized as a remote code execution vulnerability. This changes a few components of the CVSS score. The attack vector can now be exploited over the network, no privileges are required, the scope is changed, and user interaction is required. Per Hackerone's CVSS calculator, that changes the score to a 9.6 as shown below.

Using Hackerone's CVSS v3.0 Calculator - __9.6__

	Attack Vector - Network
	Attack Complexity - Low
	Privileges Required - None
	User Interaction - Required

	Scope - Changed
	Confidentiality - High
	Confidentiality - High
	Confidentiality - High
	
	
If you agree with this then I would think it would appropriate to adjust the score. Thoughts?
- **2019-08-06** @b0yd: Do you agree with the updated CVSS component values and overall score based on my explanation?
- **2019-09-25** @b0yd: At almost 5 months since submission, are there near term plans to close this out? If so I'd like to request having a CVE issued given the severity of the issue and its existence in publicly distributed software. Do you have any objections to that plan?
- **2019-10-06** @b0yd: It appears the latest release remedies this vulnerability. Can you please update the severity score and close this report?
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
- **2019-11-08** @ui-wasp: Hi @b0yd - Sorry the late response, we reviewed internally the proposed score and agreed with the change in the CVSS elements such as attack vector: network, no privileges are required and user interaction is required, however we think that "Scope" is Unchanged as vulnerability may allow authorization bypass, but impact is contained to the original scope of vulnerable component. Using Hackerone's CVSS v3.0 Calculator - 8.8.  Please let us know if you agree, so we can proceed with the reward. 
We have also requested the CVE, that should be available soon.
- **2019-11-08** @b0yd: I am curious how the scope would be considered Unchanged as the component is running as SYSTEM, thus giving an attacker full access to anything on the computer. My understanding of "unchanged" scope is that an exploit of the vulnerability would not affect confidentiality, integrity, or availability of anything outside of the component. However exploitation of this vulnerability, provides SYSTEM privileges, and thus allows for an attacker to affect these measures for any other software on the system and possibly the network if it is domain joined.
- **2019-11-08** @ui-wasp: Hi @b0yd  - After further discussion with our team we agree with the score proposed and the cvss item "scope", with that in mind we are changing the score to 9.6 and bounty will be correspondent to this score. Thank you for your time and help in this topic.
- **2019-11-08** @b0yd: Thanks for the quick response and working through this report with me.
- **Bounty Awarded**
- **Report Severity Updated**
- **2019-11-08** @ubnt-rubens: @b0yd Your new bounty is based on the CVSS score `9.6`
- **2019-11-08** @ui-wasp: Thanks for the report, we would like to reinforce that fix for this issue is available since v3.10.7.
- **2019-11-21** @b0yd: Do you need anything additional from me for the CVE notice?
- **2020-01-12** @b0yd: CVE-2019-15595 - for tracking purposes
