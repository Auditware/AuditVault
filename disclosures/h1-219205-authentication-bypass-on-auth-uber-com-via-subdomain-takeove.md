---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authentication-generic
  - env/web
  - vuln/xss
  - vuln/csrf
  - vuln/code-injection
  - vuln/authentication-bypass
  - vuln/subdomain-takeover
  - impact/rce
  - impact/credential-theft
  - trigger/session-cookie
  - trigger/social-engineering
  - fix/csp
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2017-07-13
submitted: 2017-04-07T03:29:14.613Z
bounty_usd: null
votes: 183
cve: []
program: "[[programs/uber|Uber]]"
reporter: "arneswinnen"
source: "https://hackerone.com/reports/219205"
title: "Authentication bypass on auth.uber.com via subdomain takeover of saostatic.uber.com"
---
# Authentication bypass on auth.uber.com via subdomain takeover of saostatic.uber.com

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 183 | **Program:** Uber | **Disclosed:** 2017-07-13

- Report: [https://hackerone.com/reports/219205](https://hackerone.com/reports/219205)
- CWE: Improper Authentication - Generic
- Submitted: 2017-04-07T03:29:14.613Z

## Report summary

Technical summary: https://www.arneswinnen.net/2017/06/authentication-bypass-on-ubers-sso-via-subdomain-takeover/

subdomain takeover of saostatic.uber.com allowed for access to *.uber.com scoped SSO cookies. In response to this report, we immediately fixed the subdomain takeover and then added additional protections (IP restriction) to our *.uber.com SSO cookies to mitigate ATO possibility of subdomain takeover in the future.

We appreciate @arneswinnen's high quality report and the open interaction on the tradeoffs between various SSO schemes -- we look forward to future reports and interactions with him in the future.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
This is not a standard vulnerability, but a chain of two more exotic vulnerabilities leading to a full authentication bypass of your SSO login system at auth.uber.com (via saostatic.uber.com). The root cause of this authentication bypass is two-fold:

1. Subdomain saostatic.uber.com was pointing to Amazon Cloudfront CDN, but the hostname was not registered there anymore. This allowed me to fully takeover this domain. It is now serving content of my own webserver, both over http and https (highly similar to [175070](https://hackerone.com/reports/175070) - however, I must disagree with "there are some mitigating factors (cookie scope) that make this not as bad as it might appear at first blush."). 
2. Your SSO system at auth.uber.com issues session cookies which are temporarily shared between all https://*.uber.com subdomains through its "domain=.uber.com" attribute. Although there were some countermeasures to prevent theft, the current setup still allows leakage of these high-value session cookies to the overtaken subdomain https://saostatic.uber.com in all modern browsers, leading to a full Authentication Bypass (highly similar to [172137](https://hackerone.com/reports/172137)).

## Security Impact
The security impact of the subdomain takeover is that Uber can be impersonated via this webpage. A valid SSL certificate could easily be generated for this domain via Let's Encrypt, which would make it ideal for e.g. phishing attacks. 

The security impact of the SSO system using shared session cookies for https://*.uber.com is, in combination with the subdomain takeover vulnerability, an Authentication Bypass via session hijacking. A victim must be authenticated to auth.uber.com and then visit a webpage under the attacker's control to be exploited successfully - no further interaction is required from the victim, the attack can be performed stealthily without the user noticing or being notified by Uber. The end result is that the attacker can now impersonate the victim on any of the *.uber.com which rely on auth.uber.com for authentication, such as riders.uber.com, partners.uber.com, developer.uber.com, bonjour.uber.com, etc. 

# 1. Subdomain Takeover

The subdomain "saostatic.uber.com" was (and still is) a CNAME pointing to a AWS Cloudfront CDN server (depending on your location, the latter will resolve differently):
```
# nslookup saostatic.uber.com 8.8.8.8
Server:		8.8.8.8
Address:	8.8.8.8#53

Non-authoritative answer:
saostatic.uber.com	canonical name = d3i4yxtzktqr9n.cloudfront.net.
```
However, the hostname "saostatic.uber.com" was not claimed anymore on Cloudfront, resulting in a Cloudfront error page when visiting the subdomain before the takeover:

{F173887}

Subsequently, a new Amazon Cloudfront CDN endpoint was created and linked to an attacker-controlled origin server. For the new Cloudfront CDN endpoint, "saostatic.uber.com" was designated as hostname successfully:

{F173885}

This concluded the subdomain takeover. Visual proof can be found at http://saostatic.uber.com/subdomaintakeoverbyarneswinnen.html (unguessable filename chosen to not negatively affect Uber's reputation during takeover period) :

 {F173884}

#2. Authentication Bypass

In Uber's SSO system, auth.uber.com acts as Identity Provider and issues temporarily shared session cookies for https://*.uber.com to communicate identities to Service Providers (e.g. riders.uber.com, partners.uber.com, etc). Service Providers on their end immediately destroy the incoming temporary shared session cookies in case of erroneous (e.g. issued for other Service Provider) or successful authentication, ensuring the window for theft is small:

 {F202679}

The precious shared session cookie "_csid" can thus only be stolen between step 9 and 10, which is a very short period (automatic browser redirect). Although not impossible to exploit, a more convenient flaw was identified that allows the shared session cookie to remain alive after step 9 in the browser's cookie store in the diagram above. The issue is that, if the victim is already logged in at https://riders.uber.com (situation after last step 12 in diagram) when receiving a request containing a valid newly generated shared session cookie "_csid", it is simply ignored. Hence it stays alive in the browser until its cookie store is cleared. An attacker simply needs to directly issue another login scenario starting from step 3 in the above diagram, and end with an additional hidden request to https://saostatic.uber.com to steal the precious session cookie:

{F202676}

So now an attacker has his/her hands on the victim's "_csid" shared session cookie for https://riders.uber.com, he/she can execute the normal login flow in their own browser and replace the issued "_csid" cookie value in step 9 of the first Uber SSO Login diagram to be logged in as the victim, right? Wrong. There's another countermeasure in place, namely a variant of login cross-site request forgery protection. This is the actual updated Uber SSO Login 2 diagram:

{F202678}

The problem here are the GET param state=CSRFTOKEN and locally scoped state cookie that are added in step 3 by the Service Provider riders.uber.com and verified in step 11. Since we can't steal these values from the victim's browser, but only the "_csid" shared session cookie, this means game over, right?

No! An attacker can obtain a proper CSRFTOKEN value and accompanying state cookie value from https://riders.uber.com by starting a normal login scenario on their end (e.g. in their own browser or via a simple script). He/she can then relay the auth.uber.com URL to the victim's browser to get the "_csid" shared session cookie for these values, and inject these in his/her own browser login scenario again in step 9. In this manner, the victim effectively generates the "_csid" temporary session token for the attacker's login scenario in a separate browser, but this works flawlessly. This still allows exploitation and thus victim impersonation in the following manner (we still assume that the victim is already logged in to auth.uber.com and visits a webpage under control by the attacker, so we basically continue the flow from the above third and last diagram): 

{F202677}

# PoC

In the PoC below, the assumption is made that https://saostatic.uber.com is actually serving a valid certificate in the victim's browser, which currently is not the case (so there is currently no actual exposed risk). I figured you might not appreciate that. 

1. Open the victim's browser & browse to https://riders.uber.com . After being redirected to https://auth.uber.com , login with the victim's credentials so you end up on https://riders.uber.com trips dashboard again.
2. Open a second browser tab in the victim's browser and browse to https://saostatic.uber.com/prepareuberattack.php . Accept any certificate warnings that you may receive here - again, we're only simulating that the domain has a valid SSL certificate. Once the page has finished loading you should see a URL, "Cookie: " string and a "Set-Cookie: " strings underneath each other. This is all info gathered under the hood by the attacker's webserver that is required to login as the victim now.
3. Open the separate attacker's browser and setup an intercepting proxy tool to intercept requests and responses. Browse to the URL displayed on the prepareuberattack.php page output and intercept this request. Now copy the "Cookie: ..." string displayed on prepareuberattack.php and paste it into the request headers. 
4. The response should be a redirect to https://riders.uber.com/trips, indicating successful authentication bypass. Last but not least, copy all the "Set-Cookie: " lines from the prepareuberattack.php page output and paste them in the response before forwarding it to the browser. This ensures that the stolen cookies are properly injected in the attacker's browser. 
5. You are now logged in as the victim in the attacker's browser 

In a real attack scenario, an attacker would stealthily load https://saostatic.uber.com/prepareuberattack.php in the victim's browser, e.g. through an iframe. Likewise, he/she would probably not display the URL and all the cookies on the PHP page, but store this on the server-side, ready to be abused in a stealthy fashion. 

You can see all these PoC steps executed in attachment "8. Authentication Bypass PoC video.mp4", where browser 1 and browser 2 had separate upstream servers and thus even other IP addresses to prove this is a plausible threat. The code of the https://saostatic.uber.com/prepareuberattack.php and https://saostatic.uber.com/uberattack.php pages is also attached ("9. prepareuberattack.php" and "10. uberattack.php"). This was written quick & dirty for PoC purposes - I know the code is pretty hacky.

# Recommendations
1. The recommendation for the subdomain takeover is straightforward: remove the dangling DNS CNAME pointer to Amazon CloudFront and the issue is resolved.
2. The recommendation for the generic Authentication Bypass issue is a bit more problematic. The fact that identities supplied to Service Providers by the Identity Provider are communicated via shared *.uber.com cookies make them susceptible for all vulnerabilities that allows insight in cookies on any *.uber.com subdomain. This includes remote code execution, subdomain takeover,  debug logs, etc and has a very serious impact on Uber's overall security, even when the subdomain is hosted in a completely isolated environment. 
For example, all the mentioned out of scope *.uber.com subdomains in the program's listing (bizblog.uber.com, newsroom.uber.com etc) have the inherent ability to bypass authentication of any Uber user, even though they might be remotely managed by an external party with lower security standards than Uber. Ironically enough, any service that wants to benefit from the current Uber SSO system will have to receive a *.uber.com subdomain, as this is required by design. This in its turn increases the attack surface for abuse of the generic Authentication Bypass. 
On the short term I would recommend fixing the fact that the "_csid" cookie can remain alive in a browser once a user is already logged in (although [Jack Whitton already showed that CSP could be abused to prevent a victim to make the request back to the Service Provider and invalidate the token](https://whitton.io/articles/uber-turning-self-xss-into-good-xss/), so I wouldn't put too much trust in that). On the mid-to-long term I would advise Uber to migrate to a real OAuth SSO system that communicates identity secrets and proofs by other means than shared cookies, e.g. GET parameters (OAuth "code" flow) or window.location.hash values (e.g. OAuth "access tokens" flow). 

Let me know if anything is unclear.

Cheers,

Arne Swinnen
https://www.arneswinnen.net

## Timeline

- **Report Filed**
- **2017-04-07** @tno: @arneswinnen -- Thanks for this detailed report!  We'll take a look and get back to you asap.
- **2017-04-09** @arneswinnen: Hi Uber,

Sure, take your time and let me know if you have any additional questions. 

I wanted to add one other remark: In order to reduce the current risk of Authentication Bypass via session hijacking, you could already do the following. When Identity Provider auth.uber.com issues a valid shared "_csid" cookie token for a Service Provider, store the IP address of the visitor who requested the "_csid" on the server-side database. Every Service Provider should then always verify that the visitor who's trying to authenticate with a "_csid" cookie has the same IP address as the original requesting visitor of this cookie from auth.uber.com against the server-side database. 

I have seen similar countermeasure implementations on SSO systems which use shared session cookies to communicate identities. This would prevent the session relay attack which I described partially: only when an attacker and a victim have the same external IP address, the relay attack I described above could still work. The risk is thus not fully mitigated and I would still recommend migrating to a SSO system which does not rely on shared session cookies at all. However, as a temporary countermeasure, this would already reduce the current risk greatly. Note that IP spoofing (e.g. via [HTTP Header "X-Forwarded-For"](http://blog.ircmaxell.com/2012/11/anatomy-of-attack-how-i-hacked.html)) should also be impossible.

Cheers,

Arne
- **2017-04-10** @arneswinnen: Hi Uber,

Just came across this: https://ma.ttias.be/caa-checking-becomes-mandatory-ssltls-certificates/

When implemented correctly by Uber, this would prevent issuing a valid SSL certificate for hijacked subdomains, hence preventing read access to the shared session cookie "_csid" since it has the Secure flag and is only sent via HTTPS automatically by modern browsers. Another defense in depth measure you might consider. 

Cheers,

Arne
- **Report Triaged**
- **Bounty Awarded**
- **Report Severity Updated**
- **2017-04-18** @arneswinnen: Hi Uber,

Great that you already award the minimum bounty immediately after triage, thank you! I've just updated the CVSS score based on my understanding - let me know if you see this otherwise.

Cheers,

Arne
- **2017-04-26** @arneswinnen: Hi Uber,

Would you have any update about either the subdomain takeover and/or the SSO session cookies vulnerabilities? I have noticed that the subdomain is still hosting my content, after 3 weeks since I reported it. Would you like me to release it again or...?

Arne
- **2017-05-02** @arneswinnen: Hi Uber,

In retrospect, I noticed that I often referenced ██████ whereas I actually meant uber.com in the diagrams (mainly browser cookie stores). I recently wrote a completely different submission to ███████'s bug bounty program at HackerOne, which must have anchored this inside my head. Apologies. 

Simply interpreting all "██████████" references as "uber.com" should be correct. Let me know if you have any difficulties and I'll visually fix them in newly supplied diagrams.

Arne
- **2017-06-06** @arneswinnen: Hi @Uber,

Any updates about this one? Are you perhaps replacing the whole SSO system behind auth.uber.com ? 

In any case, would it be possible to already remove the DNS CNAME record for saostatic.uber.com or reclaim it again, so I don't have to keep a hold of it on your behalf? It's still serving my webserver's content at this very moment...

Thanks,

Arne
- **2017-06-06** @fletcher: Heyo @arneswinnen,

I managed to miss this (awesomely written) report -- I'm going to catch myself up on it and will follow-up in a bit; apologies for any delay.

Thanks,
Rob
- **2017-06-06** @fletcher: Ok, I've followed up with the internal team to delete the CNAME record associated with `saostatic.uber.com`  and I'll update this report once I've got more details.

We will not be addressing the SSO and cookie scoping issues at this time as the exploit scenario is unlikely and convoluted. Also, some of the recommendations you suggest have similar downfalls -- for example, using the fragment identifier to hold an OAuth token can result in token exposure if there is an unrestricted open redirect (since fragment identifiers persist on redirects unless explicitly overwritten via `Location:` HTTP header).

Thanks for the great report and apologies again for the delay.

Cheers,
Rob
- **2017-06-06** @arneswinnen: Hi @fletcher,

Thanks for the feedback. Let me know if you'd like to keep the saostatic.uber.com subdomain on Cloudfront, I'll release asap in that case.

Could you elaborate on your decision to not address the SSO issue? Maybe I have not been clear with the attack scenario, but it's **exactly** the same as the typical OAuth attack you describe, only on *.uber.com instead of on one single subdomain:
1. Victim logs in on any *.uber.com domain via auth.uber.com
2. Victim visits a website partly under the control of the attacker in another tab (e.g. a purchased ad on a popular website such as youtube.com or even *.uber.com, a waterhole attack)
3. Attacker can now stealthily generate and steal session cookies for any *.uber.com site on behalf of the victim. That means riders.uber.com, partners.uber.com, bonjour.uber.com, developer.uber.com, ...

In my opinion, it's not extremely unlikely or convoluted. It's literally the same attack as the OAuth redirect you describe, except this attack can be performed on all *.uber.com subdomains, not just one for which the redirect_uri is not strictly checked. [Other](http://thehackernews.com/2016/04/microsoft-bug-bounty.html) [bug](http://blog.mish.re/index.php/2017/04/29/yahoo-bug-bounty-chaining-3-minor-issues-to-takeover-flickr-accounts/) [bounty](https://hackerone.com/reports/110467 ) [programs](https://stephensclafani.com/2017/03/21/stealing-messenger-com-login-nonces/) have estimated this as high/critical risk. Could you elaborate why you see this differently, and make a CVSS score calculation on your end as well? 

In general, I believe the current SSO system should really be replaced to standard OAuth on the long term for the following reasons:
- Its flaws are impossible to mitigate, they are here by design and they will always stay. In a hardened OAuth system where redirect_uri's are properly checked (no wildcards for subdomains or paths) and you only use site-specific authentication codes instead of tokens, there are very few possible attacks. Standard OAuth 2 libraries support all of this out of the box. 
- The current system encourages to put anything under \*.uber.com, to leverage the SSO. This increases the attack surface by design. From a risk point of view, it would not make any sense to exclude \*.uber.com from your bug bounty program, as a compromise of any \*.uber.com subdomain may result in the aforementioned Authentication Bypass for **any** uber.com subdomain asset for your [40 million monthly active users](http://expandedramblings.com/index.php/uber-statistics/). 

Last but not least, I was also hoping that I could publicly disclose this issue once it's been resolved, as it's a great example of the inherent risks of an SSO system based on shared cookies. But of course, if you're not planning on resolving this, I'm not sure if you would be supportive of that. Let me know what your stance is on this (I won't give you trouble, no matter the outcome). 

Arne
https://www.arneswinnen.net
- **2017-06-07** @fletcher: Using cookie scoping to enable SSO across subdomains is a commonly used best practice -- for example, if you login to mail.google.com and then navigate to keep.google.com, you will notice that there is no keep.google.com auth cookie but instead a *.google.com auth cookie that allows for SSO across google.com subdomains.

As with all SSO schemes, there are known advantages and disadvantages that are a balance of security and UX. With both 2-legged and 3-legged OAuth flows, there are potential vulnerabilities with how you redirect the user in the flow which can result in token exposure. Using a cookie scoped approach for SSO, means we have to be sure any auth cookies are marked HttpOnly and we have to avoid subdomain takeovers.

Based on our experience, open-redirects are more common than subdomain takeovers. To mitigate this potential exposure, we are working on consolidating our subdomains and monitoring/enforcing DNS hygiene.

HttpOnly flag is not something unique to this SSO setup -- any authenticated session will have the concept of a bearer token that if not marked HttpOnly (or stored in localStorage) will be vulnerable to exfiltration via XSS attacks. Either way, we mitigate this by investing in frameworks that are secure by default (e.g. automatically set cookies to HttpOnly) and have automation in place to identify when auth cookies aren't marked HttpOnly.

For the reasons above, we believe cookie-scoping based SSO to be secure while also maintaining desirable characteristics like 'universal' SSO for uber.com subdomains without the need to explicitly grant authorization to individual to unique apps at different subdomains.
- **Report Resolved**
- **2017-06-07** @arneswinnen: Hi @Fletcher,

Thanks for your extensive feedback, much appreciated. I can confirm the DNS CNAME record has been removed and the subdomain takeover threat is mitigated. Here are my final two cents on the SSO discussion:

I can confirm that when logging in to mail.google.com and then browsing to keep.google.com, there is no hidden redirect via accounts.google.com (their SSO). However, when doing it the other way around, there is (https://accounts.google.com/ServiceLogin?service=mail, which redirects back to mail.google.com with several OAuth-like tokens through some GET parameters). This is because Google only relies on the shared session cookie for their non-critical services, but they have a "proper" OAuth-like SSO re-authentication for their critical subdomains (drive.google.com as well, for example). Based on your [treasure map](https://eng.uber.com/bug-bounty/), these would be riders.uber.com, partners.uber.com and vault.uber.com for Uber (and maybe some others). 

I also don't fully understand your argument. In Uber's current implementation, if you first login to riders.uber.com and then go to partners.uber.com, you will be redirected via auth.uber.com. The real issue is that the identity is communicated via shared session cookies which are by design shared with *.uber.com and thus more vulnerable for theft, unlike GET parameters in hardcoded redirects. 

I have tested **many** SSO implementations, and have found it much more difficult to compromise a decently configured OAuth SSO system with hardcoded redirect_uri's and only the "code" authorization flow, instead of a full shared SSO session cookie system. No open redirect vulnerability will aid in exploitation of a properly configured OAuth flow anymore: [modifying the redirect_uri to an open redirect endpoint on the same domain these days prevents exchanging a "code" for an "access token"](https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow#exchangecode) and thus yields the attacker nothing:
> redirect_uri. This argument is required and must be the same as the original request_uri that you used when starting the OAuth login process.

You can test this by simply changing/appending one character to an original redirect_uri when performing a "Login with Facebook" OAuth code flow. It will not work anymore, this attack you speak of has been mitigated universally a while ago. Google, Linkedin and other major players have the same technique implemented at this moment. All self-respecting OAuth libraries have this functionality built-in as well (the good ones have it enabled by default). 

As far for UX and HttpOnly attributes on any session cookies, I don't see any difference between the two SSO options. The current auth.uber.com implementation has the HttpOnly attribute set on all issued temporary session cookies, but this didn't prevent the attack. 

However, I would still completely understand that you don't want to go through all the effort of changing the SSO system because of this, and accept this inherent risk. In that case, I do believe this should yield the following consequences:
- Any vulnerability on an \*.uber.com subdomain that yields visibility into incoming cookies with the Secure and HttpOnly attributes set (not XSS, but e.g. subdomain takeover, debug logs exposure, RCE, ...) would have a high/critical impact. The attack and PoC video I supplied shows that the attack scenario is exactly the same as for theft of an OAuth access token, except that this works for *any* \*.uber.com subdomain (riders, partners, vault, ...) as opposed to just one in a typical OAuth exploit scenario. It's very similar to many recent [other](http://thehackernews.com/2016/04/microsoft-bug-bounty.html) [bug](http://blog.mish.re/index.php/2017/04/29/yahoo-bug-bounty-chaining-3-minor-issues-to-takeover-flickr-accounts/) [bounty](https://hackerone.com/reports/110467) [program]( https://stephensclafani.com/2017/03/21/stealing-messenger-com-login-nonces/ ) submissions I also mentioned before, just worse for Uber. 
- Based on the aforementioned point, it would not make any sense anymore to exclude any \*.uber.com subdomain from your bug bounty program's scope, as they carry an inherent high/critical risk should they be compromised (most notably \*.dev.uber.com, \*.et.uber.com, bizblog.uber.com, newsroom.uber.com, love.uber.com, drive.uber.com, eng.uber.com, people.uber.com, ...). Especially the first two seem problematic to me. 

If you opt to keep the current SSO system (which, again, I would completely understand from a pragmatic ROI perspective), I would however still advice to implement the check I mentioned in a comment. This would **greatly** reduce the exposed current risk:
>I wanted to add one other remark: In order to reduce the current risk of Authentication Bypass via session hijacking, you could already do the following. When Identity Provider auth.uber.com issues a valid shared "_csid" cookie token for a Service Provider, store the IP address of the visitor who requested the "_csid" on the server-side database. Every Service Provider should then always verify that the visitor who's trying to authenticate with a "_csid" cookie has the same IP address as the original requesting visitor of this cookie from auth.uber.com against the server-side database.

>I have seen similar countermeasure implementations on SSO systems which use shared session cookies to communicate identities. This would prevent the session relay attack which I described partially: only when an attacker and a victim have the same external IP address, the relay attack I described above could still work. The risk is thus not fully mitigated and I would still recommend migrating to a SSO system which does not rely on shared session cookies at all. However, as a temporary countermeasure, this would already reduce the current risk greatly. Note that IP spoofing (e.g. via HTTP Header "X-Forwarded-For") should also be impossible.

Looking forward to your response. By any means, if you fundamentally disagree with any of my arguments or anything is unclear, let me know.

Arne
- **2017-06-09** @fletcher: This is awesome! I love conversations like this, so I appreciate the thoughtful response. I also want to emphasize that my comments weren't an attempt to disprove your claims -- I'm was attempting to highlight our thought process and openly consider the different tradeoffs of various SSO systems.

When I was talking about the threats around OAuth redirects I was alluding to these two issues ([1](https://tools.ietf.org/html/rfc6819#section-4.1.5), [2](https://tools.ietf.org/html/rfc6819#section-4.2.4)) specifically.

I do agree with this statement "much more difficult to compromise a decently configured OAuth SSO", but I think you could apply the same logic to a cookie based SSO system. If we have a "decently configured" cookie SSO system, then we are just as secure with a better user experience based on our needs.

With regards to your suggested IP address mitigation, I completely agree and that's something we already have on our list for future enhancements.

To summarize our position, we believe that cookie based SSO affords us the security, functionality, and scalability that we need at this time.

Thanks again for the detailed responses and look forward to interacting more in the future!
- **2017-06-09** @arneswinnen: Hi @fletcher,

Awesome to hear my input is appreciated and considered! I greatly appreciate your responses as well. 

I fully agree that implementing the IP check and ensuring proper DNS hygiene would reduce the currently exposed risk to an acceptable level. This would also dismiss the need to take all *.uber.com properties into bug bounty program scope, which I believe is very desirable from your point of view (*.dev.uber.com and *.et.uber.com is a lot on first sight).  

One last question: once the IP-based check has been implemented on your end, would you allow me to write this issue up in a blogpost of mine (which you of course get to validate first before being published)? 

Cheers,

Arne
- **2017-06-09** @fletcher: Most definitely -- I'll check with the team to see if there is a defined timeline on when we want to add it. If it's a ways out, I'm happy to publicly disclose this sooner so you can write the post.

Cheers and thanks again for the fun conversation,
Rob
- **2017-06-09** @arneswinnen: Great, thanks! I'll stay put. I would also prefer to disclose this on my own blog, since this original report contained the diagrams with "████████" instead of "uber.com". I'll fix these, and perhaps we can do a limited disclosure of this report on hackerone, where I can refer to my blogpost on https://www.arneswinnen.net if that's OK with you?
- **2017-06-09** @fletcher: Ah ok, gotcha -- yep, that sounds reasonable to me.

(p.s. we'll be discussing the bounty for this report in a week or so and will follow-up with full bounty amount then)
- **2017-06-09** @arneswinnen: Perfect! I'm not in a rush to disclose this, so I'd prefer to wait until the IP check is in place (unless it will take several months before it's implemented). I'll await more time details for your end, as well as the final bounty decision.

Thanks again for the great conversations!

Arne
- **Bounty Awarded**
- **2017-06-14** @arneswinnen: Hi,

Thank you very much for the generous bounty!

Would you have any ETA for the IP check? I'll already create a draft blogpost and provide it to you here in a comment, for your review & validation. But I prefer to publish only when the IP check has been effectively implemented.

Thanks in advance,

Arne
- **2017-06-25** @arneswinnen: Hi Uber,

I've written a draft blogpost, feel free to review it before I officially publish it: https://www.arneswinnen.net/2017/06/authentication-bypass-on-ubers-sso-via-subdomain-takeover/ (password: uber_for_your_review).

I had two remaining questions from my end:
- Has it been decided yet whether Uber will implement the IP check or not? And if yes, any ETA?
- In my blogpost, I mention the recently published report [\[Uber 8k bounty\] Login CSRF + Open Redirect -> Account Takeover
](http://ngailong.com/uber-login-csrf-open-redirect-account-takeover/) from @ngalog. I couldn't help noticing that his report was awarded 8k vs 5k for my report here. I don't want to complain about the bounty that was awarded to me, but I'm bound to get the same question once I publish my blogpost. I've been trying to find arguments that explain this significant difference in bounty amount, but I can only find counterarguments for now, so could you please enlighten me in case I'm overseeing any?
 * The prerequisites for both attacks are exactly the same, victim must be logged in to Uber SSO system (login.uber.com for OAuth, auth.uber.com for shared cookies system)
 * The report of ngalog only affects central.uber.com, whereas my report affects **every** uber.com domain, including central.uber.com but also more valuable ones such as vault, riders, partners, developer, etc. 
 * My report actually highlights two vulnerabilities, namely the SSO system vulnerability as well as a subdomain takeover. The latter could also be exploited in other ways than Authentication Bypass, e.g. to impersonate Uber by hosting convincing phishing pages. 
 * I'm not entirely sure, but the report from ngalog shows how to steal an access_token value from the OAuth system. Can this actually be used via an Uber API or some sort? Because if not, I don't see how this could've led to Authentication Bypass / Account takeover like in my case. 

Thanks in advance,

Arne
- **2017-06-28** @fletcher: @arneswinnen,

Been a crazy few days/weeks, but I plan to look into this tomorrow and will follow-up then.

Cheers,
Rob
- **2017-06-30** @arneswinnen: Hi @fletcher,

Just a small heads up that I've added a small paragraph after the source code of the two PHP PoC files in the blogpost yesterday evening. Figured you might have already proofread the blogpost yesterday or the day before, but are still working out my other questions at this moment. Nothing else on the blogpost has changed, so please validate that last extra paragraph as well if you can. 

Looking forward to your reply,

Arne
- **2017-07-01** @fletcher: Hey @arneswinnen,

Appreciate your patience as we finalize our technical mitigation efforts. We will let you know once that work is complete, so you can confidently publish your post without creating additional risk.

In the meantime, I thought you might appreciate some additional context on our decision to use cookie based SSO instead of OAuth SSO since this is clearly something you’ve thought about a lot. Every company needs to understand their own environment, so this might not be the best decision for everyone.

Similar to other large-scale companies, Uber adopted cookie based SSO to better secure our login system while also decreasing complexity and inefficiencies. As you may already know, OAuth was not designed for SSO, and using it for that purpose not only abuses the protocol, it doesn’t protect against the most likely attack scenario of open redirects. Cookie based SSO also makes single-logout far more trivial compared to OAuth, reducing the likelihood of a situation where session invalidation bugs occur.  Ultimately, it’s been our experience that cookie based SSO is more effective in decreasing the potential for ATO.

Thanks again for your patience!  Hope to have another update for you soon.

Cheers,
Rob
- **2017-07-02** @arneswinnen: Hi,

Thank you for the elaboration. I can understand that Uber opted for a cookie based SSO for convenience and maintenance reasons, but from a security perspective, I'm still convinced it is the least secure of all SSO types out there:
- Even after you implement the IP based check, any attacker that resides on the same corporate network / wifi / ... as the victim (same external IP address) must only compromise one *.uber.com subdomain to fully compromise the SSO system, including all existing service providers. This is impossible to prevent technically by design on a cookie based SSO, and is a residual risk I would personally not be comfortable with. Especially when looking at the sheer number of subdomains under *.dev.uber.com and *.et.uber.com and/or hosted externally (newsroom.uber.com, bizblog.uber.com, etc).
- The OAuth open redirect chain vulnerabilities you speak of typically only impact one service provider (one \*.uber.com subdomain in your case), not **every** service provider. They can be easily prevented by proper redirect_uri whitelisting and CSRF protection via the "state" parameter for all service providers at once, without any residual risk. 

I will remain standby and await further news about:
- ETA of the IP based check.
- Explanation of the 5k bounty for this report vs the 8k bounty for report [\[Uber 8k bounty\] Login CSRF + Open Redirect -> Account Takeover](http://ngailong.com/uber-login-csrf-open-redirect-account-takeover/) , which had a significantly smaller impact (see previous comments). 
- Permission to publish my blogpost (I've updated the recommendations paragraph, which now states that Uber decided to implement the IP based check).

Cheers,

Arne
- **2017-07-07** @fletcher: Hey Arne,

Thanks again for your patience while we tested and rolled out the IP check -- feel free to verify on your end.

Cheers,
Rob
- **2017-07-07** @arneswinnen: Hi @fletcher,

I just retested and the fix works like a charm. I get redirected back to auth.uber.com by any service provider in case the IP changes between the SSO IP -> SP redirect, which effectively prevents the relay attack I described (again, only when the attacker is external and has a different IP). I've tried bypassing it via several IP-spoofing HTTP Headers (X-Forwarded-For, X-Real-IP, Client-IP, True-Client-IP), but to no avail. Good job!

I'll await your final OK to publish my blogpost. I updated its timeline with today's date for the IP-based check deployment & retest. Also looking forward to your reasoning on the difference between the 5k - 8k bounties (I won't give you any trouble in case the bounty remains the same, just curious for the arguments).

Arne
- **2017-07-10** @fletcher: @arneswinnen,

Awesome, thanks for verifying -- I'll be taking a look at everything else today and will follow-up.

Thanks,
Rob
- **2017-07-11** @fletcher: @arneswinnen,

Now that the fix is rolled out and verified, please feel free to publish your blog post at your convenience. We appreciate your patience as we worked toward full resolution and we’ll do a full disclosure on this report once your post is live. 

I understand and apologize for the confusion regarding the difference in bounty amounts for this report and @ngalog’s report. In hindsight, we shouldn’t have paid $8K for the previous report and the current max for this kind of bug is $5K.  As we continue to fine tune our bounty amounts, we’ll do our best to explain the reasoning behind these decisions.  

Thanks again for the report and help keeping our users secure.

Cheers,
Rob
- **2017-07-11** @arneswinnen: Hi @fletcher,

Thanks for the explanation. Would it be possible to do a limited disclosure (title & summaries only) instead of a full one on the HackerOne platform (e.g. https://hackerone.com/reports/202823), as I've mentioned before? Again, I made some silly mistakes in my first diagrams which I've corrected in my blogpost (███ instead of uber.com, which points to ███████'s bug bounty program). Therefore, I would like to opt for limited disclosure in this case.

I've just published my blogpost and put its link in my limited disclosure summary, and you can voice your view on this issue in yours. Sounds good?

Arne
- **Agreed On Going Public**
- **2017-07-12** @fletcher: Hey @arneswinnen,

We’re opting for full-disclosure so that the open interaction we had, including our position on our SSO system, is available for everyone to read.

We really appreciate the openness and interaction in this report, so we’d like to use it as an example for other researchers.

Cheers,
Rob
- **2017-07-12** @arneswinnen: Hi @fletcher,

I would really prefer either limited disclosure or no disclosure at all, since my initial post contained references to other bug bounty programs and some other sensitive information that I removed in my blogpost. If you really don't want limited disclosure, feel free to reject my disclosure request. 

Thanks,

Arne
- **2017-07-12** @fletcher: Hey @arneswinnen,

HackerOne disclosure gives us the ability to redact text in a report, so if you’d like to list the program names or sensitive content you’d like redacted, I’d be happy to do so.

I can also check to see if we can replace your initial images with new ones if you’re concerned with the typo in them.

If we don’t hear anything by the end of today, we will move forward with full disclosure.

Thanks,
Rob
- **2017-07-12** @arneswinnen: Hi @fletcher,

Very well, if you insist:
- I would prefer that all diagrams and the PoC video attachments are replaced by the versions on my blog, as they've been slightly updated. This means attachment 4-5-6-7-8. Especially the PoC video is very important to me (I simply removed references to other, private bug bounty programs I am **really** not allowed to disclose in the original video, not more). 
- All my comments mentioning ████████'s bug bounty program or discussions around it (May 2nd, June 10th, all comments as of Jul 12th including this one).

If this is not possible, again, I would prefer that nothing is disclosed as opposed to everything. Is there a way to allow me to validate the redacted report before being disclosed? That would make me feel a lot more comfortable. 

Thanks in advance,

Arne
- **2017-07-12** @fletcher: @arneswinnen,

Awesome, happy to get those things addressed -- based on those details, we are going to do the following:
* replace video in `F173941` with a link to this video from blog post
* `F173903` replaced with https://www.arneswinnen.net/wp-content/uploads/2017/06/Uber-SSO.png
* `F173904` replaced with https://www.arneswinnen.net/wp-content/uploads/2017/06/Uber-SSO-Login-2-1.png
*  `F173905` replaced with https://www.arneswinnen.net/wp-content/uploads/2017/06/Uber-SSO-Attack-1.png
* `F173935` replaced with https://www.arneswinnen.net/wp-content/uploads/2017/06/Uber-SSO-Attack-2.png
* redact text strings "█████" and "█████" from entire report

I'll let you know once the revised version is published.

Thanks,
Rob
- **2017-07-12** @arneswinnen: Hi,

Sounds like a plan. I would only prefer that you redact/blur the entire comments where references to other bug bounty programs are mentioned, as opposed to just the words themselves. I want to avoid explicitly mentioning this, because there still are some in my PoC video that were too hard to remove if you look closely. Could you do that? 

It seems that I can view the redacted version of the report. Could you please let me validate one last time once you think it's ready, but before you publicly disclose?

Apologies for all this hassle, I'm really bothered by it myself. Won't be so sloppy next time. 
Thanks,

Arne
- **2017-07-12** @fletcher: Uploading new files.
- **2017-07-13** @fletcher: Hey @arneswinnen,

Awesome, we worked with HackerOne to replace the images with the ones you've got in your blog post and deleted the video upload. We've also redacted the references to other programs as you requested, but believe it's important for our community that Uber be as transparent as possible regarding our comments, so we will be leaving those comments as they do not relate to other programs and are not sensitive.

Thanks again for the great report (and cool CSP trick) -- I look forward to working with you again!

Thanks,
Rob
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
