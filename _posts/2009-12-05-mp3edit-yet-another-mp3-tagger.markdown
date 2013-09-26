---
layout: post
title: mp3edit - Yet another MP3 tagger
---

*Update:* Nowadays (September 2013), I would suggest that anyone needing to tag audio files en masse use [beets](http://beets.radbox.org/), a wonderful command-line library manager which can auto-tag files using data from [MusicBrainz](http://musicbrainz.org/), fetch &amp; embed album art &amp; lyrics, organize files into user-defined hierarchies on disk, and much more.

For the past several weeks, I've been trying to come up with a solution to a little problem in my music library. When I add music to the library, the usual procedure is to rip the tracks with cdparanoia (a most excellent tool), encode them to MP3 with LAME, tag them with mp3info, stick them in their proper place in the folder hierarchy. Finally, I run a Python script which uses the Mutagen library to parse the music tree, read the tags, and file all the good stuff (tags, physical locations, etc) off into the database, where they magically appear when you navigate to the music section.

I thought it worked great. Well, I was wrong. I kept discovering entries with truncated titles, or missing fields, or sometimes they weren't even processed at all! I frantically stepped through my code time and time again, following every command, running debuggers and unit tests, tearing my hair out until I came to a conclusion: My code was fine.

As it turns out, the problem was due to the ID3 tagging format for MP3 files. On the one hand, I was using [mp3info](http://www.ibiblio.org/mp3info/) on the shell to tag everything. I was a little put off by how it loved to randomly corrupt the tag data with certain strings, but otherwise it seemed to work. On the other hand, I was using the [Mutagen module](http://code.google.com/p/mutagen/) for Python to programmatically grab the tags for storage. Well, (suprise,) apart from being full of odd bugs, mp3info was only capable of handling ID3v1.1 tags, while Mutagen used ID3v2.

This didn't mean much to me initially, but after ruling out my code, I learned that ID3v1 truncates attributes over 30 letters, which explains my truncation troubles and likely the weird corruption also. Worse was the fact that, due to how the MP3 format defines extensions, **multiple versions of ID3 can coexist on the same file!** So when I tagged files with mp3info, it wrote ID3v1 tags to the file, and if there were any residual ID3v2 tags on the file (this happens a lot if you get MP3's from others) my script would grab those instead of the ones I had written, which led to all sorts of wacky inconsistencies in the database.

I had a few possible choices:

- Just live with it: Broken database, broken tags, the whole works.
- Adjust my script to explicitly read ID3v1: Then I would still have truncated titles and random corruption due to mp3info.
- Find a better tagger: I looked fairly hard, but unless I missed something with my google-fu (freshmeat? pypi? GitHub?) there's not many good command-line taggers out there that can handle ID3v2.
- Roll my own: True to the spirit of, well, this entire website, just break down and have some dirty NIH fun.

So... yeah, I just wrote my own. One quick tip for tagging with Mutagen that was very unintuitive for me: If an MP3 has no ID3 tag in it, you'll get an exception when you try to open it with "ID3(filename)" or "EasyID3(filename)". I had expected that it would just automatically associate a new tag with it in this case (makes sense, right?), but no. Nor does saying:

{% highlight python %}
tags = EasyID3()
tags.add_tags() # or not, it doesn't make a difference
tags.save(file)
{% endhighlight %}

work. No, you have to tell it:

{% highlight python %}
tags = EasyID3()
tags['artist'] = artist
# more tags, etc.
tags.save(file)
{% endhighlight %}

Then it works, and works well. It's just a bit annoying to have to figure that out when *it's not specifically mentioned anywhere in the documentation.* Oh, it tells you about `add_tags()` to make an empty tag list, and `save([file])` to save to a file, and it tells you about the `mutagen.id3.ID3NoHeaderError` exception thrown if the file has no tag, but it doesn't tell you that saving an empty tag list to a file won't do anything. And I was hoping it might get rid of the error and just let me edit the tags. No.

Anyways, back to the tool... No, it doesn't do comments (yet). No, it doesn't do genres either (yet). It does, however, set artist, album, title, tracknumber, and year tags an interface similar to my deceased mp3info. Shell options are 100% compatible with mp3info for everything I've done so far. It won't truncate names to 30 characters. It won't corrupt your tunes as far as I can tell. It does Unicode so far as your terminal, readline, Mutagen, and ID3v2 support. It's cross-platform as far as Mutagen and Python are (GNU readline won't do Windows AFAIK, but the app should still work). It has a handy `--sequential` switch that writes track numbers in the order the files are given, so you can say `$ mp3edit.py -s track*.mp3` for i.e. `['track01.mp3', 'track02.mp3']` or `['track_a.mp3', 'track_b.mp3']` and save yourself the trouble of typing in every track number.

This is a rather simple program. The aim is eventually to have full feature parity (plus a little) and command-line compatibility with mp3info, but with ID3v2 tags and in Python. [Check it out on GitHub.](https://github.com/sporkexec/dotfiles/blob/master/bin/mp3edit)
