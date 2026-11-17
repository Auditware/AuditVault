---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
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
