---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
  - vuln/secrets-leak
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2018-09-11
submitted: 2018-08-21T05:01:49.087Z
bounty_usd: null
votes: 145
cve: []
program: "[[programs/grab|Grab]]"
reporter: "xsam"
source: "https://hackerone.com/reports/397527"
title: "Leaking sensitive information on Github lead full access to all Grab Slack channels "
---
# Leaking sensitive information on Github lead full access to all Grab Slack channels 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 145 | **Program:** Grab | **Disclosed:** 2018-09-11

- Report: [https://hackerone.com/reports/397527](https://hackerone.com/reports/397527)
- CWE: Information Disclosure
- Submitted: 2018-08-21T05:01:49.087Z

## Report summary

The researcher @xsam reported leakage of two access tokens, one belonging to Slack and the other belonging to Google API’s. Researcher identified a public github repository with no source code but an electron package app in releases, interestingly he went on to downloaded the package and reverse engineer the electron app which lead him to identify the access tokens.

Within few minutes of receiving the report, the bug report was triaged and validated, access tokens were revoked and public repository was removed. Any valid HackerOne bug report submission triggers an internal incident investigation. In this case, a thorough investigation was conducted to identify any prior abuse and overall impact. Investigation concluded that these tokens weren't abused in the past.

We appreciate @xsam's contribution to our bug bounty program, @xsam displayed creative thinking and submitted detailed report which allowed us to quickly reproduce and validate the submission. We look forward to see more of his creative bug reports to our program.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#Summary:

 Accidental leakage of secret keys in such code repositories is a real problem, after my report #387117, I decided to dig deeper than the previous report and looking to some random profiles in Github, and doing some dirty work I was able to access to the developer’s company’s internal chats and files on Slack. And not only that, there’s no easy way to see if someone is eavesdropping on the communication. In the worst case scenario, these chats can leak production database credentials, source code, files with passwords and highly sensitive information.

#Description:

__████__ is QA Automation Engineer at Grab according to his [LinkedIn profile](https://www.linkedin.com/in/██████████/), after doing some manual search in Github. I found his Github profile which contains weird repo

https://github.com/████/

{F335908}

I was about to close that tab since there is no useful file but wait second, did you notice __30 releases__?

Multiple versions for multiple OS systems, I decided to download [the zip file](https://github.com/████████/releases/download/v1.0.34/vnot-automation-support-1.0.34-mac.zip), after the unzipping I started __███__ which is an Electron application.

{F335910}

I thought it was a dead-end but I noticed the bar so I clicked `Environment` then `Toggle Developer tools` in order to know the origin of that app go to `Source` as attached in the screenshot below 

{F335916}

Know it is the time for some thinking outside of the box and be creative. As I don't have much experience with Electron apps so after some googling I found that it is possible to reverse-engineer an existing Electron app by following [those steps](https://medium.com/how-to-electron/how-to-get-source-code-of-any-electron-application-cbb5c7726c37) :

* Open terminal and install asar node module globally by typing __`npm install -g asar`__

* Go to __████__ file directory, in my case
 __`cd /Users/mac/Downloads/██████/Contents/Resources`__

* Create a directory to paste the content of app for example __`mkdir ███████-sourcecode`__

* Unpack the app.asar file in the above directory using asar __`asar extract app.asar example-sourcecode`__

{F335918}

Now we have all available endpoints in the app or let say in `gamma.grab.com` as well if you go to 
`build/constants/google/` you will get client_secret.json

```
{
    "installed": {
        "client_id": "█████",
        "project_id": "███████",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "█████████",
        "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"]
    }
}
```

and google_token.json

```
{"access_token":"██████████","refresh_token":"████","token_type":"Bearer","expiry_date":█████████}
```

But the most usefull and impactfull files are on `build/environement`:
* production-ph.env.json
* production.env.json
* staging.env.json

to verify if those token work let take for example 

```
"slack": {
    "channel": "█████",
    "schedule_channel": "███████",
    "token":
      "xoxp-██████",
    "user": "█████ ██████████"
  }
```

Before doing we need to know what kind of token is on our hand since [Slack have multiple kinds of token](https://api.slack.com/docs/token-types)

{F335920}

{F335921}

So we have __`User tokens`__ The xoxp-token (prefix xoxp) can be generated from the OAuth Test Token-page. This token is exactly like having the complete username and password for the user. Even for a user with two-factor authentication enabled, you can still access Slack with nothing else but this token.
And it is time to test if that token work or not? in order to that we need to follow the API documentation provided by slack here https://api.slack.com/web and try a non-sensitive method since I don't have the permission to read your internal data 

{F335923} 

The best example will be to list the name of all channels

{F335924}

So I set GET request in Burp with adding `Authorization: Bearer xoxp-████`as header and the result 

{F335925}

The result is 100 channels including but not limited to : 

* ██████
* ████
* ███████
*█████

#How to protect? (Important)

* __Avoid git add: commands:__ Using wildcards can easily capture local files not truly intended to be shared, Instead of wildcards, name each file you commit, or use git add -p to review each change you add.

* __Name sensitive files in .gitignore & .npmignore:__ git support a local file listing exclusions from packaging and commits, which you can use as a safety measure against the accidental inclusion of sensitive files, and you can use GitHub’s sample .gitignore files for other inspiration.

* __git-secrets: git hook prevents committing in credentials:__ a useful tool called git-secrets. The tool hooks onto git commit and breaks the commit if it includes patterns that appear to be credential. This is a good content-focused safety net, complementing the previously suggested filename based protection.

* __Encrypt or use environment vars when publishing from CI.__

* __Invalidate leaked credentials.__

#Reference:

* https://labs.detectify.com/2016/04/28/slack-bot-token-leakage-exposing-business-critical-information/
* https://medium.com/how-to-electron/how-to-get-source-code-of-any-electron-application-cbb5c7726c37
* https://api.slack.com/docs/token-types

## Impact

As I mentioned in the summary it possible to access to the developer’s company’s internal chats and files on Slack. And not only that, there’s no easy way to see if someone is eavesdropping on the communication and there are more worst scenarios.

## Timeline

- **Report Filed**
- **2018-08-21** @prakhar-prasad: Thank you for participating in our Grab Bug Bounty Program.

We are currently reviewing your bug report, we would request you give us some time while we validate your bug report.

Thanks you for your patience.
- **Report Triaged**
- **2018-08-21** @prakhar-prasad: Hi @samidrif,

We have revoked the affected Slack and Google tokens. Please help us verify whether the revocation has been correctly performed and you're no longer able to reproduce the behaviour.
- **2018-08-21** @xsam: Hi @prakhar-prasad,

I can confirm that the token is revoked right now as shown below

{F335979}

The same thing for Google tokens.

{F335980}

And the repo is no longer exists, a great turn-around from you as always. +2 points for Grab bounty program if we count the point from the previous report :).
Cheers,
- **Report Resolved**
- **Bounty Awarded**
- **2018-08-24** @xsam: Thank you for the reward as well as the bonus, it is a pleasure working with your program.
- **2018-08-26** @xsam: Hi @prakhar-prasad, I noticed that you deleted the sensitive parts from the report as well as I think it is worth disclosing to share knowledge with other researchers :), so what do you think and if possible you need to remove the link to LinkedIn profile and the first screenshot as well as the screenshot from Burp request since it contains the token in headers. Thank you.
- **2018-08-26** @prakhar-prasad: Hey @samidrif,

Thanks for your message. We've already raised a request for removal of certain attachments with HackerOne; this process takes a bit of time. Nevertheless, we appreciate your help and concern.
- **Agreed On Going Public**
- **2018-09-06** @xsam: Hello, @prakhar-prasad is there any problems because the report will be disclosed after 21 days.
- **2018-09-06** @grabsecurity: Hi @xsam,

Thank you for following up on this.  It's under review and will be disclosed soon.

We appreciate your patience.

- Grab Security Team
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
