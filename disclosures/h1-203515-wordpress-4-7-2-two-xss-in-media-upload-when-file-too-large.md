---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
  - stack/wordpress
  - vuln/xss
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2017-07-17
submitted: 2017-02-05T01:16:31.298Z
bounty_usd: null
votes: 23
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "skansing"
source: "https://hackerone.com/reports/203515"
title: "Wordpress 4.7.2 - Two XSS in Media Upload when file too large."
---
# Wordpress 4.7.2 - Two XSS in Media Upload when file too large.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 23 | **Program:** WordPress | **Disclosed:** 2017-07-17

- Report: [https://hackerone.com/reports/203515](https://hackerone.com/reports/203515)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2017-02-05T01:16:31.298Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Description
-------------------
An attacker can inject a malicious script in to the filename which a victim tries to upload leading to XSS inside the administrators control panel.

Two different "file to large" cases end up in interpolating the file name and appending it into DOM unsanitized leading to XSS.

I have attached pictures of one of the cases, in the attached case the file was 12.4 MB, in a freshly installed environment. For reproduction note that any file type can be used (.jar whatever) as the vuln happens before the type is validated.

PoC
-------------------
Create a 20MB file called 

`Dinosaurs secret life<img src=x  onerror=alert(1)>.png`

Goto your wordpress site `http://127.0.0.1/wp-admin/media-new.php` and drag`n`drop or use file manager or choose the file via. the "Select Files" button.

A error will appear with `... exceeds the maximum upload size for this site.` along with a alert box to display that the payload has been executed.

Details on XSS
-------------------
The file `script-loader.php` prepares an array of messages for use later.

```
	// error message for both plupload and swfupload
	$uploader_l10n = array(
                ...
		'file_exceeds_size_limit' => __('%s  exceeds the maximum upload size for this site.'),
		'big_upload_failed' => __('Please try uploading this file with the %1$sbrowser uploader%2$s.'),
		...
	);
```

The payload will be injected into the `%s` in the key `file_exceeds_size_limit`.

This happens because the `$uploader_l10n` is passed to `handlers.min.js` (non minified version shown)
 and interpolated without escaping the value previously.

First the value passes trough a error case 
```
// $uploader_l10n
case plupload.FILE_SIZE_ERROR:
			uploadSizeError(uploader, fileObj); // fileObj contains the filename payload in name attribute.
			break;
....
if ( max > hundredmb && fileObj.size > hundredmb )
				wpFileError( fileObj, pluploadL10n.big_upload_failed.replace('%1$s', '<a class="uploader-html" href="#">').replace('%2$s', '</a>') );
```

and lastely interpolated and appended to the dom.

```

function uploadSizeError( up, file, over100mb ) {
	var message;

	if ( over100mb )
		message = pluploadL10n.big_upload_queued.replace('%s', file.name) + ' ' + pluploadL10n.big_upload_failed.replace('%1$s', '<a class="uploader-html" href="#">').replace('%2$s', '</a>');
	else
		message = pluploadL10n.file_exceeds_size_limit.replace('%s', file.name);


	jQuery('#media-items').append('<div id="media-item-' + file.id + '" class="media-item error"><p>' + message + '</p></div>');
	up.removeFile(file);
}
```

The critical lines are 
```
message = pluploadL10n.big_upload_queued.replace('%s', file.name) + ' ' + pluploadL10n.big_upload_failed.replace('%1$s', '<a class="uploader-html" href="#">').replace('%2$s', '</a>');
	else
		message = pluploadL10n.file_exceeds_size_limit.replace('%s', file.name);
```

# Suggested fix:
Remove the filename or escape safely in context.

## Timeline

- **Report Filed**
- **2017-02-05** @voldemortensen: Hey @skansing, thanks for another great report. It made this one easy to reproduce. I'll get to work on this one.
- **Report Triaged**
- **2017-02-05** @skansing: Hey @voldemortensen, awesome =)  

Thanks for asserting the bug so quickly and the feedback, made my morning extra great. thx
- **2017-03-27** @adamsilverstein: @skansing Thanks again for the report. 

I have prepared the attached patch to resolve the issue. It uses DOM construction for the `uploadSizeError` error message insertion. After the patch, variable `message` is inserted with jQuery's `.text()` so it is safe regardless of what you pass it as a filename. 

Can you test to verify this resolves the issue for you? 

Thanks. Once we confirm, we'll get this into an upcoming release.

I am also attaching a QUnit test that fails before the patch because the JS in the filename is evaluated. It passes after the patch.
- **2017-03-27** @skansing: Hey, thanks for the update.

I can confirm the fix works and have been unable to trigger the XSS with the patch supplied.
- **2017-05-17** @skansing: Hi this has been released in 4.7.5, lets the report public.
- **Report Resolved**
- **Agreed On Going Public**
- **Bounty Awarded**
- **Report Became Public**
