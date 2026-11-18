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
date: 2018-09-29
submitted: 2018-07-02T12:25:56.922Z
bounty_usd: null
votes: 43
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "metnew"
source: "https://hackerone.com/reports/375329"
title: "Local files reading using `link[rel='import']`"
---
# Local files reading using `link[rel="import"]`

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 43 | **Program:** Brave Software | **Disclosed:** 2018-09-29

- Report: [https://hackerone.com/reports/375329](https://hackerone.com/reports/375329)
- CWE: N/A
- Submitted: 2018-07-02T12:25:56.922Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

HTML file could import another file using `<link rel="import">`.  Brave returns `Access-Control-Allow-Origin: *` response header for local HTML files. That leads to local files reading.

> This vulnerability makes #369218 critical.

## Products affected: 

Brave: 0.23.19 
V8: 6.7.288.46 
rev: 178c3fbc045a0cbdbe098db08307503cce952081 
Muon: 7.1.3 
OS Release: 17.6.0 
Update Channel: Release 
OS Architecture: x64 
OS Platform: macOS 
Node.js: 7.9.0 
Brave Sync: v1.4.2 
libchromiumcontent: 67.0.3396.87

## Steps To Reproduce:

PoC:
``` html
<head>
    <script>
        function show() {
            var file = link.import.querySelector('body')
            alert(file.innerHTML)
        }
    </script>
    <link id="link" href="file:///etc/passwd" rel="import" as="document" onload="show()" />
</head>
```

## Supporting Material/References:

Screencast + PoC attached.

## Impact

Local files reading is forbidden in any browser.
Also, note that this vulnerability makes  #369218 critical.

> Probably all platforms(macOS/Win/Linux) are affected.

## Timeline

- **Report Filed**
- **2018-07-02** @metnew: Attaching two additional screencasts:

1. #369218 + #369185 + #375329: get OS username using ssh://, download a file, open the file using "Open in new tab"
2. #375259 + #375329  - (more realistic case): download the exploit like it's from a trusted resource + open (user gesture)
- **2018-07-02** @metnew: It worth to note that it's possible to read binary files, this is much more dangerous than reading only html, because an attacker could obtain directory structure, media, cookie/settings data from Brave.app, etc.
- **2018-07-02** @metnew: It worth to note that it's possible to read binary files, this is much more dangerous than reading only html, because an attacker could obtain directory structure, media, cookie/settings data from Brave.app, etc.
- **2018-07-02** @metnew: Proof that it's possible to read binary files:
`application/octet-stream` -> could read

> Also, it's not required for an attacker to know username to find Brave.app, because it's possible to read `.DS_Store` files.
- **2018-07-03** @metnew: Note that this vulnerability is much more severe than #175979, because #175979 relies on `<iframe />`. 
Brave initiates downloading if iframe points to a binary file. That means it's impossible to read binary files using this technique.

However, in the case of `link[rel=import]`, it's possible to read files with any mimeType.
> Tested this on `.zip`,`.jar`, leveldb files.
- **2018-07-03** @metnew: > `deleted`
- **2018-07-03** @metnew: > From my understanding this happens because of `/atom/browser/net/url_request_string_job.h` in Muon
- **2018-07-03** @metnew: > ~~[more correct](https://github.com/brave/muon/blob/master/atom/browser/net/asar/url_request_asar_job.cc#L243)~~
- **2018-07-03** @thefrog: Hi,

Thank you for your submission. We have received your report.

Best regards,
@thefrog

Security Analyst
**HackerOne**
- **Report Triaged**
- **2018-07-03** @diracdeltas: Hi @metnew, what version of Brave are you testing on? I tried your POC in the latest version (0.23.19) and couldn't repro it. Trying to load a file on disk fails with console error "Not allowed to load local resource:" as expected.
- **2018-07-03** @diracdeltas: Forgot to mention - i tested this loading the POC HTML from a localhost server instead of from the `file:///` origin to simulate loading a remote site. Does the POC only work when loaded from file:///?
- **Report Severity Updated**
- **2018-07-03** @diracdeltas: sorry i see you included in the original issue what version of Brave you tested on. since this only seems to affect local files, i downgraded the severity to high.
- **2018-07-04** @metnew: H @diracdeltas, thanks for the quick response.
Yeah, this only affects files on local disk. 
Works on all platforms.
- **Bounty Awarded**
- **2018-07-08** @metnew: I **disagree with the bounty**. I think it should be higher. 

Top arguments:

### Impact != reward
Impact of the vulnerability couldn't be compared with the reward. The vulnerability allows stealing any(!) local data. Stolen ssh keys/cookies/passwords/DBs couldn't be compared with fingerprinting or other misc attacks.  

### Chained vulnerabilities
As I understand, this bug was considered distinctly from the URL spoofing bugs/ the bug with download modal. However, I highlighted that this vulnerability is much more severe because of #369086/ #343721/ #375259 (which were marked as duplicate, but that's another story). 

I think that evaluating this vulnerability distinctly from the other bugs is unfair because chained vulnerabilities (presented in the same version + reported by the same researcher) have a higher impact. E.g., a synergy of URL spoofing and local files reading is much more dangerous than each of these vulnerabilities by itself.

## Report + explanation
I pointed to the vulnerability in the code + explained the root cause (on Github).

---------------------------

I think these arguments are enough for the @brave team to reconsider the bounty.
- **2018-07-09** @metnew: @toml
- **Hacker Requested Mediation**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2018-08-03** @metnew: > I agree with a bounty and resolution
- **2018-08-03** @metnew: @diracdeltas @brave
It'd better cancel disclosure because of #390362  and #390013
- **Report Reopened**
- **Report Resolved**
- **2018-09-21** @metnew: @diracdeltas Unpatched at that time #369218 (opening `file:///` URLs from the web using "open in new tab") allowed to significantly increase severity of this bug.
- **Agreed On Going Public**
- **2018-09-21** @metnew: Hah, noticed a funny thing:
In the original report, I wrote: _"This vulnerability makes #369218 critical."_

And that's actually become true)
- **2018-09-28** @diracdeltas: Considering MITM attacks, the attack scenario becomes:

1. MITM attacker waits for user's computer to download a file over HTTP
2. They inject the attack file
3. They wait for the user to open the file
4. They read other local files

I would still call this 'high' instead of critical because it requires some user interaction (download a file over HTTP and then also open the file). But agree with awarding more.
- **Bounty Awarded**
- **2018-09-28** @metnew: Thanks, @diracdeltas, but I want to highlight the next topics:

### Attack Scenario via #369218

> Attack scenario via downloading is quite interesting but requires specific conditions.

Don't know why you don't consider the attack scenario which leverages #369218.
That's a really awesome opportunity for attacker.

1. Victim opens `file:///<RESOURCE_WITH_HTTP_SCRIPT>` (that macOS default system HTML file)
2. MITM script requested by `file:///<RESOURCE_WITH_HTTP_SCRIPT>`
3. Read any file on disk :(

I guess that's a valid bug chaining.

> There is no additional downloading in the chain or similar (like I wrongly proposed before).
> Additional scenario modifications are possible, but that's out of scope.

1. HTTPSE may protect in some cases. I don't know whether it's active by default.
2. As you said, HTTPSE doesn't always upgrade the connection.

### Distinguishing vulns in different OS

I've already written [about it here](https://hackerone.com/reports/369218#activity-3391093).

I understand that `http://` script in default system files isn't connected to Brave. However, that doesn't change anything. 

In my opinion, that's a problem of Brave that certain OS tricks allow escalating Brave bugs into more severe scenarios :(

Also, that's macOS, not some rarely used Linux distro with 1% of Brave's users.

> still `http://` on Mojave

### Inconsistent rewards 

That's really awesome that Brave decided to reconsider rewards to benefit researchers.
But I think the rewards are pretty inconsistent.  From my point of view, this bug is more severe than it was estimated comparing to other updated bugs.

*Also, could we disclose this report and #390362 since this bug is fixed now?*
- **2018-09-29** @toml: We do our best to award consistent bounties and that's why we have a bounty schedule on our program page. But we're humans making judgment calls about every report that comes in. And if we provide an unusually-high award for one particular report, that doesn't mean that we're changing our practices and awarding higher awards for every similar report. If we make a mistake and give a particular report an overly-generous award, we're not going to try to take back that money. We'll just keep trying to make consistent award in future. That means you might see some unusually-high awards in our history, because when we accidentally don't award enough, we try to make it right by increasing the bounty. But when we award too much we just move on.

When talking about whether an award is fair for *this* report, the only relevant question is where it sits in our bounty schedule — not the awards we've made in the past. For this report, it's clear. This is definitely a real problem that puts Brave users at risk. But we're not going to ship a hotfix for it — a fix will go out in a scheduled release. Our schedule says that the limit for something which goes out in a regularly-scheduled release is $250. The award for this is now $400 which makes this award unusually-generous.
- **Agreed On Going Public**
- **Report Became Public**
- **2018-09-29** @metnew: Ah, I see, thanks for the explanation, @toml!

I thought the severity might be underestimated because the Brave team considered only MITM +downloading case (comment above), so I decided to add some notes to avoid any kind of miscommunication.
