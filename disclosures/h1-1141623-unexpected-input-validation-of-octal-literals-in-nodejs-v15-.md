---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/use-of-inherently-dangerous-function
  - env/web
  - stack/node
substate: "not-applicable"
weakness: "Use of Inherently Dangerous Function"
enriched: true
date: 2021-06-14
submitted: 2021-03-30T14:26:29.714Z
bounty_usd: null
votes: 4
cve: "CVE-2021-28918", "CVE-2020-28360"
program: "[[programs/nodejs|Node.js]]"
reporter: "sickcodes"
source: "https://hackerone.com/reports/1141623"
title: "Unexpected input validation of octal literals in nodejs v15.12.0 and below returns defined values for all undefined octal literals."
---
# Unexpected input validation of octal literals in nodejs v15.12.0 and below returns defined values for all undefined octal literals.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js | **Disclosed:** 2021-06-14

- Report: [https://hackerone.com/reports/1141623](https://hackerone.com/reports/1141623)
- CWE: Use of Inherently Dangerous Function | CVE: CVE-2021-28918, CVE-2020-28360
- Submitted: 2021-03-30T14:26:29.714Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2021-03-30** @mcollina: I do not understand how  `parseInt` returning a wrong value with bad input it is a vulnerability for Node.js. Considering that we are not implementing parseInt, It might be a bug in V8 or in the spec if it allows so (I have not digged into the spec, as said we trust V8).

---

Regarding URL - your report does not mention URL parsing. If a vulnerability exists there, please include a repro.
- **2021-03-30** @targos: I doesn't really make sense to call `parseInt` with a number literal (octal or decimal), as the argument is already a number and `parseInt` is just going to convert that number to a string and then convert the string back to the same number.
Example: `parseInt(010)` is equivalent to `parseInt(8)` and returns `8`. Note that it is not possible to end up with such a case with user input unless the code is dynamically constructed and executed (such as with `eval()`, `new Function()` or the Node.js `vm` module. 
`parseInt` is supposed to be called with a string argument, and is not vulnerable in that case because it has a second radix argument that determines how the conversion is done: `parseInt('010')` is equivalent to `parseInt('010', 10)` and returns `10`.
- **2021-04-01** @sickcodes: Thanks for getting back to me in detail, and I appreciate the furhter explanation.

Sorry for going in circles here, just trying to find out if I am misinterpreting the ECMA or something else is happening.

The comment on line 73:
https://github.com/nodejs/node/blob/master/deps/v8/test/webkit/fast/js/kde/GlobalObject.js#L73


```js
shouldBe('parseInt("015")', "15"); // ES5 prohibits parseInt from handling octal, see annex E.
```

Is the above comment referring to strings?

On the other hand, Mozilla (for the exact same test):

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt#using_parseint

`parseInt('015', 10)    // but `parseInt(015, 8)` will return 13`

I assume that comment is a typo since V8 shows:

```console
> parseInt(015, 8)
11
> parseInt('015', 8)
13
```

I'm not really interested in the bounty, I'm just trying to look out for other developers.

Here's where I'm coming from relevant to your example:

```console
> parseInt('010')
10
> parseInt('010', 10)
10
> parseInt(010, 10)
8
```

But change it to 8's and this is pretty much where I'm coming from, relevant to your example:

```console
> parseInt('08')
8
> parseInt('08', 10)
8
> parseInt(08, 10)  <---- this should be undefined
8
```

The unexpectedness comes from anytime there's an 8 or 9 in the string:

```console
> parseInt('054861')
54861
> parseInt('054861', 10)
54861
> parseInt(054861, 10)  <---- this should be undefined
54861
```

The main argument here is that it will catch a lot of developers out, like the netmask one which was there for many years, and had 278k projects using it.

And if nobody is supposed to be using parseInt unless it's a string argument, why not enforce `0o` notation for good?

I really appreciate the discussion so far, just trying to look out for others who will get unexpected results, which leads to mayhem downstream, but if it's up to spec, it's up to spec. We also published this one today: https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-29662
- **2021-04-01** @mcollina: The lines of code you are referring to are from V8 - Node.js vendors its dependencies. 

I do not feel I am qualified to discuss spec compliance of JavaScript runtimes. I would recommend you to open an issue at https://github.com/tc39/ecma262 or https://bugs.chromium.org/p/v8/issues/list or anyway discuss this publicly with spec experts.
- **Report Not Applicable**
- **2021-04-01** @mcollina: it was really interesting, thanks for reporting!
- **Agreed On Going Public**
- **2021-04-29** @mcollina: I've contacted the rest of the team and I'll let you know asap.
- **2021-06-13** @sickcodes: Thanks, any update on the disclosure request? The talk was accepted at DEF CON and it would be good to present some of the discussion here at DEF CON if that’s okay with the node js team. Just the contrast with what we discussed versus what chromium project discussed, regarding the same issue, and also versus SpiderMonkey.
- **Agreed On Going Public**
- **Report Became Public**
