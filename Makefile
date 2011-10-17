DEVBUILD="file:///home/jake/dev/sporkexec.github.com/_site"
LIVEBUILD="//sporkexec.com/"

all: site
site: style jekyll

style:
	lessc -x style/desktop.less > style/desktop.css

jekyll:
	# I'm sure this isn't ideal, but fine for now.
	# This saves me from manually switching baseurl.
	sed -i "s!${LIVEBUILD}!${DEVBUILD}!g" _config.yml
	jekyll
	sed -i "s!${DEVBUILD}!${LIVEBUILD}!g" _config.yml

