---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2020-02-03
submitted: 2020-01-18T00:06:25.417Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "nytr0gen"
source: "https://hackerone.com/reports/777241"
title: "[h1-415 2020] Multiple chained vulnerabilities lead to leaking secret document"
---
# [h1-415 2020] Multiple chained vulnerabilities lead to leaking secret document

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 18 | **Program:** h1-ctf | **Disclosed:** 2020-02-03

- Report: [https://hackerone.com/reports/777241](https://hackerone.com/reports/777241)
- CWE: N/A
- Submitted: 2020-01-18T00:06:25.417Z

## Timeline

- **Report Filed**
- **2020-01-18** @nytr0gen: ## Forgotten Mentions:

- The Blind XSS from chat described can also be used as **a XSS bug**. Attacker needs to load an image with the payload, that payloads gets stored in the victims session, and then redirect the victim to the `/support` page.

- **The Curse of The 502** was lifted using the following one liner:

```bash
st=502; while [[ "$st" -eq "502" ]]; do st=$(curl -s -o /dev/null -w "%{http_code}" "https://h1-415.h1ctf.com"); echo $st; sleep 2; done; notify-send "it's up again"
```

- **Document sharing** is allowed. This means that after converting a document, you can get the link and share it with other people and they can see without any authentification. This was an useful note for when I encountered the secret document

- I think the platform is written in **Python Flask**. Usually the `session` token is an indicator for the backend used. In this case it looks like this `.eJw9y0EKwjAQQNG7zLrINDWdmpX3EAnT6QSrppEkLqp4dwuCyw_vv8FLycHXdNMFHJAO1pIh1B5bPmCg1k6jxdDLvmNk5oG0UwMNyIUruNO5AY0837f5mkbN9RjXKclrJ6nEWTb4LJp9XR8Kzvxq4ah_D58vtiEqkg.XiJUxw.-_kyHV15ebZdFFdqYLshWNPMxu8`, which might be confused with a JWT, but it's not. It can be decoded with [this CyberChef recipe](https://gchq.github.io/CyberChef/#recipe=From_Base64('A-Za-z0-9-_',true)Zlib_Inflate(0,0,'Adaptive',false,false)&input=LmVKdzl5MEVLd2pBUVFORzd6THJJTkRXZG1wWDNFQW5UNlFTcnBwRWtMcXA0ZHd1Q3l3X3Z2OEZMeWNIWGROTUZISkFPMXBJaDFCNWJQbUNnMWs2anhkREx2bU5rNW9HMFV3TU55SVVydU5PNUFZMDgzN2Y1bWtiTjlSalhLY2xySjZuRVdUYjRMSnA5WFI4S3p2eHE0YWhfRDU4dnRpRXFrZy5YaUpVeHcuLV9reUhWMTVlYlpkRkZkcVlMc2hXTlBNeHU4).

- I believe it's a good practice to make the used **Github repository private until the contest is over**. Because anyone can just scroll through the [Thanks List of this program](https://hackerone.com/h1-415-ctf/thanks), go to my Github profile and grab themselves some hints.

- I made a quick **PoC Video** with the process of exploiting this chain of bugs: 

{F688314}
- **Report Triaged**
- **2020-01-23** @nahamsec: Hey there,

Just a quick reminder to not post any writeups online until we announce the winners and request disclosure on your submission. 

Thanks!
- **2020-01-31** @nahamsec: Hello Hackers! 

I just wanted to update everyone that we are in the process of selecting our winners. We should have an announcement out early next week! Thank you for your patience and happy hacking!
- **2020-01-31** @nytr0gen: Thanks for the update! Looking forward to disclosing this ^^
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2020-02-15** @nahamsec: Hi there you were one of the first 5 to solve this CTF! Can you please email community@hackerone.com with your address and shirt/hoodie size and we'll send you some swag! Please make sure to include "H1-415 CTF Winner" in the title. 

Cheers!
- **2020-02-15** @nytr0gen: Sure thing! Thanks
- **Report Title Updated**
