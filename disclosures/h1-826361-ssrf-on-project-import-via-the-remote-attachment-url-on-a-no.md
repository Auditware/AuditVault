---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2020-06-07
submitted: 2020-03-22T12:37:34.144Z
bounty_usd: 10000
votes: 359
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/826361"
title: "SSRF on project import via the remote_attachment_url on a Note"
---
# SSRF on project import via the remote_attachment_url on a Note

> **Severity:** High | **Bounty:** 10,000 USD | **Votes:** 359 | **Program:** GitLab | **Disclosed:** 2020-06-07

- Report: [https://hackerone.com/reports/826361](https://hackerone.com/reports/826361)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2020-03-22T12:37:34.144Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

The Note model has an `attachment` which is provided by a CarrierWave uploader:

```ruby
mount_uploader :attachment, AttachmentUploader
```

One of the features this provides is the ability to download and attach a file via a url, see https://github.com/carrierwaveuploader/carrierwave/blob/v1.3.1/lib/carrierwave/mount.rb#L80. This means that the Note model has a method `remote_attachment_url=` which can be used to perform this action.

As this attribute isn't removed by the `AttributeCleaner` on project import, it can be set in the `project.json` for a note and will be set when the note is created, downloading the file:

https://github.com/carrierwaveuploader/carrierwave/blob/v1.3.1/lib/carrierwave/mounter.rb#L72
```ruby
  def remote_urls=(urls)
      return if not urls or urls == "" or urls.all?(&:blank?)

      @remote_urls = urls
      @download_error = nil
      @integrity_error = nil

      @uploaders = urls.zip(remote_request_headers || []).map do |url, header|
        uploader = blank_uploader
        uploader.download!(url, header || {})
        uploader
      end
```

https://github.com/carrierwaveuploader/carrierwave/blob/v1.3.1/lib/carrierwave/uploader/download.rb#L43
```ruby
    def file
          if @file.blank?
            headers = @remote_headers.
              reverse_merge('User-Agent' => "CarrierWave/#{CarrierWave::VERSION}")

            @file = Kernel.open(@uri.to_s, headers)
            @file = @file.is_a?(String) ? StringIO.new(@file) : @file
          end
```

The downloaded file is then attached to the note and can be viewed from the newly imported project.

Any model that has a `mount_uploader` and is importable is potentially vulnerable to the same attack, although the majority of the others are `AvatarUploader` which checks the file type and prevents the response from being viewed.

### Steps to reproduce

1. Create a new project
1. Create an issue in the project
1. Add a note to the issue
1. Export the project
1. Extract the export
1. Add  `remote_attachment_url` to the `note` hash with a url
1. Recompress the export and import it
1. View the note on the issue

Demo {F756257}

### Examples

Example of project import on gitlab.com hitting postbin:

https://gitlab.com/wbowling/ssrf1/-/issues/1#note_309127303
{F756269}

### What is the current *bug* behavior?
When importing a model that has a mount_uploader it's possible to use the carrierwave uploader seed attributes to download a file from any host: https://github.com/carrierwaveuploader/carrierwave/wiki/How-to:-Upload-remote-image-urls-to-your-seedfile

### What is the expected *correct* behavior?
The attributes should be prohibited and removed via the `AttributeCleaner`

### Output of checks
This bug happens on gitlab.com

#### Results of GitLab environment info
```
System information
System:		Ubuntu 18.04
Proxy:		no
Current User:	git
Using RVM:	no
Ruby Version:	2.6.5p114
Gem Version:	2.7.10
Bundler Version:1.17.3
Rake Version:	12.3.3
Redis Version:	5.0.7
Git Version:	2.24.1
Sidekiq Version:5.2.7
Go Version:	unknown

GitLab information
Version:	12.8.7-ee
Revision:	2643fd87200
Directory:	/opt/gitlab/embedded/service/gitlab-rails
DB Adapter:	PostgreSQL
DB Version:	10.12
URL:		http://gitlab-vm.local
HTTP Clone URL:	http://gitlab-vm.local/some-group/some-project.git
SSH Clone URL:	git@gitlab-vm.local:some-group/some-project.git
Elasticsearch:	no
Geo:		no
Using LDAP:	no
Using Omniauth:	yes
Omniauth Providers:

GitLab Shell
Version:	11.0.0
Repository storage paths:
- default: 	/var/opt/gitlab/git-data/repositories
GitLab Shell path:		/opt/gitlab/embedded/service/gitlab-shell
Git:		/opt/gitlab/embedded/bin/git
```

## Impact

* Allows an attacker to access internal services, for example the Omnibus GitLab has all of the exporters, Prometheus, Alertmanager exposed on localhost. 
* If GitLab is hosted on AWS it allows for the instance metadata to be accessed.
* Redis is running locally or accessible via tcp (address could be found by looking at the targets in Prometheus at http://localhost:9090/api/v1/targets) it could be possible to obtain RCE (similar to https://github.com/jas502n/gitlab-SSRF-redis-RCE#poc). A POST request is not possible here, but as `remote_attachment_request_header=` is also available (https://github.com/carrierwaveuploader/carrierwave/blob/v1.3.1/lib/carrierwave/mount.rb#L169) and not blacklisted, the payload could be set via a header.
* If GitLab is hosted on Google Cloud, the above could be used to set the `Metadata-Flavor: Google` header and access `http://metadata.google.internal/`

## Timeline

- **Report Filed**
- **2020-03-22** @vakzz: Attached is the modified project export used in the demo
- **2020-03-22** @gitlab-securitybot: Hi @vakzz,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 10 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2020-03-23** @vakzz: To confirm that this affects gitlab.com as well as the omnibus edition, I did a quick scan of localhost ports on gitlab.com which shows that the following are accessible:
* `████` on port ██████ allowing the metrics to be retrieved, ███████████████

```
# TYPE apt_upgrades_pending gauge
apt_upgrades_pending{arch="all",origin="Ubuntu:16.04/xenial-updates"} 32
apt_upgrades_pending{arch="amd64",origin="Ubuntu:16.04/xenial"} 2
apt_upgrades_pending{arch="amd64",origin="Ubuntu:16.04/xenial-updates"} 79
apt_upgrades_pending{arch="amd64",origin="pre-release:1/xenial"} 1
# HELP chef_client_duration_seconds The duration of chef-client run in seconds.
# TYPE chef_client_duration_seconds gauge
chef_client_duration_seconds 75.031342872
# HELP chef_client_error The bool error status of the last chef-client run.
# TYPE chef_client_error gauge
chef_client_error 0
# HELP chef_client_info The chef client version info.
# TYPE chef_client_info gauge
███
```

*  Consul on port ███████ allowing things like dumping the KV Store at, ███

```json
[
  {
    "LockIndex": 0,
    "Key": "█████",
    "Flags": 0,
    "Value": null,
    "CreateIndex": 689878,
    "ModifyIndex": 8420654
  },
  {
    "LockIndex": 0,
    "Key": "████████",
    "Flags": 0,
    "Value": null,
    "CreateIndex": 685871,
    "ModifyIndex": 8420655
  },
  {
    "LockIndex": 0,
    "Key": "█████",
    "Flags": 0,
    "Value": "eyJwb3N0Z...
```

These both show other internal hosts which could potentially be accessed via the same ssrf to leak private data.

Cheers,
Will
- **2020-03-23** @dappelt: Hi @vakzz,

thank you for sending in the report! 

We could reproduce the SSRF and are in the process of assessing the impact of your finding. You mentioned that it is possible to set custom HTTP headers on the request by setting `remote_attachment_request_header`:

> as remote_attachment_request_header= is also available (https://github.com/carrierwaveuploader/carrierwave/blob/v1.3.1/lib/carrierwave/mount.rb#L169) and not blacklisted, the payload could be set via a header.

We were not able to set custom headers on the request with `remote_attachment_request_header`. Can you provide an example project export that demonstrates how to add customer headers?

Best regards,
Dennis
- **Report Triaged**
- **Bounty Awarded**
- **2020-03-23** @vakzz: Hi @dappelt,

After trying to use a custom header on a project import I was unable to get it to work either (I had previously been testing this via a rails console after confirming it made it through the `AttributeCleaner`). I thought perhaps it was just an issue with randomness (depending on which attribute gets set first) but after digging into the rails code it looks like hash attributes are always set at the end:

```ruby
    def _assign_attributes(attributes)
        multi_parameter_attributes  = {}
        nested_parameter_attributes = {}

        attributes.each do |k, v|
          if k.include?("(")
            multi_parameter_attributes[k] = attributes.delete(k)
          elsif v.is_a?(Hash)
            nested_parameter_attributes[k] = attributes.delete(k)
          end
        end
        super(attributes)

        assign_nested_parameter_attributes(nested_parameter_attributes) unless nested_parameter_attributes.empty?
        assign_multiparameter_attributes(multi_parameter_attributes) unless multi_parameter_attributes.empty?
      end
``` 

As `remote_attachment_request_header` requires a hash to be passed in due to the following (and it's what `Kernel.open` expects) it will always be assigned last:

```ruby
# https://github.com/carrierwaveuploader/carrierwave/blob/v1.3.1/lib/carrierwave/uploader/download.rb#L40
headers = @remote_headers.reverse_merge('User-Agent' => "CarrierWave/#{CarrierWave::VERSION}")
```

So in summary you can get `remote_attachment_request_header=` to be called but it will always happen after `remote_attachment_url=` meaning the header wont be set yet when the request is made, unless there is a away to create a Note and then retrieve and update it from the cache during the same import (but I can't see a way for that to happen).

Sorry about that, I should have tested it a bit more!

Cheers,
Will
- **2020-03-24** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The issue you reported is currently scheduled to be fixed by 2020-04-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
