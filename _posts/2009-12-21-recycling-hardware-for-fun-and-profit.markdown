---
layout: post
title: Recycling hardware for fun and profit
---

I have a long history of salvaging old crap and hacking it into shape. I could act dignified and call it recycling, but it's really just that I'm too cheap to buy things and enjoy the challenge. It's all a great big dirty hack, but I keep reminding myself where Google has gotten itself with [strange and unethical setups.](http://nomano.shiwaza.com/tnoma/blog/archives/002379.html) My first server was 400MHz and 128MB RAM, bought for one dollar at a yard sale. It's the box that forces you to be very comfortable with a shell because even a lightweight setup with X would swallow most of your resources. The next (current) server is 600MHz with twice the RAM. It was scavenged from a computer recycling program during a late-night special op mission. I maintain that it has more use here than being torn apart for raw material in China. Still pretty bad though, and I still don't run X.

A couple years back, (also at a yard sale,) I obtained a [Linksys WPS11 Wireless Print Server.](http://www.linksysbycisco.com/US/en/support/WPS11/) Apparently, this thing is supposed to connect to your wireless network and turn an old-school parallel port printer into a network-shared printer. Upon an initial inspection I found it uninteresting and tossed it into a corner to mess with someday when I was bored.

Last week, that day came. There wasn't really much to see on the outside; I powered it up, hooked up an ethernet patch cable, and looked at all the uselessness. After failing to find anything exciting, I proceeded to take it apart. There's a couple screws under two of the rubber feet. I had actually removed one of the feet to check for screws and found nothing. Several minutes later, the unit quite battered and marred from my prying, I realized that there **were** screws under the **other** feet!

I open it up and find a PCB and... a PCMCIA card?!? Yes, this crappy little box had a Wireless B PCMCIA card bolted onto it, better yet, with *a removable antenna!* With that, I can retrofit it with some fucking ridiculous antennas that can pick up signals miles away (given clear skies). However, all I have is a card that says, "11Mbps Wireless LAN Module," "FCC ID:O6M-WM302," and "P/N: 9514-3302ISC5." Googling the part number gives me [little,](http://forums.slimdevices.com/showthread.php?p=58467) and the name just turns out a bunch of crap. I try the FCC ID, and it surprisingly turns out all kinds of information.

It is apparently a BroMax WM302 card, with a Prism 3 chipset. This means I'll be able to (1) find the proper driver and (2) get it into monitor mode with a patched driver so it can do some basic wireless cracking, although injection will not be possible. The card takes the Orinoco kernel module.

There are plenty of pleasant surprises sitting around in old hardware. Everybody else can take their old machines to the dump or send them in to overseas "recycling" organizations. I'll be the one buying the cheap boxes, I'll be the one pulling parts from the dead boxes before you throw them away, I'll be the one hacking.
