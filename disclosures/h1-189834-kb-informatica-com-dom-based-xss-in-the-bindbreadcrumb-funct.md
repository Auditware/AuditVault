---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
date: 2017-06-24
submitted: 2016-12-09T13:44:42.532Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/informatica|Informatica]]"
reporter: "s_p_q_r"
source: "https://hackerone.com/reports/189834"
title: "[kb.informatica.com] DOM based XSS in the bindBreadCrumb function"
---
# [kb.informatica.com] DOM based XSS in the bindBreadCrumb function

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Informatica | **Disclosed:** 2017-06-24

- Report: [https://hackerone.com/reports/189834](https://hackerone.com/reports/189834)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2016-12-09T13:44:42.532Z

## Timeline

- **Report Filed**
- **2016-12-14** @ttoko: Hi @s_p_q_r,

Thank you for the very detail report! I was able to reproduce the issue with Internet Explorer. Are you able to trigger XSS in other browsers as well?

Thank you!
- **2016-12-14** @s_p_q_r: Hi,

As for the referrer one I described, looks like no, since we need our payload non-url-encoded. Didn't check the other cases yet though.
- **2016-12-20** @s_p_q_r: Well, actualy this one works for Chrome and Firefox too:

http://spqr.zz.mu/loc.php/'/onmouseover='alert(document.domain)'?//search.informatica.com&url=https://kb.informatica.com/solution/4/Pages/17377.aspx?myk=xxx
- **Report Triaged**
- **2017-02-06** @tarantula_hawk: Dear @s_p_q_r 

Please confirm if you can still reproduce it ?
- **2017-02-06** @s_p_q_r: Hi,

My original PoC link doesn't work anymore, however the issue in general is not fixed yet. There are still some working vectors amongst the ones mentioned in my first post.

For example, https://kb.informatica.com/solution/4/Pages/17377.aspx?#/infasearch.aspx'><svg onload=alert(document.domain)> (Chrome, IE)
- **2017-02-06** @s_p_q_r: I would simply recommend you to html-encode the URL values before inserting it into link tags as the best practice to resolve the issue once and for all.
- **2017-02-22** @tarantula_hawk: Dear @s_p_q_r 

Team has fixed the issue, can you please confirm from your end.
- **Report Severity Updated**
- **2017-03-20** @s_p_q_r: Hi,

Yep, encodeURIComponent has been added:

```javascript
strChild = "<a href=\"javascript:fnRedirectAfterDecode('" + encodeURIComponent(varCurrentPageURL) + "')\" style='color:#fff !important;font-size:10px'>Search Results</a>";
```

However this function doesn't encode single quotes, so XSS is still posible:

1. Go to https://kb.informatica.com/solution/4/Pages/17377.aspx/'-alert(document.domain)-'#/infasearch.aspx
2. Click "Search Results"

Firefox, Chrome
- **2017-03-20** @s_p_q_r: Furthermore, the **fnRedirectAfterDecode** function performs redirection without proper validation:

```javascript
function fnRedirectAfterDecode(urltodecode) {
    try {
        window.location = decodeURIComponent(urltodecode);
  
    } catch(e) {

    }  
}
```

Thus, in case of **javascript:** and **data:** links the script will be executed. This can be performed, for example, via the **varCoveoSearchResultPageURL** value injection:

```html
strChild = "<a href=\"javascript:fnRedirectAfterDecode('" + encodeURIComponent(varCoveoSearchResultPageURL) + "')\" style='color:#999 !important;' >Search Results</a>";
```

which is taken from the cookie value:

```javascript
var varCoveoSearchResultPageURL = fnGetSearchPageURL();

<...>

function fnGetSearchPageURL() {
    return GetKBCookieValue("CoveoSearchUrl");
}
```

which in its turn can be set via any other XSS or cookie injection on any **\*.informatica.com** subdomain.
- **2017-04-11** @tarantula_hawk: Dear @s_p_q_r 

We have applied the fix once again. Can you please check.
- **2017-04-20** @tarantula_hawk: @s_p_q_r 

can you please confirm on this ?
- **2017-04-20** @s_p_q_r: Hi,

Sorry for the delay. I'll try to check it as soon as possible.
- **2017-04-25** @s_p_q_r: Hi,

Yes, seems fixed now.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
