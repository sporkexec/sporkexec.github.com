---
layout: post
title: A Preview of MusicMonitor
---

Well, for the past several weeks I've been writing a service to monitor a collection of music and maintain its metadata. I've finally reached a point where it's not what I'd call "okay." It has a ways to go before it's "good," but the most important bits are in place. Consider this approximately of early beta quality.

Let's run through some of the features. We've got:
- Support for MySQL, PostgreSQL, and SQLite storage. (Maybe more to come.)
- Support for ID3v2.4 tags in MP3 files. (Absolutely more to come.)
- Realtime monitoring. There is *no polling* of the filesystem whatsoever.
- Really flexible IO layers. Adding new tag readers and databases are very straightforward.
- Sane dependency handling. It won't try to load every module it supports and proceed to scream when you're missing one; Only the libraries needed for your configuration will be loaded.
- Simple configuration. One generously documented config file shows you everything that can be done.
- Compatible on Python 2.4+. I would love to have 3.x support, however the mutagen tagging library (amongst others) is solidly bound to the 2.x tree.
- Daemonization achieved through [python-daemon,](http://pypi.python.org/pypi/python-daemon/) with a less thorough fallback method as well.
- Configurable logging mechanism.

Let's run through some of the missing features:
- Arbitrary limit of one storage output.
- Only the simple (%s and ?) database parameterization methods in DB-API v2.0 are supported.
- Simplistic table schema. I want to get things working on as many platforms as possible right now, not use all the elegance that various databases have to offer.

