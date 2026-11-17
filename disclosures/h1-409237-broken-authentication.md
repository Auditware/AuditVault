---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2022-02-14
submitted: 2018-09-12T22:53:21.159Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "websecnl"
source: "https://hackerone.com/reports/409237"
title: "Broken Authentication"
---
# Broken Authentication

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-02-14

- Report: [https://hackerone.com/reports/409237](https://hackerone.com/reports/409237)
- CWE: Improper Access Control - Generic
- Submitted: 2018-09-12T22:53:21.159Z

## Timeline

- **Report Filed**
- **2018-09-12** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Informative**
- **2018-09-13** @websecnl: @ag3nt-z3 how does one politely say a DoD agent is wrong in situations such as these?

Sir, with my outmost respect towards you and your colleagues you know i will never doubt your knowledge in the subject of information security... but i really do believe you are making a mistake by marking this as Informative.

References:
https://www.owasp.org/index.php/Testing_for_Insecure_Direct_Object_References_(OTG-AUTHZ-004)
https://www.owasp.org/index.php/Broken_Access_Control
https://www.owasp.org/index.php/Brute_force_attack

You know i like you guys, and the DoD has a place in my heart and i will always try to keep improving your security but i would like you to read the above references and reconsider your decision.

My appeal arguments to the informative decision, if you disagree or are unsure than please ask one of your colleagues since i am sure this has a risk and do this for living (i mean no offense, it just scares me that you discard such vulnerability as informative):

1. This is not Brute force, brute force would be the requirement of guessing a username and a password in order to archive a valid combination which will result in access to an authenticated area

2. IDOR must be a parameter and can be anywhere (in cookie, in string, ..) however when changing the value of its parameter the impact must result in Improper Access Control (Unauthenticated Access to an area restricted for the legitimate/default user) which in our case we managed to access ██████@██████.com (witch was not an account i made, i have no clue what its password is) the result of this can be many different things but mainly Information Disclosure or some state changing operation.

So again, please reconsider this for i have reason to believe you have miscalculated the severity of this flaw.
Its no problem, mistakes happen... but damn, your scaring me right now.

If after this appeal you still disagree with the IDOR vulnerability than you should atleast make this Improper Access Control (Broken Authentication) since i am able to access other users data by just changing the e-mail parameter's value.

Thanks in advance.

Best Regards,
Joel Aviad Ossi
- **2018-09-13** @websecnl: In addition to the above:

Video Demo PoC: ██████
Note: i created the account █████.████.mil , at registration it said i needed to verify my e-mail but due to the vulnerability i was able to access this account and bypass mail verification.

While the risk is low for someone to guess a valid DoD employee e-mail who so happends to be busy with the application service... if such attack does succeed it could result in the disclosure of a DoD employee's SSN and many more personal information such as demonstrated in the video demo.
- **2018-09-13** @ag3nt-z3: @websecnl I marked it informative because the vulnerability exploited with IDOR is that there is a pattern, usually an incremental one, found in the object identifier. You can find that in the supporting documentation you yourself provided: https://www.owasp.org/index.php/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet#Context

You also said yourself in your very own description: "It is possible to access other user account by changing the parameter 'email' to another valid e-mail, i managed to guess an existing user '█████@██████.com' which discloses the ███ Name and Surname."

If you can explain to me the pattern exploited in the email parameter, then we will go forward with this an IDOR. Until then, you've found a parameter that can be brute forced in burp intruder with a word list.

You have a special place in our heart too! I've attached something special for you ;)
- **2018-09-13** @ag3nt-z3: Honestly, if you can use your brute forcing technique to reveal info about a few users other than a ██████████ user, then we actually have something to go forward with and if it reveals PII it's much better than IDOR. It still wouldn't be IDOR though =)
- **2018-09-13** @websecnl: I love you guys, you just made my day with that picture.
i understand what you mean and yea its true, usually its an ID which you can send to the Intruder in Burp and do more stuff from there.

Forget IDOR, How about you go forward with this as 'Broken Authentication / Authentication Bypass' since i can get passed authentication.

Steps to reproduce:

1. Register any e-mail, for instance: ag3nt-z3@███  , Note: it will ask for mail verification, but the trick is to get passed this

2. We login with one of our ██████ accounts through: https://██████/███
E-Mail: █████████
Password: ████████

3. Now the link in the address bar looks like this: https://█████████/████

Edit the value in the email parameter to the mail you would like to login to and press enter.

4. Boom! You are now authenticated as ag3nt-z3@███ without e-mail verification or the recuirement of giving any valid credentials :)

References:
https://www.owasp.org/index.php/Top_10-2017_A5-Broken_Access_Control

😎👉👉
- **2018-09-13** @websecnl: @ag3nt-z3 Here special picture for you :)
- **Report Reopened**
- **Report Severity Updated**
- **Report Triaged**
- **Report Vulnerability Types Updated**
- **Report Title Updated**
- **2018-09-14** @ag3nt-z3: @websecnl There you go! That's a much better PoC.
- **2019-03-13** @ag3nt-z3: @websecnl We are getting this one back for revalidation. Considering the severity, can you check your POC and see if it still work?
- **Report Needs More Info**
- **Report New**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
