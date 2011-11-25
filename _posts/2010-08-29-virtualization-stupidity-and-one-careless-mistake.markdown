---
layout: post
title: Virtualization Stupidity and One Careless Mistake
---

I'll be moving back from the massively virtualized setup soon. The most obvious issue is my lack of necessary hardware resources to make it viable. One major problem I had not foreseen, however, was configuration. Between setting up, locking down, and keeping everything up to date, 3 machines is a lot more work than just one. I'm used to a moderate level of system administration, but this just creates too much unnecessary work.

I'll be waiting for [PostgreSQL](http://www.postgresql.org/) 9 to come out. I'll either have to migrate when that happens or try living the "stable life" (bah!), so I'd rather only migrate once.

In other news, I've smacked into a dumb design flaw of MusicMonitor. I've been do focused on getting the daemon and monitoring issues right that I forgot about what goes on when it's not running. We currently fail to detect files that are deleted when the daemon is off. This is a major crack in my logic, one that goes back to RecursiveMonitor: even if the monitoring process is running perfectly, a few events, most notably deletion, cannot be easily detected. Short of maintaining a list of expected files within RecursiveMonitor and sending deletion events to the callback, this cannot be handled through the existing interfaces. If I do this, the system becomes more modular, but larger and clumsier. The alternative is to offload the job to the client module, which would have to use the GAMExists signals from RecursiveMonitor to determine the existing files. This would mean collecting a list of existing files, adding new ones, and removing reported deletions from the collected list. Once it was determined that this initial surge of GAMExists signals had stopped (how?), the client module would need to somehow use this list to delete invalid entries in whatever storage layer being used.

My preferred alternative at this points is for RecursiveMonitor to accept another callback that takes a list of existing files and uses it to remove any files no longer in existence from the storage layer. RecursiveMonitor can then give the directory an initial recursive scan and pass the contents onto this callback.

The trick then becomes how to most efficiently determine what entries to delete. Assuming a database storage layer, we have a few options. Passing the file list to a stored procedure: incurs the load of passing a potentially very large list to the database, but very fast otherwise; Retrieving a list from the database to filter: incurs the load of passing a potentially large list back to the script, and another potentially large deletion list back. I still need to think about other possibilities, but this is what I'm currently deliberating on.
