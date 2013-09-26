DEVBUILD="http://192.168.1.76/"
LIVEBUILD="http://sporkexec.com/"

all: site
site:
	lessc -x resources/desktop.less > resources/desktop.css
	lessc -x resources/mobile.less > resources/mobile.css

	# I'm sure this isn't ideal, but fine for now.
	# This saves me from manually switching baseurl.
	sed -i "s!${LIVEBUILD}!${DEVBUILD}!g" _config.yml
	jekyll
	sed -i "s!${DEVBUILD}!${LIVEBUILD}!g" _config.yml

