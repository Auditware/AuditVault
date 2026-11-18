---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-exposure-through-directory-listing
  - env/web
  - stack/node
  - vuln/info-disclosure
substate: "resolved"
weakness: "Information Exposure Through Directory Listing"
enriched: true
body: true
date: 2019-02-28
submitted: 2019-02-02T15:32:02.524Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "skyn3t"
source: "https://hackerone.com/reports/490379"
title: "[glance] Access unlisted internal files/folders revealing sensitive information"
---
# [glance] Access unlisted internal files/folders revealing sensitive information

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 19 | **Program:** Node.js third-party modules | **Disclosed:** 2019-02-28

- Report: [https://hackerone.com/reports/490379](https://hackerone.com/reports/490379)
- CWE: Information Exposure Through Directory Listing
- Submitted: 2019-02-02T15:32:02.524Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report sensitive information disclosure in `glance`.
Similar to #486933 in ways

# Module

**module name:** glance
**version:** 3.0.5
**npm page:** `https://www.npmjs.com/package/glance`

## Module Description

a quick disposable http server for static files

## Module Stats

**weekly downloads**
41

# Vulnerability

## Vulnerability Description

The `glance` modules allows directory browsing and to serve static files through the browser.
The config option `nodot` can be used to prevent serving sensitive folders such as `.git` or `.DS_Store` 
refer: https://github.com/jarofghosts/glance#command-line-options
This rule can be bypassed using the technique below which can lead to sensitive information disclosure (An interesting example: https://smitka.me/).

## Steps To Reproduce:

- Install `glance`
```
$ npm install -g glance
```

- Inside a project directory, initialise `git`.
```
$ git init
```

- Add rule to ignore dotfiles in `.glance.json`
```json
{
  "nodot": true
}
```

- Start `glance` in current directory.
```
$ glance --verbose
glance serving /project/directory on port 8080
```

- Now, current directory will be served by serve with the exception of folder `.git` and file `.gitignore`.
- If we try to curl .`git` or `.gitignore` we get a Not Found error
```
$ curl --path-as-is 127.0.0.1:8080/.git
...
<title>File Not Found</title>
...
```

- Although if we try to fetch files/folders inside a forbidden [dot]folder there is no problem at all and most of it's content can be extracted successfully  (except dotfiles itself).
```
$ curl --path-as-is 127.0.0.1:8080/.git/HEAD      
ref: refs/heads/master
```

>The structure of git repository is well known, so it is possible to found references to the objects/packs in the repository, download them via direct requests and reconstruct the repository and obtain your files – not only the current ones, but also the past files. 

## Supporting Material/References:

- Ubuntu 16.04
- node v11.3.0
- npm 6.7.0

# Wrap up

> Select Y or N for the following statements:

- I contacted the maintainer to let them know: [N]
- I opened an issue in the related repository: [N] 

>Hunter's comments and funny memes goes here

{F416786}

## Impact

The essentially bypasses the `nodot` feature and allows an attacker to read from a directory that the victim has not allowed access to.

References:
- https://github.com/jarofghosts/glance#command-line-options
- https://smitka.me/

## Timeline

- **Report Filed**
- **2019-02-02** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2019-02-04** @skyn3t: Agreed! Thanks for the correction.
- **External User Joined**
- **2019-02-09** @skyn3t: Hi,
Is there anything else I can help with?
- **2019-02-17** @jarofghosts: Thanks for the report, sorry it took a while to get around to this! I have published glance@3.0.7 that includes a fix for this vulnerability, as well as dependency upgrades to resolve known vulnerabilities.
- **2019-02-17** @jarofghosts: I have also marked all versions prior to 3.0.7 as deprecated on npm
- **2019-02-18** @skyn3t: I was able to verify the fix works!
- **2019-02-20** @skyn3t: @marcinhoppe looks like this can be resolved and disclosed now.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
