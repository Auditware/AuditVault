---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2025-01-21
submitted: 2022-06-28T17:29:11.263Z
bounty_usd: 25000
votes: 295
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "haxta4ok00"
source: "https://hackerone.com/reports/1618347"
title: "Disclosing  PolicyPageAssetGroup in Private Programs via /graphql `gid://hackerone/PolicyPageAssetGroupsIndex::PolicyPageAssetGroup/{id}`"
---
# Disclosing  PolicyPageAssetGroup in Private Programs via /graphql `gid://hackerone/PolicyPageAssetGroupsIndex::PolicyPageAssetGroup/{id}`

> **Severity:** Critical | **Bounty:** 25,000 USD | **Votes:** 295 | **Program:** HackerOne | **Disclosed:** 2025-01-21

- Report: [https://hackerone.com/reports/1618347](https://hackerone.com/reports/1618347)
- CWE: N/A
- Submitted: 2022-06-28T17:29:11.263Z

## Report summary

This vulnerability allowed unauthorized users to retrieve sensitive information about private bug bounty programs on HackerOne and the titles of private reports by abusing a GraphQL endpoint.
Attackers could enumerate {id} values and expose private data, including program names, scope details, and the titles of reports belonging to those programs.

The HackerOne team promptly addressed the issue, recognizing its critical severity, and awarded a generous bounty for its discovery.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **2022-07-01** @h1_analyst_juan: Hi @haxta4ok00,

How can a malicious actor enumerate these numerical values?

Does the hacker have to try 9999x99999 values to enumerate valid programs?

Thanks,
@menco
- **2022-07-01** @haxta4ok00: Hi @menco -- 
1) what exactly do you want to hear?
2) Have you checked my PoC is it valid?

---------------------------------------------------------------------------------------------
If item 2) is correct, could you pass this to the team( by analogy #1609367) ,Thanks!

`Does the hacker have to try 9999x99999 values to enumerate valid programs?`

Yes, but right now in H1 platform has 58175 program (sandboxed,private,public,external) But we are more interested in external program. Their number is even less. I don't know if this request works for full private programs.

Thanks
- **2022-07-01** @h1_analyst_juan: Hi @haxta4ok00,

Thank you for your response, the intention behind my message was to confirm that there is no way to more accurately enumerate the IDs.

I've validated the report, and will pass it on internally.

Thanks,
@menco
- **2022-07-01** @haxta4ok00: Hey @menco -- Now I understand you, I should have asked this right away. :) 

In our case, Since I can't confirm if this works for full private programs:

```http
POST /graphql HTTP/2
Host: hackerone.com
Content-Length: 76
Sec-Ch-Ua: "Chromium";v="103", ".Not/A)Brand";v="99"
Accept: */*
Content-Type: application/json
Sec-Ch-Ua-Mobile: ?0
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36
Sec-Ch-Ua-Platform: "Windows"
Origin: https://hackerone.com
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty

{"query":"{teams(where:{state:{_eq:null}}){total_count,nodes{_id,handle}}}"}
```

Will give you a list including program IDs. Those. second attribute from enumeration.

Thanks, and Have a nice day @menco !
- **2022-07-01** @h1_analyst_juan: Hi @haxta4ok00,

Understood, that definitely brings down the number of possible numerical values. 

Thank you for the further explanation,
@menco
- **Report Triaged**
- **2022-07-01** @haxta4ok00: Hey @jobert , @menco -- Thanks for the answer!
- **Report Resolved**
- **Report Severity Updated**
- **Bounty Awarded**
- **2022-07-05** @haxta4ok00: Hi @jobert -- WoW , Thank you for the bounty!
- **Agreed On Going Public**
- **2025-01-21** @haxta4ok00: Hi , It looks like the report is ready after editing. :)
Thanks!
- **Agreed On Going Public**
- **Report Became Public**
