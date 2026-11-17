---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2024-10-25
submitted: 2024-09-25T08:53:00.441Z
bounty_usd: null
votes: 91
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "k0x"
source: "https://hackerone.com/reports/2737595"
title: "SQL Injection"
---
# SQL Injection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 91 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-10-25

- Report: [https://hackerone.com/reports/2737595](https://hackerone.com/reports/2737595)
- CWE: SQL Injection
- Submitted: 2024-09-25T08:53:00.441Z

## Timeline

- **Report Filed**
- **2024-09-25** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Informative**
- **2024-09-25** @k0x: Hello,

Have you tried running the command? I prefer not to share the database contents, as the data is sensitive and disclosing this report could potentially leak information.

To recreate the vulnerability, run the command and modify the `--current-db` option to any other parameter. You can also use `--dump` to retrieve the entire database.

During testing, I was able to dump the full database successfully.

Best regards,  
k0x
- **2024-09-25** @redwingreaper: Greetings!

Can you provide a image of the content that you have found? 

Please rest assured if this report is shared all sensitive information will be redacted.

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

Regards,
The VDP Team
- **2024-09-25** @k0x: Greetings,

As requested, I’ve attached an image showing some content I found:

█████████

Best regards,

k0x
- **2024-09-25** @k0x: █████
- **Report Reopened**
- **Report Severity Updated**
- **Report Triaged**
- **2024-09-25** @k0x: Hello,

Could you reconsider the criticality? I was able to retrieve the following databases:

```
360_batchinfo
360_download_log
360_fileinfo
360_gallery
360_nielsen_join
360_reports_log
360_reports
360_uploads
rank
actionable_media
actionable_media_specialists
alerts
alerts_downloads
alerts_email
alerts_email_media
alerts_invites
alerts_invites_members
api_account
api_key
api_member
api_widget_params
api_widgets
app_config_json
app_devices
application_tag
asset_lock
asset_notes
asset_ratings
audio
auth_group
auth_group_permissions
auth_group_tree
auth_member_groups
auth_member_permissions
auth_member_sessions
auth_permission
award_media
award_media_log
award_member_permissions
award_options
award_rating_categories
award_ratings
award_rules
awards
calendar_assign
calendar_events
calendar_log
calendars
cap_assets
cap_lock
cc_failures
ceco_queue
closed_caption_queue
combatant_command
commands
comment_flags
comments
container_items
container_queries
containers
control_vocab_keyword_media
controlled_vocabulary
controlled_vocabulary_hierarchy
controlled_vocabulary_media
copyright
copyright_media
countries
custom_report_auth_groups
custom_report_params
custom_reports
detected_entities
detected_entity_media
dimoc_log
distribution_members
distro_list
distro_media
distro_outlet_list
distro_outlets
do_not_queue
download_movers_shakers
email
email_mailing_log
email_mailing_log_click
email_mailing_log_recipient
email_mailing_log_status
encode_cluster_callbacks
encode_request_params
encoder_nodes
episode
extended_metadata
extended_metadata_restore
facebook_tab
failed_jobs
faqs
features
feed_channels
feed_items
flags
front_page_alert
ftp_video
geo_alerts
geo_geometry
graphics
graphics_categories
greeting_cards
greeting_cards_items
greetings
holiday_codes
holiday_dates
hometown_asset
hometown_event_bases
hometown_event_forms
hometown_event_media
hometown_event_templates
hometown_events
hometown_heroes
hometown_heroes_family
hometown_heroes_questions
hometown_subevents
hometown_submitted_events
hometown_submitted_events_hometowns
images
import_outlets
inbound_media
ip_country
journalists_month
journalists_month_images
klw_categories
klw_items
klw_members
languages
lar_social_accounts
lar_social_media_log
lar_social_posts
lar_social_posts_accounts
lar_twitter_searches
lar_users
line_test_results
listserv_group_log
listserv_group_members
listserv_groups
listserv_log
listserv_log_distros
listserv_log_invites
listserv_log_members
listserv_task
listserv_templates
live_remote_streams
live_webcasts
locode
locode_subdiv
log_video_crawford
log_video_detections
log_video_manual
mail_bounce
mailgun_retry
major_command
markets_tv
media_backup_queue
media_credit
media_encoding_jobs
media_filing
media_hit_log
media_player
media_playlist
media_playlist_media
media_presskit
media_removal_reasons
media_removal_requests
media_set
media_set_links
media_set_media
media_status
media_status_log
media_themes
media_view_log
member_create_unit_requests
member_device_tokens
member_email
member_friends
member_in_asset
member_info
member_invites
member_mobile_numbers
member_outlets
member_preferences
member_profile
member_profile_files
member_referrer
member_ribbons
member_secrets
member_task
member_unit_requests
member_units
membergroup
members
members_deny_mydvids
merge_log
message_recipients
message_threads
messages
migrations
mos
mydvids_options
navigation
navigation_membergroup
navigation_members
news
nftf_module_content
nftf_module_templates
nftf_modules
notification
notification_member
oauth_access_token_scopes
oauth_access_tokens
oauth_auth_code_scopes
oauth_auth_codes
oauth_client_redirect_uris
oauth_refresh_tokens
oauth_scopes
oauth_session_scopes
oauth_sessions
operation_units
operations
outlet_groups
outlet_set
outlet_set_outlets
outlet_tier
placement_auto_disconnect
placement_detections
placement_detections_audit_matches
placement_meta
placement_meta_match
placement_meta_match_disapprove
playlist_email
playlist_media
playlist_requests
playlist_unit
playlist_zip_requests
playlists
print
ptr_queue
publication_issues
publications
ref_entity_detection_model
request_media
requests
retry_query
ribbon_attachments
ribbons
rss_media_log
rtmp_channels
sat_trucks
search_index_log
series
snippets
social_link_types
staff
states
stream_encode_request_tee_outputs
stream_presets
submit_emails
subseries
survey_answers
survey_comments
survey_outreach
survey_questions
survey_sections
survey_surveys
system_outage_events
system_outage_systems
tag_media
tags
teletrax_channels
terms_service
theme_tags
tineye_queue
tineye_search
tineye_search_match
tineye_search_match_backlink
tinyurl
tinyurl_hits_log
training
training_tools
transmissions_cancelation_reasons
transmissions_cancelations
transmissions_channels
transmissions_in
transmissions_in_out
transmissions_log
transmissions_out
transmissions_out_outlets
transmissions_out_playlists
transmissions_recurring
transmitter_entries
transmitter_parts
transmitter_request
transmitters
tveyes_notifications
tveyes_stations
unit_addresses
unit_approval_log
unit_awards
unit_cocoms
unit_majcoms
unit_newsfromthefield
unit_oauth_tokens
unit_publish_log
unit_relationships
unit_services
unit_social_links
unit_themes
units
url2png
url2png_queue
vi_services
video
video_audit
video_files
video_frames
video_processing
video_scripts
video_youtube
webcast_captions
webcast_channels
webrtc_members
webrtcs
wireless_meta
zip_download_log
zip_download_log_media
zips
```

Here's why they pose a high risk to an organization:

**User Data Exposure:**

Tables like `auth_member_sessions`, `auth_member_groups`, `auth_member_permissions`, and `members` could expose sensitive user authentication details, permissions, and personal information. This makes unauthorized access and privilege escalation easier.

**API and Access Control:**

`api_account`, `api_key`, `oauth_access_tokens`, `oauth_refresh_tokens`, `auth_permission`, `member_secrets` could contain sensitive access keys, tokens, and credentials for API usage, which could be exploited for unauthorized access or manipulation of services.
**Media and Content Management:**

Tables such as `media_set`, `media_status`, `media_view_log`, `video_files`, `audio`, and `video_audit` might allow attackers to tamper with media, compromising content integrity or leaking sensitive audiovisual data.

**Alerts and Notifications:**

`alerts_email`, `geo_alerts`, `notifications`, and `email` suggest the presence of automated systems tied to alerts and notifications, which if tampered with, could cause communication issues or leak sensitive notifications.

**Logs and Tracking:**

Tables like download_log, email_mailing_log, media_hit_log, tineye_search, rss_media_log, and log_video_detections hold logs of system and user activity, which can reveal critical operational data to attackers. These could expose patterns of usage, media interactions, and other sensitive metrics.

**Sensitive Metadata and Configurations:**

`app_config_json`, `extended_metadata`, `app_devices`, and calendar_events could expose system configurations, schedules, or other internal organizational structures, giving attackers insight into the system’s architecture and operational timing.

**Copyright and Distribution:**

Tables like `copyright`, `copyright_media`, `distro_outlet_list`, and `media_presskit` could involve intellectual property or sensitive distribution lists. Public access to these could lead to content misuse or violation of copyright laws.

**System and Network Control:**

`control_vocab_keyword_media`, `commands`, `unit_publish_log`, `units`, and `unit_awards` might provide details on organizational units, commands, and system operations, increasing the risk of system manipulation or insider threats.

**API and OAuth Tokens:**

Tables such as `oauth_access_tokens`, `api_key`, and `api_account` could expose critical tokens that would grant access to APIs, allowing attackers to manipulate or steal sensitive data.

In short, exposing these tables publicly would make the organization vulnerable to data breaches, unauthorized access, and potential disruption of critical services. Attackers could exploit the information to gain deeper system access, compromise user accounts, or manipulate content and media, severely impacting both operational and reputational aspects.
- **Report Severity Updated**
- **2024-09-25** @k0x: Hello,

I’ve come across several reports on HackerOne that categorize SQL injection vulnerabilities as **CRITICAL**. Could you please provide a rationale for why this particular vulnerability is not classified as critical in this case?

Here are a few example reports for reference:

- [Report #2051931](████████)
- [Report #1046084](███████)
- [Report #446293](████)
- [Report #1878584](██████)

Looking forward to your insights.

Best regards,

k0x
- **2024-09-25** @redwingreaper: Greetings!

Due to the grading of the CVSS scale, there is a low loss of integrity as you have not showcased that you were able to modify the contents of the database with definite results of these actions, which would make this a critical severity. 

Again as stated in a previous report, our security posture may not be the same as other programs. So what one program may see as critical and another may not.

Previous SQL injection reports submitted to us show a similar PoC and were graded amongst the same criteria as your report.

By all means, if you can show that you have control of some sort of modification of the database or show a loss of availability for a table or the database itself, we can proceed to change the severity accordingly.

You can refer to the CVSS 3.0 scale here that takes part in deciding the severity of a report:
████████

If you have any questions, please let me know!

Thank you once again for supporting the DoD Vulnerability Disclosure Program (VDP).

Regards,
The VDP Team
- **Report Resolved**
- **Agreed On Going Public**
- **2024-10-17** @k0x: P.S: Sorry I don’t mentioned you on the last message. @redwingreaper
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
