---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - stack/node
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2020-08-20
submitted: 2020-05-01T11:15:06.209Z
bounty_usd: null
votes: 0
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/863944"
title: "[extra-ffmpeg] Command Injection via insecure command formatting"
---
# [extra-ffmpeg] Command Injection via insecure command formatting

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 0 | **Program:** Node.js third-party modules | **Disclosed:** 2020-08-20

- Report: [https://hackerone.com/reports/863944](https://hackerone.com/reports/863944)
- CWE: Command Injection - Generic
- Submitted: 2020-05-01T11:15:06.209Z

## Timeline

- **Report Filed**
- **2020-05-01** @celt: Hi @d3lla,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@celt
- **Report Triaged**
- **External User Joined**
- **2020-07-24** @wolfram77: Here is the output now, looks it should not be accepting commands now. Used `execFile` as you suggested. Maybe it looks like spoon feeding, but could you tell how you found this particular packages has this bug? Thanks for what you do.

```bash
> var ffmpeg = require('./')
undefined
> ffmpeg.sync([{y: true}, {i: '`touch HACKED`'}, {acodec: 'copy', o: 'aud.mp3'}]);
ffmpeg version 4.0.2 Copyright (c) 2000-2018 the FFmpeg developers
  built with gcc 7.3.1 (GCC) 20180722
  configuration: --disable-static --enable-shared --enable-gpl --enable-version3 --enable-sdl2 --enable-bzlib --enable-fontconfig --enable-gnutls --enable-iconv --enable-libass --enable-libbluray --enable-libfreetype --enable-libmp3lame --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenjpeg --enable-libopus --enable-libshine --enable-libsnappy --enable-libsoxr --enable-libtheora --enable-libtwolame --enable-libvpx --enable-libwavpack --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxml2 --enable-libzimg --enable-lzma --enable-zlib --enable-gmp --enable-libvidstab --enable-libvorbis --enable-libvo-amrwbenc --enable-libmysofa --enable-libspeex --enable-libxvid --enable-libaom --enable-libmfx --enable-amf --enable-ffnvcodec --enable-cuvid --enable-d3d11va --enable-nvenc --enable-nvdec --enable-dxva2 --enable-avisynth
  libavutil      56. 14.100 / 56. 14.100
  libavcodec     58. 18.100 / 58. 18.100
  libavformat    58. 12.100 / 58. 12.100
  libavdevice    58.  3.100 / 58.  3.100
  libavfilter     7. 16.100 /  7. 16.100
  libswscale      5.  1.100 /  5.  1.100
  libswresample   3.  1.100 /  3.  1.100
  libpostproc    55.  1.100 / 55.  1.100
`touch HACKED`: No such file or directory
Thrown:
Error: Command failed: ffmpeg -y -i `touch HACKED` -acodec copy aud.mp3
    at checkExecSyncError (child_process.js:621:11)
    at Object.execFileSync (child_process.js:639:15)
    at Function.sync (C:\Base\Forge\extra-ffmpeg\index.js:30:13) {
  status: 1,
  signal: null,
  output: [ null, null, null ],
  pid: 30624,
  stdout: null,
  stderr: null
}
```
- **2020-07-24** @wolfram77: Wanted to share the fixed code here:

```javascript
// Generate command for ffmpeg.
function command(os) {
  var file = 'ffmpeg', args = [];
  for(var o of os||[]) {
    for(var k in o||{}) {
      if(o[k]==null) continue;
      if(k==='stdio') continue;
      if(k==='o' || k==='outfile') args.push(o[k]);
      else if(typeof o[k]==='boolean' && o[k]) args.push('-'+k);
      else args.push('-'+k, ''+o[k]);
    }
  }
  return {file, args};
}

/**
 * Invoke "ffmpeg" synchronously.
 * @param {object} os ffmpeg options.
 */
function sync(os) {
  var stdio = os.stdio===undefined? STDIO:os.stdio;
  var {file, args} = command(os);
  return cp.execFileSync(file, args, {stdio});
}
```
- **2020-07-25** @d3lla: Hi @wolfram77,
thanks for your reply and for the fix.

Your changes seems to fix the problem.
I run the previous poc:
```javascript
const ffmpeg = require('extra-ffmpeg');
ffmpeg.sync([{y: true}, {i: '`touch HACKED`'}, {acodec: 'copy', o: 'aud.mp3'}]);
```
and I was not able to reproduce the previous reported result.

When I found this repository, since it's calling an external program (`ffmpeg`), I checked which function is used and how the command was build. Then I did some manual tests and found the issue.
A resource that could be helpful: [Avoid-Command-Injection-Node.md](https://gist.github.com/evilpacket/5a9655c752982faf7c4ec6450c1cbf1b).

Thanks for your time and have a nice day,
d3lla

I tested using the following configurations:

- OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
- NODEJS VERSION: v14.2.0
- NPM VERSION: 6.14.4
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
