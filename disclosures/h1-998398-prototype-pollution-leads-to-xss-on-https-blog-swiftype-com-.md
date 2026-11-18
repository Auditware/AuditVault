---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-dom
  - env/web
  - vuln/xss
  - vuln/code-injection
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - DOM"
enriched: true
body: true
date: 2021-08-16
submitted: 2020-10-05T13:36:29.292Z
bounty_usd: null
votes: 157
cve: []
program: "[[programs/elastic|Elastic]]"
reporter: "s1r1u5"
source: "https://hackerone.com/reports/998398"
title: "Prototype Pollution leads to XSS on https://blog.swiftype.com/#__proto__[asd]=alert(document.domain)"
---
# Prototype Pollution leads to XSS on https://blog.swiftype.com/#__proto__[asd]=alert(document.domain)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 157 | **Program:** Elastic | **Disclosed:** 2021-08-16

- Report: [https://hackerone.com/reports/998398](https://hackerone.com/reports/998398)
- CWE: Cross-site Scripting (XSS) - DOM
- Submitted: 2020-10-05T13:36:29.292Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** 
deparam function which parses location.hash in https://s.swiftypecdn.com/install/v2/st.js  is vulnerable to prototype pollution.
There is a script gadget in the same js file which leads to XSS.


## Steps To Reproduce:
Visit (Refresh if you don't see a pop up)
https://blog.swiftype.com/#__proto__[asd]=alert(document.domain)

## Root Cause
https://s.swiftypecdn.com/install/v2/st.js is the vulnerable file.
deparam function parses the ` location.hash` incorrectly which leads to Prototype Pollution.

```

 t.deparam = h = function(e, n) {
            var i = {}
              , r = {
                "true": !0,
                "false": !1,
                "null": null
            };
            return t.each(e.replace(/\+/g, " ").split("&"), function(e, o) {
                var s, a = o.split("="), u = b(a[0]), c = i, h = 0, p = u.split("]["), f = p.length - 1;
                if (/\[/.test(p[0]) && /\]$/.test(p[f]) ? (p[f] = p[f].replace(/\]$/, ""),
                p = p.shift().split("[").concat(p),
                f = p.length - 1) : f = 0,
                2 === a.length)
                    if (s = b(a[1]),
                    n && (s = s && !isNaN(s) ? +s : "undefined" === s ? l : r[s] !== l ? r[s] : s),
                    f)
                        for (; h <= f; h++)
                            u = "" === p[h] ? c.length : p[h],
                            c = c[u] = h < f ? c[u] || (p[h + 1] && isNaN(p[h + 1]) ? {} : []) : s; //pollution here
                    else
                        t.isArray(i[u]) ? i[u].push(s) : i[u] !== l ? i[u] = [i[u], s] : i[u] = s;
                else
                    u && (i[u] = n ? l : "")
            }),
            i
        }

```

Gadget found in the same js, which is very interesting gadget I found so far :xD

```

    
        pInstall._convertStringHooksToFunctions = function() {
            var functionHooks = {};
            $.each(this._userServerConfiguration.install.hooks, function(hookName, hookFunction) {
                functionHooks[hookName] = eval(hookFunction) //eval everything in the object
            }),
            this._userServerConfiguration.install.hooks = functionHooks
        }
        

```

## Impact: 
XSS

## Impact

XSS

## Timeline

- **Report Filed**
- **Report Triaged**
- **Bounty Awarded**
- **Report Severity Updated**
- **Bounty Awarded**
- **2020-10-07** @s1r1u5: wow, thats great @douglas_day 
Thanks,
s1r1us
- **Bounty Awarded**
- **2020-10-18** @s1r1u5: Hi @douglas_day ,

It seems fixed, can I publish it here https://github.com/BlackFan/client-side-prototype-pollution/?

Thanks and regards,
s1r1us
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
