---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/os-command-injection
  - env/network
  - stack/node
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
date: 2023-08-11
submitted: 2022-05-18T05:48:02.207Z
bounty_usd: null
votes: 9
cve: "CVE-2022-32212"
program: "[[programs/nodejs|Node.js]]"
reporter: "haxatron1"
source: "https://hackerone.com/reports/1574078"
title: "DNS rebinding in --inspect (again) via invalid IP addresses "
---
# DNS rebinding in --inspect (again) via invalid IP addresses 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Node.js | **Disclosed:** 2023-08-11

- Report: [https://hackerone.com/reports/1574078](https://hackerone.com/reports/1574078)
- CWE: OS Command Injection | CVE: CVE-2022-32212
- Submitted: 2022-05-18T05:48:02.207Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2022-05-18** @haxatron1: Just realised I specified an old branch, https://github.com/nodejs/node/blob/master/src/inspector_socket.cc#L164L175 is the vulnerable code in master branch
- **2022-05-18** @haxatron1: Just realised I messed up the /etc/hosts file in B) of the reproduction step, should be:
`````
127.0.0.1       10.0.2.555     
`````
- **2022-05-18** @haxatron1: I have here a preliminary patch for the problem, which checks each octet and returns false when an octet > 255. (I am currently building node with this patch to see if it works)
`````
diff --git a/src/inspector_socket.cc b/src/inspector_socket.cc                                                                                             
index 1650c3fe01..25f1a8d145 100644                                                                                                                        
--- a/src/inspector_socket.cc                                                                                                                              
+++ b/src/inspector_socket.cc                                                                                                                              
@@ -165,12 +165,27 @@ static bool IsIPAddress(const std::string& host) {                                                                                   
   if (host.length() >= 4 && host.front() == '[' && host.back() == ']')                                                                                    
     return true;                                                                                                                                          
   int quads = 0;                                                                                                                                          
+  std::string octet = "";                                                                                                                                 
   for (char c : host) {                                                                                                                                   
-    if (c == '.')                                                                                                                                         
+    if (c == '.') {                                                                                                                                       
       quads++;                                                                                                                                            
-    else if (!isdigit(c))                                                                                                                                 
+      // check the octets                                                                                                                                 
+      int int_octet = std::stoi(octet);                                                                                                                   
+      if (int_octet > 255)                                                                                                                                
+        return false;                                                                                                                                     
+      octet = "";                                                                                                                                         
+    }                                                                                                                                                     
+    else if (isdigit(c))                                                                                                                                  
+      octet += c;                                                                                                                                         
+    else                                                                                                                                                  
       return false;                                                                                                                                       
   }                                                                                                                                                       
+  // check the final octet                                                                                                                                
+  int int_octet = std::stoi(octet);                                                                                                                       
+  if (int_octet > 255)                                                                                                                                    
+    return false;                                                                                                                                         
+                                                                                                                                                          
+  // check only 4 octets                                                                                                                                  
   return quads == 3;                                                                                                                                      
 } 
`````
Thankfully in my testing malformed IPv6 addresses do not cause a resolution So only IPv4 need validation.
- **2022-05-18** @haxatron1: Can confirm that the proposed patch fixes the problem for every octet.
````    
➜  ~ curl -H "Host: 256.0.0.0" http://127.0.0.1:9229/json
WebSockets request was expected
➜  ~ curl -H "Host: 0.256.0.0" http://127.0.0.1:9229/json
WebSockets request was expected
➜  ~ curl -H "Host: 0.0.256.0" http://127.0.0.1:9229/json
WebSockets request was expected
➜  ~ curl -H "Host: 0.0.0.256" http://127.0.0.1:9229/json
WebSockets request was expected
➜  ~ curl -H "Host: 0.0.0.255" http://127.0.0.1:9229/json
[ {
  "description": "node.js instance",
  "devtoolsFrontendUrl": "devtools://devtools/bundled/js_app.html?experiments=true&v8only=true&ws=0.0.0.255/368c9308-964b-432c-a399-27809dd23b32",
  "devtoolsFrontendUrlCompat": "devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=0.0.0.255/368c9308-964b-432c-a399-27809dd23b32",
  "faviconUrl": "https://nodejs.org/static/images/favicons/favicon.ico",
  "id": "[ID]",
  "title": "node[3531]",
  "type": "node",
  "url": "file://",
  "webSocketDebuggerUrl": "ws://0.0.0.255/[ID]"
} ]
````
- **2022-05-18** @haxatron1: Found an error with the patch, it will cause a DoS in std::stoi() if empty octet after '.' (ie. curl -H "Host: 127." http://127.0.0.1:9229/json). Improved patch:
````
diff --git a/src/inspector_socket.cc b/src/inspector_socket.cc
index 1650c3fe01..e726209fb8 100644
--- a/src/inspector_socket.cc
+++ b/src/inspector_socket.cc
@@ -161,16 +161,35 @@ static std::string TrimPort(const std::string& host) {
   return host;
 }
 
+// check for invalid IPv4 octet > 255
+static bool isInvalidOctet(const std::string& octet) {
+  return (octet == "" || std::stoi(octet) > 255);
+}
+
 static bool IsIPAddress(const std::string& host) {
   if (host.length() >= 4 && host.front() == '[' && host.back() == ']')
     return true;
   int quads = 0;
+  std::string octet = "";
   for (char c : host) {
-    if (c == '.')
+    if (c == '.') {
       quads++;
-    else if (!isdigit(c))
+      // check the octets
+      if (isInvalidOctet(octet))
+        return false;
+      octet = "";
+    }
+    else if (isdigit(c))
+      octet += c;
+    else
       return false;
   }
+
+  // check final octet
+  if (isInvalidOctet(octet))
+      return false;
+
+  // check only 4 octets
   return quads == 3;
 }
````
- **2022-05-18** @trott: Hi, @haxatron1. Thanks for the report. We're reviewing this and there is active discussion going on behind the scenes. More soon. Thanks for all the detailed information and your patience.
- **Report Severity Updated**
- **Report Triaged**
- **2022-05-21** @haxatron1: Hi @trott thanks for that. But I have a question regarding the CVSS, why is it low only for confidentiality when this can achieve code execution as per the previous report - https://hackerone.com/reports/1069487, I think it should be High for Confidentiality, Integrity and Availability components. And why is the privileges required High when the attacker does not need any privileges to perform this attack?
- **2022-05-21** @haxatron1: CVSS I originally based this on -https://www.first.org/cvss/calculator/3.0#CVSS:3.0/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:H/A:H - 7.5, which matches the score for https://hackerone.com/reports/1069487 (CVE-2021-22884) and is what NVD and RedHat also assessed that vulnerability to be.
- **2022-05-21** @trott: I assessed privileges required as "High" because the attacker needs to either control DNS resolution settings on the target machine or else control the DNS service that the target machine is configured to use. I believe the previous CVE is inflated. NVD and RedHat no doubt copied the CVE scores/settings we provided.
- **2022-05-21** @haxatron1: @trott Thanks, but it is also possible that the attacker can also spoof the DNS response as mentioned in the previous report (meaning that the attacker only needs to be able MITM the connection, as DNS is not protected by SSL/TLS), so I do not believe Privileges should be "High" but rather Attack Vector to "Network" and Attack Complexity to "High" to reflect a MITM attack

And what about Confidentiality/Integrity/Availability, I don't think it makes sense that the Impact component is only Low confidentiality, considering that the impact of this is code execution.
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Triaged**
- **Report Severity Updated**
- **Report Triaged**
- **2022-06-02** @haxatron1: I found a problem with my proposed patch, if the octet is too large :

(ie. `curl -H "Host: 1111111111111111111111111111111111111111111.com" http://localhost:9229`), 

calling `stoi` can result in integer overflow, crashing  `node:inspector` / `node --inspect`

The solution to this is to just check that the octet is no more than 3 chars:
````
static bool isInvalidOctet(const std::string& octet) {
  return (octet == "" || octet.length() > 3 || std::stoi(octet) > 255); 
}
````
Full diff:
```````
diff --git a/src/inspector_socket.cc b/src/inspector_socket.cc
index 1650c3fe01..80ba6c928e 100644
--- a/src/inspector_socket.cc
+++ b/src/inspector_socket.cc
@@ -161,16 +161,35 @@ static std::string TrimPort(const std::string& host) {
   return host;
 }
 
+// check for invalid IPv4 octet > 255
+static bool isInvalidOctet(const std::string& octet) {
+  return (octet == "" || octet.length() > 3 || std::stoi(octet) > 255); 
+}
+
 static bool IsIPAddress(const std::string& host) {
   if (host.length() >= 4 && host.front() == '[' && host.back() == ']')
     return true;
   int quads = 0;
+  std::string octet = "";
   for (char c : host) {
-    if (c == '.')
+    if (c == '.') {
       quads++;
-    else if (!isdigit(c))
+      // check the octets
+      if (isInvalidOctet(octet))
+        return false;
+      octet = "";
+    }
+    else if (isdigit(c))
+      octet += c;
+    else
       return false;
   }
+
+  // check final octet
+  if (isInvalidOctet(octet))
+      return false;
+
+  // check only 4 octets
   return quads == 3;
 }
```````
- **2022-06-05** @trott: The patch we're evaluating right now doesn't use `stoi` but thank you for following up!
- **2022-06-15** @rafaelgss: @haxatron1  Soon as the fix is released, we'll create a blog post to announce the Security Release. Would you like to be credited on the announcement?

It will look like this:

`Thank you to @haxatron1  for reporting this vulnerability.`
- **2022-06-15** @haxatron1: Hi, you can use this:

`Thank you to Axel Chong for reporting this vulnerability.`

Thanks!
- **Cve Id Added**
- **2022-07-07** @haxatron1: Hi, I just read the advisory notes for this vulnerability,  it LGTM, but I have a few minor changes I would like to suggest:

"an attacker-controlled DNS server" => it should be "an attacker-controlled DNS server or an MITM who can spoof the DNS responses"

"hence access the JSON file containing the WebSocket file." => it should be "hence connect to the WebSocket debugger and execute arbitrary code. This is a bypass of CVE-2021-22884." 

Thanks!
- **Report Resolved**
- **Agreed On Going Public**
- **2022-07-07** @mcollina: @haxatron1 if you would like to make a change to the blog post, could you send a PR to https://github.com/nodejs/nodejs.org/blob/main/locale/en/blog/vulnerability/july-2022-security-releases.md? Thanks
- **2022-07-07** @haxatron1: I have submitted a PR at https://github.com/nodejs/nodejs.org/pull/4707.

Thanks!
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
