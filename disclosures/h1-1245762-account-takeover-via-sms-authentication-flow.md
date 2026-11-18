---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - impact/account-takeover
  - trigger/session-cookie
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2022-01-12
submitted: 2021-06-27T15:45:27.780Z
bounty_usd: null
votes: 94
cve: []
program: "[[programs/zenly|Zenly]]"
reporter: "yetanotherhacker"
source: "https://hackerone.com/reports/1245762"
title: "Account Takeover via SMS Authentication Flow "
---
# Account Takeover via SMS Authentication Flow 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 94 | **Program:** Zenly | **Disclosed:** 2022-01-12

- Report: [https://hackerone.com/reports/1245762](https://hackerone.com/reports/1245762)
- CWE: Improper Authentication - Generic
- Submitted: 2021-06-27T15:45:27.780Z

## Report summary

An attacker could have taken over a future user account by abusing the session creation endpoint, which was consistently returning the same session token (although not yet valid) for the same user. 
Once the legitimate user validates the SMS code for that session token, the session would have become valid for both the legitimate user and the attacker.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
During the **authentication** flow, an SMS is sent to the user in order to validate the session and proceed to the user account. The way Zenly API handles this flow is by:
1. Calling the `/SessionCreate` endpoint with the mobile phone number of the user.
2. A session for the user is created and a session token is returned, but no operations with this session are possible until the verification is complete.
3. An SMS message is sent to the user, containing a verification code.
4. Calling the `/SessionVerify` endpoint with both the session token and the verification code received by SMS.
5. Once this request is successfully completed, the session token becomes valid and the user is now logged in.
After the first call to `/SessionCreate`, subsequent calls will return ==the same session token==, until a call to `/SessionVerify` is made with a valid verification code. 

## Steps To Reproduce:
To reproduce this issue, an environment that enables intercepting and decoding network requests is required. Once this environment is set up, we are able to gain visibility over network activity.
By following a typical login flow, we can gain knowledge of the network requests that are involved. The flow starts by requesting the mobile phone number from the user. Once the user inputs their phone number, they will be prompted for a verification code that is sent through SMS.
{F1355357}
At this moment, before entering the verification code, a request to `/SessionCreate` is launched. Note that this request (on the left) contains the mobile phone number of the user, and the response (on the right) to this request contains a **session token**, as shown below.
███████
Now, if an attacker also sends a request to `/SessionCreate` with the mobile phone number of the legitimate user, they will obtain the same session token. The response to this request, initiated by the attacker, is shown below:
█████████
**Note:** In this example, the attacker called `/SessionCreate` after the legitimate user. However, the attacker could also have called `/SessionCreate` before the legitimate user. This would have caused Zenly (on the side of the legitimate user) to obtain **the same session token that the attacker obtained**.
At this moment, the legitimate user will receive an SMS message containing a verification code. The authentication flow is finished (meaning the session token will become valid) once the user inputs this code in their Zenly application. However, once the user does this, the attacker will also end up with a valid session token in their hands (**since it is the same token**).
The attacker can then use this token to impersonate the legitimate user, executing any request to the Zenly API with it. The attacker can also, at any time, check if the session token is valid by launching a request to `/Me`, an endpoint that returns information about the current session. If the verification code has not yet been entered by the legitimate user, requests to `/Me` will return a 401 Unauthorized response. Once the code is entered, requests to `/Me` will return session information (such as phone number and user identifier), as shown below:
████
Once the attacker knows the session is valid, they can launch requests to `███████`, `██████` or `████` instead, thus **gaining access to notifications, geolocation, and conversations** of the legitimate user and their friends. 

## Suggested Mitigation:
In order to mitigate this issue, the following steps could be taken:
-	Session tokens should be unique for each call to `/SessionCreate`.
-	A new SMS code should be sent on every call to `/SessionCreate`.
-	Previous SMS codes should be invalidated once a new one is sent.
-	Apply rate-limiting to both `/SessionCreate` and `/SessionVerify` endpoints.

## Impact

An attacker can take over a user account by abusing the `/SessionCreate endpoint`, which will consistently return the same session token (although not yet valid) for the same user. Once the legitimate user validates the SMS code for that session token, the session will become valid for both the legitimate user and the attacker.
The main point of this issue is that the attacker needs to obtain a session token before the legitimate user calls the `/SessionVerify` endpoint. This can be done either before or after the legitimate user calls the `/SessionCreate endpoint`. 
Allowing both the legitimate user and an attacker to have the same session token will give an advantage to the attacker. The verification code sent through SMS will remain valid for the same amount of time that the session token is valid, and it will not be regenerated within that time period, meaning that if the legitimate user inputs this code in the application (triggering a call to `/SessionVerify`), the session token that both the legitimate user and the attacker hold will become valid. This means that the attacker now has a valid session for the account of the legitimate user, even though the attacker never knew the verification code.
On the other hand, even if the attacker wasn’t able to obtain the session token (through a call to `/SessionCreate`) before the legitimate user, this attack is still possible while the legitimate user doesn’t input the correct verification code in the application, although this scenario would be less likely since the time window for carrying out this attack can be rather short.
**Once the attacker has a valid session for the account of the legitimate user, they can access their location, notifications, conversations, and friends’ information just like the legitimate user could.**

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-06-29** @spud: Hi @yetanotherhacker, thanks for both your reports ! The team will look into them and we'll come back to you (it could take several days). Can you tell us which version of the app you used for your tests and how did you decode the proto ?

Regards,
- **2021-06-29** @yetanotherhacker: Hello @spud,
The tests on Android used versions 4.36.5 and 4.39.0. On iOS, I can't recall and don't have access to it anymore, but it is important to understand that the issue is not on the apps but on the APIs.
To decode protobuf a modified tool called [mitmproxy](https://mitmproxy.org/) was used. The names of the fields were not known, only their types. After looking into the content of some messages, I tried to understand what type of information each field would carry on each request.
Hope that helps.
- **2021-06-29** @spud: Hi @yetanotherhacker,
Issue is indeed API side.
Vanilla mitmproxy doesn't seem to be able decode the proto (from what I tried), hence the question - since your screenshots of it show the decoded fields, I was wondering if somehow you were made aware of the proto, or if you used an custom addon.
- **2021-07-02** @yetanotherhacker: Hi @spud,
Sorry for my late response. I was trying to write down the entire process. Hopefully, that will give you all the info you need.
So here goes:

---
One of the first steps in every research is intercepting the network requests being sent by the application. It proved to be somewhat tricky with Zenly since tools like [Burp]( https://portswigger.net/burp) and [Charles](https://www.charlesproxy.com/) displayed some difficulties in intercepting and forwarding this traffic at the time of testing. Achieving this in iOS posed additional problems since every TLS handshake consistently failed due to the certificate authority allow-list in the application. It was possible to deal with this by tampering with that list with a [Frida](https://frida.re/) script each time the application started up. On the other hand, for Android, adding a custom certificate to the system store was enough.
Once this restriction was bypassed, an instance of [mitmproxy](https://mitmproxy.org/) was spun up and forwarded the network traffic through it. That allowed some visibility on the domain and path (ex: https://rpc.znly.co/zenly.protobuf.services.ZenlyService/Configuration), and headers of requests. These contain a few hints regarding the protocol that is in use:
- **Domain** contains the keyword `rpc`.
- **Path** contains the keyword `protobuf`.
- **Content-Type header** has the value application`/grpc`. 
- **User-Agent header** contains the value `grpc-go`.
- **Request** contains several headers referencing gRPC. (for example, `grpc-encoding`, `grpc-accept-encoding` and `grpc-timeout`).

It was not yet possible to correctly decode the body contents in these requests with mitmproxy. Still, after some poking, it was possible to understand that the data being displayed by mitmproxy was under some [zlib](https://zlib.net/) compression.
A custom add-on was developed for mitmproxy for this purpose. The add-on first decompresses the body contents and then pipes the obtained data to [protobuf-inspector](https://github.com/mildsunrise/protobuf-inspector), which provides visibility regarding the type and contents of each protobuf field. At this time, there was still no knowledge of any field names.
Using that methodology and intercepting a handful of requests, It was possible to deduce each endpoint's expected protobuf structure, which allowed correctly decoding each Request and corresponding Response. When the decoding became possible, it enabled the creation of new messages (with the expected structure but different values for each field), and the possibility to communicate with the API **without** using the mobile application.
In addition, in situations where a request did not match the expected protobuf structure, the server would respond with an error message containing the field name. These responses allowed to guess the expected type further and better understand the expected protobuf structure for each endpoint.

---
I hope that helps understanding the methodology that was used. I believe it is not something out of the ordinary for experienced attackers.
Please let me know if there is any further information you need.
- **2021-07-05** @spud: Hi @yetanotherhacker, thank you so much for the details ! I managed to reproduce with wireshark and protoc (not auto) but it's really nice of you to have detailed your process.
We're not forgetting you, fixes are on the way and bounties should come during the week.
- **Bounty Awarded**
- **Report Retesting**
- **Retest User Expired**
- **External User Joined**
- **2021-07-15** @yetanotherhacker: I confirm that the issue is fixed.
It is clear that access tokens associated with each device were added. To bypass this you need access to the UUID device of the victim.

Good work Zenly!
:)
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **2021-07-28** @yetanotherhacker: Hi @spud,
I want to publish this research as I believe this is a very interesting technical case. I wish to discuss gRPC security and also to mention the professionalism and responsiveness of the Zenly security team.
Is there an official Zenly response/comment you want me to add?
I'll be happy to share the publication with you before publishing.
- **2021-07-30** @spud: Hi @yetanotherhacker,
Thanks for your kind words. Since we still have at least one ongoing issue (your second report) that hasn’t been fixed, we would like to not be mentioned and the information identifying Zenly to be anonymised or redacted (endpoints / methods name etc..). I don’t think it would make your paper less interesting, wdyt ?

Regards,
- **2021-09-19** @yetanotherhacker: FYI, I decided to wait with the publication until the second issue is fixed.
Best,
YAH
- **2021-11-12** @yetanotherhacker: Hi There,
Now that everything is fixed, I would like to publish.
Please let me know where I should send the paper for your review before publication.
Thanks,
YAH
- **2021-11-15** @spud: Hi @yetanotherhacker, you can attach a doc/pdf/txt here if you'd like
- **2021-12-20** @yetanotherhacker: Hello,
Attached is the almost final draft of the blog.
Not sure when we will publish, but it will not be in the coming week.
It was a pleasure working with you and I will be very happy to include Zenly's quote in the publication, so please let me know if and what you want me to add.

Best,
YAH (Erez Yalon)
- **2022-01-03** @spud: Hi Erez, happy new year ! 
Thanks for the draft but I think I haven't be clear : we don't want Zenly mentioned in the blog post. This is going on your company blog, and sorry but it looks more like  "we found flaws on a famous application" than "here's how to reverse grpc / protobuf" , aka more publicity than technical information. If you want to write a technical post in which you obfuscate the company name, hosts and endpoints, go for it, that's what interesting :)

Regards,
- **Agreed On Going Public**
- **2022-01-10** @spud: Hi Erez, 
After discussing it internally we agreed that there are nothing preventing us to disclose those reports, i'll do it this week (I will redact minor stuff). 
We are also willing to continue the discussion on the blog post, nothing much to change except minor stuff to redact too, Is there a mail I can contact you on regarding this ?

Regards,
- **Agreed On Going Public**
- **Report Became Public**
- **2022-01-15** @yetanotherhacker: Hi @spud, you can contact me at erez.yalon@checkmarx.com
Looking forward to hearing from you.

Best,
Erez
