---
layout: post
title: '"Standard" Data Formats'
---

On the last version of this site existed from around late 2008 to late 2010. This was the age when I still used PHP for anything more than masochism or money. I've been meaning to put together a site ever since, but only just now cared enough to actually do it. Tonight I grabbed the database dump from the old server and decided to try and import my old content, which was neither very large nor very good, but parts of it were neat. This is where the pain begins.

There're two lessons I've learned from this the hard way:
- Don't do funny shit with your data if you can't help it.
- If you must do funny shit, make sure you're using a standard data format with a language-neutral implementation.

I can't get at the data by any normal means. My design choices were questionable, but it wasn't anything too horrible: I had mod\_php running in Apache connecting to a PostgreSQL database where the posts were stored. In my laziness, I never sanitized the data in an acceptable way, I just ran base64\_encode over the text and slammed it in the database. That's an effective way to prevent injections, sure, but is horrible in just about every other way, from storage size to indexing to overall complexity. There's a much better, even simpler method -- parameterization -- but then I was 17 at the time, living fast and dying hard. This was the first problem, there was just no reason to have done this in the first place.

So I import the database dump, extract the data from the table, and all is going well. There's a little console wizardry to get the right fields, then just pipe it through `base64 -d`.

`base64: invalid input`

Hmm. I try it with `-i (--ignore-garbage)`. The same result. Copypasta to some web service and I get gibberish, so I write a little bit of Python and discover that its base64 library doesn't grok it either. So now I'm in trouble, but surely if PHP wrote this data, it can read it, right? *Right?* A couple minutes later, it runs, but gives me the same gibberish from earlier. There's a couple strings I can make out, but most of it is garbage, typical of the character boundaries in base64 getting thrown off. Versions 5.3 and 5.2 give me the same behavior, and I don't really know which version wrote this data, but I believe it was something in the 5.x line, so it shouldn't be too far off. I'm also confident that PostgreSQL isn't breaking anything because I know the data's good, Postgres 9.x on a default install is pretty much what the dump came from, and I trust it far more than PHP. At the very least, if you have to do some bad encoding scheme (just don't), make sure you're not using some special dialect of the standard.

I'll probably get the data out eventually, but this has turned a two-minute job into an hours-long headache.
