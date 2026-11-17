---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/deserialization-of-untrusted-data
  - env/web
  - stack/ruby
substate: "informative"
weakness: "Deserialization of Untrusted Data"
enriched: true
date: 2023-08-01
submitted: 2021-05-09T12:53:25.415Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/ruby|Ruby]]"
reporter: "ooooooo_q"
source: "https://hackerone.com/reports/1189419"
title: "XMLRPC does not limit deserializable classes."
---
# XMLRPC does not limit deserializable classes.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Ruby | **Disclosed:** 2023-08-01

- Report: [https://hackerone.com/reports/1189419](https://hackerone.com/reports/1189419)
- CWE: Deserialization of Untrusted Data
- Submitted: 2021-05-09T12:53:25.415Z

## Timeline

- **Report Filed**
- **2021-05-09** @mame: Thank you for the report. AFAIK, there is no maintainer of XMLRPC, and even it has been deleted since 3.0. I'll bring this to the agenda of the next dev-meeting, but if no one raises a hand, it will take so long time to address. Thank you for your understanding.
- **2021-05-13** @ooooooo_q: @mame 

I understand that it will take time.
I made a patch, so please refer to it. ( There doesn't seem to be any test code for class deserialization. )

```diff
--- a/lib/xmlrpc/parser.rb
+++ b/lib/xmlrpc/parser.rb
@@ -114,13 +114,15 @@ module XMLRPC # :nodoc:
           mod = Module
           klass.split("::").each {|const| mod = mod.const_get(const.strip)}

-          obj = mod.allocate
-
-          hash.delete "___class___"
-          hash.each {|key, value|
-            obj.instance_variable_set("@#{ key }", value) if key =~ /^([a-zA-Z_]\w*)$/
-          }
-          obj
+          if mod.included_modules.include? XMLRPC::Marshallable
+            obj = mod.allocate
+
+            hash.delete "___class___"
+            hash.each {|key, value|
+              obj.instance_variable_set("@#{ key }", value) if key =~ /^([a-zA-Z_]\w*)$/
+            }
+            obj
+          end
         rescue
           hash
         end
```
- **Report Triaged**
- **Report Informative**
- **2023-04-16** @ooooooo_q: I created a PR https://github.com/ruby/xmlrpc/pull/36
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
