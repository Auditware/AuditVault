---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "informative"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2021-01-08
submitted: 2019-10-01T02:48:40.536Z
bounty_usd: null
votes: 6
cve: "CVE-2018-3774"
program: "[[programs/curl|curl]]"
reporter: "jlleitschuh"
source: "https://hackerone.com/reports/704621"
title: "SSRF via maliciously crafted URL due to host confusion"
---
# SSRF via maliciously crafted URL due to host confusion

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 6 | **Program:** curl | **Disclosed:** 2021-01-08

- Report: [https://hackerone.com/reports/704621](https://hackerone.com/reports/704621)
- CWE: Server-Side Request Forgery (SSRF) | CVE: CVE-2018-3774
- Submitted: 2019-10-01T02:48:40.536Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

Curl is vulnerable to SSRF due to improperly parsing the host component of the URL compared to other URL parsers and the [URL living standard](https://url.spec.whatwg.org/).

## POC

`curl -sD - -o /dev/null "http://google.com:80\\@yahoo.com/"`

Curl makes a request to `yahoo.com` instead of `google.com`.

## Supporting Material/References:
  * [Exact question to URL standards body](https://github.com/jsdom/whatwg-url/issues/137#issuecomment-536797948)
  * [CVE-2018-3774](https://nvd.nist.gov/vuln/detail/CVE-2018-3774) similar vulnerability in an NPM lib
    * See also: https://hackerone.com/reports/384029

To quote the standards body issue:

> Specifically the authority state deals with parsing the @ properly. However as you'll notice if it encounters the `\` beforehand, it'll go into the host state and reset the pointer at which point it won't consider `google.com:80\\` auth data for `yahoo.com` anymore.

## Other Libraries

```javascript
const whatwg_url = require('whatwg-url'); // Created by the RFC maintainers

const theUrl = new whatwg_url.URL("https://google.com:80\\\\@yahoo.com/");
const theUrl2 = new whatwg_url.URL("https://google.com:80\\@yahoo.com/");

const nodeUrl = new URL("https://google.com:80\\\\@yahoo.com/");
const nodeUrl2 = new URL("https://google.com:80\\@yahoo.com/");

console.log(theUrl.hostname); // Prints google.com
console.log(theUrl2.hostname); // Prints google.com
console.log(nodeUrl.hostname); // Prints google.com
console.log(nodeUrl2.hostname); // Prints google.com
```

## Impact

If another library implementing the URL standard is used to white/blacklist a request by host but the actual request is made via curl or the curl library, an attacker can smuggle the request past the URL validator thus allowing an attacker to perform SSRF or an open redirect attack.

## Timeline

- **Report Filed**
- **2019-10-01** @bagder: Thanks for your report, we will investigate.

However, note that curl and libcurl speak URLS as per the IETF spec RFC 3986 and not per the "URL standard" that WHATWG ships and that browsers tend to mostly adhere to. The state of URLs in the world remains very very poor and there's no universal standard.
- **2019-10-01** @bagder: tl;dr: I don't consider this a bug. At least not our bug.

Unfortunately, this is a bug WHATWG brought to the world when they broke backwards compatibility with RFC3986. curl has consistently handled the authority part of the URL exactly as RFC 3986 declares from  back when the RFC was published (2005).

Here's a document explaining some of the most glaring [URL interop issues](https://github.com/bagder/docs/blob/master/URL-interop.md).

WHATWG *changed* how a "URL" works in a non-compatible way that we couldn't easily follow as that would break functionality for our users (plus all the other craziness crap they do in that spec) so we've stuck to the RFC meaning. In order to mitigate some of the most obvious problems in this new world of URL chaos curl contains a bunch of "kludges" to bridge the gap between the RFC and what browsers do but not all gaps are possible to bridge. The authority part of the URL is one of those.

In my opinion, [the RFC](https://tools.ietf.org/html/rfc3986#section-3.2) is quite clear in that the `@`-letter is a separator between the userinfo and the host name. To quote it:

> The user information, if present, is followed by a  commercial at-sign ("@") that delimits it from the host.

... and there's no special treatment for backslashes so you can't "escape" the at symbol in the userinfo part. It needs to be URL encoded (`%40`) if you want it to be part of the name or the password.

Finally I want to add that I've struggled and fought against WHATWG's destroying compatibility with legacy URLs but without much success.

curl and libcurl are certainly not alone in parsing URLs per the RFC. And since the WHATWG standard is "living", basically no one follows it exactly - and I've pointed out several such omissions over the years.
- **2019-10-01** @jlleitschuh: Well, that URL interop document is a sobering look at the current state of the ecosystem.

@bagder if you have the time, that whole document could be turned into a very interesting Defcon talk that I would 100% want to watch.

The problem that I see is that, as a Java developer implementing a URL whitelist for, say, protecting against open-redirect, I'm going to use the libraries URL parser and ensure that the host declared matches my white list. However, as we can clearly see, the whitelist that I create could easily be bypassed by an attacker by hiding their own URL in something that my server-side logic will have validated as safe.

This conflict around who's right isn't actually doing the users we're trying to protect much good.

Given that all major browsers seem to use the WHATWG standard, wouldn't it be better to push our industry forward instead of holding on to older standards? If that's not the right answer, do we as an industry need to make a bigger push back against the ratification of the WHATWG standard and get browser vendors to roll back their decision to support it?

What is the correct path forward here to protect the users that have no idea that this issue even exists?
- **2019-10-01** @bagder: Thanks. It certainly could've been fun to do a talk based on that document as I have in fact been on this URL standards crusade for many years already. I even went back and found this blog post of mine from 19 months ago: [One URL standard please](https://daniel.haxx.se/blog/2017/01/30/one-url-standard-please/) which discusses pretty much *exactly* this userauth parsing problem you've mentioned here. That was a follow-up from my 2016 blog post [My URL isn't your URL](https://daniel.haxx.se/blog/2016/05/11/my-url-isnt-your-url/).

As [I'm barred from entering the US](https://daniel.haxx.se/us-visa.html), it could never be done on a US based conference though. A good previous talk that is basically a version of what it could be is this: [Exploiting URL Parser in Trending Programming Languages!](https://youtu.be/2MslLrPinm0) (even if some of what he says in there has been fixed since, it was a contributing reason to why libcurl introduced a URL parser API.)

> Given that all major browsers seem to use the WHATWG standard

Browsers do yes, especially over time because they can forget history rather swiftly in ways not everyone else can.

> wouldn't it be better to push our industry forward instead of holding on to older standards?

I don't think we've seen proof that WHATWG is a good shepherd or caretaker of such an important document as a URL spec (I would actually argue the contrary). They're just too focused on browsers and their own game only and ignores pretty much everything else - and in case you've missed it: URLs are used for much than just in browsers. Also, the way the document is maintained and handled leaves a lot to be desired in my view.

I realize this "URL spec battle" is often little me against enormous company behemoths but I wouldn't do it if I didn't think that the Internet loses the day we all give in and let WHATWG dictate this.

I mostly blame WHATWG for this state of affairs (and they know I do). Secondarily, I blame the IETF who hasn't had the nerve to step up to challenge WHATWG and work on a RFC3986 update to unify the world - and I know there are a lot of IETF people (friends!) who refuse to accept the WHATWG way of defining URLs.

> What is the correct path forward here to protect the users

I really, strongly and sincerely wish I had a good answer for this. I don't.

For users of libcurl, I can only strongly urge and recommend users to also use the libcurl API for parsing URLs etc. It is the *mixing* of URL parsers that is the risky thing.

I'll keep talking, blogging, complaining and informing the world of how URLs (don't) work. One of these days something will change and improve.

So, back to this issue at hand. This is not a new issue and it is widely known in these circles. It is not something we can easily address in the short term.
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
