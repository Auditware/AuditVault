---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2026-01-12
submitted: 2025-01-22T20:28:32.854Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "badlifeguard"
source: "https://hackerone.com/reports/2954320"
title: "ASBS viewing other soldiers PII/Board/Board Voters/ETC"
---
# ASBS viewing other soldiers PII/Board/Board Voters/ETC

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 6 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/2954320](https://hackerone.com/reports/2954320)
- CWE: Information Disclosure
- Submitted: 2025-01-22T20:28:32.854Z

## Timeline

- **Report Filed**
- **2025-01-22** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2025-01-22** @badlifeguard: Additionally: Theres also other mutation commands that a user could really disrupt active boards. 

For example: approveBoardCandidateFile, addBoardTeamMember, DeleteBoardTeamMember, freezeBoard, removeBoardCandidateFile, etc.
- **Report Needs More Info**
- **Report New**
- **2025-01-23** @badlifeguard: █████████████
- **Report Severity Updated**
- **Report Triaged**
- **2025-02-01** @badlifeguard: Updating findings/impact to also include Pentagon personnel. ████████████████
- **2025-02-01** @badlifeguard: Please add other participants and contributors:
https://hackerone.com/theonetruepengu
https://hackerone.com/hxhbrofessor
- **2025-02-05** @agent-p1: Greetings!
@badlifeguard  Because of this report you have been selected as our Researcher of the Month. Would you like your name to be on the certificate that is tweeted out? If so, would you provide me your name for that? Do you have a twitter handle for us to tag you in? If you do not, or would not like to, then we would use you Hackerone username. Thank you!
Regards,
The DoD VDP team
- **2025-02-06** @badlifeguard: Thank you for the selection! My name is ████, no twitter handle, but feel free to use my Hackerone username. I think my username is also a twitter account that I dont control. Any idea on the backend if they have seen other people utilize this type of attack or details on how many actual records could have been exposed?
- **2025-02-06** @badlifeguard: Updates as I check in:
Introspection has been disabled.
-findLdapPersonByDodId Query has been changed, no longer exists, so harder to find if they changed the permissions or just changed the name (Just makes it harder from not having access to see if they fixed the vuln, or just hid it so someone authorized can still get results. )
-Even though they disabled usersByLastName still gives a user (Army only) to their personGuid, then attacker could use the query candidateFullByPersonGuid, and still get empID, MOS, DODID, HT/WT, military education, clearance level, and SSN. 
-Also, If I have someones social, or have a tool iterate through a social security format with the query findLdapPersonBySocial, I am able to still return records across the DOD. 

There is more maintenance scheduled today on the site, so we will see.
- **2025-02-18** @agent-p1: Greetings @badlifeguard , 

Please provide the full Post request and the screenshot of the issue you are claiming is still prevalent. Thank you for your time. 

Regards,
The VDP Team
- **2025-02-18** @badlifeguard: I will gather some screenshots and submit them. However, I feel like all they are going to do is change the query name and then there will be no way to validate that the permissions have changed, just means the queries might still have the same open permissions. 

Also, my army email is: ███
- **2025-02-19** @badlifeguard: This morning I tried to run some of the queries, and it shows a lot of access denied. Also looks like ASBS 2.0 1.11.00 has been deployed. I will need to run through all the queries. Some were denied, some were undefined.

█████
██████████
███
████
- **2025-02-19** @badlifeguard: Please add other participants and contributors:
https://hackerone.com/theonetruepengu
https://hackerone.com/hxhbrofessor
- **2025-02-21** @badlifeguard: I have done some retesting and seems like with the recent update they changed the name of some of the queries and now I am getting access denied. 

█████████████████████████████████████████████████
- **Report Resolved**
- **Agreed On Going Public**
- **2025-07-07** @badlifeguard: Any update on this disclosure?
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
- **2026-01-15** @thisispatrick: Greetings @badlifeguard 

After a full review of all Researcher of the Month submissions and impacts for the year of 2025, you have been selected as the 2025 DoD-VDP Researcher of the Year! Please let us know if you are interested. We will be announcing this soon and would appreciate if you do not disclose this information before we do. In addition to having another Twitter highlight, we would like to put you in our 2025 DC3 acknowledgements and mail you some swag. If you are interested in swag, we will need the following from you.

1. A head-shot photo to go with the write-up
2. A mailing address 
3. T-Shirt Size
4. Sweater Size 
5. Real name (if you want to be used in the write-up)

If you are not comfortable with sharing your address, we can send it to HackerOne instead for distribution. Please be advised that there may be a longer than normal wait time for mailing if you are outside of the U.S. 

Congratulations again. We look forward to hearing from you! 

Regards, 
The DoD VDP team
