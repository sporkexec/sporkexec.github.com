---
layout: post
title: Fixing "cd //" in bash 4.1
---

**Update**: I have found [an interesting forum discussion](http://dbaspot.com/forums/shell/407921-how-come-also-root-bash.html) on the double slash behavior. Older \*nix systems used a // path and a /../ path prefix to mean a network filesystem. A hostname would be added, like //victim/etc/shadow. POSIX leaves the double slash to be handled in an implementation-specific fashion. After hearing this, the people on the forum start complaining about how bash is the only shell that does this and that bash is free to do it any way it wants and therefore sucks. **This just isn't true,** because bash doesn't own the filesystem. Bash doesn't understand the filesystem. Bash just makes system calls and the Linux VFS actually figures out what these slashes mean. Linux's specific implementation is to ignore it. If bash were to remove the extra leading slash, it would be doing the kernel's job of interpreting paths. This is why cool things like FUSE and NFS work: Every single little program doesn't try to understand what the filesystem is. It just takes the path, asks the kernel, and the kernel replies with a file descriptor that looks like a directory or file or pipe or socket or whatever it wants. The kernel has the power to do *anything* when asked for the contents of a path. It handles finding and distributing the files, and userland just uses it and pretends to like it.

How many times have you done this?

{% highlight bash %}
/home/jake$ cd /var/www/html/
/var/www/html$ # Have you ever been trying to work on something?
/var/www/html$ cd music
/var/www/html/music$ ls
album.py*   albumart/   artist.py~*  index.py~*
album.py~*  artist.py*  index.py*    track.py*
/var/www/html/music$ ls -a
./   .svn/      album.py~*  artist.py*   index.py*   track.py*
../  album.py*  albumart/   artist.py~*  index.py~*
/var/www/html/music$ cd album
-bash: cd: album: No such file or directory
/var/www/html/music$ cd albumart/
/var/www/html/music/albumart$ ls
10_12.jpg  15_34.jpg  1_25.jpg   25_61.jpg  27_76.jpg  34_84.jpg   42_97.jpg
11_13.jpg  16_35.jpg  1_26.jpg   26_62.jpg  28_77.jpg  34_85.jpg   42_98.jpg
11_14.jpg  16_36.jpg  20_48.jpg  27_63.jpg  29_78.jpg  35_86.jpg   42_99.jpg
11_15.jpg  16_37.jpg  20_49.jpg  27_64.jpg  2_27.jpg   35_87.jpg   43_101.jpg
11_16.jpg  17_38.jpg  20_50.jpg  27_65.jpg  2_28.jpg   36_88.jpg   43_102.jpg
11_19.jpg  17_39.jpg  20_51.jpg  27_66.jpg  2_4.jpg    36_89.jpg   4_6.jpg
11_20.jpg  18_40.jpg  21_52.jpg  27_67.jpg  2_42.jpg   36_90.jpg   5_7.jpg
11_21.jpg  18_41.jpg  21_53.jpg  27_68.jpg  2_43.jpg   36_91.jpg   6_8.jpg
12_17.jpg  19_46.jpg  21_54.jpg  27_69.jpg  2_44.jpg   37_92.jpg   7_9.jpg
12_18.jpg  19_47.jpg  22_55.jpg  27_70.jpg  2_45.jpg   38_93.jpg   8_10.jpg
13_29.jpg  1_1.jpg    22_56.jpg  27_71.jpg  30_79.jpg  38_94.jpg   9_11.jpg
13_30.jpg  1_2.jpg    23_57.jpg  27_72.jpg  31_80.jpg  39_95.jpg   blank.png
14_31.jpg  1_22.jpg   23_58.jpg  27_73.jpg  31_81.jpg  3_5.jpg
15_32.jpg  1_23.jpg   24_59.jpg  27_74.jpg  32_82.jpg  41_96.jpg
15_33.jpg  1_24.jpg   25_60.jpg  27_75.jpg  33_83.jpg  42_100.jpg
/var/www/html/music/albumart$ # Then completely screwed up?
/var/www/html/music/albumart$ cd //
//$ pwd
//
//$ # Erm, what? "//"?
//$ ls
bin/   dev/  home/  media/  opt/   root/  srv/  sys/  usr/
boot/  etc/  lib/   music/  proc/  sbin/  svn/  tmp/  var/
//$ # Sucks, doesn't it?
{% endhighlight %}

It happens to me more often than I can count. It's incredibly annoying and even dangerous if you're mucking about in sensitive places on your system. In most cases when this happens, you meant to type "cd .." to go up one folder. Instead, you're placed in some half-assed root directory.

I was pretty annoyed by this after a couple of times and wanted to fix it. First I tried something like "touch //" or "touch /\/" so that typing "cd //" would fail because it's a file. No dice, it thinks I'm trying to touch the root directory. So I tried an alias; I set up cd to alias to a script which detects the "//" and changes it to ".." and then executed the chdir(). This didn't work because the script is launched in a subshell and so it's cwd is independent from my shell's. I tried again: alias cd="cd $(mycd)" where mycd echo's the appropriate path. This won't work because afaik there's no way to pass the argument from the outer shell to the inner.

Needless to say, this greatly frustrated me. In desperation and anger I grabbed [The Source](http://ftp.gnu.org/gnu/bash/) and started poking around. After looking at things and a few dumb segfaults, I figured out a (hacky) workaround that's "good enough for me."

It's a patch to builtins/cd.def in the bash 4.1 tarball. It's only six lines including whitespace, is a dirty hack and probably won't be making it into the main tree anytime soon, but it solved a major headache for myself, so hopefully someone can benefit from it:

{% highlight diff %}
--- bash-4.1/builtins/cd.def	2009-01-04 11:32:22.000000000 -0800
+++ cd.def	2010-05-22 12:53:30.000000000 -0700
@@ -205,6 +205,12 @@
   lflag = (cdable_vars ? LCD_DOVARS : 0) |
	  ((interactive && cdspelling) ? LCD_DOSPELL : 0);
 
+  if (list != 0 && list->word->word[0] == '/' && list->word->word[1] == '/' && list->word->word[2] == '\0')
+    {
+      list->word->word[0] = '.';
+      list->word->word[1] = '.';
+    }
+
   if (list == 0)
	 {
	   /* `cd' without arguments is equivalent to `cd $HOME' */
{% endhighlight %}

I'm not sure why "//" is considered a valid path. All other variations on /+ take you to the root, with just one slash. "//" moves you to something called "//", however. Very odd how that one name is somehow different from the others. There could be a valid semantic reason for this behavior I'm unaware of that something depends on, so I wouldn't use this as my system-wide shell before looking into it, just a login shell.
