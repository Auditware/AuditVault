---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - vuln/path-traversal
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2017-08-31
submitted: 2017-06-26T09:14:48.920Z
bounty_usd: 1000
votes: 11
cve: "CVE-2017-0901"
program: "[[programs/rubygems|RubyGems]]"
reporter: "mame"
source: "https://hackerone.com/reports/243156"
title: "Installing a crafted gem package may create or overwrite files"
---
# Installing a crafted gem package may create or overwrite files

> **Severity:** High | **Bounty:** 1,000 USD | **Votes:** 11 | **Program:** RubyGems | **Disclosed:** 2017-08-31

- Report: [https://hackerone.com/reports/243156](https://hackerone.com/reports/243156)
- CWE: Path Traversal | CVE: CVE-2017-0901
- Submitted: 2017-06-26T09:14:48.920Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

There is no check for `name` field in `metadata.gz`.  By assigning a maliciously crafted string like `../../../../../any/where` to the field, an attacker can create an arbitrary file out of the directory of the gem, or even replace an existing file with a malicious file.

## Proof of Concept 1: Create a file anywhere

This PoC attempts to create a file `/tmp/malicious-0/BOOOOM`.

1) Download the attached file `malicious.gem`.
2) Run `gem install malicious.gem --no-doc`.
3) `/tmp/malicious-0/BOOOOM` should be created.

`malicious.gem` assigns `../../../../../../../../../../tmp/malicious` as `name` field.  This attack is relatively weak since the path must include a directory named `<name>-<version>`, such as `malicious-0`.  Still, there are many chances that cause a catastrophe.  For example, think of replacing a file in `/etc/dbus-1/`.

## Proof of Concept 2: Replace `rackup` command

This PoC attempts to replace `gems/rack-2.0.3/bin/rackup` with a malicious file.

1) Download the attached file `replace-rackup.gem`.
2) Run `gem install rack -v 2.0.3`.
3) Run `gem install replace-rackup.gem --no-doc`.
4) Run `rackup`.  It will emit just `BOOOOM!`.

`replace-rackup.gem` assigns `../gems/rack` as `name` field, and contains a malicious file `bin/rackup`.  This is really exploitable for attackers.

## Note

For how to create the malicious gems, see the attached file `src.tar.gz`.

In my opinion, **this attack is much more dangerous** than the issues I reported recently.  I hope you could fix this issue ASAP.

## Timeline

- **Report Filed**
- **2017-06-26** @RubyGems: Thanks for submitting this report to RubyGems. Our team will review and investigate the issue. Please note that only issues in the rubygems library are eligible for our bug bounty program.
- **2017-07-02** @mame: To make sure: `gem install replace-rackup.gem` does not simply install a new `rackup` command, but actually overwrites the existing `rackup` command **without prompt**.  I'd like you to check this issue ASAP.
- **2017-07-03** @segiddins: I believe this should fix both issues, though it requires test coverage:

```diff
diff --git a/lib/rubygems/installer.rb b/lib/rubygems/installer.rb
index 913db819..de169240 100644
--- a/lib/rubygems/installer.rb
+++ b/lib/rubygems/installer.rb
@@ -700,6 +700,12 @@ class Gem::Installer
       unpack or File.writable?(gem_home)
   end
 
+  def verify_spec_name
+    illegal_characters = spec.name.scan(Regexp.union(File::SEPARATOR)).uniq
+    return if illegal_characters.empty?
+    raise Gem::InstallError, "#{spec} contains illegal characters in its name #{illegal_characters.inspect}"
+  end
+
   ##
   # Return the text for an application file.
 
@@ -826,6 +832,8 @@ TEXT
 
     ensure_loadable_spec
 
+    verify_spec_name
+
     if options[:install_as_default]
       Gem.ensure_default_gem_subdirectories gem_home
     else
```
- **2017-07-03** @segiddins: Below, I have a patch with test coverage for validating the package when installing, as well as validating the name in the gemspec which should make unintentional errors more discoverable:

