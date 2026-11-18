---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cleartext-storage-of-sensitive-information
  - env/web
  - impact/account-takeover
  - impact/data-exposure
  - trigger/social-engineering
substate: "resolved"
weakness: "Cleartext Storage of Sensitive Information"
enriched: true
body: true
date: 2025-07-12
submitted: 2025-04-18T16:11:09.376Z
bounty_usd: null
votes: 92
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "a0xtrojan"
source: "https://hackerone.com/reports/3099978"
title: "Leaked reused password for a few Khan Academy users"
---
# Leaked reused password for a few Khan Academy users

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 92 | **Program:** Khan Academy | **Disclosed:** 2025-07-12

- Report: [https://hackerone.com/reports/3099978](https://hackerone.com/reports/3099978)
- CWE: Cleartext Storage of Sensitive Information
- Submitted: 2025-04-18T16:11:09.376Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I found A lot of credentials for your domain
on the Telegram bot: ███
While the exact sources of the leaked data are unknown, the volume of exposed information is substantial. This report is submitted for your review to assess and mitigate the exposure of user credentials, including emails and passwords.
Steps To Reproduce:
1-access this chatbot ===> ██████
2-start the chatbot
3 - add  www.khanacademy.org/login
4-u will get the passwords and emails just download them ███████
try
(username or email : password)
 ██████ : ███
████ : ██████
███ : ████████

## Impact

Impact
Exposure of user emails and passwords, leading to credential compromise.
Increased risk of account takeover (ATO) if users reuse passwords across platforms.
Potential for phishing and social engineering attacks targeting affected users.
Reputational damage due to leaked user data.
Regulatory and compliance risks, depending on applicable data protection laws.

## Timeline

- **Report Filed**
- **2025-04-19** @a0xtrojan: any update?!
- **2025-04-20** @a0xtrojan: Any update ?!
- **Report Triaged**
- **2025-04-21** @a0xtrojan: hi @samhays_ka 
username (a0xtrojan)
- **2025-04-21** @samhays_ka: Thanks, the badge should be added to your account today!
- **2025-04-21** @a0xtrojan: hi @samhays_ka 
Can I get swag or is it not available as a type of thank you? 

@a0xtrojan
- **2025-04-21** @samhays_ka: Hi @a0xtrojan  - at this time, we only offer the badge as the bounty for this program. You can read a bit more about that [here](https://hackerone.com/khanacademy/) -- but you do have our thanks in helping identify these issues and hope you'll keep at it and keep the submissions coming!
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
- **2025-07-12** @a0xtrojan: hi @samhays_ka please hide bot Telegram
- **2025-07-13** @a0xtrojan: hi @samhays_ka  please hide bot Telegram
- **2025-07-14** @a0xtrojan: hi @samhays_ka please hide bot Telegram
- **2025-07-14** @samhays_ka: Specifically what do you mean? The URL in your original report?
- **2025-07-14** @a0xtrojan: hi @samhays_ka 
on the Telegram bot: ████ this hidden sir
i need hidden in report
- **2025-11-21** @a0xtrojan: Hi @samhays_ka I hope you’re doing well!
I wanted to kindly ask if it would be possible to add a thank-you note on my HackerOne profile for my recent contributions.
I’ve really enjoyed collaborating with your team, and I truly appreciate the effort you put into reviewing and validating my reports.
Thank you so much for your time and support — it really means a lot!
