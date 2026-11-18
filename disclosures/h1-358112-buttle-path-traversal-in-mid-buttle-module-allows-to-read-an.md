---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/path-traversal
  - env/web
  - stack/node
  - vuln/path-traversal
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2018-06-27
submitted: 2018-05-27T14:40:36.614Z
bounty_usd: null
votes: 12
cve: "CVE-2018-3766"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "n0n4me"
source: "https://hackerone.com/reports/358112"
title: "[buttle] Path traversal in mid-buttle module allows to read any file in the server."
---
# [buttle] Path traversal in mid-buttle module allows to read any file in the server.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Node.js third-party modules | **Disclosed:** 2018-06-27

- Report: [https://hackerone.com/reports/358112](https://hackerone.com/reports/358112)
- CWE: Path Traversal | CVE: CVE-2018-3766
- Submitted: 2018-05-27T14:40:36.614Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Node.js third-party modules

I would like to report path traversal in buttle module
It allows me to read any file in the server if i know the path.

# Module

**module name:** buttle
**version:** 0.2.0
**npm page:** `https://www.npmjs.com/package/buttle`

## Module Description

Simple static file (+ markdown) server.

## Module Stats

[21] downloads in the last week

# Vulnerability

## Vulnerability Description

module mid-buttle.js uses regex to check the url containing the string ".markdown". I think, the right check of the author wants, is string ".markdown" located the end of the url. But he forgot the $ in the regex. That is the first vulnerability. The second is he does not check for path traversal (../). 

```
 var url = req.url;
    if(/\.md$/i.test(url) || /\.markdown/i.test(url)) {
      fs.exists(j(dir, url), function(exists) {
        if(exists) {
          fs.readFile(j(dir, url), {encoding: 'utf8'}, function(err, data) {
            if(err) { return res.end(err.message); }
            res.end(wrapInHtml(md(data)));
          });
        } else {
          next();
        }
      });
    } else {
      next();
}
```
Link in github: https://github.com/jtrussell/buttle/blob/master/lib/mid-buttle.js#L16
## Steps To Reproduce:

install buttle
```
$ npm install -g buttle
```
start buttle
```
$ buttle ./
```
start the burpsuite. Enter the url contain string ".markdown" and ../ to traverse to the file you want.
{F302395}
## Patch

I recommend that:
1. Should filter ".." in url before using that for reading file. (check path traversal)
2. correct the specific string in the url for your check. (check logic bug)

## Supporting Material/References:

- Kali linux 4.15.0
- v8.11.2
- 6.1.0
- Burpsuite community

# Wrap up

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

## Impact

The malicious user can use this vulnerability to read some file containing credential, ssh key files, source code ...

## Timeline

- **Report Filed**
- **2018-05-27** @n0n4me: I found another bug is information disclosure in the module "mid-php.js". When you execute a exist file php append '/' the server will reveal the absolute path to that file.

{F302396}

link in github: https://github.com/jtrussell/buttle/blob/master/lib/mid-php.js#L26
- **Report Triaged**
- **2018-06-16** @lirantal: Hi @n0n4me,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **2018-06-16** @n0n4me: Thanks.
- **Report Severity Updated**
- **2018-06-26** @lirantal: @n0n4me I will disclose it as the author isn't responsive and we had have already other reports with the same problem.
- **2018-06-27** @n0n4me: Will I have a CVE ?
- **2018-06-27** @lirantal: Yes of course, I'm going to request it now and disclose the report.
- **2018-06-27** @n0n4me: Thank you.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