```diff
diff --git a/lib/rubygems/installer.rb b/lib/rubygems/installer.rb
index 913db819..a04fc354 100644
--- a/lib/rubygems/installer.rb
+++ b/lib/rubygems/installer.rb
@@ -700,6 +700,11 @@ class Gem::Installer
       unpack or File.writable?(gem_home)
   end
 
+  def verify_spec_name
+    return if spec.name =~ Gem::Specification::VALID_NAME_PATTERN
+    raise Gem::InstallError, "#{spec} has an invalid name"
+  end
+
   ##
   # Return the text for an application file.
 
@@ -826,6 +831,8 @@ TEXT
 
     ensure_loadable_spec
 
+    verify_spec_name
+
     if options[:install_as_default]
       Gem.ensure_default_gem_subdirectories gem_home
     else
diff --git a/lib/rubygems/specification.rb b/lib/rubygems/specification.rb
index 2b3eb3e3..13039566 100644
--- a/lib/rubygems/specification.rb
+++ b/lib/rubygems/specification.rb
@@ -108,6 +108,8 @@ class Gem::Specification < Gem::BasicSpecification
 
   private_constant :LOAD_CACHE if defined? private_constant
 
+  VALID_NAME_PATTERN = /\A[a-zA-Z0-9\.\-\_]+\z/ # :nodoc:
+
   # :startdoc:
 
   ##
@@ -2698,9 +2700,15 @@ class Gem::Specification < Gem::BasicSpecification
       end
     end
 
-    unless String === name then
+    if !name.is_a?(String) then
+      raise Gem::InvalidSpecificationException,
+            "invalid value for attribute name: \"#{name.inspect}\" must be a string"
+    elsif name !~ /[a-zA-Z]/ then
+      raise Gem::InvalidSpecificationException,
+            "invalid value for attribute name: #{name.dump} must include at least one letter"
+    elsif name !~ VALID_NAME_PATTERN then
       raise Gem::InvalidSpecificationException,
-            "invalid value for attribute name: \"#{name.inspect}\""
+            "invalid value for attribute name: #{name.dump} can only include letters, numbers, dashes, and underscores"
     end
 
     if raw_require_paths.empty? then
diff --git a/test/rubygems/test_gem_installer.rb b/test/rubygems/test_gem_installer.rb
index f941c240..39095c7d 100644
--- a/test/rubygems/test_gem_installer.rb
+++ b/test/rubygems/test_gem_installer.rb
@@ -1450,6 +1450,26 @@ gem 'other', version
     end
   end
 
+  def test_pre_install_checks_malicious_name
+    spec = util_spec '../malicious', '1'
+    def spec.full_name # so the spec is buildable
+      "malicious-1"
+    end
+    def spec.validate; end
+
+    util_build_gem spec
+
+    gem = File.join(@gemhome, 'cache', spec.file_name)
+
+    use_ui @ui do
+      @installer = Gem::Installer.at gem
+      e = assert_raises Gem::InstallError do
+        @installer.pre_install_checks
+      end
+      assert_equal '#<Gem::Specification name=../malicious version=1> has an invalid name', e.message
+    end
+  end
+
   def test_shebang
     util_make_exec @spec, "#!/usr/bin/ruby"
 
diff --git a/test/rubygems/test_gem_specification.rb b/test/rubygems/test_gem_specification.rb
index ae39a6d0..bb6acbc7 100644
--- a/test/rubygems/test_gem_specification.rb
+++ b/test/rubygems/test_gem_specification.rb
@@ -3014,7 +3014,37 @@ Did you mean 'Ruby'?
       @a1.validate
     end
 
-    assert_equal 'invalid value for attribute name: ":json"', e.message
+    assert_equal 'invalid value for attribute name: ":json" must be a string', e.message
+
+    @a1.name = []
+    e = assert_raises Gem::InvalidSpecificationException do
+      @a1.validate
+    end
+    assert_equal "invalid value for attribute name: \"[]\" must be a string", e.message
+
+    @a1.name = ""
+    e = assert_raises Gem::InvalidSpecificationException do
+      @a1.validate
+    end
+    assert_equal "invalid value for attribute name: \"\" must include at least one letter", e.message
+
+    @a1.name = "12345"
+    e = assert_raises Gem::InvalidSpecificationException do
+      @a1.validate
+    end
+    assert_equal "invalid value for attribute name: \"12345\" must include at least one letter", e.message
+
+    @a1.name = "../malicious"
+    e = assert_raises Gem::InvalidSpecificationException do
+      @a1.validate
+    end
+    assert_equal "invalid value for attribute name: \"../malicious\" can only include letters, numbers, dashes, and underscores", e.message
+
+    @a1.name = "\ba\t"
+    e = assert_raises Gem::InvalidSpecificationException do
+      @a1.validate
+    end
+    assert_equal "invalid value for attribute name: \"\\ba\\t\" can only include letters, numbers, dashes, and underscores", e.message
   end
 
   def test_validate_non_nil

```
- **2017-07-04** @indirect: @mame can you confirm if this patch fixes the issue?
- **2017-08-26** @mame: I confirmed that it fixes the issue.  Also, I confirmed that it allows some of my gems whose name is strange, such as [`_`](http://rubygems.org/gems/_) and [`1234567890_`](https://rubygems.org/gems/1234567890_).

 Thank you and sorry for the late reply!
- **Report Resolved**
- **Agreed On Going Public**
- **Cve Id Added**
- **Bounty Awarded**
- **Report Severity Updated**
- **Report Severity Updated**
- **2017-08-31** @mame: I agree to disclose this ticket.  Thank you very much!
- **Manually Disclosed**
