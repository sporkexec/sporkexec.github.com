---
layout: post
title: '"Standard" Data Formats'
---

The last version of this site existed from around late 2008 to late 2010. This was the age when I still used PHP for anything more than masochism or money. I've been meaning to put together a site ever since, but only just now cared enough to actually do it. Tonight I grabbed the database dump from the old server and decided to try and import my old content, which was neither very large nor very good, but parts of it were neat. This is where the pain begins.

There're two lessons I've learned from this the hard way:
- Don't unnecessarily transform your data if you can help it; input is most accessible and flexible when left unaltered.
- If you must do this, make sure you're using a standard data format (JSON, XML, YAML, etc). A language-specific serialization or an implementation that slightly deviates from spec will lead to tears.

I can't get at the data by any normal means. My design choices were questionable, but it wasn't anything too horrible: I had mod\_php running in Apache connecting to a PostgreSQL database where the posts were stored. In my laziness, I never sanitized the data in an acceptable way, I just ran base64\_encode over the text and slammed it in the database. That's an effective way to prevent injections, sure, but is horrible in just about every other way, from storage size to indexing to overall complexity. There's a much better, even simpler method -- parameterization -- but then I was 17 at the time, living fast and dying hard. This was the first problem, there was just no reason to have done this in the first place.

So I import the database dump, extract the data from the table, and all is going well. There's a little console wizardry involving `cut` to get the right fields, then just pipe it through `base64 -d`.

`base64: invalid input`

Hmm, that's strange. I try it with `-i (--ignore-garbage)` and get the same result. Copypasting to some web service yields more gibberish, so I write a little bit of Python and discover that its base64 library can't grok it either. So now I'm in trouble, but surely if PHP wrote this data, it can read it, right? *Right?* A couple minutes later, I'm trying to decode it with the latest PHP, and it runs, but gives me the same gibberish from earlier. There's a couple strings I can make out, but most of it is garbage, typical of the character boundaries in base64 getting thrown off. Versions 5.3 and 5.2 give me the same behavior. I was confident that PostgreSQL wasn't breaking anything because I know the backup was good, Postgres 9.x on a default install is pretty much the same as what the dump came from, and I trust it far more than PHP. I ended up having to go back to that exact PHP version to recover the data. At the very least, if you have to do some bad encoding scheme (just don't), make sure you're not using some special dialect of the standard.
