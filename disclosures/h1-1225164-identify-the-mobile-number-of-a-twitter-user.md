---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
  - vuln/info-disclosure
  - trigger/brute-force
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2022-03-29
submitted: 2021-06-12T22:38:33.729Z
bounty_usd: 560
votes: 30
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "aymen_mansour"
source: "https://hackerone.com/reports/1225164"
title: "Identify the mobile number of a twitter user"
---
# Identify the mobile number of a twitter user

> **Severity:** Critical | **Bounty:** 560 USD | **Votes:** 30 | **Program:** X / xAI | **Disclosed:** 2022-03-29

- Report: [https://hackerone.com/reports/1225164](https://hackerone.com/reports/1225164)
- CWE: Information Disclosure
- Submitted: 2021-06-12T22:38:33.729Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** 
By exploiting this security vulnerability we can detect the mobile number of a twitter user.


**Description:**
This security vulnerability is of type "Information disclosure" it allows to exploit Flawed behavior of the twitter system to obtain distinct responses when different error states occur.
This security vulnerability allows to identify the mobile number of a twitter user from its USER_NAME.

## Steps To Reproduce:

We explain how to get the mobile number which is (██████████) from the following twitter user "███"==> USER_NAME = ████

1.access the following url: "████" and enter user name "██████" and click search. (see screenshot "1.PNG")
2. At this step twitter  displays the last 2 digits of mobile number through this message "text a code to the phone number ending in 15", the last two digits are 15, click on next.(see screenshot "2.PNG")
3. repeat step number 2 several times, i.e. repeat asking to receive the code several times until you get the following message: "You've exceeded the number of attempts. Please try again later."(see screenshot "3.PNG")
4.Now twitter  block sends it sms code to the number associated with the victim's twitter  account which ends with two digits 15

====> twitter  block sends it again sms for the correct victim mobile number, ie "████████" but it does not block it sends sms to any other different mobile number at ███ (the probability that twitter block sends an sms to mobile number different to █████████ which ends in 15 and has the following format &&&&&&15 at the time of launching the attack is 0.000001% ) so we can use the "Forgot Password" feature and ask to receive an sms on all the following format numbers &&&&&&15 and the attempt which returns the following message: "You've exceeded the number of attempts. Please try again later."is an attempt associated with the victim mobile number.

==> an attempt to receive an SMS code at the mobile number of the following format: &&&&&&15 may return 3 different messages:
1st message : Number not associated with a twitter  account
2nd message : "You'll recive a code to verify here so you can reset your accont password." ==> this is not the victim mobile number .(see screenshot "7.PNG" and "8.PNG" )
3rd message: "You've exceeded the number of attempts. Please try again later". ==> this is the victim mobile number (see screenshot "4.PNG" and "5.PNG" and "6.PNG"  )


5. to identify the mobile number we will access this url "████████" and try to request sms code on all the mobile numbers that end by 15 which follows this format &&&&&&15 that is to say make a brute force on all the number which ends in 15, therefore the request which tries to recive sms code associating with the correct victim number account will display the following message: "You've exceeded the number of attempts. Please try again later" on the other side any other request that is not associated with victim's correct mobile number will display the following message: "You'll recive a code to verify here so you can reset your accont password." or a number not associated with a twitter account.


===>we can deduce the number of victim's digit according to the user's country or we can easily deduce it, the victim's country is "██████" so the format of its number is as follows: &&&&&&15, To accelerate the brute force and decipher the correct digits more quickly associated with this number &&&&&&15 we will use the following information:
the mobile number for the ████ region begins with the following operator phone code: (26-27) (56-57)
, so we are now going to brute force on this number range:
26&&&&15 ... 27 &&&&15
56&&&&15 ... 57&&&&15

we have 10 ^ 4 = 10000 mobile number to test each time to identify the correct victim mobile number, we eliminate the numbers that are not associated with a twitter account then determine which number blocked by twitter from receiving sms that returns the message next: "You've exceeded the number of attempts. Please try again later" , this is the victim mobile number.

## Impact: [add why this issue matters]
This issue has a critical impact on user privacy

## Impact

Attacker has a critical impact on the confidentiality  of the twitter user

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **2021-06-16** @aymen_mansour: Hello,

I am familiar with the password reset process. do not hesitate to ask me questions for any clarification concerning the attack scenario.

The idea is to block a user from resetting his password through his username then brute force in a list of mobile number (which contains the last two digits of victim and a determined number of digits) and to identify the mobile number blocked, it is the victim's mobile number

Regards
- **Report Needs More Info**
- **Report New**
- **2021-06-17** @aymen_mansour: Hello,

The security vulnerability reported in this report can cause a massive data leak. it is clear that the impact is critical on the confidentiality of user data.

Regards
- **2021-06-17** @bugtriage-sophia: Thank you for your response @aymen_mansour,

We are investigating the behavior you described and will get back to you when we have more information.

Thank you for thinking of Twitter security
- **Report Triaged**
- **Bounty Awarded**
- **2021-08-23** @aymen_mansour: Hello,

Please provide an update for the resolution of this security issue.

Regards
- **2021-12-02** @aymen_mansour: Hello,

Can give you the state of progress of this case ?

Regards
- **Report Resolved**
- **2022-03-12** @aymen_mansour: Hello,

I confirm that this vulnerability has been fixed and an attacker cannot obtain the mobile number associated with the user.

Regard
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
