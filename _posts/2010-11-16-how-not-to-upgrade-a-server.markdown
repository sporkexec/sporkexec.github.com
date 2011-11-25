---
layout: post
title: How not to upgrade a server
---

It took quite a while for PostgreSQL 9 to be packaged for Arch, so I forgot about it for awhile. I noticed there was a 9.0 package available today. Since I've been more involved with 21 units of class and 40 hours of work than anything else, I neglected to upgrade my system for several months.

This all came back to bite me today. I wasn't quite dumb enough to blindly upgrade Postgres, just almost. I shut down the database and copied the data directory, expecting the pg_upgrade script to do the conversion. I chose the full upgrade with "pacman -Syu" (**bad** idea) and blindly accepted the list of packages, since I had already prepared the database. It turns out pg_upgrade wants the binaries of both versions as well as the data, so... it didn't work. Panic mode. I downgrade to 8.4, whip out a SQL dump, and upgrade again. Then I repopulated the new database with issue. Standard dump and restore, no problem.

So I check permissions, start up Apache, and get... errors. Lots of them, mostly telling me my code has syntax errors. I poke around for a good long while, then it hits me: *Arch made Python 3 the default interpreter last month.* My code is all written for 2.x. Oh. Looking for the quick fix, I patch up the shebang lines to /usr/bin/python2. Oh look. *New* errors! Something about the "pg" module. When I started this, I had used the pygresql module for database connectivity. It's really not a great module, I didn't know about DB-API at the time. Either when upgrading the database or Python (probably Python), the module was lost. It was an AUR package, so I had to go grab the source again. It failed to build, complaining about my Python version. I poked around, and the build script was, of course, calling whatever Python version happened to be the system default. I messed with the source and PKGBUILD but couldn't get makepkg to use Python 2. I finally broke down and manually installed it. This worked fine, and so it's up again.

Besides the tricky issue with multiple versions, I shouldn't have upgraded that many things at once. I'm pretty sick of using pygresql, though, so this is all the more encouragement to replace it with something DB-API compliant. Free time is starting to trickle back into life, so I'll probably do it soon.

EDIT: I've since [fixed the PKGBUILD on the AUR,](https://aur.archlinux.org/packages.php?ID=24094) although the pygresql FTP server seems to be down. It's still on pypi, though.
