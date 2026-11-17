---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2019-10-03
submitted: 2019-09-01T16:13:57.433Z
bounty_usd: null
votes: 66
cve: []
program: "[[programs/railto|Railto LLC]]"
reporter: "dhakal_bibek"
source: "https://hackerone.com/reports/686015"
title: "Administrator access to staging.railto.com"
---
# Administrator access to staging.railto.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 66 | **Program:** Railto LLC | **Disclosed:** 2019-10-03

- Report: [https://hackerone.com/reports/686015](https://hackerone.com/reports/686015)
- CWE: N/A
- Submitted: 2019-09-01T16:13:57.433Z

## Timeline

- **Report Filed**
- **2019-09-01** @dhakal_bibek: poc
- **2019-09-02** @dhakal_bibek: hello team, 

    admin panel is also not secure to basic brute force attacks. 

##Steps

1: go to  Go to https://staging.railto.com/admin

2: Enter random username and random password and intercept the request.

3: Send the request to intruder as we brute force using intruder in burp.

4: I recommend using rockyou.txt as i have found your admin panel password using this.

5: When the Status of the page is 302 redirect, we are in..

```In my opinion strict implementation of re-capta  and you should change that basic username = admin and password = password ```

thank you.
- **2019-09-02** @dhakal_bibek: i have changed the username from admin to ```kira ```
thank you.
- **2019-09-03** @dhakal_bibek: hello from the other side.
- **Report Triaged**
- **2019-09-06** @dhakal_bibek: I would be glad, to hear any updates regarding the issue.
- **2019-09-11** @dhakal_bibek: https://staging.railto.com/about
I have modified the page.
- **2019-09-11** @dhakal_bibek: about page
- **2019-10-01** @dhakal_bibek: Why the issue has not been fixed yet? i Got the admin level privilege, and now what.
- **2019-10-01** @h1_analyst_oliver: Hello @kira_deathnote,

We are discussing this issue internally since this is a staging server and we will come back to you for the updates.

Hint: it's always helpful to mention the triager using `@` sign for example @princeofpersia.

Regards,
@princeofpersia
- **Report Resolved**
- **2019-10-02** @dhakal_bibek: thanks @princeofpersia, this is my first successful report and can we disclose this report.
- **2019-10-02** @h1_analyst_oliver: Hello @kira_deathnote,

In order to disclose a report you need to request from the program by clicking the action button (the one with `Add comment`) and choose `Request Disclosure`.

Please note that you can't disclose the report unless the request was accepted by the program.

Regards,
@princeofpersia
- **Agreed On Going Public**
- **2019-10-03** @dhakal_bibek: @princeofpersia Ok i get it bro..
once again, thanks for resolving my first report. :)
- **Agreed On Going Public**
- **Report Became Public**
