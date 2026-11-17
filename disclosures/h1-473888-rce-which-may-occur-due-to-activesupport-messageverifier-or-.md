---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/command-injection-generic
  - env/web
  - stack/ruby
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2019-03-13
submitted: 2019-01-02T03:20:45.831Z
bounty_usd: 1500
votes: 41
cve: "CVE-2019-5420"
program: "[[programs/rails|Ruby on Rails]]"
reporter: "ooooooo_q"
source: "https://hackerone.com/reports/473888"
title: "RCE which may occur due to `ActiveSupport::MessageVerifier` or `ActiveSupport::MessageEncryptor` (especially Active storage)"
---
# RCE which may occur due to `ActiveSupport::MessageVerifier` or `ActiveSupport::MessageEncryptor` (especially Active storage)

> **Severity:** High | **Bounty:** 1,500 USD | **Votes:** 41 | **Program:** Ruby on Rails | **Disclosed:** 2019-03-13

- Report: [https://hackerone.com/reports/473888](https://hackerone.com/reports/473888)
- CWE: Command Injection - Generic | CVE: CVE-2019-5420
- Submitted: 2019-01-02T03:20:45.831Z

## Timeline

- **Report Filed**
- **2019-01-02** @ooooooo_q: Sorry, it was `JSON.parse` instead of `JSON.load`.
- **2019-01-07** @ooooooo_q: There are few cases where an attacker can directly access servers in development mode.
However, because it is a GET access, it can be attacked using access to images, for example.
An attacker could induce the developer to gain access to the trapping site and include the payload of the attack in the URL of the image.
- **2019-01-07** @ooooooo_q: This vulnerability seems to affect https://hackerone.com.

Response when accessing https://hackerone.com/rails/active_storage/disk/test/test is empty.
Because normal 404 pages are displayed as https://hackerone.com/404, it seems that the URL of active storage is used.
- **2019-01-15** @ooooooo_q: @rails Any updates?
- **2019-01-15** @tenderlove: @ooooooo_q Hi, sorry for the late response.  I'm taking a look :)
- **2019-01-15** @tenderlove: Hi,

We've been discussing how to fix this.  I thought JSON or YAML would work, but apparently [Rails supports serializing arbitrary objects](https://github.com/rails/rails/blob/a08827a90b5a9be79379019cf5b242bd7236d2e3/activesupport/test/message_verifier_test.rb#L22).  Switching to JSON breaks tests.  `YAML.safe_load` supports more types than JSON, so maybe we could use that.  Another thought I had is we could make the `secret_key_base` not so easy to guess.

I don't like that Marshal is the default.  I think we should switch the default to JSON or YAML, but I'm certain it will break apps.  A less predictable secret_key_base might be the right fix here.  What do you think?
- **2019-01-16** @ooooooo_q: @tenderlove 
Hi,

I imagined that for 5.2.x the following changes would be made.
(For other versions, I imagined breaking change when major version was upgraded.)


```ruby
  class StorageSerializer
    def self.load(value)
      v = JSON.parse(value)
      v.is_a?(Hash) ? v.symbolize_keys : v
    end

    def self.dump(value)
      JSON.dump(value)
    end
  end

  class Application < Rails::Application

   ...

    def message_verifier(verifier_name)
      serializer = verifier_name == "ActiveStorage" ? StorageSerializer : Marshal;
      @message_verifiers[verifier_name] ||= begin
        secret = key_generator.generate_key(verifier_name.to_s)
        ActiveSupport::MessageVerifier.new(secret, serializer: serializer)
      end
    end
  end
```

Also, by avoiding inferring secret_key_base as you say, the problem is alleviated. (Depending on what secret_key_base can guess, there may be other unexpected problems occurring.)

If there is no other effect, I think that it is better to do both.
- **Report Triaged**
- **Cve Id Added**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2019-03-27** @ooooooo_q: @tenderlove  @rails 

hello,

In 5.2.x or later, it seems that it is not known to developers that it is possible to attack with the URL for active storage.
Some people think it's a problem with the cookie store.

However, the combination with CVE-2019-5418 is widespread among bug hunters.

The default time limit for active storage url is 5 minutes, and I thought that it would be better to issue a fix because the downtime usually falls within 5 minutes even if the serializer is changed by a patch.
https://github.com/rails/rails/blob/5-2-stable/activestorage/lib/active_storage/service.rb#L44
- **2019-04-13** @ooooooo_q: @rails 
Are there plans to change the serializer in Active storage?
