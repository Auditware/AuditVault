---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/deserialization-of-untrusted-data
  - env/web
  - stack/ruby
substate: "resolved"
weakness: "Deserialization of Untrusted Data"
enriched: true
date: 2023-08-16
submitted: 2022-09-17T07:55:51.251Z
bounty_usd: null
votes: 12
cve: "CVE-2023-27531"
program: "[[programs/rails|Ruby on Rails]]"
reporter: "ooooooo_q"
source: "https://hackerone.com/reports/1702859"
title: "Unexpected deserialization in Kredis"
---
# Unexpected deserialization in Kredis

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Ruby on Rails | **Disclosed:** 2023-08-16

- Report: [https://hackerone.com/reports/1702859](https://hackerone.com/reports/1702859)
- CWE: Deserialization of Untrusted Data | CVE: CVE-2023-27531
- Submitted: 2022-09-17T07:55:51.251Z

## Timeline

- **Report Filed**
- **2022-09-18** @ooooooo_q: Patch using `JSON.parse`.

```diff
diff --git a/lib/kredis/type/json.rb b/lib/kredis/type/json.rb
index 4183d5f..d78b604 100644
--- a/lib/kredis/type/json.rb
+++ b/lib/kredis/type/json.rb
@@ -8,7 +8,7 @@ module Kredis
       end

       def cast_value(value)
-        JSON.load(value)
+        JSON.parse(value)
       end

       def serialize(value)
diff --git a/test/types/scalar_test.rb b/test/types/scalar_test.rb
index 03a3ddc..6abd5d9 100644
--- a/test/types/scalar_test.rb
+++ b/test/types/scalar_test.rb
@@ -60,6 +60,8 @@ class ScalarTest < ActiveSupport::TestCase
     json = Kredis.json "myscalar"
     json.value = { "one" => 1, "string" => "hello" }
     assert_equal({ "one" => 1, "string" => "hello" }, json.value)
+    json.value = {"json_class"=>"String", "raw"=>[97, 98, 99]}
+    assert_equal({"json_class"=>"String", "raw"=>[97, 98, 99]}, json.value)
   end

   test "invalid type" do
```
- **2022-10-11** @tenderlove: @ooooooo_q great, thank you.  We will ship this!
- **Report Severity Updated**
- **Report Triaged**
- **Cve Id Added**
- **Report Resolved**
- **2023-03-19** @ooooooo_q: @eileencodes 
Thank you for the release and credit.
But can you please correct the typo that credit is typo'd as ooooooo_k? (k -> q)
If possible, please fix some of the other vulnerabilities I've reported that are also typo'd.
- **2023-03-20** @eileencodes: Sorry about that @ooooooo_q! I've fixed the announcements I could find that were wrong on https://discuss.rubyonrails.org/. Let me know if I missed any!
- **2023-04-01** @ooooooo_q: @eileencodes 
I have confirmed that it has been corrected here as well. Thank you very much.
- **Agreed On Going Public**
- **Report Became Public**
