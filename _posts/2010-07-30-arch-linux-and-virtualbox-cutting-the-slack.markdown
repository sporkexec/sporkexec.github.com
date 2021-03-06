---
layout: post
title: "Arch Linux and VirtualBox: Cutting the Slack"
---

I've moved servers once again! It's really more fun moving around and learning to configure everything under the sun than to have a website, so that's what I do.

The first major change was moving from Slackware to Arch. Arch has been growing on me lately because it just gets it right. I liked Slackware because it was lightweight by default and didn't try to get in my way. But it was *always* lightweight; apart from KDE4 on the install CD, there wasn't much that could easily be done to make turn Slack into a fatty. So I had trouble running nasty apps like JACKD, or enormous things like MPlayer. Which brings us to my other main gripe: software selection. I understand having a small core. Hell, I understand not wanting to burden developers with a huge "extra" repository. What I don't understand, however, is why a distribution with such limited resources would make it so difficult to create a third-party package. The main supplier of 3rd-party software is Slackbuilds.org. [There is no standard structure for a SlackBuild script.](http://www.slackwiki.org/Writing_A_SlackBuild_Script) You just go about your way, extracting the source, patching, compiling, maybe after checking dependencies if you're a really nice guy. It's a little hellish when you're missing some random library: You don't care about making a nice package or contributing to the community, **you'd really just like to make the thing work.** And so much of the time, I just gave up and jumped through the old "./configure && make && sudo make install" hoops. It's just not like this in Arch. [Packaging is a breeze in Arch.](http://wiki.archlinux.org/index.php/Creating_Packages) They realized they couldn't slave through packaging every piece of software ever written, and decided not to put their users through it either. PKGBUILDs do what SlackBuilds wouldn't, handling licenses, authors, dependencies, source retrieval, unpacking, patching, and uncountable other little tasks you won't notice until you don't have to do them anymore. But enough distro talk.

The other significant change here is that most everything is now [virtualized.](http://virtualbox.org) I'm currently running Apache and PostgreSQL in two instances of Arch; The outer instance does nothing but lay out the first firewall. In the works are moving static content to another machine running lighttpd and adding a logging machine that aggregates relevant information from all machines and write them to some unerasable medium: I'm currently considering multisession CD-Rs or an isolated physical machine.

Other possibilities with a virtual platform are incredibly simple backups and migrations. I've been hacking at a friendlier console frontend to VirtualBox while setting this up, which will greatly simplify things if I add to it.

This took a bit of a long time to fully set up, mostly because I insisted on doing everything the hardest way possible (for science!). Let me explain: I'm not running X, so I can't use the graphical frontend. I'm using the open source edition because I loosely insist on it, so I can't use VRDP. There's supposedly VNC support for the latest OSE releases, but it's apparently not enabled in Arch and I don't feel like recompiling. I want a ridiculous level of service isolation, so I'm not running SSHD on the guests. Finally, most installation CDs have no way to remotely install from a serial console anymore, because we're past the 80's and we have "better technology" than that. So I had to install a base system and set up a serial console in the graphical interface, then move the disk image over to the server. It was a little complicated to get everything right. Once I would forget to spawn a getty on the line, then I would forget to install networking utilities and left myself unable to fetch packages, then I would forget to add ttyS0 to /etc/securetty and I wouldn't be able to get a root shell. It was all rather complicated and so took several tries to do everything right. Now I have a base Arch image that weighs in at 573MB and does everything right. I still need to work on the size, but it's OK to start with.

In case you're curious, here's how to get the serial forwarding working:

{% highlight bash %}
VBoxManage modifyvm $VMNAME --uart1 0x3f8 4 --uartmode1 server $SOCKETPATH
VBoxManage startvm $VMNAME --type headless
# But this is only a socket, we need something we can actually connect to.
socat UNIX-CONNECT:$SOCKETPATH PTY,link=$PTYPATH
# Now we connect to it, I prefer screen but I think minicom or telnet work too.
screen $PTYPATH # Full path required.
{% endhighlight %}

You also need to spawn a getty on the console at boot, so edit /etc/inittab. There should be a bunch of lines including tty1, tty2, tty3, for each virtual console you have set up. Just take the last one, typically tty6, and change it to ttyS0. You won't be using all those ttys anyways. If you don't have a user set up with su or sudo rights, you'll need to add ttyS0 to /etc/securetty to allow root to directly log in. If you like you can add more serial lines with similar steps. Most people will probably just want to use OpenSSHD, though, as most of the dependencies are already met in a base system. This was all one huge experiment for me.
