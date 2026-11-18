---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - stack/node
substate: "informative"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2018-06-30
submitted: 2018-05-28T16:58:49.235Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "ginden"
source: "https://hackerone.com/reports/358359"
title: "Privilage escalation with malicious .npmrc"
---
# Privilage escalation with malicious .npmrc

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Node.js third-party modules | **Disclosed:** 2018-06-30

- Report: [https://hackerone.com/reports/358359](https://hackerone.com/reports/358359)
- CWE: Privilege Escalation
- Submitted: 2018-05-28T16:58:49.235Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello.

I'm forwarding to you my conversation with npm staff regarding security issue. It allows to escalate to root privilages of victim using either:

a) basic social engineering - convincing victim to run npm in attacker-controlled folder (eg. repository), including such innocent ones like "npm help" or "npm whoami"  
b) low-privilage process with access to writing files  

I believe that impact of this bug can be high, if someone is able to hijack well-positioned tutorial.

Michał Wadas  

  

---------- Forwarded message ----------  


**Jon Lamendola** (npm)

May 22, 12:19 PDT

Hello Michal,

We're reviewing the impact of changing this behavior and still discussing internally how we might move forward. We understand that it's a risk, but it is also a feature that people use, so we need to fully understand the consequences of making major changes to it before we do. Unfortunately, this can take some time to analyze.

In the meantime, you can alias npm to something like npm --onload-script="" "$@" for a temporary workaround.

Thanks again for reporting this to us.

**Michał Wadas**

May 21, 07:05 PDT

Hi.

Is there any update on this?

**Michał Wadas**

Apr 26, 16:32 PDT

Just noticed - if attacker can control .npmrc (either by writing it from low-privilage script or tricking user into using sudo npm in infected folder), he can set user flag in .npmrc too.

**Jon Lamendola** (npm)

Apr 26, 11:36 PDT

Hello Michal,

Thanks for reporting this to us. I agree, this is a legitimate concern, and I will pass this on to the npm CLI team for discussion.

**Michał Wadas**

Apr 26, 09:54 PDT

Source of issue:

* onload-script is run with privilages of user running npm, in npm process.  
* User can be unaware of .npmrc behaviour

I have pin-pointed it to line 236 in lib/npm.js file in master tree.
Attack scenario:

* Attacker tricks victim into running "sudo npm" in folder (or descendant of folder) with malicious .npmrc
** This can be achieved in many ways - eg. by writing to $HOME/.npmrc from low-privilaged application or tricking victim to open infected directory  
** Example: tutorial asks user to clone git repository, configure it and then run "sudo npm i -g eslint"  
** Example 2: attacker publish malicious code to npm. Code writes to $HOME/.npmrc. Then, attacker can just wait for anyone running sudo npm.
* Then npm runs arbitrary Node.js script with arbitrary permissions

Proposed actions:

* Ignore onload-script when run as super user  
* Ask for confirmation before running onload-script  
* Run onload-script in separate process with lower privilages (it's already supported for other scripts in npm - [https://docs.npmjs.com/misc/<wbr>scripts#user</wbr>](https://docs.npmjs.com/misc/scripts#user) )

These actions should limit scope of attack.

Quick survey in group of Polish programmer showed that around ~30% of npm users use sudo npm

All versions of npm between 3.10 and 6.0 are confirmed to be vulnerable.

Thanks for your attention,  
Michał Wadas

## Impact

Attacker can reliably run arbitrary code with user privilages if he is able to write to .npmrc.

If user use "sudo npm" in folder with malicious .npmrc, attacker can run arbitrary code with root privilages.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-06-16** @lirantal: Hi @ginden,

Thank you for submitting the vulnerability report to us, we appreciate being in the loop.

While we resonate with your concerns about the security implications of the npm client those are indeed part of its features as well.

I'll close this report as informative at this point.
- **Report Informative**
- **Agreed On Going Public**
- **2018-06-30** @ginden: Fine for me.
- **Agreed On Going Public**
- **Report Became Public**
