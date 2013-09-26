---
layout: post
title: InjectTTY -- An Experiment
---

For so long, I've wondered how I can inject arbitrary commands into another terminal. Writing to a user's stdout is easy, just write to the tty device. But writing to a process' stdin has been another story. I found an interesting program called ttysnoop, but it must be run before the login script, that is, after the pty is spawned but before the user connects to it. It basically clones the file descriptors for that tty and lets root have at them. The problems with this: it requires to be run at startup and requires a visible configuration (/etc/snooptab) to be sitting around. Most other solutions involve a custom kernel.

Well, while randomly wandering the manpages, I've found another way to at least write to stdin. I still don't know how to read from stdout, but I'm sure it's there somewhere. This little program is just a test, really, it took about 30 minutes once I understood what was happening. It uses tty_ioctl. The tty_ioctl manpage says that ioctl isn't portable and I should use termios, but I couldn't seem to find the documentation for it offline and had no web. So it uses ioctl but I'll look at other options.

As I've said before, this is just a demo. You can either invoke it with a terminal device and whatever command you like, eg. `injectty /dev/pts/1 echo You didn\'t type me\!` or just a device node and it'll begin in a buggy almost-interactive mode. It doesn't read from the terminal's stdout yet, meaning shell prompts and command output isn't shown! I need to find out that part, and improve the interactive mode with either readline support or grabbing from the injection buffer in realtime (not waiting for newline to process input). If I can do this, it should be just like sitting on the terminal, although I'll still have to figure out how to trap and send ^C et al.

It's far from being very practical, but this partially solves a question I've been asking myself and others for several months, so it's pretty awesome to me.

{% highlight c %}
#include <stdio.h>
#include <fcntl.h>
#include <sys/ioctl.h>

int main(int argc, char** argv) {
	if(argc <= 1) {
		printf("Usage: injectty TTYDEV [COMMANDS]\n\n");
		return 0;
	}

	int fd = open(argv[1], O_RDONLY);

	if(argc == 2) {
		char in;
		while(1) {
			scanf("%c", &in);
			ioctl(fd, TIOCSTI, &in);
		}
	} else {
		int i;
		char* c;
		char ds = ' ';
		for(i=2; i<argc; i++) {
			if(i != 2)
				ioctl(fd, TIOCSTI, &ds);
			for(c=argv[i]; *c != '\0'; c++)
				ioctl(fd, TIOCSTI, c);
		}
		ds = '\n';
		ioctl(fd, TIOCSTI, &ds);
	}

	close(fd);
	return 0;
}
{% endhighlight %}
