---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
  - vuln/code-injection
  - vuln/info-disclosure
  - impact/rce
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2023-06-28
submitted: 2022-11-27T16:29:51.090Z
bounty_usd: null
votes: 125
cve: []
program: "[[programs/indrive|inDrive]]"
reporter: "bogdantc"
source: "https://hackerone.com/reports/1785145"
title: "Full access to InDrive jira panel via exposed API token "
---
# Full access to InDrive jira panel via exposed API token 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 125 | **Program:** inDrive | **Disclosed:** 2023-06-28

- Report: [https://hackerone.com/reports/1785145](https://hackerone.com/reports/1785145)
- CWE: Information Disclosure
- Submitted: 2022-11-27T16:29:51.090Z

## Report summary

The token disclosure vulnerability was discovered, revealing the Jira API token being exposed in the company’s GitHub repository. Wrongdoers with the compromised API token could view the projects, tasks, comments, and other information stored in Jira.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description**

Hello!

Browsing through GitHub I found the following repository:

███


Looking for interesting keywords, the following file popped up:

███████


```
package ru.indriver.jira.api

object Constants {
    const val jiraHost = "https://indriver.atlassian.net"
    const val baseUrl = "$jiraHost/rest"
    const val token = "██████"

    ███
    // const val token = "██████=="
}
```


The repository wasn't updated in a while, but I still decided to give it a change and try to make an API call with the auth token:

curl -i -s -k -X 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
GET' \
    -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Host: indriver.atlassian.net' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Cache-Control: max-age=0' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Authorization: Basic ████' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Content-Type: application/json' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Sec-Ch-Ua: \"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Sec-Ch-Ua-Mobile: ?0' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Sec-Ch-Ua-Platform: \"macOS\"' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Upgrade-Insecure-Requests: 1' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Sec-Fetch-Site: none' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Sec-Fetch-Mode: navigate' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Sec-Fetch-User: ?1' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Sec-Fetch-Dest: document' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Accept-Encoding: gzip, deflate' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Accept-Language: en-GB,en-US;q=0.9,en;q=0.8,de;q=0.7' \
    -b 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
atlassian.xsrf.token=450f5681-becb-48d1-a8bc-efc045d75244_08e86700250ae917acc90fead0122eca3628f5a5_lout' \
    

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
https://indriver.atlassian.net/rest/api/2/issue/67212'

Surprisingly, this was sucessfull and I was able to fetch a random issue ID, which normally I wouldn't have access to because you're instantly getting redirect to the atlassian OAuth flow if you're visiting https://indriver.atlassian.net/


**Steps to reproduce:**


1. Do the following cURL:
```
curl -i -s -k -X 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
GET' \
    -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Host: indriver.atlassian.net' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Cache-Control: max-age=0' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Authorization: Basic ████████' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Content-Type: application/json' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Sec-Ch-Ua: \"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Sec-Ch-Ua-Mobile: ?0' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Sec-Ch-Ua-Platform: \"macOS\"' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Upgrade-Insecure-Requests: 1' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Sec-Fetch-Site: none' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Sec-Fetch-Mode: navigate' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Sec-Fetch-User: ?1' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Sec-Fetch-Dest: document' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Accept-Encoding: gzip, deflate' -H 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Accept-Language: en-GB,en-US;q=0.9,en;q=0.8,de;q=0.7' \
    -b 

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
atlassian.xsrf.token=450f5681-becb-48d1-a8bc-efc045d75244_08e86700250ae917acc90fead0122eca3628f5a5_lout' \
    

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
https://indriver.atlassian.net/rest/api/2/issue/67212'
```
Notice the response:

███████

We have full access to the InDrive Atlassian panel, ability to fetch sensitive information.

## Impact

Sensitive information disclosure - full access to the Atlassian panel - projects/issues/accounts etc.

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2022-11-28** @bogdantc: Hello @majesttic 

Thank you very much for the quick response, I really appreciate this

I just checked again, the repository is removed and the token is revoked:
█████

I consider the issue fixed.

Also, about the severity, Can you please explain why you changed the severity to High? 
Most of the time I reported these kinds of issues, the CVSS was always **Critical** since access to the JIRA panel would automatically give the attacker secrets like access tokens, AWS credentials, source code disclosure,  and unfixed bugs which could easily lead to Remote Code Execution.

I'm really curious about the reason behind the severity change, other than that, thank you for the amazingly fast response!
- **2022-11-28** @majesttic: Hi @bogdantcaciuc. 
We do not store/transfer sensitive data(tokens, passwords, etc.) in Jira. We also have secure accesses configured for critical projects within jira. Therefore, we rate this report as high.
- **2022-11-28** @majesttic: UPD:  Discussed within the team and decided that the report will be severity Critical
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-14** @bogdantc: The issue is fixed.
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
