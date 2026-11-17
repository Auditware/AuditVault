---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2025-04-01
submitted: 2025-02-19T10:52:13.074Z
bounty_usd: null
votes: 626
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "avinash_"
source: "https://hackerone.com/reports/3000510"
title: "The /reports/:id.json endpoint discloses potentially sensitive user attributes when reporter summary is present"
---
# The /reports/:id.json endpoint discloses potentially sensitive user attributes when reporter summary is present

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 626 | **Program:** HackerOne | **Disclosed:** 2025-04-01

- Report: [https://hackerone.com/reports/3000510](https://hackerone.com/reports/3000510)
- CWE: Information Disclosure
- Submitted: 2025-02-19T10:52:13.074Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Vulnerability Information Updated**
- **Report Title Updated**
- **Report Severity Updated**
- **2025-02-19** @avinash_: Endpoint is leaking too much data, Please take a look at it as soon as possible. Thanks!
- **2025-02-19** @avinash_: Sensitive data leaked such as:-

```
email
"changed_password_at"
"totp_secret"
"allow_next_sign_in_attempt_at
otp_backup_codes
"tshirt_size"
current_sign_in_country
request_endorsements_at
"graphql_secret_token
overview_token_2017
account_recovery_phone_number" (in hashed form)
account_recovery_unverified_phone_number"
account_recovery_phone_number_sent_at
account_recovery_phone_number_token
totp_enabled_at
sequential_totp_failures
facebook_oauth_state
ctf_points
"calendar_token"
cached_reputation_for_user_profile_last_reputation_id

etc etc
```
- **2025-02-19** @avinash_: After further investigation in my some of test reports (from test h1 account: ```/████```), I've noticed few points:-

* The data is getting disclosed on reports when Team/Reporter posts summary on report.
* This issue will leak the "Team member's" data if team member has posted summary on report.
* If both Reporter and Team member posted summaries on a report then it will disclose both people's data.

Please take a look at it as soon as possible.

Thanks!
- **2025-02-20** @avinash_: It’s been 24 hours since it is reported, issue is still alive, Kindly Please take a look as soon as possible.
- **2025-02-20** @avinash_: Anyone listening?
- **2025-02-21** @avinash_: Not want to spam here but this report's severity is Critical, It should be remediated faster. Please check this report soon.
- **2025-02-21** @jobert: Thanks, we're on it.
- **Report Triaged**
- **Report Retesting**
- **External User Joined**
- **External User Joined**
- **External User Joined**
- **User Completed Retest**
- **2025-02-21** @avinash_: Hi @jobert - Thank you fo your super duper quick response and fix. The fix is too fast it is really appreciable.

Thank you for redacting sensitive things in report but Please redact the report id: ```███``` mentoned,  it will show other peoples which user's data was leaked and mentioned in this report.

Please also redact the screenshot mentioned in "restest" summary.

Thanks again
- **Report Retest Approved**
- **Report Resolved**
- **Bounty Awarded**
- **Report Title Updated**
- **2025-02-21** @avinash_: @jobert - Surprised, Thank you so much for this amazing bounty. 😊
- **Report Vulnerability Types Updated**
- **2025-02-22** @avinash_: Hi @jobert - I went through some of disclosed reports of H1, I've noticed one thing:- When in a report, there is summary written from team side then on opening  .json endpoint of that report it is disclosing which participant from team member has posted the summary. For ex:-

The report:- https://hackerone.com/reports/2598548 , A summary has provided by Hackerone, UI shows it as:- "Summary By Hackerone"

{F4080488}

On opening .json endpoint of report, It is disclosing which participant from team side has posted the summary.

████████


Is disclosing this information publicly an intended behaviour?

Thanks!
- **2025-02-22** @jobert: No, that's intentional. Thanks for checking!
- **2025-02-26** @jobert: Hey @avinash_, we wanted to provide some context on the root cause of this issue and why it wasn't caught through automated testing.

On February 19, 2025 HackerOne upgraded from Rails 6.1.7.9 to Rails 7.1.5.1. Both versions offer the ability to serialize Ruby hashes into JSON. There is a slight difference between the way this works in both versions. Let’s assume we have the following Ruby hash:

```ruby
hash = {
  my_key: 'my_value',
  'my_key' => 'my_other_value',
}
```

This hash contains two keys with the same name, but one key is a symbol and the other a string. You can access them independently, as such:

```ruby
hash[:my_key]
# => 'my_value'

hash['my_key']
# => 'my_other_value'
```

If `to_json` is called on this hash in Rails 6.1.7.9, the duplicate key is the one that is used in the JSON output:

```ruby
hash.to_json
# => {"my_key":"my_other_value"}
```

However, in Rails  7.1.5.1, this behavior changed due to the implementation of the `ActiveSupport::JSON.encode` method. Here is the output in Rails 7.1.5.1, which shows that the JSON output contains a duplicate key due to the fact that JSON does not distinguish between symbols and strings and ActiveSupport now treats them as unique keys:

```ruby
hash.to_json
# => {"my_key":"my_value","my_key":"my_other_value"}
```

This resulted in exposing sensitive data on the `/reports/:id.json` endpoint. Here is an excerpt of the jbuilder template that serializes report summaries:

```ruby
json.merge!(summary.json_attributes)

# ...

if summary.persisted?
  # …
  json.user do
    json.partial!('users/user', user: summary.user)
  end
end
```

The `summary.json_attributes` method was implemented as following:

```ruby
class ReportSummary < ApplicationRecord
  # ...
  belongs_to :user
  # ...
  def json_attributes
    {
      id:,
      category:,
      content:,
      updated_at:,
      user:,
    }
  end

  # ...
end
```

The `json_attributes` method returns an instance of a `User` object with a symbol as its key, called “user”. When merging this into the jbuilder object, it implicitly calls `to_json` on this object, which serializes all the user attributes. These user attributes contain sensitive information such as email, unverified account recovery phone number, account backup codes, and GraphQL secret token.

When the template is being generated, it eventually calls `json.user` with a partial. The key that is appended to the hash is a string, not a symbol. In Rails 6.1.7.9, when the final hash would be serialized to a JSON string, it would only retain the key that was added last, which was the sanitized user partial. However, after the upgrade to Rails 7.1.5.1, it would retain both keys and, thus, the final JSON would contain a duplicate key; one with the user attributes and one with the user partial. 

At HackerOne we have many automated tests, including tests that verify the JSON structure of this particular endpoint. However, none of these tests failed, which was unexpected. We use the approvals gem to verify JSON structures, often using code that looks similar to this:

```ruby
verify(format: :json) { subject.body }
```

We verified that subject.body after the upgrade did indeed return a duplicate key. The reason why none of the tests failed is because verify parses the JSON again in order to normalize information like IDs, which may change between tests. When parsing JSON in Ruby, only the last instance of a duplicate key is returned:

```ruby
JSON.parse('{"my_key":"my_value","my_key":"my_other_value"}')
=> {"my_key"=>"my_other_value"}
```

This means that even though the view returned a duplicate key, tests didn’t fail because it would only see the last instance, which was the exact shape of the object prior to the upgrade.
- **2025-02-28** @avinash_: Hi @jobert - Sorry for the delay,

Thank you for providing such a great explanation about how and why this issue emerged?,  So the villain here was the rails 7.1.5.1 implemented hash key-value pair,  As I understood, The main issue is that JSON was not differentiate between symbols and string keys, leading to duplicate keys appearing in the serialized output. This change resulted in exposing sensitive user data at report's .json endpoint. 

>We use the approvals gem to verify JSON structures, often using code that looks similar to this:
```
verify(format: :json) { subject.body }
```

The approval gem parses json structure and comparing them with previous body here? , which is helping to compare and track if there is more data(sensitive/non-sensitive) is getting disclosed or not? Right? 

I've few questions:- 

* Instead of doing single check Can HackerOne add additional checks which inspect raw JSON output here and other json endpoints? or this single "approvals gem" check is sufficient? 

* As you've indicated about ```to_json```, Why HackerOne is not using ```as_json``` instead of  ```to_json```  to avoid unexpected serialization behavior? Since ```as_json``` will  return a hash before serialization and does not retain duplicate keys.  I'm only asking this because I got some information about both calls in this blog: https://jonathanjulian.com/2010/04/rails-to_json-or-as_json/ 

* (Optional question): Am I eligible for any swag? 😂



Again Thank you for all of your responses and clarification in this issue.

Regards,
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
- **2025-04-04** @h1_chriszo111: Hi Avinash, about your swag question: Please check your email inbox. If you don't see anything there, please let me know.
