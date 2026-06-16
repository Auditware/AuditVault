https://obsidian.md/help/plugins/search

## graph filter query examples

```sql
-- show all checks related to sector
tag:#sector/zk AND path:classifications/bug/check

-- hacks or findings with no check tags
(path:hacks OR path:findings) -tag:#check

-- check tags and corelations
check

-- all the checks we know under a certain sector
tag:#sector/privacy and tag:#check
```

obsidian cli example:
```bash
obsidian search query="(path:hacks OR path:findings) -tag:#check" format=json

obsidian search query="tag:#check"
```