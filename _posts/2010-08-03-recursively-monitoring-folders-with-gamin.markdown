---
layout: post
title: Recursively monitoring folders with Gamin
---

The world of file monitoring is an ugly one for Unix. Your options are polling or using one of the methods supplied ultimately by the kernel. Linux had dnotify and now inotify, and \*BSD has kqueue. FAM (File Alteration Monitor) from SGI tried to provide an acceptable alternative but is now thoroughly obsolete. Gamin is a per-user daemon utility with a FAM-style interface that attempts to hook into the various kernel-supplied monitoring interfaces. Gamin is not fantastic but actually rather dated, however from what I can see it seems to be the best we have for now. The most glaring shortcoming of these tools is a way to monitor folders recursively.

I had heard a little bit about FAM and Gamin, and decided to build a daemon to monitor my music collection in realtime to better maintain the database. I found some decent Gamin bindings for Python, then discovered the recursion problem. So I rolled my own solution.

It's called RecursiveMonitor. It's a very simple Python module. You just pass it the topmost folder you want to monitor and a callback function accepting the absolute name of a modified file and the event code [as defined by Gamin.](http://www.astro.rug.nl/efidad/gamin.html) There are several options to filter by symlinks or to not bother reporting actual folders.

If you'd like to see this done in another language, take a look. Python-gamin is an almost direct wrapper of the Gamin interface, so there's not much here that's Python-specific except for one small corner of metaprogramming that uses a partial function.

I'm still working on the daemon, but this module fits my needs pretty well. I'm planning a little daemon that can monitor a collection of music in arbitrary formats and keep the metadata synced in an arbitrary database. This could be used for all those fancy music players that hold a library database with SQLite or for fancy web applications like mine with MySQL or PostgreSQL.
