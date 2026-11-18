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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Unexpected classes may be deserialized because `JSON.load` is used to cast json in [Kredis](https://github.com/rails/kredis).

https://github.com/rails/kredis/blob/v1.3.0/lib/kredis/type/json.rb

```ruby
module Kredis
  module Type
    class Json < ActiveModel::Type::Value
      def type
        :json
      end

      def cast_value(value)
        JSON.load(value)
      end
```      

### PoC

prepare kredis with rails

```
❯ rails new rails_server -G -M -O -C -A -J -T
# Rails 7.0.4 install

❯ cd rails_server

# Edit Gemfile to uncomment `gem "kredis"` 
❯ bundle install
# kredis 1.3.0 install

❯ rails kredis:install
```

```ruby
❯ bundle exec rails c
Loading development environment (Rails 7.0.4)
irb(main):001:0> abc = 'abc'.to_json_raw_object
=> {"json_class"=>"String", "raw"=>[97, 98, 99]}

irb(main):002:0> json = Kredis.json "json_load"
=>
#<Kredis::Types::Scalar:0x00000001099ea250
...

irb(main):003:0> json.value = abc
=> {"json_class"=>"String", "raw"=>[97, 98, 99]}

irb(main):004:0> json.value
=> "abc"
```

The return value of `json.value` should be a hash object, but it is deserialized as a string object.

```ruby
irb(main):005:0> json.value = /test/
=> /test/

irb(main):006:0> json.value
=> "(?-mix:test)"

irb(main):007:0> json.value = /test/.as_json
=> "(?-mix:test)"

irb(main):008:0> json.value
=> "(?-mix:test)"

irb(main):009:0> require 'json/add/core'
=> true

irb(main):010:0> json.value = /test/.as_json
=> {"json_class"=>"Regexp", "o"=>0, "s"=>"test"}

irb(main):011:0> json.value
=> /test/
```

If [json/add/core](https://github.com/flori/json/tree/master/lib/json/add)  is loaded, classes such as regular expressions can also be deserialized.

## Impact

If a hash is passed to `Kredis.json` by user input, reading the value may cause unexpected problems.

The only deserializable classes are those with `self.json_create` declared, usually String class are possible.(https://github.com/flori/json/blob/v2.6.2/lib/json/pure/generator.rb#L434)


If `json/add/core` is loaded, it is possible to deserialize RegExp, etc., thus risking ReDoS, etc.

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
