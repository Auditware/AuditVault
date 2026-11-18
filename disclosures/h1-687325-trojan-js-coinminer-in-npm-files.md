---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/malware
  - env/web
  - stack/node
substate: "not-applicable"
weakness: "Malware"
enriched: true
body: true
date: 2019-10-04
submitted: 2019-09-03T22:19:03.200Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "mada_uk"
source: "https://hackerone.com/reports/687325"
title: "Trojan:JS/CoinMiner in npm files"
---
# Trojan:JS/CoinMiner in npm files

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js third-party modules | **Disclosed:** 2019-10-04

- Report: [https://hackerone.com/reports/687325](https://hackerone.com/reports/687325)
- CWE: Malware
- Submitted: 2019-09-03T22:19:03.200Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,

I am a front end developer and use Vue.js and Visual Studio Code and have had an issue recently with scripts not running in my terminal so decided to fault find.

All programmes that I can think of are up to date, and today I decided to do a full windows defender scan and found the above file.

I cannot say how to reproduce it as I'm not sure how I got it in the first place.

These are my global packages:

`PS C:\web-dev\adp-run> npm list -g --depth 0
C:\Users\mada7\AppData\Roaming\npm
+-- @vue/cli@3.11.0
+-- @vue/cli-upgrade@3.9.0
+-- core-js@3.2.1
+-- eslint@5.7.0
+-- firebase-tools@7.3.0
+-- git@0.1.5
+-- json-server@0.15.0
+-- netlify-cli@2.12.0
+-- npm@6.11.2
`-- serve@10.1.1`

I’ve done some research and cant find what npm package the file came from (if any) so was wondering if :

I) This file is from a compromised npm package I’ve used?
II) This file is from node.js? I’ve done a fresh install of node within the last 7 days
III) Whether I’m one of many infected with this malware, I am not aware of using the event-stream package that was infected previously

Thanks for any help, Windows Defender tells me the threat is blocked.


Adam

## Impact

This threat can perform a number of actions of a malicious hacker's choice

## Timeline

- **Report Filed**
- **2019-09-05** @jasnell: Unless the compromised package is included somehow with the npm client we bundle and ship with node.js core, this is not in scope for core. It may be relevant to the ecosystem security working group tho
- **2019-09-06** @lirantal: @mada_uk thanks for reaching out to us, we appreciate the heads up!
can you provide more information so we can further explore?

It would help to have:
1. package.json
2. package-lock.json or yarn.lock
3. What filename exactly is being referred to here? you're saying "file above" but it's not clear . what are you referring to.
- **2019-09-07** @mada_uk: @lirantal  The file above I refer to is the screenshot attachment.
The infected file is in npm-cache so not sure which of my projects would have downloaded a corrupt file.
My current package.json is:
`{
  "name": "adp-run",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "axios": "^0.19.0",
    "core-js": "^2.6.5",
    "lodash": "^4.17.15",
    "vue": "^2.6.10",
    "vue-router": "^3.0.3",
    "vuex": "^3.0.1"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "^3.11.0",
    "@vue/cli-plugin-eslint": "^3.11.0",
    "@vue/cli-service": "^3.11.0",
    "@vue/eslint-config-prettier": "^5.0.0",
    "babel-eslint": "^10.0.1",
    "eslint": "^5.16.0",
    "eslint-plugin-prettier": "^3.1.0",
    "eslint-plugin-vue": "^5.0.0",
    "prettier": "^1.18.2",
    "sass": "^1.18.0",
    "sass-loader": "^7.1.0",
    "vue-template-compiler": "^2.6.10"
  }
}`
- **2019-09-07** @mada_uk: @lirantal my package-lock.json is too big to post (internal server error), if you think it will help I can break it up into multiple posts
- **2019-09-07** @mada_uk: @lirantal Also, this may be relevant - my scripts stopped running in Visual Studio Code after updating them. I posted on [gitHub](https://github.com/firebase/firebase-tools/issues/1627), then [stackoverflow](https://stackoverflow.com/questions/57673913/vsc-powershell-after-npm-updating-packages-ps1-cannot-be-loaded-because-runnin) and changed my powerShell settings. 
Also windows defender does quick scans very regularly and has never found anything, I found this miner with a full scan.
- **2019-09-13** @lirantal: It was found that event-stream affected VSCode so I think that was probably why it happened. 
Can you run an `npm ls event-stream` in the project dir and see what you find? (If you don't find anything it's also possible that the file got removed by your AV software and locked down somewhere else)
- **2019-09-15** @mada_uk: @lirantal running `npm ls event-stream` returns `-- (empty)`.
Windows Defender says the threat is blocked/removed
- **2019-10-04** @lirantal: will close the report for now as I don't think we have enough data to act upon. I don't think this is event-stream, but also no other data on which package it may be. if you found out what causes this and can share more please open a new report on H1 or you're welcome to reach out to us on the github repo at https://github.com/nodejs/security-wg by opening a new issue.

appreciate the time and effort you took to file this report ❤️
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
