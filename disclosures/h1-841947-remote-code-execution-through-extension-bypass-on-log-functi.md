---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - vuln/command-injection
  - vuln/code-injection
  - impact/rce
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2020-07-03
submitted: 2020-04-06T22:23:13.722Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/concretecms|Concrete CMS]]"
reporter: "mayllart"
source: "https://hackerone.com/reports/841947"
title: "Remote Code Execution through Extension Bypass on Log Functionality"
---
# Remote Code Execution through Extension Bypass on Log Functionality

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** Concrete CMS | **Disclosed:** 2020-07-03

- Report: [https://hackerone.com/reports/841947](https://hackerone.com/reports/841947)
- CWE: Code Injection
- Submitted: 2020-04-06T22:23:13.722Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Summary:
=====================

The Application concrete5 CMS available on github is vulnerable to remote code execution through the functionality of setting the log file in "Loggin Settings". It is possible to bypass the portion of code responsible for the verification of the extension of the log file (.log).

Description:
=====================

The code in the {path_of_installation}/concrete5/concrete/controllers/single_page/dashboard/system/environment/logging.php has a vulnerable function (update_loggin()). This function has a condition that verifies if the parameter "handler" in the HTTP request is equal to "file" and, if the parameter "logging_mode" has any value. In case one of these conditions is not met the application will not proceed to verify if the extension of the log file ends with ".log" and will go straight to the next if, which verifies if there is any error (in case, there are not) and set the "concrete.log.configuration.simple.file.file" variable to the value of "logFile" parameter in the HTTP request. By doing that it is possible to set the log file to a .php file in the system. An attacker may be able to inject PHP code in the log File by injecting it on parameters in the application. Then, by requesting the file in the browser the code will get executed.

Vulnerable code:

```
public function update_logging()
    {
        $config = $this->app->make('config');
        if (!$this->token->validate('update_logging')) {
            $this->error->add($this->token->getErrorMessage());
        }
        if ($this->request->request->get('handler') == 'file' && $this->request->request->get('logging_mode')) { // this if condition that can be bypassed
            $logFile = $this->request->request->get('logFile');
            $filesystem = new Filesystem();
            $directory = dirname($logFile);
            if ($filesystem->isFile($logFile) && !$filesystem->isWritable($logFile)) {
                $this->error->add(t('Log file exists but is not writable by the web server.'));
            }
            if (!$filesystem->isFile($logFile) && (!$filesystem->isDirectory($directory) || !$filesystem->isWritable($directory))) {
                $this->error->add(t('Log file does not exist on the server. The directory of the file provided must exist and be writable on the web server.'));
            }
            $filename = basename($logFile);
            if (!$filename || substr($filename, -4) != '.log') {
                $this->error->add(t('The filename provided must be a valid filename and end with .log'));
            }
        }
        if (!$this->error->has()) {// it is possible to jump straight to this condition and set the log file to a .php file.
            $intLogErrorsPost = $this->post('ENABLE_LOG_ERRORS') == 1 ? 1 : 0;
            $intLogEmailsPost = $this->post('ENABLE_LOG_EMAILS') == 1 ? 1 : 0;
            $intLogApiPost = $this->post('ENABLE_LOG_API') == 1 ? 1 : 0;

            $config->save('concrete.log.errors', $intLogErrorsPost);
            $config->save('concrete.log.emails', $intLogEmailsPost);
            $config->save('concrete.log.api', $intLogApiPost);

            $mode = $this->request->request->get('logging_mode');
            if ($mode != 'advanced') {
                $mode = 'simple';
                $config->save('concrete.log.configuration.simple.core_logging_level',
                    $this->request->request->get('logging_level')
                );
                $config->save('concrete.log.configuration.simple.handler',
                    $this->request->request->get('handler')
                );
                $config->save('concrete.log.configuration.simple.file.file',
                    $this->request->request->get('logFile') //set the PHP 
                );
            }
            $config->save('concrete.log.enable_dashboard_report',
                $this->request->request->get('enable_dashboard_report') ? true : false);
            $config->save('concrete.log.configuration.mode', $mode);

            $this->redirect('/dashboard/system/environment/logging', 'logging_saved');
        }
```

Steps To Reproduce:
=====================

1) Login to the administrative panel of the application and navigate to :http://{concrete5_website}/index.php/dashboard/system/environment/logging. Set the File variable to: {INSTALLATION_PATH_OF_CONCRETE5}/pwned.php, send the request and intercept it.

{F776879}

2) Change the handler parameter in the HTTP request to any value. By doing that we will get straight to the next "if condition" mentioned before. However, by doing that the handler will be set to its default value (Database) in the backend.

{F776880}

{F776881}

3) Now we need to make the handler get the "file" value. We change the "Handler" in the panel to the "File" option and send the request again. Then, the request is intercepted and the value in the parameter "logging_mode" of the HTTP request must be completely erased. 

{F776882}

By doing that we will go straight to the next if, since the condition: $this->request->request->get('logging_mode'))` is not met. Right after entering the next if condition, the value of "logging_mode" will get restored to the value of "simple":

```
if ($mode != 'advanced') {
                $mode = 'simple';
```

4) To get the code execution to work we now need to inject the malicious PHP code in the log file. This can be achieve by trying to login with a user called: <?php system('id'); ?>.

{F776883}

We can see the file is now created in the server with the malicious content.

{F776884}

{F776885}

5) By accessing the file in the browser it is possible to verify that the code is successfully executed.

{F776886}

Resubmitted the report since it was missing the "crayons".

Thanks!!

## Impact

OS command execution in the webserver under the permissions of the OS user executing the server application, being able to completely modify the application code or compromise the server (reading, editing, adding or removing files). In case of selecting a .php file that already exists in the server it will have log text appended to it and will interrupt the application operation (example: select the index.php as the log file) by resulting in a malformed php file.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **2020-04-09** @mayllart: Thank you very much @korvin !!

I'll be waiting for further information!

Regards,

Mayllart
- **Report Severity Updated**
- **2020-04-16** @mayllart: Hello everyone!

Any news regarding this vulnerability?

Regards,

Thiago Mayllart
- **2020-05-06** @korvin: Hi @mayllart,
I've opened a pull request with the following commit:
https://github.com/concrete5/concrete5/pull/8623/commits/bf5402725f3001e0c37a0f471770f44f386bf57c

Do you mind testing this and making sure that it adequately resolves the issue?

Thanks!
Korvin
- **2020-05-09** @mayllart: Hello @korvin !

Thank you for your reply! And sure,  I’ll be testing it and will get back to you  pretty soon!

Thanks!!
- **2020-05-11** @mayllart: Hello @korvin,

I 've just tested the application with the pull request and issue is fixed! However, the line 86 can be bypassed:           ` if (pathinfo($logFile, PATHINFO_EXTENSION) !== 'log') { `

I was testing the application with php-7.3 and the function pathinfo is vulnerable to nullbyte injection. It means that this function is failing to validate log files containing nullbytes: /{INSTALLATION_PATH}/concrete5/testing.php%00.log. This function interprets the nullbyte and removes everything after it, allowing it to be bypassed.

Thankfully, the function "file_exists" (line 91) ends up verifying the $logFile and then, throws an error. The function "file_exists" was vulnerable in the past due to nullbyte injection, but it doesn't seem to exploitable anymore (https://bugs.php.net/bug.php?id=39863)

Thank you very much!!
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
